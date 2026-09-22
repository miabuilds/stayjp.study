// 綠界 B2C 電子發票(AES-JSON)。
//
// ⚠️ 發票是「獨立產品」,金鑰跟金流完全不同:
//    金流 AIO 測試帳號 2000132 / 站內付 3002607 / 發票 2000132(但 HashKey/IV 不一樣)。
//    正式環境更是兩組完全不同的商店代號與金鑰,千萬不要共用 ECPAY_HASH_KEY。
// ⚠️ RqHeader 要多一個 Revision: "3.0.0",漏掉會直接 TransCode ≠ 1。
//    (站內付 2.0 的 RqHeader 反而「不能」有 Revision — 兩邊規則相反,別互抄)
// ⚠️ 雙層錯誤檢查:外層 TransCode(加密/格式)+ 內層 RtnCode(業務),只看一層會漏。
//
// 加解密沿用 ecpay-aes.ts(已對過官方測試向量 9/9)。

import { aesEncrypt, aesDecrypt } from "./ecpay-aes";

export type InvoiceEnv = { merchantId: string; hashKey: string; hashIV: string; production: boolean };

export function invoiceConfig(): InvoiceEnv {
  const production = process.env.ECPAY_PRODUCTION === "true";
  const merchantId = process.env.ECPAY_INV_MERCHANT_ID || "";
  const hashKey = process.env.ECPAY_INV_HASH_KEY || "";
  const hashIV = process.env.ECPAY_INV_HASH_IV || "";
  // fail-closed:正式環境缺發票金鑰就丟錯,絕不用公開測試金鑰去開真發票
  if (production && (!merchantId || !hashKey || !hashIV)) {
    throw new Error("ECPay 發票金鑰未設定,拒絕以測試金鑰開立發票");
  }
  return {
    merchantId: merchantId || "2000132",
    hashKey: hashKey || "ejCk326UnaZWKisg",     // 綠界公開的「發票」測試金鑰(與金流不同)
    hashIV: hashIV || "q9jcZX8Ib9LM8wYk",
    production,
  };
}

export function invoiceHost(env: InvoiceEnv): string {
  return env.production ? "https://einvoice.ecpay.com.tw" : "https://einvoice-stage.ecpay.com.tw";
}

export type InvResult<T> = {
  ok: boolean; transCode?: number; transMsg?: string;
  rtnCode?: number; rtnMsg?: string; data?: T; error?: string;
};

async function invoicePost<T = Record<string, unknown>>(
  path: string, data: Record<string, unknown>, env: InvoiceEnv,
): Promise<InvResult<T>> {
  const body = {
    MerchantID: env.merchantId,
    RqHeader: { Timestamp: Math.floor(Date.now() / 1000), Revision: "3.0.0" },
    Data: aesEncrypt({ MerchantID: env.merchantId, ...data }, env.hashKey, env.hashIV),
  };
  let res: Response;
  try {
    res = await fetch(invoiceHost(env) + path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(20000),
    });
  } catch (e: unknown) { return { ok: false, error: "network: " + String((e as Error)?.message || e) }; }
  if (!res.ok) return { ok: false, error: "http_" + res.status };

  // ⚠️ Data 不一定是密文!開立/作廢/折讓回的是 AES Base64 字串,
  //    但查詢類(實測 GetIssueList)直接回「沒加密的 JSON 物件」。
  //    一律當字串去解密的話,遇到那種回應會丟 wrong final block length 直接炸。
  let outer: { TransCode?: number; TransMsg?: string; Data?: string | Record<string, unknown> };
  try { outer = await res.json() as typeof outer; }
  catch { return { ok: false, error: "bad_json" }; }
  if (Number(outer.TransCode) !== 1) {
    return { ok: false, transCode: Number(outer.TransCode), transMsg: outer.TransMsg, error: "trans_code" };
  }
  let inner: T & { RtnCode?: number; RtnMsg?: string };
  if (outer.Data && typeof outer.Data === "object") {
    inner = outer.Data as T & { RtnCode?: number; RtnMsg?: string };
  } else {
    try { inner = aesDecrypt<T & { RtnCode?: number; RtnMsg?: string }>(String(outer.Data || ""), env.hashKey, env.hashIV); }
    catch (e: unknown) { return { ok: false, transCode: 1, error: "decrypt: " + String((e as Error)?.message || e) }; }
  }
  // ⚠️ RtnCode 是「整數 1」不是字串 "1",用 == 比字串會誤判
  const rtn = Number(inner.RtnCode);
  return { ok: rtn === 1, transCode: 1, transMsg: outer.TransMsg, rtnCode: rtn, rtnMsg: inner.RtnMsg, data: inner };
}

