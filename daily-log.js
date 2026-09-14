// daily-log.js — 獨立頁(刷題/AI 跟讀/YouTube 跟讀/動詞…)沒載 calendar.js,做完動作也要算進「今日目標 X/30」。
// 與 calendar.js logActivity 同一份資料(localStorage study_log[今天]{vocab,grammar,quiz}),回 app.html 時由既有雲端合併上傳。
// 用法:StayDaily.log('quiz'|'vocab'|'grammar')。若頁面本身有 Calendar(app.html)就直接轉呼叫,避免重複計。
(function (root) {
  function today() { return new Date().toISOString().split('T')[0]; }
  function log(type) {
    try {
      if (root.Calendar && typeof root.Calendar.logActivity === 'function') { root.Calendar.logActivity(type); return; }
      var all = {}; try { all = JSON.parse(localStorage.getItem('study_log')) || {}; } catch (e) { all = {}; }
      var d = today();
      if (!all[d]) all[d] = { vocab: 0, grammar: 0, quiz: 0, minutes: 0 };
      var k = (type === 'vocab' || type === 'grammar') ? type : 'quiz';
      all[d][k] = (all[d][k] || 0) + 1;
      localStorage.setItem('study_log', JSON.stringify(all));
      try { if (typeof root.STAYJP_studyDone === 'function') root.STAYJP_studyDone(); } catch (e) {}
    } catch (e) {}
  }
  root.StayDaily = { log: log, today: today };
})(window);
