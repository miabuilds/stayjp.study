#!/usr/bin/env node
// 單字音檔音高稽核+重生(用戶 2026-10-09 回報「声」唸成高高)。
// 問題:VOICEVOX 對短單字常常 accent 標對,但預測的 mora 音高幾乎沒有落差(声 コ5.94→エ5.89 log-F0),聽起來像平板。
// 做法:以 pitch-accent.js(UniDic,NHK 抽查 28/29)為準,對每個單字音檔的文字(讀音/表記)跑 audio_query,
//   量「該高的 mora 比該低的高多少」;落差不足或 accent 標錯 → 用正確 accent + 直接塑形 mora 音高重生。
// 用法:node scripts/tts/regen-pitch.mjs            只稽核,印清單
//       node scripts/tts/regen-pitch.mjs --write [--resume]   重生 audio/tts + audio/tts-v(8,13) 對應檔,寫 pitch-fixed.json
// 需要 VOICEVOX 開著。同音字(せんせい=先生③/宣誓⓪)共用假名音檔 → 取級別最低那個字的音高。
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { ROOT, OUT_DIR, ENGINE, SPEAKER, TEXTS_JSON, loadOverrides, applyOverrides, synthesis, checkEngine, wavToMp3, pitchPattern as pattern, shapePitch } from './_lib.mjs';

const WRITE = process.argv.includes('--write');
const DROP = 0.12;    // 落差門檻(log-F0,約 2 半音);低於這個聽起來就是平的
const RISE = 0.05;    // 平板型只看起音上升,本來就小,門檻放寬
const LOW = 0.25;     // 塑形:低 mora 比高 mora 低多少(約 4 半音)
const RISE_LOW = 0.15; // 非頭高型第一拍的「低」(起音上升小一點較自然)

const W = {}; new Function('window', fs.readFileSync(path.join(ROOT, 'pitch-accent.js'), 'utf8'))(W);
const PITCH = W.PITCH;
const texts = JSON.parse(fs.readFileSync(TEXTS_JSON, 'utf8'));
const byText = new Map(texts.map(t => [t.text, t]));
const overrides = loadOverrides();
const VMAN = fs.existsSync(path.join(ROOT, 'audio/tts-v/manifest.js'))
  ? JSON.parse(fs.readFileSync(path.join(ROOT, 'audio/tts-v/manifest.js'), 'utf8').replace(/^[\s\S]*?window\.__TTS_V = /, '').replace(/;\s*$/, '')) : {};

// 文字 → 期望 accent(級別低的先佔)
const want = new Map();
for (const lv of ['n5', 'n4', 'n3', 'n2', 'n1']) {
  const src = fs.readFileSync(path.join(ROOT, `vocab-${lv}.js`), 'utf8');
  for (const m of src.matchAll(/\{w:"([^"]+)",r:"([^"]*)"/g)) {
    const [, w, r] = m; const n = PITCH[w + '|' + r];
    if (typeof n !== 'number') continue;
    for (const k of [r, w]) if (k && byText.has(k) && !want.has(k)) want.set(k, { n, w, r, lv });
  }
}

const post = async (u, body) => { const r = await fetch(u, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : { method: 'POST' }); if (!r.ok) throw new Error(r.status + ' ' + await r.text()); return r.json(); };
const kata = s => s.replace(/[ぁ-ゖ]/g, c => String.fromCharCode(c.charCodeAt(0) + 0x60));
// 期望 H/L:n=0 平板(LHHH),n=1 頭高(HLLL),n>=2 中高/尾高(LH..H L..)
function judge(q, n) {
  const ps = q.accent_phrases;
  if (ps.length !== 1) return { bad: 'multi' };
  const mo = ps[0].moras, len = mo.length;
  const vvN = n === 0 ? len : n;           // VOICEVOX:平板 = accent 放最後一拍
  if (n > len) return { bad: 'reading' };
  const pat = pattern(n, len), v = mo.map(m => m.pitch);
  const hi = v.filter((p, i) => p > 0 && pat[i]), lo = v.filter((p, i) => p > 0 && !pat[i]);
  const gap = (hi.length && lo.length) ? Math.min(...hi) - Math.max(...lo) : 1;
  if (ps[0].accent !== vvN) return { bad: 'accent', vv: ps[0].accent, gap };
  if (gap < (n === 0 ? RISE : DROP)) return { bad: 'flat', gap };
  return { ok: true, gap };
}
const shape = (q, n) => shapePitch(q, n, LOW, RISE_LOW);
async function query(text, sp) {
  const t = applyOverrides(text, overrides);
  if (t.startsWith('kana:') || t === '__SKIP__') return null;   // 人工指定過的不動
  return post(`${ENGINE}/audio_query?text=${encodeURIComponent(t)}&speaker=${sp}`);
}

console.log('VOICEVOX', await checkEngine(), '· 單字音檔', want.size);
const bad = [], stat = {};
let i = 0;
for (const [text, info] of want) {
  if (++i % 500 === 0) console.error('  …', i);
  let q; try { q = await query(text, SPEAKER); } catch (e) { stat.err = (stat.err || 0) + 1; continue; }
  if (!q) { stat.manual = (stat.manual || 0) + 1; continue; }
  const j = judge(q, info.n);
  const k = j.ok ? 'ok' : j.bad; stat[k] = (stat[k] || 0) + 1;
  if (j.bad === 'accent' || j.bad === 'flat') bad.push({ text, ...info, ...j });
}
console.log(stat);
const show = bad.filter(b => b.lv === 'n5' || b.lv === 'n4');
console.log('N5/N4 要修', show.length, '例:', show.slice(0, 40).map(b => `${b.text}(${b.w})${b.n}:${b.bad}${b.vv != null ? '/vv' + b.vv : ''}`).join(' '));
fs.writeFileSync(path.join(path.dirname(TEXTS_JSON), 'pitch-audit.json'), JSON.stringify(bad, null, 1));

if (WRITE) {
  // --resume:git 已顯示改過的檔(上次跑到一半)就跳過
  const done = process.argv.includes('--resume')
    ? new Set(execSync('git diff --name-only -- audio/tts audio/tts-v', { cwd: ROOT }).toString().split('\n').filter(Boolean)) : new Set();
  let made = 0;
  for (const b of bad) {
    const hash = byText.get(b.text).hash;
    for (const sp of [SPEAKER, ...Object.keys(VMAN).map(Number)]) {
      if (sp !== SPEAKER && !VMAN[sp][hash]) continue;
      if (done.has(sp === SPEAKER ? `audio/tts/${hash}.mp3` : `audio/tts-v/${sp}/${hash}.mp3`)) continue;
      const q = await query(b.text, sp); if (!q || q.accent_phrases.length !== 1) continue;
      const wav = await synthesis(shape(q, b.n), sp);
      wavToMp3(wav, sp === SPEAKER ? path.join(OUT_DIR, hash + '.mp3') : path.join(ROOT, 'audio/tts-v', String(sp), hash + '.mp3'));
      made++;
    }
    if (made % 50 === 0) console.error('  wrote', made);
  }
  console.log('重生', made, '檔');
}
