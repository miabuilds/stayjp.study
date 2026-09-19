// Firestore Admin 連線(共用)。認證優先序:
//   1. GCP_SA_KEY(GitHub Actions 用的 service account JSON)
//   2. scripts/.fireauth.json(本機;gitignore,放 firebase CLI 的 OAuth client id/secret)
//   3. FIREBASE_CLI_CLIENT_ID / FIREBASE_CLI_CLIENT_SECRET 環境變數
// refresh_token 一律讀 ~/.config/configstore/firebase-tools.json,不進 repo。
// ⚠️ 這個 repo 是 public:任何認證參數都不准寫死在檔案裡。
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(new URL('../../functions/', import.meta.url));
const admin = require('firebase-admin');
let adcTmp = null;

function localClient() {
  const f = new URL('../.fireauth.json', import.meta.url);
  try { const j = JSON.parse(fs.readFileSync(f, 'utf8')); if (j.client_id && j.client_secret) return j; } catch {}
  if (process.env.FIREBASE_CLI_CLIENT_ID && process.env.FIREBASE_CLI_CLIENT_SECRET) {
    return { client_id: process.env.FIREBASE_CLI_CLIENT_ID, client_secret: process.env.FIREBASE_CLI_CLIENT_SECRET };
  }
  throw new Error('本機缺認證:建立 scripts/.fireauth.json（{"client_id":"…","client_secret":"…"}，值取自 firebase-tools）或設 FIREBASE_CLI_CLIENT_ID/SECRET');
}

function credential() {
  if (process.env.GCP_SA_KEY) return admin.credential.cert(JSON.parse(process.env.GCP_SA_KEY));
  const cfg = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config/configstore/firebase-tools.json'), 'utf8'));
  const rt = cfg.tokens && cfg.tokens.refresh_token;
  if (!rt) throw new Error('無認證:先跑 firebase login');
  const c = localClient();
  adcTmp = path.join(os.tmpdir(), `stayjp-adc-${process.pid}.json`);
  fs.writeFileSync(adcTmp, JSON.stringify({ type: 'authorized_user', client_id: c.client_id, client_secret: c.client_secret, refresh_token: rt }), { mode: 0o600 });
  process.env.GOOGLE_APPLICATION_CREDENTIALS = adcTmp;
  return admin.credential.applicationDefault();
}

process.on('exit', () => { try { if (adcTmp) fs.unlinkSync(adcTmp); } catch {} });
admin.initializeApp({ credential: credential(), projectId: 'jpnote-1bdd6' });
export const db = admin.firestore();
export { admin };
