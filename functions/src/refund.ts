// HTTP function:用戶按 [申請退費] → 全自動退款
//
// 修正版(2026-05-28):
//   - 用 TradeNo 而非 MerchantTradeNo(從最近一筆 success transaction 取)
//   - 退費對「最近一筆 charge」做,不是 plan 總金額
//   - lifetime 7 天後完全不退(memory 規則)
//   - 綠界退費失敗 → Firestore 不更新狀態,避免錢沒退但用戶降級
//
// 規則:
//   - source=web 才接受;App 訂戶導去 iOS Settings
//   - 7 天內首次訂閱 → 全額退,釋放早鳥名額
//   - 7 天後仍在期間內(非 lifetime)→ 按剩餘比例退最近一筆 charge
//   - lifetime 7 天後 → 拒絕
//   - 已過期 / 已退過 → 拒絕

import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import axios from "axios";
import { PLANS, REFUND_POLICY, ecpayConfig, ecpayRefundEndpoint, ECPAY_SECRETS } from "./utils/constants";
import { checkMacValue } from "./utils/ecpay";
import {
  getSubscription, patchSubscription, writeTransaction,
  recordRefund, releaseEarlyBird, getLatestSuccessTradeNo, nowMs, emailHash,
} from "./utils/firestore";

if (admin.apps.length === 0) admin.initializeApp();

