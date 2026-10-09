// Mia 的電子報(stayjp.study/letters):App 開發、商業模式、旅居生活。2026-10 起。
//
//   newsletterSubscribe — 官網表單 POST {email} → newsletter_subs/{sha256(email)} 存 pending,寄確認信(雙重確認)
//   newsletterConfirm   — 確認信裡的連結 ?t=token → active,導回 letters?subscribed=1
//   newsletterUnsub     — 每封信底部的退訂連結 ?t=token → unsubscribed(一鍵,不用登入)
//   newsletterCron      — 每小時:讀線上的 /letters/feed.json,send_at 已過、還沒寄完的那期 → 排進 mail 集合
//
// 發一期 = 寫 letters-src/<slug>.md(front matter 寫 send_at)→ node scripts/build-letters.mjs → push。
// 不用登後台、不用本機 admin 憑證:寄送狀態全在 Firestore newsletter_issues/{slug},寄過的人記在 subs.got[slug],
// 一天最多 DAILY_CAP 封(跟試用信、活動信共用 SMTP 每日額度),寄不完隔天接著寄,不會重複。
//
// 隱私:名單只有 Admin SDK 讀得到(firestore.rules 末尾全拒)。不跟 StayJP 會員名單混用 —— 會員沒同意收這種信。

import * as https from "firebase-functions/v2/https";
import * as scheduler from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import crypto from "crypto";
import { db, FieldValue } from "./utils/firestore";

if (admin.apps.length === 0) admin.initializeApp();

const SITE = "https://stayjp.study";
const FN = "https://asia-east1-jpnote-1bdd6.cloudfunctions.net";
const CORS = [/^https:\/\/stayjp\.study$/, /^http:\/\/localhost(:\d+)?$/, /^http:\/\/127\.0\.0\.1(:\d+)?$/];
const DAILY_CAP = 200;                 // SMTP 每天 300,留 100 給試用信/系統信
const REPLY_TO = "founder@stayjp.study";
// 寄件人:founder@ 已在 Brevo 驗證(見 stayjp-domain-email)。SMTP 不認的話信會被退或改寫,上線後先用真信箱測一次確認信。
const FROM = "Mia｜一人公司實驗室 <founder@stayjp.study>";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const idOf = (email: string) => crypto.createHash("sha256").update(email).digest("hex").slice(0, 32);
const newToken = () => crypto.randomBytes(18).toString("base64url");
const twDay = () => new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10);

function shell(inner: string): string {
  return `<div style="max-width:560px;margin:0 auto;padding:24px 20px;font-family:-apple-system,'PingFang TC','Noto Sans TC',sans-serif;color:#222;line-height:1.8;font-size:16px">${inner}</div>`;
}

function page(title: string, body: string): string {
  return `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="background:#faf8f4;margin:0">${shell(`<h1 style="font-size:22px">${title}</h1><p>${body}</p><p><a href="${SITE}/letters/" style="color:#c0392b">回到電子報</a></p>`)}</body></html>`;
}

// ── 訂閱 ──
export const newsletterSubscribe = https.onRequest(
  { cors: CORS, region: "asia-east1", invoker: "public", maxInstances: 3, timeoutSeconds: 15, memory: "256MiB" },
  async (req, res) => {
    if (req.method !== "POST") { res.status(405).json({ ok: false }); return; }
    const body = typeof req.body === "string" ? (() => { try { return JSON.parse(req.body); } catch { return {}; } })() : (req.body || {});
    const email = String(body.email || "").trim().toLowerCase();
    if (body.website) { res.json({ ok: true }); return; }          // 蜜罐欄位:機器人填了就假裝成功
    if (!EMAIL_RE.test(email) || email.length > 200) { res.status(400).json({ ok: false, err: "email" }); return; }

    const ref = db.doc(`newsletter_subs/${idOf(email)}`);
    const snap = await ref.get();
    const cur = snap.data() || {};
    if (cur.status === "active") { res.json({ ok: true, already: true }); return; }
    // 同一信箱 10 分鐘內只寄一次確認信(防灌)
    if (cur.confirmSentAt && Date.now() - cur.confirmSentAt.toMillis() < 10 * 60e3) { res.json({ ok: true }); return; }

    const token = cur.token || newToken();
    await ref.set({
      email, token, status: "pending", source: String(body.source || "letters").slice(0, 40),
      createdAt: cur.createdAt || FieldValue.serverTimestamp(), confirmSentAt: FieldValue.serverTimestamp(),
    }, { merge: true });
    const link = `${FN}/newsletterConfirm?t=${token}`;
    await db.collection("mail").add({
      to: email,
      from: FROM,
      replyTo: REPLY_TO,
      message: {
        subject: "確認訂閱「一人公司實驗室」",
        html: shell(`<p>嗨，我是 Mia，謝謝你訂閱「一人公司實驗室」。</p><p>按下面的按鈕確認，之後有新的一期就會寄給你。</p>
<p style="margin:28px 0"><a href="${link}" style="background:#c0392b;color:#fff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:600">確認訂閱</a></p>
<p style="color:#888;font-size:13px">不是你本人訂的話，忽略這封信就好，不會再收到任何東西。</p>`),
      },
      _campaign: "newsletter_confirm", _createdAt: FieldValue.serverTimestamp(),
    });
    res.json({ ok: true });
  },
);

