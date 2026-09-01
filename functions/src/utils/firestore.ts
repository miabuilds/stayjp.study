// Firestore 寫入 helpers — 訂閱 / 交易 / 早鳥計數 / blacklist
//
// 跨平台共存原則:
//   - subscription.source ∈ {"web","app"} 區分平台
//   - 同 uid 只能有一筆 active subscription (precheck 擋重複)
//   - 退費 / 取消 / chargeback 都會把 status 改掉,讓另一邊重新可以訂

import * as admin from "firebase-admin";
import crypto from "crypto";
import {
  EARLY_BIRD_LIMIT, EARLY_BIRD_END_MS,
  PlanKey,
  Source,
  SubStatus,
  REFUND_POLICY,
} from "./constants";

if (admin.apps.length === 0) admin.initializeApp();
export const db = admin.firestore();
// 讓 undefined 欄位被忽略,避免未來 ECPay / RevenueCat payload 漏欄位就炸 function
db.settings({ ignoreUndefinedProperties: true });
export const FieldValue = admin.firestore.FieldValue;

// ───── helpers ─────────────────────────────────────────────────────────

export function emailHash(email: string): string {
  return crypto.createHash("sha256").update(email.toLowerCase().trim()).digest("hex").slice(0, 16);
}

export function nowMs(): number {
  return Date.now();
}

export function plusDays(ms: number, days: number): number {
  return ms + days * 24 * 60 * 60 * 1000;
}

// ───── subscription r/w ────────────────────────────────────────────────

export interface SubscriptionDoc {
  source: Source;
  plan: PlanKey;
  status: SubStatus;
  expiresAt: number;
  willRenew: boolean;
  startedAt: number;
  ecpay_order?: string;
  apple_txn?: string;
  google_txn?: string;
  paypal_capture?: string;   // PayPal 一次性付款的 capture id;有值 = 來源為 PayPal、退費要用它
  is_early_bird?: boolean;
  is_gift?: boolean;           // 手動贈送(0 元開通)→ 用戶端顯示「贈送」、後台/報表不計入付費客戶
  is_sandbox?: boolean;        // Apple/Google 沙盒測試購買(非真實付款)→ 後台用來區分測試/真實
  pay_type?: "credit" | "atm" | "cvs" | "paypal";   // 綠界付款細分:信用卡(可續扣)/ATM/超商(一次性,不續扣)
  refund_requested_at?: admin.firestore.Timestamp;
  failed_retries?: number;
  last_retry_at?: number;
  ref_bonus_at?: number;       // KOL 推薦碼好康:確認真實付款後發過 7 天的時戳(一次性,防重複/疊加)
}

export async function getSubscription(uid: string): Promise<SubscriptionDoc | null> {
  const snap = await db.doc(`users/${uid}`).get();
  return (snap.data()?.subscription as SubscriptionDoc) || null;
}

// 讀使用者根層的 KOL 推薦碼(歸因用;與 subscription 同一份 users/{uid} 文件)
export async function getRefCode(uid: string): Promise<string> {
  const snap = await db.doc(`users/${uid}`).get();
  return (snap.data()?.ref_code as string) || "";
}

export async function writeSubscription(uid: string, sub: SubscriptionDoc): Promise<void> {
  await db.doc(`users/${uid}`).set({ subscription: sub }, { merge: true });
}

export async function patchSubscription(
  uid: string,
  patch: Partial<SubscriptionDoc>,
): Promise<void> {
  // 用 set(merge) 而非 update():update() 在 doc 不存在時會丟 NOT_FOUND → 整個 webhook 500、
  // RevenueCat 無限重送,且 REFUND/EXPIRATION 永遠撤銷不了權益(漏財紅線)。set merge 會深層合併
  // subscription 既有欄位、doc 不存在則建立,語義等同但不會炸。
  const subPatch: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(patch)) subPatch[k] = v;
  await db.doc(`users/${uid}`).set({ subscription: subPatch }, { merge: true });
}

