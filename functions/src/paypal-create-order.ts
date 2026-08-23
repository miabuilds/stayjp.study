// HTTP function:建立 PayPal 訂單(網頁海外用戶)。
// 前端 PayPal SDK 的 createOrder 會打這支:驗 idToken → uid,plan 由白名單限定,
// 金額 server 決定(防前端竄改),custom_id 綁 `uid:plan`,回 order id 給 SDK。
import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { PAYPAL_SECRETS, PAYPAL_PRICES_USD, PlanKey } from "./utils/constants";
import { createPaypalOrder } from "./utils/paypal";
import { getEarlyBirdCount, getSubscription, nowMs } from "./utils/firestore";

if (admin.apps.length === 0) admin.initializeApp();

export const paypalCreateOrder = functions.onRequest(
  {
    cors: true,
    region: "asia-east1",
    invoker: "public",
    secrets: PAYPAL_SECRETS,
    maxInstances: 10,
    timeoutSeconds: 30,
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

      const plan = req.body?.plan as PlanKey;
      const amountUsd = PAYPAL_PRICES_USD[plan];
      if (!amountUsd) {
        // 只接受 PayPal 開放的方案(早鳥年費 / 買斷);月費/標準年費請走綠界
        res.status(400).json({ error: "plan_not_supported_on_paypal", plan });
        return;
      }

      // 守衛:已是有效付費會員 → 擋下,避免重複扣款(要換方案請先退費/到期或洽客服)
      const existing = await getSubscription(uid);
      if (existing && existing.status !== "refunded" && existing.status !== "expired"
          && (existing.expiresAt || 0) > nowMs()) {
        // 已取消續訂(willRenew=false 或 status=cancelled)且要買的是買斷 → 放行升級(不會重複扣款)
        const noRenew = (existing as any).willRenew === false || existing.status === "cancelled";
        const lifetimeUpgrade = noRenew && plan === "lifetime" && existing.plan !== "lifetime";
        if (!lifetimeUpgrade) {
          res.status(409).json({
            error: "already_subscribed",
            reason: "你目前已是付費會員,無需重複購買。想改買「買斷」請先取消自動續訂,取消後即可購買;其他需求請來信客服。",
          });
          return;
        }
      }

      // 早鳥:名額滿或已收官 → 擋(和 precheckSubscribe 同一個閘門;PayPal 路徑原本漏了這關)
      if (plan === "yearly_early_bird") {
        const eb = await getEarlyBirdCount();
        if (eb.closed || eb.count >= eb.limit) {
          res.status(403).json({ error: "early_bird_closed", reason: "早鳥方案已結束,請改選一般年費。" });
          return;
        }
      }

      const orderId = await createPaypalOrder({ uid, plan, amountUsd });
      res.json({ id: orderId });
    } catch (err) {
      console.error("paypalCreateOrder error:", err);
      res.status(500).json({ error: "create_failed", message: String(err) });
    }
  },
);
