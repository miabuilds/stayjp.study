#!/usr/bin/env node
// 把 all-readings.tsv 按來源拆檔，方便分批餵 Gemini
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const SRC = path.join(ROOT, 'scripts/tts/all-readings.tsv');
const OUT_DIR = path.join(ROOT, 'scripts/tts/readings-chunks');

fs.mkdirSync(OUT_DIR, { recursive: true });
// 清舊檔
for (const f of fs.readdirSync(OUT_DIR)) fs.unlinkSync(path.join(OUT_DIR, f));

const lines = fs.readFileSync(SRC, 'utf8').split('\n');
const header = lines[0];
const buckets = new Map();
for (let i = 1; i < lines.length; i++) {
  const l = lines[i];
  if (!l) continue;
  const cols = l.split('\t');
  const sources = (cols[3] || '').split(',');
  // 取第一個 source 的主類別（去掉 #id）
  const main = (sources[0] || 'misc').split('#')[0];
  if (!buckets.has(main)) buckets.set(main, [header]);
  buckets.get(main).push(l);
}

const summary = [];
for (const [name, arr] of buckets) {
  const p = path.join(OUT_DIR, name + '.tsv');
  fs.writeFileSync(p, arr.join('\n') + '\n');
  summary.push({ name, count: arr.length - 1, bytes: arr.join('\n').length });
}
summary.sort((a, b) => b.count - a.count);
console.log('分檔完成：');
for (const s of summary) console.log(`  ${s.name.padEnd(18)} ${String(s.count).padStart(5)} 條   ${(s.bytes/1024).toFixed(1).padStart(6)} KB`);
