# SEO 静态落地页生成方案 — 设计文档

- 日期：2026-07-05
- 状态：待用户审阅
- 目标网站：stayjp.study（GitHub Pages 服务 main 分支）

## 背景与目标

Threads 帐号被封暴露了单点故障：全部推广流量押在租来的平台上。需要建立**平台封不掉的自有流量**。

网站现状：7710 单字 + 382 文法点全锁在客户端 JS 里，Google 爬不到。有人 Google「〜てしまう 文法」「JLPT N5 單字表」这类高意图长尾词时，本该排前列的内容对搜索引擎不可见。

**目标**：把文法/单字内容生成可被搜索引擎索引的静态 HTML 页，抢 JLPT 长尾自然流量，并把访客导向 app / 订阅。

**非目标**（YAGNI）：
- 不做单字逐词页（薄页风险，见决策）
- 不做自动 CI 生成（本地手动，看得见 diff）
- 第一版不改现有页面（内链拆为 Phase 2 选配）

## 已确认的四个决策

| # | 决策 | 选定 |
|---|---|---|
| 1 | 页面粒度 | 382 文法**逐条页** + 单字**按级×词性聚合表** |
| 2 | 语言 | **双语** zh-Hant + en，hreflang 互链 |
| 3 | URL slug | **罗马音** slug（`/g/n5/te-shimau/`） |
| 4 | 生成/部署 | **本地脚本 + 手动 review diff + push main** |

## 数据来源（已核实）

| 数据 | 文件 | 结构 |
|---|---|---|
| 文法 zh | `grammar-{n5..n1}.js`（全局 `N5`..`N1`） | `{t:标题, cat:分类, ex:解说, eg:[例句], p:句型}`，共 382 条 |
| 文法 en | `grammar-{n5..n1}-en.js`（`N5_EN`..） | 同结构，英文 |
| 单字 zh | `vocab-{n5..n1}.js`（`VOCAB_N5`..） | 数组 `{w:词, r:假名, m:中文义, c:词性}`，共 7710 条 |
| 单字 en | `vocab-{n5..n1}-en.js` | 同结构，英文义 |
| 汉字读音 | `grammar-kanji-readings.js` / `scripts/grammar-kanji-readings.clean.json` | 汉字→假名读音，用于 slug 罗马音转换 |

`scripts/publish-content-sharded.mjs` 已有 `evalJs()` 从这些 JS 抽数据的现成手法，生成器复用同一模式。

## URL 结构

```
zh 文法逐条：  /g/{level}/{slug}/            → /g/n5/te-shimau/
en 文法逐条：  /en/g/{level}/{slug}/         → /en/g/n5/te-shimau/
zh 文法级 hub：/g/{level}/                    → /g/n5/   （该级 68 个文法索引）
zh 单字聚合：  /v/{level}/{pos}/             → /v/n5/noun/  （N5 名詞单字表）
zh 单字级 hub：/v/{level}/                    → /v/n5/
en 对应：      /en/v/... 同构
```

- 每个 URL 落地为该目录下的 `index.html`（GitHub Pages 用 `.nojekyll`，直接伺服原始档，目录 URL 自动取 index.html）。
- 顶层新目录 `g/`、`v/`、`en/`，已确认与现有 `audio/ data/ docs/ functions/ images/ scripts/` 不撞名。

### slug 生成规则

1. 取文法 `.t`，去除装饰符号（`～ ・ （ ） 　`）。
2. 假名 → 用 Hepburn 表转罗马音；汉字 → 先查 `grammar-kanji-readings` 得假名再转。
3. 结果小写、空格转 `-`、只留 `[a-z0-9-]`。
4. **Fallback**：转换失败或结果为空 → 用 grammar id（`n5-1`）当 slug。
5. **去重**：同级内 slug 撞名 → 追加 `-{n}` 后缀。生成器构建全量 slug 映射表并检测冲突，冲突时 `log` 出来。

单字词性 `pos` 用固定英文映射：`名→noun, 動→verb, 形→adjective, 副→adverb, ...`（未映射的词性归 `other` 并 log）。

## 页面模板

