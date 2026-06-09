# 訂閱獨立（subscriptions/{uid}）Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `subscription` 從 `users/{uid}` 搬到獨立的 `subscriptions/{uid}` collection（`write:false`），讓金流寫入不受進度 doc 體積/索引影響，並堵死「owner 可寫 users → 自封 premium」漏洞。

**Architecture:** 三階段不中斷遷移。先讓 Cloud Functions 與前端「先讀新位置、讀不到退回 `users/{uid}.subscription`」（雙讀後備），新寫入一律寫新位置；再批次回填既有訂閱；觀察期後才移除舊欄位。全程只加不刪到最後，線上用戶無感。

**Tech Stack:** Firebase Functions v2 (TypeScript, Node 22)、Firestore（compat v8 前端 SDK）、Firebase emulator（驗證）、firestore.rules。

**驗證手法：** 無單元測試框架；用 Firebase emulator 端對端 + Node 對帳腳本當驗證關卡。每個正式環境動作前 emulator 全綠才發。

**參考來源檔：**
- `functions/src/utils/firestore.ts:56-74`（getSubscription/writeSubscription/patchSubscription 現況）
- `functions/src/admin-list-subscribers.ts:31-36`、`admin-recompute-earlybird.ts:38`、`daily-retry-cron.ts:31`（query users by subscription.*）
- `tool-quota.js:180-197`（watchSubscription）、`account.html:270`、`pricing.html:375`（前端讀 subscription）
- `firestore.rules`（users/transactions/free_users 規則樣式）

---

## File Structure

| 檔案 | 動作 | 職責 |
|---|---|---|
| `functions/src/utils/firestore.ts` | 改 | 三 helper 改讀寫 `subscriptions/{uid}`，getSubscription 加舊位置後備 |
| `functions/src/admin-list-subscribers.ts` | 改 | query `subscriptions` collection |
| `functions/src/admin-recompute-earlybird.ts` | 改 | query `subscriptions` where is_early_bird |
| `functions/src/daily-retry-cron.ts` | 改 | query `subscriptions` where status |
| `firestore.rules` | 改 | 新增 `subscriptions/{uid}` 規則（read owner/admin, write false） |
| `tool-quota.js` | 改 | watchSubscription 讀 `subscriptions/{uid}`，後備舊位置 |
| `account.html` | 改 | 讀 `subscriptions/{uid}`，後備舊位置 |
| `pricing.html` | 改 | precheck 讀 `subscriptions/{uid}`，後備舊位置 |
| `scripts/migrate-subscriptions.js` | 建 | 批次回填 users.subscription → subscriptions/{uid}（冪等、非破壞） |
| `scripts/verify-subscriptions.js` | 建 | 對帳：列出有舊欄位無新 doc 者（應為 0） |
| `scripts/emulator-seed-sub.js` | 建 | emulator 種子：造肥 user doc + subscription 供 Gate 1 驗證 |

---

## Task 1: Cloud Function helper 改讀寫 subscriptions/{uid}（含雙讀後備）

**Files:**
- Modify: `functions/src/utils/firestore.ts:56-74`

- [ ] **Step 1: 改三個 helper**

把現有 `getSubscription / writeSubscription / patchSubscription` 替換為：

```ts
const SUBS = "subscriptions";

export async function getSubscription(uid: string): Promise<SubscriptionDoc | null> {
  // 雙讀後備:先讀新位置;遷移過渡期讀不到才退回舊的 users/{uid}.subscription
  const newSnap = await db.collection(SUBS).doc(uid).get();
  if (newSnap.exists) return (newSnap.data() as SubscriptionDoc) || null;
  const legacy = await db.doc(`users/${uid}`).get();
  return (legacy.data()?.subscription as SubscriptionDoc) || null;
}

export async function writeSubscription(uid: string, sub: SubscriptionDoc): Promise<void> {
  // 一律寫新位置(獨立小 doc,不受進度 doc 影響)
  await db.collection(SUBS).doc(uid).set(sub, { merge: true });
}

export async function patchSubscription(uid: string, patch: Partial<SubscriptionDoc>): Promise<void> {
  await db.collection(SUBS).doc(uid).set(patch, { merge: true });
}
```

