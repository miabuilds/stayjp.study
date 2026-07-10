// HTTP function:自助成為 KOL / 合作夥伴 — 登入後一鍵取得專屬 KOL 分潤碼。
// ref_codes 只有 admin 能寫,所以走這支(Admin SDK)發碼。冪等:已有就回既有。
// 與「個人推薦碼(type:user,+7/+7)」分開:這是 type:'kol' 抽成碼,綁 owner_uid。
// 需登入(idToken)+ 明確同意合作條款(agree=true)。分潤精算/付款走後台,這裡只發碼+存收款/同意。
import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

if (admin.apps.length === 0) admin.initializeApp();
const db = admin.firestore();

const DEFAULT_COMMISSION_PCT = 20;
const TERMS_VERSION = "2026-07-10";

function genCode(): string {
  const A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 7; i++) s += A[Math.floor(Math.random() * A.length)];
  return s;
}
function genToken(): string {
  let s = "";
  for (let i = 0; i < 20; i++) s += Math.floor(Math.random() * 36).toString(36);
  return s;
}

export const partnerJoin = functions.onRequest(
  { cors: true, region: "asia-east1", invoker: "public", maxInstances: 3, timeoutSeconds: 20, memory: "256MiB", concurrency: 20 },
  async (req, res) => {
    try {
      const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      if (!idToken) { res.status(401).json({ error: "missing_auth" }); return; }
      const decoded = await admin.auth().verifyIdToken(idToken);
      const uid = decoded.uid;

      const body = req.body || {};
      const agree = body.agree === true || body.agree === "true";

      const userRef = db.doc(`users/${uid}`);
      const u = (await userRef.get()).data() || {};

      // 已有 KOL 碼 → 回既有(冪等)
      if (u.kol_code) {
        const ex = (await db.doc(`ref_codes/${u.kol_code}`).get()).data() || {};
        res.json({ code: u.kol_code, token: ex.token || "", commission_pct: ex.commission_pct ?? DEFAULT_COMMISSION_PCT });
        return;
      }

      // 首次加入必須同意條款
      if (!agree) { res.status(400).json({ error: "must_agree_terms" }); return; }

      // 顯示名稱 / 平台 / 收款方式(選填,之後可在後台補;金額大時才需身分資料)
      const displayName = String(body.name || "").slice(0, 60);
      const platform = String(body.platform || "").slice(0, 200);
      const payoutMethod = ["bank", "paypal"].includes(body.payout_method) ? body.payout_method : "";
      const payoutAccount = String(body.payout_account || "").slice(0, 120);

      // 產唯一碼(撞碼重生)
      let code = "";
      for (let i = 0; i < 6; i++) {
        const cand = genCode();
        if (!(await db.doc(`ref_codes/${cand}`).get()).exists) { code = cand; break; }
      }
      if (!code) { res.status(500).json({ error: "gen_failed" }); return; }
      const token = genToken();

      await db.doc(`ref_codes/${code}`).set({
        type: "kol",
        owner_uid: uid,
        kol: displayName || decoded.email || uid,
        token,
        active: true,
        commission_pct: DEFAULT_COMMISSION_PCT,
        platform,
        payout: payoutMethod ? { method: payoutMethod, account: payoutAccount } : null,
        agreed_terms_at: admin.firestore.FieldValue.serverTimestamp(),
        terms_version: TERMS_VERSION,
        source: "self_serve",
        created_at: admin.firestore.FieldValue.serverTimestamp(),
      });
      await userRef.set({ kol_code: code }, { merge: true });

      res.json({ code, token, commission_pct: DEFAULT_COMMISSION_PCT });
    } catch (err) {
      console.error("partnerJoin error:", err);
      res.status(500).json({ error: "internal", message: String(err) });
    }
  },
);
