// 伺服器推播(2026-11,照 StayTW staytw-api 的 /api/push/* 搬到 Firebase):
//   pushRegister    App 登記 Expo push token(公開、不綁帳號;只收 token/平台/語言/版本)
//   adminPushStats  owner:各語言 × 平台的裝置數 + 最近 20 筆發送紀錄
//   adminPushSend   owner:依裝置登記的語言發對應那則通知
//
// 資料:push_tokens/{token}、push_log/{id}。firestore.rules 沒有開這兩個集合(落到預設拒絕),
// 前端一律讀寫不到,只有這裡(Admin SDK)能碰。查詢都只用單一欄位,不需要新增複合索引。
//
// 發送走 Expo Push API(https://exp.host/--/api/v2/push/send),每批 100 支;不需要任何金鑰。

import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import crypto from "crypto";
import axios from "axios";
import { ADMIN_CORS } from "./utils/constants";
import { db } from "./utils/firestore";
import { OWNER_EMAILS } from "./admin-user-stats";   // owner 白名單只有那一份,這裡不另外抄

if (admin.apps.length === 0) admin.initializeApp();

const TOKEN_RE = /^Expo(nent)?PushToken\[[A-Za-z0-9_-]{10,80}\]$/;
const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";
const SITE = "https://stayjp.study/";
const CHANNEL_ID = "daily-reminder";   // 與 App src/lib/notifications.ts 的 CHANNEL_ID 一致(Android 頻道)
const PAGE = 4000;                     // 一次呼叫最多處理幾支;回 next 不是 null 就帶 after 繼續
const DUP_WINDOW_MS = 10 * 60 * 1000;

const tokens = () => db.collection("push_tokens");
const logs = () => db.collection("push_log");

export const pushRegister = functions.onRequest(
  { cors: true, region: "asia-east1", invoker: "public", maxInstances: 5, timeoutSeconds: 30, memory: "256MiB", concurrency: 40 },
  async (req, res) => {
    try {
      if (req.method !== "POST") { res.status(405).json({ error: "method_not_allowed" }); return; }
      const b = (req.body && typeof req.body === "object") ? req.body as Record<string, unknown> : {};
      const token = String(b.token || "");
      if (!TOKEN_RE.test(token)) { res.status(400).json({ error: "bad_token" }); return; }
      const platform = b.platform === "ios" || b.platform === "android" ? b.platform : "";
      const lang = String(b.lang || "").slice(0, 8);
      const version = String(b.version || "").slice(0, 16);
      const now = Date.now();
      // 帶了登入的 idToken 且是 owner → 標 admin:true,後台「先發給我自己」只發這些裝置。一般使用者不記帳號。
      let isAdmin = false;
      const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      if (idToken) {
        try { const d = await admin.auth().verifyIdToken(idToken); isAdmin = OWNER_EMAILS.has(d.email || "") && d.email_verified === true; }
        catch { /* 過期或無效就當一般裝置 */ }
      }
      const ref = tokens().doc(token);
      const snap = await ref.get();
      if (snap.exists) await ref.update({ platform, lang, version, admin: isAdmin, updated_at: now });
      else await ref.set({ platform, lang, version, admin: isAdmin, created_at: now, updated_at: now });
      res.json({ ok: true });
    } catch (err) {
      console.error("pushRegister error:", err);
      res.status(500).json({ error: "internal" });
    }
  },
);

/** owner 驗證(與其他 admin* 函式同一套:Bearer idToken + 白名單 email + email_verified)。不通過時已回應,回 null。 */
async function requireOwner(req: functions.Request, res: { status: (n: number) => { json: (b: unknown) => void } }): Promise<admin.auth.DecodedIdToken | null> {
  const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!idToken) { res.status(401).json({ error: "missing_auth" }); return null; }
  let decoded: admin.auth.DecodedIdToken;
  try { decoded = await admin.auth().verifyIdToken(idToken); }
  catch { res.status(401).json({ error: "invalid_auth" }); return null; }
  if (!OWNER_EMAILS.has(decoded.email || "") || decoded.email_verified !== true) { res.status(403).json({ error: "not_owner" }); return null; }
  return decoded;
}

