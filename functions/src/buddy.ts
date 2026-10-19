/**
 * 讀書夥伴(讀書小屋)API(2026-10-20)— 免費功能:最多 5 人一間小屋,看彼此今天讀了沒、互相加油/叫醒。
 * 不涉及付款 → App 內也能用。互動只有固定的兩種(加油/叫醒),沒有自由文字 → 不會有騷擾內容、不用審核。
 * POST JSON { action, ... }(warm / preview 不用登入):
 *   preview {token}          → 邀請頁:誰的小屋、已經有誰(只給名字第一個字)、還有幾個位子
 *   info                     → 我的小屋 + 每個人今天/本週/連續天數 + 我今天對誰做過什麼 + 我收到的互動
 *   create                   → 開一間小屋(每人只能在一間)
 *   join {token} / leave     → 加入 / 退出(屋主退出就交給下一個人;沒人就刪掉)
 *   remove {member_uid}      → 屋主移除成員
 *   regen                    → 屋主換新邀請連結
 *   poke {to, kind}          → kind = cheer(加油,對同一人每天 3 次)/ wake(叫醒,對方今天還沒讀才行,每天 1 次)
 *   inbox                    → 我收到、還沒看過的互動(首頁跳通知用)+ 標成已看
 * 資料:study_circles/{id} { owner_uid, member_uids[], members{uid:{name,joined_at}}, invite_token, created_at }
 *       study_circles/{id}/events/{auto} { from, to, kind, at, day, seen }
 * client 不能直接讀寫(rules 預設拒絕),一律走這支。
 */
import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { db, nowMs, newInviteToken } from "./utils/firestore";
import { ecpayConfig } from "./utils/constants";
import { studyStats, twDay } from "./utils/study-stats";
import { displayNameOf } from "./group";

const MAX = 5;
const PAGE = "buddy.html";
const LIMIT: Record<string, number> = { cheer: 3, wake: 1 };
const inviteUrl = (t: string) => `${ecpayConfig().siteOrigin}/${PAGE}?join=${encodeURIComponent(t)}&openExternalBrowser=1`;

async function circleOf(uid: string) {
  const q = await db.collection("study_circles").where("member_uids", "array-contains", uid).limit(1).get();
  return q.empty ? null : { id: q.docs[0].id, c: q.docs[0].data() as any };
}

