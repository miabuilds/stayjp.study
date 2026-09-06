# 2026-09 調價日 Runbook

## 🔴 最終定案(2026-09-06)＋ 9/14(一)執行清單 —— 以本節為準,下方舊章節僅供背景

**新價(9/14 起,三平台牌價統一)**:月費 290→**390**、年費 1,490→**1,990**、買斷 2,990→**4,990**。
**推薦碼折價(官網/綠界限定)**:帳上有有效推薦碼 → 年費建單 **1,790**(現折 200,定期定額終身鎖 1,790)。
所有既有 KOL 碼/個人碼自動獲得折價功能;無主官方碼可用。**iOS 走 ASC Offer Codes 同步折(見步驟 8;9/6 改決策:訂閱主力在 App)**;Play 上架後再議。
月費碼好康維持 +7 天、買斷維持 AI 加量;**年費改折價後不再 +30 天**(callback 已改,防雙重發放)。
舊訂戶全部凍漲(綠界舊單不動、ASC 選保留、Play 不動)。

**Code 已備好**:分支 **`price-day-0914`**(a3613ef0,含完整 commit message 說明)。已驗:tsc/ui-map/本機截圖(無碼 1,990、套碼刪除線 1,790)/consent+expected_twd 折後價。

### 9/14 當天(依序)
```bash
# 0. 確認其他 session 沒動 pricing/index/account/tool-quota/ui-map/functions,有衝突先解
cd ~/Documents/GitHub/stay-jp-notes && git merge price-day-0914
#    衝突大概率在 pricing.html/index.html(其他 session 常改) → 以分支的價格區塊為準
# 1. bump sw.js VERSION(+1,先 grep 現值,多 session 會撞)
# 2. cd functions && npm run build   (functions/lib 是 committed build output)
# 3. git push → curl -s https://stayjp.study/pricing.html | grep -c 'twd: 1990'  應 >0
# 4. firebase deploy --only functions:createPayment,functions:ecpayCallback,functions:trialEmailCron
# 5. ASC(手動):monthly 排 390、yearly 排 1,990——兩個都必選「為現有訂閱者保留價格」;
#    lifetime(非消耗型)直接改 4,990。價格點以 ASC 選單有的為準(X90 系列應該都有)。
# 6. Play:封測中維持不動;Android 上架日翻 ANDROID_LIVE 前先把三價改到位(390/1,990/4,990)
# 7. 官方折扣碼:Firestore console 建 ref_codes/STAYJP200
#    { active: true, type: "official", kol: "StayJP 官方" }  ← 不填 owner_uid=不產生分潤(已驗 commission 邏輯)
# 8. iOS Offer Codes(2026-09-06 決策:App 也要折——訂閱主力在 App,轉換 41% 優先於手續費差):
#    ASC → 年費訂閱(Yearly)→ 建優惠(Offer):類型 pay up front、時長 1 年、價格 NT$1,790(價格點以選單為準)
#    → 資格:新訂閱者(+可勾已到期);再建「自訂代碼」:STAYJP200 + 每個 KOL 一個(與 ref_codes 同字串!)
#    → 分潤歸因靠 RC webhook 讀 event.offer_code(分支已含 db6fece1),碼字串必須存在於 ref_codes 才歸因得到
#    → KOL 拿到的兌換連結:https://apps.apple.com/redeem?ctx=offercodes&id=6778227353&code=<碼>
#    → 注意:iOS 兌換=首年 1,790、次年續 1,990(Apple 限制);官網輸碼=年年 1,790。文案統一講「現折 200」,別在 iOS 承諾年年鎖
```
**未來快閃優惠(Mia 2026-09-06 想法,機制已就緒)**:官網限定限時優惠=建一個限期 ref_codes 碼(active:true)、
檔期結束改 active:false 即失效;現折金額目前固定在 constants.WEB_CODE_DISCOUNT_TWD(yearly:200),
想要不同折扣額的快閃(如折 300)→ 之後把折扣搬到 ref_codes 文件的 discount_twd 欄位(小改 createPayment),先記著。
### 驗收(9/14 部署後)
1. 無痕:pricing 三卡新價;輸 STAYJP200 → 年費卡出現刪除線 1,990→1,790
2. 訂年費(套碼)→ 消保視窗「NT$1,790(已套用推薦碼,原價 NT$1,990)」→ 綠界結帳頁金額 **1,790** → 到輸卡頁退出
3. 無碼帳號訂年費 → 消保 1,990、綠界 1,990
4. admin 抽 2-3 個舊訂戶:訂閱/金額不變;隔天 transactions 抽查新單=新價、續扣=舊價
5. App paywall = 商店新價(iOS 截圖)
### 公告排程(文案另出)
9/8(二)晚 首發(信件+Threads/IG+站內) → 9/11(五)「最後一個週末」 → 9/13(日)晚 最後 24 小時 → 9/14 上午部署。
主話術:「9/14 起調漲。9/13 前訂年費 1,490 終身鎖價;9/14 後有推薦碼一樣現折 200。」
廣告圖帶官方碼 STAYJP200。⚠️ App 內文案不得提官網價/碼折(Apple 3.1.1),只說「即將調漲」。

