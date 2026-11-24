// 回信給使用者的唯一指令(防重複寄)。排程、Claude、手動都用這支,不准自己寫 mail 集合。
//   node scripts/mail-reply.mjs check <email>                              這個人 60 天內收過哪些信(寄之前先看)
//   node scripts/mail-reply.mjs feedback <feedbackId> "<主旨>" <內文檔>     回「意見回饋」,寄成功標 resolved
//   node scripts/mail-reply.mjs report   <reportId>   "<主旨>" <內文檔>     回 App 內回報,寄成功標 replied
//   node scripts/mail-reply.mjs send <email> <key> "<主旨>" <內文檔>        其他 App 的回饋(key 例:staytw:fb:123)
// 選項: --dry 只檢查不寄   --followup=<n> 同一件事的第 n 封追加信(更正、補充),要有 Mia 同意才用
// 結束碼: 0 寄出成功 / 2 判定重複所以沒寄(不是錯誤,不要重試、不要換主旨再寄) / 1 真的失敗
import fs from 'node:fs';
import { db, admin } from './lib/fire-admin.mjs';
import { sendOnce, mailHistory, fmtTime } from './lib/send-once.mjs';

const argv = process.argv.slice(2);
const flags = argv.filter((a) => a.startsWith('--'));
const args = argv.filter((a) => !a.startsWith('--'));
const dry = flags.includes('--dry');
const fu = (flags.find((f) => f.startsWith('--followup=')) || '').split('=')[1];
const cmd = args.shift();
const now = () => admin.firestore.FieldValue.serverTimestamp();

function done(r, to) {
  if (r.sent) { console.log(`已寄出 → ${to}  狀態:${r.state}`); return r.state === 'SUCCESS' || r.state === 'QUEUED'; }
  if (r.skipped === 'dry') {
    console.log(`(試跑)沒有重複,可以寄 → ${to}`);
    for (const m of r.recent || []) console.log(`  最近收過:${fmtTime(m.at)}  ${m.subject}`);
    process.exit(0);
  }
  const why = r.skipped === 'same_key' ? '這件事已經回過信' : '這個人 30 天內收過一模一樣主旨的信';
  console.log(`沒寄:${why}。上一封:${fmtTime(r.prev && r.prev.at)}  ${(r.prev && r.prev.subject) || ''}`);
  console.log('這不是錯誤,不要重試,也不要改主旨再寄。真的要追加一封,先問 Mia,再加 --followup=2。');
  process.exit(2);
}

if (cmd === 'check') {
  const [email] = args; if (!email) throw new Error('usage: check <email>');
  const h = await mailHistory(email, 60);
  console.log(`${email} 60 天內收過 ${h.length} 封:`);
  for (const m of h) console.log(`  ${fmtTime(m.at)}  [${m.state || '?'}]  ${m.subject}${m.kind ? '  (' + m.kind + ')' : ''}`);
} else if (cmd === 'feedback' || cmd === 'report') {
  const [id, subject, bodyFile] = args; if (!id || !subject || !bodyFile) throw new Error(`usage: ${cmd} <id> "<主旨>" <內文檔>`);
  const col = cmd === 'feedback' ? 'feedback' : 'reports';
  const snap = await db.doc(`${col}/${id}`).get(); if (!snap.exists) throw new Error(`找不到 ${col}/${id}`);
  const r = snap.data();
  if (!r.email) {
    console.log('對方沒留 email,只標狀態不寄信');
    if (!dry) await snap.ref.update({ status: cmd === 'feedback' ? 'resolved' : 'replied', handled_at: now(), reply_skipped: 'no_email' });
    process.exit(0);
  }
  const prevSubject = r.email_subject || r.replied_subject;
  if (prevSubject && !fu) {
    console.log(`沒寄:${col}/${id} 已經回過信(主旨「${prevSubject}」,狀態 ${r.status})。`);
    console.log('這不是錯誤,不要重試,也不要改主旨再寄。真的要追加一封,先問 Mia,再加 --followup=2。');
    process.exit(2);
  }
  const text = fs.readFileSync(bodyFile, 'utf8');
  const res = await sendOnce({ to: r.email, subject, text, key: `${col}:${id}${fu ? ':' + fu : ''}`, kind: `${cmd}_reply`, extra: { [`${cmd}_id`]: id }, dry });
  if (done(res, r.email)) {
    await snap.ref.update(cmd === 'feedback'
      ? { status: 'resolved', email_subject: subject, handled_at: now() }
      : { status: 'replied', replied_subject: subject, handled_at: now() });
    console.log(`${col}/${id} 已標成回過`);
  } else { console.log('寄送失敗,狀態沒動'); process.exit(1); }
} else if (cmd === 'send') {
  const [email, key, subject, bodyFile] = args; if (!email || !key || !subject || !bodyFile) throw new Error('usage: send <email> <key> "<主旨>" <內文檔>');
  const res = await sendOnce({ to: email, subject, text: fs.readFileSync(bodyFile, 'utf8'), key: key + (fu ? ':' + fu : ''), kind: 'reply', dry });
  if (!done(res, email)) process.exit(1);
} else {
  console.error('usage: check | feedback | report | send   (看檔頭說明)'); process.exit(1);
}
process.exit(0);
