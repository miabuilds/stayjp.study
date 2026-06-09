// 對帳:列出「有舊 users.subscription 但沒有新 subscriptions/{uid} doc」者。期望 0。
// 用法同 migrate-subscriptions.js(NODE_PATH=functions/node_modules + 憑證 / emulator)。
const admin = require("firebase-admin");
if (admin.apps.length === 0) admin.initializeApp({ projectId: "jpnote-1bdd6" });
const db = admin.firestore();

(async () => {
  const users = await db.collection("users").get();
  let missing = 0;
  for (const doc of users.docs) {
    if (!doc.data().subscription) continue;
    if (!(await db.collection("subscriptions").doc(doc.id).get()).exists) {
      missing++;
      console.log("MISSING new sub for", doc.id);
    }
  }
  console.log(`users-with-legacy-sub-but-no-new-doc = ${missing} (期望 0)`);
  process.exit(missing === 0 ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
