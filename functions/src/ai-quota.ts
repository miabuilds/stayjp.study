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
  maxTurns: 12,           // 每場對話輪數封頂(成本天花板)
  historyKeep: 12,        // 送給模型的歷史訊息數上限(6輪),input 不隨對話無限長
  ttsDaily: 150,          // 雲端 TTS 每人每日粗上限(防拿 token 單獨刷合成;正常對話一天用不到)
};

export type AiConfig = typeof DEFAULTS;

export async function getAiConfig(): Promise<AiConfig> {
  try {
    const snap = await admin.firestore().doc("config/ai").get();
    return { ...DEFAULTS, ...(snap.exists ? snap.data() : {}) } as AiConfig;
  } catch { return { ...DEFAULTS }; }
}

async function isPremium(uid: string): Promise<boolean> {
  try {
    // 白名單(free_users/{uid})= Premium 等級:前端工具額度早就全開,AI 額度也要對齊,
    // 否則白名單的人被當免費用戶(總量 1 場對話),用完就卡死——2026-08 KOL 實測踩到。
    const [userSnap, freeSnap] = await Promise.all([
      admin.firestore().doc("users/" + uid).get(),
      admin.firestore().doc("free_users/" + uid).get(),
    ]);
    if (freeSnap.exists) return true;
    const sub = (userSnap.data() || {}).subscription;
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
export async function consumeQuota(uid: string, kind: "eval" | "chat" | "tts", cfg: AiConfig): Promise<string | null> {
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
    // bonus 池(AI 加量包兌換碼):超過上限時優先扣 bonus 放行——買斷/訂閱/免費都適用
    const bonusField = kind === "eval" ? "bonusEval" : "bonusChat";
    const bonus = Number(u[bonusField] || 0);
    if (prem) {
      const field = kind === "eval" ? "evalDay" : "chatDay";
      const limit = kind === "eval" ? cfg.premEvalDaily : cfg.premChatDaily;
      const day = (u[field] && u[field].d === today) ? u[field] : { d: today, n: 0 };
      if (day.n >= limit) {
        if (bonus > 0) { tx.set(ref, { [bonusField]: bonus - 1 }, { merge: true }); return null; }
        return kind === "eval"
          ? `今天的 AI 評分額度(${limit} 次)用完了,明天再來!`
          : `今天的 AI 對話額度(${limit} 場)用完了,明天再來!`;
      }
      day.n++;
      tx.set(ref, { [field]: day }, { merge: true });
      return null;
    } else {
      const field = kind === "eval" ? "evalTotal" : "chatTotal";
      const limit = kind === "eval" ? cfg.freeEvalTotal : cfg.freeChatTotal;
      const n = u[field] || 0;
      if (n >= limit) {
        if (bonus > 0) { tx.set(ref, { [bonusField]: bonus - 1 }, { merge: true }); return null; }
        return kind === "eval"
          ? `免費體驗的 ${limit} 次 AI 評分已用完。升級 Premium 每天 ${cfg.premEvalDaily} 次!`
          : `免費體驗的 ${limit} 場 AI 對話已用完。升級 Premium 每天 ${cfg.premChatDaily} 場!`;
      }
      tx.set(ref, { [field]: n + 1 }, { merge: true });
      return null;
    }
  });
}
