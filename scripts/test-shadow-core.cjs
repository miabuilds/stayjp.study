// node scripts/test-shadow-core.cjs
// shadow-core.js:①抽出來的正規化必須和 speak.html 跟讀課程原本那份逐字等價 ②單字跟讀計分案例。
'use strict';
const path = require('path');
const SC = require(path.join(__dirname, '..', 'shadow-core.js'));
let fail = 0, pass = 0;
function ok(c, m) { if (c) pass++; else { fail++; console.error('FAIL:', m); } }

// speak.html 原版(2026-10 抽出前)逐字複製,當對照組
const OLD = (() => {
  function kata2hira(t){ return t.replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60)); }
  const NUM_TSU=['','ひとつ','ふたつ','みっつ','よっつ','いつつ','むっつ','ななつ','やっつ','ここのつ','とお'];
  const NUM_NIN=['','ひとり','ふたり','さんにん','よにん','ごにん','ろくにん','ななにん','はちにん','きゅうにん','じゅうにん'];
  const NUM_JI=['','いちじ','にじ','さんじ','よじ','ごじ','ろくじ','しちじ','はちじ','くじ','じゅうじ','じゅういちじ','じゅうにじ'];
  const NUM_ON=['ゼロ','いち','に','さん','よん','ご','ろく','なな','はち','きゅう','じゅう'];
  function numNorm(t){
    return String(t||'')
      .replace(/[０-９]/g,c=>String.fromCharCode(c.charCodeAt(0)-0xFEE0))
      .replace(/(10|[0-9])つ/g,(m,n)=>NUM_TSU[+n]||m)
      .replace(/(10|[0-9])人/g,(m,n)=>NUM_NIN[+n]||m)
      .replace(/(1[0-2]|[0-9])時/g,(m,n)=>NUM_JI[+n]||m)
      .replace(/(10|[0-9])/g,(m,n)=>NUM_ON[+n]||'');
  }
  function lnorm(t){ return kata2hira(numNorm(t)).replace(/[、。,.!?！？…・「」\s]/g,''); }
  return { kata2hira, numNorm, lnorm };
})();
const SAMPLES = ['リンゴを2つください。', '4人です', '１０時に会いましょう', 'コーヒーを一杯', 'すみません、トイレはどこですか？', 'イッポン', '3時半', '12時', '0', '「ありがとう」…', 'ワタシハ　ガクセイデス'];
SAMPLES.forEach(s => {
  ok(SC.lnorm(s) === OLD.lnorm(s), 'lnorm differs: ' + s);
  ok(SC.numNorm(s) === OLD.numNorm(s), 'numNorm differs: ' + s);
  ok(SC.kata2hira(s) === OLD.kata2hira(s), 'kata2hira differs: ' + s);
});

// 單字計分:辨識可能回「假名 / 阿拉伯數字 / 漢數字 / 片假名」
const W = (y, f) => ({ yomi: [].concat(y), forms: [].concat(f) });
const CASES = [
  ['いっぽん', W('いっぽん', '1本'), 100],
  ['1本', W('いっぽん', '1本'), 100],
  ['一本', W('いっぽん', '1本'), 100],
  ['イッポン', W('いっぽん', '1本'), 100],
  ['2つ', W('ふたつ', '2つ'), 100],
  ['4人', W('よにん', '4人'), 100],
  ['4時', W('よじ', '4時'), 100],
  ['一億', W('いちおく', '1億'), 100],
  ['千', W('せん', '1000'), 100],
  ['三百', W('さんびゃく', '300'), 100],
  ['お父さん', W('おとうさん', 'お父さん'), 100],
  ['私は学生です', W('わたしはがくせいです', '私は学生です。'), 100],
  ['ええと、いっぽん', W('いっぽん', '1本'), 100],
];
CASES.forEach(([said, t, want]) => ok(SC.scoreWord(said, t) === want, `score(${said}) = ${SC.scoreWord(said, t)} want ${want}`));
ok(SC.scoreWord('', W('いっぽん', '1本')) === 0, 'empty = 0');
ok(SC.scoreWord('さんぼん', W('いっぽん', '1本')) < 72, 'wrong word should fail: ' + SC.scoreWord('さんぼん', W('いっぽん', '1本')));
ok(SC.scoreWord('いっぽ', W('いっぽん', '1本')) >= 72, 'near miss passes leniently: ' + SC.scoreWord('いっぽ', W('いっぽん', '1本')));
ok(SC.passed(85, false) && !SC.passed(80, false) && SC.passed(72, true) && !SC.passed(71, true), 'pass thresholds match speak.html (85 / 72 final)');
console.log(`shadow-core: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
