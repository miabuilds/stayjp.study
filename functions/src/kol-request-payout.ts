// HTTP function:KOL 線上簽署佣金協議 + 申請領款。
//
// 前端(kol-payout.html)在瀏覽器把「已填欄位 + 手寫簽名」的協議 render 成 PDF(html2canvas→jsPDF,
// 純用瀏覽器內建 CJK 字型,免在後端塞中文字型),連同法定姓名 / 收款帳戶一起 POST 過來。
//
// 這支做三件事:
//   ① 驗 code + token(沿用 ref_codes/{CODE}.token,免登入)
//   ② 算目前可領金額(commissions 非 void/paid 加總)
//   ③ 把 PDF email 給營運方(= 離線存底 + 通知你要領款)+ 寫 payout_requests 供後台清單
//
// 隱私:身分證字號 / 戶籍地址「只在 PDF(email 附件)」裡,不寫進 Firestore。
//        Firestore 只留 姓名 / 帳戶末四碼 / 金額 / 狀態,降個資風險。
// 穩健:就算寄信失敗,仍照寫 payout_requests(email_sent:false)→ 後台仍看得到請款,不漏單。

import * as functions from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import * as admin from "firebase-admin";
import { db } from "./utils/firestore";
import * as nodemailer from "nodemailer";

if (admin.apps.length === 0) admin.initializeApp();

// 寄件帳號 = app 密碼所屬的 Gmail(stayjpplan 無法產 app 密碼 → 改用 abc83327 寄件);
// 收件 = 實際看信的信箱(stayjpplan)。兩者可不同:SMTP 驗證看寄件帳號,信寄到收件帳號。
const MAIL_ACCOUNT = "abc83327@gmail.com";   // 寄件+SMTP 驗證(GMAIL_APP_PASSWORD 是這個帳號產的)
const NOTIFY_TO = "stayjpplan@gmail.com";    // 收領款通知/PDF 存底的信箱
const GMAIL_APP_PASSWORD = defineSecret("GMAIL_APP_PASSWORD");

export const kolRequestPayout = functions.onRequest(
  {
    cors: true,
    region: "asia-east1",
    invoker: "public",
    maxInstances: 2,
    timeoutSeconds: 60,
    memory: "256MiB",
    concurrency: 5,
    secrets: [GMAIL_APP_PASSWORD],
  },
  async (req, res) => {
    try {
      if (req.method !== "POST") { res.status(405).json({ error: "method_not_allowed" }); return; }
      const b = req.body || {};
      const code = String(b.code || "").toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 32);
      const token = String(b.t || "");
      const holderName = String(b.holder_name || "").replace(/[<>]/g, "").slice(0, 60).trim();
      const account = String(b.account || "").replace(/[<>]/g, "").slice(0, 160).trim();
      const pdfRaw = String(b.pdf_b64 || "");
      if (!code || !token) { res.status(400).json({ error: "missing_params" }); return; }
      if (!holderName || !account) { res.status(400).json({ error: "missing_fields", reason: "請填法定姓名與收款帳戶。" }); return; }

      // ① token 驗證(沿用 kolStats 同一套)
      const codeDoc = await db.doc(`ref_codes/${code}`).get();
      const c = codeDoc.data();
      if (!codeDoc.exists || !c || c.token !== token || c.active === false) {
        res.status(403).json({ error: "invalid_code_or_token" }); return;
      }

      // PDF 檢查:去掉 data URI 前綴、確認是 PDF(%PDF- 的 base64 = JVBERi0)、大小上限
      const pdfB64 = pdfRaw.replace(/^data:application\/pdf;base64,/, "").replace(/\s/g, "");
      if (!/^JVBERi0/.test(pdfB64)) { res.status(400).json({ error: "bad_pdf" }); return; }
      const pdfBuf = Buffer.from(pdfB64, "base64");
      if (pdfBuf.length < 1000 || pdfBuf.length > 8 * 1024 * 1024) { res.status(400).json({ error: "pdf_size" }); return; }

      // ② 目前可領金額 = 非 void、非 paid 的 commissions 加總
      const cs = await db.collection("commissions").where("code", "==", code).get();
      let claimable = 0, count = 0;
      cs.forEach((d) => {
        const x = d.data();
        if (x.state !== "void" && x.state !== "paid") { claimable += Number(x.amount_twd) || 0; count++; }
      });
      claimable = Math.round(claimable);

      const kol = String(c.kol || code);
      const now = Date.now();
      const acctMask = account.length > 4 ? "****" + account.slice(-4) : account;
      const signedAtStr = new Date(now).toLocaleString("zh-TW", { timeZone: "Asia/Taipei" });

      // ③a 寄 email(PDF 附件)= 離線存底 + 通知
      let emailSent = false, emailErr = "";
      try {
        const transport = nodemailer.createTransport({
          service: "gmail",
          auth: { user: MAIL_ACCOUNT, pass: GMAIL_APP_PASSWORD.value() },
        });
        await transport.sendMail({
          from: `StayJP 領款系統 <${MAIL_ACCOUNT}>`,
          to: NOTIFY_TO,
          subject: `[StayJP 領款申請] ${kol}（${code}）— 約 NT$${claimable}`,
          text:
            `有 KOL 線上簽署佣金協議並申請領款：\n\n` +
            `KOL：${kol}（推薦碼 ${code}）\n` +
            `法定姓名：${holderName}\n` +
            `收款帳戶：${account}\n` +
            `目前可領：約 NT$${claimable}（${count} 筆未作廢分潤）\n` +
            `簽署時間：${signedAtStr}\n\n` +
            `已簽署的佣金協議見附件 PDF（含身分證字號／戶籍地址，報稅開扣繳憑單用；請妥善保管、勿外流）。\n` +
            `確認金額無誤後即可轉帳；記得單次撥款壓在 NT$20,000 以內免扣繳。`,
          attachments: [{ filename: `佣金協議_${code}_${now}.pdf`, content: pdfBuf, contentType: "application/pdf" }],
        });
        emailSent = true;
      } catch (e) {
        emailErr = String((e as Error).message || e).slice(0, 300);
        console.error("kolRequestPayout mail error:", emailErr);
      }

      // ③b 寫請款紀錄(後台清單)—— 不含身分證/地址
      await db.doc(`payout_requests/${code}_${now}`).set({
        code, kol, holder_name: holderName, account_masked: acctMask,
        amount_snapshot: claimable, commission_count: count,
        signed_at: now, status: "requested",
        email_sent: emailSent, email_error: emailErr,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
      });

      res.json({ ok: true, emailSent, amount: claimable });
    } catch (err) {
      console.error("kolRequestPayout error:", err);
      res.status(500).json({ error: "internal", message: String(err) });
    }
  },
);
