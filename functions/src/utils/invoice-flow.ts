// 發票流程串接:付款成功 → 開立;退款成功 → 作廢或折讓。
//
// 設計原則:
//   1. 發票失敗「絕不」影響金流。人已經付錢了,發票開不出來是我們要補的帳,
//      不能因此讓 callback 回 0 讓綠界重送、或讓退款流程中斷。
//      所以全部 best-effort,失敗只記錄在 invoices/{relateNumber},事後可補開。
//   2. 冪等。綠界 callback 會重送,定期定額每期也會進同一段程式;
//      用 invoices/{relateNumber} 當鎖,同一筆交易只開一張。
//   3. 退款「作廢」與「折讓」二擇一,不能都做 —— 已折讓的發票綠界會擋住不給作廢
//      (沙盒實測 RtnCode=5070450)。

import * as admin from "firebase-admin";
import { issueInvoice, invalidInvoice, allowanceInvoice, notifyInvoice, canVoid, invDateTW } from "./ecpay-invoice";

/**
 * 交易編號 → 發票用的 RelateNumber(只留英數,綠界不吃特殊符號)。
 *
 * ⚠️ 這裡一定要用「綠界的 TradeNo」,不能用 MerchantTradeNo:
 *    定期定額每一期的 MerchantTradeNo 都是同一個(原始訂單號),
 *    只有 TradeNo 每期不同。用錯的話第二期開始會被冪等鎖當成重複而跳過
 *    → 續訂的錢照收、發票漏開,是稅務問題不是小 bug。
 */
/** issuing 卡超過這麼久就當作上次掛了,允許重試(正常開立 20 秒內會結束)*/
const STALE_ISSUING_MS = 10 * 60_000;

function relNo(tradeNo: string): string {
  return String(tradeNo).replace(/[^A-Za-z0-9]/g, "").slice(0, 50);
}

/**
 * 找這個人的 email(發票要寄去哪)。先 Auth,再退到 users/{uid}.email。
 * 兩邊都沒有 → 回空字串,呼叫端會跳過開立;對帳那支會把它列成「沒開」讓人看到。
 */
export async function resolveEmail(uid: string): Promise<string> {
  try {
    const u = await admin.auth().getUser(uid);
    if (u.email) return u.email;
  } catch { /* 帳號可能已刪 */ }
  try {
    const d = (await admin.firestore().doc("users/" + uid).get()).data();
    return String(d?.email || "");
  } catch { return ""; }
}

/**
 * 付款成功 → 開立發票。冪等:同一個 tradeNo 只會開一張。
 * 回傳是否真的開成功(呼叫端不必理會,純 log 用)。
 */
