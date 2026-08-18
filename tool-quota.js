// ========================================================================
// tool-quota.js — Freemium 額度（2026-06-04 改：每工具每天 1 次）
//
// 規則:
//   - 所有內容(單字 / 文法 / 例句 / 動詞變化表 / 語音)→ 完全免費,不限
//   - 每個 Premium 練習工具「每天免費試 1 次（1 個 session）」,各自獨立計數:
//     SRS / 快速背單字 / 跟讀 / 文法練習 / 單字測驗 / 讀解 / 聽力 / 今日故事
//     （同一次頁面 session 內，開過的工具可免費續用，不會中途被打斷）
//   - 模考:每等級 1 套 lifetime(獨立計數)
//   - Premium = unlimited
//
// 設計原則:
//   1. 目前只對白名單 owner email 啟動 gating(其他 user 完全沒感覺)。
//   2. 金流正式上線時,把 QUOTA_WHITELIST 檢查改成「登入 user 且 not premium」
//      即對所有人開閘(見 shouldGate)。在那之前線上使用者不受影響。
// ========================================================================

(function() {
  const QUOTA_WHITELIST = new Set([
    'abc83327@gmail.com',
    'stayjpplan@gmail.com',
  ]);

  const LAUNCHED = true;          // ⚠️ 開閘總開關:false=過渡期(不 gate 真實用戶);true=正式開閘(gating 全員非 premium)
  const PER_TOOL_LIMIT = 1;       // 每個工具每天免費次數
  const GLOBAL_DAILY_LIMIT = 3;   // 每天全站最多免費試用幾個練習工具(收緊「每工具 1 次」的總量)
  const TOOL_NAMES = {
    srs: 'SRS 記憶卡', flashcard: '快速背單字', shadow: '跟讀', grammar: '文法練習',
    quiz: '單字測驗', reading: '讀解', listening: '聽力', story: '今日故事',
  };

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
  let cachedFreeAccess = false;   // free_users/{uid} 存在 = 管理員授予免費(在 admin 後台加白名單)
  let authReady = false;
  let subLoaded = false;   // 登入用戶的訂閱 doc 是否已載入(避免載入空窗誤判免費 → 訂閱者跳額度 badge)
  let cachedTrialStart = null;   // 免費試用起始(ms);登入用戶享 TRIAL_DAYS 天全功能無限
  let trialWriteDone = false;    // 防呆:trial_started_at 一個 session 只寫一次(避免 serverTimestamp pending 期間重複寫)
  const TRIAL_DAYS = 3;
  function inTrial() {
    return cachedTrialStart != null && Date.now() < cachedTrialStart + TRIAL_DAYS * 86400000;
  }
  function trialDaysLeft() {
    if (cachedTrialStart == null) return 0;
    return Math.min(TRIAL_DAYS, Math.max(0, Math.ceil((cachedTrialStart + TRIAL_DAYS * 86400000 - Date.now()) / 86400000)));
  }

  function isPremium() {
    if (!cachedSub) return false;
    if (cachedSub.status !== 'active' && cachedSub.status !== 'trialing' && cachedSub.status !== 'cancelled') return false;
    return (cachedSub.expiresAt || 0) > Date.now();
  }
  function shouldGate() {
    // App(WebView)內:原生已購買(RevenueCat 裝置級 entitlement 或帳號訂閱)→ 直接放行。
    // Apple 5.1.1:App 內可未登入購買,premium 由原生注入 STAYJP_NATIVE.isPremium(即時更新)。
    // 純網頁沒有 window.STAYJP_NATIVE → 此判斷跳過,網頁行為完全不變。
    if (window.STAYJP_NATIVE && window.STAYJP_NATIVE.isNativeApp && window.STAYJP_NATIVE.isPremium) return false;
    if (!authReady) return false;     // 等 auth 狀態確定再決定,避免閃一下
    if (cachedUserEmail && !subLoaded) return false;  // 登入用戶:訂閱狀態還沒載完前先不擋(訂閱者 doc 載入慢時不會誤跳額度 badge)
    if (isPremium()) return false;     // 付費用戶(登入 + 有效訂閱)→ 不擋
    if (inTrial()) return false;       // 登入用戶 3 天全功能免費試用 → 不擋
    if (cachedUserEmail && QUOTA_WHITELIST.has(cachedUserEmail.toLowerCase())) return false;  // owner / 免費白名單帳號 → 永遠免擋
    if (cachedFreeAccess) return false;  // 管理員後台授予免費(free_users/{uid})→ 免擋
    if (!LAUNCHED) return false;       // 未開閘:過渡期不 gate 任何真實用戶(開閘時把 LAUNCHED 改 true)
    return true;                       // 開閘後:其餘所有人(含未登入訪客)→ 每工具每天 1 次
    // ↑ 開閘版(2026-06):匿名也擋,只有 premium 免擋。
    //   過渡期舊邏輯(僅 owner 白名單)如需回退:
    //   if (!cachedUserEmail) return false;
    //   if (!QUOTA_WHITELIST.has(cachedUserEmail)) return false;
  }

  // re-entrancy guard：避免「一次開啟卻觸發多個被包方法」(如 startCurrent 內部再呼 start) 重複扣次。
  // 注意：只在同一個同步呼叫堆疊內生效；使用者「重新開啟同一工具」會正常被擋。
  let _gateDepth = 0;

  // canUse(tool)：tool 為工具名（srs/quiz…）或 'mock_exam_n5' 等
  function canUse(tool) {
    if (!shouldGate()) return true;
    if (tool && tool.startsWith('mock_exam_')) {
      return localStorage.getItem('mock_completed_' + tool.replace('mock_exam_', '')) !== '1';
    }
    if (!tool) tool = 'misc';
    const c = loadCount();
    if ((c[tool] || 0) >= PER_TOOL_LIMIT) return false;              // 同工具今天已試過
    // 全站每日上限:已試滿 GLOBAL_DAILY_LIMIT 個「不同工具」就不再開放新工具。
    // 用「不同工具數」而非加總次數,且只數 TOOL_NAMES 裡的正式工具 —— 完全比照徽章顯示的
    // 「今日已用 N 個工具」。原本用 Object.values 加總,遇到同一工具被 consume 多次(flashcard
    // start+beginToday、shadow 4 個方法)或混入 misc 等雜項 key,會讓加總 >「不同工具數」,
    // 害「明明只用 2 個、顯示也 2 個」卻擋掉第 3 個。
    const usedCount = Object.keys(TOOL_NAMES).filter(t => (c[t] || 0) >= PER_TOOL_LIMIT).length;
    if (usedCount >= GLOBAL_DAILY_LIMIT) return false;
    return true;
  }
  function consume(tool) {
    if (!shouldGate()) return;
    if (tool && tool.startsWith('mock_exam_')) return; // 模考另記
    if (!tool) tool = 'misc';
    const c = loadCount();
    c[tool] = (c[tool] || 0) + 1;
    saveCount(c);
    refreshBadge();
    // 用完當下即時重繪學習列表 → 該工具按鈕立刻變 🔒,不用 reload
    try { if (typeof window.doRender === 'function') window.doRender(); } catch (e) {}
  }

  function ensurePaywallStyles() {
    if (document.getElementById('pwStyles')) return;
    const st = document.createElement('style');
    st.id = 'pwStyles';
    st.textContent = `
      .pw-backdrop{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;
        background:rgba(18,18,26,.5);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);opacity:0;transition:opacity .3s ease}
      .pw-backdrop.show{opacity:1}
      .pw-card{background:var(--bg2);color:var(--tx);max-width:380px;width:100%;border-radius:20px;border:1px solid var(--bd);
        padding:28px 24px 22px;text-align:center;box-shadow:0 24px 64px -16px rgba(0,0,0,.5);
        transform:translateY(28px) scale(.94);opacity:0;transition:transform .42s cubic-bezier(.16,1,.3,1),opacity .3s ease}
      .pw-backdrop.show .pw-card{transform:none;opacity:1}
      .pw-ico{width:56px;height:56px;border-radius:16px;margin:0 auto 14px;display:flex;align-items:center;justify-content:center;
        font-size:28px;background:linear-gradient(135deg,var(--ac),var(--ac2));box-shadow:0 8px 20px -6px var(--ac)}
      .pw-title{font-size:19px;font-weight:700;margin:0 0 10px}
      .pw-msg{font-size:14px;line-height:1.85;color:var(--tx2);margin:0 0 20px}
      .pw-msg b,.pw-msg strong{color:var(--tx)}
      .pw-btn{display:block;width:100%;padding:13px;border-radius:13px;font-size:14px;font-weight:600;cursor:pointer;border:none;
        transition:transform .12s ease,opacity .15s,background .15s}
      .pw-btn:active{transform:scale(.97)}
      .pw-ok{background:var(--ac);color:#fff;box-shadow:0 8px 20px -6px var(--ac);margin-bottom:8px}
      .pw-alt{background:transparent;color:var(--ac);border:1px solid var(--ac);margin-bottom:8px}
      .pw-alt:hover{background:var(--ac);color:#fff}
      .pw-cancel{background:transparent;color:var(--tx2)}
      .pw-cancel:hover{color:var(--tx)}
      .pw-meta{font-size:12.5px;line-height:2;color:var(--tx2);margin:0 0 16px;text-align:center}
      .pw-meta b{color:var(--ac);font-weight:700}
    `;
    document.head.appendChild(st);
  }

  // ── 彈窗動態賣點:JLPT 倒數 + 早鳥剩餘名額 ──
  // JLPT 固定 7 月/12 月第一個週日;>200 天(剛考完)不顯示,避免空催
  function jlptCountdown() {
    const firstSunday = (y, m) => { const d = new Date(y, m, 1); d.setDate(1 + (7 - d.getDay()) % 7); return d; };
    const now = new Date(), y = now.getFullYear();
    const next = [firstSunday(y, 6), firstSunday(y, 11), firstSunday(y + 1, 6)].find(d => d > now);
    if (!next) return null;
    const days = Math.ceil((next - now) / 86400000);
    if (days > 200) return null;
    return { days, label: (next.getMonth() + 1) + '/' + next.getDate() };
  }
  // 早鳥剩餘名額:同 pricing 的 counters/early_bird,localStorage 快取 10 分鐘(開彈窗不用每次打 Firestore)
  function fetchEarlyBirdLeft() {
    try {
      const cached = JSON.parse(localStorage.getItem('eb_left_cache') || 'null');
      if (cached && Date.now() - cached.ts < 600000) return Promise.resolve(cached.left);
    } catch (e) {}
    if (typeof firebase === 'undefined' || !firebase.firestore) return Promise.resolve(null);
    return firebase.firestore().doc('counters/early_bird').get().then(snap => {
      const d = snap.data() || {};
      const lim = d.limit || 100;
      const left = Math.max(0, Math.min(lim, lim - (d.count || 0)));
      try { localStorage.setItem('eb_left_cache', JSON.stringify({ left, ts: Date.now() })); } catch (e) {}
      return left;
    }).catch(() => null);
  }

  function showPaywall(tool) {
    if (document.getElementById('pwBackdrop')) return;   // 已開著就不疊
    ensurePaywallStyles();
    const isMock = tool && tool.startsWith('mock_exam_');
    const name = TOOL_NAMES[tool] || '這個工具';
    // 區分:此工具已試過 vs 今天免費試用工具數已達全站上限(挡到沒試過的新工具)
    const usedThis = !isMock && tool && (loadCount()[tool] || 0) >= PER_TOOL_LIMIT;
    const msg = isMock
      ? `免費版每等級可試 1 套模考，你已完成過 <strong>${tool.replace('mock_exam_','').toUpperCase()}</strong>。`
      : usedThis
        ? `免費版每個工具每天可免費試 1 次，<strong>「${name}」今天已經試過了</strong>。`
        : `免費版每天可免費試用 <strong>${GLOBAL_DAILY_LIMIT} 個練習工具</strong>，今天的次數已用完。`;
    // 分流:額度用完的當下是轉換率最高的時刻,依狀態給不同的下一步
    //   App 內      → 維持原生 paywall(不提台幣價,Apple 定價/審核不同)
    //   網頁+未登入  → 主推「登入送 3 天全功能試用」(還沒體驗過完整價值,先給試用比直接要錢轉換高)
    //   網頁+已登入  → 主推方案,帶 JLPT 倒數 + 早鳥剩餘名額 + 退費安心線
    const isNative = !!(window.STAYJP_NATIVE && window.STAYJP_NATIVE.isNativeApp);
    // iPhone 網頁訪客 → 導去 App 試用(iOS 綁卡試用轉換 40%,網頁只有 1.9%;額度用完是最高轉換時刻)
    const isIOSWeb = !isNative && (/iPhone|iPad|iPod/i.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && 'ontouchend' in document));
    const canOfferTrial = !isNative && !cachedUserEmail && typeof window.loginWith === 'function';
    const cd = jlptCountdown();

    let body, primary, secondary;
    if (isNative) {
      body = `${msg}<br>升級 <b>Premium</b>，即可<strong>無限次</strong>使用所有練習工具。`;
      primary = { label: '查看訂閱方案 →', act: 'plans' };
    } else if (canOfferTrial) {
      // 內文維持單一文字節點(不夾 strong),translate-layer 才能整句 exact-match 翻譯
      body = `${msg}<br>用 Google 登入即送 3 天全功能試用——SRS、模考、跟讀全部無限，不用信用卡。`;
      primary = { label: '🎁 Google 登入，免費試 3 天', act: 'login' };
      secondary = { label: '直接看訂閱方案 →', act: 'plans' };
    } else {
      body = `${msg}<br>你已經比多數人認真——升級 Premium 無限練，衝一次就過。`;
      primary = { label: '解鎖無限練習 →', act: 'plans' };
    }

    // 每行維持單一文字節點(不夾 <b>),translate-layer 的 pattern 才能整句翻成英文
    const metaLines = [];
    if (!isNative && cd) metaLines.push(`⏳ 距離 ${cd.label} JLPT 還有 ${cd.days} 天`);
    if (!isNative) metaLines.push(`<span id="pwEbLine" style="display:none"></span>`);
    if (!isNative && !canOfferTrial) metaLines.push('✓ 7 天內無條件全額退費，隨時可取消');

    const wrap = document.createElement('div');
    wrap.className = 'pw-backdrop';
    wrap.id = 'pwBackdrop';
    wrap.innerHTML = `
      <div class="pw-card" role="dialog" aria-modal="true">
        <div class="pw-ico">${canOfferTrial ? '🎁' : '⭐'}</div>
        <h3 class="pw-title">今天的免費額度用完了</h3>
        <p class="pw-msg">${body}</p>
        ${metaLines.length ? `<p class="pw-meta">${metaLines.join('<br>')}</p>` : ''}
        <button class="pw-btn pw-ok" id="pwOk">${primary.label}</button>
        ${secondary ? `<button class="pw-btn pw-alt" id="pwAlt">${secondary.label}</button>` : ''}
        ${isIOSWeb ? `<a class="pw-btn pw-alt" style="display:block;text-decoration:none" href="https://apps.apple.com/app/id6778227353" target="_blank" rel="noopener">📱 用 iPhone App 免費試 7 天(網頁只有 3 天)</a>` : ''}
        <button class="pw-btn pw-cancel" id="pwCancel">稍後再說</button>
      </div>`;
    document.body.appendChild(wrap);
    requestAnimationFrame(() => wrap.classList.add('show'));
    const close = () => {
      wrap.classList.remove('show');
      document.removeEventListener('keydown', onEsc);
      setTimeout(() => wrap.remove(), 320);
    };
    function onEsc(e) { if (e.key === 'Escape') close(); }
    const run = (act) => {
      if (act === 'login') { close(); try { window.loginWith('google'); } catch (e) { goToPlans(); } return; }
      goToPlans();
    };
    wrap.querySelector('#pwOk').onclick = () => run(primary.act);
    const altBtn = wrap.querySelector('#pwAlt');
    if (altBtn) altBtn.onclick = () => run(secondary.act);
    wrap.querySelector('#pwCancel').onclick = close;
    wrap.onclick = (e) => { if (e.target === wrap) close(); };
    document.addEventListener('keydown', onEsc);
    if (typeof cvtStaticUI === 'function') cvtStaticUI(wrap);   // 簡中轉換(對齊 badge 做法)

    // 早鳥名額 async 帶入;彈窗已關或賣完(0)就不顯示
    if (!isNative) {
      fetchEarlyBirdLeft().then(left => {
        if (!left || left <= 0) return;
        const line = document.getElementById('pwEbLine');
        if (!line) return;
        line.textContent = `🐦 早鳥年費 NT$990・只剩 ${left} 名(額滿恢復 NT$1,490)`;
        line.style.display = '';
        if (window.UITranslate && UITranslate.active()) UITranslate.walk(line);
      });
    }
  }

  // 前往方案:App 內直接開原生 paywall(不載入 pricing 頁 → 不會閃一下網頁價格頁);網頁則導到 pricing。
  function goToPlans() {
    try {
      if (window.STAYJP_NATIVE && window.STAYJP_NATIVE.isNativeApp && window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        const lng = (window.localStorage && localStorage.getItem('ui_lang')) || 'zh-TW';
        // 看方案不用登入 → 一律開 paywall;訂閱才要求登入(paywall 內處理)
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'OPEN_PAYWALL', lang: lng }));
        return;
      }
    } catch (_) {}
    window.location.href = 'pricing.html';
  }

  // ── UI badge（只 owner 看得到）──
  // 試用到期前 24h:頂部提醒條(轉換高點之一;每日最多出現一次,可關)
  function maybeExpiryBanner() {
    try {
      const isNative = !!(window.STAYJP_NATIVE && window.STAYJP_NATIVE.isNativeApp);
      if (isNative || isPremium() || !inTrial()) return;
      if (trialDaysLeft() > 1) return;
      const k = 'trial_exp_banner_' + new Date().toISOString().slice(0,10);
      if (localStorage.getItem(k) || document.getElementById('trialExpBar')) return;
      localStorage.setItem(k, '1');
      const bar = document.createElement('div');
      bar.id = 'trialExpBar';
      bar.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:400;background:#B45309;color:#fff;font-size:13px;padding:9px 40px 9px 14px;text-align:center;line-height:1.5';
      bar.innerHTML = '⏳ 試用明天到期——早鳥年費 NT$990 鎖住一整年(額滿恢復 1,490)'
        + ' <a href="pricing.html" style="color:#FDE68A;font-weight:700;text-decoration:underline">看方案 →</a>'
        + '<button onclick="this.parentElement.remove()" style="position:absolute;right:8px;top:6px;background:none;border:0;color:#fff;font-size:16px;cursor:pointer;padding:4px">✕</button>';
      document.body.appendChild(bar);
    } catch (e) {}
  }
  function refreshBadge() {
    maybeExpiryBanner();
    let badge = document.getElementById('quotaBadge');
    // App 沒有 3 天試用(走 Apple 7 天)→ App 一律不顯示「試用中 / 試用已結束」,只顯示免費版額度。網頁照常。
    const isNative = !!(window.STAYJP_NATIVE && window.STAYJP_NATIVE.isNativeApp);
    const trial = inTrial() && !isPremium() && !isNative;   // 付費用戶不顯示試用 badge(即使曾在試用期訂閱)
    if (!trial && !shouldGate()) { if (badge) badge.remove(); return; }
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'quotaBadge';
      // bottom 要避開底部導覽列(.ftb,高度 var(--btm))+ 瀏海安全區,否則手機上會蓋住「學習」tab
      badge.style.cssText = 'position:fixed;bottom:calc(var(--btm, 56px) + env(safe-area-inset-bottom) + 12px);left:14px;background:rgba(0,0,0,.78);color:#fff;padding:8px 12px;border-radius:10px;font-size:11px;font-family:-apple-system,sans-serif;line-height:1.5;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,.2);cursor:pointer;max-width:220px';
      badge.title = '免費版每日額度。點擊查看訂閱方案。';
      badge.onclick = () => goToPlans();
      document.body.appendChild(badge);
    }
    if (trial) {
      const daysLeft = trialDaysLeft();
      badge.title = '免費試用中,全功能無限。點擊查看訂閱方案。';
      // 最後一天 → 換成緊迫感文案吸引升級(badge 本來就可點 → pricing /(App 內)開 paywall)
      badge.innerHTML = daysLeft <= 1
        ? '<div style="font-weight:700;margin-bottom:2px;color:#FCA5A5">⏰ 試用最後 ' + daysLeft + ' 天</div>'
          + '<div style="color:#FCD34D">升級 Premium 鎖優惠價,繼續無限使用 →</div>'
        : '<div style="font-weight:700;margin-bottom:2px">✨ 免費試用中・剩 ' + daysLeft + ' 天</div>'
          + '<div style="color:#FCD34D">全工具無限使用,試用後升級鎖價 →</div>';
      if (typeof cvtStaticUI === 'function') cvtStaticUI(badge);
      return;
    }
    // 試用已結束(這個帳號曾開過試用、現已過期、非付費)→ 轉換提示,取代一般免費版 badge
    if (cachedTrialStart != null && !isPremium() && !isNative) {
      badge.title = '3 天試用已結束。點擊升級,解鎖無限練習。';
      badge.innerHTML = '<div style="font-weight:700;margin-bottom:2px">✨ 3 天試用已結束</div>'
        + '<div style="color:#FCD34D">升級 Premium 解鎖無限練習 →</div>';
      if (typeof cvtStaticUI === 'function') cvtStaticUI(badge);
      return;
    }
    const c = loadCount();
    const usedTools = Object.keys(TOOL_NAMES).filter(t => (c[t] || 0) >= PER_TOOL_LIMIT);
    badge.innerHTML = `
      <div style="font-weight:700;margin-bottom:2px">免費版・每工具每天 1 次</div>
      <div style="color:${usedTools.length ? '#F59E0B' : '#fff'}">今日已用：${usedTools.length} 個工具</div>
    `;
    if (typeof cvtStaticUI === 'function') cvtStaticUI(badge);   // 簡中:徽章寫死繁體轉簡(純中文,安全)
  }

  // 重繪學習列表(讓工具按鈕的 🔒/置灰跟著 gating 狀態更新)。只在 index 有 doRender 時生效。
  function rerenderTools() {
    try { if (typeof window.doRender === 'function') window.doRender(); } catch (e) {}
  }

  // ── Firestore subscription watcher ──
  function watchSubscription() {
    if (typeof firebase === 'undefined' || !firebase.auth) return;
    firebase.auth().onAuthStateChanged(user => {
      authReady = true;
      cachedTrialStart = null; trialWriteDone = false;   // 換帳號/登出 → 重置試用狀態,重新依該 user 的 doc 評估
      if (!user) { cachedUserEmail = null; cachedSub = null; cachedFreeAccess = false; subLoaded = true; refreshBadge(); rerenderTools(); return; }
      cachedUserEmail = user.email || null;
      subLoaded = false;   // 換 user → 重新等這個 user 的訂閱載入
      // 兜底:萬一訂閱 onSnapshot 一直沒回(極端),8 秒後恢復 gating,避免免費登入用戶逃逸
      setTimeout(() => { if (!subLoaded) { subLoaded = true; refreshBadge(); rerenderTools(); } }, 8000);
      // 管理員後台授予的免費白名單(free_users/{uid} 存在 = 免費)
      firebase.firestore().doc('free_users/' + user.uid).get()
        .then(d => { cachedFreeAccess = d.exists; refreshBadge(); rerenderTools(); })
        .catch(() => {});
      // 開閘版:所有登入用戶都監聽訂閱(才偵測得到 premium → 免擋)
      firebase.firestore().doc('users/' + user.uid).onSnapshot(snap => {
        const data = snap.data() || {};
        cachedSub = data.subscription || null;
        // 免費試用:讀 trial_started_at(server 時戳);沒有 + 非付費 → 第一次登入即開啟 3 天試用(只設一次)
        const ts = data.trial_started_at;
        if (ts && typeof ts.toMillis === 'function') cachedTrialStart = ts.toMillis();
        else if (ts && ts.seconds) cachedTrialStart = ts.seconds * 1000;
        // App 不自動發 3 天免綁卡試用 → App 的試用走 Apple 原生「7 天免費試用」(按訂閱才開始),
        // 避免兩套試用打架 + 吃掉轉換(已免費 3 天誰還按訂閱)。網頁維持自動 3 天(網頁沒有 Apple 試用)。
        else if (!ts && !isPremium() && !(window.STAYJP_NATIVE && window.STAYJP_NATIVE.isNativeApp)) {
          // 改由後端 startTrial 決定資格:同一個 email(gmail 去點/去+別名)用過試用就不再發 →
          // 刪帳號重辦同信箱無效。後端寫 trial_started_at,這個 onSnapshot 會再回來帶起試用。
          // 不再本機樂觀開試用(避免「用過的人」短暫看到試用、也防鑽)。
          if (!trialWriteDone && !(snap.metadata && snap.metadata.hasPendingWrites)) {
            trialWriteDone = true;
            user.getIdToken().then(function (tok) {
              return fetch('https://asia-east1-jpnote-1bdd6.cloudfunctions.net/startTrial', {
                method: 'POST', headers: { Authorization: 'Bearer ' + tok }
              });
            }).catch(function () {});
          }
        }
        subLoaded = true;
        refreshBadge();
        applyGating();
        rerenderTools();   // 訂閱狀態載完 → 重繪,工具按鈕的 🔒 才會在進頁面當下就正確(免換頁觸發)
      }, err => { console.warn('[ToolQuota] sub watch error:', err); subLoaded = true; refreshBadge(); rerenderTools(); });
    });
  }

  // ── 包 wrapper(用 toString sentinel dedupe)──
  function isAlreadyWrapped(fn) {
    return typeof fn === 'function' && fn.toString().includes('__TQ_WRAPPED__');
  }
  // 工具開啟即計 1 次（session-based）；同 session 續用免費
  function gateStart(obj, method, tool) {
    if (!obj || typeof obj[method] !== 'function') return;
    if (isAlreadyWrapped(obj[method])) return;
    const orig = obj[method];
    obj[method] = function(...args) {
      /* __TQ_WRAPPED__ */
      if (_gateDepth > 0) return orig.apply(this, args);    // 巢狀呼叫(startCurrent→start)不重複計
      if (!canUse(tool)) { showPaywall(tool); return; }
      consume(tool);
      _gateDepth++;
      try { return orig.apply(this, args); } finally { _gateDepth--; }
    };
  }
  // 「開介面免費、真正開始才扣一次/session」的延後計費包法。
  //   startMethod:點(底部 tab 等)進來的方法 → 只「武裝」,不擋不扣 → 誤點不掉額度
  //   beginMethod:真正開始的動作(Quiz 按「開始測驗」=begin;SRS 第一次評分=rate)
  //               → 該 session 第一次才檢查額度 + 扣 1 次;之後同 session 續用(下一輪/下一張)免費
  // 解決:底部 bar「測驗/複習」一點就扣 → 消費者容易誤點掉額度。
  const _armed = {};   // _armed[tool]=true 表示此 session 尚未扣
  function gateDeferred(obj, startMethod, beginMethod, tool) {
    if (!obj) return;
    if (typeof obj[startMethod] === 'function' && !isAlreadyWrapped(obj[startMethod])) {
      const origStart = obj[startMethod];
      obj[startMethod] = function(...args) {
        /* __TQ_WRAPPED__ */
        _armed[tool] = true;            // 只武裝:開介面/顯示第一張卡 → 免費,不擋不扣
        return origStart.apply(this, args);
      };
    }
    if (typeof obj[beginMethod] === 'function' && !isAlreadyWrapped(obj[beginMethod])) {
      const origBegin = obj[beginMethod];
      obj[beginMethod] = function(...args) {
        /* __TQ_WRAPPED__ */
        if (_armed[tool]) {             // 此 session 第一次真正開始
          if (!canUse(tool)) { showPaywall(tool); return; }
          consume(tool);
          _armed[tool] = false;         // 同 session 後續(下一輪/下一張)不再扣
        }
        return origBegin.apply(this, args);
      };
    }
  }

  function getGlobal(name) { return window[name]; }

  function applyGating() {
    // 複習:點 tab(SRS.start)只顯示第一張卡正面=免費;翻卡後第一次「記得/不會」評分(rate)才扣
    const SRS_ = getGlobal('SRS');           if (SRS_) gateDeferred(SRS_, 'start', 'rate', 'srs');
    const FlashCard_ = getGlobal('FlashCard');
    if (FlashCard_) { gateStart(FlashCard_, 'start', 'flashcard'); gateStart(FlashCard_, 'beginToday', 'flashcard'); }
    const Shadow_ = getGlobal('Shadow');
    if (Shadow_) { gateStart(Shadow_, 'start', 'shadow'); gateStart(Shadow_, 'startCurrent', 'shadow'); gateStart(Shadow_, 'startFavs', 'shadow'); gateStart(Shadow_, 'startGrammarFavs', 'shadow'); }
    const GrammarDrill_ = getGlobal('GrammarDrill'); if (GrammarDrill_) gateStart(GrammarDrill_, 'start', 'grammar');
    // 測驗:點 tab(Quiz.start)只開設定/介紹頁=免費;按「開始測驗」(begin)才扣
    const Quiz_ = getGlobal('Quiz');         if (Quiz_) gateDeferred(Quiz_, 'start', 'begin', 'quiz');
    const Reading_ = getGlobal('Reading');   if (Reading_) gateStart(Reading_, 'start', 'reading');
    const Listening_ = getGlobal('Listening'); if (Listening_) gateStart(Listening_, 'start', 'listening');
    const Stats_ = getGlobal('Stats');
    if (Stats_ && typeof Stats_.quizFavListening === 'function') gateStart(Stats_, 'quizFavListening', 'listening');
    const DailyStory_ = getGlobal('DailyStory'); if (DailyStory_) gateStart(DailyStory_, 'open', 'story');

    // ── 模考 gating 已移進 mock-exam.js 的 beginExam ──
    // (外部 wrapper 抓不到 startSection [未 export] 也拿不到 examLevel,故在內部 gate)
  }

  function markMockCompleted(level) {
    if (!shouldGate()) return;
    localStorage.setItem('mock_completed_' + level.toLowerCase(), '1');
    refreshBadge();
  }

  // 跟讀逐句：跟讀 session 已在 Shadow.start* 開啟時計過 1 次「shadow」,逐句不再額外擋。
  function consumeShadowOrBlock() { return true; }

  // 該工具今天免費額度是否已用完（且確實在 gating 範圍內）
  function usedUp(tool) { return shouldGate() && !canUse(tool); }
  // 整排工具按鈕「下方一行」的低調升級提示：gating 中 + 今天有任一工具已用完才出現,否則回空字串。
  function upsellLine() {
    if (!shouldGate()) return '';
    const c = loadCount();
    const anyUsed = Object.keys(TOOL_NAMES).some(t => (c[t] || 0) >= PER_TOOL_LIMIT);
    if (!anyUsed) return '';
    return `<a href="pricing.html" class="quota-upsell-line">🔒 今日免費額度用完了 · 升級無限使用 ↗</a>`;
  }

  window.ToolQuota = {
    canUse, consume, usedUp, upsellLine,
    // 這個工具今天的免費額度是否用完(被擋時才 true;trial/premium/未開閘 → false)。給按鈕顯示 🔒 用。
    isLocked: (tool) => shouldGate() && !canUse(tool),
    used: () => { const c = loadCount(); return Object.keys(TOOL_NAMES).filter(t => (c[t] || 0) >= PER_TOOL_LIMIT).length; },
    showPaywall, shouldGate, isPremium,
    markMockCompleted,
    consumeShadowOrBlock,
    refreshBadge,
    _resetToday: () => { localStorage.removeItem('tool_usage_' + dateKey()); refreshBadge(); },
    // 測試用:模擬試用已結束(本機,重整即恢復)→ 可立刻測「免費版額度 + 🔒 鎖定」流程,不用等 3 天
    _endTrial: () => { cachedTrialStart = Date.now() - (TRIAL_DAYS + 1) * 86400000; refreshBadge(); },
    _trialInfo: () => ({ start: cachedTrialStart, inTrial: inTrial(), daysLeft: trialDaysLeft(), premium: isPremium() }),
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
