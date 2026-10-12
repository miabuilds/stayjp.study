// HTTP function:查「我現在有沒有新人限時 9 折、到幾點」。官網 pricing / 倒數條、App Paywall 都打這支。
// 要登入(Bearer idToken);沒登入回 { until: 0 }。回應只有截止時間,不外洩付款紀錄。
import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { getNewbieOffer } from "./utils/newbie";
import { NEWBIE } from "./utils/constants";

if (admin.apps.length === 0) admin.initializeApp();

export const newbieOffer = functions.onRequest(
  { cors: true, region: "asia-east1", invoker: "public", maxInstances: 5, timeoutSeconds: 30, memory: "256MiB", concurrency: 40 },
  async (req, res) => {
    const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
    if (!idToken) { res.json({ until: 0, launch: NEWBIE.launch, hours: NEWBIE.hours }); return; }
    try {
      const uid = (await admin.auth().verifyIdToken(idToken)).uid;
      const { until } = await getNewbieOffer(uid);
      res.json({ until, launch: NEWBIE.launch, hours: NEWBIE.hours });
    } catch {
      res.json({ until: 0, launch: NEWBIE.launch, hours: NEWBIE.hours });
    }
  },
);