export const buddyApi = functions.onRequest(
  { region: "asia-east1", invoker: "public", cors: true, maxInstances: 10, memory: "256MiB" },
  async (req, res) => {
    try {
      if (req.method !== "POST") { res.status(405).json({ error: "method_not_allowed" }); return; }
      const action = String(req.body?.action || "");
      const now = nowMs();
      if (action === "warm") { res.json({ ok: true }); return; }

      if (action === "preview") {
        const token = String(req.body?.token || "");
        const q = token ? await db.collection("study_circles").where("invite_token", "==", token).limit(1).get() : null;
        if (!q || q.empty) { res.json({ ok: false, reason: "這個邀請連結已經失效了,請朋友重新傳一次。" }); return; }
        const c = q.docs[0].data();
        const ms: string[] = c.member_uids || [];
        res.json({ ok: ms.length < MAX, owner_name: await displayNameOf(c.owner_uid), initials: ms.map(m => String(c.members?.[m]?.name || "?").slice(0, 1)), count: ms.length, max: MAX, reason: ms.length >= MAX ? "這間小屋已經滿了。" : undefined });
        return;
      }

      const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      if (!idToken) { res.status(401).json({ error: "missing_auth" }); return; }
      const uid = (await admin.auth().verifyIdToken(idToken)).uid;

      if (action === "create") {
        if (await circleOf(uid)) { res.status(409).json({ error: "in_circle", reason: "你已經在一間讀書小屋裡了。" }); return; }
        const ref = db.collection("study_circles").doc();
        await ref.set({ owner_uid: uid, member_uids: [uid], members: { [uid]: { name: await displayNameOf(uid), joined_at: now } }, invite_token: newInviteToken(), created_at: now });
        res.json({ ok: true });
        return;
      }

      if (action === "join") {
        const token = String(req.body?.token || "");
        const q = token ? await db.collection("study_circles").where("invite_token", "==", token).limit(1).get() : null;
        if (!q || q.empty) { res.status(404).json({ error: "invalid_token", reason: "這個邀請連結已經失效了,請朋友重新傳一次。" }); return; }
        const mine = await circleOf(uid);
        if (mine && mine.id !== q.docs[0].id) { res.status(409).json({ error: "in_other", reason: "你已經在別的讀書小屋了,要先退出才能加入。" }); return; }
        const ref = q.docs[0].ref, name = await displayNameOf(uid);
        const r = await db.runTransaction(async (tx) => {
          const c = (await tx.get(ref)).data();
          if (!c || c.invite_token !== token) return { error: "invalid_token", reason: "這個邀請連結已經失效了。" };
          const ms: string[] = c.member_uids || [];
          if (ms.includes(uid)) return { ok: true };
          if (ms.length >= MAX) return { error: "full", reason: "這間小屋已經滿了。" };
          tx.update(ref, { member_uids: admin.firestore.FieldValue.arrayUnion(uid), [`members.${uid}`]: { name, joined_at: now } });
          return { ok: true };
        });
        if ((r as any).error) { res.status(409).json(r); return; }
        res.json({ ok: true, owner_name: await displayNameOf(q.docs[0].data().owner_uid) });
        return;
      }

      const mine = await circleOf(uid);
      if (action === "info") {
        if (!mine) { res.json({ circle: null }); return; }
        const { id, c } = mine;
        const ms: string[] = c.member_uids || [];
        const day = twDay(now);
        const [stats, sent, recv] = await Promise.all([
          Promise.all(ms.map(m => studyStats(m, now))),
          db.collection(`study_circles/${id}/events`).where("from", "==", uid).where("day", "==", day).get(),
          db.collection(`study_circles/${id}/events`).where("to", "==", uid).where("day", "==", day).get(),
        ]);
        const sentMap: Record<string, Record<string, number>> = {};
        sent.docs.forEach(d => { const e = d.data(); sentMap[e.to] = sentMap[e.to] || {}; sentMap[e.to][e.kind] = (sentMap[e.to][e.kind] || 0) + 1; });
        const members = ms.map((m, i) => ({
          uid: m, me: m === uid, owner: m === c.owner_uid, name: c.members?.[m]?.name || "使用者",
          ...stats[i], sent: sentMap[m] || {},
        }));
        const received = recv.docs.map(d => d.data()).sort((a, b) => b.at - a.at).slice(0, 20)
          .map(e => ({ from_name: c.members?.[e.from]?.name || "夥伴", kind: e.kind, at: e.at }));
        res.json({ circle: { id, owner: c.owner_uid === uid, max: MAX, invite_url: inviteUrl(c.invite_token), members, received, limits: LIMIT } });
        return;
      }

      if (action === "inbox") {
        if (!mine) { res.json({ events: [] }); return; }
        const q = await db.collection(`study_circles/${mine.id}/events`).where("to", "==", uid).where("seen", "==", false).get();
        const evs = q.docs.map(d => ({ ref: d.ref, ...d.data() as any })).filter(e => now - e.at < 2 * 864e5).sort((a, b) => b.at - a.at);
        await Promise.all(q.docs.map(d => d.ref.update({ seen: true })));
        res.json({ events: evs.slice(0, 5).map(e => ({ from_name: mine.c.members?.[e.from]?.name || "夥伴", kind: e.kind, at: e.at })) });
        return;
      }

      if (!mine) { res.status(404).json({ error: "no_circle", reason: "你還沒有讀書小屋。" }); return; }
      const ref = db.doc(`study_circles/${mine.id}`);
      const c = mine.c;

      if (action === "poke") {
        const to = String(req.body?.to || ""), kind = String(req.body?.kind || "");
        if (!LIMIT[kind]) { res.status(400).json({ error: "bad_kind" }); return; }
        if (to === uid || !(c.member_uids || []).includes(to)) { res.status(400).json({ error: "bad_target" }); return; }
        if (kind === "wake" && (await studyStats(to, now)).today > 0) { res.status(409).json({ error: "already_studied", reason: "他今天已經讀過了,改幫他加油吧!" }); return; }
        const day = twDay(now);
        const done = await db.collection(`study_circles/${mine.id}/events`).where("from", "==", uid).where("to", "==", to).where("kind", "==", kind).where("day", "==", day).get();
        if (done.size >= LIMIT[kind]) { res.status(429).json({ error: "limit", reason: kind === "wake" ? "今天已經叫過他了,明天再叫吧。" : "今天已經幫他加油 3 次了!" }); return; }
        await db.collection(`study_circles/${mine.id}/events`).add({ from: uid, to, kind, at: now, day, seen: false });
        res.json({ ok: true, left: LIMIT[kind] - done.size - 1 });
        return;
      }

      if (action === "leave") {
        const rest = (c.member_uids || []).filter((m: string) => m !== uid);
        if (!rest.length) {   // 最後一個人退出 → 連互動紀錄一起清(子集合不會跟著父文件刪)
          const evs = await db.collection(`study_circles/${mine.id}/events`).get();
          await Promise.all(evs.docs.map(d => d.ref.delete()));
          await ref.delete(); res.json({ ok: true }); return;
        }
        await ref.update({ member_uids: rest, [`members.${uid}`]: admin.firestore.FieldValue.delete(), ...(c.owner_uid === uid ? { owner_uid: rest[0] } : {}) });
        res.json({ ok: true });
        return;
      }

      if (c.owner_uid !== uid) { res.status(403).json({ error: "not_owner", reason: "只有屋主可以這樣做。" }); return; }
      if (action === "remove") {
        const m = String(req.body?.member_uid || "");
        if (m === uid || !(c.member_uids || []).includes(m)) { res.status(400).json({ error: "bad_target" }); return; }
        await ref.update({ member_uids: admin.firestore.FieldValue.arrayRemove(m), [`members.${m}`]: admin.firestore.FieldValue.delete() });
        res.json({ ok: true });
        return;
      }
      if (action === "regen") {
        const t = newInviteToken(); await ref.update({ invite_token: t });
        res.json({ ok: true, invite_url: inviteUrl(t) });
        return;
      }
      res.status(400).json({ error: "unknown_action" });
    } catch (err) {
      console.error("buddyApi error:", err);
      res.status(500).json({ error: "internal" });
    }
  },
);
