// 文法詳解第二道關卡:另一次 claude-opus-5-5 當審稿老師,逐筆挑錯(日文自然度/變化規則/翻譯/說法正確性)。
// 結果寫 scripts/out/grammar-detail/<id>.review.json({ok, problems[]});有問題的 id 用
//   node scripts/gen-grammar-detail.mjs <id…> --force   重產(gen 會把 review 的 problems 當修改意見帶進去),再重審。
// 用法: node scripts/review-grammar-detail.mjs [n5 …|id …] [--force]
import fs from 'node:fs';
try { process.loadEnvFile(new URL('../.env', import.meta.url)); } catch {}
const KEY = process.env.PROJECT_ANTHROPIC_KEY; if (!KEY) { console.error('no key'); process.exit(1); }
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
const CONC = 6;
const args = process.argv.slice(2), FORCE = args.includes('--force');
const want = args.filter(a => !a.startsWith('--'));
const LVS = ['n5', 'n4', 'n3', 'n2', 'n1'];
const G = {};
for (const lv of LVS) for (const g of new Function(fs.readFileSync(ROOT + `grammar-${lv}.js`, 'utf8') + ';return ' + lv.toUpperCase())()) G[g.id] = g;
const plain = h => String(h).replace(/<\/span><\/span>(?=<span class='gd-pair'>)/g, '</span></span>；').replace(/<span class='gd-tag'>([^<]*)<\/span>/g, '【$1】').replace(/<div class='gd-h'>/g, '\n## ').replace(/<br>/g, '\n').replace(/<div class='gd-(ex-line|sec|warn)'>/g, '\n').replace(/<[^>]+>/g, '').trim();

const SYSTEM = `你是日語教學的資深審稿老師(日語母語程度、熟悉 JLPT 與台灣學習者)。要審一篇給台灣初學者看的文法詳解,只挑「真的錯」的地方:
1. 日文例句不自然、文法錯、日本人不會這樣講、程度明顯超出該級
2. 變化規則、接續說明錯誤或有漏洞(會讓學生照著做就做錯)
3. 中文翻譯錯或意思偏掉
4. 說明的內容本身錯誤(用法、語感、禮貌程度、與相似文法的區別講錯)
5. 中國用語(視頻、質量、信息…)或簡體字
不要挑風格、字數、「可以補充更多」這種偏好;寫得對就算普通也不要挑。
只輸出 JSON:{"ok":true|false,"problems":[{"quote":"原文有問題的片段","why":"錯在哪","fix":"建議改法"}]}  沒問題就 {"ok":true,"problems":[]}`;

async function review(id) {
  const j = JSON.parse(fs.readFileSync(OUT + id + '.json', 'utf8')); const g = G[id];
  const user = `文法:${g.t}(${id.split('-')[0].toUpperCase()})接續:${g.p}\n\n詳解全文:\n${plain(j.html)}`;
  for (let a = 1; a <= 3; a++) {
    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': KEY, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: 'claude-opus-5-5', max_tokens: 12000, output_config: { effort: 'high' },
          system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }], messages: [{ role: 'user', content: user }] }),
        signal: AbortSignal.timeout(300000),
      });
      const d = await r.json(); if (d.error) throw new Error(JSON.stringify(d.error).slice(0, 200));
      const txt = (d.content || []).filter(c => c.type === 'text').map(c => c.text).join('');
      const o = firstJson(txt);
      o.problems = o.problems || []; o.ok = !o.problems.length; o.usage = d.usage; o.reviewedHtml = j.html;
      return o;
    } catch (e) { console.error(id, 'attempt', a, e.message); if (a === 3) return null; await new Promise(r => setTimeout(r, 3000 * a)); }
  }
}

const ids = fs.readdirSync(OUT).filter(f => /^n\d-\d+\.json$/.test(f)).map(f => f.replace('.json', ''))
  .filter(id => !want.length || want.includes(id) || want.includes(id.split('-')[0]))
  .filter(id => {
    if (FORCE || !fs.existsSync(OUT + id + '.review.json')) return true;
    const rv = JSON.parse(fs.readFileSync(OUT + id + '.review.json', 'utf8'));
    return rv.reviewedHtml !== JSON.parse(fs.readFileSync(OUT + id + '.json', 'utf8')).html;   // 重產過就重審
  });
console.log('to review', ids.length);
let bad = [], cost = 0;
async function worker() {
  while (ids.length) {
    const id = ids.shift(); const o = await review(id); if (!o) { bad.push(id + '(err)'); continue; }
    const u = o.usage || {}; cost += ((u.input_tokens || 0) + (u.cache_read_input_tokens || 0) * 0.1 + (u.cache_creation_input_tokens || 0) * 1.25) * 4 / 1e6 + (u.output_tokens || 0) * 20 / 1e6;
    fs.writeFileSync(OUT + id + '.review.json', JSON.stringify(o, null, 1));
    if (!o.ok) bad.push(id);
  }
}
await Promise.all(Array.from({ length: CONC }, worker));
console.log('flagged', bad.length, bad.join(' '), `cost≈$${cost.toFixed(2)}`);
