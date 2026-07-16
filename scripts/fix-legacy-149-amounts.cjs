#!/usr/bin/env node
/**
 * fix-legacy-149-amounts.cjs
 * ─────────────────────────────────────────────────────────────────────────────
 * 修正「早期綠界月費 149 老用戶」被誤記成 150 的歷史『續扣』交易金額。
 *
 * 背景：綠界(ECPay)定期定額的「續扣」回呼不帶 TradeAmt，舊版 ecpay-callback 因此
 *      fallback 到現行牌價 150，導致早期實扣 149 的老用戶，其『續扣』交易被記成 150。
 *      （初次訂閱那筆帶 TradeAmt → 記的是正確的 149；分潤只算首筆 → 分潤金額不受影響。）
 *
 * 判定方式（資料自我識別，不需人工提供名單）：
 *   一個 uid 的綠界月費交易若「存在至少一筆 amount_twd === 149」，代表他是 149 鎖價老用戶；
 *   那麼他歷史上任何 amount_twd === 150 的綠界月費 subscribe/renew，就是被誤記的 → 應改回 149。
 *   （只有 149 的、或只有 150 的用戶都不動：只有 150 的是後來的新用戶，本來就是 150。）
 *
 * 安全：預設 DRY-RUN（只印出將變更的內容，不寫入）。加 --commit 才會真的寫。
 *      每筆修正會寫審計欄位 _amount_fixed_from / _amount_fixed_at 便於回溯。
 *      不碰 commissions（首筆金額正確，分潤不受影響）；只列出可疑 commission 供人工檢查。
 *      不碰 Apple/Google(app) 交易；不碰 is_sandbox 測試交易。
 *
 * 用法：
 *   # 認證（擇一）：
 *   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccount.json
 *   #   或  node fix-legacy-149-amounts.cjs --key /path/to/serviceAccount.json
 *
 *   node scripts/fix-legacy-149-amounts.cjs                 # DRY-RUN，只看報告
 *   node scripts/fix-legacy-149-amounts.cjs --commit        # 實際寫入修正
 *
 * 選項：
 *   --commit            真的寫入（否則 dry-run）
 *   --key <path>        service account JSON 路徑（否則用 GOOGLE_APPLICATION_CREDENTIALS / ADC）
 *   --project <id>      GCP 專案 ID（預設 jpnote-1bdd6）
 *   --wrong <n>         被誤記的金額（預設 150）
 *   --right <n>         正確金額（預設 149）
 * ─────────────────────────────────────────────────────────────────────────────
 */
'use strict';

const admin = require('firebase-admin');

// ── args ──
const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const val = (f, d) => { const i = argv.indexOf(f); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };
const COMMIT = has('--commit');
const KEY = val('--key', null);
const PROJECT = val('--project', 'jpnote-1bdd6');
const WRONG = Number(val('--wrong', '150'));
const RIGHT = Number(val('--right', '149'));

// ── init admin ──
try {
  if (KEY) admin.initializeApp({ credential: admin.credential.cert(require(require('path').resolve(KEY))), projectId: PROJECT });
  else admin.initializeApp({ projectId: PROJECT }); // 用 GOOGLE_APPLICATION_CREDENTIALS / ADC
} catch (e) {
  console.error('初始化 firebase-admin 失敗：', e.message);
  console.error('請設 GOOGLE_APPLICATION_CREDENTIALS 或用 --key 指定 service account JSON。');
  process.exit(1);
}
const db = admin.firestore();

function fmtTs(ts) {
  try { return ts && ts.toDate ? ts.toDate().toISOString().slice(0, 10) : '—'; } catch { return '—'; }
}
function isWebMonthly(x) {
  // 綠界月費：plan=monthly、非 app 來源、金流是 ecpay、非沙盒
  return x && x.plan === 'monthly' && x.source !== 'app'
    && (x.payment_method === 'ecpay' || x.payment_method == null)
    && !x.is_sandbox;
}
function isRevenueType(x) {
  return x && x.status === 'success' && (x.type === 'subscribe' || x.type === 'renew');
}

