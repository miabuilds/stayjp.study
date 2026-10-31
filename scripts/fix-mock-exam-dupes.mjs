// 一次性清理(2026-10-31):mock_exam_history 因雲端合併用 JSON 字串比對(Firestore 回傳 key 順序不同)每次登入翻倍,
// 4 場小考滾到 3,835 筆/870KB。這支把 users/{uid}.mock_exam_history 與 user_progress/{uid}.mock_exam_history(gzip)
// 都依 date 去重、照時間排、只留最近 200 筆(與 app.html capExamHistory 同規則)。
// 用法:node scripts/fix-mock-exam-dupes.mjs          (dry-run,只印)
//      node scripts/fix-mock-exam-dupes.mjs --apply  (真的寫)
import zlib from 'node:zlib';
import { admin } from './lib/fire-admin.mjs';
const APPLY = process.argv.includes('--apply');
const MAX = 200;
const db = admin.firestore();
function cap(arr) {
  const m = new Map();
  (arr || []).forEach(x => { if (x && x.date && !m.has(x.date)) m.set(x.date, x); });
  return [...m.values()].sort((a, b) => String(a.date).localeCompare(String(b.date))).slice(-MAX);
}
let nUsers = 0, nProg = 0, before = 0, after = 0;
const us = await db.collection('users').get();
for (const d of us.docs) {
  const h = d.data().mock_exam_history;
  if (!Array.isArray(h)) continue;
  const c = cap(h);
  if (c.length === h.length) continue;
  nUsers++; before += h.length; after += c.length;
  console.log(`users/${d.id.slice(0, 8)}… ${h.length} → ${c.length}`);
  if (APPLY) await d.ref.update({ mock_exam_history: c });
}
const ps = await db.collection('user_progress').get();
for (const d of ps.docs) {
  const b = d.data().mock_exam_history;
  if (!b) continue;
  let arr;
  try { arr = JSON.parse(zlib.gunzipSync(Buffer.from(b)).toString('utf8')); } catch (e) { console.log(`user_progress/${d.id.slice(0, 8)} 解不開,略過`); continue; }
  if (!Array.isArray(arr)) continue;
  const c = cap(arr);
  if (c.length === arr.length) continue;
  nProg++;
  console.log(`user_progress/${d.id.slice(0, 8)}… ${arr.length} → ${c.length}`);
  if (APPLY) await d.ref.update({ mock_exam_history: zlib.gzipSync(Buffer.from(JSON.stringify(c), 'utf8')) });
}
console.log(`${APPLY ? '已寫入' : 'dry-run'}:users ${nUsers} 份(${before} → ${after} 筆)、user_progress ${nProg} 份`);
process.exit(0);
