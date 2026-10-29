// 唯讀:印 10/29 三位續扣用戶的帳本、到期日、發票狀態(認證同 revenue-reconcile.mjs:借 firebase login)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(new URL('../functions/', import.meta.url));
const admin = require('firebase-admin');

const cfg = JSON.parse(fs.readFileSync(os.homedir() + '/.config/configstore/firebase-tools.json', 'utf8'));
const tmp = path.join(os.tmpdir(), `stayjp-verify-${process.pid}.json`);
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

const rows = fs.readFileSync(new URL('./out/ecpay-replay-20261029.json', import.meta.url), 'utf8')
  .split('\n').filter(Boolean).map(l => JSON.parse(l));

for (const b of rows) {
  const uid = b.CustomField1;
  const key = `${b.MerchantTradeNo}G${b.Gwsr}`;
  const s = (await db.doc(`users/${uid}`).get()).data()?.subscription || {};
  const txn = await db.collection('transactions').where('invoice_key', '==', key).limit(5).get();
  const inv = await db.doc(`invoices/${key}`).get();
  console.log(`${uid.slice(0, 8)}  到期 ${new Date(s.expiresAt).toISOString().slice(0, 10)} (${s.status})`
    + `  帳本 ${txn.empty ? '❌ 沒有' : '✅ ' + txn.docs.map(d => `${d.get('type')}/${d.get('amount_twd')}/${d.get('status')}`).join(',')}`
    + `  發票 ${inv.exists ? inv.get('status') + ' ' + (inv.get('invoice_no') || '') : '❌ 沒有'}`);
}
console.log('\n預期:到期 2026-11-28、帳本 renew/150/success、發票 issued');
