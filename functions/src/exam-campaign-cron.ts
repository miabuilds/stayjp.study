// Scheduled function:考前 90 天 / 30 天的考季信(EMAILS.md 信 2、信 3)。
//
// 設計:
//   - JLPT 固定每年 7 月、12 月第一個週日,自動算下一場,不用手動改日期。
//   - 觸發窗:考前 90 天起(信 2)、考前 30 天起(信 3),各開一個 7 天的寄送窗;
//     Brevo 免費版每天上限 300 封 → 每輪最多排 DAILY_CAP=250 封,剩的明天繼續,
//     窗內寄完 2 千會員綽綽有餘。
//   - 防重寄:users/{uid}.campaigns["2026-12_d90"] 標記(帶考期,下一場自動重新有資格)。
//   - 跳過:email_optout、查無 email。已付費者信 3 改寄「衝刺提醒版」(不推銷月費)。
//   - 寄送格式與 trialEmailCron 相同:寫 `mail` collection(Trigger Email 擴充套件)。
//
// 部署:firebase deploy --only functions:examCampaignCron

import * as functions from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import { db, nowMs } from "./utils/firestore";

if (admin.apps.length === 0) admin.initializeApp();

const SITE = "https://stayjp.study";
const DAILY_CAP = 250;           // Brevo 免費版 300/天,留 50 給試用信等其他信
const WINDOW_DAYS = 7;           // 每波 campaign 的寄送窗長度

function firstSunday(y: number, m: number): Date {
  const d = new Date(Date.UTC(y, m, 1));
  d.setUTCDate(1 + (7 - d.getUTCDay()) % 7);
  return d;
}
function nextExam(now: number): Date | null {
  const y = new Date(now).getUTCFullYear();
  return [firstSunday(y, 6), firstSunday(y, 11), firstSunday(y + 1, 6)]
    .find((d) => d.getTime() > now) || null;
}

function mailD90(name: string, examLabel: string, days: number) {
  return {
    subject: `距離 ${examLabel} JLPT 剩 ${days} 天——現在開始,從頭準備還來得及`,
    html: `
<div style="font-family:-apple-system,'PingFang TC','Noto Sans TC',sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1C1C1E;line-height:1.9;font-size:15px">
  <p style="margin:0 0 16px">嗨${name ? " " + name : ""},距離 ${examLabel} 的 JLPT,還有 <strong>${days} 天</strong>。</p>
  <p style="margin:0 0 16px">${days} 天 ≈ 每天 20 個單字 × ${days} = <strong>${days * 20} 個單字</strong>,加上每天 10 個文法點——這剛好就是一個級距的量。今天開始,進度是「來得及」;拖到考前一個月,就只能賭運氣了。</p>
  <p style="margin:0 0 8px">我們幫你把 ${days} 天拆好了:</p>
  <ul style="margin:0 0 16px;padding-left:20px">
    <li><strong>前 2/3</strong>:每天 30 分鐘,單字+文法照 SRS 排程走</li>
    <li><strong>接著 3 週</strong>:加入計時模擬考,抓答題節奏</li>
    <li><strong>最後 10 天</strong>:只複習 SRS 標記「不熟/不會」的弱點</li>
  </ul>
  <p style="margin:24px 0"><a href="${SITE}/?utm_source=email&utm_campaign=exam_d90" style="display:inline-block;background:#B8362A;color:#fff;font-weight:700;padding:12px 28px;border-radius:999px;text-decoration:none">📅 從今天的 20 個單字開始 →</a></p>
  <p style="margin:0 0 24px">報名別忘了:這一場的報名很快就截止,先報名,讀書才有死線。</p>
  <p style="margin:0;font-size:12px;color:#A9A9A9;border-top:1px solid #E5DECF;padding-top:12px">日本再留計劃 StayJP Study・${SITE}<br>不想再收到這類通知?回覆此信或到「我的帳號」關閉 Email 通知即可。</p>
</div>`,
  };
}

