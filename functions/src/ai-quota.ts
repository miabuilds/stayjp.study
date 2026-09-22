// AI 功能的後端 quota(口說評分 / AI 對話)。
// 為什麼在後端:前端 gate 會被繞過,AI 有真實 token 成本,必須在 function 收錢口把關。
//
// 方案(2026-08 與 Mia 定案):
//   免費(登入):評分「總共 10 次」、對話「總共 1 場」——總次數,不重置
//   Premium/買斷(相同):評分 30 次/日、對話 3 場/日——每日重置,是成本保險絲
//   admin 測試帳號:不計量
//   config/ai 文件可隨時調參數(含 public 開關),不用重新部署
//
// 用量存 ai_usage/{uid}:{ evalTotal, chatTotal, evalDay:{d,n}, chatDay:{d,n} }
import * as admin from "firebase-admin";

const DEFAULTS = {
  public: false,          // false=測試期,非 admin 一律 403;true=依 quota 開放
  freeEvalTotal: 10,      // 免費:評分總次數
  freeChatTotal: 1,       // 免費:對話總場數
  premEvalDaily: 30,      // Premium/買斷:評分每日
  premChatDaily: 3,       // Premium/買斷:對話每日場數
  freeAskDaily: 2,        // 免費:小狸助教每日問數(2026-09 與 Mia 定案:免費每天 2 問、Premium 30 問;成本低所以免費走每日)
  premAskDaily: 30,       // Premium/買斷:小狸助教每日問數
  tutorModel: "claude-sonnet-5",   // 小狸助教模型:文法解釋要準,預設 Sonnet;config/ai 可熱切
  maxTurns: 12,           // 每場對話輪數封頂(成本天花板)
  historyKeep: 12,        // 送給模型的歷史訊息數上限(6輪),input 不隨對話無限長
  ttsDaily: 150,          // 雲端 TTS 每人每日粗上限(防拿 token 單獨刷合成;正常對話一天用不到)
  chatModel: "claude-haiku-4-5-20251001",   // 情境對話模型;config/ai 可熱切(如升 claude-sonnet-5 測試角色穩定度)
  aiBudgetUsd: 50,        // 當月 Anthropic 估算成本上限(美金);超過自動把 chatModel 降回 Haiku(Mia 定調:別太貴)
};

export type AiConfig = typeof DEFAULTS;

export async function getAiConfig(): Promise<AiConfig> {
  try {
    const snap = await admin.firestore().doc("config/ai").get();
    return { ...DEFAULTS, ...(snap.exists ? snap.data() : {}) } as AiConfig;
  } catch { return { ...DEFAULTS }; }
}

// 網頁免費試用天數。必須與前端 tool-quota.js 的 TRIAL_DAYS 相同。
const WEB_TRIAL_DAYS = 3;

async function isPremium(uid: string): Promise<boolean> {
  try {
    // 白名單(free_users/{uid})= Premium 等級:前端工具額度早就全開,AI 額度也要對齊,
    // 否則白名單的人被當免費用戶(總量 1 場對話),用完就卡死——2026-08 KOL 實測踩到。
    const [userSnap, freeSnap] = await Promise.all([
      admin.firestore().doc("users/" + uid).get(),
      admin.firestore().doc("free_users/" + uid).get(),
    ]);
    if (freeSnap.exists) return true;
    const u = userSnap.data() || {};

    // 網頁免費試用期間 = Premium 等級。
    // ⚠️ 原本這裡只看 subscription.status,但網頁試用(start-trial.ts)只寫 trial_started_at、
    //    從來不設 subscription → 前端 tool-quota.js 的 inTrial() 把畫面全解鎖了,
    //    後端卻仍把人當免費仔(小狸一天 2 次而不是 30 次)。
    //    結果就是「網站說你有 3 天全功能試用」但最想試的 AI 功能兩次就卡死,
    //    App 的試用反而是完整的 → 網頁試用體感差一大截。這是 bug,不是設計。
    // 天數要跟前端 tool-quota.js 的 TRIAL_DAYS 一致,改一邊要改兩邊。
    const trialStart = u.trial_started_at;
    const startMs = trialStart && typeof trialStart.toMillis === "function" ? trialStart.toMillis()
      : (trialStart && trialStart.seconds ? trialStart.seconds * 1000 : 0);
    if (startMs > 0 && Date.now() < startMs + WEB_TRIAL_DAYS * 86400_000) return true;

    const sub = u.subscription;
    if (!sub) return false;
    if (sub.status !== "active" && sub.status !== "trialing" && sub.status !== "cancelled") return false;
    return (sub.expiresAt || 0) > Date.now();
  } catch { return false; }
}

