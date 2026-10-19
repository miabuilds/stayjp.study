/**
 * 揪團 API(2026-10-18,官網限定)— 主揪付款後,用邀請連結讓朋友加入共享 Premium。
 * POST JSON { action, ... }(除 preview 外都要帶 Firebase ID token):
 *   preview {token}         → 邀請頁:誰邀請、什麼方案、剩幾個位子(不用登入)
 *   info                    → 我的揪團(主揪:成員+邀請連結;團員:主揪與方案)
 *   join {token}            → 加入
 *   leave                   → 團員退出
 *   remove {member_uid}     → 主揪移除成員
 *   regen                   → 主揪換新邀請連結(舊連結失效)
 *   invite {email}          → 主揪寄邀請信(只寄連結,不比對帳號;每團每天 10 封)
 *   board                   → 本週團內排行(主揪+團員都看得到;讀 user_daily/{uid})
 *   board_hide {hidden}     → 自己要不要出現在排行(關掉照樣算進團隊總數)
 * 資料:groups/{主揪 uid}(見 utils/firestore.ts 揪團段)。client 不能直接讀寫 groups(rules 預設拒絕)。
 *
 * 補位規則(防止把位子拆出去轉賣):前 (seats-1) 個加入是「首次湊團」不限;之後每次加入算「補位」——
 *   年費團:30 天內最多補 1 次;買斷團:開團 30 天內不限,之後 365 天內最多補 1 次。退出/移除隨時可以。
 */
import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { db, nowMs, getSubscription, syncGroupMembers, newInviteToken, revokeGroupSub } from "./utils/firestore";
import { PLANS, isLifetimePlan, ecpayConfig } from "./utils/constants";

const DAY = 864e5;
const GROUP_PAGE = "group-beta.html";   // 測試頁;正式上線改名時一起改(前端邀請連結也用這個)
const INVITES_PER_DAY = 10;

const maskEmail = (e: string) => {
  const [u, d] = String(e || "").split("@");
  if (!d) return "";
  return (u.length <= 2 ? u[0] + "*" : u.slice(0, 2) + "***") + "@" + d;
};
async function displayNameOf(uid: string): Promise<string> {
  try {
    const u = await admin.auth().getUser(uid);
    const relay = /privaterelay\.appleid\.com$/i.test(u.email || "");
    return u.displayName || (relay ? "Apple 使用者" : maskEmail(u.email || "")) || "使用者";
  } catch { return "使用者"; }
}
const isPremium = (s: any) => !!s && ["active", "trialing", "cancelled"].includes(s.status) && (s.expiresAt || 0) > nowMs();
// openExternalBrowser=1:LINE 內建瀏覽器看到會自動改用 Safari/Chrome 開(LINE 官方參數)——邀請多半丟 LINE,而內建瀏覽器擋 Google 登入
const inviteUrl = (token: string) => `${ecpayConfig().siteOrigin}/${GROUP_PAGE}?join=${encodeURIComponent(token)}&openExternalBrowser=1`;

function replaceAllowed(g: any, now: number): { ok: boolean; reason?: string } {
  const firstFill = (g.fills || 0) < (g.seats - 1);
  if (firstFill) return { ok: true };
  const reps: number[] = g.replacements || [];
  if (isLifetimePlan(g.plan)) {
    if (now - (g.created_at || 0) < 30 * DAY) return { ok: true };
    if (reps.some(t => now - t < 365 * DAY)) return { ok: false, reason: "買斷揪團一年只能換一次成員,今年的換人次數已經用掉了。" };
    return { ok: true };
  }
  if (reps.some(t => now - t < 30 * DAY)) return { ok: false, reason: "揪團一個月只能換一次成員,這個月已經換過了,下個月再試。" };
  return { ok: true };
}

async function findGroupOf(uid: string): Promise<{ id: string; g: any; role: "owner" | "member" } | null> {
  const own = await db.doc(`groups/${uid}`).get();
  if (own.exists && own.data()?.status === "active") return { id: own.id, g: own.data(), role: "owner" };
  const q = await db.collection("groups").where("member_uids", "array-contains", uid).limit(1).get();
  if (!q.empty) return { id: q.docs[0].id, g: q.docs[0].data(), role: "member" };
  return null;
}

