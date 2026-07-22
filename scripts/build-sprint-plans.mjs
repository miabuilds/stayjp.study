#!/usr/bin/env node
// build-sprint-plans.mjs — 從 grammar-*.js / vocab-*.js / confusables.js 產生各級 90 天衝刺計畫。
//
// 為什麼用產生器:計畫裡的文法接續／意味／例句、單字若手打,容易抄錯或誤譯 → 誤人子弟。
// 這支直接讀網站在用的同一份題庫,計畫內容 100% 對得上網站,零抄寫誤差。
// 考試結構／合格線是 JLPT 官方公開資料(寫死在 EXAM),時間欄位標「以官方公告為準」。
//
// 產出:SPRINT-N5.md … SPRINT-N1.md（付費內容,.gitignore 已擋,不上線）
// 跑:node scripts/build-sprint-plans.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LEVELS = ['n5', 'n4', 'n3', 'n2', 'n1'];
const FOUND_WEEKS = 8;
const strip = s => String(s || '').replace(/<[^>]+>/g, '');

// JLPT 官方合格基準(總分 180;各得點區分有最低標,任一科未達即不合格)
const EXAM = {
  n5: { pass: 80, sections: [['言語知識(文字・語彙・文法)・讀解', 120, 38], ['聽解', 60, 19]],
        times: '文字・語彙 20 分／文法・讀解 40 分／聽解 30 分', combined: true },
  n4: { pass: 90, sections: [['言語知識(文字・語彙・文法)・讀解', 120, 38], ['聽解', 60, 19]],
        times: '文字・語彙 25 分／文法・讀解 55 分／聽解 35 分', combined: true },
  n3: { pass: 95, sections: [['言語知識(文字・語彙・文法)', 60, 19], ['讀解', 60, 19], ['聽解', 60, 19]],
        times: '文字・語彙 30 分／文法・讀解 70 分／聽解 40 分', combined: false },
  n2: { pass: 90, sections: [['言語知識(文字・語彙・文法)', 60, 19], ['讀解', 60, 19], ['聽解', 60, 19]],
        times: '言語知識・讀解 105 分／聽解 50 分', combined: false },
  n1: { pass: 100, sections: [['言語知識(文字・語彙・文法)', 60, 19], ['讀解', 60, 19], ['聽解', 60, 19]],
        times: '言語知識・讀解 110 分／聽解 55 分', combined: false },
};

// 各級針對性應試策略(具體、非通用話術)
const STRATEGY = {
  n5: [
    '**文字・語彙**:考漢字讀音與平假名寫法。N5 漢字量少,把每個新字的音讀死記,這裡最好拿分。',
    '**文法**:句型固定(です/ます/て形),用「文法形式判斷」題型反覆練,錯的立刻進 SRS。',
    '**讀解**:短文為主,先看題目問什麼再回頭找答案,別逐字翻譯。',
    '**聽解**:語速慢,重點在聽懂「疑問詞(誰/どこ/いつ/いくら)」。每天 15 分鐘養耳朵。',
  ],
  n4: [
    '**文字・語彙**:開始考「言い換え(近義替換)」,靠單字量。每天 16 字別間斷。',
    '**文法**:受身・使役・條件(たら/ば/なら/と)是 N4 最愛考也最會混的,W5–W7 要練到反射。',
    '**讀解**:出現 100–200 字中文,練「抓接續詞(しかし/だから/でも)」判斷語氣轉折。',
    '**聽解**:課題理解(聽完做什麼)佔比高,邊聽邊記關鍵動詞。',
  ],
  n3: [
    '**文字・語彙**:N3 是量的門檻(2000+ 字),用 SRS 找出不會的,不要每個從頭背。',
    '**文法**:句型變多、近義句型開始難分,搭配「易混淆」比較表(見下)一起記。',
    '**讀解**:中長文變多,練「情報検索(從廣告/通知找特定資訊)」這種新題型,先看選項關鍵詞。',
    '**聽解**:語速接近自然,概要理解需要聽全段抓主旨,別卡在單字。',
  ],
  n2: [
    '**文字・語彙**:大量音讀漢語詞,靠累積。用法題考語感,多看例句。',
    '**文法**:句型細緻(～につけ／～ものの／～ずにはいられない…),接續形態要背準,考「文の組み立て(排序)」最吃這個。',
    '**讀解**:分數大戶。長文+統合理解(比對兩篇),練速讀與抓主張,時間分配要練。',
    '**聽解**:50 分無字幕,概要理解與即時応答要靠語感,考前每天必聽。',
  ],
  n1: [
    '**文字・語彙**:最難的音讀與抽象詞,靠長期累積;考前用高頻榜補洞。',
    '**文法**:古語殘留與書面句型多,接續與語氣(硬い/話し言葉)要分清,考點常在細微差異。',
    '**讀解**:大量長文+主張理解+統合,佔分最重。練「作者立場」與「言外之意」,速度是關鍵。',
    '**聽解**:55 分,資訊密度高,課題理解與概要理解並重,考前兩週每天全套聽力。',
  ],
};

