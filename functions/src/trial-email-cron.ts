// Scheduled function:試用到期前一天的轉換信(EMAILS.md 信 1)。
//
// 為什麼:3 天試用到期是全站轉換率最高的時刻,但目前到期就靜默降回免費版,
// 一封信都沒寄 —— 這支每天 20:30(台北)掃「試用剩不到 24 小時」的用戶,
// 把信寫進 `mail` collection(Firebase Trigger Email 擴充套件的標準格式,
// 裝好擴充套件即自動寄出;沒裝擴充套件則只是累積文件,不會出錯)。
//
// 防重寄:寄過就在 users/{uid} 標 trial_expiry_mail_at,查過就跳過。
// 退訂:users/{uid}.email_optout === true 不寄(帳號頁/回信人工設定)。
//
// 上線前置(一次性):
//   1. Firebase Console → Extensions → 安裝「Trigger Email from Firestore」
//   2. SMTP 填 Brevo/Resend/Gmail App Password 皆可;collection 填 `mail`
//   3. firebase deploy --only functions:trialEmailCron

import * as functions from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import { db, nowMs } from "./utils/firestore";

if (admin.apps.length === 0) admin.initializeApp();

const TRIAL_DAYS = 3;
const SITE = "https://stayjp.study";

function buildHtml(name: string, ebLeft: number | null): { subject: string; html: string } {
  const ebLine = ebLeft && ebLeft > 0
    ? `<p style="margin:0 0 16px"><strong style="color:#B8362A">早鳥年費 NT$990/年</strong>(月均 82 元,限量 100 名,目前只剩 <strong>${ebLeft}</strong> 名)<br>續訂永遠鎖這個價,之後恢復標準價 NT$1,490。</p>`
    : `<p style="margin:0 0 16px"><strong style="color:#B8362A">年費 NT$1,490/年</strong>(月均 124 元),整個備考週期完整覆蓋。</p>`;
  return {
    subject: "你的全功能試用,明天就到期了",
    html: `
<div style="font-family:-apple-system,'PingFang TC','Noto Sans TC',sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1C1C1E;line-height:1.9;font-size:15px">
  <p style="margin:0 0 16px">嗨${name ? " " + name : ""},我是做「日本再留計劃」的開發者。</p>
  <p style="margin:0 0 16px">你的 3 天全功能試用<strong>明天到期</strong>。到期後會自動回到免費版,不會扣你任何錢——但這幾天 SRS 幫你排好的複習佇列、跨裝置同步的紀錄,就會停在免費額度上。</p>
  <p style="margin:0 0 16px">如果這幾天你有感覺到「每天 30 分鐘,真的背得起來」,現在升級最划算:</p>
  ${ebLine}
  <p style="margin:24px 0"><a href="${SITE}/pricing.html?utm_source=email&utm_campaign=trial_expiry" style="display:inline-block;background:#B8362A;color:#fff;font-weight:700;padding:12px 28px;border-radius:999px;text-decoration:none">🔒 用優惠價鎖起來 →</a></p>
  <p style="margin:0 0 16px">不確定?沒關係——首次訂閱 <strong>7 天內無條件全額退費</strong>,等於再多一週反悔期。</p>
  <p style="margin:0 0 24px">一起考過 12 月。<br>狸太郎 敬上</p>
  <p style="margin:0;font-size:12px;color:#A9A9A9;border-top:1px solid #E5DECF;padding-top:12px">日本再留計劃 StayJP Study・${SITE}<br>不想再收到這類通知?回覆此信告訴我們即可。</p>
</div>`,
  };
}

export const trialEmailCron = functions.onSchedule(
  {
    schedule: "every day 20:30",
    timeZone: "Asia/Taipei",
    region: "asia-east1",
    maxInstances: 1,
    timeoutSeconds: 300,
    memory: "256MiB",
  },
  async () => {
    const now = nowMs();
    // 試用剩 <24h = trial_started_at 落在 (now-3d, now-2d]
    const from = admin.firestore.Timestamp.fromMillis(now - TRIAL_DAYS * 86400000);
    const to = admin.firestore.Timestamp.fromMillis(now - (TRIAL_DAYS - 1) * 86400000);
    const snap = await db.collection("users")
      .where("trial_started_at", ">", from)
      .where("trial_started_at", "<=", to)
      .get();

    // 早鳥剩餘(一輪只讀一次)
    let ebLeft: number | null = null;
    try {
      const eb = (await db.doc("counters/early_bird").get()).data() || {};
      const lim = Number(eb.limit || 100);
      ebLeft = Math.max(0, Math.min(lim, lim - Number(eb.count || 0)));
    } catch { /* 讀不到就走無早鳥文案 */ }

    let sent = 0, skipped = 0;
    for (const d of snap.docs) {
      const u = d.data() as Record<string, any>;
      // 已寄過 / 退訂 → 跳過
      if (u.trial_expiry_mail_at || u.email_optout === true) { skipped++; continue; }
      // 已是有效付費者 → 不用催
      const sub = u.subscription || {};
      const paidActive = ["active", "trialing", "cancelled"].includes(sub.status) && Number(sub.expiresAt || 0) > now;
      if (paidActive) { skipped++; continue; }

      let email = "", name = "";
      try {
        const au = await admin.auth().getUser(d.id);
        email = au.email || "";
        name = (au.displayName || "").split(" ")[0];
      } catch { /* 帳號已刪 */ }
      if (!email) { skipped++; continue; }

      const { subject, html } = buildHtml(name, ebLeft);
      await db.collection("mail").add({
        to: email,
        message: { subject, html },
        // 追蹤欄位(擴充套件會忽略不認識的欄位)
        _campaign: "trial_expiry",
        _uid: d.id,
        _createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      await d.ref.set({ trial_expiry_mail_at: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
      sent++;
    }
    console.log(`[trialEmailCron] 掃到 ${snap.size} 個第 2 天試用者,排寄 ${sent} 封,跳過 ${skipped}(已寄/退訂/已付費/查無 email)`);
  }
);
