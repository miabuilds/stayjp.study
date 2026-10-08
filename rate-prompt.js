// rate-prompt.js — 兩段式評分提醒(2026-10)。取代 review-ask.js(網頁版單段「去評分」卡)。
//
// 為什麼要兩段:直接叫人去商店評分,不喜歡的人也會被推去 → 低分。先問「喜歡嗎?」
//   喜歡     → 第二步才請他去 App Store / Google Play 留評分(OPEN_STORE 給原生開商店)
//   還可以更好 → 打開回報表單(report-form.js → Firestore reports),意見留在我們這邊
//   之後再說 → 14 天內不再問
// Apple 規範:不給獎勵、不依評分高低分流(我們只問「喜不喜歡用」,兩邊都可以點去商店頁的連結本來就在)。
//   文案絕對不提任何好康/天數/AI 加量。
//
// 什麼時候問(RatePrompt.moment(kind),由各處的「開心時刻」呼叫):
//   quests_cleared  今天的關卡全過(path.js finish)
//   daily_goal      今日目標達標(app.html renderHub)
//   result_80       測驗/課程結果 ≥80%(path / essentials / quiz / mock-exam / jlpt-drill / 文章小測)
//   streak_N        連續 3/7/30 天(app.html renderHub)
//   review_cleared  複習清空(srs.js showDone、面板複習卡歸零)
// 誰會被問(eligibleReason 回 '' 才問,純函式,node 有測):
//   App 內(STAYJP_NATIVE)或手機瀏覽器(iPhone/Android);桌機不問
//   學習過 ≥3 個不同日子(study_log 的日期 key)
//   答過「喜歡」或「還可以再更好」→ 永遠不再問
//   「之後再說」/點背景關掉 → 14 天後才再問;總共最多出現 3 次;一天最多 1 次
//   當天第一次打開的前 60 秒不問(剛進來就跳很煩)
// 狀態存 localStorage rate_prompt_v1(app.html SYNC_KEYS 會同步到帳號),合併規則見 merge()。
// 原生那條(native-ui.js STAYJP_studyDone → STUDY_DONE → expo-store-review)不動。
// 測試:localhost 加 ?rate_debug=1 → 跳過資格檢查;console 可 RatePrompt.moment('test')。
(function (root) {
  'use strict';
  var KEY = 'rate_prompt_v1', SESS_KEY = 'rate_prompt_sess';
  var MAX_SHOWS = 3, SNOOZE_DAYS = 14, MIN_DAYS = 3, WARMUP_MS = 60000, DELAY_MS = 1400;
  var IOS_URL = 'https://apps.apple.com/app/id6778227353?action=write-review';
  var PLAY_URL = 'https://play.google.com/store/apps/details?id=com.stayjp.app&showAllReviews=true';
  var FEEDBACK_HREF = 'mailto:support@stayjp.study?subject=' + encodeURIComponent('[回報·評分回饋]');

  // ───────── 純函式(node 測試共用) ─────────
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function dayOf(d) { var x = d instanceof Date ? d : new Date(d); return x.getFullYear() + '-' + pad(x.getMonth() + 1) + '-' + pad(x.getDate()); }
  function addDays(key, n) {
    var m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(String(key || '')); if (!m) return key;
    var d = new Date(+m[1], +m[2] - 1, +m[3]); d.setDate(d.getDate() + n); return dayOf(d);
  }
  function isDay(s) { return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s); }
  /** 任何來源(本機/雲端/壞資料)→ 標準形狀 */
  function norm(s) {
    s = (s && typeof s === 'object' && !Array.isArray(s)) ? s : {};
    return {
      shows: Math.max(0, Math.min(99, parseInt(s.shows, 10) || 0)),   // 出現過幾次
      last: isDay(s.last) ? s.last : '',                               // 最後一次出現的日期
      snooze: isDay(s.snooze) ? s.snooze : '',                         // 這天之前不問(這天起可以)
      ans: (s.ans === 'like' || s.ans === 'meh') ? s.ans : '',         // 答過就永遠不問
      ansAt: isDay(s.ansAt) ? s.ansAt : '',
    };
  }
  function maxStr(a, b) { return a > b ? a : b; }
  /** 本機 × 雲端合併:次數取大、日期取新、答案取有的(兩邊都有 → 較早答的那個)。
   *  不能用 app.html 一般物件的「雲端整個蓋本機」,否則另一台舊的 shows:0 會讓已經問滿 3 次的人又被問。 */
  function merge(a, b) {
    a = norm(a); b = norm(b);
    var out = { shows: Math.max(a.shows, b.shows), last: maxStr(a.last, b.last), snooze: maxStr(a.snooze, b.snooze), ans: '', ansAt: '' };
    var pick = a.ans && b.ans ? ((b.ansAt && (!a.ansAt || b.ansAt < a.ansAt)) ? b : a) : (a.ans ? a : b);
    if (pick.ans) { out.ans = pick.ans; out.ansAt = pick.ansAt; }
    return out;
  }
  /** study_log 物件 → 有學習的不同日子數 */
  function countStudyDays(log) {
    if (!log || typeof log !== 'object') return 0;
    var n = 0;
    Object.keys(log).forEach(function (k) {
      if (!/^\d{4}-\d{1,2}-\d{1,2}$/.test(k)) return;
      var v = log[k];
      if (v && typeof v === 'object') {
        var any = false; Object.keys(v).forEach(function (f) { if (Number(v[f]) > 0) any = true; });
        if (any) n++;
      } else if (Number(v) > 0 || v === true) n++;
    });
    return n;
  }
  /** 回傳「為什麼不問」;'' = 可以問。ctx: { today, studyDays, sinceFirstOpenMs, platform, debug } */
  function eligibleReason(state, ctx) {
    var s = norm(state); ctx = ctx || {};
    if (!ctx.platform) return 'no_store';
    if (ctx.debug) return '';
    if (s.ans) return 'answered';
    if (s.shows >= MAX_SHOWS) return 'max_shows';
    if (s.last && s.last === ctx.today) return 'shown_today';
    if (s.snooze && ctx.today < s.snooze) return 'snoozed';
    if ((ctx.studyDays || 0) < MIN_DAYS) return 'few_days';
    if ((ctx.sinceFirstOpenMs || 0) < WARMUP_MS) return 'warmup';
    return '';
  }
  /** 狀態轉移(純):kind = 'shown' | 'like' | 'meh' | 'later' */
  function apply(state, kind, today) {
    var s = norm(state);
    if (kind === 'shown') { s.shows += 1; s.last = today; }
    else if (kind === 'like' || kind === 'meh') { if (!s.ans) { s.ans = kind; s.ansAt = today; } }
    else if (kind === 'later') { s.snooze = addDays(today, SNOOZE_DAYS); }
    return s;
  }
  function storeUrl(platform) { return platform === 'ios' ? IOS_URL : platform === 'android' ? PLAY_URL : ''; }

  var pure = { norm: norm, merge: merge, countStudyDays: countStudyDays, eligibleReason: eligibleReason, apply: apply, addDays: addDays, storeUrl: storeUrl,
    MAX_SHOWS: MAX_SHOWS, SNOOZE_DAYS: SNOOZE_DAYS, MIN_DAYS: MIN_DAYS, WARMUP_MS: WARMUP_MS, IOS_URL: IOS_URL, PLAY_URL: PLAY_URL };
  if (typeof module !== 'undefined' && module.exports) { module.exports = pure; return; }
  if (!root || !root.document) return;

  // ───────── 瀏覽器端 ─────────
  function today() { try { return (root.DayKey && DayKey.today) ? DayKey.today() : dayOf(new Date()); } catch (e) { return dayOf(new Date()); } }
  function readJSON(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function load() { return norm(readJSON(KEY)); }
  function save(s) {
    try { localStorage.setItem(KEY, JSON.stringify(norm(s))); } catch (e) {}
    try { if (typeof root.saveAllCloud === 'function') root.saveAllCloud(); } catch (e) {}   // app.html:跟著帳號走
  }
  // 舊 review-ask.js 的紀錄搬過來:按過「去評分」= 已答喜歡;問過 = 算一次
  (function migrate() {
    try {
      if (localStorage.getItem(KEY)) return;
      var done = localStorage.getItem('review_done'), asked = parseInt(localStorage.getItem('review_asked_ms') || '0', 10);
      if (!done && !asked) return;
      var s = norm({});
      if (asked) { s.shows = 1; s.last = dayOf(new Date(asked)); s.snooze = addDays(s.last, SNOOZE_DAYS); }
      if (done) { s.ans = 'like'; s.ansAt = s.last || today(); }
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch (e) {}
  })();
  // 當天第一次打開的時間(本機就好,不同步)
  var sess = null;
  function touchSess() {
    if (!sess) sess = readJSON(SESS_KEY);
    if (!sess || sess.d !== today()) { sess = { d: today(), t: Date.now() }; try { localStorage.setItem(SESS_KEY, JSON.stringify(sess)); } catch (e) {} }
    return sess;
  }
  touchSess();

  function debugOn() {
    try { return /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) && /[?&]rate_debug=1\b/.test(location.search); } catch (e) { return false; }
  }
  function platform() {
    try {
      var n = root.STAYJP_NATIVE;
      if (n && n.isNativeApp) return (n.platform === 'ios' || n.platform === 'android') ? { p: n.platform, app: true } : null;
    } catch (e) {}
    var ua = navigator.userAgent || '';
    if (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && (navigator.maxTouchPoints || 0) > 1)) return { p: 'ios', app: false };
    if (/Android/i.test(ua)) return { p: 'android', app: false };
    return null;   // 桌機:評不了 App,不問
  }
  function ctxNow() {
    var pf = platform(), s = touchSess();   // 開著跨過午夜:從現在起算新的一天
    return { today: today(), studyDays: countStudyDays(readJSON('study_log')), sinceFirstOpenMs: Date.now() - (s.t || Date.now()), platform: pf ? pf.p : '', debug: debugOn() };
  }
  function lang() { try { return (typeof I18n !== 'undefined' && I18n.getLang) ? I18n.getLang() : (localStorage.getItem('ui_lang') || 'zh-TW'); } catch (e) { return 'zh-TW'; } }
  function L(zh, en) {
    var l = lang(); if (l === 'en') return en;
    if (l === 'zh-CN') { try { if (typeof root.cvt === 'function') return root.cvt(zh); } catch (e) {} }
    return zh;
  }
  function track(ev, params) {
    try {
      if (typeof root.track === 'function') root.track(ev, params);
      else if (typeof root.gtag === 'function') root.gtag('event', ev, params || {});
    } catch (e) {}
  }
  // 有其他「要使用者回應」的視窗開著就先別疊上去(確認框、回報表單、付費牆、小狸面板、抽籤、導覽、強制更新)
  var BUSY_SEL = '#auiMask,.rpf-mask,.pt-ask,#pwBackdrop,#omkMask,#tourTip,#stayjpForceUpd,#overlay.show,.aic-mask,.onb-mask';
  function busy() {
    try {
      if (document.hidden) return true;
      if (document.body && document.body.classList.contains('tutor-open')) return true;
      var els = document.querySelectorAll(BUSY_SEL);
      for (var i = 0; i < els.length; i++) { if (els[i].getClientRects().length) return true; }   // display:none 的殘留節點不算
    } catch (e) {}
    return false;
  }

  function css() {
    if (document.getElementById('rtpCss')) return;
    var st = document.createElement('style'); st.id = 'rtpCss';
    st.textContent = [
      '.rtp-mask{position:fixed;inset:0;z-index:99000;background:rgba(20,16,12,.38);display:flex;align-items:flex-end;justify-content:center;animation:rtpFade .2s ease}',
      '.rtp{position:relative;box-sizing:border-box;width:100%;max-width:460px;background:var(--bg2,#fff);color:var(--tx,#2C2C2C);border:1px solid var(--bd,#E8E5E0);border-bottom:0;border-radius:22px 22px 0 0;box-shadow:0 -10px 36px rgba(0,0,0,.18);padding:14px 20px calc(20px + env(safe-area-inset-bottom,0px));text-align:center;animation:rtpUp .28s cubic-bezier(.2,.8,.2,1);font-family:inherit}',
      '@media(min-width:620px){.rtp-mask{align-items:center}.rtp{border-radius:22px;border-bottom:1px solid var(--bd,#E8E5E0);padding-bottom:22px}}',
      '.rtp-grab{width:38px;height:4px;border-radius:999px;background:var(--bd,#E8E5E0);margin:0 auto 14px}',
      '.rtp-x{position:absolute;top:10px;right:10px;width:36px;height:36px;border:0;background:none;color:var(--tx3,var(--tx2,#999));font-size:22px;line-height:1;cursor:pointer;border-radius:10px}',
      '.rtp-x:focus-visible,.rtp-btn:focus-visible{outline:2px solid var(--ac,#C6553B);outline-offset:2px}.rtp-btn:focus:not(:focus-visible),.rtp:focus{outline:none}',
      '.rtp img{display:block;width:96px;height:80px;object-fit:contain;margin:0 auto 12px}',
      '.rtp h3{margin:0;font-size:18px;font-weight:800;line-height:1.45;color:var(--tx,#2C2C2C)}',
      '.rtp p{margin:8px auto 0;max-width:340px;font-size:14px;line-height:1.7;color:var(--tx2,#7A7A7A)}',
      '.rtp-btns{display:flex;flex-direction:column;gap:12px;margin-top:20px}',
      '.rtp-btn{display:block;width:100%;box-sizing:border-box;font:inherit;font-size:15.5px;font-weight:800;border-radius:14px;padding:14px 16px;cursor:pointer;border:1.5px solid var(--bd,#E8E5E0);background:var(--bg3,#F3F1ED);color:var(--tx,#2C2C2C);-webkit-tap-highlight-color:transparent}',
      '.rtp-btn.pri{background:var(--ac,#C6553B);border-color:var(--ac,#C6553B);color:#fff}',
      '.rtp-btn.txt{background:none;border-color:transparent;color:var(--tx2,#7A7A7A);font-weight:700;padding:8px 16px}',
      '.rtp-btn:active{transform:translateY(1px)}',
      'body.rtp-open #quotaBadge,body.rtp-open #tutorFab,body.rtp-open #tutorHint,body.rtp-open #backToTop{display:none!important}',
      '@keyframes rtpUp{from{transform:translateY(40px);opacity:0}to{transform:none;opacity:1}}',
      '@keyframes rtpFade{from{opacity:0}to{opacity:1}}',
      '@media (prefers-reduced-motion: reduce){.rtp,.rtp-mask{animation:none}.rtp-btn:active{transform:none}}',
    ].join('\n');
    document.head.appendChild(st);
  }

  var pending = null, open = null, cur = { kind: '', pf: null };
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function paint(step) {
    if (!open) return;
    var box = open.querySelector('.rtp'), store = cur.pf && cur.pf.p === 'android' ? 'Google Play' : 'App Store', h;
    if (step === 'like') {
      h = '<img src="images/mascot/tanuki-thanks.png" alt="">'
        + '<h3 id="rtpT">' + L('太好了!', 'That makes our day!') + '</h3>'
        + '<p>' + L('可以幫我們在 ' + store + ' 留個評分嗎?一分鐘就好', 'Could you leave a quick rating on the ' + store + '? It only takes a minute.') + '</p>'
        + '<div class="rtp-btns"><button type="button" class="rtp-btn pri" data-a="store">' + L('去評分', 'Rate StayJP') + '</button>'
        + '<button type="button" class="rtp-btn txt" data-a="close">' + L('下次吧', 'Not now') + '</button></div>';
    } else if (step === 'meh') {
      h = '<img src="images/mascot/tanuki-good.png" alt="">'
        + '<h3 id="rtpT">' + L('想聽聽哪裡可以更好', 'We\'d love to hear what could be better') + '</h3>'
        + '<p>' + L('哪裡卡、哪裡不好用、想要什麼功能,直接說沒關係,每一則我們都會看。', 'What felt clunky, what\'s missing, what you wish it did — every note gets read.') + '</p>'
        + '<div class="rtp-btns"><button type="button" class="rtp-btn pri" data-a="feedback">' + L('告訴我們', 'Tell us') + '</button>'
        + '<button type="button" class="rtp-btn txt" data-a="close">' + L('下次吧', 'Not now') + '</button></div>';
    } else {
      h = '<img src="images/mascot/tanuki-good.png" alt="">'
        + '<h3 id="rtpT">' + L('喜歡用 StayJP 學日文嗎?', 'Enjoying learning Japanese with StayJP?') + '</h3>'
        + '<p>' + L('老實說就好,你的感覺會決定我們接下來改什麼。', 'Be honest — it decides what we work on next.') + '</p>'
        + '<div class="rtp-btns"><button type="button" class="rtp-btn pri" data-a="like">' + L('喜歡!', 'Yes, I love it!') + '</button>'
        + '<button type="button" class="rtp-btn" data-a="meh">' + L('還可以再更好', 'It could be better') + '</button>'
        + '<button type="button" class="rtp-btn txt" data-a="later">' + L('之後再說', 'Maybe later') + '</button></div>';
    }
    box.innerHTML = '<div class="rtp-grab" aria-hidden="true"></div>'
      + '<button type="button" class="rtp-x" data-a="' + (step === 'ask' ? 'later' : 'close') + '" aria-label="' + esc(L('關閉', 'Close')) + '">×</button>' + h;
    box.setAttribute('data-step', step);
    try { box.focus({ preventScroll: true }); } catch (e) {}   // 焦點放在對話框本身(讀屏會念標題),不把主按鈕框起來
  }
  function close() {
    if (open) { try { open.remove(); } catch (e) {} open = null; }
    try { document.body.classList.remove('rtp-open'); document.removeEventListener('keydown', onKey); } catch (e) {}
  }
  function onKey(e) { if (e.key === 'Escape' && open) act(open.querySelector('.rtp').getAttribute('data-step') === 'ask' ? 'later' : 'close'); }
  function answer(a) { save(apply(load(), a, today())); track('rate_prompt_answer', { answer: a, trigger: cur.kind }); }
  function act(a) {
    if (a === 'like') { answer('like'); paint('like'); return; }
    if (a === 'meh') { answer('meh'); paint('meh'); return; }
    if (a === 'later') { answer('later'); close(); return; }
    if (a === 'close') { close(); return; }
    if (a === 'store') {
      var pf = cur.pf || platform(), url = storeUrl(pf && pf.p);
      track('rate_store_open', { platform: pf ? pf.p : '', app: pf && pf.app ? 1 : 0 });
      close();
      if (!url) return;
      try { if (pf && pf.app && root.ReactNativeWebView) { root.ReactNativeWebView.postMessage(JSON.stringify({ type: 'OPEN_STORE', url: url })); return; } } catch (e) {}
      try { var w = root.open(url, '_blank', 'noopener'); if (!w) location.href = url; } catch (e) { location.href = url; }
      return;
    }
    if (a === 'feedback') {
      track('rate_feedback_open', {});
      close();
      try { if (typeof root.stayjpReportOpen === 'function') { root.stayjpReportOpen(FEEDBACK_HREF); return; } } catch (e) {}
      try { location.href = FEEDBACK_HREF; } catch (e) {}
    }
  }
  function show(kind) {
    if (open || !document.body) return false;
    var pf = platform(); if (!pf) return false;
    cur = { kind: kind || '', pf: pf };
    css();
    open = document.createElement('div'); open.className = 'rtp-mask';
    open.innerHTML = '<div class="rtp" role="dialog" aria-modal="true" aria-labelledby="rtpT" tabindex="-1"></div>';
    open.addEventListener('click', function (e) {
      if (e.target === open) { act(open.querySelector('.rtp').getAttribute('data-step') === 'ask' ? 'later' : 'close'); return; }
      var b = e.target.closest ? e.target.closest('[data-a]') : null; if (b) act(b.getAttribute('data-a'));
    });
    document.body.appendChild(open);
    document.body.classList.add('rtp-open');
    document.addEventListener('keydown', onKey);
    paint('ask');
    save(apply(load(), 'shown', today()));
    track('rate_prompt_shown', { trigger: cur.kind, platform: pf.p, app: pf.app ? 1 : 0 });
    return true;
  }
  /** 開心時刻呼叫。結果畫面先穩定(≥1.2 秒)再出現;有其他要回應的視窗就等一下,等不到就算了(明天還有機會)。 */
  function moment(kind) {
    try {
      if (open || pending) return false;
      if (eligibleReason(load(), ctxNow())) return false;
      var tries = 0;
      var go = function () {
        pending = null;
        if (open || eligibleReason(load(), ctxNow())) return;
        if (busy()) { if (++tries <= 4) pending = setTimeout(go, 2500); return; }
        show(kind);
      };
      pending = setTimeout(go, DELAY_MS);
      return true;
    } catch (e) { return false; }
  }
  function reason() { return eligibleReason(load(), ctxNow()); }

  root.RatePrompt = { moment: moment, show: show, close: close, reason: reason, state: load, merge: merge, KEY: KEY, _pure: pure };
})(typeof window !== 'undefined' ? window : null);
