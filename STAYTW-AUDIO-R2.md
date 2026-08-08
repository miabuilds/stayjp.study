# StayTW 指令：把語音檔搬到 Cloudflare R2（修好五十音／所有 TTS 沒聲音）

> 貼給 StayTW 專案的 Claude Code 執行。背景：StayTW 部署在 Cloudflare Pages，
> 但上萬個 mp3 語音檔沒被部署上去（Pages 單次部署上限 2 萬檔、且上萬小檔會失敗/超慢），
> 所以 manifest 有 hash 但 `audio/tts/<hash>.mp3` 回傳 HTML fallback → 沒聲音。
> 解法：音檔改放 Cloudflare R2（無檔數上限、R2→Cloudflare 出流量免費），Pages 只留程式碼。

## 目標
1. 把 `audio/tts/` 底下所有 mp3 上傳到一個 R2 bucket。
2. 程式改成從 R2 網域抓音檔（一個變數切換）。
3. Pages 部署不要再包那些 mp3。
4. 驗證五十音等頁面有聲音。

---

## 步驟 1：建 R2 bucket + 公開網域
1. Cloudflare Dashboard → R2 → **Create bucket**，例如 `staytw-audio`。
2. 該 bucket → Settings → **Public access**：綁一個自訂子網域（例如 `media.你的網域`）或用 R2.dev 公開網址。
3. 記下公開網址（尾端要有 `/`），例如：`https://media.你的網域/`
4. bucket → Settings → **CORS policy** 加上允許你的站台網域（保險，避免用 fetch 抓音檔時被擋）：
   ```json
   [{ "AllowedOrigins": ["https://staytw.pages.dev","https://你的正式網域"],
      "AllowedMethods": ["GET","HEAD"], "AllowedHeaders": ["*"], "MaxAgeSeconds": 86400 }]
   ```

## 步驟 2：上傳 audio/tts 到 R2（用 rclone，1.6 萬檔要平行傳，wrangler 逐檔太慢）
1. Cloudflare → R2 → **Manage API Tokens** → 建一組 **S3 相容** 的 Access Key / Secret，記下 Account ID。
2. 裝 rclone（`brew install rclone`），設定 remote：
   ```bash
   rclone config create r2 s3 provider=Cloudflare \
     access_key_id=<你的AccessKey> secret_access_key=<你的Secret> \
     endpoint=https://<AccountID>.r2.cloudflarestorage.com
   ```
3. 同步整個資料夾（維持 audio/tts/ 路徑）：
   ```bash
   rclone copy ./audio/tts r2:staytw-audio/audio/tts --transfers=48 --checkers=48 -P
   ```
4. 抽驗一個檔：
   ```bash
   curl -sI "https://media.你的網域/audio/tts/<隨便一個hash>.mp3" | head -3
   # 要看到 HTTP/2 200 和 content-type: audio/mpeg
   ```

> 💡 若 StayTW 的語音走的是同一套 VOICEVOX 流程、同樣的文字 → hash（sha1 前 12 碼）會跟 StayJP 一樣，
> 兩個專案可以**共用同一個 R2 bucket**，不用各存一份。

## 步驟 3：程式改成可設定音檔位置（一個變數切換）
1. 新增 `tts-config.js`：
   ```js
   // 語音檔位置。'' = 本站相對路徑;設成 R2 網域即改走 R2(尾端要有 /)。
   window.TTS_BASE = 'https://media.你的網域/';
   window.ttsUrl = function (hash) { return (window.TTS_BASE || '') + 'audio/tts/' + hash + '.mp3'; };
   ```
2. 在每個會播音的頁面，於 `manifest.js` 之前引入：
   ```html
   <script src="tts-config.js"></script>
   <script src="audio/tts/manifest.js"></script>
   ```
3. 找出所有組音檔網址的地方並改用 `window.ttsUrl(hash)`：
   ```bash
   grep -rn "audio/tts/" --include=*.js --include=*.html . | grep -i "\.mp3\|new Audio\|\.src"
   ```
   把 `new Audio('audio/tts/'+hash+'.mp3')`、`x.src='audio/tts/'+hash+'.mp3'`
   一律改成 `new Audio(window.ttsUrl(hash))`、`x.src=window.ttsUrl(hash)`。
   （防呆寫法：`window.ttsUrl ? window.ttsUrl(hash) : 'audio/tts/'+hash+'.mp3'`）

## 步驟 4：Pages 部署不要再包 mp3
- 目的：讓 Pages 部署只剩程式碼（幾百檔、超快、不會撞 2 萬檔上限）。
- 若 Pages 直接部署 repo 根目錄：把 `audio/tts/` 移出部署目錄（或從 repo 移除、改由 R2 提供，`.gitignore` 掉）。
- 若有 build step：在 build 輸出排除 `audio/tts/`。
- ⚠️ service worker：若 `sw.js` 有把 `audio/tts/*.mp3` 加進 precache 清單，要拿掉（否則 SW 會去 precache 不存在的本地音檔而報錯）。改成只 precache 程式碼。

## 步驟 5：驗證
1. 重新部署 Pages。
2. 開站 → 五十音點一個假名 → 有聲音。
3. DevTools Network 看 mp3 請求指向 `https://media.你的網域/...`、回 200 audio/mpeg。

---
### 完成後的架構
- **Pages**：只放程式碼與少量資源 → 部署快、不撞檔數上限。
- **R2**：放全部 mp3 → 無檔數上限、出流量免費、之後音檔一直加也不怕。
- 切換只靠 `window.TTS_BASE` 一個變數（本地開發設 `''` 用相對路徑，正式設 R2 網域）。
