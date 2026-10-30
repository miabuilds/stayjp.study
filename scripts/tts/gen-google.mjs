#!/usr/bin/env node
// Premium 語音(2026-10-30):Google Chirp 3 HD 日文聲音全站預生成。
//   leda   = ja-JP-Chirp3-HD-Leda(女)   charon = ja-JP-Chirp3-HD-Charon(男)
// 檔案:$STAYJP_AUDIO_DIR/tts-g/<voice>/<hash>.mp3(預設 ~/Documents/GitHub/stay-jp-audio,repo 外),hash 與主音檔相同。
// 上 R2(bucket stayjp-audio,路徑 tts-g/<voice>/<hash>.mp3)→ 前端 tts-config.js TTS_G_BASE。
//
// 讀音保證(「發音一定要對」):
//   1) 單字(文字=讀音假名)→ 送「漢字表記 + customPronunciations(JAPANESE_YOMIGANA=讀音)」:
//      Google 知道是哪個字(重音/語感對)、讀音又被釘死。同音字共用假名音檔 → 取最低級別那個字。
//   2) 句子 → overrides.json 裡人工校過的「漢字→假名」全部轉成 customPronunciations 釘讀音;
//      其餘每個含漢字的詞(kuromoji 斷詞)也釘 kuromoji 讀音,但只在「kuromoji 整句讀音 == VOICEVOX 現行音檔讀音
//      (all-readings.tsv,已被用戶聽過/修過)」的區段才釘;兩邊不合的詞不釘(交給 Google 自己判斷)並記 unpinned.tsv 人工看。
//      → 讀音跟現在線上的主音檔一致,聲音換成 Google。
//   3) 對話「A：…B：…」→ A/B 各用一個聲音(leda 版 A=Leda B=Charon;charon 版相反),ffmpeg 串接。
//   4) 之後 qa-google.mjs 用 whisper 把音檔聽回來對 VOICEVOX 校過的讀音,抓漏。
// 用法:node scripts/tts/gen-google.mjs --voice leda|charon|all [--limit N] [--only grammar-n5,...]
//       [--hashes file] [--force] [--dry] [--concurrency 6] [--force-pron '{"hash":[["漢字","かな"]]}']
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { ROOT, TEXTS_JSON, loadOverrides, splitDialogue, stripHtml } from './_lib.mjs';
const require = createRequire(import.meta.url);

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const voicesArg = opt('--voice', 'leda');
const limit = parseInt(opt('--limit', '0'), 10);
const only = opt('--only', null) ? new Set(opt('--only').split(',')) : null;
const hashesFile = opt('--hashes', null);
const force = args.includes('--force');
const dry = args.includes('--dry');
const CONC = parseInt(opt('--concurrency', '6'), 10);
const extraPron = opt('--force-pron', null) ? JSON.parse(fs.readFileSync(opt('--force-pron'), 'utf8')) : {};

export const VOICES = { leda: 'ja-JP-Chirp3-HD-Leda', charon: 'ja-JP-Chirp3-HD-Charon' };
const PARTNER = { leda: 'charon', charon: 'leda' };
export const OUT_ROOT = path.join(process.env.STAYJP_AUDIO_DIR || path.join(os.homedir(), 'Documents/GitHub/stay-jp-audio'), 'tts-g');
const STATE_DIR = path.join(ROOT, 'scripts/out/tts-g');

