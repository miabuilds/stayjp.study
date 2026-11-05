// 三種難度改寫 — 本機版(Mia 2026-11-05:「能用本機就用本機跑不用錢」):不打 API,改叫本機 claude -p(走訂閱)。
// 提示、驗證、輸出格式與 gen-article-variants.mjs 完全相同;一次可跑多篇:
//   node scripts/gen-article-variants-local.mjs <outDir> [原文id ...]      # 不給 id = 所有還沒有改寫版的原文
//   目標等級自動:n5→n3,n2;n4→n3,n2;n3→n4,n2;n2→n4,n3;n1→n4,n3(簡單版一律 n4,不做 n5)
// 已存在 outDir/<id>.json 的跳過,可以中斷重跑。失敗寫 outDir/_fail.log。
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
const [outDir, ...ids] = process.argv.slice(2);
if (!outDir) { console.error('用法: node scripts/gen-article-variants-local.mjs <outDir> [原文id ...]'); process.exit(1); }
fs.mkdirSync(outDir, { recursive: true });
const A = new Function('window', fs.readFileSync('articles.js', 'utf8') + ';return window.ARTICLES')({});
const hasV = new Set(A.filter(a => a.variant_of).map(a => a.variant_of));
const TARGETS = { n5: ['n3', 'n2'], n4: ['n3', 'n2'], n3: ['n4', 'n2'], n2: ['n4', 'n3'], n1: ['n4', 'n3'] };
const bases = (ids.length ? ids.map(id => A.find(a => a.id === id)).filter(Boolean) : A.filter(a => !a.variant_of && !hasV.has(a.id)));
const LV = {
  n4: 'N4:3 段共 8~11 句(body 只用 2 個 \\n 分成 3 段)。文法只用 N5~N4(て形、たら、ので、可能形、〜そうだ、〜ようにする 等),詞彙以 N4 以下為主;難的專有名詞可以留但換成好懂的說法帶過。每句 15~35 字,一句只講一件事。body 不加空格。',
  n3: 'N3:3~4 段共 10~14 句。文法到 N3(〜ように、〜わけではない、〜ことにする、〜によって、〜ため 等),詞彙到 N3;每句 20~45 字。body 不加空格。',
  n2: 'N2:4 段共 12~16 句,說明文/評論語氣,用 N2 文法(〜に伴って、〜ざるを得ない、〜に対して、〜とは限らない 等)與較抽象的詞彙,可以多一點背景說明或觀點;每句 25~55 字。body 不加空格。',
};
function prompt(base, lv) {
  return `你是給台灣學習者寫 JLPT 分級日文的老師。把下面這篇 ${base.level.toUpperCase()} 文章改寫成 ${lv.toUpperCase()} 版本。
這是「同一篇文章的不同難度」:讀者會在三種難度間切換,所以
- 講同一件事、同樣的事實與情節順序、同樣的實用資訊,不要新增原文沒有的具體事實(數字、規定、地名);改難時可以多寫背景解釋或觀點,改簡單時可以省略細節
- 日文要自然,像日本人寫給學習者的文章,不要逐句硬翻原文
程度規則:${LV[lv]}
格式要求(嚴格 JSON,不要其他文字、不要 markdown code fence):
{"title":"日文標題(可沿用或依程度調整)","title_zh":"繁中標題","title_en":"English title",
 "body":"段落之間用 \\n 分隔(不要空行;同一段的句子接在一起,不要一句一行)",
 "trans":["每段對應的繁中翻譯(段數與 body 相同)"],"trans_en":["每段英文翻譯(段數相同)"],
 "vocab":[{"w":"單字(表記)","r":"讀音(平假名)","m":"繁中意思","m_en":"English"}],
 "grammar":[{"t":"〜文型","note":"繁中說明+引用文中例句(用「」包)","t_en":"pattern","note_en":"English note"}]}
vocab 8~10 個,選文中出現、對 ${lv.toUpperCase()} 學習者有用的詞;r 必須是文中該詞的實際讀音。grammar 3~4 個 ${lv.toUpperCase()} 程度、文中真的用到的。
「」裡面不要放 。！？(切句靠這三個符號)。不要用任何工具,直接輸出 JSON。

原文:
${JSON.stringify({ title: base.title, title_zh: base.title_zh, body: base.body, trans: base.trans })}
請輸出 JSON。`;
}
let ok = 0, fail = 0, skip = 0;
for (const base of bases) {
  if (base.variant_of) { console.log(base.id, '本身是改寫版,跳過'); continue; }
  for (const lv of TARGETS[base.level] || []) {
    const id = `${base.id}-${lv}`, out = `${outDir}/${id}.json`;
    if (fs.existsSync(out) || A.some(a => a.id === id)) { skip++; continue; }
    const t0 = Date.now();
    const r = spawnSync('claude', ['-p', '--model', 'claude-sonnet-5-5', '--max-turns', '1', '--tools', ''], { input: prompt(base, lv), encoding: 'utf8', maxBuffer: 1 << 24, timeout: 10 * 60e3 });
    const txt = String(r.stdout || '');
    try {
      if (r.status !== 0 && !txt.includes('{')) throw new Error('claude exit ' + r.status + ' ' + String(r.stderr || '').slice(0, 200));
      const g = JSON.parse(txt.slice(txt.indexOf('{'), txt.lastIndexOf('}') + 1));
      const paras = String(g.body || '').split('\n').map(s => s.trim()).filter(Boolean);
      if (!paras.length || paras.length !== g.trans.length || paras.length !== g.trans_en.length) throw new Error(`para mismatch ${paras.length}/${g.trans?.length}/${g.trans_en?.length}`);
      if (!Array.isArray(g.vocab) || g.vocab.length < 6 || !Array.isArray(g.grammar) || g.grammar.length < 3) throw new Error('vocab/grammar short');
      for (const v of g.vocab) if (!v.w || !v.r || !v.m) throw new Error('vocab field missing');
      const j = { id, variant_of: base.id, level: lv, topic: base.topic, topic_en: base.topic_en, title: g.title, title_zh: g.title_zh, title_en: g.title_en,
        body: paras.join('\n'), trans: g.trans, trans_en: g.trans_en, vocab: g.vocab, grammar: g.grammar };
      fs.writeFileSync(out, JSON.stringify(j, null, 1));
      ok++; console.log(id, 'ok', `${Math.round((Date.now() - t0) / 1000)}s`, 'paras', paras.length, 'sents', (j.body.match(/[。！？]/g) || []).length, 'vocab', j.vocab.length, 'grammar', j.grammar.length);
    } catch (e) {
      fail++; console.error(id, 'FAIL', e.message);
      fs.appendFileSync(`${outDir}/_fail.log`, `${new Date().toISOString()} ${id} ${e.message}\n---\n${txt.slice(0, 2000)}\n\n`);
    }
  }
}
console.log(`done ok ${ok} fail ${fail} skip ${skip}`);
