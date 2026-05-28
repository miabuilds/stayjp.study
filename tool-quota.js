// ========================================================================
// tool-quota.js — Freemium 工具額度限制
//
// 設計原則:
//   1. **不影響線上使用者** — 只對白名單 owner email 啟動 gating
//      (其他 user 完全沒感覺,所有 tool 維持原本無限制行為)
//   2. 訂閱中 = unlimited(跳過 quota check)
//   3. 免費版 = SRS / 跟讀 / 動詞變化練習 各 3 次/天,模考每等級 1 套
//
// 等正式金流 ready + 想開放給所有 user 時,把 isOwner() 改成 isFreeTier()
// (= 登入 user 且 not premium)即可。
//
// load 順序:在 firebase-auth + firebase-firestore compat scripts 之後,
// 在各 tool module (FlashCard / Shadow / MockExam / GrammarDrill / SRS) 之後。
// ========================================================================

(function() {
  const QUOTA_WHITELIST = new Set([
    'abc83327@gmail.com',
    'stayjpplan@gmail.com',
  ]);

  const DAILY_LIMIT = 3;

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
    if (cachedSub.status !== 'active' && cachedSub.status !== 'trialing') return false;
    return (cachedSub.expiresAt || 0) > Date.now();
  }

  // 是否對當前用戶啟動 quota 限制?
  // 為 false → 所有 tool 維持原本行為(完全不擋)
  function shouldGate() {
    if (!authReady) return false;          // 還沒登入狀態 → 不擋,避免錯擋訪客
    if (!cachedUserEmail) return false;    // 未登入 → 不擋
    if (!QUOTA_WHITELIST.has(cachedUserEmail)) return false; // 非 owner → 不擋
    if (isPremium()) return false;          // Premium → 不擋
    return true;
  }

  function canUse(tool) {
    if (!shouldGate()) return true;
    if (tool === 'mock_exam_n5' || tool === 'mock_exam_n4' || tool === 'mock_exam_n3'
        || tool === 'mock_exam_n2' || tool === 'mock_exam_n1') {
      // 模考:每等級 1 套(lifetime,不依日期)
      return localStorage.getItem('mock_completed_' + tool.replace('mock_exam_', '')) !== '1';
    }
    return (loadCount()[tool] || 0) < DAILY_LIMIT;
  }

  function consume(tool) {
    if (!shouldGate()) return;
    if (tool.startsWith('mock_exam_')) {
      // 模考 lifetime flag,在 exam 完成才 set,不在這
      return;
    }
    const counts = loadCount();
    counts[tool] = (counts[tool] || 0) + 1;
    saveCount(counts);
    refreshBadge();
  }

  function used(tool) {
    if (tool.startsWith('mock_exam_')) {
      return localStorage.getItem('mock_completed_' + tool.replace('mock_exam_', '')) === '1' ? 1 : 0;
    }
    return loadCount()[tool] || 0;
  }

  function showPaywall(tool) {
    const labels = {
      srs: 'SRS 複習',
      flashcard: '快速背單字',
      shadow: '跟讀',
      conjugate: '動詞變化練習',
    };
    const label = tool.startsWith('mock_exam_') ? `${tool.replace('mock_exam_', '').toUpperCase()} 模擬考` : (labels[tool] || tool);
    if (confirm(
      `你的「${label}」免費額度用完囉!\n\n` +
      (tool.startsWith('mock_exam_')
        ? '免費版每等級可試 1 套模考。\n升級 Premium 解鎖無限次 + 完整詳解。'
        : `免費版每天 ${DAILY_LIMIT} 次,明天會 reset。\n升級 Premium 解鎖無限次。`) +
      `\n\n要看訂閱方案嗎?`
    )) {
      window.location.href = 'pricing.html';
    }
  }

  // 包裝 tool 入口:wrapper 在 call 時動態檢查,即使 page load 時 user 還沒 ready 也安全
  function gate(obj, method, toolName) {
    if (!obj || typeof obj[method] !== 'function') {
      console.warn(`[ToolQuota] Cannot gate ${method}: object or method missing`);
      return;
    }
    const orig = obj[method];
    obj[method] = function(...args) {
      // 動態 check(每次 call 都重新判)
      if (!canUse(toolName)) {
        showPaywall(toolName);
        return;
      }
      consume(toolName);
      return orig.apply(this, args);
    };
  }

  // ── UI badge:顯示「今日 SRS 1/3 跟讀 0/3...」給 owner ──
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
      badge.title = '免費版 quota 顯示(只 owner 看得到)。點擊看訂閱狀態。';
      badge.onclick = () => window.location.href = 'account.html';
      document.body.appendChild(badge);
    }
    const c = loadCount();
    const subInfo = isPremium() ? '✅ Premium' : '🆓 免費版';
    badge.innerHTML = `
      <div style="font-weight:700;margin-bottom:4px">${subInfo} · 今日額度</div>
      <div>SRS: ${(c.srs || 0)}/${DAILY_LIMIT} · 背單: ${(c.flashcard || 0)}/${DAILY_LIMIT}</div>
      <div>跟讀: ${(c.shadow || 0)}/${DAILY_LIMIT} · 動詞: ${(c.conjugate || 0)}/${DAILY_LIMIT}</div>
    `;
  }

  // ── Firestore subscription watcher ──
  function watchSubscription() {
    if (typeof firebase === 'undefined' || !firebase.auth) {
      console.warn('[ToolQuota] firebase not loaded — gating disabled');
      return;
    }
    firebase.auth().onAuthStateChanged(user => {
      authReady = true;
      if (!user) {
        cachedUserEmail = null;
        cachedSub = null;
        refreshBadge();
        return;
      }
      cachedUserEmail = user.email || null;
      if (!QUOTA_WHITELIST.has(cachedUserEmail || '')) {
        refreshBadge();
        return;
      }
      // owner 才訂閱 subscription doc
      firebase.firestore().doc('users/' + user.uid).onSnapshot(snap => {
        cachedSub = snap.data()?.subscription || null;
        refreshBadge();
        applyGating();   // 訂閱狀態變了重新套用 wrapper
      }, err => {
        console.warn('[ToolQuota] subscription watch error:', err);
      });
    });
  }

  // ── 套 wrapper 到 tool 模組 ──
  // wrappersApplied flag 避免重複包(idempotent)
  const wrapped = new Set();
  function applyGating() {
    function wrap(obj, method, name, label) {
      const key = label + '.' + method;
      if (wrapped.has(key)) return;
      if (!obj || typeof obj[method] !== 'function') return;
      gate(obj, method, name);
      wrapped.add(key);
    }
    if (typeof window.SRS !== 'undefined') wrap(window.SRS, 'start', 'srs', 'SRS');
    if (typeof window.FlashCard !== 'undefined') wrap(window.FlashCard, 'start', 'flashcard', 'FlashCard');
    if (typeof window.Shadow !== 'undefined') {
      wrap(window.Shadow, 'start', 'shadow', 'Shadow');
      wrap(window.Shadow, 'startCurrent', 'shadow', 'Shadow');
      wrap(window.Shadow, 'startFavs', 'shadow', 'Shadow');
    }
    if (typeof window.GrammarDrill !== 'undefined') wrap(window.GrammarDrill, 'start', 'conjugate', 'GrammarDrill');
    // 模考 wrap MockExam.start(進入挑選等級畫面)— 進入後再依等級擋
    if (typeof window.MockExam !== 'undefined') {
      const origMockStart = window.MockExam.start;
      if (origMockStart && !wrapped.has('MockExam.start')) {
        window.MockExam.start = function(...args) {
          // 等級在後續 startSection 才知道,所以 start 不擋,在 startSection 包
          return origMockStart.apply(this, args);
        };
        wrapped.add('MockExam.start');
      }
      const origMockSection = window.MockExam.startSection;
      if (origMockSection && !wrapped.has('MockExam.startSection')) {
        window.MockExam.startSection = function(...args) {
          // 假設 currentLevel 存在 window.MockExam.currentLevel 或 args 第一個
          const lv = (window.MockExam.currentLevel || args[0] || 'n5').toLowerCase();
          if (!canUse('mock_exam_' + lv)) {
            showPaywall('mock_exam_' + lv);
            return;
          }
          // 不在這 consume,等 exam 真完成才 mark mock_completed_lv
          return origMockSection.apply(this, args);
        };
        wrapped.add('MockExam.startSection');
      }
    }
  }

  // 提供 API 讓 mock-exam 完成時呼叫
  function markMockCompleted(level) {
    if (!shouldGate()) return;
    localStorage.setItem('mock_completed_' + level.toLowerCase(), '1');
    refreshBadge();
  }

  window.ToolQuota = {
    canUse, consume, used, showPaywall, gate,
    shouldGate, isPremium,
    markMockCompleted,
    refreshBadge,
    // debug helpers
    _resetToday: () => { localStorage.removeItem('tool_usage_' + dateKey()); refreshBadge(); },
    _resetMock: () => {
      ['n5','n4','n3','n2','n1'].forEach(lv => localStorage.removeItem('mock_completed_' + lv));
      refreshBadge();
    },
  };

  // 啟動
  function init() {
    watchSubscription();
    // 等 module IIFE 都 evaluate 完才包(他們在 page 末尾 load)
    setTimeout(applyGating, 100);
    setTimeout(applyGating, 1000);  // 防 lazy loaded module
    setTimeout(refreshBadge, 200);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
