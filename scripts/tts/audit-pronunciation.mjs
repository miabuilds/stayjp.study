#!/usr/bin/env node
/**
 * audit-pronunciation.mjs — 全站主內容「語音正確性」稽核（安全版根治的偵測層）
 *
 * 目的：把 daily-stories 那套「VOICEVOX 實際念的音 vs kuromoji 標準讀音」比對，
 *       搬來掃主內容全部 15398 句，揪出「還沒被 override 修到」的真正誤讀。
 *
 * 關鍵：VOICEVOX 這邊餵的是「套完 overrides.json 之後」的文字（= 使用者真的聽到的音），
 *       所以已經修好的 175 條不會再冒出來；只剩尚未修的候選會浮出。
 *
 * 安全性：本腳本「只讀不寫」，不碰任何音檔、不改合成邏輯。找到的候選一律用 overrides.json
 *         的「漢字→假名」替換去修（跟現有 175 條同機制，從不雙讀），修完再 generate.mjs 重生。
 *
 * 正規化（兩邊同套，抵消表音/正字差異，只留真讀音錯）沿用 audit-tts-voicevox.mjs。
 *
 * 前置：打開 VOICEVOX app（引擎在 :50021）
 * 用法：node scripts/tts/audit-pronunciation.mjs
 * 輸出：scripts/tts/pron-mismatch.tsv（依「疑似程度」排序，越可能真錯越前面）
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { ROOT, loadOverrides, applyOverrides } from './_lib.mjs';

const require = createRequire(import.meta.url);
const kuromoji = require('kuromoji');
const DICT = path.join(ROOT, 'node_modules/kuromoji/dict');
const TEXTS = path.join(ROOT, 'scripts/tts/texts.json');
const OUT = path.join(ROOT, 'scripts/tts/pron-mismatch.tsv');
const ENGINE = 'http://localhost:50021';
const SPEAKER = 2; // 與 generate.mjs 一致：四国めたん ノーマル

const kataToHira = s => (s || '').replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
// 記法歸一化（抄 audit-tts-voicevox.mjs）：抵消表音 vs 正字，只留真正讀音錯
const normKana = s => kataToHira(s)
  .replace(/[、。「」『』（）()！？!?\s・ー—\-]/g, '')
  .replace(/を/g, 'お').replace(/は/g, 'わ').replace(/へ/g, 'え')
  .replace(/ぢ/g, 'じ').replace(/づ/g, 'ず')
  .replace(/([おこそとのほもよろごぞどぼぽょ])う/g, '$1お')
  .replace(/([えけせてねへめれげぜでべぺ])い/g, '$1え')
  .replace(/([あいうえお])\1+/g, '$1')
  .replace(/[0-9０-９]/g, '');

async function voicevoxReading(text) {
  const r = await fetch(`${ENGINE}/audio_query?speaker=${SPEAKER}&text=${encodeURIComponent(text)}`, { method: 'POST' });
  if (!r.ok) throw new Error('audio_query ' + r.status);
  const q = await r.json();
  return q.accent_phrases.map(ap => ap.moras.map(m => m.text).join('')).join('');
}

function buildTok() {
  return new Promise((res, rej) => kuromoji.builder({ dicPath: DICT }).build((e, t) => e ? rej(e) : res(t)));
}

// 粗略「疑似分數」：兩邊長度差越大、或差異落在含漢字的詞，越可能是真的多音字誤讀。
// 只用來排序（把最可疑的放最前面人工聽），不做自動判定。
function suspicion(vv, km) {
  if (!km) return 0;                          // kuromoji 沒讀出來（多為純假名/數字），略過
  const lenDiff = Math.abs(vv.length - km.length);
  return lenDiff * 2 + (vv.length && km.length ? 1 : 0);
}

try {
  const v = await fetch(`${ENGINE}/version`).then(r => r.text());
  console.log(`🎤 VOICEVOX ${v.replace(/"/g, '')} 在線`);
} catch {
  console.error('❌ VOICEVOX 沒開！打開 app 後重跑（引擎需在 :50021）');
  process.exit(1);
}

const overrides = loadOverrides();
const texts = JSON.parse(fs.readFileSync(TEXTS, 'utf8'));
const tok = await buildTok();

const mismatches = [];
let n = 0, skipped = 0;
for (const { text } of texts) {
  n++;
  // __SKIP__ 的句子走瀏覽器 TTS，不由 VOICEVOX 生，跳過
  const applied = applyOverrides(text, overrides);
  if (applied === '__SKIP__') { skipped++; continue; }
  let vv;
  try { vv = normKana(await voicevoxReading(applied)); }
  catch { skipped++; continue; }
  const km = normKana(tok.tokenize(text).map(t => kataToHira(t.reading || t.surface_form)).join(''));
  if (vv !== km && km) {
    mismatches.push({ text, voicevox: vv, kuromoji: km, score: suspicion(vv, km) });
  }
  if (n % 200 === 0) process.stdout.write(`  …${n}/${texts.length} 句，候選 ${mismatches.length}\n`);
}

mismatches.sort((a, b) => b.score - a.score);
fs.writeFileSync(OUT,
  'score\tsentence\tvoicevox_says\tkuromoji_expects\n' +
  mismatches.map(m => `${m.score}\t${m.text}\t${m.voicevox}\t${m.kuromoji}`).join('\n') + '\n');

console.log(`\n總 ${n} 句（跳過 ${skipped}），不一致 ${mismatches.length} 句 → ${path.relative(ROOT, OUT)}`);
console.log('（不一致≠一定錯；依疑似分數排序，越前面越該優先人工聽）\n');
for (const m of mismatches.slice(0, 50)) {
  console.log(`[${m.score}] ${m.text}\n   念: ${m.voicevox}\n   期望: ${m.kuromoji}`);
}
if (mismatches.length > 50) console.log(`… 還有 ${mismatches.length - 50} 句，見 TSV`);