---

> 決策（2026-08-23 拍板，**2026-08-31 更新**）：**舊用戶全部凍漲，只有新購走新價**。
> 新價：月訂 150→**290（Apple 價格點無 299 → 取 290 三平台一致；2026-08-31 已執行完畢：網頁 live、iOS 排 9/1 生效並保留舊訂戶、Play 待上架日）**、
> 年費 1,490→**官網 1,790 / App Store・Play 1,990**（官網便宜 200＝把 Apple 抽成差還給用戶，
> Apple 政策 OK——但 **app 內任何地方不得出現官網價/導購文字**，含 WebView）、
> 買斷 2,990→**4,990（三平台一致）**。早鳥 990 已於 8/27 12:00 JST 收官。
> 生效日：**9/7（一）**，倒數文案已上前端（要改日期 grep「9/7」：pricing/index/account/tool-quota/ui-map/trial-email-cron）。

## 🟡 2026-08-31 狀態（月費提前調漲批次，code 已完成待部署）

本批內容（working tree，未 commit）：
- **月費 150→299**：`constants.ts` PLANS＋pricing 卡片/PLAN_TERMS/meta＋index 卡片/JSON-LD＋app repo fallback（`stayjp-app/src/lib/subscription.ts`）
- **createPayment 加 expected_twd 護欄**：前端送「頁面顯示金額」，後端與現行牌價不符回 409 擋單
  （防 SW 舊快取「畫面舊價、實扣新價」）。⚠️ **部署順序因此改成：先 push Pages、curl 確認上線、再 deploy functions**
  （舊 runbook 寫先後端——那是護欄加上前的順序，已失效。反過來會把所有購買擋死）
- **早鳥殘留清理**：index 早鳥卡→年費調漲卡、account 早鳥名額卡→調價預告卡、PayPal 早鳥按鈕/手動連結移除
  （收官後留著=海外用戶會付錢買不到東西）
- ~~PayPal 年費~~ → **PayPal 已於 8/31 全面下架**（Mia 決定：使用量極低，海外導 App 內購買）。前端入口全移除（ppManual/ppAuto/SDK/goPayPal），後端 functions 保留供既有買家退費/對帳；9/7 不用動任何 PayPal 的東西
- **年費 9/7 調漲倒數文案**：pricing/index/account/tool-quota 試用橫幅/trial-email，ui-map EN 全數同步
- 已驗收：tsc/build ✓、ui-map 語法 ✓、pricing/index 本機截圖 ✓、PLAN_TERMS eval=299/1490 ✓、退費用實付基準 ✓

**部署（就緒，照順序）：**
```bash
# 1. 前端(含 sw bump;多 session 並發,commit 前先 head -1 sw.js 確認版本沒撞)
git add -A && git commit && git push
# 2. curl 確認 Pages 上線(卡住可 API 重觸發)
curl -s https://stayjp.study/pricing.html | grep -c 'NT\$</span>299'   # 應 >0
# 3. functions(建單金額 299 + expected_twd 護欄 + 試用信文案)
cd functions && npm run build && firebase deploy --only functions:createPayment,functions:paypalCreateOrder,functions:paypalCaptureOrder,functions:trialEmailCron
# 4. 商店端手動:ASC monthly 改 NT$299(選「為現有訂閱者保留價格」,不用送審)
#    Play 先不動(Mia 8/31 決定:Android 封測中、入口全關、沒人買得到,留 150 無漏)
#    ⚠️ 但 Android 上架日翻 ANDROID_LIVE=true「之前」必先把 Play monthly base plan 改 299,
#      否則首波 Android 用戶會鎖 150 永久續扣(順便把 yearly/lifetime 也一起改到位:1,990/4,990)
# 5. 驗收:無痕開 pricing → 訂月費 → 消保視窗 299 → 綠界結帳頁金額 299(到輸卡頁退出);
#    admin 抽舊月訂戶訂閱不變
```
⚠️ 8/23 前置批的 `auth-header.js` 修復**至今未部署**（線上 grep ahx_prem_=0），會跟這批一起上。
⚠️ 並發注意：其他 session 的 commit 已經掃走過本批的 index.html（10:52 back-to-top commit）——
調價檔案（pricing/index/account/tool-quota/ui-map/functions）部署前別讓其他 session 動。

