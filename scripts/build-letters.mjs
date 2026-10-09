// 電子報建置:letters-src/*.md → letters/<slug>.html(網頁版)、letters/<slug>.email.html(寄信用)、
// letters/feed.json(newsletterCron 照它的 send_at 寄)、letters/index.html(列表＋訂閱框)。
//
// 每篇 .md 開頭寫 front matter:
//   ---
//   title: 漲價後營收掉九成，我怎麼用一個檔期救回來
//   summary: 一句話摘要，列表跟分享預覽用
//   send_at: 2026-10-13T20:00:00+08:00     ← 到這個時間才寄、列表才顯示
//   draft: true                             ← 草稿：不進 feed，不會寄，網頁版仍會產出可預覽
//   ---
// 用法:node scripts/build-letters.mjs   產完 git push 就上線,寄送交給雲端排程。
import fs from "fs";
import path from "path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SRC = path.join(ROOT, "letters-src");
const OUT = path.join(ROOT, "letters");
const SITE = "https://stayjp.study";
const NAME = "Mia 的開發筆記";
const TAGLINE = "一個人做 App 的開發紀錄、商業模式的實驗數字，還有到處旅居的生活。";
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
  return { slug, title: fm.title, summary: fm.summary || "", send_at: fm.send_at, draft: fm.draft === "true", body: m[2] };
}

const twDate = (iso) => new Date(Date.parse(iso) + 8 * 3600e3).toISOString().slice(0, 10).replace(/-/g, "/");

const CSS = `:root{--bg:#F6F4EF;--bg2:#fff;--tx:#2C2C2C;--tx2:#6B6B6B;--tx3:#9A9A9A;--ac:#C6553B;--bd:#E7E3DC;--serif:"Noto Serif TC","Songti TC",serif}
@media (prefers-color-scheme:dark){:root{--bg:#161615;--bg2:#211F1D;--tx:#EDEBE7;--tx2:#A7A29B;--tx3:#6E6A64;--ac:#E8734A;--bd:#332F2B}}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--tx);font-family:-apple-system,"PingFang TC","Noto Sans TC",sans-serif;line-height:1.85;-webkit-font-smoothing:antialiased}
.wrap{max-width:680px;margin:0 auto;padding:0 22px}
header{display:flex;align-items:center;gap:12px;padding:16px 0;border-bottom:1px solid var(--bd)}
header a{color:var(--tx);text-decoration:none}
header .logo{font-family:var(--serif);font-weight:700;font-size:17px}
header .sp{flex:1}
header .home{color:var(--tx2);font-size:14px}
.eyebrow{color:var(--ac);font-weight:700;font-size:13px;letter-spacing:.12em}
h1{font-family:var(--serif);font-size:clamp(26px,5.5vw,38px);line-height:1.3;margin:12px 0 12px;text-wrap:balance}
.lead{color:var(--tx2);font-size:17px}
.hero{padding:40px 0 28px}
.sub{background:var(--bg2);border:1px solid var(--bd);border-radius:16px;padding:20px;margin:8px 0 34px}
.sub b{display:block;font-size:16px;margin-bottom:4px}
.sub p{color:var(--tx2);font-size:14px;margin-bottom:12px}
.sub form{display:flex;gap:10px;flex-wrap:wrap}
.sub input[type=email]{flex:1 1 220px;min-width:0;font:inherit;font-size:16px;padding:12px 16px;border:1px solid var(--bd);border-radius:999px;background:var(--bg);color:var(--tx)}
.sub button{font:inherit;font-weight:600;font-size:15px;background:var(--ac);color:#fff;border:0;border-radius:999px;padding:12px 24px;cursor:pointer}
.sub .msg{font-size:14px;margin-top:10px;color:var(--ac)}
.hp{position:absolute;left:-9999px}
.list{list-style:none;border-top:1px solid var(--bd)}
.list li{border-bottom:1px solid var(--bd);padding:18px 0}
.list a{color:var(--tx);text-decoration:none;font-family:var(--serif);font-size:19px;font-weight:700}
.list .d{color:var(--tx3);font-size:13px}
.list p{color:var(--tx2);font-size:15px;margin-top:4px}
.empty{color:var(--tx3);padding:20px 0}
article{padding:36px 0 10px}
article .d{color:var(--tx3);font-size:14px}
.body{font-size:17px}
.body p,.body ul,.body ol,.body blockquote{margin:0 0 1.2em}
.body h2,.body h3,.body h4{font-family:var(--serif);margin:1.8em 0 .6em;line-height:1.4}
.body h2{font-size:23px}.body h3{font-size:20px}
.body ul,.body ol{padding-left:1.4em}
.body li{margin:.3em 0}
.body blockquote{border-left:3px solid var(--ac);padding:2px 0 2px 16px;color:var(--tx2)}
.body img{max-width:100%;border-radius:10px;display:block;margin:0 auto}
.body hr{border:0;border-top:1px solid var(--bd);margin:2em 0}
.body a{color:var(--ac)}
.body code{background:var(--bd);padding:1px 6px;border-radius:5px;font-size:.9em}
footer{padding:30px 0 40px;text-align:center;color:var(--tx3);font-size:13px;border-top:1px solid var(--bd);margin-top:20px}
footer a{color:var(--tx2)}`;

