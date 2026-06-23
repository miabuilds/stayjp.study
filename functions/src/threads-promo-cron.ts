// Scheduled function:每天早 08:00 / 晚 21:00(台灣時間)各發一篇 Threads 宣傳貼文
//
// 設定 secrets(部署前):
//   firebase functions:secrets:set THREADS_ACCESS_TOKEN   # long-lived user token
//   firebase functions:secrets:set THREADS_USER_ID        # Threads user id
//   firebase functions:secrets:set SITE_ORIGIN            # 你的網站(已存在則沿用)
//
// 內容輪播狀態存 meta/threads_promo,每篇發布紀錄存 threads_posts(可在後台看)。
// 想停 / 改時間,改下面 schedule 即可;想換文案改 threads-content.ts。

import * as functions from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import { defineSecret } from "firebase-functions/params";
import { publishTextPost } from "./utils/threads";
import { pickPost, Route, Slot } from "./threads-content";

if (admin.apps.length === 0) admin.initializeApp();
const db = admin.firestore();

const THREADS_ACCESS_TOKEN = defineSecret("THREADS_ACCESS_TOKEN");
const THREADS_USER_ID = defineSecret("THREADS_USER_ID");
const SITE_ORIGIN = defineSecret("SITE_ORIGIN");

const STATE_REF = () => db.collection("meta").doc("threads_promo");

export const threadsPromoCron = functions.onSchedule(
  {
    schedule: "0 8,21 * * *", // 每天 08:00 與 21:00
    timeZone: "Asia/Taipei",
    region: "asia-east1",
    maxInstances: 1,
    timeoutSeconds: 120,
    memory: "256MiB",
    secrets: [THREADS_ACCESS_TOKEN, THREADS_USER_ID, SITE_ORIGIN],
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
    console.log(`Threads promo cron: slot=${slot} (taipeiHour=${taipeiHour})`);

    // 讀輪播狀態
    const stateSnap = await STATE_REF().get();
    const state = stateSnap.exists ? stateSnap.data() || {} : {};
    const used: number[] = Array.isArray(state.used) ? state.used : [];
    const lastRoute: Route | undefined = state.lastRoute;

    const { index, text, route } = pickPost({
      slot,
      used,
      lastRoute,
      siteOrigin: SITE_ORIGIN.value(),
    });

    // 發布
    let postId: string;
    try {
      postId = await publishTextPost({
        userId: THREADS_USER_ID.value(),
        accessToken: THREADS_ACCESS_TOKEN.value(),
        text,
      });
    } catch (err: unknown) {
      console.error("Threads publish error:", err instanceof Error ? err.message : err);
      await db.collection("threads_posts").add({
        ok: false,
        slot,
        route,
        text,
        error: err instanceof Error ? err.message : String(err),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      throw err; // 讓 cron 顯示失敗,方便在 logs 看到
    }

    // 更新輪播狀態 + 寫紀錄
    const nextUsed = used.includes(index) ? used : [...used, index];
    await STATE_REF().set(
      { used: nextUsed, lastRoute: route, lastIndex: index, updatedAt: admin.firestore.FieldValue.serverTimestamp() },
      { merge: true },
    );
    await db.collection("threads_posts").add({
      ok: true,
      postId,
      slot,
      route,
      poolIndex: index,
      text,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`Threads posted: id=${postId} slot=${slot} route=${route} index=${index}`);
  },
);
