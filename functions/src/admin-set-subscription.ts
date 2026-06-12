// HTTP function:owner 後台手動管理訂閱(補開 / 取消 / 延長)
//
// 用在「付了錢沒入帳」的人工補救、客訴取消、補償延長等。owner only。
// 寫入一律走共用 helper(writeSubscription/patchSubscription)→ 訂閱獨立(subscriptions/{uid})
// 上線後自動跟搬,本函數無需改碼。每個動作寫一筆 transaction 留可追溯帳。

import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { PLANS, PlanKey } from "./utils/constants";
import {
  getSubscription, writeSubscription, patchSubscription, writeTransaction,
  nowMs, SubscriptionDoc,
} from "./utils/firestore";

if (admin.apps.length === 0) admin.initializeApp();

const OWNER_EMAILS = new Set(["stayjpplan@gmail.com", "abc83327@gmail.com"]);

export const adminSetSubscription = functions.onRequest(
  {
    cors: true,
    region: "asia-east1",
    invoker: "public",
    maxInstances: 2,
    timeoutSeconds: 30,
    memory: "256MiB",
    concurrency: 10,
  },
  async (req, res) => {
    try {
      const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      if (!idToken) { res.status(401).json({ error: "missing_auth" }); return; }
      const decoded = await admin.auth().verifyIdToken(idToken);
      if (!OWNER_EMAILS.has(decoded.email || "")) { res.status(403).json({ error: "not_owner" }); return; }

      const action = String(req.body?.action || "");
      const email = String(req.body?.email || "").trim().toLowerCase();
      if (!email) { res.status(400).json({ error: "missing_email" }); return; }

      let uid: string;
      try {
        uid = (await admin.auth().getUserByEmail(email)).uid;
      } catch {
        res.status(404).json({ error: "user_not_found", reason: `找不到 ${email} 的帳號(對方需先用 Google 登入過本站)。` });
        return;
      }

      if (action === "set") {
        const plan = String(req.body?.plan || "") as PlanKey;
        if (!PLANS[plan]) { res.status(400).json({ error: "invalid_plan", plan }); return; }
        const raw = req.body?.expiresAt;
        const expiresAt = typeof raw === "number" ? raw : (raw ? new Date(String(raw)).getTime() : 0);
        if (!expiresAt || isNaN(expiresAt)) { res.status(400).json({ error: "invalid_expiresAt", reason: "需傳到期日(yyyy-mm-dd 或 ms)" }); return; }

        const existing = await getSubscription(uid);
        const sub: SubscriptionDoc = {
          source: "web",
          plan,
          status: "active",
          expiresAt,
          willRenew: plan !== "lifetime",
          startedAt: existing?.startedAt || nowMs(),
          is_early_bird: plan === "yearly_early_bird" || existing?.is_early_bird === true,
          failed_retries: 0,
        };
        await writeSubscription(uid, sub);
        await writeTransaction({
          uid, type: "gift", source: "web", plan, amount_twd: 0,
          payment_method: "manual", external_id: `admin-set-${nowMs()}`,
          status: "success", note: `manual admin set by ${decoded.email}`,
        });
      } else if (action === "cancel") {
        await patchSubscription(uid, { status: "cancelled", willRenew: false });
        await writeTransaction({
          uid, type: "cancel", source: "web", plan: "n/a", amount_twd: 0,
          payment_method: "manual", external_id: `admin-cancel-${nowMs()}`,
          status: "success", note: `manual admin cancel by ${decoded.email}`,
        });
      } else if (action === "extend") {
        const days = Number(req.body?.days || 0);
        if (!days || days <= 0) { res.status(400).json({ error: "invalid_days" }); return; }
        const existing = await getSubscription(uid);
        if (!existing) { res.status(404).json({ error: "no_subscription", reason: "此用戶目前沒有訂閱可延長,請先用「設定」補開。" }); return; }
        const base = Math.max(nowMs(), existing.expiresAt || 0);
        await patchSubscription(uid, { expiresAt: base + days * 86400000 });
        await writeTransaction({
          uid, type: "gift", source: "web", plan: existing.plan, amount_twd: 0,
          payment_method: "manual", external_id: `admin-extend-${nowMs()}`,
          status: "success", note: `manual extend ${days}d by ${decoded.email}`,
        });
      } else if (action === "refund") {
        // 手動退費記帳 — 用在「虛擬ATM / 轉帳」這種綠界無法自動退刷、owner 已手動把錢轉回去的情況。
        // 只補記一筆 type:'refund' 帳(讓報表淨營收正確下修),刻意「不做」以下事:
        //   - 不碰 subscription 狀態(重複扣款只退多付那筆,她的有效訂閱權限照常)
        //   - 不進黑名單 / 不累計 refund_count(她是重複匯款的受害方,不該被封)
        //   - 不釋放早鳥名額(她仍是早鳥)
        const amount = Number(req.body?.amount || 0);
        if (!amount || amount <= 0) { res.status(400).json({ error: "invalid_amount", reason: "退費金額需為正數(NT$)" }); return; }
        const note = String(req.body?.note || "").slice(0, 200);
        await writeTransaction({
          uid, type: "refund", source: "web", plan: "n/a", amount_twd: -Math.abs(amount),
          payment_method: "manual", external_id: `admin-refund-${nowMs()}`,
          status: "refunded",
          note: `manual ATM/transfer refund NT$${amount} by ${decoded.email}${note ? " — " + note : ""}`,
        });
      } else {
        res.status(400).json({ error: "invalid_action", reason: "action 需為 set / cancel / extend / refund" });
        return;
      }

      const after = await getSubscription(uid);
      res.json({ ok: true, uid, email, action, subscription: after });
    } catch (err) {
      console.error("adminSetSubscription error:", err);
      res.status(500).json({ error: "internal", message: String(err) });
    }
  },
);
