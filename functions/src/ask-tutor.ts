// 小狸助教(askTutor):文法/單字/句子的 AI 問答。
// 入口:app.html 右下角浮動小狸(帶目前翻開的文法卡當 context)、文章閱讀每句的「狸」鈕(整句拆解)。
// 額度:ai-quota kind 'ask'(免費每日 2、Premium 每日 30;config/ai 可調)。admin 不計量。
// 模型:config/ai.tutorModel(預設 claude-sonnet-5,文法解釋要準)。成本走 trackAiCost 記帳。
import * as functions from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import * as admin from "firebase-admin";
import { getAiConfig, consumeQuota, recordAiUse, trackAiCost } from "./ai-quota";

const ANTHROPIC_API_KEY = defineSecret("ANTHROPIC_API_KEY");
const ADMIN_EMAILS = ["stayjpplan@gmail.com", "abc83327@gmail.com"];

function langName(lang?: string): string {
  if (lang === "zh-CN") return "簡體中文";
  if (lang === "en") return "English";
  return "繁體中文(台灣用語)";
}

function systemPrompt(lang: string | undefined, mode: string, ctx: { type?: string; title?: string; body?: string; level?: string }): string {
  const L = langName(lang);
  const lv = ctx.level ? ctx.level.toUpperCase() : "";
  let s = `你是「小狸」,StayJP(在日台灣人的日語學習 App)的日語助教。個性:親切、講重點、像會教書的學長姐,不裝可愛不囉嗦。
回答語言:${L}。日文原文照日文寫,不要翻成中文漢字混寫。
規則:
1. 只回答日語學習相關問題(文法、單字、讀音、用法差異、句子拆解、JLPT 考點、日本生活用語)。無關的問題用一句話婉拒並拉回日語。
2. 精簡:一般問題 150~300 字內講完,先講結論再講理由;不要開場白、不要「好問題!」這類客套。
3. 日文例句每句「獨立一行」,以「例:」開頭,例句後面用「→」接翻譯(同一行)。例句不要自己標假名(前端會自動標讀音)。
4. 可用的格式只有:**粗體**、「- 」開頭的條列、「【小標】」分段、以及「詞｜讀音｜詞性｜說明」這種用全形「｜」分欄的表格行。不要用其他 Markdown(不要 #、不要 \`\`\`、不要表格框線)。
5. 學習者程度${lv ? `約 ${lv}` : "不確定(預設 N4 左右)"}:解釋用詞跟例句難度配合程度,N5/N4 不要丟太難的漢字例句。
6. 不確定就說不確定,不要編造用法;敬語/口語差異、男女用語差異要點出來。`;
  if (mode === "parse") {
    s += `

現在的任務是「整句拆解」。使用者會給一句日文(可能是自己寫的、可能有錯)。請嚴格照以下結構輸出:
【拆解】
每個詞一行,格式「詞｜讀音(平假名)｜詞性｜說明」;助詞、助動詞、活用形都要拆出來並說明功能(例:「て形+いる」進行/狀態)。
【文法重點】
- 2~4 點:這句用到的關鍵文法、助詞為何是這個不是別的。
【整句意思】
一行自然的${L}翻譯。
【小狸提醒】
- 若句子有錯或不自然:指出並給修正句(修正句以「例:」開頭)。若沒錯:給 1 句同結構的替換例句(以「例:」開頭)。`;
  }
  if (ctx && (ctx.title || ctx.body)) {
    const kind = ctx.type === "grammar" ? "文法點" : ctx.type === "vocab" ? "單字" : ctx.type === "article" ? "文章" : ctx.type === "sentence" ? "句子" : "內容";
    s += `

使用者目前正在看的${kind}(當作提問的預設 context;使用者說「這個」「這句」就是指它):
標題:${(ctx.title || "").slice(0, 200)}
內容:${(ctx.body || "").slice(0, 1800)}`;
  }
  return s;
}

