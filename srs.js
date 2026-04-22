// ========== SPACED REPETITION SYSTEM ==========
const SRS = (() => {
  const KEY = 'srs_data';
  // 全站唯一的評分 → 間隔對應表（FlashCard 按鈕文案也讀這裡）
  const GRADES = {
    known:   { ms: 7 * 86400 * 1000, label: '一週後'    },
    soso:    { ms: 60 * 60 * 1000,   label: '1 小時後'  },
    unknown: { ms: 10 * 60 * 1000,   label: '10 分鐘後' }
  };
  function getData() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch(e) { return {}; } }
  function save(d) { localStorage.setItem(KEY, JSON.stringify(d)); }
  function today() { return new Date().toISOString().split('T')[0]; }
  function dayOf(ts) { return new Date(ts).toISOString().split('T')[0]; }
  function k(lv, w) { return lv + ':' + w; }

  // 統一的 due 判斷：優先用時間戳，沒有就 fallback 到日期字串（相容舊資料）
  function isDue(e, now) {
    if (!e) return false;
    const n = now || Date.now();
    if (typeof e.nextReviewTs === 'number') return e.nextReviewTs <= n;
    return e.nextReview <= dayOf(n);
  }

  function record(level, word, correct) {
    const d = getData();
    const key = k(level, word);
    const now = Date.now();
    const e = d[key] || { interval: 0, ease: 2.5, nextReview: today(), nextReviewTs: now, reviews: 0, correct: 0 };
    e.reviews++;
    if (correct) {
      e.correct++;
      if (e.interval === 0) e.interval = 1;
      else if (e.interval === 1) e.interval = 3;
      else e.interval = Math.round(e.interval * e.ease);
      e.ease = Math.max(1.3, e.ease + 0.1);
    } else {
      e.interval = 1;
      e.ease = Math.max(1.3, e.ease - 0.2);
    }
    const nextTs = now + e.interval * 86400 * 1000;
    e.nextReviewTs = nextTs;
    e.nextReview = dayOf(nextTs);
    e.lastReview = today();
    e.lastReviewTs = now;
    d[key] = e;
    save(d);
    if (typeof saveSRSCloud === 'function') saveSRSCloud();
  }

  // FlashCard 的三評分統一走這裡（不會再繞過 SRS 直寫 localStorage）
  function recordGrade(level, word, grade) {
    const spec = GRADES[grade];
    if (!spec) return;
    const d = getData();
    const key = k(level, word);
    const now = Date.now();
    const e = d[key] || { interval: 0, ease: 2.5, nextReview: today(), nextReviewTs: now, reviews: 0, correct: 0 };
    e.reviews = (e.reviews || 0) + 1;
    e.lastReview = today();
    e.lastReviewTs = now;
    if (grade === 'known') {
      e.correct = (e.correct || 0) + 1;
      e.interval = 7;
      e.ease = Math.min(3, (e.ease || 2.5) + 0.1);
    } else {
      e.interval = 0;
      e.ease = Math.max(1.3, (e.ease || 2.5) - (grade === 'unknown' ? 0.2 : 0.1));
    }
    const nextTs = now + spec.ms;
    e.nextReviewTs = nextTs;
    e.nextReview = dayOf(nextTs);
    d[key] = e;
    save(d);
    if (typeof saveSRSCloud === 'function') saveSRSCloud();
  }

  function getDue(level) {
    const d = getData(), now = Date.now(), out = [];
    Object.entries(d).forEach(([key, e]) => {
      if (key.startsWith(level + ':') && isDue(e, now))
        out.push({ word: key.slice(level.length + 1), ...e });
    });
    return out.sort((a, b) => (a.nextReviewTs || 0) - (b.nextReviewTs || 0));
  }

  function getDueCount() {
    const d = getData(), now = Date.now();
    let c = 0; Object.values(d).forEach(e => { if (isDue(e, now)) c++; });
    return c;
  }

  function getNew(level, count) {
    const d = getData();
    const learned = new Set(Object.keys(d).filter(x => x.startsWith(level + ':')).map(x => x.slice(level.length + 1)));
    return getVocabData(level).filter(v => !learned.has(v.w)).slice(0, count);
  }

  function getStats(level) {
    const d = getData(), pf = level + ':', now = Date.now();
    const entries = Object.entries(d).filter(([x]) => x.startsWith(pf));
    return {
      total: entries.length,
      due: entries.filter(([, v]) => isDue(v, now)).length,
      mastered: entries.filter(([, v]) => v.interval >= 21).length,
      learning: entries.filter(([, v]) => v.interval > 0 && v.interval < 21).length
    };
  }

  let queue = [], cur = 0, lvl = 'n5';

  function start(level) {
    lvl = level || (typeof currentLevel !== 'undefined' ? currentLevel : 'n5');
    const due = getDue(lvl);
    const nw = getNew(lvl, 10);
    queue = [];
    due.forEach(x => { const v = getVocabData(lvl).find(w => w.w === x.word); if (v) queue.push({ ...v, isNew: false }); });
    nw.forEach(v => queue.push({ ...v, isNew: true }));
    if (!queue.length) { alert(t('srs_no_review')); return; }
    cur = 0;
    renderCard();
    document.getElementById('quizBg').classList.add('show');
  }

  function renderCard() {
    const item = queue[cur], st = getStats(lvl);
    document.getElementById('quizBox').innerHTML = `
      <div class="qhd"><span>${t('review')} ${cur+1} / ${queue.length}</span><span>${item.isNew?t('srs_new'):t('srs_review')}</span><button class="qclose" style="width:auto;margin:0;padding:2px 10px" onclick="SRS.close()">✕</button></div>
      <div class="srs-card" id="srsCard" onclick="SRS.flip()">
        <div class="srs-front" id="srsFront">
          <div class="qmain">${item.w}</div>
          ${item.w!==item.r?'<div class="qsub">'+item.r+'</div>':''}
          <div style="margin:8px 0"><svg class="spk" style="width:24px;height:24px;opacity:.6" onclick="event.stopPropagation();speak('${(item.r || item.w).replace(/'/g,"\\'")}')" viewBox="0 0 24 24"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14"/></svg></div>
          <div class="srs-hint">${t('srs_flip')}</div>
        </div>
        <div class="srs-back" id="srsBack" style="display:none">
          <div class="qmain">${item.w}</div>
          ${item.w!==item.r?'<div class="qsub">'+item.r+'</div>':''}
          ${item.m && item.m!==item.w ? '<div class="srs-meaning">'+(typeof cvt==='function'?cvt(item.m):item.m)+'</div>' : ''}
          <div class="srs-btns">
            <button class="srs-btn srs-hard" onclick="event.stopPropagation();SRS.rate(false)">${t('srs_hard')}</button>
            <button class="srs-btn srs-ok" onclick="event.stopPropagation();SRS.rate(true)">${t('srs_ok')}</button>
          </div>
        </div>
      </div>
      <div class="srs-stats">${t('srs_stats', { learned: st.total, due: st.due, mastered: st.mastered })}</div>`;
  }

  function flip() {
    document.getElementById('srsFront').style.display = 'none';
    document.getElementById('srsBack').style.display = '';
  }

  function rate(correct) {
    const item = queue[cur];
    record(lvl, item.w, correct);
    if (typeof Calendar !== 'undefined') Calendar.logActivity('vocab');
    cur++;
    if (cur >= queue.length) showDone(); else renderCard();
  }

  function showDone() {
    const st = getStats(lvl);
    document.getElementById('quizBox').innerHTML = `
      <h3>${t('srs_done')}</h3>
      <div class="srs-done-stats">
        <div>${t('srs_today', { n: queue.length })}</div>
        <div>${t('srs_total_learned', { n: st.total })}</div>
        <div>${t('srs_total_mastered', { n: st.mastered })}</div>
        <div>${t('srs_total_learning', { n: st.learning })}</div>
      </div>
      <button class="qstart" onclick="SRS.close()">${t('quiz_back')}</button>`;
  }

  function close() {
    document.getElementById('quizBg').classList.remove('show');
    updateReviewCount();
  }

  function updateReviewCount() {
    const c = getDueCount();
    const btn = document.getElementById('reviewBtn');
    if (!btn) return;
    const span = btn.querySelector('[data-i18n]') || btn;
    const base = t('review');
    if (span === btn) btn.textContent = c ? base + '(' + c + ')' : base;
    else span.textContent = c ? base + '(' + c + ')' : base;
  }

  return { start, record, recordGrade, flip, rate, close, getDueCount, updateReviewCount, getStats, isDue, GRADES };
})();
