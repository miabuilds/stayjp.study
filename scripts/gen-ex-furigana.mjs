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
// 阿拉伯數字 → 漢數字(只給 kuromoji 用):kuromoji 對「10月」「2時間半」的數字沒讀音,整句跟 VOICEVOX 永遠不一致,
// 全部含數字的例句都被丟掉(2026-11-08 掃出 841 句不一致大半是這個)。回傳轉換後文字 + 原文索引→新文字索引。
const KD = '〇一二三四五六七八九';
function numToKanji(n) {
  if (n === '0') return '〇';
  const units = ['', '十', '百', '千']; const big = ['', '万', '億'];
  let out = '', s = String(Number(n));
  if (s.length > 12) return [...n].map((d) => KD[+d]).join('');
  const groups = []; while (s.length) { groups.unshift(s.slice(-4)); s = s.slice(0, -4); }
  groups.forEach((g, gi) => {
    let part = ''; const ds = g.padStart(4, '0');
    for (let i = 0; i < 4; i++) { const d = +ds[i], u = units[3 - i]; if (!d) continue; part += (d === 1 && u ? '' : KD[d]) + u; }
    if (part) out += part + big[groups.length - 1 - gi];
  });
  return out || '〇';
}
function digitsToKanji(text) {
  let out = '', map = [];
  for (let i = 0; i < text.length;) {
    const m = text.slice(i).match(/^[0-9０-９]+/);
    if (m) {
      const n = m[0].replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0));
      const k = numToKanji(n);
      for (let q = 0; q < m[0].length; q++) map[i + q] = out.length;
      out += k; i += m[0].length;
    } else { map[i] = out.length; out += text[i]; i++; }
  }
  map[text.length] = out.length;
  return { text: out, map };
}
// kuromoji:每個 token 的 (surface, reading)
function kuro(text) {
  const ts = tok.tokenize(text);
  return ts.map((t) => ({ s: t.surface_form, r: t.reading && !/[一-鿿]/.test(t.reading) ? k2h(t.reading) : null }));
}
const kuroRead = (s) => { const ts = kuro(s); return ts.every((t) => t.r || /^[ぁ-ゖァ-ヶー]+$/.test(t.s)) ? ts.map((t) => t.r || k2h(t.s)).join('') : null; };
// 把裸段對到 token。三種情況:
//  1) 裸段 = 連續 1..n 個 token 的 surface 串起來(二階=二+階、五時=五+時)→ 讀音串起來
//  2) 裸段在某個 token 內部(忘れ物 的 物、フランス語 的 語、書き方 的 方、間に合わせ 的 間):
//     把 token 切成 前綴+裸段+尾巴,前綴/尾巴各自丟 kuromoji 讀出來,token 讀音剛好「前綴讀音 + X + 尾巴讀音」→ X 就是裸段讀音
//     (連濁自然保留:手紙 → て+がみ)。拆不出來就不標(整句另有 VOICEVOX 把關)。
function readingOfRun(tokens, text, run, fromIdx) {
  const pos = text.indexOf(run, fromIdx); if (pos < 0) return null;
  let p = 0, ti = 0;
  for (; ti < tokens.length; ti++) { const st = p; p += tokens[ti].s.length; if (pos >= st && pos < p) { p = st; break; } }
  if (ti >= tokens.length) return null;
  const t0 = tokens[ti];
  if (pos === p) {   // 裸段從 token 開頭起
    let acc = '', rd = '';
    for (let k = ti; k < tokens.length; k++) {
      const t = tokens[k]; if (!t.r) return null;
      if (run.startsWith(acc + t.s)) { acc += t.s; rd += t.r; if (acc === run) return { r: rd, next: pos + run.length }; continue; }
      if (!run.startsWith(acc) || acc.length >= run.length) return null;
      // 最後一個 token 比剩下的裸段長:剩餘裸段是它的開頭,尾巴另讀
      const rest = run.slice(acc.length);
      if (!t.s.startsWith(rest)) return null;
      const tail = t.s.slice(rest.length); const tr = kuroRead(tail);
      if (tr && t.r.endsWith(tr) && t.r.length > tr.length) return { r: rd + t.r.slice(0, t.r.length - tr.length), next: pos + run.length };
      return null;
    }
    return null;
  }
  // 裸段在 token 內部
  if (!t0.r) return null;
  const off = pos - p, prefix = t0.s.slice(0, off), mid = t0.s.slice(off, off + run.length), tail = t0.s.slice(off + run.length);
  if (mid !== run) return null;
  const pr = kuroRead(prefix); if (pr == null) return null;
  const tr = tail ? kuroRead(tail) : ''; if (tr == null) return null;
  if (t0.r.startsWith(pr) && t0.r.endsWith(tr) && t0.r.length > pr.length + tr.length) return { r: t0.r.slice(pr.length, t0.r.length - tr.length), next: pos + run.length };
  return null;
}
// 併入既有的 ex-furigana.js(只補新句,舊句保留;要整個重算就先刪掉該檔)
const out = (() => { try { const t = fs.readFileSync(OUT, 'utf8'); return JSON.parse(t.slice(t.indexOf('{'), t.lastIndexOf('}') + 1)); } catch (e) { return {}; } })();
const before = Object.keys(out).length; let ok = 0, dis = 0, nomap = 0, done = 0;
for (const [lv, w, text, runs] of rows) {
  done++;
  const conv = digitsToKanji(text);
  const tokens = kuro(conv.text);
  const kAll = norm(tokens.map((t) => t.r || t.s).join(''));
  let vAll; try { vAll = norm(await vvKana(text)); } catch (e) { continue; }
  if (kAll !== vAll) { dis++; continue; }   // 兩家整句讀音不一致 → 整句不採用(可能是多音字判斷不同)
  const pairs = []; let from = 0, fromC = 0;
  for (const run of runs) {
    const po = text.indexOf(run, from); if (po < 0) { nomap++; continue; }
    const m = readingOfRun(tokens, conv.text, run, Math.max(fromC, conv.map[po]));
    from = po + run.length;
    if (!m) { nomap++; fromC = conv.map[from]; continue; }
    pairs.push([run, m.r]); fromC = m.next;
  }
  if (pairs.length) { out[djb2(text)] = pairs; ok++; }
  if (done % 300 === 0) console.error(`${done}/${rows.length} 採用 ${ok} 不一致 ${dis}`);
}
fs.writeFileSync(OUT, '// 由 scripts/gen-ex-furigana.mjs 產生:例句裸漢字段的讀音(kuromoji 與 VOICEVOX 整句一致才收)。key=整句的 djb2 雜湊(8 hex),別手改,改 overrides 後重跑。\nwindow.EX_FURI = ' + JSON.stringify(out) + ';\n');
console.log(`既有 ${before} → ${Object.keys(out).length};句數 ${rows.length} 採用 ${ok} 兩引擎不一致 ${dis} 對不到token ${nomap} → ${OUT} ${(fs.statSync(OUT).size / 1024).toFixed(0)}KB`);
