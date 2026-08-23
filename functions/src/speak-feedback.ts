// AI 口說回饋(測試版):收「目標句 + 學生念的(辨識結果)」→ streaming 回傳教練回饋。
// 為什麼 streaming:非串流要等整包 JSON 生完才回,使用者盯著空白等很久。改成邊生邊吐,
// 分數(第一行)幾百毫秒就出現,後面逐點長出來,體感快非常多。
// 輸出改「逐行輕結構」(非 JSON),串流時好逐段解析、也不怕被截斷。
// Claude key 只在後端(functions secret ANTHROPIC_API_KEY),絕不進前端。
// ⚠️ 測試版:限 admin 呼叫 → 真實用戶打不到、不產生成本、不曝光。之後上線再改成 premium/quota 檢查。
import * as functions from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import * as admin from "firebase-admin";
import { getAiConfig, consumeQuota, recordAiUse } from "./ai-quota";

if (admin.apps.length === 0) admin.initializeApp();

const ANTHROPIC_API_KEY = defineSecret("ANTHROPIC_API_KEY");
const ADMIN_EMAILS = ["stayjpplan@gmail.com", "abc83327@gmail.com"];
const MODEL = "claude-haiku-4-5-20251001";   // 便宜快,對「比對兩句+中文回饋」夠用

// 使用者介面語言 → 回饋語言(繁中預設;簡中/英文跟著 UI)
function langName(lang?: string): string {
  if (lang === "zh-CN") return "簡體中文";
  if (lang === "en") return "English";
  return "繁體中文";
}

function buildSystem(lang?: string): string {
  const L = langName(lang);
  return `你是 StayJP 的日語口說練習教練,學生是日語學習者。
學生會「跟著念」一個目標句;系統把他念的內容(來自語音辨識)給你。
請比較「目標句」與「學生念的」,用「${L}」給溫暖、具體、學得到東西的回饋。`+`

【最重要:別判錯】學生念的是「語音辨識結果」,寫法可能跟目標句不同,但**只要讀音一樣就是念對了,絕不能算錯**:
- 漢字↔假名不同不算錯:例如「起きます」和「おきます」是同一個音;「七時」和「7時」是同一個音(しちじ)。
- 判斷前,先在心裡把「目標句」和「學生念的」都轉成「假名讀音」再逐音比對。
- **除非某個音真的沒出現在讀音裡,否則不可以說「少了/漏了某字或某助詞」。** 例如學生念「7時におきます」就是有念「に」,不可說少了「に」。
評分重點(只看讀音):助詞(は/が/を/に…)有沒有念錯、動詞變化、語順、有沒有真的漏念或多念。發音細節不確定就別亂講。多鼓勵,別打擊,但該糾正的要講清楚、講到位(別只說「很好」而空洞)。

【輸出格式】嚴格照下面「逐行」輸出,一行一個欄位,不要 JSON、不要任何多餘文字或開場白。能先算出的先輸出(SCORE 第一行):
SCORE: 0~100 的整數
VERDICT: 一句話總評,用${L}(念對就像「念得很好!」;要修就點出方向)
DIFF: 最關鍵的一個差異,用${L};完全正確就寫「完全正確!」
POINT: <✅或⚠️>|<類別:助詞/動詞/語順/完整度/用詞/自然度 擇一>|<具體、簡短、學得到的${L}說明>
POINT: (POINT 這行重複 2~4 次,每次一個重點;至少一個正向、把做對的地方也講出來)
CORRECTED: 正確且自然的日文(學生念對就回目標句本身)
READING: CORRECTED 的整句假名讀音
TIP: 一句馬上能照做的口說小建議(用${L},要具體,例如某個音怎麼發、語調往哪走)
ENCOURAGE: 一句像真人教練的鼓勵(用${L}、口語)`;
}

export const speakFeedback = functions.onRequest(
  { cors: true, region: "asia-east1", secrets: [ANTHROPIC_API_KEY] },
  async (req, res) => {
    try {
      if (req.method !== "POST") { res.status(405).json({ error: "method_not_allowed" }); return; }   // 爬蟲 GET 戳門 → 405,不進錯誤日誌
      const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      const decoded = await admin.auth().verifyIdToken(idToken);
      const isAdmin = ADMIN_EMAILS.includes((decoded.email || "").toLowerCase());
      const cfg = await getAiConfig();
      if (!isAdmin && !cfg.public) {
        res.status(403).json({ error: "測試版限 admin 帳號" }); return;
      }
      if (!isAdmin) {
        const blocked = await consumeQuota(decoded.uid, "eval", cfg);
        if (blocked) { res.status(402).json({ error: "quota", message: blocked }); return; }
      } else {
        void recordAiUse(decoded.uid, "eval");
      }
      const { target, said, lang } = (req.body || {}) as { target?: { jp?: string; kana?: string }; said?: string; lang?: string };
      if (!target || !target.jp || !said) { res.status(400).json({ error: "缺 target.jp / said" }); return; }

      const body = {
        model: MODEL,
        max_tokens: 700,
        stream: true,
        // system 用陣列 + cache_control:這段長 prompt 每次都一樣 → 快取起來省 input 成本/延遲。
        system: [{ type: "text", text: buildSystem(lang), cache_control: { type: "ephemeral" } }],
        messages: [{
          role: "user",
          content: `目標句(漢字):「${target.jp}」\n目標句(假名):「${target.kana || ""}」\n學生念的:「${said}」\n請只依格式逐行輸出。`,
        }],
      };
      const upstream = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY.value(),
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(body),
      });
      if (!upstream.ok || !upstream.body) {
        const errTxt = await upstream.text().catch(() => "");
        res.status(502).json({ error: "Anthropic " + upstream.status, detail: errTxt.slice(0, 200) });
        return;
      }

      // 純文字串流回前端:逐段吐出 AI 的 text_delta,前端邊收邊解析渲染。
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache, no-transform");
      res.flushHeaders?.();

      const reader = (upstream.body as any).getReader();
      const dec = new TextDecoder();
      let buf = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) >= 0) {
          const line = buf.slice(0, nl).trim();
          buf = buf.slice(nl + 1);
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (!data || data === "[DONE]") continue;
          try {
            const ev = JSON.parse(data);
            if (ev.type === "content_block_delta" && ev.delta?.type === "text_delta") {
              res.write(ev.delta.text);
            }
          } catch { /* 半行/非 JSON 事件,略過 */ }
        }
      }
      res.end();
    } catch (e: any) {
      if (!res.headersSent) res.status(500).json({ error: String((e && e.message) || e) });
      else { try { res.end(); } catch { /* noop */ } }
    }
  },
);
