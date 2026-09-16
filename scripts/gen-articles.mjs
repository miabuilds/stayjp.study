// 產新文章(claude-sonnet-5)→ JSON(scratch),再由人審 + merge 進 articles.js。
// 用法: ANTHROPIC_API_KEY=… node scripts/gen-articles.mjs <level> <id> <topic 繁中> <topic_en> <題目提示> <out.json>
import fs from 'node:fs';
const KEY = process.env.ANTHROPIC_API_KEY; if (!KEY) { console.error('no key'); process.exit(1); }
const [lv, id, topic, topicEn, hint, out] = process.argv.slice(2);
const A = new Function('window', fs.readFileSync('articles.js', 'utf8') + ';return window.ARTICLES')({});
const existingTitles = A.map(a => a.title).join(' / ');
const sample = A.filter(a => a.level === lv).slice(-1)[0];
const LV = {
  n5: 'N5:6~8 句,ます形/です,詞彙限 N5,每句 8~20 字。body 的每個詞塊之間用半形空格分開(教科書分寫:內容詞・助詞分開,助動詞/語尾接前詞),例:「わたし は まいあさ こうえん を さんぽ します。」漢字可少量用 N5 漢字。',
  n4: 'N4:3 段共 9~12 句,含て形、たら、可能形、授受、〜そうだ;每句 15~35 字。body 不加空格。',
  n3: 'N3:3~4 段共 12~15 句,職場/社會題材,含敬語基礎、〜ように、〜わけではない、〜ことにする 等 N3 文法;每句 20~45 字。body 不加空格。',
  n2: 'N2:4 段共 14~18 句,評論/說明文,含 N2 文法(〜に伴って、〜どころか、〜ざるを得ない 等);每句 25~55 字。',
  n1: 'N1:4 段共 15~18 句,論說/專欄,含 N1 文法與抽象詞彙;每句 30~60 字。',
};
const sys = `你是給台灣學習者寫 JLPT 分級日文短文的老師。寫一篇 ${lv.toUpperCase()} 文章,主題「${topic}」,題目方向:${hint}。
程度規則:${LV[lv]}
格式要求(嚴格 JSON,不要其他文字):
{"id":"${id}","level":"${lv}","topic":"${topic}","topic_en":"${topicEn}","title":"日文標題","title_zh":"繁中標題","title_en":"English title",
 "body":"段落之間用 \\n 分隔(不要空行)",
 "trans":["每段對應的繁中翻譯(段數與 body 相同)"],"trans_en":["每段英文翻譯(段數相同)"],
 "vocab":[{"w":"單字(表記)","r":"讀音(平假名)","m":"繁中意思","m_en":"English"}],   // 8~10 個,選文中出現、對該級學習者有用的詞;r 必須是文中該詞的實際讀音
 "grammar":[{"t":"〜文型","note":"繁中說明+引用文中例句(用「」包)","t_en":"pattern","note_en":"English note"}]}   // 3~4 個,只挑文中真的用到的
內容要求:真實在日生活/職場場景、有小小的起承轉合或一個實用小知識,避免跟這些既有題目重複:${existingTitles.slice(0, 1200)}
參考同級既有文章的語氣與長度(只看風格):${JSON.stringify({ title: sample.title, body: sample.body.slice(0, 300) })}`;
const r = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': KEY, 'anthropic-version': '2023-06-01' },
  body: JSON.stringify({ model: 'claude-sonnet-5', max_tokens: 9000, system: sys, messages: [{ role: 'user', content: '請輸出 JSON。' }] }) });
const d = await r.json();
const txt = (d.content || []).filter(c => c.type === 'text').map(c => c.text).join('');
const j = JSON.parse(txt.slice(txt.indexOf('{'), txt.lastIndexOf('}') + 1));
const paras = j.body.split('\n').filter(Boolean);
if (paras.length !== j.trans.length || paras.length !== j.trans_en.length) { console.error('para mismatch', paras.length, j.trans.length, j.trans_en.length); process.exit(2); }
if (!Array.isArray(j.vocab) || j.vocab.length < 6 || !Array.isArray(j.grammar) || j.grammar.length < 3) { console.error('vocab/grammar short'); process.exit(2); }
j.body = paras.join('\n');
fs.writeFileSync(out, JSON.stringify(j, null, 1));
console.log(id, 'ok', j.title, 'paras', paras.length, 'sents', (j.body.match(/。/g) || []).length, 'vocab', j.vocab.length, 'grammar', j.grammar.length);
