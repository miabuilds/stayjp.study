// CI Gate 1（在 emulator 內跑）：種子肥用戶 → 遷移 → 驗新訂閱 doc → 對帳 0。
// 由 `firebase emulators:exec` 啟動,故 FIRESTORE_EMULATOR_HOST / GCLOUD_PROJECT 已設好。
// admin SDK 連 emulator（不碰正式）。
const assert = require("assert");
const admin = require("firebase-admin");
const { migrate } = require("./migrate-subscriptions");

if (admin.apps.length === 0) {
  admin.initializeApp({ projectId: process.env.GCLOUD_PROJECT || "demo-jpnote" });
}
const db = admin.firestore();

(async () => {
  // 1. 種子:肥 user doc(2700 項 SRS）+ 舊式 subscription
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
    subscription: { source: "web", plan: "monthly", status: "active", expiresAt: now + 30 * 86400000, willRenew: true, startedAt: now, failed_retries: 0 },
  });
  console.log("[gate1] seeded fat user (2700 srs + legacy subscription)");

  // 2. 遷移
  const r = await migrate(db, { commit: true });
  console.log("[gate1] migrate:", JSON.stringify(r));
  assert.ok(r.copied >= 1, "migrate 應至少複製種子用戶");

  // 3. 新訂閱 doc 存在且內容正確
  const ns = await db.collection("subscriptions").doc(uid).get();
  assert.ok(ns.exists, "subscriptions/TEST_FAT_USER 應存在");
  assert.strictEqual(ns.data().status, "active", "status 應為 active");
  assert.strictEqual(ns.data().plan, "monthly", "plan 應為 monthly");
  console.log("[gate1] subscription 遷移正確");

  // 4. 對帳：有舊 sub 但無新 doc 者 = 0
  const users = await db.collection("users").get();
  let missing = 0;
  for (const d of users.docs) {
    if (d.data().subscription && !(await db.collection("subscriptions").doc(d.id).get()).exists) missing++;
  }
  assert.strictEqual(missing, 0, "對帳應為 0");
  console.log("[gate1] 對帳 = 0");

  console.log("GATE1 EMULATOR E2E: PASS");
  process.exit(0);
})().catch((e) => { console.error("GATE1 FAIL:", e); process.exit(1); });