function loadGrammar(lv) {
  const src = readFileSync(join(ROOT, `grammar-${lv}.js`), 'utf8');
  return new Function(`${src}; return ${lv.toUpperCase()};`)();
}
function loadVocab(lv) {
  const src = readFileSync(join(ROOT, `vocab-${lv}.js`), 'utf8');
  const m = src.match(/(\[[\s\S]*\])/);
  return new Function(`return ${m[1]}`)();
}
function loadConfusables(lv) {
  try {
    const src = readFileSync(join(ROOT, 'confusables.js'), 'utf8');
    const all = new Function(`${src}; return CONFUSABLES;`)();
    const LV = lv.toUpperCase();
    return all.filter(c => (c.level || '').toUpperCase().includes(LV));
  } catch { return []; }
}

function chunk(arr, n) {
  const out = [], len = arr.length, base = Math.floor(len / n), extra = len % n;
  let i = 0;
  for (let k = 0; k < n; k++) { const size = base + (k < extra ? 1 : 0); out.push(arr.slice(i, i + size)); i += size; }
  return out;
}

function posSpread(vocab) {
  const p = {}; vocab.forEach(w => { p[w.c] = (p[w.c] || 0) + 1; });
  const label = { '名': '名詞', '動': '動詞', '他': '他動詞', 'い形': 'い形', 'な形': 'な形', '副': '副詞' };
  return Object.entries(p).map(([k, v]) => `${label[k] || k} ${v}`).join('・');
}

