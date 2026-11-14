// 把某筆回饋附的截圖存成 jpg 檔(給處理回饋時看圖用)。唯讀。
// 用法:node scripts/feedback-shots.mjs <feedbackId> [輸出資料夾=目前資料夾]
import fs from 'node:fs';
import path from 'node:path';
import { db } from './lib/fire-admin.mjs';
const [fid, out = '.'] = process.argv.slice(2);
if (!fid) { console.error('usage: feedback-shots.mjs <feedbackId> [outDir]'); process.exit(1); }
const s = await db.collection('feedback_shots').where('fid', '==', fid).get();
fs.mkdirSync(out, { recursive: true });
for (const d of s.docs) {
  const x = d.data(); const m = /^data:image\/jpeg;base64,(.+)$/.exec(x.data || ''); if (!m) continue;
  const p = path.join(out, `${fid}-${x.i || 0}.jpg`); fs.writeFileSync(p, Buffer.from(m[1], 'base64')); console.log(p);
}
console.log(`${s.size} 張`);
process.exit(0);
