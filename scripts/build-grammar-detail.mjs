// 把 scripts/out/grammar-detail/*.json(gen-grammar-detail.mjs 產的)合併進 grammar-detail.js。
// 沒產到的 id 保留舊版;每筆再過一次 check() 格式關卡,不合格的也保留舊版並列出來。
import fs from 'node:fs';
import { check } from './gen-grammar-detail.mjs';
const ROOT = new URL('..', import.meta.url).pathname;
const OUT = ROOT + 'scripts/out/grammar-detail/';
// 舊版內容(沒產到的 id 保留):優先讀已拆好的每級檔,還沒拆過就讀舊的單一大檔
const LVS = ['n5', 'n4', 'n3', 'n2', 'n1'];
const OLD = {};
for (const lv of LVS) { const f = ROOT + `grammar-detail-${lv}.js`; if (fs.existsSync(f)) Object.assign(OLD, new Function('window', fs.readFileSync(f, 'utf8') + ';return window.GRAMMAR_DETAIL')({})); }
if (!Object.keys(OLD).length) Object.assign(OLD, new Function('window', fs.readFileSync(ROOT + 'grammar-detail.js', 'utf8') + ';return window.GRAMMAR_DETAIL')({}));
const NEW = { ...OLD };
// 日文裡混進的中文繁體字 → 日文新字體(只動 gd-jp 內的日文,中文說明不碰)。實測:體力、讀む
const SHIN = { 體: '体', 讀: '読', 說: '説', 會: '会', 對: '対', 國: '国', 學: '学', 聽: '聴', 寫: '写', 關: '関', 實: '実', 廣: '広', 變: '変', 號: '号', 麵: '麺', 來: '来', 歡: '歓', 當: '当', 經: '経', 讓: '譲', 從: '従', 雞: '鶏', 賣: '売', 裡: '裏', 參: '参', 脫: '脱', 應: '応', 雜: '雑' };
const jpFix = html => html.replace(/(<span class='gd-jp'>)([^<]*)(<\/span>)/g, (m, a, t, b) => a + t.replace(/[體讀說會對國學聽寫關實廣變號麵來歡當經讓從雞賣裡參脫應雜]/g, c => SHIN[c]) + b);
let n = 0, nFix = 0; const bad = [];
for (const f of fs.readdirSync(OUT).filter(f => /^n\d-\d+\.json$/.test(f))) {
  const j = JSON.parse(fs.readFileSync(OUT + f, 'utf8'));
  const e = check(j.html);
  if (e) { bad.push(j.id + ' ' + e); continue; }
  const h = jpFix(j.html).replace(/<\/span><\/span>[、，,；;／/　\s]+(?=<span class='gd-pair'>)/g, '</span></span>')   // gd-pair 之間模型自己加的「、」:不斷行間距下會變成孤零零的標點
    .replace(/[✓✔]/g, '○').replace(/[✗✘✕✖]/g, '×'); if (h !== j.html) nFix++;
  NEW[j.id] = h; n++;
}
// 每級一檔(全部 1.8MB、gzip 450KB,一次載太重):app.html ensureGrammarDetail(lv) 只載正在看的級別
for (const lv of LVS) {
  const ids = Object.keys(NEW).filter(k => k.startsWith(lv + '-'));
  const body = ids.map(k => `  ${JSON.stringify(k)}: ${JSON.stringify(NEW[k])}`).join(',\n');
  fs.writeFileSync(ROOT + `grammar-detail-${lv}.js`, `// 文法詳解 ${lv.toUpperCase()}(老師口吻,scripts/gen-grammar-detail.mjs 產生、build-grammar-detail.mjs 合併;改風格改 scripts/grammar-detail-samples.js 再重產)。
// key=文法 id;value=HTML(渲染時 .gd-jp 日文過 furiganaHTML→furigana+即點即查;中文解說不動)。
window.GRAMMAR_DETAIL = window.GRAMMAR_DETAIL || {};
Object.assign(window.GRAMMAR_DETAIL, {\n${body}\n});
(window.GRAMMAR_DETAIL_LV = window.GRAMMAR_DETAIL_LV || {}).${lv} = true;\n`);
}
// 相容:還有地方直接載 grammar-detail.js 的話,幫它把五級都載進來
fs.writeFileSync(ROOT + 'grammar-detail.js', `// 2026-10-24 起文法詳解拆成每級一檔(grammar-detail-n5.js…);這支只是相容外殼,載入全部五級。
['n5', 'n4', 'n3', 'n2', 'n1'].forEach(function (lv) { var s = document.createElement('script'); s.src = 'grammar-detail-' + lv + '.js'; document.head.appendChild(s); });\n`);
console.log('updated', n, 'jp-char fixed', nFix, 'of', Object.keys(NEW).length, bad.length ? 'rejected: ' + bad.join(' | ') : '');
