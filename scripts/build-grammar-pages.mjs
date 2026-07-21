#!/usr/bin/env node
// build-grammar-pages.mjs — 從 grammar-n5..n1.js + confusables.js 產生 SEO 靜態頁
//   grammar/  文法點頁(382)+ 級別索引 + 總索引
//   compare/  易混淆詞比較頁(80)+ 索引 —「やっと ようやく 違い」類搜尋的著陸頁
//
// 為什麼:練習工具是 JS 單頁,Google 吃不到 382 個文法點的長尾搜尋
// (「〜において 意味」「〜わけにはいかない 中文」…)。每個文法點產一頁
// 可被索引的靜態頁,文末導回練習工具。
//
// 產出:
//   grammar/<id>.html        每個文法點一頁(382 頁)
//   grammar/n5..n1.html      各級索引頁
//   grammar/index.html       總索引
//   sitemap-grammar.xml      供 Google 抓取(robots.txt 需列出)
//
// 用法:node scripts/build-grammar-pages.mjs
// 資料更新後重跑即可,整個 grammar/ 目錄都是產物,可整目錄刪掉重生。

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'grammar');
const SITE = 'https://stayjp.study';
const LEVELS = ['n5', 'n4', 'n3', 'n2', 'n1'];
const LEVEL_LABEL = { n5: 'N5 入門', n4: 'N4 基礎', n3: 'N3 進階', n2: 'N2 上級', n1: 'N1 超級' };

mkdirSync(OUT, { recursive: true });

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// 例句裡只有 <em> 標記重點,跳脫後還原
const escKeepEm = s => esc(s).replace(/&lt;em&gt;/g, '<em>').replace(/&lt;\/em&gt;/g, '</em>');
const stripTags = s => String(s ?? '').replace(/<[^>]*>/g, '');

// ---- 載入資料 ----
const data = {};
for (const lv of LEVELS) {
  const src = readFileSync(join(ROOT, `grammar-${lv}.js`), 'utf8');
  data[lv] = new Function(`${src}; return ${lv.toUpperCase()};`)();
}

