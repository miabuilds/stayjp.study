// Scheduled function:雙十檔期(2026-10)的 Threads 發文 + 免費用戶活動信。
//
// 為什麼放雲端:原本由 Mia 的 Mac(launchd)派送,但電腦不會一直開。
// GitHub cron 又常延遲 4~8 小時(見 autopost.yml 註解),只有 Cloud Scheduler 準時。
//
// 1. Threads:每 10 分鐘看一次,貼文預定時間前 ≤15 分鐘就 dispatch autopost 的 oneoff.yml(帶 at,
//    Actions 只睡 ≤15 分鐘;autopost 是私有 repo,睡越久越吃 Actions 分鐘)。
//    錯過超過 1 小時就不發(避免「最後 3 小時」在活動結束後才出現),寫 log。
//    需要 secret AUTOPOST_GH_TOKEN:fine-grained PAT,只開 stayjp-autopost 的 Actions read/write。
// 2. Email:台灣 10/8~10/11 每天 09:00 後寄一輪,每輪最多 250 封(Brevo 免費版 300/天,留給試用信等)。
//    依 Auth 最近登入排序,最活躍的先收到;跳過退訂/付費中/已寄過(users.campaigns.sale1010)。
//
// 防重複:ops/sale1010 文件記錄每篇貼文與每天的信是否已處理(交易內先標記再做事)。
// 檔期結束後(10/13 起)整支 no-op,之後可以刪掉。
//
// 部署:firebase deploy --only functions:sale1010Cron

import * as functions from "firebase-functions/v2/scheduler";
import { defineSecret } from "firebase-functions/params";
import * as admin from "firebase-admin";
import { SALE1010_POSTS } from "./sale1010-posts";

if (admin.apps.length === 0) admin.initializeApp();
const db = admin.firestore();

const AUTOPOST_GH_TOKEN = defineSecret("AUTOPOST_GH_TOKEN");
const STATE = db.doc("ops/sale1010");
const LEAD_S = 15 * 60;        // 預定前 15 分鐘內派送
const STALE_S = 60 * 60;       // 晚超過 1 小時就放棄
const EMAIL_CAP = 250;
const FLAG = "sale1010";
const SALE_END = Date.UTC(2026, 9, 11, 15, 59, 59);
const OFF_AFTER = Date.UTC(2026, 9, 12, 16, 0, 0);   // 台灣 10/13 00:00 之後完全停
const PRICING_URL = "https://stayjp.study/pricing.html?utm_source=email&utm_medium=email&utm_campaign=sale1010";

/** 交易:這個 key 還沒處理過 → 標記並回 true;處理過 → false。先標後做,寧可漏不重發。 */
async function claim(key: string, value: Record<string, unknown>): Promise<boolean> {
  return db.runTransaction(async (tx) => {
    const s = await tx.get(STATE);
    if (s.exists && (s.data() || {})[key]) return false;
    tx.set(STATE, { [key]: { ...value, at: admin.firestore.FieldValue.serverTimestamp() } }, { merge: true });
    return true;
  });
}

async function runThreads(nowS: number, token: string) {
  for (const p of SALE1010_POSTS) {
    const left = p.at - nowS;
    if (left > LEAD_S) continue;
    if (left < -STALE_S) {
      if (await claim(`post_${p.id}`, { status: "skipped_stale" })) {
        console.error(`[sale1010] ${p.id}(${p.tw})錯過超過 1 小時,沒發`);
      }
      continue;
    }
    if (!(await claim(`post_${p.id}`, { status: "dispatching" }))) continue;
    const r = await fetch("https://api.github.com/repos/miabuilds/stayjp-autopost/actions/workflows/oneoff.yml/dispatches", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
      body: JSON.stringify({ ref: "master", inputs: { account: p.account, text: p.text, reply: p.reply, dryrun: "false", at: String(p.at) } }),
    });
    if (r.status === 204) {
      await STATE.set({ [`post_${p.id}`]: { status: "dispatched", at: admin.firestore.FieldValue.serverTimestamp() } }, { merge: true });
      console.log(`[sale1010] ${p.id}(${p.tw} ${p.account})已派送`);
    } else {
      // 派送失敗 → 拿掉標記,下一輪(10 分鐘後)重試;仍受 STALE_S 限制
      await STATE.update({ [`post_${p.id}`]: admin.firestore.FieldValue.delete() });
      console.error(`[sale1010] ${p.id} 派送失敗 HTTP ${r.status}: ${(await r.text()).slice(0, 300)}`);
    }
  }
}

