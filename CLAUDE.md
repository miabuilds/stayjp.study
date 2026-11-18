# StayJP 網站（stayjp.study）

給 Claude Code（含雲端工作階段）看的專案規則。這個檔案會進 git，**不要寫任何機密**。

## 資安與個資（最優先）
- 不准把任何金鑰、token、密碼、帳號 ID、內部信箱、個人姓名、用戶資料寫進程式、註解、文件或 commit 訊息。需要的值一律讀環境變數或既有設定，缺了就停下來說。
- 對外署名一律用「Mia」。
- 不要新增 .env、.p8、.p12、credentials*.json、service account 檔到 git。
- 雲端工作階段沒有部署權限：不要嘗試 wrangler / firebase deploy / eas build / eas update / 商店 API。改好就 commit、push 到分支或開 PR，在 PR 說明寫「需要在 Mac 上跑的步驟」，部署由 Mia 處理。
- 碰到錢（金流、訂閱、價格、分潤）或權限的邏輯：client 端永遠不准寫付費/權限欄位，只能由後端寫；驗簽 secret 缺失一律拒絕（fail-closed），不准 fallback 到測試金鑰；後台顯示任何用戶可寫入的字串都要 escape。

## 介面規則（Mia 講過很多次的）
- **禁用原生 `alert` / `confirm` / `prompt`**，一律用站內自訂視窗。交件前 grep 這三個字要是 0。
- **不用彩色 emoji**，用 `icons.js` 線條圖示：`<i data-ic=name></i>`（不加引號）。名字要確定在 icons.js 的 PATHS 裡，打錯會靜默變空白。
  - 不能放圖示的地方：regex/判斷邏輯、`textContent`、`alert`、canvas `fillText`、CSS `content:`、`esc()` 包住的欄位、翻譯字串。這些地方用 ✓ ★ ▶ 這類文字符號。
- **間距不要黏在一起**：同層區塊間距 ≥ 12px、卡片 padding ≥ 13px、清單列用 `border-bottom` 分隔；捲動容器和固定標題之間要有分隔線；深色模式顏色用 CSS 變數，不寫死。
- **做題流程**：點選項只是選取 → 按「送出」才判對錯 → 顯示詳解（含「你選的為什麼錯」）→ 使用者自己按「下一題」。不准 setTimeout 自動跳題；答錯要進錯題紀錄。四選一的錯誤選項不能跟正解同音或同義。

## 程式慣例
- 頂層 `const X = (()=>{...})()` 的模組**不會**掛到 window。其他地方用 `window.X` 判斷的話會靜默失效 → 模組檔尾一律補 `if (typeof window !== "undefined") window.X = X;`。
- 改了任何本站 `.js`，要把引用它的 HTML 裡的 `?v=` 版本號 +1（JS 有長快取，不改使用者拿不到新版）。
- 有 `functions/_middleware.js` 的話 `_routes.json` 不准刪，否則每個靜態檔都會算 Functions 請求、爆全帳號額度。
- 用到 AI 功能（送資料給 Anthropic / Google 等）前要先 `await AIConsent.ensure()`（有 ai-consent.js 的站），隱私權政策要列出第三方。
- iOS App 內（`html.ios-app`）不准出現「兌換碼」「輸入碼送天數」這類 UI（Apple 3.1.1 會退件），網頁和 Android 可以留。
- 以程式碼和線上現況為準，`*_STATUS.md` 這類筆記可能過期。

## 驗收
- 改 UI 要用瀏覽器實際開頁截圖看，不能只讀 DOM 值（display:none 的元素也讀得到值）。
- 說「修好了」之前要確認實際行為，不要空口說。

## 這個專案特有的
- ⚠️ **這個 repo 是公開的**，所有內容任何人都看得到，也會被 GitHub Pages 發佈。商業數字、用戶資料、內部流程都不要寫進來。
- `app.html` 含 NUL byte，grep 要加 `-a`，或用 python 讀寫，不然會誤判「沒有這段」。
- 吉祥物在網頁上叫「狸太郎」。圖片 tanuki-stand、tanuki-think、tanuki-p01 上的日文是錯的，不准用。
- 七語架構：改了任何繁中硬編字串或新增頁面，要重跑 `node scripts/gen-l10n.mjs ui` 和 `build`（需要 API key，雲端跑不了 → 寫進 PR 說明）。
- 改 vocab / grammar / listening / reading / confusables 後，線上不會自動更新，要重發內容包（publish-content-sharded + export-content-static-rest，需 Mac）。
- 新增文章必須同批產生語音（VOICEVOX，需 Mac）和 CC0 封面圖；讀音要用 kuromoji 核對。
- Service Worker 目前是停用的，bump sw.js VERSION 沒有效果。

## 部署（只在 Mac 做，雲端不要跑）
- push 到 main 就會由 GitHub Pages 自動發佈。**push main = 上線**，雲端請開分支 / PR，不要直接推 main。

