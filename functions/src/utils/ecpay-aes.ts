// 綠界 AES-128-CBC 加解密(站內付 2.0 / 綁卡 / 電子發票 都用這套)。
//
// 流程(官方 guides/14):
//   加密:JSON → urlencode → AES-128-CBC(PKCS7) → Base64
//   解密:Base64 decode → AES-128-CBC decrypt → urldecode → JSON
//
// ⚠️ 這裡的 urlencode 跟 CheckMacValue 那套「不一樣」:
//   CheckMacValue 會再 toLowerCase + 做 .NET 的 7 字元替換;AES 這邊「都不做」。
//   混用會導致 TransCode ≠ 1,而且錯誤訊息看不出原因。
// ⚠️ PHP urlencode 空格 → '+',且 ~ 會輸出 %7E(大寫);Node 的 encodeURIComponent 不同,
//   所以下面自己實作,不能直接用 encodeURIComponent。
import * as crypto from "crypto";

/** PHP urlencode 相容:空格→'+',未保留字元→%XX(大寫),~ → %7E */
export function aesUrlEncode(s: string): string {
  return encodeURIComponent(s)
    .replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase())
    .replace(/~/g, "%7E")
    .replace(/%20/g, "+");
}

/** PHP urldecode 相容:'+' 要先還原成空格 */
export function aesUrlDecode(s: string): string {
  return decodeURIComponent(s.replace(/\+/g, "%20"));
}

export function aesEncrypt(data: unknown, hashKey: string, hashIV: string): string {
  const plain = aesUrlEncode(JSON.stringify(data));
  const c = crypto.createCipheriv("aes-128-cbc", Buffer.from(hashKey, "utf8"), Buffer.from(hashIV, "utf8"));
  c.setAutoPadding(true);   // PKCS7
  return Buffer.concat([c.update(plain, "utf8"), c.final()]).toString("base64");
}

export function aesDecrypt<T = unknown>(b64: string, hashKey: string, hashIV: string): T {
  const d = crypto.createDecipheriv("aes-128-cbc", Buffer.from(hashKey, "utf8"), Buffer.from(hashIV, "utf8"));
  d.setAutoPadding(true);
  const plain = Buffer.concat([d.update(Buffer.from(b64, "base64")), d.final()]).toString("utf8");
  return JSON.parse(aesUrlDecode(plain)) as T;
}
