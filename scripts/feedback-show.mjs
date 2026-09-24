import { db } from './lib/fire-admin.mjs';
const s = await db.collection('feedback').orderBy('createdAt','desc').limit(40).get();
for (const d of s.docs) {
  const x=d.data(); const st=x.status||'open';
  if (!['open','in_progress'].includes(st)) continue;
  console.log(`── ${d.id} | ${st} | ${x.type} | ${x.email}`);
  console.log(`   ${String(x.text||x.message||'').replace(/\s+/g,' ')}`);
  console.log(`   欄位: ${Object.keys(x).join(', ')}`);
}
process.exit(0);
