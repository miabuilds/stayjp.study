// 來源追蹤:登入後把這台裝置記到的來源(campaign.js 寫的 stayjp_acq_first / stayjp_acq_last)寫進 users/{uid}.acq。
// 只寫一次(帳號已經有 acq 就不動),附上帳號建立時間 → 報表只算「這之後才註冊」的帳號,舊帳號不會被誤算。
// 報表:node scripts/acq-report.mjs [天數]
(function () {
  if (window.__stayjpAcq) return;
  window.__stayjpAcq = true;
  function read(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function platform() {
    try { if (window.STAYJP_NATIVE && window.STAYJP_NATIVE.isNativeApp) return window.STAYJP_NATIVE.platform || 'app'; } catch (e) {}
    return 'web';
  }
  function save(user) {
    if (!user) return;
    try {
      var done = localStorage.getItem('stayjp_acq_saved');
      if (done === user.uid) return;
      var ref = firebase.firestore().doc('users/' + user.uid);
      ref.get().then(function (s) {
        if (s.exists && s.data() && s.data().acq) { localStorage.setItem('stayjp_acq_saved', user.uid); return; }
        var created = Date.parse((user.metadata && user.metadata.creationTime) || '') || 0;
        return ref.set({ acq: {
          first: read('stayjp_acq_first'), last: read('stayjp_acq_last'),
          platform: platform(), acct_created: created, saved_at: Date.now()
        } }, { merge: true }).then(function () { localStorage.setItem('stayjp_acq_saved', user.uid); });
      }).catch(function () {});
    } catch (e) {}
  }
  var tries = 0;
  (function hook() {
    try {
      if (window.firebase && firebase.apps && firebase.apps.length && firebase.auth && firebase.firestore) {
        firebase.auth().onAuthStateChanged(save);
        return;
      }
    } catch (e) {}
    if (++tries < 30) setTimeout(hook, 500);
  })();
})();
