#!/usr/bin/env node
/**
 * export-content-static.cjs
 * ─────────────────────────────────────────────────────────────────────────────
 * 把 Firestore content/* 匯出成「靜態檔」，讓網站改從 GitHub Pages(CDN、免費流量)載內容，
 * 不再每次都打 Firestore（省下 Firestore 對外傳輸費 = 帳單主因）。
 *
 * 產出（repo 根目錄）：
 *   content-data.json     → { version, data }  ← content-loader 主要讀這個(完整內容)
 *   content-version.json  → { version }        ← 輕量版本檢查用(判斷要不要重抓)
 *
 * data 形狀與 content-loader.js 完全一致：
 *   { vocab:{n5..n1}, grammar:{n5..n1}, confusables, listening_items, reading_passages }
 *
 * 用法：
 *   NODE_PATH=functions/node_modules node scripts/export-content-static.cjs --key <serviceAccount.json>
 * 之後每次在 Firestore 後台更新內容 → 跑這支重新匯出 → 部署網站即可。
 * ─────────────────────────────────────────────────────────────────────────────
 */
'use strict';
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const argv = process.argv.slice(2);
const KEY = (() => { const i = argv.indexOf('--key'); return i >= 0 ? argv[i + 1] : process.env.GOOGLE_APPLICATION_CREDENTIALS; })();
const PROJECT = 'jpnote-1bdd6';
const OUT_DIR = path.resolve(__dirname, '..');

if (KEY) admin.initializeApp({ credential: admin.credential.cert(require(path.resolve(KEY))), projectId: PROJECT });
else admin.initializeApp({ projectId: PROJECT });
const db = admin.firestore();

// 與 content-loader.js 的 assignShard 完全相同
function assignShard(data, name, payload) {
  if (name.indexOf('vocab_') === 0) { (data.vocab = data.vocab || {})[name.slice(6)] = payload; }
  else if (name.indexOf('grammar_') === 0) { (data.grammar = data.grammar || {})[name.slice(8)] = payload; }
  else { data[name] = payload; }
}

(async () => {
  let version, data = {};
  const manifestDoc = await db.doc('content/manifest').get();
  if (manifestDoc.exists && manifestDoc.data().payload) {
    const m = JSON.parse(manifestDoc.data().payload);
    version = manifestDoc.data().version || m.version;
    if (!m.shards || !m.shards.length) throw new Error('manifest 無 shards');
    console.log('manifest version =', version, ' shards =', m.shards.map(s => s.name).join(', '));
    for (const sh of m.shards) {
      const d = await db.doc('content/shard_' + sh.name).get();
      if (!d.exists || !d.data().payload) throw new Error('缺 shard: ' + sh.name);
      assignShard(data, sh.name, JSON.parse(d.data().payload));
    }
  } else {
    // fallback：舊整包 master
    const masterDoc = await db.doc('content/master').get();
    if (!masterDoc.exists || !masterDoc.data().payload) throw new Error('content/manifest 與 content/master 都讀不到');
    version = masterDoc.data().version;
    data = JSON.parse(masterDoc.data().payload);
    console.log('(用 master 整包) version =', version);
  }

  const out = { version, data };
  const dataPath = path.join(OUT_DIR, 'content-data.json');
  const verPath = path.join(OUT_DIR, 'content-version.json');
  fs.writeFileSync(dataPath, JSON.stringify(out));
  fs.writeFileSync(verPath, JSON.stringify({ version }));

  // 驗證報告
  const cnt = (a) => Array.isArray(a) ? a.length : 0;
  const v = data.vocab || {}, g = data.grammar || {};
  console.log('\n=== 匯出完成 ===');
  console.log('version:', version);
  console.log('vocab   n5/n4/n3/n2/n1:', cnt(v.n5), cnt(v.n4), cnt(v.n3), cnt(v.n2), cnt(v.n1));
  console.log('grammar n5/n4/n3/n2/n1:', cnt(g.n5), cnt(g.n4), cnt(g.n3), cnt(g.n2), cnt(g.n1));
  console.log('confusables:', cnt(data.confusables), ' listening_items:', cnt(data.listening_items), ' reading_passages:', cnt(data.reading_passages));
  console.log('content-data.json 大小:', (fs.statSync(dataPath).size / 1024 / 1024).toFixed(2), 'MB');
  console.log('寫出:', dataPath);
  process.exit(0);
})().catch(e => { console.error('匯出失敗:', e.message); process.exit(1); });
