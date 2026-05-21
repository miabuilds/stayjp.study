#!/usr/bin/env node
// 用 Gemini API 評估 scripts/mock-exam-templates-review.md 裡的模板品質。
// 必填環境變數：GEMINI_API_KEY
// 可選：GEMINI_MODEL（預設 gemini-2.5-flash）
//
// 用法：
//   export GEMINI_API_KEY="..."
//   node scripts/review-mock-templates.mjs > /tmp/gemini-review.txt

import fs from 'node:fs';
import path from 'node:path';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) { console.error('Missing GEMINI_API_KEY'); process.exit(1); }
const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const ROOT = path.resolve(import.meta.dirname, '..');
const templates = fs.readFileSync(path.join(ROOT, 'scripts/mock-exam-templates-review.md'), 'utf8');

const prompt = `你是日語教學專家。下面是 JLPT 模考的題目模板列表 — 題目用「模板 + 隨機抽詞」生成。
模板太 specific 會出廢話（例如「毎日___を飲みます」抽到「警官」變「毎日警官を飲みます」）。

請對每個模板判斷：
- **OK**：對該詞性下絕大多數單字都能造合理句子
- **太 specific**：只對某語意子分類合理（飲料/地點/時間/可數物等），請給替換建議或刪除
- **語法怪**：接續格式有問題，請給替換建議

回覆格式（嚴格遵守，方便後續解析）：

\`\`\`
## Type 2 評估

### N5
- "毎日＿＿を飲みます。" → 太 specific（需可喝的詞）→ 替換「＿＿について話しました。」
- "天気が＿＿です。" → OK
（依此類推）

### N4
...

## Type 4 評估

### 名詞
1. "{w}はとても大切です。" → OK
2. ...

### 動詞
...
\`\`\`

不要輸出範例以外的閒聊文字。直接給評估結果。

---

${templates}`;

const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
const body = {
  contents: [{ parts: [{ text: prompt }] }],
  generationConfig: { temperature: 0.3, maxOutputTokens: 8192 },
};

console.error(`Calling Gemini (${model})...`);
const r = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});
if (!r.ok) {
  console.error('Gemini API error:', r.status, await r.text());
  process.exit(1);
}
const j = await r.json();
const text = j.candidates?.[0]?.content?.parts?.[0]?.text || '';
if (!text) {
  console.error('Empty response:', JSON.stringify(j).slice(0, 500));
  process.exit(1);
}
console.error('Done.');
console.log(text);