---

## 已完成的前置（2026-08-23，調價前就該上線）

這批改動與價格無關、可先部署，全部「預設不生效／修 bug」：

| 檔案 | 內容 |
|---|---|
| `auth-header.js` | 🔥 修線上 bug：`isPremium()` 未定義 → 非白名單登入用戶 header 整個不渲染＋App 內 RC_LOGIN 被擋（8/19 CRO 批次引入）。改為 localStorage 快取＋async 讀訂閱 |
| `tool-quota.js` | ① 總次數包新制（`config/quota` 遠端開關，**預設關閉＝行為不變**）② 8/27 收官後試用到期橫幅自動換文案（不再賣買不到的 990） |
| `firestore.rules` | 新增 `config/quota` 公開唯讀規則（要 `firebase deploy --only firestore:rules`） |
| `functions/src/refund.ts` + `utils/firestore.ts` | 退費基準改「最近一筆實付」而非現行牌價。**不改的話漲價後：舊用戶比例退會多退 ~247 元/筆、7 天全退會超過原刷卡額被綠界打回、用戶卡死** |
| `functions/src/revenuecat-webhook.ts` | 台幣 IAP 入帳＋KOL 分潤改記實付（凍漲舊訂戶續訂不再被記成新牌價 → 防營收灌水＋佣金多付） |
| `functions/src/paypal-refund.ts` | 帳本沖銷改沖原購買入帳金額（不用現行牌價） |
| `functions/src/paypal-capture-order.ts` | 實收 USD 與價目不符（在途改價單）→ 照常開通但 note＋log 標記 |
| `functions/src/trial-email-cron.ts` | 收官後（closed 旗標或過 8/27）不再寄早鳥 990 文案 |
| `account.html` | AI 對話上限顯示 5→3（對齊後端）＋總次數包世代的額度顯示 |
| `ui-map.js` | 新文案兩句補 EN 對照 |
| `sw.js` | v325 |

部署指令（前置批）：
```bash
cd functions && npm run build && firebase deploy --only functions:refund,functions:paypalRefund,functions:paypalCaptureOrder,functions:revenuecatWebhook,functions:trialEmailCron
firebase deploy --only firestore:rules
git add -A && git commit && git push   # 前端(GitHub Pages)
```
部署後驗收：`curl -s https://stayjp.study/auth-header.js | grep -c 'ahx_prem_'` 應 >0；用非白名單帳號登入 index.html 確認 header 選單＋升級鈕有出現（截圖）。

---

## D-Day 清單（調價當天，依序）

### 1. 商店改價（不用送審、當天生效）
- **App Store Connect**：4 個 IAP 改價。訂閱（monthly/yearly）改價時**必選「為現有訂閱者保留價格」**；lifetime（非消耗型）直接改。可提前排程生效日。價格點：NT$299 / NT$1,990 / NT$4,990 都是標準價格點。
- **Play Console**：monthly/yearly base plan 改價（**預設只影響新購**，不要按「套用到現有訂閱者」）；lifetime 一次性商品直接改。
- App 端**不用發版**：Paywall 顯示商店回傳 `priceString`，自動跟。fallback 常數（`stayjp-app/src/lib/subscription.ts:37,43,56`）下一版 app 順手更新即可。

### 2. 後端改價（`functions/src/utils/constants.ts`）——注意:綠界/PayPal 走「官網價」
```
monthly  299(8/31 已改,不動)
yearly   price_twd: 1490 → 1790   ← 官網價(商店 1,990 在 ASC/Play 各自設,互不相干)
lifetime price_twd: 2990 → 4990
PAYPAL_PRICES_USD: 不用動——PayPal 已下架,前端無入口(表只剩退費對帳用)
```
⚠️ **部署順序（2026-08-31 起,因 expected_twd 護欄,與舊版相反）：先 push 前端 Pages、
curl 確認上線、再 deploy functions。** 中間短暫「顯示新價、實扣舊價」（少收無害）；
順序反了=舊前端沒帶 expected_twd,所有購買被 409 擋死。
```bash
git push && curl 驗 → cd functions && npm run build && firebase deploy --only functions
```
⚠️ 定期定額舊單完全不碰＝自動凍漲。綠界後台**什麼都不用做**。
⚠️ 消保視窗/expected_twd 都吃 `pricing.html` 的 `PLAN_TERMS`——年費那行 price 與 twd 要一起改 1790。

