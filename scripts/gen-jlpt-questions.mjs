// 從「已驗證的單字庫」生成 JLPT 漢字読み題 → jlpt-questions-gen.js
//
// 為什麼可以自動生成還保證正確:
//   1. 正解讀音來自 vocab-n*.js——這批資料已跑過發音稽核管線(kuromoji+VOICEVOX 比對),讀音可信。
//   2. 干擾項是「按規則變形」出來的(去長音/清濁互換/加減促音/拗音大小字/掉ん),
//      每個錯項「為什麼錯」我們百分之百知道 → 詳解自動寫得準,不是猜的。
//   3. 變形結果若撞上任何真實單字的讀音就丟棄,避免「錯項其實也對」。
//
// 用法:node scripts/gen-jlpt-questions.mjs   (決定論:固定種子,重跑結果一樣)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'jlpt-questions-gen.js');

// 每級生成上限(加上手寫題 ≈ 1000+)
const TARGET = { n5: 150, n4: 150, n3: 160, n2: 160, n1: 130 };

// ── 載入資料 ──
const W = {};
function loadVocab(file, name) {
  const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const sandbox = {};
  new Function('window', src + `;window.__V=${name};`)(sandbox);
  return sandbox.__V || [];
}
W.n5 = loadVocab('vocab-n5.js', 'VOCAB_N5');
W.n4 = loadVocab('vocab-n4.js', 'VOCAB_N4');
W.n3 = loadVocab('vocab-n3.js', 'VOCAB_N3');
W.n2 = loadVocab('vocab-n2.js', 'VOCAB_N2');
W.n1 = loadVocab('vocab-n1.js', 'VOCAB_N1');

// 全部真實讀音集合(變形若撞上任何真實讀音 → 丟棄,絕不讓「錯項其實是對的」)
const REAL = new Set();
for (const lv of Object.keys(W)) for (const v of W[lv]) if (v.r) REAL.add(v.r);

// 手寫題已用過的詞(【詞】出現在 jlpt-questions.js 的題幹)→ 跳過,避免重複
const handSrc = fs.readFileSync(path.join(ROOT, 'jlpt-questions.js'), 'utf8');
const usedWords = new Set([...handSrc.matchAll(/【(.+?)】/g)].map(m => m[1]));

// ── 決定論亂數(固定種子,重跑結果穩定,方便 diff/審閱)──
let _s = 20260817;
function rnd() { _s = (_s * 1664525 + 1013904223) >>> 0; return _s / 4294967296; }
function shuf(a) { const x = a.slice(); for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; }

// ── 讀音變形規則(每種變形都能準確描述「錯在哪」)──
const DAKU = { か:'が',き:'ぎ',く:'ぐ',け:'げ',こ:'ご',さ:'ざ',し:'じ',す:'ず',せ:'ぜ',そ:'ぞ',た:'だ',ち:'ぢ',つ:'づ',て:'で',と:'ど',は:'ば',ひ:'び',ふ:'ぶ',へ:'べ',ほ:'ぼ' };
const DAKU_R = Object.fromEntries(Object.entries(DAKU).map(([k, v]) => [v, k]));
const HANDAKU = { ば:'ぱ',び:'ぴ',ぶ:'ぷ',べ:'ぺ',ぼ:'ぽ',ぱ:'ば',ぴ:'び',ぷ:'ぶ',ぺ:'べ',ぽ:'ぼ' };
const O_ROW = 'おこそとのほもよろごぞどぼぽ';
const E_ROW = 'えけせてねへめれげぜでべぺ';
const YO_BIG = { ゃ:'や', ゅ:'ゆ', ょ:'よ' };
const YO_SMALL = { や:'ゃ', ゆ:'ゅ', よ:'ょ' };

