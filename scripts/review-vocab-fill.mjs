#!/usr/bin/env node
// 新字第二審:把 gen-vocab-fill 產的條目交給 Opus 逐條檢查(讀音/繁中台灣用語/詞性/例句自然度與級別/例句有沒有用到該字),
// 回 ok / fix(給修正欄位) / reject。修正直接套進 <dir>/<lv>.json,退回的標 _reject。
// 用法:node scripts/review-vocab-fill.mjs <pool-dir> [--levels n4,n3,n2] [--batch 25] [--par 3]
import fs from 'node:fs';
import path from 'node:path';
try { process.loadEnvFile(new URL('../.env', import.meta.url)); } catch {}
const KEY = process.env.PROJECT_ANTHROPIC_KEY; if (!KEY) { console.error('no key'); process.exit(1); }
const [dir] = process.argv.slice(2); const args = process.argv.slice(3);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const LEVELS = opt('--levels', 'n4,n3,n2').split(','); const BATCH = parseInt(opt('--batch', '25'), 10); const PAR = parseInt(opt('--par', '3'), 10);
const LV = { n4: 'JLPT N4', n3: 'JLPT N3', n2: 'JLPT N2' };
const SYSTEM = `你是嚴格的日語教材審稿人(母語級日文、台灣繁體中文)。逐條檢查單字條目,輸出 JSON 陣列,每項對應輸入編號:
{"i":編號,"v":"ok"} 或 {"i":編號,"v":"fix","fix":{只放要改的欄位:r/m/c/t/ex:{j,z,e}},"why":"一句"} 或 {"i":編號,"v":"reject","why":"一句"}。
檢查重點:(1) r 讀音是否正確(平假名;外來語片假名);(2) m 是否正確、自然的台灣繁體中文(不要中國用語如「視頻/軟件/質量」,不要簡體字),2~8 字;(3) c 詞性 名/動/い形/な形/副/他 是否正確,動詞要有 t 自/他/両;(4) ex.j 例句是否自然、語法正確、難度符合該級別、而且真的用到這個字(活用形可);(5) ex.z 中文翻譯要準、是台灣口語;(6) ex.e 英文要準。
reject 的情況:這個字太生僻/古語/專有名詞/不是學習者需要的字、或整條錯到不值得修。能修就 fix,別輕易 reject。只輸出 JSON。`;
async function ask(lv, items) {
  const list = items.map((e, i) => `${i + 1}. ${JSON.stringify({ w: e.w, r: e.r, m: e.m, c: e.c, ...(e.t ? { t: e.t } : {}), ex: e.ex })}`).join('\n');
  const body = { model: 'claude-opus-5-5', max_tokens: 12000, system: SYSTEM, messages: [{ role: 'user', content: `級別:${LV[lv]}\n${list}` }] };
  for (let a = 0; a < 4; a++) {
    try { const r = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': KEY, 'anthropic-version': '2023-06-01' }, body: JSON.stringify(body) }); const d = await r.json(); if (!d.content) throw new Error(JSON.stringify(d).slice(0, 160)); const t = d.content.map(c => c.text || '').join(''); return JSON.parse(t.slice(t.indexOf('['), t.lastIndexOf(']') + 1)); }
    catch (e) { if (a === 3) { console.error('review fail', e.message.slice(0, 120)); return null; } await new Promise(r => setTimeout(r, 4000 * (a + 1))); }
  }
}
const log = [];
for (const lv of LEVELS) {
  const file = path.join(dir, `${lv}.json`); const pool = JSON.parse(fs.readFileSync(file, 'utf8'));
  const todo = pool.map((e, i) => i).filter(i => !pool[i]._reviewed);
  let ok = 0, fix = 0, rej = 0;
  for (let p = 0; p < todo.length; p += BATCH * PAR) {
    const groups = []; for (let g = 0; g < PAR && p + g * BATCH < todo.length; g++) groups.push(todo.slice(p + g * BATCH, p + (g + 1) * BATCH));
    const results = await Promise.all(groups.map(idx => ask(lv, idx.map(i => pool[i]))));
    groups.forEach((idx, g) => { const res = results[g]; if (!res) return;
      for (const r of res) { const i = idx[(r.i | 0) - 1]; if (i == null || !pool[i]) continue; const e = pool[i]; e._reviewed = 1;
        if (r.v === 'ok') ok++;
        else if (r.v === 'fix' && r.fix) { fix++; const f = r.fix; if (f.r) e.r = f.r; if (f.m) e.m = f.m; if (f.c) e.c = f.c; if (f.t) e.t = f.t; if (f.ex) e.ex = { ...e.ex, ...f.ex }; if (e.c !== '動') delete e.t; log.push([lv, e.w, 'fix', r.why || '', JSON.stringify(f)]); }
        else if (r.v === 'reject') { rej++; e._reject = r.why || 'reject'; log.push([lv, e.w, 'reject', r.why || '']); }
      } });
    fs.writeFileSync(file, JSON.stringify(pool));
    console.log(`[${lv}] ${Math.min(p + BATCH * PAR, todo.length)}/${todo.length} ok ${ok} fix ${fix} reject ${rej}`);
  }
  console.log(`[${lv}] reviewed: ok ${ok} fix ${fix} reject ${rej}`);
}
fs.writeFileSync(path.join(dir, 'review-log.tsv'), log.map(r => r.join('\t')).join('\n') + '\n');
