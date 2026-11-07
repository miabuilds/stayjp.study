// HTTP function:使用者自助刪除帳號(Apple 5.1.1(v) 要求 app 內可刪帳號)
//
// 任何登入用戶可刪「自己」的帳號(uid 由 idToken 驗證,不能刪別人)。
// 刪除:個資/進度/訂閱狀態 doc(含子集合 srs/chat_logs)+ 其他以 uid 為鍵的資料 + Firebase Auth 帳號。
// 保留:transactions 帳本(財務紀錄,依會計/退費爭議需留存;以 uid 關聯但已無對應帳號)。
//
// 2026-11-07 資安稽核:
//   - 網頁綠界訂閱還在續扣 → 先跟綠界停定期定額,停不掉就 409 不刪(以前只刪 doc,卡照扣、人卻不見了)
//   - 補刪 users/{uid} 子集合、user_daily、ai_usage、sprint_waitlist、paypal_pending、讀書小屋/揪團成員

import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { db, getSubscription, revokeGroupSub, writeTransaction } from "./utils/firestore";
import { ECPAY_SECRETS, isLifetimePlan } from "./utils/constants";
import { ecpayPeriodCancel } from "./utils/ecpay";

if (admin.apps.length === 0) admin.initializeApp();

export const deleteAccount = functions.onRequest(
  {
    secrets: ECPAY_SECRETS,
    cors: true,
    region: "asia-east1",
    invoker: "public",
    maxInstances: 3,
    timeoutSeconds: 120,
    memory: "256MiB",
    concurrency: 10,
  },
  async (req, res) => {
    try {
      if (req.method !== "POST") { res.status(405).json({ error: "method_not_allowed" }); return; }

      const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      if (!idToken) { res.status(401).json({ error: "missing_auth" }); return; }
      const decoded = await admin.auth().verifyIdToken(idToken);
      const uid = decoded.uid;

      // 0. 綠界定期定額還會扣 → 先停
      const sub = await getSubscription(uid);
      const renewing = !!sub && sub.source === "web" && !isLifetimePlan(sub.plan) && !!sub.ecpay_order
        && sub.status === "active" && sub.willRenew !== false;
      if (renewing) {
        const r = await ecpayPeriodCancel(String(sub!.ecpay_order));
        const recentlySubscribed = (Date.now() - (sub!.startedAt || 0)) < 15 * 60 * 1000;
        if (!r.ok && !(r.orderNotFound && !recentlySubscribed)) {
          console.error("deleteAccount: ECPay cancel failed, abort", { uid, msg: r.msg });
          res.status(409).json({
            error: "ecpay_cancel_failed",
            reason: r.orderNotFound ? "訂閱剛成立,綠界扣款約定建立中,請約 10 分鐘後再試。" : "自動續訂尚未成功關閉,為避免刪除後仍被扣款,請先到「帳號」關閉自動續訂,或聯絡我們。",
          });
          return;
        }
        try {
          await writeTransaction({
            uid, type: "cancel", source: "web", plan: sub!.plan, amount_twd: 0, payment_method: "ecpay",
            external_id: sub!.ecpay_order || "", status: "success", note: `刪帳號前停止定期定額:${r.msg}`,
          });
        } catch (e) { console.error("deleteAccount: write cancel txn failed", e); }
      }

      const log: string[] = [];
      const step = async (name: string, fn: () => Promise<unknown>) => {
        try { await fn(); log.push(name); } catch (e) { console.error(`deleteAccount step ${name} failed`, { uid, e: String(e) }); }
      };

      // 1. 讀書小屋 / 揪團:先退出(revokeGroupSub 會還原或標 expired,順序在刪 users 之前)
      await step("study_circles", async () => {
        const q = await db.collection("study_circles").where("member_uids", "array-contains", uid).get();
        for (const d of q.docs) {
          const c = d.data();
          if (c.owner_uid === uid) await db.recursiveDelete(d.ref);
          else await d.ref.update({ member_uids: admin.firestore.FieldValue.arrayRemove(uid), [`members.${uid}`]: admin.firestore.FieldValue.delete() });
        }
      });
      await step("groups", async () => {
        const q = await db.collection("groups").where("member_uids", "array-contains", uid).get();
        for (const d of q.docs) {
          await revokeGroupSub(uid, d.id).catch(() => {});
          await d.ref.update({ member_uids: admin.firestore.FieldValue.arrayRemove(uid), [`members.${uid}`]: admin.firestore.FieldValue.delete() });
        }
        const own = await db.doc(`groups/${uid}`).get();
        if (own.exists) {
          for (const m of ((own.data()?.member_uids || []) as string[])) await revokeGroupSub(m, uid).catch(() => {});
          await own.ref.delete();
        }
      });

      // 2. 個資 / 進度 / 訂閱狀態(users 連子集合 srs/chat_logs 一起)
      await step("users", () => db.recursiveDelete(db.doc(`users/${uid}`)));
      for (const col of ["subscriptions", "user_progress", "free_users", "user_daily", "ai_usage", "sprint_waitlist"]) {
        await step(col, () => db.doc(`${col}/${uid}`).delete());
      }
      await step("paypal_pending", async () => {
        const q = await db.collection("paypal_pending").where("uid", "==", uid).get();
        for (const d of q.docs) await d.ref.delete();
      });

      // 3. 刪 Firebase Auth 帳號(最後做;前面 doc 刪完才動)
      await admin.auth().deleteUser(uid);

      console.log("✓ account deleted", { uid, renewingCancelled: renewing, steps: log });
      res.json({ ok: true });
    } catch (err) {
      console.error("deleteAccount error:", err);
      res.status(500).json({ error: "internal" });
    }
  },
);
