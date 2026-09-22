// HTTP function:綁卡第二步 — 前端 JS SDK 收完卡號拿到 BindCardPayToken,送來後端建立綁卡。
//
// 回應有兩種分支,兩種都要處理:
//   A. ThreeDInfo.ThreeDURL 非空 → 前端必須把人導去那個 URL 做 3D 驗證(2025/8 起幾乎一定走這條)。
//      驗完綠界會 Form POST 到 OrderResultURL(ecpg-bind-result)。
//   B. ThreeDURL 空 + RtnCode === 1 → 當場就綁好了(罕見),一樣等 OrderResultURL 落地寫入。
// ⚠️ 少判 A 這條分支 = 交易卡在那裡逾時失敗,是官方文件點名的頭號地雷。

import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { ecpgConfig } from "./utils/constants";
import { ECPG_SECRETS } from "./utils/ecpg-secrets";
import { ecpgPost, ecpgHost } from "./utils/ecpg";

if (admin.apps.length === 0) admin.initializeApp();

type BindResp = { ThreeDInfo?: { ThreeDURL?: string }; BindCardID?: string };

export const ecpgBindCreate = functions.onRequest(
  {
    secrets: ECPG_SECRETS, cors: true, region: "asia-east1", invoker: "public",
    maxInstances: 10, timeoutSeconds: 30, memory: "256MiB", concurrency: 40,
  },
  async (req, res) => {
    try {
      if (req.method !== "POST") { res.status(405).json({ error: "method_not_allowed" }); return; }

      const idToken = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      if (!idToken) { res.status(401).json({ error: "missing_auth" }); return; }
      const uid = (await admin.auth().verifyIdToken(idToken)).uid;

      const payToken = String(req.body?.bindCardPayToken || "").trim();
      const tradeNo = String(req.body?.tradeNo || "").trim();
      if (!payToken || !tradeNo) { res.status(400).json({ error: "missing_params" }); return; }

      // 預單必須是這個人自己開的 → 擋掉拿別人單號來綁的情況
      const db = admin.firestore();
      const bindSnap = await db.doc("ecpg_binds/" + tradeNo).get();
      if (!bindSnap.exists || bindSnap.data()?.uid !== uid) {
        res.status(403).json({ error: "order_not_yours" }); return;
      }

      const env = ecpgConfig();
      const r = await ecpgPost<BindResp>(
        ecpgHost(env) + "/Merchant/CreateBindCard",
        { BindCardPayToken: payToken, MerchantMemberID: uid.slice(0, 60) },
        env,
      );

      const threeD = r.data?.ThreeDInfo?.ThreeDURL || "";
      if (threeD) {
        await db.doc("ecpg_binds/" + tradeNo).set({ status: "3d_pending" }, { merge: true });
        res.json({ ok: true, threeDUrl: threeD });   // 前端導過去,之後由 OrderResultURL 落地
        return;
      }
      if (!r.ok) {
        console.error("CreateBindCard 失敗", r);
        await db.doc("ecpg_binds/" + tradeNo).set(
          { status: "failed", fail_code: r.rtnCode ?? null, fail_msg: r.rtnMsg || r.error || null }, { merge: true });
        res.status(502).json({ error: "bind_failed", reason: r.rtnMsg || r.error }); return;
      }
      res.json({ ok: true, threeDUrl: "" });
    } catch (err) {
      console.error("ecpgBindCreate error:", err);
      res.status(500).json({ error: "internal", message: String(err) });
    }
  },
);
