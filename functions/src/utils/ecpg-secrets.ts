// 綁卡(站內付 2.0)專用 secret 宣告。
//
// ⚠️ 為什麼要獨立一個檔:defineSecret() 是在「模組載入時」就註冊的,
//    不是等到有 function 用到才註冊。只要它被載入,firebase deploy 就會問你要值,
//    問不到就卡住整個部署 —— 即使沒有任何 function 真的用它。
//    綁卡功能目前沒開通(綠界站內付 2.0 要年費),所以這三個 secret 不存在,
//    放在 constants.ts 會害每次部署都卡在「Enter a value for ECPG_MERCHANT_ID」。
//    獨立成這支、只被 ecpg-*.ts 匯入,而 ecpg-*.ts 沒有從 index.ts 匯出 → 永遠不會被載入。
import { defineSecret } from "firebase-functions/params";
import { ECPAY_SECRETS, INVOICE_SECRET_NAMES } from "./constants";

export const ECPG_SECRETS = [
  defineSecret("ECPG_MERCHANT_ID"),
  defineSecret("ECPG_HASH_KEY"),
  defineSecret("ECPG_HASH_IV"),
  ...ECPAY_SECRETS,
  ...INVOICE_SECRET_NAMES,
];
