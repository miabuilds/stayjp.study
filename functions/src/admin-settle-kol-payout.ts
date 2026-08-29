// HTTP function:owner 一鍵結算某 KOL 碼的分潤(標記已付款)。
// 動作:把該碼 state=locked 的分潤 → paid + 綁 payout_id;建 payouts/{id} 批次紀錄;
//   並淨額扣抵「已付款後又被退款作廢(void 且有 payout_id 未沖銷)」的 clawback 負債。
// owner only。實際匯款是線下手動;這支只做記帳與狀態流轉。
import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { db, nowMs } from "./utils/firestore";

if (admin.apps.length === 0) admin.initializeApp();

const OWNER_EMAILS = new Set(["stayjpplan@gmail.com", "abc83327@gmail.com"]);

export const adminSettleKolPayout = functions.onRequest(
  { cors: true, region: "asia-east1", invoker: "public", maxInstances: 2, timeoutSeconds: 60, memory: "256MiB", concurrency: 5 },
  async (req, res) => {
    try {
      const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      if (!idToken) { res.status(401).json({ error: "missing_auth" }); return; }
      let decoded: admin.auth.DecodedIdToken;
      try { decoded = await admin.auth().verifyIdToken(idToken); }
      catch { res.status(401).json({ error: "invalid_auth" }); return; }
      if (!OWNER_EMAILS.has(decoded.email || "") || decoded.email_verified !== true) { res.status(403).json({ error: "not_owner" }); return; }

      const code = String(req.body?.code || "").toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 32);
      if (!code) { res.status(400).json({ error: "missing_code" }); return; }

      // 該碼所有分潤(單一 equality,免複合索引)
      const snap = await db.collection("commissions").where("code", "==", code).get();
      const locked: FirebaseFirestore.QueryDocumentSnapshot[] = [];
      const clawbacks: FirebaseFirestore.QueryDocumentSnapshot[] = [];
      let ownerUid = "";
      snap.forEach((d) => {
        const c = d.data();
        ownerUid = ownerUid || (c.owner_uid as string) || "";
        if (c.state === "locked") locked.push(d);
        // 已付款後被退款作廢、尚未沖銷 → 這期要扣回
        else if (c.state === "void" && c.payout_id && !c.clawback_settled) clawbacks.push(d);
      });

      if (!locked.length && !clawbacks.length) { res.json({ ok: true, nothing: true, message: "此碼目前沒有可結算的分潤。" }); return; }

      const gross = locked.reduce((s, d) => s + (Number(d.data().amount_twd) || 0), 0);
      const clawbackAmt = clawbacks.reduce((s, d) => s + (Number(d.data().amount_twd) || 0), 0);
      const net = gross - clawbackAmt;

      const now = nowMs();
      const period = new Date(now).toISOString().slice(0, 7);   // YYYY-MM
      const payoutRef = db.collection("payouts").doc();
      const batch = db.batch();
      batch.set(payoutRef, {
        code, owner_uid: ownerUid, period,
        gross_twd: gross, clawback_twd: clawbackAmt, net_twd: net,
        commission_ids: locked.map((d) => d.id),
        clawback_ids: clawbacks.map((d) => d.id),
        settled_by: decoded.email || "", created_at: now, status: "paid", paid_at: now,
      });
      locked.forEach((d) => batch.update(d.ref, { state: "paid", payout_id: payoutRef.id, paid_settled_at: now }));
      clawbacks.forEach((d) => batch.update(d.ref, { clawback_settled: true, clawback_payout_id: payoutRef.id }));
      await batch.commit();

      res.json({ ok: true, code, payout_id: payoutRef.id, count: locked.length, gross_twd: gross, clawback_twd: clawbackAmt, net_twd: net });
    } catch (err) {
      console.error("adminSettleKolPayout error:", err);
      res.status(500).json({ error: "internal", message: String(err) });
    }
  },
);
