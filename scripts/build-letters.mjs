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
const TAGLINE = "大家好，我是再留計劃的 Mia。";
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

// ── 網頁版：「實驗室日誌」(2026-10-09 Mia：要更炫、科技感＋迷幻、多動態；深色/淺色可切換)──
// 背景：漂移的極光色塊＋緩慢移動的格線＋顆粒；標題漸層流動；卡片滑鼠聚光＋旋轉漸層邊框＋捲動浮現；數字跳動。
// 主題：html[data-theme]，預設跟系統，按鈕切換後記在 localStorage(讀寫都包 try)。prefers-reduced-motion 全部靜止。
// 內文仍用一般中文字體，好讀優先。
const CSS = `@property --ang{syntax:"<angle>";initial-value:0deg;inherits:false}
:root,[data-theme=dark]{--bg:#05060A;--panel:rgba(14,17,24,.72);--panel2:rgba(22,27,36,.8);--line:rgba(255,255,255,.07);--line2:rgba(255,255,255,.13);--tx:#EEF1F5;--tx2:#A3ACB9;--tx3:#667285;--body:#D7DCE4;--ac:#FF6B3D;--ac2:#FF8A5C;--ok:#3DDC97;--aur:.6;--grain:.07;--gridop:.5;--hl:rgba(255,107,61,.3);--shadow:0 24px 70px rgba(0,0,0,.55)}
[data-theme=light]{--bg:#F4F3EF;--panel:rgba(255,255,255,.72);--panel2:rgba(250,249,246,.9);--line:rgba(12,14,22,.08);--line2:rgba(12,14,22,.15);--tx:#11131A;--tx2:#4D5563;--tx3:#8A92A0;--body:#262B34;--ac:#E5522A;--ac2:#FF6B3D;--ok:#0E9F6E;--aur:.38;--grain:.05;--gridop:.6;--hl:rgba(229,82,42,.22);--shadow:0 24px 60px rgba(20,22,40,.12)}
:root{--grad:linear-gradient(90deg,#FF6B3D,#FF3D9A,#8B5CFF,#2FD4FF,#3DDC97,#FF6B3D);--mono:"JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,monospace;--sans:-apple-system,"PingFang TC","Noto Sans TC",sans-serif;color-scheme:dark}
[data-theme=light]{color-scheme:light}
*{box-sizing:border-box;margin:0;padding:0}
html{background:var(--bg)}
body{background:var(--bg);color:var(--tx);font-family:var(--sans);line-height:1.85;-webkit-font-smoothing:antialiased;min-height:100vh;position:relative;overflow-x:hidden;transition:background .5s,color .5s}
.aurora{position:fixed;inset:-20vmax;z-index:0;pointer-events:none;opacity:var(--aur);filter:blur(70px) saturate(140%);transition:opacity .5s}
.aurora span{position:absolute;width:55vmax;height:55vmax;border-radius:50%;mix-blend-mode:normal}
.aurora span:nth-child(1){left:10%;top:-5%;background:radial-gradient(circle,#FF6B3D 0,transparent 62%);animation:drift1 22s ease-in-out infinite alternate}
.aurora span:nth-child(2){right:0;top:5%;background:radial-gradient(circle,#8B5CFF 0,transparent 62%);animation:drift2 26s ease-in-out infinite alternate}
.aurora span:nth-child(3){left:30%;top:30%;background:radial-gradient(circle,#FF3D9A 0,transparent 60%);animation:drift3 30s ease-in-out infinite alternate;opacity:.75}
.aurora span:nth-child(4){right:15%;top:45%;background:radial-gradient(circle,#2FD4FF 0,transparent 60%);animation:drift1 34s ease-in-out infinite alternate-reverse;opacity:.6}
@keyframes drift1{to{transform:translate(18vmax,14vmax) scale(1.15)}}
@keyframes drift2{to{transform:translate(-16vmax,18vmax) scale(.9)}}
@keyframes drift3{to{transform:translate(10vmax,-16vmax) rotate(40deg) scale(1.2)}}
body::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;opacity:var(--gridop);background-image:linear-gradient(var(--line2) 1px,transparent 1px),linear-gradient(90deg,var(--line2) 1px,transparent 1px);background-size:46px 46px;animation:grid 18s linear infinite;-webkit-mask-image:radial-gradient(ellipse 80% 60% at 50% 0%,#000,transparent);mask-image:radial-gradient(ellipse 80% 60% at 50% 0%,#000,transparent)}
@keyframes grid{to{background-position:46px 46px}}
body::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:2;opacity:var(--grain);background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.wrap{position:relative;z-index:1;max-width:780px;margin:0 auto;padding:0 22px}
a{color:inherit}
header{position:sticky;top:0;z-index:5;display:flex;align-items:center;gap:10px;padding:14px 0;border-bottom:1px solid var(--line);backdrop-filter:blur(14px) saturate(140%);-webkit-backdrop-filter:blur(14px) saturate(140%)}
header .logo{display:flex;align-items:center;gap:10px;text-decoration:none;font-weight:800;font-size:15.5px;letter-spacing:.02em;white-space:nowrap;min-width:0}
header .logo i{font-style:normal;font-family:var(--mono);font-size:11.5px;color:#fff;background:var(--grad);background-size:300% 100%;animation:flow 6s linear infinite;padding:3px 8px;border-radius:5px;letter-spacing:.08em}
header .logo:hover span{animation:glitch .35s steps(2) 2}
@keyframes glitch{0%{text-shadow:2px 0 #FF3D9A,-2px 0 #2FD4FF;transform:translateX(1px)}50%{text-shadow:-2px 0 #FF3D9A,2px 0 #2FD4FF;transform:translateX(-1px)}100%{text-shadow:none;transform:none}}
header .sp{flex:1}
.pill{white-space:nowrap;flex:none;font-family:var(--mono);font-size:12px;color:var(--tx2);text-decoration:none;border:1px solid var(--line2);background:var(--panel);padding:6px 12px;border-radius:999px;cursor:pointer;transition:border-color .2s,color .2s,transform .2s;display:inline-flex;align-items:center;gap:6px}
.pill:hover{border-color:var(--ac);color:var(--tx)}
.pill svg{width:14px;height:14px}
.tag{font-family:var(--mono);font-size:12px;letter-spacing:.16em;color:var(--ac);text-transform:uppercase}
.tag::before{content:"// ";color:var(--tx3)}
@keyframes flow{to{background-position:300% 0}}
.grad{background:var(--grad);background-size:300% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:flow 8s linear infinite}
.hero{padding:76px 0 30px}
.hero h1{font-size:clamp(38px,8vw,66px);line-height:1.08;font-weight:900;letter-spacing:-.015em;margin:18px 0 20px}
.hero h1 .cur{display:inline-block;width:.42em;height:.86em;margin-left:8px;background:var(--grad);background-size:300% 100%;animation:flow 6s linear infinite,blink 1.1s steps(1) infinite;vertical-align:-.04em;border-radius:2px}
@keyframes blink{50%{opacity:0}}
.hero p{color:var(--tx2);font-size:17px;max-width:600px}
.typed::after{content:"_";color:var(--ac);animation:blink 1s steps(1) infinite;margin-left:2px}
.stats{display:grid;grid-template-columns:1fr 1.7fr 1fr;gap:1px;background:var(--line);border:1px solid var(--line2);border-radius:14px;overflow:hidden;margin-top:34px;box-shadow:var(--shadow)}
.stats div{background:var(--panel);padding:16px 18px;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
.stats b{display:block;font-family:var(--mono);font-size:22px;color:var(--tx);font-weight:600;white-space:nowrap}
.stats span{font-family:var(--mono);font-size:11px;letter-spacing:.12em;color:var(--tx3);text-transform:uppercase}
@media(max-width:520px){header .logo{font-size:14px;gap:8px}.pill{padding:6px 10px}.pill .txt{display:none}}
@media(max-width:560px){.stats{grid-template-columns:1fr 1fr}.stats div:nth-child(2){grid-column:1/-1;order:3}.stats b{font-size:17px}.stats span{font-size:10px}}
.glass{background:var(--panel);border:1px solid var(--line2);backdrop-filter:blur(14px) saturate(130%);-webkit-backdrop-filter:blur(14px) saturate(130%)}
.term{border-radius:14px;overflow:hidden;margin:36px 0;box-shadow:var(--shadow);position:relative}
.term::before{content:"";position:absolute;left:0;right:0;top:0;height:1px;background:var(--grad);background-size:300% 100%;animation:flow 5s linear infinite}
.term .bar{display:flex;align-items:center;gap:7px;padding:10px 14px;border-bottom:1px solid var(--line);background:var(--panel2)}
.term .bar i{width:10px;height:10px;border-radius:50%}
.term .bar i:first-child{background:#FF5F57}.term .bar i:nth-child(2){background:#FEBC2E}.term .bar i:nth-child(3){background:#28C840}
.term .bar span{font-family:var(--mono);font-size:12px;color:var(--tx3);margin-left:8px}
.term .in{padding:20px 18px 18px}
.term .in b{display:block;font-size:16px;margin-bottom:2px}
.term .in p{color:var(--tx2);font-size:14px;margin-bottom:14px}
.term form{display:flex;align-items:center;gap:8px;border:1px solid var(--line2);border-radius:10px;padding:6px 6px 6px 14px;background:var(--bg);transition:border-color .2s,box-shadow .2s}
.term form:focus-within{border-color:var(--ac);box-shadow:0 0 0 3px var(--hl),0 0 30px var(--hl)}
.term form .ps{font-family:var(--mono);color:var(--ok);font-size:15px}
.term input[type=email]{flex:1 1 120px;min-width:0;font-family:var(--mono);font-size:15px;padding:10px 4px;border:0;outline:0;background:transparent;color:var(--tx)}
.term input::placeholder{color:var(--tx3)}
.term button{flex:none;white-space:nowrap;font-family:var(--mono);font-weight:700;font-size:14px;color:#fff;border:0;border-radius:8px;padding:11px 18px;cursor:pointer;background:var(--grad);background-size:300% 100%;animation:flow 6s linear infinite;transition:transform .15s,filter .2s}
.term button:hover{filter:brightness(1.1) saturate(1.2)}.term button:active{transform:translateY(1px)}
.term button:disabled{opacity:.6;cursor:default}
.term .msg{font-family:var(--mono);font-size:13px;margin-top:12px;color:var(--ok);min-height:1em}
.hp{position:absolute;left:-9999px}
.sec{display:flex;align-items:center;gap:12px;margin:46px 0 16px}
.sec::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,var(--line2),transparent)}
.list{list-style:none;display:grid;gap:14px}
.card{display:block;text-decoration:none;position:relative;border-radius:14px;padding:20px 22px;border:1px solid transparent;
background:linear-gradient(var(--panel),var(--panel)) padding-box,linear-gradient(var(--line2),var(--line2)) border-box;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);transition:transform .25s,box-shadow .25s;overflow:hidden}
.card::before{content:"";position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .3s;background:radial-gradient(380px circle at var(--mx,50%) var(--my,50%),var(--hl),transparent 60%)}
.card:hover{transform:translateY(-3px);box-shadow:var(--shadow);background:linear-gradient(var(--panel),var(--panel)) padding-box,conic-gradient(from var(--ang),#FF6B3D,#FF3D9A,#8B5CFF,#2FD4FF,#3DDC97,#FF6B3D) border-box;animation:spin 3s linear infinite}
.card:hover::before{opacity:1}
@keyframes spin{to{--ang:360deg}}
.card .meta{display:flex;gap:12px;align-items:center;font-family:var(--mono);font-size:12px;color:var(--tx3);position:relative}
.card .no{color:var(--ac);letter-spacing:.06em}
.card h3{font-size:19px;line-height:1.45;margin:7px 34px 6px 0;font-weight:800;position:relative}
.card p{color:var(--tx2);font-size:14.5px;position:relative}
.card .arr{position:absolute;right:22px;top:20px;font-family:var(--mono);color:var(--tx3);transition:color .2s,transform .2s}
.card:hover .arr{color:var(--ac);transform:translate(3px,-3px)}
.empty{font-family:var(--mono);color:var(--tx3);font-size:14px;padding:18px 0}
.rv{opacity:0;transform:translateY(18px);filter:blur(4px);transition:opacity .7s ease,transform .7s cubic-bezier(.2,.7,.2,1),filter .7s}
.rv.in{opacity:1;transform:none;filter:none}
.progress{position:fixed;left:0;top:0;height:3px;width:0;background:var(--grad);background-size:300% 100%;animation:flow 4s linear infinite;z-index:9;box-shadow:0 0 14px #FF3D9A}
article{padding:56px 0 8px}
article .meta{display:flex;flex-wrap:wrap;gap:8px 14px;font-family:var(--mono);font-size:12.5px;color:var(--tx3)}
article .meta .no{color:var(--ac)}
article h1{font-size:clamp(28px,5.8vw,44px);line-height:1.28;font-weight:900;margin:14px 0 12px;text-wrap:balance}
article .sum{color:var(--tx2);font-size:17px;padding-bottom:26px;margin-bottom:30px;border-bottom:1px solid;border-image:var(--grad) 1}
.body{font-size:17.5px;color:var(--body)}
.body p,.body ul,.body ol,.body blockquote{margin:0 0 1.25em}
.body strong{color:var(--tx);background:linear-gradient(transparent 60%,var(--hl) 60%)}
.body h2,.body h3,.body h4{color:var(--tx);margin:2em 0 .7em;line-height:1.4;font-weight:800}
.body h2{font-size:23px}.body h3{font-size:19.5px}
.body h2::before{content:"# ";font-family:var(--mono);font-weight:600}
.body h3::before{content:"## ";font-family:var(--mono);font-weight:600}
.body h2::before,.body h3::before{background:var(--grad);background-size:300% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:flow 6s linear infinite}
.body ul,.body ol{padding-left:0;list-style:none;counter-reset:n}
.body li{position:relative;padding-left:26px;margin:.45em 0}
.body ul li::before{content:"›";position:absolute;left:6px;color:var(--ac);font-family:var(--mono);font-weight:700}
.body ol li{counter-increment:n}
.body ol li::before{content:counter(n,decimal-leading-zero);position:absolute;left:0;color:var(--ac);font-family:var(--mono);font-size:13px;top:.25em}
.body blockquote{background:var(--panel);border:1px solid var(--line2);border-left:3px solid var(--ac);border-radius:0 12px 12px 0;padding:14px 18px;color:var(--tx)}
.body img{max-width:100%;border-radius:12px;border:1px solid var(--line2);display:block;margin:0 auto}
.body hr{border:0;height:1px;background:var(--grad);opacity:.5;margin:2.2em 0}
.body a{color:var(--ac);text-decoration:none;border-bottom:1px solid var(--hl)}
.body code{font-family:var(--mono);background:var(--panel2);border:1px solid var(--line);padding:1px 6px;border-radius:5px;font-size:.86em}
footer{display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;padding:30px 0 44px;margin-top:44px;border-top:1px solid var(--line);font-family:var(--mono);font-size:12px;color:var(--tx3)}
footer a{color:var(--tx2);text-decoration:none}
footer a:hover{color:var(--ac)}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}.rv{opacity:1;transform:none;filter:none}}`;

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">`;

