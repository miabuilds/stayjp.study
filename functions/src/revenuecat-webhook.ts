// HTTP function:RevenueCat webhook(App IAP 訂閱事件)
//
// RevenueCat doc: https://www.revenuecat.com/docs/webhooks
//
// 事件類型:INITIAL_PURCHASE / RENEWAL / CANCELLATION / EXPIRATION / BILLING_ISSUE
// 跨平台共存:這裡寫入的 subscription.source = "app",網頁端讀同一份 Firestore doc。
//
// 部署完才接通,Apple Dev / Play Console 核准 + RevenueCat 連好後設 webhook URL。

import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as crypto from "crypto";
import { PLANS, PlanKey } from "./utils/constants";
import {
  writeSubscription, writeTransaction, getSubscription, getRefCode,
  rewardReferrerOnPayment, recordKolCommission, voidKolCommission, grantAiBonus, refBonusDays,
  patchSubscription, nowMs, plusDays, tryReserveEarlyBird, SubscriptionDoc,
} from "./utils/firestore";

if (admin.apps.length === 0) admin.initializeApp();

const ENTITLEMENT_ID = "StayJP Plan Premium";   // 跟 rc-sync-subscription.ts 一致

export const revenuecatWebhook = functions.onRequest(
  {
    region: "asia-east1",
    invoker: "public",
    secrets: ["REVENUECAT_SECRET_KEY", "REVENUECAT_WEBHOOK_SECRET"],   // SECRET_KEY:TRANSFER 查 RC REST 還原訂閱;WEBHOOK_SECRET:驗 Authorization 擋偽造
    maxInstances: 20,          // App IAP webhook,給多一點 burst 空間
    timeoutSeconds: 60,
    memory: "256MiB",
    concurrency: 80,
  },
  async (req, res) => {
    try {
      // 驗 RevenueCat shared secret。⚠️ 修:secret 以前在模組頂層讀 process.env,但 v2 secret
      // 只在 handler 執行時才注入 env → 那個值永遠是空字串 → 驗證整段從沒生效(fail-open,可偽造事件)。
      // 改成:handler 內讀取、secret 缺失一律拒絕(fail-closed)、timingSafeEqual 防時序側信道。
      const secret = process.env.REVENUECAT_WEBHOOK_SECRET || "";
      if (!secret) { console.error("[rc-webhook] WEBHOOK_SECRET 未設定,拒絕請求"); res.status(503).send("webhook not configured"); return; }
      const auth = req.headers.authorization || "";
      const expected = "Bearer " + secret;
      const ab = Buffer.from(auth), eb = Buffer.from(expected);
      if (ab.length !== eb.length || !crypto.timingSafeEqual(ab, eb)) {
        res.status(401).send("unauthorized");
        return;
      }

      const event = req.body?.event;
      if (!event) { res.status(400).send("missing event"); return; }

      const uid = event.app_user_id;   // RevenueCat SDK logIn(uid) 設的
      const productId = event.product_id as string;
      const type = event.type as string;

      console.log("RevenueCat event:", { type, uid, productId });

      // TRANSFER:Apple 沙盒/換機/換帳號時,同一 Apple ID 的購買會在 app_user_id 之間轉移。
      // 這種事件「沒有 app_user_id / product_id」,uid 在 transferred_to / transferred_from。
      // 原本走到下面 `!uid` → 400 → RC 不斷重試卻永遠失敗 → 權益轉到新 uid 卻沒人寫 →
      // 「付了錢訂閱卻是空的」。改:對 transferred_to 查 RC REST 還原訂閱;transferred_from 失權則收回。
      if (type === "TRANSFER") {
        const toList: string[] = Array.isArray(event.transferred_to) ? event.transferred_to : [];
        const fromList: string[] = Array.isArray(event.transferred_from) ? event.transferred_from : [];
        console.log("RevenueCat TRANSFER:", { to: toList, from: fromList });
        let wrote = 0;
        let hadError = false;
        for (const to of toList) {
          if (!to || String(to).startsWith("$RCAnonymousID")) continue;   // 匿名 id 不是真 user
          const r = await fetchAndWriteFromRc(to);
          if (r === "written") wrote++;
          else if (r === "error") hadError = true;
        }
        for (const fr of fromList) {
          if (!fr || String(fr).startsWith("$RCAnonymousID")) continue;
          const ent = await fetchRcEntitlement(fr);
          if (ent.ok && !ent.active) {
            // 確認 from 端在 RC 已無有效權益 → 收回(Apple 同群組只允許一個有效訂閱)
            const ex = await getSubscription(fr);
            if (ex && ex.status === "active") {
              await patchSubscription(fr, { status: "expired", willRenew: false, expiresAt: nowMs() });
            }
          } else if (!ent.ok) {
            hadError = true;
          }
        }
        // 全部查詢都失敗且沒寫成任何一筆 → 回非 2xx 讓 RC 稍後重試(別吞掉)
        if (hadError && wrote === 0) { res.status(503).send("rc fetch error, retry later"); return; }
        res.status(200).send(`ok (transfer wrote=${wrote})`);
        return;
      }

      if (!uid) { res.status(400).send("missing app_user_id"); return; }

      // product_id 映射到 plan
      const plan = mapProductIdToPlan(productId);
      if (!plan) {
        console.warn("Unknown product_id:", productId);
        res.status(200).send("ok (unknown product)");
        return;
      }

      const planInfo = PLANS[plan];
      const existingSub = await getSubscription(uid);
      const eventId = event.id as string | undefined;   // RC 事件唯一 id → 給 writeTransaction 做冪等(重送不重複入帳)
      // 實際結帳幣別 + 實付金額(外國人買 iOS 才有意義;amount_twd 只是台幣牌價,非實收)。
      // 注意 Firestore 不收 undefined → 有值才放進物件。
      const rcMoney: { currency?: string; amount_paid?: number } = {};
      if (typeof event.currency === "string" && event.currency) rcMoney.currency = event.currency;
      if (typeof event.price_in_purchased_currency === "number") rcMoney.amount_paid = event.price_in_purchased_currency;
      // 沙盒(測試)vs 正式(真實付款)→ 寫進 subscription/交易,後台才分得出測試帳號與真實金流
      const isSandbox = event.environment === "SANDBOX";
      // 台幣結帳時 amount_twd/KOL 分潤改記「實付」而非現行牌價:
      // 調價後凍漲的舊訂戶續訂(Apple/Google 照舊價扣)若記新牌價 → 營收灌水 + KOL 佣金多付。
      // 非台幣(外國人)拿不到匯率 → 維持牌價估計(既有行為,對帳已知僅供參考)。
      const paidTwd = rcMoney.currency === "TWD"
        && typeof rcMoney.amount_paid === "number" && rcMoney.amount_paid > 0
        ? Math.round(rcMoney.amount_paid) : null;

      switch (type) {
        case "INITIAL_PURCHASE":
        case "RENEWAL":
        case "NON_RENEWING_PURCHASE":   // 買斷(lifetime)是非續訂商品 → RC 發此事件,不是 INITIAL_PURCHASE。原本沒接 → 買斷付了 2990 卻寫不進訂閱
        case "PRODUCT_CHANGE": {   // 月↔年 升降級:用新 product 重寫 plan/到期日(原本沒處理 → 升降級不生效)
          // 只有「首次購買早鳥 product」才佔名額;is_early_bird 以「買的就是早鳥 product」為準(sticky:不被續訂/競態打回原價)
          if (plan === "yearly_early_bird" && type === "INITIAL_PURCHASE") {
            await tryReserveEarlyBird();
          }
          // 防呆:access 只增不減。理論上 Apple 同訂閱群組只允許一個有效訂閱,但若群組設錯 /
          // sandbox 殘留 / 事件亂序,導致一個用戶多個訂閱事件競爭時,不讓「較短的續訂」蓋掉
          // 「較晚到期的有效訂閱」。仍照常記帳本(稽核),但當前訂閱保留較長有效期 + 該方案身分,
          // 避免到期日/方案在事件間跳動、誤縮短權益。
          // 到期日以 RevenueCat/Apple 給的真實 expiration_at_ms 為準:
          //   試用 → 試用結束日(7 天後),帳號頁才顯示「剩 7 天」而非整個方案週期;
          //   續訂 → 實際週期末(沙盒加速也正確);取消後也才會在正確日期斷權益,不多送。
          // 缺值(買斷 NON_RENEWING 無到期等)才退回「now + 方案週期天數」。rcSync 一直是讀真實到期,這裡對齊。
          const rcExpiryMs = typeof event.expiration_at_ms === "number" && event.expiration_at_ms > 0 ? event.expiration_at_ms : null;
          const newExpiry = rcExpiryMs || plusDays(nowMs(), planInfo.period_days);
          // 只有「目前仍 active」的訂閱才值得保留;refunded / voided(假刪)/ cancelled / expired
          // 一律不保留 → 避免一筆遲到的續訂把「已退款/已撤銷」帳號重新復活成 premium。
          const keepExisting = !!existingSub && existingSub.status === "active"
            && (existingSub.expiresAt || 0) > newExpiry;
          const finalPlan = keepExisting ? existingSub!.plan : plan;
          const finalExpiry = keepExisting ? existingSub!.expiresAt : newExpiry;
          const isEarlyBird = finalPlan === "yearly_early_bird" || existingSub?.is_early_bird === true;
          const newSub: SubscriptionDoc = {
            source: "app",
            plan: finalPlan,
            // 試用期(免費 7 天)→ trialing,帳號頁顯示「試用中・剩 N 天」;試用轉付費的 RENEWAL period_type=NORMAL → active
            status: event.period_type === "TRIAL" ? "trialing" : "active",
            expiresAt: finalExpiry,
            willRenew: finalPlan !== "lifetime",   // 買斷不續訂
            startedAt: existingSub?.startedAt || nowMs(),
            apple_txn: event.transaction_id,
            is_early_bird: isEarlyBird,
            is_sandbox: isSandbox,
            failed_retries: 0,
          };
          // 推薦碼好康(階段2):確認「真實付費」轉化才送 7 天(數位邊際成本≈0;一次性、不疊加、不重複)。
          // 條件:active(真付款,非 TRIAL)+ 非沙盒 + 該帳號有 ref_code + 之前沒發過。
          if (existingSub?.ref_bonus_at) {
            newSub.ref_bonus_at = existingSub.ref_bonus_at;   // 延續旗標 → 續訂不重發、不一直 +7
          } else if (newSub.status === "active" && !isSandbox) {
            const refCode = await getRefCode(uid);
            if (refCode && finalPlan !== "lifetime") {
              newSub.expiresAt = newSub.expiresAt + refBonusDays(finalPlan) * 864e5;   // 依方案:月費+7、年費+30(我們的權益;Apple 計費週期不變)
              newSub.ref_bonus_at = nowMs();
            } else if (refCode) {
              newSub.ref_bonus_at = nowMs();   // 買斷:發 AI 加量包(天數對買斷無意義)
              await grantAiBonus(uid, "推薦碼＋購買買斷(App)→ AI 加量包").catch(e => console.error("grantAiBonus(rc) 略過:", e));
            }
          }
          // 匿名購買(未登入)→ 不寫 users/{$RCAnonymousID} 訂閱 doc(否則污染訂閱者清單、變假使用者)。
          // 權益靠 RC 裝置級 entitlement 解鎖;登入後由 TRANSFER 歸戶把訂閱寫進真帳號。
          // 交易仍照記(見下)→ 營收準確,匿名購買也算得到。
          const isAnonUid = typeof uid === "string" && uid.startsWith("$RCAnonymousID");
          if (!isAnonUid) await writeSubscription(uid, newSub);

          await writeTransaction({
            uid,
            type: (type === "INITIAL_PURCHASE" || type === "NON_RENEWING_PURCHASE") ? "subscribe" : "renew",
            source: "app",
            plan,
            // 免費試用(period_type=TRIAL)沒實際扣款 → amount_twd 記 0,不灌營收;
            // 試用轉正的 RENEWAL(period_type=NORMAL)才是第一筆真實收款 → 台幣單記實付,其餘記牌價估計。
            amount_twd: event.period_type === "TRIAL" ? 0 : (paidTwd ?? planInfo.price_twd),
            ...rcMoney,   // 實際幣別 + 實付金額(外國人/非台幣);試用時 amount_paid 本就 0
            is_sandbox: isSandbox,
            payment_method: event.store === "PLAY_STORE" ? "google_billing" : "apple_iap",
            external_id: event.transaction_id || event.original_transaction_id,
            status: "success",
            note: event.period_type === "TRIAL" ? `RevenueCat ${type} (免費試用,未扣款)` : `RevenueCat ${type}`,
          }, eventId);

          // 用戶推薦好友雙向獎勵 · 獎推薦人那半:朋友真付費轉化 → 給碼主 +7 天。
          // 試用(未扣款)當作沙盒略過,等轉正的 RENEWAL 才發;沙盒/匿名/非 user 型碼由 helper 自擋。冪等。
          await rewardReferrerOnPayment(uid, isSandbox || event.period_type === "TRIAL")
            .catch(e => console.error("rewardReferrer(rc) 略過:", e));
          // KOL 分潤:首筆真付款轉化 → 產 pending 分潤(試用 gross=0 自動略過;續訂非首筆略過)
          await recordKolCommission(uid, {
            plan,
            gross_twd: event.period_type === "TRIAL" ? 0 : (paidTwd ?? planInfo.price_twd),
            source: "app",
            txnId: event.transaction_id || event.original_transaction_id || "",
            isSandbox,
            // 「試用→轉正」的 RENEWAL 就是這位買家的首筆真付款:不算首筆的話,App 走試用的訂閱
            // 分潤永遠記不到(INITIAL 時 gross=0 略過、RENEWAL 又被 isFirstPayment=false 擋——兩頭踢皮球,2026-08-27 抓到)。
            // 冪等仍由 commissions/{code_buyer} doc id 保證,重送/誤判都不會重複入帳。
            isFirstPayment: type === "INITIAL_PURCHASE" || type === "NON_RENEWING_PURCHASE"
              || (type === "RENEWAL" && existingSub?.status === "trialing"),
          }).catch(e => console.error("recordKolCommission(rc) 略過:", e));
          break;
        }

        case "CANCELLATION": {
          if (existingSub) {
            await patchSubscription(uid, { willRenew: false });
          }
          await writeTransaction({
            uid,
            type: "cancel",
            source: "app",
            plan,
            amount_twd: 0,
            payment_method: event.store === "PLAY_STORE" ? "google_billing" : "apple_iap",
            external_id: event.transaction_id || "",
            status: "success",
            note: "User cancelled (will run until expiresAt)",
          }, eventId);
          break;
        }

        case "EXPIRATION": {
          // 到期是「結果」不是獨立金流事件 — 只改訂閱狀態,不寫交易列。
          // ⚠️ 防亂序/寬限期:Apple/RC 事件可能延遲或亂序送達。若目前到期日仍在未來,
          //    代表已被較新的續訂(RENEWAL)延長 → 這是過期的舊事件,忽略,不可降級(否則誤鎖付費者
          //    = wrongly_expired)。真的該過期時,連 expiresAt 一起拉到 now,狀態才不會跟到期日打架。
          const curExp = await getSubscription(uid);
          if (curExp && (curExp.expiresAt || 0) > nowMs()) {
            console.log("⏭️ EXPIRATION 忽略(到期日仍在未來,已被較新續訂延長)", { uid, expiresAt: curExp.expiresAt, txn: event.transaction_id });
          } else {
            await patchSubscription(uid, { status: "expired", willRenew: false, expiresAt: nowMs() });
            console.log("ℹ️ EXPIRATION (只改狀態,不入帳)", { uid, plan, txn: event.transaction_id });
          }
          break;
        }

        case "BILLING_ISSUE": {
          await patchSubscription(uid, {
            failed_retries: (existingSub?.failed_retries || 0) + 1,
            last_retry_at: nowMs(),
          });
          await writeTransaction({
            uid,
            type: "fail",
            source: "app",
            plan,
            amount_twd: 0,
            payment_method: event.store === "PLAY_STORE" ? "google_billing" : "apple_iap",
            external_id: event.transaction_id || "",
            status: "failed",
            note: "Billing issue (card expired / insufficient funds)",
          }, eventId);
          break;
        }

        // Apple/Google 退款或退單(信用卡爭議)。RevenueCat 送 REFUND;
        // 沒處理的話 doc 會停在 status:active、expiresAt 未來 → 退款後仍能無限用(漏財紅線)。
        // 立即收回:status→refunded、willRenew→false、expiresAt→now(isPremium 立刻判定失效)。
        case "REFUND":
        case "CHARGEBACK": {
          await patchSubscription(uid, { status: "refunded", willRenew: false, expiresAt: nowMs() });
          // 退款金額存成負數(實際幣別),方便對帳:外國人退的是當地幣別,不是台幣
          const refundMoney: { currency?: string; amount_paid?: number } = {};
          if (rcMoney.currency) refundMoney.currency = rcMoney.currency;
          if (rcMoney.amount_paid != null) refundMoney.amount_paid = -Math.abs(rcMoney.amount_paid);
          await writeTransaction({
            uid,
            type: "refund",
            source: "app",
            plan,
            amount_twd: 0,
            ...refundMoney,
            is_sandbox: isSandbox,
            payment_method: event.store === "PLAY_STORE" ? "google_billing" : "apple_iap",
            external_id: event.transaction_id || event.original_transaction_id || "",
            status: "refunded",
            note: `RevenueCat ${type} — access revoked`,
          }, eventId);
          // KOL 分潤 clawback:退款/退單 → 該買家的分潤作廢(已付則後續扣回)
          await voidKolCommission(uid, `rc_${type.toLowerCase()}`).catch(e => console.error("voidKolCommission(rc) 略過:", e));
          break;
        }

        default:
          console.log("Unhandled RevenueCat event type:", type);
      }

      res.status(200).send("ok");
    } catch (err) {
      console.error("revenuecatWebhook error:", err);
      res.status(500).send("internal");
    }
  },
);

