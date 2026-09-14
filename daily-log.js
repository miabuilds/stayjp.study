// daily-log.js — 「今日目標」動作計數:本機 study_log + 雲端 user_daily/{uid} 加總同步。
// 為什麼要另一份雲端 doc:users/{uid}.study_log 是「整天數字取最大」合併,兩台各做 3 個動作只會顯示 3 不是 6,
// 而且只有在首頁開著時才上傳、其他裝置要重整才拉得到(用戶回饋:手機跟電腦今日目標不同步)。
// 這裡改成:每個動作 → 本機 +1、雲端 FieldValue.increment(1)(跨裝置自然加總);首頁掛 onSnapshot 即時拉回。
// 沒 firebase 的獨立頁(YouTube 跟讀/動詞)只記本機+待補傳,回首頁登入後 flush。
// 用法:StayDaily.log('quiz'|'vocab'|'grammar');首頁登入後 StayDaily.attach(uid, onUpdate)。
(function (root) {
  var PEND = 'daily_pending';   // {date:{type:n}} 還沒送上雲端的動作數
  function today() { return new Date().toISOString().split('T')[0]; }   // 與 calendar.js 同一套日界(UTC)
  function getLog() { try { return JSON.parse(localStorage.getItem('study_log')) || {}; } catch (e) { return {}; } }
  function getPend() { try { return JSON.parse(localStorage.getItem(PEND)) || {}; } catch (e) { return {}; } }
  function setPend(p) { try { localStorage.setItem(PEND, JSON.stringify(p)); } catch (e) {} }
  function norm(type) { return (type === 'vocab' || type === 'grammar') ? type : 'quiz'; }
  function db() { try { return (root.firebase && root.firebase.firestore) ? root.firebase.firestore() : null; } catch (e) { return null; } }
  function uid() { try { var u = root.firebase && root.firebase.auth && root.firebase.auth().currentUser; return u ? u.uid : null; } catch (e) { return null; } }

  // 本機 +1(不經 Calendar,避免遞迴);回傳今天的紀錄
  function bumpLocal(type) {
    var all = getLog(), d = today(), k = norm(type);
    if (!all[d]) all[d] = { vocab: 0, grammar: 0, quiz: 0, minutes: 0 };
    all[d][k] = (all[d][k] || 0) + 1;
    try { localStorage.setItem('study_log', JSON.stringify(all)); } catch (e) {}
    return all[d];
  }
  function addPending(type, n) { var p = getPend(), d = today(), k = norm(type); if (!p[d]) p[d] = {}; p[d][k] = (p[d][k] || 0) + (n || 1); setPend(p); }

  // 把待補傳的動作用 increment 送上雲端(成功才從待補清掉;失敗留著下次再送)
  var flushing = false;
  function flush() {
    var u = uid(), f = db(); if (!u || !f || flushing) return Promise.resolve();
    var p = getPend(); var dates = Object.keys(p); if (!dates.length) return Promise.resolve();
    var inc = root.firebase.firestore.FieldValue.increment;
    var payload = {}, snapshot = JSON.parse(JSON.stringify(p));
    dates.forEach(function (d) { payload[d] = {}; Object.keys(p[d]).forEach(function (k) { if (p[d][k] > 0) payload[d][k] = inc(p[d][k]); }); });
    flushing = true;
    return f.doc('user_daily/' + u).set(payload, { merge: true }).then(function () {
      var cur = getPend();   // 期間可能又多了新動作,只扣掉這次送出的量
      Object.keys(snapshot).forEach(function (d) { Object.keys(snapshot[d]).forEach(function (k) { if (cur[d]) { cur[d][k] = Math.max(0, (cur[d][k] || 0) - snapshot[d][k]); if (!cur[d][k]) delete cur[d][k]; if (!Object.keys(cur[d]).length) delete cur[d]; } }); });
      setPend(cur); flushing = false;
      if (Object.keys(cur).length) setTimeout(flush, 300);   // 送出期間又有新動作 → 接著補送,不用等下一個事件
    }).catch(function () { flushing = false; });
  }

  // 雲端今天的加總 → 本機取「大者」(本機還沒送出的待補要加回去,否則會被雲端數字蓋回)
  function applyCloud(data, cb) {
    var d = today(); var c = (data && data[d]) || null; if (!c) return;
    var all = getLog(), p = (getPend()[d]) || {}; if (!all[d]) all[d] = { vocab: 0, grammar: 0, quiz: 0, minutes: 0 };
    var changed = false;
    ['vocab', 'grammar', 'quiz'].forEach(function (k) {
      var want = Math.max(all[d][k] || 0, (c[k] || 0) + (p[k] || 0));
      if (want !== (all[d][k] || 0)) { all[d][k] = want; changed = true; }
    });
    if (changed) { try { localStorage.setItem('study_log', JSON.stringify(all)); } catch (e) {} if (cb) { try { cb(); } catch (e) {} } }
  }

  function log(type) {
    try {
      // 首頁有 Calendar:讓它做原本的事(本機 +1、提醒、App 評分時機…),再由 Calendar.logActivity 回呼 cloudBump
      if (root.Calendar && typeof root.Calendar.logActivity === 'function') { root.Calendar.logActivity(type); return; }
      bumpLocal(type); cloudBump(type);
      try { if (typeof root.STAYJP_studyDone === 'function') root.STAYJP_studyDone(); } catch (e) {}
    } catch (e) {}
  }
  // 雲端 +1(記進待補 → flush)。Calendar.logActivity 內部呼叫這個。
  function cloudBump(type) { addPending(type, 1); flush(); }

  var unsub = null;
  function attach(u, onUpdate) {
    var f = db(); if (!f || !u) return;
    if (unsub) { try { unsub(); } catch (e) {} unsub = null; }
    flush();
    unsub = f.doc('user_daily/' + u).onSnapshot(function (snap) { applyCloud(snap.exists ? snap.data() : null, onUpdate); }, function () {});
    // 回到分頁/App 回前景時補送一次(離線期間的動作)
    if (!attach._vis) { attach._vis = true; document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') flush(); }); }
  }
  function detach() { if (unsub) { try { unsub(); } catch (e) {} unsub = null; } }

  root.StayDaily = { log: log, cloudBump: cloudBump, flush: flush, attach: attach, detach: detach, today: today };
})(window);
