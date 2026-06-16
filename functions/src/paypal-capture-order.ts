// HTTP function:捕捉 PayPal 訂單並開通訂閱(網頁海外用戶)。
// 前端 SDK 的 onApprove 打這支:驗 idToken → 捕捉(實際扣款)→ 成功的當下就 writeSubscription。
// 設計目標:絕不重演「付了錢沒功能」——
//   - 開通寫入失敗 → 寫 payment_failures 人工對帳佇列,且回 ok(別讓已付款的人以為失敗)
//   - 以 captureId 去重,前端重送/重整不會重複開通或重複入帳
import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { PAYPAL_SECRETS, PAYPAL_PRICES_USD, PLANS, PlanKey } from "./utils/constants";
import { capturePaypalOrder } from "./utils/paypal";
import {
  db, writeSubscription, writeTransaction, writePaymentFailure,
  nowMs, plusDays, tryReserveEarlyBird, emailHash, SubscriptionDoc,
} from "./utils/firestore";

if (admin.apps.length === 0) admin.initializeApp();

export const paypalCaptureOrder = functions.onRequest(
  {
    cors: true,
    region: "asia-east1",
    invoker: "public",
    secrets: PAYPAL_SECRETS,
    maxInstances: 10,
    timeoutSeconds: 60,
    memory: "256MiB",
    concurrency: 20,
  },
  async (req, res) => {
    try {
      if (req.method !== "POST") { res.status(405).json({ error: "method_not_allowed" }); return; }
      const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      if (!idToken) { res.status(401).json({ error: "missing_auth" }); return; }
      const decoded = await admin.auth().verifyIdToken(idToken);
      const uid = decoded.uid;

      const orderID = req.body?.orderID as string;
      if (!orderID) { res.status(400).json({ error: "missing_orderID" }); return; }

      // 1. 捕捉(實際扣款)
      const cap = await capturePaypalOrder(orderID);
      if (cap.status !== "COMPLETED") {
        res.status(402).json({ error: "not_completed", status: cap.status });
        return;
      }

      // 2. 從 custom_id 取回 uid:plan,並驗證確實是這個登入者的訂單(防竄改)
      const [customUid, planRaw] = (cap.customId || "").split(":");
      const plan = planRaw as PlanKey;
      if (customUid !== uid) {
        console.warn("paypalCapture uid mismatch", { uid, customUid, captureId: cap.captureId });
        res.status(403).json({ error: "uid_mismatch" });
        return;
      }
      if (!PAYPAL_PRICES_USD[plan]) {
        res.status(400).json({ error: "bad_plan", plan });
        return;
      }

      // 3. 去重:同一筆 captureId 已入帳 → 直接回 ok,不重複開通
      const dup = await db.collection("transactions")
        .where("external_id", "==", cap.captureId).limit(1).get();
      if (!dup.empty) { res.json({ ok: true, plan, duplicate: true }); return; }

      const planInfo = PLANS[plan];
      const isEarlyBird = plan === "yearly_early_bird" ? await tryReserveEarlyBird() : false;

      const newSub: SubscriptionDoc = {
        source: "web",
        plan,
        status: "active",
        expiresAt: plusDays(nowMs(), planInfo.period_days),
        willRenew: false,            // PayPal 一次性付款,不自動續扣
        startedAt: nowMs(),
        is_early_bird: isEarlyBird,
        failed_retries: 0,
      };

      // 4. 開通。寫入失敗(極少數:users/{uid} 索引/體積超限)→ 進人工佇列,但仍回 ok。
      try {
        await writeSubscription(uid, newSub);
      } catch (e) {
        console.error("paypalCapture writeSubscription failed:", e);
        await writePaymentFailure({
          uid, plan, trade_no: cap.captureId,
          amount_twd: planInfo.price_twd,
          reason: "paypal_subscription_write_failed",
          error: String(e),
        });
        await writeTransaction({
          uid, type: "subscribe", source: "web", plan,
          amount_twd: planInfo.price_twd, payment_method: "paypal",
          external_id: cap.captureId, status: "pending",
          email_hash: decoded.email ? emailHash(decoded.email) : undefined,
          note: `PayPal USD ${cap.amountUsd} 已收款,開通寫入失敗→人工對帳`,
        });
        res.json({ ok: true, pending: true });   // 已收款,別讓使用者以為失敗
        return;
      }

      await writeTransaction({
        uid, type: "subscribe", source: "web", plan,
        amount_twd: planInfo.price_twd, payment_method: "paypal",
        external_id: cap.captureId, status: "success",
        email_hash: decoded.email ? emailHash(decoded.email) : undefined,
        note: `PayPal USD ${cap.amountUsd}${isEarlyBird ? " · 早鳥" : ""}`,
      });

      res.json({ ok: true, plan });
    } catch (err) {
      console.error("paypalCaptureOrder error:", err);
      res.status(500).json({ error: "capture_failed", message: String(err) });
    }
  },
);