// ───── AI 加量包發放(推薦獎勵的「買斷戶貨幣」)─────────────────────
// 買斷戶不缺天數:被推薦人買買斷、或推薦人自己是買斷戶時,+7 天是空氣 →
// 改發 AI 加量包(對話 +5 場、評分 +15 次,一次性,寫進 ai_usage 的 bonus 池,額度系統優先扣 bonus)。
// 2026-08-27 Mia 拍板(數量取小)。成本 ~US$1/份,只在真實付款時發。
export const REF_AI_BONUS = { chat: 5, eval: 30 };
// 推薦獎勵天數(依方案分級,2026-09):月費 +7 天、年費/早鳥 +30 天(一個月)。
// 買斷不走天數(對永久會員無感)→ 呼叫端改發 AI 加量包。雙邊(推薦人 + 被推薦買家)共用同一套。
export function refBonusDays(plan: string | undefined): number {
  return (plan === "yearly" || plan === "yearly_early_bird") ? 30 : 7;
}
export async function grantAiBonus(uid: string, note: string): Promise<void> {
  await db.doc(`ai_usage/${uid}`).set({
    bonusChat: FieldValue.increment(REF_AI_BONUS.chat),
    bonusEval: FieldValue.increment(REF_AI_BONUS.eval),
  }, { merge: true });
  await writeTransaction({
    uid, type: "gift", source: "web", plan: "lifetime",
    amount_twd: 0, payment_method: "manual", external_id: `aibonus-${uid}-${nowMs()}`,
    status: "success", note,
  });
}

/**
 * 用戶推薦好友 · 雙向獎勵的「獎推薦人」那半:朋友真實付費後,給碼主(推薦人)+7 天 premium。
 * 從兩支付款 callback 呼叫(朋友首次真付費點);best-effort、包在 try 外層不影響主流程。
 * 安全設計:
 *   - 沙盒 / 匿名 uid → 不發
 *   - 朋友沒歸因碼 / 該碼非 user 型(KOL 走抽成) → 不發
 *   - 防自我推薦(owner === friend) → 不發
 *   - 冪等:朋友 referrer_paid_at 設過就不再發(續訂不重複獎)
 */
export async function rewardReferrerOnPayment(friendUid: string, isSandbox: boolean): Promise<void> {
  if (isSandbox) return;
  if (typeof friendUid !== "string" || friendUid.startsWith("$RCAnonymousID")) return;
  const fSnap = await db.doc(`users/${friendUid}`).get();
  const fd = fSnap.data() || {};
  const code = fd.ref_code as string | undefined;
  if (!code || fd.referrer_paid_at) return;
  const cSnap = await db.doc(`ref_codes/${code}`).get();
  const c = cSnap.data();
  if (!c || c.type !== "user") return;                 // 只有用戶個人碼獎碼主;KOL 碼不走這
  const ownerUid = c.owner_uid as string | undefined;
  if (!ownerUid || ownerUid === friendUid) return;      // 防自我推薦
  // 獎推薦人:訂閱戶 +7 天;買斷戶(天數無意義)改發 AI 加量包(2026-08-27 起)
  const ownerSub = await getSubscription(ownerUid);
  if (ownerSub?.plan === "lifetime") {
    await grantAiBonus(ownerUid, `推薦好友(${friendUid})付費 → 推薦人為買斷戶,發 AI 加量包(對話+${REF_AI_BONUS.chat}/評分+${REF_AI_BONUS.eval})`);
  } else {
    const bonusDays = refBonusDays(ownerSub?.plan);   // 依推薦人自己的方案:月費 7 天、年費 30 天
    const base = Math.max(nowMs(), ownerSub?.expiresAt || 0);
    const patch: Partial<SubscriptionDoc> = { status: "active", expiresAt: base + bonusDays * 864e5, willRenew: ownerSub?.willRenew ?? false };
    if (!ownerSub) { patch.plan = "monthly"; patch.source = "web"; patch.startedAt = nowMs(); }
    await patchSubscription(ownerUid, patch);
    await writeTransaction({
      uid: ownerUid, type: "gift", source: "web", plan: ownerSub?.plan || "monthly",
      amount_twd: 0, payment_method: "manual", external_id: `referral-${friendUid}-${nowMs()}`,
      status: "success", note: `推薦好友(${friendUid})付費 → 獎勵推薦人 +${bonusDays} 天`,
    });
  }
  await db.doc(`users/${friendUid}`).set({ referrer_paid_at: nowMs() }, { merge: true });
}

