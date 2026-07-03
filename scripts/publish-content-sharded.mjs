#!/usr/bin/env node
// content/master 太大(~888KB / 1MiB)→ 拆成多份 shard doc,避免撞 Firestore 單 doc 1MiB 上限,
// 並為英文 i18n / N4–N1 補完留出空間。ContentLoader 讀 content/manifest → 並行抓各 shard → 合併。
//
// 相容策略:本腳本「同時」仍寫 content/master(整包),舊 client / 快取 / 回滾都不斷。
//
// 認證(擇一):
//   GCP_SA_KEY   service account JSON 整段(同 migrate-content-to-firestore.mjs)
//   FIRE_TOKEN   firebase CLI access token(gcloud/SA 不可用時);由呼叫端注入
// 可選:
//   DRY_RUN=1    只算大小、印分片清單,不寫 Firestore(預設安全先跑這個)
//   SKIP_MASTER=1  不再寫整包 content/master(僅在確認全綠、要停用舊路時才開)

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = path.resolve(import.meta.dirname, '..');
const isDryRun = !!process.env.DRY_RUN;
const skipMaster = !!process.env.SKIP_MASTER;

function evalJs(src, name) {
  const fn = new Function(src + `; return typeof ${name} !== 'undefined' ? ${name} : null;`);
  return fn();
}
function readJs(file) { return fs.readFileSync(path.join(ROOT, file), 'utf8'); }

// ---- 收集資料(與 migrate-content-to-firestore.mjs 同源)----
const data = { vocab: {}, grammar: {} };
for (const lv of ['n5', 'n4', 'n3', 'n2', 'n1']) {
  data.vocab[lv] = evalJs(readJs(`vocab-${lv}.js`), `VOCAB_${lv.toUpperCase()}`);
  if (!data.vocab[lv]) throw new Error(`vocab-${lv} 抽取失敗`);
  data.grammar[lv] = evalJs(readJs(`grammar-${lv}.js`), lv.toUpperCase());
  if (!data.grammar[lv]) throw new Error(`grammar-${lv} 抽取失敗`);
}
data.confusables = evalJs(readJs('confusables.js').replace(/if \(typeof module[\s\S]*$/, ''), 'CONFUSABLES');
if (!data.confusables) throw new Error('confusables 抽取失敗');
data.listening_items = evalJs(readJs('listening-items.js'), 'LISTENING_ITEMS_SRC');
if (!data.listening_items) throw new Error('listening-items.js 抽取失敗');
data.reading_passages = evalJs(readJs('reading-passages.js'), 'READING_PASSAGES_SRC');
if (!data.reading_passages) throw new Error('reading-passages.js 抽取失敗');

// ---- 定義 shard:每片 = 一個 doc。name 對應 ContentLoader 的合併規則 ----
// 詞彙/文法量最大 → 逐級拆;其餘各成一片。加英文時再各自加 vocab_n5_en 等,結構不變。
const shards = [];
for (const lv of ['n5', 'n4', 'n3', 'n2', 'n1']) {
  shards.push({ name: `vocab_${lv}`, data: data.vocab[lv] });
  shards.push({ name: `grammar_${lv}`, data: data.grammar[lv] });
}
shards.push({ name: 'confusables', data: data.confusables });
shards.push({ name: 'listening_items', data: data.listening_items });
shards.push({ name: 'reading_passages', data: data.reading_passages });

const LIMIT = 1048576;
let maxShard = 0;
console.log('=== 分片大小 ===');
for (const s of shards) {
  s.json = JSON.stringify(s.data);
  s.version = crypto.createHash('sha1').update(s.json).digest('hex').slice(0, 12);
  const kb = (Buffer.byteLength(s.json) / 1024).toFixed(1);
  const pct = (Buffer.byteLength(s.json) / LIMIT * 100).toFixed(0);
  maxShard = Math.max(maxShard, Buffer.byteLength(s.json));
  console.log(`  ${s.name.padEnd(18)} ${kb.padStart(8)} KB  (${pct}% of 1MiB)  v=${s.version}`);
}
const wholeJson = JSON.stringify(data);
const wholeVersion = crypto.createHash('sha1').update(wholeJson).digest('hex').slice(0, 12);
const manifest = { version: wholeVersion, shards: shards.map((s) => ({ name: s.name, version: s.version })) };
console.log('=== 匯總 ===');
console.log(`  舊 content/master 整包: ${(Buffer.byteLength(wholeJson) / 1024).toFixed(1)} KB (${(Buffer.byteLength(wholeJson) / LIMIT * 100).toFixed(0)}%)`);
console.log(`  最大單一 shard:        ${(maxShard / 1024).toFixed(1)} KB (${(maxShard / LIMIT * 100).toFixed(0)}%)  ← 拆後最危險的一片`);
console.log(`  shard 數:              ${shards.length}  + manifest`);
console.log(`  manifest.version:      ${wholeVersion}`);

if (isDryRun) { console.log('\nDRY_RUN=1,不寫 Firestore。'); process.exit(0); }

// ---- 認證:access token ----
async function getAccessToken() {
  if (process.env.FIRE_TOKEN) return process.env.FIRE_TOKEN;
  if (!process.env.GCP_SA_KEY) { console.error('需 GCP_SA_KEY 或 FIRE_TOKEN(或 DRY_RUN=1)'); process.exit(1); }
  const sa = JSON.parse(process.env.GCP_SA_KEY);
  const b64u = (b) => Buffer.from(b).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const now = Math.floor(Date.now() / 1000);
  const claim = b64u(JSON.stringify({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/datastore', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 }));
  const unsigned = `${b64u(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${claim}`;
  const signer = crypto.createSign('RSA-SHA256'); signer.update(unsigned);
  const jwt = `${unsigned}.${b64u(signer.sign(sa.private_key))}`;
  const res = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }) });
  if (!res.ok) { console.error('JWT exchange failed:', await res.text()); process.exit(1); }
  return (await res.json()).access_token;
}
const PROJECT = process.env.FIRE_PROJECT || 'jpnote-1bdd6';
const accessToken = await getAccessToken();

