// AI 情境對話(測試版):學生選一個情境,AI 扮演對方角色,多輪自然對話。
// - chat 模式:依對話歷史,生成 AI 角色的下一句(日文 + 假名 + 中文 + 對學生上一句的即時提點)。
// - review 模式:對整段對話給整體點評。
// 兩者都 streaming(邊生邊吐,體感快)。Claude key 只在後端。
// ⚠️ 測試版:限 admin 呼叫。
import * as functions from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import * as admin from "firebase-admin";
import { getAiConfig, consumeQuota, recordAiUse, trackAiCost } from "./ai-quota";

if (admin.apps.length === 0) admin.initializeApp();

const ANTHROPIC_API_KEY = defineSecret("ANTHROPIC_API_KEY");
const ADMIN_EMAILS = ["stayjpplan@gmail.com", "abc83327@gmail.com"];
const MODEL = "claude-haiku-4-5-20251001";

const LEVEL_DESC: Record<string, string> = {
  N5: "N5 入門:用最基本、最短的日語(丁寧體 です/ます),句子簡單,必要時放慢。",
  N4: "N4 基礎:日常會話程度,句子完整但不複雜。",
  N3: "N3 中級:一般日常與生活場景,語速與用詞接近自然。",
  N2: "N2 中上級:較正式、自然的日語,可用一些慣用說法。",
  N1: "N1 高階:自然流利,含敬語與較正式的表達。",
};

// 使用者介面語言 → 給模型的譯文/提點語言指示(繁中預設;簡中/英文跟著 UI)
function langName(lang?: string): string {
  if (lang === "zh-CN") return "簡體中文";
  if (lang === "en") return "English";
  return "繁體中文";
}

