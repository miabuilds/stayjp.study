// 2026-11-14 回報/回饋回信:文法測驗「錯題回顧」例句錯置(2 人 3 則)+ N4 可能形詳解尾巴被切(1 則)。
// 走 Firestore mail 集合,寄完標 resolved。Mia 過目說 ok 才加 --send。
// 用法:node scripts/send-replies-1114.mjs [--send]
import { db, admin } from "./lib/fire-admin.mjs";
const SEND = process.argv.includes("--send");
const QUIZ = (extra) => `嗨～謝謝你的回報！這是我們的 bug：文法測驗做完後，結果頁「錯題回顧」裡每一題都被放成最後一題的例句，所以才會看到跟那個文法對不上的句子。題目本身和正解沒有錯，是回顧卡拿錯句子。${extra}現在已經修好，重新整理（或重開 App）後每一題都會顯示自己原本的例句。\n\n日本再留計劃 StayJP`;
const L = [
  // 同一個人回報 n3-51 / n3-57 → 只寄一封,兩筆一起結案
  { col: "reports", ids: ["XaL8fGigcoJdgTVYk9mo", "H2b2HLgw6aw7EQfGMXYu"], subject: "StayJP 文法測驗「例句不對」的問題已修好",
    text: QUIZ("你回報的「～ようだ・～みたいだ」和「～たびに」兩題都是這個原因。") },
  { col: "reports", ids: ["VEkWmwupNdspYE9Xuhk3"], subject: "StayJP 文法測驗「題目句裡沒有該文法」的問題已修好",
    text: QUIZ("你看到的「彼をおいてほかにいない」其實是另一題（～をおいて）的例句，不是「～ないまでも」的。") },
  { col: "feedback", ids: ["m7iJQrxffhkrSJnCc2uL"], subject: "StayJP 可能形詳解滑不到最下面的問題已修好",
    text: `嗨～謝謝你的回饋！查到原因了：N4「可能形」的詳解內容比較長，在手機上超過卡片的高度上限，最後一段「學會之後可以接著學」就被切掉、也滑不下去。現在已經修好，重新整理（或重開 App）後就能一路看到最後。\n\n另外你建議的「附截圖」也加上了：意見回饋表單現在可以附最多 3 張圖片，之後遇到問題直接截圖給我們會更快。\n\n日本再留計劃 StayJP` },
];
// --only=reports / --only=feedback:分批寄(可能形那封要等截圖功能的規則部署完再寄)
const ONLY = (process.argv.find((a) => a.startsWith("--only=")) || "").slice(7);
const sent = [];
for (const x of L) {
  if (ONLY && x.col !== ONLY) continue;
  const d = (await db.doc(`${x.col}/${x.ids[0]}`).get()).data();
  const to = d.email || d.contact_email;
  console.log("=== →", to ? to.replace(/^(.{2}).*@/, "$1***@") : "(沒留 email)", "|", x.subject, "\n" + x.text + "\n");
  if (!SEND) continue;
  let mailId = null;
  if (to) mailId = (await db.collection("mail").add({ to, message: { subject: x.subject, text: x.text }, kind: x.col === "reports" ? "report_reply" : "feedback_reply", [x.col === "reports" ? "report_id" : "feedback_id"]: x.ids[0], created_at: admin.firestore.FieldValue.serverTimestamp() })).id;
  for (const id of x.ids) {
    await db.doc(`${x.col}/${id}`).update(x.col === "reports"
      ? { status: "resolved", handled_at: admin.firestore.FieldValue.serverTimestamp(), replied_subject: x.subject, note: "11/14 修好:錯題回顧例句錯置(grammar-drill.js)" }
      : { status: "resolved", repliedAt: admin.firestore.FieldValue.serverTimestamp(), replied_subject: x.subject });
  }
  if (mailId) sent.push([x.ids[0], mailId]);
}
if (!SEND) { console.log("(dry-run)"); process.exit(0); }
await new Promise((r) => setTimeout(r, 15000));
for (const [id, m] of sent) { const d = (await db.collection("mail").doc(m).get()).data(); console.log(id, d?.delivery ? d.delivery.state + " " + (d.delivery.error || "") : "(還沒處理)"); }
process.exit(0);
