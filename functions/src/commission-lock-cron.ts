// Scheduled function:每日鎖定到期的 KOL 分潤。
// pending 且已過 30 天鎖定期(lock_at ≤ now)且未被退款作廢 → 翻 locked(可結算領款)。
// 退款/退單的 clawback 在付款/退款 callback 即時把該筆翻 void,所以這裡剩的 pending 都是「乾淨過關」的。
import * as functions from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import { db, nowMs } from "./utils/firestore";

if (admin.apps.length === 0) admin.initializeApp();

export const commissionLockCron = functions.onSchedule(
  {
    schedule: "every day 04:00",
    timeZone: "Asia/Taipei",
    region: "asia-east1",
    maxInstances: 1,
    timeoutSeconds: 300,
    memory: "256MiB",
  },
  async () => {
    const now = nowMs();
    // 只用單一 equality 查(免複合索引),lock_at 在程式端過濾
    const snap = await db.collection("commissions").where("state", "==", "pending").get();
    let locked = 0;
    for (const d of snap.docs) {
      if (Number(d.data().lock_at || 0) <= now) {
        await d.ref.set({ state: "locked", locked_at: now }, { merge: true });
        locked++;
      }
    }
    console.log(`[commission-lock] 鎖定 ${locked} 筆分潤(pending → locked)`);
  },
);