// ───── KOL 分潤引擎 ──────────────────────────────────────────────────────
// commissions/{code_buyerUid}:被推薦人「首筆真實付款」產生一筆分潤紀錄。
// 狀態:pending(付款,鎖定期內)→ locked(過 30 天無退費,可領)→ paid(已結算匯款);
//       void = 退費/退單作廢(clawback)。精算金額給後台結算與付款用。
const COMMISSION_LOCK_DAYS = 30;
// 平台手續費(用來算「利潤」,分潤抽在利潤上)。
//   web    綠界 2.75%
//   app    Apple/Google SBP 15%
//   paypal 收款約 5.45%(依實測 990×4 收到 3744)+ 提領 2.5% ≈ 7.8%。
//          註:PayPal 小額收款含固定費,實際%會隨金額浮動;之後接 PayPal 首購分潤時
//          會優先用 PayPal 回傳的實際 paypal_fee + 2.5% 提領,較精準。
const KOL_FEE = { web: 0.0275, app: 0.15, paypal: 0.078 };

export interface CommissionDoc {
  code: string;
  owner_uid: string;
  buyer_uid: string;
  plan: string;
  gross_twd: number;
  fee_twd: number;
  profit_twd: number;
  rate?: number;              // 抽成 %(或用 fixed)
  fixed?: number;             // 議價固定額(設了優先於 rate)
  amount_twd: number;         // 該筆分潤
  paid_at: number;            // 被推薦人付款時間
  lock_at: number;            // 鎖定時間(paid_at + 30d)
  state: "pending" | "locked" | "void" | "paid";
  source: string;
  txn_id: string;
  created_at: number;
  void_reason?: string;
  voided_at?: number;
  payout_id?: string;
}

/**
 * 被推薦人首筆真付款 → 若歸因到 KOL 碼(type:'kol' + 有 owner_uid),產一筆 pending 分潤。
 * best-effort、冪等(code_buyer);沙盒/試用(gross=0)/續訂/匿名/自我推薦/停權碼 全擋。
 */
export async function recordKolCommission(
  buyerUid: string,
  opts: { plan: string; gross_twd: number; source: "web" | "app" | "paypal"; txnId: string; isSandbox: boolean; isFirstPayment: boolean },
): Promise<void> {
  const { plan, gross_twd, source, txnId, isSandbox, isFirstPayment } = opts;
  if (isSandbox || !isFirstPayment || !(gross_twd > 0)) return;              // 只算首筆真實付款
  if (typeof buyerUid !== "string" || buyerUid.startsWith("$RCAnonymousID")) return;
  const bd = (await db.doc(`users/${buyerUid}`).get()).data() || {};
  const code = bd.ref_code as string | undefined;
  if (!code) return;
  const c = (await db.doc(`ref_codes/${code}`).get()).data();
  if (!c || c.type === "user") return;                                       // 只有 KOL 碼抽成;個人碼走 +7
  const ownerUid = c.owner_uid as string | undefined;
  if (!ownerUid || ownerUid === buyerUid) return;                            // 需可歸屬 + 防自我推薦
  if (c.status === "suspended") return;                                      // 停權不產生新分潤
  const ref = db.doc(`commissions/${code}_${buyerUid}`);                     // 冪等:一碼一買家一筆
  if ((await ref.get()).exists) return;
  const fee = (KOL_FEE as Record<string, number>)[source] ?? KOL_FEE.web;
  const profit = Math.round(gross_twd * (1 - fee));
  const fixed = typeof c.commission_fixed === "number" ? c.commission_fixed : null;
  const rate = typeof c.commission_pct === "number" ? c.commission_pct : 20;
  const amount = fixed != null ? Math.max(0, Math.round(fixed)) : Math.max(0, Math.round(profit * rate / 100));
  const now = nowMs();
  await ref.set({
    code, owner_uid: ownerUid, buyer_uid: buyerUid, plan,
    gross_twd, fee_twd: gross_twd - profit, profit_twd: profit,
    ...(fixed != null ? { fixed } : { rate }),
    amount_twd: amount,
    paid_at: now, lock_at: now + COMMISSION_LOCK_DAYS * 864e5,
    state: "pending", source, txn_id: txnId, created_at: now,
  } as CommissionDoc);
}

/**
 * 退費 / 退單 → 把該買家的分潤作廢(clawback)。pending/locked/paid 都翻 void;
 * 已 paid(已匯款給 KOL)的翻 void 後,後台結算會從該 KOL 後續應付扣回。
 */
export async function voidKolCommission(buyerUid: string, reason: string): Promise<void> {
  if (typeof buyerUid !== "string" || !buyerUid) return;
  const snap = await db.collection("commissions").where("buyer_uid", "==", buyerUid).get();
  for (const d of snap.docs) {
    const s = d.data().state;
    if (s === "pending" || s === "locked" || s === "paid") {
      await d.ref.set({ state: "void", void_reason: reason || "refund", voided_at: nowMs() }, { merge: true });
    }
  }
}

