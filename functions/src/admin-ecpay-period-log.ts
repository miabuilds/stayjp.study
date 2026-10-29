// Firestore 觸發:owner 對帳用,查綠界定期定額每期扣款紀錄(唯讀,不碰訂閱)
//
// 用途:2026-10-29 發現續扣第 3 期起被 callback 判重吃掉,Functions log 只留 30 天,
// 要靠綠界 QueryCreditCardPeriodInfo 的 ExecLog 回頭比對哪些期有扣到錢但帳本沒記。
//
// 用法:用 admin SDK 寫一筆 audit_requests/{id} = { type: "ecpay_period", orders: ["sXXXX", ...] }
//      → 本函式逐張問綠界,把原文寫回同一筆的 result 欄位,status 變 done。
// 不走 HTTP、不需要 ID token、金鑰不離開雲端;audit_requests 集合 rules 不開給前端。

import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import axios from "axios";
import { ecpayConfig, ecpayPeriodQueryEndpoint, PAYMENT_AND_INVOICE_SECRETS } from "./utils/constants";
import { checkMacValue } from "./utils/ecpay";

if (admin.apps.length === 0) admin.initializeApp();

export const adminEcpayPeriodLog = onDocumentCreated(
  {
    document: "audit_requests/{id}",
    region: "asia-east1",
    secrets: PAYMENT_AND_INVOICE_SECRETS,
    maxInstances: 1,
    timeoutSeconds: 300,
    memory: "256MiB",
  },
  async (event) => {
    const snap = event.data;
    if (!snap) return;
    const data = snap.data() as { type?: string; orders?: unknown; status?: string };
    if (data.type !== "ecpay_period" || data.status) return;
    const orders: string[] = Array.isArray(data.orders) ? data.orders.map(String).slice(0, 100) : [];
    if (!orders.length) { await snap.ref.update({ status: "error", error: "orders required" }); return; }

    const cfg = ecpayConfig();
    const result: Record<string, unknown> = {};
    for (const mtn of orders) {
      const params: Record<string, string | number> = {
        MerchantID: cfg.merchantId,
        MerchantTradeNo: mtn,
        TimeStamp: Math.floor(Date.now() / 1000),
      };
      params.CheckMacValue = checkMacValue(params);
      try {
        const r = await axios.post(
          ecpayPeriodQueryEndpoint(),
          new URLSearchParams(params as Record<string, string>).toString(),
          { headers: { "Content-Type": "application/x-www-form-urlencoded" }, timeout: 30000 },
        );
        result[mtn] = typeof r.data === "object" ? r.data : { raw: String(r.data).slice(0, 2000) };
      } catch (e) {
        result[mtn] = { error: String(e) };
      }
    }
    await snap.ref.update({ status: "done", result, done_at: Date.now() });
  },
);
