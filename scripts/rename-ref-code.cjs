// 幫既有 KOL 改推薦碼(保留 owner 綁定)。與 partnerJoin 改碼邏輯一致:
//   建 ref_codes/新碼(沿用舊碼資料+owner_uid) → 更新 users/{owner}.kol_code → 停用舊碼(active:false+renamed_to)。
// 舊碼「未被使用」(無歸因用戶、無分潤紀錄)才給改,避免現有連結失效;要強改加 --force。
//
// 用法:
//   NODE_PATH="functions/node_modules" node scripts/rename-ref-code.cjs --old 7M7A5RN --new 666666           # dry-run(只讀不寫)
//   NODE_PATH="functions/node_modules" node scripts/rename-ref-code.cjs --old 7M7A5RN --new 666666 --commit  # 實際執行
//   ...--key <serviceAccount.json>   # 沒有 ADC 時用金鑰
const admin = require("firebase-admin");
const path = require("path");

const a = process.argv.slice(2);
let keyPath = null, oldCode = "", newCode = "", commit = false, force = false;
for (let i = 0; i < a.length; i++) {
  if (a[i] === "--key") keyPath = a[++i];
  else if (a[i] === "--old") oldCode = a[++i];
  else if (a[i] === "--new") newCode = a[++i];
  else if (a[i] === "--commit") commit = true;
  else if (a[i] === "--force") force = true;
}
oldCode = String(oldCode || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
newCode = String(newCode || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
if (!oldCode || !newCode) { console.error("需要 --old 與 --new"); process.exit(1); }
if (!/^[A-Z0-9]{4,16}$/.test(newCode)) { console.error("新碼格式需 4–16 碼英數:", newCode); process.exit(1); }

if (keyPath) admin.initializeApp({ credential: admin.credential.cert(require(path.resolve(keyPath))) });
else admin.initializeApp({ projectId: "jpnote-1bdd6" });   // 試用 ADC(gcloud application-default)
const db = admin.firestore();

(async () => {
  const oldRef = db.doc(`ref_codes/${oldCode}`);
  const oldSnap = await oldRef.get();
  if (!oldSnap.exists) { console.error("❌ 舊碼不存在:", oldCode); process.exit(1); }
  const old = oldSnap.data();
  console.log("舊碼:", oldCode, JSON.stringify({ owner_uid: old.owner_uid, kol: old.kol, type: old.type, commission_pct: old.commission_pct, active: old.active }));

  if ((await db.doc(`ref_codes/${newCode}`).get()).exists) { console.error("❌ 新碼已被占用:", newCode); process.exit(1); }

  const owner = old.owner_uid;
  const [usersUsing, commUsing] = await Promise.all([
    db.collection("users").where("ref_code", "==", oldCode).limit(1).get(),
    db.collection("commissions").where("code", "==", oldCode).limit(1).get(),
  ]);
  console.log(`舊碼使用狀況: 歸因用戶=${usersUsing.size} 分潤紀錄=${commUsing.size}`);
  const used = !usersUsing.empty || !commUsing.empty;
  if (used && !force) { console.error("⚠ 舊碼已被使用,改碼會讓現有連結失效。確定要改請加 --force。"); process.exit(1); }

  if (!commit) {
    console.log(`\nDRY RUN — 將執行:\n  1) 建 ref_codes/${newCode}(沿用舊碼資料+owner)\n  2) users/${owner}.kol_code = ${newCode}\n  3) 停用 ref_codes/${oldCode}(active:false, renamed_to:${newCode})\n加 --commit 實際執行。`);
    process.exit(0);
  }

  const newData = { ...old, active: true, renamed_from: oldCode, renamed_at: admin.firestore.FieldValue.serverTimestamp() };
  delete newData.status; delete newData.renamed_to;
  await db.doc(`ref_codes/${newCode}`).set(newData);
  if (owner) await db.doc(`users/${owner}`).set({ kol_code: newCode }, { merge: true });
  await oldRef.set({ active: false, renamed_to: newCode, renamed_at: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  console.log(`\n✅ 完成:${oldCode} → ${newCode}(owner ${owner} 的 kol_code 已更新、舊碼已停用)`);
  process.exit(0);
})().catch((e) => { console.error("ERR:", e.code || "", e.message); process.exit(1); });
