// path.js — 闖關路徑(2026-09-20,Mia:像多鄰國一關一關,讓大家知道每天要學啥)。
// 每個等級的關卡由既有內容自動生成,不另外編內容:
//   一般關 = 該級單字表連續 10 個字(走 SRS 引擎,真的會排進複習)+ 1 個文法點(卡片+例句發音)+ 5 題 JLPT 精編題
//   每 5 關接 1 個「小考」= 10 題 JLPT 精編題
// 進度存 localStorage path_progress(已加進 SYNC_KEYS):{ level, n5:{ done:{k:stars}, days:{date:n} }, ... }
// 對外:Path.hubCardHtml() 面板卡、Path.openMap() 全地圖、Path.startUnit(k)、Path.setLevel(lv)、Path.sig()、window.ensureJlptQ()
(function (root) {
  const KEY = 'path_progress';
  const LEVELS = ['n5', 'n4', 'n3', 'n2', 'n1'];
  const WORDS = 10, LESSONS_PER_BOSS = 5, QUIZ_N = 5, BOSS_N = 10;
  const QUIZ_TYPES = ['kanji', 'context', 'grammar'];
  const L = (zh, en) => { try { return (typeof enOr === 'function') ? enOr((typeof cvt === 'function' ? cvt(zh) : zh), en) : zh; } catch (e) { return zh; } };
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const strip = s => String(s || '').replace(/<[^>]+>/g, '');
  function today() { return new Date().toISOString().split('T')[0]; }
  function box() { return document.getElementById('quizBox'); }
  function bg() { return document.getElementById('quizBg'); }
  function show() { const b = bg(); if (b) b.classList.add('show'); }
  function hide() { const b = bg(); if (b) b.classList.remove('show'); try { if (typeof doRender === 'function') { if (root.hubInvalidate) root.hubInvalidate(); doRender(); } } catch (e) {} }
  function hydrate() { try { if (root.Icons && Icons.hydrate) Icons.hydrate(); } catch (e) {} }
  function logAct(t) { try { if (root.StayDaily) StayDaily.log(t); else if (typeof Calendar !== 'undefined') Calendar.logActivity(t); } catch (e) {} }

  // ── 進度 ──
  function prog() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(p) { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {} try { if (typeof saveAllCloud === 'function') saveAllCloud(); } catch (e) {} }
  function lvProg(lv) { const p = prog(); const x = p[lv] || {}; return { done: x.done || {}, days: x.days || {} }; }
  function level() {
    const p = prog(); if (LEVELS.includes(p.level)) return p.level;
    try { const g = localStorage.getItem('goal_level'); if (LEVELS.includes(g)) return g; } catch (e) {}
    return (typeof currentLevel !== 'undefined' && LEVELS.includes(currentLevel)) ? currentLevel : 'n5';
  }
  function setLevel(lv) { if (!LEVELS.includes(lv)) return; const p = prog(); p.level = lv; save(p); try { if (root.hubInvalidate) root.hubInvalidate(); if (typeof doRender === 'function') doRender(); } catch (e) {} }
  function markDone(lv, k, stars) {
    const p = prog(); p[lv] = p[lv] || {}; p[lv].done = p[lv].done || {}; p[lv].days = p[lv].days || {};
    p[lv].done[k] = Math.max(p[lv].done[k] || 0, stars);
    p[lv].days[today()] = (p[lv].days[today()] || 0) + 1;
    save(p);
  }
  function todayCount(lv) { return lvProg(lv).days[today()] || 0; }
  // 自動定位(Mia:已經學一半的人怎麼辦):第一次進某級時,看 srs_data 裡這級已學過的字,
  // 連續「這關 10 個字裡 ≥ 半數學過」的關(含夾在中間的小考)直接標成已學過(done=0、skip=1),從第一個不熟的關開始。
  // 只做一次(placed 旗標);使用者可按「從第 1 關開始」清掉。
  function autoPlace(lv) {
    const p = prog(); if (p[lv] && p[lv].placed) return;
    let srs = {}; try { srs = JSON.parse(localStorage.getItem('srs_data')) || {}; } catch (e) {}
    const us = units(lv); const done = {}, skip = {}; let at = 0;
    for (let k = 0; k < us.length; k++) {
      const u = us[k];
      if (u.boss) { if (at === k) { done[k] = 0; skip[k] = 1; at = k + 1; } continue; }   // 前面的課都跳過,小考也跟著跳
      const known = u.words.filter(w => srs[lv + ':' + w.w]).length;
      if (u.words.length && known >= Math.ceil(u.words.length / 2)) { done[k] = 0; skip[k] = 1; at = k + 1; } else break;
    }
    p[lv] = Object.assign({ done: {}, days: {} }, p[lv] || {});
    Object.keys(done).forEach(k => { if (p[lv].done[k] == null) p[lv].done[k] = 0; });
    p[lv].skip = Object.assign({}, p[lv].skip || {}, skip);
    p[lv].placed = { at, n: Object.keys(skip).length, dismissed: false };
    save(p);
  }
  function resetLevel(lv) { const p = prog(); p[lv] = { done: {}, days: {}, skip: {}, placed: { at: 0, n: 0, dismissed: true } }; save(p); try { if (root.hubInvalidate) root.hubInvalidate(); if (typeof doRender === 'function') doRender(); } catch (e) {} }
  function dismissPlaced(lv) { const p = prog(); if (p[lv] && p[lv].placed) { p[lv].placed.dismissed = true; save(p); } try { if (root.hubInvalidate) root.hubInvalidate(); if (typeof doRender === 'function') doRender(); } catch (e) {} }
  function placedInfo(lv) { const p = prog()[lv]; return (p && p.placed && p.placed.n > 0 && !p.placed.dismissed) ? p.placed : null; }
  function isSkipped(lv, k) { const p = prog()[lv]; return !!(p && p.skip && p.skip[k]); }

  // ── 關卡生成(純由等級內容推導,不存內容)──
  function units(lv) {
    const V = (typeof getVocabData === 'function' ? getVocabData(lv) : []) || [];
    const G = (typeof getGrammarData === 'function' ? (getGrammarData(lv).data || []) : []) || [];
    const out = []; const chunks = Math.ceil(V.length / WORDS);
    for (let i = 0; i < chunks; i++) {
      const g = G.length ? G[i % G.length] : null;
      out.push({ k: out.length, boss: false, i, words: V.slice(i * WORDS, (i + 1) * WORDS), grammar: g,
        title: g ? strip(g.t) : L('單字 ' + (i * WORDS + 1) + '–' + Math.min((i + 1) * WORDS, V.length), 'Words ' + (i * WORDS + 1) + '–' + Math.min((i + 1) * WORDS, V.length)) });
      if ((i + 1) % LESSONS_PER_BOSS === 0 || i === chunks - 1) out.push({ k: out.length, boss: true, i, title: L('小考', 'Checkpoint'), words: [], grammar: null });
    }
    return out;
  }
  function currentIndex(lv) { const d = lvProg(lv).done; const us = units(lv); for (let k = 0; k < us.length; k++) if (d[k] == null) return k; return us.length; }
  function sig() { try { const lv = level(); return lv + '/' + Object.keys(lvProg(lv).done).length + '/' + todayCount(lv) + '/' + units(lv).length + '/' + ((root.StudyPlan && StudyPlan.rhythm) ? StudyPlan.rhythm() : ''); } catch (e) { return ''; } }

  // ── JLPT 精編題(app.html 不預載 447KB,要用才抓)──
  let _qP = null;
  function ensureJlptQ() {
    if (root.JLPT_Q) return Promise.resolve(true);
    if (_qP) return _qP;
    _qP = new Promise(res => { const s = document.createElement('script'); s.src = 'jlpt-questions.js'; s.onload = () => res(true); s.onerror = () => { _qP = null; res(false); }; document.head.appendChild(s); });
    return _qP;
  }
  root.ensureJlptQ = ensureJlptQ;
  // 固定種子洗牌:同一關每次抽到同一組題(重考才有意義)
  function seededPick(arr, n, seed) {
    const a = arr.slice(); let s = (seed * 2654435761) % 4294967296 || 1;
    for (let i = a.length - 1; i > 0; i--) { s = (s * 1103515245 + 12345) % 2147483648; const j = s % (i + 1); [a[i], a[j]] = [a[j], a[i]]; }
    return a.slice(0, n);
  }
  function questionsFor(lv, k, n) {
    const pool = (root.JLPT_Q || []).filter(q => q.lv === lv && QUIZ_TYPES.includes(q.t));
    return seededPick(pool, n, k + 1);
  }

  // 連續「每日通關」天數:days 紀錄裡連著幾天都達到當天建議關數(以今天/昨天起算)
  function clearStreak(lv) {
    const days = lvProg(lv).days, need = (root.StudyPlan && StudyPlan.modeInfo) ? StudyPlan.modeInfo().units : 2;
    let n = 0; const d = new Date();
    if (!((days[d.toISOString().split('T')[0]] || 0) >= need)) d.setDate(d.getDate() - 1);   // 今天還沒過完不算斷
    for (let i = 0; i < 400; i++) { const k = d.toISOString().split('T')[0]; if ((days[k] || 0) >= need) { n++; d.setDate(d.getDate() - 1); } else break; }
    return n;
  }
  // 今日任務:從目前關開始、依模式建議數列出「今天要過的關」;做完的打勾
  function questCardHtml(lv, us) {
    const cur = currentIndex(lv), doneN = Object.keys(lvProg(lv).done).length, total = us.length;
    const suggest = (root.StudyPlan && StudyPlan.modeInfo) ? StudyPlan.modeInfo().units : 2;
    const tc = todayCount(lv), left = Math.max(0, suggest - tc);
    const streak = clearStreak(lv);
    // 今天的清單 = 今天已過的(從 cur 往回 tc 關)+ 接下來還要過的(left 關)
    const rows = [];
    for (let k = Math.max(0, cur - tc); k < Math.min(total, cur + left); k++) {
      const u = us[k], done = k < cur;
      rows.push('<button type="button" class="pt-qrow' + (done ? ' done' : k === cur ? ' cur' : '') + '" onclick="Path.startUnit(' + k + ')">'
        + '<span class="pt-node' + (u.boss ? ' boss' : '') + '">' + (done ? '<i data-ic=check></i>' : u.boss ? '<i data-ic=target></i>' : (k + 1)) + '</span>'
        + '<span class="pt-tx"><b>' + L('第 ' + (k + 1) + ' 關', 'Level ' + (k + 1)) + ' · ' + (u.boss ? L('小考', 'Checkpoint') : esc(u.title)) + '</b>'
        + '<small>' + (done ? (isSkipped(lv, k) ? L('已學過', 'Already known') : '★'.repeat(lvProg(lv).done[k] || 0)) : u.boss ? L(BOSS_N + ' 題', BOSS_N + ' questions') : L(u.words.length + ' 字 · 1 文法 · ' + QUIZ_N + ' 題', u.words.length + ' words · 1 grammar · ' + QUIZ_N + ' q')) + '</small></span>'
        + (k === cur ? '<span class="pt-go">' + L('開始', 'Start') + '</span>' : '')
        + '</button>');
    }
    const allDone = left === 0;
    return '<div class="pt-card pt-quest' + (allDone ? ' cleared' : '') + '">'
      + '<div class="pt-top"><button type="button" class="pt-lv" onclick="Path.openMap()">' + L('今日關卡', 'Today\'s quests') + ' · ' + lv.toUpperCase() + ' <span class="pt-arrow-sm">›</span></button>'
        + '<span class="pt-today' + (allDone ? ' ok' : '') + '">' + (streak > 0 ? '<i data-ic=fire></i> ' + L('連續通關 ' + streak + ' 天', streak + '-day clear streak') : L('今天 ' + tc + ' / ' + suggest + ' 關', 'Today ' + tc + ' / ' + suggest)) + '</span></div>'
      + (placedInfo(lv) ? '<div class="pt-placed"><span>' + L('你已經學過前 ' + placedInfo(lv).n + ' 關的單字,直接從第 ' + (placedInfo(lv).at + 1) + ' 關開始', 'You already know the words in the first ' + placedInfo(lv).n + ' levels — starting at level ' + (placedInfo(lv).at + 1)) + '</span><span class="pt-placed-btns"><button type="button" class="pt-link" onclick="Path.resetLevel(\'' + lv + '\')">' + L('從第 1 關開始', 'Start from level 1') + '</button><button type="button" class="pt-link" onclick="Path.dismissPlaced(\'' + lv + '\')">' + L('知道了', 'OK') + '</button></span></div>' : '')
      + (allDone
        ? '<div class="pt-clear"><img src="images/mascot/tanuki-p06.png" alt=""><div><b>' + L('今日通關 🎉', 'All clear for today 🎉') + '</b><small>' + L('今天的 ' + suggest + ' 關都過了。想多學就再一關,不想也沒關係。', 'Today\'s ' + suggest + ' levels done. One more if you like — or rest.') + '</small></div></div>'
        : '<div class="pt-quest-sub">' + L('今天要過 ' + suggest + ' 關' + (tc ? ',還剩 ' + left + ' 關' : ''), suggest + ' levels today' + (tc ? ', ' + left + ' left' : '')) + '</div>')
      + '<div class="pt-quests">' + rows.join('') + (allDone && cur < total ? '<button type="button" class="pt-qrow more" onclick="Path.startUnit(' + cur + ')"><span class="pt-node">' + (cur + 1) + '</span><span class="pt-tx"><b>' + L('再多一關', 'One more') + ' · ' + esc(us[cur].boss ? L('小考', 'Checkpoint') : us[cur].title) + '</b><small>' + L('額外,不算在今天的任務裡', 'Extra — not required today') + '</small></span></button>' : '') + '</div>'
      + '<div class="pt-bar"><i style="width:' + Math.round(doneN / total * 100) + '%"></i></div>'
      + '<div class="pt-prog">' + L(lv.toUpperCase() + ' 已完成 ' + doneN + ' / ' + total + ' 關', doneN + ' / ' + total + ' done') + ' · <button type="button" class="pt-link" onclick="StudyPlan.setRhythm(\'free\')">' + L('改成自由節奏', 'Switch to free pace') + '</button></div>'
      + '</div>';
  }

  // ── 面板卡 ──
  function hubCardHtml() {
    ensureCss();
    const lv = level(), us = units(lv);
    if (!us.length) return '';
    autoPlace(lv);
    if (root.StudyPlan && StudyPlan.rhythm && StudyPlan.rhythm() === 'path' && currentIndex(lv) < us.length) return questCardHtml(lv, us);
    const cur = currentIndex(lv), doneN = Object.keys(lvProg(lv).done).length, total = us.length;
    const suggest = (root.StudyPlan && StudyPlan.modeInfo) ? StudyPlan.modeInfo().units : 2;
    const tc = todayCount(lv);
    const pct = Math.round(doneN / total * 100);
    if (cur >= total) {
      const next = LEVELS[LEVELS.indexOf(lv) + 1];
      return '<div class="pt-card pt-all"><div class="pt-top"><b>' + L(lv.toUpperCase() + ' 全部通關 🎉', lv.toUpperCase() + ' complete 🎉') + '</b></div>'
        + '<div class="pt-sub">' + L('恭喜!', 'Congrats!') + (next ? L(' 要不要往 ' + next.toUpperCase() + ' 前進?', ' Move on to ' + next.toUpperCase() + '?') : '') + '</div>'
        + (next ? '<button type="button" class="pt-cta" onclick="Path.setLevel(\'' + next + '\')">' + L('開始 ' + next.toUpperCase(), 'Start ' + next.toUpperCase()) + ' →</button>' : '')
        + '</div>';
    }
    const u = us[cur];
    return '<div class="pt-card">'
      + '<div class="pt-top"><button type="button" class="pt-lv" onclick="Path.openMap()">' + L('闖關', 'Path') + ' · ' + lv.toUpperCase() + '</button>'
        + '<span class="pt-today' + (tc >= suggest ? ' ok' : '') + '">' + L('今天 ' + tc + ' / ' + suggest + ' 關', 'Today ' + tc + ' / ' + suggest) + '</span></div>'
      + '<button type="button" class="pt-main" onclick="Path.openMap()">'
        + '<span class="pt-node' + (u.boss ? ' boss' : '') + '">' + (u.boss ? '<i data-ic=target></i>' : (cur + 1)) + '</span>'
        + '<span class="pt-tx"><b>' + L('第 ' + (cur + 1) + ' 關', 'Level ' + (cur + 1)) + (u.boss ? '' : ' · ' + esc(u.title)) + '</b>'
        + '<small>' + (u.boss ? L(BOSS_N + ' 題小考,複習前面 5 關', BOSS_N + '-question checkpoint') : L(u.words.length + ' 個單字 · 1 個文法 · ' + QUIZ_N + ' 題', u.words.length + ' words · 1 grammar · ' + QUIZ_N + ' questions')) + '</small></span>'
        + '<span class="pt-arrow">›</span>'
      + '</button>'
      + '<div class="pt-bar"><i style="width:' + pct + '%"></i></div>'
      + '<div class="pt-prog">' + L('已完成 ' + doneN + ' / ' + total + ' 關', doneN + ' / ' + total + ' done') + ' · <button type="button" class="pt-link" onclick="StudyPlan.setRhythm(\'path\')">' + L('改成每日關卡任務', 'Switch to daily quests') + '</button></div>'
      + '<button type="button" class="pt-cta" onclick="Path.startUnit(' + cur + ')">' + L('開始第 ' + (cur + 1) + ' 關', 'Start level ' + (cur + 1)) + ' →</button>'
      + '</div>';
  }

  // ── 全地圖 ──
  function openMap() {
    ensureCss();
    const lv = level(); autoPlace(lv);
    const us = units(lv), d = lvProg(lv).done, cur = currentIndex(lv);
    const chips = LEVELS.map(l => '<button type="button" class="pt-chip' + (l === lv ? ' on' : '') + '" onclick="Path.setLevel(\'' + l + '\');Path.openMap()">' + l.toUpperCase() + '</button>').join('');
    let h = '<div class="pt-map"><div class="qhd"><h3 style="margin:0">' + L('闖關地圖', 'Path') + '</h3><button class="qclose" style="width:auto;margin:0;padding:2px 10px" onclick="Path.close()"><i data-ic=x></i></button></div>'
      + '<div class="pt-chips">' + chips + '</div>'
      + '<div class="pt-map-sub">' + L('每關:10 個單字 → 1 個文法 → 5 題;每 5 關一次小考。做完的關可以重做。', 'Each level: 10 words → 1 grammar point → 5 questions; a checkpoint every 5 levels.') + '</div>';
    let chapter = 0;
    us.forEach((u, k) => {
      if (k % (LESSONS_PER_BOSS + 1) === 0) { chapter++; h += '<div class="pt-ch">' + L('第 ' + chapter + ' 章', 'Chapter ' + chapter) + '</div>'; }
      const st = (d[k] != null) ? 'done' : (k === cur ? 'cur' : 'lock');
      const stars = isSkipped(lv, k) ? L('已學過', 'Already known') : d[k] ? '★'.repeat(d[k]) + '<span class="dim">' + '★'.repeat(3 - d[k]) + '</span>' : '';
      h += '<button type="button" class="pt-row ' + st + (u.boss ? ' boss' : '') + '" ' + (st === 'lock' ? 'disabled' : 'onclick="Path.startUnit(' + k + ')"') + '>'
        + '<span class="pt-node' + (u.boss ? ' boss' : '') + '">' + (st === 'done' ? '<i data-ic=check></i>' : st === 'lock' ? '<i data-ic=lock></i>' : (u.boss ? '<i data-ic=target></i>' : (k + 1))) + '</span>'
        + '<span class="pt-tx"><b>' + L('第 ' + (k + 1) + ' 關', 'Level ' + (k + 1)) + (u.boss ? ' · ' + L('小考', 'Checkpoint') : ' · ' + esc(u.title)) + '</b>'
        + '<small>' + (stars || (u.boss ? L(BOSS_N + ' 題', BOSS_N + ' questions') : L(u.words.slice(0, 4).map(w => w.w).join('、') + '…', u.words.slice(0, 4).map(w => w.w).join(', ') + '…'))) + '</small></span>'
        + (st === 'cur' ? '<span class="pt-go">' + L('開始', 'Start') + '</span>' : '')
        + '</button>';
    });
    h += '</div>';
    box().innerHTML = h; show(); hydrate();
    try { const c = box().querySelector('.pt-row.cur'); if (c) c.scrollIntoView({ block: 'center' }); } catch (e) {}
  }
  function close() { hide(); }

  // ── 單元流程:單字(SRS)→ 文法卡 → 小測 → 結算 ──
  let run = null;
  function startUnit(k) {
    const lv = level(), us = units(lv), u = us[k]; if (!u) return;
    run = { lv, k, u, correct: 0, total: 0, stepsDone: 0 };
    if (u.boss) { ensureJlptQ().then(() => quizStep(BOSS_N)); return; }
    if (!root.SRS || !u.words.length) { grammarStep(); return; }
    // 先把題庫排在背景抓,背完單字時題目已就位
    ensureJlptQ();
    SRS.start(lv, { words: u.words, onDone: () => grammarStep() });
  }
  function grammarStep() {
    if (!run) return; const g = run.u.grammar;
    if (!g) { quizStep(QUIZ_N); return; }
    logAct('grammar');
    const egs = (g.eg || []).slice(0, 2).map(e => {
      const j = strip(e.j);
      return '<div class="pt-eg"><div class="pt-eg-j">' + e.j.replace(/<em>/g, '<b>').replace(/<\/em>/g, '</b>') + ' <button type="button" class="pt-spk" onclick="speak(\'' + esc(j).replace(/'/g, "\\'") + '\')" aria-label="play"><i data-ic=volume></i></button></div><div class="pt-eg-z">' + esc(e.z || '') + '</div></div>';
    }).join('');
    box().innerHTML = '<div class="pt-step">'
      + stepHead(L('文法', 'Grammar'), 2)
      + '<div class="pt-g-t">' + esc(strip(g.t)) + '</div>'
      + (g.p ? '<div class="pt-g-p">' + esc(strip(g.p)) + '</div>' : '')
      + (g.ex ? '<div class="pt-g-ex">' + esc(strip(g.ex)) + '</div>' : '')
      + egs
      + '<button type="button" class="pt-cta" onclick="Path._quiz()">' + L('懂了,做 ' + QUIZ_N + ' 題 →', 'Got it — ' + QUIZ_N + ' questions →') + '</button>'
      + '</div>';
    show(); hydrate();
  }
  function stepHead(label, n) {
    const total = run.u.boss ? 1 : 3;
    return '<div class="qhd"><span>' + L('第 ' + (run.k + 1) + ' 關', 'Level ' + (run.k + 1)) + ' · ' + label + (total > 1 ? ' <span style="color:var(--tx3)">' + n + '/' + total + '</span>' : '') + '</span><button class="qclose" style="width:auto;margin:0;padding:2px 10px" onclick="Path.close()"><i data-ic=x></i></button></div>';
  }
  let qs = [], qi = 0;
  function quizStep(n) {
    if (!run) return;
    qs = root.JLPT_Q ? questionsFor(run.lv, run.k, n) : []; qi = 0;
    if (!qs.length) { finish(); return; }
    renderQ();
  }
  // 選項重排(正解在精編題庫裡常是第 1 個 → 顯示時依「題號+關卡」固定種子打散;q.a 仍指原始索引)
  function shuffledOrder(q, seed) { return seededPick(q.o.map((_, i) => i), q.o.length, seed + 17); }
  function renderQ() {
    const q = qs[qi]; const order = shuffledOrder(q, run.k * 31 + qi);
    const opts = order.map((i, pos) => '<button type="button" class="pt-opt" data-i="' + i + '" onclick="Path._ans(this,' + i + ')"><span class="no">' + (pos + 1) + '</span><span>' + esc(q.o[i]) + '</span></button>').join('');
    box().innerHTML = '<div class="pt-step">'
      + stepHead(L('小測', 'Quiz') + ' ' + (qi + 1) + '/' + qs.length, 3)
      + '<div class="pt-q">' + esc(q.q) + '</div>'
      + '<div class="pt-opts">' + opts + '</div>'
      + '<div class="pt-explain" id="ptExplain"></div>'
      + '</div>';
    show(); hydrate();
  }
  function _ans(el, i) {
    const q = qs[qi]; const ok = i === q.a;
    box().querySelectorAll('.pt-opt').forEach(b => { b.disabled = true; const bi = +b.dataset.i; if (bi === q.a) b.classList.add('ok'); else if (bi === i && !ok) b.classList.add('ng'); });
    run.total++; if (ok) run.correct++;
    logAct('quiz');
    const ex = document.getElementById('ptExplain');
    ex.innerHTML = '<div class="pt-verdict ' + (ok ? 'ok' : 'ng') + '">' + (ok ? L('答對了!', 'Correct!') : L('答錯了', 'Not quite')) + '</div>' + (q.x ? '<div class="pt-x">' + q.x + '</div>' : '')
      + '<button type="button" class="pt-cta" onclick="Path._next()">' + (qi + 1 >= qs.length ? L('看結果 →', 'Results →') : L('下一題 →', 'Next →')) + '</button>';
    ex.style.display = 'block';
  }
  function _next() { qi++; if (qi >= qs.length) finish(); else renderQ(); }
  function finish() {
    if (!run) return;
    const r = run; run = null;
    const ratio = r.total ? r.correct / r.total : 1;
    const stars = ratio >= 0.8 ? 3 : ratio >= 0.6 ? 2 : 1;
    markDone(r.lv, r.k, stars);
    const us = units(r.lv), nextK = r.k + 1, hasNext = nextK < us.length;
    const suggest = (root.StudyPlan && StudyPlan.modeInfo) ? StudyPlan.modeInfo().units : 2, tc = todayCount(r.lv);
    box().innerHTML = '<div class="pt-done">'
      + '<img src="images/mascot/' + (stars === 3 ? 'tanuki-p06.png' : 'tanuki-p03.png') + '" alt="">'
      + '<div class="pt-stars">' + '★'.repeat(stars) + '<span class="dim">' + '★'.repeat(3 - stars) + '</span></div>'
      + '<h3>' + L('第 ' + (r.k + 1) + ' 關完成', 'Level ' + (r.k + 1) + ' complete') + '</h3>'
      + (r.total ? '<div class="pt-done-sub">' + L('小測 ' + r.correct + ' / ' + r.total, 'Quiz ' + r.correct + ' / ' + r.total) + '</div>' : '')
      + '<div class="pt-done-sub">' + (tc >= suggest ? L('今天的 ' + suggest + ' 關達標了,明天見!', 'Today\'s ' + suggest + ' levels done — see you tomorrow!') : L('今天 ' + tc + ' / ' + suggest + ' 關,再一關就更穩', tc + ' / ' + suggest + ' today — one more?')) + '</div>'
      + (hasNext ? '<button type="button" class="pt-cta" onclick="Path.startUnit(' + nextK + ')">' + L('下一關 →', 'Next level →') + '</button>' : '')
      + '<button type="button" class="pt-cta pt-cta-sub" onclick="Path.close()">' + L('回面板', 'Back') + '</button>'
      + '</div>';
    show(); hydrate();
  }

  function ensureCss() {
    if (document.getElementById('ptCss')) return;
    const st = document.createElement('style'); st.id = 'ptCss';
    st.textContent = [
      '.pt-card{background:var(--bg2);border:1px solid var(--bd);border-radius:20px;padding:18px 20px 16px;margin:0 0 14px;box-shadow:var(--sh2)}',
      '.pt-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}',
      '.pt-lv{font:inherit;font-weight:800;font-size:13px;color:var(--tx2);background:none;border:0;padding:0;cursor:pointer}',
      '.pt-today{font-size:11.5px;font-weight:800;color:var(--tx2);background:var(--bg3);border-radius:999px;padding:3px 10px}.pt-today.ok{background:var(--correct-bg,#dcfce7);color:var(--correct-tx,#166534)}',
      '.pt-main{display:flex;align-items:center;gap:12px;width:100%;text-align:left;background:none;border:0;padding:0;font:inherit;color:var(--tx);cursor:pointer}',
      '.pt-node{flex:none;width:44px;height:44px;border-radius:50%;background:var(--ac);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:17px;box-shadow:0 3px 0 rgba(0,0,0,.18)}.pt-node.boss{background:#7C3AED}',
      '.pt-tx{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}.pt-tx b{font-size:15px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pt-tx small{font-size:12px;color:var(--tx2)}',
      '.pt-arrow{color:var(--tx3);font-size:20px}',
      '.pt-bar{height:6px;border-radius:999px;background:var(--prog-empty,#e5e7eb);margin:14px 0 6px;overflow:hidden}.pt-bar i{display:block;height:100%;background:var(--ac);border-radius:999px}',
      '.pt-prog{font-size:12px;color:var(--tx2)}',
      '.pt-cta{display:block;width:100%;margin-top:14px;background:var(--ac);color:#fff;border:0;border-radius:12px;padding:13px 14px;font-size:15px;font-weight:800;cursor:pointer;font-family:inherit}',
      '.pt-cta-sub{background:var(--bg3);color:var(--tx);margin-top:8px}',
      '.pt-sub{font-size:13px;color:var(--tx2)}',
      '.pt-map{max-height:78vh;overflow:auto;padding-bottom:6px}.pt-chips{display:flex;gap:6px;margin:10px 0 8px}.pt-chip{font:inherit;font-weight:800;font-size:12.5px;border:1.5px solid var(--bd);background:var(--bg);color:var(--tx2);border-radius:999px;padding:5px 12px;cursor:pointer}.pt-chip.on{border-color:var(--ac);color:var(--ac);background:var(--soft,rgba(212,101,74,.08))}',
      '.pt-map-sub{font-size:12px;color:var(--tx2);margin-bottom:8px;line-height:1.5}',
      '.pt-ch{font-size:11.5px;font-weight:800;color:#fff;background:var(--ac);display:inline-block;border-radius:999px;padding:4px 12px;margin:16px 0 10px}',
      '.pt-map .pt-row{position:relative;width:88%}.pt-map .pt-row:nth-child(4n+1){margin-left:0}.pt-map .pt-row:nth-child(4n+2){margin-left:6%}.pt-map .pt-row:nth-child(4n+3){margin-left:12%}.pt-map .pt-row:nth-child(4n){margin-left:6%}',
      '.pt-map .pt-row::before{content:"";position:absolute;left:29px;top:-9px;width:2px;height:9px;background:var(--bd)}.pt-map .pt-row.boss{width:100%;margin-left:0;background:linear-gradient(135deg,rgba(124,58,237,.08),transparent)}',
      '.pt-quest-sub{font-size:13px;color:var(--tx2);margin:-4px 0 10px}.pt-quests{display:grid;grid-template-columns:minmax(0,1fr);gap:8px;position:relative}',
      '.pt-qrow{min-width:0;max-width:100%}.pt-tx b{display:block}',
      '.pt-qrow{display:flex;align-items:center;gap:12px;width:100%;text-align:left;font:inherit;color:var(--tx);background:var(--bg);border:1.5px solid var(--bd);border-radius:14px;padding:10px 12px;cursor:pointer;position:relative}',
      '.pt-qrow.cur{border-color:var(--ac);background:var(--soft,rgba(212,101,74,.08))}.pt-qrow.done{opacity:.7}.pt-qrow.done .pt-node{background:var(--correct-bd,#16a34a)}.pt-qrow.more{border-style:dashed}.pt-qrow.more .pt-node{background:var(--bg3);color:var(--tx2);box-shadow:none}',
      '.pt-qrow .pt-node{width:38px;height:38px;font-size:15px}.pt-qrow .pt-tx b{font-size:14px}.pt-qrow .pt-tx small{font-size:11.5px;color:#F5B301}.pt-qrow:not(.done) .pt-tx small{color:var(--tx2)}',
      '.pt-qrow + .pt-qrow::before{content:"";position:absolute;left:29px;top:-9px;width:2px;height:9px;background:var(--bd)}',
      '.pt-clear{display:flex;align-items:center;gap:12px;margin:-2px 0 12px}.pt-clear img{width:64px;height:auto}.pt-clear b{display:block;font-size:16px}.pt-clear small{font-size:12.5px;color:var(--tx2);line-height:1.5}',
      '.pt-placed{display:flex;flex-direction:column;gap:6px;background:var(--bg3);border-radius:12px;padding:10px 12px;margin:-2px 0 10px;font-size:12.5px;color:var(--tx);line-height:1.5}.pt-placed-btns{display:flex;gap:14px}.pt-placed .pt-link{font-size:12.5px;color:var(--ac);text-decoration:none;font-weight:700}',
      '.pt-arrow-sm{color:var(--tx3);font-weight:400}.pt-link{font:inherit;font-size:12px;color:var(--tx3);background:none;border:0;padding:0;cursor:pointer;text-decoration:underline}',
      '.pt-row{display:flex;align-items:center;gap:12px;width:100%;text-align:left;font:inherit;color:var(--tx);background:var(--bg);border:1.5px solid var(--bd);border-radius:14px;padding:10px 12px;margin-bottom:8px;cursor:pointer}',
      '.pt-row.cur{border-color:var(--ac);background:var(--soft,rgba(212,101,74,.08))}.pt-row.lock{opacity:.55;cursor:default}.pt-row.lock .pt-node{background:var(--bg3);color:var(--tx3);box-shadow:none}.pt-row.done .pt-node{background:var(--correct-bd,#16a34a)}',
      '.pt-row .pt-node{width:36px;height:36px;font-size:14px}.pt-row .pt-tx b{font-size:14px}.pt-row .pt-tx small{font-size:11.5px}.pt-row small .dim,.pt-stars .dim{opacity:.25}',
      '.pt-go{font-size:12px;font-weight:800;color:#fff;background:var(--ac);border-radius:999px;padding:4px 10px}',
      '.pt-step{padding-bottom:4px}.pt-g-t{font-size:20px;font-weight:900;margin:14px 0 6px;line-height:1.3}.pt-g-p{font-size:14px;color:var(--ac);font-weight:700;margin-bottom:8px}.pt-g-ex{font-size:13.5px;color:var(--tx2);line-height:1.6;margin-bottom:12px}',
      '.pt-eg{background:var(--bg3);border-radius:12px;padding:10px 12px;margin-bottom:8px}.pt-eg-j{font-size:16px;line-height:1.7}.pt-eg-j b{color:var(--ac)}.pt-eg-z{font-size:13px;color:var(--tx2);margin-top:2px}',
      '.pt-spk{font:inherit;background:none;border:0;color:var(--ac);cursor:pointer;vertical-align:middle;padding:0 4px}',
      '.pt-q{font-size:18px;line-height:1.7;margin:14px 0 12px;font-weight:600}.pt-opts{display:grid;gap:8px}',
      '.pt-opt{font:inherit;text-align:left;font-size:16px;line-height:1.5;background:var(--bg);border:1.5px solid var(--bd);border-radius:14px;padding:13px 14px;cursor:pointer;color:var(--tx);display:flex;gap:10px;align-items:baseline}.pt-opt .no{color:var(--tx3);font-size:13px}',
      '.pt-opt.ok{border-color:var(--correct-bd,#16a34a);background:var(--correct-bg,#dcfce7)}.pt-opt.ng{border-color:var(--wrong-bd,#dc2626);background:var(--wrong-bg,#fef2f2)}.pt-opt[disabled]{cursor:default}',
      '.pt-explain{display:none;margin-top:14px;border-top:1px solid var(--bd);padding-top:12px}.pt-verdict{font-weight:800;margin-bottom:6px}.pt-verdict.ok{color:var(--correct-tx,#166534)}.pt-verdict.ng{color:var(--wrong-tx,#991b1b)}.pt-x{font-size:14px;line-height:1.7;color:var(--tx)}',
      '.pt-done{text-align:center;padding:6px 0}.pt-done img{width:120px;height:auto}.pt-stars{font-size:28px;color:#F5B301;letter-spacing:.1em;margin:6px 0}.pt-done h3{margin:4px 0 6px}.pt-done-sub{font-size:13.5px;color:var(--tx2);line-height:1.6}',
    ].join('');
    document.head.appendChild(st);
  }

  root.Path = { hubCardHtml, openMap, close, startUnit, setLevel, level, units, sig, resetLevel, dismissPlaced, _quiz: () => quizStep(QUIZ_N), _ans, _next };
})(window);
