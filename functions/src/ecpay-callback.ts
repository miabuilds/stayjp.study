// HTTP function:綠界 ECPay server-to-server callback
//
// 觸發時機:
//   - 首次訂閱扣款成功
//   - 每期續扣成功(綠界定期定額)
//   - 扣款失敗
//
// 流程:
//   1. 驗 CheckMacValue
//   2. 從 CustomField1/2 拿回 uid + plan
//   3. 根據 RtnCode 判斷成功 / 失敗
//   4. 成功 → 更新 subscription.status=active + expiresAt + 寫 transaction(success)
//      + 早鳥名額 +1(如果是 yearly_early_bird 且首次)
//   5. 失敗 → 寫 transaction(failed)+ 觸發 retry 計數(由 daily-retry-cron 接手)
//   6. 回應綠界 "1|OK"(成功)或 "0|Error"

import * as functions from "firebase-functions/v2/https";
import { PLANS, PlanKey, ECPAY_SECRETS } from "./utils/constants";
import { verifyCheckMacValue } from "./utils/ecpay";
import {
  writeTransaction, getSubscription, writeSubscription, patchSubscription,
  tryReserveEarlyBird, releaseEarlyBird, writePaymentFailure,
  nowMs, plusDays, SubscriptionDoc, db,
} from "./utils/firestore";

