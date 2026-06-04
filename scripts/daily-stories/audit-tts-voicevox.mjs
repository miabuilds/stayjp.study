#!/usr/bin/env node
/**
 * audit-tts-voicevox.mjs — 「語音正確性」測試（第 3 層，高精度）
 *
 * 原理：同一句話讓兩個獨立引擎各自決定讀音 —
 *   - VOICEVOX /audio_query：回傳它「實際會念出來」的假名（= 你聽到的音）
 *   - kuromoji：回傳斷詞器的期望讀音
 * 兩者不一致 → 該句很可能念錯，列入清單人工確認。
 * 這能揪出像「方→ほう（應 かた）」這種多音字誤讀。
 *
 * 前置：打開 VOICEVOX app（引擎在 http://127.0.0.1:50021）
 * 用法：node scripts/daily-stories/audit-tts-voicevox.mjs [--level n5]
 * 輸出：scripts/daily-stories/tts-mismatch.tsv（VOICEVOX 與 kuromoji 不一致的句子）
 *
 * 修法：對確認念錯的句子，在故事 JSON 該句加 "r":"<正確假名版>"，
 *       前端與 tts.mjs 都會改用 r（見 playSentence / tts.mjs）。
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const kuromoji = require('kuromoji');

const ROOT = path.resolve(import.meta.dirname, '../..');
const DICT = path.join(ROOT, 'node_modules/kuromoji/dict');
const STORIES = path.join(import.meta.dirname, 'output');
const OUT = path.join(import.meta.dirname, 'tts-mismatch.tsv');
const ENGINE = 'http://127.0.0.1:50021';
const SPEAKER = 2; // 與 tts.mjs 一致：四国めたん ノーマル

const argv = process.argv.slice(2);
const lv = (argv.indexOf('--level') >= 0) ? argv[argv.indexOf('--level') + 1] : null;
const kataToHira = s => (s || '').replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
// 記法歸一化（兩邊同時套用，抵消「表音 vs 正字」差異，只留真正的讀音錯）：
//  - 助詞 は→わ / を→お / へ→え（VOICEVOX 按發音寫）
//  - 長音 おう→おお、えい→ええ（o 段/e 段 + う/い 統一成長音）
//  - づ→ず、ぢ→じ
//  - 去標點、長音棒、破折號、空白
const normKana = s => kataToHira(s)
  .replace(/[、。「」『』（）()！？!?\s・ー—\-]/g, '')
  .replace(/を/g, 'お').replace(/は/g, 'わ').replace(/へ/g, 'え')
  .replace(/ぢ/g, 'じ').replace(/づ/g, 'ず')
  .replace(/([おこそとのほもよろごぞどぼぽょ])う/g, '$1お')
  .replace(/([えけせてねへめれげぜでべぺ])い/g, '$1え')
  .replace(/([あいうえお])\1+/g, '$1')   // 疊元音長音歸並：おお→お、ええ→え、ぴい→ぴい(不動)
  .replace(/[0-9０-９]/g, '');            // 去數字（kuromoji 常漏讀阿拉伯數字）

async function voicevoxReading(text) {
  const r = await fetch(`${ENGINE}/audio_query?speaker=${SPEAKER}&text=${encodeURIComponent(text)}`, { method: 'POST' });
  if (!r.ok) throw new Error('audio_query ' + r.status);
  const q = await r.json();
  // accent_phrases[].moras[].text 是片假名；組回整句讀音
  return q.accent_phrases.map(ap =>
    ap.moras.map(m => m.text).join('') + (ap.pause_mora ? '' : '')
  ).join('');
}

function buildTok() {
  return new Promise((res, rej) => kuromoji.builder({ dicPath: DICT }).build((e, t) => e ? rej(e) : res(t)));
}

// 確認 VOICEVOX 在線
try {
  const v = await fetch(`${ENGINE}/version`).then(r => r.text());
  console.log(`🎤 VOICEVOX ${v.replace(/"/g, '')} 在線`);
} catch {
  console.error('❌ VOICEVOX 沒開！打開 VOICEVOX app 後重跑（引擎需在 :50021）');
  process.exit(1);
}

const tok = await buildTok();
const files = fs.readdirSync(STORIES).filter(f => f.endsWith('.json'))
  .filter(f => !lv || f.startsWith(lv + '_'))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

const mismatches = [];
let n = 0;
for (const f of files) {
  const data = JSON.parse(fs.readFileSync(path.join(STORIES, f), 'utf8'));
  for (const s of data.story?.sentences || []) {
    const text = s.r || s.j; // 與前端/ tts.mjs 一致：有 r 用 r
    n++;
    const vv = normKana(await voicevoxReading(text));
    const km = normKana(tok.tokenize(text).map(t => kataToHira(t.reading || t.surface_form)).join(''));
    if (vv !== km) mismatches.push({ f, j: s.j, voicevox: vv, kuromoji: km, hasR: !!s.r });
    if (n % 50 === 0) process.stdout.write(`  …${n} 句\n`);
  }
}

fs.writeFileSync(OUT,
  'file\tsentence\tvoicevox_says\tkuromoji_expects\thas_r\n' +
  mismatches.map(m => `${m.f}\t${m.j}\t${m.voicevox}\t${m.kuromoji}\t${m.hasR ? 'Y' : ''}`).join('\n') + '\n');

console.log(`\n總 ${n} 句，VOICEVOX 與 kuromoji 不一致 ${mismatches.length} 句 → ${path.relative(ROOT, OUT)}`);
console.log('（不一致≠一定錯，兩引擎都可能猜錯；但這些是最該人工聽的優先句）\n');
for (const m of mismatches.slice(0, 40)) {
  console.log(`[${m.f}] ${m.j}\n   VOICEVOX唸: ${m.voicevox}\n   kuromoji : ${m.kuromoji}${m.hasR ? '  (已有 r)' : ''}`);
}
if (mismatches.length > 40) console.log(`… 還有 ${mismatches.length - 40} 句，見 TSV`);
