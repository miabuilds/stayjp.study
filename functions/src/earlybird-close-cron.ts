// Scheduled function:早鳥收官開關。
// 每天日本時間中午 12:00 檢查:過了 EARLY_BIRD_END_MS 就把 counters/early_bird.closed 設 true。
// closed 是給「前端顯示」用的總開關(pricing / tool-quota / App paywall 讀同一份 doc);
// 後端的新購閘門(precheckSubscribe / paypal-create-order)另有日期判斷,不依賴這個旗標,
// 就算 cron 沒跑,收官後也買不到。既有早鳥的續扣完全不受影響(callback 沿用 is_early_bird 原價)。
// 冪等:已 closed 就不再寫;要重開早鳥 → 手動把 closed 改 false + 調 EARLY_BIRD_END_MS 重佈。

import * as functions from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import { db, nowMs } from "./utils/firestore";
import { EARLY_BIRD_END_MS } from "./utils/constants";

if (admin.apps.length === 0) admin.initializeApp();

export const earlybirdCloseCron = functions.onSchedule(
  {
    schedule: "0 12 * * *",
    timeZone: "Asia/Tokyo",
    region: "asia-east1",
  },
  async () => {
    if (nowMs() < EARLY_BIRD_END_MS) return;
    const ref = db.doc("counters/early_bird");
    const snap = await ref.get();
    if (snap.data()?.closed === true) return;
    await ref.set(
      { closed: true, closed_at: admin.firestore.FieldValue.serverTimestamp() },
      { merge: true },
    );
    console.log("[earlybird-close] closed at", new Date(nowMs()).toISOString());
  },
);
