// HTTP function:OrderResultURL — 3D 驗證完成後,綠界用「瀏覽器 Form POST」把綁卡結果送來。
//
// ⚠️ 三個容易錯的點(官方文件都點名過):
//   1. 資料在表單欄位 ResultData,那是 JSON 字串不是密文 → 要先 JSON.parse 再解密 Data。
//      直接對 ResultData 解密一定失敗。
//   2. 這支要回「HTML 頁面」給瀏覽器,不是回 1|OK(1|OK 是 ReturnURL 用的)。
//   3. 這是公開端點、沒有 idToken → 身分只能靠 MerchantTradeNo 對回我們自己開的預單。
//      綁卡代碼(BindCardID)是綠界給的代碼不是卡號,但仍當敏感資料存,不回給前端。
//
// 做的事:存 BindCardID → 開 7 天試用(或無試用直接計費)→ 立刻放棄那筆驗證授權 → 導回網站。

import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { ECPG_TRIAL_DAYS, ecpgConfig, ecpayConfig, PLANS, PlanKey } from "./utils/constants";
import { ECPG_SECRETS } from "./utils/ecpg-secrets";
import { ecpgPost, ecpaymentHost, parseCallback } from "./utils/ecpg";
import { normalizeEmail, trialEmailKey } from "./utils/ecpg-shared";

if (admin.apps.length === 0) admin.initializeApp();

type BindResult = {
  BindCardID?: string;
  CardInfo?: { Card6No?: string; Card4No?: string; BindingDate?: string };
  OrderInfo?: { MerchantTradeNo?: string; TradeNo?: string; TradeAmt?: number; RtnCode?: number; RtnMsg?: string };
  RtnCode?: number; RtnMsg?: string;
};

