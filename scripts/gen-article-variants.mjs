// 三種難度(2026-10-20,參考 LevelRead「同一則新聞三種難度」):把既有文章改寫成別的等級,同一件事、同樣事實。
// 產出的 JSON 跟 gen-articles.mjs 同格式,多 variant_of(原文 id);id = <原文 id>-<等級>,例 a-n4-2-n3。
// 再走 merge-articles.mjs → kuromoji 核讀音 → tts collect/generate → tokenize-articles → gen-article-timings → validate。
// 用法(key 放專案根目錄 .env 的 PROJECT_ANTHROPIC_KEY): node scripts/gen-article-variants.mjs <原文 id> <目標等級 n4|n3|n2> <out.json>
// 簡單版一律用 n4(不用 n5:n5 要空格分詞塊,改寫品質不穩)。
import fs from 'node:fs';
try { process.loadEnvFile(new URL('../.env', import.meta.url)); } catch {}
const KEY = process.env.PROJECT_ANTHROPIC_KEY; if (!KEY) { console.error('no key: 請在專案根目錄 .env 填 PROJECT_ANTHROPIC_KEY'); process.exit(1); }
const [baseId, lv, out] = process.argv.slice(2);
const A = new Function('window', fs.readFileSync('articles.js', 'utf8') + ';return window.ARTICLES')({});
const base = A.find(a => a.id === baseId); if (!base) { console.error('找不到', baseId); process.exit(1); }
if (base.variant_of) { console.error(baseId, '本身就是改寫版,請用原文 id'); process.exit(1); }
if (!['n4', 'n3', 'n2'].includes(lv) || lv === base.level) { console.error('目標等級要是 n4/n3/n2 且不同於原文', base.level); process.exit(1); }
const id = `${baseId}-${lv}`;
const LV = {
  n4: 'N4:3 段共 8~11 句(body 只用 2 個 \\n 分成 3 段)。文法只用 N5~N4(て形、たら、ので、可能形、〜そうだ、〜ようにする 等),詞彙以 N4 以下為主;難的專有名詞可以留但換成好懂的說法帶過。每句 15~35 字,一句只講一件事。body 不加空格。',
  n3: 'N3:3~4 段共 10~14 句。文法到 N3(〜ように、〜わけではない、〜ことにする、〜によって、〜ため 等),詞彙到 N3;每句 20~45 字。body 不加空格。',
  n2: 'N2:4 段共 12~16 句,說明文/評論語氣,用 N2 文法(〜に伴って、〜ざるを得ない、〜に対して、〜とは限らない 等)與較抽象的詞彙,可以多一點背景說明或觀點;每句 25~55 字。body 不加空格。',
};
const sys = `你是給台灣學習者寫 JLPT 分級日文的老師。把下面這篇 ${base.level.toUpperCase()} 文章改寫成 ${lv.toUpperCase()} 版本。
這是「同一篇文章的不同難度」:讀者會在三種難度間切換,所以
- 講同一件事、同樣的事實與情節順序、同樣的實用資訊,不要新增原文沒有的具體事實(數字、規定、地名);改難時可以多寫背景解釋或觀點,改簡單時可以省略細節
- 日文要自然,像日本人寫給學習者的文章,不要逐句硬翻原文
程度規則:${LV[lv]}
格式要求(嚴格 JSON,不要其他文字):
{"title":"日文標題(可沿用或依程度調整)","title_zh":"繁中標題","title_en":"English title",
 "body":"段落之間用 \\n 分隔(不要空行;同一段的句子接在一起,不要一句一行)",
 "trans":["每段對應的繁中翻譯(段數與 body 相同)"],"trans_en":["每段英文翻譯(段數相同)"],
 "vocab":[{"w":"單字(表記)","r":"讀音(平假名)","m":"繁中意思","m_en":"English"}],   // 8~10 個,選文中出現、對 ${lv.toUpperCase()} 學習者有用的詞;r 必須是文中該詞的實際讀音
 "grammar":[{"t":"〜文型","note":"繁中說明+引用文中例句(用「」包)","t_en":"pattern","note_en":"English note"}]}   // 3~4 個 ${lv.toUpperCase()} 程度、文中真的用到的
「」裡面不要放 。！？(切句靠這三個符號)。`;
const user = '原文:\n' + JSON.stringify({ title: base.title, title_zh: base.title_zh, body: base.body, trans: base.trans }) + '\n請輸出 JSON。';
const r = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': KEY, 'anthropic-version': '2023-06-01' },
  body: JSON.stringify({ model: 'claude-sonnet-5-5', max_tokens: 9000, system: sys, messages: [{ role: 'user', content: user }] }) });
const d = await r.json(); if (d.error) { console.error(id, 'API error', JSON.stringify(d.error)); process.exit(3); }
const txt = (d.content || []).filter(c => c.type === 'text').map(c => c.text).join('');
const g = JSON.parse(txt.slice(txt.indexOf('{'), txt.lastIndexOf('}') + 1));
const paras = g.body.split('\n').map(s => s.trim()).filter(Boolean);
if (paras.length !== g.trans.length || paras.length !== g.trans_en.length) { console.error(id, 'para mismatch', paras.length, g.trans.length, g.trans_en.length); process.exit(2); }
if (!Array.isArray(g.vocab) || g.vocab.length < 6 || !Array.isArray(g.grammar) || g.grammar.length < 3) { console.error(id, 'vocab/grammar short'); process.exit(2); }
const j = { id, variant_of: baseId, level: lv, topic: base.topic, topic_en: base.topic_en, title: g.title, title_zh: g.title_zh, title_en: g.title_en,
  body: paras.join('\n'), trans: g.trans, trans_en: g.trans_en, vocab: g.vocab, grammar: g.grammar };
fs.writeFileSync(out, JSON.stringify(j, null, 1));
console.log(id, 'ok', j.title, 'paras', paras.length, 'sents', (j.body.match(/[。！？]/g) || []).length, 'vocab', j.vocab.length, 'grammar', j.grammar.length);
