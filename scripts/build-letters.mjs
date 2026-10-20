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

// ── 網頁版:Kling 風(2026-10-20 Mia:「想弄這種風格,比較帥」)──
// 黑底+頂部一道冷光柱、兩側暖/青色餘光;細斜體英文大標;訂閱框做成大玻璃面板(像生成器的輸入框)+螢光綠主鈕;
// 紀錄列表=左邊大張精選(綠色光束)+右邊功能卡(右側漸層縮圖)。最上方漸層公告條帶最新一期。
// 主題:html[data-theme],預設深色(Kling 風就是黑底;淺色用按鈕切),按鈕切換記 localStorage(讀寫包 try)。prefers-reduced-motion 全部靜止。
const CSS = `:root,[data-theme=dark]{--bg:#050608;--panel:rgba(20,22,27,.78);--panel2:#121418;--line:rgba(255,255,255,.07);--line2:rgba(255,255,255,.13);--tx:#F3F5F8;--tx2:#A3AAB6;--tx3:#686F7B;--body:#D8DCE2;--lime:#A6F26E;--lime-t:#A6F26E;--hl:rgba(166,242,110,.16);--beam:.9;--shadow:0 30px 80px rgba(0,0,0,.6);--feat:#07090A}
[data-theme=light]{--bg:#F3F4F1;--panel:rgba(255,255,255,.82);--panel2:#FFFFFF;--line:rgba(10,12,16,.07);--line2:rgba(10,12,16,.13);--tx:#0D0F13;--tx2:#4F5662;--tx3:#8B919B;--body:#23272E;--lime:#A6F26E;--lime-t:#2F9A35;--hl:rgba(70,180,60,.16);--beam:.45;--shadow:0 24px 60px rgba(20,24,30,.12);--feat:#0B0D0E}
:root{--btn:linear-gradient(90deg,#BDF56E,#66E07E);--sans:"Inter",-apple-system,"PingFang TC","Noto Sans TC",sans-serif;color-scheme:dark}
[data-theme=light]{color-scheme:light}
*{box-sizing:border-box;margin:0;padding:0}
html{background:var(--bg)}
body{background:var(--bg);color:var(--tx);font-family:var(--sans);line-height:1.85;-webkit-font-smoothing:antialiased;min-height:100vh;position:relative;overflow-x:hidden;transition:background .5s,color .5s}
a{color:inherit}
.sky{position:absolute;left:0;right:0;top:0;height:min(980px,120vh);z-index:0;pointer-events:none;overflow:hidden;opacity:var(--beam);transition:opacity .5s}
.sky i{position:absolute;border-radius:50%;filter:blur(60px)}
.sky .b1{left:50%;top:-30%;width:min(560px,70vw);height:120%;transform:translateX(-50%);background:radial-gradient(ellipse 50% 50% at 50% 40%,rgba(150,185,255,.55),rgba(90,120,220,.22) 45%,transparent 72%);animation:breathe 9s ease-in-out infinite alternate}
.sky .b2{left:-12%;top:18%;width:55vw;height:60%;background:radial-gradient(ellipse at center,rgba(40,160,170,.32),transparent 65%);animation:drift 18s ease-in-out infinite alternate}
.sky .b3{right:-10%;top:34%;width:50vw;height:55%;background:radial-gradient(ellipse at center,rgba(255,120,50,.30),transparent 65%);animation:drift 22s ease-in-out infinite alternate-reverse}
.sky::after{content:"";position:absolute;inset:0;background:linear-gradient(transparent 55%,var(--bg))}
@keyframes breathe{from{opacity:.75;transform:translateX(-50%) scaleX(.9)}to{opacity:1;transform:translateX(-50%) scaleX(1.08)}}
@keyframes drift{to{transform:translate(4vw,3vh) scale(1.08)}}
.notice{position:relative;z-index:6;display:none;align-items:center;justify-content:center;gap:10px;padding:10px 16px;font-size:14px;font-weight:500;color:#0B0D0A;text-decoration:none;background:linear-gradient(90deg,#97E3A6,#BFE8CC 38%,#D7CDEF 72%,#EBC8E2);line-height:1.4;text-align:center}
.notice.on{display:flex}
.notice svg{width:16px;height:16px;flex:none}
.notice b{font-weight:700}
.notice .go{flex:none;background:#0B0D0A;color:#fff;border-radius:999px;padding:5px 12px;font-size:12.5px;font-weight:600;white-space:nowrap}
.notice .tt{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.wrap{position:relative;z-index:1;max-width:1120px;margin:0 auto;padding:0 22px}
header{display:flex;align-items:center;gap:10px;padding:18px 0}
header .logo{display:flex;align-items:center;gap:10px;text-decoration:none;font-weight:700;font-size:15px;letter-spacing:.02em;white-space:nowrap;min-width:0}
header .logo svg{width:30px;height:30px;flex:none}
header .sp{flex:1}
.pill{white-space:nowrap;flex:none;font:inherit;font-size:13px;color:var(--tx2);text-decoration:none;border:1px solid var(--line2);background:var(--panel);padding:7px 14px;border-radius:999px;cursor:pointer;transition:border-color .2s,color .2s;display:inline-flex;align-items:center;gap:6px;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
.pill:hover{border-color:var(--tx3);color:var(--tx)}
.pill svg{width:15px;height:15px}
[data-theme=dark] .tb-d,[data-theme=light] .tb-l{display:none}.tb-l,.tb-d{display:inline-flex;align-items:center}
.hero{text-align:center;padding:64px 0 34px}
.hero .kick{font-size:19px;letter-spacing:.14em;color:var(--tx2);font-weight:400}
.hero h1{font-size:clamp(36px,6.4vw,68px);line-height:1.12;font-weight:300;font-style:italic;letter-spacing:-.01em;margin:10px 0 18px;background:linear-gradient(180deg,var(--tx) 30%,var(--tx2));-webkit-background-clip:text;background-clip:text;color:transparent;padding:0 .1em}
.hero>p{color:var(--tx2);font-size:16.5px;max-width:560px;margin:0 auto}
.typed::after{content:"";display:inline-block;width:2px;height:1em;background:var(--lime-t);margin-left:3px;vertical-align:-.15em;animation:blink 1s steps(1) infinite}
@keyframes blink{50%{opacity:0}}
.prompt{max-width:880px;margin:30px auto 0;border-radius:26px;padding:22px;background:var(--panel);border:1px solid var(--line2);box-shadow:var(--shadow);backdrop-filter:blur(18px) saturate(130%);-webkit-backdrop-filter:blur(18px) saturate(130%);text-align:left;transition:border-color .25s,box-shadow .25s}
.prompt:focus-within{border-color:rgba(166,242,110,.55);box-shadow:var(--shadow),0 0 0 4px var(--hl)}
.prompt .top{display:flex;gap:18px;align-items:flex-start}
.prompt .tile{flex:none;width:76px;height:76px;border-radius:14px;background:var(--line);border:1px solid var(--line);display:flex;align-items:center;justify-content:center;color:var(--tx)}
.prompt .tile svg{width:30px;height:30px}
.prompt .txt{flex:1;min-width:0}
.prompt .txt b{display:block;font-size:17px;font-weight:600;margin-top:2px}
.prompt .txt p{color:var(--tx2);font-size:14.5px;line-height:1.7;margin-top:2px}
.prompt input[type=email]{display:block;width:100%;font:inherit;font-size:18px;margin-top:12px;padding:8px 0;border:0;border-bottom:1px solid var(--line2);outline:0;background:transparent;color:var(--tx);border-radius:0}
.prompt input[type=email]:focus{border-bottom-color:var(--lime-t)}
.prompt input::placeholder{color:var(--tx3)}
.prompt .bot{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:22px}
.chip{display:inline-flex;align-items:center;gap:8px;font-size:14px;color:var(--tx);border:1px solid var(--line2);background:var(--panel2);border-radius:12px;padding:10px 14px;line-height:1.2;white-space:nowrap}
.chip svg{width:16px;height:16px;color:var(--tx2)}
.prompt .sp{flex:1}
.go-btn{flex:none;font:inherit;font-size:16px;font-weight:600;color:#0A0F08;border:0;border-radius:12px;padding:13px 40px;cursor:pointer;background:var(--btn);transition:box-shadow .25s,transform .15s,filter .2s;white-space:nowrap}
.go-btn:hover{box-shadow:0 0 34px rgba(166,242,110,.45);filter:brightness(1.04)}
.go-btn:active{transform:translateY(1px)}
.go-btn:disabled{opacity:.6;cursor:default}
.prompt .msg{font-size:14px;margin-top:12px;color:var(--lime-t);min-height:1em}
.prompt .msg:empty{display:none}
.hp{position:absolute;left:-9999px}
@media(max-width:620px){.prompt{padding:18px;border-radius:22px}.prompt .tile{width:56px;height:56px;border-radius:12px}.prompt .tile svg{width:24px;height:24px}.prompt .top{gap:14px}.chip{padding:8px 11px;font-size:13px}.go-btn{width:100%;padding:14px}.prompt .sp{display:none}}
.seg{display:flex;align-items:center;gap:14px;margin:64px 0 18px}
.seg .tabs{display:inline-flex;gap:4px;padding:4px;border-radius:14px;background:var(--panel);border:1px solid var(--line)}
.seg .tabs span{font-size:15px;font-weight:600;padding:8px 18px;border-radius:10px;color:var(--tx3)}
.seg .tabs span.on{background:var(--line2);color:var(--tx)}
.seg .n{font-size:13px;color:var(--tx3)}
.grid{list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:12px}
.grid li{min-width:0}
@media(min-width:900px){.grid.has-feat{grid-template-columns:1.3fr 1fr 1fr}.grid.has-feat li.f{grid-row:span 2}}
@media(max-width:640px){.grid{grid-template-columns:1fr}}
.card{display:flex;gap:16px;align-items:center;height:100%;text-decoration:none;border-radius:18px;padding:18px 18px 18px 20px;background:var(--panel);border:1px solid var(--line);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);transition:transform .25s,border-color .25s,box-shadow .25s;overflow:hidden;position:relative}
.card:hover{transform:translateY(-3px);border-color:var(--line2);box-shadow:var(--shadow)}
.card .t{flex:1;min-width:0}
.card .meta{font-size:12px;color:var(--tx3);letter-spacing:.04em}
.card .meta .no{color:var(--lime-t);font-weight:600;margin-right:8px}
.card h3{font-size:16.5px;line-height:1.5;margin:4px 0 4px;font-weight:600;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.card p{color:var(--tx2);font-size:13.5px;line-height:1.6;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.thumb{flex:none;width:88px;height:88px;border-radius:14px;position:relative;overflow:hidden;display:flex;align-items:flex-end;justify-content:flex-end;padding:7px 9px;transition:transform .35s}
.thumb::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 30% 25%,rgba(255,255,255,.55),transparent 45%)}
.thumb b{position:relative;font-size:26px;font-weight:300;font-style:italic;color:#fff;line-height:1;text-shadow:0 2px 10px rgba(0,0,0,.25)}
.card:hover .thumb{transform:scale(1.06) rotate(-2deg)}
.card.feat{flex-direction:column;align-items:flex-start;justify-content:flex-end;min-height:300px;padding:30px;background:var(--feat);border-color:var(--line2);color:#F3F5F8}
.card.feat::before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent 0 9px,rgba(166,242,110,.85) 9px 11px,transparent 11px 23px,rgba(210,255,180,.45) 23px 24px);-webkit-mask-image:radial-gradient(ellipse 34% 90% at 66% 30%,#000,transparent 75%);mask-image:radial-gradient(ellipse 34% 90% at 66% 30%,#000,transparent 75%);animation:shim 7s ease-in-out infinite alternate}
.card.feat::after{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 40% 55% at 70% 18%,rgba(140,240,90,.28),transparent 70%),linear-gradient(180deg,transparent 35%,rgba(7,9,10,.9) 80%)}
@keyframes shim{from{opacity:.55;transform:translateX(-3%)}to{opacity:1;transform:translateX(3%)}}
.card.feat>*{position:relative;z-index:1}
.card.feat .meta{color:rgba(255,255,255,.55)}
.card.feat .meta .no{color:#A6F26E}
.card.feat h3{font-size:clamp(22px,2.6vw,30px);line-height:1.3;font-weight:700;letter-spacing:-.01em;margin:8px 0 8px;-webkit-line-clamp:3}
.card.feat p{color:rgba(255,255,255,.66);font-size:14.5px}
.card.feat .read{margin-top:16px;display:inline-flex;align-items:center;gap:6px;font-size:13.5px;font-weight:600;color:#0A0F08;background:var(--btn);border-radius:999px;padding:7px 16px}
.empty{color:var(--tx3);font-size:14px;padding:18px 0;grid-column:1/-1}
.rv{opacity:0;transform:translateY(18px);transition:opacity .7s ease,transform .7s cubic-bezier(.2,.7,.2,1)}
.rv.in{opacity:1;transform:none}
.progress{position:fixed;left:0;top:0;height:2px;width:0;background:var(--btn);z-index:9;box-shadow:0 0 12px rgba(166,242,110,.7)}
.art{max-width:720px;margin:0 auto}
article{padding:56px 0 8px;text-align:left}
article .meta{display:flex;flex-wrap:wrap;gap:6px 16px;font-size:13px;color:var(--tx3)}
article .meta .no{color:var(--lime-t);font-weight:600}
article h1{font-size:clamp(28px,5.4vw,44px);line-height:1.3;font-weight:700;letter-spacing:-.01em;margin:14px 0 14px;text-wrap:balance}
article .sum{color:var(--tx2);font-size:17px;padding-bottom:28px;margin-bottom:32px;border-bottom:1px solid var(--line2)}
.body{font-size:17.5px;color:var(--body)}
.body p,.body ul,.body ol,.body blockquote{margin:0 0 1.25em}
.body strong{color:var(--tx);background:linear-gradient(transparent 62%,var(--hl) 62%)}
.body h2,.body h3,.body h4{color:var(--tx);margin:2em 0 .7em;line-height:1.4;font-weight:700}
.body h2{font-size:24px;letter-spacing:-.01em}.body h3{font-size:19.5px}
.body h2::before{content:"";display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--btn);margin-right:12px;vertical-align:.2em;box-shadow:0 0 12px rgba(166,242,110,.7)}
.body ul,.body ol{padding-left:0;list-style:none;counter-reset:n}
.body li{position:relative;padding-left:24px;margin:.45em 0}
.body ul li::before{content:"";position:absolute;left:6px;top:.8em;width:6px;height:6px;border-radius:50%;background:var(--tx3)}
.body ol li{counter-increment:n}
.body ol li::before{content:counter(n);position:absolute;left:0;color:var(--lime-t);font-weight:700;font-size:15px}
.body blockquote{background:var(--panel);border:1px solid var(--line2);border-radius:16px;padding:16px 20px;color:var(--tx);position:relative;overflow:hidden}
.body blockquote::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--btn)}
.body img{max-width:100%;border-radius:14px;border:1px solid var(--line2);display:block;margin:0 auto}
.body hr{border:0;height:1px;background:var(--line2);margin:2.2em 0}
.body a{color:var(--lime-t);text-decoration:none;border-bottom:1px solid var(--hl)}
.body code{background:var(--panel2);border:1px solid var(--line);padding:1px 6px;border-radius:6px;font-size:.86em}
.art .prompt{margin:44px 0}
footer{display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;padding:30px 0 44px;margin-top:56px;border-top:1px solid var(--line);font-size:13px;color:var(--tx3)}
footer a{color:var(--tx2);text-decoration:none}
footer a:hover{color:var(--tx)}
@media(max-width:520px){header .logo{font-size:14px}.pill .txt{display:none}.pill{padding:7px 10px}.hero{padding:44px 0 24px}.hero .kick{font-size:16px}}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}.rv{opacity:1;transform:none}}`;

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap" rel="stylesheet">`;

