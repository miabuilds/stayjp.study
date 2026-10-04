#!/usr/bin/env node
// 文章發佈前關卡:內容欄位、三語、讀音、封面、語音、逐詞/時間軸覆蓋、publish_at。
//
// 用法(專案根目錄):
//   node scripts/validate-articles.mjs                 # 檢查「排程中(publish_at 在未來)」的文章
//   node scripts/validate-articles.mjs a-n5-11 a-n4-12 # 指定 id
//   node scripts/validate-articles.mjs --all           # 全部(舊文章若有缺口也會列出)
//   加 --no-kuromoji 跳過 kuromoji 讀音比對(沒裝 node_modules 時)
//
// 任何 ERROR → exit 1。WARN 只提醒(例:kuromoji 對複合詞的誤判,要人判)。
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const load = (file, name) => new Function('window', fs.readFileSync(path.join(ROOT, file), 'utf8') + `;return window.${name}`)({});

const ALL = load('articles.js', 'ARTICLES');
const TTS = load('audio/tts/manifest.js', '__TTS') || {};
const TOKENS = load('article-tokens.js', 'ARTICLE_TOKENS') || {};
const TIMINGS = load('article-timings.js', 'ARTICLE_TIMINGS') || {};

const ids = args.filter(a => !a.startsWith('--'));
let targets;
if (args.includes('--all')) targets = ALL;
else if (ids.length) targets = ids.map(id => ALL.find(a => a.id === id) || (console.error('找不到文章', id), process.exit(1)));
else targets = ALL.filter(a => a.publish_at && Date.parse(a.publish_at) > Date.now());
if (!targets.length) { console.log('沒有要檢查的文章(沒有排程中的文章;用 --all 或指定 id)'); process.exit(0); }

let errors = 0, warns = 0;
const err = (id, m) => { errors++; console.log(`  ERROR ${id}: ${m}`); };
const warn = (id, m) => { warns++; console.log(`  WARN  ${id}: ${m}`); };

const KANJI = /[一-鿿々]/;
const KANA_ONLY = /^[ぁ-ゖァ-ヺー・\s]+$/;
const k2h = s => s.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
const sentences = body => (body.match(/[^。！？]+[。！？]?/g) || []).map(s => s.replace(/\s/g, '')).filter(Boolean);

// ── 1. 重複 id
const seen = new Set();
for (const a of ALL) { if (seen.has(a.id)) err(a.id, '重複 id'); seen.add(a.id); }

// ── kuromoji(可選)
let tokenizer = null;
if (!args.includes('--no-kuromoji')) {
  try {
    const require = createRequire(import.meta.url);
    const kuromoji = require('kuromoji');
    const dicPath = path.join(path.dirname(require.resolve('kuromoji')), '..', 'dict');
    tokenizer = await new Promise((res, rej) => kuromoji.builder({ dicPath }).build((e, t) => e ? rej(e) : res(t)));
  } catch (e) { console.log('  (kuromoji 載入失敗,跳過讀音比對:', e.message, ')'); }
}

const ffprobe = spawnSync('ffprobe', ['-version']).status === 0;
function duration(file) {
  if (!ffprobe) return null;
  const r = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], { encoding: 'utf8' });
  return parseFloat(r.stdout) || 0;
}
function checkAudio(id, text, what) {
  const h = TTS[text];
  if (!h) return err(id, `${what} 沒有語音(manifest 查不到):「${text}」`);
  const f = path.join(ROOT, 'audio/tts', h + '.mp3');
  if (!fs.existsSync(f) || fs.statSync(f).size === 0) return err(id, `${what} mp3 不存在或 0 bytes:${h}.mp3「${text}」`);
  const d = duration(f);
  if (d !== null && d <= 0.2) err(id, `${what} mp3 長度異常(${d}s):${h}.mp3`);
}

