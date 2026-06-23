// HTTP function:RevenueCat webhook(App IAP 訂閱事件)
//
// RevenueCat doc: https://www.revenuecat.com/docs/webhooks
//
// 事件類型:INITIAL_PURCHASE / RENEWAL / CANCELLATION / EXPIRATION / BILLING_ISSUE
// 跨平台共存:這裡寫入的 subscription.source = "app",網頁端讀同一份 Firestore doc。
//
// 部署完才接通,Apple Dev / Play Console 核准 + RevenueCat 連好後設 webhook URL。

import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { PLANS, PlanKey } from "./utils/constants";
import {
  writeSubscription, writeTransaction, getSubscription,
  patchSubscription, nowMs, plusDays, tryReserveEarlyBird, SubscriptionDoc,
} from "./utils/firestore";

if (admin.apps.length === 0) admin.initializeApp();

const REVENUECAT_AUTH_HEADER = process.env.REVENUECAT_WEBHOOK_SECRET || "";
const ENTITLEMENT_ID = "StayJP Plan Premium";   // 跟 rc-sync-subscription.ts 一致

export const revenuecatWebhook = functions.onRequest(
  {
    region: "asia-east1",
    invoker: "public",
    secrets: ["REVENUECAT_SECRET_KEY"],   // TRANSFER 事件不帶 product → 要查 RC REST 還原訂閱
    maxInstances: 20,          // App IAP webhook,給多一點 burst 空間
    timeoutSeconds: 60,
    memory: "256MiB",
    concurrency: 80,
  },
  async (req, res) => {
    try {
      // 驗 RevenueCat shared secret(設定在 RevenueCat dashboard webhook config)
      const auth = req.headers.authorization || "";
      if (REVENUECAT_AUTH_HEADER && auth !== `Bearer ${REVENUECAT_AUTH_HEADER}`) {
        res.status(401).send("unauthorized");
        return;
      }

      const event = req.body?.event;
      if (!event) { res.status(400).send("missing event"); return; }

      const uid = event.app_user_id;   // RevenueCat SDK logIn(uid) 設的
      const productId = event.product_id as string;
      const type = event.type as string;

      console.log("RevenueCat event:", { type, uid, productId });

      // TRANSFER:Apple 沙盒/換機/換帳號時,同一 Apple ID 的購買會在 app_user_id 之間轉移。
      // 這種事件「沒有 app_user_id / product_id」,uid 在 transferred_to / transferred_from。
      // 原本走到下面 `!uid` → 400 → RC 不斷重試卻永遠失敗 → 權益轉到新 uid 卻沒人寫 →
      // 「付了錢訂閱卻是空的」。改:對 transferred_to 查 RC REST 還原訂閱;transferred_from 失權則收回。
      if (type === "TRANSFER") {
        const toList: string[] = Array.isArray(event.transferred_to) ? event.transferred_to : [];
        const fromList: string[] = Array.isArray(event.transferred_from) ? event.transferred_from : [];
        console.log("RevenueCat TRANSFER:", { to: toList, from: fromList });
        let wrote = 0;
        let hadError = false;
        for (const to of toList) {
          if (!to || String(to).startsWith("$RCAnonymousID")) continue;   // 匿名 id 不是真 user
          const r = await fetchAndWriteFromRc(to);
          if (r === "written") wrote++;
          else if (r === "error") hadError = true;
        }
        for (const fr of fromList) {
          if (!fr || String(fr).startsWith("$RCAnonymousID")) continue;
          const ent = await fetchRcEntitlement(fr);
          if (ent.ok && !ent.active) {
            // 確認 from 端在 RC 已無有效權益 → 收回(Apple 同群組只允許一個有效訂閱)
            const ex = await getSubscription(fr);
            if (ex && ex.status === "active") {
              await patchSubscription(fr, { status: "expired", willRenew: false, expiresAt: nowMs() });
            }
          } else if (!ent.ok) {
            hadError = true;
          }
        }
        // 全部查詢都失敗且沒寫成任何一筆 → 回非 2xx 讓 RC 稍後重試(別吞掉)
        if (hadError && wrote === 0) { res.status(503).send("rc fetch error, retry later"); return; }
        res.status(200).send(`ok (transfer wrote=${wrote})`);
        return;
      }

      if (!uid) { res.status(400).send("missing app_user_id"); return; }

      // product_id 映射到 plan
      const plan = mapProductIdToPlan(productId);
      if (!plan) {
        console.warn("Unknown product_id:", productId);
        res.status(200).send("ok (unknown product)");
        return;
      }

      const planInfo = PLANS[plan];
      const existingSub = await getSubscription(uid);
      const eventId = event.id as string | undefined;   // RC 事件唯一 id → 給 writeTransaction 做冪等(重送不重複入帳)
      // 實際結帳幣別 + 實付金額(外國人買 iOS 才有意義;amount_twd 只是台幣牌價,非實收)。
      // 注意 Firestore 不收 undefined → 有值才放進物件。
      const rcMoney: { currency?: string; amount_paid?: number } = {};
      if (typeof event.currency === "string" && event.currency) rcMoney.currency = event.currency;
      if (typeof event.price_in_purchased_currency === "number") rcMoney.amount_paid = event.price_in_purchased_currency;

      switch (type) {
        case "INITIAL_PURCHASE":
        case "RENEWAL":
        case "NON_RENEWING_PURCHASE":   // 買斷(lifetime)是非續訂商品 → RC 發此事件,不是 INITIAL_PURCHASE。原本沒接 → 買斷付了 2990 卻寫不進訂閱
        case "PRODUCT_CHANGE": {   // 月↔年 升降級:用新 product 重寫 plan/到期日(原本沒處理 → 升降級不生效)
          // 只有「首次購買早鳥 product」才佔名額;is_early_bird 以「買的就是早鳥 product」為準(sticky:不被續訂/競態打回原價)
          if (plan === "yearly_early_bird" && type === "INITIAL_PURCHASE") {
            await tryReserveEarlyBird();
          }
          // 防呆:access 只增不減。理論上 Apple 同訂閱群組只允許一個有效訂閱,但若群組設錯 /
          // sandbox 殘留 / 事件亂序,導致一個用戶多個訂閱事件競爭時,不讓「較短的續訂」蓋掉
          // 「較晚到期的有效訂閱」。仍照常記帳本(稽核),但當前訂閱保留較長有效期 + 該方案身分,
          // 避免到期日/方案在事件間跳動、誤縮短權益。
          const newExpiry = plusDays(nowMs(), planInfo.period_days);
          // 只有「目前仍 active」的訂閱才值得保留;refunded / voided(假刪)/ cancelled / expired
          // 一律不保留 → 避免一筆遲到的續訂把「已退款/已撤銷」帳號重新復活成 premium。
          const keepExisting = !!existingSub && existingSub.status === "active"
            && (existingSub.expiresAt || 0) > newExpiry;
          const finalPlan = keepExisting ? existingSub!.plan : plan;
          const finalExpiry = keepExisting ? existingSub!.expiresAt : newExpiry;
          const isEarlyBird = finalPlan === "yearly_early_bird" || existingSub?.is_early_bird === true;
          const newSub: SubscriptionDoc = {
            source: "app",
            plan: finalPlan,
            status: "active",
            expiresAt: finalExpiry,
            willRenew: finalPlan !== "lifetime",   // 買斷不續訂
            startedAt: existingSub?.startedAt || nowMs(),
            apple_txn: event.transaction_id,
            is_early_bird: isEarlyBird,
            failed_retries: 0,
          };
          await writeSubscription(uid, newSub);

          await writeTransaction({
            uid,
            type: (type === "INITIAL_PURCHASE" || type === "NON_RENEWING_PURCHASE") ? "subscribe" : "renew",
            source: "app",
            plan,
            amount_twd: planInfo.price_twd,
            ...rcMoney,   // 實際幣別 + 實付金額(外國人/非台幣)
            payment_method: event.store === "PLAY_STORE" ? "google_billing" : "apple_iap",
            external_id: event.transaction_id || event.original_transaction_id,
            status: "success",
            note: `RevenueCat ${type}`,
          }, eventId);
          break;
        }

        case "CANCELLATION": {
          if (existingSub) {
            await patchSubscription(uid, { willRenew: false });
          }
          await writeTransaction({
            uid,
            type: "cancel",
            source: "app",
            plan,
            amount_twd: 0,
            payment_method: event.store === "PLAY_STORE" ? "google_billing" : "apple_iap",
            external_id: event.transaction_id || "",
            status: "success",
            note: "User cancelled (will run until expiresAt)",
          }, eventId);
          break;
        }

        case "EXPIRATION": {
          await patchSubscription(uid, { status: "expired", willRenew: false });
          await writeTransaction({
            uid,
            type: "fail",
            source: "app",
            plan,
            amount_twd: 0,
            payment_method: event.store === "PLAY_STORE" ? "google_billing" : "apple_iap",
            external_id: event.transaction_id || "",
            status: "failed",
            note: "Subscription expired",
          }, eventId);
          break;
        }

        case "BILLING_ISSUE": {
          await patchSubscription(uid, {
            failed_retries: (existingSub?.failed_retries || 0) + 1,
            last_retry_at: nowMs(),
          });
          await writeTransaction({
            uid,
            type: "fail",
            source: "app",
            plan,
            amount_twd: 0,
            payment_method: event.store === "PLAY_STORE" ? "google_billing" : "apple_iap",
            external_id: event.transaction_id || "",
            status: "failed",
            note: "Billing issue (card expired / insufficient funds)",
          }, eventId);
          break;
        }

        // Apple/Google 退款或退單(信用卡爭議)。RevenueCat 送 REFUND;
        // 沒處理的話 doc 會停在 status:active、expiresAt 未來 → 退款後仍能無限用(漏財紅線)。
        // 立即收回:status→refunded、willRenew→false、expiresAt→now(isPremium 立刻判定失效)。
        case "REFUND":
        case "CHARGEBACK": {
          await patchSubscription(uid, { status: "refunded", willRenew: false, expiresAt: nowMs() });
          // 退款金額存成負數(實際幣別),方便對帳:外國人退的是當地幣別,不是台幣
          const refundMoney: { currency?: string; amount_paid?: number } = {};
          if (rcMoney.currency) refundMoney.currency = rcMoney.currency;
          if (rcMoney.amount_paid != null) refundMoney.amount_paid = -Math.abs(rcMoney.amount_paid);
          await writeTransaction({
            uid,
            type: "refund",
            source: "app",
            plan,
            amount_twd: 0,
            ...refundMoney,
            payment_method: event.store === "PLAY_STORE" ? "google_billing" : "apple_iap",
            external_id: event.transaction_id || event.original_transaction_id || "",
            status: "refunded",
            note: `RevenueCat ${type} — access revoked`,
          }, eventId);
          break;
        }

        default:
          console.log("Unhandled RevenueCat event type:", type);
      }

      res.status(200).send("ok");
    } catch (err) {
      console.error("revenuecatWebhook error:", err);
      res.status(500).send("internal");
    }
  },
);

