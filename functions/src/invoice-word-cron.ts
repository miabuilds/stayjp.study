// 每日盯梢發票字軌。
//
// 為什麼要盯:發票號碼開不出來就收不了錢的帳,而我們自己生不出號碼。
// 兩件事找的對象不一樣,別搞混:
//   · 每期的字軌配號 → 綠界業務兩個月幫忙申請一次
//   · 每期「幾張」   → 核准數量是國稅局定的,要加量直接向國稅局申請增加字軌號碼
// 所以告警要講清楚該找誰,不然期限前會去催錯人。
//
// 兩個會出事的情境:
//   1. 本期號碼快用完 → 開到一半開不出來
//   2. 下一期沒有字軌 → 期初第一天開始全部失敗(例:115 年只有期別5,11/1 就死)
//
// 結果寫 system_alerts/invoice_word,後台面板會顯示;需要動作時另外 console.error
// 讓 Cloud Logging 抓得到。

import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import { INVOICE_SECRET_NAMES } from "./utils/constants";
import { invoiceConfig, invoiceHost } from "./utils/ecpay-invoice";
import { aesEncrypt, aesDecrypt } from "./utils/ecpay-aes";

if (admin.apps.length === 0) admin.initializeApp();

const LOW_REMAIN = 30;        // 本期剩不到這麼多張 → 警告
const LEAD_DAYS = 21;         // 下一期開始前這麼多天還沒字軌 → 警告

type WordRow = {
  InvoiceYear: string; InvoiceTerm: number; InvoiceHeader: string;
  InvoiceStart: string; InvoiceEnd: string; InvoiceNo: string; UseStatus: number;
};

/** 期別:1=一二月 2=三四月 … 6=十一十二月 */
function termOf(month: number): number { return Math.ceil(month / 2); }

async function queryWords(year: string): Promise<WordRow[]> {
  const env = invoiceConfig();
  const res = await fetch(invoiceHost(env) + "/B2CInvoice/GetInvoiceWordSetting", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      MerchantID: env.merchantId,
      RqHeader: { Timestamp: Math.floor(Date.now() / 1000), Revision: "3.0.0" },
      Data: aesEncrypt({
        MerchantID: env.merchantId, InvoiceYear: year,
        InvoiceTerm: 0, UseStatus: 0, InvoiceCategory: 1,
      }, env.hashKey, env.hashIV),
    }),
    signal: AbortSignal.timeout(20000),
  });
  const outer = await res.json() as { TransCode?: number; Data?: string };
  if (Number(outer.TransCode) !== 1) throw new Error("TransCode=" + outer.TransCode);
  const inner = aesDecrypt<{ RtnCode?: number; InvoiceInfo?: WordRow[] }>(String(outer.Data || ""), env.hashKey, env.hashIV);
  // RtnCode 7 = 查無資料(那一年還沒有任何字軌),不是錯誤
  if (Number(inner.RtnCode) !== 1) return [];
  return inner.InvoiceInfo || [];
}

export const invoiceWordCron = onSchedule(
  {
    schedule: "0 10 * * *",       // 每天早上 10:00 台北
    timeZone: "Asia/Taipei",
    secrets: INVOICE_SECRET_NAMES, region: "asia-east1",
    timeoutSeconds: 120, memory: "256MiB",
  },
  async () => {
    const tw = new Date(Date.now() + 8 * 3600_000);
    const year = tw.getUTCFullYear();
    const month = tw.getUTCMonth() + 1;
    const rocYear = String(year - 1911);
    const term = termOf(month);

    // 下一期:期別 6 之後跨到明年期別 1
    const nextTerm = term === 6 ? 1 : term + 1;
    const nextRocYear = term === 6 ? String(year - 1911 + 1) : rocYear;
    // 下一期的第一天(台北)
    const nextStart = term === 6
      ? Date.UTC(year + 1, 0, 1) - 8 * 3600_000
      : Date.UTC(year, term * 2, 1) - 8 * 3600_000;
    const daysToNext = Math.ceil((nextStart - Date.now()) / 86400_000);

    const issues: string[] = [];
    const summary: Record<string, unknown> = {
      checked_at: Date.now(), roc_year: rocYear, term, next_term: nextTerm, days_to_next: daysToNext,
    };

    try {
      const rows = await queryWords(rocYear);
      const nextRows = nextRocYear === rocYear ? rows : await queryWords(nextRocYear);

      // ── 本期 ──
      const cur = rows.filter((r) => Number(r.InvoiceTerm) === term);
      if (!cur.length) {
        issues.push(`本期(民國 ${rocYear} 年 期別${term})沒有任何字軌,現在就開不出發票`);
        summary.current_remain = 0;
      } else {
        let remain = 0, total = 0;
        for (const r of cur) {
          const start = Number(r.InvoiceStart), end = Number(r.InvoiceEnd);
          const used = r.InvoiceNo ? Number(r.InvoiceNo) - start + 1 : 0;
          total += end - start + 1;
          remain += end - start + 1 - Math.max(0, used);
        }
        summary.current_remain = remain;
        summary.current_total = total;
        summary.current_header = cur.map((r) => r.InvoiceHeader).join(",");
        if (remain <= LOW_REMAIN) {
          issues.push(
            `本期字軌只剩 ${remain} 張(共 ${total} 張),用完就開不出發票。` +
            "核准數量是國稅局定的 → 直接向國稅局申請增加字軌號碼(不是找綠界業務)",
          );
        }
      }

      // ── 下一期 ──
      const next = nextRows.filter((r) => Number(r.InvoiceTerm) === nextTerm);
      summary.next_ready = next.length > 0;
      if (!next.length && daysToNext <= LEAD_DAYS) {
        issues.push(
          `下一期(民國 ${nextRocYear} 年 期別${nextTerm})還沒有字軌,${daysToNext} 天後開始,` +
          "到時候發票會全部開失敗 → 找綠界業務申請配號(這件是業務代辦的)",
        );
      }
    } catch (e) {
      issues.push("查詢字軌失敗:" + String(e));
    }

    summary.issues = issues;
    summary.issue_count = issues.length;
    await admin.firestore().doc("system_alerts/invoice_word").set(summary);
    if (issues.length) console.error("⚠️ 發票字軌需要處理:", issues.join(" / "));
    else console.log("發票字軌檢查:正常", JSON.stringify(summary));
  },
);
