// 查某段日期的交易明細(唯讀):客服查「我被多扣款」用。
// 用法:node scripts/tx-lookup.mjs 2026-09-13 [2026-09-14]   (台灣日期,含起訖當天)
//       node scripts/tx-lookup.mjs --email someone@gmail.com   (用 email 找 uid 再列他的全部交易)
// 列出每筆:時間、uid、email、方案/商品、管道、金額(TWD)、狀態、原始幣別金額(有的話)。認證同 daily-sales.mjs。
import { db, admin } from './lib/fire-admin.mjs';
const toMs = (v) => (v == null ? 0 : typeof v === 'number' ? (v < 1e12 ? v * 1000 : v) : typeof v.toMillis === 'function' ? v.toMillis() : (Date.parse(v) || 0));
const twTime = (ms) => new Date(ms + 8 * 3600e3).toISOString().replace('T', ' ').slice(0, 16) + ' TW';
const args = process.argv.slice(2);
let uidFilter = null;
if (args[0] === '--email') {
  const email = String(args[1] || '').toLowerCase();
  const u = await admin.auth().getUserByEmail(email).catch(() => null);
  if (!u) { console.log('找不到這個 email 的帳號:', email); process.exit(0); }
  uidFilter = u.uid; console.log('uid:', u.uid, '建立於', u.metadata.creationTime);
}
const from = uidFilter ? 0 : Date.parse((args[0] || new Date().toISOString().slice(0, 10)) + 'T00:00:00+08:00');
const to = uidFilter ? Infinity : Date.parse((args[1] || args[0] || new Date().toISOString().slice(0, 10)) + 'T23:59:59+08:00');
const rows = [];
for (const d of (await db.collection('transactions').get()).docs) {
  const t = d.data(); const ms = toMs(t.occurred_at || t.created_at || t.ts);
  if (uidFilter ? t.uid !== uidFilter : (ms < from || ms > to)) continue;
  rows.push({ ms, id: d.id, uid: t.uid || '', plan: t.plan || t.product_id || t.product || '', pm: t.payment_method || t.platform || t.source || '', amt: t.amount_twd, cur: t.currency || '', orig: t.amount || t.price || '', status: t.status || '', type: t.type || '' });
}
rows.sort((a, b) => a.ms - b.ms);
const emails = {};
for (const uid of [...new Set(rows.map((r) => r.uid).filter(Boolean))]) {
  try { const u = await admin.auth().getUser(uid); emails[uid] = u.email || (u.providerData[0] && u.providerData[0].email) || ''; } catch { emails[uid] = '?'; }
}
console.log(`共 ${rows.length} 筆`);
for (const r of rows) console.log(`${twTime(r.ms)} | ${r.status.padEnd(8)} | ${String(r.plan).padEnd(14)} | ${String(r.pm).padEnd(8)} | NT$${String(r.amt).padStart(5)} ${r.cur ? `(${r.cur} ${r.orig})` : ''} | ${emails[r.uid] || r.uid} | ${r.id}`);
