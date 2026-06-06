// HTTP function:owner 後台用戶統計(可靠版,取代前端 count() 的不穩)
//
// 前端 client SDK 的 users.count() 會因規則 / SDK 偶發丟錯,fallback 成「1000+」;
// 且 users 文件沒有 createdAt 欄位,本週新註冊查不到 → 顯示「欄位缺」。
// 改用 Admin SDK:
//   - 註冊用戶數 = users 集合 count()(Admin SDK 繞過規則、無 1000 上限)
//   - 本週新註冊 = Firebase Auth 的 creationTime 在 7 天內的數量(不依賴 createdAt 欄位)

import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { db } from "./utils/firestore";

if (admin.apps.length === 0) admin.initializeApp();

const OWNER_EMAILS = new Set(["stayjpplan@gmail.com", "abc83327@gmail.com"]);

export const adminUserStats = functions.onRequest(
  {
    cors: true,
    region: "asia-east1",
    invoker: "public",
    maxInstances: 2,
    timeoutSeconds: 120,
    memory: "256MiB",
    concurrency: 10,
  },
  async (req, res) => {
    try {
      const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      if (!idToken) { res.status(401).json({ error: "missing_auth" }); return; }
      const decoded = await admin.auth().verifyIdToken(idToken);
      if (!OWNER_EMAILS.has(decoded.email || "")) { res.status(403).json({ error: "not_owner" }); return; }

      // 寫過資料的用戶(users 集合文件數)
      const usersAgg = await db.collection("users").count().get();
      const userCount = usersAgg.data().count;

      // 註冊總數 + 本週新註冊:用 Firebase Auth creationTime(不依賴 Firestore createdAt 欄位)
      const weekAgoMs = Date.now() - 7 * 86400000;
      let authTotal = 0;
      let newThisWeek = 0;
      let pageToken: string | undefined;
      do {
        const page = await admin.auth().listUsers(1000, pageToken);
        authTotal += page.users.length;
        for (const u of page.users) {
          const t = u.metadata.creationTime ? Date.parse(u.metadata.creationTime) : 0;
          if (t >= weekAgoMs) newThisWeek++;
        }
        pageToken = page.pageToken;
      } while (pageToken);

      res.json({ ok: true, userCount, authTotal, newThisWeek });
    } catch (err) {
      console.error("adminUserStats error:", err);
      res.status(500).json({ error: "internal", message: String(err) });
    }
  },
);
