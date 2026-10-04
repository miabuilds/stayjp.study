# KOL 連結點擊 + App 註冊 IP 自動歸因(分支 `ref-click`)

## 部署(⚠️ 先 functions + rules、再 Pages)

先上後端:前端 beacon / claimRefByIp 打的端點要先存在(反過來也不會壞,只是那段時間的點擊白丟、前端 404 被吞掉)。
App 不用重 build:App 是 app.html 的 WebView,Pages 上線就生效。

```bash
cd ~/Documents/GitHub/stay-jp-notes
git merge ref-click                                   # 在 main 上
(cd functions && npx tsc) && node scripts/test-ref-attrib.cjs && node scripts/test-sale-price.cjs && node scripts/test-product-plan.cjs

# 1. functions + rules(新增三支 + kolStats 多回 clicks 欄位)
firebase deploy --project jpnote-1bdd6 --only functions:refClick,functions:claimRefByIp,functions:refClickCleanup,functions:kolStats,firestore:rules

# 2. 驗後端(都要在 Pages 之前過)
curl -s -o /dev/null -w "%{http_code}\n" -X POST -H "Content-Type: text/plain" \
  --data '{"code":"NO_SUCH_CODE","plat":"other"}' https://asia-east1-jpnote-1bdd6.cloudfunctions.net/refClick      # 204
curl -s -i -X OPTIONS -H "Origin: https://stayjp.study" -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: authorization,content-type" \
  https://asia-east1-jpnote-1bdd6.cloudfunctions.net/claimRefByIp | grep -i "access-control-allow-origin"            # https://stayjp.study
curl -s -X POST https://asia-east1-jpnote-1bdd6.cloudfunctions.net/claimRefByIp                                    # {"ok":false,"reason":"missing_auth"}
curl -s "https://asia-east1-jpnote-1bdd6.cloudfunctions.net/kolStats?code=<KOL碼>&t=<token>" | grep -o '"clicks[^,]*'   # 有 clicks / clicks_7d / clicks_30d

# 3. Pages
git push
curl -s https://stayjp.study/auth-header.js | grep -c refClick     # 1(Pages 會快取幾分鐘,沒出來就等/重觸發)
curl -s https://stayjp.study/app.html | grep -ac claimRefByIp      # >0
curl -s https://stayjp.study/kol.html | grep -c "點擊次數"          # >0
```

**上線後實測**:手機無痕開 `https://stayjp.study/?ref=<KOL碼>` → Firebase Console 看 `ref_codes/<碼>.clicks` +1、
`clicks_by_day.<YYYYMMDD>` +1、`ref_clicks` 多一筆(只有 ipHash,沒有 IP)。同一支手機 30 分鐘內再點 → 不再加。
同網路下用 App 開新帳號 → `users/{uid}` 出現 `ref_code` + `ref_source: "ip_match"`;Functions log 有 `[claimRefByIp] ... → <碼>`。

`config/ref_salt` 第一次點擊時自動產生(crypto.randomBytes),**不要刪**:刪了舊的 ipHash 全部對不上(48 小時內的配對失效,之後自動恢復)。

## 怎麼運作

| 元件 | 做什麼 |
|---|---|
| `auth-header.js` / `app.html` | 網址有 `?ref=` → 每分頁 session 每碼一次 `sendBeacon` 到 `refClick`(text/plain,無預檢),不擋渲染、錯誤全吞 |
| `refClick` | 驗碼(存在、未停用、未停權)→ `ipHash = sha256(salt + ip)` → 同 ipHash 同碼 30 分鐘內只算一次 → 寫 `ref_clicks` + `ref_codes/{碼}.clicks` / `clicks_by_day.{台灣日期}`。活動碼照算點擊,但標 `campaign:true` |
| `app.html` `claimRefByIp()` | 登入後本機沒有 `stayjp_ref`、帳號 6 小時內新建、帳上沒碼 → 打一次(每裝置 × uid 一次,localStorage 旗標)。完全無 UI |
| `claimRefByIp` | 同 ipHash 的點擊,時間落在 now−2h 且開帳號 ±2h;排除活動碼/停用/停權/過期/自己的碼;兩邊平台都明確(ios/android)且不同 → 排除。**剛好一個碼**才寫 `users.ref_code`(transaction 再確認沒碼),0 或 ≥2 都不動 |
| `refClickCleanup` | 每天 04:30(台灣)刪 48 小時前的 `ref_clicks` |
| `kolStats` / `kol.html` / `admin-kol.html` | 顯示點擊總數、近 7 / 30 天 |

決策都在 `functions/src/utils/ref-attrib.ts`(純函式),`scripts/test-ref-attrib.cjs` 有測。

**下游不用改**:IP 配對寫的是同一個 `users.ref_code`。createPayment 折價、`recordKolCommission`(綠界/PayPal/App 都走它)、
revenuecatWebhook / rcSyncSubscription 的 +7 與推薦人獎勵,全部先讀 `users.ref_code`(`getRefCode(uid)`),RC subscriber attribute 只是帳上沒碼時的備援。
App 原生 Paywall 的 `getAppliedRefCode()` 也讀 users doc → 配對成功後年費/買斷自動切推薦價 IAP 商品。

## 隱私

原始 IP 從不寫入 Firestore;只存加鹽 sha256(IPv6 取 /64 前綴再雜湊),鹽在 `config/ref_salt`(rules 全拒),`ref_clicks` 48 小時刪除。
