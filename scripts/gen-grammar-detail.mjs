// 文法詳解改寫成「老師在旁邊講給你聽」的口吻(2026-10-24,探長J 回饋:詳解太短、術語多,小白看不懂)。
// 每筆一次 claude-opus-5-5 → scripts/out/grammar-detail/<id>.json({html, issues}),已存在就跳過(可中斷續跑)。
// 寫完跑 node scripts/build-grammar-detail.mjs 合併進 grammar-detail.js。
// 用法: node scripts/gen-grammar-detail.mjs [n5 n4 …|id …] [--force]   (key 讀專案 .env 的 PROJECT_ANTHROPIC_KEY)
import fs from 'node:fs';
try { process.loadEnvFile(new URL('../.env', import.meta.url)); } catch {}
const KEY = process.env.PROJECT_ANTHROPIC_KEY; if (!KEY) { console.error('no key: 請在專案根目錄 .env 填 PROJECT_ANTHROPIC_KEY'); process.exit(1); }
// 抓第一個完整的 JSON 物件(模型偶爾在後面多寫說明或第二段)
function firstJson(t) {
  const i = t.indexOf('{'); if (i < 0) throw new Error('no json');
  let d = 0, inS = false, esc = false;
  for (let k = i; k < t.length; k++) {
    const c = t[k];
    if (inS) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === '"') inS = false; continue; }
    if (c === '"') inS = true; else if (c === '{') d++; else if (c === '}' && --d === 0) return JSON.parse(t.slice(i, k + 1));
  }
  throw new Error('unterminated json');
}
const ROOT = new URL('..', import.meta.url).pathname;
const OUT = ROOT + 'scripts/out/grammar-detail/';
fs.mkdirSync(OUT, { recursive: true });
const MODEL = 'claude-opus-5-5', CONC = 6;

const args = process.argv.slice(2), FORCE = args.includes('--force');
const want = args.filter(a => !a.startsWith('--'));
const LVS = ['n5', 'n4', 'n3', 'n2', 'n1'];
const load = (f, name) => new Function(fs.readFileSync(ROOT + f, 'utf8') + ';return ' + name)();
const G = Object.fromEntries(LVS.map(lv => [lv, load(`grammar-${lv}.js`, lv.toUpperCase())]));
const OLD = {};   // 現行詳解(2026-10-24 起拆成每級一檔)
for (const lv of LVS) { const f = ROOT + `grammar-detail-${lv}.js`; if (fs.existsSync(f)) Object.assign(OLD, new Function('window', fs.readFileSync(f, 'utf8') + ';return window.GRAMMAR_DETAIL')({})); }
const SAMPLES = new Function('window', fs.readFileSync(ROOT + 'scripts/grammar-detail-samples.js', 'utf8') + ';return window.GD_SAMPLES')({});
const strip = s => String(s || '').replace(/<[^>]+>/g, '');

