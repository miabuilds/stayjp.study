#!/usr/bin/env node
// build-grammar-pages-l10n.mjs — 外語版 JLPT 文法 SEO 靜態頁(越南文 / 印尼文,N5・N4)
//
// 為什麼:站內七語是同一個網址、靠 JS 依瀏覽器語言換字,Google 爬蟲(美國、不帶語言)
// 只看得到中文,外語翻譯對搜尋等於不存在。Google 建議每種語言一個網址 + hreflang。
// 這支用「已經翻好」的 content-<lang>.js(標題/接續/說明/例句)和
// grammar-detail-<lang>-<lv>.js(詳解)產靜態頁,不重新翻譯、不花 API。
//
// 產出:
//   <lang>/grammar/<id>.html     每個文法點一頁
//   <lang>/grammar/n5.html、n4.html  級別索引
//   <lang>/grammar/index.html    總索引
//   sitemap-grammar-l10n.xml     (robots.txt 要列)
// 另外:把 hreflang 插進「現有」中文頁 grammar/<id>.html、grammar/n5.html、n4.html 的 <head>
//   (只插 link 標籤、可重跑;不重產中文頁——中文頁上線後有手改過,重跑 build-grammar-pages.mjs 會蓋掉)
//
// 用法:node scripts/build-grammar-pages-l10n.mjs
// 加語言/級別:改 LANGS / LEVELS,並在 STR 補該語言的介面字串。

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://stayjp.study';
const LANGS = ['vi', 'id'];
const LEVELS = ['n5', 'n4'];

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const escKeepEm = s => esc(s).replace(/&lt;em&gt;/g, '<em>').replace(/&lt;\/em&gt;/g, '</em>');
const stripTags = s => String(s ?? '').replace(/<[^>]*>/g, '');
const clip = (s, n) => { s = stripTags(s).replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n).replace(/\s+\S*$/, '') + '…' : s; };

