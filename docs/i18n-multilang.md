# StayJP 多語言架構(2026-10)

支援語言(正本:`i18n.js` 的 `LANGS`):`zh-TW`(正本)、`zh-CN`、`en`、`ko`、`vi`、`id`、`th`。

## 一句話
**繁中是正本;簡中用 OpenCC 即時轉;其餘語言(en/ko/vi/id/th)都走同一條「外語層」,英文不再是特例。**

## 四層

| 層 | 做什麼 | en | ko/vi/id/th |
|---|---|---|---|
| ① 字典 `t(key)` | 有 key 的 UI 字串 | `i18n.js` 內建 `dict.en` | `lang/<code>.js` → `window.__L10N[code].dict`(i18n.js 依 `ui_lang` 用 `document.write` 同步載入) |
| ② `I18n.pick(繁中, 英文)` | 硬編在程式裡的字串 | 回英文 | 查 `__L10N[code].ui[繁中]`,查不到退英文 |
| ③ `translate-layer.js` | 渲染後把殘留的繁中 DOM 文字換掉 | `ui-map.js`(`__UI_MAP`/`__UI_PATTERNS`) | `__L10N[code].ui` / `.patterns`(同一支 translate-layer,經 `I18n.uiMap()` 取) |
| ④ 內容疊層 | 文法/單字/易混淆/讀解聽解/刷題/文章/文法詳解 | `content-en.js`、`reading-listening-en.js`、`jlpt-questions-en.js`… | `content-<code>.js`、`reading-listening-<code>.js`、`jlpt-questions-<code>.js`、`jlpt-q-trans-<code>.js`、`articles-<code>.js`、`misc-<code>.js`、`grammar-detail-<code>.js` |

## 寫程式的規則(所有頁面/模組一致)

1. **判斷語言只用三個函式**:`I18n.getLang()`、`I18n.isForeign()`(en/ko/vi/id/th = 非中文)、`I18n.isPacked()`(ko/vi/id/th)。
   - ❌ `I18n.getLang() === 'en'` 當「非中文」用 → 韓文使用者會看到繁中。
   - ✅ 真的只有英文才有的資料(例如 `ex.e` 英文例句、`x.en` 英文標題)才留 `=== 'en'`,其他語言的對應資料在疊層檔。
2. **硬編字串一律 `enOr(zh, en)`**,而 `enOr` 的定義統一是:
   ```js
   function enOr(zh, en) { return I18n.isForeign() ? I18n.pick(zh, en) : cvt(zh); }   // 沒 cvt 的頁就回 zh
   ```
   `pick` 以繁中原文當 key 查對照表,所以 **繁中字串要跟 gen-l10n 抽到的一樣**(改了繁中就要重跑 `ui` part)。
3. **資料欄位三選一**(例如文章的 `title_zh / title_en`):英文介面用 `_en`;ko/vi/id/th 由疊層檔把 `_en` 欄位**就地覆蓋成目標語**(見 `articles-ui.js` 的 overlay),所以程式判斷用 `isForeign()` 讀 `_en` 即可。
4. **獨立頁面(speak/jlpt-drill/yt-shadow…)**:載 `i18n.js` 之後再載 `translate-layer.js`(不用載 ui-map.js,translate-layer 在 en 時會自己補載),靜態繁中文字就會被換掉。頁內若有 `if (L === 'en') { 手動改字 }` 區塊,保留給英文,其他語言交給 translate-layer。
5. **語言選單**:由 `I18n.LANGS` 產生 options,別手寫三個選項。切換涉及外語(任一邊是外語)就 `location.reload()`。
6. **後端(Functions)**:`langName(lang)` 支援 7 碼;前端 fetch 一律帶 `lang: I18n.getLang()`。
7. **原生 App**:`stayjp-app/src/lib/i18n.ts` 的 `UiLang` 同這 7 碼,字典 `i18n-<code>.ts` 由 gen-l10n 的 `native` part 產。
8. **新增硬編字串後**:跑 `node scripts/gen-l10n.mjs ui <code>`(每語言)+ `build <code>`,只會翻新 key(可續跑)。

## 產生/更新翻譯

```
node scripts/gen-l10n.mjs status            # 進度
node scripts/gen-l10n.mjs all ko            # 跑 ko 全部 part(可中斷續跑;已翻的跳過)
node scripts/gen-l10n.mjs gdetail ko        # 文法詳解(大,另跑)
node scripts/gen-l10n.mjs build ko          # 組出 lang/ko.js、content-ko.js、…
node scripts/gen-l10n.mjs ui en; node scripts/gen-l10n.mjs content en; node scripts/gen-l10n.mjs build en   # 英文補缺(ui-map 新 key、易混淆)
```
快取在 `scripts/out/l10n/<code>/<part>.json`;要改某句翻譯就改快取再 build,別手改產出的 .js。
Key 用專案 `.env` 的 `PROJECT_ANTHROPIC_KEY`(新創組織,腳本會驗組織 ID)。

## 內容檔格式

- `lang/<code>.js`:`window.__L10N[code] = { dict:{i18n key → 字串}, ui:{繁中 → 目標語}, patterns:[{pattern, to}] }`
- `content-<code>.js`:`window.STAYJP_L10N[code] = { grammar:{id:{t,p,ex,n,eg:[]}}, vocab:{n5:[{m,z}|null,…]…}, confusables:{id:{words:[{m,note}],tip,eg:[]}} }`
- `reading-listening-<code>.js`:`window.RL_L10N[code] = { reading:{id:[{q,options,explanation}]}, listening:{id:{q,options}} }`
- `jlpt-questions-<code>.js`:`window.JLPT_Q_L10N[code] = {id: 詳解 HTML}`;`jlpt-q-trans-<code>.js`:`window.JLPT_Q_TRANS_L10N[code] = {id: 整句翻譯}`
- `articles-<code>.js`:`window.ARTICLES_L10N[code] = {id:{title,topic,trans:[],vocab:[意思],grammar:[{t,note}]}}`
- `misc-<code>.js`:`window.MISC_L10N[code] = { skits:{n:{t,m,hook}}, omikuji:{i:{zh,w:[],tip}}, keigo:{動詞:意思} }`
- `grammar-detail-<code>.js`:`window.GRAMMAR_DETAIL_L10N[code] = {id: HTML}`

## 已知限制
- 單一 URL、語言存在 localStorage/cookie,沒有 hreflang;SEO 仍以繁中為主。
- 文法詳解(gdetail)量大,翻完前外語介面會退回中文詳解。
