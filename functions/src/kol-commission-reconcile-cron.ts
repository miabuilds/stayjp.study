// Scheduled function:KOL 分潤每日對帳(2026-10-06,Mia:「透過 KOL 拿到推薦的真的要記錄,不要少給人家,之後也不要有漏」)。
//
// 分潤平常由付款當下的路徑寫入(綠界 callback / RevenueCat webhook / rcSyncSubscription)。
// 但歸因可能比付款晚一步到(例:App 匿名購買後才登入、推薦碼暫存在本機登入後才補寫、webhook 先到而
// ref_code 後寫),那一刻 recordKolCommission 讀不到碼就略過了——之後沒有任何地方會再補。
// 這支每天把「付款前就記到 KOL 碼、首筆真付款、卻沒有分潤紀錄」的人找出來補記,並寄信通知 Mia。
//
// 規則(與 recordKolCommission 完全一致,它本身也會再擋一次):
//   - 只算每位買家的「第一筆真實付款」(amount_twd>0、非沙盒、未退費)
//   - 該帳號的 ref_code 是 KOL/官方型碼(個人碼走 +30 天,不抽成),且不是自己的碼、碼未停權
//   - **ref_at 必須早於付款時間**(付完錢才點到 KOL 連結的,不是 KOL 帶來的單,不補)
//   - 冪等:commissions/{code}_{buyer} 已存在就跳過,重跑不會重複給
// 只看最近 60 天的首購,避免把很久以前的歷史一次翻出來(9/14 Mia 決定舊的漏記不補)。
//
// 部署:firebase deploy --only functions:kolCommissionReconcileCron

import * as functions from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import { db, recordKolCommission } from "./utils/firestore";

if (admin.apps.length === 0) admin.initializeApp();

const LOOKBACK_DAYS = 60;
const GRACE_MS = 10 * 60 * 1000;   // ref_at 與付款同時寫入的競態:付款後 10 分鐘內寫入的碼仍視為付款前就有

type Tx = { id: string; uid: string; ts: number; amount: number; pm: string; plan: string; ext: string };

export const kolCommissionReconcileCron = functions.onSchedule(
  {
    schedule: "every day 04:10",
    timeZone: "Asia/Taipei",
    region: "asia-east1",
    maxInstances: 1,
    timeoutSeconds: 300,
    memory: "512MiB",
  },
  async () => {
    const now = Date.now();
    const since = now - LOOKBACK_DAYS * 864e5;

    // 1) 所有成功交易(只抓需要的欄位),找出每位買家的第一筆真實付款
    const snap = await db.collection("transactions").where("status", "==", "success")
      .select("uid", "occurred_at", "amount_twd", "is_sandbox", "payment_method", "plan", "external_id").get();
    const first = new Map<string, Tx>();
    snap.forEach((d) => {
      const t = d.data();
      if (t.is_sandbox === true || !(Number(t.amount_twd) > 0) || typeof t.uid !== "string" || !t.uid) return;
      const ts = t.occurred_at?.toMillis ? t.occurred_at.toMillis() : Number(t.occurred_at || 0);
      const prev = first.get(t.uid);
      if (!prev || ts < prev.ts) {
        first.set(t.uid, { id: d.id, uid: t.uid, ts, amount: Number(t.amount_twd), pm: String(t.payment_method || ""), plan: String(t.plan || ""), ext: String(t.external_id || d.id) });
      }
    });
    const recent = [...first.values()].filter((t) => t.ts >= since);

    // 2) 這些買家的推薦碼(只抓 ref_code / ref_at)
    const users = new Map<string, { ref_code?: string; ref_at?: number }>();
    for (let i = 0; i < recent.length; i += 100) {
      const refs = recent.slice(i, i + 100).map((t) => db.doc(`users/${t.uid}`));
      const docs = await db.getAll(...refs, { fieldMask: ["ref_code", "ref_at"] });
      docs.forEach((s) => users.set(s.id, (s.data() || {}) as { ref_code?: string; ref_at?: number }));
    }

    const codeCache = new Map<string, FirebaseFirestore.DocumentData | null>();
    const getCode = async (c: string) => {
      if (!codeCache.has(c)) codeCache.set(c, (await db.doc(`ref_codes/${c}`).get()).data() || null);
      return codeCache.get(c);
    };

    const backfilled: Array<Record<string, unknown>> = [];
    const skippedLate: Array<Record<string, unknown>> = [];
    for (const t of recent) {
      const u = users.get(t.uid) || {};
      const code = u.ref_code;
      if (!code) continue;
      const c = await getCode(code);
      if (!c || c.type === "user" || !c.owner_uid || c.owner_uid === t.uid || c.status === "suspended") continue;
      if ((await db.doc(`commissions/${code}_${t.uid}`).get()).exists) continue;
      // 付款之後才記到碼 → 不是 KOL 帶來的單
      if (typeof u.ref_at !== "number" || u.ref_at > t.ts + GRACE_MS) {
        skippedLate.push({ uid: t.uid, code, paid_at: t.ts, ref_at: u.ref_at ?? null });
        continue;
      }
      // 已退費的不補
      const refunded = await db.collection("transactions").where("uid", "==", t.uid).where("status", "==", "refunded").limit(1).get();
      if (!refunded.empty) continue;

      const source = t.pm === "ecpay" ? "web" : t.pm === "paypal" ? "paypal" : "app";
      try {
        await recordKolCommission(t.uid, { plan: t.plan, gross_twd: t.amount, source, txnId: t.ext, isSandbox: false, isFirstPayment: true });
        if ((await db.doc(`commissions/${code}_${t.uid}`).get()).exists) {
          await db.doc(`commissions/${code}_${t.uid}`).set({ backfilled_at: now, original_paid_at: t.ts, note: "每日對帳補記" }, { merge: true });
          backfilled.push({ uid: t.uid, code, plan: t.plan, gross_twd: t.amount, pm: t.pm, paid_at: t.ts });
        }
      } catch (e) {
        console.error("[kol-reconcile] 補記失敗", t.uid, code, e);
      }
    }

    await db.doc("system_alerts/kol_reconcile").set({
      checked_at: now, scanned_first_payments: recent.length,
      backfilled_count: backfilled.length, backfilled: backfilled.slice(0, 50),
      late_attribution_count: skippedLate.length,
    });

    if (backfilled.length) {
      const fmt = (ms: number) => new Date(ms + 8 * 3600e3).toISOString().slice(0, 16).replace("T", " ");
      const lines = backfilled.map((b) => `・${b.code}  ${b.plan}  NT$${b.gross_twd}  (${b.pm},付款 ${fmt(b.paid_at as number)})`).join("\n");
      await db.collection("mail").add({
        to: process.env.REMIND_TO || "stayjpplan@gmail.com",
        message: {
          subject: `[StayJP] KOL 分潤對帳:補記 ${backfilled.length} 筆`,
          text: `（本信為自動通知）\n\n每日對帳發現下列付款有 KOL 推薦碼、卻沒記到分潤,已自動補記(狀態 pending,30 天鎖定期照常):\n\n${lines}\n\n後台 KOL 分潤頁可以看到。`,
        },
        _campaign: "kol_reconcile", _createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.warn(`[kol-reconcile] 補記 ${backfilled.length} 筆`, JSON.stringify(backfilled));
    } else {
      console.log(`[kol-reconcile] OK,${recent.length} 位近 ${LOOKBACK_DAYS} 天首購,無漏記`);
    }
  },
);