function mailD30(name: string, days: number, isPaid: boolean) {
  const pitch = isPaid
    ? `<p style="margin:24px 0"><a href="${SITE}/?utm_source=email&utm_campaign=exam_d30" style="display:inline-block;background:#B8362A;color:#fff;font-weight:700;padding:12px 28px;border-radius:999px;text-decoration:none">🎯 開始今天的模考 →</a></p>`
    : `<p style="margin:0 0 16px">模考和 SRS 無限次練習,現在有<strong>月費 NT$150</strong>——就是為考前衝刺的人準備的,考完隨時取消,一杯手搖的錢換 ${days} 天不限量。</p>
  <p style="margin:24px 0"><a href="${SITE}/pricing.html?utm_source=email&utm_campaign=exam_d30" style="display:inline-block;background:#B8362A;color:#fff;font-weight:700;padding:12px 28px;border-radius:999px;text-decoration:none">🎯 開始今天的模考 →</a></p>`;
  return {
    subject: `最後 ${days} 天,別再背新單字了`,
    html: `
<div style="font-family:-apple-system,'PingFang TC','Noto Sans TC',sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1C1C1E;line-height:1.9;font-size:15px">
  <p style="margin:0 0 16px">嗨${name ? " " + name : ""},距離 JLPT 只剩 <strong>${days} 天</strong>。這個階段,<strong>放掉新進度、鞏固舊進度</strong>才是對的:</p>
  <ol style="margin:0 0 16px;padding-left:20px">
    <li><strong>每天一回計時模考</strong>——練的不是知識,是長時間的專注力和時間分配</li>
    <li><strong>只複習 SRS 裡標「不熟」的字</strong>——現在背新單字,考前根本輪不到複習第二次</li>
    <li><strong>聽力每天 15 分鐘逐句對答案</strong>——不知道哪句沒聽懂,聽再多也是白聽</li>
  </ol>
  ${pitch}
  <p style="margin:0 0 24px">${days} 天後,考場見。</p>
  <p style="margin:0;font-size:12px;color:#A9A9A9;border-top:1px solid #E5DECF;padding-top:12px">日本再留計劃 StayJP Study・${SITE}<br>不想再收到這類通知?回覆此信或到「我的帳號」關閉 Email 通知即可。</p>
</div>`,
  };
}

export const examCampaignCron = functions.onSchedule(
  {
    schedule: "every day 20:45",   // 錯開 trialEmailCron(20:30),共用每日 SMTP 額度
    timeZone: "Asia/Taipei",
    region: "asia-east1",
    maxInstances: 1,
    timeoutSeconds: 540,
    memory: "256MiB",
  },
  async () => {
    const now = nowMs();
    const exam = nextExam(now);
    if (!exam) return;
    const daysLeft = Math.ceil((exam.getTime() - now) / 86400000);

    // 哪一波在窗內?d90:考前 90~84 天;d30:考前 30~24 天
    let wave: "d90" | "d30" | null = null;
    if (daysLeft <= 90 && daysLeft > 90 - WINDOW_DAYS) wave = "d90";
    else if (daysLeft <= 30 && daysLeft > 30 - WINDOW_DAYS) wave = "d30";
    if (!wave) { console.log(`[examCampaign] 考前 ${daysLeft} 天,不在寄送窗內,跳過`); return; }

    const examKey = `${exam.getUTCFullYear()}-${String(exam.getUTCMonth() + 1).padStart(2, "0")}`;
    const flag = `${examKey}_${wave}`;            // e.g. "2026-12_d90"
    const examLabel = `${exam.getUTCMonth() + 1}/${exam.getUTCDate()}`;

    // 分頁掃描 users,避免一次把整個集合載進記憶體(用戶成長後會撞記憶體/timeout);
    // 達每日上限就停,不再往後抓。(讀取次數本身很便宜,這裡主要是記憶體/擴充性防護。)
    let sent = 0, skipped = 0, scanned = 0;
    const PAGE = 500;
    let cursor: string | null = null;
    while (sent < DAILY_CAP) {
      let q = db.collection("users").orderBy(admin.firestore.FieldPath.documentId()).limit(PAGE);
      if (cursor) q = q.startAfter(cursor);
      const snap = await q.get();
      if (snap.empty) break;
      for (const d of snap.docs) {
        if (sent >= DAILY_CAP) break;             // 額度用完,明天這支再跑會繼續(窗有 7 天)
        scanned++;
        const u = d.data() as Record<string, any>;
        if (u.email_optout === true) { skipped++; continue; }
        if (u.campaigns && u.campaigns[flag]) { skipped++; continue; }   // 這一波已寄過

        let email = "", name = "";
        try {
          const au = await admin.auth().getUser(d.id);
          email = au.email || "";
          name = (au.displayName || "").split(" ")[0];
        } catch { /* 帳號已刪 */ }
        if (!email) {
          // 沒 email 也標記,免得每天重查 auth 浪費配額
          await d.ref.set({ campaigns: { [flag]: admin.firestore.FieldValue.serverTimestamp() } }, { merge: true });
          skipped++; continue;
        }

        const sub = u.subscription || {};
        const isPaid = ["active", "trialing", "cancelled"].includes(sub.status) && Number(sub.expiresAt || 0) > now;
        const m = wave === "d90" ? mailD90(name, examLabel, daysLeft) : mailD30(name, daysLeft, isPaid);

        await db.collection("mail").add({
          to: email,
          message: { subject: m.subject, html: m.html },
          _campaign: `exam_${flag}`,
          _uid: d.id,
          _createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        await d.ref.set({ campaigns: { [flag]: admin.firestore.FieldValue.serverTimestamp() } }, { merge: true });
        sent++;
      }
      if (snap.size < PAGE) break;                // 最後一頁
      cursor = snap.docs[snap.docs.length - 1].id;
    }
    console.log(`[examCampaign] ${flag}:考前 ${daysLeft} 天,本輪排寄 ${sent} 封,跳過 ${skipped},掃描 ${scanned}`);
  }
);