const SYSTEM = `你是在台灣教日文很多年的老師,現在要幫日文 App「日本再留計劃」重寫文法詳解。讀者是台灣人,很多是零基礎的「小白」:看到術語會卡住,需要老師用聊天的方式一步一步講,看完要真的懂、真的會用。

## 寫法
- 像老師坐在旁邊跟學生講話:用「你」,台灣口語、繁體中文、台灣用語(不要「視頻、質量、信息」這類中國用語)。不要客套、不要「讓我們一起」「希望對你有幫助」這種廢話,不要 emoji。
- 第一段「一句話先懂」:用一兩句話講這個文法在幹嘛,最好用台灣人熟悉的中文說法或生活情境類比。
- 術語能不用就不用;非用不可時,第一次出現就用白話解釋。動詞分類一律寫「第一類（五段動詞）」「第二類（一段動詞）」「第三類（する・来る）」。變化規則要用具體的字一步一步示範(例:行く → く換成こ → 行こう),不要只寫「う段→お段」這種公式。不要用「去」字表示拿掉(「去る」「去ます」會被看成日文),要寫「把る拿掉」「把ます拿掉」。
- 例句要短、自然、日本人真的會講的話,程度符合該級;每句後面附中文翻譯。例句裡不要自己加假名或括號讀音(App 會自動標)。
- 一定要寫「容易搞錯的地方」:初學者真的會犯的錯(接續錯、念法、語氣/禮貌程度、跟中文直覺不同的地方)。
- 有長得像、意思像、容易混用的文法,就寫「跟長得很像的分清楚」,用同一個情境的對照例句講差別,最後給一句判斷小訣竅。只比較真的會搞混的,不要硬湊。
- 正確性第一:不確定的用法不要寫;不要編造規則或例外。
- 長度:簡單的文法 400~700 字,複雜或易混的 700~1200 字。寧可講清楚,不要灌水。

## HTML 格式(只能用這些,不要 markdown、不要其他標籤或 style)
- 小標:<div class='gd-h'>小標</div>  (固定第一個是「一句話先懂」;其他依內容選:「什麼時候用」「怎麼接」「怎麼變：先看動詞是哪一類」「最常聽到的樣子」「容易搞錯的地方」「跟長得很像的分清楚」「學會之後可以接著學」)
- 段落:<div class='gd-sec'>…</div>,段落內換行用 <br>,強調用 <b>…</b>
- 標籤:<span class='gd-tag'>短標籤</span>(放在 gd-sec 開頭,標用法類型)
- 例句一行一句:<div class='gd-ex-line'>・<span class='gd-jp'>日文</span>（中文翻譯）</div>
- 句中夾日文:<span class='gd-jp'>日文</span>(所有日文都要包 gd-jp,App 才會標假名、可點查)
- 變化示範「A → B」:<span class='gd-pair'><span class='gd-jp'>A</span> → <span class='gd-jp'>B</span></span>(整組包 gd-pair 才不會在手機上斷行)
- 提醒框:<div class='gd-warn'>…</div>(放「容易搞錯的地方」或判斷小訣竅)
- 屬性一律用單引號。

## 輸出
只輸出一個 JSON 物件,不要任何其他文字:
{"html":"詳解 HTML","issues":["這張卡片『原本的』公式/摘要/例句如果有錯、不自然或翻譯不對,逐條寫出來(含建議改法);沒有就空陣列"]}`;

const samplesText = Object.entries(SAMPLES).map(([id, html]) => `### 範本 ${id}\n${html}`).join('\n\n');

// 上一版被 review-grammar-detail.mjs 挑出問題 → 重產時把審稿意見帶進去
function reviewNote(id) {
  try {
    const rv = JSON.parse(fs.readFileSync(OUT + id + '.review.json', 'utf8'));
    if (rv.ok || !rv.problems?.length) return '';
    return `\n\n上一版被審稿老師指出以下問題,這次一定要避開(其他寫得好的部分可以保留):\n` + rv.problems.map((p, i) => `${i + 1}. 「${p.quote}」:${p.why} → 建議:${p.fix}`).join('\n');
  } catch { return ''; }
}

function userMsg(lv, g) {
  const sameLv = G[lv].map(x => `${x.id} ${x.t}`).join('、');
  return `現在要寫的文法(${lv.toUpperCase()}):
- id:${g.id}
- 分類:${g.cat}
- 標題:${g.t}
- 接續公式(卡片上方顯示):${g.p}
- 一句摘要(卡片上方顯示):${strip(g.ex)}
- 卡片例句:${(g.eg || []).map(e => `${strip(e.j)}（${e.z}）`).join(' / ')}
- 舊版詳解(太短、術語多;裡面正確的重點可以保留,有錯的不要沿用):${strip(OLD[g.id] || '(無)')}
- 同級其他文法(寫「跟長得很像的分清楚」時可參考,不要比較不存在的東西):${sameLv}${reviewNote(g.id)}`;
}

