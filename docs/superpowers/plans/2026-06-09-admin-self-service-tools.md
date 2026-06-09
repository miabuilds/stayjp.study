# Admin 自助工具 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development 或 executing-plans。Steps 用 `- [ ]`。

**Goal:** 在 owner-only 後台新增「手動訂閱管理」與「報錯 log」兩工具，owner 可用手機操作。

**Architecture:** 沿用既有「owner-only Cloud Function + admin.html 分頁」模式。訂閱寫入走共用 helper（Plan 1 上線後自動跟搬）。報錯用 @google-cloud/logging 撈 severity>=ERROR。

**Tech Stack:** Firebase Functions v2 (TS, Node22)、@google-cloud/logging、admin.html (vanilla)、firebase compat SDK。

**驗證：** functions `npm run build`（tsc）；部署後 owner 帳號實測（含手機）。

---

## Task 1: adminSetSubscription 函數

**Files:**
- Create: `functions/src/admin-set-subscription.ts`
- Modify: `functions/src/index.ts`（加 export）

- [ ] **Step 1: 建函數**（owner-only，set/cancel/extend，走共用 helper，每動作寫 transaction）

```ts
import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { PLANS, PlanKey } from "./utils/constants";
import {
  getSubscription, writeSubscription, patchSubscription, writeTransaction,
  nowMs, SubscriptionDoc,
} from "./utils/firestore";

if (admin.apps.length === 0) admin.initializeApp();
const OWNER_EMAILS = new Set(["stayjpplan@gmail.com", "abc83327@gmail.com"]);

export const adminSetSubscription = functions.onRequest(
  { cors: true, region: "asia-east1", invoker: "public", maxInstances: 2, timeoutSeconds: 30, memory: "256MiB", concurrency: 10 },
  async (req, res) => {
    try {
      const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      if (!idToken) { res.status(401).json({ error: "missing_auth" }); return; }
      const decoded = await admin.auth().verifyIdToken(idToken);
      if (!OWNER_EMAILS.has(decoded.email || "")) { res.status(403).json({ error: "not_owner" }); return; }

      const action = String(req.body?.action || "");
      const email = String(req.body?.email || "").trim().toLowerCase();
      if (!email) { res.status(400).json({ error: "missing_email" }); return; }

      let uid: string;
      try { uid = (await admin.auth().getUserByEmail(email)).uid; }
      catch { res.status(404).json({ error: "user_not_found", reason: `找不到 ${email}(對方需先登入過本站)` }); return; }

      if (action === "set") {
        const plan = String(req.body?.plan || "") as PlanKey;
        if (!PLANS[plan]) { res.status(400).json({ error: "invalid_plan" }); return; }
        const raw = req.body?.expiresAt;
        const expiresAt = typeof raw === "number" ? raw : (raw ? new Date(String(raw)).getTime() : 0);
        if (!expiresAt || isNaN(expiresAt)) { res.status(400).json({ error: "invalid_expiresAt" }); return; }
        const existing = await getSubscription(uid);
        const sub: SubscriptionDoc = {
          source: "web", plan, status: "active", expiresAt,
          willRenew: plan !== "lifetime", startedAt: existing?.startedAt || nowMs(),
          is_early_bird: plan === "yearly_early_bird" || existing?.is_early_bird === true,
          failed_retries: 0,
        };
        await writeSubscription(uid, sub);
        await writeTransaction({ uid, type: "gift", source: "web", plan, amount_twd: 0, payment_method: "manual", external_id: `admin-set-${nowMs()}`, status: "success", note: `manual admin set by ${decoded.email}` });
      } else if (action === "cancel") {
        await patchSubscription(uid, { status: "cancelled", willRenew: false });
        await writeTransaction({ uid, type: "cancel", source: "web", plan: "n/a", amount_twd: 0, payment_method: "manual", external_id: `admin-cancel-${nowMs()}`, status: "success", note: `manual admin cancel by ${decoded.email}` });
      } else if (action === "extend") {
        const days = Number(req.body?.days || 0);
        if (!days || days <= 0) { res.status(400).json({ error: "invalid_days" }); return; }
        const existing = await getSubscription(uid);
        if (!existing) { res.status(404).json({ error: "no_subscription" }); return; }
        const base = Math.max(nowMs(), existing.expiresAt || 0);
        await patchSubscription(uid, { expiresAt: base + days * 86400000 });
        await writeTransaction({ uid, type: "gift", source: "web", plan: existing.plan, amount_twd: 0, payment_method: "manual", external_id: `admin-extend-${nowMs()}`, status: "success", note: `manual extend ${days}d by ${decoded.email}` });
      } else {
        res.status(400).json({ error: "invalid_action" }); return;
      }

      const after = await getSubscription(uid);
      res.json({ ok: true, uid, email, subscription: after });
    } catch (err) {
      console.error("adminSetSubscription error:", err);
      res.status(500).json({ error: "internal", message: String(err) });
    }
  },
);
```

- [ ] **Step 2: index.ts 加 export**

`export { adminSetSubscription } from "./admin-set-subscription";`

- [ ] **Step 3: build**

Run: `cd functions && npm run build` — Expected: tsc 無錯。

- [ ] **Step 4: Commit**

