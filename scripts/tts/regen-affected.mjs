#!/usr/bin/env node
// 找出受新 overrides 影響的 mp3 並刪掉，讓 generate.mjs 重生。
// 比對 OLD vs NEW applyOverrides 對每筆 texts.json 的結果。

import fs from 'node:fs';
import path from 'node:path';
import { ROOT, TEXTS_JSON, OUT_DIR, applyOverrides } from './_lib.mjs';

// 舊版邏輯（substring 替換、無 ==）：模擬上一版 overrides
const OLD_OVERRIDES = [
  ['洗濯物', 'せんたくもの'], ['習って', 'ならって'], ['飲みませんか', 'のみませんか'],
  ['飲みましょう', 'のみましょう'], ['飲みます', 'のみます'], ['飲みたい', 'のみたい'],
  ['飲みに', 'のみに'], ['飲みながら', 'のみながら'], ['飲み物', 'のみもの'],
  ['沖縄へ', '沖縄え'], ['故郷へ', '故郷え'], ['京都へ', '京都え'], ['札幌へ', '札幌え'],
  ['全国へ', '全国え'], ['映画館へ', '映画館え'], ['場所へ', '場所え'],
  ['図書館へ', '図書館え'], ['空港へ', '空港え'], ['郊外へ', '郊外え'],
  ['彼女へ', '彼女え'], ['取引先へ', '取引先え'], ['地域住民へ', '地域住民え'],
  ['帰ります', 'かえります'], ['帰りましょう', 'かえりましょう'], ['帰りました', 'かえりました'],
  ['帰りの', 'かえりの'], ['帰った', 'かえった'], ['帰ったら', 'かえったら'],
  ['帰って', 'かえって'], ['帰る', 'かえる'], ['帰らせ', 'かえらせ'], ['帰れな', 'かえれな'],
  ['ひく', 'ヒク'], ['はな', 'kana:ハ\'ナ'], ['または', 'マタハ'],
  ['はがき', 'kana:ハ\'ガキ'], ['はこ', 'kana:ハ\'コ'], ['はく', 'kana:ハ\'ク'],
  // 注意：== は 是新版才有，old 沒有
];
// 排序：longest first
OLD_OVERRIDES.sort((a, b) => b[0].length - a[0].length);

function applyOld(text) {
  let out = text;
  for (const [k, v] of OLD_OVERRIDES) out = out.split(k).join(v);
  return out;
}

import { loadOverrides } from './_lib.mjs';
const NEW_OVERRIDES = loadOverrides();

const texts = JSON.parse(fs.readFileSync(TEXTS_JSON, 'utf8'));
let affected = [];
for (const t of texts) {
  const oldFed = applyOld(t.text);
  const newFed = applyOverrides(t.text, NEW_OVERRIDES);
  if (oldFed !== newFed) affected.push(t);
}

console.log(`受影響的文本：${affected.length} / ${texts.length}`);
let deleted = 0;
for (const t of affected) {
  const mp3 = path.join(OUT_DIR, `${t.hash}.mp3`);
  if (fs.existsSync(mp3)) { fs.unlinkSync(mp3); deleted++; }
}
console.log(`刪掉 ${deleted} 個舊 mp3，下一步跑 generate.mjs 重生`);
console.log('\n樣本（前 10）：');
for (const t of affected.slice(0, 10)) {
  console.log(`  ${t.text.slice(0, 50)}`);
}
