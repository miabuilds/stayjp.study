# Admin 自助工具:手動訂閱管理 + 報錯 log — 設計文件

> 日期：2026-06-09　狀態：設計已核可　負責：StayJP + Claude
> 動機：owner 出門沒帶電腦時，能在手機上(1) 手動補開/取消/延長訂閱，(2) 查看程式報錯。
> 都加在現有 owner-only 後台 `admin.html`，沿用「Cloud Function + 分頁」模式。

## 背景

承 2026-06-09 金流事故：曾有用戶付款成功但沒入帳，當時只能靠 CLI/工程手動補。
本工具把那個動作變成 owner 自助按鈕。後台已有 adminFreeAccess / adminListSubscribers /
adminResetBilling / adminRecomputeEarlyBird / adminCleanupPending / adminUnblockUser /
adminUserStats，全是「owner-only Cloud Function + admin.html 分頁」。本設計照此模式新增兩個。

## 元件 1：手動訂閱管理

**新 Cloud Function `adminSetSubscription`**（region asia-east1、owner-only：verifyIdToken + OWNER_EMAILS）。

| action | body | 行為 |
|---|---|---|
| `set` | email, plan(`monthly`/`yearly`/`yearly_early_bird`/`lifetime`), expiresAt(ms 或 yyyy-mm-dd) | email→uid(admin.auth().getUserByEmail)；`writeSubscription(uid,{source:'web',plan,status:'active',expiresAt,willRenew:plan!=='lifetime',startedAt:now,failed_retries:0})`；寫 `type:gift` transaction(amount_twd:0, note:'manual admin set') |
| `cancel` | email | `patchSubscription(uid,{status:'cancelled',willRenew:false})`；寫 `type:cancel` transaction |
| `extend` | email, days | 讀現有 sub，`patchSubscription(uid,{expiresAt: max(now,expiresAt)+days*86400000})`；寫 `type:gift` transaction(note:'manual extend Nd') |

- **寫入一律走現有 `functions/src/utils/firestore.ts` 的 `writeSubscription`/`getSubscription`/`patchSubscription` helper**。
  今天寫 `users/{uid}.subscription`；待訂閱獨立(另一支 spec)上線後，helper 改寫 `subscriptions/{uid}`，本函數自動跟著搬，無需改碼。
- 回傳該 uid 操作後的最新訂閱狀態。
- 找不到 email → 404 `user_not_found`(對方需先登入過本站)。

**UI（admin.html 新分頁「訂閱管理」）**：email 輸入框、方案下拉、到期日(date input)或延長天數、三顆按鈕(設定/延長/取消)。手機友善：單欄、大按鈕。操作後顯示結果 + 最新狀態。沿用既有 `FN_xxx` + `fetch(Authorization:'Bearer '+idToken)`。

## 元件 2：報錯 log

**新 Cloud Function `adminErrorLog`**（owner-only）：
- 用 `@google-cloud/logging` 列出最近 `severity>=ERROR` 的日誌。
- filter：`severity>=ERROR AND resource.type="cloud_run_revision"`（v2 函數跑在 Cloud Run）+ 時間範圍(query 參數 hours，預設 48、上限 168)。
- 回傳 `[{timestamp, severity, service(函數名), message}]`，依時間倒序，上限 50。
- 涵蓋所有函數 `console.error`——含金流硬化的 `🚨 SUBSCRIPTION WRITE FAILED`，故付款出事自動現身。

**權限前提**：函數 runtime service account 需 `roles/logging.viewer`。Firebase 預設 SA 通常含 Editor 角色(已涵蓋)；部署後實測，若 403 則在 Console / gcloud 補授 logging.viewer。

**UI（新分頁「報錯」）**：時間倒序清單，ERROR 紅標，顯示函數名+訊息+時間；時間範圍切換(24h/48h/7d)。手機友善。

## 共通

- 兩函數加進 `functions/src/index.ts` export；admin.html 加兩個分頁 + 對應 `FN_` 常數。
- 依賴：functions 加 `@google-cloud/logging`。
- 部署在 **main**(獨立於訂閱獨立分支)：`firebase deploy --only functions:adminSetSubscription,functions:adminErrorLog,hosting`。

## 非目標(YAGNI)

- 訂閱管理不做中途換方案/比例計費；不做退款(已有 refund 函數)。
- 報錯頁純檢視(只讀)，不做即時推播/告警(已有 doc-size monitor + payment_failures 機制)。

## 風險與緩解

| 風險 | 緩解 |
|---|---|
| 手動 set 訂閱寫錯人 | email→uid 精確比對；操作後回顯最新狀態供核對；寫 transaction 留可追溯帳 |
| adminErrorLog 缺 logging 權限 | 部署後實測；403 則補授 logging.viewer |
| 與訂閱獨立(Plan 1)衝突 | 走共用 helper，Plan 1 上線後自動跟搬，無需改本工具 |
| 手機誤觸 | 取消/設定操作前 confirm 對話框 |