// ---- 介面字串 ----
const STR = {
  vi: {
    htmlLang: 'vi', name: 'Tiếng Việt',
    nav: ['Mục lục ngữ pháp', 'Luyện tập miễn phí'],
    home: 'Trang chủ', idx: 'Ngữ pháp JLPT', lvName: LV => `Ngữ pháp ${LV}`,
    title: (t, LV) => `${t} | Ngữ pháp JLPT ${LV}: ý nghĩa, cách dùng, ví dụ`,
    desc: (t, LV, ex, n) => `Ngữ pháp JLPT ${LV}「${t}」: ${ex} Kèm cấu trúc, giải thích chi tiết và ${n} câu ví dụ dịch tiếng Việt. Luyện tập miễn phí.`,
    secP: 'Cấu trúc', secEx: 'Ý nghĩa', secEg: 'Câu ví dụ', secD: 'Giải thích chi tiết', secRel: c => `Ngữ pháp cùng nhóm (${c})`,
    ctaQ: 'Hiểu rồi, nhưng vào phòng thi có nhận ra không?',
    ctaP: LV => `Vào công cụ luyện tập và làm trắc nghiệm ngữ pháp ${LV}. Câu sai sẽ tự động vào lịch ôn tập SRS, ôn đến khi nhớ hẳn.`,
    ctaB: LV => `Luyện ngữ pháp ${LV} miễn phí →`,
    lvTitle: (LV, n) => `Danh sách ngữ pháp JLPT ${LV} (${n} mục) | Ý nghĩa, cấu trúc, ví dụ`,
    lvDesc: (LV, n) => `Toàn bộ ${n} mẫu ngữ pháp JLPT ${LV}: cấu trúc, ý nghĩa, giải thích chi tiết và câu ví dụ dịch tiếng Việt. Học và luyện tập miễn phí.`,
    lvH1: (LV, n) => `Ngữ pháp JLPT ${LV} (${n} mục)`,
    lvIntro: 'Mỗi mục đều có cấu trúc, ý nghĩa, giải thích chi tiết và câu ví dụ. Bấm vào để xem, hoặc vào công cụ luyện tập để làm bài.',
    ixTitle: n => `Ngữ pháp JLPT N5–N4 (${n} mục) | StayJP`,
    ixDesc: n => `${n} mẫu ngữ pháp JLPT N5 và N4 giải thích bằng tiếng Việt: cấu trúc, ý nghĩa, ví dụ. Miễn phí.`,
    ixH1: 'Ngữ pháp JLPT bằng tiếng Việt',
    ixIntro: n => `${n} mẫu ngữ pháp N5 và N4, mỗi mục đều có cấu trúc, ý nghĩa, giải thích chi tiết và câu ví dụ dịch tiếng Việt.`,
    items: n => `${n} mục`,
    foot: 'StayJP — Công cụ ôn thi JLPT N5–N1 miễn phí',
  },
  id: {
    htmlLang: 'id', name: 'Bahasa Indonesia',
    nav: ['Daftar tata bahasa', 'Latihan gratis'],
    home: 'Beranda', idx: 'Tata Bahasa JLPT', lvName: LV => `Tata Bahasa ${LV}`,
    title: (t, LV) => `${t} | Tata Bahasa JLPT ${LV}: arti, pola, contoh kalimat`,
    desc: (t, LV, ex, n) => `Tata bahasa JLPT ${LV}「${t}」: ${ex} Lengkap dengan pola, penjelasan rinci, dan ${n} contoh kalimat beserta terjemahan bahasa Indonesia. Latihan gratis.`,
    secP: 'Pola kalimat', secEx: 'Arti', secEg: 'Contoh kalimat', secD: 'Penjelasan lengkap', secRel: c => `Tata bahasa sejenis (${c})`,
    ctaQ: 'Sudah paham, tapi apakah bisa mengenalinya saat ujian?',
    ctaP: LV => `Kerjakan kuis tata bahasa ${LV} di alat latihan. Jawaban yang salah otomatis masuk jadwal pengulangan SRS sampai benar-benar hafal.`,
    ctaB: LV => `Latihan tata bahasa ${LV} gratis →`,
    lvTitle: (LV, n) => `Daftar Tata Bahasa JLPT ${LV} (${n} poin) | Arti, pola, contoh`,
    lvDesc: (LV, n) => `Semua ${n} poin tata bahasa JLPT ${LV}: pola, arti, penjelasan rinci, dan contoh kalimat dengan terjemahan bahasa Indonesia. Belajar dan latihan gratis.`,
    lvH1: (LV, n) => `Tata Bahasa JLPT ${LV} (${n} poin)`,
    lvIntro: 'Setiap poin dilengkapi pola, arti, penjelasan rinci, dan contoh kalimat. Klik untuk membaca, atau langsung kerjakan kuis di alat latihan.',
    ixTitle: n => `Tata Bahasa JLPT N5–N4 (${n} poin) | StayJP`,
    ixDesc: n => `${n} poin tata bahasa JLPT N5 dan N4 dijelaskan dalam bahasa Indonesia: pola, arti, contoh kalimat. Gratis.`,
    ixH1: 'Tata Bahasa JLPT dalam Bahasa Indonesia',
    ixIntro: n => `${n} poin tata bahasa N5 dan N4, masing-masing dengan pola, arti, penjelasan rinci, dan contoh kalimat berterjemahan bahasa Indonesia.`,
    items: n => `${n} poin`,
    foot: 'StayJP — Alat belajar JLPT N5–N1 gratis',
  },
};

// ---- 資料 ----
const evalWin = file => { const w = {}; new Function('window', readFileSync(join(ROOT, file), 'utf8'))(w); return w; };
const zh = {};
for (const lv of LEVELS) zh[lv] = new Function(`${readFileSync(join(ROOT, `grammar-${lv}.js`), 'utf8')}; return ${lv.toUpperCase()};`)();
const L = {};
for (const l of LANGS) {
  const g = evalWin(`content-${l}.js`).STAYJP_L10N[l].grammar;
  const d = {};
  for (const lv of LEVELS) Object.assign(d, evalWin(`grammar-detail-${l}-${lv}.js`).GRAMMAR_DETAIL_L10N[l]);
  const ui = (evalWin(`lang/${l}.js`).__L10N || {})[l]?.ui || {};
  L[l] = { g, d, ui };
}

