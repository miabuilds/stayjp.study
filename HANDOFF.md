# StayJP 專案交接 / 狀態紀錄

> 最後更新:2026-06-24
> 用途:換電腦 / 備份 / 接手用。記錄目前部署狀態、待辦、App Store 送審資料、要另外備份的密鑰。
> ⚠️ 此檔在 `backup/local-wip-2026-06-24` 分支,**不在 main**(避免被部署到公開網站洩漏內部資訊)。

---

## 0. ⚠️ 要「另外」備份的東西(GitHub 不能放 / 沒放)

| 項目 | 在哪 | 怎麼辦 |
|---|---|---|
| `stay-jp-notes/.env.local` | 本機,gitignore | **綠界金流密鑰**(ECPAY_HASH_KEY/IV/MERCHANT_ID)。複製到密碼管理器。萬一遺失:綠界後台可「重新產生 HashKey/HashIV」。生產環境不靠它(用 Firebase Secret Manager)。 |
| `stayjp-app/.env`、`.env.local` | 本機,gitignore | app 本機開發變數。 |
| Apple app 專用密碼 / 簽章憑證 | EAS 雲端 | iOS 簽章憑證存在 EAS(`expo.dev`),換機不會丟。 |
| Firestore 資料 | 雲端 | 已開 PITR(7天回溯)+ 每日自動備份(見 §6),不靠本機。 |

---

## 1. 兩個 Repo

| Repo | GitHub | 內容 |
|---|---|---|
| `stay-jp-notes` | github.com/miabuilds/stayjp.study | 網站(HTML/JS)+ Firebase Functions(金流/訂閱後端) |
| `stayjp-app` | github.com/miabuilds/stayjp-app | iOS/Android App(Expo + React Native,WebView 包 stayjp.study + 原生登入/IAP) |

---

## 2. 線上 / 部署狀態

