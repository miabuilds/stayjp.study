// focus-time.js — 每日「專注時間」計時(2026-09-20,給情勒模式的每日最低分鐘倒數用)。
// 規則:頁面在前景(visibilityState visible)且 60 秒內有任何操作(點/鍵/捲/觸)→ 每 30 秒 +0.5 分寫進 study_log[today].minutes。
// study_log 已在 SYNC_KEYS(整天取最大合併),所以分鐘數會跟著帳號走。純本機計算,沒有伺服器成本。
// 用法:載入即啟動;StudyPlan.minutesToday() 讀值。FocusTime.todayMinutes() 也可。
(function (root) {
  var TICK = 30000, IDLE = 60000;
  var last = Date.now();
  function today() { return new Date().toISOString().split('T')[0]; }
  function bump(min) {
    try {
      var all = JSON.parse(localStorage.getItem('study_log')) || {}, d = today();
      if (!all[d]) all[d] = { vocab: 0, grammar: 0, quiz: 0, minutes: 0 };
      all[d].minutes = Math.round(((all[d].minutes || 0) + min) * 10) / 10;
      localStorage.setItem('study_log', JSON.stringify(all));
    } catch (e) {}
  }
  function touch() { last = Date.now(); }
  ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(function (ev) { document.addEventListener(ev, touch, { passive: true, capture: true }); });
  setInterval(function () {
    if (document.visibilityState !== 'visible') return;
    if (Date.now() - last > IDLE) return;
    bump(TICK / 60000);
    // 面板上的倒數條跟著動(有 StudyPlan 的頁面才有;其他頁只累加)
    try { if (root.StudyPlan && root.StudyPlan.mode && root.StudyPlan.mode() === 'intense' && typeof root.doRender === 'function' && root.inHub) { root._hubSig = ''; root.doRender(); } } catch (e) {}
  }, TICK);
  root.FocusTime = { todayMinutes: function () { try { var all = JSON.parse(localStorage.getItem('study_log')) || {}; var d = all[today()]; return d && d.minutes ? d.minutes : 0; } catch (e) { return 0; } } };
})(window);