function mapProductIdToPlan(productId: string): PlanKey | null {
  // Product IDs 定義在 stayjp-app/src/lib/subscription.ts:PLANS
  // App Store Connect / Play Console 上要建這些 product
  const map: Record<string, PlanKey> = {
    "com.stayjp.app.monthly": "monthly",
    "stayjp_monthly": "monthly",
    "com.stayjp.app.yearly": "yearly",
    "stayjp_yearly": "yearly",
    "com.stayjp.app.yearly_early_bird": "yearly_early_bird",
    "stayjp_yearly_early_bird": "yearly_early_bird",
    "com.stayjp.app.lifetime": "lifetime",   // 原本漏了 → app 買斷版會寫不進(unknown product)
    "stayjp_lifetime": "lifetime",
  };
  return map[productId] ?? null;
}

// ── TRANSFER 用:跟 RevenueCat REST 對帳(獨立驗證,跟 rc-sync-subscription.ts 同一套邏輯)──
interface RcEnt { ok: boolean; active: boolean; productId?: string; expiresDate?: string | null; unsubscribed?: boolean; }

async function fetchRcEntitlement(uid: string): Promise<RcEnt> {
  const secret = process.env.REVENUECAT_SECRET_KEY || "";
  if (!secret || !uid) return { ok: false, active: false };
  try {
    const r = await fetch(`https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(uid)}`, {
      headers: { Authorization: `Bearer ${secret}` },
    });
    if (!r.ok) return { ok: false, active: false };
    const data = await r.json() as { subscriber?: { entitlements?: Record<string, {
      expires_date?: string | null; product_identifier?: string; unsubscribe_detected_at?: string | null;
    }> } };
    const ent = data?.subscriber?.entitlements?.[ENTITLEMENT_ID];
    const active = !!ent && (!ent.expires_date || new Date(ent.expires_date).getTime() > Date.now());
    return {
      ok: true, active,
      productId: ent?.product_identifier,
      expiresDate: ent?.expires_date,
      unsubscribed: !!ent?.unsubscribe_detected_at,
    };
  } catch {
    return { ok: false, active: false };
  }
}

