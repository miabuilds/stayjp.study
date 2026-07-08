// HTTP function:取得 / 建立「登入用戶自己的推薦碼」(type:'user')。
// ref_codes 限 admin 寫 → 用戶不能自己寫,走這支用 Admin SDK 建立。冪等:已有就回既有。
// 用戶碼給碼主的獎勵是「朋友真付費 → 推薦人 +7 天」(見 rewardReferrerOnPayment),與 KOL 抽成碼並存。
import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

if (admin.apps.length === 0) admin.initializeApp();
const db = admin.firestore();

function genCode(): string {
  const A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";   // 去掉易混 I/O/0/1
  let s = "";
  for (let i = 0; i < 6; i++) s += A[Math.floor(Math.random() * A.length)];
  return s;
}

export const getMyRefCode = functions.onRequest(
  { cors: true, region: "asia-east1", invoker: "public", maxInstances: 3, timeoutSeconds: 20, memory: "256MiB", concurrency: 20 },
  async (req, res) => {
    try {
      const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      if (!idToken) { res.status(401).json({ error: "missing_auth" }); return; }
      const uid = (await admin.auth().verifyIdToken(idToken)).uid;

      // 已有就回既有(冪等)
      const u = (await db.doc(`users/${uid}`).get()).data() || {};
      if (u.my_ref_code) { res.json({ code: u.my_ref_code }); return; }

      // 建新碼:撞碼重生(最多 5 次)
      let code = "";
      for (let i = 0; i < 5; i++) {
        const cand = genCode();
        const exist = await db.doc(`ref_codes/${cand}`).get();
        if (!exist.exists) { code = cand; break; }
      }
      if (!code) { res.status(500).json({ error: "gen_failed" }); return; }

      await db.doc(`ref_codes/${code}`).set({
        type: "user", owner_uid: uid, active: true, created_at: admin.firestore.FieldValue.serverTimestamp(),
      });
      await db.doc(`users/${uid}`).set({ my_ref_code: code }, { merge: true });
      res.json({ code });
    } catch (err) {
      console.error("getMyRefCode error:", err);
      res.status(500).json({ error: "internal", message: String(err) });
    }
  },
);
