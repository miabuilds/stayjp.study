// 產生「看日文解釋猜單字」用的簡單日文解釋 → jdef.js(window.JDEF = {"字|讀音": {d:"說明(低年級漢字)", k:"全假名版"}})。
// 用戶回饋(2026-10-17 沈昀彤):想要「簡單日文解釋 → 填上對應單字」的填字遊戲。第一期只做 N5/N4。
// 用法(key 放專案根目錄 .env 的 PROJECT_ANTHROPIC_KEY,跑前先驗是新創組織): node scripts/gen-jdef.mjs [n5 n4]
// 檢查:說明裡出現答案(漢字或 ≥2 字的讀音)就丟掉,下一輪重產;最多重試 3 輪。
import fs from 'fs';
try { process.loadEnvFile(new URL('../.env', import.meta.url)); } catch {}
const KEY = process.env.PROJECT_ANTHROPIC_KEY; if (!KEY) { console.error('no key: 請在專案根目錄 .env 填 PROJECT_ANTHROPIC_KEY'); process.exit(1); }
const levels = process.argv.slice(2).length ? process.argv.slice(2) : ['n5', 'n4'];
const OUT = 'jdef.js';
const out = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8').replace(/^[^{]*/, '').replace(/;\s*$/, '')) : {};

function loadVocab(lv) {
  const src = fs.readFileSync(`vocab-${lv}.js`, 'utf8');
  const items = [];
  for (const m of src.matchAll(/\{w:"([^"]+)",r:"([^"]*)",m:"([^"]*)",c:"([^"]*)"/g)) items.push({ w: m[1], r: m[2], m: m[3], c: m[4] });
  return items;
}
const hira = s => String(s || '').replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
// 洩題檢查:漢字寫法整串出現、或讀音(≥2 字,平假名化後)出現 → 不合格。
// 動詞/形容詞連語幹也查(食べる → 食べ),免得說明寫成活用形偷渡答案。
function leaks(v, txt) {
  const t = hira(txt), w = v.w.replace(/〜|～/g, ''), r = hira(v.r.replace(/〜|～/g, ''));
  if (w && txt.includes(w)) return true;
  if (r.length >= 2 && t.includes(r)) return true;
  const stem = s => s.length >= 3 && /[るういくぐすつぬぶむい]$/.test(s) ? s.slice(0, -1) : '';
  const ws = stem(w), rs = stem(r);
  if (ws && /[一-鿿]/.test(ws) && txt.includes(ws)) return true;
  if (rs.length >= 2 && t.includes(rs)) return true;
  return false;
}

const SYSTEM = `あなたは日本語教師です。日本語学習者向けの「説明を読んで単語を当てる」クイズの説明文を書きます。
各単語について次の条件で書いてください。
1. 説明に答えの単語を入れない(漢字・読み・活用形・一部分もだめ)。
2. やさしい日本語:N5〜N4 の語彙と文法だけ。15〜35 字くらい。
3. 辞書のように具体的に、その単語だけが答えになるように書く(例:りんご →「赤くて丸い、あまい果物」)。似た単語と区別できるヒントを入れる。
4. 漢字は小学校1〜2年で習う簡単なものだけ。それ以外はひらがな。
5. 代名詞・あいさつ・助数詞・副詞などは、使う場面で説明する(例:ありがとう →「何かをしてもらったときに言うことば」)。
6. 中国語の意味は、どの意味の単語かを判断するためのヒント。説明には中国語を書かない。
7. "k" は "d" を全部ひらがな・カタカナにしたもの(漢字なし)。
出力は JSON だけ:{"1":{"d":"...","k":"..."},"2":{...}}`;

async function ask(batch) {
  const list = batch.map((v, i) => `${i + 1}. ${v.w}(${v.r})〔${v.c}〕${v.m}`).join('\n');
  const body = { model: 'claude-sonnet-5-5', max_tokens: 12000, system: SYSTEM, messages: [{ role: 'user', content: list }] };
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': KEY, 'anthropic-version': '2023-06-01' }, body: JSON.stringify(body),
  });
  const d = await r.json();
  if (d.error) throw new Error(d.error.message);
  const txt = (d.content || []).map(c => c.text || '').join('');
  return JSON.parse(txt.slice(txt.indexOf('{'), txt.lastIndexOf('}') + 1));
}
function save() {
  fs.writeFileSync(OUT, '// 「看日文解釋猜單字」的簡單日文解釋(key = 字|讀音;d = 說明,k = 全假名版)。scripts/gen-jdef.mjs 產生,說明含答案的已自動排除。\nwindow.JDEF=' + JSON.stringify(out) + ';\n');
}

for (let round = 1; round <= 3; round++) {
  let todo = [];
  for (const lv of levels) todo.push(...loadVocab(lv).filter(v => !(`${v.w}|${v.r}` in out)));
  todo = todo.filter((v, i, a) => a.findIndex(x => x.w === v.w && x.r === v.r) === i);
  if (process.env.LIMIT) todo = todo.slice(0, +process.env.LIMIT);   // 試跑用
  if (!todo.length) break;
  console.log(`round ${round}: ${todo.length} 個`);
  let bad = 0, doneN = 0;
  const starts = []; for (let i = 0; i < todo.length; i += 40) starts.push(i);
  // 同時 4 批(單批 1~2 分鐘,序列跑 1,200 字要一個多小時);每批完成就存檔,中斷重跑會跳過已完成的
  const worker = async () => { while (starts.length) { const i = starts.shift();
    const batch = todo.slice(i, i + 40);
    try {
      const res = await ask(batch);
      batch.forEach((v, k) => {
        const a = res[String(k + 1)];
        if (!a || typeof a.d !== 'string' || typeof a.k !== 'string' || !a.d.trim()) { bad++; return; }
        if (leaks(v, a.d) || leaks(v, a.k)) { bad++; return; }
        out[`${v.w}|${v.r}`] = { d: a.d.trim(), k: a.k.trim() };
      });
      save();
      doneN += batch.length; process.stdout.write(`  ${doneN}/${todo.length}\n`);
    } catch (e) { console.error('batch fail', i, e.message); }
  } };
  await Promise.all([worker(), worker(), worker(), worker()]);
  console.log(`round ${round} 不合格/失敗 ${bad}`);
}
console.log('total', Object.keys(out).length);