const SUB_BOX = (source) => `<div class="sub">
  <b>訂閱 ${esc(NAME)}</b>
  <p>有新的一期就寄給你，大約兩週一封。隨時一鍵退訂。</p>
  <form onsubmit="return nlSub(this)">
    <input type="email" name="email" required placeholder="你的 Email" autocomplete="email">
    <input type="text" name="website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
    <input type="hidden" name="source" value="${esc(source)}">
    <button type="submit">訂閱</button>
  </form>
  <div class="msg" role="status"></div>
</div>`;

const SUB_JS = `<script>
function nlSub(f){var m=f.parentNode.querySelector('.msg'),b=f.querySelector('button');b.disabled=true;m.textContent='送出中…';
fetch('${SUB_FN}',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:f.email.value,website:f.website.value,source:f.source.value})})
.then(function(r){return r.json()}).then(function(j){
m.textContent=j.ok?(j.already?'你已經訂閱了，謝謝！':'確認信寄出了，去信箱按一下「確認訂閱」就完成。'):'Email 格式好像不對，再檢查一下。';
if(j.ok)f.reset();}).catch(function(){m.textContent='送出失敗，稍後再試一次。'}).finally(function(){b.disabled=false});return false}
</script>`;

const head = (title, desc, url) => `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}"><meta property="og:type" content="article">
<meta property="og:image" content="${SITE}/stayjpplan.png"><meta name="twitter:card" content="summary">
<link rel="canonical" href="${url}"><link rel="alternate" type="application/json" href="${SITE}/letters/feed.json">
<style>${CSS}</style></head><body>`;

const HEADER = `<div class="wrap"><header><a class="logo" href="/letters/">${esc(NAME)}</a><span class="sp"></span><a class="home" href="/">StayJP</a></header>`;
const FOOTER = `<footer>${esc(NAME)}・<a href="/">日本再留計劃 StayJP</a></footer></div>`;

function webPage(it) {
  const url = `${SITE}/letters/${it.slug}`;
  return head(`${it.title}｜${NAME}`, it.summary || TAGLINE, url) + HEADER +
    `<article><div class="d">${twDate(it.send_at)}</div><h1>${esc(it.title)}</h1><div class="body">${md(it.body)}</div></article>
${SUB_BOX("article_" + it.slug)}${FOOTER}${SUB_JS}</body></html>`;
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
    `<section class="hero"><div class="eyebrow">NEWSLETTER</div><h1>${esc(NAME)}</h1><p class="lead">${esc(TAGLINE)}</p></section>
<div id="ok" class="sub" style="display:none"><b>訂閱完成 🎉</b><p style="margin:0">下一期出來就會寄給你。</p></div>
${SUB_BOX("letters")}
<ul class="list" id="list"><li class="empty">第一期準備中。</li></ul>
${FOOTER}${SUB_JS}
<script>
if(/subscribed=1/.test(location.search))document.getElementById('ok').style.display='block';
fetch('/letters/feed.json?_='+Date.now()).then(function(r){return r.json()}).then(function(f){
var now=Date.now(),its=(f.issues||[]).filter(function(i){return Date.parse(i.send_at)<=now});
if(!its.length)return;
document.getElementById('list').innerHTML=its.map(function(i){
var d=new Date(Date.parse(i.send_at)+8*36e5).toISOString().slice(0,10).replace(/-/g,'/');
var e=function(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
return '<li><div class="d">'+d+'</div><a href="/letters/'+e(i.slug)+'">'+e(i.title)+'</a>'+(i.summary?'<p>'+e(i.summary)+'</p>':'')+'</li>'}).join('')});
</script></body></html>`;
}

fs.mkdirSync(SRC, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });
const items = fs.readdirSync(SRC).filter((f) => f.endsWith(".md")).map((f) => parse(path.join(SRC, f)));
for (const it of items) {
  fs.writeFileSync(path.join(OUT, `${it.slug}.html`), webPage(it));
  fs.writeFileSync(path.join(OUT, `${it.slug}.email.html`), emailPage(it));
}
const feed = items.filter((i) => !i.draft).sort((a, b) => Date.parse(b.send_at) - Date.parse(a.send_at))
  .map((i) => ({ slug: i.slug, title: i.title, summary: i.summary, send_at: new Date(Date.parse(i.send_at)).toISOString(),
    url: `/letters/${i.slug}`, email_url: `/letters/${i.slug}.email.html` }));
fs.writeFileSync(path.join(OUT, "feed.json"), JSON.stringify({ name: NAME, issues: feed }, null, 1));
fs.writeFileSync(path.join(OUT, "index.html"), indexPage());
console.log(`電子報:${items.length} 篇(${feed.length} 篇進 feed,${items.length - feed.length} 篇草稿)`);
for (const i of feed) console.log(`  ${twDate(i.send_at)} ${Date.parse(i.send_at) > Date.now() ? "排程中" : "已到期"}  ${i.slug}  ${i.title}`);
