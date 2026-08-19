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

  // 已在原生 App 內 → 隱藏所有「下載 App」按鈕/連結(App Store / Google Play)。
  // 已經在 App 裡了還叫人下載 App 很多餘;這些下載鈕只該在網頁瀏覽器出現。
  try {
    if (window.STAYJP_NATIVE && window.STAYJP_NATIVE.isNativeApp) {
      document.documentElement.classList.add('stayjp-native');
      var _naCss = document.createElement('style');
      _naCss.textContent = 'html.stayjp-native a[href*="apps.apple.com"],html.stayjp-native a[href*="play.google.com"],html.stayjp-native .hero-cta.app,html.stayjp-native .app-download,html.stayjp-native [data-web-only]{display:none!important}';
      document.head.appendChild(_naCss);
    }
  } catch (e) {}

  var FB_CONFIG = {
    apiKey: "AIzaSyDnmg2XOuvwgE8m8xCF5sS4o0nQYoUplPI",
    authDomain: "jpnote-1bdd6.firebaseapp.com",
    projectId: "jpnote-1bdd6",
    storageBucket: "jpnote-1bdd6.firebasestorage.app",
    messagingSenderId: "666368174384",
    appId: "1:666368174384:web:30a5f16d50c082b13dc0f5"
  };
  var SDK = 'https://www.gstatic.com/firebasejs/10.12.0/';

  // 推薦碼歸因(KOL):?ref=CODE 連結 → 存 localStorage(首次不覆蓋);登入時由有 firestore 的頁面
  // (index.html)首次寫進 users/{uid}.ref_code。每頁都載入本檔 → App/網頁通用。
  try {
    var _refm = (location.search || '').match(/[?&]ref=([A-Za-z0-9_-]{1,32})/);
    if (_refm && !localStorage.getItem('stayjp_ref')) localStorage.setItem('stayjp_ref', _refm[1].toUpperCase());
  } catch (e) {}

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
      // select 要關掉原生外觀自己畫箭頭:iOS/WebKit 對「原生外觀+自訂背景圓角」的 select 會渲染成疊影亂紋
      'select.ahx-btn{appearance:none;-webkit-appearance:none;-moz-appearance:none;' +
        'background-color:var(--bg3,#eee);' +
        "background-image:url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path d='M1 1l4 4 4-4' fill='none' stroke='%23999' stroke-width='1.5' stroke-linecap='round'/></svg>\");" +
        'background-repeat:no-repeat;background-position:right 8px center;background-size:10px 6px}' +
      '.ahx-btn img{width:18px;height:18px;border-radius:50%}' +
      '.ahx-btn .ahx-name{display:inline-block;max-width:96px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;vertical-align:bottom}' +
      '.ahx-menu{position:absolute;top:calc(100% + 8px);right:0;background:var(--bg2,#fff);' +
        'background-color:var(--bg2,#fff);border:1px solid var(--bd,#ddd);border-radius:14px;' +
        'min-width:210px;padding:6px;z-index:2147483000;' +   /* 提到極高,保證蓋過任何頁面內容(避免被卡片堆疊透出) */
        'box-shadow:0 12px 32px rgba(0,0,0,.16),0 2px 6px rgba(0,0,0,.06);display:none;isolation:isolate}' +
      '.ahx-menu.show{display:block}' +
      '.ahx-head{padding:6px 10px 9px;margin-bottom:4px;border-bottom:1px solid var(--bd,#ddd);font-size:11.5px;' +
        'letter-spacing:.02em;color:var(--tx3,#888);word-break:break-all}' +
      '.ahx-head:empty{display:none}' +   /* email 空時不顯示空白列 */
      '.ahx-item{display:flex;align-items:center;gap:10px;width:100%;text-align:left;background:none;border:0;' +
        'padding:9px 10px;font-size:13.5px;font-weight:500;color:var(--tx,#222);cursor:pointer;border-radius:9px;' +
        'text-decoration:none;font-family:inherit;transition:background .12s}' +
      '.ahx-ic{width:20px;text-align:center;font-size:15px;flex-shrink:0;opacity:.85}' +
      '.ahx-item:hover{background:var(--bg3,#f0f0f0);text-decoration:none}' +
      '.ahx-sep{height:1px;background:var(--bd,#e5e5e5);margin:5px 6px}' +
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

  // 全站共用語言切換鍵。使用者回饋：只有 home 頁能改語言，其他頁沒有。
  // 這些內容頁(account/pricing/privacy/refund/terms…)本來就載了 i18n.js + translate-layer.js，
  // 只是少了切換鍵。本檔每頁都載 → 統一補上一顆，繁/簡/EN 循環。
  // 有自己語言鍵的頁(home/verbs/contact 內嵌 #langBtn + cycleLang)自動跳過，不重覆。
  function injectLangSwitcher() {
    try {
      if (typeof I18n === 'undefined' || !I18n.getLang || !I18n.setLang) return;
      if (document.getElementById('langBtn') || document.getElementById('langSel') || typeof window.cycleLang === 'function') return; // 頁面已有
      if (document.getElementById('ahxLangSel')) return;                                          // 防重複
      var cur = I18n.getLang();
      var sel = document.createElement('select');
      sel.id = 'ahxLangSel';
      sel.className = 'ahx-btn';
      sel.style.padding = '5px 22px 5px 10px';
      sel.setAttribute('aria-label', '切換語言 / Language');
      [['zh-TW', '繁體'], ['zh-CN', '简体'], ['en', 'EN']].forEach(function (o) {
        var op = document.createElement('option');
        op.value = o[0]; op.textContent = o[1];
        if (o[0] === cur) op.selected = true;
        sel.appendChild(op);
      });
      // 選了就 reload：讓 dict 字串與 translate-layer(en) 重新套用（en/zh-TW 全頁生效）。
      sel.onchange = function () { I18n.setLang(sel.value); location.reload(); };
      if (area && area.parentNode) area.parentNode.insertBefore(sel, area);
      else findAnchor().appendChild(sel);
    } catch (e) { /* no-op */ }
  }

  function isInApp() {
    // 與 index 的 isInAppBrowser 對齊:Line/FB/IG/Threads/WeChat/Twitter/TikTok/Kakao/Naver…
    return /FBAN|FBAV|FB_IAB|Instagram|Line\/|MicroMessenger|Twitter|TikTok|KAKAOTALK|NAVER|Barcelona|BytedanceWebview/i.test(navigator.userAgent || '');
  }

  var auth, area;
  var _ahxSigningIn = false;
  var _ahxResolved = false;
  // 跨頁(整頁重載)樂觀登入快取 —— 與 index.html 共用同一組 localStorage 鍵,
  // 任一頁(account/pricing…)登入後寫入,換頁先樂觀渲染成已登入,消除原生 App 換頁「未登入」閃爍。
  function _ahxReadCache() { try { return JSON.parse(localStorage.getItem('stayjp_auth_cache') || 'null'); } catch (e) { return null; } }
  function _ahxWriteCache(u) { try { u ? localStorage.setItem('stayjp_auth_cache', JSON.stringify({ uid: u.uid, displayName: u.displayName, email: u.email, photoURL: u.photoURL })) : localStorage.removeItem('stayjp_auth_cache'); } catch (e) {} }

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
      var adminLink = ADMIN.indexOf((user.email || '').toLowerCase()) > -1 ? '<a class="ahx-item" href="admin-dash.html"><span class="ahx-ic">🛠</span>管理後台</a>' : '';
      var upLink = (!isPremium() && !(window.STAYJP_NATIVE && window.STAYJP_NATIVE.isNativeApp))
        ? '<a href="pricing.html" style="font-size:12px;font-weight:700;color:var(--ac,#d4654a);text-decoration:none;margin-right:8px;border:1px solid var(--ac,#d4654a);border-radius:20px;padding:4px 10px;white-space:nowrap">升級</a>' : '';
      area.innerHTML = upLink +
        '<button class="ahx-btn" id="ahxMenuBtn" type="button">' + img + '<span class="ahx-name">' + name + '</span> ▾</button>' +
        '<div class="ahx-menu" id="ahxMenu">' +
          '<div class="ahx-head">' + (user.email || '') + '</div>' +
          '<a class="ahx-item" href="account.html"><span class="ahx-ic">👤</span>我的帳號</a>' +
          '<a class="ahx-item" href="pricing.html"><span class="ahx-ic">✨</span>訂閱方案</a>' +
          adminLink +
          '<div class="ahx-sep"></div>' +
          '<button class="ahx-item danger" id="ahxLogout" type="button"><span class="ahx-ic">⏻</span>登出</button>' +
        '</div>';
      area.querySelector('#ahxMenuBtn').onclick = function (e) {
        e.stopPropagation();
        var m = area.querySelector('#ahxMenu');
        if (m) m.classList.toggle('show');
      };
      area.querySelector('#ahxLogout').onclick = function () {
        try { auth.signOut(); _ahxWriteCache(null); localStorage.setItem('stayjp_logged_in', '0'); } catch (e) {}
        // App 內:通知原生也登出(原生 Firebase + RevenueCat),否則狀態卡住要重開 app
        try { if (window.STAYJP_NATIVE && window.STAYJP_NATIVE.isNativeApp && window.ReactNativeWebView && window.ReactNativeWebView.postMessage) window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'NATIVE_LOGOUT' })); } catch (e) {}
      };
    } else {
      try { localStorage.removeItem('ahx_li'); _ahxWriteCache(null); localStorage.setItem('stayjp_logged_in', '0'); } catch (e) {}   // 確定登出 → 清快取,下次直接顯示「登入」
      area.innerHTML = '<button class="ahx-btn" id="ahxLogin" type="button">登入</button>' +
        '<div class="ahx-menu" id="ahxLoginMenu">' +
          '<button class="ahx-item" id="ahxLoginG" type="button">用 Google 登入</button>' +
          '<button class="ahx-item" id="ahxLoginA" type="button">用 Apple 登入</button>' +
        '</div>';
      area.querySelector('#ahxLogin').onclick = onLoginClick;
      area.querySelector('#ahxLoginG').onclick = function (e) { e.stopPropagation(); closeLoginMenu(); loginWith('google'); };
      area.querySelector('#ahxLoginA').onclick = function (e) { e.stopPropagation(); closeLoginMenu(); loginWith('apple'); };
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
        var lng = (window.localStorage && localStorage.getItem('ui_lang')) || 'zh-TW';
        // 看方案不用登入 → 一律開 paywall;真的要訂閱(按 CTA)時 paywall 內才要求登入
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'OPEN_PAYWALL', lang: lng }));
      } catch (_) {}
    }, true);
  }

  function closeLoginMenu() { var m = document.getElementById('ahxLoginMenu'); if (m) m.classList.remove('show'); }

  // 點「登入」:App 內建瀏覽器→提示;原生 App→走原生橋接;一般網頁→彈 Google/Apple 選單
  function onLoginClick(e) {
    if (e) e.stopPropagation();
    if (isInApp()) {
      alert('你正在 App 內建瀏覽器(Line／IG／Threads／FB／微信 等)開啟本站,登入會被擋。\n\n請改用 Safari 或 Chrome:\n點右上／右下的「⋯」或「⋮」→ 選「在預設瀏覽器開啟」,再登入即可。');
      return;
    }
    // 原生 App:signInWithPopup 已被 patch 成發 OPEN_LOGIN 原生選單(Google/Apple 原生選)→ 直接觸發,不顯示網頁選單
    if (window.STAYJP_NATIVE && window.STAYJP_NATIVE.isNativeApp) { loginWith('google'); return; }
    // 一般網頁:彈 Google/Apple 選單
    var m = document.getElementById('ahxLoginMenu');
    if (m) m.classList.toggle('show');
  }

  function loginWith(providerName) {
    if (_ahxSigningIn) return;   // 防連點
    _ahxSigningIn = true;
    var provider;
    if (providerName === 'apple') {
      provider = new firebase.auth.OAuthProvider('apple.com');
      provider.addScope('email'); provider.addScope('name');
    } else {
      provider = new firebase.auth.GoogleAuthProvider();
    }
    auth.signInWithPopup(provider)
      .catch(function (e) {
        var code = e && e.code;
        if (code === 'auth/cancelled-popup-request' || code === 'auth/popup-closed-by-user') return;  // 良性
        if (code === 'auth/network-request-failed') { alert('網路不穩,登入連線失敗,請稍後再試一次。'); return; }
        if (code === 'auth/operation-not-allowed') { alert('Apple 登入還在設定中,請先用 Google 登入。'); return; }
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
    injectLangSwitcher();
    try { var _c = _ahxReadCache(); if (_c) render(_c); else if (localStorage.getItem('ahx_li') === '1') renderPlaceholder(); } catch (e) {}
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
      var lm = document.getElementById('ahxLoginMenu');
      if (lm && lm.classList.contains('show') &&
          !e.target.closest('#ahxLogin') && !e.target.closest('#ahxLoginMenu')) {
        lm.classList.remove('show');
      }
    });
    // 還原失敗保險:4 秒沒回呼 → 標記已解析並重繪真實狀態(回退「登入」鈕),不卡在樂觀快取
    setTimeout(function () { if (!_ahxResolved) { _ahxResolved = true; render(auth && auth.currentUser ? auth.currentUser : null); } }, 4000);
    auth.onAuthStateChanged(function (user) {
      _ahxResolved = true;
      _ahxWriteCache(user);
      try { localStorage.setItem('stayjp_logged_in', user ? '1' : '0'); } catch (e) {}
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
