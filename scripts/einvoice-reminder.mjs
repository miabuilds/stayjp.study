// 綠界電子發票「新增字軌」提醒信。每逢雙月(2/4/6/8/10/12)19 號與 26 號由 GitHub Actions 寄給 Mia。
// 綠界業務 2026-10 叮嚀:每一期雙月 18 號過後一定要去後台新增下一期字軌並按「通過」,沒做會開不出發票。
// 寄送走既有 Trigger Email 管道(mail 集合),同一天不重寄(ops/einvoice_reminder 判重)。
import { db, admin } from './lib/fire-admin.mjs';

const TO = process.env.REMIND_TO || 'stayjpplan@gmail.com';
const tw = new Date(Date.now() + 8 * 3600e3);
const ymd = tw.toISOString().slice(0, 10);
const isFollowUp = tw.getUTCDate() >= 24;
const key = `sent_${ymd}`;

const state = await db.doc('ops/einvoice_reminder').get();
if (!process.env.FORCE && state.exists && (state.data() || {})[key]) { console.log('今天已寄過,跳過'); process.exit(0); }

const subject = (isFollowUp ? '【再提醒】' : '【重要】') + `綠界電子發票:這期的字軌新增了嗎?(${ymd})`;
const text = `${isFollowUp ? '上週提醒過的字軌,如果已經弄好請忽略這封。\n\n' : ''}每一期雙月 18 號過後都要去綠界後台新增下一期字軌,沒做會開不出發票,很麻煩。

操作步驟:
https://www.ecpay.com.tw/ → 右上角【廠商後台】登入 → 左上角切換到【發票/收據】
→ 資料管理與維護 → 字軌與配號設定 → 【查詢配號結果】(藍色按鈕)→ 【新增字軌】(綠色按鈕)

1. 先點【查詢配號結果】,確認已經拿到下一期的字軌,再點【新增字軌】
2. 新增完成後一定要點【更改狀態】→【通過】,讓狀態從「待審核」變成「啟用中」
3. 重點再講一次:一定要新增字軌 → 一定要點通過 → 一定要是「啟用中」

(本信為自動提醒,每逢雙月 19 號、26 號寄出)`;

await db.collection('mail').add({
  to: TO, message: { subject, text },
  _campaign: 'einvoice_reminder', _createdAt: admin.firestore.FieldValue.serverTimestamp(),
});
await db.doc('ops/einvoice_reminder').set({ [key]: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
console.log(`已排寄提醒 → ${TO}:${subject}`);
process.exit(0);
