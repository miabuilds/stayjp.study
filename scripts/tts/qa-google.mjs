#!/usr/bin/env node
// Premium 語音讀音稽核(2026-10-30):把 gen-google.mjs 產的 mp3 用 whisper.cpp 聽回來,轉成假名跟「VOICEVOX 校過的讀音」比,
// 列出不一致的句子給人看。只讀不寫音檔。
//   期望讀音:句子 → scripts/tts/all-readings.tsv(dump-readings.mjs 產,= 現行主音檔念法,含 overrides 修正)
//            單字(文字本身是假名)→ 文字;同音字(hw)→ 單字表讀音
//   聽回來:whisper-cli(large-v3-turbo)→ 文字 → kuromoji 讀音 → 正規化(長音/助詞/片假名歸一,同 audit-pronunciation)
// 用法:node scripts/tts/qa-google.mjs --voice leda [--limit N] [--sample N] [--hashes file] [--only vocab-n5,...] [--batch 150]
//   需要 WHISPER_CLI(預設 scratchpad 編的)與 WHISPER_MODEL(預設 kotoba 的 ggml-large-v3-turbo-q5_0.bin)
// 輸出:scripts/out/tts-g/<voice>/qa-mismatch.tsv(hash, 來源, 原文, 期望, 聽到, 差異段)+ qa-summary.json
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { ROOT, TEXTS_JSON } from './_lib.mjs';
import { OUT_ROOT } from './gen-google.mjs';

const require = createRequire(import.meta.url);
const kuromoji = require('kuromoji');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const voices = (opt('--voice', 'leda') === 'all' ? ['leda', 'charon'] : opt('--voice', 'leda').split(','));
const limit = parseInt(opt('--limit', '0'), 10);
const sample = parseInt(opt('--sample', '0'), 10);
const only = opt('--only', null) ? new Set(opt('--only').split(',')) : null;
const BATCH = parseInt(opt('--batch', '150'), 10);
const WHISPER = process.env.WHISPER_CLI || '/private/tmp/claude-501/-Users-linyurou/e32db07f-4c6a-46c7-b2bd-6d4fc32cbdaa/scratchpad/wcpp/bin/whisper-cli';
const MODEL = process.env.WHISPER_MODEL || path.join(os.homedir(), 'Library/Application Support/kotoba/models/ggml-large-v3-turbo-q5_0.bin');
const STATE_DIR = path.join(ROOT, 'scripts/out/tts-g');

const kataToHira = s => (s || '').replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
const normKana = s => kataToHira(s)
  .replace(/[、。「」『』（）()！？!?\s・ー—\-…,.A-Za-zＡ-Ｚａ-ｚ：:]/g, '')
  .replace(/を/g, 'お').replace(/は/g, 'わ').replace(/へ/g, 'え')
  .replace(/ぢ/g, 'じ').replace(/づ/g, 'ず')
  .replace(/([おこそとのほもよろごぞどぼぽょ])う/g, '$1お')
  .replace(/([えけせてねへめれげぜでべぺ])い/g, '$1え')
  .replace(/([あいうえお])\1+/g, '$1')
  .replace(/っ/g, '')
  .replace(/[0-9０-９]/g, '');
const hasKanji = s => /[一-鿿々]/.test(s);
function lcsDiff(a, b) {
  const n = a.length, m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const segs = []; let i = 0, j = 0, ca = '', cb = '';
  const flush = () => { if (ca || cb) segs.push(ca + '→' + cb); ca = cb = ''; };
  while (i < n && j < m) { if (a[i] === b[j]) { flush(); i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) ca += a[i++]; else cb += b[j++]; }
  while (i < n) ca += a[i++]; while (j < m) cb += b[j++]; flush();
  return segs;
}

const tokenizer = await new Promise((res, rej) => kuromoji.builder({ dicPath: path.join(ROOT, 'node_modules/kuromoji/dict') }).build((e, t) => e ? rej(e) : res(t)));
const toKana = s => tokenizer.tokenize(s).map(t => (t.reading && t.reading !== '*') ? t.reading : t.surface_form).join('');

