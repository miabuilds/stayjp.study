// 把 gen-jlpt-listening.mjs 產的 JSON 併進 jlpt-questions.js(插在該級最後一題聴解後)+ jlpt-q-trans.js(腳本中譯)。
// 選項會用固定種子重排,避免正解都落在同一個位置(模型偏好 index 1)。
// 用法: node scripts/merge-jlpt-listening.mjs <json...>
import fs from 'node:fs';
const files = process.argv.slice(2);
let qsrc = fs.readFileSync('jlpt-questions.js', 'utf8');
let tsrc = fs.readFileSync('jlpt-q-trans.js', 'utf8');
let seed = 20260917;
const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
const esc = s => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
let added = 0;
for (const f of files) {
  const items = JSON.parse(fs.readFileSync(f, 'utf8'));
  const lv = items[0].lv;
  const lines = items.map(it => {
    if (qsrc.includes(`id:'${it.id}'`)) { console.log('skip existing', it.id); return ''; }
    // 重排選項:目標位置 = (題號 + 亂數) 讓五題落在不同 index
    const correct = it.o[it.a];
    const others = it.o.filter((_, i) => i !== it.a);
    for (let i = others.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [others[i], others[j]] = [others[j], others[i]]; }
    const pos = Math.floor(rnd() * 4);
    const o = [...others]; o.splice(pos, 0, correct);
    tsrc = tsrc.replace(/\}\s*;\s*$/, `,"${it.id}": ${JSON.stringify(it.zh)}};\n`);
    added++;
    return `{id:'${it.id}',lv:'${lv}',t:'listening',at:'${esc(it.at)}',au:'${esc(it.at)}',q:'${esc(it.q)}',o:${JSON.stringify(o)},a:${pos},x:'${esc(it.x)}'},`;
  }).filter(Boolean);
  if (!lines.length) continue;
  // 插在該級最後一題聴解(id lv-lNN 最大者)那一行之後
  const re = new RegExp(`^\\{id:'${lv}-l(\\d+)'.*$`, 'gm');
  let last = null, m;
  while ((m = re.exec(qsrc))) last = m;
  if (!last) { console.error('no anchor for', lv); process.exit(1); }
  const at = last.index + last[0].length;
  qsrc = qsrc.slice(0, at) + '\n' + lines.join('\n') + qsrc.slice(at);
  console.log(lv, '+', lines.length, 'after', last[0].slice(0, 16));
}
fs.writeFileSync('jlpt-questions.js', qsrc);
fs.writeFileSync('jlpt-q-trans.js', tsrc);
console.log('added', added);
