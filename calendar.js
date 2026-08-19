// ========== STUDY CALENDAR (GitHub Heatmap Style) ==========
const Calendar = (() => {
  const SKEY = 'study_log';

  function getLog() {
    try { return JSON.parse(localStorage.getItem(SKEY)) || {}; } catch(e) { return {}; }
  }
  function saveLog(log) { localStorage.setItem(SKEY, JSON.stringify(log)); }
  function today() { return new Date().toISOString().split('T')[0]; }

  // Record an activity: type = 'vocab' | 'grammar' | 'quiz'
  function logActivity(type) {
    const log = getLog();
    const d = today();
    if (!log[d]) log[d] = { vocab: 0, grammar: 0, quiz: 0, minutes: 0 };
    if (type === 'vocab') log[d].vocab++;
    else if (type === 'grammar') log[d].grammar++;
    else if (type === 'quiz') log[d].quiz++;
    saveLog(log);
    if (typeof saveAllCloud === 'function') saveAllCloud();
    // 留存:學完一次後(App)邀請開每日提醒。startReminderPrompt 會重試到離開測驗/引導畫面才彈。
    if (typeof startReminderPrompt === 'function') startReminderPrompt();
  }

  // Calculate streaks
  function getStreaks() {
    const log = getLog();
    const t = today();
    let current = 0;
    let longest = 0;
    let streak = 0;
    // Walk backwards from today
    const d = new Date();
    for (let i = 0; i < 365; i++) {
      const key = d.toISOString().split('T')[0];
      if (log[key] && (log[key].vocab > 0 || log[key].grammar > 0 || log[key].quiz > 0)) {
        streak++;
      } else {
        if (i === 0) { /* today has no activity yet, continue checking */ }
        else break;
      }
      d.setDate(d.getDate() - 1);
    }
    current = streak;

    // Longest streak: scan all dates
    const dates = Object.keys(log).filter(k =>
      log[k].vocab > 0 || log[k].grammar > 0 || log[k].quiz > 0
    ).sort();
    longest = 0;
    let run = 0;
    for (let i = 0; i < dates.length; i++) {
      if (i === 0) { run = 1; }
      else {
        const prev = new Date(dates[i - 1]);
        const curr = new Date(dates[i]);
        const diff = (curr - prev) / (1000 * 60 * 60 * 24);
        run = diff === 1 ? run + 1 : 1;
      }
      if (run > longest) longest = run;
    }

    return { current, longest };
  }

  // Get activity level for a date (0-3)
  function getLevel(dayData) {
    if (!dayData) return 0;
    const total = (dayData.vocab || 0) + (dayData.grammar || 0) + (dayData.quiz || 0);
    if (total === 0) return 0;
    if (total <= 5) return 1;
    if (total <= 15) return 2;
    return 3;
  }

  // Get today's summary
  function getTodaySummary() {
    const log = getLog();
    const d = log[today()];
    if (!d) return { vocab: 0, grammar: 0, quiz: 0, total: 0 };
    const total = (d.vocab || 0) + (d.grammar || 0) + (d.quiz || 0);
    return { vocab: d.vocab || 0, grammar: d.grammar || 0, quiz: d.quiz || 0, total };
  }

  // Build 90-day heatmap HTML
  function buildHeatmap() {
    const log = getLog();
    const DAYS = 91; // ~13 weeks
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - DAYS + 1);

    // Align startDate to Sunday (start of week)
    const startDay = startDate.getDay();
    startDate.setDate(startDate.getDate() - startDay);

    // Recalculate total columns
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const weeks = Math.ceil(totalDays / 7);

    // Month labels
    const months = [];
    let lastMonth = -1;
    const monthLabels = (typeof I18n !== 'undefined' && I18n.getMonths)
      ? I18n.getMonths()
      : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
    for (let w = 0; w < weeks; w++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + w * 7);
      const m = d.getMonth();
      if (m !== lastMonth) {
        months.push({ col: w, label: monthLabels[m] });
        lastMonth = m;
      }
    }

    // Day-of-week labels
    const dayLabels = (typeof I18n !== 'undefined' && I18n.getWeekdays)
      ? I18n.getWeekdays()
      : ['日','月','火','水','木','金','土'];

    // Build month label row
    let monthRow = '<div class="cal-row cal-months"><span class="cal-day-lbl"></span>';
    let mi = 0;
    for (let w = 0; w < weeks; w++) {
      if (mi < months.length && months[mi].col === w) {
        monthRow += `<span class="cal-month-lbl">${months[mi].label}</span>`;
        mi++;
      } else {
        monthRow += '<span class="cal-month-lbl"></span>';
      }
    }
    monthRow += '</div>';

    // Build day rows
    let gridHTML = '';
    for (let dow = 0; dow < 7; dow++) {
      gridHTML += '<div class="cal-row">';
      gridHTML += `<span class="cal-day-lbl">${dow % 2 === 1 ? dayLabels[dow] : ''}</span>`;
      for (let w = 0; w < weeks; w++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + w * 7 + dow);
        const key = d.toISOString().split('T')[0];
        const isFuture = d > endDate;
        if (isFuture) {
          gridHTML += '<span class="cal-cell" data-level="empty"></span>';
        } else {
          const level = getLevel(log[key]);
          const dayData = log[key];
          const tip = dayData
            ? t('cal_tooltip', { date: key, v: dayData.vocab||0, g: dayData.grammar||0, q: dayData.quiz||0 })
            : t('cal_tooltip_empty', { date: key });
          gridHTML += `<span class="cal-cell" data-level="${level}" title="${tip}"></span>`;
        }
      }
      gridHTML += '</div>';
    }

    return `<div class="cal-heatmap">
      <div class="cal-grid">
        ${monthRow}
        ${gridHTML}
      </div>
      <div class="cal-legend">
        <span class="cal-legend-tx">${t('legend_less')}</span>
        <span class="cal-cell cal-legend-cell" data-level="0"></span>
        <span class="cal-cell cal-legend-cell" data-level="1"></span>
        <span class="cal-cell cal-legend-cell" data-level="2"></span>
        <span class="cal-cell cal-legend-cell" data-level="3"></span>
        <span class="cal-legend-tx">${t('legend_more')}</span>
      </div>
    </div>`;
  }

  // Build progress bar
  function buildProgress() {
    const summary = getTodaySummary();
    const goal = 30; // daily goal: 30 activities
    const pct = Math.min(Math.round(summary.total / goal * 100), 100);
    const filled = Math.round(pct / 10);
    const bar = '█'.repeat(filled) + '░'.repeat(10 - filled);
    const shown = Math.min(summary.total, goal);
    return `<div class="cal-progress">
      <span>${t('today_goal')}</span>
      <span class="cal-prog-bar">${bar}</span>
      <span class="cal-prog-pct">${shown}/${goal}${pct >= 100 ? ' ✓' : ''}</span>
      <button onclick="if(window.dailyHelp)dailyHelp()" aria-label="說明" style="background:none;border:none;color:var(--ac2,#e8734a);cursor:pointer;font-size:12px;font-weight:700;padding:0 0 0 6px">ⓘ ${typeof enOr==='function'?enOr('說明','Help'):'說明'}</button>
    </div>`;
  }

  // Render full panel HTML (returns string)
  function getPanelHTML() {
    const streaks = getStreaks();
    const summary = getTodaySummary();
    const todayText = summary.total > 0 ? t('today_learned', { n: summary.total }) : t('today_not_started');

    // 全新用戶(從未學過)→ 顯示鼓勵文案,不用一排「0 天／0 天」勸退第一印象
    const isBrandNew = streaks.current === 0 && streaks.longest === 0 && summary.total === 0;
    const streakInner = isBrandNew
      ? `<span class="cal-streak-fire">${t('streak_empty')}</span>`
      : `<span class="cal-streak-fire">${t('streak_fire', { n: streaks.current })}</span>
        <span class="cal-streak-sep">|</span>
        <span>${t('streak_longest', { n: streaks.longest })}</span>
        <span class="cal-streak-sep">|</span>
        <span>${t('today_prefix')}${todayText}</span>`;

    // Day-1 起點卡:完全零學習紀錄的新用戶,不給灰色熱力圖+0/30(負面訊號+資訊過載),
    // 換成「目標倒數+今天只要 10 個」的單一行動起點。做過任何一個動作後就恢復正常儀表板。
    if (Object.keys(getLog()).length === 0) {
      var _d1 = (function () {
        var exam = new Date('2026-12-06T00:00:00+09:00');   // 12 月第一個週日 JLPT
        var days = Math.max(0, Math.ceil((exam - Date.now()) / 86400000));
        var _e = (typeof enOr==='function') ? enOr : function(zh){ return zh; };
        return `<div class="cal-panel" style="text-align:center;padding:22px 16px">
          <div style="font-size:13px;color:var(--ac,#d4654a);font-weight:800;letter-spacing:.05em">${_e('⏳ 距離 12/6 JLPT 還有 '+days+' 天','⏳ '+days+' days until the 12/6 JLPT')}</div>
          <div style="font-size:19px;font-weight:800;margin:8px 0 4px">${_e('今天先背 10 個字就好','Just learn 10 words today')}</div>
          <div style="font-size:13px;color:var(--tx2,#888);margin-bottom:14px">${_e('明天它們會自動回來考你——這就是背得起來的原因。','They will come back to test you tomorrow — that is how they stick.')}</div>
          <button style="font:inherit;background:var(--ac,#d4654a);color:#fff;border:0;border-radius:12px;padding:12px 26px;font-weight:700;font-size:15px;cursor:pointer"
            onclick="try{var el=document.querySelector('.gcard,.vcard,.card-item');el&&el.scrollIntoView({block:'center',behavior:'smooth'});}catch(e){}">${_e('開始今天的 10 個 →','Start today\'s 10 →')}</button>
        </div>`;
      })();
      return _d1;
    }
    return `<div class="cal-panel">
      <div class="cal-streak">${streakInner}</div>
      ${buildHeatmap()}
      ${buildProgress()}
    </div>`;
  }

  // Render panel into DOM (first child of main)
  function renderPanel() {
    let panel = document.getElementById('calPanel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'calPanel';
      const mn = document.getElementById('mn');
      if (mn) mn.prepend(panel);
    }
    panel.innerHTML = getPanelHTML();
  }

  return { logActivity, renderPanel, getStreaks, getTodaySummary };
})();