const IC = {
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/></svg>`,
  gift: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M5 9h14v4H5zM6 13h12v8H6z"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
  out: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>`,
  spark: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c.5 4.6 2.4 7.5 8 10-5.6 2.5-7.5 5.4-8 10-.5-4.6-2.4-7.5-8-10 5.6-2.5 7.5-5.4 8-10z"/></svg>`,
  orbit: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2"><circle cx="16" cy="16" r="10"/><ellipse cx="16" cy="16" rx="14.5" ry="6" transform="rotate(-35 16 16)"/></svg>`,
};

const SUB_BOX = (source) => `<div class="prompt" id="sub">
  <form onsubmit="return nlSub(this)">
    <div class="top"><div class="tile">${IC.mail}</div><div class="txt"><b>訂閱${esc(NAME)}</b><p>有新的實驗紀錄就寄給你。開發、定價、營收變化，還有邊旅居邊工作的日子。</p>
      <input type="email" name="email" required placeholder="輸入你的 Email" autocomplete="email" aria-label="Email"></div></div>
    <input type="text" name="website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
    <input type="hidden" name="source" value="${esc(source)}">
    <div class="bot"><span class="chip">${IC.gift}免費</span><span class="chip">${IC.clock}約兩週一封</span><span class="chip">${IC.out}一鍵退訂</span><span class="sp"></span><button class="go-btn" type="submit">訂閱</button></div>
  </form>
  <div class="msg" role="status"></div>
</div>`;

