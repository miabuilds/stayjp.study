// 把 gen-articles.mjs 的 JSON 併進 articles.js(補 grammar id、片假名詞讀音正規化)。用法: node scripts/merge-articles.mjs a.json b.json …
import fs from 'node:fs';
const G = {};
for (const lv of ['n5', 'n4', 'n3', 'n2', 'n1']) { const w = {}; new Function('window', fs.readFileSync(`grammar-${lv}.js`, 'utf8') + `;window.__=${lv.toUpperCase()}`)(w); (w.__ || []).forEach(g => { G[g.t.replace(/[〜～~\s]/g, '')] = g.id; }); }
let src = fs.readFileSync('articles.js', 'utf8');
const have = new Set(new Function('window', src + ';return window.ARTICLES')({}).map(a => a.id));
const add = [];
for (const f of process.argv.slice(2)) {
  const a = JSON.parse(fs.readFileSync(f, 'utf8'));
  if (have.has(a.id)) { console.log('skip existing', a.id); continue; }
  for (const v of a.vocab) { if (/^[ァ-ヶー]+$/.test(v.w)) v.r = v.w; }   // 片假名詞:讀音用片假名本身(跟既有資料一致)
  for (const g of a.grammar) { const id = G[g.t.replace(/[〜～~\s]/g, '').replace(/[（(].*[）)]/, '')]; if (id) g.id = id; }
  add.push(a); console.log(a.id, a.title, '| grammar:', a.grammar.map(g => g.t + '→' + (g.id || '-')).join(', '));
}
if (!add.length) process.exit(0);
const i = src.lastIndexOf('];');
let head = src.slice(0, i).replace(/\s+$/, ''); if (!head.endsWith(',')) head += ',';
src = head + '\n' + add.map(a => JSON.stringify(a)).join(',\n') + '\n' + src.slice(i);
fs.writeFileSync('articles.js', src);
console.log('articles now', new Function('window', src + ';return window.ARTICLES')({}).length);