/**
 * 取最近一筆成功 charge transaction(subscribe / renew),回傳 ECPay TradeNo。
 * 退費 / cancel 用這個,不能用 subscription.ecpay_order(那是 MerchantTradeNo)。
 */
// 退費金額基準:最近一筆「實際成功入帳」的綠界收款金額(subscribe/renew、success、amount_twd>0)。
// ⚠️ 不能用 PLANS 現行牌價 —— 舊用戶被凍漲(早鳥續扣/legacy 149/調價前舊價)時「牌價 ≠ 實付」:
//   按牌價比例退 → 多退虧錢;全額退超過原刷卡金額 → 綠界退刷直接被打回、用戶卡死。
// 查詢條件與 getLatestSuccessTradeNo 完全相同(沿用既有索引),多抓幾筆在程式端挑金額。
export async function getLatestSuccessChargeTwd(uid: string): Promise<number | null> {
  const snap = await db.collection("transactions")
    .where("uid", "==", uid)
    .where("status", "==", "success")
    .where("type", "in", ["subscribe", "renew"])
    .orderBy("occurred_at", "desc")
    .limit(5)
    .get();
  for (const doc of snap.docs) {
    const d = doc.data();
    if (d.payment_method === "ecpay" && typeof d.amount_twd === "number" && d.amount_twd > 0) {
      return d.amount_twd;
    }
  }
  return null;
}

export async function getLatestSuccessTradeNo(uid: string): Promise<string | null> {
  const snap = await db.collection("transactions")
    .where("uid", "==", uid)
    .where("status", "==", "success")
    .where("type", "in", ["subscribe", "renew"])
    .orderBy("occurred_at", "desc")
    .limit(1)
    .get();
  if (snap.empty) return null;
  return (snap.docs[0].data().external_id as string) || null;
}

// ───── transactions (append-only 帳本) ──────────────────────────────────

export type TxnType =
  | "subscribe" | "renew" | "cancel" | "refund"
  | "fail" | "chargeback" | "gift";

export interface TransactionDoc {
  uid: string;
  type: TxnType;
  source: Source;
  plan: PlanKey | "n/a";
  amount_twd: number;          // 正數 = 收入,負數 = 退費(綠界=實收 TWD;Apple/Google=台幣牌價,僅供參考)
  currency?: string;           // 實際結帳幣別(Apple/Google IAP,如 TWD/USD/JPY);綠界一律 TWD
  amount_paid?: number;        // 該幣別的實付金額(外國人買 iOS 時,真金額在這,不是 amount_twd)
  is_sandbox?: boolean;        // Apple/Google 沙盒測試交易(非真實金流)→ 後台對帳要排除
  occurred_at: admin.firestore.Timestamp;
  payment_method: "ecpay" | "apple_iap" | "google_billing" | "manual" | "paypal";
  pay_type?: "credit" | "atm" | "cvs" | "paypal";   // 綠界細分:信用卡/ATM/超商(儀表板分源、續扣判斷用)
  external_id: string;
  status: "success" | "pending" | "failed" | "refunded";
  invoice_no?: string;
  note?: string;
  email_hash?: string;         // 防薅羊毛追蹤
}

export async function writeTransaction(
  txn: Omit<TransactionDoc, "occurred_at">,
  dedupeId?: string,   // 給定 → 用它當 doc id(冪等:webhook 重送會覆寫同一筆,不會重複入帳)
): Promise<string> {
  const ref = dedupeId
    ? db.collection("transactions").doc(dedupeId)
    : db.collection("transactions").doc();
  await ref.set({
    ...txn,
    occurred_at: FieldValue.serverTimestamp(),
  });
  return ref.id;
}

// ───── 金流告警:訂閱開通失敗的人工對帳佇列 ─────────────────────────────
// 收到錢但 writeSubscription 失敗時(最常見:users/{uid} 索引條目/體積超限)寫這裡。
// 刻意寫進獨立小 collection,「絕不」寫 users/{uid} — 那個 doc 可能正是失敗主因。
export interface PaymentFailureDoc {
  uid: string;
  plan: string;
  merchant_trade_no?: string;
  trade_no?: string;
  amount_twd: number;
  reason: string;            // e.g. "subscription_write_failed"
  error: string;             // 原始錯誤訊息(含 INDEX_ENTRIES_COUNT_LIMIT_EXCEEDED 等)
}

