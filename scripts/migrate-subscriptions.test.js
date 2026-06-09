// 無框架單測:用記憶體假 Firestore 驗 migrate() 的冪等 / 非破壞 / 不覆蓋既有。
// 跑法: node scripts/migrate-subscriptions.test.js
const assert = require("assert");
const { migrate } = require("./migrate-subscriptions");

// 最小假 db:支援 collection('users').get()、collection('subscriptions').doc(id).get()/set()
function fakeDb(users, subs) {
  const subStore = { ...subs };
  return {
    _subStore: subStore,
    collection(name) {
      if (name === "users") {
        return { get: async () => ({
          size: users.length,
          docs: users.map((u) => ({ id: u.id, data: () => u.data })),
        }) };
      }
      if (name === "subscriptions") {
        return { doc: (id) => ({
          get: async () => ({ exists: Object.prototype.hasOwnProperty.call(subStore, id) }),
          set: async (val) => { subStore[id] = { ...(subStore[id] || {}), ...val }; },
        }) };
      }
      throw new Error("unexpected collection " + name);
    },
  };
}

const SUB = { source: "web", plan: "monthly", status: "active", expiresAt: 1, willRenew: true };
let pass = 0;
async function t(name, fn) { await fn(); console.log("✓", name); pass++; }

(async () => {
  // 1. dry-run 不寫
  await t("dry-run 不寫任何東西", async () => {
    const db = fakeDb([{ id: "a", data: { subscription: SUB } }], {});
    const r = await migrate(db, { commit: false });
    assert.deepStrictEqual(r, { copied: 1, skipped: 0, none: 0, total: 1 });
    assert.strictEqual(Object.keys(db._subStore).length, 0, "dry-run 不該寫");
  });

  // 2. commit 複製有 sub 的、略過沒 sub 的
  await t("commit 複製有 subscription 的用戶", async () => {
    const db = fakeDb([
      { id: "a", data: { subscription: SUB } },
      { id: "b", data: { srs_data: {} } },           // 沒 sub
    ], {});
    const r = await migrate(db, { commit: true });
    assert.deepStrictEqual(r, { copied: 1, skipped: 0, none: 1, total: 2 });
    assert.deepStrictEqual(db._subStore.a, SUB);
    assert.ok(!db._subStore.b);
  });

  // 3. 冪等:已存在新 doc 不覆蓋(非破壞)
  await t("既有新 doc 不覆蓋(冪等/非破壞)", async () => {
    const existing = { source: "web", plan: "lifetime", status: "active" };  // 與舊欄位不同
    const db = fakeDb([{ id: "a", data: { subscription: SUB } }], { a: existing });
    const r = await migrate(db, { commit: true });
    assert.deepStrictEqual(r, { copied: 0, skipped: 1, none: 0, total: 1 });
    assert.deepStrictEqual(db._subStore.a, existing, "不該覆蓋既有訂閱");
  });

  // 4. 重跑兩次結果穩定(冪等)
  await t("重跑兩次冪等", async () => {
    const db = fakeDb([{ id: "a", data: { subscription: SUB } }], {});
    await migrate(db, { commit: true });
    const r2 = await migrate(db, { commit: true });
    assert.deepStrictEqual(r2, { copied: 0, skipped: 1, none: 0, total: 1 });
  });

  console.log(`\n${pass}/4 passed`);
  process.exit(0);
})().catch((e) => { console.error("✗ FAILED:", e.message); process.exit(1); });
