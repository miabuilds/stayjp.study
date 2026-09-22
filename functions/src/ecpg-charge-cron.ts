// 每日排程:綁卡用戶到期自動扣款(CreatePaymentWithCardID,幕後授權,用戶不用再操作)。
//
// 這支取代定期定額的角色:因為綠界定期定額要求首期立刻扣款(PeriodAmount === TotalAmount),
// 做不出免費試用,所以改成「自己記到期日、自己扣」。代價就是這支排程壞掉 = 收不到錢,
// 所以每次結果都寫 ecpg_charges,失敗會重試 3 天,連續失敗才降級。
//
// ⚠️ 需要複合索引:subscription.source ASC + subscription.next_charge_at ASC
//    (firebase deploy 會提示,或用 firestore.indexes.json)

import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import { PLANS, PlanKey, ecpgConfig } from "./utils/constants";
import { ECPG_SECRETS } from "./utils/ecpg-secrets";
import { ecpgPost, ecpgHost, ecpgDateTW } from "./utils/ecpg";
import { ecpgReturnUrl } from "./utils/ecpg-shared";

if (admin.apps.length === 0) admin.initializeApp();

const RETRY_DAYS = 3;          // 扣款失敗每天重試,連續 3 天都失敗才降級
const DAY = 86400_000;

export const ecpgChargeCron = onSchedule(
  {
    schedule: "30 3 * * *",        // 每天 03:30 台北(離峰,避開綠界尖峰)
    timeZone: "Asia/Taipei",
    secrets: ECPG_SECRETS, region: "asia-east1",
    timeoutSeconds: 540, memory: "256MiB",
  },
  async () => {
    const db = admin.firestore();
    const now = Date.now();
    const env = ecpgConfig();

    const snap = await db.collection("users")
      .where("subscription.source", "==", "web_ecpg")
      .where("subscription.next_charge_at", "<=", now)
      .limit(200)
      .get();

    let charged = 0, failed = 0, skipped = 0;

    for (const doc of snap.docs) {
      const u = doc.data();
      const sub = u.subscription as {
        status?: string; plan?: PlanKey; next_charge_at?: number; fail_count?: number;
      };
      const bind = u.ecpg as { bind_card_id?: string } | undefined;

      // 已取消 / 已過期 / 沒綁卡 → 不扣
      if (!bind?.bind_card_id || !sub?.plan || !PLANS[sub.plan] ||
          !["trialing", "active"].includes(String(sub.status))) { skipped++; continue; }

      const plan = sub.plan;
      const amount = PLANS[plan].price_twd;
      const periodDays = plan === "yearly" || plan === "yearly_early_bird" ? 365 : 30;
      const tradeNo = "SR" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();

      const r = await ecpgPost<{ OrderInfo?: { TradeNo?: string; RtnCode?: number } }>(
        ecpgHost(env) + "/Merchant/CreatePaymentWithCardID",
        {
          PlatformID: "", BindCardID: bind.bind_card_id,
          OrderInfo: {
            MerchantTradeDate: ecpgDateTW(), MerchantTradeNo: tradeNo, TotalAmount: amount,
            ReturnURL: ecpgReturnUrl(), TradeDesc: "StayJP subscription", ItemName: "StayJP Premium",
          },
          ConsumerInfo: {
            MerchantMemberID: doc.id.slice(0, 60), Email: String(u.email || ""),
            Phone: "", Name: String(u.display_name || "StayJP"), CountryCode: "158", Address: "",
          },
          CustomField: doc.id,
        },
        env,
      );

      await db.doc("ecpg_charges/" + tradeNo).set({
        uid: doc.id, plan, amount_twd: amount, ok: r.ok,
        rtn_code: r.rtnCode ?? null, rtn_msg: r.rtnMsg || r.error || null,
        trade_no: r.data?.OrderInfo?.TradeNo || null,
        at: now,
      });

      if (r.ok) {
        charged++;
        await doc.ref.set({
          subscription: {
            ...sub, status: "active", fail_count: 0,
            expiresAt: Math.max(now, sub.next_charge_at || now) + periodDays * DAY,
            next_charge_at: Math.max(now, sub.next_charge_at || now) + periodDays * DAY,
            last_charge_at: now, amount_twd: amount,
          },
        }, { merge: true });
      } else {
        failed++;
        const fails = Number(sub.fail_count || 0) + 1;
        const giveUp = fails >= RETRY_DAYS;
        await doc.ref.set({
          subscription: {
            ...sub,
            status: giveUp ? "expired" : sub.status,
            fail_count: fails,
            next_charge_at: giveUp ? null : now + DAY,     // 明天再試一次
            last_fail_msg: r.rtnMsg || r.error || null,
          },
        }, { merge: true });
        console.error(`綁卡扣款失敗 uid=${doc.id} 第 ${fails} 次:`, r.rtnMsg || r.error);
      }
    }

    console.log(`ecpgChargeCron 完成:成功 ${charged} / 失敗 ${failed} / 略過 ${skipped}(掃描 ${snap.size})`);
  },
);
