#!/usr/bin/env node
// 重新生成「五十音」語音。用 青山龍星(id13) + 片假名合成(避免 は→wa、へ→e 的助詞誤讀),
// 自然參數(音量1.0不爆音、母音不拉長)。檔名仍用平假名 hash(跟 __TTS key 一致,manifest 不用改)。
// 需要 VOICEVOX 開著。用法:node scripts/tts/regen-kana.mjs
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, OUT_DIR, hashText, wavToMp3, checkEngine } from './_lib.mjs';

const ENGINE = 'http://localhost:50021';
const SPEAKER = 13;   // 青山龍星 ノーマル(用戶挑選;男聲,單音清楚)

async function main() {
  console.log('VOICEVOX', await checkEngine());

  const code = fs.readFileSync(path.join(ROOT, 'kana.js'), 'utf8');
  const KANA = (new Function('window', code + '; return window.KANA;'))({}) || {};
  const list = [];   // {h(平假名→hash/key), k(片假名→合成用)}
  for (const sec of Object.values(KANA)) for (const row of sec) for (const c of row) if (c && c.h) list.push({ h: c.h, k: c.k || c.h });
  console.log('假名數:', list.length, '· speaker', SPEAKER);

  let done = 0, fail = 0;
  for (const { h, k } of list) {
    try {
      // 用片假名查詢 → 純音節讀音(は→ハ 而非助詞ワ)
      const q = await (await fetch(`${ENGINE}/audio_query?text=${encodeURIComponent(k)}&speaker=${SPEAKER}`, { method: 'POST' })).json();
      q.speedScale = 0.9; q.prePhonemeLength = 0.1; q.postPhonemeLength = 0.15; q.volumeScale = 1.0; q.intonationScale = 1.0;
      const wav = Buffer.from(await (await fetch(`${ENGINE}/synthesis?speaker=${SPEAKER}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(q) })).arrayBuffer());
      wavToMp3(wav, path.join(OUT_DIR, hashText(h) + '.mp3'));   // 檔名=平假名 hash
      done++; if (done % 20 === 0) console.log('  …', done, '/', list.length);
    } catch (e) { fail++; console.error('FAIL', h, e.message); }
  }
  console.log(`\nDone. 重生成 ${done} 個假名(speaker ${SPEAKER}),失敗 ${fail}。記得 bump sw.js CACHE_NAME。`);
}
main().catch(e => { console.error(e); process.exit(1); });
