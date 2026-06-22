// HTTP function:登入用戶第一次要開「3 天免費試用」時呼叫。
//
// 為什麼要後端(取代前端直接寫 trial_started_at):
//   - 前端寫 = 刪帳號重辦新帳號就能無限續試用。改由後端「以 email 記錄誰用過試用」,
//     同一個 email(含 gmail 去點/去 +別名 正規化)用過就不再給 → 重辦同信箱無效。
//   - 配合 Firestore 規則鎖死 trial_started_at 只能後端寫 → 前端跳不掉。
//
// 流程:驗 idToken 取 uid+email → 正規化 email → transaction 查 trial_used/{key}:
//        沒用過 → 記錄 + 寫 users/{uid}.trial_started_at(serverTimestamp)+ 回 eligible:true;
//        用過   → 不發 + 回 eligible:false。

import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

if (admin.apps.length === 0) admin.initializeApp();

// gmail 會忽略「點」與「+別名」→ 正規化掉,避免 a.b+1@gmail / ab@gmail 被當不同人鑽試用。
// 其他網域只去 +別名(常見拋棄式手法)。
function normalizeEmail(email: string): string {
  const e = String(email || "").trim().toLowerCase();
  const at = e.indexOf("@");
  if (at < 0) return e;
  let local = e.slice(0, at);
  let domain = e.slice(at + 1);
  local = local.split("+")[0];
  if (domain === "gmail.com" || domain === "googlemail.com") {
    local = local.replace(/\./g, "");
    domain = "gmail.com";
  }
  return local + "@" + domain;
}

// Firestore doc id 不能含 "/";email 不會有,但保險再 encode 一層特殊字元。
function emailKey(normalized: string): string {
  return encodeURIComponent(normalized);
}

export const startTrial = functions.onRequest(
  {
    cors: true,
    region: "asia-east1",
    invoker: "public",
    maxInstances: 10,
    timeoutSeconds: 20,
    memory: "256MiB",
    concurrency: 40,
  },
  async (req, res) => {
    try {
      const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      if (!idToken) { res.status(401).json({ error: "missing_auth" }); return; }
      const decoded = await admin.auth().verifyIdToken(idToken);
      const uid = decoded.uid;
      // email 從 token 取(Google/Apple/Email 登入都有;Apple 私密轉發也算一個穩定 key);
      // 真的沒 email → 退而用 uid 當 key(至少同帳號不會重複給)。
      const rawEmail = decoded.email || "";
      const key = rawEmail ? emailKey(normalizeEmail(rawEmail)) : "uid:" + uid;

      const db = admin.firestore();
      const usedRef = db.doc("trial_used/" + key);
      const userRef = db.doc("users/" + uid);

      const result = await db.runTransaction(async (tx) => {
        const used = await tx.get(usedRef);
        const userSnap = await tx.get(userRef);
        const userData = userSnap.data() || {};

        // 已是付費 → 不需要試用
        const sub = userData.subscription as { status?: string; expiresAt?: number } | undefined;
        const isPremium = !!sub && (sub.status === "active" || sub.status === "cancelled")
          && (sub.expiresAt || 0) > Date.now();
        if (isPremium) return { eligible: false, reason: "premium" };

        // 這個 uid 自己已經有試用起始 → 沿用,不重發
        if (userData.trial_started_at) return { eligible: true, reason: "existing" };

        // 這個 email 已經用過試用(可能是別的 uid)→ 重辦同信箱無效
        if (used.exists) return { eligible: false, reason: "email_used" };

        // 沒用過 → 發試用 + 記錄 email
        const ts = admin.firestore.FieldValue.serverTimestamp();
        tx.set(userRef, { trial_started_at: ts }, { merge: true });
        tx.set(usedRef, { uid, email: rawEmail || null, started_at: ts });
        return { eligible: true, reason: "granted" };
      });

      res.json({ ok: true, ...result });
    } catch (err) {
      console.error("startTrial error:", err);
      res.status(500).json({ error: "internal", message: String(err) });
    }
  },
);
