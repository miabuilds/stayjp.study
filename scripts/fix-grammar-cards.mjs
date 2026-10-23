// 文法卡片本身(公式 p / 摘要 ex / 例句 eg)的修正:gen-grammar-detail.mjs 寫詳解時順便挑出的 issues,
// 交給 claude-opus-5-5「最小幅度」修正 → scripts/out/grammar-cards/<id>.json(只是提案,不直接改檔)。
// 套用: node scripts/fix-grammar-cards.mjs --apply   (寫回 grammar-n*.js,印出改了哪些例句 → 要補 TTS)
// 用法: node scripts/fix-grammar-cards.mjs [n5 …|id …] [--force] | --apply
import fs from 'node:fs';
try { process.loadEnvFile(new URL('../.env', import.meta.url)); } catch {}
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
const DET = ROOT + 'scripts/out/grammar-detail/', OUT = ROOT + 'scripts/out/grammar-cards/';
fs.mkdirSync(OUT, { recursive: true });
const LVS = ['n5', 'n4', 'n3', 'n2', 'n1'];
const args = process.argv.slice(2), FORCE = args.includes('--force'), APPLY = args.includes('--apply');
const want = args.filter(a => !a.startsWith('--'));
const load = lv => new Function(fs.readFileSync(ROOT + `grammar-${lv}.js`, 'utf8') + ';return ' + lv.toUpperCase())();
const strip = s => String(s || '').replace(/<[^>]+>/g, '');

const SYSTEM = `你是日語教材編輯。App 的每個文法點有一張卡片:接續公式 p、一句摘要 ex、例句 eg(j=日文,用 <em>…</em> 標出文法重點;z=中文翻譯;g=小標籤,可能沒有)。
另一位老師審過這張卡片,列出了問題。請「最小幅度」修正後輸出整張卡片:
- p(公式):要讓零基礎看得懂。動詞類別寫「第一類」「第二類」「第三類」(可加括號五段/一段),表示拿掉就寫「去掉る」或用箭頭「る→よう」,不要寫「去る」「去ます」(會被看成日文動詞),附一個具體例子更好。保持一行、60 字內。
- ex(摘要):一兩句白話講這個文法的意思與用途,80 字內。可用「」。
- eg:例句只有在「文法錯、不自然、不符合這個文法的用法、程度明顯超出該級」時才換;只是「可以更自然一點」的偏好,一律保留原句不動(改例句要重錄音,成本高)。翻譯 z 錯或不順就改。例句數量不變、順序不變、g 標籤原樣保留、每句一定要有 <em> 標出文法重點。
- 審稿意見不一定都對:你判斷不成立的就不改。
- 全部用繁體中文、台灣用語。
只輸出 JSON:{"p":"…","ex":"…","eg":[{"j":"…","z":"…","g":"(原本有才寫)"}],"changes":["改了什麼、為什麼(一條一句)"]}`;