function chatSystem(sceneDesc: string, level: string, lang?: string, userRole?: string): string {
  const L = langName(lang);
  const UR = userRole || "與你互動的另一方";
  return `你是 StayJP 的日語「情境對話」練習夥伴,陪日語學習者練口說。使用者的介面語言是「${L}」——下面所有「${L}」欄位務必用該語言書寫。
【你的角色與場景】${sceneDesc}
【對方(使用者)的角色】${UR}。整場對話中,使用者永遠是「${UR}」,你永遠是場景設定裡的那個角色,雙方角色絕不互換。
【對話難度】${LEVEL_DESC[level] || LEVEL_DESC.N4}
【怎麼對話】
- 完全進入角色,用符合這個場景的自然日語,不要像教科書、不要老師腔。
- 一次只講一兩句,並且把球拋回給對方(問一個問題、給選擇、或推進情境),讓對話能一直接下去。
- 難度貼合上面的等級:N5 就短而簡單,N1 就自然流利含敬語。
- 你的回覆必須直接回應「使用者的最後一句話」:他回答了你的問題,就接著他的回答往下走,**絕對不要把同一個問題再問一次**;動筆前先確認你要講的內容跟他最後一句接得起來。
- 先想清楚對方那句話的「主語和對象」再回:學習者的句子常省略主語或問得不精準(例:他問「エアコンはありませんか」很可能是在問「你/你家」有沒有冷氣,不是說他自己沒有)。依情境推斷最合理的意思來接;真的模糊就在戲中自然地反問確認(「うちのエアコンのことですか?」),絕對不要把對方的提問誤當成他的自述。
- 對方是學習者,若他上一句日語有明顯錯誤(助詞、動詞變化、用詞、不自然),在 COACH 用一句${L}溫和點出更好的說法;講得好就用 COACH 給一句具體鼓勵。
- 對話自然走到尾聲時,可以帶到道別收尾。
- 重要:對方常常「不知道要講什麼」。每一輪都要給 2~3 個 HINT。HINT 的鐵則:
  ①視角:HINT 是「${UR}」要說的台詞,**絕對不能是你自己角色會講的話**。每個 HINT 的開頭必須先一字不差寫上「${UR}»」再接台詞——寫這個標記的同時自問:「這句話真的是${UR}會說的嗎?」不是就整句換掉。例:場景是便利商店、你是店員、對方是顧客時——「温めますか?」是店員的話=不合格;「はい、お願いします」是顧客的話=合格。
  ②服務方句型警戒:「〜をお持ちします」「〜はいかがですか」「〜ましょうか?」這類**提供服務、詢問對方需求**的句子,幾乎都是店員/服務方的台詞。若「${UR}」是顧客、客人、乘客、患者這類「被服務的一方」,這些句型一律不合格——顧客說的是「〜をください」「〜はありますか」「お願いします」這種**提出需求**的話。
  ③關聯:每個 HINT 必須**直接回應你剛剛輸出的那句 JP**——你問了問題就給「回答那個問題」的選項;你陳述了事情就給「接著那件事」的回應。跟上一句無關的 HINT 一律不合格。
  ④多樣:2~3 個彼此方向不同(肯定/否定/追問),難度符合等級,能把對話往前推。
【輸出格式】嚴格逐行輸出,一行一個欄位,不要 JSON、不要多餘文字或旁白。對話歷史裡你先前的回覆只保留了台詞本身,但你每一輪「真正的輸出」永遠必須是下面完整的多行格式(從 JP 行開始),絕對不能只輸出台詞、也絕不能省略 JP 行。JP/KANA/ZH 各恰好一行、缺一不可;每個欄位只輸出一次,想好再寫、絕對不要輸出到一半重來或補第二行 JP:
JP: <你這個角色要講的日文(只有台詞本身)>
KANA: <JP 的整句假名讀音>
ZH: <JP 的${L}翻譯>
WORDS: <JP 裡的關鍵單字 2~4 個,格式:単語|よみ|${L}意思,單字之間用半形分號;隔開、三個欄位內文不可再出現分號。例:お弁当|おべんとう|便當;温める|あたためる|加熱……讀音絕對不能錯;句子太簡單就整行省略>
COACH: <對對方「上一句」的簡短${L}提點或鼓勵。開場或沒必要時,整行直接不要輸出——絕對不要寫 <blank>、空白、無、なし 這類佔位字>
HINT: ${UR}»<對方可以這樣回你的日文>｜<這句的${L}意思>
HINT: ${UR}»<另一個不同方向的回法>｜<${L}意思>
HINT: ${UR}»<再一個(可選)>｜<${L}意思>`;
}

function reviewSystem(lang?: string): string {
  const L = langName(lang);
  return `你是 StayJP 的日語口說教練。下面是一段學生和 AI 的情境對話(JP 標學生說的、AI 標對方角色)。
針對「學生」的表現給溫暖但具體的整體點評。
【語言規定・最重要】GOOD/IMPROVE/TIP/ENCOURAGE 的說明文字**一律用${L}**書寫——即使對話內容是日文、需要舉例時,可以用「」引用日文詞句,但你的評語、說明、建議本身**絕對不能整句用日文**,必須是${L}。
嚴格逐行輸出:
SCORE: 0~100 整數(這次對話的口說綜合表現)
GOOD: 一句${L},講得好的地方(具體;要引用日文可加「」)
IMPROVE: 一句${L},最該加強的地方(助詞/動詞變化/用詞/自然度,具體、學得到)
TIP: 一句${L},下次馬上能用的小建議
ENCOURAGE: 一句${L},像真人教練的鼓勵`;
}

// hintGuard:HINT 提示句的「生成後審核」。便宜模型偶爾把對方角色的台詞當提示(店員台詞給顧客)——
// prompt 層面已盡力(角色標記+服務方句型規則),這裡是最後一道硬防線:
// 串流照常轉發正文(JP/KANA/ZH/COACH,不增加首句延遲),但 HINT 區塊先攔下,
// 用一個超小的審核呼叫逐條判「是不是使用者角色會說的+接不接得上這輪的 JP」,NG 的丟掉;全滅就重寫兩條。成本 ~$0.0005/輪。
type HintGuard = { apiKey: string; scene: string; ur: string; langLabel: string };