const SUB_JS = `<script>
function nlSub(f){var m=f.parentNode.querySelector('.msg'),b=f.querySelector('button');b.disabled=true;m.style.color='';m.textContent='送出中…';
fetch('${SUB_FN}',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:f.email.value,website:f.website.value,source:f.source.value})})
.then(function(r){return r.json()}).then(function(j){
if(!j.ok){m.style.color='#FF7A59';m.textContent='Email 格式好像不對，再檢查一下。';return}
m.textContent=j.already?'你已經訂閱了，謝謝。':'確認信寄出了，去信箱按「確認訂閱」就完成。';f.reset();})
.catch(function(){m.style.color='#FF7A59';m.textContent='送出失敗，稍後再試一次。'}).finally(function(){b.disabled=false});return false}
</script>`;

// 主題在 <head> 先設好，避免先閃一下錯的顏色
const THEME_BOOT = `<script>(function(){var t;try{t=localStorage.getItem('lab-theme')}catch(e){}if(t!=='light'&&t!=='dark')t='dark';document.documentElement.setAttribute('data-theme',t)})()</script>`;

const head = (title, desc, url) => `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}"><meta property="og:type" content="article">
<meta property="og:image" content="${SITE}/stayjpplan.png"><meta name="twitter:card" content="summary">
<link rel="canonical" href="${url}"><link rel="alternate" type="application/json" href="${SITE}/letters/feed.json">
${THEME_BOOT}${FONTS}<style>${CSS}</style></head><body>
<a class="notice" id="notice" href="#"><span>${IC.spark}</span><span class="tt">最新一期 · <b id="noticeT"></b></span><span class="go">閱讀 →</span></a>
<div class="sky" aria-hidden="true"><i class="b1"></i><i class="b2"></i><i class="b3"></i></div>`;

