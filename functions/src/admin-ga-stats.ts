// 後台瀏覽人數:當天活躍/瀏覽 + 當下在線(過去 30 分),給 admin-dash 頂端顯示。
// 認證:用 function 執行的服務帳號(ADC)取 analytics.readonly token —— 不需要任何 OAuth 金鑰。
//   前置(Mia 一次性):
//     1) 填下面 GA4_PROPERTY_ID(GA → 管理 → 資源設定 → 「資源 ID」,一串數字,非機密)
//     2) 把服務帳號 666368174384-compute@developer.gserviceaccount.com
//        加進 GA →管理→資源存取權管理,角色「檢視者」
//   唯讀:只呼叫 GA Data API runReport / runRealtimeReport。
import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { GoogleAuth } from "google-auth-library";

if (admin.apps.length === 0) admin.initializeApp();

const GA4_PROPERTY_ID = "532386963";   // GA 資源 ID(StayJP)
const ADMIN_EMAILS = ["stayjpplan@gmail.com", "abc83327@gmail.com"];

const gauth = new GoogleAuth({ scopes: ["https://www.googleapis.com/auth/analytics.readonly"] });

async function gaCall(path: string, payload: unknown): Promise<any> {
  const token = await gauth.getAccessToken();
  const r = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:${path}`, {
    method: "POST",
    headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(`${path} ${r.status}: ${await r.text()}`);
  return r.json();
}

export const adminGaStats = functions.onRequest(
  { cors: true, region: "asia-east1" },
  async (req, res) => {
    try {
      const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      const decoded = await admin.auth().verifyIdToken(idToken);
      if (!ADMIN_EMAILS.includes((decoded.email || "").toLowerCase()) || decoded.email_verified !== true) {
        res.status(403).json({ error: "not admin" }); return;
      }
      const [rep, rt] = await Promise.all([
        gaCall("runReport", {
          dateRanges: [{ startDate: "today", endDate: "today" }],
          metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }],
        }),
        gaCall("runRealtimeReport", { metrics: [{ name: "activeUsers" }] }),
      ]);
      const mv = (o: any) => (o && o.rows && o.rows[0] && o.rows[0].metricValues) || [];
      const today = mv(rep), now = mv(rt);
      res.json({
        todayUsers: Number((today[0] && today[0].value) || 0),
        todayViews: Number((today[1] && today[1].value) || 0),
        online: Number((now[0] && now[0].value) || 0),
      });
    } catch (e: any) {
      res.status(500).json({ error: String((e && e.message) || e) });
    }
  },
);