const revokeMember = (ownerUid: string, memberUid: string) => revokeGroupSub(memberUid, ownerUid);

// ── 團內排行 ──
// 資料:user_daily/{uid} = { "YYYY-MM-DD": {vocab, grammar, quiz} }(daily-log.js,裝置本地日期;台灣用戶≈台灣日期)。
// 一週 = 台灣時間週一~今天。團隊目標 = 每人每週 100 個動作(今日目標 30/天的三分之一,大家都碰得到)。
const PER_PERSON_WEEKLY_GOAL = 100;
const twDay = (ms: number) => new Date(ms + 8 * 3600e3).toISOString().slice(0, 10);
async function buildBoard(ownerUid: string, g: any, me: string) {
  const now = nowMs();
  const tw = new Date(now + 8 * 3600e3);
  const dow = (tw.getUTCDay() + 6) % 7;   // 週一=0
  const weekDays = Array.from({ length: dow + 1 }, (_, i) => twDay(now - (dow - i) * DAY));
  const today = twDay(now);
  const uids = [ownerUid, ...((g.member_uids || []) as string[])];
  const rows = await Promise.all(uids.map(async (u) => {
    const [dSnap, uSnap] = await Promise.all([db.doc(`user_daily/${u}`).get(), db.doc(`users/${u}`).get()]);
    const daily = dSnap.data() || {};
    const sumOf = (d: string) => { const x = daily[d] || {}; return (x.vocab || 0) + (x.grammar || 0) + (x.quiz || 0); };
    const week = weekDays.reduce((n, d) => n + sumOf(d), 0);
    let streak = 0;
    for (let i = sumOf(today) > 0 ? 0 : 1; i < 120; i++) { if (sumOf(twDay(now - i * DAY)) > 0) streak++; else break; }
    return {
      me: u === me, owner: u === ownerUid,
      name: u === ownerUid ? await displayNameOf(u) : (g.members?.[u]?.name || "使用者"),
      hidden: uSnap.data()?.group_board_hidden === true,
      week, today: sumOf(today), days: weekDays.filter(d => sumOf(d) > 0).length, streak,
    };
  }));
  const total = rows.reduce((n, r) => n + r.week, 0);
  const goal = PER_PERSON_WEEKLY_GOAL * uids.length;
  // 不公開的人:名次與數字都不給(自己看得到自己的),但照樣算進團隊總數
  const out = rows.sort((a, b) => b.week - a.week).map(r => (r.hidden && !r.me)
    ? { me: false, owner: r.owner, name: r.name, hidden: true }
    : r);
  return { week_start: weekDays[0], goal, total, members: out, my_hidden: rows.find(r => r.me)?.hidden || false };
}

