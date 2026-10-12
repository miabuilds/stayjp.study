// 新人限時 9 折的資格判定(後端唯一真相;createPayment 與 newbieOffer 共用)。規則見 constants.ts NEWBIE。
import * as admin from "firebase-admin";
import { newbieUntil } from "./constants";

/** 這個帳號有沒有成功付過錢(任何管道、金額 > 0;退費過的也算付過 → 不再是新人) */
async function hasPaidBefore(uid: string): Promise<boolean> {
  const snap = await admin.firestore().collection("transactions").where("uid", "==", uid).get();
  return snap.docs.some((d) => {
    const t = d.data();
    return t.is_sandbox !== true && Number(t.amount_twd) > 0 && (t.status === "success" || t.status === "refunded");
  });
}

/** 回傳 { until }:until > now 才算有新人價;0 = 沒有。查不到/出錯一律 0(fail-closed:錢不會少收)。 */
export async function getNewbieOffer(uid: string, now = Date.now()): Promise<{ until: number }> {
  try {
    const u = await admin.auth().getUser(uid);
    const created = Date.parse(u.metadata.creationTime || "") || 0;
    const until = newbieUntil(created, now);
    if (until <= now) return { until: 0 };
    if (await hasPaidBefore(uid)) return { until: 0 };
    return { until };
  } catch (e) {
    console.warn("[newbie] 判定失敗,當作沒有新人價:", e);
    return { until: 0 };
  }
}
