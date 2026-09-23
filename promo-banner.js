// 限時活動倒數條(iHerb 那種)。Mia 2026-09-23。
//
// ⚠️ App 內一律不顯示 —— Apple 3.1.1:不能在 App 裡給折扣碼或把人導去站外付款,
//    StayJP 2026 已經被這條退件過一次。iOS 使用者在「瀏覽器」看到活動是合法的,
//    在 App 裡看到就不是。所以只要偵測到原生殼(html.stayjp-native)就直接不掛。
//
// 其他不顯示的情況:活動已結束(自動失效,不必手動拆)、已訂購、剛剛按過關閉。
// 版位選底部浮動藥丸而不是頂部橫幅:頂部要推擠版面,app.html 的固定表頭會疊到;
// 底部只要避開既有的 bottom nav 就不會動到任何現有排版。
(function () {
  // 活動內容統一由 campaign.js 提供(它同時負責把過期的碼從 localStorage 清掉)。
  // 拿不到就不顯示 —— 寧可不出現,也不要顯示一個對不上的活動。
  var C = window.Campaign && window.Campaign.active && window.Campaign.active();
  if (!C) return;
  var END = C.end, CODE = C.code, LINK = C.link;
  var DISMISS_KEY = 'promo_tsukimi_off';
  var DISMISS_MS = 6 * 3600 * 1000;              // 關掉只安靜 6 小時,越接近截止越該看得到

  function ended() { return Date.now() > END; }
  function inApp() {
    try {
      if (document.documentElement.classList.contains('stayjp-native')) return true;
      if (window.STAYJP_NATIVE && window.STAYJP_NATIVE.isNativeApp) return true;
    } catch (e) {}
    return false;
  }
  function dismissed() {
    try { return Date.now() - Number(localStorage.getItem(DISMISS_KEY) || 0) < DISMISS_MS; } catch (e) { return false; }
  }
  function premium() {
    // 已訂購就不推銷。tool-quota.js 會把狀態寫進 premium_hint,沒載 firebase 的頁面也讀得到。
    try {
      if (window.ToolQuota && ToolQuota._trialInfo) return !!ToolQuota._trialInfo().premium;
      return localStorage.getItem('premium_hint') === '1';
    } catch (e) { return false; }
  }
  if (ended() || inApp() || dismissed()) return;

  var L = function (zh, en) { try { return (typeof enOr === 'function') ? enOr(zh, en) : zh; } catch (e) { return zh; } };

  var css = document.createElement('style');
  css.textContent =
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
    '@media(max-width:420px){.promo-bar{font-size:12px;padding:9px 10px;gap:7px}.promo-go{padding:6px 11px}}';
  (document.head || document.documentElement).appendChild(css);

  var bar, tick;
  function fmt(ms) {
    var s = Math.max(0, Math.floor(ms / 1000));
    var d = Math.floor(s / 86400); s %= 86400;
    var h = Math.floor(s / 3600); s %= 3600;
    var m = Math.floor(s / 60); s %= 60;
    var p = function (n) { return String(n).padStart(2, '0'); };
    return (d > 0 ? d + L(' 天 ', 'd ') : '') + p(h) + ':' + p(m) + ':' + p(s);
  }
  function build() {
    bar = document.createElement('div');
    bar.className = 'promo-bar';
    bar.innerHTML =
      '<div class="promo-tx"><div><b>' + L(C.zh, C.en) + '</b> · ' +
        '<span id="promoCd">—</span></div>' +
        '<div class="promo-t2">' + L('折扣碼', 'Code') + ' <span class="promo-code" id="promoCode">' + CODE + '</span> ' +
        L('點一下複製', 'tap to copy') + '</div></div>' +
      '<a class="promo-go" href="' + LINK + '">' + L('看方案', 'View') + '</a>' +
      '<button class="promo-x" aria-label="' + L('關閉', 'Close') + '">×</button>';
    document.body.appendChild(bar);

    bar.querySelector('.promo-x').onclick = function () {
      try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch (e) {}
      if (tick) clearInterval(tick);
      bar.remove();
    };
    bar.querySelector('#promoCode').onclick = function (e) {
      var el = e.currentTarget;
      try {
        navigator.clipboard.writeText(CODE);
        var old = el.textContent;
        el.textContent = L('已複製!', 'Copied!');
        setTimeout(function () { el.textContent = old; }, 1400);
      } catch (x) {}
    };

    var cd = bar.querySelector('#promoCd');
    var upd = function () {
      var left = END - Date.now();
      if (left <= 0) { clearInterval(tick); bar.remove(); return; }   // 活動一結束自己消失
      cd.innerHTML = L('倒數 ', 'ends in ') + '<b>' + fmt(left) + '</b>';
    };
    upd();
    tick = setInterval(upd, 1000);
  }

  // 已訂購的人不推銷。訂閱狀態是非同步載入的,等一下再決定;
  // 等太久不如先不顯示 —— 寧可少曝光,也不要對付費用戶跳促銷。
  function decide(tries) {
    if (ended() || dismissed()) return;
    if (premium()) return;
    // ToolQuota 還沒載完訂閱 → 再等等(最多約 5 秒)
    var loading = false;
    try { loading = !!(window.ToolQuota && ToolQuota._trialInfo && !localStorage.getItem('premium_hint')); } catch (e) {}
    if (loading && tries > 0) return setTimeout(function () { decide(tries - 1); }, 500);
    build();
  }
  function start() { decide(10); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
