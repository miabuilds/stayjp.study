// 唯讀:列出目前的推薦碼(KOL / 活動)與各自的折扣、到期、使用狀況
import { db } from './lib/fire-admin.mjs';
const s = await db.collection('ref_codes').get();
console.log(`共 ${s.size} 個碼`);
for (const d of s.docs) {
  const x = d.data();
  const exp = x.expires_at ? new Date(x.expires_at).toISOString().slice(0,10) : '無期限';
  console.log(`  ${d.id.padEnd(14)} type=${String(x.type||'-').padEnd(8)} active=${x.active!==false} 到期=${exp} owner=${String(x.owner_uid||'-').slice(0,8)} ${x.note||''}`);
}
process.exit(0);
