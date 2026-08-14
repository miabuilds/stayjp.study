#!/usr/bin/env node
/**
 * audit-pronunciation.mjs — 全站主內容「語音正確性」稽核(安全版根治的偵測層)
 *
 * 目的:把「VOICEVOX 實際念的音 vs kuromoji 標準讀音」比對搬來掃 texts.json 全部句子,
 *       揪出「還沒被 override 修到」的多音字誤讀。只讀不寫、不碰音檔、不改合成邏輯。
 *
 * 關鍵:VOICEVOX 這邊餵「套完 overrides.json 之後」的文字(=使用者真的聽到的音),
 *       所以已修好的 override 不會再冒出來;只剩尚未修的候選會浮出。
 *
 * 智慧過濾(避免 1500 行雜訊,只留真正該人工聽的):
 *   1) 記法正規化:片假名→平假名、長音歸並、助詞 は/へ/を —— 抵消「表音 vs 正字」差異。
 *   2) 多段 LCS 差異對齊:長句裡藏的錯也逐段抽出來,不被整句長度淹沒。
 *   3) 濾雜訊:純長音/促音增減、外來語、已知 kuromoji 自身誤讀(一人ひとり等)全部剔除。
 *
 * 用法:node scripts/tts/audit-pronunciation.mjs [--quiet]
 *       (generate.mjs 結尾會自動呼叫;VOICEVOX 需開著,沒開就靜默跳過)
 * 輸出:console 高信號清單 + scripts/tts/pron-mismatch.tsv(完整)
 * 修法:確認念錯 → 在 overrides.json 加「漢字→假名」(長詞優先,當心互撞短 key)→ generate.mjs 重生。
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
const SPEAKER = 2;
const QUIET = process.argv.includes('--quiet');

const kataToHira = s => (s || '').replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
const normKana = s => kataToHira(s)
  .replace(/[、。「」『』（）()！？!?\s・ー—\-]/g, '')
  .replace(/を/g, 'お').replace(/は/g, 'わ').replace(/へ/g, 'え')
  .replace(/ぢ/g, 'じ').replace(/づ/g, 'ず')
  .replace(/([おこそとのほもよろごぞどぼぽょ])う/g, '$1お')
  .replace(/([えけせてねへめれげぜでべぺ])い/g, '$1え')
  .replace(/([あいうえお])\1+/g, '$1')
  .replace(/[0-9０-９]/g, '');

// 多段 LCS 差異:回傳所有 (vv片段, km片段) 差異對
function lcsDiff(a, b) {
  const n = a.length, m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--)
    dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const segs = []; let i = 0, j = 0, ca = '', cb = '';
  const flush = () => { if (ca || cb) segs.push([ca, cb]); ca = cb = ''; };
  while (i < n && j < m) {
    if (a[i] === b[j]) { flush(); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) ca += a[i++];
    else cb += b[j++];
  }
  while (i < n) ca += a[i++]; while (j < m) cb += b[j++]; flush();
  return segs;
}

// 雜訊過濾:哪些差異段「不是真的多音字誤讀」
const NOISE = /^(あ|い|う|え|お|ー| |～|→|ん|っ)$/;   // 單一元音/促音/長音棒噪聲
// 已確認 VOICEVOX 對、kuromoji 自己錯的常見詞(不要一直被當可疑)
const KUROMOJI_WRONG = /^(ひとり|ふたり|みっか|いつか|かた|もの|こめ|ほか|かよ|よごれ|とき|あかり|おおぜえ|おおぜい|よなか|われ|かど|しんちゅう|くじ|しちじ|なな|とうじ|おうじ|いちじ|りんじ|うえで|せんじか|ほうれんそう|しぶみ|おこなっ|こうむり|くる|きた)$/;
// 已人工逐一驗證過「VOICEVOX 其實念對、kuromoji 亂猜」的差異對(念|應)→ 永久白名單,
// 不再當可疑句。以後真正的新錯會產生「不在此表」的新差異對,自動浮出。
// (2026-08 全站稽核逐句確認;多為 kuromoji 對長音/數字/複合詞的固定誤讀)
const KNOWN_OK = new Set([
  'っ|ち', 'あいだ|ま', 'っぽ|ちほ', 'あと|ご', 'く|きゅう', 'じ|ち', 'っぷ|うふ',
  'おぜ|たいせ', 'ふ|お', 'ゆ|い', 'あと|のち', 'ひと|いち', 'た|ば', 'しち|なな',
  'ぜ|せ', 'ぶ|ふ', 'っぱ|ちわ', 'ん|に', 'い|ゆ', 'ば|わ', 'か|つ', 'び|ひ',
  'い|おこな', 'っぴ|ちひ', 'に|ん', 'に|じ', 'が|か', 'なか|ちゅう', 'っ|く',
  'ぐ|く', 'ど|く', 'し|じ', 'え|おこな', 'みっか|にち', 'こめ|べえ', 'かず|すう',
  'じゅう|なか', 'っぷ|うぶ', 'せえ|なま', 'ち|じ', 'れえ|よわい', 'ぱん|ほ',
]);
function isRealSuspect(dv, dk) {
  if (!dv || !dk) return false;                 // 一邊空 = 長音/漏讀噪聲
  if (dv.length > 4 || dk.length > 4) return false;
  if (!/^[ぁ-んァ-ヶ]+$/.test(dv) || !/^[ぁ-んァ-ヶ]+$/.test(dk)) return false;
  if (NOISE.test(dv) && NOISE.test(dk)) return false;
  if (KUROMOJI_WRONG.test(dv)) return false;    // VOICEVOX 念的正是已知正確讀音
  if (KNOWN_OK.has(`${dv}|${dk}`)) return false; // 已人工驗證過的假警報對
  return true;
}

async function voicevoxReading(text) {
  const r = await fetch(`${ENGINE}/audio_query?speaker=${SPEAKER}&text=${encodeURIComponent(text)}`, { method: 'POST' });
  if (!r.ok) throw new Error('audio_query ' + r.status);
  const q = await r.json();
  return q.accent_phrases.map(ap => ap.moras.map(m => m.text).join('')).join('');
}
function buildTok() {
  return new Promise((res, rej) => kuromoji.builder({ dicPath: DICT }).build((e, t) => e ? rej(e) : res(t)));
}

// VOICEVOX 沒開就靜默跳過(當作 build 的可選步驟,不擋流程)
try {
  await fetch(`${ENGINE}/version`).then(r => r.text());
} catch {
  if (!QUIET) console.log('⏭  發音稽核跳過(VOICEVOX 未開,非錯誤)');
  process.exit(0);
}

const overrides = loadOverrides();
const texts = JSON.parse(fs.readFileSync(TEXTS, 'utf8'));
const tok = await buildTok();

const mismatches = [];
const clusters = {};   // "念⟷應" -> {n, ex}
let n = 0, skipped = 0;
for (const { text } of texts) {
  n++;
  const applied = applyOverrides(text, overrides);
  if (applied === '__SKIP__') { skipped++; continue; }
  let vv;
  try { vv = normKana(await voicevoxReading(applied)); } catch { skipped++; continue; }
  const km = normKana(tok.tokenize(text).map(t => kataToHira(t.reading || t.surface_form)).join(''));
  if (vv === km || !km) continue;
  mismatches.push({ text, vv, km });
  for (const [dv, dk] of lcsDiff(vv, km)) {
    if (!isRealSuspect(dv, dk)) continue;
    const key = `${dv} ⟷ ${dk}`;
    (clusters[key] = clusters[key] || { n: 0, ex: [] });
    clusters[key].n++;
    if (clusters[key].ex.length < 3) clusters[key].ex.push(text.slice(0, 34));
  }
  if (!QUIET && n % 2000 === 0) process.stdout.write(`  …${n}/${texts.length}\n`);
}

fs.writeFileSync(OUT, 'sentence\tvoicevox_says\tkuromoji_expects\n' +
  mismatches.map(m => `${m.text}\t${m.vv}\t${m.km}`).join('\n') + '\n');

const suspects = Object.entries(clusters).sort((a, b) => b[1].n - a[1].n);
console.log(`\n🔊 發音稽核:掃 ${n} 句,${suspects.length} 種疑似多音字誤讀待人工確認`);
if (suspects.length === 0) {
  console.log('✅ 沒有高信號可疑句(其餘不一致皆長音/外來語/kuromoji自身噪聲)');
} else {
  console.log('   (念[VOICEVOX] vs 應[kuromoji];確認錯就在 overrides.json 加漢字→假名)\n');
  for (const [k, v] of suspects.slice(0, 25)) {
    const [dv, dk] = k.split(' ⟷ ');
    console.log(`  ${String(v.n).padStart(3)}× 念[${dv}]應[${dk}]  例:${v.ex[0]}`);
  }
  if (suspects.length > 25) console.log(`  … 還有 ${suspects.length - 25} 種,完整見 ${path.relative(ROOT, OUT)}`);
}
