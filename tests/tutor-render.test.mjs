// 小狸助教 render() 的格式測試:後端 parse 模式的五段輸出要能被前端畫成「兩欄語意分段表 / 四欄單字表 / 條列 / 小標」。
// 跑法:node --test tests/   (tutor.js 是 IIFE 掛 window,這裡用 vm 餵一個最小的 window/document 替身)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
function loadTutor() {
  const doc = { body: null, addEventListener() {}, getElementById() { return null; }, createElement() { return { style: {}, setAttribute() {}, appendChild() {}, querySelectorAll() { return []; } }; }, head: { appendChild() {} } };
  const win = { document: doc, localStorage: { getItem() { return null; }, setItem() {} }, matchMedia() { return { matches: false }; } };
  win.window = win;
  const ctx = vm.createContext(win);
  vm.runInContext(readFileSync(path.join(here, '..', 'tutor.js'), 'utf8'), ctx);
  return win.Tutor;
}

const SAMPLE = `【語意分段】
片段｜意思
砂糖を｜把砂糖
少し足して｜加一點
味を見てください｜請嚐嚐味道

【重點單字】
詞｜讀音｜詞性｜說明
砂糖｜さとう｜名詞｜糖,這句的受詞
足す｜たす｜動詞｜「足して」是 足す 的て形,接下一個動作
味を見る｜あじをみる｜慣用句｜嚐味道,不是用眼睛看

【難點解析】
- 「を」標示被加的東西(砂糖)
- て形把兩個動作串成「先…再…」
- 「てください」是客氣的請求

【整句意思】
加一點砂糖,然後請嚐嚐味道。

【小狸提醒】
- 「少し」也可以換成口語的「ちょっと」
例:ちょっと足してみて → 加一點試試看`;

test('五段小標都畫出來、順序正確', () => {
  const html = loadTutor().render(SAMPLE);
  const heads = [...html.matchAll(/<div class="tt-h">([^<]+)<\/div>/g)].map(m => m[1]);
  assert.deepEqual(heads, ['語意分段', '重點單字', '難點解析', '整句意思', '小狸提醒']);
});

test('語意分段是兩欄表(tt-seg),表頭列不畫、片段數對', () => {
  const html = loadTutor().render(SAMPLE);
  const seg = html.match(/<table class="tt-seg">([\s\S]*?)<\/table>/);
  assert.ok(seg, '要有 tt-seg 表');
  const rows = seg[1].match(/<tr>/g).length;
  assert.equal(rows, 3);
  assert.ok(!/片段<\/td>/.test(seg[1]), '表頭「片段｜意思」不該變成資料列');
  assert.ok(/<tr><td>[^<]*砂糖を[^<]*<\/td><td>把砂糖<\/td><\/tr>/.test(seg[1].replace(/<ruby>|<\/ruby>|<rt>[^<]*<\/rt>/g, '')), seg[1]);
});

test('重點單字是四欄表(tt-word),表頭不畫', () => {
  const html = loadTutor().render(SAMPLE);
  const w = html.match(/<table class="tt-word">([\s\S]*?)<\/table>/);
  assert.ok(w);
  assert.equal(w[1].match(/<tr>/g).length, 3);
  assert.equal(w[1].match(/<td>/g).length, 12);
  assert.ok(!/<td>詞<\/td>/.test(w[1]));
});

test('單一全形｜在非分段段落不會被當成表格', () => {
  const html = loadTutor().render('【難點解析】\n- 這裡的 A｜B 只是文字\n【整句意思】\n一句話');
  assert.ok(!/<table/.test(html));
  assert.ok(/<li>這裡的 A｜B 只是文字<\/li>/.test(html));
});

test('條列、整句意思、例句卡', () => {
  const html = loadTutor().render(SAMPLE);
  assert.equal((html.match(/<li>/g) || []).length, 4);
  assert.ok(/<p>加一點砂糖,然後請嚐嚐味道。<\/p>/.test(html));
  assert.ok(/class="tt-eg"/.test(html) && /class="zh">加一點試試看/.test(html));
});

test('舊格式(【拆解】四欄表)仍相容', () => {
  const html = loadTutor().render('【拆解】\n私｜わたし｜代名詞｜我\nは｜は｜助詞｜主題\n【整句意思】\n我。');
  assert.ok(/<table class="tt-word">/.test(html));
  assert.equal(html.match(/<tr>/g).length, 2);
});
