// 推薦好友雙向獎勵 · rewardReferrerOnPayment 模擬器測
// 直接載入編譯後 helper,打 Firestore 模擬器,驗四情境。
// 跑法:FIRESTORE_EMULATOR_HOST=localhost:8099 GCLOUD_PROJECT=jpnote-1bdd6 node referral-test.mjs
import admin from "firebase-admin";
import { rewardReferrerOnPayment, getSubscription } from "../functions/lib/utils/firestore.js";

if (admin.apps.length === 0) admin.initializeApp({ projectId: "jpnote-1bdd6" });
const db = admin.firestore();

const DAY = 864e5;
let pass = 0, fail = 0;
function check(name, cond) { if (cond) { pass++; console.log("  ✓", name); } else { fail++; console.error("  ✗ FAIL:", name); } }

async function reset(uids) { for (const u of uids) await db.doc(`users/${u}`).delete().catch(() => {}); }
async function setCode(code, data) { await db.doc(`ref_codes/${code}`).set(data); }
async function seedFriend(uid, code) { await db.doc(`users/${uid}`).set({ ref_code: code }); }
async function expOf(uid) { const s = await getSubscription(uid); return s ? s.expiresAt : null; }
async function friendPaidAt(uid) { const d = await db.doc(`users/${uid}`).get(); return (d.data() || {}).referrer_paid_at || null; }
async function giftTxns(uid) {
  const q = await db.collection("transactions").where("uid", "==", uid).where("type", "==", "gift").get();
  return q.size;
}

async function wipe(coll) {
  const q = await db.collection(coll).get();
  for (const d of q.docs) await d.ref.delete();
}

(async () => {
  // 清乾淨:模擬器跨次執行會殘留,先清 transactions/users/ref_codes 才能準確計數
  await wipe("transactions");
  await wipe("ref_codes");
  await reset(["ref_owner", "ref_friend", "ref_owner3", "ref_friend3", "ref_self", "ref_owner5", "ref_friend5", "kol_owner", "kol_friend", "nobody"]);

  console.log("\n=== 情境 1:朋友真付費 → 碼主 +7 天 + gift txn + 冪等旗標 ===");
  await reset(["ref_owner", "ref_friend"]);
  await setCode("USRTEST", { type: "user", owner_uid: "ref_owner", active: true });
  await seedFriend("ref_friend", "USRTEST");
  await rewardReferrerOnPayment("ref_friend", false);
  const e1 = await expOf("ref_owner");
  check("碼主獲得訂閱且到期日 ≈ now+7d", e1 && Math.abs(e1 - (Date.now() + 7 * DAY)) < 60000);
  check("碼主收到 1 筆 gift 交易", (await giftTxns("ref_owner")) === 1);
  check("朋友被標記 referrer_paid_at", !!(await friendPaidAt("ref_friend")));

  console.log("\n=== 情境 2:冪等 — 再呼叫一次(續訂)不重複發 ===");
  await rewardReferrerOnPayment("ref_friend", false);
  const e2 = await expOf("ref_owner");
  check("碼主到期日不變(沒再 +7)", e2 === e1);
  check("gift 交易仍只有 1 筆", (await giftTxns("ref_owner")) === 1);

  console.log("\n=== 情境 3:碼主已有有效訂閱 → 在現有到期日上疊加 +7,不是從 now 起算 ===");
  await reset(["ref_owner3", "ref_friend3"]);
  const future = Date.now() + 30 * DAY;
  await db.doc(`users/ref_owner3`).set({ subscription: { status: "active", plan: "monthly", expiresAt: future, source: "web", willRenew: true } });
  await setCode("USRTEST3", { type: "user", owner_uid: "ref_owner3", active: true });
  await seedFriend("ref_friend3", "USRTEST3");
  await rewardReferrerOnPayment("ref_friend3", false);
  const e3 = await expOf("ref_owner3");
  check("在既有到期日上 +7(≈ now+37d)", e3 && Math.abs(e3 - (future + 7 * DAY)) < 60000);
  check("保留原 willRenew=true", (await getSubscription("ref_owner3")).willRenew === true);

  console.log("\n=== 情境 4:自我推薦(owner === friend)→ 不發 ===");
  await reset(["ref_self"]);
  await setCode("USRSELF", { type: "user", owner_uid: "ref_self", active: true });
  await seedFriend("ref_self", "USRSELF");
  await rewardReferrerOnPayment("ref_self", false);
  check("自我推薦不建立訂閱", (await expOf("ref_self")) === null);
  check("自我推薦不設 referrer_paid_at", (await friendPaidAt("ref_self")) === null);

  console.log("\n=== 情境 5:沙盒付款 → 不發 ===");
  await reset(["ref_owner5", "ref_friend5"]);
  await setCode("USRTEST5", { type: "user", owner_uid: "ref_owner5", active: true });
  await seedFriend("ref_friend5", "USRTEST5");
  await rewardReferrerOnPayment("ref_friend5", true);   // isSandbox=true
  check("沙盒不獎碼主", (await expOf("ref_owner5")) === null);
  check("沙盒不標記朋友", (await friendPaidAt("ref_friend5")) === null);

  console.log("\n=== 情境 6:KOL 型碼(type=kol)→ 不走用戶獎勵(避免與抽成重複給)===");
  await reset(["kol_owner", "kol_friend"]);
  await setCode("KOLCODE", { type: "kol", owner_uid: "kol_owner", kol: "someKOL", active: true });
  await seedFriend("kol_friend", "KOLCODE");
  await rewardReferrerOnPayment("kol_friend", false);
  check("KOL 碼不獎個人碼主", (await expOf("kol_owner")) === null);

  console.log("\n=== 情境 7:朋友沒歸因碼 → 安全略過 ===");
  await reset(["nobody"]);
  await db.doc(`users/nobody`).set({ email: "x@y.z" });
  await rewardReferrerOnPayment("nobody", false);
  check("沒碼不炸、不寫東西", (await friendPaidAt("nobody")) === null);

  console.log(`\n=== 結果:${pass} 通過, ${fail} 失敗 ===`);
  await reset(["ref_owner", "ref_friend", "ref_owner3", "ref_friend3", "ref_self", "ref_owner5", "ref_friend5", "kol_owner", "kol_friend", "nobody"]);
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error("測試崩潰:", e); process.exit(1); });
