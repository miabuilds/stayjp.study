// 使用者回報收件匣(自動處理流程用)。認證同 pricing-metrics.mjs(firebase login 的 refresh token)。
//   node scripts/reports.mjs list [status=new]        → 印出回報(JSON lines)
//   node scripts/reports.mjs set <id> <status> [note] → 標記 handled / replied / wontfix / spam(+處理備註)
//   node scripts/reports.mjs reply <id> <subject> <bodyfile> → 寫 mail 集合寄信給回報者(Trigger Email),並標 replied
//   node scripts/reports.mjs delete <id>               → 刪(只給測試資料用)
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
const [cmd, ...args] = process.argv.slice(2);
const toMs = (v) => (v == null ? 0 : typeof v.toMillis === 'function' ? v.toMillis() : Number(v) || 0);
if (cmd === 'list') {
  const status = args[0] || 'new';
  const snap = await db.collection('reports').where('status', '==', status).get();
  const rows = snap.docs.map((d) => ({ ...d.data(), _id: d.id })).sort((a, b) => toMs(a.created_at) - toMs(b.created_at));
  for (const r of rows) console.log(JSON.stringify({ ...r, created_at: new Date(toMs(r.created_at)).toISOString() }));
  console.error(`${rows.length} 筆 status=${status}`);
} else if (cmd === 'set') {
  const [id, status, ...note] = args; if (!id || !status) throw new Error('usage: set <id> <status> [note]');
  await db.doc(`reports/${id}`).update({ status, handled_at: admin.firestore.FieldValue.serverTimestamp(), ...(note.length ? { note: note.join(' ') } : {}) }); console.log('ok', id, status);
} else if (cmd === 'reply') {
  const [id, subject, bodyFile] = args; if (!id || !subject || !bodyFile) throw new Error('usage: reply <id> <subject> <bodyfile>');
  const r = (await db.doc(`reports/${id}`).get()).data(); if (!r) throw new Error('no such report');
  if (!r.email) { console.error('回報者沒留 email,只標 replied 不寄信'); await db.doc(`reports/${id}`).update({ status: 'replied', handled_at: admin.firestore.FieldValue.serverTimestamp(), reply_skipped: 'no_email' }); process.exit(0); }
  const text = fs.readFileSync(bodyFile, 'utf8');
  await db.collection('mail').add({ to: r.email, message: { subject, text }, kind: 'report_reply', report_id: id, created_at: admin.firestore.FieldValue.serverTimestamp() });
  await db.doc(`reports/${id}`).update({ status: 'replied', handled_at: admin.firestore.FieldValue.serverTimestamp(), replied_subject: subject });
  console.log('mail queued →', r.email);
} else if (cmd === 'delete') {
  await db.doc(`reports/${args[0]}`).delete(); console.log('deleted', args[0]);
} else { console.error('usage: list|set|reply|delete'); process.exit(1); }