export const adminPushStats = functions.onRequest(
  { cors: ADMIN_CORS, region: "asia-east1", invoker: "public", maxInstances: 2, timeoutSeconds: 120, memory: "256MiB", concurrency: 10 },
  async (req, res) => {
    try {
      if (!(await requireOwner(req, res))) return;
      // 只取 lang/platform 兩欄來數(不把整份文件拉下來)
      const snap = await tokens().select("lang", "platform").get();
      const tally = new Map<string, number>();
      snap.forEach((d) => {
        const k = `${String(d.get("lang") || "")}|${String(d.get("platform") || "")}`;
        tally.set(k, (tally.get(k) || 0) + 1);
      });
      const byLang = [...tally.entries()]
        .map(([k, n]) => { const [lang, platform] = k.split("|"); return { lang, platform, n }; })
        .sort((a, b) => b.n - a.n);
      const logSnap = await logs().orderBy("ts", "desc").limit(20).get();
      const log = logSnap.docs.map((d) => {
        const x = d.data();
        return { id: d.id, ts: x.ts, payload: x.payload, sent: x.sent || 0, failed: x.failed || 0, removed: x.removed || 0 };
      });
      const mine = await tokens().where("admin", "==", true).limit(50).get();
      res.json({ total: snap.size, byLang, adminDevices: mine.size, log });
    } catch (err) {
      console.error("adminPushStats error:", err);
      res.status(500).json({ error: "internal", message: String(err) });
    }
  },
);

type Msg = { title: string; body: string };
type Ticket = { status?: string; details?: { error?: string } };

