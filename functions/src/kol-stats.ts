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

      // 選填:日期區間查詢(幾號到幾號)。users 沒有註冊時間戳→總人數只能給即時值;
      // 但 commissions 有 created_at→可算「期間內成交筆數 + 分潤金額」(KOL 最想看的「這段期間賺多少」)。
      // 用 code 單欄查詢(自動索引)再於函式內篩時間,免建複合索引;單一 KOL 筆數少,讀取量極小。
      const fromStr = String((req.query.from || (req.body && req.body.from) || "")).slice(0, 10);
      const toStr = String((req.query.to || (req.body && req.body.to) || "")).slice(0, 10);
      let range: { from: string; to: string; conversions: number; commission_twd: number } | null = null;
      if (/^\d{4}-\d{2}-\d{2}$/.test(fromStr) && /^\d{4}-\d{2}-\d{2}$/.test(toStr)) {
        const fromMs = Date.parse(`${fromStr}T00:00:00+08:00`);   // 以台灣時間解讀使用者選的日期
        const toMs = Date.parse(`${toStr}T23:59:59+08:00`);
        if (!isNaN(fromMs) && !isNaN(toMs) && fromMs <= toMs) {
          const csnap = await db.collection("commissions").where("code", "==", code).get();
          let conversions = 0, commission_twd = 0;
          csnap.forEach((d) => {
            const cc = d.data() as Record<string, unknown>;
            const t = Number(cc.created_at) || 0;
            if (cc.state !== "void" && t >= fromMs && t <= toMs) { conversions++; commission_twd += Number(cc.amount_twd) || 0; }
          });
          range = { from: fromStr, to: toStr, conversions, commission_twd };
        }
      }

      res.json({ ok: true, code, kol: c.kol || "", total, paid, trialing, range });
    } catch (err) {
      console.error("kolStats error:", err);
      res.status(500).json({ error: "internal" });
    }
  },
);