// ---- 共用外框(和紙+朱印主題,含深色模式,無外部依賴) ----
const CSS = `
:root{--bg:#FAF8F3;--bg2:#FFF;--bg3:#F2EEE5;--tx:#1C1C1E;--tx2:#6A6A6A;--tx3:#A9A9A9;--ac:#B8362A;--ac2:#2F5D7A;--bd:#E5DECF;--line:#DDD5C0;
--serif:"Hiragino Mincho ProN","Noto Serif JP","Yu Mincho","游明朝","Songti TC",serif}
[data-theme="dark"]{--bg:#121113;--bg2:#1B1A1C;--bg3:#1F1E20;--tx:#EDE8DE;--tx2:#8F8A7E;--tx3:#5D5A53;--ac:#E4715F;--ac2:#7FA5C2;--bd:#2C2A27;--line:#2C2A27}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,"Hiragino Sans","Hiragino Kaku Gothic ProN","Noto Sans JP","PingFang TC",system-ui,sans-serif;
background:var(--bg);color:var(--tx);line-height:1.8;font-size:16px;-webkit-font-smoothing:antialiased}
a{color:var(--ac2);text-decoration:none}a:hover{text-decoration:underline}
.hd{position:sticky;top:0;background:var(--bg);border-bottom:1px solid var(--line);z-index:10}
.hd-in{max-width:820px;margin:0 auto;display:flex;align-items:center;gap:16px;padding:12px 24px}
.hd-in h2{font-family:var(--serif);font-size:15px;font-weight:700}.hd-in h2 a{color:var(--tx)}
.hd-in nav{margin-left:auto;display:flex;gap:14px;font-size:13px}.hd-in nav a{color:var(--tx2)}
main{max-width:820px;margin:0 auto;padding:36px 24px 80px}
.crumb{font-size:12px;color:var(--tx3);margin-bottom:20px}.crumb a{color:var(--tx3)}
h1{font-family:var(--serif);font-size:clamp(26px,5vw,38px);line-height:1.3;margin-bottom:12px}
.meta{display:flex;gap:8px;margin-bottom:32px;flex-wrap:wrap}
.tag{font-size:12px;font-weight:700;color:var(--ac);border:1px solid var(--ac);border-radius:999px;padding:2px 12px}
.tag.lv{background:var(--ac);color:#fff}
h2.sec{font-family:var(--serif);font-size:18px;margin:32px 0 12px;color:var(--tx);display:flex;align-items:center;gap:10px}
h2.sec::before{content:'';width:18px;height:2px;background:var(--ac)}
.pattern{background:var(--bg3);border:1px solid var(--bd);border-radius:10px;padding:14px 18px;font-size:16px;font-weight:600}
.expl{color:var(--tx);font-size:16px}
.eg{border:1px solid var(--line);border-radius:12px;padding:16px 18px;margin-bottom:12px;background:var(--bg2)}
.eg .j{font-size:17px;line-height:1.9;font-family:var(--serif)}
.eg .j em{font-style:normal;color:var(--ac);font-weight:700}
.eg .z{font-size:14px;color:var(--tx2);margin-top:6px}
.cta{margin:40px 0;border:2px solid var(--ac);border-radius:14px;padding:22px 24px;background:var(--bg2)}
.cta p{font-size:15px;color:var(--tx2);margin-bottom:14px}.cta p strong{color:var(--tx)}
.cta a.btn{display:inline-block;background:var(--ac);color:#fff;font-weight:700;font-size:15px;padding:12px 26px;border-radius:999px}
.cta a.btn:hover{text-decoration:none;opacity:.9}
.rel{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media(max-width:600px){.rel{grid-template-columns:1fr}}
.rel a{border:1px solid var(--line);border-radius:10px;padding:10px 14px;font-size:14px;color:var(--tx);background:var(--bg2)}
.rel a:hover{border-color:var(--ac);text-decoration:none}
.pn{display:flex;justify-content:space-between;gap:12px;margin-top:36px;font-size:14px}
.list{list-style:none}
.list li{border-bottom:1px solid var(--line)}
.list a{display:flex;justify-content:space-between;gap:12px;padding:12px 4px;color:var(--tx);font-size:15px}
.list a:hover{color:var(--ac);text-decoration:none}
.list .hint{color:var(--tx3);font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:55%}
.cat-h{font-family:var(--serif);font-size:16px;color:var(--ac);margin:28px 0 4px}
.cmp-wrap{overflow-x:auto;border:1px solid var(--line);border-radius:12px;background:var(--bg2)}
.cmp{width:100%;border-collapse:collapse;font-size:14px;min-width:520px}
.cmp th{background:var(--bg3);color:var(--tx2);font-size:12px;letter-spacing:.05em;text-align:left;padding:10px 14px;border-bottom:1px solid var(--line)}
.cmp td{padding:12px 14px;border-bottom:1px solid var(--line);vertical-align:top}
.cmp tr:last-child td{border-bottom:none}
.cmp .w{font-family:var(--serif);font-size:16px;font-weight:700;white-space:nowrap}
.cmp .r{font-size:12px;color:var(--tx3);font-weight:400}
.cmp .m{white-space:nowrap;color:var(--ac);font-weight:600}
.tip{border-left:3px solid var(--ac);background:var(--ac-soft,rgba(184,54,42,.06));border-radius:0 10px 10px 0;padding:14px 18px;font-size:15px;line-height:1.9}
.ft{border-top:1px solid var(--line);padding:28px 24px;font-size:12px;color:var(--tx3);text-align:center}
.ft a{color:var(--tx2);margin:0 8px}
`.trim();

const THEME_JS = `(function(){var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);else if(matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches)document.documentElement.setAttribute('data-theme','dark')})();`;
const GA = `<script async src="https://www.googletagmanager.com/gtag/js?id=G-2WP4D34LE3"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-2WP4D34LE3');</script>`;

function shell({ title, desc, canonical, jsonld, body }) {
  return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="article">
<meta property="og:url" content="${canonical}">
<link rel="icon" href="../stayjpplan.png" type="image/png">
${GA}
<script>${THEME_JS}</script>
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ''}
<style>${CSS}</style>
</head>
<body>
<header class="hd"><div class="hd-in">
  <h2><a href="../home.html">日本再留計劃</a></h2>
  <nav><a href="index.html">文法索引</a><a href="../index.html">練習工具</a><a href="../pricing.html">方案</a></nav>
</div></header>
<main>
${body}
</main>
<footer class="ft">
  © 2026 日本再留計劃 / StayJP Study — 免費 JLPT N5–N1 備考工具
  <div><a href="../home.html">首頁</a><a href="../index.html">學習工具</a><a href="../jlpt.html">JLPT 指南</a><a href="../terms.html">服務條款</a><a href="../privacy.html">隱私權政策</a></div>
