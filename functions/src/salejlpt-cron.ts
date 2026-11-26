// Scheduled function:考後「發奮圖強優惠」(2026-12-07~13)的免費用戶活動信。只寄信,不發 Threads
// (這檔的貼文走 stayjp-autopost 的 scheduled_posts.json,見 ~/stayjp-marketing/salejlpt-go.py)。
//
// Email:台灣 12/7、12/13 兩天,09:00 後各寄一輪,每輪最多 250 封(Brevo 每日額度)。
//   依 Auth 最近登入排序;跳過退訂/付費中/這檔已寄過(users.campaigns.salejlpt)→ 兩天寄到的是不同的人。
//   內容:Mia 2026-11-26 看過定稿(正本 ~/stayjp-marketing/sale-jlpt-kit.md 第 4 節)。
//
// 防重複:ops/salejlpt 文件記錄每天的信是否已處理(交易內先標記再做事,寧可漏不重發)。
// 檔期結束後(12/15 起)整支 no-op,之後可以刪掉。
//
// 部署:firebase deploy --only functions:salejlptCron

import * as functions from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";

if (admin.apps.length === 0) admin.initializeApp();
const db = admin.firestore();

const STATE = db.doc("ops/salejlpt");
const EMAIL_CAP = 250;
const FLAG = "salejlpt";
const SEND_DAYS = [1207, 1213];
const SALE_END = Date.UTC(2026, 11, 13, 15, 59, 59);   // 台灣 12/13 23:59:59
const OFF_AFTER = Date.UTC(2026, 11, 14, 16, 0, 0);    // 台灣 12/15 00:00 之後完全停
const PRICING_URL = "https://stayjp.study/pricing.html?utm_source=email&utm_medium=email&utm_campaign=salejlpt";
const GROUP_URL = "https://stayjp.study/group.html?utm_source=email&utm_medium=email&utm_campaign=salejlpt";

/** 交易:這個 key 還沒處理過 → 標記並回 true;處理過 → false。 */
async function claim(key: string, value: Record<string, unknown>): Promise<boolean> {
  return db.runTransaction(async (tx) => {
    const s = await tx.get(STATE);
    if (s.exists && (s.data() || {})[key]) return false;
    tx.set(STATE, { [key]: { ...value, at: admin.firestore.FieldValue.serverTimestamp() } }, { merge: true });
    return true;
  });
}

export function salejlptMailHtml(): string {
  const P = (s: string) => `<p style="margin:0 0 16px">${s}</p>`;
  return `
<div style="font-family:-apple-system,'PingFang TC','Noto Sans TC',sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1C1C1E;line-height:1.9;font-size:15px">
${P("嗨，")}
${P("我是 StayJP 的 Mia。<br>謝謝你一直用免費版讀日文。")}
${P("12 月的 JLPT 考完了，下一場是 2027 年 7 月 4 日。<br>這一週有個活動，想讓你知道一下：")}
${P("・年費 <s>NT$1,990</s> → <strong>NT$1,490</strong><br>　這段時間訂的，之後每年續訂都維持 1,490（續訂不中斷就一直是這個價）<br>・買斷 <s>NT$4,990</s> → <strong>NT$4,190</strong><br>　一次付清，之後不用再管續訂<br>・月費不變")}
${P("期間：12/7(一) 00:00 到 12/13(日) 23:59（台灣時間）<br>台灣以外的地區，App 裡會用當地貨幣顯示活動價。")}
${P(`有朋友一起讀的話，官網有 <a href="${GROUP_URL}" style="color:#D2603F">4 人揪團</a>年費 5,990（一人 1,498），這週開的團，四個人每人多送一個月。`)}
${P("另外，買過 StayJP 的人，用同一個信箱登入我們其他的 App，會自動看到家族價（原價 8 折），不用輸入任何東西：<br>StayTW 台灣華語、StayKR 韓文、StayTH 泰文、BirdSpeak 英文<br>（付款隔天起生效）")}
<p style="margin:24px 0"><a href="${PRICING_URL}" style="display:inline-block;background:#D2603F;color:#fff;text-decoration:none;font-weight:700;padding:12px 24px;border-radius:10px">看方案</a></p>
${P("不買也完全沒關係，免費版一樣可以每天用。<br>有什麼卡住的地方，App 或網站裡的「回報」按鈕可以直接找到我們。")}
${P("Mia<br>StayJP 日本再留計劃")}
<hr style="border:none;border-top:1px solid #E5E5EA;margin:24px 0 12px">
<p style="margin:0;font-size:12px;color:#8E8E93">你收到這封信是因為你註冊了 StayJP。不想再收到活動與提醒信，可以到 <a href="https://stayjp.study/account.html" style="color:#8E8E93">帳號頁</a> 關閉 Email 通知。</p>
</div>`;
}

