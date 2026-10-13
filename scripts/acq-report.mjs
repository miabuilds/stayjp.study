// 唯讀:依來源算「註冊 → 試用 → 付費」。資料來自 users/{uid}.acq(acq.js 2026-10-13 起寫入)。
// 用法:node scripts/acq-report.mjs [天數=30]
// 來源判定(用 last,沒有就用 first):utm_source → KOL/推薦碼 → 外站網域 → App 內註冊 → 直接進站。
import { db } from './lib/fire-admin.mjs';
const DAYS = Number(process.argv[2] || 30);
const since = Date.now() - DAYS * 864e5;
const toMs = (v) => (v == null ? 0 : typeof v === 'number' ? (v < 1e12 ? v * 1000 : v) : typeof v.toMillis === 'function' ? v.toMillis() : (Date.parse(v) || 0));
const label = (t, platform) => {
  if (!t) return platform !== 'web' ? `app(${platform})` : '(無紀錄)';
  if (t.src) return t.src + (t.camp ? ` / ${t.camp}` : '');
  if (t.ref) return `ref:${t.ref}`;
  if (t.inapp) return `${t.inapp}(主頁或貼文,沒帶 utm)`;
  if (t.host) return `外站:${t.host}`;
  if (t.app || platform !== 'web') return `app(${platform})`;
  return '直接進站';
};
const users = (await db.collection('users').where('acq.saved_at', '>', 0).get()).docs
  .map((d) => ({ uid: d.id, acq: d.data().acq }))
  .filter((u) => (u.acq.acct_created || 0) >= since && (u.acq.acct_created || 0) >= u.acq.saved_at - 24 * 3600e3);   // 只算新帳號(註冊當天就記到來源的)
const trials = new Set((await db.collection('trial_used').get()).docs.map((d) => d.data().uid || d.id));
const paid = new Map();
for (const d of (await db.collection('transactions').where('status', '==', 'success').get()).docs) {
  const t = d.data(); if (t.is_sandbox || !(Number(t.amount_twd) > 0)) continue;
  paid.set(t.uid, (paid.get(t.uid) || 0) + Number(t.amount_twd));
}
const rows = new Map();
for (const u of users) {
  const k = label(u.acq.last || u.acq.first, u.acq.platform || 'web');
  const r = rows.get(k) || { n: 0, trial: 0, paid: 0, twd: 0 };
  r.n++; if (trials.has(u.uid)) r.trial++; if (paid.has(u.uid)) { r.paid++; r.twd += paid.get(u.uid); }
  rows.set(k, r);
}
console.log(`近 ${DAYS} 天新註冊(有來源紀錄)${users.length} 人\n來源\t註冊\t試用\t付費\t金額`);
for (const [k, r] of [...rows].sort((a, b) => b[1].n - a[1].n)) console.log(`${k}\t${r.n}\t${r.trial}\t${r.paid}\tNT$${r.twd}`);
process.exit(0);