export const ecpayCallback = functions.onRequest(
  {
    secrets: ECPAY_SECRETS,
    region: "asia-east1",
    invoker: "public",
    maxInstances: 20,         // server-to-server,允許多一點
    timeoutSeconds: 60,        // 寫 Firestore + 早鳥 transaction 算進去
    memory: "256MiB",
    concurrency: 80,
  },
  async (req, res) => {
    try {
      // ECPay 是 x-www-form-urlencoded POST
      const body = req.body as Record<string, string>;
      console.log("ECPay callback received:", JSON.stringify(body));

      // 1. 驗 CheckMacValue
      if (!verifyCheckMacValue(body)) {
        console.error("CheckMacValue mismatch");
        res.status(400).send("0|CheckMacValue Fail");
        return;
      }

      // 2. 拿 uid + plan
      const uid  = body.CustomField1 || "";
      const plan = (body.CustomField2 || "") as PlanKey;
      if (!uid || !PLANS[plan]) {
        console.error("Missing CustomField:", { uid, plan });
        res.status(400).send("0|Missing CustomField");
        return;
      }

      const merchantTradeNo = body.MerchantTradeNo;
      const tradeNo         = body.TradeNo;
      const amount          = Number(body.TradeAmt || PLANS[plan].price_twd);
      const rtnCode         = String(body.RtnCode || "0");
      const rtnMsg          = body.RtnMsg || "";
      const isSuccess       = rtnCode === "1";

      // ── Idempotency check ──
      // ECPay 在 sandbox / 定期定額 偶會重發 callback;同個 TradeNo 已成功寫過就 skip
      // 用 external_id + status=success 當 dedupe key
      const idempotencyKey = tradeNo || merchantTradeNo;
      if (idempotencyKey) {
        const dupSnap = await db.collection("transactions")
          .where("uid", "==", uid)
          .where("external_id", "==", idempotencyKey)
          .where("status", "==", "success")
          .limit(1).get();
        if (!dupSnap.empty) {
          console.log("Idempotency: callback already processed for", { uid, idempotencyKey });
          res.status(200).send("1|OK");
          return;
        }
      }

      // 3. 寫帳本
      const existingSub = await getSubscription(uid);
      const isFirstPayment = !existingSub || existingSub.status !== "active";

      if (isSuccess) {
        const planInfo = PLANS[plan];

        // 早鳥首次訂閱 → 占名額
        let isEarlyBird = false;
        let reservedThisCall = false;   // 本次呼叫是否真的占了名額(失敗時要釋放,避免重試灌爆計數器)
        if (plan === "yearly_early_bird" && isFirstPayment && !existingSub?.is_early_bird) {
          const reserved = await tryReserveEarlyBird();
          if (!reserved) {
            // 已滿,改一般年費價格 — 不應發生因為 precheck 已擋,但防禦性處理
            console.warn("Early bird full but ECPay charged, falling back to yearly", { uid });
          }
          isEarlyBird = reserved;
          reservedThisCall = reserved;
        } else if (plan === "yearly_early_bird") {
          // 續扣 / 取消後重訂的早鳥:原本就有 is_early_bird flag,不重複占名額
          isEarlyBird = existingSub?.is_early_bird === true;
        }

        // 寫 / 更新 subscription
        // expiresAt 加 5 年上限,防 sandbox / bug 累積失控
        const MAX_EXPIRES_MS = nowMs() + 5 * 365 * 24 * 60 * 60 * 1000;
        const newExpiresAt = plusDays(nowMs(), planInfo.period_days);
        const proposedExpiresAt = (existingSub && existingSub.expiresAt > nowMs())
          ? plusDays(existingSub.expiresAt, planInfo.period_days)   // 續扣 / 取消後未到期重訂:從現有到期日往後加,不吃掉已付費剩餘天數
          : newExpiresAt;                                            // 全新訂閱 / 已過期:從現在起算
        const capExpiresAt = Math.min(proposedExpiresAt, MAX_EXPIRES_MS);

        const newSub: SubscriptionDoc = {
          source: "web",
          plan,
          status: "active",
          expiresAt: plan === "lifetime"
            ? plusDays(nowMs(), planInfo.period_days)   // lifetime 直接 now + 100 年
            : capExpiresAt,
          willRenew: plan !== "lifetime",
          startedAt: existingSub?.startedAt || nowMs(),
          ecpay_order: merchantTradeNo,
          is_early_bird: isEarlyBird || existingSub?.is_early_bird === true,
          failed_retries: 0,   // 成功歸零
        };
        try {
          await writeSubscription(uid, newSub);
        } catch (subErr) {
          // 🚨 訂閱寫入失敗 — 最常見主因:users/{uid} 索引條目超限(INDEX_ENTRIES_COUNT_LIMIT_EXCEEDED)
          //    或 doc 體積逼近 1MiB。錢已收,但開通沒成功。防呆策略:
          //  1. 不寫 success transaction → 保留 idempotency,讓綠界重試(或修好後)能自癒
          //  2. 釋放本次占用的早鳥名額 → 重試會重占,避免重試多次把計數器灌爆
          //  3. 寫進獨立小 collection payment_failures(「絕不」寫 users doc)+ 大聲 log 告警
          //  4. 回 500 → 綠界重試;暫時性問題會自癒,永久性(體積超限)則靠 payment_failures 人工對帳
          console.error("🚨 SUBSCRIPTION WRITE FAILED — payment received but NOT provisioned", {
            uid, plan, tradeNo, merchantTradeNo, amount, err: String(subErr),
          });
          if (reservedThisCall) await releaseEarlyBird().catch(() => { /* best effort */ });
          await writePaymentFailure({
            uid, plan,
            merchant_trade_no: merchantTradeNo,
            trade_no: tradeNo,
            amount_twd: amount,
            reason: "subscription_write_failed",
            error: String(subErr),
          }).catch(e => console.error("payment_failure 告警也寫失敗:", e));
          res.status(500).send("0|Subscription Write Failed");
          return;
        }

        // 寫 transaction(Firestore 不接受 undefined,有值才放)
        const txn: Parameters<typeof writeTransaction>[0] = {
          uid,
          type: isFirstPayment ? "subscribe" : "renew",
          source: "web",
          plan,
          amount_twd: amount,
          payment_method: "ecpay",
          external_id: tradeNo || merchantTradeNo,
          status: "success",
          note: rtnMsg,
        };
        if (body.InvoiceNo) txn.invoice_no = body.InvoiceNo;
        await writeTransaction(txn);

        console.log("✓ ECPay payment success", { uid, plan, amount, isFirstPayment });
      } else {
        // 扣款失敗
        await writeTransaction({
          uid,
          type: "fail",
          source: "web",
          plan,
          amount_twd: amount,
          payment_method: "ecpay",
          external_id: tradeNo || merchantTradeNo,
          status: "failed",
          note: `RtnCode=${rtnCode} ${rtnMsg}`,
        });

        // retry 計數 +1(daily-retry-cron 會根據這個值決定何時 retry)
        // best-effort:user doc 若超限會寫失敗,但 fail transaction 已寫進帳本,不該因此拋錯
        if (existingSub) {
          await patchSubscription(uid, {
            failed_retries: (existingSub.failed_retries || 0) + 1,
            last_retry_at: nowMs(),
          }).catch(e => console.error("patchSubscription(failed_retries) 失敗(user doc 可能超限):", e));
        }

        console.warn("✗ ECPay payment failed", { uid, plan, rtnCode, rtnMsg });
      }

      // 4. 回應綠界(這個格式很重要,綠界看到 "1|OK" 才不會 retry)
      res.status(200).send("1|OK");
    } catch (err) {
      console.error("ecpayCallback error:", err);
      res.status(500).send("0|Internal Error");
    }
  },
);
