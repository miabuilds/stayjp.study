// PayPal Orders API 薄封裝(Node 22 內建 global fetch / Buffer)。
// 流程:server 建單(custom_id 綁 uid:plan、server 定價防竄改)→ 前端 SDK 讓使用者授權
//       → server 捕捉(capture)成功的當下就開通訂閱。
import { paypalConfig, paypalApiBase } from "./constants";

async function accessToken(): Promise<string> {
  const { clientId, secret } = paypalConfig();
  if (!secret) throw new Error("PAYPAL_CLIENT_SECRET 未設定");
  const basic = Buffer.from(`${clientId}:${secret}`).toString("base64");
  const r = await fetch(`${paypalApiBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!r.ok) throw new Error(`paypal token ${r.status}: ${await r.text()}`);
  const d = (await r.json()) as { access_token: string };
  return d.access_token;
}

// 建單:custom_id = `${uid}:${plan}`(127 字內),金額由 server 決定。回 order id。
export async function createPaypalOrder(opts: {
  uid: string;
  plan: string;
  amountUsd: number;
}): Promise<string> {
  const token = await accessToken();
  const r = await fetch(`${paypalApiBase()}/v2/checkout/orders`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: { currency_code: "USD", value: opts.amountUsd.toFixed(2) },
          custom_id: `${opts.uid}:${opts.plan}`,
          description: `StayJP ${opts.plan}`,
        },
      ],
    }),
  });
  const d = (await r.json()) as { id?: string };
  if (!r.ok || !d.id) throw new Error(`paypal create ${r.status}: ${JSON.stringify(d)}`);
  return d.id;
}

export interface CaptureResult {
  status: string; // "COMPLETED" 才算成功
  captureId: string;
  customId: string; // `${uid}:${plan}`
  amountUsd: number;
  payerEmail: string;
}

// 捕捉訂單(實際扣款)。回捕捉結果,呼叫端據此開通。
export async function capturePaypalOrder(orderId: string): Promise<CaptureResult> {
  const token = await accessToken();
  const r = await fetch(`${paypalApiBase()}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  const d = (await r.json()) as Record<string, unknown>;
  if (!r.ok) throw new Error(`paypal capture ${r.status}: ${JSON.stringify(d)}`);
  const pu = (d.purchase_units as Array<Record<string, unknown>>)?.[0] || {};
  const cap = ((pu.payments as Record<string, unknown>)?.captures as Array<Record<string, unknown>>)?.[0] || {};
  const amt = (cap.amount as { value?: string })?.value;
  return {
    status: String(d.status || ""),
    captureId: String(cap.id || ""),
    customId: String(cap.custom_id || (pu as { custom_id?: string }).custom_id || ""),
    amountUsd: parseFloat(amt || "0"),
    payerEmail: String((d.payer as { email_address?: string })?.email_address || ""),
  };
}

// 全額退款(退指定 capture)。空 body = 全額退。回 refund id。
export async function refundPaypalCapture(captureId: string): Promise<string> {
  const token = await accessToken();
  const r = await fetch(`${paypalApiBase()}/v2/payments/captures/${captureId}/refund`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: "{}",
  });
  const d = (await r.json()) as { id?: string; status?: string };
  if (!r.ok || (d.status && d.status !== "COMPLETED")) {
    throw new Error(`paypal refund ${r.status}: ${JSON.stringify(d)}`);
  }
  return String(d.id || "");
}
