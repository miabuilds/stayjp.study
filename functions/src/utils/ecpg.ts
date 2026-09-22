// 綠界站內付 2.0 / 綁卡(ECPG)連線層。
//
// ⚠️ 與現有 AIO 定期定額是「不同產品線」:網域不同、測試帳號不同、簽章方式不同。
//    AIO 用 CheckMacValue;ECPG 用 AES-128-CBC 把 Data 整包加密。
// ⚠️ 兩個網域不能搞混,打錯直接 404:
//    取 Token / CreatePayment / 所有綁卡 API → ecpg(-stage).ecpay.com.tw
//    查詢 / 請款 / 退款                      → ecpayment(-stage).ecpay.com.tw
// ⚠️ RqHeader 只有 Timestamp(秒),沒有 Revision(那是電子發票才要的)。
// ⚠️ MerchantID 外層與 Data 內層都要填,只填一處會失敗且錯誤訊息看不出原因。
import { aesEncrypt, aesDecrypt } from "./ecpay-aes";

export type EcpgEnv = { merchantId: string; hashKey: string; hashIV: string; production: boolean };

// 綠界官方公開的站內付 2.0 測試帳號(與 AIO 的 2000132 不同)
export const ECPG_SANDBOX: EcpgEnv = {
  merchantId: "3002607",
  hashKey: "pwFHCqoQZGmho4w6",
  hashIV: "EkRm7iFT261dpevs",
  production: false,
};

export function ecpgHost(env: EcpgEnv): string {
  return env.production ? "https://ecpg.ecpay.com.tw" : "https://ecpg-stage.ecpay.com.tw";
}
export function ecpaymentHost(env: EcpgEnv): string {
  return env.production ? "https://ecpayment.ecpay.com.tw" : "https://ecpayment-stage.ecpay.com.tw";
}

export type EcpgResult<T> = {
  ok: boolean;
  transCode?: number;      // 外層:加密/格式是否正確
  transMsg?: string;
  rtnCode?: number;        // 內層:業務邏輯是否成功
  rtnMsg?: string;
  data?: T;
  raw?: unknown;
  error?: string;
};

/**
 * 打一支 ECPG API。回應是三層結構,必須做「兩次」檢查:
 *   1. 外層 TransCode === 1(否則是加密/格式問題,Data 根本不用解)
 *   2. 解密後的 RtnCode === 1(業務邏輯)
 * 只檢查其中一層會漏掉另一種錯誤。
 */
export async function ecpgPost<T = Record<string, unknown>>(
  url: string, data: Record<string, unknown>, env: EcpgEnv, timeoutMs = 20000,
): Promise<EcpgResult<T>> {
  const body = {
    MerchantID: env.merchantId,                                  // 外層
    RqHeader: { Timestamp: Math.floor(Date.now() / 1000) },      // 秒,不是毫秒
    Data: aesEncrypt({ MerchantID: env.merchantId, ...data }, env.hashKey, env.hashIV),   // 內層也要 MerchantID
  };
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (e: unknown) {
    return { ok: false, error: "network: " + String((e as Error)?.message || e) };
  }
  if (!res.ok) return { ok: false, error: "http_" + res.status };

  let outer: { TransCode?: number; TransMsg?: string; Data?: string };
  try { outer = await res.json() as typeof outer; }
  catch { return { ok: false, error: "bad_json" }; }

  if (outer.TransCode !== 1) {
    return { ok: false, transCode: outer.TransCode, transMsg: outer.TransMsg, raw: outer, error: "trans_code" };
  }
  let inner: T & { RtnCode?: number; RtnMsg?: string };
  try { inner = aesDecrypt<T & { RtnCode?: number; RtnMsg?: string }>(String(outer.Data || ""), env.hashKey, env.hashIV); }
  catch (e: unknown) { return { ok: false, transCode: 1, raw: outer, error: "decrypt: " + String((e as Error)?.message || e) }; }

  const rtn = Number(inner.RtnCode);
  return {
    ok: rtn === 1,
    transCode: 1, transMsg: outer.TransMsg,
    rtnCode: rtn, rtnMsg: inner.RtnMsg,
    data: inner,
  };
}

/** 綠界要的 MerchantTradeDate:yyyy/MM/dd HH:mm:ss,台北時間 */
export function ecpgDateTW(d = new Date()): string {
  const t = new Date(d.getTime() + 8 * 3600_000);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${t.getUTCFullYear()}/${p(t.getUTCMonth() + 1)}/${p(t.getUTCDate())} ` +
         `${p(t.getUTCHours())}:${p(t.getUTCMinutes())}:${p(t.getUTCSeconds())}`;
}

/**
 * 解析 ReturnURL / OrderResultURL 送回來的結果。
 * ⚠️ 兩者格式不同,是官方文件點名的常見陷阱:
 *   ReturnURL       → Server-to-Server,application/json,body 本身就是外層 {TransCode, Data}
 *   OrderResultURL  → 瀏覽器 Form POST,資料在欄位 ResultData,那是「JSON 字串」不是密文,
 *                     要先 JSON.parse 拿到外層,再解密 outer.Data。直接對 ResultData 解密會失敗。
 */
export function parseCallback<T = Record<string, unknown>>(
  body: Record<string, unknown>, env: EcpgEnv,
): { ok: boolean; transCode?: number; data?: T; error?: string } {
  let outer: { TransCode?: number; Data?: string };
  const rd = body?.ResultData;
  if (typeof rd === "string") {
    try { outer = JSON.parse(rd) as typeof outer; }
    catch { return { ok: false, error: "result_data_not_json" }; }
  } else {
    outer = body as typeof outer;
  }
  if (Number(outer.TransCode) !== 1) return { ok: false, transCode: Number(outer.TransCode), error: "trans_code" };
  try {
    return { ok: true, transCode: 1, data: aesDecrypt<T>(String(outer.Data || ""), env.hashKey, env.hashIV) };
  } catch (e: unknown) {
    return { ok: false, transCode: 1, error: "decrypt: " + String((e as Error)?.message || e) };
  }
}
