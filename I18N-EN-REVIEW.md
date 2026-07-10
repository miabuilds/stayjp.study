# UI 字串英譯複查(批次 A · 本地未上線)

243 條 UI 字串 zh-TW→English(Opus 翻 + Sonnet 校)。flag **5** 條(全 low,語氣微調,無誤譯/無插值遺失)。

## 校對 flag
- **reset_progress** (low): zh header "重置進度" and confirm dialog body both translate fine, but note the confirm dialog's parenthetical note may read as more alarming in English ("Cloud-synced data will also be overwritten") than intended casual warning tone — acceptable, no change needed. → 建議:No change needed; flagged for awareness only.
- **score_empty** (low): zh uses an exclamatory encouraging tone "去測驗看看吧！"; English "give one a try!" is slightly less direct about it being a quiz specifically, though still clear from context. → 建議:Optionally: "No quiz records yet — take a quiz to get started!"
- **gd_flip_hint** (low): 'try to recall' rendered as plain 'recall'; minor tone softening, acceptable but loses '試著' nuance. → 建議:"See the grammar name, try to recall its usage and meaning → tap to flip"
- **me_passed** (low): Source mixes Japanese '合格ライン達成！' (intentional JLPT-style flavor) but English fully neutralizes it to plain 'You passed!' — loses the JLPT-authentic feel other strings preserve. → 建議:Acceptable as-is for clarity, or consider "You cleared the pass line!" to keep JLPT flavor.
- **ls_hint** (low): '瀏覽器支援日語語音' → 'browser support for Japanese speech'; slightly ambiguous, 'speech synthesis/voice' clearer. → 建議:"Tip: requires browser support for Japanese text-to-speech (usually built into macOS/iOS/Android)"

## 全部對照(key · zh → en)

