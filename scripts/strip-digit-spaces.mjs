#!/usr/bin/env node
// 把 grammar 例句裡「 N 」(數字前後帶空格) 的中文排版習慣清掉，避免 VOICEVOX 把 1日 念成
// 「いち、ひ」(被空格切成兩個 phrase)。只動 j:"..." 字串，不動 z:"..." 中譯。

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const FILES = ['grammar-n1.js', 'grammar-n2.js', 'grammar-n3.js', 'index.html'];

let totalChanges = 0;
const samples = [];

for (const file of FILES) {
  const p = path.join(ROOT, file);
  if (!fs.existsSync(p)) continue;
  const src = fs.readFileSync(p, 'utf8');
  // 只動 j:"..." 內容
  const jRe = /(\bj\s*:\s*")((?:\\.|[^"\\])*)(")/g;
  let fileChanges = 0;
  const out = src.replace(jRe, (m, head, content, tail) => {
    // 在 j 字串裡找 ` (\d+) ` 並去掉兩側空格
    const fixed = content.replace(/ (\d+) /g, (_, n) => {
      fileChanges++;
      totalChanges++;
      if (samples.length < 10) samples.push({ file, num: n, before: content.slice(0, 80) });
      return n;
    });
    return head + fixed + tail;
  });
  if (fileChanges > 0) {
    fs.writeFileSync(p, out);
    console.log(`${file}: ${fileChanges} 處替換`);
  }
}

console.log(`\n總計 ${totalChanges} 處數字空格清掉`);
console.log('範例：');
for (const s of samples) console.log(`  [${s.file}] ${s.num}: ...${s.before}...`);
