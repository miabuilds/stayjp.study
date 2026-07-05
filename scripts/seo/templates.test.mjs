import { test } from 'node:test';
import assert from 'node:assert/strict';
import { esc, renderExample, renderGrammarPage } from './templates.mjs';

test('esc escapes html', () => {
  assert.equal(esc('<a>&"'), '&lt;a&gt;&amp;&quot;');
});
test('renderExample: object keeps <em>, escapes rest; string as-is', () => {
  const html = renderExample({ j: '村上さんは<em>医者です</em>。', z: '村上是醫生。' });
  assert.match(html, /<em>医者です<\/em>/);        // em 保留
  assert.doesNotMatch(html, /&lt;em&gt;/);          // 没被转义掉
  assert.match(html, /村上是醫生。/);
  assert.match(renderExample('Mr. Murakami is a doctor.'), /Mr\. Murakami/);
});
test('renderExample escapes injected tags other than em', () => {
  const html = renderExample({ j: 'x<script>alert(1)</script>', z: 'y' });
  assert.match(html, /&lt;script&gt;/);            // script 被转义
});
test('grammar page has title h1 jsonld hreflang cta', () => {
  const html = renderGrammarPage({
    entry: { id:'n5-1', t:'～てしまう', cat:'助詞', ex:'表示完成或遺憾',
             eg:[{ j:'食べて<em>しまった</em>。', z:'吃完了。' }], p:'V-て＋しまう' },
    level: 'n5', lang: 'zh-Hant',
    canonical: 'https://stayjp.study/g/n5/teshimau/',
    alternates: [{ lang:'en', href:'https://stayjp.study/en/g/n5/teshimau/' }],
    related: [{ t:'～ておく', href:'/g/n5/teoku/' }],
    appUrl: 'https://stayjp.study/#n5',
  });
  assert.match(html, /<h1[^>]*>～てしまう<\/h1>/);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /hreflang="en"/);
  assert.match(html, /表示完成或遺憾/);
  assert.match(html, /免費/);
  assert.match(html, /rel="canonical"/);
  assert.match(html, /<em>しまった<\/em>/);
});