> 註：`patchSubscription` 原本用 `subscription.${k}` dotted path 改 `users` doc；新位置欄位是頂層，改 `set(patch,{merge:true})` 等效且更簡單。

- [ ] **Step 2: build 驗證**

Run: `cd functions && npm run build`
Expected: tsc 無錯。

- [ ] **Step 3: Commit**

```bash
git add functions/src/utils/firestore.ts
git commit -m "refactor(functions): subscription 改存 subscriptions/{uid} + 雙讀後備"
```

---

## Task 2: 三個 query 從 users 改到 subscriptions

**Files:**
- Modify: `functions/src/admin-list-subscribers.ts:31-36`
- Modify: `functions/src/admin-recompute-earlybird.ts:38`
- Modify: `functions/src/daily-retry-cron.ts:31`

- [ ] **Step 1: admin-list-subscribers.ts**

把 `db.collection("users").where("subscription.status","in",[...])` 改為：
```ts
const snap = await db.collection("subscriptions")
  .where("status", "in", ["active", "trialing", "cancelled", "refunded", "expired"])
  .limit(500).get();
// doc.id 即 uid;原本 doc.data().subscription 改成 doc.data() 本身
```
下游讀 `doc.data().subscription` 之處改為 `doc.data()`，`uid` 由 `doc.id` 取得（補 email 邏輯不變）。

- [ ] **Step 2: admin-recompute-earlybird.ts**

`db.collection("users").where("subscription.is_early_bird","==",true)` → `db.collection("subscriptions").where("is_early_bird","==",true)`；讀欄位由 `data().subscription.*` 改 `data().*`，uid 由 `doc.id`。

- [ ] **Step 3: daily-retry-cron.ts**

把 `db.collection("users").where("subscription.status", ...)` 改 `db.collection("subscriptions").where("status", ...)`；同樣 uid 由 `doc.id`、欄位由 `data()`。

- [ ] **Step 4: build 驗證**

Run: `cd functions && npm run build`
Expected: tsc 無錯。

- [ ] **Step 5: Commit**

```bash
git add functions/src/admin-list-subscribers.ts functions/src/admin-recompute-earlybird.ts functions/src/daily-retry-cron.ts
git commit -m "refactor(functions): 訂閱查詢改打 subscriptions collection"
```

---

## Task 3: 安全規則新增 subscriptions/{uid}

**Files:**
- Modify: `firestore.rules`

- [ ] **Step 1: 在 transactions 規則後新增**

```
// 訂閱狀態 — 只有 Cloud Function (Admin SDK) 寫,owner + admin 讀。
// 刻意 write:false → 堵死「owner 寫 users 自封 premium」漏洞。
match /subscriptions/{uid} {
  allow read: if request.auth != null && (
                request.auth.uid == uid ||
                request.auth.token.email in ['stayjpplan@gmail.com', 'abc83327@gmail.com']
              );
  allow write: if false;
}
```

- [ ] **Step 2: 規則編譯驗證（不部署）**

Run: `firebase deploy --only firestore:rules --project jpnote-1bdd6 --dry-run 2>&1 || firebase firestore:rules --help >/dev/null`
（若無 dry-run，改用 emulator 載入驗證；見 Task 6）
Expected: 規則語法通過編譯。

- [ ] **Step 3: Commit**

```bash
git add firestore.rules
git commit -m "feat(rules): subscriptions/{uid} read owner/admin, write false"
```

---

## Task 4: 前端三處讀改 subscriptions/{uid}（雙讀後備）

**Files:**
- Modify: `tool-quota.js:191-195`
- Modify: `account.html:270`
- Modify: `pricing.html:375`

- [ ] **Step 1: tool-quota.js watchSubscription**

把 `firebase.firestore().doc('users/' + user.uid).onSnapshot(snap => { cachedSub = snap.data()?.subscription || null; ... })` 改為先監聽新位置，並對舊位置做一次性後備：