const SUB_BOX = (source) => `<div class="term glass" id="sub">
  <div class="bar"><i></i><i></i><i></i><span>subscribe.sh</span></div>
  <div class="in">
    <b>訂閱${esc(NAME)}</b>
    <p>有新的紀錄就寄給你，大約兩週一封。隨時一鍵退訂。</p>
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

// 主題在 <head> 先設好，避免先閃一下錯的顏色
const THEME_BOOT = `<script>(function(){var t;try{t=localStorage.getItem('lab-theme')}catch(e){}if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.setAttribute('data-theme',t)})()</script>`;

const head = (title, desc, url) => `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}"><meta property="og:type" content="article">
<meta property="og:image" content="${SITE}/stayjpplan.png"><meta name="twitter:card" content="summary">
<link rel="canonical" href="${url}"><link rel="alternate" type="application/json" href="${SITE}/letters/feed.json">
${THEME_BOOT}${FONTS}<style>${CSS}</style></head><body><div class="aurora" aria-hidden="true"><span></span><span></span><span></span><span></span></div>`;

const SUN = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`;
const MOON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>`;
const HEADER = `<div class="wrap"><header><a class="logo" href="/letters/"><i>LAB</i><span>${esc(NAME)}</span></a><span class="sp"></span>
<button class="pill" id="themeBtn" type="button" aria-label="切換深色/淺色"><span class="tb-l">${SUN}<span class="txt">LIGHT</span></span><span class="tb-d">${MOON}<span class="txt">DARK</span></span></button>
<a class="pill" href="/">StayJP ↗</a></header>
<style>[data-theme=dark] .tb-d,[data-theme=light] .tb-l{display:none}.tb-l,.tb-d{display:inline-flex;align-items:center;gap:6px}</style>`;
const FOOTER = `<footer><span>© ${new Date().getFullYear()} ${esc(NAME)}</span><span><a href="/letters/">所有紀錄</a> · <a href="/">日本再留計劃 StayJP</a></span></footer></div>`;

const expNo = (n) => "EXP-" + String(n).padStart(3, "0");
const readMin = (body) => Math.max(1, Math.round(body.replace(/\s/g, "").length / 450));

// 共用效果：主題切換、卡片聚光、捲動浮現、數字跳動、打字。全部只在瀏覽器端，失敗也不影響內容（.rv 由 JS 加上才會隱藏）
const FX_JS = `<script>
(function(){var b=document.getElementById('themeBtn');if(b)b.onclick=function(){var r=document.documentElement,t=r.getAttribute('data-theme')==='light'?'dark':'light';r.setAttribute('data-theme',t);try{localStorage.setItem('lab-theme',t)}catch(e){}}})();
var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
document.addEventListener('pointermove',function(e){var c=e.target.closest&&e.target.closest('.card');if(!c)return;var r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px')},{passive:true});
var IO='IntersectionObserver' in window&&!RM?new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');IO.unobserve(x.target)}})},{rootMargin:'0px 0px -8% 0px'}):null;
function fxReveal(root){if(!IO)return;(root||document).querySelectorAll('[data-rv]').forEach(function(el,i){el.classList.add('rv');el.style.transitionDelay=Math.min(i*70,420)+'ms';IO.observe(el)})}
function fxCount(el,to,pad){if(RM){el.textContent=String(to).padStart(pad||0,'0');return}var s=performance.now(),d=900;(function f(n){var p=Math.min((n-s)/d,1),v=Math.round(to*(1-Math.pow(1-p,3)));el.textContent=String(v).padStart(pad||0,'0');if(p<1)requestAnimationFrame(f)})(s)}
function fxType(el){if(RM||!el)return;var t=el.textContent;el.textContent='';el.classList.add('typed');var i=0;(function f(){el.textContent=t.slice(0,++i);if(i<t.length)setTimeout(f,28)})()}
fxReveal();
</script>`;

// 列表卡片(在瀏覽器端用 feed.json 畫，排程到期的期數不用重 build 就會出現)
const CARD_JS = `function nlCards(its,all){var e=function(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
var asc=all.slice().sort(function(a,b){return Date.parse(a.send_at)-Date.parse(b.send_at)});
return its.map(function(i){var n=asc.indexOf(i)+1,d=new Date(Date.parse(i.send_at)+8*36e5).toISOString().slice(0,10).replace(/-/g,'/');
return '<li data-rv><a class="card" href="/letters/'+e(i.slug)+'"><span class="arr">↗</span><div class="meta"><span class="no">EXP-'+String(n).padStart(3,'0')+'</span><span>'+d+'</span></div><h3>'+e(i.title)+'</h3>'+(i.summary?'<p>'+e(i.summary)+'</p>':'')+'</a></li>'}).join('')}`;

function webPage(it, no) {
  const url = `${SITE}/letters/${it.slug}`;
  return head(`${it.title}｜${NAME}`, it.summary || TAGLINE, url) + `<div class="progress" id="pg"></div>` + HEADER +
    `<article><div class="meta"><span class="no">${no ? expNo(no) : "DRAFT"}</span><span>${twDate(it.send_at)}</span><span>${readMin(it.body)} min read</span></div>
<h1>${esc(it.title)}</h1>${it.summary ? `<p class="sum">${esc(it.summary)}</p>` : ""}<div class="body">${md(it.body)}</div></article>
${SUB_BOX("article_" + it.slug)}
<section class="more" id="more" hidden><div class="sec"><span class="tag">more experiments</span></div><ul class="list" id="moreList"></ul></section>
${FOOTER}${SUB_JS}${FX_JS}<script>
${CARD_JS}
(function(){var p=document.getElementById('pg');addEventListener('scroll',function(){var h=document.documentElement;p.style.width=(h.scrollTop/Math.max(1,h.scrollHeight-h.clientHeight)*100)+'%'},{passive:true})})();
fetch('/letters/feed.json').then(function(r){return r.json()}).then(function(f){var now=Date.now(),all=(f.issues||[]).filter(function(i){return Date.parse(i.send_at)<=now});
var o=all.filter(function(i){return i.slug!=='${it.slug}'}).slice(0,3);if(!o.length)return;var L=document.getElementById('moreList');L.innerHTML=nlCards(o,all);document.getElementById('more').hidden=false;fxReveal(L)}).catch(function(){});
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
    `<section class="hero"><div class="tag">solo company lab</div><h1>一人公司<span class="grad">實驗室</span><span class="cur"></span></h1><p id="tl">${esc(TAGLINE)}</p>
<div class="stats" data-rv><div><b id="pN">3</b><span>products</span></div><div><b>iOS · Android · Web</b><span>platforms</span></div><div><b id="expN">000</b><span>experiments</span></div></div></section>
<div class="term glass" id="ok" hidden><div class="bar"><i></i><i></i><i></i><span>status</span></div><div class="in"><b>訂閱完成</b><p style="margin:0">下一份紀錄出來就會寄給你。</p></div></div>
${SUB_BOX("letters")}
<div class="sec"><span class="tag">experiment log</span></div>
<ul class="list" id="list"><li class="empty">&gt; 第一份紀錄準備中_</li></ul>
${FOOTER}${SUB_JS}${FX_JS}<script>
${CARD_JS}
if(/subscribed=1/.test(location.search)){document.getElementById('ok').hidden=false;document.getElementById('sub').hidden=true}
fxType(document.getElementById('tl'));fxCount(document.getElementById('pN'),3);
fetch('/letters/feed.json?_='+Date.now()).then(function(r){return r.json()}).then(function(f){
var now=Date.now(),its=(f.issues||[]).filter(function(i){return Date.parse(i.send_at)<=now});
fxCount(document.getElementById('expN'),its.length,3);
if(its.length){var L=document.getElementById('list');L.innerHTML=nlCards(its,its);fxReveal(L)}});
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
