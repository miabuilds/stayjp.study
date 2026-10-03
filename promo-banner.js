// 限時活動倒數條(iHerb 那種)。Mia 2026-09-23 建;2026-10-03 雙十檔期加「App 內版」與「頂部細條」。
//
// 三種長相,同一支檔案決定:
//   pill  網頁一般頁:底部浮動藥丸(原本的樣子,沒動)。
//   strip 頂部細條:跟著固定表頭(塞進表頭最下面,表頭變高、內容一起往下推)
//         或表頭不是固定的頁面就插在 body 最前面(一般排版流)。
//         → 永遠不會蓋到底部導覽、輸入框、彈窗或做題按鈕。
//         用在:App 內所有頁面、網頁的 app.html(學習主畫面,做題按鈕常在畫面底部,不能用浮動藥丸)。
//
// ⚠️ App 內(Apple 3.1.1 / 反導流):
//    - 只在雙十檔期(phase=on)出現;活動碼型倒數條在 App 內一律不掛(StayJP 2026 被退件過)
//    - 不連官網價格頁、不提碼/推薦碼/兌換/官網、不寫 NT$(商店各國價格不同)
//    - 點下去走既有橋接 OPEN_PAYWALL 開「原生」Paywall(那邊賣的是 IAP 檔期商品)
//    - App 版本要 ≥ APP_MIN_VER:原生 Paywall 的檔期模式是 runtime 1.0.12 的 OTA,舊版 Paywall 沒有特價 → 不掛,免得講了特價卻看不到
//
// 其他不顯示的情況:活動已結束(自動失效,不必手動拆)、已訂購、剛剛按過關閉。
(function () {
  if (window.__stayjpPromoBanner) return;     // 防重複載入(重複掛兩條)
  window.__stayjpPromoBanner = true;
  // 活動內容統一由 campaign.js 提供(它同時負責把過期的碼從 localStorage 清掉)。
  // 拿不到就不顯示 —— 寧可不出現,也不要顯示一個對不上的活動。
  var CP = window.Campaign;
  var C = CP && CP.banner && CP.banner();
  // 雙十檔期(2026-10):不用碼、人人有 → 沒有「活動碼倒數條」時,檔期內改掛檔期條。
  // 只在正式檔期(phase=on)掛;KOL 搶先那 4 小時不掛(那是 KOL 自己推的,站上不搶他的話題)。
  // pricing.html 自己有檔期卡,不重複掛。
  var SALE_BAR = false;
  if (!C && CP && CP.salePhase && CP.salePhase() === 'on' && !/\/pricing(\.html)?$/.test(location.pathname)) {
    var S = CP.SALE;
    C = { end: S.end, code: '', link: S.link + '?utm_source=site&utm_campaign=' + S.id,
      zh: CP.tr(S.zh, S.en, S.cn) };
    SALE_BAR = true;
  }
  if (!C) return;
  var END = C.end, CODE = C.code, LINK = C.link;
  var DISMISS_KEY = SALE_BAR ? 'promo_double10_off' : 'promo_tsukimi_off';
  var NOW = function () { return (CP && CP.now) ? CP.now() : Date.now(); };
  var DISMISS_MS = 6 * 3600 * 1000;              // 網頁藥丸:關掉只安靜 6 小時,越接近截止越該看得到
  var APP_MIN_VER = '1.0.12';                    // App 內細條的最低版本(見檔頭)

  function ended() { return NOW() > END; }
  function inApp() {
    try {
      if (document.documentElement.classList.contains('stayjp-native')) return true;
      if (window.STAYJP_NATIVE && window.STAYJP_NATIVE.isNativeApp) return true;
    } catch (e) {}
    return false;
  }
  function cmpVer(a, b) {   // a<b → -1;a==b → 0;a>b → 1
    var pa = String(a).split('.').map(Number), pb = String(b).split('.').map(Number);
    for (var i = 0; i < Math.max(pa.length, pb.length); i++) {
      var x = pa[i] || 0, y = pb[i] || 0;
      if (x !== y) return x < y ? -1 : 1;
    }
    return 0;
  }
  // App 內能不能掛:只有雙十檔期條、而且 App 版本夠新(Paywall 有檔期模式)
  function appOk() {
    if (!SALE_BAR) return false;
    try {
      var v = window.STAYJP_NATIVE && window.STAYJP_NATIVE.appVersion;
      return !!v && cmpVer(v, APP_MIN_VER) >= 0;
    } catch (e) { return false; }
  }
  function dayKey(t) { var d = new Date(t); return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate(); }
  function dismissed(kind) {
    try {
      var v = Number(localStorage.getItem(DISMISS_KEY) || 0);
      if (!v) return false;
      // 細條(App / 學習主畫面):按 × 當天不再出現;藥丸維持原本 6 小時
      if (kind === 'strip') return dayKey(v) === dayKey(NOW());
      return NOW() - v < DISMISS_MS;
    } catch (e) { return false; }
  }
  function premium() {
    // 已訂購就不推銷。tool-quota.js 會把狀態寫進 premium_hint,沒載 firebase 的頁面也讀得到。
    // App 內再加原生注入的 STAYJP_NATIVE.isPremium(RevenueCat 權益,未登入買的也算)。
    try {
      if (window.STAYJP_NATIVE && window.STAYJP_NATIVE.isPremium) return true;
      if (window.ToolQuota && ToolQuota._trialInfo) return !!ToolQuota._trialInfo().premium;
      return localStorage.getItem('premium_hint') === '1';
    } catch (e) { return false; }
  }
  // 這一頁要用哪種長相
  function kind() {
    if (inApp()) return appOk() ? 'strip' : null;
    if (SALE_BAR && typeof window.fixHeaderHeight === 'function') return 'strip';   // 網頁 app.html(學習主畫面)
    return 'pill';
  }
  if (ended()) return;
  // App 內的活動碼型倒數條一律不掛(Apple 3.1.1);App 判定在 Android 可能晚到,真正的把關在 decide()/tick
  if (inApp() && !SALE_BAR) return;

  var L = function (zh, en) { try { return (typeof enOr === 'function') ? enOr(zh, en) : zh; } catch (e) { return zh; } };
  var nf = function (n) { return Number(n).toLocaleString('en-US'); };
  var xIcon = function () { try { if (typeof window.icon === 'function') return window.icon('x', { size: 16 }); } catch (e) {} return '×'; };

  var css = document.createElement('style');
  css.textContent =
    // ── pill(網頁一般頁,原樣)──
    '.promo-bar{position:fixed;left:50%;transform:translateX(-50%);z-index:9000;' +
    'bottom:calc(var(--btm,0px) + 14px);width:min(92vw,560px);box-sizing:border-box;' +
    'display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:999px;' +
    'background:var(--ac,#D4654A);color:#fff;box-shadow:0 6px 24px rgba(0,0,0,.22);' +
    'font-size:13px;line-height:1.35;animation:promoUp .35s ease}' +
    '@keyframes promoUp{from{opacity:0;transform:translate(-50%,16px)}to{opacity:1;transform:translate(-50%,0)}}' +
    '.promo-bar b{font-weight:800}' +
    '.promo-tx{flex:1;min-width:0}' +
    '.promo-t2{opacity:.92;font-size:11.5px;margin-top:1px}' +
    '.promo-code{background:rgba(255,255,255,.22);border:1px dashed rgba(255,255,255,.75);' +
    'border-radius:8px;padding:2px 8px;font-weight:800;letter-spacing:.5px;cursor:pointer;white-space:nowrap}' +
    '.promo-go{background:#fff;color:var(--ac,#D4654A);border-radius:999px;padding:7px 14px;' +
    'font-weight:800;text-decoration:none;white-space:nowrap;flex-shrink:0}' +
    '.promo-x{background:none;border:0;color:#fff;opacity:.75;font-size:17px;line-height:1;' +
    'cursor:pointer;padding:4px;flex-shrink:0}' +
    '@media(max-width:420px){.promo-bar{font-size:12px;padding:9px 10px;gap:7px}.promo-go{padding:6px 11px}}' +
    // ── strip(頂部細條;顏色全吃頁面 token,深淺色自動跟)──
    '.promo-strip{display:flex;align-items:center;gap:12px;box-sizing:border-box;width:100%;margin:0;' +
    'padding:9px max(10px,env(safe-area-inset-right,0px)) 9px max(14px,env(safe-area-inset-left,0px));' +
    'background:var(--bg2,#fff);background:color-mix(in srgb,var(--ac,#D4654A) 12%,var(--bg,#fff));' +
    'color:var(--tx,#2C2C2C);border-top:1px solid var(--bd,var(--line,rgba(0,0,0,.08)));' +
    'font-size:13px;line-height:1.4;text-align:left;cursor:pointer;-webkit-tap-highlight-color:transparent;' +
    'font-family:inherit;letter-spacing:normal}' +
    '.promo-strip.promo-flow{border-top:0;border-bottom:1px solid var(--bd,var(--line,rgba(0,0,0,.08)));position:relative;z-index:1}' +
    '.promo-st-tx{flex:1;min-width:0}' +
    '.promo-st-t1{display:flex;align-items:center;gap:8px;font-weight:700;white-space:nowrap;min-width:0}' +
    '.promo-st-name{min-width:0;overflow:hidden;text-overflow:ellipsis}' +
    '.promo-st-cd{flex-shrink:0;display:inline-flex;align-items:center;gap:4px;color:var(--ac,#D4654A);font-variant-numeric:tabular-nums}' +
    '.promo-st-cd svg{width:13px;height:13px;flex-shrink:0}' +
    '.promo-st-t2{font-size:12px;color:var(--tx2,#6B6B6B);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.promo-st-go{flex-shrink:0;display:inline-flex;align-items:center;min-height:32px;padding:6px 14px;border:0;' +
    'border-radius:999px;background:var(--ac,#D4654A);color:#fff;font:inherit;font-size:13px;font-weight:700;' +
    'white-space:nowrap;text-decoration:none;cursor:pointer}' +
    '.promo-st-go:hover{text-decoration:none;color:#fff}' +
    '.promo-st-x{flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;' +
    'margin-left:-4px;padding:0;border:0;border-radius:50%;background:none;color:var(--tx2,#6B6B6B);cursor:pointer;font-size:17px;line-height:1}' +
    '.promo-st-x svg{width:16px;height:16px}' +
    '@media(min-width:721px){.promo-strip{justify-content:center}.promo-st-tx{flex:0 1 auto}}';
  (document.head || document.documentElement).appendChild(css);

  var bar, tick, mode = null, isApp = false, stripHost = null, bodyPadBase = null;

  function fmt(ms) {
    var s = Math.max(0, Math.floor(ms / 1000));
    var d = Math.floor(s / 86400); s %= 86400;
    var h = Math.floor(s / 3600); s %= 3600;
    var m = Math.floor(s / 60); s %= 60;
    var p = function (n) { return String(n).padStart(2, '0'); };
    return (d > 0 ? d + L(' 天 ', 'd ') : '') + p(h) + ':' + p(m) + ':' + p(s);
  }

  // ── 開原生 Paywall(App 內)── 同 tool-quota.js goToPlans / auth-header.js 的橋接
  function openNativePaywall() {
    try {
      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        var lng = (window.localStorage && localStorage.getItem('ui_lang')) || 'zh-TW';
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'OPEN_PAYWALL', lang: lng }));
      }
    } catch (e) {}
  }

  // 頁面頂端「固定」的表頭(app.html / index.html 的 .hd 這種)。找不到 → 細條走一般排版流
  function fixedTopHeader() {
    try {
      var list = document.querySelectorAll('header, .hd, body > nav, body > div');
      for (var i = 0; i < list.length; i++) {
        var el = list[i];
        if (el === bar) continue;
        var cs = getComputedStyle(el);
        if (cs.position !== 'fixed' || cs.display === 'none' || cs.visibility === 'hidden') continue;
        var r = el.getBoundingClientRect();
        if (r.top <= 1 && r.height > 0 && r.height < 160 && r.width >= window.innerWidth * 0.9) return el;
      }
    } catch (e) {}
    return null;
  }
  // 細條放進固定表頭後,把內容往下推同樣高度(app.html 有自己的 fixHeaderHeight 量表頭)
  function relayout() {
    try {
      if (typeof window.fixHeaderHeight === 'function') { window.fixHeaderHeight(); return; }
      if (!stripHost) return;
      if (bodyPadBase == null) bodyPadBase = parseFloat(getComputedStyle(document.body).paddingTop) || 0;
      document.body.style.paddingTop = (bar && bar.parentNode ? bodyPadBase + bar.offsetHeight : bodyPadBase) + 'px';
    } catch (e) {}
  }

  function destroy() {
    if (tick) { clearInterval(tick); tick = null; }
    if (bar) { bar.remove(); bar = null; }
    if (mode === 'strip') {
      relayout();
      if (stripHost && bodyPadBase != null && typeof window.fixHeaderHeight !== 'function') {
        try { document.body.style.paddingTop = ''; } catch (e) {}
      }
    }
    mode = null; stripHost = null; bodyPadBase = null;
  }

  function buildPill() {
    bar = document.createElement('div');
    bar.className = 'promo-bar';
    var y = SALE_BAR ? CP.price('yearly', false, false) : null, lf = SALE_BAR ? CP.price('lifetime', false, false) : null;
    bar.innerHTML =
      '<div class="promo-tx"><div><b>' + (SALE_BAR ? C.zh : L(C.zh, C.en)) + '</b> · ' +
        '<span id="promoCd">—</span></div>' +
        (SALE_BAR
          ? '<div class="promo-t2">' + CP.tr('年費 NT$' + nf(y.twd) + ' 年年鎖・買斷 NT$' + nf(lf.twd) + '・不用輸碼',
              'Annual NT$' + nf(y.twd) + ' locked yearly · Lifetime NT$' + nf(lf.twd) + ' · no code needed',
              '年费 NT$' + nf(y.twd) + ' 年年锁・买断 NT$' + nf(lf.twd) + '・不用输码') + '</div></div>'
          : '<div class="promo-t2">' + L('折扣碼', 'Code') + ' <span class="promo-code" id="promoCode">' + CODE + '</span> ' +
            L('點一下複製', 'tap to copy') + '</div></div>') +
      '<a class="promo-go" href="' + LINK + '">' + (SALE_BAR ? CP.tr('看方案', 'See plans', '看方案') : L('看方案', 'View')) + '</a>' +
      '<button class="promo-x" aria-label="' + L('關閉', 'Close') + '">×</button>';
    document.body.appendChild(bar);

    bar.querySelector('.promo-x').onclick = function () {
      try { localStorage.setItem(DISMISS_KEY, String(NOW())); } catch (e) {}
      destroy();
    };
    if (!SALE_BAR) bar.querySelector('#promoCode').onclick = function (e) {
      var el = e.currentTarget;
      try {
        navigator.clipboard.writeText(CODE);
        var old = el.textContent;
        el.textContent = L('已複製!', 'Copied!');
        setTimeout(function () { el.textContent = old; }, 1400);
      } catch (x) {}
    };
    return bar.querySelector('#promoCd');
  }

  function buildStrip() {
    bar = document.createElement('div');
    bar.className = 'promo-strip';
    bar.id = 'promoStrip';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', CP.tr('雙十限定', 'Double Ten Sale', '双十限定'));
    // 倒數用時鐘線條 icon 代替「倒數/ends in」字樣:英文介面一行才放得下,倒數數字不會被截掉
    var clock = ''; try { if (typeof window.icon === 'function') clock = window.icon('clock', { size: 13 }); } catch (e) {}
    var t1 = '<b class="promo-st-name">' + C.zh + '</b><span class="promo-st-cd" title="' + CP.tr('倒數', 'Ends in', '倒数') + '">' + clock + '<span id="promoCd">—</span></span>';
    var t2, go;
    if (isApp) {
      // App:不寫金額(商店各國價格不同)、不提碼與官網,點了開原生 Paywall
      t2 = CP.tr('年費、買斷特價中', 'Annual & Lifetime on sale', '年费、买断特价中');
      go = '<button type="button" class="promo-st-go">' + CP.tr('看方案', 'See plans', '看方案') + '</button>';
    } else {
      var y = CP.price('yearly', false, false), lf = CP.price('lifetime', false, false);
      t2 = CP.tr('年費 NT$' + nf(y.twd) + ' 年年鎖・買斷 NT$' + nf(lf.twd),
        'Annual NT$' + nf(y.twd) + ' locked yearly · Lifetime NT$' + nf(lf.twd),
        '年费 NT$' + nf(y.twd) + ' 年年锁・买断 NT$' + nf(lf.twd));
      go = '<a class="promo-st-go" href="' + LINK + '">' + CP.tr('看方案', 'See plans', '看方案') + '</a>';
    }
    bar.innerHTML =
      '<div class="promo-st-tx"><div class="promo-st-t1">' + t1 + '</div>' +
      '<div class="promo-st-t2">' + t2 + '</div></div>' + go +
      '<button type="button" class="promo-st-x" aria-label="' + CP.tr('關閉', 'Close', '关闭') + '">' + xIcon() + '</button>';

    bar.querySelector('.promo-st-x').onclick = function (e) {
      e.stopPropagation();
      try { localStorage.setItem(DISMISS_KEY, String(NOW())); } catch (x) {}
      destroy();
    };
    bar.onclick = function (e) {
      if (isApp) { e.preventDefault(); openNativePaywall(); return; }
      if (!(e.target && e.target.closest && e.target.closest('a'))) location.href = LINK;
    };

    stripHost = fixedTopHeader();
    if (stripHost) stripHost.appendChild(bar);
    else { bar.classList.add('promo-flow'); document.body.insertBefore(bar, document.body.firstChild); }
    relayout();
    return bar.querySelector('#promoCd');
  }

  function build(k) {
    mode = k;
    isApp = k === 'strip' && inApp();
    var cd = k === 'strip' ? buildStrip() : buildPill();
    var upd = function () {
      var left = END - NOW();
      if (left <= 0 || premium()) { destroy(); return; }          // 活動一結束 / 剛付完款 → 自己消失
      // Android App 判定可能晚到:先以網頁版掛上去的,認出是 App 後換成 App 版(不帶金額、開原生 Paywall)
      if (!isApp && inApp()) { destroy(); var nk = kind(); if (nk && !dismissed(nk)) build(nk); return; }
      cd.innerHTML = mode === 'strip'
        ? CP.fmtLeft(left)
        : (SALE_BAR ? CP.tr('倒數 ', 'ends in ', '倒数 ') : L('倒數 ', 'ends in ')) + '<b>' + (SALE_BAR ? CP.fmtLeft(left) : fmt(left)) + '</b>';
    };
    upd();
    if (bar) tick = setInterval(upd, 1000);
  }

  // 已訂購的人不推銷。訂閱狀態是非同步載入的,等一下再決定;
  // 等太久不如先不顯示 —— 寧可少曝光,也不要對付費用戶跳促銷。
  function decide(tries) {
    var k = kind();
    if (!k || ended() || dismissed(k)) return;
    if (premium()) return;
    // ToolQuota 還沒載完訂閱 → 再等等(最多約 5 秒)
    var loading = false;
    try { loading = !!(window.ToolQuota && ToolQuota._trialInfo && !localStorage.getItem('premium_hint')); } catch (e) {}
    if (loading && tries > 0) return setTimeout(function () { decide(tries - 1); }, 500);
    build(k);
  }
  function start() { decide(10); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
