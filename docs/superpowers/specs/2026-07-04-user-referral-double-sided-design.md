# 用戶推薦朋友 · 雙向 7 天獎勵 — 設計 spec

日期:2026-07-04
狀態:已核可(brainstorming),待寫實作計畫

## 目標

讓**一般用戶**(非 KOL)推薦朋友:朋友真實付費後,**推薦人與朋友各獲得 7 天 premium 延長**。與現有 KOL 抽成碼並存但機制不同(KOL 給碼主現金抽成;用戶碼給碼主 +7 天)。

## 已核可的關鍵決策

1. **發獎時機**:朋友「首次真實付費」(active、非沙盒)才發 — 付款閘門防刷。
2. **推薦人獎勵形式**:不管推薦人現在免費或付費,都發 7 天 premium(有訂閱→延到期日;免費→發 7 天 premium),**可疊加**(每個真付費朋友 +7),**不設上限**。
3. **退款/退單**:v1 **不追回**推薦人的 7 天(接受微小漏損;YAGNI,日後要嚴再加)。
4. 架構:**沿用現有 `ref_codes` + `users.ref_code` 歸因 + 付款觸發**,加 `type` 欄位區分,不另造系統。

## 資料模型

- `ref_codes/{CODE}` 新增:
  - `type: 'kol' | 'user'`(現存的都視為 `kol`;缺值 = `kol` 以相容)
  - `owner_uid: string`(僅 `user` 型;指向碼主)
- 用戶個人碼:進「邀請」區時**自動生成**(6 碼大寫英數,撞碼重生),寫 `ref_codes/{CODE} = {type:'user', owner_uid, active:true, created_at}`。一個用戶一個碼(存 `users/{uid}.my_ref_code` 供 UI 讀 + 防重生)。
- `users/{uid}` 新增:
  - `my_ref_code`(自己的邀請碼,顯示用)
  - `referrer_paid_at`(此被推薦人已觸發過「獎推薦人」的時戳 → 防朋友續訂重複發)
- 推薦人獎勵寫入:延長/建立其 subscription(`status:'active'`、`source:'referral'`、`expiresAt = max(now, 既有 expiresAt) + 7d`);記一筆 `transactions` 稽核(`type:'gift'`、`amount_twd:0`、`is_sandbox` 沿用事件旗標),不計營收。

## 流程

1. **帳號頁**新增「邀請朋友 · 雙方各得 7 天」卡:
   - 首次進入自動生成個人碼(若無)
   - 顯示個人連結 `https://stayjp.study/?ref=<我的碼>` + 複製鈕
   - 顯示「已成功推薦 N 人」(N = 用我的碼且已付費的朋友數)
2. **朋友歸因**:點連結(網頁 auth-header 自動存)或帳號頁輸碼(App)→ `users/朋友.ref_code = 我的碼`。
   - 防呆:`applyRefCode` 與 `validateRefCode` 需拒絕「碼的 owner_uid == 當前使用者」(不能推薦自己)。
3. **朋友真實付費**(webhook `INITIAL_PURCHASE` 或綠界 callback,`active` 且非沙盒):
   - a. 朋友 +7 天(**現有 `ref_bonus_at` 邏輯,不動**)
   - b. **新增**:查 `ref_codes[朋友.ref_code]`;若 `type==='user'` 且 `朋友.referrer_paid_at` 未設 →
     - 給 `owner_uid` +7 天 premium(延長或發放)
     - 記 gift 稽核交易(amount 0)
     - 設 `朋友.referrer_paid_at = now`
     - 防呆:`owner_uid !== 朋友uid`(自我推薦二次防線)
4. **到期**:推薦人被贈的 7 天走現有到期機制(`dailySubAuditCron` / `expiresAt`)自然回免費;免費用戶被贈的 premium 到期同理。

## 元件 / 觸及檔案

- `functions/src/utils/firestore.ts`:新增 helper `grantReferralDays(uid, days, isSandbox, sourceNote)`(server 端延長/發放 premium + 記 gift 交易);型別加 `type`/`owner_uid`。
- `functions/src/revenuecat-webhook.ts`:INITIAL_PURCHASE 分支在既有「朋友 +7」後,加「查碼 → 若 user 型獎 owner」。
- `functions/src/ecpay-callback.ts`:同上(網頁金流路徑對齊)。
- `functions/src/validate-ref-code.ts`:回傳加 `type`;呼叫端可判斷是否自我推薦(或在此擋)。
- `account.html`:新增「邀請朋友」卡 + 自動生成碼 + 顯示連結/複製/推薦數;`applyRefCode` 加自我推薦防呆。
- **個人碼生成**:新增 Cloud Function `getMyRefCode`(callable/HTTP,需登入)——用 Admin SDK 讀/建當前使用者的 `type:'user'` 碼,回傳碼字串;冪等(已有就回既有)。**`firestore.rules` 的 `ref_codes` 維持 admin-only write 不放寬**(用戶不直接寫 `ref_codes`,避免自封 kol / 竄改他人碼)。account.html 進「邀請」區時呼叫此 function 取碼。

## 防刷 / 邊界

- 付款閘門:farming 需真付訂閱費,不划算。
- 自我推薦:apply 端 + 發獎端雙重擋(owner != self)。
- 每個朋友只獎推薦人一次(`referrer_paid_at`)。
- 無上限(每次 = 一個真付費客)。
- 退款/退單:v1 不追回(記錄在案,未來可在 refund/chargeback 事件追回)。
- 沙盒:`is_sandbox` 事件不觸發真實發獎(比照現有 `!isSandbox` 條件)。

## 不做(out of scope, v1)

- 退款追回推薦人獎勵
- 推薦排行榜 / 多層(推薦的推薦)分潤
- 推薦人獎勵上限 / 風控封鎖

## 測試(比照本次 KOL E2E 做法)

- Emulator 端到端:seed user 型碼 + 朋友歸因 → POST 朋友付款 webhook → 驗:朋友 +7、推薦人 +7、gift 交易 amount 0、`referrer_paid_at` 設定、朋友續訂不重複發、自我推薦被擋、沙盒不發。
- 上線前:origin/main worktree 跑,單一 function 部署,貼證據(對齊 [[verify-no-impact-on-live-users-before-deploy]])。