const SUN = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`;
const MOON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>`;
const HEADER = `<div class="wrap"><header><a class="logo" href="/letters/">${IC.orbit}<span>${esc(NAME)}</span></a><span class="sp"></span>
<button class="pill" id="themeBtn" type="button" aria-label="切換深色/淺色"><span class="tb-l">${SUN}</span><span class="tb-d">${MOON}</span></button>
<a class="pill" href="/"><span class="txt">StayJP</span> ↗</a></header>`;
const FOOTER = `<footer><span>© ${new Date().getFullYear()} ${esc(NAME)}</span><span><a href="/letters/">所有紀錄</a> · <a href="/">日本再留計劃 StayJP</a></span></footer></div>`;

const expNo = (n) => "EXP-" + String(n).padStart(3, "0");
const readMin = (body) => Math.max(1, Math.round(body.replace(/\s/g, "").length / 450));

// 共用效果:主題切換、捲動浮現、數字跳動、打字、頂部公告條(feed.json 最新一期)。全部只在瀏覽器端,失敗也不影響內容
const FX_JS = `<script>
(function(){var b=document.getElementById('themeBtn');if(b)b.onclick=function(){var r=document.documentElement,t=r.getAttribute('data-theme')==='light'?'dark':'light';r.setAttribute('data-theme',t);try{localStorage.setItem('lab-theme',t)}catch(e){}}})();
var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
var IO='IntersectionObserver' in window&&!RM?new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');IO.unobserve(x.target)}})},{rootMargin:'0px 0px -8% 0px'}):null;
function fxReveal(root){if(!IO)return;(root||document).querySelectorAll('[data-rv]').forEach(function(el,i){el.classList.add('rv');el.style.transitionDelay=Math.min(i*70,420)+'ms';IO.observe(el)})}
function fxType(el){if(RM||!el)return;var t=el.textContent;el.textContent='';el.classList.add('typed');var i=0;(function f(){el.textContent=t.slice(0,++i);if(i<t.length)setTimeout(f,40)})()}
function fxNotice(all,skip){var it=all.filter(function(i){return i.slug!==skip})[0];if(!it)return;var n=document.getElementById('notice');n.href='/letters/'+it.slug;document.getElementById('noticeT').textContent=it.title;n.classList.add('on')}
fxReveal();
</script>`;

