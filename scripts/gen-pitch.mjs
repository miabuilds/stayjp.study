// 產生 N5/N4 單字的標準語音高(アクセント核)資料 → pitch-accent.js(window.PITCH = {"字|讀音": 核位置}, 0=平板型)。
// 用法: ANTHROPIC_API_KEY=... node scripts/gen-pitch.mjs [n5 n4]
// 模型:claude-sonnet-5。每批 40 字。輸出前會跟 SPOT(常見字已知答案)比對印出正確率,低於 90% 別上線。
import fs from 'fs';
const KEY = process.env.ANTHROPIC_API_KEY; if (!KEY) { console.error('no key'); process.exit(1); }
const levels = process.argv.slice(2).length ? process.argv.slice(2) : ['n5', 'n4'];
const out = fs.existsSync('pitch-accent.js') ? JSON.parse(fs.readFileSync('pitch-accent.js', 'utf8').replace(/^[^{]*/, '').replace(/;\s*$/, '')) : {};
function loadVocab(lv) {
  const src = fs.readFileSync(`vocab-${lv}.js`, 'utf8');
  const items = [];
  for (const m of src.matchAll(/\{w:"([^"]+)",r:"([^"]*)",m:"([^"]*)"/g)) items.push({ w: m[1], r: m[2], m: m[3] });
  return items;
}
async function ask(batch) {
  const list = batch.map((v, i) => `${i + 1}. ${v.w}（${v.r}）${v.m}`).join('\n');
  const body = {
    model: 'claude-sonnet-5', max_tokens: 6000,   // sonnet-5 會先 thinking(40 字約 3~4k tokens),太小只剩 thinking 沒答案
    system: '你是日語音韻學專家,精通 NHK 日本語発音アクセント新辞典。對每個單字給出東京標準語的アクセント核位置(拍/モーラ數,0=平板型・尾高型以核在最後一拍表示)。動詞、形容詞用辭書形;名詞用單獨發音時的型。有兩種常見型時給最常用的。只輸出 JSON 物件:{"編號":核位置數字},不要任何其他文字。',
    messages: [{ role: 'user', content: list }],
  };
  const r = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': KEY, 'anthropic-version': '2023-06-01' }, body: JSON.stringify(body) });
  const d = await r.json();
  const txt = (d.content || []).map(c => c.text || '').join('');
  const j = txt.slice(txt.indexOf('{'), txt.lastIndexOf('}') + 1);
  return JSON.parse(j);
}
// 已知答案抽查(NHK):
const SPOT = { '私|わたし': 0, '雨|あめ': 1, '橋|はし': 2, '箸|はし': 1, '花|はな': 2, '鼻|はな': 0, '桜|さくら': 0, '先生|せんせい': 3, '学生|がくせい': 0, '食べる|たべる': 2, '書く|かく': 1, '高い|たかい': 2, '新しい|あたらしい': 4, '日本|にほん': 2, '電車|でんしゃ': 0, '会社|かいしゃ': 0, '時間|じかん': 0, '明日|あした': 3, '今日|きょう': 1, '猫|ねこ': 1, '犬|いぬ': 2, '心|こころ': 3, '男|おとこ': 3, '女|おんな': 3, '朝|あさ': 1, '夜|よる': 1, '海|うみ': 1, '山|やま': 2, '川|かわ': 2, '空|そら': 1 };
let done = 0, total = 0;
for (const lv of levels) {
  const items = loadVocab(lv).filter(v => !(`${v.w}|${v.r}` in out));
  total += items.length;
  for (let i = 0; i < items.length; i += 25) {
    const batch = items.slice(i, i + 25);
    try {
      const res = await ask(batch);
      batch.forEach((v, k) => { const a = res[String(k + 1)]; if (typeof a === 'number' && a >= 0 && a <= 12) out[`${v.w}|${v.r}`] = a; });
      done += batch.length;
      fs.writeFileSync('pitch-accent.js', '// 標準語音高(アクセント核位置;0=平板型)。scripts/gen-pitch.mjs 以 claude-sonnet-5 依 NHK 辭典知識批次產生,抽查正確率見腳本輸出。\nwindow.PITCH=' + JSON.stringify(out) + ';\n');
      console.log(lv, `${done}/${total}`);
    } catch (e) { console.error('batch fail', lv, i, e.message); }
  }
}
let hit = 0, n = 0; for (const [k, v] of Object.entries(SPOT)) if (k in out) { n++; if (out[k] === v) hit++; else console.log('MISS', k, 'got', out[k], 'want', v); }
console.log('SPOT', hit + '/' + n, 'total', Object.keys(out).length);