```js
const fs = firebase.firestore();
// 主來源:subscriptions/{uid}
fs.doc('subscriptions/' + user.uid).onSnapshot(snap => {
  if (snap.exists) { cachedSub = snap.data() || null; }
  refreshBadge(); applyGating();
}, err => console.warn('[ToolQuota] sub watch error:', err));
// 後備:遷移過渡期新 doc 還沒生成時,讀舊 users/{uid}.subscription(只在 cachedSub 仍空時採用)
fs.doc('users/' + user.uid).get().then(d => {
  if (!cachedSub && d.exists && d.data().subscription) {
    cachedSub = d.data().subscription; refreshBadge(); applyGating();
  }
}).catch(() => {});
```

- [ ] **Step 2: account.html:270**

該處 `db.collection('users').doc(currentUser.uid).onSnapshot` 若用於讀 subscription 顯示，改監聽 `db.doc('subscriptions/' + currentUser.uid)`；讀不到時後備舊 `users/{uid}.subscription`。（保留其他 users doc 欄位的既有監聽不動。）

- [ ] **Step 3: pricing.html:375**

`const snap = await _db.doc('users/' + user.uid).get();` 後讀 `snap.data().subscription` 之處，改為先 `await _db.doc('subscriptions/' + user.uid).get()`，不存在再退回 `users/{uid}.subscription`。

- [ ] **Step 4: Commit**

```bash
git add tool-quota.js account.html pricing.html
git commit -m "refactor(web): 前端訂閱讀取改 subscriptions/{uid} + 後備"
```

---

## Task 5: 遷移 + 對帳腳本

**Files:**
- Create: `scripts/migrate-subscriptions.js`
- Create: `scripts/verify-subscriptions.js`

- [ ] **Step 1: migrate-subscriptions.js（冪等、非破壞）**

```js
// 用法: GOOGLE_APPLICATION_CREDENTIALS=<sa.json> node scripts/migrate-subscriptions.js [--commit]
// 預設 dry-run;加 --commit 才真寫。非破壞:只新增 subscriptions/{uid},不刪 users.subscription。
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'jpnote-1bdd6' });
const db = admin.firestore();
const COMMIT = process.argv.includes('--commit');
(async () => {
  const snap = await db.collection('users').get();
  let copied = 0, skipped = 0;
  for (const doc of snap.docs) {
    const sub = doc.data().subscription;
    if (!sub) { continue; }
    const ref = db.collection('subscriptions').doc(doc.id);
    const existing = await ref.get();
    if (existing.exists) { skipped++; continue; }   // 已遷移,不覆蓋
    if (COMMIT) await ref.set(sub, { merge: true });
    copied++;
  }
  console.log(`${COMMIT ? 'COMMITTED' : 'DRY-RUN'}: copy=${copied} skip(existing)=${skipped} total=${snap.size}`);
  process.exit(0);
})();
```

- [ ] **Step 2: verify-subscriptions.js（對帳:應 0 desync）**

```js
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'jpnote-1bdd6' });
const db = admin.firestore();
(async () => {
  const users = await db.collection('users').get();
  let missing = 0;
  for (const doc of users.docs) {
    if (!doc.data().subscription) continue;
    const n = await db.collection('subscriptions').doc(doc.id).get();
    if (!n.exists) { missing++; console.log('MISSING new sub for', doc.id); }
  }
  console.log(`users-with-legacy-sub-but-no-new-doc = ${missing} (期望 0)`);
  process.exit(missing === 0 ? 0 : 1);
})();
```

- [ ] **Step 3: Commit**

```bash
git add scripts/migrate-subscriptions.js scripts/verify-subscriptions.js
git commit -m "chore(scripts): 訂閱遷移 + 對帳腳本(冪等非破壞)"
```

---

## Task 6: Gate 1 — emulator 端對端驗證（不碰線上）

**Files:**
- Create: `scripts/emulator-seed-sub.js`

