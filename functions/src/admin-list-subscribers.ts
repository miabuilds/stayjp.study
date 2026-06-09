// HTTP function:owner 後台列出所有訂閱者(看訂閱資料用)
//
// 嚴格 owner only。查 users 集合中有 subscription 的文件,補上 email(從 Auth)。
// 規模小(launch 期訂閱者不多),逐筆查 Auth email 即可。

import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { db } from "./utils/firestore";

if (admin.apps.length === 0) admin.initializeApp();

const OWNER_EMAILS = new Set(["stayjpplan@gmail.com", "abc83327@gmail.com"]);

export const adminListSubscribers = functions.onRequest(
  {
    cors: true,
    region: "asia-east1",
    invoker: "public",
    maxInstances: 2,
    timeoutSeconds: 60,
    memory: "256MiB",
    concurrency: 10,
  },
  async (req, res) => {
    try {
      const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      if (!idToken) { res.status(401).json({ error: "missing_auth" }); return; }
      const decoded = await admin.auth().verifyIdToken(idToken);
      if (!OWNER_EMAILS.has(decoded.email || "")) { res.status(403).json({ error: "not_owner" }); return; }

      const snap = await db.collection("subscriptions")
        .where("status", "in", ["active", "trialing", "cancelled", "refunded", "expired"])
        .limit(500).get();

      const subscribers = await Promise.all(snap.docs.map(async (doc) => {
        const s = (doc.data() || {}) as Record<string, unknown>;
        let email = "";
        try { email = (await admin.auth().getUser(doc.id)).email || ""; } catch { /* user 可能已刪 */ }
        return {
          uid: doc.id,
          email,
          plan: s.plan || "",
          status: s.status || "",
          source: s.source || "",
          expiresAt: s.expiresAt || null,
          startedAt: s.startedAt || null,
          is_early_bird: s.is_early_bird === true,
          willRenew: s.willRenew === true,
        };
      }));

      // 依到期日新到舊排序
      subscribers.sort((a, b) => (Number(b.expiresAt) || 0) - (Number(a.expiresAt) || 0));

      res.json({ ok: true, count: subscribers.length, subscribers });
    } catch (err) {
      console.error("adminListSubscribers error:", err);
      res.status(500).json({ error: "internal", message: String(err) });
    }
  },
);
