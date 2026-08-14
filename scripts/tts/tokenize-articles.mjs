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
import { ROOT } from './_lib.mjs';

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
const READING_FIX = { '正しく': 'ただしく' };

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
  if (a.level === 'n5') continue;                 // N5 用空格詞塊(frUnit),不需 token
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
for (const arr of Object.values(TOKENS)) for (const t of arr) {
  if (t.r && READING_FIX[t.s] && t.r !== READING_FIX[t.s]) { t.r = READING_FIX[t.s]; fixed++; }
}
if (fixed) console.log(`同音字修正套用 ${fixed} 處`);

// 保留既有插入順序(既有句在前、新句附後)→ 最小 diff
const out = '// 由 scripts kuromoji 離線斷詞產生 — 勿手改。key=去空白句子,值=詞陣列{s:表層,r:讀音,b:原形,k:可點}\n'
  + 'window.ARTICLE_TOKENS = ' + JSON.stringify(TOKENS) + ';\n';
fs.writeFileSync(TOKENS_JS, out, 'utf8');
console.log(`article-tokens.js:新增 ${added} 句、保留 ${kept} 句,共 ${Object.keys(TOKENS).length} 句`);
