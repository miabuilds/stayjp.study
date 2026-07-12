// HTTP function:KOL 自助更新自己的收款資料(結算前補齊 / 之後修改)。
// ref_codes 限 admin 寫 → KOL 不能自己寫,走這支(Admin SDK)。
// 只允許改「自己那支 kol 碼」的 payout 欄位,其餘欄位(抽成%、狀態…)一律不動,
// 防呆:停權者不得更新(避免停權後仍操作)、非 kol 碼 / 非碼主一律擋。
import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
// 模組化 FieldValue:functions emulator 會 patch admin.firestore 弄丟靜態 FieldValue,
// 這條 import 不受影響 → emulator/prod 兩邊都穩。
import { FieldValue } from "firebase-admin/firestore";

if (admin.apps.length === 0) admin.initializeApp();
const db = admin.firestore();

export const partnerUpdatePayout = functions.onRequest(
  { cors: true, region: "asia-east1", invoker: "public", maxInstances: 3, timeoutSeconds: 20, memory: "256MiB", concurrency: 20 },
  async (req, res) => {
    try {
      const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      if (!idToken) { res.status(401).json({ error: "missing_auth" }); return; }
      // 壞/過期 token = 授權問題 → 401(不是 500)
      let decoded: admin.auth.DecodedIdToken;
      try {
        decoded = await admin.auth().verifyIdToken(idToken);
      } catch {
        res.status(401).json({ error: "invalid_auth" });
        return;
      }
      const uid = decoded.uid;
      // 防呆:匿名 / 非正常帳號擋掉
      if (!uid || uid.startsWith("$RCAnonymousID") || decoded.firebase?.sign_in_provider === "anonymous") {
        res.status(403).json({ error: "login_required" });
        return;
      }

      const body = req.body || {};
      const method = ["bank", "paypal"].includes(body.payout_method) ? body.payout_method : "";
      const account = String(body.payout_account || "").trim().slice(0, 120);
      const holder = String(body.payout_name || "").trim().slice(0, 60);   // 戶名(銀行轉帳對帳用)
      const bank = String(body.payout_bank || "").trim().slice(0, 80);     // 銀行 / 分行(選填)
      if (!method) { res.status(400).json({ error: "bad_method", reason: "請選銀行轉帳或 PayPal。" }); return; }
      if (!account) { res.status(400).json({ error: "missing_account", reason: "請填收款帳號 / PayPal Email。" }); return; }

      // 找碼主自己的 kol 碼(來源真值 = users/{uid}.kol_code)
      const u = (await db.doc(`users/${uid}`).get()).data() || {};
      const code = u.kol_code;
      if (!code) { res.status(404).json({ error: "no_kol_code", reason: "你還沒加入合作計畫。" }); return; }

      const ref = db.doc(`ref_codes/${code}`);
      const ex = (await ref.get()).data() || {};
      // 二次確認:確實是這位 uid 的 kol 碼(owner 對得上、type=kol),否則不動
      if (ex.type !== "kol" || ex.owner_uid !== uid) { res.status(403).json({ error: "not_owner" }); return; }
      if (ex.status === "suspended") { res.status(403).json({ error: "suspended", reason: "你的合作資格已被暫停,請聯絡我們。" }); return; }

      // 只寫 payout(不碰抽成%、active、status 等敏感欄位)
      await ref.set({
        payout: {
          method,
          account,
          ...(holder ? { name: holder } : {}),
          ...(bank ? { bank } : {}),
          updated_at: FieldValue.serverTimestamp(),
        },
      }, { merge: true });

      res.json({ ok: true, payout: { method, account, name: holder, bank } });
    } catch (err) {
      console.error("partnerUpdatePayout error:", err);
      res.status(500).json({ error: "internal", message: String(err) });
    }
  },
);
