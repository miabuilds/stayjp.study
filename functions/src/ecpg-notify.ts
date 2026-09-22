// HTTP function:ReturnURL — 綠界 server-to-server 付款結果通知(application/json)。
//
// ⚠️ 跟 OrderResultURL 不同:這支是 JSON POST、而且必須回 "1|OK" 字串,
//    回別的東西綠界會當通知失敗一直重送。
// 主要用途是對帳:扣款真正的成敗以這支為準(排程那邊拿到的是同步回應,可能還沒最終確認)。

import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { ecpgConfig } from "./utils/constants";
import { ECPG_SECRETS } from "./utils/ecpg-secrets";
import { parseCallback } from "./utils/ecpg";

if (admin.apps.length === 0) admin.initializeApp();

type Notify = {
  OrderInfo?: { MerchantTradeNo?: string; TradeNo?: string; TradeAmt?: number; RtnCode?: number; RtnMsg?: string; PaymentDate?: string };
  RtnCode?: number; RtnMsg?: string;
};

export const ecpgNotify = functions.onRequest(
  {
    secrets: ECPG_SECRETS, region: "asia-east1", invoker: "public",
    maxInstances: 10, timeoutSeconds: 30, memory: "256MiB",
  },
  async (req, res) => {
    try {
      const env = ecpgConfig();
      const parsed = parseCallback<Notify>(req.body as Record<string, unknown>, env);
      if (!parsed.ok || !parsed.data) {
        console.error("ECPG 通知解析失敗", parsed.error);
        res.status(200).send("1|OK");          // 解不開也回 OK,避免綠界無限重送;問題看 log
        return;
      }
      const o = parsed.data.OrderInfo || {};
      const tradeNo = String(o.MerchantTradeNo || "");
      const rtn = Number(o.RtnCode ?? parsed.data.RtnCode);
      if (tradeNo) {
        await admin.firestore().doc("ecpg_notifies/" + tradeNo).set({
          trade_no: o.TradeNo || null, amount: o.TradeAmt ?? null,
          rtn_code: rtn, rtn_msg: o.RtnMsg || parsed.data.RtnMsg || null,
          paid_at: o.PaymentDate || null, at: Date.now(),
        }, { merge: true });
      }
      res.status(200).send("1|OK");
    } catch (err) {
      console.error("ecpgNotify error:", err);
      res.status(200).send("1|OK");
    }
  },
);
