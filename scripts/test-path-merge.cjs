// node scripts/test-path-merge.cjs
// path-merge.js 回歸測試:path_progress 雲端/本機合併不能讓任一邊的進度倒退
// (之前是「雲端整級蓋過去」→ 另一台較舊的 n5 洗掉這台剛過的關、今日關數歸零)。
'use strict';
const path = require('path');
const assert = require('assert');
const { merge } = require(path.join(__dirname, '..', 'path-merge.js'));

let pass = 0, fail = 0;
function t(name, fn) { try { fn(); pass++; } catch (e) { fail++; console.error('FAIL:', name, '\n  ', e.message); } }
const eq = (a, b, m) => assert.deepStrictEqual(a, b, m);

// 1. 雲端較新(多過了幾關):本機不能把雲端的關洗掉
t('cloud newer: keeps cloud done + days', () => {
  const local = { level: 'n5', n5: { done: { 0: 3 }, days: { '2026-10-04': 1 } } };
  const cloud = { level: 'n5', n5: { done: { 0: 3, 1: 2, 2: 3 }, days: { '2026-10-04': 1, '2026-10-05': 2 } } };
  const m = merge(local, cloud);
  eq(m.n5.done, { 0: 3, 1: 2, 2: 3 });
  eq(m.n5.days, { '2026-10-04': 1, '2026-10-05': 2 });
});

// 2. 本機較新(用戶實錘情境):舊的雲端 n5 不能蓋掉剛過的第 2 關與今天的關數
t('local newer: cloud stale n5 must not erase local', () => {
  const local = { level: 'n5', n5: { done: { 0: 3, 1: 2 }, days: { '2026-10-05': 2 } } };
  const cloud = { level: 'n5', n5: { done: { 0: 3 }, days: { '2026-10-05': 1 } } };
  const m = merge(local, cloud);
  eq(m.n5.done, { 0: 3, 1: 2 });
  eq(m.n5.days['2026-10-05'], 2);
});

// 3. 兩邊各有一半:done 聯集,同一關取星等較高
t('both partial: per-index max on done', () => {
  const m = merge({ n5: { done: { 0: 1, 1: 3 } } }, { n5: { done: { 0: 3, 2: 2 } } });
  eq(m.n5.done, { 0: 3, 1: 3, 2: 2 });
});

// 4. done=0(自動定位「已學過」)也算有紀錄,不能被另一邊的 undefined 丟掉;另一邊有星等則取星等
t('done 0 (auto-placed) kept; real stars beat 0', () => {
  const m = merge({ n5: { done: { 0: 0, 1: 0 } } }, { n5: { done: { 1: 2 } } });
  eq(m.n5.done, { 0: 0, 1: 2 });
});

// 5. days 同日碰撞取大(兩台今天各記了 1 與 2 → 2,不是 1,也不是 3:它是「這台已知的最大值」)
t('days collision: per-date max', () => {
  const m = merge({ n5: { days: { '2026-10-05': 1, '2026-10-03': 2 } } }, { n5: { days: { '2026-10-05': 2, '2026-10-04': 1 } } });
  eq(m.n5.days, { '2026-10-05': 2, '2026-10-04': 1, '2026-10-03': 2 });
});

// 6. skip 聯集
t('skip union', () => {
  const m = merge({ n5: { skip: { 0: 1, 1: 1 } } }, { n5: { skip: { 1: 1, 2: 1 } } });
  eq(m.n5.skip, { 0: 1, 1: 1, 2: 1 });
});

// 7. level 本機優先(使用者目前選的等級)
t('level: local preferred when set', () => {
  eq(merge({ level: 'n3' }, { level: 'n5' }).level, 'n3');
});
// 8. level 本機沒有 → 用雲端;本機是垃圾值 → 用雲端合法值
t('level: falls back to cloud when local missing/invalid', () => {
  eq(merge({}, { level: 'n4' }).level, 'n4');
  eq(merge({ level: 'zz' }, { level: 'n4' }).level, 'n4');
  eq(merge({ n5: {} }, { n5: {} }).level, undefined);
});

