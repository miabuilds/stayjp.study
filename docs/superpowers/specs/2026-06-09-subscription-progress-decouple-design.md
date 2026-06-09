# 訂閱獨立 + 進度資料壓縮 — 設計文件

> 日期：2026-06-09　狀態：設計已核可，待施工　負責：StayJP + Claude
> 鐵則：**全程不影響線上用戶；每個正式環境動作前先在隔離環境驗證過才發。**

## 背景：一次真實事故掀出的兩個結構問題

2026-06-09 一位用戶綠界月費扣款成功，但 DB 沒訂閱記錄、付費功能進不來。根因：
`subscription` 和 `srs_data` 等學習進度全部塞在同一份 `users/{uid}` 文件，Firestore 自動索引每個欄位。
某 power user 的 `srs_data`（2168+ key 的 map）令該 doc 索引條目突破 **40,000/doc 上限**，
導致對該 doc 的「任何」寫入都被拒（`INDEX_ENTRIES_COUNT_LIMIT_EXCEEDED`）—— 包含訂閱開通與進度存檔。

已做的急救（已上線）：
- `firestore.indexes.json` 對進度欄位加索引豁免（解 40k 索引上限）。
- `ecpayCallback` 寫訂閱失敗時改寫 `payment_failures` 告警 doc，不再默默吞單。
- 受害用戶已手動回填訂閱。

本設計處理**根因**，使這類事故結構上不可能再發生。

## 這次掀出的三個問題

1. **金流綁在會爆的 doc 上**：訂閱寫入依賴一個會隨學習量無限長大的文件。
2. **進度 doc 逼近體積上限**：`users/{uid}` 已約 926KB，逼近 Firestore **1 MiB 單文件硬上限**；索引豁免救不了體積。
3. **自封 premium 漏洞**：規則 `users/{uid}` 是 owner 可寫（前端要存進度），但 `subscription` 也在這份 doc，
   任何用戶可在 console `set({subscription:{status:'active',...}})` 自封付費。

## 目標 / 非目標

**目標**
- 金流狀態與「會長大的進度資料」徹底脫鉤，訂閱寫入永遠不受進度 doc 健康影響。
- 進度資料的存放可容納任何現實用戶（JLPT 全級數極限約 9,000 項）且遠離 1 MiB 上限。
- 堵死自封 premium 漏洞。
- 遷移全程不中斷線上用戶；驗證過才發。

**非目標**
- 不改 SRS 演算法、不改任何學習功能行為。
- 不為沒發生過的問題加複雜度（YAGNI）。
- iOS app 對應改動屬另一 repo，本文件只標註介面契約，不在此實作。

## 已驗證的關鍵假設（真實資料，非估算）

用受害者真實 `srs_data` 實測 gzip：

| 規模 | raw | gzip | 壓縮比 |
|---|---|---|---|
| 2209 項（真實） | 743 KB | 66 KB | **11.3x** |
| 9000 項（JLPT 極限，外推） | ~2.9 MB | ~270 KB | ~11x |
| 壓縮後撞 1 MiB 需 | — | — | 約 **34,000 項** |

→ 餘裕約 **3.8x**。方案 A（壓縮）對本 app 是「治本」而非「延後」。

## 終點架構：把「什麼都塞」的 `users/{uid}` 拆三塊

| 位置 | 內容 | 規則 |
|---|---|---|
| `users/{uid}` | 身份 + 小欄位：favorites、exam_date、base_level、goal_level、streak | owner 可讀寫、admin 可讀（現狀） |
| `subscriptions/{uid}`（新） | 訂閱狀態（SubscriptionDoc 原形狀） | **owner 可讀、admin 可讀、`write:false`** |
| `user_progress/{uid}`（新） | 進度 blob，每 key 各自 gzip 成 bytes 欄位 | owner 可讀寫、admin 可讀 |

## 元件 A：訂閱獨立 → `subscriptions/{uid}`

- doc 形狀照搬現有 `SubscriptionDoc`，只換位置。
- 安全規則：
  ```
  match /subscriptions/{uid} {
    allow read: if request.auth != null && (request.auth.uid == uid || adminEmail);
    allow write: if false;   // 只有 Cloud Function (Admin SDK) 寫 → 堵死自封 premium
  }
  ```
- 程式觸點（下游 callback/refund/cancel/chargeback/cron/revenuecat 全靠 helper，免改）：
  - `functions/src/utils/firestore.ts`：`getSubscription / writeSubscription / patchSubscription` 改讀寫 `subscriptions/{uid}`。
  - 3 個 query 從 `users` 移到 `subscriptions`（欄位變頂層，單欄位自動索引即可）：
    `admin-list-subscribers`（`subscription.status`→`status`）、`admin-recompute-earlybird`（`subscription.is_early_bird`→`is_early_bird`）、`daily-retry-cron`。
  - 前端 3 處讀：`tool-quota.js` `watchSubscription`、`account.html`、`pricing.html` → 改讀 `subscriptions/{uid}`。
  - `isPremium()` 判定式不變，只換資料來源。

## 元件 B：進度壓縮 → `user_progress/{uid}`