// 卡片(瀏覽器端用 feed.json 畫,排程到期的期數不用重 build 就會出現)。feat=第一張做成大張精選
const CARD_JS = `var THUMB=['#3B82F6,#22D3EE','#F97316,#F43F5E','#8B5CF6,#EC4899','#10B981,#A3E635','#F59E0B,#EF4444','#06B6D4,#6366F1'];
function nlCards(its,all,feat){var e=function(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
var asc=all.slice().sort(function(a,b){return Date.parse(a.send_at)-Date.parse(b.send_at)});
return its.map(function(i,k){var n=asc.indexOf(i)+1,d=new Date(Date.parse(i.send_at)+8*36e5).toISOString().slice(0,10).replace(/-/g,'/'),no='EXP-'+String(n).padStart(3,'0');
if(feat&&k===0)return '<li class="f" data-rv><a class="card feat" href="/letters/'+e(i.slug)+'"><div class="meta"><span class="no">最新 · '+no+'</span>'+d+'</div><h3>'+e(i.title)+'</h3>'+(i.summary?'<p>'+e(i.summary)+'</p>':'')+'<span class="read">閱讀 →</span></a></li>';
return '<li data-rv><a class="card" href="/letters/'+e(i.slug)+'"><div class="t"><div class="meta"><span class="no">'+no+'</span>'+d+'</div><h3>'+e(i.title)+'</h3>'+(i.summary?'<p>'+e(i.summary)+'</p>':'')+'</div><span class="thumb" style="background:linear-gradient(135deg,'+THUMB[(n-1)%THUMB.length]+')"><b>'+String(n).padStart(2,'0')+'</b></span></a></li>'}).join('')}`;

