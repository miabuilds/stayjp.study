#!/usr/bin/env node
// 拿 Threads API 長期 token + user_id 的互動腳本
//
// 用法:
//   1. 先在 Meta 後台建好 App,拿到 App ID / App Secret
//      Threads 後台「Redirect Callback URLs」要加: https://stayjp.study/
//   2. 跑:  node scripts/get-threads-token.mjs
//      (或先設環境變數)THREADS_APP_ID=xxx THREADS_APP_SECRET=yyy node scripts/get-threads-token.mjs
//   3. 照畫面指示:開授權網址 → 同意 → 複製跳轉後網址列的 code → 貼回來
//   4. 腳本印出長期 token(60天)+ user_id,再照最後印的指令設進 Firebase secrets
//
// 需要 Node 18+(有內建 fetch)。本專案是 Node 22,直接跑。

import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const REDIRECT_URI = process.env.THREADS_REDIRECT_URI || "https://stayjp.study/";
const SCOPE = "threads_basic,threads_content_publish";

const rl = readline.createInterface({ input, output });
const ask = (q) => rl.question(q);

function die(msg, extra) {
  console.error("\n❌ " + msg);
  if (extra) console.error(extra);
  rl.close();
  process.exit(1);
}

try {
  // ── 1. 取得 App ID / Secret ───────────────────────────────
  const appId = process.env.THREADS_APP_ID || (await ask("貼上你的 Threads App ID: ")).trim();
  const appSecret =
    process.env.THREADS_APP_SECRET || (await ask("貼上你的 Threads App Secret: ")).trim();
  if (!appId || !appSecret) die("App ID / Secret 不能空白");

  // ── 2. 印授權網址 ────────────────────────────────────────
  const authUrl =
    "https://threads.net/oauth/authorize?" +
    new URLSearchParams({
      client_id: appId,
      redirect_uri: REDIRECT_URI,
      scope: SCOPE,
      response_type: "code",
    }).toString();

  console.log("\n────────────────────────────────────────");
  console.log("① 用手機 / 電腦瀏覽器打開下面這個網址(要用已登入 Threads 的瀏覽器):\n");
  console.log(authUrl);
  console.log(
    "\n② 點「同意 / Allow」後,會跳轉到 " +
      REDIRECT_URI +
      " 開頭的網址,\n   網址列會長像 " +
      REDIRECT_URI +
      "?code=AQD... (後面可能有 #_,不用管)",
  );
  console.log("③ 把整段網址 或 只把 code= 後面那串 複製貼回來");
  console.log("────────────────────────────────────────\n");

  let pasted = (await ask("貼上 code(或整個跳轉網址): ")).trim();
  // 容錯:貼整個網址也能抓出 code
  if (pasted.includes("code=")) {
    pasted = decodeURIComponent(pasted.split("code=")[1].split(/[&#]/)[0]);
  }
  // Threads 有時會在 code 尾巴帶 #_,清掉
  const code = pasted.replace(/#_$/, "").trim();
  if (!code) die("沒抓到 code");

  // ── 3. code → 短期 token(+ user_id)──────────────────────
  console.log("\n⏳ 換取短期 token...");
  const shortRes = await fetch("https://graph.threads.net/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: appId,
      client_secret: appSecret,
      grant_type: "authorization_code",
      redirect_uri: REDIRECT_URI,
      code,
    }),
  });
  const shortData = await shortRes.json();
  if (!shortRes.ok || !shortData.access_token) {
    die("換短期 token 失敗", JSON.stringify(shortData, null, 2));
  }
  const userId = String(shortData.user_id);
  console.log("✅ 短期 token OK,user_id = " + userId);

  // ── 4. 短期 → 長期 token(60 天)──────────────────────────
  console.log("⏳ 換取長期 token(60 天)...");
  const longUrl =
    "https://graph.threads.net/access_token?" +
    new URLSearchParams({
      grant_type: "th_exchange_token",
      client_secret: appSecret,
      access_token: shortData.access_token,
    }).toString();
  const longRes = await fetch(longUrl);
  const longData = await longRes.json();
  if (!longRes.ok || !longData.access_token) {
    die("換長期 token 失敗", JSON.stringify(longData, null, 2));
  }
  const days = Math.round((longData.expires_in || 0) / 86400);

  // ── 5. 輸出 ──────────────────────────────────────────────
  console.log("\n🎉 拿到了!\n");
  console.log("THREADS_USER_ID      = " + userId);
  console.log("THREADS_ACCESS_TOKEN = " + longData.access_token);
  console.log("有效天數              ≈ " + days + " 天\n");
  console.log("接著把它設進 Firebase secrets(在 functions/ 上層執行):");
  console.log("  echo -n '" + longData.access_token + "' | firebase functions:secrets:set THREADS_ACCESS_TOKEN");
  console.log("  echo -n '" + userId + "' | firebase functions:secrets:set THREADS_USER_ID");
  console.log("  echo -n 'https://stayjp.study' | firebase functions:secrets:set SITE_ORIGIN");
  console.log("\n或把上面兩個值貼給我,我幫你設 + 部署。");
} catch (err) {
  die("發生錯誤", err?.stack || String(err));
} finally {
  rl.close();
}
