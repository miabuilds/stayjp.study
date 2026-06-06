// HTTP function:owner 手動解除某 email 的訂閱限制(刪 blacklist/{emailHash})
//
// 用途:客服 / 誤判時,幫使用者解除「退費滿 2 次永久限制」或爭議扣回封鎖。
// blacklist 以 emailHash(sha256 前 16 碼)為 key、不存明文 email,所以只能用
// email 反算 hash 來刪。刪掉整筆 = refund_count / permanently_blocked 一併清空,
// 早鳥資格也恢復。嚴格 owner only。

import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { db, emailHash } from "./utils/firestore";

if (admin.apps.length === 0) admin.initializeApp();

const OWNER_EMAILS = new Set(["stayjpplan@gmail.com", "abc83327@gmail.com"]);

export const adminUnblockUser = functions.onRequest(
  {
    cors: true,
    region: "asia-east1",
    invoker: "public",
    maxInstances: 2,
    timeoutSeconds: 30,
    memory: "256MiB",
    concurrency: 10,
  },
  async (req, res) => {
    try {
      const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      if (!idToken) { res.status(401).json({ error: "missing_auth" }); return; }
      const decoded = await admin.auth().verifyIdToken(idToken);
      if (!OWNER_EMAILS.has(decoded.email || "")) { res.status(403).json({ error: "not_owner" }); return; }

      const targetEmail = String(req.body?.email || "").trim();
      if (!targetEmail) { res.status(400).json({ error: "missing_email" }); return; }

      const hash = emailHash(targetEmail);
      const ref = db.doc(`blacklist/${hash}`);
      const snap = await ref.get();
      const before = snap.exists ? snap.data() : null;
      await ref.delete().catch(() => { /* 不存在就當已解除 */ });

      res.json({
        ok: true,
        email: targetEmail,
        email_hash: hash,
        was_blocked: !!before,
        removed: before || null,
      });
    } catch (err) {
      console.error("adminUnblockUser error:", err);
      res.status(500).json({ error: "internal", message: String(err) });
    }
  },
);
