#!/usr/bin/env node
/**
 * test-ref-code-rules.cjs — Firestore 規則測試：users/{uid}.ref_code 歸因防竄改
 *
 * 驗證 firestore.rules 對 ref_code 的保護在各情境下 allow/deny 是否正確。
 *
 * 需求（一次性）：
 *   - 需要 Java（Firestore emulator 依賴 JRE）
 *   - npm i -D @firebase/rules-unit-testing firebase
 *
 * 執行（在專案根目錄 stay-jp-notes）：
 *   firebase emulators:exec --only firestore "node scripts/test-ref-code-rules.cjs"
 *   （emulators:exec 會自動起 emulator、跑完關掉；port 依 firebase.json = 8099）
 *
 * 也可在 Firebase Console → Firestore → Rules → Playground 手動點同樣的情境。
 */
'use strict';

const fs = require('fs');
const path = require('path');
const {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} = require('@firebase/rules-unit-testing');
const {
  doc, setDoc, updateDoc, getDoc, deleteField, setLogLevel,
} = require('firebase/firestore');

setLogLevel('error'); // 少一點雜訊

const PROJECT_ID = 'jpnote-1bdd6-rules-test';
const HOST = '127.0.0.1';
const PORT = 8099; // 對齊 firebase.json emulators.firestore.port

const ALICE = 'alice_uid';
const BOB = 'bob_uid';

let pass = 0, fail = 0;
async function check(name, promise) {
  try { await promise; console.log('  ✅ ' + name); pass++; }
  catch (e) { console.log('  ❌ ' + name + '  → ' + (e && e.message ? e.message : e)); fail++; }
}

(async () => {
  const env = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: fs.readFileSync(path.resolve(__dirname, '../firestore.rules'), 'utf8'),
      host: HOST,
      port: PORT,
    },
  });

  // 種子資料（繞過規則）：各種 ref_codes + 一個已鎖定的 users doc
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await setDoc(doc(db, 'ref_codes/VALIDKOL'), { type: 'kol', active: true, owner_uid: BOB, kol: 'Bob頻道' });
    await setDoc(doc(db, 'ref_codes/SUSPENDED'), { type: 'kol', active: true, status: 'suspended', owner_uid: BOB });
    await setDoc(doc(db, 'ref_codes/INACTIVE'), { type: 'kol', active: false, owner_uid: BOB });
    await setDoc(doc(db, 'ref_codes/ALICEOWN'), { type: 'user', active: true, owner_uid: ALICE });
    // 已鎖定用戶（首購獎已發）
    await setDoc(doc(db, 'users/' + ALICE + '_locked'), { ref_code: 'VALIDKOL', ref_at: 1, ref_bonus_at: 111 });
  });

  const alice = env.authenticatedContext(ALICE).firestore();
  const lockedCtx = env.authenticatedContext(ALICE + '_locked').firestore();

  console.log('\n=== ref_code 規則測試 ===\n');

  // 1) 合法啟用碼 → 允許
  await check('套用合法 KOL 碼 VALIDKOL', assertSucceeds(
    setDoc(doc(alice, 'users/' + ALICE), { ref_code: 'VALIDKOL', ref_at: Date.now() }, { merge: true })));

  // 2) 不存在的碼 → 擋
  await check('套用不存在碼 NOPE 被擋', assertFails(
    setDoc(doc(alice, 'users/' + ALICE), { ref_code: 'NOPE', ref_at: Date.now() }, { merge: true })));

  // 3) 停權碼 → 擋
  await check('套用停權碼 SUSPENDED 被擋', assertFails(
    setDoc(doc(alice, 'users/' + ALICE), { ref_code: 'SUSPENDED', ref_at: Date.now() }, { merge: true })));

  // 4) 停用碼 → 擋
  await check('套用停用碼 INACTIVE 被擋', assertFails(
    setDoc(doc(alice, 'users/' + ALICE), { ref_code: 'INACTIVE', ref_at: Date.now() }, { merge: true })));

  // 5) 自己的碼 → 擋（自我推薦）
  await check('套用自己的碼 ALICEOWN 被擋', assertFails(
    setDoc(doc(alice, 'users/' + ALICE), { ref_code: 'ALICEOWN', ref_at: Date.now() }, { merge: true })));

  // 6) 已鎖定後改碼 → 擋
  await check('鎖定後改碼被擋', assertFails(
    updateDoc(doc(lockedCtx, 'users/' + ALICE + '_locked'), { ref_code: 'VALIDKOL2', ref_at: Date.now() })));

  // 7) 清除 ref_code（未鎖定）→ 允許
  await check('清除 ref_code（未鎖定）允許', assertSucceeds(
    updateDoc(doc(alice, 'users/' + ALICE), { ref_code: deleteField(), ref_at: deleteField() })));

  // 8) 自己寫 ref_bonus_at（偽造鎖/獎）→ 擋
  await check('自己寫 ref_bonus_at 被擋', assertFails(
    setDoc(doc(alice, 'users/' + ALICE), { ref_bonus_at: 999 }, { merge: true })));

  // 9) 一般寫入（不碰 ref_code）→ 允許（回歸保護）
  await check('一般寫入 srs_data 允許（無回歸）', assertSucceeds(
    setDoc(doc(alice, 'users/' + ALICE), { srs_data: { x: 1 }, favorites: ['n5-1'] }, { merge: true })));

  await env.cleanup();
  console.log(`\n結果：${pass} 通過 / ${fail} 失敗\n`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error('測試執行失敗：', e); process.exit(1); });
