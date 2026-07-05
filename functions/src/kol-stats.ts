// HTTP function:KOL 自助查詢自己推薦碼的成效。
// 安全:用 ref_codes/{CODE}.token 當通行證(無需登入);token 對 + active 才回數字。
// 只回該碼的彙總(帶來人數 / 付費 / 試用中),不外洩個資。

import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { db } from "./utils/firestore";

if (admin.apps.length === 0) admin.initializeApp();

export const kolStats = functions.onRequest(
  {
    cors: true,
    region: "asia-east1",
    invoker: "public",
    maxInstances: 2,
    timeoutSeconds: 60,
    memory: "256MiB",
    concurrency: 10,
  },
  async (req, res) => {
    try {
      const code = String((req.query.code || (req.body && req.body.code) || ""))
        .toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 32);
      const token = String((req.query.t || (req.body && req.body.t) || ""));
      if (!code || !token) { res.status(400).json({ error: "missing_params" }); return; }

      const codeDoc = await db.doc(`ref_codes/${code}`).get();
      const c = codeDoc.data();
      if (!codeDoc.exists || !c || c.token !== token || c.active === false) {
        res.status(403).json({ error: "invalid_code_or_token" });
        return;
      }

      // 查所有歸因到此碼的使用者(ref_code 單欄位自動索引);統計付費/試用
      const snap = await db.collection("users").where("ref_code", "==", code).limit(5000).get();
      let total = 0, paid = 0, trialing = 0;
      snap.forEach((d) => {
        total++;
        const sub = (d.data().subscription || {}) as Record<string, unknown>;
        if (sub.status === "active") paid++;
        else if (sub.status === "trialing") trialing++;
      });

      res.json({ ok: true, code, kol: c.kol || "", total, paid, trialing });
    } catch (err) {
      console.error("kolStats error:", err);
      res.status(500).json({ error: "internal" });
    }
  },
);
