// HTTP function:owner 清掉孤兒 pending 交易
//
// 為什麼需要:create-payment 每次發起結帳就寫一筆 status:pending,
//   成功的 ecpay-callback 是「另寫一筆 success」、從不回頭收尾原本那筆 pending,
//   也沒有任何 cron 清。→ 棄單 / 測試重試會永久留「處理中」孤兒列(未扣款、不計營收,
//   但污染明細與 gross 數字)。這支讓 owner 一鍵清掉「夠舊」的 pending。
//
// 安全設計:
//   - 嚴格 owner only(verify idToken email)。
//   - 只刪 status === "pending" 且 occurred_at 早於 cutoff(預設 60 分鐘前)的交易,
//     避免誤刪「剛發起、callback 還在路上」的真實結帳(綠界 callback 通常數秒~分鐘內到)。
//   - 不碰 success / refund / cancel / 任何 subscription / counter。
//
// 用法:POST,body 可選 { olderThanMinutes: number }(預設 60)。

import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { db } from "./utils/firestore";

if (admin.apps.length === 0) admin.initializeApp();

const OWNER_EMAILS = new Set(["stayjpplan@gmail.com", "abc83327@gmail.com"]);

export const adminCleanupPending = functions.onRequest(
  {
    cors: true,
    region: "asia-east1",
    invoker: "public",
    maxInstances: 2,
    timeoutSeconds: 120,
    memory: "256MiB",
    concurrency: 10,
  },
  async (req, res) => {
    try {
      const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      if (!idToken) { res.status(401).json({ error: "missing_auth" }); return; }
      const decoded = await admin.auth().verifyIdToken(idToken);
      if (!OWNER_EMAILS.has(decoded.email || "")) { res.status(403).json({ error: "not_owner" }); return; }

      const olderThanMinutes = Math.max(0, Number(req.body?.olderThanMinutes ?? 60));
      const cutoffMs = Date.now() - olderThanMinutes * 60 * 1000;

      // 單欄位查 pending(免複合索引),再用 occurred_at 過濾「夠舊」的才刪
      const snap = await db.collection("transactions").where("status", "==", "pending").get();
      const toDelete = snap.docs.filter((d) => {
        const t = d.data();
        const ms = t.occurred_at?.toMillis ? t.occurred_at.toMillis() : 0;
        return ms < cutoffMs;
      });

      let deleted = 0;
      for (let i = 0; i < toDelete.length; i += 450) {
        const batch = db.batch();
        toDelete.slice(i, i + 450).forEach((d) => batch.delete(d.ref));
        await batch.commit();
        deleted += Math.min(450, toDelete.length - i);
      }

      res.json({
        ok: true,
        scanned_pending: snap.size,
        deleted,
        kept_recent: snap.size - toDelete.length,
        olderThanMinutes,
      });
    } catch (err) {
      console.error("adminCleanupPending error:", err);
      res.status(500).json({ error: "internal", message: String(err) });
    }
  },
);
