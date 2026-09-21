// 網頁版的「給個評分」入口(2026-09-21)。
// 為什麼要有:App 內有原生評分提醒(reviewPrompt.ts,連續學習 3 天後彈),但網頁版完全沒有入口 ——
// 而 39% 的營收來自網頁。商店頁上只有 3 則評論,這個缺口直接影響下載轉換。
// 原則:
//   1. 只在正向時刻問(今天達標),不是一進站就問
//   2. 連續學習 ≥3 天才問(新用戶不會被煩)
//   3. 按過「去評分」就永遠不再問;按「以後再說」隔 120 天才會再問一次
//   4. App 內(STAYJP_NATIVE)不顯示 —— 那邊走原生彈窗,兩個一起跳很煩
//   5. 只在手機顯示:桌機點過去也評不了 iOS
(function (root) {
  var K_ASKED = 'review_asked_ms', K_DONE = 'review_done';
  var GAP_MS = 120 * 86400000, MIN_STREAK = 3;
  var IOS = 'https://apps.apple.com/app/id6778227353?action=write-review';
  var PLAY = 'https://play.google.com/store/apps/details?id=com.stayjp.app&showAllReviews=true';

  function L(zh, en) { try { return (typeof enOr === 'function') ? enOr(zh, en) : zh; } catch (e) { return zh; } }
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  function store() {
    var ua = navigator.userAgent || '';
    if (/iPhone|iPad|iPod/i.test(ua)) return { url: IOS, name: 'App Store' };
    if (/Android/i.test(ua)) return { url: PLAY, name: 'Google Play' };
    return null;   // 桌機:不問
  }
  function eligible() {
    try {
      if (root.STAYJP_NATIVE && root.STAYJP_NATIVE.isNativeApp) return false;   // App 內走原生
      if (get(K_DONE)) return false;
      if (!store()) return false;
      var last = parseInt(get(K_ASKED) || '0', 10);
      if (last && Date.now() - last < GAP_MS) return false;
      var streak = (typeof _hubStreak === 'function') ? _hubStreak() : 0;
      return streak >= MIN_STREAK;
    } catch (e) { return false; }
  }

  function css() {
    if (document.getElementById('rvaCss')) return;
    var s = document.createElement('style'); s.id = 'rvaCss';
    s.textContent = [
      '#rvaCard{position:fixed;left:12px;right:12px;bottom:calc(var(--btm-h,56px) + 14px + env(safe-area-inset-bottom,0px));z-index:9400;background:var(--bg2,#fff);border:1px solid var(--bd,#E8E5E0);border-radius:18px;box-shadow:0 10px 34px rgba(0,0,0,.18);padding:16px;animation:rvaUp .25s ease}',
      '@keyframes rvaUp{from{transform:translateY(16px);opacity:0}to{transform:none;opacity:1}}',
      '@media(min-width:620px){#rvaCard{left:auto;right:20px;width:360px}}',
      '#rvaCard .rva-top{display:flex;align-items:center;gap:12px}',
      '#rvaCard img{width:46px;height:46px;object-fit:contain;flex:none}',
      '#rvaCard b{display:block;font-size:15px;color:var(--tx,#2C2C2C)}',
      '#rvaCard small{display:block;font-size:12.5px;color:var(--tx2,#7A7A7A);line-height:1.6;margin-top:3px}',
      '#rvaCard .rva-btns{display:flex;gap:10px;margin-top:14px}',
      '#rvaCard button{flex:1;font:inherit;font-size:14px;font-weight:800;border-radius:12px;padding:11px 12px;cursor:pointer;border:1px solid var(--bd,#E8E5E0);background:var(--bg3,#F3F1ED);color:var(--tx,#2C2C2C)}',
      '#rvaCard .rva-go{background:var(--ac,#D4654A);border-color:var(--ac,#D4654A);color:#fff}',
      // 卡片在最下面 → 左下角額度小牌、右下角小狸鈕/回頂部會壓到按鈕,顯示期間先收起來
      'body.rva-open #quotaBadge,body.rva-open #tutorFab,body.rva-open #tutorHint,body.rva-open .bt,body.rva-open #backToTop{display:none!important}',
    ].join('\n');
    document.head.appendChild(s);
  }

  function close() { var c = document.getElementById('rvaCard'); if (c) c.remove(); try { document.body.classList.remove('rva-open'); } catch (e) {} }
  function later() { set(K_ASKED, String(Date.now())); close(); }
  function go() {
    var st = store(); set(K_DONE, '1'); set(K_ASKED, String(Date.now()));
    try { if (typeof track === 'function') track('review_ask_click', { store: st ? st.name : '' }); } catch (e) {}
    close();
    if (st) { try { window.open(st.url, '_blank', 'noopener'); } catch (e) { location.href = st.url; } }
  }

  function show() {
    if (document.getElementById('rvaCard')) return;
    var st = store(); if (!st) return;
    css();
    var d = document.createElement('div'); d.id = 'rvaCard';
    d.innerHTML = '<div class="rva-top"><img src="images/mascot/tanuki-p06.png" alt="">'
      + '<div><b>' + L('今天也達標了 🎉', 'Goal hit again today 🎉') + '</b>'
      + '<small>' + L('用得順手的話，到 ' + st.name + ' 給個評分好嗎？一個人做的工具，評價真的有差。', 'If it\'s working for you, a quick rating on the ' + st.name + ' helps a lot — this is a one-person project.') + '</small></div></div>'
      + '<div class="rva-btns"><button type="button" onclick="ReviewAsk.later()">' + L('以後再說', 'Later') + '</button>'
      + '<button type="button" class="rva-go" onclick="ReviewAsk.go()">' + L('去評分', 'Rate it') + '</button></div>';
    document.body.appendChild(d);
    try { document.body.classList.add('rva-open'); } catch (e) {}
    try { if (typeof track === 'function') track('review_ask_show', { store: st.name }); } catch (e) {}
  }

  // 達標的那一刻問(renderHub 放完彩蛋後呼叫),彩蛋先跑完再出現
  function maybe(delay) {
    if (!eligible()) return;
    setTimeout(show, typeof delay === 'number' ? delay : 1800);
  }

  root.ReviewAsk = { maybe: maybe, show: show, later: later, go: go, eligible: eligible };
})(window);
