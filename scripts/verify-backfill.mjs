// 抽驗回填正確性:取前 N 個有 legacy srs_data 的用戶,讀 user_progress 解壓後與 legacy deepEqual。
import fs from 'node:fs';
import { db, admin } from './lib/fire-admin.mjs';   // 認證集中在 helper(repo 是 public,不寫死任何憑證)
const N = Number(process.env.N || 20);

let checked = 0, ok = 0, mismatch = 0;
const snap = await db.collection('users').orderBy('__name__').select('srs_data').limit(600).get();
for (const doc of snap.docs) {
  if (checked >= N) break;
  const legacy = doc.data().srs_data;
  if (legacy == null || typeof legacy !== 'object' || !Object.keys(legacy).length) continue;
  const p = await db.collection('user_progress').doc(doc.id).get();
  if (!p.exists || p.data().srs_data == null) { console.log(`  ✗ ${doc.id.slice(0, 6)}… user_progress 無 srs_data`); mismatch++; checked++; continue; }
  const bytes = p.data().srs_data;
  const restored = await codec.gunzipJSON(bytes.toUint8Array ? bytes.toUint8Array() : bytes);
  try {
    assert.deepStrictEqual(restored, legacy);
    ok++; console.log(`  ✓ ${doc.id.slice(0, 6)}… ${Object.keys(legacy).length} 項 srs_data 解壓==legacy`);
  } catch (e) { mismatch++; console.log(`  ✗ ${doc.id.slice(0, 6)}… srs_data 不一致`); }
  checked++;
}
console.log(`\nVERIFY: 抽驗 ${checked} 人 · 一致 ${ok} · 不一致 ${mismatch}`);
process.exit(mismatch ? 1 : 0);