// ── 確認 ──
export const newsletterConfirm = https.onRequest(
  { region: "asia-east1", invoker: "public", maxInstances: 3, timeoutSeconds: 15, memory: "256MiB" },
  async (req, res) => {
    const t = String(req.query.t || "");
    const q = t ? await db.collection("newsletter_subs").where("token", "==", t).limit(1).get() : null;
    if (!q || q.empty) { res.status(404).send(page("連結失效", "這個確認連結找不到了，可以回電子報頁面重新訂閱一次。")); return; }
    const doc = q.docs[0];
    if (doc.data().status !== "active") await doc.ref.set({ status: "active", confirmedAt: FieldValue.serverTimestamp() }, { merge: true });
    res.redirect(302, `${SITE}/letters/?subscribed=1`);
  },
);

// ── 退訂(一鍵,GET/POST 都吃:POST 是給信箱的 List-Unsubscribe-Post 用的)──
export const newsletterUnsub = https.onRequest(
  { region: "asia-east1", invoker: "public", maxInstances: 3, timeoutSeconds: 15, memory: "256MiB" },
  async (req, res) => {
    const t = String(req.query.t || "");
    const q = t ? await db.collection("newsletter_subs").where("token", "==", t).limit(1).get() : null;
    if (q && !q.empty) await q.docs[0].ref.set({ status: "unsubscribed", unsubAt: FieldValue.serverTimestamp() }, { merge: true });
    res.status(200).send(page("已經退訂了", "之後不會再寄電子報給你。謝謝你看到這裡。"));
  },
);

// ── 寄送 ──
interface Issue { slug: string; title: string; send_at: string; email_url: string; }

export async function runNewsletter(): Promise<string> {
  const feed = await fetch(`${SITE}/letters/feed.json?_=${Date.now()}`).then((r) => r.ok ? r.json() : null).catch(() => null);
  const issues: Issue[] = (feed && Array.isArray(feed.issues)) ? feed.issues : [];
  const due = issues.filter((i) => i.send_at && Date.parse(i.send_at) <= Date.now())
    .sort((a, b) => Date.parse(a.send_at) - Date.parse(b.send_at));

  const capRef = db.doc(`newsletter_meta/cap_${twDay()}`);
  let used = Number((await capRef.get()).data()?.sent || 0);
  const log: string[] = [];

  for (const it of due) {
    if (used >= DAILY_CAP) break;
    const iref = db.doc(`newsletter_issues/${it.slug}`);
    const st = (await iref.get()).data() || {};
    if (st.done) continue;
    // 太舊的期數不補寄(第一次上線時不要把歷史文章全寄一遍)
    if (!st.started && Date.now() - Date.parse(it.send_at) > 3 * 86400e3) {
      await iref.set({ done: true, skipped: "too_old" }, { merge: true }); continue;
    }
    const html = await fetch(`${SITE}${it.email_url}?_=${Date.now()}`).then((r) => r.ok ? r.text() : "").catch(() => "");
    if (!html.includes("{{UNSUB}}")) { log.push(`${it.slug}: 信件 HTML 抓不到或缺退訂連結,不寄`); continue; }

    const subs = await db.collection("newsletter_subs").where("status", "==", "active").get();
    let sent = 0, left = 0;
    for (const d of subs.docs) {
      const s = d.data();
      if (s.got && s.got[it.slug]) continue;
      if (used >= DAILY_CAP) { left++; continue; }
      const unsub = `${FN}/newsletterUnsub?t=${s.token}`;
      await db.collection("mail").add({
        to: s.email,
        from: FROM,
        replyTo: REPLY_TO,
        message: {
          subject: it.title,
          html: html.split("{{UNSUB}}").join(unsub),
          headers: { "List-Unsubscribe": `<${unsub}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
        },
        _campaign: `newsletter_${it.slug}`, _createdAt: FieldValue.serverTimestamp(),
      });
      await d.ref.set({ got: { [it.slug]: FieldValue.serverTimestamp() } }, { merge: true });
      sent++; used++;
    }
    await capRef.set({ sent: used }, { merge: true });
    await iref.set({ started: true, sent: FieldValue.increment(sent), done: left === 0, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    log.push(`${it.slug}: 這次排寄 ${sent},剩 ${left}`);
  }
  const msg = log.length ? log.join(" | ") : "沒有到期的期數";
  console.log(`[newsletter] ${msg}(今日已用 ${used}/${DAILY_CAP})`);
  return msg;
}

export const newsletterCron = scheduler.onSchedule(
  { schedule: "every 60 minutes", timeZone: "Asia/Taipei", region: "asia-east1", maxInstances: 1, timeoutSeconds: 300, memory: "256MiB" },
  async () => { await runNewsletter(); },
);
