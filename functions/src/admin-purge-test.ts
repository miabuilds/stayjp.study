// HTTP function:owner 一鍵清除「指定測試帳號」的金流資料(安全:只清寫死的 allowlist)
//
// 為什麼寫死 allowlist:後台混了大量真實付費客人,自由輸入 email 刪除風險太高
// (一個 typo 就刪到真客人)。這支只清 TEST_ACCOUNTS 內的帳號,結構上不可能誤刪。
//
// 清:users/{uid}.subscription、該 uid 全部 transactions、paypal_pending(若有)。
// 並順手校正 counters/early_bird = 實際持有早鳥的訂閱數(扣掉測試殘留)。
//
// owner only(verify idToken email)。admin.html 有按鈕。

import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { db } from "./utils/firestore";

if (admin.apps.length === 0) admin.initializeApp();

const OWNER_EMAILS = new Set(["stayjpplan@gmail.com", "abc83327@gmail.com"]);

// 寫死的測試帳號(owner 本人測試用,2026-06-19 確認)。改這裡才會清別的。
const TEST_UIDS = [
  "vS0joj6y57SgE1TytbXgjphueK43",   // knv2dycg8z@privaterelay.appleid.com(Apple 沙盒)
  "c35gzknA0QdEjwFd3B72G3EAQc93",   // yujoulinforwork@gmail.com
];
const TEST_EMAILS = [
  "knv2dycg8z@privaterelay.appleid.com",
  "yujoulinforwork@gmail.com",
];

export const adminPurgeTest = functions.onRequest(
  {
    cors: true,
    region: "asia-east1",
    invoker: "public",
    maxInstances: 2,
    timeoutSeconds: 120,
    memory: "256MiB",
    concurrency: 5,
  },
  async (req, res) => {
    try {
      const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      if (!idToken) { res.status(401).json({ error: "missing_auth" }); return; }
      const decoded = await admin.auth().verifyIdToken(idToken);
      if (!OWNER_EMAILS.has(decoded.email || "")) { res.status(403).json({ error: "not_owner" }); return; }

      const log: string[] = [];
      const uids = new Set<string>(TEST_UIDS);

      // email → uid(帳號還在的話;已刪的就靠寫死 uid)
      for (const em of TEST_EMAILS) {
        try { const u = await admin.auth().getUserByEmail(em); uids.add(u.uid); }
        catch { log.push(`ℹ ${em} 查無 Auth 帳號(可能已刪),用寫死 uid`); }
      }

      // 可選:owner 從帳本「清此帳號」按鈕指定單一 uid 清除。
      // uid 是從畫面點選的那一列帶來的(非自由輸入 → 不會 typo 誤刪),且這支已 owner-only。
      // 用途:清測試殘留 / 已刪帳號的孤兒交易(email 已查不到 uid 的情況,如 ANeqpJUCaC)。
      const bodyUid = (req.body && typeof req.body.uid === "string") ? req.body.uid.trim() : "";
      if (bodyUid) { uids.add(bodyUid); log.push(`ℹ 指定清除 uid: ${bodyUid}`); }

      // 假刪除(可復原):不真刪資料,只「隱藏 + 撤銷」。金流帳本真刪不可逆,風險太高。
      const HIDE = { hidden: true, hidden_at: Date.now() };
      let totalTxn = 0;
      for (const uid of uids) {
        // 1. subscription → 設 voided(撤銷 premium,但保留整個物件,可改回 active 復原),不真刪
        const usnap = await db.doc(`users/${uid}`).get();
        if (usnap.exists && usnap.get("subscription")) {
          await db.doc(`users/${uid}`).update({ "subscription.status": "voided", "subscription.voided_at": Date.now() });
          log.push(`✓ ${uid}: subscription → voided(假刪,可復原)`);
        } else {
          log.push(`ℹ ${uid}: 無 subscription`);
        }

        // 2. transactions → 標記 hidden(帳本自動濾掉,資料保留可復原),不真刪
        const txn = await db.collection("transactions").where("uid", "==", uid).get();
        for (let i = 0; i < txn.docs.length; i += 450) {
          const b = db.batch();
          txn.docs.slice(i, i + 450).forEach((d) => b.update(d.ref, HIDE));
          await b.commit();
        }
        totalTxn += txn.size;
        log.push(`✓ ${uid}: 隱藏 ${txn.size} 筆 transactions(假刪)`);

        // 3. paypal_pending → 同樣標記 hidden(不存在就略過)
        try {
          const pp = await db.collection("paypal_pending").where("uid", "==", uid).get();
          if (!pp.empty) {
            const b = db.batch(); pp.docs.forEach((d) => b.update(d.ref, HIDE)); await b.commit();
            log.push(`✓ ${uid}: 隱藏 ${pp.size} 筆 paypal_pending`);
          }
        } catch { /* 無此 collection */ }
      }

      // 3.5 清掉所有 RevenueCat 匿名 id($RCAnonymousID:*)的孤兒交易/訂閱。
      //     成因:未登入就購買 → 綁到匿名身分。真用戶一律有 Firebase uid(登入閘門保證),
      //     所以匿名 id 的資料 100% 是測試/孤兒,清掉不會誤刪真客人。
      const anonSnap = await db.collection("transactions")
        .where("uid", ">=", "$RCAnonymousID:")
        .where("uid", "<", "$RCAnonymousID;")   // ';'=':'+1 → 抓所有 "$RCAnonymousID:*" 前綴
        .get();
      // 同樣假刪除:標記 hidden(不真刪),帳本濾掉。匿名 user doc 是純孤兒,保留不影響任何人。
      for (let i = 0; i < anonSnap.docs.length; i += 450) {
        const b = db.batch();
        anonSnap.docs.slice(i, i + 450).forEach((d) => b.update(d.ref, HIDE));
        await b.commit();
      }
      log.push(`✓ 匿名 id:隱藏 ${anonSnap.size} 筆交易(假刪)`);

      // 4. 校正早鳥名額 = 實際「有效」持有早鳥的訂閱數。voided(假刪)不算,避免測試殘留灌水。
      const ebSnap = await db.collection("users").where("subscription.is_early_bird", "==", true).get();
      const ebCount = ebSnap.docs.filter((d) => {
        const st = d.get("subscription.status");
        return st === "active" || st === "cancelled";
      }).length;
      await db.doc("counters/early_bird").set({ count: ebCount }, { merge: true });
      log.push(`✓ early_bird 校正 → ${ebCount}`);

      res.json({ ok: true, purgedUids: Array.from(uids), deletedTxns: totalTxn, earlyBird: ebCount, log });
    } catch (err) {
      console.error("adminPurgeTest error:", err);
      res.status(500).json({ error: "internal", message: String(err) });
    }
  },
);