async function call(lv, g) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': KEY, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: MODEL, max_tokens: 16000, output_config: { effort: 'high' }, system: [{ type: 'text', text: SYSTEM + '\n\n## 已核可的範本(照同樣的語氣、結構、格式寫,內容當然要針對要寫的文法)\n\n' + samplesText, cache_control: { type: 'ephemeral' } }], messages: [{ role: 'user', content: userMsg(lv, g) }] }),
        signal: AbortSignal.timeout(300000),
      });
      const d = await r.json();
      if (d.error) throw new Error(JSON.stringify(d.error).slice(0, 200));
      if (d.stop_reason === 'refusal' || d.stop_reason === 'max_tokens') throw new Error('stop ' + d.stop_reason);
      const txt = (d.content || []).filter(c => c.type === 'text').map(c => c.text).join('');
      const j = firstJson(txt);
      const bad = check(j.html);
      if (bad) throw new Error('check: ' + bad);
      return { id: g.id, lv, html: j.html, issues: j.issues || [], usage: d.usage };
    } catch (e) {
      console.error(g.id, 'attempt', attempt, e.message);
      if (attempt === 3) return null;
      await new Promise(r => setTimeout(r, 3000 * attempt));
    }
  }
}

// 格式關卡:只准白名單標籤/class、要有核心段落、長度合理、沒有違禁寫法
export function check(html) {
  if (typeof html !== 'string') return 'no html';
  const tags = html.match(/<[^>]+>/g) || [];
  for (const t of tags) {
    if (/^<\/(div|span|b)>$/.test(t) || t === '<br>' || t === '<b>') continue;
    if (/^<div class='gd-(h|sec|ex-line|warn)'>$/.test(t) || /^<span class='gd-(jp|tag|pair)'>$/.test(t)) continue;
    return 'tag ' + t;
  }
  const opens = (html.match(/<(div|span|b)[ >]/g) || []).length, closes = (html.match(/<\/(div|span|b)>/g) || []).length;
  if (opens !== closes) return `unbalanced ${opens}/${closes}`;
  if (!html.startsWith("<div class='gd-h'>一句話先懂</div>")) return 'first heading';
  if (!/容易搞錯/.test(html)) return 'no pitfalls';
  const len = strip(html).length;
  if (len < 250 || len > 2200) return 'len ' + len;
  if (/去(る|ます)/.test(strip(html))) return '去る';
  if (/[\u{1F300}-\u{1FAFF}☀-➿]/u.test(html.replace(/[✓✔✗✘✕✖]/g, ''))) return 'emoji';   // ✓✗ 放行,合併時轉 ○×
  if (/<rt>|<ruby>/.test(html)) return 'manual ruby';
  for (const m of html.matchAll(/<span class='gd-jp'>([^<]*)<\/span>/g))   // 中文句子被包成日文(實測:我吃麵包)
    if (/[學們說這會對經還讓從嗎呢吧裡歡來國讀聽賣寫關當麵雞鐘實體廣變號我你他她]/.test(m[1]) && !/[ぁ-ゖァ-ヺ]/.test(m[1])) return 'zh in gd-jp: ' + m[1];
  return '';
}

const todo = [];
for (const lv of LVS) for (const g of G[lv]) {
  if (want.length && !want.includes(lv) && !want.includes(g.id)) continue;
  if (!FORCE && fs.existsSync(OUT + g.id + '.json')) continue;
  todo.push([lv, g]);
}
console.log('todo', todo.length);
let done = 0, fail = [], tin = 0, tout = 0;
async function worker() {
  while (todo.length) {
    const [lv, g] = todo.shift();
    const res = await call(lv, g);
    if (!res) { fail.push(g.id); continue; }
    tin += (res.usage.input_tokens || 0) + (res.usage.cache_creation_input_tokens || 0) * 1.25 + (res.usage.cache_read_input_tokens || 0) * 0.1; tout += res.usage.output_tokens || 0;
    fs.writeFileSync(OUT + g.id + '.json', JSON.stringify(res, null, 1));
    done++;
    if (done % 10 === 0) console.log('done', done, 'left', todo.length, `cost≈$${(tin * 4 / 1e6 + tout * 20 / 1e6).toFixed(2)}`);
  }
}
if (process.argv[1] && process.argv[1].endsWith('gen-grammar-detail.mjs')) {
  await Promise.all(Array.from({ length: CONC }, worker));
  console.log('finished', done, 'fail', fail.join(',') || 0, `cost≈$${(tin * 4 / 1e6 + tout * 20 / 1e6).toFixed(2)}`);
}