// 回傳 [{t:變形後, why:錯因說明}];同一規則可能有多個位置,全列出
function mutations(r) {
  const out = [];
  const chars = [...r];
  // 1) 去長音:お段+う / え段+い
  chars.forEach((c, i) => {
    if (c === 'う' && i > 0 && O_ROW.includes(chars[i - 1])) out.push({ t: r.slice(0, i) + r.slice(i + 1), why: '少了長音' });
    if (c === 'い' && i > 0 && E_ROW.includes(chars[i - 1])) out.push({ t: r.slice(0, i) + r.slice(i + 1), why: '少了長音' });
  });
  // 2) 加長音:お段後面補う(限一處,取第一個合法位)
  for (let i = 0; i < chars.length; i++) {
    if (O_ROW.includes(chars[i]) && chars[i + 1] !== 'う' && chars[i + 1] !== 'ー') { out.push({ t: r.slice(0, i + 1) + 'う' + r.slice(i + 1), why: '多了長音' }); break; }
  }
  // 3) 清濁互換
  chars.forEach((c, i) => {
    if (DAKU[c]) out.push({ t: r.slice(0, i) + DAKU[c] + r.slice(i + 1), why: '清音誤為濁音' });
    if (DAKU_R[c]) out.push({ t: r.slice(0, i) + DAKU_R[c] + r.slice(i + 1), why: '濁音誤為清音' });
    if (HANDAKU[c]) out.push({ t: r.slice(0, i) + HANDAKU[c] + r.slice(i + 1), why: '濁音/半濁音混淆' });
  });
  // 4) 促音增減
  chars.forEach((c, i) => {
    if (c === 'っ') out.push({ t: r.slice(0, i) + r.slice(i + 1), why: '少了促音' });
  });
  if (!r.includes('っ')) {
    for (let i = 1; i < chars.length; i++) {
      if ('かきくけこさしすせそたちつてとぱぴぷぺぽ'.includes(chars[i])) { out.push({ t: r.slice(0, i) + 'っ' + r.slice(i), why: '多了促音' }); break; }
    }
  }
  // 5) 拗音大小字
  chars.forEach((c, i) => {
    if (YO_BIG[c]) out.push({ t: r.slice(0, i) + YO_BIG[c] + r.slice(i + 1), why: '拗音(小字)誤寫成大字' });
    if (YO_SMALL[c] && i > 0 && 'きぎしじちにひびぴみり'.includes(chars[i - 1])) out.push({ t: r.slice(0, i) + YO_SMALL[c] + r.slice(i + 1), why: '大字誤寫成拗音(小字)' });
  });
  // 6) 掉ん
  chars.forEach((c, i) => {
    if (c === 'ん') out.push({ t: r.slice(0, i) + r.slice(i + 1), why: '少了「ん」' });
  });
  return out;
}

const HAS_KANJI = /[㐀-鿿々]/;
const gen = [];
let skippedReal = 0;

for (const lv of ['n5', 'n4', 'n3', 'n2', 'n1']) {
  // 候選:含漢字、讀音≥3拍(變形空間夠)、例句裡真的出現這個詞、沒被手寫題用過
  const cands = shuf(W[lv].filter(v =>
    v.w && v.r && v.m && HAS_KANJI.test(v.w) && v.w !== v.r && [...v.r].length >= 3 &&
    v.ex && v.ex.j && v.ex.j.includes(v.w) && !usedWords.has(v.w)
  ));
  let n = 0;
  for (const v of cands) {
    if (n >= TARGET[lv]) break;
    // 生成候選干擾項:去重、不等於正解、不撞任何真實讀音
    const seen = new Set([v.r]);
    const pool = [];
    for (const m of shuf(mutations(v.r))) {
      if (seen.has(m.t) || REAL.has(m.t)) { if (REAL.has(m.t)) skippedReal++; continue; }
      seen.add(m.t);
      pool.push(m);
      if (pool.length >= 3) break;
    }
    if (pool.length < 3) continue;   // 變形空間不足 → 跳過
    // 題幹:例句中的詞加【】(僅第一次出現)
    const q = v.ex.j.replace(v.w, `【${v.w}】`);
    const x = `<b>${v.w}=${v.r}</b>(${v.m})。<br>` + pool.map(p => `「${p.t}」${p.why}`).join(';') + '。'
      + `<br><span style="opacity:.8">例句:${v.ex.z || ''}</span>`;
    gen.push({ id: `g-${lv}-${String(n + 1).padStart(3, '0')}`, lv, t: 'kanji', q, o: [v.r, pool[0].t, pool[1].t, pool[2].t], a: 0, x });
    n++;
  }
  console.log(`${lv}: 候選 ${cands.length} → 生成 ${n}`);
}

