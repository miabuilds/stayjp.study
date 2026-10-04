// KOL 推薦連結追蹤:
//   refClick         — ?ref=CODE 落地時前端打一發(sendBeacon),記點擊數(同 IP + 同碼 30 分鐘只算一次)
//   claimRefByIp     — 新帳號登入後(App WebView / 換瀏覽器,localStorage 帶不過去),用「同 IP 剛點過的連結」自動補歸因
//   refClickCleanup  — 每天清 48 小時前的 ref_clicks
//
// 隱私:原始 IP 從不寫入。ref_clicks 只存 ipHash = sha256(salt + ip),salt 存在 config/ref_salt(firestore.rules 全拒,
// 只有 Admin SDK 讀得到),且 ref_clicks 48 小時後由 refClickCleanup 刪除 —— 只為了「剛點完連結去 App 註冊」這段配對。
// 決策邏輯都在 utils/ref-attrib.ts(純函式,scripts/test-ref-attrib.cjs 有測)。

import * as https from "firebase-functions/v2/https";
import * as scheduler from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import crypto from "crypto";
import { db, FieldValue } from "./utils/firestore";
import { isCampaignRefCode } from "./utils/constants";
import {
  CodeInfo, CLICK_DEDUPE_MS, CLICK_RETENTION_MS, MATCH_WINDOW_MS,
  clientIp, decideIpMatch, hashIp, normCode, normPlat, shouldCountClick, twDateKey,
} from "./utils/ref-attrib";

if (admin.apps.length === 0) admin.initializeApp();

const CORS = [/^https:\/\/stayjp\.study$/, /^http:\/\/localhost(:\d+)?$/, /^http:\/\/127\.0\.0\.1(:\d+)?$/];

// 鹽:第一次用到才建(crypto.randomBytes),之後整個 instance 快取。create() 撞到別人先建 → 讀回來用同一把。
let _salt = "";
async function getSalt(): Promise<string> {
  if (_salt) return _salt;
  const ref = db.doc("config/ref_salt");
  const snap = await ref.get();
  let s = snap.exists ? String(snap.data()?.salt || "") : "";
  if (!s) {
    const fresh = crypto.randomBytes(32).toString("hex");
    try { await ref.create({ salt: fresh, created_at: Date.now() }); s = fresh; }
    catch { s = String((await ref.get()).data()?.salt || ""); }
  }
  if (!s) throw new Error("ref_salt unavailable");
  _salt = s;
  return s;
}

function parseBody(req: https.Request): Record<string, unknown> {
  // sendBeacon 送 text/plain(避開 CORS 預檢)→ body 可能是字串;fetch JSON 則已解析成物件
  const b = req.body;
  if (b && typeof b === "object" && !Buffer.isBuffer(b)) return b as Record<string, unknown>;
  const s = Buffer.isBuffer(b) ? b.toString("utf8") : (typeof b === "string" ? b : (req.rawBody ? req.rawBody.toString("utf8") : ""));
  try { const j = JSON.parse(s || "{}"); return j && typeof j === "object" ? j : {}; } catch { return {}; }
}

export const refClick = https.onRequest(
  { cors: CORS, region: "asia-east1", invoker: "public", maxInstances: 5, timeoutSeconds: 10, memory: "256MiB", concurrency: 40 },
  async (req, res) => {
    // fail-soft:任何錯都回 204,前端本來就不看回應
    try {
      if (req.method !== "POST") { res.status(204).end(); return; }
      const body = parseBody(req);
      const code = normCode(body.code);
      const plat = normPlat(body.plat);
      const ip = clientIp(req.headers["x-forwarded-for"], req.ip);
      if (!code || !ip) { res.status(204).end(); return; }

      const cref = db.doc(`ref_codes/${code}`);
      const csnap = await cref.get();
      const c = csnap.data();
      if (!csnap.exists || !c || c.active === false || c.status === "suspended") { res.status(204).end(); return; }

      const ipHash = hashIp(await getSalt(), ip);
      const now = Date.now();
      // 去重:同 ipHash 單欄位查(自動索引),碼/時間在記憶體篩
      const prev = await db.collection("ref_clicks").where("ipHash", "==", ipHash).limit(300).get();
      const rows = prev.docs.map((d) => ({ code: String(d.get("code") || ""), ts: Number(d.get("ts") || 0) }))
        .filter((r) => now - r.ts < CLICK_DEDUPE_MS);
      if (!shouldCountClick(rows, code, now)) { res.status(204).end(); return; }

      // 活動碼(官方/限期)照算點擊,但標 campaign:true,IP 歸因會排除
      const batch = db.batch();
      batch.set(db.collection("ref_clicks").doc(), { code, ipHash, plat, ts: now, campaign: isCampaignRefCode(c) });
      batch.set(cref, { clicks: FieldValue.increment(1), clicks_by_day: { [twDateKey(now)]: FieldValue.increment(1) } }, { merge: true });
      await batch.commit();
      res.status(204).end();
    } catch (err) {
      console.warn("refClick soft-fail:", err);
      res.status(204).end();
    }
  },
);