- [ ] **Step 1: 種子腳本（造肥 user doc + 舊 subscription）**

```js
// 連 emulator: FIRESTORE_EMULATOR_HOST=localhost:8080 node scripts/emulator-seed-sub.js
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'jpnote-1bdd6' });
const db = admin.firestore();
(async () => {
  const uid = 'TEST_FAT_USER';
  const srs = {}; for (let i = 0; i < 2700; i++) srs[`n3:詞${i}`] = { interval: 7, ease: 2.5, nextReview: '2026-07-01', nextReviewTs: 1780000000000, reviews: 5, correct: 4, lastReview: '2026-06-09', lastReviewTs: 1779900000000 };
  await db.doc(`users/${uid}`).set({
    srs_data: srs,
    subscription: { source: 'web', plan: 'monthly', status: 'active', expiresAt: Date.now() + 30*86400000, willRenew: true, startedAt: Date.now(), failed_retries: 0 },
  });
  console.log('seeded users/' + uid + ' with 2700 srs + legacy subscription');
  process.exit(0);
})();
```

- [ ] **Step 2: 起 emulator + 種子**

Run:
```bash
cd /Users/user/Documents/GitHub/stay-jp-notes
firebase emulators:start --only firestore,auth --project jpnote-1bdd6 &
sleep 8
FIRESTORE_EMULATOR_HOST=localhost:8080 node scripts/emulator-seed-sub.js
```
Expected: `seeded users/TEST_FAT_USER ...`

- [ ] **Step 3: 對 emulator 跑遷移 + 對帳**

Run:
```bash
FIRESTORE_EMULATOR_HOST=localhost:8080 node scripts/migrate-subscriptions.js --commit
FIRESTORE_EMULATOR_HOST=localhost:8080 node scripts/verify-subscriptions.js
```
Expected: migrate `copy=1`；verify `= 0 (期望 0)` 且 exit 0。

- [ ] **Step 4: 驗證 write:false（自封 premium 被擋）**

用 emulator rules 測試（@firebase/rules-unit-testing 或手動）：以 `request.auth.uid == 'TEST_FAT_USER'` 嘗試 `set(subscriptions/TEST_FAT_USER, {...})`。
Expected: PERMISSION_DENIED。

- [ ] **Step 5: 記錄結果，不 commit（emulator 為臨時）**

把 Gate 1 結果貼回對話。全綠才可進 Phase 1 部署。

---

## 部署順序（每步前確認 Gate）

1. **Gate 1 通過** → 部署 functions（Task 1,2）+ rules（Task 3）+ 前端（Task 4）。`firebase deploy --only functions:ecpayCallback,functions:adminListSubscribers,functions:adminRecomputeEarlybird,functions:dailyRetryCron,firestore:rules`（指名避免誤跳過）。此時雙讀後備生效，線上無感。
2. **Gate 2** → 正式環境用測試帳號確認雙讀後備路徑可用 → 跑 `migrate-subscriptions.js --commit`（正式 SA 憑證）。
3. **Gate 3** → 觀察 1~2 週，`verify-subscriptions.js` 回 0。
4. **清理（另開小 PR）** → 移除 helper / 前端的舊位置後備，刪 `users/{uid}.subscription` 欄位（先 export 備份）。

---

## Self-Review

- **Spec 覆蓋**：元件 A 全項對應 Task 1-6 ✔；安全洞修補 = Task 3 ✔；不中斷遷移 = 雙讀後備（Task 1,4）+ 非破壞回填（Task 5）+ Gate（Task 6 / 部署順序）✔。進度壓縮（元件 B）= 另開 Plan 2，本計畫不含（已於 scope 聲明）。
- **Placeholder**：account.html Task 4 Step 2 因該檔 onSnapshot 用途需現場確認其餘欄位用法，已標明「保留其他既有監聽不動」；其餘步驟均含實際程式。
- **型別一致**：`SubscriptionDoc` 沿用 firestore.ts 既有定義；query 改用 `doc.id` 取 uid、`doc.data()` 取頂層欄位，三處一致。
