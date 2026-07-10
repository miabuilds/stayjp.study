// Scheduled function:每天早 08:00 / 晚 21:00(台灣時間)各推「一篇草稿到 LINE」
//
// 【半自動 · 檔位一】機器負責排程 + 輪播選文,你負責「加真實 + 手動貼到 Threads」。
//   → 不需要 Threads API token,繞開 OAuth。你就是那個「發布按鈕」。
//
// 設定 secrets(部署前):
//   firebase functions:secrets:set LINE_CHANNEL_ACCESS_TOKEN   # LINE Messaging API channel token
//   firebase functions:secrets:set LINE_USER_ID                # 你自己的 LINE userId
//   (LINE 前置設定見 utils/line.ts 註解)
// 網站網址({LINK} 用)非機密,直接沿用 constants 的 siteOrigin,不另設 secret。
//
// 內容輪播狀態存 meta/threads_promo,每篇草稿紀錄存 threads_drafts(可在後台看)。
// 想停 / 改時間,改下面 schedule 即可;想換文案改 threads-content.ts。
//
// 之後要升級「檔位二:後台審核 + API 自動發」時,再把 utils/threads.ts 的
// publishTextPost 接回來即可(現在刻意不呼叫,才能無 token 上線)。

import * as functions from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import { defineSecret } from "firebase-functions/params";
import { pushText } from "./utils/line";
import { pickPost, Route, Slot } from "./threads-content";
import { ecpayConfig } from "./utils/constants";

if (admin.apps.length === 0) admin.initializeApp();
const db = admin.firestore();

const LINE_CHANNEL_ACCESS_TOKEN = defineSecret("LINE_CHANNEL_ACCESS_TOKEN");
const LINE_USER_ID = defineSecret("LINE_USER_ID");

const STATE_REF = () => db.collection("meta").doc("threads_promo");

// route 中文標籤,推播提示用
const ROUTE_LABEL: Record<Route, string> = {
  emo: "情緒共鳴(不放連結,衝觸及)",
  life: "生活美食(不放連結)",
  founder: "創辦人+工具(帶連結,轉換)",
  ask: "互動提問(不放連結)",
};

export const threadsPromoCron = functions.onSchedule(
  {
    schedule: "0 8,21 * * *", // 每天 08:00 與 21:00
    timeZone: "Asia/Taipei",
    region: "asia-east1",
    maxInstances: 1,
    timeoutSeconds: 60,
    memory: "256MiB",
    secrets: [LINE_CHANNEL_ACCESS_TOKEN, LINE_USER_ID],
  },
  async () => {
    // 用台北時間判斷現在是早場還是晚場
    const taipeiHour = Number(
      new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        hour12: false,
        timeZone: "Asia/Taipei",
      }).format(new Date()),
    );
    const slot: Slot = taipeiHour < 12 ? "morning" : "evening";
    console.log(`Threads draft cron: slot=${slot} (taipeiHour=${taipeiHour})`);

    // 讀輪播狀態
    const stateSnap = await STATE_REF().get();
    const state = stateSnap.exists ? stateSnap.data() || {} : {};
    const used: number[] = Array.isArray(state.used) ? state.used : [];
    const lastRoute: Route | undefined = state.lastRoute;

    const { index, text, route } = pickPost({
      slot,
      used,
      lastRoute,
      siteOrigin: ecpayConfig().siteOrigin,
    });

    // 推到 LINE:訊息1=乾淨正文(方便整段複製)、訊息2=操作提示
    const slotLabel = slot === "morning" ? "早場 08:00" : "晚場 21:00";
    const hint =
      `📝 今天的 Threads 草稿(${slotLabel} · ${ROUTE_LABEL[route]})\n\n` +
      `👆 複製「上一則」貼到 Threads app\n` +
      `💡 情緒/生活篇記得加一句今天真實發生的事,才不像 AI\n` +
      `(不滿意就跳過,明天換一篇)`;

    let pushed = false;
    let pushError: string | null = null;
    try {
      await pushText({
        userId: LINE_USER_ID.value(),
        accessToken: LINE_CHANNEL_ACCESS_TOKEN.value(),
        texts: [text, hint],
      });
      pushed = true;
    } catch (err: unknown) {
      pushError = err instanceof Error ? err.message : String(err);
      console.error("LINE push error:", pushError);
    }

    // 更新輪播狀態(有推成功才記為已用,失敗下次重推同一篇)
    if (pushed) {
      const nextUsed = used.includes(index) ? used : [...used, index];
      await STATE_REF().set(
        {
          used: nextUsed,
          lastRoute: route,
          lastIndex: index,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    }

    // 寫草稿紀錄(後台可看歷史)
    await db.collection("threads_drafts").add({
      pushed,
      error: pushError,
      slot,
      route,
      poolIndex: index,
      text,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    if (!pushed) throw new Error(`LINE push failed: ${pushError}`); // 讓 cron 顯示失敗
    console.log(`Threads draft pushed to LINE: slot=${slot} route=${route} index=${index}`);
  },
);