</footer>
</body>
</html>`;
}

// ---- 推薦參考書(聯盟預留位)----
// AFF_ID 填聯盟會員 ID 後重跑本腳本,469 頁的書籍連結全部帶上分潤參數。
// 未填時輸出乾淨的博客來搜尋連結(對讀者一樣有用,只是沒抽成)。
const AFF_ID = '';   // 例:聯盟網/通路王發的 ID
const bookUrl = (title) => {
  const base = `https://search.books.com.tw/search/query/key/${encodeURIComponent(title)}`;
  return AFF_ID ? `${base}?aff=${AFF_ID}` : base;
};
const BOOKS = {
  n5: [
    { t: '大家的日本語 初級 I', d: '零基礎最通用的教科書,課文+句型循序漸進' },
    { t: 'TRY! 日本語能力試驗 N5', d: '以文法為軸的應試整理,配合本站文法頁複習' },
  ],
  n4: [
    { t: '大家的日本語 初級 II', d: '接續初級 I,涵蓋 N4 主要句型' },
    { t: 'TRY! 日本語能力試驗 N4', d: '文法應試導向,例句貼近真題' },
  ],
  n3: [
    { t: 'TRY! 日本語能力試驗 N3', d: '從 N4 銜接 N3 的首選,文法脈絡清楚' },
    { t: '日本語総まとめ N3 文法', d: '一天兩頁的節奏,適合搭配每日 30 分鐘計畫' },
  ],
  n2: [
    { t: '新完全マスター 文法 N2', d: '公認 N2 文法最完整,難度扎實' },
    { t: '日本語総まとめ N2 文法', d: '整理簡潔,考前快速過一輪用' },
  ],
  n1: [
    { t: '新完全マスター 文法 N1', d: 'N1 文法系統化整理的定番' },
    { t: '日本語総まとめ N1 文法', d: '輕量版複習,搭配模考抓弱點' },
  ],
};
const booksBox = (lv) => {
  const list = BOOKS[lv] || BOOKS.n2;
  return `
<h2 class="sec">搭配的紙本參考書</h2>
<div class="rel">${list.map(b => `<a href="${bookUrl(b.t)}" target="_blank" rel="noopener sponsored">📚 ${esc(b.t)}<br><span style="font-size:12.5px;color:var(--tx3);font-weight:400">${esc(b.d)}</span></a>`).join('')}</div>`;
};

const ctaBox = lv => `
<div class="cta">
  <p><strong>看懂了,考試時認得出來嗎?</strong><br>到練習工具做「${LEVEL_LABEL[lv].slice(0, 2)} 文法測驗」,答錯的會自動排進 SRS 間隔複習,考前自動幫你複習到熟。</p>
  <a class="btn" href="../index.html">免費練習 ${LEVEL_LABEL[lv].slice(0, 2)} 文法 →</a>
</div>`;

// ---- 每個文法點一頁 ----
let pageCount = 0;
const today = new Date().toISOString().slice(0, 10);
const urls = [];