// ---- 外框 ----
const CSS = `
:root{--bg:#FAF8F3;--bg2:#FFF;--bg3:#F2EEE5;--tx:#1C1C1E;--tx2:#6A6A6A;--tx3:#A9A9A9;--ac:#B8362A;--ac2:#2F5D7A;--bd:#E5DECF;--line:#DDD5C0;
--serif:"Hiragino Mincho ProN","Noto Serif JP","Yu Mincho","游明朝",serif}
[data-theme="dark"]{--bg:#121113;--bg2:#1B1A1C;--bg3:#1F1E20;--tx:#EDE8DE;--tx2:#8F8A7E;--tx3:#5D5A53;--ac:#E4715F;--ac2:#7FA5C2;--bd:#2C2A27;--line:#2C2A27}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Hiragino Sans","Noto Sans JP",system-ui,sans-serif;
background:var(--bg);color:var(--tx);line-height:1.8;font-size:16px;-webkit-font-smoothing:antialiased}
a{color:var(--ac2);text-decoration:none}a:hover{text-decoration:underline}
.hd{position:sticky;top:0;background:var(--bg);border-bottom:1px solid var(--line);z-index:10}
.hd-in{max-width:820px;margin:0 auto;display:flex;align-items:center;gap:16px;padding:12px 16px}
.hd-in h2{font-family:var(--serif);font-size:15px;font-weight:700}.hd-in h2 a{color:var(--tx)}
.hd-in nav{margin-left:auto;display:flex;gap:14px;font-size:13px}.hd-in nav a{color:var(--tx2)}
main{max-width:820px;margin:0 auto;padding:32px 16px 80px}
.langs{font-size:12.5px;color:var(--tx3);margin-bottom:14px;display:flex;gap:12px;flex-wrap:wrap}
.langs a{color:var(--tx2)}.langs b{color:var(--tx)}
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
.gd-body{padding:16px 18px;background:var(--bg3);border-radius:12px;font-size:15px;line-height:1.85}
.gd-body .gd-sec{margin-bottom:12px}.gd-body .gd-sec:last-child{margin-bottom:0}
.gd-body .gd-h{font-weight:700;color:var(--ac2);font-size:14px;margin:15px 0 5px;padding-left:9px;border-left:3px solid var(--ac2)}
.gd-body .gd-h:first-child{margin-top:0}
.gd-body .gd-ex-line{margin:3px 0}
.gd-body .gd-jp{font-family:var(--serif);color:var(--tx)}
.gd-body .gd-jp rt{font-size:.6em;color:var(--tx2);font-weight:400}
.gd-body .gd-tag{display:inline-block;font-size:13px;font-weight:700;padding:2px 9px;border-radius:20px;background:var(--ac2);color:#fff;margin:0 6px 4px 0}
.gd-body .gd-pair{display:inline-block;white-space:nowrap;margin-right:14px}
.gd-body .gd-warn{margin-top:12px;padding:11px 13px;border-left:3px solid var(--ac);background:rgba(184,54,42,.08);border-radius:0 8px 8px 0}
.cta{margin:40px 0;border:2px solid var(--ac);border-radius:14px;padding:22px 24px;background:var(--bg2)}
.cta p{font-size:15px;color:var(--tx2);margin-bottom:14px}.cta p strong{color:var(--tx)}
.cta a.btn{display:inline-block;background:var(--ac);color:#fff;font-weight:700;font-size:15px;padding:12px 26px;border-radius:999px}
.cta a.btn:hover{text-decoration:none;opacity:.9}
.rel{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media(max-width:600px){.rel{grid-template-columns:1fr}}
.rel a{border:1px solid var(--line);border-radius:10px;padding:10px 14px;font-size:14px;color:var(--tx);background:var(--bg2)}
.rel a:hover{border-color:var(--ac);text-decoration:none}
.pn{display:flex;justify-content:space-between;gap:12px;margin-top:36px;font-size:14px}
.list{list-style:none}
.list li{border-bottom:1px solid var(--line)}
.list a{display:flex;justify-content:space-between;gap:12px;padding:12px 4px;color:var(--tx);font-size:15px}
.list a:hover{color:var(--ac);text-decoration:none}
.list .hint{color:var(--tx3);font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:50%}
.cat-h{font-family:var(--serif);font-size:16px;color:var(--ac);margin:28px 0 4px}
.ft{border-top:1px solid var(--line);padding:28px 16px;font-size:12px;color:var(--tx3);text-align:center}
.ft a{color:var(--tx2);margin:0 8px}
`.trim();
const THEME_JS = `(function(){try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);else if(matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches)document.documentElement.setAttribute('data-theme','dark')}catch(e){}})();`;
const GA = `<script async src="https://www.googletagmanager.com/gtag/js?id=G-2WP4D34LE3"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-2WP4D34LE3');</script>`;
// 點「練習」時,若還沒選過介面語言,先記成這頁的語言(i18n.js 讀 ui_lang),進工具就是越/印文
const setLangJs = l => `try{if(!localStorage.getItem('ui_lang'))localStorage.setItem('ui_lang','${l}')}catch(e){}`;