// 期望讀音表
const texts = JSON.parse(fs.readFileSync(TEXTS_JSON, 'utf8'));
const byHash = new Map(texts.map(t => [t.hash, t]));
const expected = new Map();
for (const line of fs.readFileSync(path.join(ROOT, 'scripts/tts/all-readings.tsv'), 'utf8').split('\n').slice(1)) {
  const [text, kana] = line.split('\t'); if (!text || !kana) continue;
  expected.set(text, kana.replace(/['_\/]/g, ''));
}
const surfaceMap = new Map();
for (const lv of ['n5', 'n4', 'n3', 'n2', 'n1']) for (const m of fs.readFileSync(path.join(ROOT, `vocab-${lv}.js`), 'utf8').matchAll(/\{w:"([^"]+)",r:"([^"]*)"/g)) if (m[2] && !surfaceMap.has(m[1])) surfaceMap.set(m[1], m[2]);
try { const hw = JSON.parse(fs.readFileSync(path.join(ROOT, 'audio/tts/homophones.js'), 'utf8').replace(/^[\s\S]*?window\.__TTS_HW = /, '').replace(/;\s*$/, '')); for (const [w, h] of Object.entries(hw)) byHash.set(h, { text: w, hash: h, sources: ['hw'], hw: true }); } catch (e) {}
function expectedKana(entry) {
  if (entry.hw) return surfaceMap.get(entry.text) || '';
  if (!hasKanji(entry.text) && /^[ぁ-ゖァ-ヶー\s]+$/.test(entry.text)) return entry.text;
  return expected.get(entry.text) || toKana(entry.text.replace(/\s+/g, ''));
}

if (!fs.existsSync(WHISPER)) { console.error('whisper-cli not found: ' + WHISPER); process.exit(1); }
for (const v of voices) {
  const dir = path.join(OUT_ROOT, v);
  const state = JSON.parse(fs.readFileSync(path.join(STATE_DIR, v, 'done.json'), 'utf8'));
  let hashes = Object.keys(state).filter(h => byHash.has(h) && fs.existsSync(path.join(dir, h + '.mp3')));
  if (opt('--hashes', null)) { const hs = new Set(fs.readFileSync(opt('--hashes'), 'utf8').split(/\s+/).filter(Boolean)); hashes = hashes.filter(h => hs.has(h)); }   // 指定 hash 清單(跟對照組用同一批)
  if (only) hashes = hashes.filter(h => byHash.get(h).sources.some(s => only.has(s.split('#')[0])));
  if (sample) { for (let i = hashes.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [hashes[i], hashes[j]] = [hashes[j], hashes[i]]; } hashes = hashes.slice(0, sample); }
  if (limit) hashes = hashes.slice(0, limit);
  const outDir = path.join(STATE_DIR, v); fs.mkdirSync(outDir, { recursive: true });
  const heardFile = path.join(outDir, 'qa-heard.json');
  const heard = fs.existsSync(heardFile) ? JSON.parse(fs.readFileSync(heardFile, 'utf8')) : {};
  const todo = hashes.filter(h => heard[h] == null);
  console.log(`[${v}] clips ${hashes.length}, to transcribe ${todo.length}`);
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'stayjp-qa-'));
  const t0 = Date.now();
  for (let i = 0; i < todo.length; i += BATCH) {
    const chunk = todo.slice(i, i + BATCH);
    const wavs = [];
    for (const h of chunk) { const w = path.join(tmp, h + '.wav'); try { execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', path.join(dir, h + '.mp3'), '-ar', '16000', '-ac', '1', w], { timeout: 20000 }); wavs.push(w); } catch (e) { heard[h] = ''; } }
    try { execFileSync(WHISPER, ['-m', MODEL, '-l', 'ja', '-nt', '-np', '-otxt', '--prompt', 'ひらがなで、ていねいにかきます。', ...wavs], { stdio: 'ignore', timeout: 1800000 }); } catch (e) { console.error('whisper batch failed', e.message); }
    for (const w of wavs) { const h = path.basename(w, '.wav'); let txt = ''; try { txt = fs.readFileSync(w + '.txt', 'utf8').replace(/\s+/g, '').trim(); } catch (e) {} heard[h] = txt; try { fs.unlinkSync(w); fs.unlinkSync(w + '.txt'); } catch (e) {} }
    fs.writeFileSync(heardFile, JSON.stringify(heard));
    console.log(`[${v}] ${Math.min(i + BATCH, todo.length)}/${todo.length} ${(Date.now() - t0) / 1000 | 0}s`);
  }
  fs.rmSync(tmp, { recursive: true, force: true });
  // 比對
  const rows = []; let ok = 0, empty = 0;
  for (const h of hashes) {
    const e = byHash.get(h); const exp = normKana(expectedKana(e)); const got = heard[h] || '';
    if (!got) { empty++; rows.push([h, e.sources[0], e.text, exp, '(無辨識)', '']); continue; }
    const gk = normKana(toKana(got));
    if (gk === exp) { ok++; continue; }
    rows.push([h, e.sources[0], e.text, exp, got + ' / ' + gk, lcsDiff(exp, gk).join(' ')]);
  }
  fs.writeFileSync(path.join(outDir, 'qa-mismatch.tsv'), 'hash\tsource\ttext\texpected\theard\tdiff\n' + rows.map(r => r.join('\t')).join('\n') + '\n');
  const summary = { voice: v, clips: hashes.length, ok, mismatch: rows.length - empty, empty, at: new Date().toISOString() };
  fs.writeFileSync(path.join(outDir, 'qa-summary.json'), JSON.stringify(summary, null, 2));
  console.log(summary, '→', path.join(outDir, 'qa-mismatch.tsv'));
}
