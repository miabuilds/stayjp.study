import { test } from 'node:test';
import assert from 'node:assert/strict';
import { posSlug } from './pos.mjs';

test('maps the six real categories', () => {
  assert.equal(posSlug('名').slug, 'noun');
  assert.equal(posSlug('動').slug, 'verb');
  assert.equal(posSlug('い形').slug, 'i-adjective');
  assert.equal(posSlug('な形').slug, 'na-adjective');
  assert.equal(posSlug('副').slug, 'adverb');
  assert.equal(posSlug('他').slug, 'other'); // 617 词,漏了会丢
});
test('unknown pos → null', () => {
  assert.equal(posSlug('謎'), null);
});
