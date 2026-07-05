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
      const valid = d.exists && !!c && c.active !== false;
      res.json({ valid, kol: valid ? (c!.kol || "") : "" });
    } catch (err) {
      console.error("validateRefCode error:", err);
      // 出錯回 error 旗標 → 前端 fail-open(不擋使用者,但標示暫無法驗證)
      res.json({ valid: false, error: true });
    }
  },
);