/** yyyy-MM-dd(台北時間)*/
export function invDateTW(d = new Date()): string {
  const t = new Date(d.getTime() + 8 * 3600_000);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${t.getUTCFullYear()}-${p(t.getUTCMonth() + 1)}-${p(t.getUTCDate())}`;
}

/**
 * 這張發票現在還能不能「作廢」?
 *
 * 台灣電子發票以兩個月為一期申報(1-2、3-4、5-6、7-8、9-10、11-12),
 * 申報期限是該期結束後那個奇數月的 13 日 23:59:59。過了就已申報到財政部,
 * 只能開「折讓單」不能作廢。例:1-2 月的發票,3/14 起不能作廢。
 *
 * 回 true → 用 Invalid 作廢;回 false → 用 Allowance 折讓。
 */
export function canVoid(invoiceDate: string, now = new Date()): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(invoiceDate);
  if (!m) return false;                       // 日期解析不出來 → 保守走折讓(折讓永遠合法)
  const y = Number(m[1]), mon = Number(m[2]);
  // 該期的最後一個月:2,4,6,8,10,12 → 申報月是它的下一個月(奇數月)
  const periodEnd = mon % 2 === 0 ? mon : mon + 1;
  let dy = y, dm = periodEnd + 1;
  if (dm > 12) { dm = 1; dy += 1; }
  // 期限 = 申報月 13 日 23:59:59(台北)= UTC 當天 15:59:59
  const deadline = Date.UTC(dy, dm - 1, 13, 15, 59, 59);
  return now.getTime() <= deadline;
}

/**
 * 台灣統一編號檢查碼驗證。
 * 用戶打錯統編的話綠界會整張發票退回(「客戶統一編號格式不正確」),
 * 結果是「收了錢但沒發票」。與其如此,不如驗不過就當他沒填,先把發票開出來。
 * 規則:權數 1,2,1,2,1,2,4,1,各位乘積的個位加十位相加,總和能被 5 整除;
 *      第 7 位是 7 時,總和 +1 能被 5 整除也算合法。
 */
export function isValidTaxId(n: string): boolean {
  const d = String(n || "").replace(/\D/g, "");
  if (d.length !== 8) return false;
  const w = [1, 2, 1, 2, 1, 2, 4, 1];
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    const p = Number(d[i]) * w[i];
    sum += Math.floor(p / 10) + (p % 10);
  }
  return sum % 5 === 0 || (d[6] === "7" && (sum + 1) % 5 === 0);
}

export type IssueArgs = {
  relateNumber: string;        // 特店自訂編號,每次唯一,只能英數字
  email: string;
  amountTwd: number;           // 含稅總額
  itemName: string;
  customerName?: string;
  /** 統編。有值時 Donation 必須為 0 */
  identifier?: string;
  remark?: string;
};

/** 開立發票。回傳發票號碼與日期,兩個都要存起來 — 之後作廢/折讓都要用。 */
export async function issueInvoice(a: IssueArgs): Promise<InvResult<{ InvoiceNo?: string; InvoiceDate?: string }>> {
  const env = invoiceConfig();
  const amount = Math.round(a.amountTwd);
  const idRaw = String(a.identifier || "").replace(/\D/g, "");
  const id = isValidTaxId(idRaw) ? idRaw : "";     // 統編不合法 → 當沒填,別讓整張發票開不出來
  return invoicePost<{ InvoiceNo?: string; InvoiceDate?: string }>("/B2CInvoice/Issue", {
    RelateNumber: a.relateNumber.replace(/[^A-Za-z0-9]/g, "").slice(0, 50),
    CustomerEmail: a.email,
    CustomerName: (a.customerName || "").slice(0, 60),
    CustomerIdentifier: id,
    Print: "0",                       // 雲端發票,不印紙本
    Donation: "0",
    // 一律用綠界載具(發票寄到 email,不必另外做載具 UI)。
    // ⚠️ 帶統編時也要給載具:沙盒實測留空會被退
    //    「客戶資訊已填入統編,須請選擇載具類別或索取紙本發票」。
    CarrierType: "1",
    TaxType: "1",                     // 應稅
    SalesAmount: amount,              // 必須等於 Items 小計加總,否則會被退回
    InvType: "07",
    InvoiceRemark: (a.remark || "").slice(0, 200),
    Items: [{
      ItemSeq: 1, ItemName: a.itemName.slice(0, 500), ItemCount: 1,
      ItemWord: "式", ItemPrice: amount, ItemAmount: amount,
    }],
  }, env);
}

/** 作廢發票(同一申報期內才可以)*/
export async function invalidInvoice(invoiceNo: string, invoiceDate: string, reason: string) {
  const env = invoiceConfig();
  return invoicePost("/B2CInvoice/Invalid", {
    InvoiceNo: invoiceNo,
    InvoiceDate: invoiceDate.slice(0, 10),
    Reason: reason.slice(0, 20),
  }, env);
}

/** 折讓(跨期或部分退款用)。AllowanceAmount 不可超過剩餘可折讓金額。 */
export async function allowanceInvoice(a: {
  invoiceNo: string; invoiceDate: string; amountTwd: number;
  email: string; itemName: string; reason?: string;
}) {
  const env = invoiceConfig();
  const amount = Math.round(a.amountTwd);
  return invoicePost<{ IA_Allow_No?: string }>("/B2CInvoice/Allowance", {
    InvoiceNo: a.invoiceNo,
    InvoiceDate: a.invoiceDate.slice(0, 10),
    AllowanceNotify: "E",
    NotifyMail: a.email,
    AllowanceAmount: amount,
    Reason: (a.reason || "退款").slice(0, 20),
    Items: [{
      ItemSeq: 1, ItemName: a.itemName.slice(0, 500), ItemCount: 1,
      ItemWord: "式", ItemPrice: amount, ItemAmount: amount,
    }],
  }, env);
}
