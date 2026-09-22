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
import { issueInvoice, invalidInvoice, allowanceInvoice, canVoid, invDateTW } from "./ecpay-invoice";

/** 交易編號 → 發票用的 RelateNumber(只留英數,綠界不吃特殊符號)*/
function relNo(tradeNo: string): string {
  return String(tradeNo).replace(/[^A-Za-z0-9]/g, "").slice(0, 50);
}

/**
 * 付款成功 → 開立發票。冪等:同一個 tradeNo 只會開一張。
 * 回傳是否真的開成功(呼叫端不必理會,純 log 用)。
 */
export async function issueForPayment(a: {
  uid: string; email: string; tradeNo: string; itemName: string; amountTwd: number; identifier?: string;
}): Promise<boolean> {
  const rel = relNo(a.tradeNo);
  if (!rel || !a.email || !(a.amountTwd > 0)) return false;
  const db = admin.firestore();
  const ref = db.doc("invoices/" + rel);

  // 先用 transaction 搶鎖,搶不到代表別人已經開過(或正在開)→ 直接跳過
  const got = await db.runTransaction(async (tx) => {
    const s = await tx.get(ref);
    if (s.exists) return false;
    tx.set(ref, {
      uid: a.uid, trade_no: a.tradeNo, amount_twd: a.amountTwd,
      email: a.email, status: "issuing", created_at: Date.now(),
    });
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
      return true;
    }
    // 失敗把鎖解開(狀態改 failed),留著讓人工/日後補開,不要吞掉
    await ref.set({ status: "failed", fail_code: r.rtnCode ?? null, fail_msg: r.rtnMsg || r.error || null }, { merge: true });
    console.error("開立發票失敗", a.tradeNo, r.rtnCode, r.rtnMsg || r.error);
    return false;
  } catch (e) {
    await ref.set({ status: "failed", fail_msg: String(e) }, { merge: true }).catch(() => undefined);
    console.error("開立發票例外", a.tradeNo, e);
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
  uid: string; tradeNo: string; refundTwd: number; paidTwd: number; email: string; itemName: string; reason?: string;
}): Promise<{ done: boolean; mode: string; msg?: string }> {
  const rel = relNo(a.tradeNo);
  const db = admin.firestore();
  const ref = db.doc("invoices/" + rel);
  const snap = await ref.get().catch(() => null);
  const inv = snap && snap.exists ? snap.data() : null;

  if (!inv || inv.status !== "issued" || !inv.invoice_no) {
    // 沒開過發票就沒得作廢。留單子給客服處理,不要讓退款失敗。
    await db.collection("invoice_todo").add({
      uid: a.uid, trade_no: a.tradeNo, refund_twd: a.refundTwd,
      note: inv ? `發票狀態為 ${inv.status},無法自動處理` : "查無發票紀錄(可能是導入發票前的舊交易)",
      created_at: Date.now(),
    }).catch(() => undefined);
    return { done: false, mode: "manual", msg: "需人工處理發票" };
  }

  const invoiceNo = String(inv.invoice_no);
  const invoiceDate = String(inv.invoice_date || "").slice(0, 10);
  const isFull = Math.round(a.refundTwd) >= Math.round(a.paidTwd);

  try {
    if (isFull && canVoid(invoiceDate)) {
      const r = await invalidInvoice(invoiceNo, invoiceDate, (a.reason || "用戶退費").slice(0, 20));
      await ref.set({
        status: r.ok ? "invalid" : "issued",
        invalid_at: r.ok ? Date.now() : null,
        last_msg: r.rtnMsg || r.error || null,
      }, { merge: true });
      if (!r.ok) console.error("作廢發票失敗", invoiceNo, r.rtnCode, r.rtnMsg || r.error);
      return { done: r.ok, mode: "invalid", msg: r.rtnMsg || r.error };
    }
    // 部分退 or 已跨期 → 折讓
    const r = await allowanceInvoice({
      invoiceNo, invoiceDate, amountTwd: a.refundTwd,
      email: a.email, itemName: a.itemName, reason: a.reason || "用戶退費",
    });
    await ref.set({
      status: r.ok ? "allowance" : "issued",
      allowance_no: r.data?.IA_Allow_No || null,
      allowance_twd: r.ok ? Math.round(a.refundTwd) : null,
      allowance_at: r.ok ? Date.now() : null,
      last_msg: r.rtnMsg || r.error || null,
    }, { merge: true });
    if (!r.ok) console.error("開立折讓失敗", invoiceNo, r.rtnCode, r.rtnMsg || r.error);
    return { done: r.ok, mode: "allowance", msg: r.rtnMsg || r.error };
  } catch (e) {
    console.error("退款發票處理例外", invoiceNo, e);
    await db.collection("invoice_todo").add({
      uid: a.uid, trade_no: a.tradeNo, invoice_no: invoiceNo,
      refund_twd: a.refundTwd, note: "自動處理發生例外:" + String(e), created_at: Date.now(),
    }).catch(() => undefined);
    return { done: false, mode: "error", msg: String(e) };
  }
}
