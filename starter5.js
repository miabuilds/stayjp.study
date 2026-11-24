// 新手 5 天挑戰(2026-11-24):註冊後第一週學滿 5 天 → 送 1 顆連勝救星。
// 為什麼:學滿 5 天的人幾乎不走(上月學 15 天以上的 41 人只走 2 個),學 1 天的走掉七成 → 把「前 5 天」做成看得到的目標。
// 不另存進度:起點=study_log 第一個有學的日子,往後 7 天內數有學的天數(study_log 會跟帳號同步,換裝置也對得上)。
// 只記「領過了」在本機 starter5_v1;連勝救星本來就有上限(免費 1 顆),跨裝置重領也不會多。
(function (root) {
  var KEY = 'starter5_v1', NEED = 5, SPAN = 7;
  var L = function (zh, en) { return (typeof enOr === 'function') ? enOr((typeof cvt === 'function' ? cvt(zh) : zh), en) : zh; };
  function today() { try { return DayKey.today(); } catch (e) { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); } }
  function diff(a, b) { return Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 86400000); }
  function studied() {
    var out = [];
    try {
      var sl = JSON.parse(localStorage.getItem('study_log') || '{}');
      Object.keys(sl).forEach(function (k) { var x = sl[k]; if (/^\d{4}-\d{2}-\d{2}$/.test(k) && x && ((x.vocab || 0) + (x.grammar || 0) + (x.quiz || 0)) > 0) out.push(k); });
    } catch (e) {}
    return out.sort();
  }
  function st() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  // 回 null=不顯示;否則 {n: 已學天數, todayDone, left: 還剩幾天(含今天), start}
  function state() {
    var s = st(); if (s.done || s.off) return null;
    var days = studied(), t = today();
    if (!days.length) return { n: 0, todayDone: false, left: SPAN, start: null };
    var start = days[0], age = diff(start, t);
    if (age < 0 || age >= SPAN) return null;                       // 第一次學已經超過一週 → 老用戶或挑戰過期
    var n = days.filter(function (d) { return diff(start, d) < SPAN; }).length;
    var todayDone = days.indexOf(t) >= 0, left = SPAN - age;       // left 含今天
    if (n < NEED && n + left - (todayDone ? 1 : 0) < NEED) return null;   // 剩下的天數全學也湊不到 5 天 → 不拿它煩人
    return { n: Math.min(n, NEED), todayDone: todayDone, left: left, start: start };
  }
  function reward(S) {
    var s = st(); if (s.done) return;
    s.done = S.start; try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
    var got = false; try { got = !!(typeof Streak !== 'undefined' && Streak.grantSaver && Streak.grantSaver()); } catch (e) {}   // Streak 是 const,不在 window 上,不能用 root.Streak 判斷
    try { if (typeof track === 'function') track('starter5_done', { got: got ? 1 : 0 }); } catch (e) {}
    var msg = got
      ? L('第一週就學滿 5 天，送你 1 顆連勝救星。哪天真的沒空，它會自動幫你把連勝接起來。', 'Five study days in your first week — here\'s a streak saver. If you miss a day, it keeps your streak alive automatically.')
      : L('第一週就學滿 5 天，最難的開頭你已經過了。照這個節奏走就對了。', 'Five study days in your first week — the hardest part is behind you. Keep this pace.');
    setTimeout(function () {
      try { if (root.AppUI && AppUI.alert) AppUI.alert(msg, { title: L('新手 5 天挑戰完成', 'Starter challenge complete'), tone: 'cheer' }); else if (root.showToast) showToast(msg); } catch (e) {}
      try { if (root.hubInvalidate) hubInvalidate(); if (typeof renderHub === 'function' && document.querySelector('.hub')) renderHub(); } catch (e) {}
    }, 900);
  }
  var _seen = '';
  function hubHtml() {
    var S; try { S = state(); } catch (e) { S = null; }
    if (!S) return '';
    if (S.n >= NEED) { reward(S); return ''; }
    var mark = S.n + '|' + (S.todayDone ? 1 : 0);
    if (mark !== _seen) { _seen = mark; try { if (typeof track === 'function') track('starter5_show', { n: S.n, today: S.todayDone ? 1 : 0 }); } catch (e) {} }
    var dots = ''; for (var i = 0; i < NEED; i++) dots += '<span class="s5-dot' + (i < S.n ? ' on' : '') + (i === S.n && !S.todayDone ? ' next' : '') + '"></span>';
    var line;
    if (!S.n) line = L('第一週學滿 5 天，送你 1 顆連勝救星', 'Study 5 days in your first week to earn a streak saver');
    else if (S.todayDone) line = L('今天完成，' + S.n + ' / 5 天。明天再來學一下', 'Done for today — ' + S.n + ' / 5 days. Come back tomorrow');
    else line = L('已經 ' + S.n + ' / 5 天，今天學一下就 ' + (S.n + 1) + ' 天', S.n + ' / 5 days so far — study today to make it ' + (S.n + 1));
    return '<div class="s5" role="status">'
      + '<div class="s5-top"><span class="s5-ttl"><i data-ic=flag></i> ' + L('新手 5 天挑戰', 'Starter challenge') + '</span><span class="s5-dots">' + dots + '</span></div>'
      + '<div class="s5-line">' + line + '</div>'
      + '</div>';
  }
  function sig() { try { var S = state(); return S ? S.n + (S.todayDone ? 'd' : 'n') + S.left : ''; } catch (e) { return ''; } }
  root.Starter5 = { hubHtml: hubHtml, sig: sig, state: state };
})(window);
