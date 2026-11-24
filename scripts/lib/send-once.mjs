// 寄信唯一入口(防重複寄)。所有「寄給使用者」的信都走這裡,不准直接 db.collection('mail').add。
// 擋三種重複:
//   1. 同一件事(key)寄過 → 信件 ID 由 收件人+key 算出來,用 create() 寫入,已存在就寫不進去(兩邊同時跑也只會成功一個)
//   2. 同一個人 30 天內收過一模一樣的主旨(擋舊腳本、沒帶 key 的寄法)
//   3. 對應的回報/回饋已經標成回過(由 mail-reply.mjs 檢查)
// 密件副本信箱不寫在程式裡:讀環境變數 REPLY_BCC 或 ~/.config/stay/mail.env。
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { db, admin } from './fire-admin.mjs';

const DAY = 86400000;
const norm = (s) => String(s || '').trim().toLowerCase();
const normSubject = (s) => String(s || '').replace(/\s+/g, '').toLowerCase();

function bccAddr() {
  if (process.env.REPLY_BCC) return process.env.REPLY_BCC;
  try {
    const m = fs.readFileSync(path.join(os.homedir(), '.config/stay/mail.env'), 'utf8').match(/^REPLY_BCC=(.+)$/m);
    if (m) return m[1].trim();
  } catch {}
  throw new Error('缺密件副本信箱:設環境變數 REPLY_BCC 或 ~/.config/stay/mail.env');
}

const whenOf = (x) => {
  const t = (x.delivery && (x.delivery.startTime || x.delivery.endTime)) || x.created_at || x._createdAt;
  return t && t.toDate ? t.toDate().getTime() : 0;
};

// 這個人收過的信(新到舊)。to 可能存成字串或陣列,兩種都查。
export async function mailHistory(to, days = 60) {
  const addr = String(to).trim(), seen = new Map();
  const variants = [...new Set([addr, norm(addr)])];
  for (const a of variants) {
    for (const q of [db.collection('mail').where('to', '==', a), db.collection('mail').where('to', 'array-contains', a)]) {
      const s = await q.get();
      for (const d of s.docs) seen.set(d.id, { id: d.id, ...d.data() });
    }
  }
  const since = Date.now() - days * DAY;
  return [...seen.values()]
    .map((x) => ({ id: x.id, at: whenOf(x), subject: (x.message && x.message.subject) || '', state: (x.delivery && x.delivery.state) || '', key: x.dedupe_key || '', kind: x.kind || x._campaign || '' }))
    .filter((x) => !x.at || x.at >= since)
    .sort((a, b) => b.at - a.at);
}

export function mailId(to, key) {
  return 'once_' + crypto.createHash('sha256').update(norm(to) + '|' + String(key)).digest('hex').slice(0, 40);
}

// 回傳 { sent:true, state } 或 { sent:false, skipped:'same_key'|'same_subject', prev }
export async function sendOnce({ to, subject, text, html, key, kind = 'reply', extra = {}, dry = false, wait = true }) {
  if (!to || !subject || !(text || html)) throw new Error('sendOnce 需要 to / subject / text');
  if (!key) throw new Error('sendOnce 需要 key(這封信在回哪一件事,例如 feedback:<id>)');
  const ref = db.collection('mail').doc(mailId(to, key));
  const cur = await ref.get();
  if (cur.exists) return { sent: false, skipped: 'same_key', prev: { subject: cur.data().message?.subject, at: whenOf(cur.data()), state: cur.data().delivery?.state } };
  const hist = await mailHistory(to, 30);
  const dup = hist.find((m) => normSubject(m.subject) === normSubject(subject) && m.state !== 'ERROR');
  if (dup) return { sent: false, skipped: 'same_subject', prev: dup };
  if (dry) return { sent: false, skipped: 'dry', recent: hist.slice(0, 5) };
  const doc = {
    to: String(to).trim(), bcc: bccAddr(), message: { subject, ...(html ? { html } : { text }) },
    kind, dedupe_key: String(key), created_at: admin.firestore.FieldValue.serverTimestamp(), ...extra,
  };
  try { await ref.create(doc); }
  catch (e) {
    if (e.code === 6 || /ALREADY_EXISTS/i.test(String(e.message))) return { sent: false, skipped: 'same_key', prev: {} };
    throw e;
  }
  let state = '';
  if (wait) {
    for (let i = 0; i < 20 && !state; i++) {
      await new Promise((r) => setTimeout(r, 1500));
      state = ((await ref.get()).data().delivery || {}).state || '';
      if (state === 'PROCESSING' || state === 'PENDING') state = '';
    }
  }
  return { sent: true, state: state || 'QUEUED', id: ref.id };
}

export const fmtTime = (ms) => (ms ? new Date(ms + 8 * 3600000).toISOString().slice(0, 16).replace('T', ' ') + ' (台灣)' : '時間不明');
