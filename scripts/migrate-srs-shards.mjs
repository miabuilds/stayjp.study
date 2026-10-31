// 一次性搬家(2026-10-31 第二步):users/{uid}.srs_data(背單字進度,users doc 最胖欄位)→ users/{uid}/srs/{n5|n4|n3|n2|n1|my|other} = { d: {...} }
// 前端 app.html 登入時也會自己搬(loadCloudData → _migrateSRSShards);這支是把「沒再登入的人」一起搬完,users doc 才會全面瘦下來。
// 合併規則與前端 mergeSRS 一致:舊欄位 ⊕ user_progress 壓縮包 ⊕ 既有分級文件,逐筆比 lastReviewTs 誰新。分級文件 merge 寫、寫成功才刪舊欄位。
// 用法:node scripts/migrate-srs-shards.mjs          (dry-run,只印)
//      node scripts/migrate-srs-shards.mjs --apply  (真的寫)
import zlib from 'node:zlib';
import { admin } from './lib/fire-admin.mjs';
const APPLY = process.argv.includes('--apply');
const SHARDS = ['n5', 'n4', 'n3', 'n2', 'n1', 'my', 'other'];
const db = admin.firestore();
const shardOf = k => { const i = k.indexOf(':'); const p = i > 0 ? k.slice(0, i) : ''; return SHARDS.includes(p) && p !== 'other' ? p : 'other'; };
function mergeSRS(local, cloud) {   // 同 app.html
  const merged = { ...cloud };
  Object.entries(local || {}).forEach(([k, v]) => {
    const m = merged[k]; if (!m) { merged[k] = v; return; }
    const newer = (v && v.lastReviewTs && m.lastReviewTs) ? v.lastReviewTs > m.lastReviewTs : !!(v && v.lastReview && (!m.lastReview || v.lastReview > m.lastReview));
    if (newer) merged[k] = v;
  });
  return merged;
}
let n = 0, entries = 0, bytes = 0, skipped = 0;
const snap = await db.collection('users').select('srs_data').get();
for (const doc of snap.docs) {
  const legacy = doc.data().srs_data;
  if (legacy == null) continue;
  if (typeof legacy !== 'object' || Array.isArray(legacy)) { skipped++; console.log(`users/${doc.id.slice(0, 8)} srs_data 不是物件,略過`); continue; }
  let all = { ...legacy };
  try {   // 壓縮包(前端最多 60 秒寫一次,可能比舊欄位新)
    const p = await db.collection('user_progress').doc(doc.id).get();
    const b = p.exists ? p.data().srs_data : null;
    if (b) all = mergeSRS(JSON.parse(zlib.gunzipSync(Buffer.from(b)).toString('utf8')), all);
  } catch (e) {}
  const sdocs = await doc.ref.collection('srs').get();   // 已經有分級文件(前端搬過一半/新裝置先寫了)→ 以它為準再疊舊資料
  const existing = {}; sdocs.forEach(sd => Object.assign(existing, (sd.data() || {}).d || {}));
  all = mergeSRS(all, existing);
  const by = {}; Object.keys(all).forEach(k => { (by[shardOf(k)] = by[shardOf(k)] || {})[k] = all[k]; });
  const sz = Buffer.byteLength(JSON.stringify(legacy));
  n++; entries += Object.keys(all).length; bytes += sz;
  console.log(`users/${doc.id.slice(0, 8)}… ${Object.keys(legacy).length} 筆/${Math.round(sz / 1024)}KB → ${Object.keys(by).map(s => s + ':' + Object.keys(by[s]).length).join(' ')}`);
  if (!APPLY) continue;
  for (const sh of Object.keys(by)) await doc.ref.collection('srs').doc(sh).set({ d: by[sh] }, { merge: true });
  await doc.ref.update({ srs_data: admin.firestore.FieldValue.delete() });
}
console.log(`${APPLY ? '已搬' : 'dry-run'}:${n} 人、${entries} 筆、舊欄位共 ${Math.round(bytes / 1024)}KB;略過 ${skipped}`);
process.exit(0);
