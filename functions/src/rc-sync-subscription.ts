// HTTP function:app 購買/恢復後呼叫 → 後端用 RevenueCat secret key「獨立驗證」使用者真的有訂閱
// → Admin SDK 寫 users/{uid}.subscription。
//
// 為什麼要這支(取代前端直接寫):
//   - 前端寫 subscription = 任何人可白嫖(改 console)。配合 Firestore 規則鎖死 subscription 欄位後,
//     前端不能再寫,改由這支「先跟 RevenueCat 對帳」再寫 → 不可偽造。
//   - 也補上 webhook 的缺口:restore(恢復購買)不會觸發 webhook,但會呼叫這支。
//
// 驗 idToken 取 uid(= RevenueCat app_user_id),打 RC REST 查該 uid 的 entitlement。

import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { PlanKey } from "./utils/constants";
import { writeSubscription, getSubscription, getRefCode, grantAiBonus, rewardReferrerOnPayment, recordKolCommission, refBonusDays, nowMs, SubscriptionDoc } from "./utils/firestore";
import { PLANS } from "./utils/constants";

if (admin.apps.length === 0) admin.initializeApp();

const ENTITLEMENT_ID = "StayJP Plan Premium";

function mapProductIdToPlan(productId: string): PlanKey | null {
  const map: Record<string, PlanKey> = {
    "com.stayjp.app.monthly": "monthly",
    "stayjp_monthly": "monthly",
    "com.stayjp.app.yearly": "yearly",
    "stayjp_yearly": "yearly",
    "com.stayjp.app.yearly_early_bird": "yearly_early_bird",
    "stayjp_yearly_early_bird": "yearly_early_bird",
    "com.stayjp.app.lifetime": "lifetime",
    "stayjp_lifetime": "lifetime",
  };
  return map[productId] ?? null;
}

export const rcSyncSubscription = functions.onRequest(
  {
    cors: true,
    region: "asia-east1",
    invoker: "public",
    secrets: ["REVENUECAT_SECRET_KEY"],
    maxInstances: 10,
    timeoutSeconds: 30,
    memory: "256MiB",
    concurrency: 20,
  },
  async (req, res) => {
    try {
      const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      if (!idToken) { res.status(401).json({ error: "missing_auth" }); return; }
      const decoded = await admin.auth().verifyIdToken(idToken);
      const uid = decoded.uid;

      const secret = process.env.REVENUECAT_SECRET_KEY || "";
      if (!secret) { res.status(500).json({ error: "secret_not_set" }); return; }

      // 跟 RevenueCat 對帳(獨立驗證,不信前端)
      const r = await fetch(`https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(uid)}`, {
        headers: { Authorization: `Bearer ${secret}` },
      });
      if (!r.ok) { res.status(502).json({ error: "rc_fetch_failed", status: r.status }); return; }
      const data = await r.json() as { subscriber?: {
        entitlements?: Record<string, {
          expires_date?: string | null; product_identifier?: string; unsubscribe_detected_at?: string | null;
        }>;
        subscriptions?: Record<string, { period_type?: string; is_sandbox?: boolean; store_transaction_id?: string; price?: { amount?: number; currency?: string } }>;   // period_type: "trial"|"intro"|"normal"
        non_subscriptions?: Record<string, Array<{ is_sandbox?: boolean; store_transaction_id?: string; price?: { amount?: number; currency?: string } }>>;
        subscriber_attributes?: Record<string, { value?: string }>;
      } };

      const ent = data?.subscriber?.entitlements?.[ENTITLEMENT_ID];
      const active = !!ent && (!ent.expires_date || new Date(ent.expires_date).getTime() > Date.now());
      if (!active || !ent) { res.json({ ok: true, premium: false }); return; }

      const prodId = ent.product_identifier || "";
      const plan = mapProductIdToPlan(prodId) || "monthly";
      const expiresAt = ent.expires_date ? new Date(ent.expires_date).getTime() : nowMs() + 365 * 100 * 864e5;
      // 試用期 → status: trialing(帳號頁顯示「試用中・剩 N 天」,而非「Premium 會員」)
      const periodType = data?.subscriber?.subscriptions?.[prodId]?.period_type;
      const existing = await getSubscription(uid);
      const sub: SubscriptionDoc = {
        source: "app",
        plan,
        status: periodType === "trial" ? "trialing" : "active",
        expiresAt,
        willRenew: !ent.unsubscribe_detected_at,
        startedAt: existing?.startedAt || nowMs(),
        is_early_bird: existing?.is_early_bird === true,
        failed_retries: 0,
      };
      // ── 「未登入先買、之後才登入」補課(2026-09-14 用戶回報):匿名購買歸戶不會觸發 webhook,
      //    這支是唯一會經過的地方 → 推薦碼好康(月/年 +天數、買斷 AI 加量)、推薦人 +7 天、KOL 分潤
      //    全部在這裡補做一次。只在「帳號第一次拿到訂閱」時跑;所有 helper 本身冪等(ref_bonus_at / referrer_paid_at / commissions doc id)。
      if (!existing && sub.status === "active") {
        const subEntry = data?.subscriber?.subscriptions?.[prodId];
        const nonSub = (data?.subscriber?.non_subscriptions?.[prodId] || [])[0];
        const entry = subEntry || nonSub;
        const isSandbox = !!entry?.is_sandbox;
        const listTwd = (PLANS as Record<string, { price_twd: number }>)[plan]?.price_twd ?? 0;
        const paidTwd = entry?.price?.currency === "TWD" && typeof entry?.price?.amount === "number" ? Math.round(entry.price.amount) : listTwd;
        const txnId = entry?.store_transaction_id || "";
        const norm = (v: unknown) => String(v || "").toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 32);
        let refCode = await getRefCode(uid);
        const attrCode = norm(data?.subscriber?.subscriber_attributes?.ref_code?.value);
        if (!refCode && attrCode) {
          try {
            const oc = await admin.firestore().doc(`ref_codes/${attrCode}`).get();
            if (oc.exists) { await admin.firestore().doc(`users/${uid}`).set({ ref_code: attrCode, ref_at: nowMs(), ref_via: "app_ref_attribute" }, { merge: true }); refCode = attrCode; }
          } catch (e) { console.warn("rcSync ref attr 歸因略過:", e); }
        }
        if (refCode && !isSandbox) {
          if (plan !== "lifetime") {
            const discountedYearly = plan === "yearly" && paidTwd < PLANS.yearly.price_twd;
            if (!discountedYearly) sub.expiresAt = sub.expiresAt + refBonusDays(plan) * 864e5;
          } else if (paidTwd >= PLANS.lifetime.price_twd) {
            await grantAiBonus(uid, "推薦碼＋購買買斷(App,登入歸戶補發)→ AI 加量包").catch(e => console.error("grantAiBonus(rcSync) 略過:", e));
          }
          sub.ref_bonus_at = nowMs();
        }
        await writeSubscription(uid, sub);
        await rewardReferrerOnPayment(uid, isSandbox).catch(e => console.error("rewardReferrer(rcSync) 略過:", e));
        await recordKolCommission(uid, { plan, gross_twd: paidTwd, source: "app", txnId, isSandbox, isFirstPayment: true })
          .catch(e => console.error("recordKolCommission(rcSync) 略過:", e));
      } else {
        await writeSubscription(uid, sub);
      }
      res.json({ ok: true, premium: true, plan, expiresAt: sub.expiresAt });
    } catch (err) {
      console.error("rcSyncSubscription error:", err);
      res.status(500).json({ error: "internal", message: String(err) });
    }
  },
);