function webPage(it, no) {
  const url = `${SITE}/letters/${it.slug}`;
  return head(`${it.title}｜${NAME}`, it.summary || TAGLINE, url) + `<div class="progress" id="pg"></div>` + HEADER +
    `<div class="art"><article><div class="meta"><span class="no">${no ? expNo(no) : "DRAFT"}</span><span>${twDate(it.send_at)}</span><span>${readMin(it.body)} min read</span></div>
<h1>${esc(it.title)}</h1>${it.summary ? `<p class="sum">${esc(it.summary)}</p>` : ""}<div class="body">${md(it.body)}</div></article>
${SUB_BOX("article_" + it.slug)}</div>
<section class="more" id="more" hidden><div class="seg"><div class="tabs"><span class="on">更多紀錄</span></div></div><ul class="grid" id="moreList"></ul></section>
${FOOTER}${SUB_JS}${FX_JS}<script>
${CARD_JS}
(function(){var p=document.getElementById('pg');addEventListener('scroll',function(){var h=document.documentElement;p.style.width=(h.scrollTop/Math.max(1,h.scrollHeight-h.clientHeight)*100)+'%'},{passive:true})})();
fetch('/letters/feed.json').then(function(r){return r.json()}).then(function(f){var now=Date.now(),all=(f.issues||[]).filter(function(i){return Date.parse(i.send_at)<=now});
fxNotice(all,'${it.slug}');
var o=all.filter(function(i){return i.slug!=='${it.slug}'}).slice(0,4);if(!o.length)return;var L=document.getElementById('moreList');L.innerHTML=nlCards(o,all,false);document.getElementById('more').hidden=false;fxReveal(L)}).catch(function(){});
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
    `<section class="hero"><div class="kick">${esc(NAME)}</div><h1>One person. Building in public.</h1><p id="tl">${esc(TAGLINE)}</p>
<div class="prompt" id="ok" hidden><div class="top"><div class="tile">${IC.mail}</div><div class="txt"><b>訂閱完成</b><p>下一份紀錄出來就會寄給你。</p></div></div></div>
${SUB_BOX("letters")}</section>
<div class="seg"><div class="tabs"><span class="on">實驗紀錄</span></div><span class="n" id="expN"></span></div>
<ul class="grid" id="list"><li class="empty">第一份紀錄準備中</li></ul>
${FOOTER}${SUB_JS}${FX_JS}<script>
${CARD_JS}
if(/subscribed=1/.test(location.search)){document.getElementById('ok').hidden=false;document.getElementById('sub').hidden=true}
fxType(document.getElementById('tl'));
fetch('/letters/feed.json?_='+Date.now()).then(function(r){return r.json()}).then(function(f){
var now=Date.now(),its=(f.issues||[]).filter(function(i){return Date.parse(i.send_at)<=now});
document.getElementById('expN').textContent=its.length+' 篇';fxNotice(its,'');
if(its.length){var L=document.getElementById('list');L.classList.toggle('has-feat',its.length>=3);L.innerHTML=nlCards(its,its,its.length>=3);fxReveal(L)}});
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
