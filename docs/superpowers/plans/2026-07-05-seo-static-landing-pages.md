# SEO 静态落地页 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 从现有文法/单字 JS 数据生成可被搜索引擎索引的双语静态 HTML 页面，抢 JLPT 长尾自然流量并导向 app/订阅，零影响现有站。

**Architecture:** 一个本地 CLI 生成器 `scripts/build-seo.mjs` 复用 `publish-content-sharded.mjs` 的 `evalJs` 手法抽数据，调用一组纯函数模块（罗马音/slug/模板/sitemap）渲染 HTML，只写新目录 `/g /v /en` 和追加 `sitemap.xml`。纯函数用 `node:test` 单测，生成器做端到端冒烟。

**Tech Stack:** Node 22（内建 `node:test`/`node:assert`、ESM）、无第三方依赖。GitHub Pages（`.nojekyll`，服务 main 分支）。

## Global Constraints

- 只写新目录 `g/`、`v/`、`en/`；只读数据文件；唯一可修改的现有文件是 `sitemap.xml`（追加）。**绝不碰** home.html / index.html / SPA / functions / 后端。
- 域名固定 `https://stayjp.study`。级别集合 `['n5','n4','n3','n2','n1']`。
- 每个 URL 落地为该目录下 `index.html`（依赖 `.nojekyll` 直接伺服）。
- 生成器**幂等**：同输入输出字节一致（对象遍历按 key 稳定顺序、数组保持原序），DRY_RUN=1 只算不写。
- 所有降级/冲突/未映射必须 `console.log` 统计，不静默截断。
- ESM 模块（`.mjs`），Node 内建模块用 `node:` 前缀。
- slug 只含 `[a-z0-9-]`；转换失败 fallback 到 grammar id（如 `n5-1`）。

---

## 文件结构

- Create: `scripts/seo/romaji.mjs` — 纯函数 `kanaToRomaji(kana)`：假名串→Hepburn 罗马音
- Create: `scripts/seo/slug.mjs` — 纯函数 `titleToSlug(title, readings)` + `resolveSlugs(entries, readings)`：文法标题→唯一 slug 映射
- Create: `scripts/seo/templates.mjs` — 纯函数 `renderGrammarPage`、`renderVocabPage`、`renderHub`、`layout`
- Create: `scripts/seo/sitemap.mjs` — 纯函数 `buildSitemap(urls)`
- Create: `scripts/seo/data.mjs` — `loadData()`：复用 evalJs 抽 zh/en 文法与单字
- Create: `scripts/build-seo.mjs` — CLI 编排：装数据→建 slug→渲染→写文件→重写 sitemap→打统计
- Create: `scripts/seo/romaji.test.mjs`、`slug.test.mjs`、`templates.test.mjs`、`sitemap.test.mjs`
- Modify: `sitemap.xml`（由生成器重写，非手改）

运行测试：`node --test scripts/seo/`

---

## Phase 1 — 核心 + 文法逐条页

### Task 1: kana→罗马音纯函数

**Files:**
- Create: `scripts/seo/romaji.mjs`
- Test: `scripts/seo/romaji.test.mjs`

**Interfaces:**
- Produces: `export function kanaToRomaji(kana: string): string` — 输入平/片假名串，返回小写 Hepburn 罗马音；非假名字符原样保留（供上层判断残留）。

- [ ] **Step 1: 写失败测试**

