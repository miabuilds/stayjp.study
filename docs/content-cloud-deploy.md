# 內容資料雲端化 — 部署檢查清單

把所有學習內容（vocab / grammar / listening / reading / confusables）從靜態 JS 檔搬進 Firestore `content/master`。前端 + App 都吃同一份，改一處兩邊同步。

## 部署順序（**順序不能反**）

### 1. 發布新版 firestore.rules

Firebase Console → Firestore Database → Rules → 貼 `firestore.rules` 全文 → 發布。
新增的規則：
- `content/{doc}` 公開讀、寫禁（migration 走 SA Admin 繞過）
- `stats/{doc}` 寫禁（先前的 client +1 已停用）

### 2. 本地跑 migration script 寫 content/master

```bash
export GCP_SA_KEY="$(cat /path/to/learners-sync-jpnote-1bdd6.json)"
node scripts/migrate-content-to-firestore.mjs
```

預期輸出：
```
=== 統計 ===
vocab: n5=725 n4=750 n3=2081 n2=2153 n1=2001
grammar: n5=68 n4=75 n3=79 n2=67 n1=93
confusables: 80
listening_items: 121
reading_passages: 60
JSON size: 531517 bytes (限 1048576)
version: <12位 hash>
Firestore content/master 寫入完成 (version=<hash>)
```

驗證：Firebase Console → Firestore → `content/master` 應該有三個欄位：
- `payload` (大字串)
- `version` (字串)
- `updatedAt` (timestamp)

### 3. push 前端 code

`git push` 後 GitHub Pages 部署。SW v126 → v127 也會自動讓使用者拿到新版（前面已有 SW 自動更新機制）。

## 改動清單

**新增：**
- `content-loader.js` — 前端 fetch + localStorage 快取，set window globals
- `scripts/migrate-content-to-firestore.mjs` — 本地 / CI 跑的搬移腳本
- `docs/content-cloud-deploy.md` — 本檔

**修改：**
- `index.html` — 移除 vocab-n*.js / grammar-n*.js / confusables.js 的 `<script src>`、移除 inline `const N5/N4` grammar 陣列、init 包進 `ContentLoader.ready()`
- `listening.js` — 把 736 行 `const items = [...]` 換成 `let items = window.LISTENING_ITEMS || []` + `setItems()` setter
- `reading.js` — 同上，把 478 行 `const passages = [...]` 換成 `let passages` + `setPassages()`
- `sw.js` — ASSETS 移除 vocab/grammar/confusables JS，加 content-loader.js；CACHE_NAME v126 → v127
- `firestore.rules` — 新增 `content/{doc}` 公開讀規則

**保留作 backup：**
- `vocab-n5.js`..`vocab-n1.js`、`grammar-n3.js`..`grammar-n1.js`、`confusables.js` — 原檔留著，移除 sw.js ASSETS 參考。新版前端不再載這些檔。確認雲端版穩定 0~2 週後可考慮 git rm 完全刪掉

## 後續編輯流程

從現在起，編輯學習內容兩種方式：

**方式 A — 直接改 Firestore**（適合單筆小修）
- Firebase Console → Firestore → content/master → payload 欄位改 JSON string → 改 version 欄位（隨便填 hash 之類，目的讓客戶端 cache invalidate）

**方式 B — 改原始 JS 檔再重跑 migration**（適合多筆批改、需要版控）
- 改 vocab-n*.js / grammar-n*.js / etc.
- 跑 `node scripts/migrate-content-to-firestore.mjs`
- migration 會自動算新 version hash 寫入

無論哪種，下一輪訪客的 content-loader 背景檢查到 version 變了就拉新版。重訪這位使用者也會自動拿到。

## App 整合

App 端用同樣的 REST API：
```
GET https://firestore.googleapis.com/v1/projects/jpnote-1bdd6/databases/(default)/documents/content/master
```

或 Firebase SDK：
```javascript
firestore.collection('content').doc('master').get();
```

`payload` 是 JSON string、parse 後就有完整資料樹（vocab/grammar/...）。App 應該也做 localStorage 等快取避免每次啟動都打網路。

## Rollback（萬一新版壞掉）

1. `git revert <commit-hash>` 把前端改動 revert
2. push → SW 把舊版（含 vocab-n*.js）推回去
3. content/master 留著無害（沒人讀就沒問題）

## 風險 & 已知限制

- **首次訪問** 多 ~500ms（Firestore fetch）。重訪 localStorage 命中無延遲
- **content/master doc 上限 1 MiB**。目前 531KB，還有空間（內容增加 2x 才會碰）
- **listener / reader IIFE 模組需要靠 setItems / setPassages 注入**，content-loader 在 ready() 後才呼叫 — 比 const 靜態載入晚一拍但對使用者無感