/** 導回網站的小頁面(綠界要 HTML) */
function redirectPage(url: string, msg: string): string {
  const safe = url.replace(/"/g, "&quot;");
  return `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8">` +
    `<meta name="viewport" content="width=device-width,initial-scale=1">` +
    `<meta http-equiv="refresh" content="0;url=${safe}"><title>處理中</title>` +
    `<style>body{font-family:system-ui,-apple-system,"Noto Sans TC",sans-serif;display:flex;` +
    `align-items:center;justify-content:center;height:100vh;margin:0;color:#3c3227;background:#f7f2e8}</style>` +
    `</head><body><p>${msg}<br><a href="${safe}">沒有自動跳轉請點這裡</a></p>` +
    `<script>location.replace("${safe}")</script></body></html>`;
}

export const ecpgBindResult = functions.onRequest(
  {
    secrets: ECPG_SECRETS, region: "asia-east1", invoker: "public",
    maxInstances: 10, timeoutSeconds: 60, memory: "256MiB",
  },
  async (req, res) => {
    const site = ecpayConfig().siteOrigin;
    try {
      const env = ecpgConfig();
      const parsed = parseCallback<BindResult>(req.body as Record<string, unknown>, env);
      if (!parsed.ok || !parsed.data) {
        console.error("綁卡結果解析失敗", parsed.error, parsed.transCode);
        res.status(200).send(redirectPage(site + "/account.html?bind=error", "綁卡結果無法解析,將帶您回帳戶頁。"));
        return;
      }
      const d = parsed.data;
      const tradeNo = String(d.OrderInfo?.MerchantTradeNo || "");
      const bindCardId = String(d.BindCardID || "");
      const rtn = Number(d.OrderInfo?.RtnCode ?? d.RtnCode);

      const db = admin.firestore();
      const bindRef = db.doc("ecpg_binds/" + tradeNo);
      const bindSnap = await bindRef.get();
      if (!bindSnap.exists) {
        console.error("查無綁卡預單", tradeNo);
        res.status(200).send(redirectPage(site + "/account.html?bind=error", "查無此綁卡單,將帶您回帳戶頁。"));
        return;
      }
      const b = bindSnap.data() as { uid: string; email?: string; plan: PlanKey; trial_eligible?: boolean };

      if (rtn !== 1 || !bindCardId) {
        await bindRef.set({ status: "failed", fail_code: rtn || null, fail_msg: d.OrderInfo?.RtnMsg || d.RtnMsg || null }, { merge: true });
        res.status(200).send(redirectPage(site + "/account.html?bind=fail", "綁卡未完成,沒有扣款。"));
        return;
      }

      // ── 綁卡成功:寫入會員 + 開通 ──
      const now = Date.now();
      const trialDays = b.trial_eligible ? ECPG_TRIAL_DAYS : 0;
      const periodDays = b.plan === "yearly" || b.plan === "yearly_early_bird" ? 365 : 30;
      // 有試用 → 試用到期才第一次扣款;沒試用 → 當天就開始計費(Mia 定案:試過的人不給第二次)
      const nextChargeAt = now + (trialDays > 0 ? trialDays : 0) * 86400_000;
      const expiresAt = trialDays > 0 ? nextChargeAt : now + periodDays * 86400_000;

      await db.runTransaction(async (tx) => {
        const userRef = db.doc("users/" + b.uid);
        tx.set(userRef, {
          ecpg: {
            bind_card_id: bindCardId,
            card4: String(d.CardInfo?.Card4No || ""),
            card6: String(d.CardInfo?.Card6No || ""),
            member_id: b.uid.slice(0, 60),
            bound_at: now,
            bind_trade_no: tradeNo,
          },
          subscription: {
            status: trialDays > 0 ? "trialing" : "active",
            plan: b.plan,
            source: "web_ecpg",
            expiresAt,
            next_charge_at: nextChargeAt,
            amount_twd: PLANS[b.plan].price_twd,
          },
          ...(trialDays > 0 ? { trial_started_at: admin.firestore.FieldValue.serverTimestamp() } : {}),
        }, { merge: true });
        // 試用只給一次:記在 trial_used,跟 start-trial.ts 共用同一把鑰匙
        if (trialDays > 0 && b.email) {
          // ⚠️ key 一定要跟 start-trial.ts 用同一套正規化(gmail 去點/去+別名),
          //    不然同一個人這邊領 7 天、那邊再領 3 天,試用變成可以領兩次。
          tx.set(db.doc("trial_used/" + trialEmailKey(normalizeEmail(b.email))), {
            uid: b.uid, email: b.email, started_at: admin.firestore.FieldValue.serverTimestamp(), via: "ecpg_bind",
          }, { merge: true });
        }
        tx.set(bindRef, {
          status: "bound", bind_card_id: bindCardId, trade_no: String(d.OrderInfo?.TradeNo || ""),
          bound_at: now, trial_days: trialDays,
        }, { merge: true });
      });

      // ── 放棄那筆驗證授權,錢不要真的收 ──
      // ⚠️ DoAction 只有正式環境有(綠界官方明說沙盒無法提供實際授權),沙盒一定會失敗,
      //    所以這裡失敗只記錄不中斷綁卡流程,但正式環境要盯 ecpg_binds.void_ok。
      void voidAuth(String(d.OrderInfo?.MerchantTradeNo || ""), String(d.OrderInfo?.TradeNo || ""),
        Number(d.OrderInfo?.TradeAmt || 0), bindRef);

      res.status(200).send(redirectPage(
        site + "/account.html?bind=ok&trial=" + trialDays,
        trialDays > 0 ? "綁卡完成,免費試用已開始,正在帶您回去…" : "綁卡完成,正在帶您回去…"));
    } catch (err) {
      console.error("ecpgBindResult error:", err);
      res.status(200).send(redirectPage(site + "/account.html?bind=error", "發生問題,將帶您回帳戶頁。"));
    }
  },
);

/** Action=N 放棄請款 → 那筆驗證授權不會入帳,不需要開發票也不用退款 */
async function voidAuth(
  merchantTradeNo: string, tradeNo: string, amount: number,
  bindRef: FirebaseFirestore.DocumentReference,
): Promise<void> {
  try {
    if (!tradeNo || !amount) return;
    const env = ecpgConfig();
    const r = await ecpgPost(ecpaymentHost(env) + "/1.0.0/Credit/DoAction", {
      PlatformID: "", MerchantTradeNo: merchantTradeNo, TradeNo: tradeNo,
      Action: "N", TotalAmount: amount, CustomField: "",
    }, env);
    await bindRef.set({ void_ok: r.ok, void_msg: r.rtnMsg || r.error || null, void_at: Date.now() }, { merge: true });
    if (!r.ok) console.error("放棄驗證授權失敗(正式環境必須人工確認)", merchantTradeNo, r.rtnMsg || r.error);
  } catch (e) {
    console.error("voidAuth 例外", e);
  }
}