function mapProductIdToPlan(productId: string): PlanKey | null {
  // Product IDs 定義在 stayjp-app/src/lib/subscription.ts:PLANS
  // App Store Connect / Play Console 上要建這些 product
  const map: Record<string, PlanKey> = {
    "com.stayjp.app.monthly": "monthly",
    "stayjp_monthly": "monthly",
    "com.stayjp.app.yearly": "yearly",
    "stayjp_yearly": "yearly",
    "com.stayjp.app.yearly_early_bird": "yearly_early_bird",
    "stayjp_yearly_early_bird": "yearly_early_bird",
    "com.stayjp.app.lifetime": "lifetime",   // 原本漏了 → app 買斷版會寫不進(unknown product)
    "stayjp_lifetime": "lifetime",
  };
  return map[productId] ?? null;
}

// ── TRANSFER 用:跟 RevenueCat REST 對帳(獨立驗證,跟 rc-sync-subscription.ts 同一套邏輯)──
interface RcEnt { ok: boolean; active: boolean; productId?: string; expiresDate?: string | null; unsubscribed?: boolean; }

async function fetchRcEntitlement(uid: string): Promise<RcEnt> {
  const secret = process.env.REVENUECAT_SECRET_KEY || "";
  if (!secret || !uid) return { ok: false, active: false };
  try {
    const r = await fetch(`https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(uid)}`, {
      headers: { Authorization: `Bearer ${secret}` },
    });
    if (!r.ok) return { ok: false, active: false };
    const data = await r.json() as { subscriber?: { entitlements?: Record<string, {
      expires_date?: string | null; product_identifier?: string; unsubscribe_detected_at?: string | null;
    }> } };
    const ent = data?.subscriber?.entitlements?.[ENTITLEMENT_ID];
    const active = !!ent && (!ent.expires_date || new Date(ent.expires_date).getTime() > Date.now());
    return {
      ok: true, active,
      productId: ent?.product_identifier,
      expiresDate: ent?.expires_date,
      unsubscribed: !!ent?.unsubscribe_detected_at,
    };
  } catch {
    return { ok: false, active: false };
  }
}

async function fetchAndWriteFromRc(uid: string): Promise<"written" | "no-entitlement" | "error"> {
  const ent = await fetchRcEntitlement(uid);
  if (!ent.ok) return "error";
  if (!ent.active) return "no-entitlement";
  const plan = mapProductIdToPlan(ent.productId || "") || "monthly";
  const expiresAt = ent.expiresDate ? new Date(ent.expiresDate).getTime() : nowMs() + 365 * 100 * 864e5;
  const existing = await getSubscription(uid);
  const sub: SubscriptionDoc = {
    source: "app",
    plan,
    status: "active",
    expiresAt,
    willRenew: !ent.unsubscribed,
    startedAt: existing?.startedAt || nowMs(),
    is_early_bird: existing?.is_early_bird === true,
    failed_retries: 0,
  };
  await writeSubscription(uid, sub);
  return "written";
}
