// ========== READING PRACTICE ==========
const Reading = (() => {
  const SCORE_KEY = 'reading_scores';
  const DONE_KEY = 'reading_done';   // { n5: ['id1','id2', ...], ... }
  let currentPassage = null;
  let currentQ = 0;
  let score = 0;
  let answered = [];
  let timerInterval = null;
  let timerSeconds = 0;
  let timerEnabled = true;
  let furiganaVisible = true;
  let selectedLevel = 'n5';
  let readMode = 'new'; // 'new'（沒讀過）| 'review'（讀過複習）| 'all'（全部）

  // ── passage bank ──
  let passages = window.READING_PASSAGES || [];
  function setPassages(arr) { passages = arr || []; }

  // ── helpers ──
  function getScores() { try { return JSON.parse(localStorage.getItem(SCORE_KEY)) || {}; } catch(e) { return {}; } }
  function saveScores(d) { localStorage.setItem(SCORE_KEY, JSON.stringify(d)); }
  function getDone() { try { return JSON.parse(localStorage.getItem(DONE_KEY)) || {}; } catch(e) { return {}; } }
  function saveDone(d) {
    localStorage.setItem(DONE_KEY, JSON.stringify(d));
    if (typeof saveAllCloud === 'function') saveAllCloud();
  }
  function markDone(lv, id) {
    const d = getDone();
    if (!d[lv]) d[lv] = [];
    if (!d[lv].includes(id)) { d[lv].push(id); saveDone(d); }
  }
  function doneList(lv) { return getDone()[lv] || []; }

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2,'0')}`;
  }

  // ── UI ──
  function start() {
    const box = document.getElementById('quizBox');
    const scores = getScores();
    const done = getDone();
    const levelStats = ['n5','n4','n3','n2','n1'].map(lv => {
      const s = scores[lv] || { correct: 0, total: 0 };
      const pct = s.total ? Math.round(s.correct / s.total * 100) : 0;
      const total = passages.filter(p => p.level === lv).length;
      const dn = (done[lv] || []).length;
      return `<span style="font-size:11px;color:var(--tx2)">${lv.toUpperCase()}: 讀過 ${dn}/${total}・分數 ${s.correct}/${s.total} (${pct}%)</span>`;
    }).join('<br>');

    box.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <h3 style="margin:0">${t('rd_title')}</h3>
        <button class="qclose" style="width:auto;margin:0;padding:2px 10px" onclick="Reading.close()">✕</button>
      </div>
      <p style="font-size:13px;color:var(--tx2);margin-bottom:12px">${t('rd_subtitle')}</p>
      <div class="qf"><label>${t('quiz_level')}</label><div class="qo" id="rdLevel">
        <button class="on" data-v="n5">N5</button><button data-v="n4">N4</button>
        <button data-v="n3">N3</button><button data-v="n2">N2</button>
        <button data-v="n1">N1</button>
      </div></div>
      <div class="qf"><label>模式</label><div class="qo" id="rdMode">
        <button class="${readMode==='new'?'on':''}" data-v="new">新題（沒讀過）</button>
        <button class="${readMode==='review'?'on':''}" data-v="review">複習（讀過的）</button>
        <button class="${readMode==='all'?'on':''}" data-v="all">全部</button>
      </div></div>
      <div class="qf"><label>${t('rd_timer')}</label><div class="qo" id="rdTimer">
        <button class="on" data-v="1">${t('rd_timer_on')}</button><button data-v="0">${t('rd_timer_off')}</button>
      </div></div>
      <div style="margin:10px 0;line-height:1.8">${levelStats}</div>
      <button class="qstart" onclick="Reading.begin()">${t('rd_start')}</button>
      <button class="qclose" onclick="Reading.close()">${t('rd_cancel')}</button>`;
    box.querySelectorAll('.qo').forEach(g => {
      g.querySelectorAll('button').forEach(b => {
        b.onclick = () => { g.querySelectorAll('button').forEach(x => x.classList.remove('on')); b.classList.add('on'); };
      });
    });
    document.getElementById('quizBg').classList.add('show');
  }

  // 追蹤本 session 內最近讀過的 passage id，避免連續抽到同一篇
  const recentIds = {}; // { n5: [...], n4: [...], ... }
  function begin() {
    const lvEl = document.querySelector('#rdLevel .on');
    const tmEl = document.querySelector('#rdTimer .on');
    const mdEl = document.querySelector('#rdMode .on');
    if (lvEl) selectedLevel = lvEl.dataset.v;
    if (tmEl) timerEnabled = tmEl.dataset.v === '1';
    if (mdEl) readMode = mdEl.dataset.v;
    const pool = passages.filter(p => p.level === selectedLevel);
    if (!pool.length) { alert(t('rd_no_data')); return; }
    const done = doneList(selectedLevel);

    // 依模式選池
    let candidates;
    if (readMode === 'new') {
      candidates = pool.filter(p => !done.includes(p.id));
      if (!candidates.length) {
        if (confirm(`${selectedLevel.toUpperCase()} 全部 ${pool.length} 篇都讀過了。要切換到「複習」模式重讀嗎？`)) {
          readMode = 'review';
          candidates = pool.filter(p => done.includes(p.id));
        } else { start(); return; }
      }
    } else if (readMode === 'review') {
      candidates = pool.filter(p => done.includes(p.id));
      if (!candidates.length) {
        alert(`${selectedLevel.toUpperCase()} 還沒讀過任何一篇，請先用「新題」模式。`);
        start(); return;
      }
    } else {
      candidates = pool;
    }

    // 避免本 session 內連續抽到同一篇
    if (!recentIds[selectedLevel]) recentIds[selectedLevel] = [];
    const recent = recentIds[selectedLevel];
    let picks = candidates.filter(p => !recent.includes(p.id));
    if (!picks.length) { recent.length = 0; picks = candidates; }
    currentPassage = picks[Math.floor(Math.random() * picks.length)];
    recent.push(currentPassage.id);
    const keep = Math.max(1, Math.floor(candidates.length / 2));
    while (recent.length > keep) recent.shift();

    currentQ = 0;
    score = 0;
    answered = [];
    timerSeconds = 0;
    renderPassage();
  }
  // 再讀同一篇（不重新抽）
  function retrySame() {
    if (!currentPassage) return begin();
    currentQ = 0;
    score = 0;
    answered = [];
    timerSeconds = 0;
    renderPassage();
  }

  function renderPassage() {
    const p = currentPassage;
    const box = document.getElementById('quizBox');

    if (timerEnabled) {
      if (timerInterval) clearInterval(timerInterval);
      timerSeconds = 0;
      timerInterval = setInterval(() => {
        timerSeconds++;
        const el = document.getElementById('rdTimer');
        if (el) el.textContent = formatTime(timerSeconds);
      }, 1000);
    }

    const passageHtml = p.passage.replace(/\n/g, '<br>');
    box.innerHTML = `
      <div class="qhd">
        <span style="display:flex;align-items:center;gap:6px">
          <span class="cf-lv">${p.level.toUpperCase()}</span>
          <span>${p.type}</span>
        </span>
        <span style="display:flex;align-items:center;gap:8px">
          ${timerEnabled ? '<span id="rdTimer" style="font-variant-numeric:tabular-nums">0:00</span>' : ''}
          <button class="qclose" style="width:auto;margin:0;padding:2px 10px" onclick="Reading.close()">✕</button>
        </span>
      </div>
      <h4 style="margin-bottom:10px;color:var(--tx)">${p.title}</h4>
      <div id="rdPassage" style="background:var(--bg3);padding:16px;border-radius:8px;line-height:2;font-size:15px;margin-bottom:12px;border:1px solid var(--bd);color:var(--tx)">${passageHtml}</div>
      <div style="display:flex;gap:6px;margin-bottom:14px">
        <button onclick="Reading.toggleFurigana()" style="font-size:11px;padding:4px 10px;border:1px solid var(--bd);border-radius:6px;background:var(--bg2);color:var(--tx2);cursor:pointer" id="rdFuriBtn">${t('rd_furigana_show')}</button>
      </div>
      <div id="rdQuestions"></div>
      <div id="rdNav" style="margin-top:12px"></div>`;

    furiganaVisible = true;
    renderQuestion();
  }

  function renderQuestion() {
    const p = currentPassage;
    if (currentQ >= p.questions.length) { showPassageResults(); return; }
    const q = p.questions[currentQ];
    const qDiv = document.getElementById('rdQuestions');
    qDiv.innerHTML = `
      <div style="font-size:13px;color:var(--tx2);margin-bottom:6px">問題 ${currentQ + 1} / ${p.questions.length}</div>
      <div style="font-size:15px;font-weight:600;margin-bottom:10px;color:var(--tx)">${q.q}</div>
      <div class="qopts">${q.options.map((o, i) => '<button class="qopt" onclick="Reading.answer(' + i + ')">' + o + '</button>').join('')}</div>`;
  }

  function answer(idx) {
    const q = currentPassage.questions[currentQ];
    const correct = idx === q.correct;
    if (correct) score++;
    answered.push({ q: q.q, correct, chosenIdx: idx, correctIdx: q.correct, options: q.options });
    if (!correct && typeof Stats !== 'undefined' && Stats.addWrongQuestion) {
      const plainPassage = (currentPassage.passage || '').replace(/<rt>[^<]*<\/rt>/g, '').replace(/<\/?ruby>/g, '');
      Stats.addWrongQuestion({ mode:'reading', id:`${currentPassage.id}-q${currentQ}`, level:currentPassage.level, text:plainPassage, q:q.q, options:q.options, correctIdx:q.correct, userIdx:idx });
    }

    const opts = document.querySelectorAll('#rdQuestions .qopt');
    opts.forEach((b, i) => {
      b.disabled = true;
      if (i === q.correct) b.classList.add('qcorrect');
      if (i === idx && !correct) b.classList.add('qwrong');
    });

    // Show explanation
    const qDiv = document.getElementById('rdQuestions');
    const expDiv = document.createElement('div');
    expDiv.style.cssText = 'margin-top:10px;padding:10px;border-radius:8px;font-size:13px;background:var(--note-bg);color:var(--note-tx);border-left:3px solid var(--ac)';
    expDiv.innerHTML = `<b>${correct ? '✓ 正確' : '✗ 錯誤'}</b>　${q.explanation}`;
    qDiv.appendChild(expDiv);

    const navDiv = document.getElementById('rdNav');
    if (currentQ < currentPassage.questions.length - 1) {
      navDiv.innerHTML = `<button class="qstart" onclick="Reading.nextQ()">${t('rd_next')}</button>`;
    } else {
      navDiv.innerHTML = `<button class="qstart" onclick="Reading.showPassageResults()">${t('rd_show_result')}</button>`;
    }
  }

  function nextQ() {
    currentQ++;
    renderQuestion();
    document.getElementById('rdNav').innerHTML = '';
  }

  function showPassageResults() {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    const p = currentPassage;
    const total = p.questions.length;
    const pct = Math.round(score / total * 100);

    // Save scores + 標記已讀
    const scores = getScores();
    if (!scores[selectedLevel]) scores[selectedLevel] = { correct: 0, total: 0 };
    scores[selectedLevel].correct += score;
    scores[selectedLevel].total += total;
    saveScores(scores);
    markDone(selectedLevel, p.id);

    const cls = pct >= 80 ? 'good' : pct >= 50 ? 'ok' : 'bad';
    const box = document.getElementById('quizBox');
    box.innerHTML = `
      <h3>${t('rd_title')}</h3>
      <div class="qscore ${cls}">${score} / ${total} (${pct}%)</div>
      ${timerEnabled ? `<div style="text-align:center;font-size:13px;color:var(--tx2);margin-bottom:8px">${t('rd_time_used', { t: formatTime(timerSeconds) })}</div>` : ''}
      <div style="font-size:13px;color:var(--tx2);margin-bottom:8px">${p.title}（${p.level.toUpperCase()}）</div>
      <div class="qresults">${answered.map(a =>
        '<div class="qr ' + (a.correct ? 'ok' : 'ng') + '"><span class="qrc">' + (a.correct ? '✓' : '✗') + '</span><span>' + a.q + '</span></div>'
      ).join('')}</div>
      <div class="qactions">
        <button class="qstart" onclick="Reading.begin()">下一篇</button>
        <button class="qstart" style="background:var(--bg3);color:var(--tx)" onclick="Reading.retrySame()">再讀同一篇</button>
        <button class="qclose" onclick="Reading.close()">${t('ls_close')}</button>
      </div>`;
  }

  function toggleFurigana() {
    furiganaVisible = !furiganaVisible;
    const passage = document.getElementById('rdPassage');
    if (passage) {
      passage.querySelectorAll('rt').forEach(rt => {
        rt.style.visibility = furiganaVisible ? 'visible' : 'hidden';
      });
    }
    const btn = document.getElementById('rdFuriBtn');
    if (btn) btn.textContent = furiganaVisible ? t('rd_furigana_show') : t('rd_furigana_hide');
  }

  function close() {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    document.getElementById('quizBg').classList.remove('show');
  }

  return { start, begin, retrySame, answer, nextQ, showPassageResults, toggleFurigana, close, setPassages };
})();
