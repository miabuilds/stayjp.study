// HTTP function:用戶在 /account.html 按 [關閉自動續訂] → 通知綠界停止續扣
//
// 流程:
//   1. 驗 Firebase Auth + 取訂閱
//   2. App 訂戶 → 拒絕(請去 iOS Settings)
//   3. 呼 綠界 DoAction Action=N(停止定期定額)
//   4. 寫 transaction(type=cancel)
//   5. subscription.willRenew=false + status="cancelled"
//      (但 expiresAt 不變,讓 user 用到到期日)
//
// 跟退費的差別:取消只是不再續扣,已付的錢不退,服務用到當期到期日。

import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import axios from "axios";
import { ecpayConfig, ecpayRefundEndpoint } from "./utils/constants";
import { checkMacValue } from "./utils/ecpay";
import { getSubscription, patchSubscription, writeTransaction } from "./utils/firestore";

if (admin.apps.length === 0) admin.initializeApp();

export const cancelSubscription = functions.onRequest(
  {
    cors: true,
    region: "asia-east1",
    invoker: "public",
    maxInstances: 5,
    timeoutSeconds: 60,
    memory: "256MiB",
    concurrency: 40,
  },
  async (req, res) => {
    try {
      if (req.method !== "POST") {
        res.status(405).json({ error: "method_not_allowed" });
        return;
      }

      const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      if (!idToken) { res.status(401).json({ error: "missing_auth" }); return; }
      const decoded = await admin.auth().verifyIdToken(idToken);
      const uid = decoded.uid;

      const sub = await getSubscription(uid);
      if (!sub) { res.status(400).json({ error: "no_subscription" }); return; }

      if (sub.source !== "web") {
        res.status(400).json({
          error: "wrong_platform",
          reason: "App 訂閱請至「設定 → Apple ID / Google Pay」管理。",
        });
        return;
      }

      if (sub.status !== "active") {
        res.status(400).json({
          error: "already_cancelled",
          reason: `訂閱狀態為「${sub.status}」,無需取消。`,
        });
        return;
      }

      // 月費 / 年費 / 早鳥 = 有定期定額,要呼綠界停止
      // 終身方案 = 一次性付款,沒定期定額,跳過 ECPay 直接更新狀態
      const isRecurring = sub.plan !== "lifetime";

      if (isRecurring && sub.ecpay_order) {
        const cfg = ecpayConfig();
        const params: Record<string, string | number> = {
          MerchantID: cfg.merchantId,
          MerchantTradeNo: sub.ecpay_order,
          TradeNo: sub.ecpay_order,
          Action: "N",       // N = 停止訂閱
          TotalAmount: 0,    // 取消用 0
        };
        params.CheckMacValue = checkMacValue(params);

        try {
          const ecpayRes = await axios.post(
            ecpayRefundEndpoint(),
            new URLSearchParams(params as Record<string, string>).toString(),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
          );
          console.log("ECPay cancel response:", ecpayRes.data);
          // 即使 ECPay 失敗,還是更新 Firestore (避免下次續扣後續資料不一致)
          // ECPay 那邊到期前可能會 retry 失敗扣款,但 ecpayCallback 會把 fail 記下來
        } catch (e) {
          console.warn("ECPay cancel API call failed (continuing anyway):", e);
        }
      }

      // 更新狀態 — willRenew=false,status="cancelled"
      // 但 expiresAt 不變,讓 user 用到當期到期日
      await patchSubscription(uid, {
        willRenew: false,
        status: "cancelled",
      });

      await writeTransaction({
        uid,
        type: "cancel",
        source: "web",
        plan: sub.plan,
        amount_twd: 0,
        payment_method: "ecpay",
        external_id: sub.ecpay_order || "",
        status: "success",
        note: "User cancelled (continues until expiresAt)",
      });

      const expiresDate = new Date(sub.expiresAt).toLocaleDateString("zh-TW");
      res.json({
        ok: true,
        message: `已關閉自動續訂,可繼續使用至 ${expiresDate}。`,
        new_status: "cancelled",
        expires_at: sub.expiresAt,
      });
    } catch (err) {
      console.error("cancelSubscription error:", err);
      res.status(500).json({ error: "internal", message: String(err) });
    }
  },
);