async function main() {
  console.log(`\n=== fix-legacy-149-amounts (${COMMIT ? 'COMMIT ⚠️' : 'DRY-RUN'}) project=${PROJECT} wrong=${WRONG}→right=${RIGHT} ===\n`);

  // 只用單欄位 where 避免複合索引需求，其餘在程式內過濾
  const snap = await db.collection('transactions').where('plan', '==', 'monthly').get();
  console.log(`讀到 plan=monthly 交易 ${snap.size} 筆，過濾綠界月費營收交易中…`);

  // 依 uid 分組
  const byUid = new Map();
  snap.forEach((doc) => {
    const x = doc.data();
    if (!isWebMonthly(x) || !isRevenueType(x)) return;
    const uid = x.uid || '(no-uid)';
    if (!byUid.has(uid)) byUid.set(uid, []);
    byUid.get(uid).push({ id: doc.id, ref: doc.ref, x });
  });

  const toFix = [];       // 要改的交易
  let legacyUsers = 0;
  for (const [uid, txns] of byUid) {
    const has149 = txns.some((t) => Number(t.x.amount_twd) === RIGHT);
    if (!has149) continue;                       // 沒有 149 記錄 → 不是老用戶，跳過
    legacyUsers++;
    const wrong = txns.filter((t) => Number(t.x.amount_twd) === WRONG);
    for (const t of wrong) toFix.push({ uid, ...t });
  }

  console.log(`\n識別到 149 鎖價老用戶 ${legacyUsers} 人；其中被誤記成 ${WRONG} 的續扣交易 ${toFix.length} 筆。\n`);
  if (toFix.length) {
    console.log('將修正的交易（uid / 交易ID / 日期 / 類型 / 金額）：');
    toFix.forEach((t) => console.log(`  ${t.uid.slice(0, 10)}  ${t.id}  ${fmtTs(t.x.occurred_at)}  ${t.x.type}  ${WRONG}→${RIGHT}`));
  }

  // 可疑 commissions（理論上應為 0，因分潤只算首筆且首筆金額正確）→ 只列出供人工檢查，不自動改
  const cSnap = await db.collection('commissions').where('plan', '==', 'monthly').get();
  const suspectC = [];
  cSnap.forEach((doc) => { const c = doc.data(); if (c.source !== 'app' && Number(c.gross_twd) === WRONG) suspectC.push(doc.id); });
  if (suspectC.length) {
    console.log(`\n⚠️  發現 ${suspectC.length} 筆綠界月費 commission 的 gross_twd=${WRONG}（理論上不該有，請人工檢查是否需調整）：`);
    suspectC.forEach((id) => console.log(`  commissions/${id}`));
  } else {
    console.log('\ncommissions 檢查：無綠界月費 gross_twd=' + WRONG + ' 的可疑紀錄（符合預期，分潤不受影響）。');
  }

  if (!COMMIT) {
    console.log(`\nDRY-RUN 結束：未寫入任何資料。確認無誤後加 --commit 執行實際修正。\n`);
    return;
  }
  if (!toFix.length) { console.log('\n沒有需要修正的交易。\n'); return; }

  // 分批寫入（Firestore batch 上限 500，取 400 保險）
  let done = 0;
  for (let i = 0; i < toFix.length; i += 400) {
    const batch = db.batch();
    const chunk = toFix.slice(i, i + 400);
    chunk.forEach((t) => batch.update(t.ref, {
      amount_twd: RIGHT,
      _amount_fixed_from: WRONG,
      _amount_fixed_at: admin.firestore.FieldValue.serverTimestamp(),
      _amount_fixed_reason: 'legacy-149-ecpay-recurring',
    }));
    await batch.commit();
    done += chunk.length;
    console.log(`已寫入 ${done}/${toFix.length}`);
  }
  console.log(`\n✅ 完成：修正 ${done} 筆交易 ${WRONG}→${RIGHT}。\n`);
}

main().then(() => process.exit(0)).catch((e) => { console.error('執行失敗：', e); process.exit(1); });
