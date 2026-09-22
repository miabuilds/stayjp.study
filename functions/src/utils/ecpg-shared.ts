// ECPG 幾支 function 共用的小工具。

/** gmail 忽略「點」與「+別名」→ 正規化,避免同一人鑽試用(與 start-trial.ts 同一套規則) */
export function normalizeEmail(email: string): string {
  const e = String(email || "").trim().toLowerCase();
  const at = e.indexOf("@");
  if (at < 0) return e;
  let local = e.slice(0, at);
  let domain = e.slice(at + 1);
  local = local.split("+")[0];
  if (domain === "gmail.com" || domain === "googlemail.com") {
    local = local.replace(/\./g, "");
    domain = "gmail.com";
  }
  return local + "@" + domain;
}

export function trialEmailKey(normalized: string): string {
  return encodeURIComponent(normalized);
}

/** ReturnURL:綠界 server-to-server 付款通知(JSON POST) */
export function ecpgReturnUrl(): string {
  return process.env.ECPG_RETURN_URL || "https://ecpgnotify-lsd7okt5qa-de.a.run.app";
}
/** OrderResultURL:3D 驗證完瀏覽器 Form POST 導回(要回 HTML,不是 1|OK) */
export function ecpgResultUrl(): string {
  return process.env.ECPG_RESULT_URL || "https://ecpgbindresult-lsd7okt5qa-de.a.run.app";
}
