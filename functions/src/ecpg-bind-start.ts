// HTTP function:官網「綁卡開始 7 天免費試用」第一步 — 取得綁卡 Token。
//
// 為什麼要綁卡:
//   舊的官網試用(start-trial.ts)不綁卡、只有 3 天,而且只寫 trial_started_at、
//   沒設 subscription.status → 試用中的人 AI 額度還是免費仔等級,體感比 App 差一截。
//   綁卡後可以給到跟 App 一樣的 7 天 + trialing 全額度,到期自動扣款。
//
// 為什麼不用定期定額:
//   綠界定期定額要求 PeriodAmount === TotalAmount 且「當下立刻扣第一期」→ 做不出免費試用。
//   站內付 2.0 綁卡 + 到期幕後扣款(CreatePaymentWithCardID)是唯一能做免費試用的路。
//
// ⚠️ 綁卡一定會帶一筆授權金額(沙盒實測 1 元被擋、2 元起才過),所以這裡收 ECPG_BIND_VERIFY_TWD
//    做卡片驗證,綁成功後由 ecpg-bind-result 立刻放棄請款,錢不會真的扣走。
//
// 流程:驗 idToken → 檢查資格(非付費中、試用沒用過)→ 建 ecpg_binds 預單
//       → GetTokenbyBindingCard → 回 Token 給前端,前端用綠界 JS SDK 收卡號。

import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import {
  PLANS, PlanKey, ECPG_BIND_VERIFY_TWD, ecpgConfig, ecpayConfig,
} from "./utils/constants";
import { ECPG_SECRETS } from "./utils/ecpg-secrets";
import { ecpgPost, ecpgHost, ecpgDateTW } from "./utils/ecpg";
import { normalizeEmail, trialEmailKey, ecpgReturnUrl, ecpgResultUrl } from "./utils/ecpg-shared";

if (admin.apps.length === 0) admin.initializeApp();

export const ecpgBindStart = functions.onRequest(
  {
    secrets: ECPG_SECRETS, cors: true, region: "asia-east1", invoker: "public",
    maxInstances: 10, timeoutSeconds: 30, memory: "256MiB", concurrency: 40,
  },
  async (req, res) => {
    try {
      if (req.method !== "POST") { res.status(405).json({ error: "method_not_allowed" }); return; }

      const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      if (!idToken) { res.status(401).json({ error: "missing_auth" }); return; }
      const decoded = await admin.auth().verifyIdToken(idToken);
      const uid = decoded.uid;
      const email = decoded.email || "";

      const plan = String(req.body?.plan || "") as PlanKey;
      // 買斷沒有「到期續扣」可言,綁卡試用只給訂閱制方案
      if (!PLANS[plan] || plan === "lifetime") { res.status(400).json({ error: "invalid_plan", plan }); return; }

      const db = admin.firestore();
      const userSnap = await db.doc("users/" + uid).get();
      const u = userSnap.data() || {};

      // 已經是付費中 → 不需要試用,也不該再綁一張卡
      const sub = u.subscription as { status?: string; expiresAt?: number } | undefined;
      if (sub && ["active", "trialing", "cancelled"].includes(String(sub.status)) && (sub.expiresAt || 0) > Date.now()) {
        res.status(403).json({ error: "already_premium" }); return;
      }

      // 試用資格:跟 start-trial.ts 共用 trial_used/{email},同一個信箱只給一次。
      // ⚠️ Mia 決定:已經試用過的人(不管是舊的 3 天還是 App 的 7 天)綁卡不再送第二次試用,
      //    直接從綁卡當天開始計費。
      const key = email ? trialEmailKey(normalizeEmail(email)) : "uid:" + uid;
      const usedSnap = await db.doc("trial_used/" + key).get();
      const trialEligible = !usedSnap.exists && !u.trial_started_at;

      const env = ecpgConfig();
      const tradeNo = "SB" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();

      await db.doc("ecpg_binds/" + tradeNo).set({
        uid, email, plan,
        trial_eligible: trialEligible,
        verify_amount: ECPG_BIND_VERIFY_TWD,
        status: "pending",
        created_at: admin.firestore.FieldValue.serverTimestamp(),
      });

      const r = await ecpgPost<{ Token?: string }>(
        ecpgHost(env) + "/Merchant/GetTokenbyBindingCard",
        {
          PlatformID: "",
          // MerchantMemberID 用 uid → 同一個人重綁會沿用同一個會員,查綁卡/刪綁卡才找得到
          ConsumerInfo: {
            MerchantMemberID: uid.slice(0, 60),
            Email: email, Phone: "", Name: String(u.display_name || "StayJP"), CountryCode: "158",
          },
          OrderInfo: {
            MerchantTradeDate: ecpgDateTW(),
            MerchantTradeNo: tradeNo,
            TotalAmount: ECPG_BIND_VERIFY_TWD,
            TradeDesc: "StayJP card verification",
            ItemName: "StayJP 卡片驗證(會立即放棄請款)",
            ReturnURL: ecpgReturnUrl(),
          },
          OrderResultURL: ecpgResultUrl(),
          CustomField: tradeNo,
        },
        env,
      );

      if (!r.ok || !r.data?.Token) {
        console.error("GetTokenbyBindingCard 失敗", r);
        await db.doc("ecpg_binds/" + tradeNo).set(
          { status: "failed", fail_code: r.rtnCode ?? null, fail_msg: r.rtnMsg || r.error || null }, { merge: true });
        res.status(502).json({ error: "ecpay_token_failed", reason: r.rtnMsg || r.error }); return;
      }

      res.json({
        ok: true,
        token: r.data.Token,
        merchantId: env.merchantId,
        tradeNo,
        env: env.production ? "Prod" : "Stage",     // 前端 SDK initialize() 要的字串
        // ⚠️ JS SDK 一律從「正式」domain 載入,環境靠 initialize('Stage'|'Prod') 切。
        //    官方綁卡範例(CreateBindCardOrder/WebJS.html)明講 stage domain 的 SDK 是不同檔案、行為可能異常。
        //    (02a quickstart 那份文件寫要載 stage SDK,與官方範例矛盾 → 以官方範例為準)
        sdk: "https://ecpg.ecpay.com.tw/Scripts/sdk-1.0.0.js?t=20210121100116",
        trial_days: trialEligible ? 7 : 0,
        verify_amount: ECPG_BIND_VERIFY_TWD,
        charge_twd: PLANS[plan].price_twd,
        site: ecpayConfig().siteOrigin,
      });
    } catch (err) {
      console.error("ecpgBindStart error:", err);
      res.status(500).json({ error: "internal", message: String(err) });
    }
  },
);
