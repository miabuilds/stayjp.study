// 安全返回:先 history.back(),0.7 秒內頁面沒離開(也沒觸發同頁 popstate)就改去備用頁。
// 為什麼:App 重開後 WebView 直接開上次那頁,history.length 可能 >1 但其實回不去 →
// 「有紀錄就 back」的返回鍵按了完全沒反應,使用者卡死在頁面裡(Mia 2026-10-18 短劇跟讀實測)。
// 用法:safeBack('app.html') 或 safeBack(url, true) 用 replace 不留紀錄。
(function () {
  window.safeBack = function (fallback, replace) {
    var url = location.href, left = false;
    var mark = function () { left = true; };
    window.addEventListener('pagehide', mark, { once: true });
    window.addEventListener('popstate', mark, { once: true });
    var go = function () { if (replace) location.replace(fallback); else location.href = fallback; };
    if (history.length <= 1) return go();
    try { history.back(); } catch (e) { return go(); }
    setTimeout(function () {
      window.removeEventListener('pagehide', mark);
      window.removeEventListener('popstate', mark);
      if (!left && location.href === url) go();
    }, 700);
  };
})();
