// 新人限時 9 折:拿「我的新人價到幾點」給 pricing.html 與 promo-banner.js 用。Mia 2026-10-13 定案。
//
// 規則在 campaign.js NEWBIE(= 後端 constants.ts):從沒付過錢的帳號,註冊後 72 小時;
// 上線前就註冊的免費用戶,從上線(10/15 20:00 台灣)起算 72 小時。
// 「有沒有付過錢」只有後端知道 → 打 newbieOffer API(要登入),結果存 localStorage,
// 沒載 Firebase 的頁面(單純內容頁)就讀快取。真正扣款金額一律由 createPayment 再算一次。
//
// 對外:window.NewbieOffer = { until, uid, active(), left() };拿到/更新資格時發 window 事件 'newbie-offer'。
(function () {
  if (window.NewbieOffer) return;
  var API = 'https://asia-east1-jpnote-1bdd6.cloudfunctions.net/newbieOffer';
  var KEY = 'stayjp_newbie';                 // { uid, until, at }
  var RECHECK_MS = 6 * 3600e3;                // 確定「沒有」的人,6 小時內不再問
  var CP = window.Campaign;
  var now = function () { return (CP && CP.now) ? CP.now() : Date.now(); };
  var NO = window.NewbieOffer = {
    until: 0, uid: '',
    active: function () { return NO.until > now(); },
    left: function () { return Math.max(0, NO.until - now()); },
  };
  function launched() { return !!(CP && CP.NEWBIE && now() >= CP.NEWBIE.launch); }   // 沒載 campaign.js 的頁面不動作
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} }
  // App 內:把截止時間交給原生 Paywall(src/lib/newbie.ts),它照這個決定要不要賣推薦價商品
  function toNative() {
    try {
      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage)
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'NEWBIE_OFFER', payload: { until: NO.until } }));
    } catch (e) {}
  }
  function emit() { toNative(); try { window.dispatchEvent(new Event('newbie-offer')); } catch (e) {} }
  function premium() {
    try {
      if (window.STAYJP_NATIVE && window.STAYJP_NATIVE.isPremium) return true;
      return localStorage.getItem('premium_hint') === '1';
    } catch (e) { return false; }
  }
  function set(uid, until) {
    var changed = NO.uid !== uid || NO.until !== until;
    NO.uid = uid; NO.until = until;
    save({ uid: uid, until: until, at: Date.now() });
    if (changed) emit();
  }

  if (!launched()) return;
  var c = load();
  if (c && c.until > now()) { NO.uid = c.uid || ''; NO.until = c.until; toNative(); }

  function check(user) {
    if (!user) { if (NO.uid) set('', 0); return; }
    if (premium()) { set(user.uid, 0); return; }
    var c2 = load();
    if (c2 && c2.uid === user.uid && !(c2.until > now()) && Date.now() - (c2.at || 0) < RECHECK_MS) return;
    user.getIdToken().then(function (t) {
      return fetch(API, { headers: { Authorization: 'Bearer ' + t } });
    }).then(function (r) { return r.json(); }).then(function (j) {
      set(user.uid, Number(j && j.until) || 0);
    }).catch(function () {});
  }
  // Firebase 是各頁自己初始化的(有的頁面晚載、有的根本沒載)→ 等一下,等不到就只用快取
  var tries = 0;
  (function hook() {
    try {
      if (window.firebase && firebase.apps && firebase.apps.length && firebase.auth) {
        firebase.auth().onAuthStateChanged(check);
        return;
      }
    } catch (e) {}
    if (++tries < 30) setTimeout(hook, 500);
  })();
})();