function stripTag(h: string, ur: string): string {
  return h.replace(new RegExp("^\\s*" + ur.replace(/[.*+?^$()\[\]{}|\\]/g, "\\$&") + "\\s*»\\s*"), "").trim();
}

async function guardHints(rawHints: string[], jp: string, g: HintGuard): Promise<string[]> {
  const list = rawHints.map(h => stripTag(h, g.ur)).filter(Boolean).slice(0, 4);
  if (!list.length || !g.ur) return rawHints;
  try {
    const sys = `場景:${g.scene}\n對話裡,「${g.ur}」是使用者(學習者)的角色;另一方(AI 扮演的角色)剛說了:「${jp}」。\n下面每行是一句要給使用者的「回話建議」(格式:日文｜意思)。逐行判斷兩件事:\n(1)這句台詞是「${g.ur}」這個角色會說的話(絕不能是對方角色的台詞——例如使用者是顧客時,「お持ちします」「〜はいかがですか」這種服務方句子就是 NG);\n(2)作為對「${jp}」的回應是自然通順的。\n兩者都成立輸出 OK,否則輸出 NG。一行對應一行、只輸出 OK 或 NG,不要任何其他文字。`;
    const up = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": g.apiKey, "anthropic-version": "2023-06-01" },
      signal: (AbortSignal as any).timeout ? (AbortSignal as any).timeout(20000) : undefined,
      body: JSON.stringify({ model: MODEL, max_tokens: 60, system: sys,
        messages: [{ role: "user", content: list.map((h, i) => `${i + 1}. ${h}`).join("\n") }] }),
    });
    if (!up.ok) return rawHints;                                   // 審核掛了 → 放行原提示(fail-open)
    const d: any = await up.json();
    if (d.usage) void trackAiCost(MODEL, { in: d.usage.input_tokens || 0, out: d.usage.output_tokens || 0 });
    const verdicts = String(d.content?.[0]?.text || "").split("\n").map(x => x.trim().toUpperCase());
    let kept = list.filter((_, i) => verdicts[i] !== "NG");        // 只有明確 NG 才丟
    if (!kept.length) {
      // 全滅 → 用審核模型重寫兩條(比沒有提示好)
      const rw = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": g.apiKey, "anthropic-version": "2023-06-01" },
        signal: (AbortSignal as any).timeout ? (AbortSignal as any).timeout(20000) : undefined,
        body: JSON.stringify({ model: MODEL, max_tokens: 200,
          system: `場景:${g.scene}。使用者的角色:${g.ur}。對方(AI 角色)剛說:「${jp}」。\n請給 2 條「${g.ur}」可以怎麼回的建議。一行一條,格式:<日文>｜<這句的${g.langLabel}意思>。只輸出這兩行,不要編號或其他文字。`,
          messages: [{ role: "user", content: "請輸出建議。" }] }),
      });
      if (rw.ok) {
        const rd: any = await rw.json();
        if (rd.usage) void trackAiCost(MODEL, { in: rd.usage.input_tokens || 0, out: rd.usage.output_tokens || 0 });
        kept = String(rd.content?.[0]?.text || "").split("\n").map(x => x.trim()).filter(x => x.includes("｜")).slice(0, 2);
      }
    }
    return kept.map(h => g.ur + "»" + h);
  } catch { return rawHints; }
}

