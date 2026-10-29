// 綠界定期定額 vs StayJP 帳本 逐期對帳(唯讀,不改訂閱)
//
// 流程:收集所有走綠界定期定額(月費/年費、信用卡)的 MerchantTradeNo
//   → 寫一筆 audit_requests(觸發雲端 adminEcpayPeriodLog 去問綠界 QueryCreditCardPeriodInfo)
//   → 等結果 → 把每期 ExecLog(成功的)跟 transactions 比:
//        首期:TradeNo == external_id;續扣:MTN+G+gwsr == invoice_key(或舊的 external_id==MTN 第 2 期)
//   → 印出「綠界有扣到錢、帳本沒這一期」的清單 = 被 2026-10-29 那個判重 bug 吃掉的
//
// 用法:node scripts/audit-ecpay-period.mjs   (認證同 revenue-reconcile.mjs:借 firebase login)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(new URL('../functions/', import.meta.url));
const admin = require('firebase-admin');

const cfg = JSON.parse(fs.readFileSync(os.homedir() + '/.config/configstore/firebase-tools.json', 'utf8'));
const tmp = path.join(os.tmpdir(), `stayjp-audit-${process.pid}.json`);
fs.writeFileSync(tmp, JSON.stringify({
  type: 'authorized_user',
  client_id: '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com',
  client_secret: 'j9iVZfS8kkCEFUPaAeJV0sAi',
  refresh_token: cfg.tokens.refresh_token,
}), { mode: 0o600 });
process.env.GOOGLE_APPLICATION_CREDENTIALS = tmp;
process.on('exit', () => { try { fs.unlinkSync(tmp); } catch { /* 已刪 */ } });
admin.initializeApp({ credential: admin.credential.applicationDefault(), projectId: 'jpnote-1bdd6' });
const db = admin.firestore();

// 1. 收集訂單號:帳本裡 ecpay 的 s 開頭 external_id + 訂閱的 ecpay_order(月費/年費,排除買斷)
const txSnap = await db.collection('transactions').where('payment_method', '==', 'ecpay').get();
const txs = txSnap.docs.map(d => ({ id: d.id, ...d.data() }));
const orderUid = new Map();   // MTN → uid
for (const t of txs) {
  if (t.plan === 'lifetime') continue;
  if (typeof t.external_id === 'string' && /^s\d/.test(t.external_id)) orderUid.set(t.external_id, t.uid);
}
const uids = [...new Set(txs.map(t => t.uid))];
for (const u of uids) {
  const s = (await db.doc('users/' + u).get()).data()?.subscription;
  if (s?.source === 'web' && s.plan !== 'lifetime' && s.ecpay_order) orderUid.set(s.ecpay_order, u);
}
const orders = [...orderUid.keys()];
console.log(`要問綠界 ${orders.length} 張定期定額訂單…`);

// 2. 寫請求,等雲端回
const ref = db.collection('audit_requests').doc(`ecpay_period_${Date.now()}`);
await ref.set({ type: 'ecpay_period', orders, created_at: Date.now() });
let result = null;
for (let i = 0; i < 60; i++) {
  await new Promise(r => setTimeout(r, 5000));
  const d = (await ref.get()).data();
  if (d?.status === 'done') { result = d.result; break; }
  if (d?.status === 'error') throw new Error('雲端回錯:' + d.error);
  process.stdout.write('.');
}
console.log();
if (!result) throw new Error('等 5 分鐘沒回,看 firebase functions:log --only adminEcpayPeriodLog');

// 3. 逐期比對
const emailOf = async u => { try { return (await admin.auth().getUser(u)).email || ''; } catch { return ''; } };
const missing = [];
let okPeriods = 0;
for (const mtn of orders) {
  const r = result[mtn] || {};
  const uid = orderUid.get(mtn);
  const log = Array.isArray(r.ExecLog) ? r.ExecLog : [];
  if (!log.length) { if (Number(r.RtnCode) !== 1) console.log(`  ${mtn} 綠界回 RtnCode=${r.RtnCode} ${r.RtnMsg || ''}`); continue; }
  const mine = txs.filter(t => t.uid === uid && t.status === 'success');
  log.forEach((e, idx) => {
    if (Number(e.RtnCode) !== 1) return;
    const gkey = `${mtn}G${e.gwsr}`;
    const hit = mine.find(t => t.external_id === String(e.TradeNo) || t.invoice_key === gkey || t.invoice_key === String(e.TradeNo))
      || (idx === 1 && mine.find(t => t.external_id === mtn));   // 9/23 前第 2 期:external_id=MTN、沒 invoice_key
    if (hit) okPeriods++;
    else missing.push({ uid, mtn, period: idx + 1, date: e.process_date, amount: e.amount, tradeNo: e.TradeNo, gwsr: e.gwsr });
  });
}
console.log(`對得上的期數:${okPeriods}`);
if (!missing.length) { console.log('✅ 綠界每一期扣款帳本都有,沒有漏'); process.exit(0); }
console.log(`\n❌ 綠界有扣款、帳本沒記的:${missing.length} 期`);
for (const m of missing) {
  console.log(`  ${m.uid.slice(0, 8)} ${await emailOf(m.uid)}  ${m.mtn} 第${m.period}期 ${m.date} NT$${m.amount}  TradeNo ${m.tradeNo} gwsr ${m.gwsr}`);
}
fs.writeFileSync(new URL('./out/ecpay-period-missing.json', import.meta.url), JSON.stringify(missing, null, 2));
console.log('\n明細存 scripts/out/ecpay-period-missing.json(補發會員/發票用)');