export const groupApi = functions.onRequest(
  { region: "asia-east1", invoker: "public", cors: true, maxInstances: 10, memory: "256MiB" },
  async (req, res) => {
    try {
      if (req.method !== "POST") { res.status(405).json({ error: "method_not_allowed" }); return; }
      const action = String(req.body?.action || "");
      const now = nowMs();

      if (action === "warm") { res.json({ ok: true }); return; }   // 前端開頁先叫醒(冷啟動 ~6 秒),使用者登入/看畫面時同步暖機

      // ── preview:不用登入 ──
      if (action === "preview") {
        const token = String(req.body?.token || "");
        if (!token) { res.status(400).json({ error: "missing_token" }); return; }
        const q = await db.collection("groups").where("invite_token", "==", token).limit(1).get();
        if (q.empty) { res.json({ ok: false, reason: "這個邀請連結已經失效了,請主揪重新傳一次。" }); return; }
        const g = q.docs[0].data();
        const used = 1 + (g.member_uids || []).length;
        const initials = ((g.member_uids || []) as string[]).map(m => String(g.members?.[m]?.name || "?").slice(0, 1));   // 邀請卡頭像:只給第一個字,不給全名
        res.json({
          ok: g.status === "active" && g.expiresAt > now,
          owner_name: await displayNameOf(g.owner_uid), member_initials: initials,
          plan: g.plan, plan_name: PLANS[g.plan as keyof typeof PLANS]?.display_name || g.plan,
          seats: g.seats, left: Math.max(0, g.seats - used), lifetime: isLifetimePlan(g.plan),
          reason: g.status === "active" ? undefined : "這個揪團已經結束了。",
        });
        return;
      }

      const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      if (!idToken) { res.status(401).json({ error: "missing_auth" }); return; }
      const decoded = await admin.auth().verifyIdToken(idToken);
      const uid = decoded.uid;

      if (action === "info") {
        const f = await findGroupOf(uid);
        if (!f) { res.json({ role: null }); return; }
        if (f.role === "member") await syncGroupMembers(f.id).catch(() => {});   // 順手校正(主揪那邊有變動但沒同步到時)
        const g = f.g;
        const members = await Promise.all(((g.member_uids || []) as string[]).map(async (m) => ({
          uid: f.role === "owner" ? m : undefined,
          name: g.members?.[m]?.name || "使用者",
          joined_at: g.members?.[m]?.joined_at || null,
          me: m === uid,
        })));
        const rp = replaceAllowed(g, now);
        const board = await buildBoard(f.id, g, uid).catch(() => null);   // 一起帶回,少一次來回(冷啟動時差很多)
        res.json({
          board,
          role: f.role, plan: g.plan, plan_name: PLANS[g.plan as keyof typeof PLANS]?.display_name || g.plan,
          seats: g.seats, expiresAt: g.expiresAt, status: g.status, lifetime: isLifetimePlan(g.plan),
          owner_name: await displayNameOf(f.id), members,
          invite_url: f.role === "owner" ? inviteUrl(g.invite_token) : undefined,
          can_fill: rp.ok, fill_note: rp.ok ? undefined : rp.reason,
        });
        return;
      }

      if (action === "join") {
        const token = String(req.body?.token || "");
        const q = await db.collection("groups").where("invite_token", "==", token).limit(1).get();
        if (!token || q.empty) { res.status(404).json({ error: "invalid_token", reason: "這個邀請連結已經失效了,請主揪重新傳一次。" }); return; }
        const ownerUid = q.docs[0].id;
        if (ownerUid === uid) { res.status(400).json({ error: "is_owner", reason: "你是這團的主揪,已經包含在名額裡了。" }); return; }
        const other = await db.collection("groups").where("member_uids", "array-contains", uid).limit(1).get();
        if (!other.empty && other.docs[0].id !== ownerUid) { res.status(409).json({ error: "in_other_group", reason: "你已經在別的揪團裡了,要先退出才能加入新的。" }); return; }
        const mine = await getSubscription(uid);
        if (mine && isPremium(mine) && mine.source !== "group") {
          if (isLifetimePlan(mine.plan)) { res.status(409).json({ error: "already_lifetime", reason: "你已經是買斷會員了,不需要加入揪團。" }); return; }
          if (mine.willRenew !== false && mine.status !== "cancelled") {
            res.status(409).json({ error: "own_renewing", reason: "你自己有一份會自動續訂的方案。先取消自動續訂(剩下的天數照樣能用),再來加入揪團,才不會被重複扣款。" });
            return;
          }
        }
        const name = await displayNameOf(uid);
        const ref = db.doc(`groups/${ownerUid}`);
        const result = await db.runTransaction(async (tx) => {
          const g = (await tx.get(ref)).data();
          if (!g || g.status !== "active" || !(g.expiresAt > now) || g.invite_token !== token) return { error: "ended", reason: "這個揪團已經結束了。" };
          const ms: string[] = g.member_uids || [];
          if (ms.includes(uid)) return { ok: true, already: true };
          if (1 + ms.length >= g.seats) return { error: "full", reason: "這團的位子已經滿了。" };
          const rp = replaceAllowed(g, now);
          if (!rp.ok) return { error: "replace_limit", reason: rp.reason };
          const isReplacement = (g.fills || 0) >= (g.seats - 1);
          tx.update(ref, {
            member_uids: admin.firestore.FieldValue.arrayUnion(uid),
            [`members.${uid}`]: { name, joined_at: now },
            fills: admin.firestore.FieldValue.increment(1),
            ...(isReplacement ? { replacements: admin.firestore.FieldValue.arrayUnion(now) } : {}),
          });
          return { ok: true };
        });
        if ((result as any).error) { res.status(409).json(result); return; }
        await syncGroupMembers(ownerUid);
        res.json({ ok: true, owner_name: await displayNameOf(ownerUid) });
        return;
      }

      if (action === "board") {
        const f = await findGroupOf(uid);
        if (!f) { res.json({ ok: false }); return; }
        res.json({ ok: true, ...(await buildBoard(f.id, f.g, uid)) });
        return;
      }

      if (action === "board_hide") {
        await db.doc(`users/${uid}`).set({ group_board_hidden: !!req.body?.hidden }, { merge: true });
        res.json({ ok: true, hidden: !!req.body?.hidden });
        return;
      }

      if (action === "leave") {
        const q = await db.collection("groups").where("member_uids", "array-contains", uid).limit(1).get();
        if (q.empty) { res.status(404).json({ error: "not_member" }); return; }
        const ownerUid = q.docs[0].id;
        await q.docs[0].ref.update({ member_uids: admin.firestore.FieldValue.arrayRemove(uid), [`members.${uid}`]: admin.firestore.FieldValue.delete() });
        await revokeMember(ownerUid, uid);
        res.json({ ok: true });
        return;
      }

      // ── 以下只有主揪 ──
      const gRef = db.doc(`groups/${uid}`);
      const g = (await gRef.get()).data();
      if (!g || g.status !== "active") { res.status(403).json({ error: "not_owner", reason: "你目前沒有進行中的揪團。" }); return; }

      if (action === "remove") {
        const m = String(req.body?.member_uid || "");
        if (!(g.member_uids || []).includes(m)) { res.status(404).json({ error: "not_member" }); return; }
        await gRef.update({ member_uids: admin.firestore.FieldValue.arrayRemove(m), [`members.${m}`]: admin.firestore.FieldValue.delete() });
        await revokeMember(uid, m);
        const rp = replaceAllowed({ ...g, member_uids: (g.member_uids || []).filter((x: string) => x !== m) }, now);
        res.json({ ok: true, fill_note: rp.ok ? undefined : rp.reason });
        return;
      }

      if (action === "regen") {
        const token = newInviteToken();
        await gRef.update({ invite_token: token });
        res.json({ ok: true, invite_url: inviteUrl(token) });
        return;
      }

      if (action === "invite") {
        const email = String(req.body?.email || "").trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) { res.status(400).json({ error: "invalid_email", reason: "email 格式不對,再確認一次。" }); return; }
        const day = new Date(now + 8 * 3600e3).toISOString().slice(0, 10);   // 台灣日期
        const sent = (g.invites_sent?.[day] || 0) as number;
        if (sent >= INVITES_PER_DAY) { res.status(429).json({ error: "too_many", reason: `今天已經寄了 ${INVITES_PER_DAY} 封,明天再寄,或直接把連結傳給朋友。` }); return; }
        const ownerName = await displayNameOf(uid);
        const planName = PLANS[g.plan as keyof typeof PLANS]?.display_name || "揪團方案";
        await db.collection("mail").add({
          to: email,
          message: {
            subject: `${ownerName} 邀請你一起用 StayJP 學日文`,
            text: `嗨,\n\n${ownerName} 開了「日本再留計劃 StayJP」的${planName},邀請你加入。加入後就能用全部 Premium 功能(單字、文法、JLPT 刷題、AI 跟讀…),費用由主揪付款。\n\n點這裡加入(登入後就完成):\n${inviteUrl(g.invite_token)}\n\n如果你不認識寄件人,直接忽略這封信就好。\n\n日本再留計劃 StayJP`,
          },
          group_invite: { owner_uid: uid, at: now },
        });
        await gRef.update({ [`invites_sent.${day}`]: sent + 1 });
        res.json({ ok: true, left_today: INVITES_PER_DAY - sent - 1 });
        return;
      }

      res.status(400).json({ error: "unknown_action" });
    } catch (err) {
      console.error("groupApi error:", err);
      res.status(500).json({ error: "internal" });
    }
  },
);

