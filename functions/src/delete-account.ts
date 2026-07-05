// HTTP function:使用者自助刪除帳號(Apple 5.1.1(v) 要求 app 內可刪帳號)
//
// 任何登入用戶可刪「自己」的帳號(uid 由 idToken 驗證,不能刪別人)。
// 刪除:個資/進度/訂閱狀態 doc + Firebase Auth 帳號。
// 保留:transactions 帳本(財務紀錄,依會計/退費爭議需留存;以 uid 關聯但已無對應帳號)。

import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { db } from "./utils/firestore";

if (admin.apps.length === 0) admin.initializeApp();

export const deleteAccount = functions.onRequest(
  {
    cors: true,
    region: "asia-east1",
    invoker: "public",
    maxInstances: 3,
    timeoutSeconds: 60,
    memory: "256MiB",
    concurrency: 10,
  },
  async (req, res) => {
    try {
      if (req.method !== "POST") { res.status(405).json({ error: "method_not_allowed" }); return; }

      const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      if (!idToken) { res.status(401).json({ error: "missing_auth" }); return; }
      const decoded = await admin.auth().verifyIdToken(idToken);
      const uid = decoded.uid;

      // 刪個資 / 進度 / 訂閱狀態(各自獨立,失敗不互相阻擋)
      await Promise.allSettled([
        db.doc(`users/${uid}`).delete(),
        db.doc(`subscriptions/${uid}`).delete(),
        db.doc(`user_progress/${uid}`).delete(),
        db.doc(`free_users/${uid}`).delete(),
      ]);

      // 刪 Firebase Auth 帳號(最後做;前面 doc 刪完才動)
      await admin.auth().deleteUser(uid);

      console.log("✓ account deleted", { uid });
      res.json({ ok: true });
    } catch (err) {
      console.error("deleteAccount error:", err);
      res.status(500).json({ error: "internal", message: String(err) });
    }
  },
);
