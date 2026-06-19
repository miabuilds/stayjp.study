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
import { writeSubscription, getSubscription, nowMs, SubscriptionDoc } from "./utils/firestore";

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
      const data = await r.json() as { subscriber?: { entitlements?: Record<string, {
        expires_date?: string | null; product_identifier?: string; unsubscribe_detected_at?: string | null;
      }> } };

      const ent = data?.subscriber?.entitlements?.[ENTITLEMENT_ID];
      const active = !!ent && (!ent.expires_date || new Date(ent.expires_date).getTime() > Date.now());
      if (!active || !ent) { res.json({ ok: true, premium: false }); return; }

      const plan = mapProductIdToPlan(ent.product_identifier || "") || "monthly";
      const expiresAt = ent.expires_date ? new Date(ent.expires_date).getTime() : nowMs() + 365 * 100 * 864e5;
      const existing = await getSubscription(uid);
      const sub: SubscriptionDoc = {
        source: "app",
        plan,
        status: "active",
        expiresAt,
        willRenew: !ent.unsubscribe_detected_at,
        startedAt: existing?.startedAt || nowMs(),
        is_early_bird: existing?.is_early_bird === true,
        failed_retries: 0,
      };
      await writeSubscription(uid, sub);
      res.json({ ok: true, premium: true, plan, expiresAt });
    } catch (err) {
      console.error("rcSyncSubscription error:", err);
      res.status(500).json({ error: "internal", message: String(err) });
    }
  },
);
