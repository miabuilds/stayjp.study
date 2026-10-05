// node scripts/test-day-key.cjs
// day-key.js 回歸測試:「今天」要用裝置本地日曆日,不是 UTC(日本 08:50 做的動作曾被算到昨天)。
// 用 TZ 環境變數跑三個時區,固定 Date 實例檢查午夜前後、跨月、of(ts)、addDays。
'use strict';
const path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..');

if (!process.env.__DAYKEY_CHILD) {
  // 父行程:用不同 TZ 重跑自己(Node 讀 TZ 只在啟動時生效)
  let bad = 0;
  for (const tz of ['Asia/Tokyo', 'Asia/Taipei', 'America/Los_Angeles', 'UTC']) {
    try { execFileSync(process.execPath, [__filename], { env: { ...process.env, TZ: tz, __DAYKEY_CHILD: '1' }, stdio: 'inherit' }); }
    catch (e) { bad++; }
  }
  if (bad) { console.error(`❌ day-key:${bad} 個時區有失敗`); process.exit(1); }
  console.log('✅ day-key 全部時區通過');
  process.exit(0);
}

const DK = require(path.join(ROOT, 'day-key.js'));
const tz = process.env.TZ;
let fail = 0, pass = 0;
function ok(cond, msg) { if (cond) pass++; else { fail++; console.error(`FAIL[${tz}]:`, msg); } }
const utcDay = d => d.toISOString().split('T')[0];
const localDay = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const offMin = -new Date(2026, 9, 5).getTimezoneOffset();   // 東 = 正(Tokyo 540、Taipei 480、LA -420、UTC 0)

// 1) 用戶實錘:2026-10-05 08:50 JST = 2026-10-04 23:50 UTC → 本地要是 10-05
const jst0850 = new Date(Date.UTC(2026, 9, 4, 23, 50));
ok(DK.of(jst0850) === localDay(jst0850), `of() 等於本地日 (${DK.of(jst0850)})`);
if (tz === 'Asia/Tokyo') { ok(DK.of(jst0850) === '2026-10-05', 'JST 08:50 應算 10-05'); ok(utcDay(jst0850) === '2026-10-04', '(對照)UTC 版會算 10-04 → 這就是 bug'); }
if (tz === 'Asia/Taipei') ok(DK.of(jst0850) === '2026-10-05', 'TST 07:50 應算 10-05');
if (tz === 'America/Los_Angeles') ok(DK.of(jst0850) === '2026-10-04', 'PDT 16:50 應算 10-04');

// 2) 本地午夜前後 1 分鐘要翻日;UTC 午夜前後不該翻(非 UTC 時區)
const localMidnight = new Date(2026, 9, 5, 0, 0, 0);
ok(DK.of(new Date(localMidnight.getTime() - 60000)) === '2026-10-04', '本地 23:59 = 10-04');
ok(DK.of(localMidnight) === '2026-10-05', '本地 00:00 = 10-05');
ok(DK.of(new Date(localMidnight.getTime() + 60000)) === '2026-10-05', '本地 00:01 = 10-05');
if (offMin !== 0) {
  const utcMidnight = new Date(Date.UTC(2026, 9, 5, 0, 0, 0));
  ok(DK.of(new Date(utcMidnight.getTime() - 60000)) === DK.of(new Date(utcMidnight.getTime() + 60000)), 'UTC 午夜前後本地日不變');
}

// 3) of(ts) 毫秒數字 / 字串 / 無效
ok(DK.of(jst0850.getTime()) === DK.of(jst0850), 'of(ms) 同 of(Date)');
ok(DK.of('2026-10-05T00:30:00+09:00') === localDay(new Date('2026-10-05T00:30:00+09:00')), 'of(ISO 字串)');
ok(DK.of('garbage') === '', 'of(無效) 回空字串');
ok(/^\d{4}-\d{2}-\d{2}$/.test(DK.today()), 'today() 格式 YYYY-MM-DD');
ok(DK.today() === localDay(new Date()), 'today() = 本地日');

// 4) 零補位
ok(DK.of(new Date(2026, 0, 3)) === '2026-01-03', '月/日補零');

// 5) addDays 跨月、跨年、負數、閏年
ok(DK.addDays('2026-10-31', 1) === '2026-11-01', '跨月 +1');
ok(DK.addDays('2026-11-01', -1) === '2026-10-31', '跨月 -1');
ok(DK.addDays('2026-12-31', 1) === '2027-01-01', '跨年');
ok(DK.addDays('2027-01-01', -1) === '2026-12-31', '跨年 -1');
ok(DK.addDays('2028-02-28', 1) === '2028-02-29', '閏年 2/29');
ok(DK.addDays('2026-02-28', 1) === '2026-03-01', '平年 3/1');
ok(DK.addDays('2026-10-05', 0) === '2026-10-05', '+0');
ok(DK.addDays('2026-10-05', -400) === localDay(new Date(2026, 9, 5 - 400)), '-400 天(連勝迴圈上限)');
ok(DK.addDays('bad', 3) === 'bad', '壞 key 原樣回傳');
// 跨 DST(LA 2026-11-01 02:00 回撥):仍是日曆 +1,不會停在同一天
ok(DK.addDays('2026-10-31', 1) === '2026-11-01' && DK.addDays('2026-11-01', 1) === '2026-11-02', '跨 DST 日曆 +1');
ok(DK.addDays('2026-03-07', 1) === '2026-03-08' && DK.addDays('2026-03-08', 1) === '2026-03-09', '跨 DST(春)日曆 +1');

// 6) parse:不能被當 UTC 午夜(new Date('2026-10-04') 會是 UTC)
const p = DK.parse('2026-10-04');
ok(p && p.getFullYear() === 2026 && p.getMonth() === 9 && p.getDate() === 4 && p.getHours() === 0, 'parse 本地午夜');
ok(DK.parse('2026-13-40') === null || DK.of(DK.parse('2026-13-40')) !== '2026-13-40', 'parse 無效日期不會原樣吐回');
ok(DK.parse('') === null && DK.parse(null) === null, 'parse 空值 → null');

// 7) 連勝回走(calendar.js / path.js 的 setDate(-1) 迴圈)在本地日界連續、不跳日不重複
{
  const d = new Date(2026, 9, 5, 0, 30); const seen = [];
  for (let i = 0; i < 40; i++) { seen.push(DK.of(d)); d.setDate(d.getDate() - 1); }
  ok(new Set(seen).size === 40, '40 天回走無重複');
  ok(seen[0] === '2026-10-05' && seen[1] === '2026-10-04' && seen[5] === '2026-09-30', '回走順序正確(跨月)');
  for (let i = 1; i < seen.length; i++) ok(DK.addDays(seen[i], 1) === seen[i - 1], `回走與 addDays 一致 ${seen[i]}`);
}

console.log(`${fail ? '❌' : '✅'} day-key [${tz}] pass=${pass} fail=${fail}`);
process.exit(fail ? 1 : 0);
