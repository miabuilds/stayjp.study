// 喚回名單(2026-11-24):訂閱中(非買斷、非贈送、非沙盒)但近 N 天完全沒學的人。只讀不寫、不寄信。
//   node scripts/winback-list.mjs [days=30] [--out=<檔案>]   名單(信箱)只寫到 --out 指定的本機檔,不印在畫面上、不進 repo
// 寄信要先給 Mia 看過內容,再用 mail-reply.mjs send <email> winback-2026-11 逐封寄(同一件事擋第二封)。
import fs from 'node:fs';
import { db, admin } from './lib/fire-admin.mjs';
const args = process.argv.slice(2); const N = Number(args.find((a) => /^\d+$/.test(a)) || 30);
const out = (args.find((a) => a.startsWith('--out=')) || '').slice(6);
const now = Date.now(); const dayTW = (ms) => new Date(ms + 8 * 3600e3).toISOString().slice(0, 10); const cut = dayTW(now - N * 864e5);
const toMs = (v) => (v == null ? 0 : typeof v === 'number' ? (v < 1e12 ? v * 1000 : v) : typeof v.toMillis === 'function' ? v.toMillis() : (Date.parse(v) || 0));
const emailOf = {}; let token;
for (let i = 0; i < 30; i++) { const p = await admin.auth().listUsers(1000, token); for (const u of p.users) if (u.email) emailOf[u.uid] = u.email; token = p.pageToken; if (!token) break; }
const stat = { 訂閱中: 0, 近期有學: 0, 沒在學: 0, 已退訂信件: 0, 查無信箱: 0, 可寄: 0, 其中30天內到期: 0, 從沒學過: 0, 收過考前信: 0 }; const list = [];
for (const d of (await db.collection('users').select('subscription', 'study_log', 'email_optout', 'campaigns').get()).docs) {
  const u = d.data(), s = u.subscription; if (!s || s.is_sandbox || s.is_gift || s.plan === 'lifetime') continue;
  if (!(['active', 'cancelled'].includes(s.status) && (toMs(s.expiresAt) > now || s.source === 'group'))) continue;
  stat.訂閱中++;
  const days = Object.keys(u.study_log || {}).filter((k) => /^\d{4}-\d{2}-\d{2}$/.test(k) && !(u.study_log[k] && u.study_log[k].freeze && Object.keys(u.study_log[k]).length === 1)).sort();
  if (days.some((k) => k >= cut)) { stat.近期有學++; continue; }
  stat.沒在學++;
  if (u.email_optout === true) { stat.已退訂信件++; continue; }
  const em = emailOf[d.id]; if (!em) { stat.查無信箱++; continue; }
  stat.可寄++; if (!days.length) stat.從沒學過++;
  if (toMs(s.expiresAt) && toMs(s.expiresAt) < now + 30 * 864e5) stat.其中30天內到期++;
  if (u.campaigns && Object.keys(u.campaigns).some((k) => /^2026-12_/.test(k))) stat.收過考前信++;
  list.push({ email: em, plan: s.plan || '', status: s.status, last: days[days.length - 1] || '', expires: toMs(s.expiresAt) ? dayTW(toMs(s.expiresAt)) : '' });
}
console.log(`近 ${N} 天沒學的訂閱者:`, JSON.stringify(stat));
const by = {}; for (const x of list) by[x.plan + '/' + x.status] = (by[x.plan + '/' + x.status] || 0) + 1; console.log('方案/狀態:', JSON.stringify(by));
if (out) { fs.writeFileSync(out, list.map((x) => [x.email, x.plan, x.status, x.last, x.expires].join('\t')).join('\n') + '\n'); console.log('名單寫到', out, '(' + list.length + ' 人)'); }
process.exit(0);