// body: { messages: { "zh-TW": {title, body}, en: {...}, ko: {...}, ... }, fallback: "zh-TW", url?, only_token?, force?, after? }
//   ・語言鍵 = App 登記的介面語言(zh-TW / zh-CN / en / ko / vi / id / th)。
//     每支裝置拿它那個語言的那則;沒有 → 簡中先退繁中(有的話)→ 再退 fallback 那則
//   ・only_token:只發給這一支(正式發之前先發給自己看);不寫發送紀錄、不受重複保護
//   ・同一份內容 10 分鐘內不能發第二次(防手滑連按);真的要重發帶 force:true
//   ・一次最多處理 4000 支;回 next 不是 null 就帶 after 繼續
//   ・url:點通知後 App 內要開的頁面,只收 https://stayjp.study/ 開頭
export const adminPushSend = functions.onRequest(
  { cors: ADMIN_CORS, region: "asia-east1", invoker: "public", maxInstances: 1, timeoutSeconds: 300, memory: "256MiB", concurrency: 1 },
  async (req, res) => {
    try {
      if (req.method !== "POST") { res.status(405).json({ error: "method_not_allowed" }); return; }
      if (!(await requireOwner(req, res))) return;
      const b = (req.body && typeof req.body === "object") ? req.body as Record<string, unknown> : {};

      const msgs: Record<string, Msg> = {};
      for (const [k, v] of Object.entries((b.messages && typeof b.messages === "object") ? b.messages as Record<string, unknown> : {})) {
        const m = (v && typeof v === "object") ? v as Record<string, unknown> : {};
        const title = String(m.title || "").trim().slice(0, 80);
        const body = String(m.body || "").trim().slice(0, 240);
        if (body) msgs[String(k).slice(0, 8)] = { title, body };
      }
      const fallback = (typeof b.fallback === "string" && msgs[b.fallback]) ? b.fallback : Object.keys(msgs)[0];
      if (!fallback) { res.status(400).json({ error: "no_message" }); return; }
      const link = typeof b.url === "string" && b.url.startsWith(SITE) ? b.url : "";
      const onlyAdmin = b.only_admin === true;   // 只發給 owner 自己登入的裝置(正式發之前先看實際長相)
      const only = onlyAdmin ? "admin" : (typeof b.only_token === "string" ? b.only_token : "");
      if (only && !onlyAdmin && !TOKEN_RE.test(only)) { res.status(400).json({ error: "bad_token" }); return; }
      const after = typeof b.after === "string" ? b.after : "";

      const hashSrc = JSON.stringify([msgs, link]);
      const hash = crypto.createHash("sha256").update(hashSrc).digest("base64url").slice(0, 22);
      const now = Date.now();

      // 重複保護 + 先佔一筆發送紀錄(同一個 transaction:連按兩下時第二個請求會看到第一個剛寫的那筆)
      let logRef: FirebaseFirestore.DocumentReference | null = null;
      if (!only) {
        const ref = logs().doc();
        const dup = await db.runTransaction(async (tx) => {
          if (!after && b.force !== true) {
            const same = await tx.get(logs().where("hash", "==", hash));
            if (same.docs.some((d) => Number(d.get("ts") || 0) > now - DUP_WINDOW_MS)) return true;
          }
          tx.set(ref, { ts: now, hash, payload: hashSrc.slice(0, 4000), sent: 0, failed: 0, removed: 0, done: false });
          return false;
        });
        if (dup) { res.status(409).json({ error: "duplicate", hint: "同一則 10 分鐘內發過了" }); return; }
        logRef = ref;
      }

      let rows: { token: string; lang: string }[];
      if (onlyAdmin) {
        rows = (await tokens().where("admin", "==", true).limit(50).get()).docs.map((d) => ({ token: d.id, lang: String(d.get("lang") || "") }));
      } else if (only) {
        const d = await tokens().doc(only).get();
        rows = d.exists ? [{ token: d.id, lang: String(d.get("lang") || "") }] : [];
      } else {
        let q = tokens().orderBy(admin.firestore.FieldPath.documentId()).select("lang").limit(PAGE);
        if (after) q = q.startAfter(after);
        rows = (await q.get()).docs.map((d) => ({ token: d.id, lang: String(d.get("lang") || "") }));
      }

      let sent = 0, failed = 0;
      const dead: string[] = [];
      for (let i = 0; i < rows.length; i += 100) {
        const chunk = rows.slice(i, i + 100);
        const batch = chunk.map((r) => {
          const m = msgs[r.lang] || (r.lang === "zh-CN" ? msgs["zh-TW"] : undefined) || msgs[fallback];
          const o: Record<string, unknown> = { to: r.token, body: m.body, sound: "default", channelId: CHANNEL_ID };
          if (m.title) o.title = m.title;
          if (link) o.data = { url: link };
          return o;
        });
        try {
          const er = await axios.post(EXPO_PUSH_URL, batch, {
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            timeout: 20000,
            validateStatus: () => true,
          });
          const tickets: Ticket[] = Array.isArray(er.data?.data) ? er.data.data : [];
          chunk.forEach((r, k) => {
            const tk = tickets[k];
            if (tk && tk.status === "ok") sent++;
            else { failed++; if (tk?.details?.error === "DeviceNotRegistered") dead.push(r.token); }
          });
        } catch {
          failed += chunk.length;
        }
      }

      // 已經移除 App 的裝置:Expo 回 DeviceNotRegistered → 把 token 刪掉,下次不再發
      for (let i = 0; i < dead.length; i += 400) {
        const wb = db.batch();
        dead.slice(i, i + 400).forEach((tk) => wb.delete(tokens().doc(tk)));
        await wb.commit();
      }
      if (logRef) await logRef.update({ sent, failed, removed: dead.length, done: true });

      const next = !only && rows.length === PAGE ? rows[rows.length - 1].token : null;
      res.json({ ok: true, targeted: rows.length, sent, failed, removed: dead.length, next });
    } catch (err) {
      console.error("adminPushSend error:", err);
      res.status(500).json({ error: "internal", message: String(err) });
    }
  },
);