function mailHtml(): string {
  const P = (s: string) => `<p style="margin:0 0 16px">${s}</p>`;
  return `
<div style="font-family:-apple-system,'PingFang TC','Noto Sans TC',sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1C1C1E;line-height:1.9;font-size:15px">
${P("嗨，")}
${P("我是 StayJP 的 Mia。<br>謝謝你一直用免費版讀日文。")}
${P("這週有個雙十活動，想讓你知道一下：")}
${P("・年費 <s>NT$1,990</s> → <strong>NT$1,490</strong><br>　這段時間買的，之後每年續訂都維持 1,490（續訂不中斷就一直是這個價）<br>・買斷 <s>NT$5,990</s> → <strong>NT$3,990</strong><br>　一次付清，之後不用再管續訂<br>・月費不變")}
${P("期間：10/8(四) 00:00 到 10/11(日) 23:59（台灣時間）")}
${P("如果你手上有朋友或老師給的推薦碼，在官網結帳時輸入，年費、買斷可以再打約 9 折（年費 1,340、買斷 3,590）。<br>推薦碼只能在官網用，App 裡買就是 1,490 / 3,990。")}
<p style="margin:24px 0"><a href="${PRICING_URL}" style="display:inline-block;background:#D2603F;color:#fff;text-decoration:none;font-weight:700;padding:12px 24px;border-radius:10px">看雙十方案</a></p>
${P("不買也完全沒關係，免費版一樣可以每天用。<br>有什麼卡住的地方，App 或網站裡的「回報」按鈕可以直接找到我們。")}
${P("Mia<br>StayJP 日本再留計劃")}
<hr style="border:none;border-top:1px solid #E5E5EA;margin:24px 0 12px">
<p style="margin:0;font-size:12px;color:#8E8E93">你收到這封信是因為你註冊了 StayJP。不想再收到活動與提醒信，可以到 <a href="https://stayjp.study/account.html" style="color:#8E8E93">帳號頁</a> 關閉 Email 通知。</p>
</div>`;
}

async function runEmail(nowMs: number) {
  const tw = new Date(nowMs + 8 * 3600 * 1000);            // 台灣時間(用 UTC getter 讀)
  const mmdd = (tw.getUTCMonth() + 1) * 100 + tw.getUTCDate();
  if (tw.getUTCFullYear() !== 2026 || mmdd < 1008 || mmdd > 1011 || tw.getUTCHours() < 9 || nowMs > SALE_END) return;
  if (!(await claim(`email_${mmdd}`, { status: "sending" }))) return;

  const subject = mmdd === 1011
    ? "StayJP 雙十特價今晚 23:59 截止:年費 1,490,之後每年也是 1,490"
    : "雙十特價:年費 1,490,之後每年也是 1,490(到 10/11)";

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

  const html = mailHtml();
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
  console.log(`[sale1010] ${mmdd} 活動信排寄 ${sent} 封,跳過 ${skipped}`);
}

export const sale1010Cron = functions.onSchedule(
  {
    schedule: "every 10 minutes",
    timeZone: "Asia/Taipei",
    region: "asia-east1",
    maxInstances: 1,
    timeoutSeconds: 540,
    memory: "512MiB",
    secrets: [AUTOPOST_GH_TOKEN],
  },
  async () => {
    const nowMs = Date.now();
    if (nowMs > OFF_AFTER) return;
    await runThreads(Math.floor(nowMs / 1000), AUTOPOST_GH_TOKEN.value());
    await runEmail(nowMs);
  }
);
