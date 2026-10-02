#!/usr/bin/env node
/**
 * test-sale-price.cjs — 雙十檔期價格:後端 resolveWebPrice 與前端 Campaign.price 對答案
 *
 * 為什麼要兩邊一起測:pricing.html 把前端算出的金額當 expected_twd 送 createPayment,
 * 後端自己再算一次,不一樣就 409 擋單。只要兩邊差 1 塊,檔期當天所有人都買不了。
 *
 * 執行(專案根目錄):
 *   (cd functions && npx tsc) && node scripts/test-sale-price.cjs
 */
'use strict';
const path = require('path');
const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const B = require(path.join(__dirname, '..', 'functions', 'lib', 'utils', 'constants.js'));

// 前端 campaign.js 放進沙盒跑(假的 window / localStorage / location)
const sandbox = {
  window: {}, location: { hostname: 'stayjp.study', search: '', protocol: 'https:' },
  localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'campaign.js'), 'utf8'), sandbox);
const F = sandbox.window.Campaign;

const T = (y, mo, d, h, mi, s) => Date.UTC(y, mo - 1, d, h - 8, mi || 0, s || 0);   // 台灣時間 → ms
let n = 0;
function check(name, plan, now, hasRef, isCamp, want) {
  const b = B.resolveWebPrice(plan, now, hasRef, isCamp).twd;
  const f = F.price(plan, hasRef, isCamp, now).twd;
  assert.strictEqual(b, want, `[後端] ${name}: got ${b}, want ${want}`);
  assert.strictEqual(f, want, `[前端] ${name}: got ${f}, want ${want}`);
  n++;
}

// 0. 設定兩邊一致
assert.strictEqual(F.SALE.start, B.SALE.start, 'start 不一致');
assert.strictEqual(F.SALE.kolEarlyStart, B.SALE.kolEarlyStart, 'kolEarlyStart 不一致');
assert.strictEqual(F.SALE.end, B.SALE.end, 'end 不一致');
for (const p of ['yearly', 'lifetime']) {
  assert.strictEqual(F.SALE.prices[p], B.SALE.prices[p], `${p} 檔期價不一致`);
  assert.strictEqual(F.SALE.refDiscount[p], B.SALE.refDiscount[p], `${p} 檔期碼折不一致`);
  assert.strictEqual(F.REF_OFF[p], B.WEB_CODE_DISCOUNT_TWD[p], `${p} 平時碼折不一致`);
}
for (const p of Object.keys(B.PLANS)) assert.strictEqual(F.LIST_PRICE[p], B.PLANS[p].price_twd, `${p} 牌價不一致`);
assert.strictEqual(B.SALE.start, T(2026, 10, 8, 0, 0, 0));
assert.strictEqual(B.SALE.kolEarlyStart, T(2026, 10, 7, 20, 0, 0));
assert.strictEqual(B.SALE.end, T(2026, 10, 11, 23, 59, 59));

const BEFORE = T(2026, 10, 7, 19, 59, 59);
const EARLY = T(2026, 10, 7, 20, 0, 0);
const EARLY_LATE = T(2026, 10, 7, 23, 59, 59);
const START = T(2026, 10, 8, 0, 0, 0);
const MID = T(2026, 10, 10, 12, 0, 0);
const LAST = T(2026, 10, 11, 23, 59, 59);
const AFTER = LAST + 1000;
const LONG_AFTER = T(2027, 1, 1, 0, 0, 0);

// 1. 檔期前:一切照舊
check('檔期前 年費 無碼', 'yearly', BEFORE, false, false, 1990);
check('檔期前 年費 KOL碼', 'yearly', BEFORE, true, false, 1790);
check('檔期前 買斷 KOL碼', 'lifetime', BEFORE, true, false, 5390);
check('檔期前 買斷 無碼', 'lifetime', BEFORE, false, false, 5990);

// 2. KOL 搶先(10/7 20:00–23:59:59)
for (const t of [EARLY, EARLY_LATE]) {
  check('搶先 年費 KOL碼', 'yearly', t, true, false, 1340);
  check('搶先 買斷 KOL碼', 'lifetime', t, true, false, 3590);
  check('搶先 年費 無碼(還沒開始)', 'yearly', t, false, false, 1990);
  check('搶先 買斷 無碼(還沒開始)', 'lifetime', t, false, false, 5990);
  check('搶先 年費 活動碼(沒有搶先資格,平時碼折)', 'yearly', t, true, true, 1790);
  check('搶先 買斷 活動碼(沒有搶先資格,平時碼折)', 'lifetime', t, true, true, 5390);
}

// 3. 檔期中
for (const t of [START, MID, LAST]) {
  check('檔期 年費 無碼', 'yearly', t, false, false, 1490);
  check('檔期 買斷 無碼', 'lifetime', t, false, false, 3990);
  check('檔期 年費 KOL碼', 'yearly', t, true, false, 1340);
  check('檔期 買斷 KOL碼', 'lifetime', t, true, false, 3590);
  check('檔期 年費 活動碼也疊折', 'yearly', t, true, true, 1340);
  check('檔期 買斷 活動碼也疊折', 'lifetime', t, true, true, 3590);
}

// 4. 結束後自動回原價
for (const t of [AFTER, LONG_AFTER]) {
  check('結束後 年費 無碼', 'yearly', t, false, false, 1990);
  check('結束後 年費 KOL碼', 'yearly', t, true, false, 1790);
  check('結束後 買斷 無碼', 'lifetime', t, false, false, 5990);
  check('結束後 買斷 KOL碼', 'lifetime', t, true, false, 5390);
}

// 5. 月費、早鳥任何時候都不受影響
for (const t of [BEFORE, EARLY, START, MID, LAST, AFTER]) {
  for (const r of [false, true]) {
    check('月費不受影響', 'monthly', t, r, false, 390);
    check('早鳥不受影響', 'yearly_early_bird', t, r, false, 990);
  }
}

// 6. 每 10 分鐘掃一遍 10/6–10/13,兩邊逐點一致(抓邊界差一秒的那種錯)
let sweep = 0;
for (let t = T(2026, 10, 6, 0); t <= T(2026, 10, 13, 0); t += 600e3) {
  for (const p of Object.keys(B.PLANS)) for (const r of [false, true]) for (const c of [false, true]) {
    assert.strictEqual(F.price(p, r, c, t).twd, B.resolveWebPrice(p, t, r, c).twd, `sweep 不一致 ${p} ${t} ${r} ${c}`);
    sweep++;
  }
}

// 7. 活動碼判斷
assert.strictEqual(B.isCampaignRefCode({ type: 'official' }), true);
assert.strictEqual(B.isCampaignRefCode({ type: 'kol', expires_at: 1 }), true);
assert.strictEqual(B.isCampaignRefCode({ type: 'kol' }), false);
assert.strictEqual(B.isCampaignRefCode({ type: 'user' }), false);
assert.strictEqual(B.isCampaignRefCode(undefined), false);

// 8. 正式站網址帶 ?sale_now 不能改到價錢(只有 localhost 吃得到)
const sb2 = { window: {}, location: { hostname: 'stayjp.study', search: '?sale_now=' + MID, protocol: 'https:' },
  localStorage: { getItem: () => String(MID), setItem() {}, removeItem() {} } };
vm.createContext(sb2);
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'campaign.js'), 'utf8'), sb2);
assert.ok(Math.abs(sb2.window.Campaign.now() - Date.now()) < 5000, '正式站不該吃 sale_now');

console.log(`✓ test-sale-price: ${n} 個情境 + ${sweep} 個掃描點全部通過`);
