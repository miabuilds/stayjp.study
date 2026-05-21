#!/usr/bin/env node
// 從 GA4 抓 newUsers 同步到 Firestore stats/global.learners。
// 用 service account 雙邊驗證（同一把 key 同時授權 GA + Firestore）。
//
// 必填環境變數：
//   GCP_SA_KEY        service account JSON 內容（一整塊字串）
//   GA4_PROPERTY_ID   GA4 property ID（純數字，例如 467012345）
//
// 可選：
//   GA_START_DATE     起算日（預設 2025-01-01；不要寫太早避免拉到歷史測試噪音）

import { BetaAnalyticsDataClient } from '@google-analytics/data';
import admin from 'firebase-admin';

const saJsonRaw = process.env.GCP_SA_KEY;
const propertyId = process.env.GA4_PROPERTY_ID;
if (!saJsonRaw) { console.error('Missing GCP_SA_KEY'); process.exit(1); }
if (!propertyId) { console.error('Missing GA4_PROPERTY_ID'); process.exit(1); }

const credentials = JSON.parse(saJsonRaw);
const startDate = process.env.GA_START_DATE || '2025-01-01';

// 1) GA4: 拉 newUsers 累計
const ga = new BetaAnalyticsDataClient({ credentials });
const [response] = await ga.runReport({
  property: `properties/${propertyId}`,
  dateRanges: [{ startDate, endDate: 'today' }],
  metrics: [{ name: 'newUsers' }],
});

const newUsers = parseInt(response.rows?.[0]?.metricValues?.[0]?.value || '0', 10);
console.log(`GA newUsers (${startDate}~today): ${newUsers}`);

if (!Number.isFinite(newUsers) || newUsers <= 0) {
  console.error('Got invalid newUsers, aborting');
  process.exit(1);
}

// 2) Firestore: 覆寫 stats/global.learners
admin.initializeApp({ credential: admin.credential.cert(credentials) });
const db = admin.firestore();
const ref = db.collection('stats').doc('global');
const before = (await ref.get()).data()?.learners;
await ref.set({ learners: newUsers, lastSyncedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
console.log(`Firestore stats/global.learners: ${before} → ${newUsers}`);
