// Cloud Functions entry — export 所有 HTTP / scheduled functions
//
// 部署:`pnpm deploy` (or `firebase deploy --only functions`)
// 部署前先設環境變數:
//   firebase functions:secrets:set ECPAY_MERCHANT_ID
//   firebase functions:secrets:set ECPAY_HASH_KEY
//   firebase functions:secrets:set ECPAY_HASH_IV
//   firebase functions:secrets:set ECPAY_PRODUCTION
//   firebase functions:secrets:set SITE_ORIGIN
//   firebase functions:secrets:set REVENUECAT_WEBHOOK_SECRET

export { createPayment } from "./create-payment";
export { ecpayCallback } from "./ecpay-callback";
export { ecpayReturn } from "./ecpay-return";
export { refund } from "./refund";
export { cancelSubscription } from "./cancel-subscription";
export { precheck } from "./precheck-http";
export { chargeback } from "./chargeback";
export { revenuecatWebhook } from "./revenuecat-webhook";
export { dailyRetryCron } from "./daily-retry-cron";
export { adminResetBilling } from "./admin-reset-billing";
export { adminListSubscribers } from "./admin-list-subscribers";
export { adminGaStats } from "./admin-ga-stats";
export { adminUnblockUser } from "./admin-unblock-user";
export { adminUserStats } from "./admin-user-stats";
export { kolStats } from "./kol-stats";
export { validateRefCode } from "./validate-ref-code";
export { getMyRefCode } from "./get-my-ref-code";
export { partnerJoin } from "./partner-join";
export { commissionLockCron } from "./commission-lock-cron";
export { adminSettleKolPayout } from "./admin-settle-kol-payout";
export { dailySubAuditCron } from "./daily-sub-audit-cron";
export { adminFreeAccess } from "./admin-free-access";
export { adminCleanupPending } from "./admin-cleanup-pending";
export { adminRecomputeEarlyBird } from "./admin-recompute-earlybird";
export { adminSetSubscription } from "./admin-set-subscription";
export { adminErrorLog } from "./admin-error-log";
export { deleteAccount } from "./delete-account";
export { mintCustomToken } from "./mint-custom-token";
export { paypalCreateOrder } from "./paypal-create-order";
export { paypalCaptureOrder } from "./paypal-capture-order";
export { paypalRefund } from "./paypal-refund";
export { paymentHealth } from "./payment-health";

export { adminPurgeTest } from "./admin-purge-test";

export { rcSyncSubscription } from "./rc-sync-subscription";
export { startTrial } from "./start-trial";
export { trialEmailCron } from "./trial-email-cron";
export { examCampaignCron } from "./exam-campaign-cron";
