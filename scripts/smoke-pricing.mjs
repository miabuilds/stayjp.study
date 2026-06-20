// 實載健檢:用無頭瀏覽器真的開啟 live pricing 頁,確認:
//   1. window.startSubscribe 真的是 function(語法錯/scope 錯/執行期錯都會讓它不是 function)
//   2. 頁面沒有未捕捉的 JS 錯誤
// 補「node --check 語法檢查」抓不到的「執行期」壞掉。CI 每日/手動跑;壞了 → job fail → 寄信。
import { chromium } from 'playwright';

const URL = process.env.PRICING_URL || 'https://stayjp.study/pricing.html';
const errors = [];
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(3000);   // 等內嵌 script 跑完定義 startSubscribe(不能用 networkidle:Firebase 持續連線永不 idle → 誤報逾時)
  const startType = await page.evaluate(() => typeof window.startSubscribe);
  let bad = false;
  if (startType !== 'function') {
    console.error(`::error::pricing 實載:startSubscribe 不是 function(=${startType})→ 訂閱鈕壞了`);
    bad = true;
  }
  if (errors.length) {
    console.error('::error::pricing 頁有未捕捉 JS 錯誤:\n' + errors.slice(0, 5).join('\n'));
    bad = true;
  }
  if (bad) process.exit(1);
  console.log('✅ pricing 實載 OK:startSubscribe 是 function、無頁面錯誤');
} finally {
  await browser.close();
}
