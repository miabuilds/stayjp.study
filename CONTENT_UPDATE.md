# 內容更新流程（重要）

單字 / 文法 / 例句 / 聽力 / 讀解等「學習內容」現在**以靜態檔提供**（`content-data.json`），
由 GitHub Pages CDN 免費送出，不再每次都打 Firestore（省下大量 Firestore 對外流量費 ＝ 之前帳單暴增的主因）。

> 背景：內容原本存在 Firestore `content/*`，每次載入都算 Firestore egress，iOS 又會清快取重抓 →
> 一個月燒 ~70GB ≈ US$97。改成靜態檔後這條幾乎歸零。

## 你在 Firestore 後台改完內容後，**一定要跑這個**

否則使用者看到的還是舊版（不會壞，但不會更新）。

```bash
cd /Users/linyurou/Documents/GitHub/stay-jp-notes

# 用 Firebase service account 金鑰重新匯出靜態內容檔
NODE_PATH="$(pwd)/functions/node_modules" \
  node scripts/export-content-static.cjs --key <你的 serviceAccount.json 路徑>

# 產出 content-data.json + content-version.json，接著 commit + 部署
git add content-data.json content-version.json
git commit -m "content: 更新學習內容"
git push        # GitHub Pages 會自動發佈
```

跑完腳本會印出各級單字/文法數量，核對一下對不對再部署。

## 運作方式（給未來的自己 / 工程師）

- `content-loader.js`：**靜態優先** → 讀 `content-version.json` 拿版本 → 讀 `content-data.json?v=版本`
  （URL 帶版本號，同版本命中 CDN/瀏覽器/SW 快取＝0 流量；版本一變自動抓新檔）。
- 靜態檔讀不到（缺檔/壞檔）→ **自動退回 Firestore 分片 → 整包 master**，所以永遠不會斷站。
- 可在瀏覽器 console 打 `window.__contentSrc` 確認來源：正常應是 `"static"`；若是 `firestore-*` 代表靜態檔有問題（去看是不是忘了部署 / 檔案壞了）。
- Firestore `content/*` 仍是**內容的真實來源**（後台編輯用），靜態檔只是「發佈出去的快照」。

## 需要我幫忙？

跟我說「內容更新了，幫我重匯出」＋提供金鑰路徑，我可以直接幫你跑上面的匯出 + 提交。
（金鑰是高權限，用完記得到 Firebase Console → 專案設定 → 服務帳戶 撤銷。）
