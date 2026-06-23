// Stay-jp-notes 訂閱方案配置
// 改價要同時改:pricing.html / home.html / stayjp-app/src/lib/subscription.ts

import { defineSecret } from "firebase-functions/params";

// ECPay 機密設定。金流相關 function 都要在 options 加 `secrets: ECPAY_SECRETS`,
// 否則 `firebase functions:secrets:set` 設的值不會注入 process.env,會 fallback 到沙盒。
// 設定方式（值由 owner 設,不進 git）：
//   firebase functions:secrets:set ECPAY_MERCHANT_ID   # 正式商店代號
//   firebase functions:secrets:set ECPAY_HASH_KEY      # 正式 HashKey
//   firebase functions:secrets:set ECPAY_HASH_IV       # 正式 HashIV
//   firebase functions:secrets:set ECPAY_PRODUCTION    # 輸入 true
//   firebase deploy --only functions
export const ECPAY_SECRETS = [
  defineSecret("ECPAY_MERCHANT_ID"),
  defineSecret("ECPAY_HASH_KEY"),
  defineSecret("ECPAY_HASH_IV"),
  defineSecret("ECPAY_PRODUCTION"),
];

export const EARLY_BIRD_LIMIT = 100;

export type PlanKey = "monthly" | "yearly" | "yearly_early_bird" | "lifetime";
export type Source = "web" | "app";
export type SubStatus = "active" | "cancelled" | "expired" | "refunded";

export const PLANS: Record<PlanKey, {
  price_twd: number;
  period_days: number;
  ecpay_period_type: "M" | "Y";
  ecpay_frequency: number;
  display_name: string;
}> = {
  monthly: {
    price_twd: 150,
    period_days: 30,
    ecpay_period_type: "M",
    ecpay_frequency: 1,
    display_name: "月費",
  },
  yearly: {
    price_twd: 1490,
    period_days: 365,
    ecpay_period_type: "Y",
    ecpay_frequency: 1,
    display_name: "年費",
  },
  yearly_early_bird: {
    price_twd: 990,
    period_days: 365,
    ecpay_period_type: "Y",
    ecpay_frequency: 1,
    display_name: "早鳥年費",
  },
  lifetime: {
    price_twd: 2990,
    period_days: 365 * 100,    // 100 年 ~= 終身,實際 willRenew=false
    ecpay_period_type: "M",     // 不續扣
    ecpay_frequency: 1,
    display_name: "終身方案",
  },
};

// ───── PayPal(網頁海外用戶,一次性付款:早鳥年費 / 買斷)─────────────────
// 設定:firebase functions:secrets:set PAYPAL_CLIENT_SECRET
//       上線再:firebase functions:secrets:set PAYPAL_PRODUCTION (輸入 true) + 換 live client id
export const PAYPAL_SECRETS = [
  defineSecret("PAYPAL_CLIENT_SECRET"),
  defineSecret("PAYPAL_PRODUCTION"),   // 設 "true" 走正式;未設/非 true → sandbox
];

// Client ID 是公開值(前端 SDK 也會用);依 PAYPAL_PRODUCTION 選 live / sandbox,可用 env 覆寫。
const PAYPAL_SANDBOX_CLIENT_ID =
  "AeWHhYkZLsmyZzCrVRuxvbBfpeNEqGGDeEQe1uAoAvLA6DFPD_w3yF2-UUzZmcv_mfLWVTzaSzv25Dwt";
const PAYPAL_LIVE_CLIENT_ID =
  "Aeuts8UKvc-wbXSHPrGCuWXOh9_ZnvYugi-ElkAls1eOxEWjjv-Td0N74w0xIQdXLtkW39SIKYewCtFB";

export function paypalConfig() {
  const isProduction = process.env.PAYPAL_PRODUCTION === "true";
  return {
    clientId: process.env.PAYPAL_CLIENT_ID
      || (isProduction ? PAYPAL_LIVE_CLIENT_ID : PAYPAL_SANDBOX_CLIENT_ID),
    secret: process.env.PAYPAL_CLIENT_SECRET || "",
    isProduction,
    currency: "USD",
  };
}

export function paypalApiBase() {
  return paypalConfig().isProduction
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

// PayPal 只開放「海外一次性方案」:早鳥年費 / 買斷(月費 / 標準年費走綠界定期定額)。
// 金額用 USD(PayPal 不直接收 TWD);對帳 ledger 仍記 TWD 標價(PLANS.price_twd)。
export const PAYPAL_PRICES_USD: Partial<Record<PlanKey, number>> = {
  yearly_early_bird: 32,
  lifetime: 96,
};

// 退費規則(全自動)
export const REFUND_POLICY = {
  full_refund_days: 7,             // 首次訂閱 7 天內全退
  blacklist_after_refunds: 2,      // 退費滿 2 次 email 永久 blacklist
  no_early_bird_after_refunds: 1,  // 退費 1 次後不享早鳥
};

// 失敗扣款 grace period:超過 N 天還在 failed → 訂閱降級為 expired
// 注意:實際 retry 行為由 ECPay 定期定額系統內部處理(我們沒主動 retry)。
// 14 天只是粗略 grace,還沒對照 ECPay 官方文件確認他們重試次數 / 間隔。
// TODO:查綠界文件確認定期定額扣款失敗重試流程,調整這個值。
export const FAILED_PAYMENT_GRACE_DAYS = 14;

// 環境設定 — 從 functions config 讀
export function ecpayConfig() {
  return {
    merchantId: process.env.ECPAY_MERCHANT_ID || "3002607",     // sandbox default
    hashKey:    process.env.ECPAY_HASH_KEY    || "pwFHCqoQZGmho4w6",
    hashIV:     process.env.ECPAY_HASH_IV     || "EkRm7iFT261dpevs",
    isProduction: process.env.ECPAY_PRODUCTION === "true",
    siteOrigin: process.env.SITE_ORIGIN || "https://stayjp.study",
    // 綠界 ECPay 的 callback URL — stayjp.study 是 GitHub Pages,沒有 /api/* proxy
    // 改用 Cloud Function 直接 public URL
    callbackUrl: process.env.ECPAY_CALLBACK_URL || "https://ecpaycallback-lsd7okt5qa-de.a.run.app",
    // user POST redirect URL — ECPay 結帳完把 user 送到這個 function,function 302 轉到 account.html
    returnUrl: process.env.ECPAY_RETURN_URL || "https://ecpayreturn-lsd7okt5qa-de.a.run.app",
  };
}

export function ecpayEndpoint() {
  const cfg = ecpayConfig();
  return cfg.isProduction
    ? "https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5"
    : "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5";
}

// 信用卡單筆退費 / 取消授權 — DoAction Action=R / E / N (限該筆 TradeNo)
export function ecpayRefundEndpoint() {
  const cfg = ecpayConfig();
  return cfg.isProduction
    ? "https://payment.ecpay.com.tw/CreditDetail/DoAction"
    : "https://payment-stage.ecpay.com.tw/CreditDetail/DoAction";
}

// 定期定額 停止訂閱 — PeriodAction Action=CancelRevoke (用 MerchantTradeNo)
export function ecpayPeriodActionEndpoint() {
  const cfg = ecpayConfig();
  return cfg.isProduction
    ? "https://payment.ecpay.com.tw/Cashier/CreditCardPeriodAction"
    : "https://payment-stage.ecpay.com.tw/Cashier/CreditCardPeriodAction";
}
