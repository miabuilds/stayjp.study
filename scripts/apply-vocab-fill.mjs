#!/usr/bin/env node
// 把 gen-vocab-fill.mjs 產的新字「原位置」套進 vocab-<lv>.js(替換跟低級別重複的那幾行,索引不動 → 用戶每日進度/SRS 不錯位)。
// 用法:node scripts/apply-vocab-fill.mjs <dups.json> <newvocab-dir> [--levels n4,n3,n2] [--dry] [--skip-flagged]
//   輸出 <newvocab-dir>/applied-<lv>.tsv(舊字→新字對照)。檔案格式:每個條目一行 `{w:"…",…},`,只換那一行。
import fs from 'node:fs';
import path from 'node:path';
const [dupsFile, dir] = process.argv.slice(2); const args = process.argv.slice(4);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const LEVELS = opt('--levels', 'n4,n3,n2').split(','); const DRY = args.includes('--dry'); const SKIP_FLAG = args.includes('--skip-flagged');
const dups = JSON.parse(fs.readFileSync(dupsFile, 'utf8'));
const q = s => '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
const ser = e => `{w:${q(e.w)},r:${q(e.r)},m:${q(e.m)},c:${q(e.c)}${e.t ? ',t:' + q(e.t) : ''},ex:{j:${q(e.ex.j)},z:${q(e.ex.z)},e:${q(e.ex.e)}}},`;
for (const lv of LEVELS) {
  const file = `vocab-${lv}.js`; const lines = fs.readFileSync(file, 'utf8').split('\n');
  const entryLines = []; lines.forEach((l, i) => { if (/^\{w:"/.test(l)) entryLines.push(i); });
  const want = dups[lv]; let pool = JSON.parse(fs.readFileSync(path.join(dir, `${lv}.json`), 'utf8'));
  pool = pool.filter(e => !e._reject);   // 第二審退回的不用
  if (SKIP_FLAG) pool = pool.filter(e => !e._flag);
  if (pool.length < want.length) { console.error(`[${lv}] 新字不夠:有 ${pool.length},要 ${want.length}`); process.exit(1); }
  // 每個位置都要驗:那一行的 w/r 真的是 dups 記的那個字(檔案若被動過就停)
  // 盡量用「同詞性」的新字換(舊位置是動詞就換動詞),級別的詞性比例和檔案裡的分類註解才不會跑掉;沒有同詞性的才拿別的
  const applied = []; const left = pool.slice();
  const take = c => { let i = left.findIndex(e => e.c === c); if (i < 0) i = 0; return left.splice(i, 1)[0]; };
  for (const d of want) {
    const li = entryLines[d.i]; const m = lines[li].match(/^\{w:"([^"]+)",r:"([^"]*)"/);
    if (!m || m[1] !== d.w || m[2] !== d.r) { console.error(`[${lv}] 位置 ${d.i} 對不上:檔案是 ${m && m[1]},dups 是 ${d.w}`); process.exit(1); }
    const e = take(d.c); const hadComma = /,\s*$/.test(lines[li]);
    lines[li] = hadComma ? ser(e) : ser(e).replace(/,$/, '');
    applied.push([d.i, d.w, d.r, d.from, e.w, e.r, e.m, e._flag || '', d.c, e.c, e.t || '', e.ex.j, e.ex.z]);
  }
  fs.writeFileSync(path.join(dir, `applied-${lv}.tsv`), 'idx\told_w\told_r\tdup_of\tnew_w\tnew_r\tnew_m\tflag\told_c\tnew_c\tnew_t\tex_j\tex_z\n' + applied.map(r => r.join('\t')).join('\n') + '\n');
  if (!DRY) fs.writeFileSync(file, lines.join('\n'));
  console.log(`[${lv}] ${DRY ? 'dry:' : ''}replaced ${applied.length} entries (pool ${pool.length})`);
}
