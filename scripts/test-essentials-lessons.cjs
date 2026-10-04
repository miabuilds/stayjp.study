// node scripts/test-essentials-lessons.cjs
// 「必學基礎詞」小課出題(essentials-lessons.js)的回歸測試:
// 題數、4 個選項不重複、正解一定在選項裡、干擾項不會「也是對的」、同 seed 同考卷、資料全從 essentials-data.js 來。
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const ESS = require(path.join(ROOT, 'essentials-data.js'));
const E = require(path.join(ROOT, 'essentials-lessons.js'));

let fail = 0, pass = 0;
function ok(cond, msg) { if (cond) pass++; else { fail++; if (fail <= 30) console.error('FAIL:', msg); } }
const kana = E.kana;

// 1) 資料覆蓋:小課項目 = 資料列數(沒有手打的另一份)
const rowCount = ESS.NUM.length + ESS.NUM_CH.length + ESS.COUNTERS.reduce((n, c) => n + c.rows.length, 0)
  + ESS.JI.length + ESS.FUN.length + ESS.YOUBI.length + ESS.GATSU.length + ESS.NICHI.length
  + ESS.KAZOKU.length * 2 + ESS.GIMON.length + ESS.JOSHI.length;
ok(E.ALL_ITEMS.length === rowCount, `items ${E.ALL_ITEMS.length} != data rows ${rowCount}`);
ok(new Set(E.ALL_ITEMS.map(i => i.id)).size === E.ALL_ITEMS.length, 'item ids unique');
ok(E.LESSONS.length >= 8 && E.LESSONS.length <= 13, 'lesson count 8–13 (got ' + E.LESSONS.length + ')');

function checkQuestion(q, where) {
  const it = q.item;
  ok(q.options.length === 4, `${where} ${q.id}: ${q.options.length} options`);
  const keys = q.options.map(o => o.key);
  ok(new Set(keys).size === keys.length, `${where} ${q.id}: duplicate options ${keys}`);
  ok(q.answer >= 0 && q.options[q.answer] && q.options[q.answer].of === it, `${where} ${q.id}: correct answer missing`);
  q.options.forEach((o, i) => {
    if (i === q.answer) return;
    const d = o.of, qa = it.alts.map(kana);
    if (q.type === 'r2m' || q.type === 'aud') {
      ok(!d.alts.map(kana).some(x => qa.includes(x)), `${where} ${q.id}: distractor ${d.id} has same reading`);
      ok(E.senseKey(d) !== E.senseKey(it), `${where} ${q.id}: distractor same meaning`);
    }
    if (q.type === 'm2r') ok(E.senseKey(d) !== E.senseKey(it) && !qa.includes(kana(it.kind === 'pt' ? d.form : d.yomi)), `${where} ${q.id}: m2r distractor ${d.id} also correct`);
    if (q.type === 'f2r') ok(d.form !== it.form && !qa.includes(kana(d.yomi)), `${where} ${q.id}: f2r distractor ${d.id} also correct`);
    if (q.type === 'clz') ok(d.kind === 'pt' && d.form !== it.form, `${where} ${q.id}: cloze distractor`);
    ok(!!d.mean === !!it.mean, `${where} ${q.id}: mixes meaning/form options`);
  });
}

// 2) 每課、綜合測驗,跑 200 個 seed
for (let seed = 1; seed <= 200; seed++) {
  for (const L of E.LESSONS) {
    const qs = E.genQuiz(L.id, { seed });
    ok(qs.length >= 5 && qs.length <= 8, `${L.id} seed ${seed}: ${qs.length} questions`);
    ok(new Set(qs.map(q => q.id)).size === qs.length, `${L.id} seed ${seed}: repeated question`);
    ok(qs.every(q => q.item.lesson === L.id), `${L.id}: question from another lesson`);
    if (seed === 1) ok(new Set(qs.map(q => q.type)).size >= 2, `${L.id}: only one question type`);
    qs.forEach(q => checkQuestion(q, L.id));
  }
  const f = E.genQuiz('final', { seed });
  ok(f.length === 15, `final seed ${seed}: ${f.length}`);
  ok(new Set(f.map(q => q.item.lesson)).size === E.LESSONS.length, `final seed ${seed}: not every lesson covered`);
  ok(new Set(f.map(q => q.item.id)).size === f.length, `final seed ${seed}: repeated item`);
  f.forEach(q => checkQuestion(q, 'final'));
}

// 3) 同 seed 同考卷;不同 seed 不同
const sig = qs => JSON.stringify(qs.map(q => [q.id, q.answer, q.options.map(o => o.key)]));
for (const id of E.LESSONS.map(l => l.id).concat(['final'])) {
  ok(sig(E.genQuiz(id, { seed: 99 })) === sig(E.genQuiz(id, { seed: 99 })), `${id}: not deterministic`);
}
ok(sig(E.genQuiz('final', { seed: 1 })) !== sig(E.genQuiz('final', { seed: 2 })), 'different seeds give same final quiz');

// 4) 題型涵蓋:讀音→意思、意思→讀音、聽音、助詞填空都會出
const types = new Set();
for (let s = 1; s <= 20; s++) E.LESSONS.forEach(L => E.genQuiz(L.id, { seed: s }).forEach(q => types.add(q.type)));
['r2m', 'm2r', 'aud', 'f2r', 'clz'].forEach(t => ok(types.has(t), 'type never generated: ' + t));

// 5) 過關門檻
ok(E.passed(5, 8) && !E.passed(4, 8) && E.passed(9, 15) && !E.passed(8, 15), 'pass threshold 60%');

console.log(`essentials-lessons: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