export const claimRefByIp = https.onRequest(
  { cors: CORS, region: "asia-east1", invoker: "public", maxInstances: 3, timeoutSeconds: 15, memory: "256MiB", concurrency: 20 },
  async (req, res) => {
    try {
      if (req.method !== "POST") { res.status(405).json({ ok: false, reason: "method" }); return; }
      const idToken = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      if (!idToken) { res.status(401).json({ ok: false, reason: "missing_auth" }); return; }
      const uid = (await admin.auth().verifyIdToken(idToken)).uid;
      const body = parseBody(req);
      const plat = normPlat(body.plat);
      const now = Date.now();

      const uref = db.doc(`users/${uid}`);
      const u = (await uref.get()).data() || {};
      const creationMs = Date.parse((await admin.auth().getUser(uid)).metadata.creationTime || "") || 0;

      // 先用便宜的條件擋掉(已有碼 / 舊帳號)再去讀點擊
      const pre = decideIpMatch({ uid, hasRef: !!u.ref_code, creationMs, now, plat, clicks: [], codes: {} });
      if (!pre.ok && pre.reason !== "no_match") { res.json({ ok: false, reason: pre.reason }); return; }

      const ip = clientIp(req.headers["x-forwarded-for"], req.ip);
      if (!ip) { res.json({ ok: false, reason: "no_match" }); return; }
      const ipHash = hashIp(await getSalt(), ip);
      const snap = await db.collection("ref_clicks").where("ipHash", "==", ipHash).limit(300).get();
      const lo = Math.max(now, creationMs) - 2 * MATCH_WINDOW_MS;   // 粗篩,精確判斷在 decideIpMatch
      const clicks = snap.docs.map((d) => ({ code: String(d.get("code") || ""), ts: Number(d.get("ts") || 0), plat: String(d.get("plat") || "") }))
        .filter((c) => /^[A-Z0-9_-]{1,32}$/.test(c.code) && c.ts >= lo);

      const codes: Record<string, CodeInfo> = {};
      for (const code of [...new Set(clicks.map((c) => c.code))].slice(0, 10)) {
        const cd = await db.doc(`ref_codes/${code}`).get();
        const x = cd.data();
        codes[code] = {
          exists: cd.exists && !!x,
          campaign: isCampaignRefCode(x),
          owner_uid: x?.owner_uid, active: x?.active, status: x?.status,
          expires_at: typeof x?.expires_at === "number" ? x.expires_at : undefined,
        };
      }
      // 防自我推薦:帳上自己的個人碼 / KOL 碼也排除(owner_uid 之外再擋一層)
      for (const own of [u.my_ref_code, u.kol_code]) if (typeof own === "string" && codes[own]) codes[own].owner_uid = uid;

      const r = decideIpMatch({ uid, hasRef: !!u.ref_code, creationMs, now, plat, clicks, codes });
      if (!r.ok) { res.json({ ok: false, reason: r.reason }); return; }

      const wrote = await db.runTransaction(async (tx) => {
        const cur = await tx.get(uref);
        if (cur.exists && cur.data()?.ref_code) return false;   // 期間被別的路徑寫了 → 首次歸因為準
        tx.set(uref, { ref_code: r.code, ref_at: Date.now(), ref_source: "ip_match" }, { merge: true });
        return true;
      });
      console.log(`[claimRefByIp] uid=${uid} plat=${plat} → ${wrote ? r.code : "has_ref(race)"}`);
      res.json(wrote ? { ok: true } : { ok: false, reason: "has_ref" });
    } catch (err) {
      console.error("claimRefByIp error:", err);
      res.status(500).json({ ok: false, reason: "internal" });
    }
  },
);

export const refClickCleanup = scheduler.onSchedule(
  { schedule: "every day 04:30", timeZone: "Asia/Taipei", region: "asia-east1", maxInstances: 1, timeoutSeconds: 300, memory: "256MiB" },
  async () => {
    // ts 單欄位範圍查詢(自動索引)。IP 只以雜湊存在 ref_clicks,48 小時後刪除。
    const cutoff = Date.now() - CLICK_RETENTION_MS;
    let total = 0;
    for (let round = 0; round < 50; round++) {
      const snap = await db.collection("ref_clicks").where("ts", "<", cutoff).limit(400).get();
      if (snap.empty) break;
      const batch = db.batch();
      snap.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();
      total += snap.size;
      if (snap.size < 400) break;
    }
    console.log(`[refClickCleanup] 刪除 ${total} 筆 ref_clicks(早於 48h)`);
  },
);
