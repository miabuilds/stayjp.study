// 產生逐詞卡拉OK時間軸:用 VOICEVOX audio_query 的每拍(mora)時長,算出每個詞唸完的秒數。
// 前端讀 article-timings.js,播音時逐詞高亮(對齊實際發音,非線性掃描)。
// 需 VOICEVOX 開著(與 generate.mjs 同 speaker/參數);只查詢不合成,很快。
import fs from 'node:fs';
import path from 'node:path';
import { audioQuery, loadOverrides, applyOverrides, ROOT } from './_lib.mjs';

const T = (new Function('window', fs.readFileSync(path.join(ROOT, 'article-tokens.js'), 'utf8') + ';return window.ARTICLE_TOKENS'))({});
const ARTICLES = (new Function('window', fs.readFileSync(path.join(ROOT, 'articles.js'), 'utf8') + ';return window.ARTICLES;'))({}) || [];

const SMALL = 'ゃゅょぁぃぅぇぉャュョァィゥェォ';   // 拗音併入前一拍(平+片假名)
const moraCount = k => { if (!k) return 0; let n = 0; for (const c of k) if (!SMALL.includes(c)) n++; return n; };
const isKanji = s => /[一-鿿々]/.test(s);
const isKana = s => /^[ぁ-ゖァ-ヶー]+$/.test(s);          // 含片假名
// 詞的假名(供算拍數):含漢字用讀音 r;純假名用表層;其餘(標點/符號)0 拍
const tokKana = t => isKanji(t.s) ? (t.r || '') : (isKana(t.s) ? t.s : '');

// 收集所有文章句子(與前端 renderRead 一致的切句)
const sents = [];
const seen = new Set();
for (const a of ARTICLES) {
  for (const p of String(a.body).split('\n')) {
    if (!p.trim()) continue;
    for (const s of (p.match(/[^。！？]+[。！？]?/g) || [])) {
      const clean = s.replace(/\s/g, '');
      if (clean && !seen.has(clean)) { seen.add(clean); sents.push(clean); }
    }
  }
}

const ov = loadOverrides();
const OUT = {};
let ok = 0, skipSkip = 0, skipNoTok = 0, misalign = [];
for (const sent of sents) {
  const toks = T[sent];
  if (!toks) { skipNoTok++; continue; }
  const fed = applyOverrides(sent, ov);
  if (fed === '__SKIP__') { skipSkip++; continue; }   // 這句用瀏覽器 TTS,無預錄,不做時間軸
  let q;
  try { q = await audioQuery(fed); } catch (e) { misalign.push(sent + ' [query fail]'); continue; }
  // 累積每拍結束時間
  let t = q.prePhonemeLength || 0; const moraEnd = [];
  for (const ph of q.accent_phrases) {
    for (const m of ph.moras) { t += (m.consonant_length || 0) + (m.vowel_length || 0); moraEnd.push(+t.toFixed(3)); }
    if (ph.pause_mora) t += (ph.pause_mora.vowel_length || 0);   // 停頓(、。)延到下一拍前
  }
  // 對齊:逐詞吃掉對應拍數
  let cum = 0, tokMora = 0; const ends = [];
  for (const tk of toks) {
    const ml = moraCount(tokKana(tk)); tokMora += ml;
    let end = ml > 0 ? moraEnd[Math.min(cum + ml - 1, moraEnd.length - 1)]
      : (cum > 0 ? moraEnd[cum - 1] : (q.prePhonemeLength || 0));
    if (end == null) end = moraEnd.length ? moraEnd[moraEnd.length - 1] : (q.prePhonemeLength || 0);
    cum += ml; ends.push(+end.toFixed(2));
  }
  if (tokMora !== moraEnd.length) { misalign.push(sent + ` [拍不齊 tok${tokMora}/vox${moraEnd.length}]`); continue; }
  OUT[sent] = ends;   // 每個 token 的結束秒數(長度=token數)
  ok++;
}

const js = '// 由 scripts/tts/gen-article-timings.mjs 產生 — 勿手改。key=去空白句子,值=每詞唸完的秒數(對齊 mp3 發音)\n'
  + 'window.ARTICLE_TIMINGS = ' + JSON.stringify(OUT) + ';\n';
const outPath = path.join(ROOT, 'article-timings.js');
fs.writeFileSync(outPath, js);
const kb = (fs.statSync(outPath).size / 1024).toFixed(0);
console.log(`✅ 時間軸完成:${ok} 句 → article-timings.js (${kb} KB)`);
console.log(`   跳過:無token ${skipNoTok}、__SKIP__(瀏覽器TTS) ${skipSkip}、對不齊 ${misalign.length}`);
if (misalign.length) console.log('   對不齊(前8,前端會退回整句掃描):\n   ' + misalign.slice(0, 8).join('\n   '));
