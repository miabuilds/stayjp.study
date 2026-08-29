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
        // 已付費=真實付費且權益還在:active+「cancelled(取消續訂但未到期)」都算——
        // 取消續訂的人錢已付、分潤照發,只算 active 會讓「已付費」和「成交筆數」對不上(KOL 實際回報過)。
        const exp = Number(sub.expiresAt || 0);
        if ((sub.status === "active" || sub.status === "cancelled") && exp > Date.now()) paid++;
        else if (sub.status === "trialing") trialing++;
      });

      // 選填:日期區間查詢(幾號到幾號)。users 沒有註冊時間戳→總人數只能給即時值;
      // 但 commissions 有 created_at→可算「期間內成交筆數 + 分潤金額」(KOL 最想看的「這段期間賺多少」)。
      // 用 code 單欄查詢(自動索引)再於函式內篩時間,免建複合索引;單一 KOL 筆數少,讀取量極小。
      const fromStr = String((req.query.from || (req.body && req.body.from) || "")).slice(0, 10);
      const toStr = String((req.query.to || (req.body && req.body.to) || "")).slice(0, 10);
      let range: { from: string; to: string; conversions: number; commission_twd: number; rows: any[] } | null = null;
      if (/^\d{4}-\d{2}-\d{2}$/.test(fromStr) && /^\d{4}-\d{2}-\d{2}$/.test(toStr)) {
        const fromMs = Date.parse(`${fromStr}T00:00:00+08:00`);   // 以台灣時間解讀使用者選的日期
        const toMs = Date.parse(`${toStr}T23:59:59+08:00`);
        if (!isNaN(fromMs) && !isNaN(toMs) && fromMs <= toMs) {
          const csnap = await db.collection("commissions").where("code", "==", code).get();
          let conversions = 0, commission_twd = 0;
          const rows: any[] = [];
          csnap.forEach((d) => {
            const cc = d.data() as Record<string, unknown>;
            const t = Number(cc.created_at) || 0;
            if (t < fromMs || t > toMs) return;
            const voided = cc.state === "void";
            if (!voided) {
              if (cc.plan !== "adjustment") conversions++;   // 調整/補償項(如補漏洞的推廣費)計金額、不計成交筆數
              commission_twd += Number(cc.amount_twd) || 0;
            }
            // 逐筆明細:方案 / 平台 / 金額 / 狀態(退款作廢) / 額外項理由
            rows.push({
              at: t,
              plan: String(cc.plan || ""),
              source: String(cc.source || "web"),   // web(綠界) / paypal / app(iOS/Android IAP)
              amount: Number(cc.amount_twd) || 0,
              state: String(cc.state || "pending"),  // pending / locked / paid / void
              voided,
              void_reason: voided ? String(cc.void_reason || "退款") : "",
              note: cc.plan === "adjustment" ? String(cc.note || "") : "",
            });
          });
          rows.sort((a, b) => b.at - a.at);
          range = { from: fromStr, to: toStr, conversions, commission_twd, rows };
        }
      }

      res.json({ ok: true, code, kol: c.kol || "", total, paid, trialing, range });
    } catch (err) {
      console.error("kolStats error:", err);
      res.status(500).json({ error: "internal" });
    }
  },
);
