// 產 JLPT 聴解新題(claude-sonnet-5)→ 輸出 JSON 到 scratch,人工/腳本再併進 jlpt-questions.js + jlpt-q-trans.js。
// 用法: ANTHROPIC_API_KEY=... node scripts/gen-jlpt-listening.mjs <level> <startNo> <count> <outfile>
// 風格跟既有題一致:at=朗讀腳本(旁白式,對話用「女の人が言います。「…」男の人が答えます。「…」」),au 同 at,
// q 以【問い】開頭,o 四個日文短選項,a 正解 index,x 詳解(繁中,可用 <b> 標關鍵句、<br> 換行),zh=腳本繁中翻譯。
import fs from 'node:fs';
const KEY = process.env.ANTHROPIC_API_KEY; if (!KEY) { console.error('no key'); process.exit(1); }
const [lv, startNo, count, outfile] = process.argv.slice(2);
const N = parseInt(count, 10) || 6, S = parseInt(startNo, 10) || 21;
const src = fs.readFileSync('jlpt-questions.js', 'utf8');
const existing = [...src.matchAll(/id:'(n[1-5])-l\d+',lv:'n[1-5]',t:'listening',at:'((?:\\.|[^'\\])*)'/g)].filter(m => m[1] === lv).map(m => m[2]);
const LV_DESC = {
  n5: 'N5:每句 1~2 個短句,ます形/です,詞彙限 N5,情境:車站、教室、買東西、約時間、天氣、家人。腳本 40~70 字。',
  n4: 'N4:2~4 句,含て形、たら/ば、可能形、授受;情境:打工、預約、搬家、醫院、學校通知。腳本 70~110 字。',
  n3: 'N3:廣播/店內公告/同事對話,含敬語基礎、條件、逆接;需要「聽出變更/例外」。腳本 100~150 字。',
  n2: 'N2:職場會議、客訴、新聞短訊、說明會,含較長從句、婉轉表達、言外之意。腳本 130~180 字。',
  n1: 'N1:講座節錄、專訪、商務交涉、社論式播報,含抽象名詞、慣用句、話者立場判讀。腳本 160~220 字。',
};
const sys = `你是 JLPT 聴解命題老師。請為 ${lv.toUpperCase()} 出 ${N} 題全新聴解題,程度描述:${LV_DESC[lv]}
規則:
- 每題一個朗讀腳本 at(純日文、標點齊全,不要換行符號;對話用旁白式「女の人が言います。「…」男の人が答えます。「…」」或「店員が言います。」等,方便單人語音合成)。
- q 以「【問い】」開頭,問題要「聽完才知道答案」(時間變更、地點、理由、要做什麼、誰去、幾個等),不要問腳本裡沒有的資訊。
- o 四個簡短日文選項(名詞/時間/短句),只有一個正確;干擾項要是腳本裡有出現或容易混淆的資訊。
- x 詳解用繁體中文,先引用關鍵句(用 <b>…</b> 標),再說明為何錯項不對,可用 <br> 分段。60~140 字。
- zh 腳本的繁體中文翻譯(台灣用語)。
- 題材彼此不重複,也不要跟這些既有腳本重複:${existing.slice(-12).join(' / ').slice(0, 1500)}
只輸出 JSON 陣列,每個元素 {"at":"","q":"","o":["","","",""],"a":0,"x":"","zh":""},不要其他文字。`;
const r = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': KEY, 'anthropic-version': '2023-06-01' },
  body: JSON.stringify({ model: 'claude-sonnet-5', max_tokens: 12000, system: sys, messages: [{ role: 'user', content: `請出 ${N} 題。` }] }) });
const d = await r.json();
const txt = (d.content || []).filter(c => c.type === 'text').map(c => c.text).join('');
const arr = JSON.parse(txt.slice(txt.indexOf('['), txt.lastIndexOf(']') + 1));
const items = arr.slice(0, N).map((it, i) => ({ id: `${lv}-l${S + i}`, lv, ...it }));
// 基本驗形
for (const it of items) {
  if (!it.at || !it.q || !Array.isArray(it.o) || it.o.length !== 4 || typeof it.a !== 'number' || it.a < 0 || it.a > 3 || !it.x || !it.zh) { console.error('bad item', it.id); process.exit(2); }
  if (/\n/.test(it.at)) it.at = it.at.replace(/\s*\n\s*/g, '');
}
fs.writeFileSync(outfile, JSON.stringify(items, null, 1));
console.log(lv, 'ok', items.length, 'answers', items.map(x => x.a).join(''));
