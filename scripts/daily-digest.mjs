// 每日 digest(唯讀彙整 + 寄一封信給 Mia):昨天付款/試用/回報、GA 流量、Threads 成效(由 stayjp-autopost 以 repository_dispatch 傳來)。
// 跑在 GitHub Actions(GCP_SA_KEY);本機也能跑(firebase login 憑證)。
//   THREADS_SUMMARY(JSON 字串,可空)  DIGEST_TO(預設 stayjpplan@gmail.com)  DRY=1 只印不寄  FORCE=1 同日重寄
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(new URL('../functions/', import.meta.url));
const admin = require('firebase-admin');
let adcTmp = null;
function credential() {
  if (process.env.GCP_SA_KEY) return admin.credential.cert(JSON.parse(process.env.GCP_SA_KEY));
  const cfg = JSON.parse(fs.readFileSync(os.homedir() + '/.config/configstore/firebase-tools.json', 'utf8'));
  adcTmp = path.join(os.tmpdir(), `stayjp-adc-${process.pid}.json`);
  fs.writeFileSync(adcTmp, JSON.stringify({ type: 'authorized_user', client_id: '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com', client_secret: 'REDACTED_LOCAL_ONLY', refresh_token: cfg.tokens.refresh_token }), { mode: 0o600 });
  process.env.GOOGLE_APPLICATION_CREDENTIALS = adcTmp; return admin.credential.applicationDefault();
}
process.on('exit', () => { try { if (adcTmp) fs.unlinkSync(adcTmp); } catch {} });
admin.initializeApp({ credential: credential(), projectId: 'jpnote-1bdd6' }); const db = admin.firestore();

const TW = 8 * 3600e3; const now = Date.now();
const dayTW = (ms) => new Date(ms + TW).toISOString().slice(0, 10);
const today = dayTW(now); const yday = dayTW(now - 864e5);
const toMs = (v) => (v == null ? 0 : typeof v === 'number' ? (v < 1e12 ? v * 1000 : v) : typeof v.toMillis === 'function' ? v.toMillis() : (Date.parse(v) || 0));
const digestRef = db.doc(`digests/${today}`);
if (!process.env.FORCE && !process.env.DRY && (await digestRef.get()).exists) { console.log('今天已寄過 digest,略過(FORCE=1 可重寄)'); process.exit(0); }

// ── 付款 / 試用:昨天 + 近 7 天日均(不含昨天)、近 14 天每日一行
const since = now - 15 * 864e5; const days = {}; const D = (k) => (days[k] ||= { n: 0, amt: 0, plans: {}, trials: 0 });
for (const d of (await db.collection('transactions').get()).docs) { const t = d.data(); const ms = toMs(t.occurred_at || t.paid_at || t.created_at); if (!ms || ms < since) continue; const amt = Number(t.amount_twd) || 0; if (amt > 0 && (t.type === 'subscribe' || t.type === 'renew')) { const x = D(dayTW(ms)); x.n++; x.amt += amt; x.plans[t.plan || '?'] = (x.plans[t.plan || '?'] || 0) + 1; } }
for (const d of (await db.collection('trial_used').get()).docs) { const ms = toMs(d.data().started_at); if (ms >= since) D(dayTW(ms)).trials++; }
const y = days[yday] || { n: 0, amt: 0, plans: {}, trials: 0 };
const prev7 = [...Array(7)].map((_, i) => days[dayTW(now - (i + 2) * 864e5)] || { n: 0, amt: 0, trials: 0 });
const avg = (k) => (prev7.reduce((a, x) => a + x[k], 0) / 7).toFixed(1);
const planStr = (p) => Object.entries(p).map(([k, v]) => `${k.replace('yearly_early_bird', '早鳥年').replace('yearly', '年').replace('lifetime', '買斷').replace('monthly', '月')}×${v}`).join(' ') || '—';

// ── 回報
const newReports = (await db.collection('reports').where('status', '==', 'new').get()).size;
const handledY = (await db.collection('reports').where('status', 'in', ['handled', 'replied']).get()).docs.filter((d) => dayTW(toMs(d.data().handled_at)) === yday).length;

