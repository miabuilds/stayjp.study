// 唯讀:算「KOL 碼帶來多少營收 / 分潤成本」,用來評估活動折扣與 KOL 折扣怎麼分配。
import { db } from './lib/fire-admin.mjs';

const codes = new Map();
for (const d of (await db.collection('ref_codes').get()).docs) codes.set(d.id, d.data());

const tx = await db.collection('transactions')
  .where('status', '==', 'success').get();
const rows = tx.docs.map(d => ({ id: d.id, ...d.data(), at: d.data().occurred_at?.toMillis?.() || 0 }))
  .filter(t => t.type === 'subscribe' || t.type === 'renew');

// 每筆交易歸屬到哪個碼:看付款當下 users/{uid}.ref_code
const uids = [...new Set(rows.map(r => r.uid))];
const refOf = new Map();
for (let i = 0; i < uids.length; i += 200) {
  const part = uids.slice(i, i + 200);
  const snaps = await Promise.all(part.map(u => db.doc('users/' + u).get()));
  snaps.forEach((s, j) => refOf.set(part[j], (s.data() || {}).ref_code || ''));
}

let total = 0, viaKol = 0, viaUser = 0, viaNone = 0, kolN = 0;
const byCode = new Map();
for (const r of rows) {
  const amt = Number(r.amount_twd || 0); if (amt <= 0) continue;
  total += amt;
  const c = refOf.get(r.uid) || '';
  const meta = codes.get(c);
  if (meta && meta.type === 'kol') { viaKol += amt; kolN++; byCode.set(c, (byCode.get(c) || 0) + amt); }
  else if (meta && meta.type === 'user') viaUser += amt;
  else viaNone += amt;
}
const f = n => 'NT$' + Math.round(n).toLocaleString();
console.log(`成功收款 ${rows.length} 筆,合計 ${f(total)}`);
console.log(`  KOL 碼帶來 : ${f(viaKol)}(${(viaKol/total*100).toFixed(1)}%,${kolN} 筆)`);
console.log(`  用戶推薦碼 : ${f(viaUser)}(${(viaUser/total*100).toFixed(1)}%)`);
console.log(`  沒有碼     : ${f(viaNone)}(${(viaNone/total*100).toFixed(1)}%)`);
console.log(`\n各 KOL 碼帶來的營收:`);
[...byCode.entries()].sort((a,b)=>b[1]-a[1]).forEach(([c,v])=>console.log(`  ${c.padEnd(12)} ${f(v)}`));
console.log(`\n分潤成本(10%):${f(viaKol*0.1)}`);
process.exit(0);
