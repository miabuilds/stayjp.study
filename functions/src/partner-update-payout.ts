// HTTP function:合作夥伴(KOL)自助填/改收款資料。
// 為什麼要有這支:ref_codes 只有 admin 能寫(rules),前端不能直接寫 payout → 後端用 Admin SDK 代寫。
// 2026-11-09 補:10/10 partner.html 就已呼叫 partnerUpdatePayout,但這支當時沒寫出來 → 每次存都 404,
//   前端 r.json() 丟錯顯示「儲存失敗,請稍後再試」。KOL tokyo.dumbradio(DUMB)填不進去才發現。
// 防呆:驗 idToken、擋匿名、只准動「自己 kol_code 指到且 owner_uid 是自己」的碼、停權擋、只寫 payout 欄位。
import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

if (admin.apps.length === 0) admin.initializeApp();
const db = admin.firestore();

const strip = (x: unknown, max: number) => String(x ?? "").replace(/[<>]/g, "").trim().slice(0, max);

export const partnerUpdatePayout = functions.onRequest(
  { cors: true, region: "asia-east1", invoker: "public", maxInstances: 3, timeoutSeconds: 20, memory: "256MiB", concurrency: 20 },
  async (req, res) => {
    try {
      if (req.method !== "POST") { res.status(405).json({ ok: false, error: "method_not_allowed" }); return; }
      const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      if (!idToken) { res.status(401).json({ ok: false, error: "missing_auth", reason: "請重新登入。" }); return; }
      let decoded: admin.auth.DecodedIdToken;
      try { decoded = await admin.auth().verifyIdToken(idToken); } catch {
        res.status(401).json({ ok: false, error: "invalid_auth", reason: "登入逾時,請重新整理後再試。" }); return;
      }
      const uid = decoded.uid;
      if (!uid || uid.startsWith("$RCAnonymousID") || decoded.firebase?.sign_in_provider === "anonymous") {
        res.status(403).json({ ok: false, error: "login_required", reason: "請用 Google/Apple 帳號登入。" }); return;
      }

      const u = (await db.doc(`users/${uid}`).get()).data() || {};
      const code = String(u.kol_code || "");
      if (!/^[A-Z0-9]{1,16}$/.test(code)) { res.status(403).json({ ok: false, error: "no_code", reason: "這個帳號還沒有推薦碼。" }); return; }
      const ref = db.doc(`ref_codes/${code}`);
      const ex = (await ref.get()).data();
      if (!ex || ex.owner_uid !== uid) {
        console.warn("[partnerUpdatePayout] owner mismatch", { uid, code, owner: ex?.owner_uid });
        res.status(403).json({ ok: false, error: "not_owner", reason: "這個推薦碼不屬於這個帳號。" }); return;
      }
      if (ex.status === "suspended") { res.status(403).json({ ok: false, error: "suspended", reason: "合作資格已暫停,請聯絡我們。" }); return; }

      const body = req.body || {};
      const method = ["bank", "paypal"].includes(body.payout_method) ? String(body.payout_method) : "";
      if (!method) { res.status(400).json({ ok: false, error: "bad_method", reason: "請選收款方式。" }); return; }
      const account = strip(body.payout_account, 120);
      if (!account) { res.status(400).json({ ok: false, error: "bad_account", reason: "請填收款帳號 / PayPal Email。" }); return; }
      if (method === "paypal" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account)) {
        res.status(400).json({ ok: false, error: "bad_paypal", reason: "PayPal 請填 Email。" }); return;
      }
      if (method === "bank" && !/^[0-9][0-9 -]{5,30}$/.test(account)) {
        res.status(400).json({ ok: false, error: "bad_bank_account", reason: "銀行帳號請填數字(可含空白或 -)。" }); return;
      }
      const payout = {
        method,
        account,
        bank: method === "bank" ? strip(body.payout_bank, 80) : "",
        name: method === "bank" ? strip(body.payout_name, 60) : "",
        updated_at: Date.now(),
      };
      await ref.set({ payout }, { merge: true });
      console.log("[partnerUpdatePayout] saved", { code, method });
      res.json({ ok: true, payout });
    } catch (err) {
      console.error("partnerUpdatePayout error:", err);
      res.status(500).json({ ok: false, error: "internal", reason: "伺服器錯誤,請稍後再試。" });
    }
  },
);
