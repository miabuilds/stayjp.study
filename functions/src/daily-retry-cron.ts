// Scheduled function:每天跑一次,處理過期降級
//
// 注意:我們不主動 retry 扣款。ECPay 定期定額系統內部會自動重試。
// 我們做的只是:
//   - 收到 ecpay-callback failed 通知 → 增 failed_retries 計數 + 記 last_retry_at
//   - 這個 cron 每天檢查:超過 FAILED_PAYMENT_GRACE_DAYS 還沒成功 → 降級為 expired
//
// FAILED_PAYMENT_GRACE_DAYS 是粗略 grace,還沒對照 ECPay 文件確認他們實際重試
// 的次數 / 間隔。等正式上線後觀察 callback 模式再調。

import * as functions from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import { FAILED_PAYMENT_GRACE_DAYS } from "./utils/constants";
import { db, patchSubscription, writeTransaction, nowMs } from "./utils/firestore";

if (admin.apps.length === 0) admin.initializeApp();

export const dailyRetryCron = functions.onSchedule(
  {
    schedule: "every day 03:00",
    timeZone: "Asia/Taipei",
    region: "asia-east1",
    maxInstances: 1,           // 一天只跑一次,單 instance 就好
    timeoutSeconds: 540,        // 9 分鐘上限(用戶多時可能要跑久)
    memory: "512MiB",
  },
  async () => {
    console.log("Daily retry cron started");

    // 1. 找所有 failed_retries > 0 的訂閱
    const snap = await db.collection("users")
      .where("subscription.failed_retries", ">", 0)
      .get();

    console.log(`Found ${snap.size} users with failed retries`);

    for (const doc of snap.docs) {
      const sub = doc.data().subscription;
      if (!sub || !sub.last_retry_at) continue;

      const uid = doc.id;
      const failedCount = sub.failed_retries as number;
      const daysSinceLastFail = Math.floor((nowMs() - sub.last_retry_at) / (24 * 60 * 60 * 1000));

      // 超過 grace period 還沒成功 → 過期
      if (daysSinceLastFail > FAILED_PAYMENT_GRACE_DAYS) {
        await patchSubscription(uid, {
          status: "expired",
          willRenew: false,
        });
        await writeTransaction({
          uid,
          type: "fail",
          source: "web",
          plan: sub.plan,
          amount_twd: 0,
          payment_method: "ecpay",
          external_id: sub.ecpay_order || "",
          status: "failed",
          note: `Final retry exhausted (${failedCount}x). Subscription expired.`,
        });
        console.log(`Expired subscription for ${uid} after ${failedCount} retries`);
        continue;
      }

      // 還在 retry 階段 — 注意 ECPay 定期定額是綠界自動 retry,
      // 我們只是觀察 + 通知 + 記錄。實際 retry 由綠界發起,callback 進 ecpay-callback。
      // 這個 cron 主要負責:
      //   - 超期降級(上面)
      //   - 寄 email 提醒用戶更新信用卡(TODO:接 SendGrid 或同類服務)
      console.log(`User ${uid}: failed_retries=${failedCount}, daysSinceLastFail=${daysSinceLastFail}, will continue waiting for ECPay auto-retry`);
    }

    console.log("Daily retry cron finished");
  },
);