async function patchDoc(docPath, fields) {
  const mask = Object.keys(fields).map((k) => `updateMask.fieldPaths=${k}`).join('&');
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/${docPath}?${mask}`;
  const fv = {};
  for (const [k, v] of Object.entries(fields)) fv[k] = v;
  const r = await fetch(url, { method: 'PATCH', headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: fv }) });
  if (!r.ok) { console.error(`PATCH ${docPath} failed:`, r.status, await r.text()); process.exit(1); }
}

// 1) 寫各 shard
for (const s of shards) {
  await patchDoc(`content/shard_${s.name}`, {
    payload: { stringValue: s.json },
    version: { stringValue: s.version },
    updatedAt: { timestampValue: new Date().toISOString() },
  });
  console.log(`  ✓ content/shard_${s.name}`);
}
// 2) 相容:仍寫整包 content/master(除非 SKIP_MASTER)
if (!skipMaster) {
  await patchDoc('content/master', {
    payload: { stringValue: wholeJson }, version: { stringValue: wholeVersion }, updatedAt: { timestampValue: new Date().toISOString() },
  });
  console.log('  ✓ content/master(相容整包,保留回滾路徑)');
} else {
  console.log('  (SKIP_MASTER=1,略過整包)');
}
// 3) 最後寫 manifest(最後寫 → client 讀到 manifest 時各 shard 必已就緒)
await patchDoc('content/manifest', {
  payload: { stringValue: JSON.stringify(manifest) }, version: { stringValue: wholeVersion }, updatedAt: { timestampValue: new Date().toISOString() },
});
console.log(`  ✓ content/manifest (version=${wholeVersion})`);
console.log('\n完成。');
