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
    var ua = navigator.userAgent || '';
    var isIOS = /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && typeof document !== 'undefined' && 'ontouchend' in document); // iPadOS 會偽裝成 Mac
    var isAndroid = /Android/i.test(ua);
    var root = document.documentElement;
    root.classList.add(isIOS ? 'stayjp-dev-ios' : isAndroid ? 'stayjp-dev-android' : 'stayjp-dev-desktop');
    var css = document.createElement('style');
    css.textContent =
      '.app-ios,.app-android{display:none}' +
      'html.stayjp-dev-ios .app-ios{display:inline-flex}' +
      'html.stayjp-dev-android .app-android{display:inline-flex}' +
      'html.stayjp-dev-desktop .app-ios,html.stayjp-dev-desktop .app-android{display:inline-flex}';
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
