# 同步 GA4 → Firestore learners 計數 — 安裝步驟

GitHub Actions cron 每天跑一次：抓 GA4 累計 newUsers → 覆寫 Firestore `stats/global.learners`。

## 1. 啟用 GA4 Data API

1. 開 [Google Cloud Console](https://console.cloud.google.com/)，左上選 project **jpnote-1bdd6**（Firebase 同 project）
2. 「APIs & Services → Library」搜 **Google Analytics Data API**，按 Enable

## 2. 建 service account

1. 「IAM & Admin → Service Accounts → Create service account」
   - Name：`learners-sync`
   - Grant role：**Cloud Datastore User**（給 Firestore 寫權）
2. 完成後點進去 → Keys → Add key → Create new key → JSON → 下載
3. 把整個 JSON 內容（含 `{...}`）複製起來

## 3. 在 GA4 授權 service account

1. 打開 [Google Analytics](https://analytics.google.com/) → Admin（左下齒輪）
2. Property → Property access management → +
3. 新增剛剛 service account 的 email（`learners-sync@jpnote-1bdd6.iam.gserviceaccount.com`）
4. Role：**Viewer**

## 4. 找 GA4 Property ID

GA4 Admin → Property details → 上面有個 9 位數 Property ID（純數字、不是 `G-XXXXX` 那個）

## 5. 設 GitHub Secrets

repo `miabuilds/stayjp.study` → Settings → Secrets and variables → Actions → New repository secret：

| Name | Value |
|---|---|
| `GCP_SA_KEY` | 步驟 2 下載的 JSON 整段內容 |
| `GA4_PROPERTY_ID` | 步驟 4 的純數字 ID |

## 6. 手動觸發測一次

GitHub repo → Actions → 「Sync learners from GA4」→ Run workflow

跑完看 log 應該有：
```
GA newUsers (2025-01-01~today): 14XXX
Firestore stats/global.learners: XXX → 14XXX
```

之後 Firebase Console 看 `stats/global` 文檔 `learners` 欄就會是 GA 數字，再加 `lastSyncedAt` 時間戳。

## 維運提示

- cron 每天 UTC 03:00 跑（台灣 11:00 AM）
- 客戶端的 `+1 increment` 機制保留，cron 之間訪客 +1 即時感保留，下次 cron 來覆寫
- 起算日預設 2025-01-01，要改去 workflow 加 env `GA_START_DATE`
- service account JSON 旋轉：去 Cloud Console SA 頁面 → Keys 刪舊建新 → 更新 GitHub secret
