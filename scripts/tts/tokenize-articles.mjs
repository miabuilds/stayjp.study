#!/usr/bin/env node
/**
 * tokenize-articles.mjs — 產生 article-tokens.js(逐詞可點 + 逐詞高亮定位)
 *
 * 前端 articles-ui.js 的 frTok 讀 window.ARTICLE_TOKENS[去空白句子]:
 *   token = {s:表層, r:讀音(含漢字才有,平假名), b:原形(活用詞才有), k:1(內容詞,可點)}
 *   沒有該句 → frTok 自動退回即時 furigana 引擎(仍正確,只少「點詞/逐詞高亮」)。
 *
 * 本腳本「只加新句、保留既有」:已在 ARTICLE_TOKENS 的句子原樣保留(不重斷詞,
 * 避免既有文章行為被動到);只有新文章的新句子才 kuromoji 斷詞加入。
 *
 * ⚠ 讀音正確性:非內容詞用 kuromoji 讀音;但前端 frTok 對「有 vocab 的詞」優先用
 *    vocab 人工讀音(look(surf))。所以關鍵詞務必收進該篇 vocab,furigana 才保證正確。
 *
 * 用法:node scripts/tts/tokenize-articles.mjs   (不需 VOICEVOX)
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { ROOT, loadOverrides, applyOverrides } from './_lib.mjs';

const require = createRequire(import.meta.url);
const kuromoji = require('kuromoji');
const DICT = path.join(ROOT, 'node_modules/kuromoji/dict');
const TOKENS_JS = path.join(ROOT, 'article-tokens.js');

const kata2hira = s => (s || '').replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
const hasKanji = s => /[一-鿿々]/.test(s);
// 內容詞(可點 k:1):名詞/動詞/形容詞/副詞/連体詞/感動詞;助詞/助動詞/記号/接続詞/接頭尾詞不算
const CONTENT = new Set(['名詞', '動詞', '形容詞', '副詞', '連体詞', '感動詞']);
// kuromoji 同音字誤讀修正(furigana 顯示用;表層完全相符才套)。每輪對全表套用=冪等。
// 「正しく」kuromoji 常誤判成 まさしく(誠然),文中幾乎都是 ただしく(正確地)。
const READING_FIX = { '正しく': 'ただしく', '一目': 'ひとめ', '一言': 'ひとこと' };
// 複合詞修正:kuromoji 會把這些詞切碎且末字注錯音(報/連/相→しょう)→ 合併成一個 token 並給正確讀音(冪等,修到新舊句)
// 大そうじ:kuromoji 切成 大(だい)/そう/じ;一九四八年:逐字念 いち/きゅう/よん/はち(年份要念 せんきゅうひゃく…)
const COMPOUND_FIX = { '報連相': 'ほうれんそう', '大そうじ': 'おおそうじ', '一九四八年': 'せんきゅうひゃくよんじゅうはちねん', '一か所': 'いっかしょ', '七五三': 'しちごさん', '何ばんせん': 'なんばんせん', '三日後': 'みっかご', '保険証': 'ほけんしょう', '問診票': 'もんしんひょう', '券売機': 'けんばいき',
  // 2026-10-20 三種難度改寫版:kuromoji 切碎後注錯(さつ/うちみ/しょ/じん/じゅうふん/さんにち/いち…)
  '番号札': 'ばんごうふだ', '内見': 'ないけん', '避難所': 'ひなんじょ', '保証人': 'ほしょうにん', '十分以内': 'じゅっぷんいない', '三日前': 'みっかまえ', '十四日': 'じゅうよっか', '一本': 'いっぽん', '一回': 'いっかい', '一階': 'いっかい', '二十四時間': 'にじゅうよじかん', '放っておく': 'ほうっておく' };
// 依前/後一個詞判讀音(冪等,修到新舊句):「〜ている間」kuromoji 給 ま→あいだ;「角が立つ」給 かく→かど
const PREV_FIX = [{ s: '間', prev: ['いる', 'いた'], r: 'あいだ' }, { s: '角', next: ['が'], r: 'かど' }];
function mergeCompounds(arr) {
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    let hit = null;
    for (const [word, r] of Object.entries(COMPOUND_FIX)) {
      let acc = '', j = i;
      while (j < arr.length && acc.length < word.length) { acc += arr[j].s; j++; }
      if (acc === word) { hit = { s: word, r, k: 1, span: j - i }; break; }
    }
    if (hit) { out.push({ s: hit.s, r: hit.r, k: 1 }); i += hit.span - 1; } else out.push(arr[i]);
  }
  return out;
}

const ARTICLES = (new Function('window', fs.readFileSync(path.join(ROOT, 'articles.js'), 'utf8') + ';return window.ARTICLES;'))({}) || [];
let TOKENS = {};
if (fs.existsSync(TOKENS_JS)) {
  TOKENS = (new Function('window', fs.readFileSync(TOKENS_JS, 'utf8') + ';return window.ARTICLE_TOKENS'))({}) || {};
}

const tok = await new Promise((res, rej) =>
  kuromoji.builder({ dicPath: DICT }).build((e, t) => e ? rej(e) : res(t)));

function tokenizeSentence(clean) {
  return tok.tokenize(clean).map(t => {
    const o = { s: t.surface_form };
    if (hasKanji(t.surface_form) && t.reading && t.reading !== '*') o.r = kata2hira(t.reading);
    const isContent = CONTENT.has(t.pos);
    if (isContent) o.k = 1;
    // 原形:活用詞(動詞/形容詞)且原形≠表層
    if ((t.pos === '動詞' || t.pos === '形容詞') && t.basic_form && t.basic_form !== '*' && t.basic_form !== t.surface_form) {
      o.b = t.basic_form;
    }
    return o;
  });
}

let added = 0, kept = 0;
for (const a of ARTICLES) {
  // N5 的振假名走空格詞塊(frUnit)不用 token,但「羅馬拼音」要靠 token(romajiForSentence)→ N5 也要產(2026-10-05 Mia 回報 N5 按羅馬拼音沒反應)
  const paras = String(a.body).split('\n').filter(p => p.trim());
  for (const p of paras) {
    const sents = p.match(/[^。！？]+[。！？]?/g) || [p];
    for (const s of sents) {
      const clean = s.replace(/\s/g, '');
      if (!clean) continue;
      if (TOKENS[clean]) { kept++; continue; }    // 既有 → 原樣保留
      TOKENS[clean] = tokenizeSentence(clean);
      added++;
    }
  }
}

// 全表套用同音字修正(冪等;修到新舊句)
let fixed = 0;
for (const arr of Object.values(TOKENS)) arr.forEach((t, i) => {
  if (t.r && READING_FIX[t.s] && t.r !== READING_FIX[t.s]) { t.r = READING_FIX[t.s]; fixed++; }
  for (const f of PREV_FIX) if (t.s === f.s && t.r !== f.r && ((f.prev && i > 0 && f.prev.includes(arr[i - 1].s)) || (f.next && arr[i + 1] && f.next.includes(arr[i + 1].s)))) { t.r = f.r; fixed++; }
});
// 與語音 overrides 同步:VOICEVOX 預設把「日本」念 にっぽん,overrides.json 逐句改成 にほん 的句子,
// token 讀音也要跟著改,否則逐詞時間軸拍數對不齊(沒被 override 的句子維持原樣=跟音檔一致)
const OV = loadOverrides();
const NIHON = { '日本': 'にほん', '日本人': 'にほんじん', '日本語': 'にほんご' };
for (const [k, arr] of Object.entries(TOKENS)) {
  if (!k.includes('日本') || applyOverrides(k, OV).includes('日本')) continue;
  for (const t of arr) if (NIHON[t.s] && t.r !== NIHON[t.s]) { t.r = NIHON[t.s]; fixed++; }
}
if (fixed) console.log(`同音字修正套用 ${fixed} 處`);
let merged = 0;
for (const k of Object.keys(TOKENS)) { const before = TOKENS[k].length; TOKENS[k] = mergeCompounds(TOKENS[k]); if (TOKENS[k].length !== before) merged++; }
if (merged) console.log(`複合詞合併 ${merged} 句`);

// 保留既有插入順序(既有句在前、新句附後)→ 最小 diff
const out = '// 由 scripts kuromoji 離線斷詞產生 — 勿手改。key=去空白句子,值=詞陣列{s:表層,r:讀音,b:原形,k:可點}\n'
  + 'window.ARTICLE_TOKENS = ' + JSON.stringify(TOKENS) + ';\n';
fs.writeFileSync(TOKENS_JS, out, 'utf8');
console.log(`article-tokens.js:新增 ${added} 句、保留 ${kept} 句,共 ${Object.keys(TOKENS).length} 句`);