- 形狀：每個進度 key 各自 gzip 成獨立 bytes 欄位（**非整包一坨**），保留「部分寫入」語意、避免讀改寫與多分頁互蓋：
  ```
  user_progress/{uid} = { srs_data:<gzip bytes>, word_notebook:<gzip bytes>, quiz_history:<gzip bytes>,
                          grammar_srs:<…>, grammar_weak:<…>, mock_exam_history:<…>,
                          reading_done:<…>, listening_scores:<…>, listening_done:<…>,
                          shadow_favs:<…>, wrong_questions:<…> }
  ```
- 壓縮用瀏覽器原生 `CompressionStream('gzip')` / `DecompressionStream`，存成 Firestore `firebase.firestore.Blob.fromUint8Array(...)`（本站用 compat v8 SDK）。無需第三方庫。
- 程式觸點（全在 `index.html`，用 `LC_ALL=C grep -a` 才搜得到）：
  - `loadCloudData()`（~1601）：改讀 `user_progress/{uid}`，各欄位解壓後沿用既有 `mergeSRS` / SYNC_KEYS 合併邏輯。
  - `saveSRSCloud()`（~1706）：壓縮 srs_data 寫 `user_progress/{uid}`（merge 單欄位）。
  - `saveAllCloud()`（~1713）：把 SYNC_KEYS 拆兩路——**小純量**（`exam_date`、`base_level`、`goal_level`、`daily_progress`）續寫 `users/{uid}`；**會長大的 blob**（`study_log`、`word_notebook`、`grammar_srs`、`grammar_weak`、`mock_exam_history`、`reading_done`、`listening_scores`、`listening_done`、`shadow_favs`、`wrong_questions`）壓縮寫 `user_progress/{uid}`。
  - `quiz_history`（~1704）：壓縮寫 `user_progress/{uid}`。
  - `streak`（~2584）、`favorites`（~1596）：小欄位，續留 `users/{uid}`。
- 安全規則：
  ```
  match /user_progress/{uid} {
    allow read: if request.auth != null && (request.auth.uid == uid || adminEmail);
    allow write: if request.auth != null && request.auth.uid == uid;
  }
  ```

## 遷移與切換：四階段、全程不中斷、只加不刪到最後

核心手法：**雙讀後備（dual-read）**——切換期「先讀新、讀不到退舊」，未遷移用戶照舊運作、零斷層。

- **Phase 0 — 隔離驗證（碰不到正式）**：程式寫好，在 Firebase emulator 用**合成的肥 doc**（2700+ 項 SRS，仿真 SrsEntry 形狀）跑遷移→假帳號（emulator Auth，任意 uid、免密碼）登入→驗進度完整、訂閱在、付費解鎖；驗一般用戶寫 `subscriptions/自己` 被拒。**[Gate 1]**
- **Phase 1 — 部署雙讀雙寫（對用戶透明）**：讀先新後舊；新付款訂閱寫 `subscriptions/{uid}`、新進度寫 `user_progress/{uid}`。新舊並存、讀新優先。
- **Phase 2 — 批次回填（只加不刪）**：admin 腳本掃全用戶，缺新 doc 就壓縮/複製過去，**舊欄位保留**。冪等、可重跑。
- **Phase 3 — 正式觀察期（仍只加不刪）**：1~2 週。對帳腳本確認「有舊訂閱欄位但無新 doc 者 = 0」、`payment_failures` 空、`user_progress` 皆小、無客訴。**[Gate 3]**
- **Phase 4 — 清理（唯一破壞性、最後、關卡最嚴）**：移除雙讀後備、刪 `users/{uid}` 舊進度 blob + 舊 subscription 欄位（收回 1 MiB 餘裕）。刪前先 export users collection 備份。

**驗證關卡**：Gate 1（Phase 1 前，emulator 全綠）、Gate 2（Phase 2 前，正式環境用測試帳號確認雙讀後備）、Gate 3（Phase 4 前，觀察期指標乾淨 + 對帳 100% 遷移）。

**退場**：Phase 1~3 喊停即回退程式碼，舊資料原封不動；Phase 4 有備份。任何一刻線上用戶都讀得到自己的資料。

## 監控與保險

- ✅ `payment_failures` 告警（已上線）。
- 加排程檢查：任何 `user_progress/{uid}` 或 `users/{uid}` 超 ~700KB 即預警。
- `admin.html` 加小面板顯示 `payment_failures`（resolved=false），對帳一眼看完。

## iOS app 介面契約（另 repo，之後做）

- 訂閱改讀 `subscriptions/{uid}`（頂層欄位，原 SubscriptionDoc 形狀）。
- 進度改讀寫 `user_progress/{uid}`，各 key 為 gzip bytes（標準 gzip，與 web 對接）。
- iOS 未上架零用戶，跟著新 schema 實作即可，無需 migration。

## 風險與緩解

| 風險 | 緩解 |
|---|---|
| 切換中用戶讀不到資料 | 雙讀後備；只加不刪；Phase 4 才清理 |
| 壓縮欄位在 console 不可讀 | 接受（進度資料本就不人工查）；admin 工具可解壓顯示 |
| CompressionStream 舊瀏覽器不支援 | 偵測 fallback：不支援則寫未壓縮（罕見、容量仍受監控） |
| 遷移腳本誤刪 | 非破壞性 + Phase 4 前 export 備份 |
| 多分頁/裝置同時寫 | 每 key 獨立欄位 merge，降低互蓋；沿用既有 mergeSRS |
