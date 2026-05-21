// ========== LISTENING PRACTICE ==========
const Listening = (() => {
  const SCORE_KEY = 'listening_scores';
  const DONE_KEY = 'listening_done';  // { [item.id]: timestamp } — 答過的題目不再出現
  let currentItem = null;
  let replaysLeft = 2;
  let score = 0;
  let total = 0;
  let queue = [];
  let answered = [];
  let practiceMode = false;
  let speedOverride = null;
  let selectedLevel = 'n5';

  // ── item bank ──
  let items = window.LISTENING_ITEMS || [];
  function setItems(arr) { items = arr || []; }

  // ── helpers ──
  function getScores() { try { return JSON.parse(localStorage.getItem(SCORE_KEY)) || {}; } catch(e) { return {}; } }
  function saveScores(d) { localStorage.setItem(SCORE_KEY, JSON.stringify(d)); }
  function getDone() { try { return JSON.parse(localStorage.getItem(DONE_KEY)) || {}; } catch(e) { return {}; } }
  function saveDone(d) {
    localStorage.setItem(DONE_KEY, JSON.stringify(d));
    if (typeof saveAllCloud === 'function') saveAllCloud();
  }
  function markDone(id) { const d = getDone(); d[id] = Date.now(); saveDone(d); }
  function resetDone(level) {
    if (!level) { localStorage.removeItem(DONE_KEY); if (typeof saveAllCloud === 'function') saveAllCloud(); return; }
    const d = getDone();
    // 只清掉該等級的 id（id 格式：l-n5-1, l-n4-3...）
    const prefix = 'l-' + level + '-';
    Object.keys(d).forEach(k => { if (k.startsWith(prefix)) delete d[k]; });
    saveDone(d);
  }
  function doneCountFor(level) {
    const d = getDone();
    const prefix = 'l-' + level + '-';
    return Object.keys(d).filter(k => k.startsWith(prefix)).length;
  }

  let __lsAudio = null;
  let __lsToken = 0;  // 每次呼叫 speakText 加 1，用來作廢「play() pending 中卻被新呼叫蓋掉」的舊音
  function stopAudio() {
    __lsToken++;
    if (window.speechSynthesis) speechSynthesis.cancel();
    if (__lsAudio) {
      try { __lsAudio.pause(); __lsAudio.src = ''; } catch (e) {}
      __lsAudio = null;
    }
  }
  function speakText(text, rate) {
    const t2 = (text || '').trim();
    if (!t2) return;
    stopAudio();
    const myToken = __lsToken;
    const hash = window.__TTS && window.__TTS[t2];
    if (hash) {
      const audio = new Audio('audio/tts/' + hash + '.mp3');
      audio.playbackRate = rate || 0.85;
      audio.play().then(() => {
        // 在 play() Promise resolve 之前若有更新的呼叫進來，這份音檔要作廢
        if (__lsToken !== myToken) { try { audio.pause(); audio.src=''; } catch(e){} return; }
        __lsAudio = audio;
      }).catch(() => {
        if (__lsToken === myToken) speakBrowser(t2, rate);
      });
      return;
    }
    speakBrowser(t2, rate);
  }
  function speakBrowser(text, rate) {
    if (!window.speechSynthesis) { alert(t('ls_no_tts')); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ja-JP';
    u.rate = rate || 0.85;
    const voices = speechSynthesis.getVoices();
    const jaVoice = voices.find(v => v.lang.startsWith('ja'));
    if (jaVoice) u.voice = jaVoice;
    speechSynthesis.speak(u);
  }

  // ── UI ──
  function start() {
    const box = document.getElementById('quizBox');
    const scores = getScores();
    const levelStats = ['n5','n4','n3','n2','n1'].map(lv => {
      const s = scores[lv] || { correct: 0, total: 0 };
      const pct = s.total ? Math.round(s.correct / s.total * 100) : 0;
      const total = items.filter(i => i.level === lv).length;
      const done = doneCountFor(lv);
      return `<span style="font-size:11px;color:var(--tx2)">${lv.toUpperCase()}: ${done}/${total}題已答 · ${s.correct}/${s.total} 正確 (${pct}%)</span>`;
    }).join(' ');

    box.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <h3 style="margin:0">${t('ls_title')}</h3>
        <button class="qclose" style="width:auto;margin:0;padding:2px 10px" onclick="Listening.close()">✕</button>
      </div>
      <p style="font-size:13px;color:var(--tx2);margin-bottom:6px">${t('ls_subtitle')}</p>
      <p style="font-size:11px;color:var(--tx3);margin-bottom:12px">${t('ls_hint')}</p>
      <div class="qf"><label>${t('quiz_level')}</label><div class="qo" id="lsLevel">
        <button class="on" data-v="n5">N5</button><button data-v="n4">N4</button>
        <button data-v="n3">N3</button><button data-v="n2">N2</button>
        <button data-v="n1">N1</button>
      </div></div>
      <div class="qf"><label>${t('quiz_count')}</label><div class="qo" id="lsCount">
        <button data-v="3">3</button><button class="on" data-v="5">5</button><button data-v="all">${t('ls_all')}</button>
      </div></div>
      <div class="qf"><label>${t('ls_mode')}</label><div class="qo" id="lsMode">
        <button class="on" data-v="test">${t('ls_mode_test')}</button>
        <button data-v="practice">${t('ls_mode_practice')}</button>
      </div></div>
      <div style="margin:10px 0;display:flex;flex-direction:column;gap:3px">${levelStats}</div>
      <button class="qstart" onclick="Listening.begin()">${t('ls_start')}</button>
      <div style="display:flex;gap:8px;margin-top:8px">
        <button class="qclose" style="flex:1;margin:0" onclick="Listening.close()">${t('ls_cancel')}</button>
        <button class="qclose" style="flex:1;margin:0;color:var(--ac)" onclick="Listening.resetCurrent()" title="重置目前選擇等級的已答記錄">↺ 重置進度</button>
      </div>`;
    box.querySelectorAll('.qo').forEach(g => {
      g.querySelectorAll('button').forEach(b => {
        b.onclick = () => { g.querySelectorAll('button').forEach(x => x.classList.remove('on')); b.classList.add('on'); };
      });
    });
    document.getElementById('quizBg').classList.add('show');

    // Warm up speech synthesis
    if (window.speechSynthesis) speechSynthesis.getVoices();
  }

  let lastCountVal = '5';
  let lastBatchIds = [];  // 上一輪用過的題目 id，下一輪優先排除
  function begin() {
    // 從起始面板讀設定；若從結果頁呼叫則面板不存在，沿用上次（防止按鈕無反應）
    const lvEl = document.querySelector('#lsLevel .on');
    const ctEl = document.querySelector('#lsCount .on');
    const mdEl = document.querySelector('#lsMode .on');
    if (lvEl) { if (selectedLevel !== lvEl.dataset.v) lastBatchIds = []; selectedLevel = lvEl.dataset.v; }
    if (ctEl) lastCountVal = ctEl.dataset.v;
    if (mdEl) practiceMode = mdEl.dataset.v === 'practice';

    const pool = items.filter(i => i.level === selectedLevel);
    if (!pool.length) { alert(t('ls_no_data')); return; }

    // 排除已答過的題目 — 用完了才允許 fallback 到全 pool（重複舊題）
    const done = getDone();
    let available = pool.filter(i => !done[i.id]);
    let exhausted = false;
    if (available.length === 0) {
      // 全部題目都答過了 — 提示使用者並用全 pool（或返回讓使用者重置）
      if (!confirm('🎉 你已完成這個等級的所有題目！\n按「確定」重置進度從頭再來，按「取消」回到設定頁。')) return;
      resetDone(selectedLevel);
      available = pool.slice();
      exhausted = true;
    }

    const wantCount = lastCountVal === 'all' ? available.length : Math.min(parseInt(lastCountVal), available.length);
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    queue = shuffled.slice(0, wantCount);
    lastBatchIds = queue.map(q => q.id);

    score = 0;
    total = queue.length;
    answered = [];
    speedOverride = null;

    renderItem(0);
  }
  // 再聽同一批（不重新抽）
  function retrySame() {
    if (!queue || !queue.length) return begin();
    score = 0;
    total = queue.length;
    answered = [];
    speedOverride = null;
    renderItem(0);
  }

  function renderItem(idx) {
    if (idx >= queue.length) { showResults(); return; }
    currentItem = queue[idx];
    replaysLeft = practiceMode ? 999 : 2;

    const box = document.getElementById('quizBox');
    const rateDisplay = speedOverride || currentItem.speed;

    box.innerHTML = `
      <div class="qhd">
        <span style="display:flex;align-items:center;gap:6px">
          <span class="cf-lv">${currentItem.level.toUpperCase()}</span>
          <span style="font-size:12px">${currentItem.type}</span>
          <span style="font-size:11px;color:var(--tx3)">${idx + 1} / ${queue.length}</span>
        </span>
        <span style="display:flex;align-items:center;gap:6px">
          <span style="font-size:12px;color:var(--tx2)">${t('quiz_score', { n: score })}</span>
          <button class="qclose" style="width:auto;margin:0;padding:2px 10px" onclick="Listening.close()">✕</button>
        </span>
      </div>

      <div style="text-align:center;padding:24px 0">
        <button id="lsPlayBtn" onclick="Listening.play()" style="width:72px;height:72px;border-radius:50%;border:3px solid var(--ac2);background:var(--bg2);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;transition:.2s">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--ac2)" stroke="none"><polygon points="6,3 20,12 6,21"/></svg>
        </button>
        <div style="margin-top:8px;font-size:12px;color:var(--tx2)" id="lsReplayInfo">
          ${practiceMode ? t('ls_practice_info') : t('ls_plays_left', { n: replaysLeft })}
        </div>
      </div>

      ${practiceMode ? `
      <div style="display:flex;justify-content:center;gap:6px;margin-bottom:14px">
        <button onclick="Listening.setSpeed(0.7)" class="ls-speed-btn" style="font-size:11px;padding:4px 10px;border:1px solid var(--bd);border-radius:6px;background:${rateDisplay===0.7?'var(--ac2)':'var(--bg2)'};color:${rateDisplay===0.7?'#fff':'var(--tx2)'};cursor:pointer">0.7x</button>
        <button onclick="Listening.setSpeed(null)" class="ls-speed-btn" style="font-size:11px;padding:4px 10px;border:1px solid var(--bd);border-radius:6px;background:${!speedOverride?'var(--ac2)':'var(--bg2)'};color:${!speedOverride?'#fff':'var(--tx2)'};cursor:pointer">${t('ls_speed_normal')}</button>
        <button onclick="Listening.setSpeed(1.2)" class="ls-speed-btn" style="font-size:11px;padding:4px 10px;border:1px solid var(--bd);border-radius:6px;background:${rateDisplay===1.2?'var(--ac2)':'var(--bg2)'};color:${rateDisplay===1.2?'#fff':'var(--tx2)'};cursor:pointer">1.2x</button>
      </div>` : ''}

      <div style="font-size:15px;font-weight:600;margin-bottom:10px;color:var(--tx)">${currentItem.q}</div>
      <div class="qopts" id="lsOpts">
        ${currentItem.options.map((o, i) => '<button class="qopt" onclick="Listening.answer(' + idx + ',' + i + ')">' + o + '</button>').join('')}
      </div>
      <div id="lsScript" style="display:none;margin-top:12px;padding:12px;background:var(--bg3);border-radius:8px;border:1px solid var(--bd)">
        <div style="font-size:11px;color:var(--tx2);margin-bottom:4px;font-weight:600">${t('ls_script')}</div>
        <div style="font-size:14px;line-height:1.8;color:var(--tx)">${currentItem.script.replace(/\n/g, '<br>')}</div>
      </div>
      <div id="lsNav" style="margin-top:12px"></div>`;

    // Auto-play on render
    setTimeout(() => { play(); }, 300);
  }

  function play() {
    if (replaysLeft <= 0 && !practiceMode) return;
    const rate = speedOverride || currentItem.speed;
    speakText(currentItem.script.replace(/\n/g, '。'), rate);
    if (!practiceMode) {
      replaysLeft--;
      const info = document.getElementById('lsReplayInfo');
      if (info) info.textContent = t('ls_plays_left', { n: replaysLeft });
    }
    const btn = document.getElementById('lsPlayBtn');
    if (btn) {
      if (replaysLeft <= 0 && !practiceMode) {
        btn.style.opacity = '0.3';
        btn.style.cursor = 'not-allowed';
      }
    }
  }

  function setSpeed(s) {
    speedOverride = s;
    // Re-render speed buttons only
    const btns = document.querySelectorAll('.ls-speed-btn');
    if (!btns.length) return;
    const rateDisplay = speedOverride || currentItem.speed;
    const speeds = [0.7, null, 1.2];
    btns.forEach((btn, i) => {
      const spd = speeds[i];
      const active = spd === speedOverride;
      btn.style.background = active ? 'var(--ac2)' : 'var(--bg2)';
      btn.style.color = active ? '#fff' : 'var(--tx2)';
    });
  }

  function answer(qIdx, optIdx) {
    const item = queue[qIdx];
    const correct = optIdx === item.correct;
    if (correct) score++;
    answered.push({ q: item.q, correct, type: item.type });
    markDone(item.id);  // 答過就標記，下輪不再抽到
    if (!correct && typeof Stats !== 'undefined' && Stats.addWrongQuestion) {
      Stats.addWrongQuestion({ mode:'listening', id:item.id, level:item.level, text:item.script, q:item.q, options:item.options, correctIdx:item.correct, userIdx:optIdx });
    }

    const opts = document.querySelectorAll('#lsOpts .qopt');
    opts.forEach((b, i) => {
      b.disabled = true;
      if (i === item.correct) b.classList.add('qcorrect');
      if (i === optIdx && !correct) b.classList.add('qwrong');
    });

    // Show script
    const scriptEl = document.getElementById('lsScript');
    if (scriptEl) scriptEl.style.display = 'block';

    // Show nav
    const navDiv = document.getElementById('lsNav');
    if (qIdx < queue.length - 1) {
      navDiv.innerHTML = `<button class="qstart" onclick="Listening.renderItem(${qIdx + 1})">${t('rd_next')}</button>`;
    } else {
      navDiv.innerHTML = `<button class="qstart" onclick="Listening.showResults()">${t('rd_show_result')}</button>`;
    }

    // 答完該題就停掉還在播的音檔
    stopAudio();
  }

  function showResults() {
    const pct = total > 0 ? Math.round(score / total * 100) : 0;

    // Save scores
    const scores = getScores();
    if (!scores[selectedLevel]) scores[selectedLevel] = { correct: 0, total: 0 };
    scores[selectedLevel].correct += score;
    scores[selectedLevel].total += total;
    saveScores(scores);

    const cls = pct >= 80 ? 'good' : pct >= 50 ? 'ok' : 'bad';
    const box = document.getElementById('quizBox');
    box.innerHTML = `
      <h3>${t('ls_result')}</h3>
      <div class="qscore ${cls}">${score} / ${total} (${pct}%)</div>
      <div style="font-size:13px;color:var(--tx2);margin-bottom:8px">${selectedLevel.toUpperCase()} | ${practiceMode ? t('ls_mode_practice') : t('ls_mode_test')}</div>
      <div class="qresults">${answered.map(a =>
        '<div class="qr ' + (a.correct ? 'ok' : 'ng') + '"><span class="qrc">' + (a.correct ? '✓' : '✗') + '</span><span>' + a.q + '</span><span style="font-size:11px;color:var(--tx3);margin-left:auto">' + a.type + '</span></div>'
      ).join('')}</div>
      <div class="qactions">
        <button class="qstart" onclick="Listening.begin()">下一組</button>
        <button class="qstart" style="background:var(--bg3);color:var(--tx)" onclick="Listening.retrySame()">再聽同一組</button>
        <button class="qclose" onclick="Listening.close()">${t('ls_close')}</button>
      </div>`;
  }

  function close() {
    stopAudio();
    document.getElementById('quizBg').classList.remove('show');
  }

  function resetCurrent() {
    const lvEl = document.querySelector('#lsLevel .on');
    const lv = lvEl ? lvEl.dataset.v : selectedLevel;
    const done = doneCountFor(lv);
    if (!done) { alert(`${lv.toUpperCase()} 還沒答過任何題目，沒東西可以重置。`); return; }
    if (!confirm(`確定要重置 ${lv.toUpperCase()} 的已答記錄嗎？\n（${done} 題會重新加入抽題池）`)) return;
    resetDone(lv);
    start();  // 重新渲染 start 畫面，更新計數
  }
  return { start, begin, retrySame, play, setSpeed, answer, renderItem, showResults, close, resetCurrent, setItems };
})();
