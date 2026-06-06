// HTTP function:owner 管理「免費白名單」(free_users/{uid})
//
// action: 'list' | 'add' | 'remove'
//   add/remove 用 email 反查 uid(對方需先用 Google 登入過本站才有帳號)
//   free_users/{uid} 文件存在 = 該用戶免費(tool-quota 讀 free_users/{自己uid} 判斷)
// 只有 Cloud Function (Admin SDK) 能寫 free_users,防止用戶自封免費。嚴格 owner only。

import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { db } from "./utils/firestore";

if (admin.apps.length === 0) admin.initializeApp();

const OWNER_EMAILS = new Set(["stayjpplan@gmail.com", "abc83327@gmail.com"]);

export const adminFreeAccess = functions.onRequest(
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

      const action = String(req.body?.action || "list");
      const email = String(req.body?.email || "").trim().toLowerCase();

      if (action === "add" || action === "remove") {
        if (!email) { res.status(400).json({ error: "missing_email" }); return; }
        let uid: string;
        try {
          uid = (await admin.auth().getUserByEmail(email)).uid;
        } catch {
          res.status(404).json({ error: "user_not_found", reason: `找不到 ${email} 的帳號(對方需先用 Google 登入過本站)。` });
          return;
        }
        const ref = db.doc(`free_users/${uid}`);
        if (action === "add") {
          await ref.set({ email, uid, granted_at: admin.firestore.Timestamp.now() });
        } else {
          await ref.delete().catch(() => { /* 不存在就當已移除 */ });
        }
      }

      // 一律回傳目前白名單
      const snap = await db.collection("free_users").limit(500).get();
      const list = snap.docs.map(d => ({
        uid: d.id,
        email: (d.data().email as string) || "",
        granted_at: d.data().granted_at?.toMillis?.() || null,
      }));
      res.json({ ok: true, count: list.length, free_users: list });
    } catch (err) {
      console.error("adminFreeAccess error:", err);
      res.status(500).json({ error: "internal", message: String(err) });
    }
  },
);
