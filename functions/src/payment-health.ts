// HTTP function:金流健檢(每日 GitHub Action 打它,異常就讓 Action 失敗→寄信)。
// 驗:綠界設定/能組單/端點可達、PayPal 金鑰有效、Firestore 可讀、有沒有「收了錢沒開通」。
// 公開端點,刻意「不回營收數字」(只回健康布林 + 未處理對帳數),避免外洩業務量。
import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import {
  ecpayConfig, ecpayEndpoint, ECPAY_SECRETS, PAYPAL_SECRETS, PLANS,
} from "./utils/constants";
import { checkMacValue, ecpayDateTimeTW, generateMerchantTradeNo } from "./utils/ecpay";
import { paypalHealthCheck } from "./utils/paypal";

if (admin.apps.length === 0) admin.initializeApp();
const db = admin.firestore();

export const paymentHealth = functions.onRequest(
  {
    region: "asia-east1",
    invoker: "public",
    secrets: [...ECPAY_SECRETS, ...PAYPAL_SECRETS, "HEALTH_CHECK_KEY"],
    timeoutSeconds: 30,
    memory: "256MiB",
    maxInstances: 2,   // 公開端點防濫用:限制實例數,避免被狂打灌爆成本 / 打爆金流 API
  },
  async (req, res) => {
    // 選用認證:若有設 HEALTH_CHECK_KEY,要求 ?key= 相符(GitHub Action 會帶)。沒設就跳過
    // (maxInstances 已擋住成本濫用)。要開強認證:把 HEALTH_CHECK_KEY 加進上面 secrets 陣列 +
    // `firebase functions:secrets:set HEALTH_CHECK_KEY` + GitHub repo secret 同名同值 + 部署。
    const expectedKey = process.env.HEALTH_CHECK_KEY;
    if (expectedKey && req.query.key !== expectedKey) {
      res.status(403).json({ ok: false, error: "forbidden" });
      return;
    }
    const checks: Record<string, unknown> = {};
    let ok = true;

    // ── 綠界:設定 + 能組出合法 CheckMacValue + 端點可達 ──
    try {
      const cfg = ecpayConfig();
      const configOk = !!(cfg.merchantId && cfg.hashKey && cfg.hashIV);
      const p: Record<string, string | number> = {
        MerchantID: cfg.merchantId,
        MerchantTradeNo: generateMerchantTradeNo(),
        MerchantTradeDate: ecpayDateTimeTW(),
        PaymentType: "aio",
        TotalAmount: PLANS.monthly.price_twd,
        TradeDesc: encodeURIComponent("health"),
        ItemName: "health",
        ChoosePayment: "ALL",
        EncryptType: 1,
        ReturnURL: cfg.callbackUrl,
      };
      p.CheckMacValue = checkMacValue(p);
      // 綠界 AioCheckOut 是 POST-only:GET 會回 4xx/5xx 也算「伺服器活著」。
      // 可達 = fetch 有拿到回應(任何 HTTP 狀態);只有網路層失敗(DNS/連線/逾時)才算掛。
      let endpointOk = false;
      try {
        await fetch(ecpayEndpoint(), { method: "GET" });
        endpointOk = true;
      } catch { endpointOk = false; }
      checks.ecpay = { config: configOk, can_build: !!p.CheckMacValue, endpoint: endpointOk, production: cfg.isProduction };
      if (!configOk || !p.CheckMacValue || !endpointOk) ok = false;
    } catch (e) {
      checks.ecpay = { error: String(e) };
      ok = false;
    }

    // ── PayPal:拿 token = 金鑰有效 + API 活著(輔助金流,資訊用,不讓整體 fail)──
    checks.paypal = await paypalHealthCheck();

    // ── Firestore 可讀 ──
    try {
      await db.doc("counters/early_bird").get();
      checks.firestore = true;
    } catch (e) {
      checks.firestore = false;
      checks.firestore_error = String(e);
      ok = false;
    }

    // ── 「收了錢沒開通」未處理佇列(>0 一定要 alert)──
    try {
      const pf = await db.collection("payment_failures").where("resolved", "==", false).get();
      checks.unresolved_payment_failures = pf.size;
      if (pf.size > 0) ok = false;
    } catch (e) {
      checks.payment_failures_error = String(e);
    }

    // ── 近 24h 有沒有任何成功扣款(布林,不外洩數字;false 不代表壞,只是當天還沒人買)──
    try {
      const since = admin.firestore.Timestamp.fromMillis(Date.now() - 86400000);
      const snap = await db.collection("transactions")
        .where("occurred_at", ">=", since).where("status", "==", "success").limit(1).get();
      checks.had_success_24h = !snap.empty;
    } catch { /* 資訊用,失敗不影響 ok */ }

    res.status(ok ? 200 : 500).json({ ok, checked_at: new Date().toISOString(), checks });
  },
);