export async function writePaymentFailure(rec: PaymentFailureDoc): Promise<void> {
  // doc id = trade_no:同筆付款的綠界重試會 upsert 同一 doc,不會灌爆 collection
  const id = rec.trade_no || rec.merchant_trade_no || db.collection("payment_failures").doc().id;
  await db.collection("payment_failures").doc(id).set({
    ...rec,
    resolved: false,
    occurred_at: FieldValue.serverTimestamp(),
  }, { merge: true });
}

// ───── 早鳥計數器(atomic transaction)─────────────────────────────────

export async function tryReserveEarlyBird(): Promise<boolean> {
  return db.runTransaction(async tx => {
    const ref = db.doc("counters/early_bird");
    const snap = await tx.get(ref);
    const count = (snap.data()?.count as number) || 0;
    if (count >= EARLY_BIRD_LIMIT) return false;
    tx.set(ref, {
      count: count + 1,
      limit: EARLY_BIRD_LIMIT,
      updated_at: FieldValue.serverTimestamp(),
    }, { merge: true });
    return true;
  });
}

export async function releaseEarlyBird(): Promise<void> {
  // 用 transaction + 下限 0,避免釋放比占用多時 count 變負數(會讓「剩餘名額」顯示爆 100)
  const ref = db.doc("counters/early_bird");
  await db.runTransaction(async tx => {
    const snap = await tx.get(ref);
    const cur = (snap.data()?.count as number) || 0;
    tx.set(ref, {
      count: Math.max(0, cur - 1),
      updated_at: FieldValue.serverTimestamp(),
    }, { merge: true });
  });
}

export async function getEarlyBirdCount(): Promise<{ count: number; limit: number; closed: boolean }> {
  const snap = await db.doc("counters/early_bird").get();
  // closed = 到期(EARLY_BIRD_END_MS)或手動旗標(counters/early_bird.closed)。只擋「新購」;
  // 續扣不經過這裡(ecpay-callback 沿用 is_early_bird,原價 990 續扣不受影響)。
  const closed = nowMs() >= EARLY_BIRD_END_MS || snap.data()?.closed === true;
  return {
    count: (snap.data()?.count as number) || 0,
    limit: EARLY_BIRD_LIMIT,
    closed,
  };
}

// ───── 黑名單(email + cardHash 退費紀錄)──────────────────────────────

export interface BlacklistDoc {
  email_hash: string;
  refund_count: number;
  chargeback_count: number;
  permanently_blocked: boolean;
  first_refund_at?: admin.firestore.Timestamp;
  last_event_at: admin.firestore.Timestamp;
  reason?: string;
}

export async function getBlacklist(email: string): Promise<BlacklistDoc | null> {
  const hash = emailHash(email);
  const snap = await db.doc(`blacklist/${hash}`).get();
  return snap.exists ? (snap.data() as BlacklistDoc) : null;
}

export async function recordRefund(email: string, reason = "user_refund"): Promise<BlacklistDoc> {
  const hash = emailHash(email);
  const ref = db.doc(`blacklist/${hash}`);
  return db.runTransaction(async tx => {
    const snap = await tx.get(ref);
    const cur = (snap.data() as BlacklistDoc | undefined) ?? {
      email_hash: hash,
      refund_count: 0,
      chargeback_count: 0,
      permanently_blocked: false,
      last_event_at: admin.firestore.Timestamp.now(),
    };
    const newCount = cur.refund_count + 1;
    const next: BlacklistDoc = {
      ...cur,
      email_hash: hash,
      refund_count: newCount,
      permanently_blocked: cur.permanently_blocked
        || newCount >= REFUND_POLICY.blacklist_after_refunds,
      first_refund_at: cur.first_refund_at || admin.firestore.Timestamp.now(),
      last_event_at: admin.firestore.Timestamp.now(),
      reason,
    };
    tx.set(ref, next);
    return next;
  });
}

export async function recordChargeback(email: string): Promise<void> {
  const hash = emailHash(email);
  const ref = db.doc(`blacklist/${hash}`);
  await db.runTransaction(async tx => {
    const snap = await tx.get(ref);
    const cur = (snap.data() as BlacklistDoc | undefined) ?? {
      email_hash: hash,
      refund_count: 0,
      chargeback_count: 0,
      permanently_blocked: false,
      last_event_at: admin.firestore.Timestamp.now(),
    };
    tx.set(ref, {
      ...cur,
      email_hash: hash,
      chargeback_count: cur.chargeback_count + 1,
      permanently_blocked: true,  // chargeback 一次就永久 ban
      last_event_at: admin.firestore.Timestamp.now(),
      reason: "chargeback",
    });
  });
}

