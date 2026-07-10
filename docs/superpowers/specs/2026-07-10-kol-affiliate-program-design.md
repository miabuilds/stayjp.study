# KOL 自助分潤制度 — 設計 spec

日期:2026-07-10 · 專案:stay-jp-notes(StayJP / 日本再留計劃)

> 免責:本文的稅務/法律內容是台灣一般常識與把關方向,非法律意見。金額級距、扣繳與二代健保細節請會計師確認後定案。

## 1. 目標與現況

**目標**:把現有「策展型 KOL 推薦碼」升級為**自助分潤制度**——公開招募、KOL 自助拿專屬連結、自助看分潤金額、每月現金結算,並確保「被推薦人真付款且過退費期」才付分潤。

**現況(已存在,重用)**
- `ref_codes/{CODE}`:`{kol, token, active, commission_pct(預設20-30), type:'kol'|'user', owner_uid, created_at}`
- `validateRefCode`(即時驗碼)、`getMyRefCode`(用戶個人碼)、`kolStats`(自助查人數)、`kol.html`(自助頁,僅人數)
- admin.html:建碼+設抽成%、依人數估算抽成、複製 KOL 連結
- 歸因:`auth-header.js` 捕捉 `?ref=CODE`→localStorage→登入寫 `users/{uid}.ref_code`(首次不覆蓋)
- 被推薦人 +7 天:付款 callback 對有 ref_code 者發一次(沿用,作為轉換加成)

## 2. 商業模式(已拍板)

- **抽成**:被推薦人**首筆**真實付款的**利潤 × 20%(預設)**;不抽續訂。利潤 = 售價 − 平台手續費(Apple/Google 15% SBP、綠界 2.75%)。平台費在算分潤前先扣;分潤是 KOL 費用可列支,不重複課你所得稅。少數大咖用 admin 議價開到 30%+。
  - 首筆留給你(iOS 15%):月費 ~NT$102 / 年費早鳥 ~NT$673 / 買斷 ~NT$2,033(20% 時);**續訂全歸你**,分潤只是一次性獲客成本,比買廣告便宜且成交才付。
- **鎖定期 30 天**:付款後 30 天內無退費/退單 → 分潤鎖定可領;期間或之後收到退款/退單 → 該筆 void 並從往後結算扣回(clawback)。
- **付款**:台灣銀行轉帳 + 海外 PayPal;現金;累積已鎖定 ≥ NT$1,000 才結;每月 10 號結上月。
- **議價**:admin 可對單碼覆寫 `commission_pct` 或設 `commission_fixed`(固定 NT$/筆)。
- **防弊**:擋自我推薦(buyer===owner_uid)、僅真付款(非 trial/sandbox)、30 天鎖、退款 clawback。分潤恆 < 付款額 → 自我套利必虧。

## 3. 資料模型

### 3.1 `ref_codes/{CODE}`(擴充)
新增欄位:
- `owner_uid`:KOL 的 Firebase uid(自助申請時綁定;防自我推薦、綁儀表板)
- `commission_pct`(number, 預設 20)/ `commission_fixed`(number, 選填,設了則優先於 pct)
- `payout`:`{ method: 'bank'|'paypal', bank_name?, bank_acct?(末四碼另存全碼於受限欄位), paypal_email?, holder_name?, tax_id?(身分證/統編,金額大時扣繳用) }`
- `agreed_terms_at`(number, 同意合作條款時間)、`terms_version`
- `status`:`'active'|'suspended'`(admin 可停權)

### 3.2 `commissions/{id}`(新,append-only 分潤帳)
每筆被推薦人首筆付款產生一筆:
```
{ code, owner_uid, buyer_uid, plan, txn_id(對應 transactions),
  gross_twd, fee_twd, profit_twd, rate|fixed, amount_twd,   // amount = 該筆分潤
  paid_at(被推薦人付款時間), lock_at(paid_at+30d),
  state: 'pending'|'locked'|'void'|'paid',
  void_reason?, payout_id?(結算後回填) }
```
- 冪等 key:`code + buyer_uid`(每個被推薦人對每個碼只產一筆首筆分潤)。