function dayKey(): string {
  // 以日本時間切日(用戶在日本;跟站上其他每日 quota 一致)
  const d = new Date(Date.now() + 9 * 3600 * 1000);
  return d.toISOString().slice(0, 10);
}

// 檢查並消耗一次額度。kind: 'eval'(評分一次)| 'chat'(對話開新一場)| 'tts'(合成一次,粗防線)
// 回傳 null=放行;否則回傳給前端的擋下訊息。
export async function consumeQuota(uid: string, kind: "eval" | "chat" | "ask" | "tts", cfg: AiConfig): Promise<string | null> {
  const prem = await isPremium(uid);
  const ref = admin.firestore().doc("ai_usage/" + uid);
  const today = dayKey();
  return admin.firestore().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const u: any = snap.exists ? snap.data() : {};
    if (kind === "tts") {
      const day = (u.ttsDay && u.ttsDay.d === today) ? u.ttsDay : { d: today, n: 0 };
      if (day.n >= cfg.ttsDaily) return "今天的語音合成額度用完了,明天再來!";
      day.n++;
      tx.set(ref, { ttsDay: day }, { merge: true });
      return null;
    }
    if (kind === "ask") {
      // 小狸助教:免費/Premium 都走「每日」上限(免費 2、Premium 30),超過先扣 bonusAsk(AI 加量包)
      const day = (u.askDay && u.askDay.d === today) ? u.askDay : { d: today, n: 0 };
      const limit = prem ? cfg.premAskDaily : cfg.freeAskDaily;
      const bonusA = Number(u.bonusAsk || 0);
      if (day.n >= limit) {
        if (bonusA > 0) { day.n++; tx.set(ref, { askDay: day, bonusAsk: bonusA - 1, askLife: admin.firestore.FieldValue.increment(1) }, { merge: true }); return null; }
        return prem
          ? `今天問小狸的額度(${limit} 次)用完了,明天再來!`
          : `免費每天可以問小狸 ${limit} 次,今天用完了。升級 Premium 每天 ${cfg.premAskDaily} 次!`;
      }
      day.n++;
      tx.set(ref, { askDay: day, askLife: admin.firestore.FieldValue.increment(1) }, { merge: true });
      return null;
    }
    // 累計使用(「我的」頁顯示用;與額度無關,只進不出)
    const lifeField = kind === "eval" ? "evalLife" : "chatLife";
    // bonus 池(AI 加量包兌換碼):超過上限時優先扣 bonus 放行——買斷/訂閱/免費都適用
    const bonusField = kind === "eval" ? "bonusEval" : "bonusChat";
    const bonus = Number(u[bonusField] || 0);
    if (prem) {
      const field = kind === "eval" ? "evalDay" : "chatDay";
      const limit = kind === "eval" ? cfg.premEvalDaily : cfg.premChatDaily;
      const day = (u[field] && u[field].d === today) ? u[field] : { d: today, n: 0 };
      if (day.n >= limit) {
        if (bonus > 0) { day.n++; tx.set(ref, { [field]: day, [bonusField]: bonus - 1, [lifeField]: admin.firestore.FieldValue.increment(1) }, { merge: true }); return null; }   // 顯示計數同步(「我的」頁今日數)
        return kind === "eval"
          ? `今天的 AI 評分額度(${limit} 次)用完了,明天再來!`
          : `今天的 AI 對話額度(${limit} 場)用完了,明天再來!`;
      }
      day.n++;
      tx.set(ref, { [field]: day, [lifeField]: admin.firestore.FieldValue.increment(1) }, { merge: true });
      return null;
    } else {
      const field = kind === "eval" ? "evalTotal" : "chatTotal";
      const limit = kind === "eval" ? cfg.freeEvalTotal : cfg.freeChatTotal;
      const n = u[field] || 0;
      if (n >= limit) {
        if (bonus > 0) {
          const dayF = kind === "eval" ? "evalDay" : "chatDay";
          const dv = (u[dayF] && u[dayF].d === today) ? u[dayF] : { d: today, n: 0 };
          dv.n++;
          tx.set(ref, { [dayF]: dv, [bonusField]: bonus - 1, [lifeField]: admin.firestore.FieldValue.increment(1) }, { merge: true }); return null;
        }
        return kind === "eval"
          ? `免費體驗的 ${limit} 次 AI 評分已用完。升級 Premium 每天 ${cfg.premEvalDaily} 次!`
          : `免費體驗的 ${limit} 場 AI 對話已用完。升級 Premium 每天 ${cfg.premChatDaily} 場!`;
      }
      const dayField = kind === "eval" ? "evalDay" : "chatDay";
      const day2 = (u[dayField] && u[dayField].d === today) ? u[dayField] : { d: today, n: 0 };
      day2.n++;   // 顯示用的「今天」計數;免費額度仍以總量判斷,不受影響
      tx.set(ref, { [field]: n + 1, [dayField]: day2, [lifeField]: admin.firestore.FieldValue.increment(1) }, { merge: true });
      return null;
    }
  });
}

