import { db } from './lib/fire-admin.mjs';
import { admin } from './lib/fire-admin.mjs';
for (const c of process.argv.slice(2)) {
  const d = (await db.doc('ref_codes/' + c).get()).data() || {};
  let email = '(無 owner)';
  if (d.owner_uid) { try { email = (await admin.auth().getUser(d.owner_uid)).email || '(無 email)'; } catch { email = '(帳號查不到)'; } }
  console.log(`${c.padEnd(12)} type=${d.type} owner=${email} note=${d.note || '-'}`);
}
process.exit(0);
