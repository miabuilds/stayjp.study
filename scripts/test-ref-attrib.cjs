#!/usr/bin/env node
/**
 * test-ref-attrib.cjs — KOL 連結點擊去重 + App 註冊 IP 歸因決策(functions/src/utils/ref-attrib.ts)
 *
 * 執行(專案根目錄):
 *   (cd functions && npx tsc) && node scripts/test-ref-attrib.cjs
 */
'use strict';
const path = require('path');
const assert = require('assert');
const R = require(path.join(__dirname, '..', 'functions', 'lib', 'utils', 'ref-attrib.js'));

let n = 0;
function t(name, fn) { fn(); n++; console.log('  ok ' + name); }
const MIN = 60e3, H = 3600e3;
const NOW = Date.UTC(2026, 9, 4, 4, 0, 0);   // 2026-10-04 12:00 台灣

console.log('點擊去重');
t('沒有前一筆 → 算', () => assert.strictEqual(R.shouldCountClick([], 'KOL1', NOW), true));
t('同碼 29 分鐘前 → 不算', () => assert.strictEqual(R.shouldCountClick([{ code: 'KOL1', ts: NOW - 29 * MIN }], 'KOL1', NOW), false));
t('同碼剛好 30 分鐘前 → 算(視窗為 <30 分)', () => assert.strictEqual(R.shouldCountClick([{ code: 'KOL1', ts: NOW - 30 * MIN }], 'KOL1', NOW), true));
t('同碼 31 分鐘前 → 算', () => assert.strictEqual(R.shouldCountClick([{ code: 'KOL1', ts: NOW - 31 * MIN }], 'KOL1', NOW), true));
t('別的碼 1 分鐘前 → 算(每碼各自去重)', () => assert.strictEqual(R.shouldCountClick([{ code: 'KOL2', ts: NOW - MIN }], 'KOL1', NOW), true));

console.log('日期 key / 區間加總');
t('台灣日期跨日(UTC 16:00 = 台灣隔天 00:00)', () => {
  assert.strictEqual(R.twDateKey(Date.UTC(2026, 9, 4, 15, 59, 59)), '20261004');
  assert.strictEqual(R.twDateKey(Date.UTC(2026, 9, 4, 16, 0, 0)), '20261005');
});
t('近 7/30 天加總', () => {
  const by = { '20261004': 3, '20260928': 2, '20260927': 100, '20260905': 7, '20260904': 50 };
  assert.strictEqual(R.sumClicksDays(by, NOW, 7), 5);    // 10/04..09/28
  assert.strictEqual(R.sumClicksDays(by, NOW, 30), 112); // 10/04..09/05
  assert.strictEqual(R.sumClicksDays(undefined, NOW, 7), 0);
});

console.log('IP 正規化');
t('XFF 取第一段', () => assert.strictEqual(R.clientIp('1.2.3.4, 10.0.0.1'), '1.2.3.4'));
t('IPv6 取 /64', () => {
  assert.strictEqual(R.clientIp('2001:db8:abcd:12:1111:2222:3333:4444'), '2001:db8:abcd:12::/64');
  assert.strictEqual(R.clientIp('2001:db8:abcd:12::9'), '2001:db8:abcd:12::/64');
});
t('IPv4-mapped', () => assert.strictEqual(R.clientIp('::ffff:5.6.7.8'), '5.6.7.8'));
t('XFF 空 → fallback', () => assert.strictEqual(R.clientIp('', '9.9.9.9'), '9.9.9.9'));

console.log('IP 歸因決策');
const KOL = { exists: true, campaign: false, owner_uid: 'owner1', active: true };
const base = (o) => Object.assign({
  uid: 'me', hasRef: false, creationMs: NOW - 10 * MIN, now: NOW, plat: 'ios',
  clicks: [{ code: 'KOL1', ts: NOW - 20 * MIN, plat: 'ios' }],
  codes: { KOL1: KOL, KOL2: KOL, CAMP: { exists: true, campaign: true, active: true }, MINE: { exists: true, campaign: false, owner_uid: 'me' } },
}, o);
const D = (o) => R.decideIpMatch(base(o));

