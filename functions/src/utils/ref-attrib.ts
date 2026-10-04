// KOL 推薦連結:點擊計數 + App/跨瀏覽器註冊的 IP 自動歸因 —— 純函式(無 Firestore),refClick / claimRefByIp 共用,
// scripts/test-ref-attrib.cjs 直接測這裡(先 `cd functions && npx tsc`)。
//
// 隱私:IP 一律只存「加鹽 sha256」(鹽在 config/ref_salt,只有 Admin SDK 讀得到),原始 IP 從不落地;
// ref_clicks 由 refClickCleanup 每天清掉 48 小時前的資料。

import crypto from "crypto";

export type Plat = "ios" | "android" | "other";

export const CLICK_DEDUPE_MS = 30 * 60 * 1000;      // 同 IP + 同碼 30 分鐘內只算一次
export const MATCH_WINDOW_MS = 2 * 3600 * 1000;      // 點擊要落在「現在 −2h」且「開帳號 ±2h」
export const NEW_ACCOUNT_MS = 6 * 3600 * 1000;       // 帳號建立 6 小時內才嘗試 IP 歸因
export const CLICK_RETENTION_MS = 48 * 3600 * 1000;  // ref_clicks 保留 48 小時

export function normPlat(v: unknown): Plat {
  return v === "ios" || v === "android" ? v : "other";
}

export function normCode(v: unknown): string {
  return String(v || "").toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 32);
}

/** Google 前端 / 私有網段:不可能是真正的用戶位址,從 x-forwarded-for 挑位址時要跳過。 */
function isInfraIp(ip: string): boolean {
  if (!ip) return true;
  if (ip.startsWith("::ffff:")) ip = ip.slice(7);
  if (/^(10\.|127\.|192\.168\.|169\.254\.|35\.191\.|130\.211\.)/.test(ip)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(ip)) return true;
  const l = ip.toLowerCase();
  return l === "::1" || l.startsWith("fc") || l.startsWith("fd") || l.startsWith("fe80");
}

/**
 * 從 x-forwarded-for 取用戶位址:由「右往左」找第一個非 Google/私有網段的位址。
 * ⚠️ 不能取第一段:最左邊是用戶端自己可以亂帶的值(可灌點擊數);Google 前端會把真正連進來的位址
 *    附加在後面。IPv6 取 /64 前綴(手機 IPv6 臨時位址會換尾碼,同一台機器的 /64 不變)。
 */
export function clientIp(xff: unknown, fallback?: unknown): string {
  const raw = Array.isArray(xff) ? xff.join(",") : xff;
  const parts = String(raw || "").split(",").map((s) => s.trim()).filter(Boolean);
  let ip = "";
  for (let i = parts.length - 1; i >= 0; i--) { if (!isInfraIp(parts[i])) { ip = parts[i]; break; } }
  if (!ip) ip = String(fallback || "").trim();
  if (ip.startsWith("::ffff:")) ip = ip.slice(7);              // IPv4-mapped IPv6
  if (ip.includes(":")) {
    const parts = expandV6(ip);
    if (parts) return parts.slice(0, 4).join(":") + "::/64";
  }
  return ip;
}
function expandV6(ip: string): string[] | null {
  const s = ip.replace(/%.*$/, "").toLowerCase();
  const [head, tail] = s.split("::");
  if (s.split("::").length > 2) return null;
  const h = head ? head.split(":") : [];
  const t = tail !== undefined ? (tail ? tail.split(":") : []) : [];
  const fill = tail !== undefined ? 8 - h.length - t.length : 0;
  if (fill < 0) return null;
  const all = [...h, ...Array(fill).fill("0"), ...t];
  if (all.length !== 8) return null;
  return all.map((x) => (parseInt(x || "0", 16) || 0).toString(16));
}

export function hashIp(salt: string, ip: string): string {
  return crypto.createHash("sha256").update(salt + ip).digest("hex");
}

/** 台灣日期 YYYYMMDD(clicks_by_day 的 key) */
export function twDateKey(ms: number): string {
  const d = new Date(ms + 8 * 3600 * 1000);
  const p = (n: number) => (n < 10 ? "0" : "") + n;
  return `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}`;
}

/** 這次點擊要不要算:同 ipHash 下、同碼、30 分鐘內已經有一筆 → 不算 */
export function shouldCountClick(prev: { code: string; ts: number }[], code: string, now: number): boolean {
  return !prev.some((p) => p.code === code && now - Number(p.ts || 0) < CLICK_DEDUPE_MS && Number(p.ts || 0) <= now);
}

/** clicks_by_day 加總最近 N 天(含今天,台灣日期) */
export function sumClicksDays(byDay: Record<string, unknown> | undefined | null, now: number, days: number): number {
  if (!byDay) return 0;
  let s = 0;
  for (let i = 0; i < days; i++) s += Number(byDay[twDateKey(now - i * 86400000)]) || 0;
  return s;
}

export interface CodeInfo {
  exists: boolean;
  campaign: boolean;      // isCampaignRefCode(官方/活動/有到期日)→ 不參與 IP 歸因
  owner_uid?: string;
  active?: boolean;
  status?: string;
  expires_at?: number;
}
export interface IpMatchInput {
  uid: string;
  hasRef: boolean;
  creationMs: number;     // Firebase Auth metadata.creationTime
  now: number;
  plat: Plat;             // 這次註冊所在平台
  clicks: { code: string; ts: number; plat?: string }[];   // 同 ipHash 的點擊
  codes: Record<string, CodeInfo>;
}
export type IpMatchResult =
  | { ok: true; code: string }
  | { ok: false; reason: "has_ref" | "old_account" | "no_match" | "ambiguous"; candidates?: string[] };

/**
 * IP 歸因決策。只有「剛好一個」合格碼才歸因;0 個或 ≥2 個(例如同一 Wi-Fi 下兩位 KOL 的連結都有人點)都不動。
 * - 點擊時間:ts ≥ now−2h,且落在開帳號時間 ±2h
 * - 排除活動碼、停用/停權/過期碼、自己的碼
 * - 兩邊平台都明確(ios/android)且不同 → 排除;"other"(桌機/未知)不擋(常見:電腦看到連結、手機下載)
 */
export function decideIpMatch(i: IpMatchInput): IpMatchResult {
  if (i.hasRef) return { ok: false, reason: "has_ref" };
  if (!(i.creationMs > 0) || i.now - i.creationMs > NEW_ACCOUNT_MS || i.creationMs - i.now > 5 * 60 * 1000) {
    return { ok: false, reason: "old_account" };
  }
  const lo = Math.max(i.now - MATCH_WINDOW_MS, i.creationMs - MATCH_WINDOW_MS);
  const hi = Math.min(i.now, i.creationMs + MATCH_WINDOW_MS);
  const set = new Set<string>();
  for (const c of i.clicks) {
    const ts = Number(c.ts) || 0;
    if (ts < lo || ts > hi) continue;
    const info = i.codes[c.code];
    if (!info || !info.exists || info.campaign) continue;
    if (info.active === false || info.status === "suspended") continue;
    if (typeof info.expires_at === "number" && info.expires_at <= i.now) continue;
    if (info.owner_uid && info.owner_uid === i.uid) continue;
    const cp = normPlat(c.plat);
    if (cp !== "other" && i.plat !== "other" && cp !== i.plat) continue;
    set.add(c.code);
  }
  const cands = [...set];
  if (cands.length === 1) return { ok: true, code: cands[0] };
  return { ok: false, reason: cands.length ? "ambiguous" : "no_match", candidates: cands };
}
