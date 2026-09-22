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
//       少了 → 列出來;開失敗的(status=failed)也一併列。

import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";

if (admin.apps.length === 0) admin.initializeApp();

const LOOKBACK_DAYS = 7;

export const invoiceAuditCron = onSchedule(
  {
    schedule: "20 10 * * *",       // 每天 10:20 台北(排在字軌檢查之後)
    timeZone: "Asia/Taipei",
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

    const missing: Record<string, unknown>[] = [];
    const failed: Record<string, unknown>[] = [];
    let paidCount = 0;

    for (const d of snap.docs) {
      const t = d.data();
      if (t.payment_method !== "ecpay") continue;
      if (t.status !== "success") continue;
      if (t.type !== "subscribe" && t.type !== "renew") continue;
      paidCount++;

      const key = String(t.external_id || "").replace(/[^A-Za-z0-9]/g, "").slice(0, 50);
      if (!key) { missing.push({ txn: d.id, uid: t.uid, reason: "交易沒有 external_id" }); continue; }
      const inv = await db.doc("invoices/" + key).get();
      if (!inv.exists) {
        missing.push({ txn: d.id, uid: t.uid, trade_no: key, amount: t.amount_twd });
      } else if (inv.data()?.status === "failed") {
        failed.push({ txn: d.id, uid: t.uid, trade_no: key, msg: inv.data()?.fail_msg || null });
      }
    }

    const summary = {
      checked_at: Date.now(),
      go_live_at: goLiveAt,
      lookback_days: LOOKBACK_DAYS,
      audited_from: lookbackFrom,
      paid_count: paidCount,
      missing_count: missing.length,
      failed_count: failed.length,
      issue_count: missing.length + failed.length,
      missing: missing.slice(0, 50),
      failed: failed.slice(0, 50),
    };
    await alertRef.set(summary);

    if (summary.issue_count) {
      console.error(
        `⚠️ 發票對帳不符:近 ${LOOKBACK_DAYS} 天收款 ${paidCount} 筆,` +
        `沒開發票 ${missing.length} 筆、開失敗 ${failed.length} 筆`,
      );
    } else {
      console.log(`發票對帳:近 ${LOOKBACK_DAYS} 天 ${paidCount} 筆收款全部有發票`);
    }
  },
);
