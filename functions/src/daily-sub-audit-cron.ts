// Scheduled function:每日訂閱健康稽核(唯讀)。
// 揪出「付了錢卻被影響」或「該過期沒過期」的不一致,寫進 system_alerts/sub_audit 供後台看,
// 有異常時 console.error(可在 Cloud Logging 設告警 / 之後接 email)。
//
// ⚠️ 純唯讀使用者資料,只寫自己的 system_alerts doc,絕不改任何 users/{uid}。

import * as functions from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import { db, nowMs } from "./utils/firestore";

if (admin.apps.length === 0) admin.initializeApp();

export const dailySubAuditCron = functions.onSchedule(
  {
    schedule: "every day 03:30",
    timeZone: "Asia/Taipei",
    region: "asia-east1",
    maxInstances: 1,
    timeoutSeconds: 300,
    memory: "256MiB",
  },
  async () => {
    const snap = await db.collection("users")
      .where("subscription.status", "in", ["active", "trialing", "cancelled", "expired", "refunded"])
      .get();

    const now = nowMs();
    const issues: Array<Record<string, unknown>> = [];
    let real = 0;

    snap.forEach((d) => {
      const s = (d.data().subscription || {}) as Record<string, unknown>;
      if (s.is_sandbox === true) return;   // 沙盒測試不算
      real++;
      const exp = Number(s.expiresAt || 0);
      const future = exp > now;
      const status = s.status as string;
      const plan = s.plan as string;

      // 🔴 付了錢卻被誤標過期(到期日還在未來)
      if (status === "expired" && future) {
        issues.push({ uid: d.id, type: "wrongly_expired", status, source: s.source || "", expiresAt: exp });
      }
      // 🟡 該過期卻還開通(到期日已過,非買斷)
      if (["active", "trialing", "cancelled"].includes(status) && !future && plan !== "lifetime") {
        issues.push({ uid: d.id, type: "over_granted", status, source: s.source || "", expiresAt: exp });
      }
      // ⚪ 沒有到期日(資料異常,非買斷)
      if (!exp && plan !== "lifetime") {
        issues.push({ uid: d.id, type: "no_expiry", status, source: s.source || "" });
      }
    });

    const summary = {
      checked_at: now,
      total: real,
      issue_count: issues.length,
      issues: issues.slice(0, 100),   // 後台顯示用,上限 100
    };
    await db.doc("system_alerts/sub_audit").set(summary);

    if (issues.length) {
      console.error(`[sub-audit] ⚠️ ${issues.length} 筆訂閱異常(共 ${real} 筆)`, JSON.stringify(issues.slice(0, 50)));
    } else {
      console.log(`[sub-audit] ✅ OK,${real} 筆訂閱全部一致`);
    }
  },
);
