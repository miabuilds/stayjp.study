#!/usr/bin/env node
/**
 * test-product-plan.cjs — App 商店 product id → 方案(webhook / rcSync 共用的 utils/product-plan.ts)
 * 執行:(cd functions && npx tsc) && node scripts/test-product-plan.cjs
 */
'use strict';
const path = require('path');
const assert = require('assert');
const { mapProductIdToPlan: m } = require(path.join(__dirname, '..', 'functions', 'lib', 'utils', 'product-plan.js'));

const cases = {
  // 既有商品
  'com.stayjp.app.monthly': 'monthly', 'stayjp_monthly': 'monthly',
  'com.stayjp.app.yearly': 'yearly', 'stayjp_yearly': 'yearly',
  'com.stayjp.app.yearly_early_bird': 'yearly_early_bird', 'stayjp_yearly_early_bird': 'yearly_early_bird',
  'com.stayjp.app.lifetime': 'lifetime', 'stayjp_lifetime': 'lifetime',
  'com.stayjp.app.yearly_ref': 'yearly', 'stayjp_yearly_ref': 'yearly',
  'com.stayjp.app.lifetime_ref': 'lifetime', 'stayjp_lifetime_ref': 'lifetime',
  // 雙十檔期商品
  'com.stayjp.app.yearly_sale75': 'yearly', 'stayjp_yearly_sale75': 'yearly',
  'com.stayjp.app.lifetime_sale65': 'lifetime', 'stayjp_lifetime_sale65': 'lifetime',
  // Play 訂閱 productId:basePlanId
  'stayjp_yearly_sale75:yearly': 'yearly', 'stayjp_yearly_ref:yearly': 'yearly',
  'stayjp_yearly:yearly': 'yearly', 'stayjp_monthly:monthly': 'monthly',
};
let n = 0;
for (const [id, want] of Object.entries(cases)) { assert.strictEqual(m(id), want, id); n++; }
for (const bad of ['', 'stayjp_unknown', 'com.stayjp.app.yearly_sale', ':yearly', null, undefined]) { assert.strictEqual(m(bad), null, String(bad)); n++; }
console.log(`✓ test-product-plan: ${n} 個情境全部通過`);
