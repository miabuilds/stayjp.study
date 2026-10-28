// 例句補標音:前端 furiganaHTML「寧缺勿錯」會把多音字/複合詞的漢字留白(用戶 2026-10-28 回報「例句有些漢字沒有拼音」)。
// 這支離線算出「每句裸漢字段落的讀音」,只在 kuromoji 跟 VOICEVOX 兩個引擎對整句讀音意見一致時才採用(兩家都錯的機率低),
// 輸出 ex-furigana.js(window.EX_FURI = { 例句: [[裸段, 讀音], …] }),前端 furiganaHTML 遇到留白段落時查這張表。
// 用法:node scripts/gen-ex-furigana.mjs <bare-runs.json>   (輸入由瀏覽器端匯出:[lv, w, 例句, [裸段…]])
//   需要 VOICEVOX 開著(localhost:50021)。慢(每句一次 HTTP),跑完會印統計。
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const kuromoji = require('kuromoji');
const SRC = process.argv[2]; const OUT = 'ex-furigana.js';
const rows = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const tok = await new Promise((res, rej) => kuromoji.builder({ dicPath: 'node_modules/kuromoji/dict' }).build((e, t) => e ? rej(e) : res(t)));
const k2h = (s) => s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
// 兩家表記差異抹平:VOICEVOX 長音寫成重複母音(ミョオゴニチ、センセエ)且助詞は/を/へ寫成 ワ/オ/エ;kuromoji 寫 ミョウゴニチ、ハ/ヲ/ヘ
const norm = (s) => {
  let t = k2h(s).replace(/[ー'\/_、。,.!?\s]/g, '').replace(/[^ぁ-ゖ]/g, '');
  t = t.replace(/は/g, 'わ').replace(/を/g, 'お').replace(/へ/g, 'え').replace(/づ/g, 'ず').replace(/ぢ/g, 'じ');
  t = t.replace(/([おこそとのほもよろごぞどぼぽょ])う/g, '$1お').replace(/([えけせてねへめれげぜでべぺ])い/g, '$1え');
  return t;
};
const djb2 = (s) => { let h = 5381; for (const c of s) h = ((Math.imul(h, 33) ^ c.codePointAt(0)) >>> 0); return h.toString(16).padStart(8, '0'); };   // key:整句 djb2(8 hex),同 ux-extras.js exHash
const isK = (c) => /[一-鿿々]/.test(c);
async function vvKana(text) {
  const r = await fetch(`http://localhost:50021/audio_query?speaker=2&text=${encodeURIComponent(text)}`, { method: 'POST' });
  if (!r.ok) throw new Error('voicevox ' + r.status);
  return (await r.json()).kana || '';
}
// kuromoji:整句讀音 + 每個 token 的 (surface, reading)
function kuro(text) {
  const ts = tok.tokenize(text);
  return ts.map((t) => ({ s: t.surface_form, r: t.reading && !/[一-鿿]/.test(t.reading) ? k2h(t.reading) : null }));
}
// 把裸段對到 token:裸段 run 必須剛好是一個 token、或是某 token 的開頭(漢字部分)且 token 的讀音可以切出對應前綴(token = 漢字+假名尾)
function readingOfRun(tokens, text, run, fromIdx) {
  const pos = text.indexOf(run, fromIdx); if (pos < 0) return null;
  let p = 0;
  for (const t of tokens) {
    const st = p; p += t.s.length;
    if (pos < st || pos >= p) continue;
    if (!t.r) return null;
    if (t.s === run) return { r: t.r, next: pos + run.length };
    // token 比裸段長:裸段是 token 的漢字開頭,尾巴是假名(例:覚え+て → 覚え)
    if (t.s.startsWith(run) && pos === st) {
      const tail = t.s.slice(run.length);
      if (/^[ぁ-ゖー]+$/.test(tail) && t.r.endsWith(tail) && t.r.length > tail.length) return { r: t.r.slice(0, t.r.length - tail.length), next: pos + run.length };
    }
    return null;
  }
  return null;
}
const out = {}; let ok = 0, dis = 0, nomap = 0, done = 0;
for (const [lv, w, text, runs] of rows) {
  done++;
  const tokens = kuro(text);
  const kAll = norm(tokens.map((t) => t.r || t.s).join(''));
  let vAll; try { vAll = norm(await vvKana(text)); } catch (e) { continue; }
  if (kAll !== vAll) { dis++; continue; }   // 兩家整句讀音不一致 → 整句不採用(可能是多音字判斷不同)
  const pairs = []; let from = 0;
  for (const run of runs) {
    const m = readingOfRun(tokens, text, run, from);
    if (!m) { nomap++; from = text.indexOf(run, from) + run.length; continue; }
    pairs.push([run, m.r]); from = m.next;
  }
  if (pairs.length) { out[djb2(text)] = pairs; ok++; }
  if (done % 300 === 0) console.error(`${done}/${rows.length} 採用 ${ok} 不一致 ${dis}`);
}
fs.writeFileSync(OUT, '// 由 scripts/gen-ex-furigana.mjs 產生:例句裸漢字段的讀音(kuromoji 與 VOICEVOX 整句一致才收)。key=整句的 djb2 雜湊(8 hex),別手改,改 overrides 後重跑。\nwindow.EX_FURI = ' + JSON.stringify(out) + ';\n');
console.log(`句數 ${rows.length} 採用 ${ok} 兩引擎不一致 ${dis} 對不到token ${nomap} → ${OUT} ${(fs.statSync(OUT).size / 1024).toFixed(0)}KB`);
