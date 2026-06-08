// HTTP function:owner 校正早鳥計數器
//
// 為什麼需要:counters/early_bird.count 是「目前占用名額」,理論 = 持有早鳥的訂閱數
//   (is_early_bird=true;退費/爭議會 releaseEarlyBird 並清 flag)。但測試期的
//   reset(admin-reset-billing 刪 subscription 但不動 counter)或其他異常會讓它漂移,
//   導致 pricing 顯示的「剩餘名額」算錯。這支把它重算成真實持有數。
//
// 真實值 = users 集合中 subscription.is_early_bird === true 的文件數。
// 嚴格 owner only。

import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { db } from "./utils/firestore";

if (admin.apps.length === 0) admin.initializeApp();

const OWNER_EMAILS = new Set(["stayjpplan@gmail.com", "abc83327@gmail.com"]);
const EARLY_BIRD_LIMIT = 100;

export const adminRecomputeEarlyBird = functions.onRequest(
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

      // 真實持有早鳥名額的訂閱數
      const snap = await db.collection("users").where("subscription.is_early_bird", "==", true).get();
      const realCount = snap.size;

      const ref = db.doc("counters/early_bird");
      const before = ((await ref.get()).data()?.count as number) ?? 0;
      await ref.set(
        { count: realCount, limit: EARLY_BIRD_LIMIT, updated_at: admin.firestore.Timestamp.now() },
        { merge: true },
      );

      res.json({ ok: true, before, after: realCount, limit: EARLY_BIRD_LIMIT, remaining: Math.max(0, EARLY_BIRD_LIMIT - realCount) });
    } catch (err) {
      console.error("adminRecomputeEarlyBird error:", err);
      res.status(500).json({ error: "internal", message: String(err) });
    }
  },
);
