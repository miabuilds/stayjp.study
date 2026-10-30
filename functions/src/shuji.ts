// 熟記本(Shuji)互查端點 — 2026-10-30 熟記本獨立成自己的 Worker+D1(~/Documents/GitHub/shuji/api),不再用 StayJP 的 Firebase。
// 這裡只剩一件事:熟記本拿 Google/Apple 帳號(google:<sub> / apple:<sub>)來問「這個人是不是 StayJP 付費會員」,
// 是就在熟記本免費開 Premium。同 StayTW/KR/TH 的 /api/internal/premium:x-shuji-secret 不對一律 403,只回 true/false,不回任何個資。
//   GET .../shujiApi/premium?uid=google:<sub>
import * as functions from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import * as admin from "firebase-admin";
import { isPremiumUser } from "./ai-quota";

if (admin.apps.length === 0) admin.initializeApp();

const SHUJI_SECRET = defineSecret("SHUJI_SECRET");

function sameSecret(given: string, want: string): boolean {
  if (!want || given.length !== want.length) return false;
  let d = 0;
  for (let i = 0; i < want.length; i++) d |= given.charCodeAt(i) ^ want.charCodeAt(i);
  return d === 0;
}

export const shujiApi = functions.onRequest(
  { region: "asia-east1", secrets: [SHUJI_SECRET, "REVENUECAT_SECRET_KEY"], timeoutSeconds: 15, memory: "256MiB", maxInstances: 5 },
  async (req, res) => {
    try {
      if (!sameSecret(String(req.headers["x-shuji-secret"] || ""), SHUJI_SECRET.value() || "")) { res.status(403).json({ error: "forbidden" }); return; }
      const m = /^(google|apple):([A-Za-z0-9._-]{1,200})$/.exec(String(req.query.uid || ""));
      if (!m) { res.status(400).json({ error: "bad_uid" }); return; }
      const providerId = m[1] === "google" ? "google.com" : "apple.com";
      const r = await admin.auth().getUsers([{ providerId, providerUid: m[2] }]);
      const fbUid = r.users[0] && r.users[0].uid;
      res.json({ premium: fbUid ? await isPremiumUser(fbUid) : false });
    } catch (e: any) {
      console.error("shuji premium lookup", e && e.message);
      res.json({ premium: false });
    }
  });