export const askTutor = functions.onRequest(
  { cors: true, region: "asia-east1", secrets: [ANTHROPIC_API_KEY], timeoutSeconds: 60, memory: "256MiB" },
  async (req, res) => {
    try {
      if (req.method !== "POST") { res.status(405).json({ error: "method_not_allowed" }); return; }
      const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      let decoded: admin.auth.DecodedIdToken;
      try { decoded = await admin.auth().verifyIdToken(idToken); }
      catch { res.status(401).json({ error: "auth", message: "請重新登入" }); return; }
      const isAdmin = ADMIN_EMAILS.includes((decoded.email || "").toLowerCase()) && decoded.email_verified === true;
      const cfg = await getAiConfig();
      if (!isAdmin && !cfg.public) { res.status(403).json({ error: "測試版限 admin 帳號" }); return; }

      const body = (req.body || {}) as {
        q?: string; mode?: string; lang?: string;
        ctx?: { type?: string; title?: string; body?: string; level?: string };
        history?: Array<{ role?: string; text?: string }>;
      };
      const q = String(body.q || "").trim().slice(0, 600);
      if (!q) { res.status(400).json({ error: "empty" }); return; }
      const mode = body.mode === "parse" ? "parse" : "ask";
      const ctx = body.ctx || {};
      // 歷史只留最近 6 則(3 輪),input 不隨對話無限長
      const hist = (Array.isArray(body.history) ? body.history : [])
        .filter(h => h && h.text && (h.role === "me" || h.role === "ai"))
        .slice(-6)
        .map(h => ({ role: h.role === "me" ? "user" : "assistant", content: String(h.text).slice(0, 1500) }));

      // 額度:admin 只記錄不擋
      if (isAdmin) { void recordAiUse(decoded.uid, "ask"); }
      else {
        const blocked = await consumeQuota(decoded.uid, "ask", cfg);
        if (blocked) { res.status(429).json({ error: "quota", message: blocked }); return; }
      }

      const model = (cfg as any).tutorModel || "claude-sonnet-5";
      const messages = [...hist, { role: "user", content: mode === "parse" ? `請拆解這句:${q}` : q }];
      const up = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": ANTHROPIC_API_KEY.value(), "anthropic-version": "2023-06-01" },
        signal: (AbortSignal as any).timeout ? (AbortSignal as any).timeout(45000) : undefined,
        body: JSON.stringify({ model, max_tokens: 900, system: systemPrompt(body.lang, mode, ctx), messages }),
      });
      if (!up.ok) {
        const t = await up.text().catch(() => "");
        console.error("askTutor upstream", up.status, t.slice(0, 300));
        res.status(502).json({ error: "upstream", message: "小狸暫時連不上,等一下再試" }); return;
      }
      const d: any = await up.json();
      if (d.usage) void trackAiCost(model, { in: d.usage.input_tokens || 0, out: d.usage.output_tokens || 0 });
      const text = (d.content || []).filter((c: any) => c.type === "text").map((c: any) => c.text).join("\n").trim();

      // 回今天剩餘次數(顯示用;讀失敗就不給)
      let remain: number | null = null;
      try {
        const u: any = (await admin.firestore().doc("ai_usage/" + decoded.uid).get()).data() || {};
        const today = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
        const n = (u.askDay && u.askDay.d === today) ? u.askDay.n : 0;
        const [userSnap, freeSnap] = await Promise.all([
          admin.firestore().doc("users/" + decoded.uid).get(), admin.firestore().doc("free_users/" + decoded.uid).get()]);
        const sub = (userSnap.data() || {}).subscription;
        const prem = freeSnap.exists || (sub && ["active", "trialing", "cancelled"].includes(sub.status) && (sub.expiresAt || 0) > Date.now());
        remain = Math.max(0, (prem ? cfg.premAskDaily : cfg.freeAskDaily) - n) + Number(u.bonusAsk || 0);
        if (isAdmin) remain = 999;
      } catch { /* 顯示用 */ }
      res.json({ text, remain, model });
    } catch (e: any) {
      console.error("askTutor", e && e.message);
      res.status(500).json({ error: "server", message: "小狸出了點狀況,等一下再試" });
    }
  });