| key | zh-TW | English |
|---|---|---|
| site_name | 日本再留計劃 | Japan Stay Plan |
| search_ph | 搜尋文法・單字... | Search grammar or vocabulary... |
| about | 關於 | About |
| login | 登入 | Log in |
| logout | 登出 | Log out |
| login_fail | 登入失敗:  | Login failed:  |
| menu | 選單 | Menu |
| theme_toggle | 切換深色模式 | Toggle dark mode |
| grammar | 文法 | Grammar |
| vocab | 單字 | Vocabulary |
| compare | 比較 | Compare |
| all | 全部 | All |
| learn | 學習 | Learn |
| quiz | 測驗 | Quiz |
| review | 複習 | Review |
| stats | 統計 | Stats |
| more | 更多 | More |
| mock_exam | 模擬考 | Mock Exam |
| grammar_drill | 文法練習 | Grammar Practice |
| reading_practice | 讀解練習 | Reading Practice |
| listening_practice | 聽力練習 | Listening Practice |
| verb_conjugation | 動詞變化 | Verb Conjugation |
| feedback | 意見回饋 | Feedback |
| notebook | 生詞本 | Word Notebook |
| exam_history | 考試紀錄 | Exam History |
| streak_fire | 🔥 連續 {n} 天 | 🔥 {n}-day streak |
| streak_longest | 最長 {n} 天 | Longest {n} days |
| today_prefix | 今日： | Today:  |
| today_learned | 已學 {n} 項 | {n} learned |
| today_not_started | 尚未開始 | Not started yet |
| today_goal | 今日目標： | Today's goal:  |
| legend_less | 少 | Less |
| legend_more | 多 | More |
| cal_tooltip | {date}：詞彙 {v}・文法 {g}・測驗 {q} | {date}: Vocab {v} · Grammar {g} · Quiz {q} |
| cal_tooltip_empty | {date}：無活動 | {date}: No activity |
| total_progress | 總進度 {lv} | Total progress {lv} |
| total_progress_grammar | 總進度 {lv} 文法 | Total progress {lv} grammar |
| progress_txt | 已接觸 {n} / {total} 個{unit} | {n} / {total} {unit} covered |
| unit_vocab | 單字 | words |
| unit_grammar | 文法點 | grammar points |
| daily_mode | 每日模式 | Daily Mode |
| show_all | 顯示全部 | Show All |
| next_batch | 下一批 → | Next batch → |
| prev_batch | ← 上一批 | ← Previous batch |
| reset_progress | 重置進度 | Reset Progress |
| reset_confirm | 確定要重置這個等級的每日進度嗎？⏎（雲端同步資料也會被覆蓋） | Reset daily progress for this level?⏎(Cloud-synced data will also be overwritten) |
| cancel | 取消 | Cancel |
| daily_title | 今日學習 — {lv} | Today's Study — {lv} |
| daily_title_grammar | 今日學習 — {lv} 文法 | Today's Study — {lv} Grammar |
| daily_desc | 第 {start}～{end} 個單字（共 {count} 個）。背完後點「下一批」進入下一組。 | Words {start}–{end} of {count}. Tap "Next batch" once you've learned them. |
| daily_desc_grammar | 第 {start}～{end} 個文法點（共 {count} 個）。看完後點「下一批」進入下一組。 | Grammar points {start}–{end} of {count}. Tap "Next batch" once you've read them. |
| daily_tag | 每日 {n} 個 | {n} per day |
| listen_tag | 🔊 點擊喇叭聽發音 | 🔊 Tap the speaker to hear it |
| vocab_title | JLPT {lv} 單字表 | JLPT {lv} Vocabulary List |
| vocab_desc | 收錄 {lv} 級別常考單字共 {n} 個，涵蓋名詞、動詞、形容詞、副詞等詞性。 | {n} commonly tested {lv} words covering nouns, verbs, adjectives, adverbs and more. |
| vocab_tag | {n} 單字 | {n} words |
| grammar_title | JLPT {lv} 文法筆記 | JLPT {lv} Grammar Notes |
| grammar_desc | 收錄 {lv} 級別完整文法共 {n} 個文法點，含接續規則、例句及中文解說。 | {n} complete {lv} grammar points with conjugation rules, examples and explanations. |
| grammar_tag | {n} 文法點 | {n} grammar points |
| brand_tag | 日本再留計劃 | Japan Stay Plan |
| confuse_title | 易混淆詞比較 | Confusing Word Comparisons |
| confuse_desc | N2 考試最愛考近義詞辨析。每組收錄差異說明 + 對比例句，掌握細微語感。 | N2 loves testing near-synonyms. Each set explains the difference with side-by-side examples to master the nuance. |
| confuse_tag | {n} 組 | {n} sets |
| confuse_expand | 點擊展開詳細 | Tap to expand |
| no_fav_vocab | 還沒有收藏任何單字 | No saved words yet |
| no_result_vocab | 找不到符合的單字 | No matching words found |
| no_fav_grammar | 還沒有收藏任何文法點 | No saved grammar points yet |
| no_result_grammar | 找不到符合的文法項目 | No matching grammar found |
| no_result_confuse | 找不到符合的比較項目 | No matching comparisons found |
| sidebar_more | …還有 {n} 個 | …{n} more |
| stats_title | 學習統計 | Study Stats |
| tab_overview | 總覽 | Overview |
| tab_history | 考試紀錄 | Exam History |
| tab_notebook | 生詞本 | Word Notebook |
| tab_weak | 弱點 | Weak Spots |
| score_title | 測驗成績 | Quiz Scores |
| score_empty | 還沒有測驗紀錄，去測驗看看吧！ | No quiz records yet — give one a try! |
| score_recent | 最近：{n}% | Recent: {n}% |
| score_avg | 平均：{n}% | Average: {n}% |
| score_high | 最高：{n}% | Best: {n}% |
| score_total | 共 {n} 次 | {n} attempts |
| progress_title | 學習進度 | Learning Progress |
| mastered | 已掌握 {n} | Mastered {n} |
| learning | 學習中 {n} | Learning {n} |
| unlearned | 未學 {n} | Not started {n} |
| history_title | 考試紀錄（最近 50 筆） | Quiz History (last 50) |
| history_empty | 還沒有測驗紀錄 | No quiz history yet |
| type_ja_zh | 看日選中 | JP → meaning |
| type_zh_ja | 看中選日 | Meaning → JP |
| type_reading | 選讀音 | Pick the reading |
| type_typing | ✍️ 打字 | ✍️ Typing |
| ty_sub | 看中文，輸入讀音（假名） | Read the meaning, type the reading (kana) |
| ty_placeholder | 輸入讀音… | Type the reading… |
| ty_submit | 送出 | Submit |
| ty_correct_is | 正解 | Answer |
| ty_you_typed | 你打了 | You typed |
| ty_diff_daku | 差在濁音/半濁音（゛゜） | Off by a dakuten/handakuten (゛゜) |
| ty_diff_soku | 差在促音（っ） | Off by a small tsu (っ) |
| ty_diff_long | 差在長音 | Off by a long vowel |
| ty_diff_other | 假名拼寫不同 | Kana spelling differs |
| retry_wrong | 錯題重考 | Retry wrong answers |
| no_wrong | 沒有錯題紀錄！先去測驗幾次吧。 | No wrong answers yet! Try a few quizzes first. |
| notebook_title | 生詞本 | Word Notebook |
| notebook_count | （{n} 個） | ({n}) |
| notebook_empty | 還沒有收藏生詞。⏎在單字卡片上長按或在測驗中答錯的詞會自動加入。⏎也可以手動點擊單字旁的 📌 加入。 | No saved words yet.⏎Long-press a word card, or miss a word in a quiz, and it's added automatically.⏎You can also tap the 📌 next to a word to add it. |
| notebook_quiz | 生詞本測驗 | Notebook Quiz |
| notebook_review | 逐一複習 | Review one by one |
| notebook_min | 生詞本至少需要 4 個詞才能測驗！ | You need at least 4 words in your notebook to take a quiz! |
| notebook_empty_alert | 生詞本是空的！ | Your notebook is empty! |
| added_to_notebook | {w} 已加入生詞本！ | {w} added to your notebook! |
| flip_hint | 點擊翻面 | Tap to flip |
| nb_next | 下一個 | Next |
| nb_remove | 記住了，移除 | Got it, remove |
| nb_progress | 生詞複習 {cur} / {total} | Notebook review {cur} / {total} |
| weak_title | 弱點單字 | Weak Words |
| weak_subtitle | （正確率 < 70%） | (accuracy < 70%) |
| weak_empty | 還沒有發現弱點單字。多做幾次測驗後這裡會顯示你最需要加強的詞！ | No weak words found yet. Take a few more quizzes and the words you need to work on most will show up here! |
| weak_quiz | 弱點單字測驗（{n} 題） | Weak Words Quiz ({n}) |
| weak_none | 沒有弱點單字！ | No weak words! |
| weak_progress | 弱點測驗 {cur} / {total} | Weak words quiz {cur} / {total} |
| weak_result | 弱點測驗結果 | Weak Words Results |
| back_to_stats | 回統計 | Back to stats |
| try_again | 再來一次 | Try again |
| quiz_title | 單字測驗 | Vocabulary Quiz |
| quiz_level | 級別 | Level |
| quiz_type | 題型 | Question type |
| quiz_count | 題數 | Questions |
| quiz_start | 開始測驗 | Start quiz |
| quiz_cancel | 取消 | Cancel |
| quiz_score | 正確: {n} | Correct: {n} |
| quiz_reading_sub | 選出正確讀音 | Pick the correct reading |
| quiz_result | 測驗結果 | Quiz Results |
| quiz_you_chose | 你選: {chose} → 正確: {correct} | You chose: {chose} → Correct: {correct} |
| quiz_retry | 再來一次 | Try again |
| quiz_back | 返回 | Back |
| quiz_no_data | 此級別無單字資料 | No vocabulary for this level |
| srs_new | 🆕 新詞 | 🆕 New |
| srs_review | 📖 複習 | 📖 Review |
| srs_flip | 點擊翻面查看答案 | Tap to flip and see the answer |
| srs_hard | 不會 | Didn't know |
| srs_ok | 記得 | Got it |
| srs_stats | 已學 {learned} ｜ 待複習 {due} ｜ 已掌握 {mastered} | Learned {learned} ｜ Due {due} ｜ Mastered {mastered} |
| srs_stat_learned | 已學 {n} | Learned {n} |
| srs_stat_due | 待複習 {n} | Due {n} |
| srs_stat_mastered | 已掌握 {n} | Mastered {n} |
| srs_done | 複習完成！ | Review complete! |
| srs_today | 今日複習：{n} 個 | Today's review: {n} |
| srs_total_learned | 累計已學：{n} 個 | Total learned: {n} |
| srs_total_mastered | 已掌握：{n} 個 | Mastered: {n} |
| srs_total_learning | 學習中：{n} 個 | Learning: {n} |
| srs_no_review | 今天沒有需要複習的單字！你可以先去測驗模式學新詞。 | Nothing to review today! Head to Quiz mode to learn some new words. |
| gd_title | 文法練習 | Grammar Practice |
| gd_mode | 模式 | Mode |
| gd_flip_mode | 翻牌記憶 | Flashcards |
| gd_quiz_mode | 選擇題測驗 | Multiple choice |
| gd_range | 範圍 | Range |
| gd_range_today | 今日學習 | Today's study |
| gd_range_due | 待複習 | Due for review |
| gd_range_new | 新的 | New |
| gd_range_all | 全部隨機 | All (random) |
| gd_today_empty | 今日還沒學任何文法，請先到文法模式開始學習，或選「新的」「全部隨機」。 | You haven't studied any grammar today. Start in Grammar mode first, or choose "New" or "All (random)". |
| gd_due_empty | 目前沒有待複習的文法。複習會在你學過、隔一段時間後自動出現。先用「今日學習」或「新的」練習吧！ | Nothing to review right now. Reviews appear automatically a while after you learn something. Try "Today's study" or "New" for now! |
| gd_start | 開始 | Start |
| gd_cancel | 取消 | Cancel |
| gd_new | 🆕 新文法 | 🆕 New Grammar |
| gd_review | 📖 複習 | 📖 Review |
| gd_flip_hint | 看到文法名，試著回想接續和意思 → 點擊翻面 | See the grammar name, recall its usage and meaning → tap to flip |
| gd_hard | 不熟 | Not sure |
| gd_ok | 記得 | Got it |
| gd_done | 文法練習完成！ | Grammar practice complete! |
| gd_today | 今日練習：{n} 個文法 | Today's practice: {n} grammar points |
| gd_motivate | 繼續每天複習，文法就不會忘！ | Keep reviewing daily and you won't forget your grammar! |
| gd_retry | 再來一輪 | Another round |
| gd_back | 返回 | Back |
| gd_result | 文法測驗結果 | Grammar Quiz Results |
| gd_no_data | 此級別無文法資料 | No grammar data for this level |
| gd_no_match | 沒有符合條件的文法點！ | No grammar points match your filters! |
| me_title | JLPT 模擬考 | JLPT Mock Exam |
| me_subtitle | 模擬真實 JLPT 考試，含文字語彙 + 文法讀解兩大部分 | Simulates a real JLPT exam, with Vocabulary + Grammar & Reading sections |
| me_structure | 考試結構 | Exam Structure |
| me_part1 | 第一部分：文字・語彙 — 25 題 / 15 分鐘 | Part 1: Vocabulary — 25 questions / 15 min |
| me_part2 | 第二部分：文法・讀解 — 25 題 / 25 分鐘 | Part 2: Grammar & Reading — 25 questions / 25 min |
| me_pass_line | 合格基準：總分 60% 以上 | Pass mark: 60% or above overall |
| me_recent | 最近成績 | Recent Scores |
| me_start | 開始模擬考 | Start Mock Exam |
| me_cancel | 取消 | Cancel |
| me_part_n | 第 {n} 部分 | Part {n} |
| me_part_info | {n} 題 ／ {m} 分鐘 | {n} questions / {m} min |
| me_begin | 開始作答 | Begin |
| me_abandon | 放棄 | Quit |
| me_time | 用時 | Time |
| me_passed | 合格ライン達成！ | You passed! |
| me_failed | 不合格 | Not passed |
| me_pass_criteria | 合格基準：總分 60% 以上 + 各科 30% 以上 | Pass mark: 60% overall + 30% in each section |
| me_weak_areas | 需加強的題型 | Areas to work on |
| me_type_scores | 各題型成績 | Scores by question type |
| me_retry | 再考一次 | Retake exam |
| me_back | 返回 | Back |
| me_no_data | 此級別單字資料不足，無法生成模擬考 | Not enough vocabulary at this level to build a mock exam |
| rd_title | 讀解練習 | Reading Practice |
| rd_subtitle | 閱讀日文段落，回答理解問題 | Read Japanese passages and answer comprehension questions |
| rd_timer | 計時 | Timer |
| rd_timer_on | 開啟 | On |
| rd_timer_off | 關閉 | Off |
| rd_start | 開始練習 | Start Practice |
| rd_cancel | 取消 | Cancel |
| rd_no_data | 此級別無讀解資料 | No reading data for this level |
| rd_furigana_show | 振假名：顯示 | Furigana: On |
| rd_furigana_hide | 振假名：隱藏 | Furigana: Off |
| rd_next | 下一題 | Next |
| rd_show_result | 查看結果 | See Results |
| rd_correct | ✓ 正確 | ✓ Correct |
| rd_wrong | ✗ 錯誤 | ✗ Wrong |
| rd_time_used | 用時：{t} | Time: {t} |
| ls_title | 聽力練習 | Listening Practice |
| ls_subtitle | 使用瀏覽器語音合成聆聽日語，回答理解問題 | Listen to Japanese via your browser's speech synthesis and answer comprehension questions |
| ls_hint | 提示：需要瀏覽器支援日語語音（macOS/iOS/Android 通常內建） | Tip: requires browser support for Japanese speech (usually built into macOS/iOS/Android) |
| ls_mode | 模式 | Mode |
| ls_mode_test | 測驗（限播2次） | Test (2 plays max) |
| ls_mode_practice | 練習（不限播放） | Practice (unlimited plays) |
| ls_all | 全部 | All |
| ls_start | 開始練習 | Start Practice |
| ls_cancel | 取消 | Cancel |
| ls_no_data | 此級別無聽力資料 | No listening data for this level |
| ls_practice_info | 練習模式：不限播放 | Practice mode: unlimited plays |
| ls_plays_left | 剩餘播放次數：{n} | Plays left: {n} |
| ls_speed_normal | 原速 | Normal speed |
| ls_script | 原文： | Transcript: |
| ls_result | 聽力結果 | Listening Results |
| ls_retry | 再來一組 | Another set |
| ls_close | 關閉 | Close |
| ls_no_tts | 您的瀏覽器不支援語音合成 | Your browser doesn't support speech synthesis |
| copyright | © 2026 日本再留計劃 — All rights reserved. | © 2026 Stay in Japan Project — All rights reserved. |
| disclaimer | 本站為原創學習整理，建議搭配 JLPT 官方教材使用。若發現內容有誤，歡迎點卡片上「🚩 回報此項錯誤」告知。不隸屬於 JLPT 官方或任何教育機構。 | This site is original study material; we recommend using it alongside official JLPT resources. Spot an error? Tap "🚩 Report an error" on the card to let us know. Not affiliated with JLPT or any educational institution. |
| ft_vocab | 全站收錄 N5~N1 共 {total} 個單字（本頁 {lv} {n} 個） | {total} vocabulary words across N5–N1 ({n} on this {lv} page) |
| ft_confuse | 易混淆詞比較 {n} 組收錄 | {n} sets of confusable words included |
| ft_grammar | N5～N1 共 {total} 個文法點 | {total} grammar points across N5–N1 |
| report_error | 🚩 回報此項錯誤 | 🚩 Report an error |
| cat_count_vocab | {n} 個 | {n} words |
| cat_count_grammar | {n} 項 | {n} points |
| page_title | 日本再留計劃 — 免費 JLPT N5~N1 備考工具｜單字・文法・模考・複習 | Stay in Japan Project — Free JLPT N5–N1 Prep Tools \| Vocabulary · Grammar · Mock Exams · Review |
| verbs_page_title | 日本再留計劃 — 動詞變化完全攻略 | Stay in Japan Project — Complete Verb Conjugation Guide |
| lang_label | 繁 | EN |
