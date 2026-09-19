// 使用者回報收件匣(自動處理流程用)。認證同 pricing-metrics.mjs(firebase login 的 refresh token)。
//   node scripts/reports.mjs list [status=new]        → 印出回報(JSON lines)
//   node scripts/reports.mjs set <id> <status> [note] → 標記 handled / replied / wontfix / spam(+處理備註)
//   node scripts/reports.mjs reply <id> <subject> <bodyfile> → 寫 mail 集合寄信給回報者(Trigger Email),並標 replied
//   node scripts/reports.mjs delete <id>               → 刪(只給測試資料用)
import fs from 'node:fs';
import { db, admin } from './lib/fire-admin.mjs';   // 認證集中在 helper(repo 是 public,不寫死任何憑證)
const [cmd, ...args] = process.argv.slice(2);
const toMs = (v) => (v == null ? 0 : typeof v.toMillis === 'function' ? v.toMillis() : Number(v) || 0);
if (cmd === 'list') {
  const status = args[0] || 'new';
  const snap = await db.collection('reports').where('status', '==', status).get();
  const rows = snap.docs.map((d) => ({ ...d.data(), _id: d.id })).sort((a, b) => toMs(a.created_at) - toMs(b.created_at));
  // 同一個人(同 email 或同 uid)之前回過的:第二封常是接著上一封講(Mia 提醒),附上讓處理者先看脈絡
  const all = (await db.collection('reports').get()).docs.map((d) => ({ ...d.data(), _id: d.id }));
  for (const r of rows) {
    const prior = all.filter((x) => x._id !== r._id && ((r.email && x.email === r.email) || (r.uid && x.uid === r.uid)))
      .sort((a, b) => toMs(b.created_at) - toMs(a.created_at)).slice(0, 5)
      .map((x) => ({ _id: x._id, at: new Date(toMs(x.created_at)).toISOString().slice(0, 16), status: x.status, kind: x.kind, id: x.id, desc: String(x.desc || '').slice(0, 200), note: x.note || '', replied_subject: x.replied_subject || '' }));
    console.log(JSON.stringify({ ...r, created_at: new Date(toMs(r.created_at)).toISOString(), prior }));
  }
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
