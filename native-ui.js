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
          // force:低於此版一律擋畫面(重大修正才設,例如 1.0.7 前的 WebView 影片會強制全螢幕)
          var force = cfg && cfg.force;
          if (force && cmpVer(cur, force) < 0) { showForceUpdate(platform, force); return; }
          var latest = cfg && cfg.latest && cfg.latest[platform];
          if (!latest || cmpVer(cur, latest) >= 0) return;   // 沒設定 / 已是最新
          if (localStorage.getItem('stayjp_update_dismissed') === latest) return; // 這個新版已被關過
          showUpdateBar(platform, latest);
        })
        .catch(function () {});
    } catch (e) {}
  }
  // 強制更新:全畫面擋住,只留「前往更新」(舊版有無法從網頁修的原生問題時使用)
  function showForceUpdate(platform, ver) {
    if (document.getElementById('stayjpForceUpd')) return;
    var storeUrl = platform === 'ios'
      ? 'https://apps.apple.com/app/id6778227353'
      : 'https://play.google.com/store/apps/details?id=com.stayjp.app';
    var en = /^en/.test(localStorage.getItem('ui_lang') || '');
    var m = document.createElement('div');
    m.id = 'stayjpForceUpd';
    m.style.cssText = 'position:fixed;inset:0;z-index:2147483600;background:rgba(24,20,17,.94);display:flex;align-items:center;justify-content:center;padding:24px;font:500 15px/1.7 -apple-system,BlinkMacSystemFont,"Noto Sans TC","PingFang TC",sans-serif';
    var card = document.createElement('div');
    card.style.cssText = 'background:#fff;color:#2d2a26;border-radius:18px;max-width:340px;width:100%;padding:24px 22px;text-align:center';
    var img = document.createElement('img');
    img.src = 'images/mascot/tanuki-p08.png'; img.alt = '';
    img.style.cssText = 'width:84px;height:auto;margin-bottom:10px';
    var h = document.createElement('div');
    h.style.cssText = 'font-size:17px;font-weight:800;margin-bottom:6px';
    h.textContent = en ? 'Update required' : '請更新到最新版';
    var p = document.createElement('div');
    p.style.cssText = 'font-size:13.5px;color:#6f6a61;margin-bottom:16px';
    p.textContent = en
      ? 'This version has a playback issue that can only be fixed by updating (videos force fullscreen). It takes about 30 seconds.'
      : '這個版本有影片會強制全螢幕的問題,更新後才能修好,大約 30 秒就好。';
    var b = document.createElement('button');
    b.textContent = en ? 'Update now' : '前往更新';
    b.style.cssText = 'width:100%;background:#C6553B;color:#fff;border:0;padding:13px;border-radius:12px;font-weight:800;font-size:15px;cursor:pointer';
    b.onclick = function () {
      try { if (window.ReactNativeWebView) { window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'OPEN_STORE', url: storeUrl })); return; } } catch (e) {}
      try { window.location.href = storeUrl; } catch (e) {}
    };
    card.appendChild(img); card.appendChild(h); card.appendChild(p); card.appendChild(b);
    m.appendChild(card);
    (document.body || document.documentElement).appendChild(m);
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

  // ── App Store 連結在「社群 App 內建瀏覽器」點不動的修正(Mia 2026-09-23 回報)──
  //
  // 原因不在我們的連結:只要 UA 是 iOS,Apple 一律把 apps.apple.com 301 轉到
  // 自訂 scheme itms-appss://(實測帶 /tw/、/jp/、?mt=8 都一樣,改網址救不了)。
  // Safari 接得住會跳去 App Store;Threads / IG / FB / LINE 的內建瀏覽器(WKWebView)
  // 遇到不明 scheme 是「直接忽略、不報錯」→ 使用者看到就是點了完全沒反應。
  // Google Play 回的是一般網頁(HTTP 200),內建瀏覽器渲染得出來,所以 Android 沒事。
  //
  // ⚠️ 不用 UA 判斷是不是內建瀏覽器 —— 各家字串會變、猜錯就整段失效(第一版就是這樣沒中)。
  //    改成看「行為」:點下去之後如果頁面沒有被切走,就代表沒跳成功。
  //    真的跳走時瀏覽器一定會觸發 pagehide / visibilitychange / blur 其中之一。
  (function fixStoreLinks() {
    var isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent || '')
      || (/Macintosh/.test(navigator.userAgent || '') && (navigator.maxTouchPoints || 0) > 1);

    function wire() {
      var links = document.querySelectorAll('a[href*="apps.apple.com"], a[href*="play.google.com"]');
      for (var i = 0; i < links.length; i++) {
        var a = links[i];
        if (a.dataset.storeFixed) continue;
        a.dataset.storeFixed = '1';
        a.target = '_blank';          // 一般瀏覽器:商店連結本來就該開新分頁
        a.rel = 'noopener';
        if (!isIOS || a.href.indexOf('apps.apple.com') < 0) continue;
        a.addEventListener('click', function (e) {
          var url = e.currentTarget.href;
          var left = false;
          var mark = function () { left = true; };
          window.addEventListener('pagehide', mark);
          window.addEventListener('blur', mark);
          document.addEventListener('visibilitychange', function () { if (document.hidden) left = true; });
          setTimeout(function () {
            window.removeEventListener('pagehide', mark);
            window.removeEventListener('blur', mark);
            if (!left && !document.hidden) hint(url);   // 沒被切走 = 沒跳成功
          }, 1500);
        });
      }
    }

    function hint(url) {
      if (document.getElementById('storeHint')) return;
      var en = false;
      try { en = localStorage.getItem('ui_lang') === 'en'; } catch (e) {}
      var box = document.createElement('div');
      box.id = 'storeHint';
      box.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);bottom:18px;z-index:99999;' +
        'width:min(92vw,420px);box-sizing:border-box;background:#1f2937;color:#fff;border-radius:14px;' +
        'padding:13px 14px;box-shadow:0 8px 28px rgba(0,0,0,.35);font-size:13px;line-height:1.55';
      box.innerHTML = '<div style="font-weight:700;margin-bottom:4px">' +
          (en ? 'Can\'t open the App Store here' : '這個瀏覽器開不了 App Store') + '</div>' +
        '<div style="margin-bottom:10px;opacity:.9">' +
          (en ? 'You\'re in an app\'s built-in browser. Tap ••• (top right) → "Open in Safari", or copy the link and paste it in Safari.'
              : '你現在在 App 的內建瀏覽器裡。請點右上角 ••• → 「在 Safari 開啟」,或複製連結貼到 Safari。') +
        '</div><div style="display:flex;gap:8px">' +
        '<button id="storeHintCopy" style="flex:1;background:#fff;color:#1f2937;border:0;border-radius:9px;padding:9px;font-weight:700;font-size:13px">' +
          (en ? 'Copy link' : '複製連結') + '</button>' +
        '<button id="storeHintX" style="flex:0 0 66px;background:transparent;color:#cbd5e1;border:1px solid #475569;border-radius:9px;padding:9px;font-size:13px">' +
          (en ? 'Close' : '關閉') + '</button></div>';
      (document.body || document.documentElement).appendChild(box);
      box.querySelector('#storeHintX').onclick = function () { box.remove(); };
      box.querySelector('#storeHintCopy').onclick = function (ev) {
        var btn = ev.currentTarget;
        var done = function () { btn.textContent = en ? 'Copied!' : '已複製!'; };
        try { navigator.clipboard.writeText(url).then(done, fallback); }
        catch (e) { fallback(); }
        function fallback() {
          // 內建瀏覽器常擋 clipboard API → 退回舊招:選取一個暫時的 input 再 execCommand
          try {
            var t = document.createElement('input');
            t.value = url; t.style.cssText = 'position:fixed;opacity:0';
            document.body.appendChild(t); t.select(); t.setSelectionRange(0, 99999);
            document.execCommand('copy'); t.remove(); done();
          } catch (e2) {
            btn.textContent = url;   // 真的都不行 → 直接把網址攤開讓他長按複製
            btn.style.fontSize = '11px';
          }
        }
      };
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire);
    else wire();
    window.addEventListener('load', wire);
  })();

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
