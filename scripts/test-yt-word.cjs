// node scripts/test-yt-word.cjs
// YouTube 跟讀字幕「每個詞都能點」(yt-word.js)的回歸測試。
// 字幕資料 = scripts/yt-ruby.mjs(kuromoji)對這些句子的真實輸出(tk 表層/讀音/原形 + tp 詞性/原形)。
// 字典 = 頁面背景補完後的 VOCAB_N5~N1 + 文章補充字典 + kana-lookup 精選字。
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const YW = require(path.join(ROOT, 'yt-word.js'));
const KL = require(path.join(ROOT, 'kana-lookup.js'));

function loadVocab(lv) {
  const src = fs.readFileSync(path.join(ROOT, 'vocab-' + lv + '.js'), 'utf8');
  return new Function(src + ';return VOCAB_' + lv.toUpperCase() + ';')();
}
const G = { KanaLookup: KL };
['n5', 'n4', 'n3', 'n2', 'n1'].forEach(lv => { G['VOCAB_' + lv.toUpperCase()] = loadVocab(lv); });
const win = {}; new Function('window', fs.readFileSync(path.join(ROOT, 'article-dict.js'), 'utf8'))(win);
G.ARTICLE_DICT = win.ARTICLE_DICT;
const lookup = YW.makeLookup(G);

const L = (ja, tk, tp) => ({ ja, tk, tp });
const FX = {
  asobu: L("今日は公園で友達と遊びました。", ["今日\tきょう","は","公園\tこうえん","で","友達\tともだち","と","遊び\tあそび\t遊ぶ","まし","た","。"], ["N","P","N","P","N","P","V\t遊ぶ","X\tます","X","S"]),
  konbini: L("コンビニでコーヒーを買って、ちょっと休みます。", ["コンビニ","で","コーヒー","を","買っ\tかっ\t買う","て","、","ちょっと","休み\tやすみ\t休む","ます","。"], ["N","P","N","P","V\t買う","P","S","D","V\t休む","X","S"]),
  nani: L("昨日、なにをしましたか？", ["昨日\tきのう","、","なに","を","し","まし","た","か","？"], ["N","S","N","P","V\tする","X\tます","X","P","S"]),
  oishii: L("すごくおいしかったです。", ["すごく","おいしかっ","た","です","。"], ["A\tすごい","A\tおいしい","X","X","S"]),
  cake: L("バスクチーズケーキとブレンドをください。", ["バスクチーズケーキ","と","ブレンド","を","ください","。"], ["N","P","N","P","V\tくださる","S"]),
  benkyo: L("日本語を勉強しています。", ["日本語\tにほんご","を","勉強\tべんきょう","し","て","い","ます","。"], ["N","P","N","V\tする","P","x\tいる","X","S"]),
  arigato: L("ありがとうございます。", ["ありがとう","ござい","ます","。"], ["I","X\tござる","X","S"]),
  mukashi: L("むかしむかし、あるところに", ["むかし","むかし","、","ある","ところ","に"], ["N","N","S","R","n","P"]),
  tobira: L("この扉を開けて", ["この","扉\tとびら","を","開け\tあけ\t開ける","て"], ["R","N","P","V\t開ける","P"]),
  ii: L("いいですね", ["いい","です","ね"], ["A\t言う","X","P"]),   // kuromoji 偶爾把いい判成 言う → FIX_BASE 修回
  kurashi: L("しあわせにくらしました", ["しあわせ","に","くらし","まし","た"], ["N","P","V\tくらす","X\tます","X"]),
  tamage: L("たまげてしまいました", ["たまげ","て","しまい","まし","た"], ["V\tたまげる","P","x\tしまう","X\tます","X"]),
  hyaku: L("100人がいます", ["100","人\tにん","が","い","ます"], ["S","n","P","V\tいる","X"]),
  wakari: L("わかりました、やってみます", ["わかり","まし","た","、","やっ","て","み","ます"], ["V\tわかる","X\tます","X","S","V\tやる","P","x\tみる","X"]),
  frag: L("ゃいけないって", ["ゃいけないって"], ["N"]),   // 真實資料裡 kuromoji 切出的碎片(なきゃ|ゃいけない…)
  // 舊快取(沒有 tp):只能靠表層
  oldHana: L("これは花です。", ["これ","は","花\tはな","です","。"], undefined),
  oldKata: L("ファミレスでランチ", ["ファミレス","で","ランチ"], undefined),
  oldFrag: L("いってきます", ["いっ","て","き","ます"], undefined),
  latin: L("Nihongo-LearningのYutaです。", ["Nihongo","-","Learning","の","Yuta","です","。"], ["N","N","N","P","N","X","S"]),
  mismatch: L("これは花です。", ["これ","は","花\tはな","です","。"], ["N","P"]),   // tp 長度不符 → 當沒 tp
};