### 網站(stay-jp-notes)
- **線上 = `origin/main`**。部署是**手動**:`firebase deploy --only hosting`(從 origin/main 的 worktree)。Push 到 GitHub **不會**自動上線。
- Functions 手動:`firebase deploy --only functions:<name>`。**改 `utils/constants.ts` 等共用檔,要重部署所有讀它的 function**(否則線上跑舊值)。
- CI:`.github/workflows/verify-subscription-decouple.yml`(push 到 feat/** 或 main 時跑驗證,**不部署**);`sync-learners.yml`(cron 每 10 分鐘寫學員數)。
- 自訂網域 stayjp.study 有 CDN 快取(max-age=600),部署後約 10 分鐘生效;驗證可先看 `jpnote-1bdd6.web.app/<route>`(注意 `.html` 會 301 到無副檔名)。

### App(stayjp-app)
- 線上 App = TestFlight **build #9**(commit 96cfc39,2026-06-20 建)+ EAS OTA(branch `production`)。
- **OTA**:`eas update --branch production`,推 JS;裝置**冷啟動時背景下載、下一次冷啟動才套用**(所以發布後要關開兩次才看到)。
- channel `production` → branch `production`;runtimeVersion policy=appVersion(目前 1.0.0)。
- ⚠️ OTA 在某些裝置會卡在舊 bundle。**送審 / 要保證生效的改動 → 出新 build(見待辦 build #10),把改動烤進 binary。**

---

## 3. 分支說明(stay-jp-notes)

- `main` — 線上正式。
- `feat/subscription-decouple` — 訂閱獨立(把 subscription 從 `users/{uid}.subscription` 搬到獨立 collection `subscriptions/{uid}`)。**⚠️ 此分支落後 main 一大截**(缺今天所有修復、缺 start-trial.ts、缺 subLoaded/doRender 守衛)。**不可直接 merge → main**,會 gate 付費會員 + 丟失修復。要做的話是「把拆分核心(firestore.ts 3 函式 + rules + 雙讀)重新套到目前 main」,並掃所有讀訂閱的入口(admin.html / start-trial.ts / admin-purge-test / admin-reset-billing 這幾個 feat 漏改)。詳見 §5「1MiB 炸彈」。
- `deploy-*` — 當時各次部署的分支(已合進 main,留作紀錄)。
- `backup/local-wip-2026-06-24` — 本機未提交工作備份(Threads 宣傳骨架、i18n、app-review.html)+ 本檔。

---

## 4. App Store 送審資料 📝

### 4.1 App 基本資訊
- 名稱:StayJP / 日本再留計劃 ・分類:Education(教育)
- 架構:Expo RN,WebView 包 https://stayjp.study + 原生 Google 登入 + 原生 IAP(RevenueCat)。
- 隱私權:https://stayjp.study/privacy ・服務條款:https://stayjp.study/terms
- 客服信箱:stayjpplan@gmail.com

### 4.2 IAP 產品(App Store Connect 要建好並附到版本)
| Product ID | 方案 | 價格(USD)| 類型 |
|---|---|---|---|
| com.stayjp.app.monthly | 月費 | US$4.99 | 自動續訂訂閱 |
| com.stayjp.app.yearly | 年費 | US$49.99 | 自動續訂訂閱 |
| com.stayjp.app.yearly_early_bird | 早鳥年費 | US$29.99 | 自動續訂訂閱(限量) |
| com.stayjp.app.lifetime | 買斷 | US$99.99 | **非續訂**(Non-Consumable / Non-Renewing) |
- 對應台幣牌價:150 / 1490 / 990 / 2990(後端記帳用 `price_twd`;實際扣款以商店在地價為準)。
- ☑ 訂閱群組設好、四個產品狀態「準備提交」、各產品填本地化顯示名+描述、上傳一張訂閱審核截圖(首次提交 IAP 必填)。

### 4.3 App 審核資訊(App Review Information)填這段 Notes(英文)
```
StayJP is a JLPT (N5–N1) Japanese study app. All study CONTENT (vocabulary,
grammar, mock exams) is FREE and fully browsable WITHOUT an account.

StayJP Premium unlocks UNLIMITED use of the practice tools (spaced-repetition
flashcards, shadowing, verb-conjugation drills; free tier is limited to 3/day,
plus full mock exams) and cross-device sync.

To test Premium:
1) Tap a locked tool or "Upgrade" to open the paywall.
2) Sign in with Google (required only to bind the subscription to the account
   for cross-device sync — browsing content does NOT require login).
3) Purchase any plan with a Sandbox Apple ID; the backend verifies the receipt
   via RevenueCat and unlocks immediately.

NOTE: Apple Sandbox renews on an accelerated schedule (monthly ~5 min, yearly
~1 hr), so "renews/expires today" is expected in sandbox. Production uses real
periods.

Products: com.stayjp.app.monthly / .yearly / .yearly_early_bird / .lifetime
Privacy: https://stayjp.study/privacy   Terms: https://stayjp.study/terms
```

### 4.4 ⚠️ 待確認:Demo 帳號(常見退件原因)
App 登入目前是 **Google Sign-In**。審核員若無法用 Google 登入,可能要求 demo 帳號。
- **要做的事**:確認 stayjp.study / app 是否支援 email+密碼登入。
  - 若支援 → 在 App Review Information 提供一組 email/密碼 demo 帳號。
  - 若只有 Google → 提供一組「可登入的 Google 測試帳號」帳密,或在 Notes 強調「內容免登入可瀏覽,登入僅為綁定訂閱」(IAP 仍需登入才買得到,審核員要登入測購買)。
  - 建議:準備一組專用測試 Google 帳號(無 2FA)給審核用。

### 4.5 截圖(App Store 商店頁,必填)
- 需要 iPhone 6.7"(必)、6.5"(建議)尺寸。內容:首頁/工具/paywall/模考。**待產出**。

### 4.6 送審用哪個 build
- 建議送 **build #10**(把今天所有 OTA 改動烤進 binary,版面/金流都是最終態),不要送 #9。#10 跑完進 TestFlight → ASC 選 #10 → 填上面資料 → 提交審核。
- 上架後:App Store 金流穩了再退訂 EAS 付費方案(成本)。

---

## 5. 待辦 TODO

- [ ] **build #10**:`cd stayjp-app && eas build --platform ios --profile production`(把 paywall 間距等 OTA 改動烤進去)。約 1 hr 進 TestFlight。
- [ ] App Store 截圖 → 填 ASC(見 §4)→ 提交審核。
- [ ] 確認 demo 帳號方案(§4.4)。
- [ ] (低優先,有付費用戶要小心)**1MiB 炸彈 / 訂閱拆分**:把 subscription 搬到 `subscriptions/{uid}`,讓訂閱寫入脫離進度 blob 撐爆 doc。基礎設施在 `feat/subscription-decouple`(後端 firestore.ts + rules + 遷移腳本 + 雙讀後備都備好),但**不可直接 merge**(見 §3)。做之前已開 PITR 兜底。動之前先 `scripts/export-subscribers`(或 §6 的 REST 法)抓一份名單當 before/after 對帳。**目前 40k 索引上限已修,1MiB 是遠期風險,不急。**
- [ ] 上架後:web 加 Apple 登入(之前決定延後)。

---

## 6. Firestore 備份(2026-06-23 已開)

- **PITR** 啟用(可還原過去 7 天任一分鐘)。
- **每日自動備份**排程,保留 7 天。
- **刪除保護**啟用。
- 還原:`gcloud firestore databases restore` 或 PITR `--snapshot-time` → 還原成**新 database**(不覆蓋)。Console:Firestore → Backups。
- 本機無 gcloud/ADC 時,可借 firebase CLI 的 owner OAuth token 打 Firestore Admin REST:`~/.config/configstore/firebase-tools.json` 的 `tokens.access_token`(先 `firebase projects:list` 刷新),owner=abc83327@gmail.com。

---

## 7. 重要踩雷紀錄(別重蹈)

- **commit ≠ 部署**:push 到 GitHub 不會上線;functions 要 `firebase deploy --only functions:<name>`。今天就踩過:月費改 150 commit 了但 createPayment 沒重部署 → 線上還收 149。
- **OTA 延遲**:eas update 後裝置要冷啟動兩次才套用;某些裝置會卡舊 bundle → 要保證生效就出新 build。
- **RevenueCat 事件覆蓋**:webhook 要處理 INITIAL_PURCHASE/RENEWAL/PRODUCT_CHANGE/CANCELLATION/EXPIRATION/BILLING_ISSUE/REFUND/CHARGEBACK/**TRANSFER**(換機/換帳號轉移,uid 在 transferred_to)/**NON_RENEWING_PURCHASE**(買斷)。漏接會「付了錢沒功能」。
- **feat 分支落後 main**:見 §3,別亂 merge。
- **原生 auth 持久化**:`getReactNativePersistence` 必須從 `@firebase/auth`(非 `firebase/auth`)import。
- **Google 登入**:必用 iOS 類型 client(uagva7…),非 Web client。
</content>
