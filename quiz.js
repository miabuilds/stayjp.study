// ========== QUIZ MODE ==========
const Quiz = (() => {
  let questions = [];
  let current = 0;
  let score = 0;
  let results = [];
  let quizType = 'word2meaning';
  let quizLevel = 'n5';
  let quizRange = 'all';  // 'all' 全部 | 'today' 今日學習
  let showKanji = false; // word2meaning 題型：預設隱藏漢字（較難、測真實能力）

  function start() {
    const box = document.getElementById('quizBox');
    box.innerHTML = `
      <h3 style="margin-bottom:8px">${t('quiz_title')}</h3>
      <div class="qf"><label>${t('quiz_level')}</label><div class="qo" id="qLevel">
        <button class="on" data-v="n5">N5</button><button data-v="n4">N4</button>
        <button data-v="n3">N3</button><button data-v="n2">N2</button><button data-v="n1">N1</button>
      </div></div>
      <div class="qf"><label>${t('quiz_type')}</label><div class="qo" id="qType">
        <button class="on" data-v="word2meaning">${t('type_ja_zh')}</button>
        <button data-v="meaning2word">${t('type_zh_ja')}</button>
        <button data-v="reading">${t('type_reading')}</button>
        <button data-v="typing">${t('type_typing')}</button>
      </div></div>
      <div class="qf"><label>範圍</label><div class="qo" id="qRange">
        <button class="on" data-v="all">全部</button>
        <button data-v="today">📚 今日學習</button>
      </div></div>
      <div class="qf"><label>${t('quiz_count')}</label><div class="qo" id="qCount">
        <button data-v="10">10</button><button class="on" data-v="20">20</button><button data-v="50">50</button>
      </div></div>
      <button class="qstart" onclick="Quiz.begin()">${t('quiz_start')}</button>
      <button class="qclose" onclick="Quiz.close()">${t('quiz_cancel')}</button>`;
    box.querySelectorAll('.qo').forEach(g => {
      g.querySelectorAll('button').forEach(b => {
        b.onclick = () => { g.querySelectorAll('button').forEach(x => x.classList.remove('on')); b.classList.add('on'); };
      });
    });
    document.getElementById('quizBg').classList.add('show');
  }

  function begin() {
    const lvEl = document.querySelector('#qLevel .on');
    const tyEl = document.querySelector('#qType .on');
    const rgEl = document.querySelector('#qRange .on');
    const ctEl = document.querySelector('#qCount .on');
    if (lvEl) quizLevel = lvEl.dataset.v;
    if (tyEl) quizType = tyEl.dataset.v;
    if (rgEl) quizRange = rgEl.dataset.v;
    const count = ctEl ? parseInt(ctEl.dataset.v) : (questions.length || 20);
    const data = getVocabData(quizLevel);
    if (!data || !data.length) { alert(t('quiz_no_data')); return; }

    // 「今日學習」範圍 = daily-bar 顯示的當前批次（offset ~ offset+DAILY_NEW）
    let source = data;
    if (quizRange === 'today') {
      if (typeof getDailyProgress !== 'function' || typeof DAILY_NEW === 'undefined') {
        alert('找不到今日學習資料，請改用「全部」'); return;
      }
      const prog = getDailyProgress(quizLevel);
      source = data.slice(prog.totalOffset, prog.totalOffset + DAILY_NEW);
      if (!source.length) {
        alert('今日還沒學任何單字，請先到單字模式開始學習，或選「全部」範圍。');
        return;
      }
    }
    score = 0; current = 0; results = [];
    // generate 用 source 當題目來源，但錯誤選項仍從 data（全 pool）抽 — 維持挑戰性
    questions = generate(source, data, Math.min(count, source.length));
    renderQ();
  }

  // ===== 讀音題「語音易混淆」干擾項生成（促音/長音/濁音 最小對立）=====
  const DAKU = {'か':'が','が':'か','き':'ぎ','ぎ':'き','く':'ぐ','ぐ':'く','け':'げ','げ':'け','こ':'ご','ご':'こ','さ':'ざ','ざ':'さ','し':'じ','じ':'し','す':'ず','ず':'す','せ':'ぜ','ぜ':'せ','そ':'ぞ','ぞ':'そ','た':'だ','だ':'た','ち':'ぢ','ぢ':'ち','つ':'づ','づ':'つ','て':'で','で':'て','と':'ど','ど':'と','は':'ば','ば':'ぱ','ぱ':'は','ひ':'び','び':'ぴ','ぴ':'ひ','ふ':'ぶ','ぶ':'ぷ','ぷ':'ふ','へ':'べ','べ':'ぺ','ぺ':'へ','ほ':'ぼ','ぼ':'ぽ','ぽ':'ほ'};
  const SOKU_BEFORE = 'かきくけこさしすせそたちつてとぱぴぷぺぽ';
  const OU_ROW = 'おこそとのほもよろごぞどぼぽうくすつぬふむゆるぐずづぶぷ';
  function lengthenShorten(s, set) {
    if (/[うい]$/.test(s) && s.length > 2) set.add(s.slice(0, -1));      // 去長音
    if (OU_ROW.includes(s[s.length - 1])) set.add(s + 'う');             // 加長音（限 o/u 段）
  }
  function genPhoneticConfusables(r) {
    const base = new Set(); const chars = [...r];
    chars.forEach((c, i) => { if (DAKU[c]) { const v = [...chars]; v[i] = DAKU[c]; base.add(v.join('')); } }); // 濁/半濁
    lengthenShorten(r, base);                                            // 長音 增減
    if (r.includes('っ')) base.add(r.replace('っ', ''));                  // 去促音
    else for (let i = 1; i < chars.length; i++) {                        // 加促音（避免接 ん/っ 後）
      if (SOKU_BEFORE.includes(chars[i]) && chars[i-1] !== 'ん' && chars[i-1] !== 'っ') {
        base.add(chars.slice(0, i).join('') + 'っ' + chars.slice(i).join('')); break;
      }
    }
    [...base].forEach(v => lengthenShorten(v, base));                    // 組合：濁音變體再做長音 → 補滿網格
    base.delete(r);
    return [...base].filter(s => s.length >= 2 && !/っっ|っ$|^っ|うう/.test(s));
  }

  function generate(source, distractorPool, count) {
    // 兼容舊呼叫：如果只傳 1~2 個參數，補成同個 pool
    if (count === undefined) { count = distractorPool; distractorPool = source; }
    // 選讀音題型：排除純假名詞（w === r），否則題目和正解同形沒意義
    const filtered = quizType === 'reading' ? source.filter(d => d.w !== d.r) : source;
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, Math.min(count, shuffled.length));
    return picked.map(word => {
      let distractors;
      if (quizType === 'reading') {
        // 干擾項 = 語音易混淆最小對立；不足 3 個再用題庫真詞補
        distractors = genPhoneticConfusables(word.r).sort(() => Math.random() - 0.5)
          .slice(0, 3).map(s => ({ w: '', r: s, m: '' }));
        if (distractors.length < 3) {
          const seen = new Set([word.r, ...distractors.map(o => o.r)]);
          const extra = distractorPool.filter(d => !seen.has(d.r))
            .sort(() => Math.random() - 0.5).slice(0, 3 - distractors.length);
          distractors = distractors.concat(extra);
        }
      } else {
        distractors = distractorPool.filter(d => {
          if (quizType === 'word2meaning') return d.m !== word.m;
          return d.w !== word.w; // meaning2word
        }).sort(() => Math.random() - 0.5).slice(0, 3);
      }
      const options = [word, ...distractors].sort(() => Math.random() - 0.5);
      return { word, options, correctIdx: options.indexOf(word) };
    });
  }

  function disp(item) {
    if (quizType === 'word2meaning') return typeof cvt==='function'?cvt(item.m):item.m;
    if (quizType === 'meaning2word') return item.w + (item.w !== item.r ? '（' + item.r + '）' : '');
    return item.r;
  }

  // 濁音/半濁音 → 清音基底（用於「差在哪」判斷）
  const DAKU_BASE = {'が':'か','ぎ':'き','ぐ':'く','げ':'け','ご':'こ','ざ':'さ','じ':'し','ず':'す','ぜ':'せ','ぞ':'そ','だ':'た','ぢ':'ち','づ':'つ','で':'て','ど':'と','ば':'は','び':'ひ','ぶ':'ふ','べ':'へ','ぼ':'ほ','ぱ':'は','ぴ':'ひ','ぷ':'ふ','ぺ':'へ','ぽ':'ほ'};
  function typingDiffHint(a, b) {
    const stripDaku = s => [...s].map(c => DAKU_BASE[c] || c).join('');
    if (stripDaku(a) === stripDaku(b)) return t('ty_diff_daku');               // 只差濁/半濁
    if (a.replace(/っ/g, '') === b.replace(/っ/g, '')) return t('ty_diff_soku'); // 只差促音
    if (a.replace(/[ーう]/g, '') === b.replace(/[ーう]/g, '')) return t('ty_diff_long'); // 只差長音
    return t('ty_diff_other');
  }
  function renderTyping() {
    const q = questions[current];
    const main = typeof cvt === 'function' ? cvt(q.word.m) : q.word.m;
    const box = document.getElementById('quizBox');
    box.innerHTML = `
      <div class="qhd"><span>${current+1} / ${questions.length}</span><span>${t('quiz_score', { n: score })}</span><button class="qclose" style="width:auto;margin:0;padding:2px 10px" onclick="Quiz.close()">✕</button></div>
      <div class="qprompt"><div class="qmain">${main}</div><div class="qsub">${t('ty_sub')}</div></div>
      <div class="qf"><input id="tyInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${t('ty_placeholder')}" style="width:100%;box-sizing:border-box;padding:12px 14px;font-size:20px;text-align:center;border:1px solid var(--bd);border-radius:10px;background:var(--bg2);color:var(--tx)"></div>
      <div id="tyFeedback" style="min-height:24px;text-align:center;font-size:14px;margin:8px 0"></div>
      <button class="qstart" onclick="Quiz.submitTyping()">${t('ty_submit')}</button>`;
    const inp = document.getElementById('tyInput');
    if (inp) { inp.focus(); inp.onkeydown = e => { if (e.key === 'Enter' && !e.isComposing) Quiz.submitTyping(); }; }
  }
  function submitTyping() {
    const q = questions[current];
    const inp = document.getElementById('tyInput');
    if (!inp || inp.disabled) return;
    const typed = inp.value.trim().replace(/\s+/g, '');
    if (!typed) return;
    const ok = typed === q.word.r || typed === q.word.w;
    if (ok) score++;
    results.push({ word: q.word, correct: ok, typed, typing: true });
    if (typeof SRS !== 'undefined' && SRS.record) SRS.record(quizLevel, q.word.w, ok);
    if (!ok && typeof Stats !== 'undefined' && Stats.addToNotebook) Stats.addToNotebook(q.word.w, q.word.r, q.word.m, quizLevel);
    inp.disabled = true;
    const fb = document.getElementById('tyFeedback');
    if (ok) {
      inp.style.borderColor = 'var(--ac)';
      if (fb) fb.innerHTML = `<span style="color:var(--ac)">✓ ${q.word.r}</span>`;
    } else {
      inp.style.borderColor = '#EF4444';
      if (fb) fb.innerHTML = `<span style="color:#EF4444">✗ ${t('ty_correct_is')}：<b>${q.word.r}</b></span>　<span style="color:var(--tx2)">${typingDiffHint(typed, q.word.r)}</span>`;
    }
    setTimeout(() => { current++; current >= questions.length ? showResults() : renderQ(); }, ok ? 700 : 1700);
  }

  function renderQ() {
    if (quizType === 'typing') { renderTyping(); return; }
    const q = questions[current];
    const box = document.getElementById('quizBox');
    let main, sub;
    // 看日選中：可切換顯示/隱藏漢字（隱藏較難、避免華人用漢字字形直接猜中譯）
    if (quizType === 'word2meaning') {
      if (showKanji) { main = q.word.w; sub = q.word.w !== q.word.r ? q.word.r : ''; }
      else { main = q.word.r; sub = ''; }
    }
    else if (quizType === 'meaning2word') { main = typeof cvt==='function'?cvt(q.word.m):q.word.m; sub = ''; }
    else { main = q.word.w; sub = t('quiz_reading_sub'); }
    const kanjiToggle = quizType === 'word2meaning' ?
      `<button onclick="Quiz.toggleKanji()" style="margin-top:8px;font-size:11px;padding:4px 10px;border:1px solid var(--bd);border-radius:6px;background:var(--bg2);color:var(--tx2);cursor:pointer">${showKanji?'🙈 隱藏漢字':'👁 顯示漢字'}</button>` : '';
    box.innerHTML = `
      <div class="qhd"><span>${current+1} / ${questions.length}</span><span>${t('quiz_score', { n: score })}</span><button class="qclose" style="width:auto;margin:0;padding:2px 10px" onclick="Quiz.close()">✕</button></div>
      <div class="qprompt"><div class="qmain">${main}</div>${sub?'<div class="qsub">'+sub+'</div>':''}<div style="margin-top:6px"><svg class="spk" style="width:22px;height:22px;opacity:.5" onclick="speak('${(q.word.r || q.word.w).replace(/'/g,"\\'")}')" viewBox="0 0 24 24"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14"/></svg></div>${kanjiToggle}</div>
      <div class="qopts">${q.options.map((o,i) => '<button class="qopt" onclick="Quiz.answer('+i+')">'+disp(o)+'</button>').join('')}</div>`;
  }

  function answer(idx) {
    const q = questions[current];
    const correct = idx === q.correctIdx;
    if (correct) score++;
    results.push({ word: q.word, correct, chosenIdx: idx, options: q.options, correctIdx: q.correctIdx });
    if (typeof SRS !== 'undefined' && SRS.record) SRS.record(quizLevel, q.word.w, correct);
    if (!correct && typeof Stats !== 'undefined' && Stats.addToNotebook) Stats.addToNotebook(q.word.w, q.word.r, q.word.m, quizLevel);
    const opts = document.querySelectorAll('.qopt');
    opts.forEach((b, i) => { b.disabled = true; if (i === q.correctIdx) b.classList.add('qcorrect'); if (i === idx && !correct) b.classList.add('qwrong'); });
    setTimeout(() => { current++; current >= questions.length ? showResults() : renderQ(); }, correct ? 500 : 1000);
  }

  function showResults() {
    const pct = Math.round(score / questions.length * 100);
    const h = JSON.parse(localStorage.getItem('quiz_history') || '[]');
    h.push({ date: new Date().toISOString(), level: quizLevel, type: quizType, score, total: questions.length });
    if (h.length > 200) h.splice(0, h.length - 200);
    localStorage.setItem('quiz_history', JSON.stringify(h));
    if (typeof Calendar !== 'undefined') Calendar.logActivity('quiz');
    if (typeof saveQuizCloud === 'function') saveQuizCloud();
    const box = document.getElementById('quizBox');
    box.innerHTML = `
      <h3>${t('quiz_result')}</h3>
      <div class="qscore ${pct>=80?'good':pct>=60?'ok':'bad'}">${score} / ${questions.length}（${pct}%）</div>
      <div class="qresults">${results.map(r => {
        // 一律顯示完整三要素：漢字（讀音）— 中譯，讓使用者看到全貌
        const m = typeof cvt==='function' ? cvt(r.word.m) : r.word.m;
        const wFull = r.word.w + (r.word.w !== r.word.r ? '（'+r.word.r+'）' : '');
        const summary = wFull + ' — ' + m;
        if (r.correct) return '<div class="qr ok"><span class="qrc">✓</span> '+summary+'</div>';
        // 打字題錯：顯示你打的 + 正解
        if (r.typing) {
          return `<div class="qr ng"><span class="qrc">✗</span> ${summary}　${t('ty_you_typed')}：${r.typed || '—'} → ${t('ty_correct_is')}：${r.word.r}</div>`;
        }
        // 錯題：依題型顯示正確答案（讀音題→讀音、中選日→漢字、看日選中→中譯）
        const correctAnswer = disp(r.word);
        return `<div class="qr ng"><span class="qrc">✗</span> ${summary}　${t('quiz_you_chose', { chose: disp(r.options[r.chosenIdx]), correct: correctAnswer })}</div>`;
      }).join('')}</div>
      <div class="qactions"><button class="qstart" onclick="Quiz.begin()">下一輪</button><button class="qstart" style="background:var(--bg3);color:var(--tx)" onclick="Quiz.retrySame()">再測同一批</button><button class="qclose" onclick="Quiz.close()">${t('quiz_back')}</button></div>`;
  }

  function close() { document.getElementById('quizBg').classList.remove('show'); }
  function toggleKanji() { showKanji = !showKanji; renderQ(); }
  // 再測同一批題目（不重新抽題）
  function retrySame() {
    if (!questions || !questions.length) return begin();
    score = 0; current = 0; results = [];
    renderQ();
  }

  return { start, begin, answer, close, toggleKanji, retrySame, submitTyping };
})();
