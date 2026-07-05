import { test } from 'node:test';
import assert from 'node:assert/strict';
import { titleToSlug, resolveSlugs } from './slug.mjs';

const R = { '対':'たい' };

test('strips decoration, kana → slug', () => {
  assert.equal(titleToSlug('～てしまう', {}), 'teshimau');
  assert.equal(titleToSlug('～です・～じゃありません（名詞）', {}), null); // 名詞 无读音→残留汉字→null
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
