#!/usr/bin/env node
// 金流/核心頁的「內嵌 JS 語法檢查」。
// 為什麼需要:pricing.html 等是 HTML 內嵌 <script>,一個語法錯(例如 var u 跟 const u 撞名)
// 會讓「整段」script 無法 parse → startSubscribe / PayPal 登入等全部失效,但頁面照樣載入、
// grep 還是找得到字串 → 舊的字串式健檢抓不到。這支用 `node --check` 真的去 parse 每段內嵌 JS。
//
// 跑:node scripts/check-inline-js.js   (CI 在 push 與每日都跑;非 0 結束 = 有語法錯 → 寄信)

const fs = require('fs');
const { execSync } = require('child_process');

const HTML_FILES = ['pricing.html', 'index.html', 'account.html', 'home.html'];
const JS_FILES = ['tool-quota.js', 'auth-header.js'];
let bad = false;

function checkSnippet(label, code) {
  const tmp = '/tmp/cij_' + label.replace(/\W/g, '_') + '.js';
  fs.writeFileSync(tmp, code);
  try { execSync('node --check ' + tmp, { stdio: 'pipe' }); }
  catch (e) {
    console.error('::error::' + label + ' 語法錯:\n' + String(e.stderr || e).slice(0, 500));
    bad = true;
  }
}

for (const file of HTML_FILES) {
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');
  const re = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g;
  let m, i = 0;
  while ((m = re.exec(html))) {
    // 只檢查會被當 JS 執行的 script;ld+json 等資料型 script 內容是 JSON,node --check 會誤報
    const type = (m[1].match(/\btype\s*=\s*["']?([^"'\s>]+)/) || [])[1] || '';
    const isJs = !type || /javascript|^module$|^text\/js$/i.test(type);
    if (isJs) checkSnippet(file + '#' + i, m[2]);
    // JSON 型的仍驗證是合法 JSON,避免結構化資料壞掉沒人發現
    else if (/json/i.test(type)) {
      try { JSON.parse(m[2]); }
      catch (e) { console.error('::error::' + file + '#' + i + ' JSON 壞掉(' + type + '):' + e.message); bad = true; }
    }
    i++;
  }
}
for (const f of JS_FILES) {
  if (!fs.existsSync(f)) continue;
  try { execSync('node --check ' + f, { stdio: 'pipe' }); }
  catch (e) { console.error('::error::' + f + ' 語法錯:\n' + String(e.stderr || e).slice(0, 500)); bad = true; }
}

if (bad) {
  console.error('❌ 有 JS 語法錯,會弄死整段金流/工具 JS(就像 var u 撞名那次)。修掉再部署。');
  process.exit(1);
}
console.log('✅ 所有內嵌 + 獨立 JS 語法 OK');
