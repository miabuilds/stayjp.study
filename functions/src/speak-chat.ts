// AI 情境對話(測試版):學生選一個情境,AI 扮演對方角色,多輪自然對話。
// - chat 模式:依對話歷史,生成 AI 角色的下一句(日文 + 假名 + 中文 + 對學生上一句的即時提點)。
// - review 模式:對整段對話給整體點評。
// 兩者都 streaming(邊生邊吐,體感快)。Claude key 只在後端。
// ⚠️ 測試版:限 admin 呼叫。
import * as functions from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import * as admin from "firebase-admin";
import { getAiConfig, consumeQuota } from "./ai-quota";

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

function chatSystem(sceneDesc: string, level: string): string {
  return `你是 StayJP 的日語「情境對話」練習夥伴,陪台灣的日語學習者練口說。
【你的角色與場景】${sceneDesc}
【對話難度】${LEVEL_DESC[level] || LEVEL_DESC.N4}
【怎麼對話】
- 完全進入角色,用符合這個場景的自然日語,不要像教科書、不要老師腔。
- 一次只講一兩句,並且把球拋回給對方(問一個問題、給選擇、或推進情境),讓對話能一直接下去。
- 難度貼合上面的等級:N5 就短而簡單,N1 就自然流利含敬語。
- 先想清楚對方那句話的「主語和對象」再回:學習者的句子常省略主語或問得不精準(例:他問「エアコンはありませんか」很可能是在問「你/你家」有沒有冷氣,不是說他自己沒有)。依情境推斷最合理的意思來接;真的模糊就在戲中自然地反問確認(「うちのエアコンのことですか?」),絕對不要把對方的提問誤當成他的自述。
- 對方是學習者,若他上一句日語有明顯錯誤(助詞、動詞變化、用詞、不自然),在 COACH 用一句繁體中文溫和點出更好的說法;講得好就用 COACH 給一句具體鼓勵。
- 對話自然走到尾聲時,可以帶到道別收尾。
- 重要:對方常常「不知道要講什麼」。每一輪都要給 2~3 個 HINT,是「站在對方立場、他這時可以怎麼回你」的日文短句(貼合當下情境、難度符合等級、彼此不同、能把對話往前推),讓他有東西講、練得更深。
【輸出格式】嚴格逐行輸出,一行一個欄位,不要 JSON、不要多餘文字或旁白。JP/KANA/ZH 各恰好一行、缺一不可;每個欄位只輸出一次,想好再寫、絕對不要輸出到一半重來或補第二行 JP:
JP: <你這個角色要講的日文(只有台詞本身)>
KANA: <JP 的整句假名讀音>
ZH: <JP 的繁體中文翻譯>
WORDS: <JP 裡的關鍵單字 2~4 個,格式:単語|よみ|繁中意思,單字之間用半形分號;隔開、三個欄位內文不可再出現分號。例:お弁当|おべんとう|便當;温める|あたためる|加熱……讀音絕對不能錯;句子太簡單就整行省略>
COACH: <對對方「上一句」的簡短繁中提點或鼓勵。開場或沒必要時,整行直接不要輸出——絕對不要寫 <blank>、空白、無、なし 這類佔位字>
HINT: <對方可以這樣回你的日文>｜<這句的繁體中文意思>
HINT: <另一個不同方向的回法>｜<繁體中文意思>
HINT: <再一個(可選)>｜<繁體中文意思>`;
}

const REVIEW_SYSTEM = `你是 StayJP 的日語口說教練。下面是一段學生和 AI 的情境對話(JP 標學生說的、AI 標對方角色)。
針對「學生」的表現給溫暖但具體的整體點評。
【語言規定・最重要】學生是台灣人,看的是中文。GOOD／IMPROVE／TIP／ENCOURAGE 的說明文字**一律用繁體中文**書寫——即使對話內容是日文、需要舉例時,可以用「」引用日文詞句,但你的評語、說明、建議本身**絕對不能整句用日文**,必須是中文。
嚴格逐行輸出:
SCORE: 0~100 整數(這次對話的口說綜合表現)
GOOD: 一句繁體中文,講得好的地方(具體;要引用日文可加「」)
IMPROVE: 一句繁體中文,最該加強的地方(助詞/動詞變化/用詞/自然度,具體、學得到)
TIP: 一句繁體中文,下次馬上能用的小建議
ENCOURAGE: 一句繁體中文,像真人教練的鼓勵`;