统一模板，**极简内联 CSS**（复用 index.html 的 Muji 主题变量），不加载 SPA 大包，页面轻、加载快（利于排名）。

### 文法逐条页 `<head>`
- `<title>` = `{文法标题}｜JLPT {LEVEL} 文法解說 - 日本再留計劃`（日文关键字入 title）
- `<meta name="description">` = 解说前 ~120 字
- `<link rel="canonical">` 指向自身
- `<link rel="alternate" hreflang="zh-Hant">` / `hreflang="en">` / `hreflang="x-default">` 三条互链
- Open Graph + Twitter card（复用现有 banner）
- JSON-LD：`LearningResource` + `BreadcrumbList`

### 文法逐条页 `<body>`
- 面包屑：首頁 › {LEVEL} 文法 › {标题}
- `<h1>` = 文法标题（日文，含关键字）
- 分区：**意思・解說**（`ex`）／ **句型・接續**（`p`）／ **例句**（`eg`，日文+译文）
- **相关文法**：同 `cat` 分类下其他文法的内链（站内互链，帮收录+权重）
- **转化 CTA 卡**（核心）：「▶ 免費線上練習這個文法」→ 深链进 app/SPA 对应级别；下方一句订阅引导
- 语言切换链接（zh ⇄ en）

### 单字聚合页
- `<h1>` = `JLPT {LEVEL} {词性}單字表`
- 单字表格：词 / 假名读音 / 中文义（en 页为英文义）
- JSON-LD：`ItemList`
- 同款面包屑 + CTA + hreflang

### hub 页
- 级别索引：列出该级所有文法/单字聚合页的内链（sitemap 之外的人类导航 + 内链网）

## 生成器 `scripts/build-seo.mjs`

- 幂等：同内容重跑输出字节一致（`eg` 等按稳定顺序），git diff 为零，不污染历史。
- 流程：eval 数据 → 建 slug 映射（检测冲突）→ 渲染模板 → 写 `/g/ /v/ /en/`。
- **重写 sitemap.xml**：保留现有 8 条静态页 + 追加全部 SEO 页 + 语言 alternate。
- 输出统计：生成页数、slug fallback 数、冲突数、词性未映射数——全部 `log`，不静默。
- `DRY_RUN=1`：只算不写（对齐 publish 脚本风格）。
- **只写新目录，只读数据文件与 sitemap**，绝不碰 home.html / index.html / app / 后端。

## 体积与影响评估（已核实）

| 项 | 结论 |
|---|---|
| 静态输出体积 | 文法 ~3MB + 单字 ~1MB ≈ 4–5MB，远低于 GH Pages 1GB 建议上限 |
| 与 content/master 1MiB 坑的区别 | 那是单一 Firestore doc 撞硬上限；这里是几百个独立小文件，无单点上限 |
| Jekyll 构建 | 已有 `.nojekyll`，GH Pages 直接伺服原始档，加几百文件零构建风险 |
| 现有页/app/金流/登入/用户 | **零影响**——纯静态、无后端、只写新目录 |
| 唯一碰旧文件处 | `sitemap.xml`（追加）；首页内链拆为 Phase 2 选配，需改 home.html 时单独走 diff 把关 |
| 重复内容风险 | SPA 内容在 JS 不可爬，无 zh 内部 duplicate；en/zh 靠 hreflang 声明区分 |

## 验证方式（闭环）

1. 本地 `python3 -m http.server 8080` 起服务器。
2. 打开 `http://localhost:8080/g/n5/te-shimau/` 等抽样页目视 + 用 agent-browser 截图给用户看。
3. `git status` / `git diff --stat` 确认只动 `/g/ /v/ /en/ sitemap.xml`。
4. 用户看过 diff → 手动 `push main` 才上线。
5. 上线后：Google Search Console 提交 sitemap、抽查 `site:stayjp.study/g/` 收录。

## 阶段划分

- **Phase 1**：生成器 + 文法逐条页（zh + en）+ 文法 hub + sitemap。先跑通最强护城河。
- **Phase 2**：单字聚合表页（zh + en）+ 单字 hub。
- **Phase 3（选配）**：从 home.html 等现有页加内链指向 SEO 页（改旧文件，单独 diff 把关）。
