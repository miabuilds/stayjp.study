/* auth-header.js — 全站共用「登入 / 帳號下拉」元件
 *
 * 用法:任意頁面 </body> 前加一行:
 *   <script defer src="auth-header.js"></script>
 *
 * 行為:
 *   - 自動載入 Firebase compat SDK(若該頁尚未載)+ init guard(不重複 init)
 *   - 自動找 header 右側容器(#authSlot / .hd-links / .nav / .nav-pills / .hd-inner / header)塞入
 *   - 未登入 → 顯示「登入」(Google 彈窗)
 *   - 已登入 → 顯示「名字 ▾」→ 我的帳號 / 訂閱方案 / 登出
 *   - 與頁面既有 firebase.auth() 共用同一實例,登入/登出狀態自動同步
 *
 * 注意:index.html / admin.html 各自有原生實作,不引入本檔。
 */
(function () {
  'use strict';
  if (window.__authHeaderLoaded) return;          // 防重複載入
  window.__authHeaderLoaded = true;

  var FB_CONFIG = {
    apiKey: "AIzaSyDnmg2XOuvwgE8m8xCF5sS4o0nQYoUplPI",
    authDomain: "jpnote-1bdd6.firebaseapp.com",
    projectId: "jpnote-1bdd6",
    storageBucket: "jpnote-1bdd6.firebasestorage.app",
    messagingSenderId: "666368174384",
    appId: "1:666368174384:web:30a5f16d50c082b13dc0f5"
  };
  var SDK = 'https://www.gstatic.com/firebasejs/10.12.0/';

  function injectCSS() {
    if (document.getElementById('ahxStyles')) return;
    var s = document.createElement('style');
    s.id = 'ahxStyles';
    s.textContent =
      '.ahx-area{display:inline-flex;align-items:center;gap:5px;position:relative}' +
      '.ahx-btn{background:var(--bg3,#eee);border:1px solid var(--bd,#ddd);color:var(--tx,#222);' +
        'padding:5px 12px;border-radius:20px;cursor:pointer;font-size:13px;display:inline-flex;' +
        'align-items:center;gap:5px;line-height:1;white-space:nowrap;font-family:inherit;' +
        'transition:border-color .2s,color .2s}' +
      '.ahx-btn:hover{border-color:var(--ac,#888);color:var(--ac,#000)}' +
      '.ahx-btn img{width:18px;height:18px;border-radius:50%}' +
      '.ahx-btn .ahx-name{display:inline-block;max-width:96px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;vertical-align:bottom}' +
      '.ahx-menu{position:absolute;top:calc(100% + 6px);right:0;background:var(--bg2,#fff);' +
        'border:1px solid var(--bd,#ddd);border-radius:10px;min-width:180px;padding:4px;z-index:300;' +
        'box-shadow:0 8px 24px rgba(0,0,0,.18);display:none}' +
      '.ahx-menu.show{display:block}' +
      '.ahx-head{padding:10px 12px;border-bottom:1px solid var(--bd,#ddd);font-size:11px;' +
        'color:var(--tx3,#888);word-break:break-all}' +
      '.ahx-item{display:block;width:100%;text-align:left;background:none;border:0;padding:8px 12px;' +
        'font-size:13px;color:var(--tx,#222);cursor:pointer;border-radius:6px;text-decoration:none;font-family:inherit}' +
      '.ahx-item:hover{background:var(--bg3,#f0f0f0);text-decoration:none}' +
      '.ahx-item.danger{color:#DC2626}' +
      '.ahx-item.danger:hover{background:rgba(220,38,38,.08)}';
    document.head.appendChild(s);
  }

  function loadScript(src) {
    return new Promise(function (res, rej) {
      var sc = document.createElement('script');
      sc.src = src; sc.onload = res; sc.onerror = rej;
      document.head.appendChild(sc);
    });
  }
  async function ensureFirebase() {
    if (typeof firebase === 'undefined' || !firebase.apps) {
      await loadScript(SDK + 'firebase-app-compat.js');
      await loadScript(SDK + 'firebase-auth-compat.js');
    } else if (!firebase.auth) {
      await loadScript(SDK + 'firebase-auth-compat.js');
    }
    if (!firebase.apps.length) firebase.initializeApp(FB_CONFIG);
    return firebase.auth();
  }

  function findAnchor() {
    return document.querySelector('#authSlot')
        || document.querySelector('header .hd-links, header .nav, header .nav-pills')
        || document.querySelector('header .hd-inner')
        || document.querySelector('header')
        || document.body;
  }

  function isInApp() {
    // 與 index 的 isInAppBrowser 對齊:Line/FB/IG/Threads/WeChat/Twitter/TikTok/Kakao/Naver…
    return /FBAN|FBAV|FB_IAB|Instagram|Line\/|MicroMessenger|Twitter|TikTok|KAKAOTALK|NAVER|Barcelona|BytedanceWebview/i.test(navigator.userAgent || '');
  }

  var auth, area;
  var _ahxSigningIn = false;

  // 載入中的中性佔位(上次有登入才用)→ 避免閃「登入」。非互動。
  function renderPlaceholder() {
    if (!area) return;
    area.innerHTML = '<span class="ahx-btn" aria-hidden="true" style="opacity:.5;pointer-events:none">'
      + '<span style="width:18px;height:18px;border-radius:50%;background:var(--bg3,#d1d5db);display:inline-block"></span></span>';
  }

  function render(user) {
    if (!area) return;
    if (user) {
      try { localStorage.setItem('ahx_li', '1'); } catch (e) {}   // 記住已登入 → 下次載入先顯示佔位不閃「登入」
      var _em = user.email || '';
      // Apple privaterelay 用戶沒 displayName → 取信箱 @ 前半截,避免長信箱撐爆 header
      var name = user.displayName ? user.displayName.split(' ')[0] : (_em ? _em.split('@')[0] : 'User');
      var photo = user.photoURL || '';
      var img = photo ? '<img src="' + photo + '" alt="" onerror="this.style.display=\'none\'">' : '';
      var ADMIN = ['stayjpplan@gmail.com', 'abc83327@gmail.com'];
      var adminLink = ADMIN.indexOf((user.email || '').toLowerCase()) > -1 ? '<a class="ahx-item" href="admin.html">🛠 管理後台</a>' : '';
      area.innerHTML =
        '<button class="ahx-btn" id="ahxMenuBtn" type="button">' + img + '<span class="ahx-name">' + name + '</span> ▾</button>' +
        '<div class="ahx-menu" id="ahxMenu">' +
          '<div class="ahx-head">' + (user.email || '') + '</div>' +
          '<a class="ahx-item" href="account.html">我的帳號</a>' +
          '<a class="ahx-item" href="pricing.html">訂閱方案</a>' +
          adminLink +
          '<button class="ahx-item danger" id="ahxLogout" type="button">登出</button>' +
        '</div>';
      area.querySelector('#ahxMenuBtn').onclick = function (e) {
        e.stopPropagation();
        var m = area.querySelector('#ahxMenu');
        if (m) m.classList.toggle('show');
      };
      area.querySelector('#ahxLogout').onclick = function () {
        try { auth.signOut(); } catch (e) {}
        // App 內:通知原生也登出(原生 Firebase + RevenueCat),否則狀態卡住要重開 app
        try { if (window.STAYJP_NATIVE && window.STAYJP_NATIVE.isNativeApp && window.ReactNativeWebView && window.ReactNativeWebView.postMessage) window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'NATIVE_LOGOUT' })); } catch (e) {}
      };
    } else {
      try { localStorage.removeItem('ahx_li'); } catch (e) {}   // 確定登出 → 清快取,下次直接顯示「登入」
      area.innerHTML = '<button class="ahx-btn" id="ahxLogin" type="button">登入</button>';
      area.querySelector('#ahxLogin').onclick = login;
    }
  }

  // 原生 App(WebView)內:Google/Apple OAuth 在嵌入式 WebView 會被擋(Google 回 disallowed_useragent)。
  // firebase.auth() 是單例 → patch 一次,所有共用此實例的頁面(含 pricing/account/contact…)登入都改走原生:
  // postMessage OPEN_LOGIN → 原生彈登入選單 → 原生 SDK 登入 → mintCustomToken → 注入 signInWithCustomToken。
  // 回「使用者取消」良性 reject:各頁 catch 本就把這個碼當取消靜默處理,不會跳錯誤框。
  function patchNativeLogin() {
    if (!auth || auth.__stayjpNativePatched) return;
    if (!(window.STAYJP_NATIVE && window.STAYJP_NATIVE.isNativeApp)) return;
    auth.__stayjpNativePatched = true;
    auth.signInWithPopup = function () {
      // 發 OPEN_LOGIN → 原生彈登入選單(Google / Apple 由用戶選),不在網頁端預設提供者。
      try {
        if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
          var _lng = (window.localStorage && localStorage.getItem('ui_lang')) || 'zh-TW';
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'OPEN_LOGIN', lang: _lng }));
        }
      } catch (e) { /* 橋接失敗就靜默 */ }
      return Promise.reject({ code: 'auth/popup-closed-by-user', message: 'stayjp-native-login-bridge' });
    };
  }

  // App 內:全站攔截「查看方案/訂閱」連結(連到 pricing)→ 直接開原生 paywall,
  // 不載入網頁金流頁。否則導去 pricing.html 會閃一下「升級 Premium / 查看方案」中間頁(scrub)再彈 paywall(脫褲子放屁)。
  // capture 階段攔 + stopPropagation:蓋過各頁自己的 pricing 連結處理(如 account.html),避免重複開。
  function patchPricingLinks() {
    if (!(window.STAYJP_NATIVE && window.STAYJP_NATIVE.isNativeApp)) return;
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!a) return;
      var href = a.getAttribute('href') || '';
      if (!/(^|\/)pricing(\.html)?(\?|#|$)/.test(href)) return;   // 只攔 pricing 連結
      e.preventDefault();
      e.stopPropagation();
      try {
        if (!(window.ReactNativeWebView && window.ReactNativeWebView.postMessage)) return;
        var u = (window.firebase && firebase.auth && firebase.auth().currentUser) || null;
        var lng = (window.localStorage && localStorage.getItem('ui_lang')) || 'zh-TW';
        window.ReactNativeWebView.postMessage(JSON.stringify(u
          ? { type: 'OPEN_PAYWALL', lang: lng }
          : { type: 'OPEN_LOGIN', intent: 'subscribe', lang: lng }));
      } catch (_) {}
    }, true);
  }

  function login() {
    if (isInApp()) {
      alert('你正在 App 內建瀏覽器(Line／IG／Threads／FB／微信 等)開啟本站,Google 登入會被擋。\n\n請改用 Safari 或 Chrome:\n點右上／右下的「⋯」或「⋮」→ 選「在預設瀏覽器開啟」,再登入即可。');
      return;
    }
    if (_ahxSigningIn) return;   // 防連點:前一個登入彈窗還沒結束就別再開(auth/cancelled-popup-request)
    _ahxSigningIn = true;
    auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .catch(function (e) {
        var code = e && e.code;
        if (code === 'auth/cancelled-popup-request' || code === 'auth/popup-closed-by-user') return;  // 良性
        if (code === 'auth/network-request-failed') { alert('網路不穩,登入連線失敗,請稍後再試一次。'); return; }
        alert('登入失敗: ' + (e && e.message || e));
      })
      .finally(function () { _ahxSigningIn = false; });
  }

  async function init() {
    injectCSS();
    // 先建 area + 依「上次登入狀態」渲染:Firebase 載入那 1~2 秒,對上次有登入的人顯示中性 placeholder,
    // 不要先閃「登入」再變名字(登出者快取不為 1 → 維持空白,等狀態確定才出現「登入」,也不會閃)。
    area = document.createElement('div');
    area.className = 'ahx-area';
    area.id = 'ahxArea';
    findAnchor().appendChild(area);
    try { if (localStorage.getItem('ahx_li') === '1') renderPlaceholder(); } catch (e) {}
    try { auth = await ensureFirebase(); }
    catch (e) { console.warn('[auth-header] firebase load fail', e); return; }
    patchNativeLogin();
    patchPricingLinks();
    document.addEventListener('click', function (e) {
      var m = document.getElementById('ahxMenu');
      if (m && m.classList.contains('show') &&
          !e.target.closest('#ahxMenuBtn') && !e.target.closest('#ahxMenu')) {
        m.classList.remove('show');
      }
    });
    auth.onAuthStateChanged(function (user) {
      render(user);
      // 在原生 App 的 WebView 內 → 把 Firebase uid 遞給 app,綁定 RevenueCat appUserID,
      // 讓 app 內購買(IAP)的 webhook 能寫進正確的 users/{uid}.subscription。
      // 一般瀏覽器沒有 window.STAYJP_NATIVE → 整段跳過,對網頁用戶零影響。
      try {
        if (window.STAYJP_NATIVE && window.STAYJP_NATIVE.isNativeApp &&
            window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
          window.ReactNativeWebView.postMessage(JSON.stringify(
            user && user.uid ? { type: 'RC_LOGIN', payload: { uid: user.uid } }
                             : { type: 'RC_LOGOUT' }
          ));
        }
      } catch (e) { /* 橋接失敗靜默,不影響網頁 */ }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

/* 原生 App 主題橋:網頁切深/淺色時,把目前 data-theme + 實際 --bg 色碼回報給原生,
   讓 App 的安全區(瀏海 / 底部)照著漆,跟網頁內容無縫接色。一般瀏覽器無 STAYJP_NATIVE → 跳過。
   (此檔每頁都載;index.html 沒載,另在該頁內嵌同一段。) */
(function () {
  function reportTheme() {
    try {
      if (!(window.STAYJP_NATIVE && window.STAYJP_NATIVE.isNativeApp)) return;
      if (!(window.ReactNativeWebView && window.ReactNativeWebView.postMessage)) return;
      var theme = document.documentElement.getAttribute('data-theme') || 'light';
      var bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'THEME', payload: { theme: theme, bg: bg } }));
    } catch (_) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', reportTheme);
  else reportTheme();
  try {
    new MutationObserver(reportTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  } catch (_) {}
})();