// 9. 本機空:結果等於雲端(深拷貝,不是同一個參照)
t('empty local → cloud clone', () => {
  const cloud = { level: 'n4', n4: { done: { 0: 3 }, days: { '2026-10-01': 1 }, skip: {}, placed: { at: 0, n: 0, dismissed: true } } };
  const m = merge({}, cloud);
  eq(m, cloud);
  assert.notStrictEqual(m.n4, cloud.n4);
  m.n4.done[9] = 1; assert.strictEqual(cloud.n4.done[9], undefined, 'input must not be mutated');
});
// 10. 雲端空/null:結果等於本機
t('empty/null cloud → local clone', () => {
  const local = { level: 'n5', n5: { done: { 0: 2 }, days: {} } };
  eq(merge(local, {}), local);
  eq(merge(local, null), local);
  eq(merge(null, undefined), {});
});

// 11. placed:只有一邊有就拿那邊;兩邊都有以本機為主、dismissed 取 OR
t('placed: keep whichever exists, dismissed OR', () => {
  eq(merge({ n5: {} }, { n5: { placed: { at: 3, n: 3, dismissed: false } } }).n5.placed, { at: 3, n: 3, dismissed: false });
  eq(merge({ n5: { placed: { at: 3, n: 3, dismissed: false } } }, { n5: {} }).n5.placed, { at: 3, n: 3, dismissed: false });
  eq(merge({ n5: { placed: { at: 5, n: 5, dismissed: false } } }, { n5: { placed: { at: 3, n: 3, dismissed: true } } }).n5.placed, { at: 5, n: 5, dismissed: true });
});

// 12. 多等級:每級各自合併,雲端獨有的等級保留、本機獨有的等級保留
t('multiple levels merged independently', () => {
  const m = merge({ level: 'n4', n5: { done: { 0: 3 } }, n4: { done: { 0: 1 } } }, { level: 'n5', n5: { done: { 1: 2 } }, n3: { done: { 0: 3 } } });
  eq(m.level, 'n4');
  eq(m.n5.done, { 0: 3, 1: 2 });
  eq(m.n4.done, { 0: 1 });
  eq(m.n3.done, { 0: 3 });
});

// 13. 結果每級一定有 done/days(path.js lvProg 讀取用),雲端壞資料(非物件)不會炸
t('always has done/days; tolerates garbage', () => {
  const m = merge({ n5: { done: null, days: 'x' } }, { n5: 5 });
  eq(m.n5.done, {}); eq(m.n5.days, {});
  const m2 = merge('str', [1, 2]);
  eq(m2, {});
});

// 14. 未知欄位:數字取大、布林 OR、其餘本機優先
t('unknown fields: number max / boolean OR / local wins', () => {
  const m = merge({ n5: { best: 3, seen: false, note: 'L' } }, { n5: { best: 7, seen: true, note: 'C' } });
  eq(m.n5.best, 7); eq(m.n5.seen, true); eq(m.n5.note, 'L');
});

// 15. 冪等:merge(a, a) === a;可交換(done/days/skip 部分)
t('idempotent & commutative on progress maps', () => {
  const a = { level: 'n5', n5: { done: { 0: 3, 2: 1 }, days: { '2026-10-05': 2 }, skip: { 1: 1 } } };
  eq(merge(a, a), a);
  const b = { level: 'n5', n5: { done: { 1: 2, 2: 3 }, days: { '2026-10-05': 1, '2026-10-04': 1 }, skip: { 3: 1 } } };
  const ab = merge(a, b), ba = merge(b, a);
  eq(ab.n5.done, ba.n5.done); eq(ab.n5.days, ba.n5.days); eq(ab.n5.skip, ba.n5.skip);
});

// 16. 跟 app.html 的流程一樣會 JSON round-trip:字串化後再 parse 無損
t('JSON round-trip stable', () => {
  const m = merge({ level: 'n5', n5: { done: { 0: 3 }, days: { '2026-10-05': 1 }, skip: {}, placed: { at: 0, n: 0, dismissed: true } } }, {});
  eq(JSON.parse(JSON.stringify(m)), m);
});

console.log(`${fail ? '❌' : '✅'} path-merge pass=${pass} fail=${fail}`);
process.exit(fail ? 1 : 0);