let pass = 0, fail = 0;
function seg(name) { return YW.segments(FX[name], lookup); }
function find(name, t) { const s = seg(name).find(x => x.t === t); if (!s) throw new Error('no token ' + t + ' in ' + name); return s; }
function check(label, cond, info) { if (cond) pass++; else { fail++; console.log('FAIL', label, info !== undefined ? JSON.stringify(info) : ''); } }
const tapped = name => seg(name).filter(x => x.tap).map(x => x.t);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// 1. 助詞/助動詞不畫虛線,內容詞全部可點
check('particles plain (遊ぶ)', eq(tapped('asobu'), ['今日', '公園', '友達', '遊び']), tapped('asobu'));
// 2. 漢字活用動詞 → 原形查 + 活用形標籤
{ const s = find('asobu', '遊び'); check('kanji verb → base 遊ぶ', s.w === '遊ぶ' && s.m && s.f === '活用形' && s.rd === 'あそび', s); }
// 3. 片假名詞(字庫有)
{ const s = find('konbini', 'コーヒー'); check('katakana known コーヒー', s.tap && s.m && s.r === 'コーヒー' && !s.u, s); }
// 4. コンビニ(kana-lookup 精選字 / 字庫)
{ const s = find('konbini', 'コンビニ'); check('katakana コンビニ meaning', s.tap && s.m, s); }
// 5. 副詞 ちょっと
{ const s = find('konbini', 'ちょっと'); check('adverb ちょっと', s.tap && s.m, s); }
check('konbini tapped set', eq(tapped('konbini'), ['コンビニ', 'コーヒー', '買っ', 'ちょっと', '休み']), tapped('konbini'));
// 6. 假名活用形容詞 → 原形 おいしい
{ const s = find('oishii', 'おいしかっ'); check('kana adj おいしかっ → おいしい', s.tap && s.w === 'おいしい' && s.m && s.f === '活用形', s); }
{ const s = find('oishii', 'すごく'); check('kana adj すごく → すごい', s.tap && s.w === 'すごい' && s.m, s); }
check('oishii aux plain', eq(tapped('oishii'), ['すごく', 'おいしかっ']), tapped('oishii'));
// 7. 未收錄片假名 → 可點、u 旗標(外來語・字典沒有收錄)、讀音=本身
{ const s = find('cake', 'バスクチーズケーキ'); check('unknown katakana', s.tap && s.u && !s.m && s.r === 'バスクチーズケーキ' && s.w === 'バスクチーズケーキ', s); }
// 8. 勉強|し|て|い|ます:サ變的し/て/いる/ます 都不標
check('benkyo only content', eq(tapped('benkyo'), ['日本語', '勉強']), tapped('benkyo'));
// 9. ありがとう(感嘆詞)可點,ござい/ます 不標
check('arigato', eq(tapped('arigato'), ['ありがとう']) && find('arigato', 'ありがとう').m, tapped('arigato'));
// 10. 平假名寫的漢字詞 → 依讀音推測(昔),非自立名詞ところ不標
{ const s = seg('mukashi')[0]; check('hiragana むかし (article dict)', s.tap && s.m, s); }
{ const s = find('kurashi', 'しあわせ'); check('hiragana しあわせ → 幸せ (guess)', s.tap && s.w === '幸せ' && s.f === '依讀音推測' && s.m, s); }
check('mukashi ところ plain', !find('mukashi', 'ところ').tap);
// 11. 未收錄漢字詞 → 可點、沒意思、讀音=kuromoji 讀音(彈窗走辭典連結)
{ const s = find('tobira', '扉'); check('kanji word present', s.tap && s.r === 'とびら', s); }
// 12. 連体詞 この
check('rentai この', find('tobira', 'この').tap && find('tobira', 'この').m);
// 13. いい 被判成 言う → 修回 いい
{ const s = find('ii', 'いい'); check('いい not 言う', s.tap && s.w === 'いい', s); }
// 14. 片假名詞不進讀音索引:くらし ≠ クラス
{ const s = find('kurashi', 'くらし'); check('くらし not クラス', s.tap && s.w !== 'クラス', s); }
// 15. 未收錄假名動詞 → 原形 たまげる、沒意思但可點;しまい(非自立)不標
{ const s = find('tamage', 'たまげ'); check('unknown kana verb → base', s.tap && s.w === 'たまげる' && !s.m && s.f === '活用形', s); }
check('tamage しまい plain', !find('tamage', 'しまい').tap);
// 16. 數字不標;單一假名 い(いる)不標
check('number plain', !find('hyaku', '100').tap && !find('hyaku', 'い').tap);
// 17. わかり → 分かる;やっ → やる;み(非自立)不標
{ const s = find('wakari', 'わかり'); check('わかり → 分かる', s.tap && s.w === '分かる' && s.m, s); }
check('wakari set', eq(tapped('wakari'), ['わかり', 'やっ']), tapped('wakari'));
// 18. 小字開頭碎片不標
check('fragment plain', tapped('frag').length === 0, tapped('frag'));
// 19. 舊快取(無 tp):これ 可點、は/です 不標、花 可點
check('old cache', eq(tapped('oldHana'), ['これ', '花']), tapped('oldHana'));
// 20. 舊快取片假名:ファミレス 未收錄 → u;ランチ
{ const s = find('oldKata', 'ファミレス'); check('old cache katakana unknown', s.tap && s.u, s); }
// 21. 舊快取活用碎片 いっ/き 不標(寧缺勿錯)
check('old cache fragments plain', tapped('oldFrag').length === 0, tapped('oldFrag'));
// 22. 英文不標
check('latin plain', tapped('latin').length === 0, tapped('latin'));
// 23. tp 長度不符 → 退回表層規則
check('tp mismatch fallback', eq(tapped('mismatch'), ['これ', '花']), tapped('mismatch'));
// 24. 沒 tk → null(呼叫端退回 furiganaHTML)
check('no tk → null', YW.segments({ ja: 'それじゃ' }, lookup) === null);
// 25. 片段串回去 = 原句(不吃字)
for (const k in FX) { const s = YW.segments(FX[k], lookup); check('roundtrip ' + k, s.map(x => x.t).join('') === FX[k].ja, s.map(x => x.t).join('')); }
// 26. 每個可點片段都有 w;有意思的必有讀音
for (const k in FX) for (const s of YW.segments(FX[k], lookup)) if (s.tap) check('shape ' + k + ' ' + s.t, s.w && (!s.m || s.r !== undefined), s);
// 27. 字典只載 N5/N4(背景補完前)也不會炸,查不到的漢字詞照樣可點
{ const lk = YW.makeLookup({ VOCAB_N5: G.VOCAB_N5, VOCAB_N4: G.VOCAB_N4 }); const s = YW.segments(FX.tobira, lk); check('n5n4 only', s.filter(x => x.tap).length === 3, s); }

// 效能:600 句 × 一次重繪
const all = Object.values(FX); const t0 = Date.now();
for (let k = 0; k < 600 * 10; k++) YW.segments(all[k % all.length], lookup);
const ms = Date.now() - t0;
console.log('perf: 6000 句 ' + ms + 'ms');
check('perf', ms < 1500, ms);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