for (const lv of LEVELS) {
  const items = data[lv];
  const LV = lv.toUpperCase();
  items.forEach((it, i) => {
    const prev = items[i - 1], next = items[i + 1];
    const related = items.filter(o => o.cat === it.cat && o.id !== it.id).slice(0, 6);
    const descEx = stripTags(it.ex).replace(/\s+/g, ' ').slice(0, 90);
    const title = `${it.t}|JLPT ${LV} 文法的意味・接続・例句`;
    const desc = `JLPT ${LV} 文法「${it.t}」:${descEx}${descEx.length >= 90 ? '…' : ''} 附接續方式與 ${it.eg.length} 個例句中譯,可免費線上練習。`;
    // GitHub Pages 不支援 cleanUrls,canonical/sitemap 都要帶 .html
    const canonical = `${SITE}/grammar/${it.id}.html`;

    const jsonld = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: `${it.t} — JLPT ${LV} 文法`,
      description: desc,
      inLanguage: 'zh-Hant',
      author: { '@type': 'Organization', name: '日本再留計劃 StayJP Study', url: SITE },
      mainEntityOfPage: canonical,
    };

    const body = `
<div class="crumb"><a href="../home.html">首頁</a> › <a href="index.html">JLPT 文法索引</a> › <a href="${lv}.html">${LV} 文法</a> › ${esc(it.t)}</div>
<h1>${esc(it.t)}</h1>
<div class="meta"><span class="tag lv">JLPT ${LV}</span><span class="tag">${esc(it.cat)}</span></div>

<h2 class="sec">接続</h2>
<div class="pattern">${esc(it.p)}</div>

<h2 class="sec">意味・解說</h2>
<p class="expl">${esc(stripTags(it.ex))}</p>

<h2 class="sec">例句</h2>
${it.eg.map(e => `<div class="eg"><div class="j" lang="ja">${escKeepEm(e.j)}</div><div class="z">${esc(e.z)}</div></div>`).join('\n')}

${ctaBox(lv)}

${booksBox(lv)}

${related.length ? `<h2 class="sec">同類文法(${esc(it.cat)})</h2>
<div class="rel">${related.map(r => `<a href="${r.id}.html">${esc(r.t)}</a>`).join('')}</div>` : ''}

<div class="pn">
  <span>${prev ? `← <a href="${prev.id}.html">${esc(prev.t)}</a>` : ''}</span>
  <span>${next ? `<a href="${next.id}.html">${esc(next.t)}</a> →` : ''}</span>
</div>`;

    writeFileSync(join(OUT, `${it.id}.html`), shell({ title, desc, canonical, jsonld, body }));
    urls.push(canonical);
    pageCount++;
  });

  // ---- 級別索引頁 ----
  const cats = [...new Set(items.map(o => o.cat))];
  const lvBody = `
<div class="crumb"><a href="../home.html">首頁</a> › <a href="index.html">JLPT 文法索引</a> › ${LV} 文法</div>
<h1>JLPT ${LV} 文法一覽(${items.length} 項)</h1>
<div class="meta"><span class="tag lv">${LEVEL_LABEL[lv]}</span></div>
<p style="color:var(--tx2);margin-bottom:8px">每一項都有接續方式、意味解說與例句中譯。點進去看詳解,或直接到<a href="../index.html">練習工具</a>做測驗。</p>
${cats.map(c => `<div class="cat-h">${esc(c)}</div>
<ul class="list">${items.filter(o => o.cat === c).map(o =>
  `<li><a href="${o.id}.html"><span>${esc(o.t)}</span><span class="hint">${esc(stripTags(o.ex).slice(0, 24))}</span></a></li>`).join('\n')}</ul>`).join('\n')}
${ctaBox(lv)}
${booksBox(lv)}`;

  writeFileSync(join(OUT, `${lv}.html`), shell({
    title: `JLPT ${LV} 文法一覽(${items.length} 項)|意味・接続・例句`,
    desc: `JLPT ${LV} 全部 ${items.length} 個文法點:接續、意味、例句中譯完整整理,免費線上練習與測驗。`,
    canonical: `${SITE}/grammar/${lv}.html`,
    body: lvBody,
  }));
  urls.push(`${SITE}/grammar/${lv}.html`);
}

// ---- 總索引 ----
const total = LEVELS.reduce((n, lv) => n + data[lv].length, 0);
writeFileSync(join(OUT, 'index.html'), shell({
  title: `JLPT N5–N1 文法索引(${total} 項)|日本再留計劃`,
  desc: `JLPT N5 到 N1 共 ${total} 個文法點:接續、意味、例句中譯完整整理,依級別與類別分類,免費查閱與練習。`,
  canonical: `${SITE}/grammar/`,
  body: `
<div class="crumb"><a href="../home.html">首頁</a> › JLPT 文法索引</div>
<h1>JLPT 文法索引</h1>
<p style="color:var(--tx2);margin-bottom:24px">N5 到 N1 共 ${total} 個文法點,每項都有接續、意味與例句中譯。</p>
<ul class="list">
${LEVELS.map(lv => `<li><a href="${lv}.html"><span>JLPT ${lv.toUpperCase()} 文法(${LEVEL_LABEL[lv]})</span><span class="hint">${data[lv].length} 項</span></a></li>`).join('\n')}
<li><a href="../compare/index.html"><span>易混淆詞比較(やっと・ようやく 這種)</span><span class="hint">80 組</span></a></li>
</ul>
${ctaBox('n3')}`,
}));
urls.push(`${SITE}/grammar/`);

// ---- 易混淆詞比較頁(compare/)----
const CMP_OUT = join(ROOT, 'compare');
mkdirSync(CMP_OUT, { recursive: true });
const cfs = new Function(`${readFileSync(join(ROOT, 'confusables.js'), 'utf8')}; return CONFUSABLES;`)();

const cmpCta = `
<div class="cta">
  <p><strong>看懂了,選擇題裡還分得出來嗎?</strong><br>單字測驗有「易混淆挑戰」模式,專考這些一字之差,答錯自動進 SRS 複習到熟。</p>
  <a class="btn" href="../index.html">免費做易混淆挑戰 →</a>
</div>`;