async function fix(lv, g, issues) {
  const KEY = process.env.PROJECT_ANTHROPIC_KEY;
  const user = `級別:${lv.toUpperCase()}　標題:${g.t}\n目前卡片:${JSON.stringify({ p: g.p, ex: g.ex, eg: g.eg })}\n\n審稿意見:\n${issues.map((x, i) => `${i + 1}. ${x}`).join('\n')}`;
  for (let a = 1; a <= 3; a++) {
    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': KEY, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: 'claude-opus-5-5', max_tokens: 10000, output_config: { effort: 'high' },
          system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }], messages: [{ role: 'user', content: user }] }),
        signal: AbortSignal.timeout(300000),
      });
      const d = await r.json(); if (d.error) throw new Error(JSON.stringify(d.error).slice(0, 200));
      const txt = (d.content || []).filter(c => c.type === 'text').map(c => c.text).join('');
      const o = firstJson(txt);
      const bad = checkCard(g, o); if (bad) throw new Error('check: ' + bad);
      return o;
    } catch (e) { console.error(g.id, 'attempt', a, e.message); if (a === 3) return null; await new Promise(r => setTimeout(r, 3000 * a)); }
  }
}
function checkCard(g, o) {
  if (!o.p || !o.ex || !Array.isArray(o.eg)) return 'shape';
  if (o.eg.length !== (g.eg || []).length) return 'eg count';
  for (let i = 0; i < o.eg.length; i++) {
    const e = o.eg[i], e0 = g.eg[i];
    if (!e.j || !e.z) return 'eg empty';
    if (!/<em>.+?<\/em>/.test(e.j)) return 'no em ' + i;
    if ((e0.g || '') !== (e.g || '')) { if (e0.g) e.g = e0.g; else delete e.g; }   // g 標籤一律保留原值
  }
  if (/去(る|ます)/.test(o.p + o.ex)) return '去る';
  // 日文例句混進中文繁體字(實測:学校→學校)
  const ZH_ONLY = /[學們說這會對經還讓從嗎呢吧裡歡來國讀聽賣寫關當麵雞鐘實體廣變號]/;
  for (const e of o.eg) { const t = strip(e.j); if (ZH_ONLY.test(t) && !(g.eg.some(x => strip(x.j) === t))) return 'zh char in j: ' + t; }
  if (strip(o.p).length > 90) return 'p too long';
  return '';
}

const ser = o => '{' + Object.entries(o).map(([k, v]) => k + ':' + (Array.isArray(v)
  ? '[' + v.map(e => '{' + Object.entries(e).map(([a, b]) => a + ':' + JSON.stringify(b)).join(',') + '}').join(',') + ']'
  : JSON.stringify(v))).join(',') + '},';

if (APPLY) {
  const changedJ = [];
  for (const lv of LVS) {
    const f = ROOT + `grammar-${lv}.js`; let src = fs.readFileSync(f, 'utf8');
    for (const g of load(lv)) {
      const pf = OUT + g.id + '.json'; if (!fs.existsSync(pf)) continue;
      const o = JSON.parse(fs.readFileSync(pf, 'utf8'));
      let old = ser(g), tail = '';
      if (!src.includes(old)) { old = old.slice(0, -1); tail = ''; if (!src.includes(old)) { console.error('skip(序列化對不上原文):', g.id); continue; } } else tail = ',';   // 每級最後一張沒有逗號
      const ng = { ...g, p: o.p, ex: o.ex, eg: o.eg.map(e => { const x = { j: e.j, z: e.z }; if (e.g) x.g = e.g; return x; }) };
      ng.eg.forEach((e, i) => { if (strip(e.j) !== strip(g.eg[i].j)) changedJ.push(`${g.id}\t${strip(g.eg[i].j)}\t→\t${strip(e.j)}`); });
      src = src.replace(old, ser(ng).slice(0, -1) + tail);
    }
    fs.writeFileSync(f, src);
  }
  fs.writeFileSync(OUT + '_changed-sentences.tsv', changedJ.join('\n') + '\n');
  console.log('applied. 例句改了', changedJ.length, '句 → 要補 TTS(scripts/out/grammar-cards/_changed-sentences.tsv)');
} else {
  const todo = [];
  for (const lv of LVS) for (const g of load(lv)) {
    if (want.length && !want.includes(lv) && !want.includes(g.id)) continue;
    const df = DET + g.id + '.json'; if (!fs.existsSync(df)) continue;
    const issues = JSON.parse(fs.readFileSync(df, 'utf8')).issues || [];
    if (!issues.length || (!FORCE && fs.existsSync(OUT + g.id + '.json'))) continue;
    todo.push([lv, g, issues]);
  }
  console.log('cards to fix', todo.length);
  let done = 0;
  await Promise.all(Array.from({ length: 6 }, async () => {
    while (todo.length) {
      const [lv, g, issues] = todo.shift(); const o = await fix(lv, g, issues);
      if (o) { fs.writeFileSync(OUT + g.id + '.json', JSON.stringify(o, null, 1)); done++; }
    }
  }));
  console.log('proposals', done);
}
