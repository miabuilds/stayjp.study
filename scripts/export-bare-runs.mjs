#!/usr/bin/env node
// 匯出例句的「裸漢字段」(前端 furiganaHTML 會留白不標音的漢字段),給 gen-ex-furigana.mjs 補讀音用。
// 在 node 用 vm 跑 ux-extras.js(window 只放五級單字表),不用開瀏覽器。
// 用法:node scripts/export-bare-runs.mjs <out.json> [--levels n4,n3,n2] [--words w1,w2,…(只匯這些字的例句)] [--from-json <newvocab-dir>]
//   不帶 --words/--from-json 就匯出指定級別全部例句。輸出格式同 gen-ex-furigana:[[lv, w, 例句, [裸段…]], …]
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
const [outFile] = process.argv.slice(2); const args = process.argv.slice(3);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const LEVELS = opt('--levels', 'n5,n4,n3,n2,n1').split(',');
const ctx = { window: null, document: { createElement: () => ({ style: {}, setAttribute() {}, appendChild() {} }), querySelector: () => null, querySelectorAll: () => [], addEventListener() {}, body: { appendChild() {}, classList: { contains: () => false, add() {}, remove() {} } }, head: { appendChild() {} }, documentElement: { lang: 'zh-TW' } }, localStorage: { getItem: () => null, setItem() {}, removeItem() {} }, navigator: { language: 'zh-TW', userAgent: 'node' }, location: { href: 'https://stayjp.study/app.html', search: '', hash: '' }, console, setTimeout, clearTimeout, requestAnimationFrame: () => 0, MutationObserver: class { observe() {} disconnect() {} } };
ctx.window = ctx; ctx.self = ctx; ctx.globalThis = ctx;
vm.createContext(ctx);
for (const lv of ['n5', 'n4', 'n3', 'n2', 'n1']) vm.runInContext(fs.readFileSync(`vocab-${lv}.js`, 'utf8') + `;window.VOCAB_${lv.toUpperCase()} = VOCAB_${lv.toUpperCase()};`, ctx);
try { vm.runInContext(fs.readFileSync('ex-furigana.js', 'utf8'), ctx); } catch (e) {}   // 已有補讀音表的句子就不會再是裸段(只匯真的還留白的)
vm.runInContext(fs.readFileSync('ux-extras.js', 'utf8'), ctx);
const furi = ctx.window.furiganaHTML; if (typeof furi !== 'function') { console.error('furiganaHTML not exposed'); process.exit(1); }
let only = null;
if (opt('--words', null)) only = new Set(opt('--words').split(','));
if (opt('--from-json', null)) { only = new Set(); for (const lv of LEVELS) { try { JSON.parse(fs.readFileSync(path.join(opt('--from-json'), `${lv}.json`), 'utf8')).forEach(e => only.add(e.w)); } catch (e) {} } }
const rows = [];
for (const lv of LEVELS) {
  for (const d of ctx.window['VOCAB_' + lv.toUpperCase()] || []) {
    if (only && !only.has(d.w)) continue;
    const sents = []; if (d.ex && d.ex.j) sents.push(d.ex.j); if (Array.isArray(d.e)) d.e.forEach(x => x && x.j && sents.push(x.j));
    for (const j of sents) {
      let html; try { html = furi(j); } catch (e) { continue; }
      // 去掉 ruby 整塊與標籤 → 剩下的漢字段就是留白的
      const bare = String(html).replace(/<ruby>[\s\S]*?<\/ruby>/g, '\u0000').replace(/<[^>]+>/g, '');
      const runs = bare.match(/[一-鿿々]+/g) || [];
      if (runs.length) rows.push([lv, d.w, j, runs]);
    }
  }
}
fs.writeFileSync(outFile, JSON.stringify(rows));
console.log('rows with bare runs', rows.length, '→', outFile);
