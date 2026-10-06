// node scripts/test-rate-prompt.cjs
// rate-prompt.js 資格判斷 + 跨裝置合併的回歸測試(純函式,不碰 DOM)。
'use strict';
const path = require('path');
const assert = require('assert');
const R = require(path.join(__dirname, '..', 'rate-prompt.js'));

let pass = 0, fail = 0;
function t(name, fn) { try { fn(); pass++; } catch (e) { fail++; console.error('FAIL:', name, '\n  ', e.message); } }
const eq = (a, b, m) => assert.deepStrictEqual(a, b, m);

const TODAY = '2026-10-06';
const ok = (over) => Object.assign({ today: TODAY, studyDays: 5, sinceFirstOpenMs: 120000, platform: 'ios', debug: false }, over || {});

t('fresh state + enough days → eligible', () => eq(R.eligibleReason({}, ok()), ''));
t('studied < 3 distinct days → no', () => {
  eq(R.eligibleReason({}, ok({ studyDays: 2 })), 'few_days');
  eq(R.eligibleReason({}, ok({ studyDays: 3 })), '');
});
t('answered like → never', () => eq(R.eligibleReason({ ans: 'like', ansAt: '2026-01-01' }, ok({ today: '2027-12-31' })), 'answered'));
t('answered meh → never', () => eq(R.eligibleReason({ ans: 'meh' }, ok()), 'answered'));
t('later → snoozed 14 days, then ok', () => {
  const s = R.apply({}, 'later', TODAY);
  eq(s.snooze, '2026-10-20');
  eq(R.eligibleReason(s, ok({ today: '2026-10-07' })), 'snoozed');
  eq(R.eligibleReason(s, ok({ today: '2026-10-19' })), 'snoozed');
  eq(R.eligibleReason(s, ok({ today: '2026-10-20' })), '');
});
t('snooze crosses month/year correctly', () => eq(R.addDays('2026-12-25', 14), '2027-01-08'));
t('max 3 shows total', () => {
  let s = {};
  s = R.apply(s, 'shown', '2026-10-01');
  s = R.apply(s, 'shown', '2026-10-02');
  eq(R.eligibleReason(s, ok()), '');
  s = R.apply(s, 'shown', '2026-10-03');
  eq(s.shows, 3);
  eq(R.eligibleReason(s, ok()), 'max_shows');
});
t('once per day', () => {
  const s = R.apply({}, 'shown', TODAY);
  eq(R.eligibleReason(s, ok()), 'shown_today');
  eq(R.eligibleReason(s, ok({ today: '2026-10-07' })), '');
});
t('first 60s of the day → no', () => {
  eq(R.eligibleReason({}, ok({ sinceFirstOpenMs: 59999 })), 'warmup');
  eq(R.eligibleReason({}, ok({ sinceFirstOpenMs: 60000 })), '');
});
t('desktop (no store platform) → no, even in debug', () => {
  eq(R.eligibleReason({}, ok({ platform: '' })), 'no_store');
  eq(R.eligibleReason({}, ok({ platform: '', debug: true })), 'no_store');
});
t('debug bypasses everything else', () => eq(R.eligibleReason({ ans: 'like', shows: 3, last: TODAY }, ok({ studyDays: 0, sinceFirstOpenMs: 0, debug: true })), ''));
t('answer is sticky: like then meh keeps like', () => {
  const s = R.apply(R.apply({}, 'like', '2026-10-01'), 'meh', '2026-10-02');
  eq(s.ans, 'like'); eq(s.ansAt, '2026-10-01');
});
t('garbage state is normalized', () => {
  eq(R.norm(null), { shows: 0, last: '', snooze: '', ans: '', ansAt: '' });
  eq(R.norm({ shows: '2', last: 'x', ans: 'yes' }), { shows: 2, last: '', snooze: '', ans: '', ansAt: '' });
  eq(R.norm([1, 2]).shows, 0);
});

// ── 合併(本機 × 雲端)──
t('merge: shows max (old device with 0 must not resurrect the prompt)', () => {
  const m = R.merge({ shows: 3, last: '2026-10-05' }, { shows: 0 });
  eq(m.shows, 3); eq(m.last, '2026-10-05');
  eq(R.eligibleReason(m, ok()), 'max_shows');
});
t('merge: answered on either side wins (OR)', () => {
  eq(R.merge({}, { ans: 'like', ansAt: '2026-10-01' }).ans, 'like');
  eq(R.merge({ ans: 'meh', ansAt: '2026-10-02' }, {}).ans, 'meh');
});
t('merge: both answered → earlier answer kept', () => {
  const m = R.merge({ ans: 'meh', ansAt: '2026-10-03' }, { ans: 'like', ansAt: '2026-10-01' });
  eq(m.ans, 'like'); eq(m.ansAt, '2026-10-01');
});
t('merge: latest last/snooze', () => {
  const m = R.merge({ last: '2026-10-01', snooze: '2026-10-15' }, { last: '2026-10-04', snooze: '2026-10-10' });
  eq(m.last, '2026-10-04'); eq(m.snooze, '2026-10-15');
});
t('merge is symmetric and idempotent', () => {
  const a = { shows: 1, last: '2026-10-01', snooze: '2026-10-15' }, b = { shows: 2, last: '2026-10-03', ans: 'meh', ansAt: '2026-10-03' };
  eq(R.merge(a, b), R.merge(b, a));
  eq(R.merge(R.merge(a, b), b), R.merge(a, b));
});

// ── 學習天數 ──
t('countStudyDays counts distinct days with activity', () => {
  eq(R.countStudyDays({ '2026-10-01': { vocab: 3 }, '2026-10-02': { vocab: 0, quiz: 0 }, '2026-10-03': { minutes: 5 }, junk: { vocab: 9 } }), 2);
  eq(R.countStudyDays(null), 0);
});
t('store urls', () => {
  eq(R.storeUrl('ios'), 'https://apps.apple.com/app/id6778227353?action=write-review');
  assert.ok(R.storeUrl('android').startsWith('https://play.google.com/store/apps/details?id=com.stayjp.app'));
  eq(R.storeUrl(''), '');
  // 原生 web.tsx 只放行這兩個網域
  assert.ok(/^https:\/\/(apps\.apple\.com|play\.google\.com)\//.test(R.storeUrl('ios')));
  assert.ok(/^https:\/\/(apps\.apple\.com|play\.google\.com)\//.test(R.storeUrl('android')));
});

console.log(`rate-prompt: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
