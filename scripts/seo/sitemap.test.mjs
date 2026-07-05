import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSitemap } from './sitemap.mjs';

test('wraps urls in urlset', () => {
  const xml = buildSitemap([{ loc: 'https://stayjp.study/g/n5/masu/', priority: '0.7' }]);
  assert.match(xml, /^<\?xml/);
  assert.match(xml, /<loc>https:\/\/stayjp\.study\/g\/n5\/masu\/<\/loc>/);
  assert.match(xml, /<priority>0\.7<\/priority>/);
  assert.match(xml, /<\/urlset>\s*$/);
});
