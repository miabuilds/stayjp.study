// 唯讀:列出使用者回饋(admin.html 的 feedback collection)
import { db } from './lib/fire-admin.mjs';
const s = await db.collection('feedback').orderBy('createdAt','desc').limit(40).get();
console.log(`共 ${s.size} 筆\n`);
for (const d of s.docs) {
  const x = d.data();
  const t = x.createdAt?.toDate?.()?.toISOString?.().slice(0,16) || '';
  const st = x.status || x.state || (x.resolved ? 'resolved' : 'open');
  console.log(`${t}  ${String(x.type||x.kind||'?').padEnd(8)} ${String(st).padEnd(10)} ${String(x.email||'').slice(0,28).padEnd(28)} ${String(x.text||x.message||x.desc||'').replace(/\s+/g,' ').slice(0,46)}`);
}
process.exit(0);
