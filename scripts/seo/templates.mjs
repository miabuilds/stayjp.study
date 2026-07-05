export function esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
// 例句可能是 {j:日文(含<em>), z:译文} 对象,或纯字符串(EN)。
// 转义全部,再放行 <em>/</em>(内容自有的高亮),防止其他标签注入。
function escKeepEm(s) {
  return esc(s).replace(/&lt;em&gt;/g, '<em>').replace(/&lt;\/em&gt;/g, '</em>');
}
export function renderExample(e) {
  if (e && typeof e === 'object') {
    const j = escKeepEm(e.j || '');
    const tr = e.z != null ? e.z : (e.e != null ? e.e : '');
    return `<li>${j}${tr ? `<span class="t"> ${esc(tr)}</span>` : ''}</li>`;
  }
  return `<li>${escKeepEm(e)}</li>`;
}

const CSS = `:root{--bg:#FAF9F6;--tx:#2C2C2C;--mut:#6b6b6b;--ac:#7a8b6f;--card:#fff;--bd:#e7e4dd}
*{box-sizing:border-box}body{margin:0;font-family:-apple-system,"Noto Sans TC","Hiragino Sans",sans-serif;background:var(--bg);color:var(--tx);line-height:1.75}
.wrap{max-width:720px;margin:0 auto;padding:24px 18px 64px}
nav.bc{font-size:13px;color:var(--mut);margin-bottom:12px}nav.bc a{color:var(--mut)}
h1{font-size:26px;margin:.2em 0 .1em}.cat{color:var(--mut);font-size:14px;margin-bottom:20px}
section{background:var(--card);border:1px solid var(--bd);border-radius:12px;padding:16px 18px;margin:14px 0}
section h2{font-size:15px;color:var(--ac);margin:0 0 8px}
ul.eg{margin:0;padding-left:18px}.eg li{margin:6px 0}.eg .t{color:var(--mut);font-size:14px}
.eg em{font-style:normal;font-weight:700;color:var(--ac)}
table{width:100%;border-collapse:collapse;font-size:15px}th,td{text-align:left;padding:7px 6px;border-bottom:1px solid var(--bd)}th{color:var(--mut);font-weight:600;font-size:13px}
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

export function renderGrammarPage({ entry, level, lang, canonical, alternates = [], related = [], appUrl }) {
  const isEn = lang.startsWith('en');
  const title = isEn
    ? `${entry.t} | JLPT ${LV(level)} Grammar - StayJP`
    : `${entry.t}｜JLPT ${LV(level)} 文法解說 - 日本再留計劃`;
  const desc = String(entry.ex || '').replace(/<[^>]+>/g, '').slice(0, 120);
  const jsonld = {
    '@context': 'https://schema.org', '@type': 'LearningResource',
    name: entry.t, educationalLevel: `JLPT ${LV(level)}`,
    inLanguage: lang, description: desc, learningResourceType: 'Grammar explanation',
    isAccessibleForFree: true, url: canonical,
  };
  const egItems = (entry.eg || []).map(renderExample).join('');
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
<section><h2>${L.mean}</h2><p>${escKeepEm(entry.ex)}</p></section>
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
  const desc = isEn ? `All JLPT ${LV(level)} ${noun.toLowerCase()} points with explanations and examples.` : `JLPT ${LV(level)} ${noun}完整列表,附解說與例句。`;
  const jsonld = { '@context':'https://schema.org','@type':'ItemList', name:title, numberOfItems: items.length };
  const links = items.map(it => `<a href="${it.href}">${esc(it.t)}</a>`).join('');
  const body = `<nav class="bc"><a href="${isEn ? '/en/' : '/'}">${isEn ? 'Home' : '首頁'}</a> › ${LV(level)} ${noun}</nav>
<h1>JLPT ${LV(level)} ${noun}</h1><section class="idx">${links}</section>`;
  return layout({ lang, title, desc, canonical, jsonld, body });
}

// 单字聚合表(Phase 2 复用同文件)
export function renderVocabPage({ level, lang, posZh, posEn, words, canonical, alternates = [], appUrl }) {
  const isEn = lang.startsWith('en');
  const noun = isEn ? posEn : posZh;
  const title = isEn ? `JLPT ${LV(level)} ${noun} List - StayJP` : `JLPT ${LV(level)} ${noun}單字表 - 日本再留計劃`;
  const desc = isEn ? `JLPT ${LV(level)} ${String(noun).toLowerCase()} with readings and meanings.` : `JLPT ${LV(level)} ${noun}單字表,附假名讀音與中文解釋。`;
  const jsonld = { '@context':'https://schema.org','@type':'ItemList', name:title, numberOfItems: words.length };
  const rows = words.map(w => `<tr><td>${esc(w.w)}</td><td>${esc(w.r)}</td><td>${esc(w.m)}</td></tr>`).join('');
  const th = isEn ? '<th>Word</th><th>Reading</th><th>Meaning</th>' : '<th>單字</th><th>讀音</th><th>意思</th>';
  const body = `<nav class="bc"><a href="${isEn ? '/en/' : '/'}">${isEn ? 'Home' : '首頁'}</a> › <a href="${isEn ? `/en/v/${level}/` : `/v/${level}/`}">${LV(level)} ${isEn ? 'Vocab' : '單字'}</a> › ${esc(noun)}</nav>
<h1>JLPT ${LV(level)} ${esc(noun)}</h1><div class="cat">${words.length} ${isEn ? 'words' : '個單字'}</div>
<section><table><thead><tr>${th}</tr></thead><tbody>${rows}</tbody></table></section>
<a class="cta" href="${appUrl}">${isEn ? '▶ Practice free online' : '▶ 免費線上練習這些單字'}</a>
<p class="sub">${isEn ? SUB_EN : SUB_ZH}</p>
<p class="lang">${alternates.map(a => `<a href="${a.href}">${a.lang === 'en' ? 'English' : '中文'}</a>`).join(' ｜ ')}</p>`;
  return layout({ lang, title, desc, canonical, alternates, jsonld, body });
}