// rel=alternate:path 是相對 grammar/ 的檔名(n5-1.html / n5.html)
const altHref = (lang, file) => lang === 'zh' ? `${SITE}/grammar/${file}` : `${SITE}/${lang}/grammar/${file}`;
const hreflangTags = file => [
  `<link rel="alternate" hreflang="zh-Hant" href="${altHref('zh', file)}">`,
  ...LANGS.map(l => `<link rel="alternate" hreflang="${l}" href="${altHref(l, file)}">`),
  `<link rel="alternate" hreflang="x-default" href="${altHref('zh', file)}">`,
].join('');

function langSwitch(cur, file) {
  const items = [['zh', '繁體中文'], ...LANGS.map(l => [l, STR[l].name])];
  return `<div class="langs">${items.map(([l, n]) => l === cur ? `<b>${n}</b>` : `<a href="${altHref(l, file)}" hreflang="${l === 'zh' ? 'zh-Hant' : l}">${n}</a>`).join('')}</div>`;
}

function shell(l, { title, desc, canonical, file, jsonld, body }) {
  const S = STR[l];
  return `<!DOCTYPE html>
<html lang="${S.htmlLang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
${file ? hreflangTags(file) : ''}
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="article">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="${l === 'vi' ? 'vi_VN' : 'id_ID'}">
<link rel="icon" href="../../stayjpplan.png" type="image/png">
${GA}
<script>${THEME_JS}</script>
${jsonld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ''}
<style>${CSS}</style>
</head>
<body>
<header class="hd"><div class="hd-in">
  <h2><a href="index.html">StayJP</a></h2>
  <nav><a href="index.html">${S.nav[0]}</a><a href="../../index.html" onclick="${setLangJs(l)}">${S.nav[1]}</a></nav>
</div></header>
<main>
${body}
</main>
<footer class="ft">© 2026 ${esc(S.foot)}</footer>
</body>
</html>`;
}

const cta = (l, LV) => `
<div class="cta">
  <p><strong>${esc(STR[l].ctaQ)}</strong><br>${esc(STR[l].ctaP(LV))}</p>
  <a class="btn" href="../../index.html" onclick="${setLangJs(l)}">${esc(STR[l].ctaB(LV))}</a>
</div>`;

const catName = (l, c) => L[l].ui[c] || c;
const today = new Date().toISOString().slice(0, 10);
const urls = [];
let pages = 0;