function build(lv) {
  const LV = lv.toUpperCase();
  const grammarRaw = loadGrammar(lv);
  const vocab = loadVocab(lv);
  const cfs = loadConfusables(lv);
  const catOrder = [];
  grammarRaw.forEach(g => { if (!catOrder.includes(g.cat)) catOrder.push(g.cat); });
  const grammar = catOrder.flatMap(c => grammarRaw.filter(g => g.cat === c));
  const gWeeks = chunk(grammar, FOUND_WEEKS);
  const vWeeks = chunk(vocab.map((w, i) => ({ ...w, n: i + 1 })), FOUND_WEEKS);
  const perDay = Math.ceil(vocab.length / FOUND_WEEKS / 6);
  const heavyVocab = vocab.length > 1500;
  const E = EXAM[lv];

  let md = `# JLPT ${LV} 90 天衝刺計畫

一份幫你把「每天該做什麼」排到週的作戰計畫,對接 stayjp.study 的單字／文法／模考工具。
文法點的接續、意味、例句與單字,都取自本站題庫(和你在網站上看到的完全一致)。

- **資料基準(實際)**:${LV} 單字 ${vocab.length}、文法 ${grammar.length} 點、易混淆比較 ${cfs.length} 組。
- **每天投入**:打底期約 ${20 + Math.round(perDay * 0.6)} 分鐘;實戰期一回模考約 1–2 小時。
- **開跑日**:考前 90 天(12 月場 → 約 9/7 起)。晚加入看文末壓縮版。
`;
  if (heavyVocab) {
    md += `
> ⚠️ **${LV} 單字量 ${vocab.length},90 天是「複習配速」不是從零硬背**:假設你已有前一級基礎,每天約 ${perDay} 字是「快速過＋用 SRS 標出不會的」,時間花在被標記的那些,不是每個字從頭記。
`;
  }

  // 考試情報
  md += `
---

## 考試結構與合格線(先搞懂遊戲規則)

**總分 180,合格線 ${E.pass} 分。** ${E.combined
    ? `分兩個得點區分,各有最低標——任一科沒過,總分再高也不合格。`
    : `分三個得點區分,每科最低 19/60——**任一科沒過,總分再高也不合格,所以不能偏科**。`}

| 得點區分 | 滿分 | 最低標 |
|---|---|---|
${E.sections.map(s => `| ${s[0]} | ${s[1]} | ${s[2]} |`).join('\n')}

- **考試時間(近年,以當屆官方公告為準)**:${E.times}
- **題型**:文字語彙(漢字讀音・表記・語彙用法)／文法(形式判斷・句子重組・文章文法)／讀解(內容理解・情報檢索${/n[12]/.test(lv) ? '・統合/主張理解' : ''})／聽解(課題理解・重點理解・概要理解・即時應答)。

### 各科拿分策略
${STRATEGY[lv].map(s => `- ${s}`).join('\n')}

---

## 每天 30 分鐘怎麼分(打底期)

| 時段 | 做什麼 | 工具 |
|---|---|---|
| 暖身 5′ | 複習昨天標「不熟／不會」的字 | 快速背單字 → 今日複習 |
| 主餐 12′ | 今天約 ${perDay} 個新單字(翻卡＋打字題各一輪) | 快速背單字 → 今日 |
| 配菜 10′ | 今天 1–2 個文法點,讀接續＋造一句 | 文法練習 → 今日學習 |
| 收尾 3′ | 答錯的自動進生詞本,掃一眼 | 自動 |

> 每週抓一天「機動日」:不學新的,只清 SRS 複習佇列＋補落後進度。連續紀錄比進度更重要。

---

## 打底期(第 1–8 週)— 文法精讀 × 單字區間

`;

  for (let w = 0; w < FOUND_WEEKS; w++) {
    const gs = gWeeks[w], vs = vWeeks[w];
    const cats = [...new Set(gs.map(g => g.cat))];
    const first = vs[0], last = vs[vs.length - 1];
    const samples = vs.filter((_, i) => i % Math.ceil(vs.length / 6) === 0).slice(0, 6);
    md += `### W${w + 1}｜${cats.join('・')}\n\n`;
    md += `**本週文法(${gs.length} 點,附接續與例句):**\n\n`;
    gs.forEach((g, i) => {
      const eg = g.eg && g.eg[0] ? `例:${strip(g.eg[0].j)}（${g.eg[0].z}）` : '';
      md += `${i + 1}. **${g.t}**\n`;
      md += `   - 接續:${g.p}\n`;
      md += `   - 意味:${strip(g.ex)}\n`;
      if (eg) md += `   - ${eg}\n`;
    });
    md += `\n**本週單字**:第 ${first.n}–${last.n} 字（\`${first.w}(${first.r})\` → \`${last.w}(${last.r})\`），約 ${Math.ceil(vs.length / 6)}/天。\n`;
    md += `抽樣重點詞:${samples.map(s => `${s.w}(${s.r})=${s.m}`).join('、')}。\n\n`;
  }

  md += `> 到此 ${grammar.length} 文法點 + ${vocab.length} 單字全部觸及一輪。單字詞性分布:${posSpread(vocab)}。\n`;

  // 易混淆(N2/N3 才有)
  if (cfs.length) {
    md += `
---

## 最愛考的易混淆(${cfs.length} 組,實戰期穿插複習)

這些一字之差是 ${LV} 選擇題的送分／扣分關鍵,別等考前才碰。以下列出組別,詳解在網站「易混淆比較」:

`;
    cfs.slice(0, 20).forEach(c => {
      const words = c.words.map(w => w.w).join('／');
      md += `- **${words}** — ${strip(c.tip).split('。')[0]}。\n`;
    });
    if (cfs.length > 20) md += `- …其餘 ${cfs.length - 20} 組見網站。\n`;
  }

  // 實戰 / 衝刺 / 檢核 / 考前 / 報名 / 壓縮
  md += `
---

## 實戰期(第 9–11 週)

- **W9 模考第一輪**:隔天一回「${LV} 語言知識」模考,錯題自動進 SRS;非模考日清複習佇列。目標:熟悉題型與作答節奏,不求高分。
- **W10 讀解＋聽力主攻**:每天讀解 1 篇(先看題目再讀文)＋聽力 15 分鐘,聽力務必「逐句對答案」揪出沒聽懂的那句。${/n[12]/.test(lv) ? '讀解是你最大的分數池,速度要練起來。' : ''}
- **W11 完整計時模考**:每 2–3 天一回含聽力的全套,嚴格計時,練 ${E.combined ? '整場' : '各科'}時間分配。對完檢討:哪一科接近最低標,下週衝刺就補那科。

## 衝刺期(第 12–13 週)

- **W12 只打弱點**:停止背新字;只複習 SRS 標「不熟／不會」;每天一回聽力;把打底期造不出例句的文法(自評標★的)重看一輪。
- **W13(考前一週)**:前 5 天—錯題本＋弱點文法各兩輪;考前 2 天—只做「已會的」建立手感與信心;考前 1 天—休息,確認准考證／交通／文具,早睡。

---

## 每週檢核清單(每週日 15 分鐘)

- [ ] 本週新單字 SRS「已熟」比例 ≥ 70%？低於 → 下週機動日先補複習
- [ ] 本週每個文法點,能不看解釋自己造一句嗎？造不出的標 ★,列入 W12 重看
- [ ] 進度有沒有落後上表？落後 → 機動日補;超前 → 多做一篇讀解
- [ ] 連續 2 天沒開？把目標降到「只複習不學新的」,先保住連續紀錄
${!E.combined ? '- [ ] (W9 起)模考三科有沒有哪科接近 19 分最低標？有 → 那科變下週主攻\n' : ''}
---

## 考前 10 天弱點衝刺

1. **停止背新單字**——現在背的考前來不及複習第二次,只會擠掉該複習的
2. **每天一回計時模考**——練的是配速與專注力,不是新知識
3. **聽力每天 15 分鐘**——${LV} 聽力語速固定,靠每天聽維持耳感
4. **文法錯題本重做兩輪**——文法選擇是最好拉回來的分
5. **考前一天**:不碰難題,只翻已會的建立信心;備好證件文具;睡飽

---

## 報名／考務時程(台灣考區,務必以官方公告為準)

- **報名**:考前約 2.5 個月開放(12 月場 → 9 月上旬開放、**9 月中截止**),名額有限,開放就報
- **准考證**:考前約 2 週開放列印
- **考試當天必帶**:身分證正本＋准考證＋2B 鉛筆＋橡皮擦＋手錶(考場不一定有時鐘)

---

## 壓縮版(晚加入怎麼調)

| 剩餘天數 | 調整 |
|---|---|
| 60 天 | 打底壓到 5 週:單字 ×1.5 速、文法每天 2 點;實戰 2 週、衝刺 1 週 |
| 45 天 | 打底 3.5 週(單字 ×2 速)＋實戰 1.5 週＋衝刺 1 週,週末不休 |
| 30 天 | 放棄「背完」,改模考驅動:每天一回模考 → 只補模考錯的單字與文法,聽力天天聽 |

---
*本計畫由 stayjp.study 題庫自動生成,文法與單字內容與網站一致;考試結構為 JLPT 官方公開資訊,時間與報名細節以當屆主辦單位公告為準。*
`;
  return md;
}