```bash
git add functions/src/admin-set-subscription.ts functions/src/index.ts
git commit -m "feat(functions): adminSetSubscription (set/cancel/extend, owner-only)"
```

---

## Task 2: adminErrorLog 函數

**Files:**
- Create: `functions/src/admin-error-log.ts`
- Modify: `functions/src/index.ts`、`functions/package.json`（加依賴）

- [ ] **Step 1: 裝依賴**

Run: `cd functions && npm install @google-cloud/logging` — Expected: package.json 出現 @google-cloud/logging。

- [ ] **Step 2: 建函數**

```ts
import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { Logging } from "@google-cloud/logging";

if (admin.apps.length === 0) admin.initializeApp();
const OWNER_EMAILS = new Set(["stayjpplan@gmail.com", "abc83327@gmail.com"]);

export const adminErrorLog = functions.onRequest(
  { cors: true, region: "asia-east1", invoker: "public", maxInstances: 2, timeoutSeconds: 30, memory: "256MiB", concurrency: 5 },
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
        const m = e.metadata;
        const payload = typeof e.data === "string" ? e.data : JSON.stringify(e.data);
        return {
          timestamp: m.timestamp,
          severity: m.severity,
          service: (m.resource?.labels?.service_name as string) || "",
          message: (payload || "").slice(0, 1000),
        };
      });
      res.json({ ok: true, hours, count: items.length, items });
    } catch (err) {
      console.error("adminErrorLog error:", err);
      res.status(500).json({ error: "internal", message: String(err) });
    }
  },
);
```

- [ ] **Step 3: index.ts 加 export**

`export { adminErrorLog } from "./admin-error-log";`

- [ ] **Step 4: build**

Run: `cd functions && npm run build` — Expected: tsc 無錯。

- [ ] **Step 5: Commit**

```bash
git add functions/src/admin-error-log.ts functions/src/index.ts functions/package.json functions/package-lock.json
git commit -m "feat(functions): adminErrorLog (Cloud Logging severity>=ERROR, owner-only)"
```

---

## Task 3: admin.html 兩個分頁

**Files:**
- Modify: `admin.html`（加 tab 按鈕、panel、FN 常數、fetch handlers）

- [ ] **Step 1: 加分頁按鈕**（在現有 tab 列 `tabFeedback/tabStats/tabSubs/tabLedger` 後）

```html
<button id="tabSetSub"> 訂閱管理</button>
<button id="tabErrLog"> 報錯</button>
```

- [ ] **Step 2: 加兩個 panel + FN 常數 + handlers**（沿用既有 `fetch(FN, {headers:{Authorization:'Bearer '+t}})` 模式；參考 admin.html:528-623 free-access 區塊）

訂閱管理 panel：email input、plan `<select>`(monthly/yearly/yearly_early_bird/lifetime)、到期日 `<input type=date>`、延長天數 input、三顆按鈕(設定/延長/取消，cancel 與 set 前 `confirm()`)。送 `{action,email,plan,expiresAt,days}` 到 `FN_SET_SUB`，回顯 `subscription`。

報錯 panel：時間範圍 `<select>`(24/48/168 h)、刷新鈕；送 `{hours}` 到 `FN_ERR_LOG`，渲染 `items` 為時間倒序清單(severity 紅標、service、message、timestamp)。

```js
const FN_SET_SUB = 'https://asia-east1-jpnote-1bdd6.cloudfunctions.net/adminSetSubscription';
const FN_ERR_LOG = 'https://asia-east1-jpnote-1bdd6.cloudfunctions.net/adminErrorLog';
```

CSS：沿用既有變數；新 panel 單欄、按鈕 `min-height:44px`、input `width:100%`（手機友善）。

- [ ] **Step 3: 本地開瀏覽器目視（手機尺寸）**

Run: `open admin.html`（或 `firebase emulators:start --only hosting`，port 5002）；DevTools 切手機寬度，確認分頁可點、表單單欄不爆版。

- [ ] **Step 4: Commit**

```bash
git add admin.html
git commit -m "feat(admin): 訂閱管理 + 報錯 log 分頁(手機友善)"
```

---

## Task 4: 部署 + 實測

- [ ] **Step 1: 部署**

Run: `firebase deploy --only functions:adminSetSubscription,functions:adminErrorLog,hosting --project jpnote-1bdd6`
Expected: Deploy complete。

- [ ] **Step 2: owner 實測訂閱管理**

admin 登入 → 訂閱管理 → 用一個測試 email `set` monthly 到某日 → 回顯 active。`extend` 7 天 → expiresAt +7d。`cancel` → cancelled。

- [ ] **Step 3: 實測報錯 log（驗 logging 權限）**

報錯分頁 → 48h → 應列出近期 ERROR（含 🚨 SUBSCRIPTION WRITE FAILED 若有）。
若回 403/permission → 補授 runtime SA `roles/logging.viewer`（Console → IAM，或 gcloud），重測。

---

## Self-Review

- Spec 覆蓋：元件1=Task1+Task3，元件2=Task2+Task3，部署/權限=Task4 ✔。
- Placeholder：admin.html handler 描述為主（依現有區塊照抄結構），無假碼殘留。
- 型別一致：sub 用 `SubscriptionDoc`；transaction 用既有 `TxnType`（gift/cancel）；helper 名稱與 firestore.ts 一致。
