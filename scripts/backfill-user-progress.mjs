#!/usr/bin/env node
// Phase 2 回填:掃全 users,把 legacy 進度大 key 壓縮補進 user_progress/{uid}。
// 鐵則:冪等、非破壞、只加不刪、可續跑。**已存在於 user_progress 的 key 絕不覆蓋**
//       (dual-write 可能已寫了較新的值)——只補 user_progress 缺、而 legacy 有的 key。
//
// 記憶體安全:分頁(每頁 PAGE 筆)+ .select() 只取進度大欄位(不整份 doc),避免重演 adminListSubscribers 爆記憶體。
//
// 認證(擇一):GCP_SA_KEY(service account JSON,同 check-doc-sizes.mjs);
//            或本機 firebase CLI 登入(讀 ~/.config/configstore/firebase-tools.json 的 refresh_token)。
// DRY_RUN=1:只統計「要回填幾個用戶 / 幾個 key」,不寫。先跑這個。
import fs from 'node:fs';
import { db, admin } from './lib/fire-admin.mjs';   // 認證集中在 helper(repo 是 public,不寫死任何憑證)
let scanned = 0, migrated = 0, skipped = 0, keysWritten = 0, errors = 0, anon = 0;
let last = null;

while (true) {
  let q = db.collection('users').orderBy('__name__').select(...BIG).limit(PAGE);
  if (last) q = q.startAfter(last);
  const snap = await q.get();
  if (snap.empty) break;
  for (const doc of snap.docs) {
    last = doc; scanned++;
    if (doc.id.startsWith('$RCAnonymousID')) { anon++; skipped++; continue; }
    const d = doc.data();
    const legacyBig = BIG.filter((k) => d[k] != null);
    if (!legacyBig.length) { skipped++; continue; }

    // 已在 user_progress 的 key 不覆蓋 → 只補缺的
    const pref = db.collection('user_progress').doc(doc.id);
    const psnap = await pref.get();
    const existing = psnap.exists ? (psnap.data() || {}) : {};
    const toWrite = legacyBig.filter((k) => existing[k] == null);
    if (!toWrite.length) { skipped++; continue; }

    if (isDry) { migrated++; keysWritten += toWrite.length; continue; }
    const out = {};
    for (const k of toWrite) {
      try { out[k] = Buffer.from(await codec.gzipBytes(d[k])); } catch (e) { errors++; }
    }
    if (Object.keys(out).length) {
      await pref.set(out, { merge: true });
      migrated++; keysWritten += Object.keys(out).length;
    }
  }
  process.stdout.write(`\r  scanned=${scanned} 需回填=${migrated} 略過=${skipped} keys=${keysWritten}`);
}

console.log(`\nDONE${isDry ? ' (DRY_RUN,未寫)' : ''}: 掃描 ${scanned}(匿名 ${anon})· 回填用戶 ${migrated} · 略過 ${skipped} · 寫入 key ${keysWritten} · 壓縮錯誤 ${errors}`);
process.exit(0);
