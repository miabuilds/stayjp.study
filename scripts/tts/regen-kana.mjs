#!/usr/bin/env node
// 重新生成「五十音」語音,提升單音清晰度(原本單音太短、咬字糊)。
// 做法:語速放慢、前後補靜音(不被切掉)、弱子音(h/k/s/t)加長、音量微升。
// 覆蓋既有 audio/tts/<hash>.mp3(hash 由文字決定,不變 → manifest 不用改)。
// 需要 VOICEVOX 開著(localhost:50021)。用法:node scripts/tts/regen-kana.mjs
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, OUT_DIR, hashText, audioQuery, synthesis, wavToMp3, checkEngine } from './_lib.mjs';

const WEAK = new Set(['h', 'k', 's', 't', 'sh', 'ch', 'ts', 'f']);

async function main() {
  const ver = await checkEngine();
  console.log('VOICEVOX', ver);

  // 讀 kana.js 拿所有假名(平假名當 key,跟 collect.mjs 一致)
  const code = fs.readFileSync(path.join(ROOT, 'kana.js'), 'utf8');
  const KANA = (new Function('window', code + '; return window.KANA;'))({}) || {};
  const kanas = [];
  for (const sec of Object.values(KANA)) for (const row of sec) for (const c of row) if (c && c.h) kanas.push(c.h);
  console.log('假名數:', kanas.length);

  let done = 0, fail = 0;
  for (const k of kanas) {
    try {
      const q = await audioQuery(k);
      // ── 清晰度調整 ──
      // 自然參數:上一版音量1.15削波(分岔)、母音拉太長(虛)、抑揚過強→這版改回自然。
      q.speedScale = 0.9;            // 稍慢,清楚但不拖
      q.prePhonemeLength = 0.1;      // 少量前置靜音
      q.postPhonemeLength = 0.15;    // 少量尾靜音,尾音不切
      q.volumeScale = 1.0;           // 不加音量(避免削波/爆音)
      q.intonationScale = 1.0;       // 自然抑揚
      for (const p of (q.accent_phrases || [])) {
        const m0 = p.moras && p.moras[0];
        if (m0 && m0.consonant && WEAK.has(m0.consonant)) {
          m0.consonant_length = (m0.consonant_length || 0.05) * 1.3;  // 弱子音很輕的加長;不動母音(避免變虛)
        }
      }
      const wav = await synthesis(q);
      const out = path.join(OUT_DIR, hashText(k) + '.mp3');
      wavToMp3(wav, out);
      done++;
      if (done % 20 === 0) console.log('  …', done, '/', kanas.length);
    } catch (e) {
      fail++; console.error('FAIL', k, e.message);
    }
  }
  console.log(`\nDone. 重生成 ${done} 個假名,失敗 ${fail}。`);
  console.log('接著記得 bump sw.js CACHE_NAME 讓用戶重抓。');
}
main().catch(e => { console.error(e); process.exit(1); });
