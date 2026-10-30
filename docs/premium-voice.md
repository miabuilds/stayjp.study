# Premium 自然語音（Google Chirp 3 HD，2026-10-30）

## 架構
- 聲音:`leda`（ja-JP-Chirp3-HD-Leda，女）、`charon`（ja-JP-Chirp3-HD-Charon，男）。標準聲仍是 VOICEVOX 四国めたん（免費）。
- 音檔不進 repo:`~/Documents/GitHub/stay-jp-audio/tts-g/<voice>/<hash>.mp3`（`STAYJP_AUDIO_DIR` 可改），hash 與主音檔 `audio/tts/manifest.js` 相同。
- 配信:Cloudflare R2 bucket `stayjp-audio`（帳號 abc83327）→ 公開 `https://pub-5d0eefcfb05c46cdadedb702c907cab0.r2.dev/tts-g/<voice>/<hash>.mp3`，物件帶 immutable 一年快取、CORS 全開。`tts-config.js` 的 `TTS_G_BASE` 是唯一設定點（stayjp.study DNS 在 Namecheap，要換自訂網域得先把 DNS 搬到 Cloudflare）。
- 前端:`tts-config.js` `ttsUrl(hash)`：tts_voice 是 leda/charon 且 `ttsGAllowed(hash)` → R2；否則主音檔。`ttsHasPremium()` = `!ToolQuota.shouldGate()`。免費版 `TTS_G_FREE_PER_DAY`=20：每天前 20 個不同 hash 放行（localStorage `tts_g_free`），用完第一次叫 `StudyPlan.voiceTrialEnded()` 跳 toast。設定頁（學習計畫 → 語音）三個聲音 radio + 試聽鈕（`StudyPlan.previewVoice`，固定三句輪播，不看 Premium）。
- app.html `speak()` 第二次重試改走主音檔（`_ttsAudioFor(hash, forceMain)`），Premium 聲音缺檔不會沒聲音。文章逐詞高亮是 VOICEVOX 時間軸 → Google 聲音整句淡底（articles-ui.js）。my-vocab 雲端合成 charon→男聲。

## 產檔（讀音保證）
`node scripts/tts/gen-google.mjs --voice all`（`npm run tts:google`；`--dry` 看統計、`--only`、`--hashes file`、`--force`、`--force-pron json`）。
customPronunciations（JAPANESE_YOMIGANA）釘讀音：
1. 單字（文字=讀音假名）→ 送漢字表記 + 釘讀音（同音字取最低級別）。
2. overrides.json 人工校過的漢字→假名全部釘。
3. 其他含漢字的詞 → kuromoji 讀音，只在「kuromoji 整句 == all-readings.tsv（VOICEVOX 現行音檔讀音）」的區段釘；對不上的詞交給 Google、記 `scripts/out/tts-g/unpinned.tsv`。`READING_FIX`（日本→にほん 等）一律釘。
4. Google 規則：phrase 必須漢字開頭＋漢字結尾（お金→金/かね）；單一漢字只在句中出現一次才釘（否則 skipped.tsv）。
5. **釘選不可靠（2026-10-30 實測）**：Chirp 3 HD 的 customPronunciations 有時照念、有時忽略（故郷 釘「こきょう」仍念「ふるさと」），且同一請求輸出不固定（md5 每次不同）。所以 JMdict 列「2 種以上常用讀音」且 2 字以上的詞（故郷/日本/今日/明日/市場/工場/昨日…共 378 詞，表 `scripts/tts/jmdict-ambig.json`，由 scratchpad `jmdict-ambig-json.py <jmdict-simplified json> <out> common` 產）直接把漢字換成讀音假名送出，不再靠釘選；其餘詞照舊送漢字＋釘。dry run 會列 `scripts/out/tts-g/substituted.tsv`（826 句）。`--no-kana-sub` 可關。
6. 稽核對照法：同一批 hash 用 VOICEVOX 原檔跑 `qa-google.mjs`（symlink 成假聲音 vvx）當對照組；whisper 本身誤判約 20%，只看「Google 錯、VOICEVOX 對」的那幾句。
5. 對話 A/B：leda 版 A=Leda B=Charon，charon 版相反，ffmpeg 串接。
狀態：`scripts/out/tts-g/<voice>/done.json`（hash→送出的文字/釘的讀音）、`fail.log`。

## 稽核
`node scripts/tts/qa-google.mjs --voice leda [--sample 300]`：whisper.cpp（large-v3-turbo，`WHISPER_CLI`/`WHISPER_MODEL`）聽回來 → kuromoji 轉假名 → 跟期望讀音比 → `qa-mismatch.tsv`。whisper 輸出漢字，同音異讀（生物）抓不到，抓的是整個字念錯／漏字。

## 上傳
`sh scripts/tts/upload-google-r2.sh leda [併發]`（`npm run tts:google:upload`）：只傳 done.json 裡的 hash，冪等（`uploaded.txt`）。wrangler 一檔約 3.5 秒，全站一聲音約 3 小時。

## 新增內容（每週文章 / 每月跟讀句）
tts collect/generate 之後**一定要** `npm run tts:google && npm run tts:google:upload`，否則 Premium 用戶那幾句會退回標準聲。
