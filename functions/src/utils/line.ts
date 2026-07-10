// LINE Messaging API client — push 訊息給自己(半自動發文用)
//
// 為什麼不用 LINE Notify:LINE Notify 已於 2025-03-31 停止服務,改用 Messaging API。
//
// 前置設定(在 LINE 官方帳號 / LINE Developers console 完成):
//   1. 建一個 LINE 官方帳號(免費),在設定裡啟用 Messaging API
//      → 會在 LINE Developers 產生一個 Messaging API channel
//   2. Messaging API 分頁 → 發行 long-lived「Channel access token」
//      → firebase functions:secrets:set LINE_CHANNEL_ACCESS_TOKEN
//   3. Basic settings 分頁 → 複製「Your user ID」(頻道擁有者自己的 userId)
//      → firebase functions:secrets:set LINE_USER_ID
//   4. 用手機把這個官方帳號「加為好友」,推播才收得到
//
// 免費方案每月 200 則推播;一天 2 則約 60 則/月,夠用。

import axios from "axios";

const PUSH_ENDPOINT = "https://api.line.me/v2/bot/message/push";

/** 推一到多則文字訊息給指定 userId(自己)。 */
export async function pushText(opts: {
  userId: string;
  accessToken: string;
  texts: string[]; // 每則獨立訊息,方便「乾淨複製正文 + 分開的操作提示」
}): Promise<void> {
  const { userId, accessToken, texts } = opts;
  const messages = texts
    .filter((t) => t && t.trim().length > 0)
    .slice(0, 5) // LINE 單次 push 上限 5 則
    .map((text) => ({ type: "text", text }));

  if (messages.length === 0) return;

  await axios.post(
    PUSH_ENDPOINT,
    { to: userId, messages },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      timeout: 20_000,
    },
  );
}
