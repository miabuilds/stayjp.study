// 把 StayJP 每日銷售摘要推到 StayHQ 總部(POST /api/ingest/daily)。跑在 daily-digest workflow 之後;本機也能跑。
//   HQ_URL(總部網址)  HQ_TOKEN(站對站 token)  用法:node scripts/hq-push.mjs [days=14]   DRY=1 只印不送
// 口徑同 daily-sales.mjs:只算 status=success、amount_twd>0、subscribe/renew、非 sandbox;退款=amount<0。
// 淨額是估計:App 商店 15%、綠界 2.8%、PayPal 4.5%、其他 3%。精確數字看 revenue-reconcile.mjs。
import { createHash } from 'node:crypto';
import { db, admin } from './lib/fire-admin.mjs';
const DAYS = Number(process.argv[2] || 14);
const HQ_URL = (process.env.HQ_URL || '').replace(/\/$/, ''); const HQ_TOKEN = process.env.HQ_TOKEN || '';
if (!process.env.DRY && (!HQ_URL || !HQ_TOKEN)) { console.error('缺 HQ_URL / HQ_TOKEN'); process.exit(1); }
const toMs = (v) => (v == null ? 0 : typeof v === 'number' ? (v < 1e12 ? v * 1000 : v) : typeof v.toMillis === 'function' ? v.toMillis() : (Date.parse(v) || 0));
const dayTW = (ms) => new Date(ms + 8 * 3600e3).toISOString().slice(0, 10);
const since = Date.now() - DAYS * 864e5;
const FEE = (pm) => /apple|ios|app_store|google|play|android/i.test(pm || '') ? 0.15 : /ecpay/i.test(pm || '') ? 0.028 : /paypal/i.test(pm || '') ? 0.045 : 0.03;
const days = {}; const D = (k) => (days[k] ||= { day: k, gross_twd: 0, net_twd: 0, paid_n: 0, new_paid_n: 0, refund_n: 0, refund_twd: 0, trial_n: 0, new_users: 0, extra: { by_plan: {}, by_pm: {} } });
for (const d of (await db.collection('transactions').get()).docs) {
  const t = d.data(); const ms = toMs(t.occurred_at || t.paid_at || t.created_at); if (!ms || ms < since || t.is_sandbox) continue;
  const amt = Number(t.amount_twd) || 0; const x = D(dayTW(ms));
  if (amt > 0 && (t.type === 'subscribe' || t.type === 'renew') && t.status === 'success') {
    x.paid_n++; x.gross_twd += amt; x.net_twd += amt * (1 - FEE(t.payment_method)); if (t.type === 'subscribe') x.new_paid_n++;
    x.extra.by_plan[t.plan || '?'] = (x.extra.by_plan[t.plan || '?'] || 0) + amt; x.extra.by_pm[t.payment_method || '?'] = (x.extra.by_pm[t.payment_method || '?'] || 0) + amt;
  } else if (amt < 0) { x.refund_n++; x.refund_twd += -amt; }
}
for (const d of (await db.collection('trial_used').get()).docs) { const ms = toMs(d.data().started_at); if (ms >= since) D(dayTW(ms)).trial_n++; }
// 新帳號:users 文件沒有建立時間,改讀 Firebase Auth 的 creationTime(分頁 1000 筆,最多 30 頁);順便建 uid→信箱 給家族價名單用
const emailOf = {};
let authOk = true;   // listUsers 沒權限時 → 新帳號/家族價不送(null),總部保留上次的值,不會被 0 蓋掉
try {
  let token; for (let i = 0; i < 30; i++) {
    const page = await admin.auth().listUsers(1000, token);
    for (const u of page.users) { const ms = Date.parse(u.metadata.creationTime || ''); if (ms >= since) D(dayTW(ms)).new_users++; if (u.email) emailOf[u.uid] = u.email; }
    token = page.pageToken; if (!token) break;
  }
} catch (e) { authOk = false; console.error('listUsers 失敗(新帳號/家族價這次不送,保留總部舊值):', e.message.slice(0, 160)); }
// 家族價名單:真的付過錢的用戶(subscription 有效或買斷、非贈送、非沙盒)→ sha256(小寫信箱)。其他 App 登入時查總部給家族價
const family = [];
const now = Date.now();
for (const d of (await db.collection('users').select('subscription').get()).docs) {
  const sub = d.data().subscription; if (!sub || sub.is_gift || sub.is_sandbox) continue;
  const paid = ['active', 'cancelled'].includes(sub.status) && (sub.plan === 'lifetime' || toMs(sub.expiresAt) > now || sub.source === 'group');
  if (!paid) continue;
  const em = (emailOf[d.id] || '').trim().toLowerCase(); if (!em) continue;
  family.push({ h: createHash('sha256').update(em).digest('hex'), since: sub.startedAt ? new Date(toMs(sub.startedAt)).toISOString().slice(0, 19).replace('T', ' ') : '' });
}
// KOL 抽成碼 → 總部夥伴正本(舊人照既有 commission_pct;個人推薦碼 type:user 不算夥伴)
const partners = [];
for (const d of (await db.collection('ref_codes').get()).docs) {
  const c = d.data(); if (c.type !== 'kol') continue;
  partners.push({ code: d.id, name: c.kol || c.display_name || '', email: c.email || c.payout_email || '', rate_pct: typeof c.commission_pct === 'number' ? c.commission_pct : 20, active: c.active !== false });
}
// 流量:GA4 每日活躍用戶/工作階段/瀏覽(需要 Actions 的 OAUTH_* + GA4_PROPERTY_ID;本機沒有就略過,欄位維持上次的值)
let gaOk = false;
try {
  if (process.env.OAUTH_REFRESH_TOKEN && process.env.GA4_PROPERTY_ID) {
    const tk = await (await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: process.env.OAUTH_CLIENT_ID, client_secret: process.env.OAUTH_CLIENT_SECRET, refresh_token: process.env.OAUTH_REFRESH_TOKEN, grant_type: 'refresh_token' }) })).json();
    const n = Math.min(DAYS, 90);
    const r = await (await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${process.env.GA4_PROPERTY_ID}:runReport`, { method: 'POST', headers: { Authorization: `Bearer ${tk.access_token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ dateRanges: [{ startDate: `${n}daysAgo`, endDate: 'today' }], dimensions: [{ name: 'date' }], metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }], limit: 400 }) })).json();
    for (const row of r.rows || []) {
      const d = row.dimensionValues[0].value; const k = `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
      const x = D(k); x.visitors = Number(row.metricValues[0].value) || 0; x.pageviews = Number(row.metricValues[1].value) || 0;
    }
    gaOk = true;
  }
} catch (e) { console.error('GA 抓失敗(流量欄位略過):', e.message); }
// 未處理回饋(reports status=new、近 30 天),不帶信箱
const feedback = [];
try {
  const cut = Date.now() - 30 * 864e5;
  for (const d of (await db.collection('reports').where('status', '==', 'new').get()).docs) {
    const r = d.data(); const ms = toMs(r.created_at); if (ms && ms < cut) continue;
    feedback.push({ ext_id: d.id, ts: ms ? new Date(ms).toISOString().slice(0, 19).replace('T', ' ') : '', type: r.kind || '', message: [r.detail, r.desc].filter(Boolean).join(':').slice(0, 240), page: String(r.page || '').slice(0, 200) });
  }
} catch (e) { console.error('reports 讀取失敗:', e.message); }
const rows = Object.values(days).sort((a, b) => (a.day < b.day ? -1 : 1)).map((r) => ({
  ...r,
  new_users: authOk ? r.new_users : null,
  visitors: gaOk ? (r.visitors || 0) : null, pageviews: gaOk ? (r.pageviews || 0) : null,
}));
console.log(`StayJP 近 ${DAYS} 天:${rows.length} 天有資料,夥伴碼 ${partners.length} 組,家族價名單 ${family.length} 人,未處理回饋 ${feedback.length} 則`);
for (const r of rows.slice(-7)) console.log(`  ${r.day}  ${r.paid_n} 筆  毛 NT$${r.gross_twd}  淨≈NT$${Math.round(r.net_twd)}  退 ${r.refund_n}  試用 ${r.trial_n}  新帳號 ${r.new_users}`);
if (process.env.DRY) process.exit(0);
const res = await fetch(HQ_URL + '/api/ingest/daily', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + HQ_TOKEN }, body: JSON.stringify({ product: 'stayjp', rows, partners, family: authOk ? family : undefined, feedback }) });
const out = await res.text(); console.log('HQ 回應', res.status, out.slice(0, 200));
if (!res.ok) process.exit(1);
