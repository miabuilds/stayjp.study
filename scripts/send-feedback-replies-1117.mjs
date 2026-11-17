// 2026-11-17 回信:BirdSpeak #4(超商條碼繳費未開通,已先手動開通)、StayTW #40(Android Google 登入)。Mia 11/17 過目 ok。
import { db, admin } from "./lib/fire-admin.mjs";
const LETTERS = [
  { key: "bs4", to: "awdx1590@gmail.com", kind: "birdspeak_feedback_reply", subject: "BirdSpeak：已先幫你開通 Premium", text: `（本信為自動回覆）
嗨，謝謝你的購買，也抱歉讓你等。

超商條碼繳費不是即時入帳，超商回報給金流公司需要 1～5 個工作天，所以系統還沒收到你的付款通知。
我們已經先幫你開通 Premium 了，重新開啟 BirdSpeak 就會看到。發票會在款項入帳後寄到你的信箱。

還是沒看到 Premium 的話，直接回這封信跟我們說。

BirdSpeak` },
  { key: "tw40", to: "dkxm32@gmail.com", kind: "staytw_report_reply", subject: "StayTW: 앱 Google 로그인 문의에 대한 답변", text: `※ 본 메일은 자동 회신입니다.

안녕하세요, 문의 주셔서 감사합니다.

앱에서 Google 로그인이 안 되는 문제를 확인하려면 조금 더 정보가 필요합니다.
1. Google 로그인 버튼을 누르면 어떻게 되나요? (오류 메시지가 뜨는지, 아무 반응이 없는지, 계정 선택 화면에서 멈추는지)
2. 가능하시면 화면 캡처를 보내 주세요.

그 전에 아래 방법도 한번 시도해 보세요.
・Play 스토어에서 StayTW와 "Google Play 서비스"를 최신 버전으로 업데이트
・앱을 완전히 종료한 뒤 다시 실행

이 메일에 바로 답장해 주시면 확인해 드리겠습니다.

StayTW` },
];
for (const L of LETTERS) {
  const ref = await db.collection("mail").add({ to: L.to, bcc: "stayjpplan@gmail.com", message: { subject: L.subject, text: L.text }, kind: L.kind, created_at: admin.firestore.FieldValue.serverTimestamp() });
  let st = "TIMEOUT";
  for (let i = 0; i < 12; i++) { await new Promise((r) => setTimeout(r, 5000)); const d = (await ref.get()).data(); const s = d.delivery && d.delivery.state; if (s === "SUCCESS" || s === "ERROR") { st = s + (d.delivery.error ? " " + d.delivery.error : ""); break; } }
  console.log(L.key, L.to, st);
}
process.exit(0);
