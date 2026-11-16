// 2026-11-16 StayJP 意見表單回信兩封(退訂年費、單字列表字太小)。Mia 11/16 過目 ok。先寄測試信驗管線。
import { db, admin } from "./lib/fire-admin.mjs";
const LETTERS = [
  { id: "82H259VYpxsnln3Wf14L", to: "eva970706@gmail.com", subject: "[日本再留計劃] 年費退款的申請方式", text: `（本信為自動回覆）

您好，

您的年費是透過 App Store 購買的，款項由 Apple 代收，退款需要向 Apple 申請：
1. 打開 reportaproblem.apple.com，用購買時的 Apple 帳號登入
2. 選「申請退款」→ 理由選「我不是有意購買此項目」→ 選 StayJP 年費送出
Apple 通常 48 小時內會回覆結果。

退款核准後，想改訂月費的話在 App 內重新選月費就可以了。
如果申請時遇到問題，直接回這封信，我們再協助您。

StayJP 團隊` },
  { id: "jcO1BGRvgHVqNndPueq5", to: "lukehsiao.personal@gmail.com", subject: "[日本再留計劃] 單字列表的文字大小", text: `（本信為自動回覆）

Luke 您好，

手機上單字列表已經是一行一個（您截圖的兩欄是電腦寬度的排法）。
字太小的話可以調大：「我的」→「設定」→「文字大小」，選「大」或「特大」，假名跟濁點都會一起放大。
頂端的「A」按鈕也可以直接切換。

調了還是不好讀的話，再回信跟我們說。

StayJP 團隊` },
];
async function send(to, subject, text, kind, extra = {}) {
  const ref = await db.collection("mail").add({ to, ...extra, message: { subject, text }, kind, created_at: admin.firestore.FieldValue.serverTimestamp() });
  for (let i = 0; i < 12; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    const d = (await ref.get()).data(); const st = d.delivery && d.delivery.state;
    if (st === "SUCCESS" || st === "ERROR") return st + (d.delivery.error ? " " + d.delivery.error : "");
  }
  return "TIMEOUT";
}
const t = await send("stayjpplan@gmail.com", "[測試] StayJP 回信管線", "ok", "feedback_reply_test");
console.log("測試信:", t);
if (!t.startsWith("SUCCESS")) { console.log("測試信沒成功,沒寄給用戶"); process.exit(1); }
for (const L of LETTERS) {
  const r = await send(L.to, L.subject, L.text, "feedback_reply", { bcc: "stayjpplan@gmail.com", feedback_id: L.id });
  console.log(L.to, r);
  if (r.startsWith("SUCCESS")) await db.collection("feedback").doc(L.id).update({ status: "replied", replied_at: admin.firestore.FieldValue.serverTimestamp() });
}
process.exit(0);
