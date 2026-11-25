#!/usr/bin/env node
// 唯讀:近 N 天各頁面/各事件的使用人數(GA4)。用來判斷哪些頁面沒人用。只印彙總數字,不含個資。
// 用法(Actions 手動觸發 ga-feature-usage.yml):node scripts/ga-feature-usage.mjs [天數=30]
const DAYS = Number(process.argv[2] || 30);
for (const k of ['OAUTH_CLIENT_ID', 'OAUTH_CLIENT_SECRET', 'OAUTH_REFRESH_TOKEN', 'GA4_PROPERTY_ID']) if (!process.env[k]) { console.error('Missing ' + k); process.exit(1); }
const tr = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ client_id: process.env.OAUTH_CLIENT_ID, client_secret: process.env.OAUTH_CLIENT_SECRET, refresh_token: process.env.OAUTH_REFRESH_TOKEN, grant_type: 'refresh_token' }) });
if (!tr.ok) { console.error('token ' + tr.status); process.exit(1); }
const token = (await tr.json()).access_token;
const run = async (body) => {
  const r = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${process.env.GA4_PROPERTY_ID}:runReport`, { method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify({ dateRanges: [{ startDate: DAYS + 'daysAgo', endDate: 'today' }], limit: 250, ...body }) });
  if (!r.ok) throw new Error('GA ' + r.status + ' ' + (await r.text()).slice(0, 300));
  return (await r.json()).rows || [];
};
const total = await run({ metrics: [{ name: 'activeUsers' }] });
console.log(`近 ${DAYS} 天活躍人數: ${total[0]?.metricValues[0].value}`);
const pages = await run({ dimensions: [{ name: 'pagePath' }], metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }], orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }] });
// 文章等帶 id 的路徑併到第一層檔名
const agg = new Map();
for (const r of pages) { const p = r.dimensionValues[0].value.replace(/\/+$/, '/') || '/'; const k = p.split('/').slice(0, 2).join('/') + (p.split('/').length > 2 ? '/*' : ''); const a = agg.get(k) || [0, 0]; a[0] = Math.max(a[0], +r.metricValues[0].value); a[1] += +r.metricValues[1].value; agg.set(k, a); }
console.log('\n頁面\t人數(同層取最大)\t瀏覽數');
for (const [k, a] of [...agg].sort((x, y) => y[1][0] - x[1][0]).slice(0, 80)) console.log(`${k}\t${a[0]}\t${a[1]}`);
const ev = await run({ dimensions: [{ name: 'eventName' }], metrics: [{ name: 'activeUsers' }, { name: 'eventCount' }], orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }] });
console.log('\n事件\t人數\t次數');
for (const r of ev) console.log(`${r.dimensionValues[0].value}\t${r.metricValues[0].value}\t${r.metricValues[1].value}`);
