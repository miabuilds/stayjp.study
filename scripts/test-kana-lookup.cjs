// node scripts/test-kana-lookup.cjs
// 純假名即點即查比對器(kana-lookup.js)的回歸測試:AI 情境對話常見台詞 + 誤配陷阱。
// 字典 = 對話頁預設載入的 VOCAB_N5 + VOCAB_N4(+ kana-lookup 內建的少量精選詞)。
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const KL = require(path.join(ROOT, 'kana-lookup.js'));

function loadVocab(lv) {
  const src = fs.readFileSync(path.join(ROOT, 'vocab-' + lv + '.js'), 'utf8');
  return new Function(src + ';return VOCAB_' + lv.toUpperCase() + ';')();
}
const idx = KL.buildIndex([loadVocab('n5'), loadVocab('n4')]);

// [句子, 期望被標的詞(依出現順序), AI 附的 WORDS(可省)]
// 期望寫法:'詞' = 從字典/AI 命中;'?詞' = 片假名未收錄(外來語・字典沒有收錄)
const CASES = [
  ['いらっしゃいませ。ポイントカードはお持ちですか？', ['いらっしゃいませ', 'ポイントカード']],
  ['ありがとうございます。またお越しください。', ['ありがとうございます']],
  ['ありがとう！じゃあ、また明日ね。', ['ありがとう']],
  ['どうもありがとう。', ['ありがとう']],                          // どうも=2字以上但不在字典;ありがとう照標
  ['ちょっと待ってくださいね。', ['ちょっと']],
  ['すみません、ちょっとわかりません。', ['すみません', 'ちょっと']],
  ['もう一度言ってください。してください。', []],                   // してください 不能冒出「した」;もう 只有兩字
  ['駅の近くにコンビニがありますよ。', ['コンビニ']],
  ['コンビニエンスストアはあそこです。', ['?コンビニエンスストア', 'あそこ']],
  ['アパートを探しているんですが、駅から近いところがいいです。', ['アパート']],   // ところ=文法停用;アパート命中
  ['このレストランのコーヒーはとてもおいしいですね。', ['レストラン', 'コーヒー', 'とても', 'おいしい']],
  ['レシートはいりますか？袋はご利用ですか？', ['レシート']],
  ['トイレはどこですか？', ['トイレ']],                               // どこ 只有兩字不標
  ['エレベーターで三階まで行ってください。', ['エレベーター']],
  ['掃除はちゃんとしましたか？', ['ちゃんと']],
  ['そうじゃないですよ、だいじょうぶです。', ['だいじょうぶ']],       // そうじ|ゃ 不能標
  ['今日はとても暑いですね。たくさん水を飲んでください。', ['とても', 'たくさん']],
  ['毎日ゆっくり休んでくださいね。', ['ゆっくり']],                   // 漢字後接副詞 → 放行
  ['日本語を勉強するとき、何がいちばん大変ですか？', []],             // 勉強する|と 不能標「すると」
  ['テレビやパソコンはよく使いますか？', ['テレビ', 'パソコン']],
  ['じゃあ、いっしょに行きましょう。', ['いっしょに']],
  ['クレジットカードは使えますか？', ['クレジットカード']],
  ['わかりました。少々お待ちください。', ['わかりました']],
  ['ドキドキしますね！', []],                                        // 疊字擬態語不標「外來語」
  ['このシャツのサイズはMですか、Lですか？', ['シャツ', 'サイズ']],
  ['友達にプレゼントをもらいました。', ['プレゼント']],               // もらい(活用)不等於もらう
  ['スーパーで買い物をしてから、帰ります。', ['スーパー']],
  ['３ヶ月くらいアルバイトをしています。', ['アルバイト']],           // ヶ不算片假名;くらい停用
  ['あまり辛くないものがいいです。', ['あまり']],
  ['それから、パスポートを見せてください。', ['それから', 'パスポート']],
  ['ええと、たぶん来週だと思います。', ['ええと', 'たぶん']],
  ['もちろんです！よろしくおねがいします。', ['もちろん', 'よろしくおねがいします']],
  ['スマホのアプリで予約できますよ。', ['スマホ', 'アプリ']],
  ['ジャズが好きなんですね。', []],                                  // 2字片假名未收錄 → 不標(≥3才標未收錄)
  ['キャッシュレス決済はできますか？', ['?キャッシュレス']],
  ['日本のおにぎりはどうですか？', ['おにぎり']],
  ['たまごサンドとおにぎり、どちらにしますか？', ['?サンド', 'おにぎり', 'どちら']],
  // AI 附的 WORDS:假名詞 + 漢字詞但泡泡寫成假名
  ['レジぶくろはいりますか？', ['レジ'], 'レジ袋|れじぶくろ|塑膠袋'],
  ['はい、とてもきれいなへやですね。', ['とても', 'きれい'], 'きれい|きれい|漂亮;部屋|へや|房間'],   // へや 只有兩字 → 不標
  ['ほんとうにすてきですね。', ['すてき'], 'すてき|すてき|很棒'],
];

let pass = 0, fail = 0;
for (const [sent, expect, words] of CASES) {
  const m = KL.findMatches(sent, idx, words);
  const got = m.map(x => (x.src === 'unknown' ? '?' : '') + sent.slice(x.start, x.end));
  const ok = JSON.stringify(got) === JSON.stringify(expect);
  // 結構檢查:不重疊、範圍正確、片假名必為整段
  let struct = true;
  for (let k = 0; k < m.length; k++) {
    if (k && m[k].start < m[k - 1].end) struct = false;
    const s = m[k];
    if (/[ァ-ヺー]/.test(sent[s.start]) && (/[ァ-ヺー]/.test(sent[s.start - 1] || '') || /[ァ-ヺー]/.test(sent[s.end] || ''))) struct = false;
    if (!s.m) struct = false;
  }
  if (ok && struct) pass++;
  else { fail++; console.log('FAIL', sent, '\n  expect', expect, '\n  got   ', got, struct ? '' : '(structure)'); }
}

// AI 優先權:AI 附的意思蓋過字典
const pri = KL.findMatches('とても高いです。', idx, 'とても|とても|AI_MEANING');
if (pri[0] && pri[0].m === 'AI_MEANING' && pri[0].src === 'ai') pass++; else { fail++; console.log('FAIL ai priority', pri); }
// 未收錄片假名:讀音=本身、意思=固定字串
const unk = KL.findMatches('キャッシュレス', idx)[0];
if (unk && unk.r === 'キャッシュレス' && unk.m === KL.UNKNOWN_M) pass++; else { fail++; console.log('FAIL unknown shape', unk); }

// 效能:長回覆 × 2000 次
const long = CASES.map(c => c[0]).join('');
const t0 = Date.now();
for (let k = 0; k < 2000; k++) KL.findMatches(long, idx);
const ms = Date.now() - t0;
console.log('perf: ' + long.length + ' chars × 2000 = ' + ms + 'ms (' + (ms / 2000).toFixed(3) + 'ms/次)');
if (ms / 2000 > 2) { fail++; console.log('FAIL perf too slow'); } else pass++;

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
