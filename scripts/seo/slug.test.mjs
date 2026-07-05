import { test } from 'node:test';
import assert from 'node:assert/strict';
import { titleToSlug, resolveSlugs } from './slug.mjs';

const R = { '対':'たい' };

test('strips decoration, kana → slug', () => {
  assert.equal(titleToSlug('～てしまう', {}), 'teshimau');
});
test('strips （...）annotation so kana core survives', () => {
  // 剥掉（名詞）注解后剩纯假名→可转
  assert.equal(titleToSlug('～です・～じゃありません（名詞）', {}), 'desujaarimasen');
});
test('prefers 「...」quoted core (the actual particle)', () => {
  assert.equal(titleToSlug('助詞「は」（主題）', {}), 'ha');
  assert.equal(titleToSlug('助詞「まで」（終點）', {}), 'made');
});
test('all-kanji title with no readings → null', () => {
  assert.equal(titleToSlug('丁寧体與普通体', {}), null);
});
test('kanji resolved via readings map', () => {
  assert.equal(titleToSlug('～に対して', R), 'nitaishite');
});
test('resolveSlugs falls back to id and dedupes', () => {
  const m = resolveSlugs([
    { id:'n5-1', t:'～ます' },
    { id:'n5-2', t:'～ます' },       // 冲突→ masu / masu-2
    { id:'n5-3', t:'（未知漢字）' },  // null→ fallback id
  ], {});
  assert.equal(m.get('n5-1'), 'masu');
  assert.equal(m.get('n5-2'), 'masu-2');
  assert.equal(m.get('n5-3'), 'n5-3');
});