```js
// scripts/seo/romaji.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kanaToRomaji } from './romaji.mjs';

test('basic gojuon', () => {
  assert.equal(kanaToRomaji('です'), 'desu');
  assert.equal(kanaToRomaji('ます'), 'masu');
});
test('youon combos', () => {
  assert.equal(kanaToRomaji('きゃ'), 'kya');
  assert.equal(kanaToRomaji('しゅう'), 'shuu');
});
test('sokuon doubles next consonant', () => {
  assert.equal(kanaToRomaji('がっこう'), 'gakkou');
});
test('katakana + choonpu', () => {
  assert.equal(kanaToRomaji('テーブル'), 'teeburu');
});
test('non-kana kept as-is', () => {
  assert.equal(kanaToRomaji('対して'), '対shite');
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `node --test scripts/seo/romaji.test.mjs`
Expected: FAIL（`Cannot find module './romaji.mjs'`）

- [ ] **Step 3: 实现**

```js
// scripts/seo/romaji.mjs
// Hepburn 罗马音。仅覆盖静态内容出现的假名;非假名原样返回供上层降级判断。
const BASE = {
  あ:'a',い:'i',う:'u',え:'e',お:'o',
  か:'ka',き:'ki',く:'ku',け:'ke',こ:'ko',が:'ga',ぎ:'gi',ぐ:'gu',げ:'ge',ご:'go',
  さ:'sa',し:'shi',す:'su',せ:'se',そ:'so',ざ:'za',じ:'ji',ず:'zu',ぜ:'ze',ぞ:'zo',
  た:'ta',ち:'chi',つ:'tsu',て:'te',と:'to',だ:'da',ぢ:'ji',づ:'zu',で:'de',ど:'do',
  な:'na',に:'ni',ぬ:'nu',ね:'ne',の:'no',
  は:'ha',ひ:'hi',ふ:'fu',へ:'he',ほ:'ho',ば:'ba',び:'bi',ぶ:'bu',べ:'be',ぼ:'bo',ぱ:'pa',ぴ:'pi',ぷ:'pu',ぺ:'pe',ぽ:'po',
  ま:'ma',み:'mi',む:'mu',め:'me',も:'mo',
  や:'ya',ゆ:'yu',よ:'yo',
  ら:'ra',り:'ri',る:'ru',れ:'re',ろ:'ro',
  わ:'wa',を:'o',ん:'n',
};
const YOUON = {
  きゃ:'kya',きゅ:'kyu',きょ:'kyo',ぎゃ:'gya',ぎゅ:'gyu',ぎょ:'gyo',
  しゃ:'sha',しゅ:'shu',しょ:'sho',じゃ:'ja',じゅ:'ju',じょ:'jo',
  ちゃ:'cha',ちゅ:'chu',ちょ:'cho',にゃ:'nya',にゅ:'nyu',にょ:'nyo',
  ひゃ:'hya',ひゅ:'hyu',ひょ:'hyo',びゃ:'bya',びゅ:'byu',びょ:'byo',ぴゃ:'pya',ぴゅ:'pyu',ぴょ:'pyo',
  みゃ:'mya',みゅ:'myu',みょ:'myo',りゃ:'rya',りゅ:'ryu',りょ:'ryo',
};
// 片假名→平假名(统一处理);範囲 ァ..ン
function kataToHira(s) {
  return s.replace(/[ァ-ヶ]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60));
}
export function kanaToRomaji(input) {
  const s = kataToHira(input);
  let out = '';
  let i = 0;
  while (i < s.length) {
    const two = s.slice(i, i + 2);
    if (YOUON[two]) { out += YOUON[two]; i += 2; continue; }
    const ch = s[i];
    if (ch === 'っ') { // 促音:重复下个罗马音首字母
      const nextTwo = s.slice(i + 1, i + 3);
      const nextRomaji = YOUON[nextTwo] || BASE[s[i + 1]] || '';
      if (nextRomaji) out += nextRomaji[0];
      i += 1; continue;
    }
    if (ch === 'ー') { // 长音:重复前一个元音
      const last = out[out.length - 1];
      if ('aiueo'.includes(last)) out += last;
      i += 1; continue;
    }
    if (BASE[ch]) { out += BASE[ch]; i += 1; continue; }
    out += ch; // 非假名(汉字/符号)原样保留
    i += 1;
  }
  return out;
}
```

- [ ] **Step 4: 跑测试确认通过**

Run: `node --test scripts/seo/romaji.test.mjs`
Expected: PASS（5 tests）

- [ ] **Step 5: Commit**

```bash
git add scripts/seo/romaji.mjs scripts/seo/romaji.test.mjs
git commit -m "feat(seo): kana→罗马音纯函数"
```

---

### Task 2: 文法标题→唯一 slug

**Files:**
- Create: `scripts/seo/slug.mjs`
- Test: `scripts/seo/slug.test.mjs`

**Interfaces:**
- Consumes: `kanaToRomaji` from `./romaji.mjs`
- Produces:
  - `export function titleToSlug(title: string, readings: Record<string,string>): string|null` — 单个标题→slug；无法完全转成 `[a-z0-9-]` 时返回 `null`（上层 fallback 到 id）。
  - `export function resolveSlugs(entries: {id:string,t:string}[], readings): Map<string,string>` — 返回 id→唯一 slug；null 用 id 兜底；同级冲突追加 `-2`、`-3`…

- [ ] **Step 1: 写失败测试**

```js
// scripts/seo/slug.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { titleToSlug, resolveSlugs } from './slug.mjs';

const R = { '対':'たい' };