// 裸回修補:模型偶爾丟光格式只回一句台詞(診斷日誌實錘)。台詞本身已串流給前端(客戶端會救援顯示),
// 這裡把缺的 KANA/ZH/WORDS/HINT 用 Haiku 當場補生,前端照常解析——使用者看到的只是「翻譯提示晚半秒出現」。
async function repairBare(bare: string, g: HintGuard): Promise<string> {
  try {
    const up = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": g.apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: MODEL, max_tokens: 300,
        system: `你會拿到一句日語台詞(場景:${g.scene};說話者=AI 扮演的角色;聽者=使用者,角色是「${g.ur}」)。只輸出下列幾行、格式嚴格、不要其他文字:\nKANA: <整句假名讀音>\nZH: <這句的${g.langLabel}翻譯>\nWORDS: <句中關鍵單字1~3個,格式 単語|よみ|${g.langLabel}意思,用;隔開;句子太簡單就省略此行>\nHINT: ${g.ur}»<「${g.ur}」可以怎麼回的日文>｜<${g.langLabel}意思>\nHINT: ${g.ur}»<另一個不同方向的回法>｜<${g.langLabel}意思>`,
        messages: [{ role: "user", content: bare }] }),
    });
    if (!up.ok) return "";
    const d: any = await up.json();
    if (d.usage) void trackAiCost(MODEL, { in: d.usage.input_tokens || 0, out: d.usage.output_tokens || 0 });
    return String(d.content?.[0]?.text || "").split("\n")
      .filter(l => /^(KANA|ZH|WORDS|HINT)[::]/.test(l.trim())).join("\n");
  } catch { return ""; }
}

async function streamAnthropic(res: any, apiKey: string, system: any, messages: any[], model?: string, hintGuard?: HintGuard) {
  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: model || MODEL, max_tokens: 800, stream: true, system, messages }),
  });
  if (!upstream.ok || !upstream.body) {
    const errTxt = await upstream.text().catch(() => "");
    res.status(502).json({ error: "Anthropic " + upstream.status, detail: errTxt.slice(0, 200) });
    return;
  }
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.flushHeaders?.();
  const reader = (upstream.body as any).getReader();
  const dec = new TextDecoder();
  let buf = "";
  let full = "";                 // 模型輸出全文
  let sent = 0;                  // 已轉發到的位置(hintGuard 模式用)
  const usage = { in: 0, out: 0, cacheRead: 0, cacheWrite: 0 };   // 成本記帳用
  const HOLD = 8;                // 尾端保留字數,避免 "\nHINT:" 被 chunk 切一半漏攔
  const forward = () => {        // 轉發到「第一個 HINT 行」之前為止;HINT 之後全部攔下
    if (!hintGuard) return;
    const m = full.search(/(?:^|\n)HINT:/);
    const limit = m === -1 ? Math.max(sent, full.length - HOLD) : (full[m] === "\n" ? m + 1 : m);
    if (limit > sent) { res.write(full.slice(sent, limit)); sent = limit; }
  };
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
        if (ev.type === "message_start" && ev.message?.usage) {
          usage.in = ev.message.usage.input_tokens || 0;
          usage.cacheRead = ev.message.usage.cache_read_input_tokens || 0;
          usage.cacheWrite = ev.message.usage.cache_creation_input_tokens || 0;
        }
        if (ev.type === "message_delta" && ev.usage) usage.out = ev.usage.output_tokens || usage.out;
        if (ev.type === "content_block_delta" && ev.delta?.type === "text_delta") {
          const t = ev.delta.text;
          if (hintGuard) { full += t; forward(); }
          else res.write(t);
        }
      } catch { /* 半行/非 JSON 事件,略過 */ }
    }
  }
  if (hintGuard) {
    const hasJP = /^\s*JP[::]/m.test(full);
    if (!hasJP) console.warn("[format] 模型輸出缺 JP 行, model=" + (model || MODEL) + " raw=" + JSON.stringify(full.slice(0, 600)));
    const withheld = full.slice(sent);
    if (!/(?:^|\n)HINT:/.test(withheld)) {
      if (withheld) res.write(withheld);       // 這輪沒有 HINT(或格式跑掉)→ 原樣放行
      if (!hasJP && !/^\s*KANA[::]/m.test(full) && full.trim()) {
        const extra = await repairBare(full.trim().split("\n")[0], hintGuard);   // 整包裸回 → 補生欄位
        if (extra) res.write("\n" + extra);
      }
    } else {
      const others: string[] = []; const hints: string[] = [];
      for (const ln of withheld.split("\n")) {
        const m = ln.match(/^\s*HINT:\s?(.*)$/);
        if (m) { if (m[1].trim()) hints.push(m[1].trim()); }
        else if (ln.trim()) others.push(ln);
      }
      if (others.length) res.write(others.join("\n") + "\n");
      const jp = (full.match(/^JP:\s?(.*)$/m) || [])[1] || "";
      const verified = await guardHints(hints, jp.trim(), hintGuard);
      for (const h of verified) res.write("\nHINT: " + h);
    }
  }
  await trackAiCost(model || MODEL, usage).catch(() => {});   // 必須在 res.end() 前:Cloud Run 回應結束即凍結 CPU,之後的寫入常丟
  res.end();
}