t('一個碼 → 歸因', () => assert.deepStrictEqual(D({}), { ok: true, code: 'KOL1' }));
t('已有 ref_code → has_ref', () => assert.strictEqual(D({ hasRef: true }).reason, 'has_ref'));
t('帳號 6h01m 前建立 → old_account', () => assert.strictEqual(D({ creationMs: NOW - 6 * H - MIN }).reason, 'old_account'));
t('帳號剛好 6h 前建立 → 不算舊(但點擊需在視窗內)', () => {
  const r = D({ creationMs: NOW - 6 * H });
  assert.notStrictEqual(r.reason, 'old_account');
});
t('沒有 creationTime → old_account', () => assert.strictEqual(D({ creationMs: 0 }).reason, 'old_account'));
t('0 個點擊 → no_match', () => assert.strictEqual(D({ clicks: [] }).reason, 'no_match'));
t('兩個不同碼 → ambiguous 不動', () => {
  const r = D({ clicks: [{ code: 'KOL1', ts: NOW - 20 * MIN, plat: 'ios' }, { code: 'KOL2', ts: NOW - 30 * MIN, plat: 'ios' }] });
  assert.strictEqual(r.ok, false); assert.strictEqual(r.reason, 'ambiguous');
});
t('同碼點兩次 → 仍算一個', () => assert.deepStrictEqual(D({ clicks: [{ code: 'KOL1', ts: NOW - 20 * MIN, plat: 'ios' }, { code: 'KOL1', ts: NOW - 50 * MIN, plat: 'ios' }] }), { ok: true, code: 'KOL1' }));
t('活動碼排除', () => assert.strictEqual(D({ clicks: [{ code: 'CAMP', ts: NOW - 20 * MIN, plat: 'ios' }] }).reason, 'no_match'));
t('活動碼 + KOL 碼 → 只剩 KOL', () => assert.deepStrictEqual(D({ clicks: [{ code: 'CAMP', ts: NOW - 5 * MIN, plat: 'ios' }, { code: 'KOL1', ts: NOW - 20 * MIN, plat: 'ios' }] }), { ok: true, code: 'KOL1' }));
t('自己的碼排除', () => assert.strictEqual(D({ clicks: [{ code: 'MINE', ts: NOW - 20 * MIN, plat: 'ios' }] }).reason, 'no_match'));
t('停用 / 停權 / 過期 / 不存在 排除', () => {
  const clicks = [{ code: 'X', ts: NOW - 20 * MIN, plat: 'ios' }];
  for (const x of [{ exists: true, active: false }, { exists: true, status: 'suspended' }, { exists: true, expires_at: NOW - 1 }, { exists: false }]) {
    assert.strictEqual(D({ clicks, codes: { X: Object.assign({ campaign: false }, x) } }).reason, 'no_match');
  }
});
t('平台不同(android 點、ios 註冊)→ 排除', () => assert.strictEqual(D({ clicks: [{ code: 'KOL1', ts: NOW - 20 * MIN, plat: 'android' }] }).reason, 'no_match'));
t('點擊端 other(桌機)→ 不擋', () => assert.strictEqual(D({ clicks: [{ code: 'KOL1', ts: NOW - 20 * MIN, plat: 'other' }] }).ok, true));
t('註冊端 other → 不擋', () => assert.strictEqual(D({ plat: 'other', clicks: [{ code: 'KOL1', ts: NOW - 20 * MIN, plat: 'android' }] }).ok, true));
t('平台不同的碼被排除後剩一個 → 歸因', () => assert.deepStrictEqual(D({ clicks: [{ code: 'KOL2', ts: NOW - 5 * MIN, plat: 'android' }, { code: 'KOL1', ts: NOW - 20 * MIN, plat: 'ios' }] }), { ok: true, code: 'KOL1' }));

console.log('時間視窗邊界');
t('點擊剛好 now−2h → 算', () => assert.strictEqual(D({ creationMs: NOW - MIN, clicks: [{ code: 'KOL1', ts: NOW - 2 * H, plat: 'ios' }] }).ok, true));
t('點擊 now−2h−1ms → 不算', () => assert.strictEqual(D({ creationMs: NOW - MIN, clicks: [{ code: 'KOL1', ts: NOW - 2 * H - 1, plat: 'ios' }] }).ok, false));
t('點擊在開帳號 +2h 剛好 → 算', () => {
  const c = NOW - 3 * H;   // 3h 前開帳號;點擊 1h 前 = 開帳號 +2h
  assert.strictEqual(D({ creationMs: c, clicks: [{ code: 'KOL1', ts: c + 2 * H, plat: 'ios' }] }).ok, true);
});
t('點擊在開帳號 +2h+1ms → 不算', () => {
  const c = NOW - 3 * H;
  assert.strictEqual(D({ creationMs: c, clicks: [{ code: 'KOL1', ts: c + 2 * H + 1, plat: 'ios' }] }).ok, false);
});
t('點擊在開帳號後(App 先註冊、再點連結)也算', () => assert.strictEqual(D({ creationMs: NOW - 30 * MIN, clicks: [{ code: 'KOL1', ts: NOW - 5 * MIN, plat: 'ios' }] }).ok, true));
t('點擊在未來(時鐘)→ 不算', () => assert.strictEqual(D({ clicks: [{ code: 'KOL1', ts: NOW + MIN, plat: 'ios' }] }).ok, false));
t('帳號 5h 前建立 → 視窗為空(now−2h > 建立+2h)', () => assert.strictEqual(D({ creationMs: NOW - 5 * H, clicks: [{ code: 'KOL1', ts: NOW - 3 * H, plat: 'ios' }] }).reason, 'no_match'));

console.log(`\n全部通過:${n} 項`);
