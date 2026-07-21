#!/usr/bin/env node
// build-sprint-plans.mjs — 從 grammar-*.js / vocab-*.js 產生各級 90 天衝刺計畫。
//
// 為什麼用產生器:計畫裡的文法點標題、單字錨點若手打,容易抄錯或誤譯 → 誤人子弟。
// 這支直接讀網站在用的同一份資料,保證計畫內容 100% 對得上網站工具,零抄寫誤差。
//
// 產出:SPRINT-N5.md … SPRINT-N1.md(這些是付費內容,.gitignore 已擋,不上線)
// 跑:node scripts/build-sprint-plans.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LEVELS = ['n5', 'n4', 'n3', 'n2', 'n1'];
const FOUND_WEEKS = 8;   // 打底期週數（W1–W8）

function loadGrammar(lv) {
  const src = readFileSync(join(ROOT, `grammar-${lv}.js`), 'utf8');
  return new Function(`${src}; return ${lv.toUpperCase()};`)();
}
function loadVocab(lv) {
  const src = readFileSync(join(ROOT, `vocab-${lv}.js`), 'utf8');
  const m = src.match(/(\[[\s\S]*\])/);
  return new Function(`return ${m[1]}`)();
}

// 把陣列切成 n 段,盡量等量（前段多 1）——保序,不打亂教學順序
function chunk(arr, n) {
  const out = [], len = arr.length, base = Math.floor(len / n), extra = len % n;
  let i = 0;
  for (let k = 0; k < n; k++) {
    const size = base + (k < extra ? 1 : 0);
    out.push(arr.slice(i, i + size));
    i += size;
  }
  return out;
}

function posSpread(vocab) {
  const p = {};
  vocab.forEach(w => { p[w.c] = (p[w.c] || 0) + 1; });
  const label = { '名': '名詞', '動': '動詞', '他': '他動詞', 'い形': 'い形', 'な形': 'な形', '副': '副詞' };
  return Object.entries(p).map(([k, v]) => `${label[k] || k} ${v}`).join('・');
}