export const refund = functions.onRequest(
  {
    secrets: ECPAY_SECRETS,
    cors: true,
    region: "asia-east1",
    invoker: "public",
    maxInstances: 5,
    timeoutSeconds: 120,
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
      const email = decoded.email || "";

      const sub = await getSubscription(uid);
      if (!sub) { res.status(400).json({ error: "no_subscription" }); return; }

      if (sub.source !== "web") {
        res.status(400).json({
          error: "wrong_platform",
          reason: "App 訂閱請至「設定 → Apple ID / Google Pay」管理。",
        });
        return;
      }

      // 只擋「已結算」狀態(status="refunded" 同時涵蓋已退款與已爭議扣回 chargeback,
      // 見 chargeback.ts),避免重複退費。其餘狀態(含 expired/逾期停權)只要仍有
      // 「已付費未使用天數」就應允許比例退,不得逕予沒收(消保法第12條 顯失公平)。
      // 實際可退金額由下方比例計算把關,daysRemaining<=0 時以 no_refundable_amount 擋下。
      if (sub.status === "refunded") {
        res.status(400).json({
          error: "already_settled",
          reason: "訂閱已退款/已爭議扣回,無可重複退費。",
        });
        return;
      }

      // 計算退費金額
      const planInfo = PLANS[sub.plan];
      const startedAt = sub.startedAt;
      const now = nowMs();
      const daysSinceStart = Math.floor((now - startedAt) / (24 * 60 * 60 * 1000));
      const daysRemaining = Math.max(0, Math.floor((sub.expiresAt - now) / (24 * 60 * 60 * 1000)));

      let refundAmount: number;
      let refundReason: string;

      if (sub.plan === "lifetime") {
        // Lifetime 7 天內全退,7 天後拒絕(memory 規則)
        if (daysSinceStart <= REFUND_POLICY.full_refund_days) {
          refundAmount = planInfo.price_twd;
          refundReason = "終身方案 7 天內全額退";
        } else {
          res.status(400).json({
            error: "lifetime_no_refund",
            reason: "終身方案超過 7 天視為已使用,無可退費。",
          });
          return;
        }
      } else if (daysSinceStart <= REFUND_POLICY.full_refund_days) {
        // 一般訂閱 7 天內 全退
        refundAmount = planInfo.price_twd;
        refundReason = "首次訂閱 7 天內全額退";
      } else {
        // 一般訂閱 7 天後 按剩餘比例退;上限為單期價(續扣多期者 daysRemaining 可能 > period_days,
        // 退到「最近一筆 charge」超過該筆金額會被綠界退刷打回 → cap 在單期價)
        refundAmount = Math.min(planInfo.price_twd, Math.floor(planInfo.price_twd * daysRemaining / planInfo.period_days));
        refundReason = `按剩餘 ${daysRemaining} 天比例退`;
        if (refundAmount <= 0) {
          res.status(400).json({ error: "no_refundable_amount", reason: "已用完訂閱期,無可退費。" });
          return;
        }
      }

      // 拿最近一筆 success transaction 的 TradeNo(綠界產的交易編號)
      const tradeNo = await getLatestSuccessTradeNo(uid);
      if (!tradeNo) {
        res.status(500).json({ error: "missing_trade_no", reason: "找不到對應的扣款交易,請聯絡客服。" });
        return;
      }
      if (!sub.ecpay_order) {
        res.status(500).json({ error: "missing_ecpay_order" });
        return;
      }

      // 呼叫綠界退費 API(信用卡 CreditDetail/DoAction)
      //
      // ⚠️ 信用卡退款動作依「結算狀態」不同,用錯會回 error_amount_R:
      //   已關帳(撥款後,約隔日起) → R 退刷(可部分退)
      //   已請款未關帳(當天/撥款前) → E 取消請款(僅全額)
      //   已授權未請款(預授權)      → N 放棄授權(僅全額)
      // 不另打查詢 API,改採「依序嘗試、取第一個 RtnCode=1」:
      //   全額退(7 天內)→ R → E → N(任一結算狀態都能退到錢)
      //   部分退(逾 7 天,必已關帳)→ 只用 R(E/N 僅全額,不可用於部分退)
      const cfg = ecpayConfig();
      const isFullRefund = refundAmount === planInfo.price_twd;
      const actions = isFullRefund ? ["R", "E", "N"] : ["R"];

      let ecpayMsg = "";       // 失敗時回報用
      let rMsg = "";           // R(退刷)的回應 — 已關帳交易的真正失敗原因通常在此(如「可退刷額度不足」)
      let refundOk = false;
      let usedAction = "";
      for (const action of actions) {
        const refundParams: Record<string, string | number> = {
          MerchantID: cfg.merchantId,
          MerchantTradeNo: sub.ecpay_order,
          TradeNo: tradeNo,                // ← 必須是 ECPay TradeNo 不是 MerchantTradeNo
          Action: action,
          TotalAmount: refundAmount,
        };
        refundParams.CheckMacValue = checkMacValue(refundParams);
        let msg = "";
        try {
          const ecpayRes = await axios.post(
            ecpayRefundEndpoint(),
            new URLSearchParams(refundParams as Record<string, string>).toString(),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" }, timeout: 30000 },
          );
          msg = String(ecpayRes.data);
          console.log(`ECPay refund response (Action=${action}):`, msg);
          // 綠界 DoAction 回應格式:RtnCode=1 為成功
          if (/RtnCode=1\b/.test(msg)) { refundOk = true; usedAction = action; ecpayMsg = msg; break; }
        } catch (e) {
          msg = String(e);
          console.error(`ECPay refund call failed (Action=${action}):`, e);
        }
        if (action === "R") rMsg = msg;
      }
      // 失敗時優先回報 R 的原因:E/N 對已關帳交易必回 error_closed,會蓋掉真正原因(如餘額不足)
      if (!refundOk) ecpayMsg = rMsg || ecpayMsg;

      if (!refundOk) {
        // 綠界退費失敗 → 不要更新 Firestore,避免錢沒退用戶降級
        await writeTransaction({
          uid,
          type: "refund",
          source: "web",
          plan: sub.plan,
          amount_twd: 0,
          payment_method: "ecpay",
          external_id: tradeNo,
          status: "failed",
          note: `ECPay refund failed: ${ecpayMsg}`,
        });
        res.status(500).json({
          error: "ecpay_refund_failed",
          reason: "綠界退費失敗,請聯絡客服處理。",
          ecpay_response: ecpayMsg,
        });
        return;
      }

      // 退費成功 → 更新狀態 + 寫帳本 + 釋放早鳥
      await patchSubscription(uid, {
        status: "refunded",
        willRenew: false,
      });

      await writeTransaction({
        uid,
        type: "refund",
        source: "web",
        plan: sub.plan,
        amount_twd: -refundAmount,
        payment_method: "ecpay",
        external_id: tradeNo,
        status: "refunded",
        email_hash: emailHash(email),
        note: `${refundReason}(ECPay Action=${usedAction})`,
      });

      // 早鳥首次訂閱 + 7 天內全退 → 釋放名額(讓下一個 user 可以買早鳥)
      // 釋放後清 is_early_bird flag,確保每個名額最多釋放一次(避免後續 chargeback 重複釋放)
      if (sub.is_early_bird && daysSinceStart <= REFUND_POLICY.full_refund_days) {
        await releaseEarlyBird().catch(e => console.warn("releaseEarlyBird fail:", e));
        await patchSubscription(uid, { is_early_bird: false }).catch(() => {});
      }

      // 記黑名單(refund_count++,2 次 → permanently_blocked)
      const bl = await recordRefund(email);

      res.json({
        ok: true,
        refunded_amount: refundAmount,
        new_status: "refunded",
        will_blacklist: bl.permanently_blocked,
        message: `已退費 NT$${refundAmount}。款項由綠界經發卡銀行退回原卡,入帳時間依你的信用卡結帳週期而定(若已過結帳日可能落在下一期帳單),請留意信用卡帳單或洽發卡銀行。${bl.permanently_blocked ? "因第 2 次退費,此帳號已限制再次訂閱。" : ""}`,
      });
    } catch (err) {
      console.error("refund error:", err);
      res.status(500).json({ error: "internal", message: String(err) });
    }
  },
);
