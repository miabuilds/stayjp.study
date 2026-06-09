// HTTP function:owner 後台查看程式報錯(Cloud Logging severity>=ERROR)
//
// 撈所有 Cloud Function(v2 跑在 Cloud Run)最近的 ERROR 日誌,含金流硬化的
// 🚨 SUBSCRIPTION WRITE FAILED。owner only,純檢視。
// 權限:runtime service account 需 roles/logging.viewer(Firebase 預設 SA 的 Editor 角色通常已含)。

import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { Logging } from "@google-cloud/logging";

if (admin.apps.length === 0) admin.initializeApp();

const OWNER_EMAILS = new Set(["stayjpplan@gmail.com", "abc83327@gmail.com"]);

export const adminErrorLog = functions.onRequest(
  {
    cors: true,
    region: "asia-east1",
    invoker: "public",
    maxInstances: 2,
    timeoutSeconds: 30,
    memory: "256MiB",
    concurrency: 5,
  },
  async (req, res) => {
    try {
      const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      if (!idToken) { res.status(401).json({ error: "missing_auth" }); return; }
      const decoded = await admin.auth().verifyIdToken(idToken);
      if (!OWNER_EMAILS.has(decoded.email || "")) { res.status(403).json({ error: "not_owner" }); return; }

      const hours = Math.min(168, Math.max(1, Number(req.body?.hours || 48)));
      const since = new Date(Date.now() - hours * 3600000).toISOString();

      const logging = new Logging();
      const [entries] = await logging.getEntries({
        filter: `severity>=ERROR AND resource.type="cloud_run_revision" AND timestamp>="${since}"`,
        orderBy: "timestamp desc",
        pageSize: 50,
      });

      const items = entries.map((e) => {
        const m = e.metadata as Record<string, unknown> & {
          timestamp?: unknown; severity?: unknown;
          resource?: { labels?: Record<string, string> };
        };
        const payload = typeof e.data === "string" ? e.data : JSON.stringify(e.data);
        return {
          timestamp: m.timestamp || null,
          severity: m.severity || "ERROR",
          service: (m.resource?.labels?.service_name as string) || "",
          message: (payload || "").slice(0, 1000),
        };
      });

      res.json({ ok: true, hours, count: items.length, items });
    } catch (err) {
      console.error("adminErrorLog error:", err);
      // logging.viewer 權限不足時也走這裡 → 回明確訊息提示補權限
      res.status(500).json({ error: "internal", message: String(err) });
    }
  },
);