export async function issueForPayment(a: {
  uid: string; email: string;
  /** ⚠️ 綠界的 TradeNo(每期唯一),不是你自己的 MerchantTradeNo(定期定額每期都一樣)*/
  ecpayTradeNo: string;
  itemName: string; amountTwd: number; identifier?: string;
}): Promise<boolean> {
  const rel = relNo(a.ecpayTradeNo);
  if (!rel || !a.email || !(a.amountTwd > 0)) return false;
  const db = admin.firestore();
  const ref = db.doc("invoices/" + rel);

  // 搶鎖。但「文件存在就一律跳過」會出事:
  //   · 上次開立失敗(綠界暫時掛掉、網路抖一下)→ status=failed,那筆就永遠不會再開
  //   · 標記 issuing 之後 function 當掉 → 永遠卡在 issuing
  // 收了錢卻沒發票是稅務問題,所以這兩種狀態要允許再試一次;
  // 已經開出來的(issued / invalid / allowance)才是真的不能再開。
  const got = await db.runTransaction(async (tx) => {
    const s = await tx.get(ref);
    const d = s.data();
    if (s.exists) {
      const st = String(d?.status || "");
      const stale = st === "issuing" && Date.now() - Number(d?.created_at || 0) > STALE_ISSUING_MS;
      if (st !== "failed" && !stale) return false;      // 已開立或正在開 → 不動
    }
    tx.set(ref, {
      uid: a.uid, trade_no: a.ecpayTradeNo, amount_twd: a.amountTwd,
      email: a.email, status: "issuing", created_at: Date.now(),
      attempts: Number(d?.attempts || 0) + 1,
    }, { merge: true });
    return true;
  }).catch(() => false);
  if (!got) return false;

  try {
    const r = await issueInvoice({
      relateNumber: rel, email: a.email, amountTwd: a.amountTwd,
      itemName: a.itemName, identifier: a.identifier,
    });
    if (r.ok && r.data?.InvoiceNo) {
      await ref.set({
        status: "issued",
        invoice_no: r.data.InvoiceNo,
        // 綠界回的日期含時間,作廢/折讓只吃 yyyy-MM-dd
        invoice_date: String(r.data.InvoiceDate || invDateTW()).slice(0, 10),
        issued_at: Date.now(),
      }, { merge: true });
      // 主動寄通知信(best-effort,寄不出去不影響「已開立」這個事實,只記下來)
      const n = await notifyInvoice(String(r.data.InvoiceNo), a.email).catch((e) => ({ ok: false, error: String(e) } as { ok: boolean; rtnMsg?: string; error?: string }));
      await ref.set({ notified: n.ok, notify_msg: n.rtnMsg || n.error || null }, { merge: true }).catch(() => undefined);
      if (!n.ok) console.error("發票通知信寄送失敗", r.data.InvoiceNo, n.rtnMsg || n.error);
      return true;
    }
    // 失敗把鎖解開(狀態改 failed),留著讓人工/日後補開,不要吞掉
    await ref.set({ status: "failed", fail_code: r.rtnCode ?? null, fail_msg: r.rtnMsg || r.error || null }, { merge: true });
    console.error("開立發票失敗", a.ecpayTradeNo, r.rtnCode, r.rtnMsg || r.error);
    return false;
  } catch (e) {
    await ref.set({ status: "failed", fail_msg: String(e) }, { merge: true }).catch(() => undefined);
    console.error("開立發票例外", a.ecpayTradeNo, e);
    return false;
  }
}

/**
 * 退款成功 → 處理發票。
 *   全額退 + 還在同一申報期 → 作廢(Invalid)
 *   部分退,或已跨期(發票已申報到財政部)→ 折讓(Allowance)
 * 找不到發票紀錄(例如導入發票之前的舊交易)→ 記一筆待人工處理,不擋退款。
 */
