// HTTP function:驗證推薦碼是否存在且啟用(使用者輸入時即時檢查)。
// ref_codes 規則限 admin 讀 → 一般使用者不能直接讀,所以走這支(Admin SDK)。
// 只回 { valid, kol },不外洩 token / 抽成 % 等內部欄位。

import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { db } from "./utils/firestore";

if (admin.apps.length === 0) admin.initializeApp();

export const validateRefCode = functions.onRequest(
  {
    cors: true,
    region: "asia-east1",
    invoker: "public",
    maxInstances: 3,
    timeoutSeconds: 30,
    memory: "256MiB",
    concurrency: 20,
  },
  async (req, res) => {
    try {
      const code = String((req.query.code || (req.body && req.body.code) || ""))
        .toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 32);
      if (!code) { res.json({ valid: false }); return; }
      const d = await db.doc(`ref_codes/${code}`).get();
      const c = d.data();
      // 停權(suspended)或停用(active:false)一律視為無效 → 不歸因、不外洩(預防投機:停權後失效)
      const valid = d.exists && !!c && c.active !== false && c.status !== "suspended";
      // 若帶了登入 token,檢查是不是「填自己的碼」(任何 owner_uid 碼:user 個人碼 + kol 分潤碼)
      // → 回 self 讓前端擋掉,防自我推薦刷分潤/刷 7 天
      let self = false;
      const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      if (valid && idToken && c!.owner_uid) {
        try {
          const uid = (await admin.auth().verifyIdToken(idToken)).uid;
          self = uid === c!.owner_uid;
        } catch { /* token 壞掉不擋,當作非本人 */ }
      }
      res.json({ valid, kol: valid ? (c!.kol || "") : "", type: valid ? (c!.type || "kol") : "", self });
    } catch (err) {
      console.error("validateRefCode error:", err);
      // 出錯回 error 旗標 → 前端 fail-open(不擋使用者,但標示暫無法驗證)
      res.json({ valid: false, error: true });
    }
  },
);
