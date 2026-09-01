// HTTP function:自助成為 KOL / 合作夥伴 — 登入後一鍵取得專屬 KOL 分潤碼。
// ref_codes 只有 admin 能寫,所以走這支(Admin SDK)發碼。冪等:已有就回既有。
// 與「個人推薦碼(type:user,+7/+7)」分開:這是 type:'kol' 抽成碼,綁 owner_uid。
// 需登入(idToken)+ 明確同意合作條款(agree=true)。分潤精算/付款走後台,這裡只發碼+存收款/同意。
//
// 自訂碼(desired_code):KOL 可自選好記的碼(像 DOUBLEOJ / OJ888,不用隨機難打的 z2kef4)。
//   - 唯一性/格式/保留字全在伺服器端驗(Admin SDK),防搶佔用 transaction 原子建立。
//   - 已有碼想換:只在「碼還沒被任何人用過」時允許(users.ref_code / commissions.code 各查一筆),
//     以免既有連結失效;舊碼保留設 active:false + renamed_to(不刪,零資料遺失風險)。
import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

if (admin.apps.length === 0) admin.initializeApp();
const db = admin.firestore();

// 新加入 KOL 的預設抽成。2026-09 起新申請一律 10%(原 20% 太高)。
// 既有 KOL 不受影響:他們的 commission_pct 在建碼當下就寫死存進 ref_codes/{code},
// 精算引擎(utils/firestore.ts)照該碼存的值算,不看這個 default;
// 且引擎 fallback 仍保留 20,保護任何漏存欄位的舊碼(含探長J/英文探探長等)。
const DEFAULT_COMMISSION_PCT = 10;
const TERMS_VERSION = "2026-07-10";

// 保留字(系統/官方語意)不給搶;粗俗字最小黑名單(自助發碼、綁身分,風險低,後台仍可覆核)
const RESERVED = new Set([
  "ADMIN", "STAYJP", "STAY", "OFFICIAL", "SYSTEM", "ROOT", "TEST", "NULL", "UNDEFINED",
  "JLPT", "FREE", "PREMIUM", "SUPPORT", "HELP", "LOGIN", "SIGNUP", "STAFF", "MODERATOR",
]);
const BLOCKED = ["FUCK", "SHIT", "SEX", "PORN", "NIGGER", "BITCH", "CUNT"];

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
// 統一大寫、只留英數,最多 16 碼(好記但不至於太短撞光)
function normalizeCode(raw: unknown): string {
  return String(raw || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 16);
}
// 回傳問題訊息(給前端顯示),null = OK
function codeIssue(code: string): string | null {
  if (!/^[A-Z0-9]{4,16}$/.test(code)) return "推薦碼需為 4–16 碼英文或數字(不含空白/符號)。";
  if (RESERVED.has(code)) return "這是保留字,請換一個。";
  for (const w of BLOCKED) if (code.includes(w)) return "推薦碼含不允許的字詞,請換一個。";
  return null;
}
// 原子搶碼:transaction 內確認不存在才建立,防兩人同時選到同一個碼
async function claimCode(code: string, data: admin.firestore.DocumentData): Promise<boolean> {
  return db.runTransaction(async (tx) => {
    const ref = db.doc(`ref_codes/${code}`);
    const snap = await tx.get(ref);
    if (snap.exists) return false;
    tx.set(ref, data);
    return true;
  });
}

