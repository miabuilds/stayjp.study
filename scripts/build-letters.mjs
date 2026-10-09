// 電子報建置:letters-src/*.md → letters/<slug>.html(網頁版)、letters/<slug>.email.html(寄信用)、
// letters/feed.json(newsletterCron 照它的 send_at 寄)、letters/index.html(列表＋訂閱框)。
//
// 每篇 .md 開頭寫 front matter:
//   ---
//   title: 漲價後營收掉九成，我怎麼用一個檔期救回來
//   summary: 一句話摘要，列表跟分享預覽用
//   send_at: 2026-10-13T20:00:00+08:00     ← 到這個時間才寄、列表才顯示
//   draft: true                             ← 草稿：不進 feed，不會寄，網頁版仍會產出可預覽
//   email: false                            ← 只放網頁不寄信（開站時補的舊文用）
//   ---
// 用法:node scripts/build-letters.mjs   產完 git push 就上線,寄送交給雲端排程。
import fs from "fs";
import path from "path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SRC = path.join(ROOT, "letters-src");
const OUT = path.join(ROOT, "letters");
const SITE = "https://stayjp.study";
const NAME = "一人公司實驗室";
const TAGLINE = "Mia 一個人做 App 的實驗紀錄：開發、定價、營收數字，還有邊旅居邊工作的日子。";
const SUB_FN = "https://asia-east1-jpnote-1bdd6.cloudfunctions.net/newsletterSubscribe";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function inline(s) {
  return esc(s)
    .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img src="$2" alt="$1">')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

// 只支援電子報會用到的:# 標題、段落、- 清單、1. 清單、> 引言、--- 分隔線、圖片、粗體、連結
function md(src) {
  const out = []; let para = [], list = null, quote = [];
  const flush = () => {
    if (para.length) { out.push(`<p>${inline(para.join("\n")).replace(/\n/g, "<br>")}</p>`); para = []; }
    if (list) { out.push(`<${list.t}>${list.items.map((i) => `<li>${inline(i)}</li>`).join("")}</${list.t}>`); list = null; }
    if (quote.length) { out.push(`<blockquote>${inline(quote.join("\n")).replace(/\n/g, "<br>")}</blockquote>`); quote = []; }
  };
  for (const raw of src.split("\n")) {
    const l = raw.trimEnd();
    let m;
    if (!l.trim()) { flush(); continue; }
    if ((m = l.match(/^(#{1,3})\s+(.*)/))) { flush(); const n = Math.min(m[1].length + 1, 4); out.push(`<h${n}>${inline(m[2])}</h${n}>`); continue; }
    if (/^---+$/.test(l)) { flush(); out.push("<hr>"); continue; }
    if ((m = l.match(/^>\s?(.*)/))) { if (para.length || list) flush(); quote.push(m[1]); continue; }
    if ((m = l.match(/^\s*[-*]\s+(.*)/)) || (m = l.match(/^\s*\d+\.\s+(.*)/))) {
      const t = /^\s*\d+\./.test(l) ? "ol" : "ul";
      if (para.length || quote.length || (list && list.t !== t)) flush();
      if (!list) list = { t, items: [] };
      list.items.push(m[1]); continue;
    }
    if (list || quote.length) flush();
    para.push(l);
  }
  flush();
  return out.join("\n");
}

function parse(file) {
  const txt = fs.readFileSync(file, "utf8");
  const m = txt.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error(`${file}: 缺 front matter`);
  const fm = {};
  for (const line of m[1].split("\n")) { const i = line.indexOf(":"); if (i > 0) fm[line.slice(0, i).trim()] = line.slice(i + 1).trim(); }
  const slug = path.basename(file, ".md");
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error(`${file}: 檔名只能用小寫英數跟 -`);
  for (const k of ["title", "send_at"]) if (!fm[k]) throw new Error(`${file}: front matter 缺 ${k}`);
  if (isNaN(Date.parse(fm.send_at))) throw new Error(`${file}: send_at 格式不對(例 2026-10-13T20:00:00+08:00)`);
  return { slug, title: fm.title, summary: fm.summary || "", send_at: fm.send_at, draft: fm.draft === "true", email: fm.email !== "false", body: m[2] };
}

const twDate = (iso) => new Date(Date.parse(iso) + 8 * 3600e3).toISOString().slice(0, 10).replace(/-/g, "/");

// ── 網頁版：「實驗室日誌」科技感(2026-10-09 Mia：原本太陽春、跟市面上一樣無聊)──
// 深色格線底、等寬字標籤、每期編號 EXP-00N、終端機樣式的訂閱框、文章頂部閱讀進度條。內文仍用一般中文字體，好讀優先。
const CSS = `:root{--bg:#07090C;--panel:#0E1116;--panel2:#131820;--line:#1E2530;--line2:#2A3340;--tx:#E7EAEE;--tx2:#9AA4B2;--tx3:#5F6B7A;--ac:#FF6B3D;--ac2:#FF8A5C;--ok:#3DDC97;--mono:"JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,monospace;--sans:-apple-system,"PingFang TC","Noto Sans TC",sans-serif}
*{box-sizing:border-box;margin:0;padding:0}
html{background:var(--bg)}
body{background:var(--bg);color:var(--tx);font-family:var(--sans);line-height:1.85;-webkit-font-smoothing:antialiased;min-height:100vh;position:relative;overflow-x:hidden}
body::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);background-size:44px 44px;opacity:.35;-webkit-mask-image:radial-gradient(ellipse at 50% 0%,#000 0%,transparent 75%);mask-image:radial-gradient(ellipse at 50% 0%,#000 0%,transparent 75%)}
body::after{content:"";position:fixed;left:50%;top:-260px;width:900px;height:520px;transform:translateX(-50%);pointer-events:none;z-index:0;background:radial-gradient(closest-side,rgba(255,107,61,.16),transparent)}
.wrap{position:relative;z-index:1;max-width:760px;margin:0 auto;padding:0 22px}
a{color:inherit}
.mono{font-family:var(--mono)}
header{display:flex;align-items:center;gap:12px;padding:18px 0;border-bottom:1px solid var(--line)}
header .logo{display:flex;align-items:center;gap:10px;text-decoration:none;font-weight:700;font-size:16px;letter-spacing:.02em}
header .logo i{font-style:normal;font-family:var(--mono);font-size:12px;color:var(--bg);background:var(--ac);padding:2px 7px;border-radius:4px;letter-spacing:.06em}
header .sp{flex:1}
header .home{font-family:var(--mono);font-size:12.5px;color:var(--tx2);text-decoration:none;border:1px solid var(--line2);padding:6px 12px;border-radius:999px;transition:border-color .2s,color .2s}
header .home:hover{border-color:var(--ac);color:var(--tx)}
.tag{font-family:var(--mono);font-size:12px;letter-spacing:.14em;color:var(--ac);text-transform:uppercase}
.tag::before{content:"// ";color:var(--tx3)}
.hero{padding:64px 0 34px}
.hero h1{font-size:clamp(34px,7vw,58px);line-height:1.12;font-weight:800;letter-spacing:-.01em;margin:16px 0 18px}
.hero h1 .cur{display:inline-block;width:.5em;height:.9em;margin-left:6px;background:var(--ac);vertical-align:-.06em;animation:blink 1.1s steps(1) infinite}
@keyframes blink{50%{opacity:0}}
@media(prefers-reduced-motion:reduce){.hero h1 .cur{animation:none}}
.hero p{color:var(--tx2);font-size:17px;max-width:600px}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line);border:1px solid var(--line);border-radius:12px;overflow:hidden;margin-top:30px}
.stats div{background:var(--panel);padding:14px 16px}
.stats b{display:block;font-family:var(--mono);font-size:20px;color:var(--tx);font-weight:600}
.stats span{font-family:var(--mono);font-size:11px;letter-spacing:.1em;color:var(--tx3);text-transform:uppercase}
@media(max-width:560px){.stats{grid-template-columns:1fr 1fr}.stats div:nth-child(2){grid-column:1/-1;order:3}.stats b{font-size:16px}.stats span{font-size:10px}}
.term{background:var(--panel);border:1px solid var(--line2);border-radius:12px;overflow:hidden;margin:34px 0;box-shadow:0 0 0 1px rgba(255,107,61,.05),0 20px 60px rgba(0,0,0,.45)}
.term .bar{display:flex;align-items:center;gap:7px;padding:10px 14px;border-bottom:1px solid var(--line);background:var(--panel2)}
.term .bar i{width:10px;height:10px;border-radius:50%;background:var(--line2)}
.term .bar i:first-child{background:#FF5F57}.term .bar i:nth-child(2){background:#FEBC2E}.term .bar i:nth-child(3){background:#28C840}
.term .bar span{font-family:var(--mono);font-size:12px;color:var(--tx3);margin-left:8px}
.term .in{padding:20px 18px 18px}
.term .in b{display:block;font-size:16px;margin-bottom:2px}
.term .in p{color:var(--tx2);font-size:14px;margin-bottom:14px}
.term form{display:flex;align-items:center;gap:8px;border:1px solid var(--line2);border-radius:10px;padding:6px 6px 6px 14px;background:var(--bg);transition:border-color .2s,box-shadow .2s}
.term form:focus-within{border-color:var(--ac);box-shadow:0 0 0 3px rgba(255,107,61,.15)}
.term form .ps{font-family:var(--mono);color:var(--ok);font-size:15px}
.term input[type=email]{flex:1 1 120px;min-width:0;font-family:var(--mono);font-size:15px;padding:10px 4px;border:0;outline:0;background:transparent;color:var(--tx)}
.term input::placeholder{color:var(--tx3)}
.term button{flex:none;white-space:nowrap;font-family:var(--mono);font-weight:600;font-size:14px;background:var(--ac);color:#0A0A0A;border:0;border-radius:8px;padding:11px 18px;cursor:pointer;transition:background .2s,transform .1s}
.term button:hover{background:var(--ac2)}.term button:active{transform:translateY(1px)}
.term button:disabled{opacity:.6;cursor:default}
.term .msg{font-family:var(--mono);font-size:13px;margin-top:12px;color:var(--ok);min-height:1em}
.term.done .in{border-left:3px solid var(--ok)}
.hp{position:absolute;left:-9999px}
.sec{display:flex;align-items:center;gap:12px;margin:44px 0 14px}
.sec::after{content:"";flex:1;height:1px;background:var(--line)}
.list{list-style:none;display:grid;gap:12px}
.list a{display:block;text-decoration:none;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:18px 20px;position:relative;transition:border-color .2s,transform .2s,box-shadow .2s}
.list a:hover{border-color:var(--ac);transform:translateY(-2px);box-shadow:0 12px 40px rgba(255,107,61,.10)}
.list .meta{display:flex;gap:12px;align-items:center;font-family:var(--mono);font-size:12px;color:var(--tx3)}
.list .meta .no{color:var(--ac);letter-spacing:.06em}
.list h3{font-size:19px;line-height:1.45;margin:6px 34px 6px 0;font-weight:700}
.list p{color:var(--tx2);font-size:14.5px}
.list a::after{content:"→";position:absolute;right:20px;top:20px;font-family:var(--mono);color:var(--tx3);transition:color .2s,transform .2s}
.list a:hover::after{color:var(--ac);transform:translateX(3px)}
.empty{font-family:var(--mono);color:var(--tx3);font-size:14px;padding:18px 0}
.progress{position:fixed;left:0;top:0;height:2px;width:0;background:linear-gradient(90deg,var(--ac),var(--ac2));z-index:9;box-shadow:0 0 12px var(--ac)}
article{padding:52px 0 8px}
article .meta{display:flex;flex-wrap:wrap;gap:8px 14px;font-family:var(--mono);font-size:12.5px;color:var(--tx3)}
article .meta .no{color:var(--ac)}
article h1{font-size:clamp(28px,5.5vw,42px);line-height:1.3;font-weight:800;margin:14px 0 10px;text-wrap:balance}
article .sum{color:var(--tx2);font-size:17px;padding-bottom:26px;border-bottom:1px dashed var(--line2);margin-bottom:30px}
.body{font-size:17.5px;color:#D6DBE1}
.body p,.body ul,.body ol,.body blockquote{margin:0 0 1.25em}
.body strong{color:var(--tx);background:linear-gradient(transparent 62%,rgba(255,107,61,.28) 62%)}
.body h2,.body h3,.body h4{color:var(--tx);margin:2em 0 .7em;line-height:1.4;font-weight:800}
.body h2{font-size:23px}.body h3{font-size:19px}
.body h2::before{content:"# ";font-family:var(--mono);color:var(--ac);font-weight:600}
.body h3::before{content:"## ";font-family:var(--mono);color:var(--ac);font-weight:600}
.body ul,.body ol{padding-left:0;list-style:none;counter-reset:n}
.body li{position:relative;padding-left:26px;margin:.45em 0}
.body ul li::before{content:"›";position:absolute;left:6px;color:var(--ac);font-family:var(--mono);font-weight:700}
.body ol li{counter-increment:n}
.body ol li::before{content:counter(n,decimal-leading-zero);position:absolute;left:0;color:var(--ac);font-family:var(--mono);font-size:13px;top:.25em}
.body blockquote{background:var(--panel);border:1px solid var(--line);border-left:3px solid var(--ac);border-radius:0 10px 10px 0;padding:14px 18px;color:var(--tx)}
.body img{max-width:100%;border-radius:10px;border:1px solid var(--line);display:block;margin:0 auto}
.body hr{border:0;border-top:1px dashed var(--line2);margin:2.2em 0}
.body a{color:var(--ac);text-decoration:none;border-bottom:1px solid rgba(255,107,61,.4)}
.body code{font-family:var(--mono);background:var(--panel2);border:1px solid var(--line);padding:1px 6px;border-radius:5px;font-size:.86em}
.more .list{margin-bottom:10px}
footer{display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;padding:30px 0 44px;margin-top:40px;border-top:1px solid var(--line);font-family:var(--mono);font-size:12px;color:var(--tx3)}
footer a{color:var(--tx2);text-decoration:none}
footer a:hover{color:var(--ac)}`;

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">`;

const SUB_BOX = (source) => `<div class="term" id="sub">
  <div class="bar"><i></i><i></i><i></i><span>subscribe.sh</span></div>
  <div class="in">
    <b>訂閱${esc(NAME)}</b>
    <p>有新的實驗紀錄就寄給你，大約兩週一封。隨時一鍵退訂。</p>
    <form onsubmit="return nlSub(this)">
      <span class="ps">$</span>
      <input type="email" name="email" required placeholder="you@example.com" autocomplete="email" aria-label="Email">
      <input type="text" name="website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
      <input type="hidden" name="source" value="${esc(source)}">
      <button type="submit">訂閱 →</button>
    </form>
    <div class="msg" role="status"></div>
  </div>
</div>`;

const SUB_JS = `<script>
function nlSub(f){var m=f.parentNode.querySelector('.msg'),b=f.querySelector('button');b.disabled=true;m.style.color='';m.textContent='> 送出中…';
fetch('${SUB_FN}',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:f.email.value,website:f.website.value,source:f.source.value})})
.then(function(r){return r.json()}).then(function(j){
if(!j.ok){m.style.color='var(--ac)';m.textContent='> Email 格式好像不對，再檢查一下。';return}
m.textContent=j.already?'> 你已經訂閱了，謝謝。':'> 確認信寄出了，去信箱按「確認訂閱」就完成。';f.reset();})
.catch(function(){m.style.color='var(--ac)';m.textContent='> 送出失敗，稍後再試一次。'}).finally(function(){b.disabled=false});return false}
</script>`;

const head = (title, desc, url) => `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#07090C">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}"><meta property="og:type" content="article">
<meta property="og:image" content="${SITE}/stayjpplan.png"><meta name="twitter:card" content="summary">
<link rel="canonical" href="${url}"><link rel="alternate" type="application/json" href="${SITE}/letters/feed.json">
${FONTS}<style>${CSS}</style></head><body>`;

const HEADER = `<div class="wrap"><header><a class="logo" href="/letters/"><i>LAB</i>${esc(NAME)}</a><span class="sp"></span><a class="home" href="/">StayJP ↗</a></header>`;
const FOOTER = `<footer><span>© ${new Date().getFullYear()} ${esc(NAME)}</span><span><a href="/letters/">所有實驗</a> · <a href="/">日本再留計劃 StayJP</a></span></footer></div>`;

const expNo = (n) => "EXP-" + String(n).padStart(3, "0");
const readMin = (body) => Math.max(1, Math.round(body.replace(/\s/g, "").length / 450));

// 列表卡片(網頁版與「更多實驗」共用,在瀏覽器端用 feed.json 畫,這樣排程到期的期數不用重 build 就會出現)
const CARD_JS = `function nlCards(its,all){var e=function(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
var asc=all.slice().sort(function(a,b){return Date.parse(a.send_at)-Date.parse(b.send_at)});
return its.map(function(i){var n=asc.indexOf(i)+1,d=new Date(Date.parse(i.send_at)+8*36e5).toISOString().slice(0,10).replace(/-/g,'/');
return '<li><a href="/letters/'+e(i.slug)+'"><div class="meta"><span class="no">EXP-'+String(n).padStart(3,'0')+'</span><span>'+d+'</span></div><h3>'+e(i.title)+'</h3>'+(i.summary?'<p>'+e(i.summary)+'</p>':'')+'</a></li>'}).join('')}`;

function webPage(it, no) {
  const url = `${SITE}/letters/${it.slug}`;
  return head(`${it.title}｜${NAME}`, it.summary || TAGLINE, url) + `<div class="progress" id="pg"></div>` + HEADER +
    `<article><div class="meta"><span class="no">${no ? expNo(no) : "DRAFT"}</span><span>${twDate(it.send_at)}</span><span>${readMin(it.body)} min read</span></div>
<h1>${esc(it.title)}</h1>${it.summary ? `<p class="sum">${esc(it.summary)}</p>` : ""}<div class="body">${md(it.body)}</div></article>
${SUB_BOX("article_" + it.slug)}
<section class="more" id="more" hidden><div class="sec"><span class="tag">more experiments</span></div><ul class="list" id="moreList"></ul></section>
${FOOTER}${SUB_JS}<script>
${CARD_JS}
(function(){var p=document.getElementById('pg');addEventListener('scroll',function(){var h=document.documentElement;p.style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%'},{passive:true})})();
fetch('/letters/feed.json').then(function(r){return r.json()}).then(function(f){var now=Date.now(),all=(f.issues||[]).filter(function(i){return Date.parse(i.send_at)<=now});
var o=all.filter(function(i){return i.slug!=='${it.slug}'}).slice(0,3);if(!o.length)return;document.getElementById('moreList').innerHTML=nlCards(o,all);document.getElementById('more').hidden=false}).catch(function(){});
</script></body></html>`;
}

// 寄信版:樣式全部 inline(很多信箱會吃掉 <style>),底部留 {{UNSUB}} 給 newsletterCron 換成每個人的退訂連結
function emailPage(it) {
  const S = {
    p: "margin:0 0 1.2em", h: "font-family:Georgia,'Songti TC',serif;margin:1.6em 0 .6em;line-height:1.4",
    q: "margin:0 0 1.2em;border-left:3px solid #C6553B;padding:2px 0 2px 14px;color:#555",
    img: "max-width:100%;border-radius:8px;display:block", a: "color:#C6553B",
  };
  const body = md(it.body)
    .replace(/<p>/g, `<p style="${S.p}">`).replace(/<h([234])>/g, `<h$1 style="${S.h}">`)
    .replace(/<blockquote>/g, `<blockquote style="${S.q}">`).replace(/<img /g, `<img style="${S.img}" `)
    .replace(/<a href/g, `<a style="${S.a}" href`).replace(/<(ul|ol)>/g, `<$1 style="${S.p};padding-left:1.4em">`)
    .replace(/<hr>/g, '<hr style="border:0;border-top:1px solid #e5e1da;margin:2em 0">');
  return `<meta charset="utf-8"><div style="background:#F6F4EF;padding:24px 0"><div style="max-width:600px;margin:0 auto;background:#fff;border-radius:14px;padding:28px 24px;font-family:-apple-system,'PingFang TC','Noto Sans TC',sans-serif;color:#2C2C2C;font-size:16px;line-height:1.85">
<div style="color:#C6553B;font-weight:700;font-size:13px;letter-spacing:.1em">${esc(NAME)}</div>
<h1 style="font-family:Georgia,'Songti TC',serif;font-size:24px;line-height:1.35;margin:8px 0 20px">${esc(it.title)}</h1>
${body}
<hr style="border:0;border-top:1px solid #e5e1da;margin:2em 0">
<p style="color:#999;font-size:13px;margin:0">直接回這封信就會寄到我信箱，我都會看。<br>
<a style="color:#999" href="${SITE}/letters/${it.slug}">在網頁上看這一期</a>・<a style="color:#999" href="{{UNSUB}}">退訂</a></p>
</div></div>`;
}

function indexPage() {
  return head(NAME, TAGLINE, `${SITE}/letters/`) + HEADER +
    `<section class="hero"><div class="tag">solo company lab</div><h1>${esc(NAME)}<span class="cur"></span></h1><p>${esc(TAGLINE)}</p>
<div class="stats"><div><b>3</b><span>products</span></div><div><b>iOS·Android·Web</b><span>platforms</span></div><div><b id="expN">—</b><span>experiments</span></div></div></section>
<div class="term done" id="ok" hidden><div class="bar"><i></i><i></i><i></i><span>status</span></div><div class="in"><b>訂閱完成</b><p style="margin:0">下一份實驗紀錄出來就會寄給你。</p></div></div>
${SUB_BOX("letters")}
<div class="sec"><span class="tag">experiment log</span></div>
<ul class="list" id="list"><li class="empty">&gt; 第一份紀錄準備中_</li></ul>
${FOOTER}${SUB_JS}<script>
${CARD_JS}
if(/subscribed=1/.test(location.search)){document.getElementById('ok').hidden=false;document.getElementById('sub').hidden=true}
fetch('/letters/feed.json?_='+Date.now()).then(function(r){return r.json()}).then(function(f){
var now=Date.now(),its=(f.issues||[]).filter(function(i){return Date.parse(i.send_at)<=now});
document.getElementById('expN').textContent=String(its.length).padStart(3,'0');
if(its.length)document.getElementById('list').innerHTML=nlCards(its,its)});
</script></body></html>`;
}

fs.mkdirSync(SRC, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });
const items = fs.readdirSync(SRC).filter((f) => f.endsWith(".md")).map((f) => parse(path.join(SRC, f)));
const order = items.filter((i) => !i.draft).sort((a, b) => Date.parse(a.send_at) - Date.parse(b.send_at)).map((i) => i.slug);
for (const it of items) {
  fs.writeFileSync(path.join(OUT, `${it.slug}.html`), webPage(it, order.indexOf(it.slug) + 1));
  // 只放網頁的不產寄信版:線上 newsletterCron 抓不到信件 HTML 就不會寄(舊版 function 也安全)
  const ef = path.join(OUT, `${it.slug}.email.html`);
  if (it.email) fs.writeFileSync(ef, emailPage(it)); else if (fs.existsSync(ef)) fs.unlinkSync(ef);
}
const feed = items.filter((i) => !i.draft).sort((a, b) => Date.parse(b.send_at) - Date.parse(a.send_at))
  .map((i) => ({ slug: i.slug, title: i.title, summary: i.summary, send_at: new Date(Date.parse(i.send_at)).toISOString(),
    url: `/letters/${i.slug}`, email_url: `/letters/${i.slug}.email.html`, ...(i.email ? {} : { email: false }) }));
fs.writeFileSync(path.join(OUT, "feed.json"), JSON.stringify({ name: NAME, issues: feed }, null, 1));
fs.writeFileSync(path.join(OUT, "index.html"), indexPage());
console.log(`電子報:${items.length} 篇(${feed.length} 篇進 feed,${items.length - feed.length} 篇草稿)`);
for (const i of feed) console.log(`  ${twDate(i.send_at)} ${i.email === false ? "只放網頁" : Date.parse(i.send_at) > Date.now() ? "排程寄信" : "已到期"}  ${i.slug}  ${i.title}`);