// ── GA(昨天):使用者、新使用者、工作階段、Threads 來源、前 5 頁
let ga = null;
try {
  if (process.env.OAUTH_REFRESH_TOKEN && process.env.GA4_PROPERTY_ID) {
    const tk = await (await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ client_id: process.env.OAUTH_CLIENT_ID, client_secret: process.env.OAUTH_CLIENT_SECRET, refresh_token: process.env.OAUTH_REFRESH_TOKEN, grant_type: 'refresh_token' }) })).json();
    const run = async (body) => (await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${process.env.GA4_PROPERTY_ID}:runReport`, { method: 'POST', headers: { Authorization: `Bearer ${tk.access_token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) })).json();
    const range = [{ startDate: 'yesterday', endDate: 'yesterday' }];
    const tot = await run({ dateRanges: range, metrics: [{ name: 'activeUsers' }, { name: 'newUsers' }, { name: 'sessions' }] });
    const src = await run({ dateRanges: range, dimensions: [{ name: 'sessionSource' }], metrics: [{ name: 'sessions' }], orderBys: [{ metric: { metricName: 'sessions' }, desc: true }], limit: 6 });
    const pages = await run({ dateRanges: range, dimensions: [{ name: 'pagePath' }], metrics: [{ name: 'screenPageViews' }], orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }], limit: 6 });
    const mv = (r) => (r.rows?.[0]?.metricValues || []).map((x) => Number(x.value));
    ga = { users: mv(tot)[0] || 0, newUsers: mv(tot)[1] || 0, sessions: mv(tot)[2] || 0,
      sources: (src.rows || []).map((r) => `${r.dimensionValues[0].value} ${r.metricValues[0].value}`).join('、'),
      pages: (pages.rows || []).map((r) => `${r.dimensionValues[0].value.replace(/^\//, '')} ${r.metricValues[0].value}`).join('、') };
  }
} catch (e) { ga = { err: String(e.message || e).slice(0, 120) }; }

// ── Threads(由 autopost 傳入)
let th = null; try { if (process.env.THREADS_SUMMARY) th = JSON.parse(process.env.THREADS_SUMMARY); } catch {}

const lines = [];
lines.push(`StayJP 每日 digest ${yday}(台灣)`);
lines.push('');
lines.push(`💰 付款 ${y.n} 筆 NT$${y.amt.toLocaleString()}(前 7 天日均 ${avg('n')} 筆 / NT$${Math.round(prev7.reduce((a, x) => a + x.amt, 0) / 7).toLocaleString()})  ${planStr(y.plans)}`);
lines.push(`🧪 站內試用開啟 ${y.trials}(前 7 天日均 ${avg('trials')})`);
lines.push(`📨 使用者回報:待處理 ${newReports}、昨天處理 ${handledY}`);
if (ga) lines.push(ga.err ? `📈 GA 抓失敗:${ga.err}` : `📈 網站 ${ga.users} 人(新 ${ga.newUsers})、${ga.sessions} 次;來源:${ga.sources}\n   熱門頁:${ga.pages}`);
if (th) for (const acct of Object.keys(th)) { const a = th[acct]; lines.push(`🧵 ${acct}:近 24h ${a.n24 || 0} 篇 / ${a.v24 || 0} 次觀看;7 天日均 ${a.avg7 || 0} 次/篇${a.top ? `\n   最佳:${a.top}` : ''}`); }
lines.push('');
lines.push('近 14 天(日期 付款/金額/試用):');
for (let i = 14; i >= 1; i--) { const k = dayTW(now - i * 864e5); const x = days[k] || { n: 0, amt: 0, trials: 0 }; lines.push(`${k.slice(5)}  ${String(x.n).padStart(2)} 筆 NT$${String(x.amt).padStart(6)}  試用 ${x.trials}`); }
lines.push('');
lines.push('— 自動產生(scripts/daily-digest.mjs);回報收件匣:node scripts/reports.mjs list');
const text = lines.join('\n'); console.log(text);
if (!process.env.DRY) {
  await db.collection('mail').add({ to: process.env.DIGEST_TO || 'stayjpplan@gmail.com', message: { subject: `[StayJP digest] ${yday} 付款 ${y.n} 筆 / 試用 ${y.trials} / 回報待處理 ${newReports}`, text }, _campaign: 'daily_digest', _createdAt: admin.firestore.FieldValue.serverTimestamp() });
  await digestRef.set({ sent_at: admin.firestore.FieldValue.serverTimestamp(), text }, { merge: true }); console.log('\nmail queued');
}