cfs.forEach((c, i) => {
  const prev = cfs[i - 1], next = cfs[i + 1];
  const related = cfs.filter(o => o.level === c.level && o.id !== c.id).slice(0, 6);
  const tDot = c.title.replace(/\s+vs\s+/g, '・');
  const title = `${tDot} 差別在哪?|JLPT ${c.level} 易混淆詞比較`;
  const descTip = stripTags(c.tip).replace(/\s+/g, ' ').slice(0, 90);
  const desc = `「${tDot}」的差別:${descTip}${descTip.length >= 90 ? '…' : ''} 附用法比較表與例句中譯,可免費線上練習。`;
  const canonical = `${SITE}/compare/${c.id}.html`;

  const body = `
<div class="crumb"><a href="../home.html">首頁</a> › <a href="index.html">易混淆詞比較</a> › ${esc(tDot)}</div>
<h1>${esc(tDot)}</h1>
<div class="meta"><span class="tag lv">JLPT ${esc(c.level)}</span><span class="tag">易混淆</span></div>

<h2 class="sec">用法比較</h2>
<div class="cmp-wrap"><table class="cmp">
<thead><tr><th>詞</th><th>意味</th><th>使い分け</th></tr></thead>
<tbody>
${c.words.map(w => `<tr><td class="w" lang="ja">${esc(w.w)}${w.r && w.r !== w.w ? `<div class="r">${esc(w.r)}</div>` : ''}</td><td class="m">${esc(w.m)}</td><td>${esc(w.note || '')}</td></tr>`).join('\n')}
</tbody>
</table></div>

<h2 class="sec">記憶訣竅</h2>
<div class="tip">${esc(stripTags(c.tip))}</div>

<h2 class="sec">例句</h2>
${c.eg.map(e => `<div class="eg"><div class="j" lang="ja">${escKeepEm(e.j)}</div><div class="z">${esc(e.z)}</div></div>`).join('\n')}

${cmpCta}

${booksBox(/n3/i.test(c.level) && !/n2/i.test(c.level) ? 'n3' : 'n2')}

${related.length ? `<h2 class="sec">更多 ${esc(c.level)} 易混淆</h2>
<div class="rel">${related.map(r => `<a href="${r.id}.html">${esc(r.title.replace(/\s+vs\s+/g, '・'))}</a>`).join('')}</div>` : ''}

<div class="pn">
  <span>${prev ? `← <a href="${prev.id}.html">${esc(prev.title.replace(/\s+vs\s+/g, '・'))}</a>` : ''}</span>
  <span>${next ? `<a href="${next.id}.html">${esc(next.title.replace(/\s+vs\s+/g, '・'))}</a> →` : ''}</span>
</div>`;

  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${tDot} — JLPT ${c.level} 易混淆詞比較`,
    description: desc,
    inLanguage: 'zh-Hant',
    author: { '@type': 'Organization', name: '日本再留計劃 StayJP Study', url: SITE },
    mainEntityOfPage: canonical,
  };
  writeFileSync(join(CMP_OUT, `${c.id}.html`), shell({ title, desc, canonical, jsonld, body }));
  urls.push(canonical);
});

// compare 索引(依級別分組)
const cfLevels = [...new Set(cfs.map(c => c.level))];
writeFileSync(join(CMP_OUT, 'index.html'), shell({
  title: `JLPT 易混淆詞比較(${cfs.length} 組)|やっと・ようやく 差別這種一次搞懂`,
  desc: `JLPT N3~N2 共 ${cfs.length} 組易混淆單字比較:意味、使い分け、記憶訣竅與例句,免費查閱與測驗。`,
  canonical: `${SITE}/compare/`,
  body: `
<div class="crumb"><a href="../home.html">首頁</a> › 易混淆詞比較</div>
<h1>JLPT 易混淆詞比較</h1>
<p style="color:var(--tx2);margin-bottom:24px">「やっと」和「ようやく」差在哪?${cfs.length} 組考試最愛考的一字之差,每組都有比較表、記憶訣竅和例句。也可以到<a href="../grammar/index.html">文法索引</a>查文法點。</p>
${cfLevels.map(lv => `<div class="cat-h">JLPT ${esc(lv)}</div>
<ul class="list">${cfs.filter(c => c.level === lv).map(c =>
  `<li><a href="${c.id}.html"><span>${esc(c.title.replace(/\s+vs\s+/g, '・'))}</span><span class="hint">${esc(c.words.map(w => w.m).filter((m, i2, a) => a.indexOf(m) === i2).join('/').slice(0, 20))}</span></a></li>`).join('\n')}</ul>`).join('\n')}
${cmpCta}`,
}));
urls.push(`${SITE}/compare/`);

// ---- sitemap ----
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`).join('\n')}
</urlset>`;
writeFileSync(join(ROOT, 'sitemap-grammar.xml'), sitemap);

console.log(`✓ ${pageCount} 個文法頁 + ${LEVELS.length} 個級別索引 + 1 個總索引`);
console.log(`✓ sitemap-grammar.xml(${urls.length} 個 URL)`);
