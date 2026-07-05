// HTTP function:把「原生登入後的 Firebase idToken」換成 custom token
//
// 用途(app B 路線):app 內用原生 Sign in with Apple / Google 登入 → 拿到原生 Firebase idToken
// → 呼叫這支驗證 → 回 custom token → app 注入 WebView 的 firebase.auth().signInWithCustomToken()
// → WebView(stayjp.study)登入成同一個 uid,跟原生共用帳號。
//
// 安全:只接受「有效 idToken」的人,且只發「他自己 uid」的 custom token(不能冒充別人)。

import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

if (admin.apps.length === 0) admin.initializeApp();

export const mintCustomToken = functions.onRequest(
  {
    cors: true,
    region: "asia-east1",
    invoker: "public",
    maxInstances: 5,
    timeoutSeconds: 30,
    memory: "256MiB",
    concurrency: 20,
  },
  async (req, res) => {
    try {
      if (req.method !== "POST") { res.status(405).json({ error: "method_not_allowed" }); return; }
      const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      if (!idToken) { res.status(401).json({ error: "missing_auth" }); return; }
      const decoded = await admin.auth().verifyIdToken(idToken);
      const customToken = await admin.auth().createCustomToken(decoded.uid);
      res.json({ ok: true, customToken });
    } catch (err) {
      console.error("mintCustomToken error:", err);
      res.status(401).json({ error: "invalid_token", message: String(err) });
    }
  },
);
