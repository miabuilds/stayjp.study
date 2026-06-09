// 每週掃 users/{uid} 文件大小,逼近 Firestore 1 MiB 上限就告警。
// 背景:訂閱/進度同存 users doc,doc 過大會讓寫入(含進度存檔、未來訂閱)失敗。
// 治本是 subscriptions/{uid} 獨立 + user_progress 壓縮(見 docs/superpowers/specs);
// 在那之前用這支當早期預警,別被突襲。
//
// 由 GitHub Actions 排程跑(用 GCP_SA_KEY)。臨界(>92%)時 exit 1 → Action 變紅寄信。
import admin from "firebase-admin";

admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.GCP_SA_KEY)) });
const db = admin.firestore();

const LIMIT = 1048576;            // Firestore 單文件 1 MiB 硬上限
const WARN = 0.85 * LIMIT;        // 警戒
const CRIT = 0.92 * LIMIT;        // 臨界(red + email)

// Firestore 文件大小近似(官方計算規則):欄位名 bytes+1 + 值大小,doc 固定開銷 ~32
function valSize(v) {
  if (v === null || v === undefined) return 1;
  if (typeof v === "string") return Buffer.byteLength(v) + 1;
  if (typeof v === "number") return 8;
  if (typeof v === "boolean") return 1;
  if (v instanceof admin.firestore.Timestamp) return 8;
  if (Buffer.isBuffer(v)) return v.length;
  if (Array.isArray(v)) return v.reduce((s, e) => s + valSize(e), 0);
  if (typeof v === "object") {
    return Object.entries(v).reduce((s, [k, val]) => s + Buffer.byteLength(k) + 1 + valSize(val), 0);
  }
  return 0;
}
function docSize(data) {
  return 32 + Object.entries(data).reduce((s, [k, v]) => s + Buffer.byteLength(k) + 1 + valSize(v), 0);
}

const snap = await db.collection("users").get();
const sizes = snap.docs.map((d) => ({ uid: d.id, size: docSize(d.data()) }));
sizes.sort((a, b) => b.size - a.size);

const warn = sizes.filter((s) => s.size > WARN);
const crit = sizes.filter((s) => s.size > CRIT);
const top = sizes.slice(0, 10).map((s) => ({ uid: s.uid, kb: Math.round(s.size / 1024), pct: Math.round((s.size / LIMIT) * 100) }));

console.log(`掃描 ${sizes.length} 個 user doc(上限 ${LIMIT} bytes / 1 MiB)`);
console.log("Top 10:");
for (const t of top) console.log(`  ${String(t.kb).padStart(5)} KB (${t.pct}%)  ${t.uid}`);
console.log(`>85% 警戒: ${warn.length} 人 | >92% 臨界: ${crit.length} 人`);

// 寫一份摘要供 admin 查看(1 write/週,Spark 免費額度內)
await db.doc("monitoring/doc_sizes").set({
  checked_at: admin.firestore.FieldValue.serverTimestamp(),
  total_users: sizes.length,
  warn_count: warn.length,
  crit_count: crit.length,
  top10: top,
});

if (crit.length > 0) {
  console.error(`🚨 ${crit.length} 個 doc 逼近 1 MiB(>92%)— 該部署訂閱獨立 / 進度壓縮了。`);
  process.exit(1);
}
console.log("OK — 無臨界 doc。");
process.exit(0);