test('strips decoration, kana → slug', () => {
  assert.equal(titleToSlug('～てしまう', {}), 'teshimau');
  assert.equal(titleToSlug('～です・～じゃありません（名詞）', {}), null); // 名詞 无读音→残留汉字→null
});
test('kanji resolved via readings map', () => {
  assert.equal(titleToSlug('～に対して', R), 'nitaishite');
});
test('resolveSlugs falls back to id and dedupes', () => {
  const m = resolveSlugs([
    { id:'n5-1', t:'～ます' },
    { id:'n5-2', t:'～ます' },       // 冲突→ masu / masu-2
    { id:'n5-3', t:'（未知漢字）' },  // null→ fallback id
  ], {});
  assert.equal(m.get('n5-1'), 'masu');
  assert.equal(m.get('n5-2'), 'masu-2');
  assert.equal(m.get('n5-3'), 'n5-3');
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `node --test scripts/seo/slug.test.mjs`
Expected: FAIL（模块不存在）

- [ ] **Step 3: 实现**

```js
// scripts/seo/slug.mjs
import { kanaToRomaji } from './romaji.mjs';

const DECORATION = /[～〜・（）()｛｝【】「」、。･\s　]/g;

// 贪婪最长匹配把标题里的汉字词换成假名读音,再整体转罗马音。
function toKana(title, readings) {
  const keys = Object.keys(readings).sort((a, b) => b.length - a.length); // 长优先
  let s = title.replace(DECORATION, '');
  let i = 0, out = '';
  outer: while (i < s.length) {
    for (const k of keys) {
      if (k && s.startsWith(k, i)) { out += readings[k]; i += k.length; continue outer; }
    }
    out += s[i]; i += 1;
  }
  return out;
}

export function titleToSlug(title, readings) {
  const kana = toKana(title, readings);
  const romaji = kanaToRomaji(kana).toLowerCase();
  const slug = romaji.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (!slug) return null;
  // 若仍含非 ascii 残留(说明有未覆盖汉字),视为失败
  if (/[^\x00-\x7f]/.test(kanaToRomaji(kana))) return null;
  return slug;
}

export function resolveSlugs(entries, readings) {
  const map = new Map();
  const seen = new Map(); // slug → count
  for (const e of entries) {
    let base = titleToSlug(e.t, readings) || e.id;
    const n = (seen.get(base) || 0) + 1;
    seen.set(base, n);
    map.set(e.id, n === 1 ? base : `${base}-${n}`);
  }
  return map;
}
```

- [ ] **Step 4: 跑测试确认通过**

Run: `node --test scripts/seo/slug.test.mjs`
Expected: PASS（3 tests）

- [ ] **Step 5: Commit**

```bash
git add scripts/seo/slug.mjs scripts/seo/slug.test.mjs
git commit -m "feat(seo): 文法标题→唯一罗马音 slug(汉字读音解析+冲突去重)"
```

---

### Task 3: 数据装载

**Files:**
- Create: `scripts/seo/data.mjs`

**Interfaces:**
- Produces: `export function loadData(): { grammar, vocab, readings }`
  - `grammar[level] = { zh: {id→entry}, en: {id→entry} }`，entry = `{id, t, cat, ex, eg, p}`（id = `${level}-${index+1}`，index 为对象键顺序）
  - `vocab[level] = { zh: [{w,r,m,c}], en: [...] }`
  - `readings = { 汉字: 假名 }`

- [ ] **Step 1: 实现（无独立单测，Task 6 冒烟覆盖）**

```js
// scripts/seo/data.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
export const LEVELS = ['n5', 'n4', 'n3', 'n2', 'n1'];

function evalJs(src, name) {
  const fn = new Function(src + `; return typeof ${name} !== 'undefined' ? ${name} : null;`);
  return fn();
}
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

// 文法对象→带 id 的数组;id 用键顺序(1-based),与页面/ sitemap 一致
function indexGrammar(obj, level) {
  const out = {};
  Object.keys(obj).forEach((k, i) => {
    const v = obj[k];
    const id = `${level}-${i + 1}`;
    out[id] = { id, t: v.t, cat: v.cat, ex: v.ex, eg: v.eg || [], p: v.p };
  });
  return out;
}

export function loadData() {
  const grammar = {}, vocab = {};
  for (const lv of LEVELS) {
    const U = lv.toUpperCase();
    const gzh = evalJs(read(`grammar-${lv}.js`), U);
    const gen = evalJs(read(`grammar-${lv}-en.js`), `${U}_EN`);
    if (!gzh) throw new Error(`grammar-${lv} zh 抽取失败`);
    grammar[lv] = { zh: indexGrammar(gzh, lv), en: gen ? indexGrammar(gen, lv) : {} };
    const vzh = evalJs(read(`vocab-${lv}.js`), `VOCAB_${U}`);
    let ven = null;
    try { ven = evalJs(read(`vocab-${lv}-en.js`), `VOCAB_${U}_EN`); } catch { ven = null; }
    if (!vzh) throw new Error(`vocab-${lv} zh 抽取失败`);
    vocab[lv] = { zh: vzh, en: ven || [] };
  }
  // 读音表挂在 window.*;剥离 window. 前缀后 eval
  const rsrc = read('grammar-kanji-readings.js').replace(/window\.\w+\s*=/, 'var __R =');
  const readings = new Function(rsrc + '; return typeof __R !== "undefined" ? __R : {};')();
  return { grammar, vocab, readings, LEVELS };
}
```

- [ ] **Step 2: 手动冒烟验证抽取正确**

Run:
```bash
node -e "import('./scripts/seo/data.mjs').then(m=>{const d=m.loadData(); console.log('n5 文法条数', Object.keys(d.grammar.n5.zh).length); console.log('n5 单字条数', d.vocab.n5.zh.length); console.log('读音键数', Object.keys(d.readings).length); console.log('样本', JSON.stringify(Object.values(d.grammar.n5.zh)[0]));})"
```
Expected: n5 文法条数 68、n5 单字条数 725、读音键数 >0、样本含 `t/cat/ex/eg/p`

- [ ] **Step 3: Commit**

```bash
git add scripts/seo/data.mjs
git commit -m "feat(seo): 数据装载(复用 evalJs 抽 zh/en 文法单字+读音表)"
```

---

### Task 4: sitemap 构建纯函数

**Files:**
- Create: `scripts/seo/sitemap.mjs`
- Test: `scripts/seo/sitemap.test.mjs`

**Interfaces:**
- Produces: `export function buildSitemap(urls: {loc:string, priority?:string}[]): string` — 返回完整 sitemap.xml 字符串（含 XML 声明），loc 按传入顺序。

- [ ] **Step 1: 写失败测试**

```js
// scripts/seo/sitemap.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSitemap } from './sitemap.mjs';

test('wraps urls in urlset', () => {
  const xml = buildSitemap([{ loc: 'https://stayjp.study/g/n5/masu/', priority: '0.7' }]);
  assert.match(xml, /^<\?xml/);
  assert.match(xml, /<loc>https:\/\/stayjp\.study\/g\/n5\/masu\/<\/loc>/);
  assert.match(xml, /<priority>0\.7<\/priority>/);
  assert.match(xml, /<\/urlset>\s*$/);
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `node --test scripts/seo/sitemap.test.mjs`
Expected: FAIL

- [ ] **Step 3: 实现**

```js
// scripts/seo/sitemap.mjs
export function buildSitemap(urls) {
  const body = urls.map(u =>
    `  <url>\n    <loc>${u.loc}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>${u.priority || '0.6'}</priority>\n  </url>`
  ).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}
```

- [ ] **Step 4: 跑测试确认通过**

Run: `node --test scripts/seo/sitemap.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add scripts/seo/sitemap.mjs scripts/seo/sitemap.test.mjs
git commit -m "feat(seo): sitemap 构建纯函数"
```

---

### Task 5: 页面模板（layout + 文法页 + hub）

**Files:**
- Create: `scripts/seo/templates.mjs`
- Test: `scripts/seo/templates.test.mjs`

**Interfaces:**
- Produces:
  - `export function esc(s): string` — HTML 转义
  - `export function layout({lang, title, desc, canonical, alternates, jsonld, body}): string`
  - `export function renderGrammarPage({entry, level, lang, canonical, alternates, related, appUrl}): string`
  - `export function renderHub({level, lang, items, canonical, kind}): string`（kind: 'grammar'|'vocab'）

- [ ] **Step 1: 写失败测试**

```js
// scripts/seo/templates.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { esc, renderGrammarPage } from './templates.mjs';

test('esc escapes html', () => {
  assert.equal(esc('<a>&"'), '&lt;a&gt;&amp;&quot;');
});
test('grammar page has title h1 jsonld hreflang cta', () => {
  const html = renderGrammarPage({
    entry: { id:'n5-1', t:'～てしまう', cat:'助詞', ex:'表示完成或遺憾', eg:['食べてしまった'], p:'V-て＋しまう' },
    level: 'n5', lang: 'zh-Hant',
    canonical: 'https://stayjp.study/g/n5/teshimau/',
    alternates: [{ lang:'en', href:'https://stayjp.study/en/g/n5/teshimau/' }],
    related: [{ t:'～ておく', href:'/g/n5/teoku/' }],
    appUrl: 'https://stayjp.study/#n5',
  });
  assert.match(html, /<h1[^>]*>～てしまう<\/h1>/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /hreflang="en"/);
  assert.match(html, /表示完成或遺憾/);
  assert.match(html, /免費/); // CTA 文案
  assert.match(html, /rel="canonical"/);
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `node --test scripts/seo/templates.test.mjs`
Expected: FAIL

- [ ] **Step 3: 实现**

```js
// scripts/seo/templates.mjs
export function esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
const CSS = `:root{--bg:#FAF9F6;--tx:#2C2C2C;--mut:#6b6b6b;--ac:#7a8b6f;--card:#fff;--bd:#e7e4dd}
*{box-sizing:border-box}body{margin:0;font-family:-apple-system,"Noto Sans TC","Hiragino Sans",sans-serif;background:var(--bg);color:var(--tx);line-height:1.75}
.wrap{max-width:720px;margin:0 auto;padding:24px 18px 64px}
nav.bc{font-size:13px;color:var(--mut);margin-bottom:12px}nav.bc a{color:var(--mut)}
h1{font-size:26px;margin:.2em 0 .1em}.cat{color:var(--mut);font-size:14px;margin-bottom:20px}
section{background:var(--card);border:1px solid var(--bd);border-radius:12px;padding:16px 18px;margin:14px 0}
section h2{font-size:15px;color:var(--ac);margin:0 0 8px}
.eg li{margin:6px 0}.eg .t{color:var(--mut);font-size:14px}
.cta{display:block;text-align:center;background:var(--ac);color:#fff;text-decoration:none;padding:14px;border-radius:12px;font-weight:600;margin:22px 0 8px}
.sub{text-align:center;color:var(--mut);font-size:13px}
.rel a,.idx a{display:inline-block;margin:4px 8px 4px 0;color:var(--ac);text-decoration:none}
.lang{font-size:13px;margin-top:24px;color:var(--mut)}`;

export function layout({ lang, title, desc, canonical, alternates = [], jsonld, body }) {
  const alt = alternates.map(a => `<link rel="alternate" hreflang="${a.lang}" href="${a.href}">`).join('\n');
  const xdef = alternates.length ? `<link rel="alternate" hreflang="x-default" href="${canonical}">` : '';
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
${alt}
${xdef}
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="article">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="https://stayjp.study/staybanner.jpg">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
<style>${CSS}</style>
</head>
<body><div class="wrap">${body}</div></body>
</html>
`;
}

const LV = l => l.toUpperCase();
const CTA_ZH = '▶ 免費線上練習這個文法';
const CTA_EN = '▶ Practice this grammar free online';
const SUB_ZH = '不用下載・打開就能用｜升級解鎖模考與 SRS 複習';
const SUB_EN = 'No download needed · Upgrade to unlock mock exams & SRS review';

export function renderGrammarPage({ entry, level, lang, canonical, alternates, related = [], appUrl }) {
  const isEn = lang.startsWith('en');
  const title = isEn
    ? `${entry.t} | JLPT ${LV(level)} Grammar - StayJP`
    : `${entry.t}｜JLPT ${LV(level)} 文法解說 - 日本再留計劃`;
  const desc = String(entry.ex || '').slice(0, 120);
  const jsonld = {
    '@context': 'https://schema.org', '@type': 'LearningResource',
    name: entry.t, educationalLevel: `JLPT ${LV(level)}`,
    inLanguage: lang, description: desc, learningResourceType: 'Grammar explanation',
    isAccessibleForFree: true, url: canonical,
  };
  const egItems = (entry.eg || []).map(e => `<li>${esc(e)}</li>`).join('');
  const relLinks = related.map(r => `<a href="${r.href}">${esc(r.t)}</a>`).join('');
  const L = {
    home: isEn ? 'Home' : '首頁', gram: isEn ? 'Grammar' : '文法',
    mean: isEn ? 'Meaning' : '意思・解說', pat: isEn ? 'Pattern' : '句型・接續',
    egt: isEn ? 'Examples' : '例句', rel: isEn ? 'Related grammar' : '相關文法',
  };
  const body = `
<nav class="bc"><a href="${isEn ? '/en/' : '/'}">${L.home}</a> › <a href="${isEn ? `/en/g/${level}/` : `/g/${level}/`}">${LV(level)} ${L.gram}</a> › ${esc(entry.t)}</nav>
<h1>${esc(entry.t)}</h1>
<div class="cat">JLPT ${LV(level)}・${esc(entry.cat || '')}</div>
<section><h2>${L.mean}</h2><p>${esc(entry.ex)}</p></section>
${entry.p ? `<section><h2>${L.pat}</h2><p>${esc(entry.p)}</p></section>` : ''}
${egItems ? `<section><h2>${L.egt}</h2><ul class="eg">${egItems}</ul></section>` : ''}
<a class="cta" href="${appUrl}">${isEn ? CTA_EN : CTA_ZH}</a>
<p class="sub">${isEn ? SUB_EN : SUB_ZH}</p>
${relLinks ? `<section class="rel"><h2>${L.rel}</h2>${relLinks}</section>` : ''}
<p class="lang">${alternates.map(a => `<a href="${a.href}">${a.lang === 'en' ? 'English' : '中文'}</a>`).join(' ｜ ')}</p>`;
  return layout({ lang, title, desc, canonical, alternates, jsonld, body });
}

export function renderHub({ level, lang, items, canonical, kind }) {
  const isEn = lang.startsWith('en');
  const noun = kind === 'grammar' ? (isEn ? 'Grammar' : '文法') : (isEn ? 'Vocabulary' : '單字');
  const title = isEn ? `JLPT ${LV(level)} ${noun} List - StayJP` : `JLPT ${LV(level)} ${noun}總整理 - 日本再留計劃`;
  const desc = isEn ? `All JLPT ${LV(level)} ${noun.toLowerCase()} points.` : `JLPT ${LV(level)} ${noun}完整列表。`;
  const jsonld = { '@context':'https://schema.org','@type':'ItemList', name:title, numberOfItems: items.length };
  const links = items.map(it => `<a href="${it.href}">${esc(it.t)}</a>`).join('');
  const body = `<nav class="bc"><a href="${isEn ? '/en/' : '/'}">${isEn ? 'Home' : '首頁'}</a> › ${LV(level)} ${noun}</nav>
<h1>JLPT ${LV(level)} ${noun}</h1><section class="idx">${links}</section>`;
  return layout({ lang, title, desc, canonical, jsonld, body });
}
```

- [ ] **Step 4: 跑测试确认通过**

Run: `node --test scripts/seo/templates.test.mjs`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add scripts/seo/templates.mjs scripts/seo/templates.test.mjs
git commit -m "feat(seo): 页面模板(layout/文法页/hub,含 jsonld/hreflang/CTA)"
```

---

### Task 6: 生成器编排（Phase 1：文法页 + hub + sitemap）

**Files:**
- Create: `scripts/build-seo.mjs`
- Modify: `sitemap.xml`（生成器写）

**Interfaces:**
- Consumes: `loadData`、`resolveSlugs`、`renderGrammarPage`、`renderHub`、`buildSitemap`
- 行为：`node scripts/build-seo.mjs [--dry]` 生成文法页与 hub 到 `/g /en/g`，重写 `sitemap.xml`，打统计。

- [ ] **Step 1: 实现**

```js
// scripts/build-seo.mjs
import fs from 'node:fs';
import path from 'node:path';
import { loadData, LEVELS } from './seo/data.mjs';
import { resolveSlugs } from './seo/slug.mjs';
import { renderGrammarPage, renderHub } from './seo/templates.mjs';
import { buildSitemap } from './seo/sitemap.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const DRY = process.argv.includes('--dry') || process.env.DRY_RUN;
const ORIGIN = 'https://stayjp.study';
const stats = { pages: 0, fallback: 0, collisions: 0 };

function write(rel, html) {
  stats.pages++;
  if (DRY) return;
  const abs = path.join(ROOT, rel, 'index.html');
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, html);
}

const { grammar, readings } = loadData();
const urls = [];
// 现有静态页保留在 sitemap 顶部
const STATIC = [['/','1.0'],['/home.html','0.9'],['/pricing.html','0.8'],['/verbs.html','0.7'],
  ['/contact.html','0.3'],['/terms.html','0.2'],['/privacy.html','0.2'],['/refund.html','0.2']];
for (const [loc, priority] of STATIC) urls.push({ loc: ORIGIN + loc, priority });

for (const lv of LEVELS) {
  const zh = Object.values(grammar[lv].zh);
  const en = grammar[lv].en;
  const slugs = resolveSlugs(zh, readings); // id→slug,zh/en 共用同 slug
  for (const [id, slug] of slugs) if (slug === id) stats.fallback++;
  const seen = new Set(slugs.values()); stats.collisions += zh.length - seen.size;

  const byCat = {};
  for (const e of zh) (byCat[e.cat] ||= []).push(e);

  for (const entry of zh) {
    const slug = slugs.get(entry.id);
    const zhUrl = `${ORIGIN}/g/${lv}/${slug}/`;
    const enUrl = `${ORIGIN}/en/g/${lv}/${slug}/`;
    const alts = [{ lang:'zh-Hant', href:zhUrl }, { lang:'en', href:enUrl }];
    const related = (byCat[entry.cat] || []).filter(x => x.id !== entry.id).slice(0, 6)
      .map(x => ({ t:x.t, href:`/g/${lv}/${slugs.get(x.id)}/` }));
    write(`g/${lv}/${slug}`, renderGrammarPage({
      entry, level: lv, lang:'zh-Hant', canonical: zhUrl, alternates: alts, related, appUrl: `${ORIGIN}/#${lv}` }));
    urls.push({ loc: zhUrl, priority: '0.7' });
    const enEntry = en[entry.id];
    if (enEntry) {
      const relEn = related.map(r => ({ t:r.t, href:`/en/g/${lv}/${r.href.split('/').filter(Boolean).pop()}/` }));
      write(`en/g/${lv}/${slug}`, renderGrammarPage({
        entry: enEntry, level: lv, lang:'en', canonical: enUrl,
        alternates:[{lang:'zh-Hant',href:zhUrl},{lang:'en',href:enUrl}], related: relEn, appUrl: `${ORIGIN}/en/#${lv}` }));
      urls.push({ loc: enUrl, priority: '0.6' });
    }
  }
  // hub
  const hubItems = zh.map(e => ({ t:e.t, href:`/g/${lv}/${slugs.get(e.id)}/` }));
  write(`g/${lv}`, renderHub({ level:lv, lang:'zh-Hant', items:hubItems, canonical:`${ORIGIN}/g/${lv}/`, kind:'grammar' }));
  urls.push({ loc:`${ORIGIN}/g/${lv}/`, priority:'0.6' });
}

if (!DRY) fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), buildSitemap(urls));
console.log(`[build-seo] pages=${stats.pages} fallback(id-slug)=${stats.fallback} collisions=${stats.collisions} sitemap-urls=${urls.length}${DRY ? ' (DRY)' : ''}`);
```

- [ ] **Step 2: DRY 跑一遍看统计**

Run: `node scripts/build-seo.mjs --dry`
Expected: 打印 `pages=` 约 (382 zh + 382 en + 5 hub) ≈ **769**、`fallback` 与 `collisions` 为小数字（记下来）、无异常

- [ ] **Step 3: 实跑生成**

Run: `node scripts/build-seo.mjs`
Expected: 同上 pages 数；`git status` 显示新增 `g/`、`en/g/`，`sitemap.xml` 被修改

- [ ] **Step 4: 本地起服务器 + 目视验证**

Run:
```bash
python3 -m http.server 8080 --bind 127.0.0.1 &
curl -s -o /dev/null -w "grammar zh → %{http_code}\n" "http://127.0.0.1:8080/g/n5/$(ls g/n5 | grep -v '^index' | head -1)/"
curl -s -o /dev/null -w "hub zh → %{http_code}\n" http://127.0.0.1:8080/g/n5/
```
Expected: 两者 HTTP 200。用 agent-browser 截图抽样文法页 + hub 给用户看。

- [ ] **Step 5: 验证只碰允许的文件**

Run: `git status --short`
Expected: 仅 `g/`、`en/g/`、`sitemap.xml`；**无** home.html/index.html/functions 等改动

- [ ] **Step 6: Commit**

```bash
git add scripts/build-seo.mjs g/ en/g/ sitemap.xml
git commit -m "feat(seo): 生成器+文法逐条页(双语)+级别 hub+重写 sitemap"
```

**⚠️ 用户 Gate：Phase 1 生成后，先本地目视/截图确认，用户看过 `git diff --stat` 再决定 push main。不 push 不上线。**

---

## Phase 2 — 单字聚合表页

### Task 7: 词性映射 + 单字聚合渲染

**Files:**
- Modify: `scripts/seo/templates.mjs`（加 `renderVocabPage`）
- Create: `scripts/seo/pos.mjs`（词性 zh→英文 slug 映射）
- Test: `scripts/seo/pos.test.mjs`

**Interfaces:**
- Produces:
  - `export const POS_MAP` + `export function posSlug(c): {slug, en, zh}|null`（未映射返回 null）
  - `renderVocabPage({level, lang, posZh, posEn, words, canonical, alternates, appUrl})` — words = `[{w,r,m}]`

- [ ] **Step 1: 写失败测试**

```js
// scripts/seo/pos.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { posSlug } from './pos.mjs';
test('maps known pos', () => {
  assert.equal(posSlug('名').slug, 'noun');
  assert.equal(posSlug('動').slug, 'verb');
});
test('unknown pos → null', () => {
  assert.equal(posSlug('謎'), null);
});
```

- [ ] **Step 2: 跑测试确认失败**

Run: `node --test scripts/seo/pos.test.mjs`
Expected: FAIL

- [ ] **Step 3: 实现 pos.mjs**

```js
// scripts/seo/pos.mjs
export const POS_MAP = {
  '名': { slug:'noun', en:'Nouns', zh:'名詞' },
  '動': { slug:'verb', en:'Verbs', zh:'動詞' },
  '形': { slug:'adjective', en:'Adjectives', zh:'形容詞' },
  'な形': { slug:'na-adjective', en:'Na-adjectives', zh:'な形容詞' },
  'い形': { slug:'i-adjective', en:'I-adjectives', zh:'い形容詞' },
  '副': { slug:'adverb', en:'Adverbs', zh:'副詞' },
  '助': { slug:'particle', en:'Particles', zh:'助詞' },
  '接': { slug:'conjunction', en:'Conjunctions', zh:'接續詞' },
  '感': { slug:'interjection', en:'Interjections', zh:'感嘆詞' },
  '連': { slug:'prenominal', en:'Prenominals', zh:'連體詞' },
};
export function posSlug(c) { return POS_MAP[c] || null; }
```

Run: `node --test scripts/seo/pos.test.mjs` → PASS

（若冒烟发现真实 `c` 值有未覆盖项，补进 POS_MAP；未覆盖的在生成器归入 `other` 并 log。）

- [ ] **Step 4: 加 renderVocabPage 到 templates.mjs**

```js
// 追加到 scripts/seo/templates.mjs 末尾
export function renderVocabPage({ level, lang, posZh, posEn, words, canonical, alternates, appUrl }) {
  const isEn = lang.startsWith('en');
  const noun = isEn ? posEn : posZh;
  const title = isEn ? `JLPT ${LV(level)} ${noun} List - StayJP` : `JLPT ${LV(level)} ${noun}單字表 - 日本再留計劃`;
  const desc = isEn ? `JLPT ${LV(level)} ${noun.toLowerCase()} with readings and meanings.` : `JLPT ${LV(level)} ${noun}單字表,附假名讀音與中文解釋。`;
  const jsonld = { '@context':'https://schema.org','@type':'ItemList', name:title, numberOfItems: words.length };
  const rows = words.map(w => `<tr><td>${esc(w.w)}</td><td>${esc(w.r)}</td><td>${esc(w.m)}</td></tr>`).join('');
  const th = isEn ? '<th>Word</th><th>Reading</th><th>Meaning</th>' : '<th>單字</th><th>讀音</th><th>意思</th>';
  const body = `<nav class="bc"><a href="${isEn ? '/en/' : '/'}">${isEn ? 'Home' : '首頁'}</a> › <a href="${isEn ? `/en/v/${level}/` : `/v/${level}/`}">${LV(level)} ${isEn ? 'Vocab' : '單字'}</a> › ${esc(noun)}</nav>
<h1>JLPT ${LV(level)} ${esc(noun)}</h1><div class="cat">${words.length} ${isEn ? 'words' : '個單字'}</div>
<section><table style="width:100%;border-collapse:collapse"><thead><tr>${th}</tr></thead><tbody>${rows}</tbody></table></section>
<a class="cta" href="${appUrl}">${isEn ? '▶ Practice free online' : '▶ 免費線上練習這些單字'}</a>
<p class="sub">${isEn ? SUB_EN : SUB_ZH}</p>
<p class="lang">${(alternates||[]).map(a => `<a href="${a.href}">${a.lang === 'en' ? 'English' : '中文'}</a>`).join(' ｜ ')}</p>`;
  return layout({ lang, title, desc, canonical, alternates, jsonld, body });
}
```

- [ ] **Step 5: Commit**

```bash
git add scripts/seo/pos.mjs scripts/seo/pos.test.mjs scripts/seo/templates.mjs
git commit -m "feat(seo): 词性映射+单字聚合表模板"
```

---

### Task 8: 生成器加单字页 + 单字 hub

**Files:**
- Modify: `scripts/build-seo.mjs`

**Interfaces:**
- Consumes: `posSlug`、`renderVocabPage`、`renderHub`（kind='vocab'）、`vocab` from loadData

- [ ] **Step 1: 在 build-seo.mjs 加单字循环**

在文法循环之后、写 sitemap 之前插入：

```js
// ---- 单字聚合表 ----
import { posSlug, POS_MAP } from './seo/pos.mjs'; // 提到文件顶部与其他 import 一起
import { renderVocabPage } from './seo/templates.mjs';
const { vocab } = loadData(); // 已在顶部 loadData 时一起解构,勿重复调用;改为顶部解构 vocab
stats.unmappedPos = 0;
for (const lv of LEVELS) {
  const zh = vocab[lv].zh, en = vocab[lv].en;
  // en 用同索引对齐(两文件同序);按词性分组
  const groups = {};
  zh.forEach((w, i) => {
    const p = posSlug(w.c);
    if (!p) { stats.unmappedPos++; return; }
    (groups[p.slug] ||= { pos:p, zh:[], en:[] });
    groups[p.slug].zh.push(w);
    if (en[i]) groups[p.slug].en.push(en[i]);
  });
  const hubZh = [];
  for (const [slug, g] of Object.entries(groups)) {
    const zhUrl = `${ORIGIN}/v/${lv}/${slug}/`, enUrl = `${ORIGIN}/en/v/${lv}/${slug}/`;
    const alts = [{ lang:'zh-Hant', href:zhUrl }, { lang:'en', href:enUrl }];
    write(`v/${lv}/${slug}`, renderVocabPage({ level:lv, lang:'zh-Hant', posZh:g.pos.zh, posEn:g.pos.en, words:g.zh, canonical:zhUrl, alternates:alts, appUrl:`${ORIGIN}/#${lv}` }));
    urls.push({ loc: zhUrl, priority:'0.6' });
    hubZh.push({ t:`${g.pos.zh} (${g.zh.length})`, href:`/v/${lv}/${slug}/` });
    if (g.en.length) {
      write(`en/v/${lv}/${slug}`, renderVocabPage({ level:lv, lang:'en', posZh:g.pos.zh, posEn:g.pos.en, words:g.en, canonical:enUrl, alternates:[{lang:'zh-Hant',href:zhUrl},{lang:'en',href:enUrl}], appUrl:`${ORIGIN}/en/#${lv}` }));
      urls.push({ loc: enUrl, priority:'0.5' });
    }
  }
  write(`v/${lv}`, renderHub({ level:lv, lang:'zh-Hant', items:hubZh, canonical:`${ORIGIN}/v/${lv}/`, kind:'vocab' }));
  urls.push({ loc:`${ORIGIN}/v/${lv}/`, priority:'0.6' });
}
```

同时更新末尾 log 加 `unmappedPos=${stats.unmappedPos}`；把顶部 `const { grammar, readings } = loadData();` 改为 `const { grammar, vocab, readings } = loadData();` 并删除本段内重复的 `loadData()`。

- [ ] **Step 2: DRY 跑，检查未映射词性**

Run: `node scripts/build-seo.mjs --dry`
Expected: pages 增加约 (单字组数×2 + 5 hub)；`unmappedPos` 记下——若偏大，把缺的 `c` 值补进 `POS_MAP` 重跑

- [ ] **Step 3: 实跑 + 目视**

Run:
```bash
node scripts/build-seo.mjs
curl -s -o /dev/null -w "vocab → %{http_code}\n" "http://127.0.0.1:8080/v/n5/noun/"
```
Expected: HTTP 200；agent-browser 截图单字表页给用户看

- [ ] **Step 4: 验证只碰允许文件**

Run: `git status --short`
Expected: 仅 `g/ en/g/ v/ en/v/ sitemap.xml scripts/`

- [ ] **Step 5: Commit**

```bash
git add scripts/build-seo.mjs v/ en/v/ sitemap.xml
git commit -m "feat(seo): 单字聚合表页(双语)+单字 hub"
```

**⚠️ 用户 Gate：同 Phase 1，用户看过 diff 再 push。**

---

## Phase 3 — 选配内链（改现有页，需用户单独批准）

### Task 9: 从 home.html 加 SEO 页入口

**Files:**
- Modify: `home.html`（加一个「JLPT 文法・單字總整理」区块，链到各级 hub）

**⚠️ 本任务修改现有线上页,须用户明确批准后再做,并单独走 diff 把关。**

- [ ] **Step 1: 定位 home.html 合适插入点（页脚或内容区），加一段链到 `/g/n5/`…`/g/n1/`、`/v/n5/`… 的导航区块，风格沿用现有 CSS class**
- [ ] **Step 2: 本地起服务器目视 home.html 未破版、链接可点**
- [ ] **Step 3: `git diff home.html` 给用户确认**
- [ ] **Step 4: Commit（用户批准后）**

```bash
git add home.html
git commit -m "feat(seo): 首页加 JLPT 文法/单字总整理内链入口"
```

---

## Self-Review（对照 spec）

- **粒度**：文法逐条(Task 6) + 单字级×词性聚合(Task 8) ✅；单字逐词页明确不做 ✅
- **双语 hreflang**：layout 输出 alternate + x-default(Task 5)，zh/en 双写(Task 6/8) ✅
- **罗马音 slug + 汉字读音 + fallback id**：Task 1/2 ✅
- **本地生成+DRY+手动 push**：Task 6/8 有 DRY 步与用户 Gate ✅
- **重写 sitemap 保留现有 8 页**：Task 6 STATIC 数组 ✅
- **只写新目录、零影响现有页**：每 Phase 有 `git status` 校验步 ✅；改现有页仅 Phase 3 且须批准 ✅
- **体积/Jekyll**：`.nojekyll` 已存在，纯静态无需处理 ✅
- **统计不静默**：pages/fallback/collisions/unmappedPos 全 log ✅
- **幂等**：按对象 key 顺序遍历、数组保序，同输入同输出 ✅
- 占位符扫描：无 TBD/TODO，代码步均含完整代码 ✅
- 类型一致性：`titleToSlug/resolveSlugs/renderGrammarPage/renderVocabPage/renderHub/buildSitemap/posSlug` 签名跨任务一致 ✅
