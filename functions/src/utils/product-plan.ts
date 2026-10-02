// App 商店 product id → 我們的方案。revenuecat-webhook.ts 與 rc-sync-subscription.ts 共用這一份
// (以前兩邊各抄一份,加新商品容易漏一邊 → webhook 回「unknown product」直接丟掉付款)。
// Product IDs 定義在 stayjp-app/src/lib/subscription.ts;App Store Connect / Play Console / RevenueCat 三邊要一字不差。
import { PlanKey } from "./constants";

const PRODUCT_PLAN: Record<string, PlanKey> = {
  "com.stayjp.app.monthly": "monthly",
  "stayjp_monthly": "monthly",
  "com.stayjp.app.yearly": "yearly",
  "stayjp_yearly": "yearly",
  "com.stayjp.app.yearly_early_bird": "yearly_early_bird",
  "stayjp_yearly_early_bird": "yearly_early_bird",
  "com.stayjp.app.lifetime": "lifetime",
  "stayjp_lifetime": "lifetime",
  // 推薦碼優惠版(9 折,App 內輸碼解鎖的雙 SKU):方案同原商品,實付由 price_in_purchased_currency 記
  "com.stayjp.app.yearly_ref": "yearly",
  "stayjp_yearly_ref": "yearly",
  "com.stayjp.app.lifetime_ref": "lifetime",
  "stayjp_lifetime_ref": "lifetime",
  // 雙十檔期優惠版(2026-10):方案同原商品。lifetime_sale65 走 lifetime 一切規則
  // (willRenew=false、推薦碼歸因時實付<牌價 → 不另發 AI 加量包,同 lifetime_ref)
  "com.stayjp.app.yearly_sale75": "yearly",
  "stayjp_yearly_sale75": "yearly",
  "com.stayjp.app.lifetime_sale65": "lifetime",
  "stayjp_lifetime_sale65": "lifetime",
};

/**
 * Play 訂閱可能以「productId:basePlanId」送來(如 stayjp_yearly_sale75:yearly)→ 先整串比、再比冒號前那段。
 * 認不得回 null(呼叫端決定要丟掉還是退回 monthly)。
 */
export function mapProductIdToPlan(productId: string): PlanKey | null {
  const id = String(productId || "").trim();
  if (!id) return null;
  if (PRODUCT_PLAN[id]) return PRODUCT_PLAN[id];
  const base = id.split(":")[0];
  return PRODUCT_PLAN[base] ?? null;
}