for (const l of LANGS) {
  const S = STR[l], OUT = join(ROOT, l, 'grammar');
  mkdirSync(OUT, { recursive: true });
  let total = 0;
  for (const lv of LEVELS) {
    const LV = lv.toUpperCase(), items = zh[lv];
    total += items.length;
    items.forEach((it, i) => {
      const tr = L[l].g[it.id], detail = L[l].d[it.id];
      const t = tr.t, prev = items[i - 1], next = items[i + 1];
      const related = items.filter(o => o.cat === it.cat && o.id !== it.id).slice(0, 6);
      const file = `${it.id}.html`, canonical = `${SITE}/${l}/grammar/${file}`;
      const title = S.title(t, LV);
      const desc = S.desc(t, LV, clip(tr.ex, 90), it.eg.length);
      const jsonld = { '@context': 'https://schema.org', '@type': 'Article', headline: `${t} — JLPT ${LV}`, description: desc, inLanguage: l,
        author: { '@type': 'Organization', name: 'StayJP', url: SITE }, mainEntityOfPage: canonical };
      const body = `
${langSwitch(l, file)}
<div class="crumb"><a href="index.html">${esc(S.idx)}</a> › <a href="${lv}.html">${esc(S.lvName(LV))}</a> › ${esc(t)}</div>
<h1>${esc(t)}</h1>
<div class="meta"><span class="tag lv">JLPT ${LV}</span><span class="tag">${esc(catName(l, it.cat))}</span></div>

<h2 class="sec">${esc(S.secP)}</h2>
<div class="pattern">${esc(tr.p || it.p)}</div>

<h2 class="sec">${esc(S.secEx)}</h2>
<p class="expl">${esc(stripTags(tr.ex))}</p>

<h2 class="sec">${esc(S.secEg)}</h2>
${it.eg.map((e, k) => `<div class="eg"><div class="j" lang="ja">${escKeepEm(e.j)}</div><div class="z">${esc(tr.eg[k])}</div></div>`).join('\n')}

<h2 class="sec">${esc(S.secD)}</h2>
<div class="gd-body">${detail}</div>

${cta(l, LV)}

${related.length ? `<h2 class="sec">${esc(S.secRel(catName(l, it.cat)))}</h2>
<div class="rel">${related.map(r => `<a href="${r.id}.html">${esc(L[l].g[r.id].t)}</a>`).join('')}</div>` : ''}

<div class="pn">
  <span>${prev ? `← <a href="${prev.id}.html">${esc(L[l].g[prev.id].t)}</a>` : ''}</span>
  <span>${next ? `<a href="${next.id}.html">${esc(L[l].g[next.id].t)}</a> →` : ''}</span>
</div>`;
      writeFileSync(join(OUT, file), shell(l, { title, desc, canonical, file, jsonld, body }));
      urls.push(canonical); pages++;
    });

    // 級別索引
    const cats = [...new Set(items.map(o => o.cat))];
    const file = `${lv}.html`, canonical = `${SITE}/${l}/grammar/${file}`;
    writeFileSync(join(OUT, file), shell(l, {
      title: S.lvTitle(LV, items.length), desc: S.lvDesc(LV, items.length), canonical, file,
      body: `
${langSwitch(l, file)}
<div class="crumb"><a href="index.html">${esc(S.idx)}</a> › ${esc(S.lvName(LV))}</div>
<h1>${esc(S.lvH1(LV, items.length))}</h1>
<p style="color:var(--tx2);margin-bottom:8px">${esc(S.lvIntro)}</p>
${cats.map(c => `<div class="cat-h">${esc(catName(l, c))}</div>
<ul class="list">${items.filter(o => o.cat === c).map(o =>
  `<li><a href="${o.id}.html"><span>${esc(L[l].g[o.id].t)}</span><span class="hint">${esc(clip(L[l].g[o.id].ex, 40))}</span></a></li>`).join('\n')}</ul>`).join('\n')}
${cta(l, LV)}`,
    }));
    urls.push(canonical);
  }

  // 總索引(只含 N5/N4,跟中文總索引 N5–N1 不對等 → 不標 hreflang)
  const canonical = `${SITE}/${l}/grammar/`;
  writeFileSync(join(OUT, 'index.html'), shell(l, {
    title: S.ixTitle(total), desc: S.ixDesc(total), canonical,
    body: `
<div class="crumb">${esc(S.idx)}</div>
<h1>${esc(S.ixH1)}</h1>
<p style="color:var(--tx2);margin-bottom:24px">${esc(S.ixIntro(total))}</p>
<ul class="list">
${LEVELS.map(lv => `<li><a href="${lv}.html"><span>${esc(S.lvName(lv.toUpperCase()))}</span><span class="hint">${esc(S.items(zh[lv].length))}</span></a></li>`).join('\n')}
</ul>
${cta(l, 'N5')}`,
  }));
  urls.push(canonical);
}

// ---- 中文頁補 hreflang(冪等:先拿掉舊的再插)----
let patched = 0;
const files = [...LEVELS.flatMap(lv => zh[lv].map(it => `${it.id}.html`)), ...LEVELS.map(lv => `${lv}.html`)];
for (const file of files) {
  const p = join(ROOT, 'grammar', file);
  let s = readFileSync(p, 'utf8');
  const before = s;
  s = s.replace(/<link rel="alternate" hreflang="[^"]*" href="[^"]*">/g, '').replace(/\n(?=\n<meta property="og:title")/, '');
  const m = s.match(/<link rel="canonical" href="[^"]*">\n/);
  if (!m) { console.warn('  找不到 canonical,跳過', file); continue; }
  s = s.replace(m[0], m[0] + hreflangTags(file) + '\n');
  if (s !== before) { writeFileSync(p, s); patched++; }
}

// ---- sitemap ----
writeFileSync(join(ROOT, 'sitemap-grammar-l10n.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`).join('\n')}
</urlset>
`);

console.log(`✓ ${LANGS.join('/')} 文法頁 ${pages} 頁 + 級別/總索引;sitemap-grammar-l10n.xml ${urls.length} 個 URL`);
console.log(`✓ 中文頁補 hreflang:${patched} 個檔案`);
