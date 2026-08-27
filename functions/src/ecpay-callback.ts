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
  writeTransaction, getSubscription, writeSubscription, patchSubscription, getRefCode,
  rewardReferrerOnPayment, recordKolCommission, grantAiBonus,
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
      // 實收金額：一次性結帳回呼帶 TradeAmt；定期定額「續扣」回呼不帶 TradeAmt，
      // 而是用 Amount / PeriodAmount 帶當期實扣金額。早期綠界月費 149 的定期定額用戶，
      // 每期仍實扣 149（授權金額鎖定），若只讀 TradeAmt 會 fallback 到現行牌價 150，
      // 導致交易明細與分潤金額誤記成 150。優先取綠界實際回報金額，牌價僅作最後保底。
      const amount          = Number(body.TradeAmt || body.Amount || body.PeriodAmount || PLANS[plan].price_twd);
      const rtnCode         = String(body.RtnCode || "0");
      const rtnMsg          = body.RtnMsg || "";
      const isSuccess       = rtnCode === "1";

      // 付款方式細分(綠界 PaymentType):信用卡 / ATM / 超商。
      // 只有信用卡(定期定額)會自動續扣;ATM、超商是一次性,willRenew 必須為 false。
      const paymentType = String(body.PaymentType || "");
      const payType = /^Credit/i.test(paymentType) ? "credit"
        : /ATM/i.test(paymentType) ? "atm"
        : /CVS|BARCODE/i.test(paymentType) ? "cvs"
        : "credit";   // 空值多為定期定額續扣回呼(信用卡)→ 預設 credit

      // ── 模擬付款防護(ECPay 官方要求)──
      // 綠界後台「模擬付款通知」會用「正式金鑰」簽發 RtnCode=1 的 callback,但未實際扣款、
      // 也不會進交易明細。SimulatePaid=1 = 模擬 → 一律不開通 Premium、不寫成功交易,
      // 僅回 1|OK 讓綠界別重試。(缺此判斷曾導致模擬付款開出「幽靈 Premium」。)
      const isSimulated = String(body.SimulatePaid || "0") === "1";
      if (isSimulated) {
        console.warn("[ecpay] SimulatePaid=1 模擬付款,不開通 Premium", { uid, plan, merchantTradeNo, tradeNo });
        res.status(200).send("1|OK");
        return;
      }

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
          willRenew: plan !== "lifetime" && payType === "credit",   // 只有信用卡定期定額會續扣;ATM/超商=一次性
          pay_type: payType,
          startedAt: existingSub?.startedAt || nowMs(),
          ecpay_order: merchantTradeNo,
          is_early_bird: isEarlyBird || existingSub?.is_early_bird === true,
          failed_retries: 0,   // 成功歸零
        };
        // 推薦碼好康:確認真實付款(綠界 active)+ 有 ref_code + 沒發過 → 到期日 +7 天(一次性,延續旗標不重發)
        // 與 Apple webhook 同一套邏輯,讓 web 訂閱也享同樣好康(數位邊際成本≈0)。
        if (existingSub?.ref_bonus_at) {
          newSub.ref_bonus_at = existingSub.ref_bonus_at;
        } else {
          const refCode = await getRefCode(uid);
          if (refCode && plan !== "lifetime") {
            newSub.expiresAt = newSub.expiresAt + 7 * 864e5;
            newSub.ref_bonus_at = nowMs();
          } else if (refCode) {
            // 買斷:+7 天對無限期無意義 → 發 AI 加量包(2026-08-27 起,買斷戶的推薦貨幣)
            newSub.ref_bonus_at = nowMs();
            await grantAiBonus(uid, "推薦碼＋購買買斷 → AI 加量包").catch(e => console.error("grantAiBonus(ecpay) 略過:", e));
          }
        }
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
          pay_type: payType,
          external_id: tradeNo || merchantTradeNo,
          status: "success",
          note: rtnMsg,
        };
        if (body.InvoiceNo) txn.invoice_no = body.InvoiceNo;
        await writeTransaction(txn);

        // 用戶推薦好友雙向獎勵 · 獎推薦人那半:朋友(uid)真付費 → 給碼主 +7 天。
        // best-effort、冪等(referrer_paid_at)、非 user 型碼/自我推薦自動略過;絕不影響主開通流程。
        // 走到這一定是真付款(SimulatePaid=1 早已 return),故 isSandbox=false。
        await rewardReferrerOnPayment(uid, false).catch(e => console.error("rewardReferrer(ecpay) 略過:", e));
        // KOL 分潤:首筆真付款 → 產 pending 分潤(best-effort、冪等、非 KOL 碼/自我推薦自動略過)
        await recordKolCommission(uid, { plan, gross_twd: amount, source: "web", txnId: tradeNo || merchantTradeNo, isSandbox: false, isFirstPayment })
          .catch(e => console.error("recordKolCommission(ecpay) 略過:", e));

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
