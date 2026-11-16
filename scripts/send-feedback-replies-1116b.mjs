// 2026-11-16 第二批回信:StayKR #13、BirdSpeak #3、StayJP T Kan。Mia 11/16 過目說「好了發」。
import { db, admin } from "./lib/fire-admin.mjs";
const LETTERS = [
  { key: "kr", to: "emmawu1200@gmail.com", kind: "staykr_report_reply", subject: "StayKR：「아기」例句、「다시」發音已修正", text: `（本信為自動回覆）
嗨，謝謝你回報「아기」例句和「다시」的發音問題。
兩個都修好了，重新開啟 StayKR 再聽一次就是正確的發音。如果還是怪怪的，回信跟我說一聲。

StayKR` },
  { key: "bs", to: "fight20001127@gmail.com", kind: "birdspeak_feedback_reply", subject: "BirdSpeak：錄音不完整的問題，請試試「長句錄音」", text: `（本信為自動回覆）
嗨，謝謝你回報錄音沒辦法完整呈現句子的問題。

我們加了一個「長句錄音（測試中）」的開關，講話中間停頓也不會被切斷：
1. 把 BirdSpeak 完全關掉再重開
2. 進 AI 對話 → 設定 → 打開「長句錄音（測試中）」
3. 講完之後停 2 秒左右，會自動結束

這個功能需要 Android 13 以上。試過之後有沒有改善，都歡迎回信跟我們說，你的回覆會決定我們要不要直接開給所有人。

BirdSpeak` },
  { key: "jp", fid: "WC3l8ZIzGMJMI78Xy1vi", to: "thyrotoxin@gmail.com", kind: "feedback_reply", subject: "[日本再留計劃] 你提的五點都上線了", text: `（本信為自動回覆）

您好，

您提的五點都做好上線了：
1. 清除學習紀錄：「我的」→「設定」最下面的「清除學習紀錄」，進度會全部歸零（設定、訂閱、學習日曆、生詞本會保留）。
2. 進度條：它算的是「這一級學過幾個字」，所以同一批字重複練不會動。單字測驗的「範圍」現在多了「還沒學過」，只出還沒碰過的字，進度條會跟著往前。
3. 答對也看得到詳解：答對後會顯示漢字、讀音、意思和例句，自己按「下一題」才前進。
4. 錯題回顧可以選題型：「我的」→「我的詞庫」→ 錯題回顧上方可以選聽力／閱讀／模考。
5. 功能說明：「我的」→「設定」→「使用教學」。

重新整理頁面就會生效，App 請重開。有其他想法歡迎再跟我們說。

StayJP 團隊` },
];
for (const L of LETTERS) {
  const ref = await db.collection("mail").add({ to: L.to, bcc: "stayjpplan@gmail.com", message: { subject: L.subject, text: L.text }, kind: L.kind, created_at: admin.firestore.FieldValue.serverTimestamp() });
  let st = "TIMEOUT";
  for (let i = 0; i < 12; i++) { await new Promise((r) => setTimeout(r, 5000)); const d = (await ref.get()).data(); const s = d.delivery && d.delivery.state; if (s === "SUCCESS" || s === "ERROR") { st = s + (d.delivery.error ? " " + d.delivery.error : ""); break; } }
  console.log(L.key, L.to, st);
  if (st.startsWith("SUCCESS") && L.fid) await db.collection("feedback").doc(L.fid).update({ status: "replied", replied_at: admin.firestore.FieldValue.serverTimestamp() });
}
process.exit(0);