// 結構化資料(給 Firestore 上傳用;閱讀頁 sprint-plan.html 依權限渲染)
function buildData(lv) {
  const LV = lv.toUpperCase();
  const grammarRaw = loadGrammar(lv);
  const vocab = loadVocab(lv);
  const cfs = loadConfusables(lv);
  const catOrder = [];
  grammarRaw.forEach(g => { if (!catOrder.includes(g.cat)) catOrder.push(g.cat); });
  const grammar = catOrder.flatMap(c => grammarRaw.filter(g => g.cat === c));
  const gWeeks = chunk(grammar, FOUND_WEEKS);
  const vWeeks = chunk(vocab.map((w, i) => ({ ...w, n: i + 1 })), FOUND_WEEKS);
  const perDay = Math.ceil(vocab.length / FOUND_WEEKS / 6);
  const E = EXAM[lv];

  const weeks = gWeeks.map((gs, w) => {
    const vs = vWeeks[w];
    const step = Math.ceil(vs.length / 6);
    return {
      n: w + 1,
      free: w === 0,   // W1 免費試讀
      cats: [...new Set(gs.map(g => g.cat))],
      grammar: gs.map(g => ({ t: g.t, p: g.p, ex: strip(g.ex), eg: g.eg && g.eg[0] ? { j: strip(g.eg[0].j), z: g.eg[0].z } : null })),
      vocab: { from: vs[0].n, to: vs[vs.length - 1].n, fw: vs[0].w, fr: vs[0].r, lw: vs[vs.length - 1].w, lr: vs[vs.length - 1].r, perDay: step,
        samples: vs.filter((_, i) => i % step === 0).slice(0, 6).map(s => ({ w: s.w, r: s.r, m: s.m })) },
    };
  });

  return {
    level: LV, pass: E.pass, combined: E.combined, times: E.times,
    // Firestore 不允許巢狀陣列 → 轉成物件陣列
    sections: E.sections.map(s => ({ name: s[0], max: s[1], min: s[2] })), strategy: STRATEGY[lv],
    counts: { vocab: vocab.length, grammar: grammar.length, confusables: cfs.length },
    perDay, heavyVocab: vocab.length > 1500,
    confusables: cfs.map(c => ({ words: c.words.map(w => w.w), tip: strip(c.tip).split('。')[0] })),
    weeks,
  };
}

const all = {};
for (const lv of LEVELS) {
  writeFileSync(join(ROOT, `SPRINT-${lv.toUpperCase()}.md`), build(lv));
  all[lv] = buildData(lv);
  console.log(`✓ SPRINT-${lv.toUpperCase()}.md`);
}
writeFileSync(join(ROOT, 'sprint-content.json'), JSON.stringify(all));
console.log('✓ sprint-content.json（結構化,供上傳 Firestore;已 gitignore）');
