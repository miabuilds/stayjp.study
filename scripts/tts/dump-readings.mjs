#!/usr/bin/env node
// 為每個 texts.json 文本呼叫 VOICEVOX audio_query 抓出實際分析的假名，匯出 TSV。
// 目的：餵 Gemini 抓潛在念錯（多音字、外來詞、人名地名）。
//
// 輸出：scripts/tts/all-readings.tsv
// 格式：text<TAB>kana<TAB>fed_text<TAB>sources
//   - text: 原始文字（前端會在此 key 上查 __TTS hash）
//   - kana: VOICEVOX 給出的假名分析（accent_phrases.kana 串接）
//   - fed_text: 經 overrides 處理後實際丟給 VOICEVOX 的內容（看得到 kana:... __SKIP__ 等）
//   - sources: 來源（grammar-n3 / vocab-n5 / listening / ...）逗號分隔

import fs from 'node:fs';
import path from 'node:path';
import { ROOT, TEXTS_JSON, loadOverrides, applyOverrides, ENGINE, SPEAKER } from './_lib.mjs';

const OUT = path.join(ROOT, 'scripts/tts/all-readings.tsv');

const texts = JSON.parse(fs.readFileSync(TEXTS_JSON, 'utf8'));
const overrides = loadOverrides();

console.log(`Processing ${texts.length} texts...`);

async function getKana(fed) {
  // __SKIP__：沒生 mp3 → 標記
  if (fed === '__SKIP__') return '__SKIP_BROWSER_TTS__';
  // kana: 前綴 → 走 is_kana=true 顯示直接用 kana 本身
  if (fed.startsWith('kana:')) return fed.slice(5);
  // 一般文字 → 問 VOICEVOX
  const url = `${ENGINE}/audio_query?text=${encodeURIComponent(fed)}&speaker=${SPEAKER}`;
  const r = await fetch(url, { method: 'POST' });
  if (!r.ok) throw new Error(`audio_query ${r.status}`);
  const d = await r.json();
  // kana 欄位有時 null（短文），用 accent_phrases 自己組
  if (d.kana) return d.kana;
  return (d.accent_phrases || []).map(p => p.moras.map(m => m.text).join('')).join('、');
}

const out = ['text\tkana\tfed_text\tsources'];
let done = 0, failed = 0;
const start = Date.now();

for (const t of texts) {
  const fed = applyOverrides(t.text, overrides);
  let kana = '';
  try {
    kana = await getKana(fed);
  } catch (e) {
    kana = `ERR:${e.message}`;
    failed++;
  }
  const sources = (t.sources || []).join(',');
  out.push([t.text, kana, fed, sources].map(s => String(s).replace(/\t/g, ' ').replace(/\n/g, ' ')).join('\t'));
  done++;
  if (done % 500 === 0) {
    const elapsed = (Date.now() - start) / 1000;
    const rate = done / elapsed;
    const eta = (texts.length - done) / rate;
    console.log(`  ${done}/${texts.length}  ${rate.toFixed(1)}/s  ETA ${(eta/60).toFixed(1)}m  failed=${failed}`);
    // 每 500 條 flush 一次，中斷也有部分結果
    fs.writeFileSync(OUT, out.join('\n') + '\n');
  }
}

fs.writeFileSync(OUT, out.join('\n') + '\n');
console.log(`\nDone. ${done} entries → ${path.relative(ROOT, OUT)}`);
console.log(`failed: ${failed}`);