export async function refundInvoice(a: {
  uid: string;
  /** ⚠️ 同上:要跟開立時同一把鑰匙,綠界 TradeNo */
  ecpayTradeNo: string;
  refundTwd: number; paidTwd: number; email: string; itemName: string; reason?: string;
}): Promise<{ done: boolean; mode: string; msg?: string }> {
  const rel = relNo(a.ecpayTradeNo);
  const db = admin.firestore();
  let ref = db.doc("invoices/" + rel);
  const snap = await ref.get().catch(() => null);
  let inv = snap && snap.exists ? snap.data() : null;

  // 退續扣那一期時,refund.ts 手上是綠界 ExecLog 的 TradeNo,但那一期開票時的鍵是 MerchantTradeNo+G+gwsr
  // (PeriodReturnURL 沒給 TradeNo)→ 直接查會落空。退到:這個人「最近一張還沒沖過、金額 = 這次實付」的發票。
  // 條件夠嚴(uid + issued + 金額吻合),不會沖到別張。
  if (!inv) {
    const cands = await db.collection("invoices").where("uid", "==", a.uid).limit(30).get().catch(() => null);
    type InvDoc = { id: string; status?: string; amount_twd?: number; issued_at?: number; invoice_no?: string; invoice_date?: string };
    const hit = (cands?.docs || [])
      .map((d): InvDoc => ({ id: d.id, ...(d.data() as Omit<InvDoc, "id">) }))
      .filter((d) => d.status === "issued" && Math.round(Number(d.amount_twd)) === Math.round(a.paidTwd))
      .sort((x, y) => Number(y.issued_at || 0) - Number(x.issued_at || 0))[0];
    if (hit) { ref = db.doc("invoices/" + hit.id); inv = hit; }
  }

  if (!inv || inv.status !== "issued" || !inv.invoice_no) {
    // 沒開過發票就沒得作廢。留單子給客服處理,不要讓退款失敗。
    await db.collection("invoice_todo").add({
      uid: a.uid, trade_no: a.ecpayTradeNo, refund_twd: a.refundTwd,
      note: inv ? `發票狀態為 ${inv.status},無法自動處理` : "查無發票紀錄(可能是導入發票前的舊交易)",
      created_at: Date.now(),
    }).catch(() => undefined);
    return { done: false, mode: "manual", msg: "需人工處理發票" };
  }

  const invoiceNo = String(inv.invoice_no);
  const invoiceDate = String(inv.invoice_date || "").slice(0, 10);
  const isFull = Math.round(a.refundTwd) >= Math.round(a.paidTwd);

  try {
    let voidMsg = "";
    if (isFull && canVoid(invoiceDate)) {
      const r = await invalidInvoice(invoiceNo, invoiceDate, (a.reason || "用戶退費").slice(0, 20));
      if (r.ok) {
        await ref.set({ status: "invalid", invalid_at: Date.now(), last_msg: r.rtnMsg || null }, { merge: true });
        return { done: true, mode: "invalid", msg: r.rtnMsg };
      }
      // 我們算的期限跟綠界實際狀態可能有落差(例如已上傳財政部)。
      // 作廢不成不要就這樣結束 —— 折讓永遠合法,退下去用折讓把帳沖平。
      voidMsg = r.rtnMsg || r.error || "";
      console.error("作廢發票失敗,改走折讓", invoiceNo, r.rtnCode, voidMsg);
    }
    // 部分退 / 已跨期 / 作廢失敗 → 折讓
    const r = await allowanceInvoice({
      invoiceNo, invoiceDate, amountTwd: a.refundTwd,
      email: a.email, itemName: a.itemName, reason: a.reason || "用戶退費",
    });
    if (r.ok) {
      await ref.set({
        status: "allowance",
        allowance_no: r.data?.IA_Allow_No || null,
        allowance_twd: Math.round(a.refundTwd),
        allowance_at: Date.now(),
        last_msg: r.rtnMsg || null,
        ...(voidMsg ? { void_fail_msg: voidMsg } : {}),
      }, { merge: true });
      return { done: true, mode: "allowance", msg: r.rtnMsg };
    }
    // 作廢跟折讓都不成 → 錢已退、發票沒沖。這種一定要有人看到,不能只留在 log。
    const msg = `作廢:${voidMsg || "未嘗試"};折讓:${r.rtnMsg || r.error || ""}`;
    console.error("退款發票處理失敗", invoiceNo, msg);
    await ref.set({ last_msg: msg }, { merge: true });
    await db.collection("invoice_todo").add({
      uid: a.uid, trade_no: a.ecpayTradeNo, invoice_no: invoiceNo,
      refund_twd: a.refundTwd, note: "退款成功但發票沖不掉:" + msg, created_at: Date.now(),
    }).catch(() => undefined);
    return { done: false, mode: "failed", msg };
  } catch (e) {
    console.error("退款發票處理例外", invoiceNo, e);
    await db.collection("invoice_todo").add({
      uid: a.uid, trade_no: a.ecpayTradeNo, invoice_no: invoiceNo,
      refund_twd: a.refundTwd, note: "自動處理發生例外:" + String(e), created_at: Date.now(),
    }).catch(() => undefined);
    return { done: false, mode: "error", msg: String(e) };
  }
}
