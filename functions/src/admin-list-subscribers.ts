// HTTP function:owner 後台列出所有訂閱者(看訂閱資料用)
//
// 嚴格 owner only。查 users 集合中有 subscription 的文件,補上 email(從 Auth)。
// 規模小(launch 期訂閱者不多),逐筆查 Auth email 即可。

import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { db } from "./utils/firestore";

if (admin.apps.length === 0) admin.initializeApp();

const OWNER_EMAILS = new Set(["stayjpplan@gmail.com", "abc83327@gmail.com"]);

export const adminListSubscribers = functions.onRequest(
  {
    cors: true,
    region: "asia-east1",
    invoker: "public",
    maxInstances: 2,
    timeoutSeconds: 60,
    memory: "512MiB",
    concurrency: 10,
  },
  async (req, res) => {
    try {
      const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      if (!idToken) { res.status(401).json({ error: "missing_auth" }); return; }
      const decoded = await admin.auth().verifyIdToken(idToken);
      if (!OWNER_EMAILS.has(decoded.email || "") || decoded.email_verified !== true) { res.status(403).json({ error: "not_owner" }); return; }

      const snap = await db.collection("users")
        .where("subscription.status", "in", ["active", "trialing", "cancelled", "refunded", "expired"])
        .limit(500).get();

      // email 反查改批次 getUsers(每批 100):原本 500 個逐一 getUser,高記憶體+慢 → OOM(2026-08-20 爆過)
      const docsOk = snap.docs.filter((doc) => !doc.id.startsWith("$RCAnonymousID"));
      const emailMap = new Map<string, string>();
      for (let i = 0; i < docsOk.length; i += 100) {
        try {
          const batch = await admin.auth().getUsers(docsOk.slice(i, i + 100).map((doc) => ({ uid: doc.id })));
          batch.users.forEach((u) => emailMap.set(u.uid, u.email || ""));
        } catch { /* 整批失敗就留空 email,不擋清單 */ }
      }
      const subscribers = (await Promise.all(docsOk.map(async (doc) => {
        const d = doc.data();
        const s = (d.subscription || {}) as Record<string, unknown>;
        const email = emailMap.get(doc.id) || "";
        return {
          uid: doc.id,
          email,
          plan: s.plan || "",
          status: s.status || "",
          source: s.source || "",
          expiresAt: s.expiresAt || null,
          startedAt: s.startedAt || null,
          is_early_bird: s.is_early_bird === true,
          is_gift: s.is_gift === true,          // 手動贈送(0元)→ 後台顯示「贈送」、不計入付費客戶
          is_sandbox: s.is_sandbox === true,    // 沙盒測試購買(非真實付款)→ 後台區分測試/真實
          willRenew: s.willRenew === true,
          ecpay_order: s.ecpay_order || null,   // 有=綠界定期定額;無=手動/PayPal(報表用來區分付款方式)
          ref_code: d.ref_code || "",           // KOL 推薦碼歸因(首次點擊寫入 users/{uid}.ref_code)
        };
      }))).filter((x): x is NonNullable<typeof x> => x !== null);

      // 依到期日新到舊排序
      subscribers.sort((a, b) => (Number(b.expiresAt) || 0) - (Number(a.expiresAt) || 0));

      // 推薦碼身分對照(碼 → KOL 名/用戶碼):後台歸因欄顯示用
      const codes = [...new Set(subscribers.map((x) => x.ref_code).filter(Boolean))] as string[];
      const refMap: Record<string, { type: string; kol: string }> = {};
      if (codes.length) {
        const snaps = await db.getAll(...codes.map((c) => db.doc("ref_codes/" + c)));
        snaps.forEach((sn) => { if (sn.exists) { const c = sn.data() || {}; refMap[sn.id] = { type: String(c.type || "kol"), kol: String(c.kol || "") }; } });
      }

      res.json({ ok: true, count: subscribers.length, subscribers, ref_map: refMap });
    } catch (err) {
      console.error("adminListSubscribers error:", err);
      res.status(500).json({ error: "internal", message: String(err) });
    }
  },
);
