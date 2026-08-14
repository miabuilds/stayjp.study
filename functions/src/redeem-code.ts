// HTTP function:登入用戶輸入兌換碼 → 換取一段免費 Premium(測試者/活動用)。
// 發放一律走共用 helper(writeSubscription/patchSubscription/writeTransaction),與後台手動補開一致。
// 記帳:gift 一律 amount_twd=0 → 不計營收(對帳自動排除)。
// 既有「自動續扣的付費用戶」→ 只加天數,不動方案/續扣/來源(bonus days,絕不弄壞他的帳單)。
// 防濫用:一碼一人一次(redeem_uses/{code}_{uid})、名額上限(max_uses)、停用、過期。
import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { PLANS, PlanKey } from "./utils/constants";
import {
  getSubscription, writeSubscription, patchSubscription, writeTransaction, nowMs, SubscriptionDoc,
} from "./utils/firestore";

if (admin.apps.length === 0) admin.initializeApp();
const db = admin.firestore();
const DAY = 86400000;

export const redeemCode = functions.onRequest(
  { cors: true, region: "asia-east1", invoker: "public", maxInstances: 3, timeoutSeconds: 30, memory: "256MiB", concurrency: 10 },
  async (req, res) => {
    try {
      const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      if (!idToken) { res.status(401).json({ error: "missing_auth", reason: "請先登入再兌換。" }); return; }
      const decoded = await admin.auth().verifyIdToken(idToken);
      const uid = decoded.uid;
      const email = (decoded.email || "").toLowerCase();
      const code = String(req.body?.code || "").trim().toUpperCase();
      if (!code || code.length > 40) { res.status(400).json({ error: "missing_code", reason: "請輸入兌換碼。" }); return; }

      const codeRef = db.doc(`redeem_codes/${code}`);
      const useRef = db.doc(`redeem_uses/${code}_${uid}`);

      // 交易內:驗證碼 + 佔名額 + 記兌換(防重複/超量/停用/過期的競態)
      const r = await db.runTransaction(async (tx) => {
        const cs = await tx.get(codeRef);
        if (!cs.exists) return { err: "code_not_found", reason: "兌換碼不存在。" };
        const c = cs.data() as any;
        if (c.active === false) return { err: "inactive", reason: "這個兌換碼已停用。" };
        if (c.expires_at && nowMs() > Number(c.expires_at)) return { err: "code_expired", reason: "這個兌換碼已過期。" };
        const max = Number(c.max_uses || 0);
        const used = Number(c.used_count || 0);
        if (max > 0 && used >= max) return { err: "maxed", reason: "這個兌換碼的名額已用完。" };
        const us = await tx.get(useRef);
        if (us.exists) return { err: "already", reason: "你已經兌換過這個碼了。" };
        tx.set(useRef, { code, uid, email, redeemed_at: nowMs() });
        tx.update(codeRef, { used_count: used + 1 });
        return { ok: true as const, days: Math.max(1, Math.round(Number(c.days || 30))), plan: String(c.plan || "yearly"), label: String(c.label || "") };
      });
      if ("err" in r) { res.status(400).json({ error: r.err, reason: r.reason }); return; }

      const days = r.days;
      const plan: PlanKey = (PLANS as any)[r.plan] ? (r.plan as PlanKey) : "yearly";
      const existing = await getSubscription(uid);
      const base = Math.max(nowMs(), existing?.expiresAt || 0);
      const newExpiry = base + days * DAY;

      if (existing && existing.willRenew === true) {
        // 有自動續扣的付費用戶 → 只加天數,方案/續扣/來源都不動(純加碼,不弄壞帳單)
        await patchSubscription(uid, { expiresAt: newExpiry });
      } else {
        // 新 / 免費 / 過期 / 贈送用戶 → 開一段贈送 Premium
        await writeSubscription(uid, {
          source: "web", plan, status: "active", expiresAt: newExpiry, willRenew: false,
          startedAt: existing?.startedAt || nowMs(), is_early_bird: existing?.is_early_bird === true, failed_retries: 0,
        } as SubscriptionDoc);
      }
      await writeTransaction({
        uid, type: "gift", source: "web", plan, amount_twd: 0, payment_method: "manual",
        external_id: `redeem-${code}-${nowMs()}`, status: "success",
        note: `redeem ${code} +${days}d${r.label ? ` (${r.label})` : ""}`,
      });

      const after = await getSubscription(uid);
      res.json({ ok: true, days, expiresAt: after?.expiresAt || newExpiry });
    } catch (err) {
      console.error("redeemCode error:", err);
      res.status(500).json({ error: "internal", message: String(err) });
    }
  },
);
