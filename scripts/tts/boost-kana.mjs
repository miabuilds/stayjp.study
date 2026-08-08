#!/usr/bin/env node
// 把五十音音檔「加大聲」——手機喇叭對單音特別小聲,+6dB 增益 + 限幅器(不爆音)。
// 只處理 kana.js 裡的 104 個假名, 不動文章/單字音檔。用法:node scripts/tts/boost-kana.mjs
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import { ROOT, OUT_DIR } from './_lib.mjs';

const hashText = (t) => crypto.createHash('sha1').update(t).digest('hex').slice(0, 12);

const code = fs.readFileSync(path.join(ROOT, 'kana.js'), 'utf8');
const KANA = (new Function('window', code + '; return window.KANA;'))({}) || {};
const files = [];
for (const sec of Object.values(KANA)) for (const row of sec) for (const c of row) if (c && c.h) files.push(hashText(c.h) + '.mp3');
console.log('五十音檔數:', files.length);

let done = 0, miss = 0;
for (const f of files) {
  const src = path.join(OUT_DIR, f);
  if (!fs.existsSync(src)) { miss++; console.warn('缺檔', f); continue; }
  const tmp = src + '.boost.mp3';
  execFileSync('ffmpeg', ['-y', '-i', src, '-af', 'volume=6dB,alimiter=limit=0.97', '-ar', '44100', tmp], { stdio: 'ignore' });
  fs.renameSync(tmp, src);
  done++;
}
console.log(`加大聲完成 ${done} 個(缺 ${miss})。記得 bump KANA_AUDIO_VER 與 sw.js CACHE_NAME。`);