function loadKey() {
  if (process.env.GOOGLE_TTS_KEY) return process.env.GOOGLE_TTS_KEY;
  try {
    const rc = fs.readFileSync(path.join(os.homedir(), '.zshrc'), 'utf8');
    const m = rc.match(/GOOGLE_TTS_KEY=["']?([A-Za-z0-9_\-]+)/);
    if (m) return m[1];
  } catch (e) {}
  throw new Error('GOOGLE_TTS_KEY not found (env or ~/.zshrc)');
}

const hasKanji = s => /[一-鿿々〆ヶ]/.test(s);
// ── kuromoji 斷詞 + VOICEVOX 現行讀音(all-readings.tsv)──
export async function loadTokenizer() {
  const kuromoji = require('kuromoji');
  return new Promise((res, rej) => kuromoji.builder({ dicPath: path.join(ROOT, 'node_modules/kuromoji/dict') }).build((e, t) => e ? rej(e) : res(t)));
}
const READINGS = new Map();
try {
  for (const line of fs.readFileSync(path.join(ROOT, 'scripts/tts/all-readings.tsv'), 'utf8').split('\n').slice(1)) {
    const [text, kana, fed] = line.split('\t'); if (!text || !kana || fed === '__SKIP__') continue;
    READINGS.set(text, kana.replace(/['_\/]/g, ''));
  }
} catch (e) {}
const normKana = s => kataToHira(s || '')
  .replace(/[、。「」『』（）()！？!?\s・ー—\-…,.：:]/g, '')
  .replace(/を/g, 'お').replace(/は/g, 'わ').replace(/へ/g, 'え').replace(/ぢ/g, 'じ').replace(/づ/g, 'ず')
  .replace(/([おこそとのほもよろごぞどぼぽょ])う/g, '$1お').replace(/([えけせてねへめれげぜでべぺ])い/g, '$1え')
  .replace(/([あいうえお])\1+/g, '$1').replace(/[0-9０-９]/g, '');
// LCS 對齊:回傳 b 裡「對不上 a」的字元位置集合(含 a 多出來的位置當邊界)
function mismatchPositions(a, b) {
  const n = a.length, m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const bad = new Set(); let i = 0, j = 0;
  while (i < n && j < m) { if (a[i] === b[j]) { i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) { bad.add(j); bad.add(j - 1); i++; } else { bad.add(j); j++; } }
  while (j < m) bad.add(j++); if (i < n) { bad.add(m - 1); }
  return bad;
}
export const unpinned = [];
// kuromoji/VOICEVOX 讀法跟我們要的不同的詞(overrides.json 已把「日本の生活」等改成にほん → 全站統一にほん)
const READING_FIX = { '日本': 'にほん', '日本人': 'にほんじん', '日本中': 'にほんじゅう', '日本一': 'にほんいち' };
const isKana = s => /^[ぁ-ゖァ-ヶーゝゞヽヾ]+$/.test(s);
const kataToHira = s => s.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));

// ── 單字表:讀音 → {w,r}(最低級別優先)、表記 → 讀音 ──
const readingMap = new Map(); const surfaceMap = new Map();
for (const lv of ['n5', 'n4', 'n3', 'n2', 'n1']) {
  const src = fs.readFileSync(path.join(ROOT, `vocab-${lv}.js`), 'utf8');
  for (const m of src.matchAll(/\{w:"([^"]+)",r:"([^"]*)"/g)) {
    const w = m[1], r = m[2];
    if (!r) continue;
    if (!readingMap.has(r)) readingMap.set(r, { w, r, lv });
    if (!surfaceMap.has(w)) surfaceMap.set(w, r);
  }
}

// ── overrides.json → [phrase, yomigana] 候選(只收「漢字→純假名」能釘的) ──
function pronsFromOverrides(base, overrides) {
  const out = [];
  for (const [k0, v0] of overrides) {
    const exact = k0.startsWith('=='); const k = exact ? k0.slice(2) : k0;
    if (exact ? base !== k : !base.includes(k)) continue;
    if (v0 === '__SKIP__') continue;
    let v = v0.startsWith('kana:') ? kataToHira(v0.slice(5).replace(/['_\/]/g, '')) : v0;
    // 去共同前綴;值還有漢字再去共同後綴;還有就放棄
    let a = k, b = v;
    let p = 0; while (p < a.length && p < b.length && a[p] === b[p]) p++;
    a = a.slice(p); b = b.slice(p);
    if (hasKanji(b)) { let s = 0; while (s < a.length - 1 && s < b.length - 1 && a[a.length - 1 - s] === b[b.length - 1 - s]) s++; a = a.slice(0, a.length - s); b = b.slice(0, b.length - s); }
    if (!hasKanji(a) || !isKana(b)) continue;
    if (!base.includes(a)) continue;
    out.push([a, b]);
  }
  return out;
}

// ── 多讀音詞改送假名(2026-10-30 實測:Chirp 3 HD 的 customPronunciations 不一定照念——故郷 釘「こきょう」仍念「ふるさと」,
// 且同一請求輸出不固定。假名在音素層面不會錯,所以 JMdict 列 2 種以上讀音的詞(故郷/日本/今日/一日/市場…)直接把漢字換成讀音,
// 其餘單一讀音的詞照舊送漢字+釘讀音(保留自然斷句)。表:scripts/tts/jmdict-ambig.json(scratchpad jmdict-ambig*.py 產)。
const AMBIG = (() => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/tts/jmdict-ambig.json'), 'utf8')); } catch (e) { return {}; } })();
const kanaSub = !args.includes('--no-kana-sub') && Object.keys(AMBIG).length > 0;
export const substituted = [];   // [hash, phrase, kana]
// 把多讀音的釘選詞換成假名;回傳 {text, prons(剩下的)}
export function applyKanaSub(text, prons, hash, tokenizer) {
  if (!kanaSub) return { text, prons };
  let out = text;
  // 只換 2 字以上的詞(單一漢字多半是動詞語幹 見/言/出,換了整句變假名);判斷用原始詞面 p0 或 kuromoji 基本形 bf
  // (被り→被る:かぶる/こうむる 兩種都常用),換的時候把整個詞面 p0 換成完整讀音 y0。
  // overrides 來的釘選沒有基本形(を被り→被り/こうむり):用 kuromoji 補(單一 token 才信)
  const bfOf = (p0, bf) => { if (bf) return bf; if (!tokenizer) return ''; try { const t = tokenizer.tokenize(p0); return (t.length === 1 && t[0].basic_form && t[0].basic_form !== '*') ? t[0].basic_form : ''; } catch (e) { return ''; } };
  const isAmb = ([p, y, p0, y0, bf]) => { if (bf === 'FORCE') return true; const s = p0 || p, b = bfOf(s, bf); return s.length >= 2 && ((AMBIG[s] && AMBIG[s].length >= 2) || (b && AMBIG[b] && AMBIG[b].length >= 2)); };
  const amb = prons.filter(isAmb).sort((a, b) => (b[2] || b[0]).length - (a[2] || a[0]).length);
  for (const e of amb) { const p0 = e[2] || e[0], y0 = kataToHira(e[3] || e[1]); if (out.includes(p0)) { out = out.split(p0).join(y0); substituted.push([hash, p0, y0]); } }
  return { text: out, prons: prons.filter(e => !amb.includes(e) && out.includes(e[0])).map(([p, y]) => [p, y]) };
}

// 一筆文字 → {input, prons, turns?}
export const skipped = [];
export function buildRequest(entry, overrides, tokenizer) {
  const text = entry.text;
  const base = stripHtml(text).replace(/\s+/g, '').replace(/^[—–\-ー]+/, '');
  const isVocab = entry.sources.some(s => /^(vocab|hw)/.test(s));
  let input = base;
  const prons = [];
  // Google 規則(實測 2026-10-30):phrase 必須「漢字開頭、漢字結尾」(中間可夾假名:飲み物 OK;お暇/帰ります 不行)。
  // → 去掉頭尾跟讀音相同的假名(お金/おかね → 金/かね,帰ります/かえります → 帰/かえ)。
  // 單一漢字的 phrase 會套到整句所有同字(帰国也變かえ)→ 只在該字於句中只出現一次時才釘,否則記 skipped.log 人工看。
  const trimPhrase = (p, y) => {
    let a = p, b = y; const eq = (x, z) => kataToHira(x) === kataToHira(z);
    while (a.length && !hasKanji(a[0]) && b.length && eq(a[0], b[0])) { a = a.slice(1); b = b.slice(1); }
    while (a.length && !hasKanji(a[a.length - 1]) && b.length && eq(a[a.length - 1], b[b.length - 1])) { a = a.slice(0, -1); b = b.slice(0, -1); }
    if (!a || !b || !hasKanji(a[0]) || !hasKanji(a[a.length - 1]) || !isKana(b)) return null;
    return [a, b];
  };
  const push = (p0, y0, bf) => {
    const t = trimPhrase(p0, y0); if (!t) { skipped.push([entry.hash, p0, y0, 'shape']); return; }
    const [p, y] = t;
    if (prons.some(x => x[0] === p)) return;
    const occ = (input || base).split(p).length - 1;
    if (p.length === 1 && occ !== 1) { skipped.push([entry.hash, p0, y0, 'single-kanji×' + occ]); return; }
    prons.push([p, y, p0, y0, bf || '']);   // 後三個只給 applyKanaSub 用,送 Google 前會切掉
  };
  if (entry.hw) {                                   // 同音不同重音:文字=漢字,讀音查單字表
    const r = surfaceMap.get(text); if (r) push(text, r);
  } else if (isVocab && isKana(base) && readingMap.has(base)) {   // 單字讀音 key → 送漢字 + 釘讀音
    const { w } = readingMap.get(base);
    if (w !== base && hasKanji(w) && !/[〜～（）()・\/]/.test(w)) { input = w; push(w, base); if (!prons.length) input = base; }   // 釘不住(形狀不合)就退回送假名
  } else if (isVocab && hasKanji(base) && surfaceMap.has(base)) { // 單字漢字 key(讀音缺)→ 釘單字表讀音
    push(base, surfaceMap.get(base));
  }
  for (const [p, y] of pronsFromOverrides(base, overrides)) push(p, y);
  // 其餘含漢字的詞:kuromoji 讀音,只在跟 VOICEVOX 現行讀音對得上的區段釘
  if (tokenizer && input === base && hasKanji(base)) {
    const toks = tokenizer.tokenize(base);
    const info = []; let pos = 0;
    for (const t of toks) { let r = (t.reading && t.reading !== '*') ? t.reading : t.surface_form; if (READING_FIX[t.surface_form]) r = READING_FIX[t.surface_form]; const nk = normKana(r); info.push({ sf: t.surface_form, r: kataToHira(r), bf: (t.basic_form && t.basic_form !== '*') ? t.basic_form : '', s: pos, e: pos + nk.length }); pos += nk.length; }
    const km = info.map(x => normKana(x.r)).join('');
    const vv = READINGS.has(text) ? normKana(READINGS.get(text)) : null;
    const bad = vv == null ? new Set() : mismatchPositions(vv, km);
    for (const x of info) {
      if (!hasKanji(x.sf)) continue;
      if (prons.some(p => p[0].includes(x.sf) || x.sf.includes(p[0]))) continue;   // 已被 overrides 釘住的範圍不重釘
      let hit = false; for (let k = x.s; k < Math.max(x.e, x.s + 1); k++) if (bad.has(k)) { hit = true; break; }
      if (hit && !READING_FIX[x.sf]) { unpinned.push([entry.hash, x.sf, x.r, vv, km]); continue; }   // READING_FIX 的詞一律釘(跟 VOICEVOX 不同也釘)
      push(x.sf, x.r, x.bf);
    }
  }
  // --force-pron 的人工讀音:不走釘選(釘選不可靠、單字形狀也常釘不上),直接標 FORCE 讓 applyKanaSub 換成假名
  for (const [p, y] of (extraPron[entry.hash] || [])) { for (let i = prons.length - 1; i >= 0; i--) if (prons[i][0] === p || (prons[i][2] || '') === p || p.includes(prons[i][0])) prons.splice(i, 1); prons.push([p, y, p, y, 'FORCE']); }
  const turns0 = splitDialogue(base);
  if (turns0) {
    const turns = turns0.map(t => { const line = t.line.replace(/\s+/g, ''); const r = applyKanaSub(line, prons.filter(([p]) => line.includes(p)), entry.hash, tokenizer); return { ...t, line: r.text, prons: r.prons }; });
    return { input, prons: prons.map(([p, y]) => [p, y]), turns };
  }
  const r = applyKanaSub(input, prons, entry.hash, tokenizer);
  return { input: r.text, prons: r.prons, turns: null };
}

// ── Google TTS ──
const KEY = dry ? '' : loadKey();
async function synth(text, prons, voiceName) {
  const body = {
    input: { text, ...(prons.length ? { customPronunciations: { pronunciations: prons.map(([phrase, pronunciation]) => ({ phrase, phoneticEncoding: 'PHONETIC_ENCODING_JAPANESE_YOMIGANA', pronunciation })) } } : {}) },
    voice: { languageCode: 'ja-JP', name: voiceName },
    audioConfig: { audioEncoding: 'MP3', sampleRateHertz: 24000 },
  };
  let lastErr;
  for (let attempt = 0; attempt < 10; attempt++) {
    try {
      const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 45000);
      const res = await fetch('https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=' + KEY, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: ctl.signal }).finally(() => clearTimeout(t));
      if (res.status === 429 || res.status >= 500) { lastErr = new Error('HTTP ' + res.status + ' ' + (await res.text()).replace(/\s+/g, ' ').slice(0, 160)); await new Promise(r => setTimeout(r, (res.status === 429 ? 8000 : 1500) * (attempt + 1))); continue; }
      const j = await res.json();
      if (!j.audioContent) throw new Error('no audio: ' + JSON.stringify(j).slice(0, 300));
      return Buffer.from(j.audioContent, 'base64');
    } catch (e) { lastErr = e; if (/no audio/.test(e.message)) throw e; await new Promise(r => setTimeout(r, 1500 * 2 ** attempt)); }
  }
  throw lastErr;
}
function concatMp3(bufs, outPath) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'stayjp-g-'));
  try {
    const files = bufs.map((b, i) => { const f = path.join(tmp, i + '.mp3'); fs.writeFileSync(f, b); return f; });
    const a = ['-loglevel', 'error', '-y']; files.forEach(f => a.push('-i', f));
    const filt = files.map((_, i) => `[${i}:a]apad=pad_dur=0.35[a${i}]`).join(';') + ';' + files.map((_, i) => `[a${i}]`).join('') + `concat=n=${files.length}:v=0:a=1[o]`;
    a.push('-filter_complex', filt, '-map', '[o]', '-ac', '1', '-ar', '24000', '-b:a', '64k', outPath);
    execFileSync('ffmpeg', a, { timeout: 30000, killSignal: 'SIGKILL' });
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
}

// ── 主流程 ──
if (import.meta.url === `file://${process.argv[1]}`) {
  const overrides = loadOverrides();
  const texts = JSON.parse(fs.readFileSync(TEXTS_JSON, 'utf8'));
  // 同音不同重音的字(audio/tts/homophones.js):文字=漢字、hash 獨立
  try {
    const hw = JSON.parse(fs.readFileSync(path.join(ROOT, 'audio/tts/homophones.js'), 'utf8').replace(/^[\s\S]*?window\.__TTS_HW = /, '').replace(/;\s*$/, ''));
    for (const [w, hash] of Object.entries(hw)) texts.push({ text: w, hash, sources: ['hw'], hw: true });
  } catch (e) {}
  let work = texts;
  if (only) work = work.filter(t => t.sources.some(s => only.has(s.split('#')[0])));
  if (hashesFile) { const hs = new Set(fs.readFileSync(hashesFile, 'utf8').split(/\s+/).filter(Boolean)); work = work.filter(t => hs.has(t.hash)); }
  if (limit) work = work.slice(0, limit);
  const voices = voicesArg === 'all' ? Object.keys(VOICES) : voicesArg.split(',');
  for (const v of voices) if (!VOICES[v]) throw new Error('unknown voice ' + v);

  if (dry) {
    let withPron = 0, dlg = 0, swapped = 0;
    const tokenizer = await loadTokenizer();
    let pins = 0;
    for (const t of work) { const r = buildRequest(t, overrides, tokenizer); if (r.prons.length) withPron++; pins += r.prons.length; if (r.turns) dlg++; if (r.input !== t.text.replace(/\s+/g, '')) swapped++; }
    fs.mkdirSync(STATE_DIR, { recursive: true }); fs.writeFileSync(path.join(STATE_DIR, 'unpinned.tsv'), unpinned.map(r => r.join('\t')).join('\n') + '\n');
    console.log('pins', pins, 'unpinned tokens', unpinned.length, '→', path.join(STATE_DIR, 'unpinned.tsv'));
    fs.writeFileSync(path.join(STATE_DIR, 'substituted.tsv'), substituted.map(r => r.join('\t')).join('\n') + '\n');
    console.log('kana-substituted', substituted.length, 'in', new Set(substituted.map(r => r[0])).size, 'texts →', path.join(STATE_DIR, 'substituted.tsv'));
    console.log({ texts: work.length, withPron, dialogues: dlg, inputSwapped: swapped, skipped: skipped.length, chars: work.reduce((n, t) => n + t.text.length, 0) });
    fs.mkdirSync(STATE_DIR, { recursive: true }); fs.writeFileSync(path.join(STATE_DIR, 'skipped.tsv'), skipped.map(r => r.join('\t')).join('\n') + '\n');
    console.log('skipped →', path.join(STATE_DIR, 'skipped.tsv'));
    for (const t of work.filter(t => hasKanji(t.text)).slice(0, 12)) { const r = buildRequest(t, overrides, tokenizer); console.log(t.hash, JSON.stringify(t.text), '→', JSON.stringify(r.input), JSON.stringify(r.prons)); }
    process.exit(0);
  }

  const tokenizer = await loadTokenizer();
  for (const v of voices) {
    const outDir = path.join(OUT_ROOT, v); fs.mkdirSync(outDir, { recursive: true }); fs.mkdirSync(path.join(STATE_DIR, v), { recursive: true });
    const stateFile = path.join(STATE_DIR, v, 'done.json');
    const state = fs.existsSync(stateFile) ? JSON.parse(fs.readFileSync(stateFile, 'utf8')) : {};
    const failLog = path.join(STATE_DIR, v, 'fail.log');
    const save = () => fs.writeFileSync(stateFile, JSON.stringify(state));
    let made = 0, skipped = 0, failed = 0, i = 0; const t0 = Date.now();
    const queue = work.slice();
    async function worker() {
      while (queue.length) {
        const entry = queue.shift();
        const mp3 = path.join(outDir, entry.hash + '.mp3');
        if (!force && fs.existsSync(mp3) && state[entry.hash]) { skipped++; continue; }
        const req = buildRequest(entry, overrides, tokenizer);
        try {
          if (req.turns) {
            const bufs = [];
            for (const turn of req.turns) {
              const line = turn.line.replace(/\s+/g, '');
              const prons = turn.prons || req.prons.filter(([p]) => line.includes(p));
              bufs.push(await synth(line, prons, VOICES[turn.who === 'A' ? v : PARTNER[v]]));
            }
            concatMp3(bufs, mp3);
          } else {
            fs.writeFileSync(mp3, await synth(req.input, req.prons, VOICES[v]));
          }
          state[entry.hash] = { in: req.input, p: req.prons, ...(req.turns ? { d: 1 } : {}), t: Date.now() };
          made++;
        } catch (e) {
          failed++; fs.appendFileSync(failLog, `${entry.hash}\t${entry.text}\t${e.message}\t${new Date().toISOString()}\n`);
        }
        if (++i % 200 === 0) { save(); console.log(`[${v}] ${i}/${work.length} made ${made} skipped ${skipped} failed ${failed} ${(Date.now() - t0) / 1000 | 0}s`); }
      }
    }
    await Promise.all(Array.from({ length: CONC }, worker));
    save();
    console.log(`[${v}] DONE made ${made} skipped ${skipped} failed ${failed} in ${(Date.now() - t0) / 1000 | 0}s → ${outDir}`);
  }
}
