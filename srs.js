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
    const e = d[key] || { interval: 0, ease: 2.5, nextReview: today(), nextReviewTs: now, reviews: 0, correct: 0, created: now };
    if (!e.created) e.created = e.lastReviewTs || now;   // 舊資料補 created(每日新字上限用;舊字不算今天新學)
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
    const e = d[key] || { interval: 0, ease: 2.5, nextReview: today(), nextReviewTs: now, reviews: 0, correct: 0, created: now };
    if (!e.created) e.created = e.lastReviewTs || now;
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

  let againQueue = [], inAgain = false;   // B7 錯題重考:本輪答錯的卡,結尾再考一次
  let _onDone = null;   // 闖關(path.js)用:這輪結束不顯示預設結算,改叫回呼接下一步
  function start(level, opts) {
    lvl = level || (typeof currentLevel !== 'undefined' ? currentLevel : 'n5');
    againQueue = []; inAgain = false;
    _onDone = (opts && typeof opts.onDone === 'function') ? opts.onDone : null;
    if (opts && Array.isArray(opts.words) && opts.words.length) {
      // 指定字表(闖關單元的 10 個字):已在 srs_data 的當複習、沒有的當新字 → 一樣寫進 SRS 排程
      const d = getData();
      queue = opts.words.map(v => ({ ...v, level: lvl, isNew: !d[lvl + ':' + v.w] }));
    } else if (window.StudyPlan) {
      // 每日計畫(study-plan.js):複習上限、新字上限(扣掉今天已學)、交錯/先複習、單字集排序與主題開關
      queue = StudyPlan.buildQueue(opts && opts.extraNew ? opts.extraNew : 0, opts || {});   // opts.reviewOnly → 只排到期複習(關卡節奏)
    } else {
      // 複習跨級別：底部「複習(195)」是全級別計數，start 也要對齊
      const allDue = getAllDue();
      const nw = getNew(lvl, 10);
      queue = [];
      allDue.forEach(x => {
        const v = getVocabData(x.level).find(w => w.w === x.word);
        if (v) queue.push({ ...v, level: x.level, isNew: false });
      });
      nw.forEach(v => queue.push({ ...v, level: lvl, isNew: true }));
    }
    if (!queue.length) { (window.AppUI ? AppUI.alert : alert)(t('srs_no_review')); return; }
    cur = 0;
    renderCard();
    document.getElementById('quizBg').classList.add('show');
  }

  // ── 打字模式(使用者回饋:單字複習想用打的)──
  // 看中文意思 → 打出日文;漢字或假名都算對。比對前正規化:全形→半形、片假名→平假名、去空白。
  const TYPE_KEY = 'srs_type_mode';
  const _E = (zh, en) => (typeof enOr === 'function' ? enOr(zh, en) : zh);
  function typeMode() { try { return localStorage.getItem(TYPE_KEY) === '1'; } catch (e) { return false; } }
  function setTypeMode(on) { try { localStorage.setItem(TYPE_KEY, on ? '1' : ''); } catch (e) {} if (queue[cur]) renderCard(); }
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
  let typedDone = false, typedRight = false;
  // 打字模式結果畫面:按 Enter = 下一題(不用伸手點按鈕);組字中的 Enter 不算
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' || e.isComposing || e.keyCode === 229) return;
    if (!typedDone || retypePending) return;
    const box = document.getElementById('quizBox'); if (!box || !box.querySelector('#srsTypeRes')) return;
    if (e.target && e.target.id === 'srsRetypeIn') return;   // 重打框自己的 handler 處理
    e.preventDefault(); nextTyped(typedRight);
  });
  function headerHtml(item, itemLv) {
    const on = typeMode();
    return `<div class="qhd"><span>${cur+1} / ${queue.length}<span style="color:var(--tx3);margin:0 6px">·</span>${itemLv.toUpperCase()} ${item.again?_E('錯題重考','Retry'):item.isNew?t('srs_new'):t('srs_review')}</span>` +
      `<span class="srs-seg" role="tablist"><button type="button" class="${on?'':'on'}" onclick="event.stopPropagation();SRS.setTypeMode(false)"><i data-ic=refresh></i>${_E('翻卡','Flip')}</button><button type="button" class="${on?'on':''}" onclick="event.stopPropagation();SRS.setTypeMode(true)"><i data-ic=edit></i>${_E('打字','Type')}</button></span>` +
      `<button class="qclose" style="width:auto;margin:0;padding:2px 10px" onclick="SRS.close()"><i data-ic=x></i></button></div>`;
  }
  function renderTyped(item, itemLv, st) {
    typedDone = false;
    const C = x => (typeof cvt === 'function' ? cvt(x) : x);
    document.getElementById('quizBox').innerHTML = headerHtml(item, itemLv) + `
      <div class="srs-card" id="srsCard" style="cursor:default">
        <div class="srs-meaning" style="font-size:22px;font-weight:800;margin-top:6px">${C(item.m)}</div>
        <div style="font-size:12px;color:var(--tx2);margin-top:4px">${item.c ? '［' + item.c + '］ ' : ''}${_E('打出日文，漢字或假名都可以 → Enter','Type the Japanese — kanji or kana → Enter')}</div>
        <input id="srsTypeIn" class="srs-type-in" lang="ja" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="…" onkeydown="if(event.key==='Enter'&&!event.isComposing&&event.keyCode!==229){event.preventDefault();SRS.checkTyped();}" oncompositionstart="this.dataset.c=1" oncompositionend="this.dataset.c=''">
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
    if (typedDone) return; typedDone = true; typedRight = !!right;
    const item = queue[cur];
    const C = x => (typeof cvt === 'function' ? cvt(x) : x);
    const E = x => String(x == null ? '' : x).replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const inp = document.getElementById('srsTypeIn');
    if (inp) { inp.disabled = true; inp.classList.add(right ? 'ok' : 'ng'); }
    const btns = document.getElementById('srsTypeBtns'); if (btns) btns.style.display = 'none';
    // 答錯 → 看完正解要「照著再打一次」才能進下一題(使用者回饋:重打一次記得比較住)。可按「跳過」直接走。
    retypePending = !right;
    const cfHint = window.sameReadingHint ? window.sameReadingHint(item) : '';
    const res = document.getElementById('srsTypeRes');
    if (res) res.innerHTML =
      '<div style="font-weight:800;font-size:15px;color:' + (right ? 'var(--correct-tx,#2E7D57)' : 'var(--ac)') + '">' +
        (right ? _E('答對了!','Correct!') : _E('正解:','Answer: ') + E(item.w) + (item.r && item.r !== item.w ? '（' + E(item.r) + '）' : '')) + '</div>' +
      (!right && val ? '<div style="font-size:12.5px;color:var(--tx2)">' + _E('你打的:','You typed: ') + E(val) + '</div>' : '') +
      '<div class="srs-type-res"><div style="font-size:18px;font-weight:700">' + E(item.w) + (item.r && item.r !== item.w ? ' <span style="font-size:13px;color:var(--tx2)">' + E(item.r) + '</span>' : '') + '</div>' +
        (item.ex && item.ex.j ? '<div style="margin-top:4px">' + E(item.ex.j) + '</div><div style="font-size:12.5px;color:var(--tx2)">' + C(E(item.ex.z || '')) + '</div>' : '') +
        (cfHint ? '<div class="confuse-hint" style="margin-top:6px">' + cfHint + '</div>' : '') + '</div>' +
      (right
        ? '<button class="qstart" style="margin-top:10px" onclick="SRS.nextTyped(true)">' + (cur + 1 >= queue.length ? _E('看結果 →','Results →') : _E('下一題 →','Next →')) + '</button>'
        : '<div style="margin-top:10px;font-size:13px;font-weight:700;color:var(--ac)">' + _E('照著再打一次 ✍️','Type it once more ✍️') + '</div>' +
          '<input id="srsRetypeIn" class="srs-type-in" lang="ja" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="' + E(item.w) + '" onkeydown="if(event.key===\'Enter\'&&!event.isComposing&&event.keyCode!==229){event.preventDefault();SRS.checkRetype();}" oncompositionstart="this.dataset.c=1" oncompositionend="this.dataset.c=\'\';SRS.checkRetype(true)" oninput="SRS.checkRetype(true)">' +
          '<div style="display:flex;gap:8px;margin-top:8px"><button class="qstart" style="margin:0;width:auto;flex:1 1 0" onclick="SRS.checkRetype()">' + _E('送出','Check') + '</button>' +
          '<button class="qstart" style="margin:0;width:auto;flex:0 0 92px;background:none;color:var(--tx2);border:1px solid var(--bd,#ddd)" onclick="SRS.nextTyped(false)">' + _E('跳過','Skip') + '</button></div>');
    if (!right) { const ri = document.getElementById('srsRetypeIn'); if (ri) setTimeout(() => { try { ri.focus(); } catch (e) {} }, 80); }
    try { if (typeof speak === 'function') speak(item.r || item.w); } catch (e) {}
  }
  function checkTyped() {
    const inp = document.getElementById('srsTypeIn');
    const val = inp ? inp.value : '';
    if (!normJa(val)) { if (inp) inp.focus(); return; }
    revealTyped(isTypedRight(queue[cur], val), val);
  }
  function giveUp() { revealTyped(false, ''); }
  function nextTyped(right) { retypePending = false; rate(!!right); }
  let retypePending = false;
  // 重打:打對(邊打邊比對,對了就綁綠框 + 自動進下一題;仍算「答錯」進 SRS)。live=true 是 oninput 觸發,打錯不提示。
  function checkRetype(live) {
    const ri = document.getElementById('srsRetypeIn'); if (!ri || !retypePending) return;
    if (live && ri.dataset.c) return;   // IME 組字中:等 compositionend 再比
    const ok = isTypedRight(queue[cur], ri.value);
    if (ok) {
      // 使用者回饋:重打對了直接跳下一題很突然 → 先亮綠、說「打對了」,按「下一題」才走
      ri.classList.remove('ng'); ri.classList.add('ok'); ri.readOnly = true; retypePending = false; typedRight = false;
      ri.onkeydown = function (e) { if (e.key === 'Enter' && !e.isComposing && e.keyCode !== 229) { e.preventDefault(); nextTyped(false); } };
      const wrap = ri.parentElement;
      const btns = wrap && wrap.querySelector('div[style*="display:flex"]');
      if (btns) btns.innerHTML = '<div style="flex:1;align-self:center;font-weight:800;color:var(--correct-tx,#2E7D57)">✓ ' + _E('打對了!','Correct!') + '</div><button class="qstart" style="margin:0;width:auto;flex:0 0 120px" onclick="SRS.nextTyped(false)">' + (cur + 1 >= queue.length ? _E('看結果 →','Results →') : _E('下一題 →','Next →')) + '</button>';
      try { if (typeof speak === 'function') speak(queue[cur].r || queue[cur].w); } catch (e) {}
      return;
    }
    if (!live) { ri.classList.add('ng'); ri.select && ri.select(); }
    else ri.classList.remove('ng');
  }

  function renderCard() {
    const item = queue[cur];
    const itemLv = item.level || lvl;
    const st = getStats(itemLv);
    if (typeMode() && item.m && item.m !== item.w) return renderTyped(item, itemLv, st);
    const cfHint = window.sameReadingHint ? window.sameReadingHint(item) : '';
    document.getElementById('quizBox').innerHTML = headerHtml(item, itemLv) + `
      <div class="srs-card" id="srsCard" onclick="SRS.flip()">
        <div class="srs-front" id="srsFront">
          ${(window.StudyPlan && StudyPlan.get().front === 'zh' && item.m && item.m !== item.w)
            ? `<div class="srs-meaning" style="font-size:24px;font-weight:800;margin-top:10px">${typeof cvt==='function'?cvt(item.m):item.m}</div>${item.c?'<div class="qsub">［'+item.c+'］</div>':''}<div class="srs-hint" style="margin-top:10px">${_E('回想日文怎麼說 → 點卡翻面','Recall the Japanese → tap to flip')}</div>`
            : `<div class="qmain">${item.w}</div>
          ${item.w!==item.r?'<div class="qsub">'+item.r+'</div>':''}
          <div class="srs-spk-row">${spkBtn(item.r || item.w)}</div>
          <div class="srs-hint">${t('srs_flip')}</div>`}
        </div>
        <div class="srs-back" id="srsBack" style="display:none">
          <div class="qmain">${item.w}${(window.StudyPlan&&StudyPlan.pitchMark)?StudyPlan.pitchMark(item):''}</div>
          ${item.w!==item.r?'<div class="qsub">'+item.r+'</div>':''}
          <div class="srs-spk-row">${spkBtn(item.r || item.w)}</div>
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

  // 字卡發音鈕(2026-09-22 KOL 探長 + Mia 都回報):
  //   原本是 24px 的裸 svg，而且整張卡都綁著翻面 → 按不中就直接翻開答案，
  //   翻開之後背面又沒有發音鈕，等於這張卡就聽不到了。
  //   改成 44px 觸控區(Apple 建議最小尺寸)、有圓形底看得出來可以按，而且正反面都放。
  function spkBtn(text, label) {
    var t = String(text || '').replace(/'/g, "\\'");
    // 有字的按鈕比光 icon 好按也好懂(Mia 2026-09-22:「可以再大一點點和弄個 button」)
    return '<button type="button" class="srs-spk" onclick="event.stopPropagation();speak(\'' + t + '\')">'
      + '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14"/></svg>'
      + '<span>' + (label || _E('發音', 'Play')) + '</span></button>';
  }

  function flip() {
    document.getElementById('srsFront').style.display = 'none';
    document.getElementById('srsBack').style.display = '';
  }

  function rate(correct) {
    const item = queue[cur];
    // 重考回合:答對不再寫 SRS(第一次答錯已排明天複習,再寫會變「答對→間隔跳長」);答錯再記一次
    if (!item.again || !correct) record(item.level || lvl, item.w, correct);
    if (typeof Calendar !== 'undefined') Calendar.logActivity('vocab');
    if (!correct && !item.again && window.StudyPlan && StudyPlan.get().again) againQueue.push({ ...item, again: true });
    cur++;
    if (cur >= queue.length) {
      if (againQueue.length && !inAgain) {   // 本輪結尾:把答錯的卡接上去再考一次
        inAgain = true; queue = queue.concat(againQueue); againQueue = [];
        renderCard(); return;
      }
      showDone();
    } else renderCard();
  }

  function showDone() {
    if (_onDone) { const cb = _onDone; _onDone = null; cb({ total: queue.length }); return; }
    const st = getStats(lvl);
    document.getElementById('quizBox').innerHTML = `
      <h3>${t('srs_done')}</h3>
      <div class="srs-done-stats">
        <div>${t('srs_today', { n: queue.length })}</div>
        <div>${t('srs_total_learned', { n: st.total })}</div>
        <div>${t('srs_total_mastered', { n: st.mastered })}</div>
        <div>${t('srs_total_learning', { n: st.learning })}</div>
      </div>
      <button class="qstart" onclick="SRS.close()">${t('quiz_back')}</button>${window.StayTWCard ? StayTWCard.completionHtml('srs') : ''}`;
  }

  function close() {
    _onDone = null;
    document.getElementById('quizBg').classList.remove('show');
    updateReviewCount();
    try { if (window.NavBack) NavBack.back(); } catch (e) {}   // 從我的單字本/闖關進來 → 回那個畫面,不要掉回面板
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

  return { start, record, recordGrade, flip, rate, close, getDueCount, updateReviewCount, getStats, isDue, GRADES, setTypeMode, checkTyped, checkRetype, giveUp, nextTyped };
})();
