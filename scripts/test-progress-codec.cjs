// Gate 0 機制驗證:壓縮 → 存 Firestore Bytes(emulator)→ 讀回 → 解壓,深度比對無損 + 體積大降。
// 用合成肥 srs_data(2700 項,含 unicode key)。由 emulators:exec 啟動,admin SDK 連 emulator。
const admin = require('firebase-admin');
const assert = require('assert');
const codec = require('../progress-codec.js');

(async () => {
  admin.initializeApp({ projectId: process.env.GCLOUD_PROJECT || 'demo-jpnote' });
  const db = admin.firestore();

  // 合成肥 srs_data:2700 項,仿真 SrsEntry 形狀 + unicode key
  const kanji = '漢字日本語文法単語読解聴解';
  const srs = {};
  for (let i = 0; i < 2700; i++) {
    const lv = ['n5', 'n4', 'n3', 'n2', 'n1'][i % 5];
    const key = lv + ':' + kanji[i % kanji.length] + i;
    srs[key] = { ease: 2.5, interval: (i % 60) + 1, reps: i % 12, lastReview: 1750000000000 + i * 1000, due: 1751000000000 + i * 2000, lapses: i % 4 };
  }
  const rawBytes = Buffer.byteLength(JSON.stringify(srs));
  assert.ok(codec.SUPPORTED, 'CompressionStream 應支援');

  // 壓縮
  const gz = await codec.gzipBytes(srs);
  console.log(`[gate0] srs_data 2700 項:raw ${(rawBytes / 1024).toFixed(1)}KB → gzip ${(gz.length / 1024).toFixed(1)}KB (${(rawBytes / gz.length).toFixed(1)}x)`);

  // 存成 Firestore Bytes → 讀回
  await db.doc('user_progress/testuid').set({ srs_data: Buffer.from(gz) });
  const snap = await db.doc('user_progress/testuid').get();
  const back = snap.data().srs_data;               // admin 讀 bytes → Buffer/Uint8Array
  assert.ok(back && back.length === gz.length, `讀回 bytes 長度應一致(${back && back.length} vs ${gz.length})`);

  // 解壓 → 深度比對
  const restored = await codec.gunzipJSON(back);
  assert.deepStrictEqual(restored, srs, 'srs_data 往返後必須完全一致');
  console.log(`[gate0] 往返 deepStrictEqual ✓(${Object.keys(restored).length} 項,unicode key 保留)`);

  // 邊界:空物件 / 陣列型(quiz_history)
  const arr = Array.from({ length: 200 }, (_, i) => ({ date: '2026-07-0' + (i % 9) + 'T00:00', level: 'n5', score: i % 100, wrong: [1, 2, 3] }));
  const gzArr = await codec.gzipBytes(arr);
  await db.doc('user_progress/testuid').set({ quiz_history: Buffer.from(gzArr) }, { merge: true });
  const s2 = await db.doc('user_progress/testuid').get();
  assert.deepStrictEqual(await codec.gunzipJSON(s2.data().quiz_history), arr, 'quiz_history 陣列往返一致');
  assert.deepStrictEqual(await codec.gunzipJSON((await (async () => { await db.doc('user_progress/e').set({ x: Buffer.from(await codec.gzipBytes({})) }); return db.doc('user_progress/e').get(); })()).data().x), {}, '空物件往返一致');
  console.log('[gate0] 陣列 + 空物件邊界 ✓');

  console.log('GATE0 PASS');
  process.exit(0);
})().catch((e) => { console.error('GATE0 FAIL:', e); process.exit(1); });