for (const a of targets) {
  const id = a.id;
  // ── 2. 欄位與三語
  for (const k of ['id', 'level', 'topic', 'topic_en', 'title', 'title_zh', 'title_en', 'body']) if (!a[k] || typeof a[k] !== 'string') err(id, `缺欄位 ${k}`);
  if (!['n5', 'n4', 'n3', 'n2', 'n1'].includes(a.level)) err(id, `level 不合法:${a.level}`);
  const paras = String(a.body || '').split('\n');
  if (paras.some(p => !p.trim())) err(id, 'body 有空段落');
  for (const k of ['trans', 'trans_en']) {
    if (!Array.isArray(a[k])) { err(id, `缺 ${k}`); continue; }
    if (a[k].length !== paras.length) err(id, `${k} 段數 ${a[k].length} ≠ body 段數 ${paras.length}`);
    a[k].forEach((t, i) => { if (!t || !String(t).trim()) err(id, `${k}[${i}] 空白`); });
  }
  if ((a.trans_en || []).some(t => /[一-鿿]/.test(t))) err(id, 'trans_en 含漢字(英文版漏翻?)');
  if (a.level !== 'n5' && /\s/.test(a.body.replace(/\n/g, ''))) warn(id, 'N4 以上 body 不該有空格');
  // ── 3. 單字:讀音、意思、三語
  const vocab = a.vocab || [];
  if (vocab.length < 6) err(id, `vocab 只有 ${vocab.length} 個(測驗分頁至少要 4,慣例 8~10)`);
  for (const v of vocab) {
    if (!v.w || !v.r || !v.m || !v.m_en) { err(id, `vocab 欄位不全:${JSON.stringify(v)}`); continue; }
    if (!KANA_ONLY.test(v.r)) err(id, `vocab 讀音含非假名:${v.w}=${v.r}`);
    if (KANJI.test(v.w) && tokenizer) {
      const kr = k2h(tokenizer.tokenize(v.w).map(t => (t.reading && t.reading !== '*') ? t.reading : t.surface_form).join(''));
      if (kr !== k2h(v.r)) warn(id, `vocab 讀音與 kuromoji 不同(人判):${v.w} r=${v.r} kuromoji=${kr}`);
    }
    if (!KANJI.test(v.w) && k2h(v.w) !== k2h(v.r)) err(id, `vocab 無漢字但 w≠r:${v.w}/${v.r}`);
  }
  // ── 4. 文法
  const gram = a.grammar || [];
  if (gram.length < 2) err(id, `grammar 只有 ${gram.length} 個`);
  for (const g of gram) if (!g.t || !g.note || !g.t_en || !g.note_en) err(id, `grammar 欄位不全:${g.t}`);
  // ── 5. publish_at
  if ('publish_at' in a) {
    if (!/^\d{4}-\d\d-\d\dT\d\d:\d\d(:\d\d)?([+-]\d\d:\d\d|Z)$/.test(a.publish_at) || isNaN(Date.parse(a.publish_at))) err(id, `publish_at 格式錯:${a.publish_at}`);
  }
  // ── 6. 封面
  const cover = path.join(ROOT, 'images/articles', id + '.jpg');
  if (!fs.existsSync(cover)) err(id, `沒有封面 images/articles/${id}.jpg`);
  else {
    const credits = fs.readFileSync(path.join(ROOT, 'CREDITS.md'), 'utf8');
    if (!credits.includes('`' + id + '.jpg`')) err(id, `CREDITS.md 沒登記封面來源/授權(${id}.jpg)`);
  }
  // ── 7. 語音:每句 + 每個單字讀音
  const sents = sentences(a.body || '');
  for (const s of sents) checkAudio(id, s, '句子');
  for (const v of vocab) if (v.r || v.w) checkAudio(id, (v.r || v.w).trim(), '單字');
  // ── 8. 逐詞斷詞(N5 走空格詞塊,不需要)+ 卡拉OK時間軸
  // 時間軸缺了只是少逐詞高亮(前端退回整句),所以只 WARN。N5 不進 tokens → 本來就沒有時間軸。
  for (const s of sents) if (a.level !== 'n5' && !TOKENS[s]) err(id, `article-tokens 缺句(跑 tokenize-articles.mjs):「${s}」`);
  const noTiming = a.level === 'n5' ? [] : sents.filter(s => !TIMINGS[s]);
  if (noTiming.length) warn(id, `${noTiming.length} 句沒有逐詞時間軸(VOICEVOX 拍數對不齊,前端退回整句高亮):${noTiming.map(s => '「' + s.slice(0, 14) + '…」').join(' ')}`);
  // 斷詞後的漢字詞都要有讀音(furigana 不能空)
  if (a.level !== 'n5') for (const s of sents) for (const t of (TOKENS[s] || [])) if (KANJI.test(t.s) && !t.r) err(id, `斷詞缺讀音:${t.s}(「${s}」)`);
  console.log(`  ${id} ${a.level} ${a.title}${a.publish_at ? ' · ' + a.publish_at : ''} — ${sents.length} 句 / ${vocab.length} 詞 / ${gram.length} 文法`);
}

if (!ffprobe) console.log('  (沒有 ffprobe,跳過 mp3 長度檢查)');
console.log(`\n${targets.length} 篇,${errors} ERROR,${warns} WARN`);
process.exit(errors ? 1 : 0);
