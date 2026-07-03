// Gate 1:進度遷移端到端(emulator)。驗四件事,全程模擬 index.html 的雙讀/雙寫邏輯:
//   A. 未遷移用戶(只有 legacy users doc)→ 讀得到完整進度(行為零改變)
//   B. 雙寫後 → user_progress 有壓縮大 key、users legacy 仍在(回滾無損)
//   C. 遷移後讀 → 優先 user_progress、解壓後與原始 deepStrictEqual(零損)
//   D. 安全規則:owner 可讀寫自己 user_progress、不能碰別人;admin 可讀
const admin = require('firebase-admin');
const assert = require('assert');
const { initializeTestEnvironment, assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');
const codec = require('../progress-codec.js');
const fs = require('fs');

// 模擬 index.html loadCloudData 的雲端讀取(雙讀疊加)
async function readEffective(db, uid) {
  const [u, p] = await Promise.all([db.doc('users/' + uid).get(), db.doc('user_progress/' + uid).get().catch(() => null)]);
  const d = u.exists ? u.data() : {};
  if (p && p.exists) {
    const pd = p.data();
    for (const k of codec.PROGRESS_BIG_KEYS) {
      if (pd[k] == null) continue;
      d[k] = await codec.gunzipJSON(pd[k].toUint8Array ? pd[k].toUint8Array() : pd[k]);
    }
  }
  return d;
}
// 模擬 saveAllCloud/saveSRSCloud 的雙寫(大 key 壓縮寫 user_progress)
async function dualWriteProgress(db, uid, all) {
  const out = {};
  for (const k of codec.PROGRESS_BIG_KEYS) if (all[k] != null) out[k] = Buffer.from(await codec.gzipBytes(all[k]));
  if (Object.keys(out).length) await db.doc('user_progress/' + uid).set(out, { merge: true });
}

(async () => {
  admin.initializeApp({ projectId: process.env.GCLOUD_PROJECT || 'demo-jpnote' });
  const db = admin.firestore();

  // 合成一個「肥」老用戶:legacy users/{uid} 塞滿進度
  const srs = {}; const kanji = '漢字日本語文法単語';
  for (let i = 0; i < 2700; i++) srs['n' + (i % 5 + 1) + ':' + kanji[i % kanji.length] + i] = { ease: 2.5, interval: i % 60, reps: i % 12, lastReview: 1750000000000 + i };
  const legacy = {
    subscription: { status: 'active', expiresAt: 9e12 },   // 金流欄位:留在 users,不搬
    exam_date: '2026-12-07', base_level: 'n3',              // 小純量:留 users
    srs_data: srs,
    word_notebook: Array.from({ length: 300 }, (_, i) => ({ w: '語' + i, lv: 'n3', added: i })),
    quiz_history: Array.from({ length: 200 }, (_, i) => ({ date: '2026-07-01T00:00', level: 'n5', score: i })),
    study_log: { '2026-07-01': { vocab: 5, grammar: 3, quiz: 2 } },
  };
  const uid = 'fatuser';
  await db.doc('users/' + uid).set(legacy);

  // A. 未遷移:user_progress 不存在 → 讀出的 d 應等於 legacy(srs_data 完整)
  let d = await readEffective(db, uid);
  assert.deepStrictEqual(d.srs_data, srs, 'A: 未遷移應讀到完整 legacy srs_data');
  assert.strictEqual(Object.keys(d.srs_data).length, 2700, 'A: 2700 項');
  assert.deepStrictEqual(d.subscription, legacy.subscription, 'A: subscription 照在 users');
  console.log('[gate1] A 未遷移用戶讀 legacy 完整 ✓');

  // B. 雙寫:大 key 壓縮寫 user_progress;users legacy 保持不動
  await dualWriteProgress(db, uid, legacy);
  const pSnap = await db.doc('user_progress/' + uid).get();
  assert.ok(pSnap.exists && pSnap.data().srs_data, 'B: user_progress 應有 srs_data');
  assert.ok(Buffer.isBuffer(pSnap.data().srs_data) || pSnap.data().srs_data.length, 'B: srs_data 是 bytes');
  const uSnap = await db.doc('users/' + uid).get();
  assert.deepStrictEqual(uSnap.data().srs_data, srs, 'B: users legacy srs_data 仍完整(回滾無損)');
  assert.deepStrictEqual(uSnap.data().subscription, legacy.subscription, 'B: subscription 未被動到');
  console.log('[gate1] B 雙寫後 user_progress 壓縮寫入、users legacy 原封不動 ✓');

  // C. 遷移後讀:優先 user_progress、解壓 deepStrictEqual 原始
  d = await readEffective(db, uid);
  assert.deepStrictEqual(d.srs_data, srs, 'C: 遷移後 srs_data 零損');
  assert.deepStrictEqual(d.word_notebook, legacy.word_notebook, 'C: word_notebook 零損');
  assert.deepStrictEqual(d.quiz_history, legacy.quiz_history, 'C: quiz_history 零損');
  console.log('[gate1] C 遷移後讀優先 user_progress、全 key deepStrictEqual ✓');

  await admin.app().delete();

  // D. 安全規則(rules-unit-testing 套 firestore.rules)
  const env = await initializeTestEnvironment({
    projectId: process.env.GCLOUD_PROJECT || 'demo-jpnote',
    firestore: { rules: fs.readFileSync('firestore.rules', 'utf8'), host: '127.0.0.1', port: 8099 },
  });
  const alice = env.authenticatedContext('alice').firestore();
  const bob = env.authenticatedContext('bob').firestore();
  const adminCtx = env.authenticatedContext('x', { email: 'stayjpplan@gmail.com' }).firestore();
  await assertSucceeds(alice.doc('user_progress/alice').set({ srs_data: 'gz', t: 1 }));
  console.log('[gate1] D owner 寫自己 user_progress → 允許 ✓');
  await assertFails(bob.doc('user_progress/alice').set({ srs_data: 'hack' }));
  console.log('[gate1] D 他人寫你 user_progress → 拒絕 ✓');
  await assertFails(bob.doc('user_progress/alice').get());
  console.log('[gate1] D 他人讀你 user_progress → 拒絕 ✓');
  await assertSucceeds(adminCtx.doc('user_progress/alice').get());
  console.log('[gate1] D admin 讀 user_progress → 允許 ✓');
  await env.cleanup();

  console.log('GATE1 PASS');
  process.exit(0);
})().catch((e) => { console.error('GATE1 FAIL:', e); process.exit(1); });