// ═══ 表記(讀音→選正確漢字):漢字読み的反向,同樣由已驗證資料保證正確 ═══
// 干擾項=同級其他真實單字的「漢字寫法」,且讀音必須不同於目標讀音(避免同音字造成
// 「其實也說得通」的歧義)。優先挑「開頭讀音相同或共用一個漢字」的詞,像真題一樣迷惑。
const TARGET_H = { n5: 100, n4: 100, n3: 110, n2: 110, n1: 90 };
for (const lv of ['n5', 'n4', 'n3', 'n2', 'n1']) {
  const all = W[lv].filter(v => v.w && v.r && HAS_KANJI.test(v.w) && v.w !== v.r);
  const cands = shuf(all.filter(v => v.m && v.ex && v.ex.j && v.ex.j.includes(v.w) && !usedWords.has(v.w)));
  let n = 0;
  for (const v of cands) {
    if (n >= TARGET_H[lv]) break;
    // 干擾池:同級、讀音≠目標、字形不同、不出現在例句裡
    const sameStart = [], shareKanji = [], rest = [];
    for (const o of all) {
      if (o.w === v.w || o.r === v.r || v.ex.j.includes(o.w)) continue;
      if (o.r[0] === v.r[0]) sameStart.push(o);
      else if ([...o.w].some(c => v.w.includes(c) && HAS_KANJI.test(c))) shareKanji.push(o);
      else rest.push(o);
    }
    const pool = shuf(sameStart).concat(shuf(shareKanji)).concat(shuf(rest));
    const picks = [];
    const seenW = new Set([v.w]);
    for (const o of pool) { if (!seenW.has(o.w)) { seenW.add(o.w); picks.push(o); if (picks.length >= 3) break; } }
    if (picks.length < 3) continue;
    const q = v.ex.j.replace(v.w, `【${v.r}】`) + '(どう書きますか)';
    const x = `<b>${v.r}=${v.w}</b>(${v.m})。<br>` + picks.map(p => `「${p.w}」讀「${p.r}」(${p.m}),讀音對不上`).join(';') + '。'
      + `<br><span style="opacity:.8">例句:${v.ex.z || ''}</span>`;
    gen.push({ id: `h-${lv}-${String(n + 1).padStart(3, '0')}`, lv, t: 'hyoki', q, o: [v.w, picks[0].w, picks[1].w, picks[2].w], a: 0, x });
    n++;
  }
  console.log(`${lv} 表記: 生成 ${n}`);
}

const banner = `// 自動生成的 JLPT 漢字読み題庫 — 由 scripts/gen-jlpt-questions.mjs 產生,不要手改。
// 正解讀音來自已驗證的 vocab-n*.js;干擾項按語音規則變形(撞上真實讀音者已剔除 ${skippedReal} 個)。
// 重新生成:node scripts/gen-jlpt-questions.mjs
`;
fs.writeFileSync(OUT, banner + 'window.JLPT_Q_GEN = ' + JSON.stringify(gen, null, 0).replace(/},{/g, '},\n{') + ';\n');
console.log(`\n共生成 ${gen.length} 題 → ${path.relative(ROOT, OUT)}(剔除撞真實讀音 ${skippedReal} 個變形)`);
