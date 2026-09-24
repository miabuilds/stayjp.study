// 產生「回信用的 Gmail 撰寫連結」+ 可選擇把狀態標成已解決。
// ⚠️ 不會替使用者寄信 —— admin.html 的做法是開 Gmail 撰寫視窗,由 Mia 自己按送出。
//    這支只是把信寫好、把連結印出來,省掉一筆一筆貼的功夫。
//
// 用法:
//   node scripts/feedback-reply.mjs              # 只印連結,不改狀態
//   node scripts/feedback-reply.mjs --resolve    # 同時把這幾筆標成 resolved + 記錄回信時間
import { db, admin } from './lib/fire-admin.mjs';

const RESOLVE = process.argv.includes('--resolve');
const SENDER = 'stayjpplan@gmail.com';

// 一筆一封,針對他講的問題寫,不要罐頭句
// 一筆一封。Mia 2026-09-24:「不需要解釋原因,改好就好,不用點點點,也不用說您」
const REPLIES = [
  {
    id: 'k6O1mQdXNJ19jq4v6yio',
    to: 'lsmileee205@gmail.com',
    subject: '[日本再留計劃] 小測問題已修正',
    body: `你好,

你回報的兩個問題都修好上線了:
題目重複、答案固定在第四個選項。

重新整理頁面就會生效,App 請重開。

謝謝回報。

StayJP 團隊`,
  },
  {
    id: 'qcwMvWjOnQTogETUfpSP',
    to: 'ysz4crwzz2@privaterelay.appleid.com',
    subject: '[日本再留計劃] 打字複習已更新',
    body: `你好,

你建議的功能做好了。
答錯或按「不會」之後,要正確打出 3 次才過關,第 2 次起答案會收起來。
另外打到一半不會再自動送出,一律等你自己按送出。

重新整理頁面就會生效,App 請重開。

謝謝回報。

StayJP 團隊`,
  },
  {
    id: 'RJI1ZKIMgwNIKypXl7rv',
    to: 'maggie950008@gmail.com',
    subject: '[日本再留計劃] 例句已加上假名標示',
    body: `你好,

例句的漢字上面已經加上平假名了,單字卡、字卡清單、模擬考詳解都有。

重新整理頁面就會看到,App 請重開。

謝謝回報。

StayJP 團隊`,
  },
];

for (const r of REPLIES) {
  const url = `https://mail.google.com/mail/?authuser=${encodeURIComponent(SENDER)}`
    + `&view=cm&fs=1&to=${encodeURIComponent(r.to)}`
    + `&su=${encodeURIComponent(r.subject)}`
    + `&body=${encodeURIComponent(r.body)}`;
  console.log(`\n=== ${r.to} ===`);
  console.log(r.subject);
  console.log(url);
  if (RESOLVE) {
    await db.collection('feedback').doc(r.id).update({
      status: 'resolved',
      resolved_at: admin.firestore.FieldValue.serverTimestamp(),
      email_sent_at: admin.firestore.FieldValue.serverTimestamp(),
      email_subject: r.subject,
      resolution_note: '已修正並上線(Claude 2026-09-24)',
    });
    console.log('  → 已標記 resolved');
  }
}
if (!RESOLVE) console.log('\n(只印連結,沒有改狀態。確認信件內容 OK 後加 --resolve 才標記。)');
process.exit(0);
