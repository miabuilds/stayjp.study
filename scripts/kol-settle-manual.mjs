// 手動結算某 KOL 碼:把「實際已轉帳」涵蓋的分潤記成 paid,建 payouts 紀錄,並把 payout_requests 標已處理。
// 用在:轉帳金額跟 adminSettleKolPayout(只收 locked)對不上時,例如連 pending 一起預付。
// 預付的 pending 會標 prepaid:true;之後若被退款,refund 流程會翻 void(保留 payout_id)→ 下次結算自動 clawback 扣回。
// 用法:node scripts/kol-settle-manual.mjs <CODE> <轉帳金額> [--request <payout_request_id>] [--commit]
//   不加 --commit = dry-run,只印不寫。
import { db } from './lib/fire-admin.mjs';

const args = process.argv.slice(2);
const code = String(args[0] || '').toUpperCase();
const paidAmt = Number(args[1]);
const commit = args.includes('--commit');
const ri = args.indexOf('--request');
const requestId = ri >= 0 ? args[ri + 1] : '';
if (!code || !Number.isFinite(paidAmt)) { console.error('用法: node scripts/kol-settle-manual.mjs <CODE> <轉帳金額> [--request id] [--commit]'); process.exit(1); }

const snap = await db.collection('commissions').where('code', '==', code).get();
const toPay = [], clawbacks = [];
let ownerUid = '';
snap.forEach((d) => {
  const c = d.data();
  ownerUid = ownerUid || c.owner_uid || '';
  if (c.state === 'locked' || c.state === 'pending') toPay.push(d);
  else if (c.state === 'void' && c.payout_id && !c.clawback_settled) clawbacks.push(d);
});
const sum = (arr) => Math.round(arr.reduce((s, d) => s + (Number(d.data().amount_twd) || 0), 0));
const locked = toPay.filter((d) => d.data().state === 'locked');
const pending = toPay.filter((d) => d.data().state === 'pending');
const gross = sum(toPay), claw = sum(clawbacks), net = gross - claw;

console.log(`碼 ${code}`);
console.log(`  locked  ${locked.length} 筆 NT$${sum(locked)}`);
console.log(`  pending ${pending.length} 筆 NT$${sum(pending)} (預付,標 prepaid)`);
console.log(`  clawback ${clawbacks.length} 筆 -NT$${claw}`);
console.log(`  應付淨額 NT$${net} / 實際轉帳 NT$${paidAmt}`);
if (net !== paidAmt) { console.error(`✖ 金額對不上(差 ${paidAmt - net}),不寫入。`); process.exit(2); }
if (!commit) { console.log('dry-run OK,加 --commit 寫入。'); process.exit(0); }

const now = Date.now();
const payoutRef = db.collection('payouts').doc();
const batch = db.batch();
batch.set(payoutRef, {
  code, owner_uid: ownerUid, period: new Date(now).toISOString().slice(0, 7),
  gross_twd: gross, clawback_twd: claw, net_twd: net,
  commission_ids: toPay.map((d) => d.id), clawback_ids: clawbacks.map((d) => d.id),
  prepaid_ids: pending.map((d) => d.id), prepaid_twd: sum(pending),
  payout_request_id: requestId || null,
  settled_by: 'manual-script', created_at: now, status: 'paid', paid_at: now,
});
toPay.forEach((d) => batch.update(d.ref, { state: 'paid', payout_id: payoutRef.id, paid_settled_at: now, ...(d.data().state === 'pending' ? { prepaid: true } : {}) }));
clawbacks.forEach((d) => batch.update(d.ref, { clawback_settled: true, clawback_payout_id: payoutRef.id }));
if (requestId) batch.set(db.collection('payout_requests').doc(requestId), { status: 'done', handled_at: now, payout_id: payoutRef.id, paid_twd: paidAmt }, { merge: true });
await batch.commit();
console.log(`✔ 已寫入 payouts/${payoutRef.id}`);
process.exit(0);