async function streamAnthropic(res: any, apiKey: string, system: any, messages: any[]) {
  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: MODEL, max_tokens: 600, stream: true, system, messages }),
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
        if (ev.type === "content_block_delta" && ev.delta?.type === "text_delta") res.write(ev.delta.text);
      } catch { /* 半行/非 JSON 事件,略過 */ }
    }
  }
  res.end();
}

export const speakChat = functions.onRequest(
  { cors: true, region: "asia-east1", secrets: [ANTHROPIC_API_KEY] },
  async (req, res) => {
    try {
      const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      const decoded = await admin.auth().verifyIdToken(idToken);
      const isAdmin = ADMIN_EMAILS.includes((decoded.email || "").toLowerCase());
      const cfg = await getAiConfig();
      // 測試期(public:false):非 admin 一律擋。開放後:admin 不計量,其他人走 quota。
      if (!isAdmin && !cfg.public) {
        res.status(403).json({ error: "測試版限 admin 帳號" }); return;
      }
      const { mode, scene, level, history } = (req.body || {}) as {
        mode?: string; scene?: string; level?: string;
        history?: Array<{ role?: string; text?: string }>;
      };
      const hist = Array.isArray(history) ? history.filter(h => h && h.text) : [];
      const userTurns = hist.filter(h => h.role === "me").length;

      if (mode === "review") {
        // 點評附屬於場,不另計量;歷史全量給(點評需要完整對話)
        const transcript = hist.map(h => `${h.role === "me" ? "學生" : "AI"}: ${h.text}`).join("\n");
        await streamAnthropic(res, ANTHROPIC_API_KEY.value(), REVIEW_SYSTEM,
          [{ role: "user", content: `這是對話紀錄:\n${transcript}\n\n請依格式輸出點評。` }]);
        return;
      }

      // chat 模式
      if (!scene) { res.status(400).json({ error: "缺 scene" }); return; }
      // 輪數封頂:單場成本天花板。前端同步自動收尾,這裡是護底。
      if (userTurns >= cfg.maxTurns) {
        res.status(429).json({ error: "turns", message: "這場聊得夠深了!按「結束・看點評」看表現吧 🙌" }); return;
      }
      // 開新場(還沒有任何 AI 發言)才消耗「場」額度
      if (!isAdmin && !hist.some(h => h.role === "ai")) {
        const blocked = await consumeQuota(decoded.uid, "chat", cfg);
        if (blocked) { res.status(402).json({ error: "quota", message: blocked }); return; }
      }
      const msgs: any[] = [];
      for (const h of hist) msgs.push({ role: h.role === "me" ? "user" : "assistant", content: String(h.text) });
      // 歷史截斷:只送最近 N 則(場景設定在 system 裡,舊對話對下一句影響小)→ input 不隨對話變長
      const kept = msgs.slice(-cfg.historyKeep);
      if (kept.length === 0 || kept[kept.length - 1].role !== "user") {
        kept.push({ role: "user", content: "（請你先自然開口,帶起這個情境的對話）" });
      }
      const system = [{ type: "text", text: chatSystem(scene, level || "N4"), cache_control: { type: "ephemeral" } }];
      await streamAnthropic(res, ANTHROPIC_API_KEY.value(), system, kept);
    } catch (e: any) {
      if (!res.headersSent) res.status(500).json({ error: String((e && e.message) || e) });
      else { try { res.end(); } catch { /* noop */ } }
    }
  },
);
