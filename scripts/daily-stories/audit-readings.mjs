#!/usr/bin/env node
/**
 * audit-readings.mjs — 用 kuromoji 審計每篇故事句的「期望讀音」，
 * 揪出 TTS（VOICEVOX/瀏覽器）最容易念錯的多音字句子。
 *
 * 為什麼需要：故事跟讀目前把「漢字句」直接餵 TTS，引擎自己猜讀音，
 * 多音字（方=かた/ほう、入=はい/い…）常猜錯。本腳本把每句的 kuromoji
 * 期望讀音算出來，並標出含高風險多音字的句子，供人工核對。
 *
 * 輸出：
 *   scripts/daily-stories/reading-audit.tsv   全部句子 + kuromoji 假名
 *   console 印出「含高風險多音字」的優先核對清單
 *
 * 用法：node scripts/daily-stories/audit-readings.mjs
 * 注意：kuromoji 是斷詞器，本身也可能猜錯，結果需人工判斷（你會日文，掃一遍很快）。
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const kuromoji = require('kuromoji');

const ROOT = path.resolve(import.meta.dirname, '../..');
const DICT = path.join(ROOT, 'node_modules/kuromoji/dict');
const STORIES = path.join(import.meta.dirname, 'output');
const OUT_TSV = path.join(import.meta.dirname, 'reading-audit.tsv');

// TTS 最常念錯的高風險多音字
const WATCH = new Set([...'方生行日間上下一人入出来角分大小何後先中目市言町外気手']);

const kataToHira = s => (s || '').replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));

function buildTokenizer() {
  return new Promise((res, rej) => kuromoji.builder({ dicPath: DICT }).build((e, t) => e ? rej(e) : res(t)));
}

const tok = await buildTokenizer();
const files = fs.readdirSync(STORIES).filter(f => f.endsWith('.json')).sort(
  (a, b) => a.localeCompare(b, undefined, { numeric: true })
);

const rows = [];      // 全部句
const flagged = [];   // 含高風險多音字
for (const f of files) {
  const data = JSON.parse(fs.readFileSync(path.join(STORIES, f), 'utf8'));
  for (const s of data.story?.sentences || []) {
    const tokens = tok.tokenize(s.j);
    const kana = tokens.map(t => kataToHira(t.reading || t.surface_form)).join('');
    // 只標「高風險」token：孤立單漢字（語境少、TTS 最常猜錯，如 方/後/中/角），
    // 或 surface 含 WATCH 漢字且該 token 是訓讀短詞（≤2 字純漢字）。複合詞 TTS 多半念對，不標。
    const isKanji = c => /[一-龯々]/.test(c);
    const hits = tokens
      .filter(t => {
        const s = t.surface_form;
        const pureKanji = [...s].every(isKanji);
        if (s.length === 1 && isKanji(s)) return true;                       // 孤立單漢字
        if (pureKanji && s.length === 2 && [...s].some(c => WATCH.has(c))) return true; // 含風險字的 2 字詞
        return false;
      })
      .map(t => `${t.surface_form}=${kataToHira(t.reading || t.surface_form)}`);
    rows.push({ f, j: s.j, kana, hasR: !!s.r });
    if (hits.length) flagged.push({ f, j: s.j, kana, hits: [...new Set(hits)] });
  }
}

fs.writeFileSync(OUT_TSV,
  'file\tsentence\tkuromoji_kana\thas_r_override\n' +
  rows.map(r => `${r.f}\t${r.j}\t${r.kana}\t${r.hasR ? 'Y' : ''}`).join('\n') + '\n');

// 統計各「單漢字=讀音」出現頻次，方便掃出異常（kuromoji 多半對，異常的才需人工聽）
const tally = {};
for (const x of flagged) for (const h of x.hits) tally[h] = (tally[h] || 0) + 1;
const top = Object.entries(tally).sort((a, b) => b[1] - a[1]);
console.log(`總句數 ${rows.length}　含單漢字/高風險詞 ${flagged.length} 句　全句假名已寫 ${path.relative(ROOT, OUT_TSV)}（你會日文，掃一遍最快）\n`);
console.log('=== 單漢字讀音頻次 top 40（掃出怪的）===');
console.log(top.slice(0, 40).map(([k, n]) => `${n}× ${k}`).join('  '));
console.log('\n提示：精準揪「語音」誤讀請用 audit-tts-voicevox.mjs（VOICEVOX vs kuromoji 對質）。');
