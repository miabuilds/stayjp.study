# 固定內容更新流程

2026-10-16 定案（Mia）。對用戶公開的承諾寫在 changelog.html「固定更新時間表」，改節奏要同步改那裡、articles-ui.js 的 `.art-weekly` 文案、App 通知文案。

| 項目 | 節奏 | 上架方式 |
|---|---|---|
| 文章 | 每週一 08:00（台灣）2 篇：入門 N5/N4 一篇＋進階 N3/N2 一篇 | `articles.js` 的 `publish_at` |
| AI 跟讀句 | 每月 1 號 08:00 加 30 句（N5–N1 各 6），每月一個生活主題 | `speak.html` 的排程欄位（見檔內 S() 定義） |
| 通知 | 每週一 09:30（裝置當地）App 本機通知 | stayjp-app `scheduleArticleNotice`，不用每月動 |
| 社群 | 每篇文章一則鉤子文（官方帳號 brand，配封面、連結放留言） | stayjp-autopost `scheduled_posts.json` |
| 更新紀錄 | 每週一一筆「本週新文章」、每月 1 號一筆「跟讀句」 | changelog.html `.tl-item[data-pub]`（時間到才顯示） |

## 每月批次（每月 25 日前後，Mac 會跳提醒）

產「下個月」所有週一的文章＋下個月 1 號的跟讀句，**先給 Mia 看過說 OK，再 merge push**（排程到時間自動上架，不用再部署）。

1. **文章**：照 memory `stayjp-article-publish.md` 管線（gen-articles.mjs → kuromoji 核讀音 → merge-articles.mjs → overrides.json → tts collect/generate → **`npm run tts:google && npm run tts:google:upload`（Premium 自然語音 Leda/Charon，缺檔會退回標準聲但 Premium 用戶會聽到換聲音）** → tokenize-articles → gen-article-timings → Openverse CC0 封面＋CREDITS.md → `node scripts/validate-articles.mjs`）。先列出既有標題避免撞題；主題挑當月季節/在日生活。API key 用 `.env` 的 `PROJECT_ANTHROPIC_KEY`（新創組織 4de38567…，跑前驗組織）。
2. **跟讀句**：30 句寫進 speak.html（帶上架日期），kuromoji 整句核 kana → tts collect/generate → `npm run tts:google && npm run tts:google:upload` → `node scripts/tts/gen-speak-ruby.mjs`（`ALIGN_LOG=1` 逐句看對位結果）。
3. **更新紀錄**：在 changelog.html `<!-- SCHEDULED-ENTRIES -->` 下面加條目，`data-pub="YYYY-MM-DDT08:00:00+08:00"`；內容規模數字（文章數、跟讀句數）順手更新。
4. **社群**：每篇文章一則寫進 stayjp-autopost `scheduled_posts.json`（account `brand`、`at`=epoch 秒、`images`=`https://stayjp.study/images/articles/<id>.jpg`、`reply`=`https://stayjp.study/app.html?open=article:<id>&utm_source=threads&utm_medium=social&utm_campaign=weekly_article`）。文案要用內容當鉤子（文化落差／反直覺），**不要寫成「本週更新公告」**（10/9 成效：公告類最冷）；短、像 Mia 隨手打、不寫她本人日文程度/簽證/住日本。時間建議週一 12:30 一篇、週一 20:30 一篇。
5. **驗證**：localhost `?artpreview=1` 截圖看文章＋跟讀頁；validate-articles 全過；音檔、ruby、tokens/timings 覆蓋。
6. **給 Mia 審**：列表（日期、等級、日文標題、中文、一句摘要、社群文案），她 OK 後 merge → push main → curl 確認線上檔案已更新。

## 檢查點

- 下次文章日顯示：changelog.html `#nextDrop`、文章清單 `.art-weekly` 都是自動算「下一個週一」，不用手改。
- 如果某週沒內容（批次沒做），頁面仍會寫「下次 X/X」→ 會對用戶失信。批次延誤就先在 25 日提醒時處理。
