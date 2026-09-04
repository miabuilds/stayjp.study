// 客服查詢:用戶回報「買了 premium 面板仍顯示免費」——查 auth 帳號與訂閱資料
// auth 用 admin SDK(refreshToken 可用);Firestore 用 REST(client 需 cert/ADC,走 REST + x-goog-user-project)
const fs = require('fs'); const os = require('os');
const admin = require('firebase-admin');
const PROJECT = 'jpnote-1bdd6';

const cfg = JSON.parse(fs.readFileSync(os.homedir() + '/.config/configstore/firebase-tools.json', 'utf8'));
const RT = cfg.tokens && cfg.tokens.refresh_token;
const CID = '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com';
const CSEC = 'j9iVZfS8kkCEFUPaAeJV0sAi';

admin.initializeApp({
  credential: admin.credential.refreshToken({ type: 'authorized_user', client_id: CID, client_secret: CSEC, refresh_token: RT }),
  projectId: PROJECT,
});

async function accessToken() {
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: CID, client_secret: CSEC, refresh_token: RT, grant_type: 'refresh_token' }),
  });
  const j = await r.json();
  if (!j.access_token) throw new Error('token fail: ' + JSON.stringify(j).slice(0, 200));
  return j.access_token;
}
function fsVal(v) {
  if (v == null) return null;
  if (v.stringValue !== undefined) return v.stringValue;
  if (v.integerValue !== undefined) return Number(v.integerValue);
  if (v.doubleValue !== undefined) return v.doubleValue;
  if (v.booleanValue !== undefined) return v.booleanValue;
  if (v.timestampValue !== undefined) return v.timestampValue;
  if (v.nullValue !== undefined) return null;
  if (v.mapValue) return Object.fromEntries(Object.entries(v.mapValue.fields || {}).map(([k, x]) => [k, fsVal(x)]));
  if (v.arrayValue) return (v.arrayValue.values || []).map(fsVal);
  return v;
}
async function getDoc(tok, path) {
  const r = await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/${path}`, {
    headers: { Authorization: 'Bearer ' + tok, 'x-goog-user-project': PROJECT },
  });
  if (r.status === 404) return null;
  const j = await r.json();
  if (j.error) { console.log('doc err', path, j.error.message); return null; }
  return Object.fromEntries(Object.entries(j.fields || {}).map(([k, x]) => [k, fsVal(x)]));
}
async function runQuery(tok, body) {
  const r = await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents:runQuery`, {
    method: 'POST', headers: { Authorization: 'Bearer ' + tok, 'Content-Type': 'application/json', 'x-goog-user-project': PROJECT },
    body: JSON.stringify(body),
  });
  return (await r.json()).filter(x => x.document).map(x => ({
    id: x.document.name.split('/').pop(),
    path: x.document.name.split('/documents/')[1],
    data: Object.fromEntries(Object.entries(x.document.fields || {}).map(([k, v]) => [k, fsVal(v)])),
  }));
}

const EMAIL = process.argv[2] || 'sylvie18peng@gmail.com';
const UID_PREFIX = process.argv[3] || 'G7hUonUnPjaA';

(async () => {
  const tok = await accessToken();
  const uids = new Set();
  try {
    const u = await admin.auth().getUserByEmail(EMAIL);
    console.log('AUTH(email):', u.uid, '| providers:', u.providerData.map(p => p.providerId).join(','), '| created:', u.metadata.creationTime, '| lastSignIn:', u.metadata.lastSignInTime);
    uids.add(u.uid);
  } catch (e) { console.log('auth by email:', e.message); }

  // UID 前綴(回報顯示可能截斷):documentId range query
  const pref = await runQuery(tok, { structuredQuery: {
    from: [{ collectionId: 'users' }],
    where: { compositeFilter: { op: 'AND', filters: [
      { fieldFilter: { field: { fieldPath: '__name__' }, op: 'GREATER_THAN_OR_EQUAL', value: { referenceValue: `projects/${PROJECT}/databases/(default)/documents/users/${UID_PREFIX}` } } },
      { fieldFilter: { field: { fieldPath: '__name__' }, op: 'LESS_THAN', value: { referenceValue: `projects/${PROJECT}/databases/(default)/documents/users/${UID_PREFIX}` } } },
    ] } },
    limit: 5,
  } });
  pref.forEach(d => uids.add(d.id));

  for (const uid of uids) {
    const v = (await getDoc(tok, 'users/' + uid)) || {};
    console.log('\n=== users/' + uid);
    console.log('  email:', v.email || '-');
    console.log('  subscription:', JSON.stringify(v.subscription || null));
    ['plan', 'premium', 'isPremium', 'premiumUntil', 'free_forever'].forEach(k => { if (v[k] !== undefined) console.log('  ' + k + ':', JSON.stringify(v[k])); });
    try {
      const au = await admin.auth().getUser(uid);
      console.log('  auth:', au.email, '|', au.providerData.map(p => p.providerId).join(','), '| lastSignIn:', au.metadata.lastSignInTime);
    } catch (e) { console.log('  auth:', e.message); }
  }

  // 用 email 掃訂單集合
  for (const col of ['payments', 'orders']) {
    const rows = await runQuery(tok, { structuredQuery: {
      from: [{ collectionId: col }],
      where: { fieldFilter: { field: { fieldPath: 'email' }, op: 'EQUAL', value: { stringValue: EMAIL } } },
      limit: 5,
    } }).catch(e => (console.log(col, e.message), []));
    if (rows.length) rows.forEach(d => console.log('\n' + col + '/' + d.id + ': ' + JSON.stringify(d.data).slice(0, 500)));
    else console.log(col + ': no match by email');
  }
  process.exit(0);
})();
