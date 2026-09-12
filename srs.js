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

  // 複習進度視覺化：已掌握比例環圈圖 + 三項數字圖例（已學 / 待複習 / 已掌握）
  function statsDonut(st) {
    const total = st.total || 0;
    if (!total) return `<div class="srs-stats">${t('srs_stats', { learned: st.total, due: st.due, mastered: st.mastered })}</div>`;
    const C = 125.66, masteredLen = (st.mastered / total) * C;
    const pct = Math.round(st.mastered / total * 100);
    return `<div class="srs-stats-wrap">
      <svg class="srs-donut" width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
        <circle class="dn-bg" cx="28" cy="28" r="20" fill="none" stroke-width="8"/>
        <circle cx="28" cy="28" r="20" fill="none" stroke-width="8" stroke="#16a34a" stroke-linecap="round"
          stroke-dasharray="${masteredLen.toFixed(2)} ${C}" transform="rotate(-90 28 28)"/>
        <text x="28" y="32" text-anchor="middle" font-size="13" font-weight="700" fill="var(--tx)">${pct}%</text>
      </svg>
      <div class="srs-legend">
        <div><i style="background:var(--tx3)"></i>${t('srs_stat_learned', { n: st.total })}</div>
        <div><i style="background:var(--ac)"></i>${t('srs_stat_due', { n: st.due })}</div>
        <div><i style="background:#16a34a"></i>${t('srs_stat_mastered', { n: st.mastered })}</div>
      </div>
    </div>`;
  }

  let queue = [], cur = 0, lvl = 'n5';

  // 跨級別抓所有 due 單字，依 nextReviewTs 排序
  function getAllDue() {
    const d = getData(), now = Date.now(), out = [];
    Object.entries(d).forEach(([key, e]) => {
      if (!isDue(e, now)) return;
      const ci = key.indexOf(':');
      if (ci < 0) return;
      out.push({ level: key.slice(0, ci), word: key.slice(ci + 1), ...e });
    });
    return out.sort((a, b) => (a.nextReviewTs || 0) - (b.nextReviewTs || 0));
  }

  function start(level) {
    lvl = level || (typeof currentLevel !== 'undefined' ? currentLevel : 'n5');
    // 複習跨級別：底部「複習(195)」是全級別計數，start 也要對齊
    const allDue = getAllDue();
    const nw = getNew(lvl, 10);
    queue = [];
    allDue.forEach(x => {
      const v = getVocabData(x.level).find(w => w.w === x.word);
      if (v) queue.push({ ...v, level: x.level, isNew: false });
    });
    nw.forEach(v => queue.push({ ...v, level: lvl, isNew: true }));
    if (!queue.length) { alert(t('srs_no_review')); return; }
    cur = 0;
    renderCard();
    document.getElementById('quizBg').classList.add('show');
  }

  // ── 打字模式(使用者回饋:單字複習想用打的)──
  // 看中文意思 → 打出日文;漢字或假名都算對。比對前正規化:全形→半形、片假名→平假名、去空白。
  const TYPE_KEY = 'srs_type_mode';
  const _E = (zh, en) => (typeof enOr === 'function' ? enOr(zh, en) : zh);
  function typeMode() { try { return localStorage.getItem(TYPE_KEY) === '1'; } catch (e) { return false; } }
  function setTypeMode(on) { try { localStorage.setItem(TYPE_KEY, on ? '1' : ''); } catch (e) {} renderCard(); }
  function normJa(x) {
    return String(x || '').normalize('NFKC').trim().replace(/[\s・･]/g, '')
      .replace(/[\u30a1-\u30f6]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60));
  }
  function isTypedRight(item, val) {
    const v = normJa(val); if (!v) return false;
    return [item.w, item.r].filter(Boolean).some(c => {
      const n = normJa(c);
      return n === v || n.replace(/[〜~()（）]/g, '') === v;   // 「〜する」「（お）金」這類註記去掉再比
    });
  }
  let typedDone = false;
  function headerHtml(item, itemLv) {
    const on = typeMode();
    return `<div class="qhd"><span>${t('review')} ${cur+1} / ${queue.length}</span><span>${itemLv.toUpperCase()}・${item.isNew?t('srs_new'):t('srs_review')}</span>` +
      `<button class="srs-type-toggle ${on?'on':''}" onclick="event.stopPropagation();SRS.setTypeMode(${on?'false':'true'})" title="${_E('打字模式','Typing mode')}"><i data-ic=edit></i> ${_E('打字','Type')}</button>` +
      `<button class="qclose" style="width:auto;margin:0;padding:2px 10px" onclick="SRS.close()"><i data-ic=x></i></button></div>`;
  }
  function renderTyped(item, itemLv, st) {
    typedDone = false;
    const C = x => (typeof cvt === 'function' ? cvt(x) : x);
    document.getElementById('quizBox').innerHTML = headerHtml(item, itemLv) + `
      <div class="srs-card" id="srsCard" style="cursor:default">
        <div class="srs-meaning" style="font-size:22px;font-weight:800;margin-top:6px">${C(item.m)}</div>
        <div style="font-size:12px;color:var(--tx2);margin-top:4px">${item.c ? '［' + item.c + '］ ' : ''}${_E('打出日文，漢字或假名都可以 → Enter','Type the Japanese — kanji or kana → Enter')}</div>
        <input id="srsTypeIn" class="srs-type-in" lang="ja" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="…" onkeydown="if(event.key==='Enter'){event.preventDefault();SRS.checkTyped();}">
        <div class="srs-btns" id="srsTypeBtns">
          <button class="srs-btn srs-hard" onclick="SRS.giveUp()">${_E('不會','Don\'t know')}</button>
          <button class="srs-btn srs-ok" onclick="SRS.checkTyped()">${_E('送出','Check')}</button>
        </div>
        <div id="srsTypeRes"></div>
      </div>
      ${statsDonut(st)}`;
    const inp = document.getElementById('srsTypeIn');
    if (inp) setTimeout(() => { try { inp.focus(); } catch (e) {} }, 50);
  }
  function revealTyped(right, val) {
    if (typedDone) return; typedDone = true;
    const item = queue[cur];
    const C = x => (typeof cvt === 'function' ? cvt(x) : x);
    const E = x => String(x == null ? '' : x).replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const inp = document.getElementById('srsTypeIn');
    if (inp) { inp.disabled = true; inp.classList.add(right ? 'ok' : 'ng'); }
    const btns = document.getElementById('srsTypeBtns'); if (btns) btns.style.display = 'none';
    const cfHint = window.sameReadingHint ? window.sameReadingHint(item) : '';
    const res = document.getElementById('srsTypeRes');
    if (res) res.innerHTML =
      '<div style="font-weight:800;font-size:15px;color:' + (right ? 'var(--correct-tx,#2E7D57)' : 'var(--ac)') + '">' +
        (right ? _E('答對了!','Correct!') : _E('正解:','Answer: ') + E(item.w) + (item.r && item.r !== item.w ? '（' + E(item.r) + '）' : '')) + '</div>' +
      (!right && val ? '<div style="font-size:12.5px;color:var(--tx2)">' + _E('你打的:','You typed: ') + E(val) + '</div>' : '') +
      '<div class="srs-type-res"><div style="font-size:18px;font-weight:700">' + E(item.w) + (item.r && item.r !== item.w ? ' <span style="font-size:13px;color:var(--tx2)">' + E(item.r) + '</span>' : '') + '</div>' +
        (item.ex && item.ex.j ? '<div style="margin-top:4px">' + E(item.ex.j) + '</div><div style="font-size:12.5px;color:var(--tx2)">' + C(E(item.ex.z || '')) + '</div>' : '') +
        (cfHint ? '<div class="confuse-hint" style="margin-top:6px">' + cfHint + '</div>' : '') + '</div>' +
      '<button class="qstart" style="margin-top:10px" onclick="SRS.nextTyped(' + (right ? 'true' : 'false') + ')">' + (cur + 1 >= queue.length ? _E('看結果 →','Results →') : _E('下一題 →','Next →')) + '</button>';
    try { if (typeof speak === 'function') speak(item.r || item.w); } catch (e) {}
  }
  function checkTyped() {
    const inp = document.getElementById('srsTypeIn');
    const val = inp ? inp.value : '';
    if (!normJa(val)) { if (inp) inp.focus(); return; }
    revealTyped(isTypedRight(queue[cur], val), val);
  }
  function giveUp() { revealTyped(false, ''); }
  function nextTyped(right) { rate(!!right); }

  function renderCard() {
    const item = queue[cur];
    const itemLv = item.level || lvl;
    const st = getStats(itemLv);
    if (typeMode() && item.m && item.m !== item.w) return renderTyped(item, itemLv, st);
    const cfHint = window.sameReadingHint ? window.sameReadingHint(item) : '';
    document.getElementById('quizBox').innerHTML = headerHtml(item, itemLv) + `
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
          ${cfHint?'<div class="confuse-hint">'+cfHint+'</div>':''}
          <div class="srs-btns">
            <button class="srs-btn srs-hard" onclick="event.stopPropagation();SRS.rate(false)">${t('srs_hard')}</button>
            <button class="srs-btn srs-ok" onclick="event.stopPropagation();SRS.rate(true)">${t('srs_ok')}</button>
          </div>
        </div>
      </div>
      ${statsDonut(st)}`;
  }

  function flip() {
    document.getElementById('srsFront').style.display = 'none';
    document.getElementById('srsBack').style.display = '';
  }

  function rate(correct) {
    const item = queue[cur];
    record(item.level || lvl, item.w, correct);
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

  return { start, record, recordGrade, flip, rate, close, getDueCount, updateReviewCount, getStats, isDue, GRADES, setTypeMode, checkTyped, giveUp, nextTyped };
})();
