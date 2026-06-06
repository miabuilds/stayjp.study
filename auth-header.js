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
    return /FBAN|FBAV|Instagram|Line\/|; wv\)/i.test(navigator.userAgent || '');
  }

  var auth, area;

  function render(user) {
    if (!area) return;
    if (user) {
      var name = (user.displayName || user.email || 'User').split(' ')[0];
      var photo = user.photoURL || '';
      var img = photo ? '<img src="' + photo + '" alt="" onerror="this.style.display=\'none\'">' : '';
      var ADMIN = ['stayjpplan@gmail.com', 'abc83327@gmail.com'];
      var adminLink = ADMIN.indexOf((user.email || '').toLowerCase()) > -1 ? '<a class="ahx-item" href="admin.html">🛠 管理後台</a>' : '';
      area.innerHTML =
        '<button class="ahx-btn" id="ahxMenuBtn" type="button">' + img + name + ' ▾</button>' +
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
      area.querySelector('#ahxLogout').onclick = function () { auth.signOut(); };
    } else {
      area.innerHTML = '<button class="ahx-btn" id="ahxLogin" type="button">登入</button>';
      area.querySelector('#ahxLogin').onclick = login;
    }
  }

  function login() {
    if (isInApp()) {
      alert('請用 Safari / Chrome 開啟本站登入（App 內建瀏覽器無法登入 Google）。');
      return;
    }
    auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .catch(function (e) { alert('登入失敗: ' + (e && e.message || e)); });
  }

  async function init() {
    injectCSS();
    try { auth = await ensureFirebase(); }
    catch (e) { console.warn('[auth-header] firebase load fail', e); return; }
    area = document.createElement('div');
    area.className = 'ahx-area';
    area.id = 'ahxArea';
    findAnchor().appendChild(area);
    document.addEventListener('click', function (e) {
      var m = document.getElementById('ahxMenu');
      if (m && m.classList.contains('show') &&
          !e.target.closest('#ahxMenuBtn') && !e.target.closest('#ahxMenu')) {
        m.classList.remove('show');
      }
    });
    auth.onAuthStateChanged(render);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
