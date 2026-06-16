// HTTP function:PayPal 訂閱退費(網頁海外)。
// 政策:首購 7 天內全額退(REFUND_POLICY.full_refund_days);逾期請走客服(一次性付款不自助按比例退)。
// 流程:驗 idToken → 取訂閱(須為 PayPal)→ 退指定 capture → 訂閱降級 refunded + 記帳 + 黑名單追蹤 + 釋放早鳥。
import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { PLANS, REFUND_POLICY, PAYPAL_SECRETS } from "./utils/constants";
import { refundPaypalCapture } from "./utils/paypal";
import {
  getSubscription, patchSubscription, writeTransaction,
  recordRefund, releaseEarlyBird, nowMs, emailHash,
} from "./utils/firestore";

if (admin.apps.length === 0) admin.initializeApp();

export const paypalRefund = functions.onRequest(
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
      const email = decoded.email || "";

      const sub = await getSubscription(uid);
      if (!sub || !sub.paypal_capture) {
        res.status(400).json({ error: "not_paypal", reason: "此訂閱非 PayPal 付款,無法用此方式退費。" });
        return;
      }
      if (sub.status === "refunded") {
        res.status(400).json({ error: "already_refunded", reason: "此訂閱已退費。" });
        return;
      }

      const daysSinceStart = Math.floor((nowMs() - (sub.startedAt || nowMs())) / 86400000);
      if (daysSinceStart > REFUND_POLICY.full_refund_days) {
        res.status(400).json({
          error: "refund_window_passed",
          reason: `PayPal 付款逾 ${REFUND_POLICY.full_refund_days} 天的退費請來信客服協助(一次性付款不提供自助比例退)。`,
        });
        return;
      }

      // 退款(全額)
      const refundId = await refundPaypalCapture(sub.paypal_capture);

      // 訂閱降級 + 記帳
      await patchSubscription(uid, { status: "refunded", willRenew: false });
      await writeTransaction({
        uid, type: "refund", source: "web", plan: sub.plan,
        amount_twd: -(PLANS[sub.plan]?.price_twd || 0),
        payment_method: "paypal", external_id: refundId || sub.paypal_capture,
        status: "refunded",
        email_hash: email ? emailHash(email) : undefined,
        note: "PayPal 全額退款",
      });

      // 早鳥名額釋放(只在退費窗內、每名額最多釋放一次)
      if (sub.is_early_bird) {
        await releaseEarlyBird().catch(e => console.warn("releaseEarlyBird fail:", e));
        await patchSubscription(uid, { is_early_bird: false }).catch(() => {});
      }

      // 黑名單追蹤(退費滿 N 次永久擋,跟綠界退費同一套)
      if (email) await recordRefund(email).catch(e => console.warn("recordRefund fail:", e));

      res.json({ ok: true, message: "退費成功!款項將由 PayPal 退回你的付款方式,入帳時間依 PayPal / 發卡行而定。" });
    } catch (err) {
      console.error("paypalRefund error:", err);
      res.status(500).json({ error: "refund_failed", message: String(err) });
    }
  },
);
