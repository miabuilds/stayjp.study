#!/usr/bin/env node
/**
 * test-article-schedule.cjs — 文章排程上架(publish_at)
 *
 * 1. ArticleSchedule.isLive / visible 的時間邊界、無 publish_at、壞日期、預覽開關
 * 2. 預覽只在 localhost/127.0.0.1 生效(正式站加 ?artpreview=1 不能偷看)
 * 3. articles-ui.js 的 list() 真的走 ArticleSchedule(唯一入口,清單/紅標/接著讀/測驗都靠它)
 * 4. articles.js 裡所有 publish_at 都是可解析、帶時區的 ISO 字串
 *
 * 執行(專案根目錄): node scripts/test-article-schedule.cjs
 */
'use strict';
const path = require('path');
const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const ROOT = path.join(__dirname, '..');
const UI_SRC = fs.readFileSync(path.join(ROOT, 'articles-ui.js'), 'utf8');

function load(hostname, search, store) {
  const ls = Object.assign({}, store || {});
  const sandbox = {
    location: { hostname, search: search || '' },
    localStorage: { getItem: k => (k in ls ? ls[k] : null), setItem: (k, v) => { ls[k] = String(v); } },
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(UI_SRC, sandbox);
  return sandbox;
}

let n = 0;
function ok(name, fn) { fn(); n++; console.log('  ok', name); }

const AT = '2026-10-12T08:00:00+08:00';
const T = Date.parse(AT);
const arts = [{ id: 'old' }, { id: 'sched', publish_at: AT }, { id: 'bad', publish_at: 'next monday' }];

const prod = load('stayjp.study', '?artpreview=1', { art_preview: '1' });
const S = prod.ArticleSchedule;

ok('沒 publish_at = 立即上架', () => assert.strictEqual(S.isLive({ id: 'x' }, 0), true));
ok('時間前 1ms 隱藏', () => assert.strictEqual(S.isLive(arts[1], T - 1), false));
ok('時間到當下顯示', () => assert.strictEqual(S.isLive(arts[1], T), true));
ok('台灣 08:00 = UTC 00:00', () => assert.strictEqual(T, Date.UTC(2026, 9, 12, 0, 0, 0)));
ok('壞日期 fail-closed(不上架)', () => assert.strictEqual(S.isLive(arts[2], T + 1e12), false));
ok('visible 過濾', () => {
  assert.deepStrictEqual(Array.from(S.visible(arts, T - 1, false), a => a.id), ['old']);
  assert.deepStrictEqual(Array.from(S.visible(arts, T, false), a => a.id), ['old', 'sched']);
});
ok('正式站:網址/localStorage 預覽都無效', () => {
  assert.strictEqual(S.isPreview(), false);
  assert.deepStrictEqual(Array.from(S.visible(arts, T - 1), a => a.id), ['old']);
});
ok('localhost ?artpreview=1 → 全部顯示', () => {
  const L = load('localhost', '?artpreview=1').ArticleSchedule;
  assert.strictEqual(L.isPreview(), true);
  assert.strictEqual(L.visible(arts, T - 1).length, 3);
});
ok('127.0.0.1 localStorage art_preview=1 → 預覽', () => {
  assert.strictEqual(load('127.0.0.1', '', { art_preview: '1' }).ArticleSchedule.isPreview(), true);
});
ok('localhost 沒開關 → 照常過濾', () => {
  assert.strictEqual(load('localhost', '?artpreview=10').ArticleSchedule.isPreview(), false);
});
ok('list() 走 ArticleSchedule', () => {
  assert.ok(/function list\(\)\s*\{\s*return window\.ArticleSchedule\.visible\(window\.ARTICLES/.test(UI_SRC));
  // 其他地方不准繞過 list() 直接讀 window.ARTICLES(否則未上架文章會漏出來)
  const direct = UI_SRC.split('\n').filter(l => /window\.ARTICLES/.test(l) && !/function list\(\)/.test(l));
  assert.deepStrictEqual(direct, []);
});
ok('articles.js 的 publish_at 都合法且帶時區', () => {
  const A = new Function('window', fs.readFileSync(path.join(ROOT, 'articles.js'), 'utf8') + ';return window.ARTICLES')({});
  for (const a of A) {
    if (!('publish_at' in a)) continue;
    assert.ok(/^\d{4}-\d\d-\d\dT\d\d:\d\d(:\d\d)?([+-]\d\d:\d\d|Z)$/.test(a.publish_at), a.id + ' publish_at 格式: ' + a.publish_at);
    assert.ok(!isNaN(Date.parse(a.publish_at)), a.id + ' publish_at 解析失敗');
  }
});

console.log(`\n${n} passed`);
