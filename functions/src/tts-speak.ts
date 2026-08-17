// 雲端語音合成:text → Google Cloud Text-to-Speech → mp3(base64)。
// 給「情境對話」模式的 AI 回覆發聲用 —— 對話是即時生成的,沒辦法像主站那樣預錄 VOICEVOX,
// 所以改接 Google TTS(ja-JP Neural2,自然好聽)。
// 認證:用 functions 的 ADC(google-auth-library 自動取用執行環境的 service account),
// 不需 API key、不需額外 SDK。TTS API 已在專案啟用。
// ⚠️ 測試版:限 admin 呼叫 → 真實用戶打不到、不產生成本、不曝光。
import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { GoogleAuth } from "google-auth-library";

if (admin.apps.length === 0) admin.initializeApp();

const ADMIN_EMAILS = ["stayjpplan@gmail.com", "abc83327@gmail.com"];
const googleAuth = new GoogleAuth({ scopes: "https://www.googleapis.com/auth/cloud-platform" });

// 允許的日語聲音(擋掉亂帶參數);預設女聲 B。
const VOICES: Record<string, string> = {
  "f": "ja-JP-Neural2-B",   // 女
  "m": "ja-JP-Neural2-C",   // 男
  "f2": "ja-JP-Neural2-D",  // 女(另一種音色)
};

export const ttsSpeak = functions.onRequest(
  { cors: true, region: "asia-east1" },
  async (req, res) => {
    try {
      const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      const decoded = await admin.auth().verifyIdToken(idToken);
      if (!ADMIN_EMAILS.includes((decoded.email || "").toLowerCase())) {
        res.status(403).json({ error: "測試版限 admin 帳號" }); return;
      }
      const { text, voice, rate } = (req.body || {}) as { text?: string; voice?: string; rate?: number };
      if (!text || !text.trim()) { res.status(400).json({ error: "缺 text" }); return; }

      const voiceName = VOICES[voice || "f"] || VOICES.f;
      const speakingRate = Math.min(1.3, Math.max(0.7, Number(rate) || 1.0));

      const client = await googleAuth.getClient();
      const at = await client.getAccessToken();
      const r = await fetch("https://texttospeech.googleapis.com/v1/text:synthesize", {
        method: "POST",
        headers: { "Authorization": "Bearer " + at.token, "content-type": "application/json" },
        body: JSON.stringify({
          input: { text: text.slice(0, 400) },
          voice: { languageCode: "ja-JP", name: voiceName },
          audioConfig: { audioEncoding: "MP3", speakingRate, pitch: 0 },
        }),
      });
      const j: any = await r.json();
      if (!r.ok) { res.status(502).json({ error: "TTS " + r.status, detail: JSON.stringify(j).slice(0, 300) }); return; }
      res.json({ audio: j.audioContent });   // base64 mp3;前端用 data:audio/mp3;base64, 播放
    } catch (e: any) {
      res.status(500).json({ error: String((e && e.message) || e) });
    }
  },
);