function build(lv) {
  const LV = lv.toUpperCase();
  const grammarRaw = loadGrammar(lv);
  const vocab = loadVocab(lv);
  // 依類別分組再排(類別照首次出現順序,類別內照原順序)→ 每週主題連貫,不在類別間跳
  const catOrder = [];
  grammarRaw.forEach(g => { if (!catOrder.includes(g.cat)) catOrder.push(g.cat); });
  const grammar = catOrder.flatMap(c => grammarRaw.filter(g => g.cat === c));
  const gWeeks = chunk(grammar, FOUND_WEEKS);
  const vWeeks = chunk(vocab.map((w, i) => ({ ...w, n: i + 1 })), FOUND_WEEKS);
  const perDay = Math.ceil(vocab.length / FOUND_WEEKS / 6);
  const heavyVocab = vocab.length > 1500;

  let md = `# JLPT ${LV} 90 天衝刺計畫（實際內容版・自動生成）

> 以 stayjp.study 工具照表操課,每天約 ${20 + Math.round(perDay * 0.6)} 分鐘。
> 資料基準(實際,與網站同一份):${LV} 單字 ${vocab.length}、文法 ${grammar.length} 點。
> 單字順序＝網站「快速背單字 → 今日」出現順序;下表用「第 N 字＋錨點詞」定位。
> 開跑日:考前 90 天(12/6 場 → 約 9/7 起)。晚加入看文末壓縮版。
`;
  if (heavyVocab) {
    md += `
> ⚠️ **${LV} 單字量大(${vocab.length}),90 天是「複習配速」不是從零硬背**:
> 假設你已有前一級基礎,每天約 ${perDay} 字的節奏是「快速過＋用 SRS 標出不會的」,
> 真正要花時間的是被標記的那些,不是每個字從頭記。
`;
  }

  md += `
---

## 每天怎麼分(打底期通用)

| 時段 | 做什麼 | 工具 |
|---|---|---|
| 暖身 | 複習昨天標「不熟／不會」的字 | 快速背單字 → 今日複習 |
| 主餐 | 今天約 ${perDay} 個新單字(翻卡＋打字題) | 快速背單字 → 今日 |
| 配菜 | 今天 1–2 個文法點＋例句跟讀 | 文法練習 → 今日學習 |
| 收尾 | 答錯的自動進生詞本,掃一眼 | 自動 |

> 每週抓一天「機動日」:不學新的,只清 SRS 複習佇列＋補落後。

---

## 打底期(第 1–8 週)— 真實文法點 × 單字區間

`;

  for (let w = 0; w < FOUND_WEEKS; w++) {
    const gs = gWeeks[w];
    const vs = vWeeks[w];
    const cats = [...new Set(gs.map(g => g.cat))];
    const first = vs[0], last = vs[vs.length - 1];
    md += `### W${w + 1}｜${cats.join('・')}（${gs.length} 文法點）\n`;
    md += gs.map(g => `- ${g.t}`).join('\n') + '\n';
    md += `- **單字**:第 ${first.n}–${last.n} 字（\`${first.w}(${first.r})\` → \`${last.w}(${last.r})\`），約 ${Math.ceil(vs.length / 6)}/天\n\n`;
  }

  md += `> 到此 ${grammar.length} 文法點 + ${vocab.length} 單字全部觸及一輪。單字詞性分布:${posSpread(vocab)}。

---

## 實戰期(第 9–11 週)

- **W9 模考第一輪**:隔天一回「${LV} 語言知識」模考,錯題自動進 SRS;非模考日清複習。
- **W10 讀解＋聽力**:每天讀解 1 篇＋聽力 15 分鐘,聽力「逐句對答案」找出沒聽懂的那句。
- **W11 完整計時模考**:每 2–3 天一回含聽力全套,練專注力與配速。

## 衝刺期(第 12–13 週)

- **W12**:只複習 SRS 標「不熟／不會」;每天一回聽力;把造不出例句的文法(自評標★)重看。
- **W13(考前一週)**:前 5 天錯題本＋弱點文法各兩輪;考前 2 天只做已會的建立手感;考前 1 天休息、備妥證件文具。

---

## 每週檢核清單(週日 15 分鐘)

- [ ] 本週新單字 SRS「已熟」≥ 70%？低於 → 下週機動日先補
- [ ] 本週每個文法點都能自己造一句？造不出的標 ★,列入 W12 重看
- [ ] 進度有沒有落後上表？落後補、超前多做一篇讀解
- [ ] 連 2 天沒開？目標降到「只複習」,先保住連續紀錄

---

## 考前 10 天弱點衝刺

1. 停止背新單字(來不及複習第二次,只會擠掉該複習的)
2. 每天一回計時模考——練配速不是練知識
3. 聽力每天 15 分鐘(抓語速節奏)
4. 文法錯題本重做兩輪——最好拉分的部分
5. 考前一天不碰難題,只翻已會的,睡飽

---

## 報名／考務時程(台灣考區,以官方公告為準)

- 報名:考前約 2.5 個月開放(12 月場 → 9 月上旬開放、9 月中截止)
- 准考證:考前約 2 週開放列印
- 當天必帶:身分證正本＋准考證＋2B 鉛筆＋橡皮擦＋手錶

---

## 壓縮版(晚加入)

| 剩餘 | 調整 |
|---|---|
| 60 天 | 打底壓到 5 週,單字 ×1.5 速,文法 2 點/天 |
| 45 天 | 打底 3.5 週＋實戰 1.5 週＋衝刺 1 週,週末不休 |
| 30 天 | 改模考驅動:每天一回模考 → 只補模考錯的單字文法 |

---
*本檔由 scripts/build-sprint-plans.mjs 從網站實際題庫自動生成;資料更新後重跑即同步。*
`;
  return md;
}

for (const lv of LEVELS) {
  writeFileSync(join(ROOT, `SPRINT-${lv.toUpperCase()}.md`), build(lv));
  console.log(`✓ SPRINT-${lv.toUpperCase()}.md`);
}
