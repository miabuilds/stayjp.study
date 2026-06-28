# StayJP 數據分析指南(Apple / GA4 / 後台)

> App 是 stayjp.study 的 WebView 包裝,所以「App 使用者」也會載入網站。
> 數據分三層看,各司其職,設定對了就不會混。

---

## 三層數據,各看各的

| 想知道什麼 | 去哪看 | 會不會跟別的混? |
|---|---|---|
| App 曝光 / 點擊 / **下載量** / 留存 / 收入 | **App Store Connect → 分析(Analytics)** | 純 Apple 商店數據,**永遠不混** |
| 使用行為(瀏覽頁面、按鈕事件、停留) | **GA4**(`G-2WP4D34LE3`) | App 也載入網站 → 預設會混;**用 `app_platform` 維度分開**(見下) |
| **付費客戶**(誰訂閱、試用/付費、方案、到期) | **網站後台 → 訂閱者 tab** | 已用 `source` 分 🍎Apple / 🌐網頁 |

---

## 一、Apple 下載/曝光 — App Store Connect

1. 登入 [App Store Connect](https://appstoreconnect.apple.com) → 你的 App「日本再留計劃」。
2. 上方分頁點「**分析(Analytics）**」(不是 App Store 那頁)。
3. 可看:
   - **印象次數(Impressions)**:多少人在 App Store 看到你
   - **產品頁面瀏覽(Product Page Views)**
   - **下載量 / 首次下載(Downloads / First-Time Downloads)**
   - **銷售與趨勢(Sales / Proceeds)**:實際收入
   - **留存(Retention)**:下載後第 1/7/28 天還在用的比例

> 這是 Apple 自己的商店端數據,**和網頁 GA4 完全獨立、不會混**。新 App 約上架後幾天才開始累積。

---

## 二、GA4 分開「App vs 網頁」(★ 你要手動設定的部分)

網站已經會送出一個使用者屬性 `app_platform`(值 = `app` 或 `web`,由原生注入的 `STAYJP_NATIVE` 判斷,程式在 `index.html` 頂部 gtag 設定)。
但 GA4 報表要先把它**註冊成自訂維度**才用得到。

### 設定步驟(做一次)

1. 進 [Google Analytics](https://analytics.google.com) → 選到資源「日本再留計劃 / `G-2WP4D34LE3`」。
2. 左下角 **⚙️ 管理(Admin)**。
3. 「資源(Property)」欄 → **資料顯示(Data display)** → **自訂定義(Custom definitions)**。
4. 點 **建立自訂維度(Create custom dimension)**,填:
   - **維度名稱**:`app_platform`(或「平台」隨你)
   - **範圍(Scope)**:**使用者(User)**　←重要,別選事件
   - **說明**:`app=App 內 WebView,web=純網頁`
   - **使用者屬性(User property)**:`app_platform`　←**必須完全等於這個字串**(程式送的就是它)
5. 儲存。

### 設定後怎麼用

- **不是回溯的**:只會統計「設定之後」進來的資料,過去的不算 → 越早設越好。
- 約 **24–48 小時**開始有資料。
- 用法:任何報表 → 加「**次要維度**」選 `app_platform`;或開「**探索(Explore)**」把 `app_platform` 當細分/篩選 → 一鍵「只看 App / 只看網頁」。

### 想立刻確認有沒有送出?

- GA4 → 管理 → **DebugView**(或左側「即時 Realtime」),用手機/App 開一下站,看使用者屬性裡有沒有 `app_platform`。

---

## 三、付費客戶 — 網站後台(訂閱者 tab)

後台(admin email 登入)→ 訂閱者 tab,頂部彙總是一條漏斗:

```
🎁 試用中 X →(付費佔比 Y%)→ ✓ 已付費 Z   取消續扣 ・ 退費 ・ 過期   🍎 Apple N(試用/付費)・ 🌐 網頁 M
```

- **試用中 vs 已付費**:`status=trialing`(免費 7 天)對 `status=active`(真的在扣款)。
- **來源**:`source=app`(iOS IAP)對 `source=web`(綠界)。
- **排序**:點欄位標題(Email/方案/狀態/到期/來源),▲▼ 切升降冪。
- **分頁**:超過 50 筆自動上/下頁。
- ⚠️「付費佔比」是**當下快照**(目前試用 vs 目前付費),不是嚴格的世代轉化率;要追「同一批人從試用→轉正」得看時間累積的 transactions 帳本。

### 記帳原則(後端)
- 免費試用(`period_type=TRIAL`)→ 交易 `amount_twd=0`,**不計營收**;試用轉正的 RENEWAL 才記真實收款。
- 沙盒測試購買(`is_sandbox`)、退款、pending 棄單都已排除在營收外。

---

## 速查
- GA4 資源 ID:`G-2WP4D34LE3`
- 自訂維度名:`app_platform`(範圍=使用者,值 `app`/`web`)
- 程式位置:`index.html` 頂部 `gtag('set','user_properties',{app_platform:…})`
- Apple 數據:App Store Connect → 分析
- 付費數據:網站後台 → 訂閱者 tab
