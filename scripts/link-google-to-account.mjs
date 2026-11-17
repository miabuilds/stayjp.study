// 把某個 Gmail 的 Google 登入「接到」既有帳號上(例:用 Apple 隱藏信箱訂閱的人想改用 Google 登入,訂閱與進度留在原帳號)。
// 2026-11-17 Richard(Apple 帳號 iPqjj9S43lgcQbYJLhDUSVztHA93,早鳥年費)案例。
//
// 前提:對方要先用那個 Gmail 在 StayJP「用 Google 登入」過一次 —— Firebase 要有那個 Google 帳號的內部編號才接得上,光有信箱不夠。
// 那次登入會產生一個空的新帳號;這支會確認它是空的(沒訂閱、沒學習紀錄)→ 刪掉 → 把 Google 登入掛到原帳號。
// 之後對方用 Google 登入就會進到原帳號(uid 不變,訂閱/RevenueCat/進度都不用搬);原本的 Apple 登入照樣能用。
//
// 用法:
//   node scripts/link-google-to-account.mjs <原帳號uid> <gmail>            只檢查,不動
//   node scripts/link-google-to-account.mjs <原帳號uid> <gmail> --apply    真的做
import { db, admin } from "./lib/fire-admin.mjs";
const [uid, email] = process.argv.slice(2);
const APPLY = process.argv.includes("--apply");
if (!uid || !email || uid.startsWith("--") || !/@/.test(email)) { console.error("用法: node scripts/link-google-to-account.mjs <原帳號uid> <gmail> [--apply]"); process.exit(1); }
const auth = admin.auth();

const main = await auth.getUser(uid);
console.log("原帳號:", main.uid, main.email, "| 登入方式:", main.providerData.map((p) => p.providerId).join(",") || "(無)");
if (main.providerData.some((p) => p.providerId === "google.com")) { console.log("原帳號已經有 Google 登入了,不用做。"); process.exit(0); }

let g;
try { g = await auth.getUserByEmail(email); }
catch (e) { console.log(`✗ ${email} 還沒在 StayJP 用 Google 登入過 → 請對方先登入一次再跑。`); process.exit(2); }
if (g.uid === uid) { console.log("這個信箱已經就是原帳號。"); process.exit(0); }
const gp = g.providerData.find((p) => p.providerId === "google.com");
if (!gp) { console.log(`✗ ${email} 的帳號(${g.uid})不是用 Google 登入的(${g.providerData.map((p) => p.providerId).join(",")}),先確認。`); process.exit(2); }

// 新帳號必須是空的才刪
const gd = (await db.collection("users").doc(g.uid).get()).data() || {};
const srs = await db.collection("users").doc(g.uid).collection("srs").get();
const srsN = srs.docs.reduce((a, d) => a + Object.keys((d.data() || {}).d || {}).length, 0);
const logN = Object.keys(gd.study_log || {}).length;
const sub = gd.subscription && gd.subscription.status === "active";
const free = (await db.collection("free_users").doc(g.uid).get()).exists;
console.log("Google 新帳號:", g.uid, "| 建立", g.metadata.creationTime, "| 訂閱", sub ? "有" : "無", "| 白名單", free ? "有" : "無", "| 背過的字", srsN, "| 學習天數", logN);
if (sub || free || srsN > 20 || logN > 2) { console.log("✗ 這個 Google 帳號有訂閱或學習紀錄,不能直接刪。停下來人工判斷(要不要搬資料)。"); process.exit(3); }

if (!APPLY) { console.log("\n檢查通過。加 --apply 才會:刪掉這個空的 Google 帳號 → 把 Google 登入掛到原帳號。"); process.exit(0); }

// 1) 刪空帳號(Auth + Firestore),Google 編號才會釋出
for (const d of srs.docs) await d.ref.delete();
await db.collection("users").doc(g.uid).delete().catch(() => {});
await db.collection("user_progress").doc(g.uid).delete().catch(() => {});
await auth.deleteUser(g.uid);
// 2) 掛到原帳號
await auth.updateUser(uid, { providerToLink: { providerId: "google.com", uid: gp.uid, email: gp.email || email, displayName: gp.displayName || undefined } });
const after = await auth.getUser(uid);
console.log("✓ 完成。原帳號登入方式:", after.providerData.map((p) => p.providerId + "(" + p.email + ")").join(" , "));
const s = ((await db.collection("users").doc(uid).get()).data() || {}).subscription || {};
console.log("  訂閱:", s.plan, s.status, s.expiresAt ? new Date(s.expiresAt).toISOString().slice(0, 10) : "");
process.exit(0);
