/* native-ui.js — 原生 App 內的介面調整(隱藏下載鈕、平台字眼)
 *
 * 為什麼需要這支:
 * 原本 index.html 的 inline script 與 auth-header.js 都是「執行當下讀一次
 * window.STAYJP_NATIVE」。那個物件由 App 用 injectedJavaScriptBeforeContentLoaded 注入,
 * 但兩個平台的注入時機不同:
 *
 *   iOS      WKUserScript(atDocumentStart) → 保證在網頁任何腳本之前執行
 *   Android  onPageStarted 裡才 evaluateJavascript(RNCWebViewClient.java)
 *            → 與網頁自己的 inline script 搶跑,不保證先到
 *
 * 結果就是:同一段判斷在 iOS 正常、在 Android 常常讀到 undefined,
 * 於是「下載 iOS App」的按鈕在 Android App 裡照樣露出來。
 *
 * 這支改成「持續重試到偵測成功」,不依賴單一時間點,兩個平台都可靠。
 * 一般瀏覽器永遠不會有 STAYJP_NATIVE → 重試幾秒後自動停,對網頁使用者零影響。
 */
(function () {
  'use strict';
  if (window.__stayjpNativeUI) return;      // 防重複載入
  window.__stayjpNativeUI = true;

  // ── 網頁裝置偵測:讓「下載 App」鈕依裝置顯示對的商店 ──
  // iOS 手機/平板 → 只顯示 App Store 鈕;Android → 只顯示 Google Play 鈕;桌機 → 兩個都顯示。
  // 用法:兩顆鈕分別加 class="app-ios" / class="app-android"(含 <span data-t> 中英文字)。
  // 原生 App 內另由下方 apply() 把兩家商店鈕一律隱藏(在 App 內叫人下載 App 很多餘)。
  (function detectWebDevice() {
    // Android App 已於 2026-09 正式上架 Google Play(商店頁公開)→ 顯示 Android 下載鈕。
    //    (封測期間為 false 全站隱藏;上架後翻 true,index/about/howto/pricing 四處一起亮。)
    var ANDROID_LIVE = true;
    var ua = navigator.userAgent || '';
    // iPadOS 13+ 的 Safari UA 會偽裝成 Macintosh;用 maxTouchPoints 才分得出真 Mac(0)與 iPad(>1)。
    // 不能用 'ontouchend' in document — 桌機版 Chrome/Edge 一律回 true,會把真 Mac 誤判成 iOS。
    var isIOS = /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && (navigator.maxTouchPoints || 0) > 1);
    var isAndroid = /Android/i.test(ua);
    var root = document.documentElement;
    root.classList.add(isIOS ? 'stayjp-dev-ios' : isAndroid ? 'stayjp-dev-android' : 'stayjp-dev-desktop');
    var css = document.createElement('style');
    // !important:頁面各自的按鈕樣式(a.hero-cta 等)specificity 較高,會蓋掉這裡的 display:none。
    // App 內(stayjp-native)的隱藏規則 specificity 更高且同為 !important,依然優先 → App 內照舊全藏。
    css.textContent =
      '.app-ios,.app-android{display:none!important}' +
      'html.stayjp-dev-ios .app-ios{display:inline-flex!important}' +
      (ANDROID_LIVE
        ? 'html.stayjp-dev-android .app-android{display:inline-flex!important}' +
          'html.stayjp-dev-desktop .app-ios,html.stayjp-dev-desktop .app-android{display:inline-flex!important}'
        : 'html.stayjp-dev-desktop .app-ios{display:inline-flex!important}');
    (document.head || document.documentElement).appendChild(css);
  })();

  var applied = false;

  function nativeInfo() {
    try {
      var n = window.STAYJP_NATIVE;
      if (n && n.isNativeApp) return { platform: n.platform || '' };
    } catch (e) {}
    return null;
  }

  function apply(info) {
    if (applied) return;
    applied = true;
    var root = document.documentElement;
    root.classList.add('stayjp-native');
    if (info.platform === 'ios') root.classList.add('stayjp-ios');
    if (info.platform === 'android') root.classList.add('stayjp-android');

    // 已經在 App 裡了還叫人下載 App 很多餘;而且在 Android App 裡放
    // 「下載 iOS App」更是莫名其妙。兩家商店的下載鈕在 App 內一律隱藏。
    var css = document.createElement('style');
    css.textContent =
      'html.stayjp-native a[href*="apps.apple.com"],' +
      'html.stayjp-native a[href*="play.google.com/store"],' +
      'html.stayjp-native .hero-cta.app,' +
      'html.stayjp-native .app-download,' +
      'html.stayjp-native [data-web-only]{display:none!important}' +
      // 只在特定平台顯示的文字:預設藏起來,由下面的 class 打開
      '[data-platform]{display:none}' +
      'html.stayjp-ios [data-platform~="ios"],' +
      'html.stayjp-android [data-platform~="android"],' +
      'html:not(.stayjp-native) [data-platform~="web"]{display:revert}';
    (document.head || document.documentElement).appendChild(css);

    initUpdateCheck(info.platform);   // 有新版就在底部提醒去商店更新
  }

  // ── 學習完成 → 通知原生累計「評分時機」(每天最多一次,不要每個字都發)──
  // 原生端 web.tsx 收 STUDY_DONE → recordStudyCompleted()+maybeAskForReview();
  // 真正要不要跳評分交給 expo-store-review + 系統決定,這裡只負責「用了一陣子」的計次。
  window.STAYJP_studyDone = function () {
    try {
      if (!window.ReactNativeWebView) return;               // 純網頁沒有這個 → 直接略過
      var k = 'stayjp_review_signal_day';
      var d = new Date().toISOString().slice(0, 10);
      if (localStorage.getItem(k) === d) return;            // 今天已發過一次
      localStorage.setItem(k, d);
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'STUDY_DONE' }));
    } catch (e) {}
  };

  // ── 新版更新提醒(只在原生 App 內)──
  // 讀 /app-version.json 拿「商店最新版」跟 App 回報的執行版本比;舊了才在底部彈可關的提醒。
  // 純網頁 / 拿不到 appVersion / 已是最新 → 什麼都不做。
  function cmpVer(a, b) {   // a<b → -1;a==b → 0;a>b → 1
    var pa = String(a).split('.').map(Number), pb = String(b).split('.').map(Number);
    for (var i = 0; i < Math.max(pa.length, pb.length); i++) {
      var x = pa[i] || 0, y = pb[i] || 0;
      if (x !== y) return x < y ? -1 : 1;
    }
    return 0;
  }
  function initUpdateCheck(platform) {
    try {
      var n = window.STAYJP_NATIVE || {};
      var cur = n.appVersion;                                // App 執行中的版本(由 web.tsx 注入)
      if (!cur || (platform !== 'ios' && platform !== 'android')) return;
      fetch('/app-version.json?t=' + Date.now(), { cache: 'no-store' })
        .then(function (r) { return r.json(); })
        .then(function (cfg) {
          var latest = cfg && cfg.latest && cfg.latest[platform];
          if (!latest || cmpVer(cur, latest) >= 0) return;   // 沒設定 / 已是最新
          if (localStorage.getItem('stayjp_update_dismissed') === latest) return; // 這個新版已被關過
          showUpdateBar(platform, latest);
        })
        .catch(function () {});
    } catch (e) {}
  }
  function showUpdateBar(platform, latest) {
    var storeUrl = platform === 'ios'
      ? 'https://apps.apple.com/app/id6778227353'
      : 'https://play.google.com/store/apps/details?id=com.stayjp.app';
    var en = /^en/.test(localStorage.getItem('ui_lang') || '');
    var bar = document.createElement('div');
    bar.setAttribute('role', 'dialog');
    bar.style.cssText = 'position:fixed;left:12px;right:12px;bottom:calc(14px + env(safe-area-inset-bottom));z-index:2147483000;background:#213A54;color:#fff;border-radius:14px;padding:12px 14px;display:flex;align-items:center;gap:10px;box-shadow:0 8px 30px rgba(0,0,0,.28);font:500 15px/1.4 -apple-system,BlinkMacSystemFont,"Noto Sans TC","PingFang TC",sans-serif';
    var msg = document.createElement('div');
    msg.style.cssText = 'flex:1;min-width:0';
    msg.textContent = en ? 'A new version is available' : '有新版本可以更新囉';
    var up = document.createElement('button');
    up.textContent = en ? 'Update' : '更新';
    up.style.cssText = 'flex:none;background:#C6553B;color:#fff;border:0;padding:9px 18px;border-radius:999px;font-weight:700;font-size:14px;cursor:pointer';
    up.onclick = function () {
      // 有原生橋 → 請原生開商店(最可靠);沒有就退而求其次直接導頁
      try {
        if (window.ReactNativeWebView) { window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'OPEN_STORE', url: storeUrl })); return; }
      } catch (e) {}
      try { window.location.href = storeUrl; } catch (e) {}
    };
    var later = document.createElement('button');
    later.textContent = en ? 'Later' : '稍後';
    later.style.cssText = 'flex:none;background:transparent;color:#cdd6e0;border:0;padding:9px 8px;font:inherit;cursor:pointer';
    later.onclick = function () { try { localStorage.setItem('stayjp_update_dismissed', latest); } catch (e) {} bar.remove(); };
    bar.appendChild(msg); bar.appendChild(up); bar.appendChild(later);
    (document.body || document.documentElement).appendChild(bar);
  }

  function tick() {
    var info = nativeInfo();
    if (info) { apply(info); return true; }
    return false;
  }

  // 立刻試一次(iOS 這裡就會中);沒中就在接下來幾秒內持續重試,
  // 直到 Android 的注入到位為止。純瀏覽器則會安靜地重試完就結束。
  if (!tick()) {
    var tries = 0;
    var timer = setInterval(function () {
      if (tick() || ++tries > 40) clearInterval(timer);   // 最多約 4 秒
    }, 100);
    document.addEventListener('DOMContentLoaded', tick);
    window.addEventListener('load', tick);
  }
})();