### 3.3 `payouts/{id}`(新,結算批次)
```
{ code, owner_uid, period(yyyy-mm), amount_twd, commission_ids:[...],
  method, status:'pending'|'paid', paid_at?, admin_note?, created_at }
```

## 4. 分潤生命週期(核心邏輯)

1. **產生 pending**:被推薦人首筆真付款時(ecpay-callback / revenuecat-webhook 內),若其 `ref_code` 對應 `type:'kol'` 碼、且 `owner_uid !== buyer_uid`、且該 (code,buyer) 尚無分潤 → 寫 `commissions` 一筆,`state:'pending'`,算 profit×rate。
2. **鎖定 locked**:排程 cron(每日)把 `state:'pending' && now≥lock_at && 該 txn 未退款` 的改 `locked`。
3. **作廢 void / clawback**:退款/退單事件(綠界 refund.ts / RC REFUND|CHARGEBACK / admin 手動退款)→ 找對應 `commissions`,若 `pending|locked` 直接 void;若 `paid`(已付給 KOL)→ 標 `void` + 記負債,從該 KOL 下次結算扣回。
4. **結算 paid**:每月 admin 觸發結算 → 對每個碼把 `locked` 且金額達門檻的加總、建 `payouts` 批次、把那些 commission 標 `paid` 並回填 `payout_id`。admin 實際匯款後按「標記已付款」。

## 5. 對外頁面

### 5.1 `partner.html`(公開招募頁,可被搜尋)
- Hero:一句話價值主張 + 「立即加入賺分潤」CTA
- 網站簡介(N5–N1、7,710 單字、模考…)、為何好推(免費入門、轉換率、被推薦人多送 7 天)
- **分潤怎麼算**:30% 首筆利潤、具體 NT$ 範例、30 天鎖定、每月結、門檻
- FAQ(退費會扣回嗎、怎麼領錢、稅、能推哪些管道)
- CTA → 登入 → 申請表(同一頁 modal 或 `partner-join`)
- 多語系(沿用 i18n/translate-layer)

### 5.2 申請流程 `partnerApply`(function)
- 需登入(idToken)。輸入:顯示名稱、平台連結、收款方式(bank/paypal + 欄位)、身分資料(選填,金額大再補)。
- 勾選同意《合作條款》(記 `agreed_terms_at`+version)。
- 後端 Admin SDK:產專屬碼(沿用 getMyRefCode 生碼邏輯,但 `type:'kol'`、綁 `owner_uid`、預設 30%)、存 payout、回碼+連結+token。
- 冪等:一個 uid 一個 KOL 碼(已有就回既有)。

### 5.3 自助儀表板(升級 `kol.html` + `kolStats`)
- 進入:碼+token(連結帶),或登入後用 owner_uid。
- 顯示:帶來人數/已付費/試用中(現有)**＋ 待確認 NT$ / 已鎖定可領 NT$ / 已付款 NT$ / 逐筆明細(日期+狀態)**。
- 專屬連結一鍵複製、收款資料可更新。
- `kolStats` 擴充:加總 `commissions` 各狀態金額回傳(用 code+token 授權,不外洩個資)。

### 5.4 `terms-partner.html`(合作條款,加入必勾)
內容見 §7。

## 6. 後台

### 6.1 獨立付款頁 `admin-payouts.html`(owner-only)⭐ 你要的
專門看「要付多少、付給誰」+ 提醒匯款,和主 admin 分開一頁清爽:
- **本期應付清單**:每個達門檻(locked ≥ NT$1,000)的 KOL 一列 —— 名稱、碼、應付 NT$、收款方式(銀行帳號/PayPal)、逐筆 commission 明細可展開。
- **匯款提醒**:每月 10 號後若有「未結算的應付」→ 頁面頂端紅色橫幅「🔔 本月有 N 筆待匯款,共 NT$X」;（可選)接 email/Threads 通知你。
- **一鍵標記已付款**:匯完款按下 → 建 `payouts` 批次、那些 commission 轉 `paid`、KOL 儀表板同步顯示「已付款」。
- **clawback 負債**:某 KOL 已付款後被推薦人退款 → 顯示欠款,下次應付自動扣抵。
- 歷史 payout 紀錄查詢。