// ───── 訂閱前檢查 ─────────────────────────────────────────────────────

export interface PrecheckResult {
  ok: boolean;
  reason?: string;
  allowed_plans?: PlanKey[];   // 不能享早鳥就只列 monthly/yearly
}

/**
 * 訂閱前 precheck:
 * - 同 uid 已有 active 訂閱 → 拒絕(防雙平台重複訂)
 * - email 在黑名單 permanently_blocked → 拒絕
 * - email 退費 1+ 次 → 排除 early_bird plan
 * - 早鳥名額用完 → 排除 early_bird
 */
export async function precheckSubscribe(uid: string, email: string): Promise<PrecheckResult> {
  // 1. 已有未到期的訂閱?
  // 「已取消續訂」的判定要看兩個訊號:網頁取消寫 status="cancelled";App(Apple/Google)取消
  // 只會由 RC webhook 寫 willRenew=false、status 保持 active/trialing 不變——只看 status 會誤擋(用戶回饋實錘)。
  const sub = await getSubscription(uid);
  if (sub && sub.expiresAt > nowMs()
      && (sub.status === "active" || sub.status === "trialing" || sub.status === "cancelled")) {
    const noRenew = (sub as any).willRenew === false || sub.status === "cancelled";
    if (noRenew && sub.plan !== "lifetime") {
      // 不會再續扣 → 開放「買斷」升級(零重複收費風險)。
      // 訂閱類仍不賣:新訂單會蓋掉 subscription doc,把人家已付的剩餘天數吃掉。
      return { ok: true, allowed_plans: ["lifetime"] };
    }
    if (sub.status === "active" || (sub.status === "trialing" && sub.source === "app")) {
      // 仍在自動續訂(含 App 試用中未取消):直接再買會變成雙重扣款 → 擋+給升級路徑
      return {
        ok: false,
        reason: `您在${sub.source === "app" ? " App" : "網頁"}已有訂閱(到期日:${new Date(sub.expiresAt).toLocaleDateString("zh-TW")}),不需重複訂閱。`
          + `想改買「買斷方案」的話,請先取消自動續訂(已付/試用期間仍可使用),取消後即可購買。`,
      };
    }
  }

  // 1.5 防連點重複扣款:近 10 分鐘已有「處理中(pending)」的訂閱結帳 → 擋。
  //      (race:第一筆還沒收到 ECPay callback 開通前,使用者又送一次 → 兩筆都成立 → 重複扣款)
  try {
    const cutoff = admin.firestore.Timestamp.fromMillis(nowMs() - 10 * 60 * 1000);
    const recent = await db.collection("transactions")
      .where("uid", "==", uid)
      .where("occurred_at", ">=", cutoff)
      .get();
    const hasPendingSubscribe = recent.docs.some((d) => {
      const t = d.data();
      return t.type === "subscribe" && t.status === "pending";
    });
    if (hasPendingSubscribe) {
      return { ok: false, reason: "你有一筆付款正在處理中,請稍候幾分鐘再試,避免重複扣款。" };
    }
  } catch (e) {
    console.warn("[precheck] pending check failed", e);   // 查詢失敗不擋正常流程
  }

  // 2. 黑名單?
  const bl = await getBlacklist(email);
  if (bl?.permanently_blocked) {
    return { ok: false, reason: "此帳號已被限制訂閱,如有疑問請寄信客服。" };
  }

  // 3. 退過費 → 排除早鳥
  const noEarlyBird = (bl?.refund_count ?? 0) >= REFUND_POLICY.no_early_bird_after_refunds;

  // 4. 早鳥名額還夠嗎?
  const { count, limit, closed } = await getEarlyBirdCount();
  const earlyBirdOpen = count < limit && !closed;

  // lifetime(買斷)= 一次性付款,只受「無 active 訂閱 + 非黑名單」限制(上面已擋),
  // 不受早鳥名額 / 退費資格影響 → 一律放行
  const allowed: PlanKey[] = ["monthly", "yearly", "lifetime"];
  if (earlyBirdOpen && !noEarlyBird) allowed.unshift("yearly_early_bird");

  return { ok: true, allowed_plans: allowed };
}
