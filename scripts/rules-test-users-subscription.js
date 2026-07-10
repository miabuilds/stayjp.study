// 規則測試:現行 users/{uid} — 本人可寫進度,但禁止 client 寫 subscription / trial_started_at
// (堵自封 premium)。用 @firebase/rules-unit-testing 套用 firestore.rules。由 emulators:exec 啟動。
const fs = require("fs");
const { initializeTestEnvironment, assertFails, assertSucceeds } = require("@firebase/rules-unit-testing");

(async () => {
  const [host, port] = (process.env.FIRESTORE_EMULATOR_HOST || "127.0.0.1:8080").split(":");
  const env = await initializeTestEnvironment({
    projectId: process.env.GCLOUD_PROJECT || "demo-jpnote",
    firestore: { rules: fs.readFileSync(process.env.RULES_FILE || "firestore.rules", "utf8"), host, port: Number(port) },
  });

  // seed alice 既有 user doc(繞規則),含一個由 Cloud Function 寫入的 subscription
  await env.withSecurityRulesDisabled(async (ctx) => {
    await ctx.firestore().doc("users/alice").set({ srs_data: { a: 1 }, subscription: { status: "expired" } });
  });
  const alice = env.authenticatedContext("alice").firestore();

  await assertSucceeds(alice.doc("users/alice").set({ srs_data: { a: 2 } }, { merge: true }));
  console.log("[rules] owner 寫 srs_data(正常進度)→ 允許 ✓");

  await assertFails(alice.doc("users/alice").set({ subscription: { status: "active", expiresAt: Date.now() + 1e10 } }, { merge: true }));
  console.log("[rules] owner update 自寫 subscription(自封 premium)→ 拒絕 ✓");

  await assertFails(alice.doc("users/alice").set({ trial_started_at: 123 }, { merge: true }));
  console.log("[rules] owner 自寫 trial_started_at → 拒絕 ✓");

  await assertFails(env.authenticatedContext("carol").firestore().doc("users/carol").set({ subscription: { status: "active" } }));
  console.log("[rules] owner create 新 doc 帶 subscription → 拒絕 ✓");

  await env.cleanup();
  console.log("RULES TEST: PASS");
  process.exit(0);
})().catch((e) => { console.error("RULES TEST FAIL:", e); process.exit(1); });
