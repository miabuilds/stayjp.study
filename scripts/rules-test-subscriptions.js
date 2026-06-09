// 規則測試:subscriptions/{uid} read owner/admin、write:false（堵自封 premium）。
// 用 @firebase/rules-unit-testing,連 emulator 套用 firestore.rules。由 emulators:exec 啟動。
const fs = require("fs");
const { initializeTestEnvironment, assertFails, assertSucceeds } = require("@firebase/rules-unit-testing");

(async () => {
  const [host, port] = (process.env.FIRESTORE_EMULATOR_HOST || "127.0.0.1:8080").split(":");
  const env = await initializeTestEnvironment({
    projectId: process.env.GCLOUD_PROJECT || "demo-jpnote",
    firestore: { rules: fs.readFileSync("firestore.rules", "utf8"), host, port: Number(port) },
  });

  const alice = env.authenticatedContext("alice").firestore();
  const bob = env.authenticatedContext("bob").firestore();

  // owner 可讀自己的訂閱（即使不存在,get 也應被規則放行）
  await assertSucceeds(alice.doc("subscriptions/alice").get());
  console.log("[rules] owner 讀自己訂閱 → 允許 ✓");

  // owner 不能寫自己的訂閱（write:false → 堵自封 premium）
  await assertFails(alice.doc("subscriptions/alice").set({ status: "active", expiresAt: Date.now() + 1e10 }));
  console.log("[rules] owner 寫自己訂閱(自封 premium)→ 拒絕 ✓");

  // 別人不能讀你的訂閱
  await assertFails(bob.doc("subscriptions/alice").get());
  console.log("[rules] 他人讀你訂閱 → 拒絕 ✓");

  await env.cleanup();
  console.log("RULES TEST: PASS");
  process.exit(0);
})().catch((e) => { console.error("RULES TEST FAIL:", e); process.exit(1); });