export const speakChat = functions.onRequest(
  { cors: true, region: "asia-east1", secrets: [ANTHROPIC_API_KEY] },
  async (req, res) => {
    try {
      if (req.method !== "POST") { res.status(405).json({ error: "method_not_allowed" }); return; }   // 爬蟲 GET 戳門 → 405,不進錯誤日誌
      const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      let decoded: admin.auth.DecodedIdToken;
      try { decoded = await admin.auth().verifyIdToken(idToken); }
      catch { res.status(401).json({ error: "auth", message: "請重新登入" }); return; }
      const isAdmin = ADMIN_EMAILS.includes((decoded.email || "").toLowerCase()) && decoded.email_verified === true;
      const cfg = await getAiConfig();
      // 測試期(public:false):非 admin 一律擋。開放後:admin 不計量,其他人走 quota。
      if (!isAdmin && !cfg.public) {
        res.status(403).json({ error: "測試版限 admin 帳號" }); return;
      }
      const { mode, scene, level, history, lang, userRole } = (req.body || {}) as {
        mode?: string; scene?: string; level?: string; lang?: string; userRole?: string;
        history?: Array<{ role?: string; text?: string }>;
      };
      const hist = Array.isArray(history) ? history.filter(h => h && h.text) : [];
      const userTurns = hist.filter(h => h.role === "me").length;

      // 伺服器端輪數保險絲:userTurns/場數都算在 client 送來的 history 上,惡意 client 可造假繞過「場」扣費。
      // 不重構計費,直接加每日硬上限(admin 除外):對話輪數與 toJa 次數各自封頂,成本有天花板。
      async function dayFuse(field: string, limit: number): Promise<boolean> {
        try {
          const ref = admin.firestore().doc("ai_usage/" + decoded.uid);
          const today = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
          return await admin.firestore().runTransaction(async (tx) => {
            const u: any = (await tx.get(ref)).data() || {};
            const day = (u[field] && u[field].d === today) ? u[field] : { d: today, n: 0 };
            if (day.n >= limit) return false;
            day.n++;
            tx.set(ref, { [field]: day }, { merge: true });
            return true;
          });
        } catch { return true; }   // 保險絲壞了不擋正常人
      }

      // 輸入轉日文:使用者打中文/英文 → 翻成自然日文讓對話繼續(附屬功能,不細計量,但有每日硬上限防刷)
      if (mode === "toJa") {
        const text = String(req.body?.text || "").slice(0, 200).trim();
        if (!text) { res.status(400).json({ error: "missing_text" }); return; }
        if (!isAdmin && !(await dayFuse("toJaDay", 120))) { res.status(429).json({ error: "quota", message: "今天的翻譯輔助用量已達上限,明天再來!" }); return; }
        const up = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "content-type": "application/json", "x-api-key": ANTHROPIC_API_KEY.value(), "anthropic-version": "2023-06-01" },
          signal: (AbortSignal as any).timeout ? (AbortSignal as any).timeout(20000) : undefined,
          body: JSON.stringify({ model: MODEL, max_tokens: 120,
            system: "把使用者這句話轉成自然的日文口語(對話中的一句)。如果輸入本身已經是自然的日文,一字不改原樣返回。只輸出日文句子本身,絕不加解釋、引號或其他文字。",
            messages: [{ role: "user", content: text }] }),
        });
        if (!up.ok) { res.status(502).json({ error: "translate_failed" }); return; }
        const d: any = await up.json();
        if (d.usage) void trackAiCost(MODEL, { in: d.usage.input_tokens || 0, out: d.usage.output_tokens || 0 });
        const ja = (d.content && d.content[0] && d.content[0].text || "").trim();
        res.json({ ja }); return;
      }

      if (mode === "review") {
        // 點評附屬於場,不另計量;歷史全量給(點評需要完整對話)
        const transcript = hist.map(h => `${h.role === "me" ? "學生" : "AI"}: ${h.text}`).join("\n");
        await streamAnthropic(res, ANTHROPIC_API_KEY.value(), reviewSystem(lang),
          [{ role: "user", content: `這是對話紀錄:\n${transcript}\n\n請依格式輸出點評。` }]);
        return;
      }

      // chat 模式
      if (!scene) { res.status(400).json({ error: "缺 scene" }); return; }
      // 輪數封頂:單場成本天花板。前端同步自動收尾,這裡是護底。
      if (userTurns > cfg.maxTurns) {
        res.status(429).json({ error: "turns", message: "這場聊得夠深了!按「結束・看點評」看表現吧 🙌" }); return;
      }
      // 每日輪數硬上限(成本天花板;正常人打不到:premium 5場×12輪=60)
      const turnCap = 80;
      if (!isAdmin && userTurns >= 1 && !(await dayFuse("chatTurnDay", turnCap))) {
        res.status(429).json({ error: "quota", message: "今天的對話輪數已達上限,明天再來!" }); return;
      }
      // 「使用者送出第一句」才消耗「場」額度——AI 開場白不扣。
      // 之前在開場白就扣,點開情境看一眼就沒了,使用者覺得「我根本沒用過」(KOL 實測回饋)。
      if (!isAdmin && userTurns === 1) {
        const blocked = await consumeQuota(decoded.uid, "chat", cfg);
        if (blocked) { res.status(402).json({ error: "quota", message: blocked }); return; }
      } else if (isAdmin && userTurns === 1) {
        void recordAiUse(decoded.uid, "chat");   // admin 不計量,但累計紀錄照記
      }
      const sceneStr = String(scene).slice(0, 400);
      const msgs: any[] = [];
      // 歷史裡 AI 舊回覆存「台詞本身」(不加 JP: 前綴)。
      // 教訓:曾為了防「模仿自己裸回」加過 JP: 前綴,結果模型把上一輪看成「只輸出到 JP 的未完格式塊」,
      // 這一輪去「補完上輪的 KANA/ZH/HINT」而完全無視使用者最新訊息(日誌實錘:重複問已回答的問題)。
      // 裸回問題交給 repairBare 兜底即可,前綴弊大於利。
      for (const h of hist) msgs.push({ role: h.role === "me" ? "user" : "assistant", content: String(h.text).slice(0, 400) });
      // 歷史截斷:只送最近 N 則(場景設定在 system 裡,舊對話對下一句影響小)→ input 不隨對話變長
      const kept = msgs.slice(-cfg.historyKeep);
      if (kept.length === 0 || kept[kept.length - 1].role !== "user") {
        kept.push({ role: "user", content: "（請你先自然開口,帶起這個情境的對話）" });
      }
      const system = [{ type: "text", text: chatSystem(sceneStr, level || "N4", lang, String(userRole || "").slice(0, 30)), cache_control: { type: "ephemeral" } }];
      const urStr = String(userRole || "").slice(0, 30);
      const guard: HintGuard | undefined = urStr
        ? { apiKey: ANTHROPIC_API_KEY.value(), scene: sceneStr.slice(0, 300), ur: urStr, langLabel: langName(lang) }
        : undefined;
      await streamAnthropic(res, ANTHROPIC_API_KEY.value(), system, kept, (cfg as any).chatModel, guard);
    } catch (e: any) {
      if (!res.headersSent) res.status(500).json({ error: String((e && e.message) || e) });
      else { try { res.end(); } catch { /* noop */ } }
    }
  },
);
