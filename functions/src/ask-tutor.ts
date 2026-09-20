// 小狸助教(askTutor):文法/單字/句子的 AI 問答 + 我的單字本(查詞/出題/批改)。
// 入口:app.html 右下角浮動小狸(帶目前翻開的文法卡當 context)、文章閱讀每句的「狸」鈕(整句拆解)。
// 額度:ai-quota kind 'ask'(免費每日 2、Premium 每日 30;config/ai 可調)。admin 不計量。
// 模型:config/ai.tutorModel(預設 claude-sonnet-5,文法解釋要準)。成本走 trackAiCost 記帳。
//
// mode:
//   ask   自由問答(預設)          parse 整句拆解
//   word  查一個字/片語 → 回字典 JSON(存進「我的單字本」;my-vocab.js)
//   quiz  給目標詞 → 回造句情境 JSON(一次出一整輪,省額度)
//   grade 批改使用者造的句子 → 回 JSON(有沒有真的用到目標詞、對不對、修正句)
// word/quiz/grade 一律回 JSON,前端拿 d.data。
// ⚠️ assistant prefill "{" 只有 Haiku 吃得下:Sonnet 會回 400
//    "This model does not support assistant message prefill"(2026-09-20 實測踩到)→ 依模型決定要不要 prefill。
// 用 Haiku 出題/查詞(便宜),批改用 tutorModel(要準)。三者都吃 kind 'ask' 額度各 1 次。
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

// ── 我的單字本:三個 JSON 模式 ──────────────────────────────
// 為什麼不用 output_config/tool 強制 schema:這支 function 直接打 REST(anthropic-version 2023-06-01),
// 用 assistant prefill "{" 是這版最穩的作法,回來自己補回開頭的大括號再 parse。
const JSON_MODES = ["word", "quiz", "grade"];

function wordSystem(lang: string | undefined, lv: string): string {
  const L = langName(lang);
  return `你是日語字典。使用者會給一個日文單字、片語、慣用句,或是一個${L}說法想知道日文怎麼講。
只輸出一個 JSON 物件,不要任何說明文字、不要 markdown 圍欄。

查得到:
{"ok":true,"w":"日文(漢字優先,動詞給辭書形,片語照原樣)","r":"平假名讀音(全平假名,不含漢字)","m":"${L}意思,40字內,多個意思用;分隔","c":"詞性,只能是 名/動/形/副/慣用句/表現 其中一個","lv":"n5或n4或n3或n2或n1","note":"用法提醒、常見誤用或語感差異,60字內,沒特別要提就空字串","ex":[{"j":"例句1","z":"${L}翻譯"},{"j":"例句2","z":"${L}翻譯"}]}

不是日語相關、或看不懂使用者要查什麼:
{"ok":false,"msg":"一句${L}說明,告訴使用者可以怎麼輸入"}

規則:
- 例句要短(20字內)、日常真的會用到,並且確實用上這個詞的典型用法。
- 例句不要標假名(前端會自動標)。
- 使用者程度約 ${lv || "N4"},例句用詞別超出太多。
- 敬體/常體選這個詞最自然的那個;敬語、口語、男女用語差異寫進 note。
- 不確定就據實在 note 說明,不要編造不存在的用法。`;
}

function quizSystem(lang: string | undefined, lv: string): string {
  const L = langName(lang);
  return `你是日語老師小狸,要幫學生練習他自己存下來的單字/片語。
針對每個詞,出一個「情境」,讓學生用那個詞造一句日文。
只輸出一個 JSON 物件,不要說明文字、不要 markdown 圍棧。

{"items":[{"w":"目標詞(原樣抄回,不要改)","scene":"${L}寫的情境,一句話,25字內,具體到學生知道要講什麼","hint":"提示:這個詞前後常接什麼(助詞、接續),20字內"}]}

規則:
- 情境要具體(對誰說、什麼場合),不要「請用XX造句」這種空話。
- 情境本身用${L}寫,不要先把日文答案講出來。
- 學生程度約 ${lv || "N4"}。
- items 的順序和數量要跟使用者給的詞完全一致。`;
}