### 6.2 主 admin.html 擴充
- 單碼覆寫抽成率/固定額(議價);停權(status=suspended → 停止產生新分潤、擋儀表板)。
- 詐欺檢視:同碼異常(短時間大量、同裝置/IP、退款率高)標紅。

## 7. 法律 / 稅務 / 合作條款(對平台有利)

**台灣重點**
- **薦證廣告(公平交易法)**:代言人須據實、揭露合作/分潤關係;廣告主對代言人不實負連帶責任 → 條款強制揭露+禁不實,違者停權追回。
- **稅**:佣金屬個人所得;達給付門檻須扣繳並開扣繳憑單;單筆 ≥ NT$20,000 涉二代健保補充保費 → 制度收身分資料、金額大時代扣。(細節會計師確認)

**《KOL 合作條款》必含**
1. 分潤僅限「確認真付款且過 30 天鎖定期」之首筆;退費/退單一律追回(含已付款者從後續扣回)。
2. 禁止:自我推薦、假交易/灌單、垃圾訊息、冒用品牌、競標品牌關鍵字、誤導不實宣稱。
3. 須揭露合作關係、據實推薦(違反公平法責任歸 KOL)。
4. 平台得隨時停權、暫停或沒收有詐欺疑慮之分潤,並單方修改/終止制度(先公告)。
5. 稅由 KOL 自負;達門檻配合提供身分資料供扣繳/開憑單。
6. 分潤為合作報酬,非薪資,雙方無雇傭關係;準據法中華民國,管轄法院為台灣。

## 8. 防弊與正確性

**已實作(2026-07-10,程式碼層)**
- `partnerJoin`:壞/過期 token → 401(非 500);匿名/拋棄式帳號 → 403(擋批量刷碼);已停權(suspended)不還碼;抽成率後端寫死 20%(前端不能自訂,防灌高);碼綁 owner_uid、一人一碼冪等。
- `validateRefCode`:任何 owner_uid 碼(user + kol)填自己的 → 回 `self` 讓前端擋(擋自我推薦刷分潤/刷 7 天);suspended/inactive 碼一律無效不歸因。
- 前端自我歸因阻斷:account/pricing 套碼時擋 `pending === my_ref_code|kol_code`。

**P1 分潤引擎必守(產分潤那一刻的硬閘門,尚未實作)**
- 擋自我推薦(owner_uid===buyer_uid 不產分潤)。
- 僅真付款:排除 `is_sandbox`、`period_type==='TRIAL'`、amount≤0。
- 30 天鎖 + 退款 clawback(綠界/Apple/Google/手動退款全接)。
- 冪等:(code,buyer_uid) 唯一;付款 callback 重送不重複產生。
- 金額恆 < 付款額 → 無自我套利誘因。
- 不影響既有:分潤邏輯包在 callback 既有流程「之後」best-effort,失敗不影響開通/記帳。

## 9. Rollout(分階段,每階段可獨立驗證)

- **P1 資料+分潤引擎**:`commissions`/`payouts` schema、付款 callback 產 pending、每日 cron 鎖定、退款 clawback、admin 唯讀看分潤。(不對外,先驗數字對)
- **P2 自助前台**:`partner.html` 招募頁 + `partnerApply` 自助發碼 + `terms-partner.html` + 儀表板金額(kol.html/kolStats 升級)。
- **P3 結算付款**:admin 結算面板 + payout 批次 + 標記已付款 + 儀表板顯示已付。
- **P4(選)**:詐欺告警強化、扣繳報表匯出。

## 10. 已決定 / 待你之後確認

已定:抽成 20% 首筆利潤(議價可到 30%+)、鎖定 30 天、銀行+PayPal、門檻 NT$1,000、每月 10 號、被推薦人 +7、admin 可議價、獨立付款頁+匯款提醒。
之後可再定(不擋開工):扣繳門檻與代扣實作、招募頁文案語氣、是否開放「折免費訂閱」替代現金。