async function fetchAndWriteFromRc(uid: string): Promise<"written" | "no-entitlement" | "error"> {
  const ent = await fetchRcEntitlement(uid);
  if (!ent.ok) return "error";
  if (!ent.active) return "no-entitlement";
  const plan = mapProductIdToPlan(ent.productId || "") || "monthly";
  const expiresAt = ent.expiresDate ? new Date(ent.expiresDate).getTime() : nowMs() + 365 * 100 * 864e5;
  const existing = await getSubscription(uid);
  const sub: SubscriptionDoc = {
    source: "app",
    plan,
    status: "active",
    expiresAt,
    willRenew: !ent.unsubscribed,
    startedAt: existing?.startedAt || nowMs(),
    is_early_bird: existing?.is_early_bird === true,
    failed_retries: 0,
  };
  // 推薦碼好康(匿名購買→登入歸戶的補發點):
  // 購買當下帳號是匿名的,INITIAL_PURCHASE 讀不到 ref_code → +7/推薦人獎勵/KOL 分潤全漏(審查抓漏)。
  // 在這裡補跑。「剩餘權益 > 8 天」一石二鳥排除試用(7天)與沙盒(幾分鐘~幾小時),不必另查 RC。
  // 同時修:原本重寫 sub 沒帶舊 ref_bonus_at → 旗標丟失,之後續訂會重複 +7。
  let grantBonus = false;
  if (existing?.ref_bonus_at) {
    sub.ref_bonus_at = existing.ref_bonus_at;
  } else if ((expiresAt - nowMs()) > 8 * 864e5) {
    const refCode = await getRefCode(uid);
    if (refCode && plan !== "lifetime") { sub.expiresAt = expiresAt + refBonusDays(plan) * 864e5; sub.ref_bonus_at = nowMs(); grantBonus = true; }   // 依方案:月費+7、年費+30
    else if (refCode) { sub.ref_bonus_at = nowMs(); grantBonus = true;
      await grantAiBonus(uid, "推薦碼＋購買買斷(歸戶補發)→ AI 加量包").catch(e => console.error("grantAiBonus(transfer) 略過:", e)); }
  }
  await writeSubscription(uid, sub);
  if (grantBonus || (!existing?.ref_bonus_at && (expiresAt - nowMs()) > 8 * 864e5)) {
    // 推薦人 +7 / KOL 分潤(各自冪等:referrer_paid_at / commissions doc id;重送不重複)
    await rewardReferrerOnPayment(uid, false).catch(e => console.error("rewardReferrer(transfer) 略過:", e));
    await recordKolCommission(uid, { plan, gross_twd: PLANS[plan].price_twd, source: "app",
      txnId: `transfer_${uid}`, isSandbox: false, isFirstPayment: existing?.status !== "active" })
      .catch(e => console.error("recordKolCommission(transfer) 略過:", e));
  }
  // 帳號頁交易明細:補一筆「App 訂閱(登入歸戶)」。amount_twd=0 → 不重複計營收
  //（真實付款/試用已在購買當下記過,可能在匿名 id 名下)。冪等 id 防 TRANSFER 重送重複寫。
  await writeTransaction({
    uid,
    type: "subscribe",
    source: "app",
    plan,
    amount_twd: 0,
    payment_method: "apple_iap",
    external_id: "",
    status: "success",
    note: "透過 App Store 訂閱(登入歸戶)",
  }, `transfer_${uid}`);
  return "written";
}