export function salejlptSubject(mmdd: number): string {
  return mmdd === 1213
    ? "StayJP 發奮圖強優惠今晚 23:59 截止：年費 1,490、買斷 4,190"
    : "JLPT 考完了：StayJP 這週年費 1,490，之後每年也是 1,490（到 12/13）";
}

async function runEmail(nowMs: number) {
  const tw = new Date(nowMs + 8 * 3600 * 1000);            // 台灣時間(用 UTC getter 讀)
  const mmdd = (tw.getUTCMonth() + 1) * 100 + tw.getUTCDate();
  if (tw.getUTCFullYear() !== 2026 || !SEND_DAYS.includes(mmdd) || tw.getUTCHours() < 9 || nowMs > SALE_END) return;
  if (!(await claim(`email_${mmdd}`, { status: "sending" }))) return;

  const subject = salejlptSubject(mmdd);
  const auths: admin.auth.UserRecord[] = [];
  let token: string | undefined;
  do {
    const r = await admin.auth().listUsers(1000, token);
    for (const u of r.users) if (u.email && u.emailVerified !== false) auths.push(u);
    token = r.pageToken;
  } while (token);
  const last = (u: admin.auth.UserRecord) =>
    Date.parse(u.metadata.lastRefreshTime || u.metadata.lastSignInTime || u.metadata.creationTime || "") || 0;
  auths.sort((a, b) => last(b) - last(a));

  const html = salejlptMailHtml();
  let sent = 0, skipped = 0;
  for (let i = 0; i < auths.length && sent < EMAIL_CAP; i += 100) {
    const chunk = auths.slice(i, i + 100);
    const snaps = await db.getAll(...chunk.map((u) => db.doc(`users/${u.uid}`)));
    for (let k = 0; k < snaps.length && sent < EMAIL_CAP; k++) {
      const u = (snaps[k].data() || {}) as Record<string, any>;
      const sub = u.subscription || {};
      const paid = ["active", "trialing", "cancelled"].includes(sub.status) && Number(sub.expiresAt || 0) > nowMs;
      if (u.email_optout === true || paid || (u.campaigns && u.campaigns[FLAG])) { skipped++; continue; }
      await db.collection("mail").add({
        to: chunk[k].email, message: { subject, html },
        _campaign: FLAG, _uid: chunk[k].uid, _createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      await snaps[k].ref.set({ campaigns: { [FLAG]: admin.firestore.FieldValue.serverTimestamp() } }, { merge: true });
      sent++;
    }
  }
  await STATE.set({ [`email_${mmdd}`]: { status: "sent", sent, skipped, at: admin.firestore.FieldValue.serverTimestamp() } }, { merge: true });
  console.log(`[salejlpt] ${mmdd} 活動信排寄 ${sent} 封,跳過 ${skipped}`);
}

export const salejlptCron = functions.onSchedule(
  {
    schedule: "every 10 minutes",
    timeZone: "Asia/Taipei",
    region: "asia-east1",
    maxInstances: 1,
    timeoutSeconds: 540,
    memory: "512MiB",
  },
  async () => {
    const nowMs = Date.now();
    if (nowMs > OFF_AFTER) return;
    await runEmail(nowMs);
  }
);
