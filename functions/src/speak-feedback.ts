// AI 口說回饋(測試版):收「目標句 + 學生念的(辨識結果)」→ 回 Haiku 的發音/文法回饋 JSON。
// Claude key 只在後端(functions secret ANTHROPIC_API_KEY),絕不進前端。
// ⚠️ 測試版:限 admin 呼叫 → 真實用戶打不到、不產生成本、不曝光。之後上線再改成 premium/quota 檢查。
import * as functions from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import * as admin from "firebase-admin";

if (admin.apps.length === 0) admin.initializeApp();

const ANTHROPIC_API_KEY = defineSecret("ANTHROPIC_API_KEY");
const ADMIN_EMAILS = ["stayjpplan@gmail.com", "abc83327@gmail.com"];
const MODEL = "claude-haiku-4-5-20251001";   // 便宜快,對「比對兩句+中文回饋」夠用

const SYSTEM = `你是 StayJP 的日語口說練習教練,學生是台灣的日語「初學者」。
學生會「跟著念」一個目標句;系統把他念的內容(來自語音辨識)給你。
請比較「目標句」與「學生念的」,用「繁體中文」給溫暖、具體、初學者能照做的回饋。

【最重要:別判錯】學生念的是「語音辨識結果」,寫法可能跟目標句不同,但**只要讀音一樣就是念對了,絕不能算錯**:
- 漢字↔假名不同不算錯:例如「起きます」和「おきます」是同一個音;「七時」和「7時」是同一個音(しちじ)。
- 判斷前,先在心裡把「目標句」和「學生念的」都轉成「假名讀音」再逐音比對。
- **除非某個音真的沒出現在讀音裡,否則不可以說「少了/漏了某字或某助詞」。** 例如學生念「7時におきます」就是有念「に」,不可說少了「に」。
評分重點(只看讀音):助詞(は/が/を/に…)有沒有念錯、動詞變化、語順、有沒有真的漏念或多念。發音細節不確定就別亂講。多鼓勵,別打擊。
只輸出一個 JSON 物件(不要有任何其他文字),格式:
{
 "score": 0-100 整數,
 "matched": true/false,
 "diff": "一句話點出最關鍵的差異;完全正確就寫「完全正確!」",
 "points": [ {"label":"完整度|助詞|動詞|語順|用詞|自然度 擇一","ok":true/false,"note":"具體、簡短、初學者聽得懂"} ] (2~4個),
 "corrected": "正確且自然的日文;若學生念對就回目標句本身",
 "reading": "corrected 的整句假名讀音",
 "tip": "一句初學者能馬上照做的口說小建議(繁中)",
 "encourage": "一句鼓勵的話(繁中、口語、像真人教練)"
}`;

export const speakFeedback = functions.onRequest(
  { cors: true, region: "asia-east1", secrets: [ANTHROPIC_API_KEY] },
  async (req, res) => {
    try {
      const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      const decoded = await admin.auth().verifyIdToken(idToken);
      if (!ADMIN_EMAILS.includes((decoded.email || "").toLowerCase())) {
        res.status(403).json({ error: "測試版限 admin 帳號" }); return;
      }
      const { target, said } = (req.body || {}) as { target?: { jp?: string; kana?: string }; said?: string };
      if (!target || !target.jp || !said) { res.status(400).json({ error: "缺 target.jp / said" }); return; }

      const body = {
        model: MODEL, max_tokens: 800, system: SYSTEM,
        messages: [{
          role: "user",
          content: `目標句(漢字):「${target.jp}」\n目標句(假名):「${target.kana || ""}」\n學生念的:「${said}」\n請只回 JSON。`,
        }],
      };
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": ANTHROPIC_API_KEY.value(), "anthropic-version": "2023-06-01" },
        body: JSON.stringify(body),
      });
      if (!r.ok) { res.status(502).json({ error: "Anthropic " + r.status }); return; }
      const j: any = await r.json();
      const text = (j.content || []).map((b: any) => b.text || "").join("").trim();
      const m = text.match(/\{[\s\S]*\}/);
      if (!m) { res.status(502).json({ error: "AI 沒回 JSON" }); return; }
      res.json(JSON.parse(m[0]));
    } catch (e: any) {
      res.status(500).json({ error: String((e && e.message) || e) });
    }
  },
);
