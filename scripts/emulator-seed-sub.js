// emulator 種子:造一個「肥 user doc(2700 項 SRS)+ 舊式 subscription」的測試用戶,供 Gate 1 驗證。
// 用法:FIRESTORE_EMULATOR_HOST=localhost:8080 NODE_PATH=functions/node_modules node scripts/emulator-seed-sub.js
const admin = require("firebase-admin");
if (admin.apps.length === 0) admin.initializeApp({ projectId: process.env.GCLOUD_PROJECT || "jpnote-1bdd6" });
const db = admin.firestore();

(async () => {
  const uid = "TEST_FAT_USER";
  const now = Date.now();
  const srs = {};
  for (let i = 0; i < 2700; i++) {
    srs[`n3:詞${i}`] = {
      interval: 7, ease: 2.5, nextReview: "2026-07-01", nextReviewTs: now + 7 * 86400000,
      reviews: 5, correct: 4, lastReview: "2026-06-09", lastReviewTs: now,
    };
  }
  await db.doc(`users/${uid}`).set({
    srs_data: srs,
    subscription: {
      source: "web", plan: "monthly", status: "active",
      expiresAt: now + 30 * 86400000, willRenew: true, startedAt: now, failed_retries: 0,
    },
  });
  console.log(`seeded users/${uid} with 2700 srs + legacy subscription`);
  process.exit(0);
})().catch((e) => { console.error(e); process.exit(1); });
