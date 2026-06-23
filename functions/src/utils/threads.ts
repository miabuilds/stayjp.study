// Threads (Meta) API client — 文字貼文發布 + long-lived token 續期
//
// 官方流程是「兩步驟」:
//   1. 建立 media container:POST /{threads-user-id}/threads?media_type=TEXT&text=...
//      → 回傳 creation_id
//   2. 發布:POST /{threads-user-id}/threads_publish?creation_id=...
//      → 回傳貼文 id
// 官方建議兩步驟間隔 ~30 秒(給後端處理時間),文字貼文通常更快,但我們保守等一下。
//
// 需要的 access token scope:threads_basic + threads_content_publish
// token 是 long-lived(60 天),用 refreshLongLivedToken 可再續 60 天。

import axios from "axios";

const GRAPH = "https://graph.threads.net/v1.0";

/** 建容器 → 等候 → 發布。回傳已發布貼文 id。 */
export async function publishTextPost(opts: {
  userId: string; // Threads user id(用 user token 時也可傳 "me")
  accessToken: string;
  text: string;
  waitMs?: number; // 建容器後等多久再發布,預設 30s
}): Promise<string> {
  const { userId, accessToken, text } = opts;
  const waitMs = opts.waitMs ?? 30_000;

  // step 1 — 建 media container
  const createRes = await axios.post(`${GRAPH}/${encodeURIComponent(userId)}/threads`, null, {
    params: { media_type: "TEXT", text, access_token: accessToken },
    timeout: 20_000,
  });
  const creationId = createRes.data?.id;
  if (!creationId) {
    throw new Error(`Threads create container failed: ${JSON.stringify(createRes.data)}`);
  }

  // 官方建議等一下再發布
  if (waitMs > 0) await new Promise((r) => setTimeout(r, waitMs));

  // step 2 — 發布
  const pubRes = await axios.post(`${GRAPH}/${encodeURIComponent(userId)}/threads_publish`, null, {
    params: { creation_id: creationId, access_token: accessToken },
    timeout: 20_000,
  });
  const postId = pubRes.data?.id;
  if (!postId) {
    throw new Error(`Threads publish failed: ${JSON.stringify(pubRes.data)}`);
  }
  return postId;
}

/** 續期 long-lived token(>24h 舊、未過期的 token 才能續)。回傳新 token 與秒數。 */
export async function refreshLongLivedToken(
  accessToken: string,
): Promise<{ token: string; expiresIn: number }> {
  const res = await axios.get(`${GRAPH}/refresh_access_token`, {
    params: { grant_type: "th_refresh_token", access_token: accessToken },
    timeout: 20_000,
  });
  return { token: res.data.access_token, expiresIn: res.data.expires_in };
}