export const partnerJoin = functions.onRequest(
  { cors: true, region: "asia-east1", invoker: "public", maxInstances: 3, timeoutSeconds: 20, memory: "256MiB", concurrency: 20 },
  async (req, res) => {
    try {
      const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      if (!idToken) { res.status(401).json({ error: "missing_auth" }); return; }
      // 驗證失敗是「授權問題」→ 回 401,不要當成 500 內部錯誤(防呆:壞/過期 token 有明確語意)
      let decoded: admin.auth.DecodedIdToken;
      try {
        decoded = await admin.auth().verifyIdToken(idToken);
      } catch {
        res.status(401).json({ error: "invalid_auth" });
        return;
      }
      const uid = decoded.uid;
      // 防呆:匿名 / 非正常帳號不得申請(避免拋棄式帳號批量刷碼)
      if (!uid || typeof uid !== "string" || uid.startsWith("$RCAnonymousID") || decoded.firebase?.sign_in_provider === "anonymous") {
        res.status(403).json({ error: "login_required", reason: "請用 Google/Apple 帳號登入後再加入。" });
        return;
      }

      const body = req.body || {};
      const agree = body.agree === true || body.agree === "true";
      const desiredRaw = body.desired_code;
      const desired = normalizeCode(desiredRaw);
      const wantsCustom = desiredRaw != null && String(desiredRaw).trim() !== "";

      const userRef = db.doc(`users/${uid}`);
      const u = (await userRef.get()).data() || {};

      // ── 已有 KOL 碼 ──
      if (u.kol_code) {
        const exRef = db.doc(`ref_codes/${u.kol_code}`);
        const ex = (await exRef.get()).data() || {};
        if (ex.status === "suspended") { res.status(403).json({ error: "suspended", reason: "你的合作資格已被暫停,請聯絡我們。" }); return; }

        // 想改成新的自訂碼(且與現有不同)→ 只在「舊碼從未被使用」時允許
        if (wantsCustom && desired && desired !== u.kol_code) {
          const issue = codeIssue(desired);
          if (issue) { res.status(400).json({ error: "code_invalid", reason: issue }); return; }

          // 舊碼是否已有人用(歸因用戶 / 分潤紀錄)→ 有就不給改,避免既有連結失效
          const [usersUsing, commUsing] = await Promise.all([
            db.collection("users").where("ref_code", "==", u.kol_code).limit(1).get(),
            db.collection("commissions").where("code", "==", u.kol_code).limit(1).get(),
          ]);
          if (!usersUsing.empty || !commUsing.empty) {
            res.status(409).json({ error: "code_in_use", reason: "你的推薦碼已經有人使用/已有分潤紀錄,不能更改(否則現有連結會失效)。" });
            return;
          }

          // 原子搶新碼,沿用舊碼的 token/抽成/收款等資料
          const newData = {
            ...ex,
            type: "kol",
            owner_uid: uid,
            active: true,
            token: ex.token || genToken(),
            commission_pct: ex.commission_pct ?? DEFAULT_COMMISSION_PCT,
            renamed_from: u.kol_code,
            renamed_at: admin.firestore.FieldValue.serverTimestamp(),
            created_at: ex.created_at || admin.firestore.FieldValue.serverTimestamp(),
          };
          delete (newData as Record<string, unknown>).status;
          delete (newData as Record<string, unknown>).renamed_to;
          const ok = await claimCode(desired, newData);
          if (!ok) { res.status(409).json({ error: "code_taken", reason: "這個推薦碼已被使用,請換一個。" }); return; }

          // 舊碼不刪:標記停用 + 指向新碼(萬一有殘留連結不會 orphan)
          await exRef.set({ active: false, renamed_to: desired, renamed_at: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
          await userRef.set({ kol_code: desired }, { merge: true });
          res.json({ code: desired, token: newData.token, commission_pct: newData.commission_pct, renamed: true });
          return;
        }

        // 否則冪等:回既有碼
        res.json({ code: u.kol_code, token: ex.token || "", commission_pct: ex.commission_pct ?? DEFAULT_COMMISSION_PCT });
        return;
      }

      // ── 首次加入 ──
      // 首次加入必須同意條款
      if (!agree) { res.status(400).json({ error: "must_agree_terms" }); return; }

      // 顯示名稱 / 平台 / 收款方式(選填,之後可在後台補;金額大時才需身分資料)
      const strip = (x: string) => x.replace(/[<>]/g, "");   // 縱深防禦:去掉角括號,後台顯示不會被當標籤(XSS)
      const displayName = strip(String(body.name || "").slice(0, 60));
      const platform = strip(String(body.platform || "").slice(0, 200));
      const payoutMethod = ["bank", "paypal"].includes(body.payout_method) ? body.payout_method : "";
      const payoutAccount = strip(String(body.payout_account || "").slice(0, 120));
      const token = genToken();
      const baseData = {
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
      };

      let code = "";
      if (wantsCustom) {
        // 自選碼:先驗格式/保留字,再原子搶碼;被用走就回明確錯誤讓前端換一個
        const issue = codeIssue(desired);
        if (issue) { res.status(400).json({ error: "code_invalid", reason: issue }); return; }
        const ok = await claimCode(desired, baseData);
        if (!ok) { res.status(409).json({ error: "code_taken", reason: "這個推薦碼已被使用,請換一個。" }); return; }
        code = desired;
      } else {
        // 沒指定 → 產唯一隨機碼(撞碼重生)
        for (let i = 0; i < 6; i++) {
          const cand = genCode();
          if (await claimCode(cand, baseData)) { code = cand; break; }
        }
        if (!code) { res.status(500).json({ error: "gen_failed" }); return; }
      }
      await userRef.set({ kol_code: code }, { merge: true });

      res.json({ code, token, commission_pct: DEFAULT_COMMISSION_PCT });
    } catch (err) {
      console.error("partnerJoin error:", err);
      res.status(500).json({ error: "internal", message: String(err) });
    }
  },
);