function gradeSystem(lang: string | undefined, lv: string): string {
  const L = langName(lang);
  return `你是日語老師小狸,要批改學生用指定單字/片語造的句子。
只輸出一個 JSON 物件,不要說明文字、不要 markdown 圍欄。

{"items":[{"w":"目標詞(原樣抄回)","used":true,"correct":true,"fix":"修正後的自然日文;完全正確就抄回學生原句","why":"${L}講評,40字內,講重點:哪裡錯、為什麼、或為什麼這樣寫很好","score":0}]}

判斷規則:
- used:學生這句有沒有真的用到目標詞(活用變化、敬體常體、送假名不同都算有用到;換成同義的別的詞不算)。
- correct:文法、助詞、用詞自然度都沒問題才算 true;只要需要修正就 false。
- score:0~2 的整數。2=正確又自然,1=意思到了但有小問題,0=沒用到目標詞或整句不通。
- 空白、亂打、跟情境完全無關的句子:used/correct 都 false,score 0,why 直接說看不出來想表達什麼。
- 講評要具體(指出是哪個助詞/哪個活用),不要只說「很好」。學生程度約 ${lv || "N4"}。
- items 的順序和數量要跟使用者給的題目完全一致。`;
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
        items?: Array<{ w?: string; scene?: string; answer?: string }>;
      };
      const rawMode = String(body.mode || "ask");
      const mode = (rawMode === "parse" || JSON_MODES.includes(rawMode)) ? rawMode : "ask";
      const isJson = JSON_MODES.includes(mode);
      // JSON 模式的題目由 items 帶(q 可空);一般問答還是看 q
      const q = String(body.q || "").trim().slice(0, isJson ? 200 : 600);
      const items = (Array.isArray(body.items) ? body.items : [])
        .filter(x => x && x.w)
        .slice(0, 8)
        .map(x => ({
          w: String(x.w).slice(0, 40),
          scene: String(x.scene || "").slice(0, 120),
          answer: String(x.answer || "").slice(0, 200),
        }));
      if (mode === "word" && !q) { res.status(400).json({ error: "empty" }); return; }
      if ((mode === "quiz" || mode === "grade") && !items.length) { res.status(400).json({ error: "empty" }); return; }
      if (!isJson && !q) { res.status(400).json({ error: "empty" }); return; }
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

      // 查詞/出題便宜(Haiku 夠用),批改要準(跟問答同一顆 tutorModel)
      const cheap = (cfg as any).wordModel || "claude-haiku-4-5-20251001";
      const model = (mode === "word" || mode === "quiz") ? cheap : ((cfg as any).tutorModel || "claude-sonnet-5");
      const lvUp = ctx.level ? String(ctx.level).toUpperCase() : "";
      const canPrefill = /haiku/i.test(model);   // Sonnet 不支援 assistant prefill
      const pre = canPrefill ? [{ role: "assistant", content: "{" }] : [];
      let system: string, messages: Array<{ role: string; content: string }>, maxTokens = 900;
      if (mode === "word") {
        system = wordSystem(body.lang, lvUp);
        messages = [{ role: "user", content: `要查的:${q}` }, ...pre];
        maxTokens = 700;
      } else if (mode === "quiz") {
        system = quizSystem(body.lang, lvUp);
        messages = [{ role: "user", content: "這些是學生要練的詞:\n" + items.map((x, i) => `${i + 1}. ${x.w}`).join("\n") }, ...pre];
        maxTokens = 200 + items.length * 120;
      } else if (mode === "grade") {
        system = gradeSystem(body.lang, lvUp);
        messages = [{
          role: "user",
          content: items.map((x, i) => `${i + 1}. 目標詞:${x.w}\n   情境:${x.scene || "(自由造句)"}\n   學生寫:${x.answer || "(空白)"}`).join("\n")
            + "\n\n請直接輸出 JSON 物件,第一個字元就是 {,不要任何前言或 markdown 圍欄。",
        }, ...pre];
        maxTokens = 400 + items.length * 300;   // 講評是中文,抓寬一點;截斷會直接 JSON parse 失敗(2026-09-20 踩過)
      } else {
        system = systemPrompt(body.lang, mode, ctx);
        messages = [...hist, { role: "user", content: mode === "parse" ? `請拆解這句:${q}` : q }];
      }
      const up = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": ANTHROPIC_API_KEY.value(), "anthropic-version": "2023-06-01" },
        signal: (AbortSignal as any).timeout ? (AbortSignal as any).timeout(45000) : undefined,
        body: JSON.stringify({ model, max_tokens: maxTokens, system, messages }),
      });
      if (!up.ok) {
        const t = await up.text().catch(() => "");
        console.error("askTutor upstream", up.status, t.slice(0, 300));
        res.status(502).json({ error: "upstream", message: "小狸暫時連不上,等一下再試" }); return;
      }
      const d: any = await up.json();
      if (d.usage) void trackAiCost(model, { in: d.usage.input_tokens || 0, out: d.usage.output_tokens || 0 });
      let text = (d.content || []).filter((c: any) => c.type === "text").map((c: any) => c.text).join("\n").trim();
      // JSON 模式:prefill 吃掉了開頭的 "{",補回來再 parse(模型偶爾還是會加圍欄 → 取第一個 { 到最後一個 })
      let data: any = null;
      if (isJson) {
        let raw = text.trim();
        if (canPrefill && !raw.startsWith("{")) raw = "{" + raw;   // prefill 吃掉的開頭大括號補回來
        const a = raw.indexOf("{"), b = raw.lastIndexOf("}");
        const cut = (a >= 0 && b > a) ? raw.slice(a, b + 1) : raw;   // 模型加了圍欄/前言也切得出來
        try { data = JSON.parse(cut); } catch {
          console.error("askTutor json parse", mode, "stop=" + d.stop_reason, JSON.stringify(raw.slice(-160)));
          res.status(502).json({ error: "parse", message: "小狸這次回得怪怪的,再試一次" }); return;
        }
        text = "";
      }

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
      res.json(isJson ? { data, remain, model } : { text, remain, model });
    } catch (e: any) {
      console.error("askTutor", e && e.message);
      res.status(500).json({ error: "server", message: "小狸出了點狀況,等一下再試" });
    }
  });
