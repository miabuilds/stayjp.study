// Stay-jp-notes 訂閱方案配置
// 改價要同時改:pricing.html(方案卡+PLAN_TERMS+meta) / index.html(方案卡+JSON-LD) /
//   ui-map.js(改過的中文句要同步英文 key) / trial-email-cron.ts / stayjp-app/src/lib/subscription.ts
//   / App Store Connect + Play Console(商店價各自獨立,要手動改)
// 前端會把「頁面顯示的金額」以 expected_twd 送進 createPayment 核對,不一致會擋單
// (防 service worker 舊快取頁顯示舊價、實扣新價)→ 改價要「先推 Pages、確認上線、再 deploy functions」

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
// 早鳥收官:此刻起不再接受「新購」早鳥(既有早鳥續扣不受影響——續扣走 callback 沿用 is_early_bird 原價)
export const EARLY_BIRD_END_MS = Date.UTC(2026, 7, 27, 3, 0, 0);   // 2026-08-27 12:00 JST

export type PlanKey = "monthly" | "yearly" | "yearly_early_bird" | "lifetime";
export type Source = "web" | "app";
export type SubStatus = "trialing" | "active" | "cancelled" | "expired" | "refunded" | "voided";

export const PLANS: Record<PlanKey, {
  price_twd: number;
  period_days: number;
  ecpay_period_type: "M" | "Y";
  ecpay_frequency: number;
  display_name: string;
}> = {
  monthly: {
    price_twd: 390,   // 2026-09-14 調漲(290→390,年費 1/5 原則襯托年費;舊訂戶綠界照舊授權金額續扣,自動凍漲)
    period_days: 30,
    ecpay_period_type: "M",
    ecpay_frequency: 1,
    display_name: "月費",
  },
  yearly: {
    price_twd: 1990,   // 2026-09-14 調漲(1490→1990);官網輸有效推薦碼 → 現折 WEB_CODE_DISCOUNT_TWD
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
    price_twd: 5990,   // 2026-09-14 調漲(2990→5990,Mia 9/6 定案:3 倍年費,學習週期 1-2 年下買斷>期望LTV)
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

// ⚠️ PayPal 已於 2026-08-31 全面下架(使用量極低,海外導 App 內購買)。前端入口已移除;
// 後端 functions 保留只為既有 PayPal 買家的退費/對帳,此表僅供 paypal-refund 對帳參考。
// 金額用 USD(PayPal 不直接收 TWD);對帳 ledger 仍記 TWD 標價(PLANS.price_twd)。
// PayPal 是一次性付款不自動續訂 → 不在「續扣鎖價」承諾範圍;調價日(9/7)yearly 要同步改 ~58。
export const PAYPAL_PRICES_USD: Partial<Record<PlanKey, number>> = {
  yearly: 48,                // ≈ NT$1,490
  yearly_early_bird: 32,
  lifetime: 96,
};

// ── 推薦碼折價(官網/綠界限定;iOS/Play 牌價無碼折,引流至低抽成通路)──
// createPayment 建單時:users/{uid}.ref_code 存在且該碼有效(ref_codes 存在/active/非停權/非本人)
// → 建單金額 = price_twd − 折價。定期定額 PeriodAmount 用折後價 → 折後價終身續扣(=「鎖 1,790」承諾)。
// 年費走折價後,callback 不再另發 +30 天(避免雙重好康;月費 +7 天、買斷 AI 加量照舊)。
// 話術=「推薦碼 9 折」,實際取整到十位(1,791→1,790、5,391→5,390,比 9 折再便宜一點)
export const WEB_CODE_DISCOUNT_TWD: Partial<Record<PlanKey, number>> = {
  yearly: 200,     // 折後 1,790,定期定額終身鎖
  lifetime: 600,   // 折後 5,390,一次性;App 內碼折要等 1.0.8 雙 SKU(輸碼解鎖 5,390 商品)
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
  const isProduction = process.env.ECPAY_PRODUCTION === "true";
  // ⚠️ 資安:正式環境「絕不」fallback 到綠界官方公開的 sandbox 測試金鑰。
  // 否則若正式 secret 沒注入,驗簽會用「全世界都知道的金鑰」→ 任何人可偽造 callback 免費開通/封鎖帳號。
  // 正式模式缺金鑰 → 直接丟錯(fail-closed);sandbox 才允許用公開測試金鑰。
  if (isProduction && (!process.env.ECPAY_HASH_KEY || !process.env.ECPAY_HASH_IV || !process.env.ECPAY_MERCHANT_ID)) {
    throw new Error("ECPay production 金鑰未設定,拒絕以測試金鑰運行");
  }
  return {
    merchantId: process.env.ECPAY_MERCHANT_ID || "3002607",     // sandbox default(僅測試環境)
    hashKey:    process.env.ECPAY_HASH_KEY    || "pwFHCqoQZGmho4w6",   // sandbox 公開金鑰(僅測試環境;正式已於上方擋掉)
    hashIV:     process.env.ECPAY_HASH_IV     || "EkRm7iFT261dpevs",
    isProduction,
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

// 定期定額 訂單查詢 — QueryCreditCardPeriodInfo (用 MerchantTradeNo)
// 回傳 JSON,ExecLog[] 內每期扣款有各自的 TradeNo/gwsr。
// 退定期定額某一期必須用「該期 ExecLog 的 TradeNo」,不能用 callback 首次存的號碼,
// 否則單筆 DoAction 會回「訂單不存在」。
export function ecpayPeriodQueryEndpoint() {
  const cfg = ecpayConfig();
  return cfg.isProduction
    ? "https://payment.ecpay.com.tw/Cashier/QueryCreditCardPeriodInfo"
    : "https://payment-stage.ecpay.com.tw/Cashier/QueryCreditCardPeriodInfo";
}
