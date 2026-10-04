#!/usr/bin/env node
/**
 * test-article-list.cjs — 文章清單邏輯(window.ArticleList,純函式)
 *   排序(最新在前)、等級篩選 + 隱藏已讀(讀到一半那篇不藏)、日期標籤(沒 publish_at 不捏造)、首段預覽、繼續閱讀判定
 * 執行(專案根目錄): node scripts/test-article-list.cjs
 */
'use strict';
const path = require('path');
const fs = require('fs');
const vm = require('vm');
const assert = require('assert');

const ROOT = path.join(__dirname, '..');
const UI_SRC = fs.readFileSync(path.join(ROOT, 'articles-ui.js'), 'utf8');
const ls = {};
const sandbox = { location: { hostname: 'stayjp.study', search: '' }, localStorage: { getItem: k => (k in ls ? ls[k] : null), setItem: (k, v) => { ls[k] = String(v); }, removeItem: k => { delete ls[k]; } } };
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(UI_SRC, sandbox);
const L = sandbox.ArticleList;

let n = 0;
function ok(name, fn) { fn(); n++; console.log('  ok', name); }
const ids = arr => arr.map(a => a.id);

const A = [
  { id: 'a', level: 'n5', body: 'わたしは まいあさ 六時に おきます。かおを あらって。\n二段目' },
  { id: 'b', level: 'n4', body: '  \n本文は二段目から。' },
  { id: 'c', level: 'n3', body: 'x', publish_at: '2026-10-12T08:00:00+08:00' },
  { id: 'd', level: 'n5', body: 'y', publish_at: '2026-10-05T08:00:00+08:00' },
  { id: 'e', level: 'n3', body: 'z', publish_at: 'garbage' },
];

ok('排序:有 publish_at 的照時間倒序,其餘照陣列倒序(後 append = 較新)', () => {
  assert.deepStrictEqual(ids(L.sortNewest(A)), ['c', 'd', 'e', 'b', 'a']);
});
ok('排序不動原陣列', () => { const cp = A.slice(); L.sortNewest(A); assert.deepStrictEqual(A, cp); });
ok('等級篩選', () => assert.deepStrictEqual(ids(L.apply(A, { level: 'n5' })), ['a', 'd']));
ok('隱藏已讀', () => assert.deepStrictEqual(ids(L.apply(A, { hideRead: true, read: { a: 1, c: 1 } })), ['b', 'd', 'e']));
ok('隱藏已讀但讀到一半那篇(keepId)保留', () => {
  assert.deepStrictEqual(ids(L.apply(A, { hideRead: true, read: { a: 1, c: 1 }, keepId: 'c' })), ['b', 'c', 'd', 'e']);
});
ok('等級 + 隱藏已讀同時', () => assert.deepStrictEqual(ids(L.apply(A, { level: 'n3', hideRead: true, read: { c: 1 } })), ['e']));
ok('沒 publish_at → 日期空字串(不捏造)', () => { assert.strictEqual(L.dateLabel(A[0], 'zh'), ''); assert.strictEqual(L.dateLabel(A[4], 'en'), ''); });
ok('publish_at → 中/英日期', () => {
  const d = new Date(Date.parse('2026-10-12T08:00:00+08:00'));
  assert.strictEqual(L.dateLabel(A[2], 'zh'), d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate());
  assert.ok(/^Oct \d{1,2}, 2026$/.test(L.dateLabel(A[2], 'en')), L.dateLabel(A[2], 'en'));
});
ok('首段預覽:取第一個非空段、可截斷、尾端標點不留', () => {
  assert.strictEqual(L.preview(A[1]), '本文は二段目から。');
  assert.strictEqual(L.preview(A[0], 10), 'わたしは まいあさ…');
  assert.strictEqual(L.preview({ body: '' }), '');
});
ok('繼續閱讀:最近碰的那篇沒讀完才算', () => {
  assert.strictEqual(L.inProgress({ a: { p: 0.3, t: 10 }, b: { p: 1, t: 5 } }, ['a', 'b']), 'a');
  assert.strictEqual(L.inProgress({ a: { p: 0.3, t: 5 }, b: { p: 1, t: 10 } }, ['a', 'b']), null, '最近那篇讀完了就沒有');
  assert.strictEqual(L.inProgress({ a: { p: 0.96, t: 10 } }, ['a']), null, '≥95% 視為讀完');
  assert.strictEqual(L.inProgress({ zzz: { p: 0.1, t: 10 } }, ['a']), null, '不在清單(未上架/刪除)的不算');
  assert.strictEqual(L.inProgress({}, ['a']), null);
});
ok('ArticleList 不直接碰 window.ARTICLES(走 list() 餵進來)', () => {
  const seg = UI_SRC.slice(UI_SRC.indexOf('window.ArticleList ='), UI_SRC.indexOf('window.Articles ='));
  assert.ok(!/window\.ARTICLES/.test(seg));
});

console.log(`\n${n} passed`);