// 純記錄(不檢查額度):admin 不計量但「我的」頁也要看得到紀錄(累計+今天都記)
export async function recordAiUse(uid: string, kind: "eval" | "chat" | "ask"): Promise<void> {
  try {
    const ref = admin.firestore().doc("ai_usage/" + uid);
    const today = dayKey();
    const dayField = kind === "eval" ? "evalDay" : kind === "ask" ? "askDay" : "chatDay";
    await admin.firestore().runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const u: any = snap.exists ? snap.data() : {};
      const day = (u[dayField] && u[dayField].d === today) ? u[dayField] : { d: today, n: 0 };
      day.n++;
      tx.set(ref, { [dayField]: day, [kind === "eval" ? "evalLife" : kind === "ask" ? "askLife" : "chatLife"]: admin.firestore.FieldValue.increment(1) }, { merge: true });
    });
  } catch { /* 統計失敗不影響功能 */ }
}

// ── AI 成本記帳 + 超額自動降級 ──────────────────────────────────
// 每次 Anthropic 呼叫結束後,用回傳的 usage 算出估算成本,累計到 counters/ai_cost_YYYY-MM。
// 當月累計超過 config/ai.aiBudgetUsd 且 chatModel 不是 Haiku → 自動把 chatModel 降回 Haiku
// (一次性,寫入 autoDowngradedAt;不會自動升回去,要人工再開)。
// 全程 fire-and-forget:記帳失敗絕不影響對話功能。
const HAIKU = "claude-haiku-4-5-20251001";
// USD / 1M tokens [input, output];快取讀 0.1×input、快取寫 1.25×input
const PRICE: Record<string, [number, number]> = {
  "claude-sonnet-5": [3, 15],
  "claude-sonnet-4-6": [3, 15],
  "claude-haiku-4-5-20251001": [1, 5],
  "claude-haiku-4-5": [1, 5],
  "claude-opus-5": [5, 25],
};

export type AiUsage = { in: number; out: number; cacheRead?: number; cacheWrite?: number };

export async function trackAiCost(model: string, u: AiUsage): Promise<void> {
  try {
    const [inP, outP] = PRICE[model] || [3, 15];   // 不認得的模型按 Sonnet 價算(寧可高估)
    const usd = (u.in * inP + (u.cacheRead || 0) * inP * 0.1 + (u.cacheWrite || 0) * inP * 1.25 + u.out * outP) / 1e6;
    if (!(usd > 0)) return;
    const month = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 7);   // 日本時間切月,與每日 quota 一致
    const ref = admin.firestore().doc("counters/ai_cost_" + month);
    const total = await admin.firestore().runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const cur = (snap.exists ? (snap.data() as any).usd : 0) || 0;
      tx.set(ref, { usd: cur + usd, calls: admin.firestore.FieldValue.increment(1) }, { merge: true });
      return cur + usd;
    });
    // 超額 → 自動降級(只降 chatModel;評分/審核本來就是 Haiku)
    const cfgRef = admin.firestore().doc("config/ai");
    const cfgSnap = await cfgRef.get();
    const cfg: any = cfgSnap.exists ? cfgSnap.data() : {};
    const budget = Number(cfg.aiBudgetUsd || DEFAULTS.aiBudgetUsd);
    if (total > budget && cfg.chatModel && cfg.chatModel !== HAIKU) {
      await cfgRef.set({ chatModel: HAIKU, autoDowngradedAt: new Date().toISOString(),
        autoDowngradeNote: `當月估算成本 $${total.toFixed(2)} 超過預算 $${budget},chatModel 自動降回 Haiku` }, { merge: true });
      console.warn(`[ai-cost] 超過預算($${total.toFixed(2)} > $${budget}),chatModel 已自動降回 Haiku`);
    }
  } catch { /* 記帳失敗不影響功能 */ }
}
