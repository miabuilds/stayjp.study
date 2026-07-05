import { test } from 'node:test';
import assert from 'node:assert/strict';
import { kanaToRomaji } from './romaji.mjs';

test('basic gojuon', () => {
  assert.equal(kanaToRomaji('です'), 'desu');
  assert.equal(kanaToRomaji('ます'), 'masu');
});
test('youon combos', () => {
  assert.equal(kanaToRomaji('きゃ'), 'kya');
  assert.equal(kanaToRomaji('しゅう'), 'shuu');
});
test('sokuon doubles next consonant', () => {
  assert.equal(kanaToRomaji('がっこう'), 'gakkou');
});
test('katakana + choonpu', () => {
  assert.equal(kanaToRomaji('テーブル'), 'teeburu');
});
test('non-kana kept as-is', () => {
  assert.equal(kanaToRomaji('対して'), '対shite');
});
