// 每日發票對帳:收了幾筆錢 vs 開了幾張發票,對不起來就叫。
//
// 為什麼需要這支:
//   漏開發票是稅務問題,而且「靜悄悄」—— 錢照收、用戶照開通、程式不報錯,
//   要等國稅局或用戶來問才知道。2026-09 就踩過一次:發票的冪等鑰匙用了
//   MerchantTradeNo,但定期定額每期的 MerchantTradeNo 都一樣,
//   導致「第二期開始全部被當重複而跳過」。單元測試抓不到這種呼叫端的錯。
//   所以與其相信程式寫對,不如每天拿兩邊的數字直接對。
//
// 對法:最近 N 天 status=success 的綠界收款交易,每一筆都該有一張 invoices 文件。
//       少了或開失敗的 → 「當場補開」,補不成才列出來給人看。
//
// 為什麼要自己補開:callback 回 1|OK 之後綠界就不會再送,所以那一次開立失敗
//       (綠界暫時掛、網路抖)之後,沒有任何東西會再觸發開立。
//       單純告狀等於每天叫 Mia 手動去補,那還不如程式自己補。

import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import { PLANS, PlanKey, INVOICE_SECRET_NAMES } from "./utils/constants";
import { issueForPayment, resolveEmail } from "./utils/invoice-flow";

if (admin.apps.length === 0) admin.initializeApp();

const LOOKBACK_DAYS = 7;

export const invoiceAuditCron = onSchedule(
  {
    schedule: "20 10 * * *",       // 每天 10:20 台北(排在字軌檢查之後)
    timeZone: "Asia/Taipei",
    // ⚠️ 要補開就要打綠界 → 一定要帶發票金鑰,不然正式環境 invoiceConfig() 直接丟錯
    secrets: INVOICE_SECRET_NAMES,
    region: "asia-east1", timeoutSeconds: 300, memory: "256MiB",
  },
  async () => {
    const db = admin.firestore();
    const alertRef = db.doc("system_alerts/invoice_audit");

    // 上線界線:發票功能之前的收款本來就沒有發票,拿去對帳只會天天紅字。
    // 第一次跑的時候把「現在」記下來當界線,之後只對帳這之後的收款。
    // (界線之前那些沒開的發票是另一件事 —— 要不要補開是稅務決定,不是程式問題,
    //  所以這裡只記一個數字給 Mia 看,不列成待處理。)
    const prev = (await alertRef.get()).data() || {};
    const goLiveAt: number = Number(prev.go_live_at) || Date.now();

    const lookbackFrom = Math.max(goLiveAt, Date.now() - LOOKBACK_DAYS * 86400_000);
    const since = admin.firestore.Timestamp.fromMillis(lookbackFrom);

    // 綠界的收款交易(訂閱首購 + 續扣)。PayPal / App 內購不走我們開發票,排除。
    const snap = await db.collection("transactions")
      .where("occurred_at", ">=", since)
      .limit(1000)
      .get();

    const healed: Record<string, unknown>[] = [];      // 這次補開成功的
    const missing: Record<string, unknown>[] = [];     // 補開也失敗的,要人看
    let paidCount = 0;

    for (const d of snap.docs) {
      const t = d.data();
      if (t.payment_method !== "ecpay") continue;
      if (t.status !== "success") continue;
      if (t.type !== "subscribe" && t.type !== "renew") continue;
      paidCount++;

      const key = String(t.external_id || "").replace(/[^A-Za-z0-9]/g, "").slice(0, 50);
      if (!key) { missing.push({ txn: d.id, uid: t.uid, reason: "交易沒有 external_id,無法補開" }); continue; }
      const inv = (await db.doc("invoices/" + key).get()).data();
      const st = String(inv?.status || "");
      if (st === "issued" || st === "invalid" || st === "allowance") continue;   // 有發票,正常
      // issuing 未過期 = 可能正在開(callback 還在跑),這輪先不動
      if (st === "issuing" && Date.now() - Number(inv?.created_at || 0) < 10 * 60_000) continue;

      // 沒開 / 開失敗 / 卡住 → 補開。issueForPayment 自己會處理鎖與重試次數。
      const plan = String(t.plan || "") as PlanKey;
      const email = await resolveEmail(String(t.uid || ""));
      const ok = email ? await issueForPayment({
        uid: String(t.uid || ""), email, ecpayTradeNo: key,
        itemName: `StayJP ${PLANS[plan]?.display_name || plan}`,
        amountTwd: Number(t.amount_twd || 0),
      }) : false;
      const row = { txn: d.id, uid: t.uid, trade_no: key, amount: t.amount_twd, was: st || "missing" };
      if (ok) healed.push(row);
      else {
        const after = (await db.doc("invoices/" + key).get()).data();
        missing.push({ ...row, msg: email ? (after?.fail_msg || null) : "找不到 email,無法開立" });
      }
    }

    const summary = {
      checked_at: Date.now(),
      go_live_at: goLiveAt,
      lookback_days: LOOKBACK_DAYS,
      audited_from: lookbackFrom,
      paid_count: paidCount,
      healed_count: healed.length,
      missing_count: missing.length,
      issue_count: missing.length,            // 補開成功的不算問題
      healed: healed.slice(0, 50),
      missing: missing.slice(0, 50),
    };
    await alertRef.set(summary);

    if (missing.length) {
      console.error(
        `⚠️ 發票對帳:近 ${LOOKBACK_DAYS} 天收款 ${paidCount} 筆,` +
        `補開成功 ${healed.length} 筆、仍然沒發票 ${missing.length} 筆(需人工)`,
      );
    } else {
      console.log(`發票對帳:${paidCount} 筆收款全部有發票` + (healed.length ? `(其中 ${healed.length} 筆是這次補開的)` : ""));
    }
  },
);
