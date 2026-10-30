#!/usr/bin/env node
// 補單字(2026-10-30 用戶回饋:N4/N3/N2 有 1,567 筆跟低級別重複):把重複的位置換成該級別「我們沒有的」新字。
// 候選字來源:JLPT 公開字表(jlpt-vocab-api,Jonathan Waller 的 tanos 清單),排除站內已有的字;
// 條目(讀音/繁中/分類/自他/例句中英)由 Claude 產,讀音再過 kuromoji + VOICEVOX 雙引擎比對,不一致的標 FLAG 給人看。
// 用法:node scripts/gen-vocab-fill.mjs <dups.json> <cand-dir> <out-dir> [--levels n4,n3,n2] [--limit N] [--spare 0.12]
//   key:專案 .env 的 PROJECT_ANTHROPIC_KEY(新創 Startups 組織)。VOICEVOX 要開著(localhost:50021)。
// 輸出:<out-dir>/<lv>.json(依序對應 dups 的位置)、<out-dir>/review-<lv>.tsv(給 Mia 審)、<out-dir>/rejected.tsv
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
try { process.loadEnvFile(new URL('../.env', import.meta.url)); } catch {}
const KEY = process.env.PROJECT_ANTHROPIC_KEY; if (!KEY) { console.error('no PROJECT_ANTHROPIC_KEY'); process.exit(1); }
const require = createRequire(import.meta.url);
const kuromoji = require('kuromoji');
const [dupsFile, candDir, outDir] = process.argv.slice(2);
const args = process.argv.slice(5); const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const LEVELS = opt('--levels', 'n4,n3,n2').split(','); const LIMIT = parseInt(opt('--limit', '0'), 10); const SPARE = parseFloat(opt('--spare', '0.12'));
const MODEL = 'claude-sonnet-5-5';
fs.mkdirSync(outDir, { recursive: true });
const dups = JSON.parse(fs.readFileSync(dupsFile, 'utf8'));
// 站內已有的字(五級全部)→ 新字不得撞
const have = new Set(), haveR = new Set();
for (const lv of ['n5', 'n4', 'n3', 'n2', 'n1']) for (const m of fs.readFileSync(`vocab-${lv}.js`, 'utf8').matchAll(/\{w:"([^"]+)",r:"([^"]*)"/g)) { have.add(m[1]); haveR.add(m[2]); }
const kataToHira = s => s.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
const normR = s => kataToHira(String(s || '')).replace(/ー/g, '').replace(/[ぁぃぅぇぉ]/g, c => ({ ぁ:'あ', ぃ:'い', ぅ:'う', ぇ:'え', ぉ:'お' }[c]));
const isKana = s => /^[ぁ-んァ-ヶー]+$/.test(s);
const hasKanji = s => /[一-龯々]/.test(s);
const SIMP = /[们这个说对时会为么还进过发现实问题样学国开关应该经电话间车长点东话让儿与书边师亲门见认识记录听读写课语]/;   // 只放「繁體絕不會用」的字(西/着/后/没 在台灣都合法,別放)
const CATS = new Set(['名', '動', 'い形', 'な形', '副', '他']);
const tokenizer = await new Promise((res, rej) => kuromoji.builder({ dicPath: path.join(process.cwd(), 'node_modules/kuromoji/dict') }).build((e, t) => e ? rej(e) : res(t)));
const kuroReading = w => { try { return tokenizer.tokenize(w).map(t => (t.reading && t.reading !== '*') ? t.reading : t.surface_form).join(''); } catch (e) { return ''; } };
async function vvReading(w) { try { const r = await fetch(`http://localhost:50021/audio_query?speaker=2&text=${encodeURIComponent(w)}`, { method: 'POST' }); const j = await r.json(); return (j.accent_phrases || []).map(a => a.moras.map(m => m.text).join('') + (a.pause_mora ? '' : '')).join(''); } catch (e) { return ''; } }
const LV_DESC = { n4: 'JLPT N4(初級後半)', n3: 'JLPT N3(中級)', n2: 'JLPT N2(中上級)' };
const SYSTEM = `你是日語教材編輯,為台灣學習者的 JLPT 單字表補條目。對每個候選字輸出 JSON 物件,欄位:
- w:標準現代寫法(常用漢字寫法就用漢字;一般都寫假名的詞(例如 もしかして、あちこち)就用假名;外來語用片假名)。不要加「・する」。
- r:讀音,平假名(片假名詞則與 w 相同)。
- m:繁體中文意思,台灣用語,精簡(2~8 字),多義用「、」分隔最多三個。
- c:詞性,只能是 名/動/い形/な形/副/他 之一(する動詞的名詞部分標 名;動 只給動詞原形)。
- t:只有 c=動 才給,自/他/両。
- ex:{j, z, e}:一句自然、符合該級別程度的日文例句(15~35 字,一定要用到這個字,動詞可活用),z 是繁體中文翻譯(台灣用語),e 是英文翻譯。
只輸出 JSON 陣列,不要任何說明。候選字若其實不適合當單字(太生僻、專有名詞、拼法怪),就輸出 {"skip": "<原字>"}。`;
async function ask(lv, batch) {
  const list = batch.map((c, i) => `${i + 1}. ${c.word}${c.furigana ? '（' + c.furigana + '）' : ''} — ${c.meaning}`).join('\n');
  const body = { model: MODEL, max_tokens: 8000, system: SYSTEM, messages: [{ role: 'user', content: `級別:${LV_DESC[lv]}\n候選字:\n${list}` }] };
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': KEY, 'anthropic-version': '2023-06-01' }, body: JSON.stringify(body) });
      const d = await r.json(); if (!d.content) throw new Error(JSON.stringify(d).slice(0, 200));
      const txt = d.content.map(c => c.text || '').join(''); const j = txt.slice(txt.indexOf('['), txt.lastIndexOf(']') + 1);
      return JSON.parse(j);
    } catch (e) { if (attempt === 3) throw e; await new Promise(r => setTimeout(r, 3000 * (attempt + 1))); }
  }
}
const rejected = [];
for (const lv of LEVELS) {
  const need = LIMIT || dups[lv].length; if (!need) continue;
  const cand = JSON.parse(fs.readFileSync(path.join(candDir, `cand-${lv}.json`), 'utf8'))
    .map(c => ({ ...c, furigana: String(c.furigana || '').split('・')[0], word: String(c.word).split('・')[0].trim() }))
    .filter(c => c.word && !/[a-zA-Z0-9~〜\s]/.test(c.word) && (isKana(c.word) || c.furigana));
  const target = Math.ceil(need * (1 + SPARE));
  const out = []; const seenNew = new Set();
  let pos = 0; const BATCH = 20, PAR = 4;
  while (out.length < target && pos < cand.length) {
    const batches = []; for (let k = 0; k < PAR && pos < cand.length; k++) { batches.push(cand.slice(pos, pos + BATCH)); pos += BATCH; }
    const results = await Promise.all(batches.map(b => ask(lv, b).catch(e => { console.error('batch fail', e.message.slice(0, 120)); return []; })));
    for (const arr of results) for (const it of arr) {
      if (!it || it.skip) { if (it && it.skip) rejected.push([lv, it.skip, 'claude-skip']); continue; }
      const w = String(it.w || '').trim(), r = String(it.r || '').trim();
      const why = !w ? 'no w' : !r ? 'no r' : !isKana(r) ? 'r not kana' : have.has(w) || seenNew.has(w) ? 'dup' : (isKana(w) && haveR.has(w)) ? 'dup-reading' : !CATS.has(it.c) ? 'bad c' : !it.ex || !it.ex.j || !it.ex.z || !it.ex.e ? 'no ex' : SIMP.test(it.m + it.ex.z) ? 'simplified' : (it.c === '動' && !['自', '他', '両'].includes(it.t)) ? 'bad t' : '';
      if (why) { rejected.push([lv, w || JSON.stringify(it).slice(0, 40), why]); continue; }
      const entry = { w, r, m: String(it.m).trim(), c: it.c, ...(it.c === '動' ? { t: it.t } : {}), ex: { j: String(it.ex.j).trim(), z: String(it.ex.z).trim(), e: String(it.ex.e).trim() } };
      // 讀音雙引擎比對(只標記,不拒絕)
      let flag = '';
      if (hasKanji(w)) { const k = normR(kuroReading(w)), v = normR(await vvReading(w)), rr = normR(r); if (k !== rr && v !== rr) flag = `讀音? kuromoji=${kataToHira(kuroReading(w))} voicevox=${kataToHira(await vvReading(w))}`; else if (k !== rr || v !== rr) flag = ''; }
      // 例句要用到這個字:漢字詞比漢字部分,假名動詞/形容詞比去掉活用尾(いじめる→いじめ、くださる→くださ)
      const stem = hasKanji(w) ? w.replace(/[ぁ-ん]+$/, '') : w.slice(0, Math.max(2, w.length - 1));
      if (!entry.ex.j.includes(w) && !entry.ex.j.includes(stem)) flag = (flag ? flag + '; ' : '') + '例句沒用到這個字';
      entry._flag = flag; seenNew.add(w); out.push(entry);
    }
    console.log(`[${lv}] ${out.length}/${target} (candidates used ${pos}/${cand.length})`);
    fs.writeFileSync(path.join(outDir, `${lv}.json`), JSON.stringify(out, null, 0));
  }
  fs.writeFileSync(path.join(outDir, `review-${lv}.tsv`), 'w\tr\tm\tc\tt\tex.j\tex.z\tex.e\tflag\n' + out.map(e => [e.w, e.r, e.m, e.c, e.t || '', e.ex.j, e.ex.z, e.ex.e, e._flag].join('\t')).join('\n') + '\n');
  console.log(`[${lv}] done ${out.length} (need ${need}), flagged ${out.filter(e => e._flag).length}`);
}
fs.writeFileSync(path.join(outDir, 'rejected.tsv'), rejected.map(r => r.join('\t')).join('\n') + '\n');
console.log('rejected', rejected.length);
