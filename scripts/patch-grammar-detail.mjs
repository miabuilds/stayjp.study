// 文法詳解精準修補:照 review-grammar-detail.mjs 的審稿意見,只改有問題的句子,其他一字不動(整篇重寫會一直冒出新問題,收斂不了)。
// 用法: node scripts/patch-grammar-detail.mjs [id …]   (沒給 id = 所有審稿沒過的)
import fs from 'node:fs';
import { check } from './gen-grammar-detail.mjs';
try { process.loadEnvFile(new URL('../.env', import.meta.url)); } catch {}
const KEY = process.env.PROJECT_ANTHROPIC_KEY;
const D = new URL('../scripts/out/grammar-detail/', import.meta.url).pathname;
const want = process.argv.slice(2).filter(a => !a.startsWith('--'));
const SYSTEM = `你是日語教材編輯。下面是一篇文法詳解的 HTML,以及審稿老師挑出的問題。請只修改被指出有問題的地方,其他內容、HTML 結構、標籤、class 一字不改。
- 審稿意見你判斷不成立的就不改(例如只是排版上「兩組變化黏在同一行」:App 裡 gd-pair 會分開顯示,不用改)。
- 修改時維持原本的口語、台灣用語、繁體中文;日文用日本的寫法(不可用繁體字)。
- 只輸出 JSON:{"html":"修改後的完整 HTML","changed":["改了哪裡(一條一句)"]}`;
function firstJson(t) {
  const i = t.indexOf('{'); let d = 0, inS = false, esc = false;
  for (let k = i; k < t.length; k++) { const c = t[k];
    if (inS) { if (esc) esc = false; else if (c === '\\') esc = true; else if (c === '"') inS = false; continue; }
    if (c === '"') inS = true; else if (c === '{') d++; else if (c === '}' && --d === 0) return JSON.parse(t.slice(i, k + 1)); }
  throw new Error('json');
}
const ids = fs.readdirSync(D).filter(f => f.endsWith('.review.json')).map(f => f.replace('.review.json', ''))
  .filter(id => !want.length || want.includes(id))
  .filter(id => { const rv = JSON.parse(fs.readFileSync(D + id + '.review.json', 'utf8')); return !rv.ok && rv.problems.length; });
console.log('to patch', ids.length);
await Promise.all(Array.from({ length: 6 }, async () => {
  while (ids.length) {
    const id = ids.shift(); const j = JSON.parse(fs.readFileSync(D + id + '.json', 'utf8'));
    const rv = JSON.parse(fs.readFileSync(D + id + '.review.json', 'utf8'));
    const user = `HTML:\n${j.html}\n\n審稿意見:\n` + rv.problems.map((p, i) => `${i + 1}. 「${p.quote}」:${p.why} → 建議:${p.fix}`).join('\n');
    for (let a = 1; a <= 3; a++) {
      try {
        const r = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST',
          headers: { 'content-type': 'application/json', 'x-api-key': KEY, 'anthropic-version': '2023-06-01' },
          body: JSON.stringify({ model: 'claude-opus-5-5', max_tokens: 16000, output_config: { effort: 'high' }, system: SYSTEM, messages: [{ role: 'user', content: user }] }),
          signal: AbortSignal.timeout(300000) });
        const d = await r.json(); if (d.error) throw new Error(JSON.stringify(d.error).slice(0, 200));
        const o = firstJson((d.content || []).filter(c => c.type === 'text').map(c => c.text).join(''));
        const bad = check(o.html); if (bad) throw new Error('check ' + bad);
        fs.writeFileSync(D + id + '.json', JSON.stringify({ ...j, html: o.html, patched: (j.patched || 0) + 1, patchNotes: o.changed }, null, 1));
        console.log(id, 'patched:', (o.changed || []).join(' / ').slice(0, 200)); break;
      } catch (e) { console.error(id, 'attempt', a, e.message); }
    }
  }
}));
