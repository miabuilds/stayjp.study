// 訂閱遷移:users/{uid}.subscription → subscriptions/{uid}
// 冪等、非破壞(不刪舊欄位;已存在的新 doc 不覆蓋)。
//
// 用法:
//   正式:GOOGLE_APPLICATION_CREDENTIALS=<sa.json> node scripts/migrate-subscriptions.js [--commit]
//   emulator:FIRESTORE_EMULATOR_HOST=localhost:8080 node scripts/migrate-subscriptions.js --commit
//   firebase-admin 解析自 functions/node_modules:用 NODE_PATH=functions/node_modules
// 核心邏輯抽成純函式,方便用假 db 單測(冪等 / 非破壞 / 不覆蓋既有)。
async function migrate(db, { commit }) {
  const snap = await db.collection("users").get();
  let copied = 0, skipped = 0, none = 0;
  for (const doc of snap.docs) {
    const sub = doc.data().subscription;
    if (!sub) { none++; continue; }
    const ref = db.collection("subscriptions").doc(doc.id);
    if ((await ref.get()).exists) { skipped++; continue; }  // 已遷移,不覆蓋
    if (commit) await ref.set(sub, { merge: true });
    copied++;
  }
  return { copied, skipped, none, total: snap.size };
}

module.exports = { migrate };

// 直接執行時才連真實 / emulator Firestore
if (require.main === module) {
  const admin = require("firebase-admin");
  if (admin.apps.length === 0) admin.initializeApp({ projectId: process.env.GCLOUD_PROJECT || "jpnote-1bdd6" });
  const COMMIT = process.argv.includes("--commit");
  migrate(admin.firestore(), { commit: COMMIT })
    .then((r) => {
      console.log(`${COMMIT ? "COMMITTED" : "DRY-RUN"}: copy=${r.copied} skip(existing)=${r.skipped} no-sub=${r.none} total=${r.total}`);
      process.exit(0);
    })
    .catch((e) => { console.error(e); process.exit(1); });
}
