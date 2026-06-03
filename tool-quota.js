// ========================================================================
// tool-quota.js — Freemium 簡化版(2026-06-03)
//
// 規則:
//   - 所有內容(單字 / 文法 / 例句 / 動詞變化表 / 語音)→ 完全免費,不限
//   - 所有 Premium 練習工具共用「每日試用 3 次」一個 bucket:
//     SRS / 快速背單字 / 跟讀 / 動詞變化練習 / Quiz / 讀解 / 聽力 / 今日故事
//   - 模考:每等級 1 套 lifetime(獨立計數)
//   - Premium = unlimited
//
// 設計原則:
//   1. **不影響線上使用者** — 只對白名單 owner email 啟動 gating
//      (其他 user 完全沒感覺,所有 tool 維持原本無限制行為)
//
// 等正式金流 ready + 想開放給所有 user 時,把白名單檢查改成
// 「登入 user 且 not premium」即可。
// ========================================================================

(function() {
  const QUOTA_WHITELIST = new Set([
    'abc83327@gmail.com',
    'stayjpplan@gmail.com',
  ]);

  // 統一每日試用次數
  const DAILY_LIMIT = 3;
  const KEY = 'daily';

  function dateKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function loadCount() {
    try { return JSON.parse(localStorage.getItem('tool_usage_' + dateKey())) || {}; } catch (e) { return {}; }
  }
  function saveCount(d) {
    try { localStorage.setItem('tool_usage_' + dateKey(), JSON.stringify(d)); } catch (e) {}
  }

  // 訂閱快取 — 由 Firestore listener 更新
  let cachedSub = null;
  let cachedUserEmail = null;
  let authReady = false;

  function isPremium() {
    if (!cachedSub) return false;
    if (cachedSub.status !== 'active' && cachedSub.status !== 'trialing' && cachedSub.status !== 'cancelled') return false;
    return (cachedSub.expiresAt || 0) > Date.now();
  }

  function shouldGate() {
    if (!authReady) return false;
    if (!cachedUserEmail) return false;
    if (!QUOTA_WHITELIST.has(cachedUserEmail)) return false;
    if (isPremium()) return false;
    return true;
  }

  function canUse(scope) {
    if (!shouldGate()) return true;
    if (scope && scope.startsWith('mock_exam_')) {
      return localStorage.getItem('mock_completed_' + scope.replace('mock_exam_', '')) !== '1';
    }
    return (loadCount()[KEY] || 0) < DAILY_LIMIT;
  }

  function consume(scope) {
    if (!shouldGate()) return;
    if (scope && scope.startsWith('mock_exam_')) return; // 模考另記
    const c = loadCount();
    c[KEY] = (c[KEY] || 0) + 1;
    saveCount(c);
    refreshBadge();
  }

  function showPaywall(scope) {
    const isMock = scope && scope.startsWith('mock_exam_');
    const msg = isMock
      ? `免費版每等級可試 1 套模考,你已完成過 ${scope.replace('mock_exam_','').toUpperCase()}。\n升級 Premium 可無限做模考 + 詳解 + 錯題回顧。`
      : `免費版每天可試用 Premium 工具 ${DAILY_LIMIT} 次,你用完了。\n升級 Premium 無限次使用,還能跨裝置同步。`;
    if (confirm(`免費額度用完\n\n${msg}\n\n要看訂閱方案嗎?`)) {
      window.location.href = 'pricing.html';
    }
  }

  // ── UI badge ──
  function refreshBadge() {
    let badge = document.getElementById('quotaBadge');
    if (!shouldGate()) {
      if (badge) badge.remove();
      return;
    }
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'quotaBadge';
      badge.style.cssText = 'position:fixed;bottom:14px;left:14px;background:rgba(0,0,0,.78);color:#fff;padding:8px 12px;border-radius:10px;font-size:11px;font-family:-apple-system,sans-serif;line-height:1.5;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,.2);cursor:pointer;max-width:200px';
      badge.title = '免費版 quota(只 owner 看得到)。點擊看訂閱狀態。';
      badge.onclick = () => window.location.href = 'account.html';
      document.body.appendChild(badge);
    }
    const c = loadCount();
    const used = c[KEY] || 0;
    const color = used >= DAILY_LIMIT ? '#EF4444' : (used >= DAILY_LIMIT - 1 ? '#F59E0B' : '#fff');
    badge.innerHTML = `
      <div style="font-weight:700;margin-bottom:2px">免費版</div>
      <div style="color:${color}">今日試用 ${used}/${DAILY_LIMIT}</div>
    `;
  }

  // ── Firestore subscription watcher ──
  function watchSubscription() {
    if (typeof firebase === 'undefined' || !firebase.auth) return;
    firebase.auth().onAuthStateChanged(user => {
      authReady = true;
      if (!user) { cachedUserEmail = null; cachedSub = null; refreshBadge(); return; }
      cachedUserEmail = user.email || null;
      if (!QUOTA_WHITELIST.has(cachedUserEmail || '')) { refreshBadge(); return; }
      firebase.firestore().doc('users/' + user.uid).onSnapshot(snap => {
        cachedSub = snap.data()?.subscription || null;
        refreshBadge();
        applyGating();
      }, err => console.warn('[ToolQuota] sub watch error:', err));
    });
  }

  // ── 包 wrapper(用 toString sentinel dedupe)──
  function isAlreadyWrapped(fn) {
    return typeof fn === 'function' && fn.toString().includes('__TQ_WRAPPED__');
  }

  function wrapStart(obj, method) {
    if (!obj || typeof obj[method] !== 'function') return;
    if (isAlreadyWrapped(obj[method])) return;
    const orig = obj[method];
    obj[method] = function(...args) {
      /* __TQ_WRAPPED__ */
      if (!canUse()) { showPaywall(); return; }
      return orig.apply(this, args);
    };
  }

  function wrapAction(obj, method) {
    if (!obj || typeof obj[method] !== 'function') return;
    if (isAlreadyWrapped(obj[method])) return;
    const orig = obj[method];
    obj[method] = function(...args) {
      /* __TQ_WRAPPED__ */
      if (!canUse()) { showPaywall(); return; }
      consume();
      return orig.apply(this, args);
    };
  }

  function getGlobal(name) { return window[name]; }

  function applyGating() {
    // ── 主動練習工具(action-based,每次操作 +1)──
    const SRS_ = getGlobal('SRS');
    if (SRS_) { wrapStart(SRS_, 'start'); wrapAction(SRS_, 'rate'); wrapAction(SRS_, 'recordGrade'); }

    const FlashCard_ = getGlobal('FlashCard');
    if (FlashCard_) { wrapStart(FlashCard_, 'start'); wrapStart(FlashCard_, 'beginToday'); wrapAction(FlashCard_, 'answer'); }

    const Shadow_ = getGlobal('Shadow');
    if (Shadow_) { wrapStart(Shadow_, 'start'); wrapStart(Shadow_, 'startCurrent'); wrapStart(Shadow_, 'startFavs'); }

    const GrammarDrill_ = getGlobal('GrammarDrill');
    if (GrammarDrill_) { wrapStart(GrammarDrill_, 'start'); wrapAction(GrammarDrill_, 'rate'); wrapAction(GrammarDrill_, 'answerQuiz'); }

    // ── session-based(start 才算 1)──
    const Quiz_ = getGlobal('Quiz');
    if (Quiz_) wrapStart(Quiz_, 'start');

    const Reading_ = getGlobal('Reading');
    if (Reading_) wrapStart(Reading_, 'start');

    const Listening_ = getGlobal('Listening');
    if (Listening_) wrapStart(Listening_, 'start');
    const Stats_ = getGlobal('Stats');
    if (Stats_ && typeof Stats_.quizFavListening === 'function') wrapStart(Stats_, 'quizFavListening');

    const DailyStory_ = getGlobal('DailyStory');
    if (DailyStory_) wrapStart(DailyStory_, 'open');
    // start session 同時計 +1(因為 daily story 開了就讀完了沒 per-action)
    if (DailyStory_ && !isAlreadyWrapped(DailyStory_.open)) {
      // wrapStart 內已只 check 沒 consume。改成 action-based:
      // 改不易,簡單做法:讓 open 開了就算 +1
    }
    // 簡單處理:讓 DailyStory.open 也算 action(因為一次 open 就是 1 篇故事)
    if (DailyStory_ && DailyStory_.open && !DailyStory_._tqConsumeWrapped) {
      const origOpen = DailyStory_.open;
      DailyStory_.open = function(...args) {
        /* __TQ_WRAPPED__ */
        if (!canUse()) { showPaywall(); return; }
        consume();
        return origOpen.apply(this, args);
      };
      DailyStory_._tqConsumeWrapped = true;
    }

    // 語音 speak — 不擋(歸入內容瀏覽)

    // ── 模考:獨立 lifetime 計數 ──
    const MockExam_ = getGlobal('MockExam');
    if (MockExam_ && MockExam_.startSection && !isAlreadyWrapped(MockExam_.startSection)) {
      const orig = MockExam_.startSection;
      MockExam_.startSection = function(...args) {
        /* __TQ_WRAPPED__ */
        const lv = (MockExam_.currentLevel || args[0] || 'n5').toLowerCase();
        if (!canUse('mock_exam_' + lv)) { showPaywall('mock_exam_' + lv); return; }
        return orig.apply(this, args);
      };
    }
  }

  // For mock exam completion (called from mock-exam.js)
  function markMockCompleted(level) {
    if (!shouldGate()) return;
    localStorage.setItem('mock_completed_' + level.toLowerCase(), '1');
    refreshBadge();
  }

  // 跟讀 per-sentence 計數(由 index.html 內 playOnce 呼)
  function consumeShadowOrBlock() {
    if (!canUse()) { showPaywall(); return false; }
    consume();
    return true;
  }

  window.ToolQuota = {
    canUse, consume, used: () => loadCount()[KEY] || 0,
    showPaywall, shouldGate, isPremium,
    markMockCompleted,
    consumeShadowOrBlock,
    refreshBadge,
    _resetToday: () => { localStorage.removeItem('tool_usage_' + dateKey()); refreshBadge(); },
    _resetMock: () => {
      ['n5','n4','n3','n2','n1'].forEach(lv => localStorage.removeItem('mock_completed_' + lv));
      refreshBadge();
    },
  };

  function init() {
    watchSubscription();
    setTimeout(applyGating, 100);
    setTimeout(applyGating, 1000);
    setTimeout(refreshBadge, 200);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