### 3. 前端顯示改價（同一個 commit 全改完）
**邏輯（漏改會壞功能）：**
- `pricing.html:616-621` `PLAN_TERMS` — 消保法同意視窗的價格字串，**法律文件等級，必改**

**顯示（漏改=標錯價）：**
- `pricing.html:8,10,25`（meta/og）、`217-222`（早鳥卡——收官後這張卡的去留順便處理）、`231-234`（年費 1,490→1,990、月均）、`247`（月費）、`261-262`（買斷、"等於 2 年年費"倍率變了要重算文案）、`315-316,331,336`（PayPal 手動路徑金額）
- `index.html:49-51`（**JSON-LD**，Google rich results）、`840-864`（首頁價格卡整區）
- `account.html:228-234`（早鳥/標準年費區塊）、`872`（退費警語「年費 NT$1,490」）
- `terms-partner.html:52,55`（分潤範例用 990 算的，重算）
- `functions/src/trial-email-cron.ts:27-28`（信件裡 1,490 文案）
- **`ui-map.js`**：以上每一句改動的中文字串都是 EN 翻譯的 key，**改中文必同步改 ui-map，否則英文版靜默壞掉**。改完跑：`node -e "new Function(require('fs').readFileSync('ui-map.js','utf8'))"` 驗語法
- `sw.js` CACHE_NAME +1
- 內部工具順手：`admin.html:1156`、`admin-dash.html:175`（PLAN_NAME 標籤不含價格,可不動）；`PRICING-NEXT.md` 若過時註記

### 4. 免費制切換（總次數包，新註冊適用）
Firestore console 建立文件 `config/quota`：
```json
{ "packStartMs": <調價日 00:00 JST 的 ms epoch>, "packTotal": 30, "packAnon": true }
```
- `packStartMs` 之前註冊的所有帳號**永遠走原每日制**，零影響（已測：scenario C）
- 之後註冊＋未登入訪客 → 總共 30 次體驗包（`packAnon:false` 可讓訪客維持每日制）
- 前端有 10 分鐘快取，翻完 flag 最多 10 分鐘＋重整後生效
- 測試：admin 帳號 console 跑 `ToolQuota._pack()` 看 regime；`ToolQuota._resetPack()` 清快取重抓

### 5. 驗收（照 verify-lessons：截圖＋curl 線上）
1. `curl -s https://stayjp.study/pricing.html | grep -o '1,990' | head` 確認 Pages 部署完成（會卡就 API 重觸發）
2. 無痕視窗：pricing 頁四張卡新價截圖；按訂閱 → 消保同意視窗金額＝新價；綠界結帳頁**金額＝新價**（到輸卡號頁即可退出）
3. 舊用戶抽查：admin 後台看任一早鳥/舊年費戶的訂閱不變；綠界後台抽一筆定期定額訂單金額仍是舊價
4. App：Paywall 卡片價格＝商店新價（iOS/Android 各截一張）
5. 新註冊測試帳號：badge 顯示「免費體驗次數 剩 30/30」；舊測試帳號仍顯示每日制
6. `transactions` 隔天抽查：新單 amount_twd＝新價、舊訂戶續扣＝舊價

### 6. 公告（倒數文案 8/31 已上前端;正式公告發社群/信件）
「9/7 起新價格（月 299／年費官網 1,790・App 內 1,990／買斷 4,990），**現有訂閱者永久維持原價**。9/7 前訂閱年費一律鎖 1,490。」→ 信件＋社群。
⚠️ **App 內推播/paywall/WebView 文案絕不能提官網價或「官網比較便宜」**（Apple 3.1.1 紅線）——app 內只說「即將調漲」。官網價差只在 app 外行銷管道講。

---

## 已知的既有限制（不擋調價，記著就好）
- 舊用戶扣款失敗/卡過期斷訂後回來重訂＝走新價 → 想給舊價用兌換碼或 admin 手動（redeem-code 現成）
- 非台幣 IAP 的 `amount_twd` 仍是牌價估計（真數字要 ASC 財報＋vendor number，對帳 memo 已記）
- `ecpay-callback.ts:65` 信任綠界回報金額不對牌價驗證——**這是刻意的**（凍漲舊單靠它記實付），別「順手修」它
