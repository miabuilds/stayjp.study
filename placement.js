// placement.js — 程度測驗(2026-09-20,Mia:讓大家測自己程度在哪)。不用 AI:JLPT 精編題庫夠、零成本、結果可解釋。
// 自適應:從 N4 起(自認零基礎從 N5),每級 6 題(漢字讀音/文脈/文法混),答對 ≥5 升一級、≤2 降一級、3–4 定案;
// 升了又降(或降了又升)就停在較低那級;最多 4 輪(≤24 題,約 3–5 分鐘)。
// 結果:「目前程度 X、建議目標 X+1」→ 一鍵寫 base_level / goal_level、開對應單字集、闖關切到目標級。
(function (root) {
  const LV = ['n5', 'n4', 'n3', 'n2', 'n1'];
  const PER = 6, TYPES = ['kanji', 'context', 'grammar'], MAX_ROUNDS = 4;
  const L = (zh, en) => { try { return (typeof enOr === 'function') ? enOr((typeof cvt === 'function' ? cvt(zh) : zh), en) : zh; } catch (e) { return zh; } };
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  function box() { return document.getElementById('quizBox'); }
  function show() { const b = document.getElementById('quizBg'); if (b) b.classList.add('show'); }
  function hide() { const b = document.getElementById('quizBg'); if (b) b.classList.remove('show'); try { if (typeof doRender === 'function') { root._hubSig = ''; doRender(); } } catch (e) {} }
  function hydrate() { try { if (root.Icons && Icons.hydrate) Icons.hydrate(); } catch (e) {} }
  let st = null;

  function start(opts) {
    ensureCss();
    box().innerHTML = '<div class="pl"><div class="qhd"><h3 style="margin:0">' + L('程度測驗', 'Placement test') + '</h3><button class="qclose" style="width:auto;margin:0;padding:2px 10px" onclick="Placement.close()"><i data-ic=x></i></button></div>'
      + '<img class="pl-mascot" src="images/mascot/tanuki-p08.png" alt="">'
      + '<div class="pl-intro">' + L('3 分鐘、最多 24 題。題目會依你的答對率自動變難或變簡單,不用擔心太難。', '3 minutes, up to 24 questions. Difficulty adapts to how you do — don\'t worry if it gets hard.') + '</div>'
      + '<button type="button" class="pl-cta" onclick="Placement._go(1)">' + L('我學過一點,從 N4 題開始', 'I know some Japanese — start at N4') + '</button>'
      + '<button type="button" class="pl-cta pl-cta-sub" onclick="Placement._go(0)">' + L('我幾乎零基礎,從 N5 開始', 'Complete beginner — start at N5') + '</button>'
      + '</div>';
    show(); hydrate();
    // 題庫先在背景抓
    if (root.ensureJlptQ) root.ensureJlptQ();
  }
  function _go(lvIdx) {
    st = { lvIdx, round: 0, asked: {}, history: [], dir: 0, cur: [], i: 0, c: 0 };
    box().innerHTML = '<div class="pl"><div class="pl-intro">' + L('題目載入中…', 'Loading…') + '</div></div>';
    (root.ensureJlptQ ? root.ensureJlptQ() : Promise.resolve(!!root.JLPT_Q)).then(ok => {
      if (!ok || !root.JLPT_Q) { box().innerHTML = '<div class="pl"><div class="pl-intro">' + L('題庫載入失敗,請檢查網路後再試。', 'Could not load questions. Check your connection.') + '</div><button type="button" class="pl-cta" onclick="Placement.close()">' + L('關閉', 'Close') + '</button></div>'; return; }
      nextRound();
    });
  }
  function pickRound() {
    const lv = LV[st.lvIdx];
    const pool = root.JLPT_Q.filter(q => q.lv === lv && TYPES.includes(q.t) && !st.asked[q.id]);
    // 三種題型各抓 2 題(不夠就隨機補)
    const out = [];
    TYPES.forEach(t => { const a = pool.filter(q => q.t === t); shuffle(a); out.push(...a.slice(0, 2)); });
    if (out.length < PER) { const rest = pool.filter(q => !out.includes(q)); shuffle(rest); out.push(...rest.slice(0, PER - out.length)); }
    shuffle(out); return out.slice(0, PER);
  }
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function nextRound() {
    st.cur = pickRound(); st.i = 0; st.c = 0; st.round++;
    st.cur.forEach(q => { st.asked[q.id] = 1; });
    if (!st.cur.length) { result(); return; }
    renderQ();
  }
  function renderQ() {
    const q = st.cur[st.i]; const done = st.history.reduce((a, h) => a + h.n, 0) + st.i;
    const est = Math.min(MAX_ROUNDS * PER, Math.max(done + (st.cur.length - st.i), 12));
    box().innerHTML = '<div class="pl">'
      + '<div class="qhd"><span>' + L('第 ' + (done + 1) + ' 題', 'Q' + (done + 1)) + ' <span style="color:var(--tx3)">/ ' + L('約 ' + est, '~' + est) + '</span> · ' + LV[st.lvIdx].toUpperCase() + '</span><button class="qclose" style="width:auto;margin:0;padding:2px 10px" onclick="Placement.close()"><i data-ic=x></i></button></div>'
      + '<div class="pl-bar"><i style="width:' + Math.round(done / est * 100) + '%"></i></div>'
      + '<div class="pl-q">' + esc(q.q) + '</div>'
      + '<div class="pl-opts">' + shuffle(q.o.map((_, i) => i)).map((i, pos) => '<button type="button" class="pl-opt" data-i="' + i + '" onclick="Placement._ans(' + i + ')"><span class="no">' + (pos + 1) + '</span><span>' + esc(q.o[i]) + '</span></button>').join('') + '</div>'
      + '<button type="button" class="pl-skip" onclick="Placement._ans(-1)">' + L('不知道,跳過', 'Don\'t know — skip') + '</button>'
      + '</div>';
    show(); hydrate();
  }
  function _ans(i) {
    const q = st.cur[st.i]; const ok = i === q.a;
    if (ok) st.c++;
    box().querySelectorAll('.pl-opt').forEach(b => { b.disabled = true; const bi = +b.dataset.i; if (bi === q.a) b.classList.add('ok'); else if (bi === i) b.classList.add('ng'); });
    try { if (root.StayDaily) StayDaily.log('quiz'); } catch (e) {}
    setTimeout(() => {
      st.i++;
      if (st.i < st.cur.length) { renderQ(); return; }
      // 一輪結束:決定升/降/定案
      st.history.push({ lv: LV[st.lvIdx], c: st.c, n: st.cur.length });
      const c = st.c;
      let move = 0;
      if (c >= 5 && st.lvIdx < LV.length - 1) move = 1;
      else if (c <= 2 && st.lvIdx > 0) move = -1;
      if (move === 0 || st.round >= MAX_ROUNDS || (st.dir && move === -st.dir)) {
        if (st.dir === 1 && move === -1) { /* 升上去又掉下來 → 停在較低那級 */ st.lvIdx -= 1; }
        result(); return;
      }
      st.dir = move; st.lvIdx += move; nextRound();
    }, 650);
  }
  function result() {
    const base = LV[st.lvIdx];
    // 最後一輪如果答得很差(≤2)且不能再降,程度就是這級「以下」;答得很好又不能再升 → 就是 N1
    const goal = LV[Math.min(LV.length - 1, st.lvIdx + 1)];
    const rows = st.history.map(h => '<div class="pl-hrow"><span>' + h.lv.toUpperCase() + '</span><b>' + h.c + ' / ' + h.n + '</b></div>').join('');
    box().innerHTML = '<div class="pl pl-res">'
      + '<img class="pl-mascot" src="images/mascot/tanuki-p06.png" alt="">'
      + '<div class="pl-res-lbl">' + L('你目前大約是', 'Your level is about') + '</div>'
      + '<div class="pl-res-lv">' + base.toUpperCase() + '</div>'
      + '<div class="pl-res-sub">' + (base === 'n1' ? L('已經是最高級了,直接衝 N1 題庫吧', 'Top level — go straight for N1 practice') : L('建議目標 ' + goal.toUpperCase() + ':先把 ' + base.toUpperCase() + ' 補穩,再往 ' + goal.toUpperCase() + ' 前進', 'Suggested goal: ' + goal.toUpperCase())) + '</div>'
      + '<div class="pl-hist">' + rows + '</div>'
      + '<button type="button" class="pl-cta" onclick="Placement._apply(\'' + base + '\',\'' + goal + '\')">' + L('設為我的程度,開始闖關', 'Set my level and start the path') + ' →</button>'
      + '<button type="button" class="pl-cta pl-cta-sub" onclick="Placement.close()">' + L('先不要', 'Not now') + '</button>'
      + '</div>';
    show(); hydrate();
  }
  function _apply(base, goal) {
    try { localStorage.setItem('base_level', base); localStorage.setItem('goal_level', goal); localStorage.setItem('onboarding_done_v1', '1'); } catch (e) {}
    try { if (root.StudyPlan && StudyPlan.toggleLevel) { StudyPlan.toggleLevel(goal, true); if (base !== goal) StudyPlan.toggleLevel(base, true); } } catch (e) {}
    try { if (typeof switchLevel === 'function') switchLevel(goal); } catch (e) {}
    try { if (typeof saveAllCloud === 'function') saveAllCloud(); } catch (e) {}
    // 闖關從「目前程度」那一級開始(先補穩再進階)
    if (root.Path) { Path.setLevel(base); Path.openMap(); } else hide();
  }
  function close() { st = null; hide(); }

  function ensureCss() {
    if (document.getElementById('plCss')) return;
    const s = document.createElement('style'); s.id = 'plCss';
    s.textContent = [
      '.pl{padding-bottom:4px}.pl-mascot{display:block;width:110px;margin:10px auto 4px}',
      '.pl-intro{font-size:14px;line-height:1.7;color:var(--tx2);text-align:center;margin:8px 0 14px}',
      '.pl-cta{display:block;width:100%;margin-top:10px;background:var(--ac);color:#fff;border:0;border-radius:12px;padding:13px 14px;font-size:15px;font-weight:800;cursor:pointer;font-family:inherit}.pl-cta-sub{background:var(--bg3);color:var(--tx)}',
      '.pl-bar{height:5px;border-radius:999px;background:var(--prog-empty,#e5e7eb);margin:10px 0 14px;overflow:hidden}.pl-bar i{display:block;height:100%;background:var(--ac);border-radius:999px;transition:width .3s}',
      '.pl-q{font-size:18px;line-height:1.7;margin:0 0 12px;font-weight:600}.pl-opts{display:grid;gap:8px}',
      '.pl-opt{font:inherit;text-align:left;font-size:16px;line-height:1.5;background:var(--bg);border:1.5px solid var(--bd);border-radius:14px;padding:13px 14px;cursor:pointer;color:var(--tx);display:flex;gap:10px;align-items:baseline}.pl-opt .no{color:var(--tx3);font-size:13px}',
      '.pl-opt.ok{border-color:var(--correct-bd,#16a34a);background:var(--correct-bg,#dcfce7)}.pl-opt.ng{border-color:var(--wrong-bd,#dc2626);background:var(--wrong-bg,#fef2f2)}.pl-opt[disabled]{cursor:default}',
      '.pl-skip{display:block;margin:12px auto 0;font:inherit;font-size:13px;color:var(--tx3);background:none;border:0;cursor:pointer;text-decoration:underline}',
      '.pl-res{text-align:center}.pl-res-lbl{font-size:13px;color:var(--tx2);margin-top:6px}.pl-res-lv{font-size:46px;font-weight:900;color:var(--ac);letter-spacing:-.02em;line-height:1.1}.pl-res-sub{font-size:13.5px;color:var(--tx2);line-height:1.6;margin:8px 0 12px}',
      '.pl-hist{display:grid;gap:4px;margin:0 auto 6px;max-width:220px}.pl-hrow{display:flex;justify-content:space-between;font-size:12.5px;color:var(--tx2);background:var(--bg3);border-radius:8px;padding:5px 10px}.pl-hrow b{color:var(--tx)}',
    ].join('');
    document.head.appendChild(s);
  }
  root.Placement = { start, close, _go, _ans, _apply };
})(window);
