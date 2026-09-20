// 每日學習計畫(2026-09-16,參考 Kotonoha 抄過來再優化):
//   A1 每日新單字上限 / 複習上限 / 複習順序(交錯・先複習) → 面板「準備好了 N 個新單字」卡 + 一顆開始鈕
//   A2 字卡正面可選「日文」或「中文→回想日文」
//   A3 依時段問候 + 一句話輪播(給 renderHub 用)
//   A4 單字集:可同時開多個等級、排序決定新字先從哪級抽、每級可關掉不想背的生活主題
//   B7 答錯的卡在本輪結尾自動再考一次(SRS.rate 會呼叫 againQueue)
// 設定存 localStorage sp_settings / sp_sets(加進 SYNC_KEYS 跨裝置同步)。純前端。
(function (root) {
  const KEY = 'sp_settings', SETS_KEY = 'sp_sets';
  const LEVELS = ['n5', 'n4', 'n3', 'n2', 'n1'];
  const DEF = { newPerDay: 20, reviewPerDay: 200, order: 'mix', front: 'jp', again: true, pitch: false, mode: 'normal', minTarget: 20, modeChosen: false, rhythm: 'path' };
  // rhythm:'path' 每天有指定關卡要過(預設,關卡感)/ 'free' 自己的節奏(只看今日目標動作數)
  // 學習模式(2026-09-20 Mia:情勒/倒數/輕鬆):一個選擇同時決定 今日目標動作數、新字/複習上限、每天最低專注分鐘、提醒語氣、每日建議關數
  const MODES = {
    easy:    { goal: 10, newPerDay: 10, reviewPerDay: 60,  minTarget: 0,  tone: 'gentle', units: 1, name: ['輕鬆', 'Relaxed'],  desc: ['每天 5 分鐘,有做就好;小狸只會溫柔提醒', '5 min a day, no pressure; gentle nudges only'] },
    normal:  { goal: 30, newPerDay: 20, reviewPerDay: 200, minTarget: 0,  tone: 'coach',  units: 2, name: ['標準', 'Standard'], desc: ['每天 30 個動作(約 15 分),教練式提醒', '30 actions a day (~15 min), coach-style reminders'] },
    intense: { goal: 60, newPerDay: 30, reviewPerDay: 300, minTarget: 20, tone: 'guilt',  units: 3, name: ['情勒', 'Hardcore'], desc: ['每天至少專注 20 分鐘倒數,沒讀完小狸會念你', 'A daily 20-min focus countdown; the tanuki will guilt you'] },
  };

  const L = (zh, en) => { try { return (typeof enOr === 'function') ? enOr(zh, en) : zh; } catch (e) { return zh; } };
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  function today() { return new Date().toISOString().split('T')[0]; }
  function dayOf(ts) { return new Date(ts).toISOString().split('T')[0]; }
  function curLevel() { try { return (typeof currentLevel !== 'undefined' && LEVELS.includes(currentLevel)) ? currentLevel : (localStorage.getItem('lastLevel') || 'n5'); } catch (e) { return 'n5'; } }
  function vocab(lv) { try { return (typeof getVocabData === 'function') ? (getVocabData(lv) || []) : []; } catch (e) { return []; } }
  function srsData() { try { return JSON.parse(localStorage.getItem('srs_data')) || {}; } catch (e) { return {}; } }
  function cloud() { try { if (typeof saveAllCloud === 'function') saveAllCloud(); } catch (e) {} }

  // ── 設定 ──
  function get() {
    let s = {}; try { s = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}
    const o = { ...DEF, ...s };
    o.newPerDay = Math.max(0, Math.min(200, parseInt(o.newPerDay, 10) || 0));
    o.reviewPerDay = Math.max(10, Math.min(1000, parseInt(o.reviewPerDay, 10) || DEF.reviewPerDay));
    if (o.order !== 'reviewFirst') o.order = 'mix';
    if (o.front !== 'zh') o.front = 'jp';
    o.again = o.again !== false;
    o.pitch = o.pitch === true;
    if (!MODES[o.mode]) o.mode = 'normal';
    o.minTarget = [10, 20, 30, 45].includes(parseInt(o.minTarget, 10)) ? parseInt(o.minTarget, 10) : 20;
    o.modeChosen = o.modeChosen === true;
    if (o.rhythm !== 'free') o.rhythm = 'path';
    return o;
  }
  function set(patch) {
    const o = { ...get(), ...(patch || {}) };
    try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {}
    cloud();
    try { if (typeof doRender === 'function') { if (root.hubInvalidate) root.hubInvalidate(); doRender(); } } catch (e) {}
    return o;
  }

  // ── 單字集(等級開關 + 排序 + 主題關閉)──
  function sets() {
    let s = {}; try { s = JSON.parse(localStorage.getItem(SETS_KEY)) || {}; } catch (e) {}
    const order = Array.isArray(s.order) ? s.order.filter(l => LEVELS.includes(l)) : [];
    LEVELS.forEach(l => { if (!order.includes(l)) order.push(l); });
    let on = (s.on && typeof s.on === 'object') ? s.on : null;
    if (!on) { on = {}; on[curLevel()] = true; }   // 預設:只開目前在看的等級(跟舊行為一致,不會突然抽到 N1)
    return { order, on, themeOff: (s.themeOff && typeof s.themeOff === 'object') ? s.themeOff : {} };
  }
  function saveSets(s) { try { localStorage.setItem(SETS_KEY, JSON.stringify(s)); } catch (e) {} cloud(); }
  function enabledLevels() { const s = sets(); const on = s.order.filter(l => s.on[l]); return on.length ? on : [curLevel()]; }
  function themeOf(v) { try { return (root.VOCAB_THEMES && root.VOCAB_THEMES[v.w + '|' + (v.r || '')]) || ''; } catch (e) { return ''; } }
  function levelPool(lv, s) {
    const off = s.themeOff;
    return vocab(lv).filter(v => { const th = themeOf(v); return !(th && off[lv + '|' + th]); });
  }

  // ── 學習模式 ──
  function mode() { return get().mode; }
  function modeInfo(m) { return MODES[m || mode()] || MODES.normal; }
  function goal() { return modeInfo().goal; }
  function minutesToday() { try { const l = JSON.parse(localStorage.getItem('study_log')) || {}; const d = l[today()]; return d && d.minutes ? Math.round(d.minutes * 10) / 10 : 0; } catch (e) { return 0; } }
  function setMode(m) {
    if (!MODES[m]) return;
    const mi = MODES[m];
    set({ mode: m, newPerDay: mi.newPerDay, reviewPerDay: mi.reviewPerDay, modeChosen: true });
    // 提醒語氣跟著模式走:網頁記一份;在 App 內叫原生重排通知(web.tsx SET_REMINDER 讀 payload.tone;1.0.13 起)
    try { localStorage.setItem('reminder_tone', mi.tone); } catch (e) {}
    try {
      const time = localStorage.getItem('reminder_time_pref');
      if (time && root.STAYJP_NATIVE && root.STAYJP_NATIVE.isNativeApp && root.ReactNativeWebView) {
        root.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SET_REMINDER', payload: { time: time, tone: mi.tone } }));
      }
    } catch (e) {}
  }
  function setMinTarget(n) { set({ minTarget: parseInt(n, 10) }); }
  function rhythm() { return get().rhythm; }
  function setRhythm(r) { set({ rhythm: r === 'free' ? 'free' : 'path' }); }
  // 情勒句池(app 內文案;推播那套在 native notifications.ts TONE_BODIES)— 依小時輪播
  const NAG = [
    ['小狸等你等到快睡著了,今天還沒讀。', 'The tanuki has been waiting. Nothing studied yet today.'],
    ['你說要考過的,我都記著喔。', 'You said you\'d pass this exam. I remember.'],
    ['再滑一下手機,今天就過去了。', 'One more scroll and today is gone.'],
    ['今天不讀,明天就要補兩倍。我只是提醒。', 'Skip today and tomorrow is double. Just saying.'],
    ['我不生氣,我只是有點失望。', 'I\'m not angry. Just a little disappointed.'],
    ['別人今天已經讀完了。你呢?', 'Others already finished today. And you?'],
    ['你的連續天數在看你。', 'Your streak is watching you.'],
    ['20 分鐘,一集動畫的時間,你有。', 'Twenty minutes. One anime episode. You have it.'],
  ];
  function nagLine() { const h = Math.floor(Date.now() / 3600000); const p = NAG[h % NAG.length]; return L(p[0], p[1]); }
  function modeChip() {
    const m = modeInfo();
    return '<button type="button" class="sp-mode-chip sp-mode-' + mode() + '" onclick="StudyPlan.openSettings()">' + L(m.name[0] + '模式', m.name[1]) + '</button>';
  }
  // 情勒模式:每日專注倒數(分鐘由 focus-time.js 心跳寫進 study_log.minutes)
  function timerHtml() {
    const cfg = get(); if (cfg.mode !== 'intense') return '';
    const done = minutesToday(), tgt = cfg.minTarget, left = Math.max(0, Math.ceil(tgt - done)), pct = Math.min(100, Math.round(done / tgt * 100));
    return '<div class="sp-timer' + (left === 0 ? ' ok' : '') + '">'
      + '<div class="sp-timer-row"><span>' + L('今日專注時間', 'Focus time today') + '</span><b>' + Math.floor(done) + ' / ' + tgt + L(' 分', ' min') + '</b></div>'
      + '<div class="sp-bar"><i style="width:' + pct + '%"></i></div>'
      + '<div class="sp-nag">' + (left === 0 ? L('時間達標了,今天放過你。', 'Target hit. You\'re off the hook today.') : L('還欠 ' + left + ' 分鐘。', left + ' min to go. ') + nagLine()) + '</div>'
      + '</div>';
  }
  // 第一次進面板:先選模式(選了才收起)
  function chooserHtml() {
    if (get().modeChosen) return '';
    return '<div class="sp-choose"><div class="sp-choose-t">' + L('先選一個模式,隨時可改', 'Pick a mode — change anytime') + '</div>'
      + Object.keys(MODES).map(k => { const m = MODES[k]; return '<button type="button" class="sp-choice sp-mode-' + k + '" onclick="StudyPlan.setMode(\'' + k + '\')"><b>' + L(m.name[0], m.name[1]) + '</b><small>' + L(m.desc[0], m.desc[1]) + '</small></button>'; }).join('')
      + '</div>';
  }
  function ensureModeCss() {
    if (document.getElementById('spModeCss')) return;
    const st = document.createElement('style'); st.id = 'spModeCss';
    st.textContent = [
      '.sp-top-r{display:flex;align-items:center;gap:8px}',
      '.sp-mode-chip{border:1px solid var(--bd);background:var(--bg3);color:var(--tx2);border-radius:999px;padding:3px 10px;font-size:11.5px;font-weight:800;cursor:pointer;font-family:inherit}',
      '.sp-mode-chip.sp-mode-intense{background:#FDECE7;color:#C8452F;border-color:#F3C6BA}',
      '.sp-mode-chip.sp-mode-easy{background:#EAF6EE;color:#2E7D57;border-color:#CDE8D6}',
      '[data-theme="dark"] .sp-mode-chip.sp-mode-intense{background:#3A2320;color:#F09A86;border-color:#5A342E}',
      '[data-theme="dark"] .sp-mode-chip.sp-mode-easy{background:#1F2F26;color:#8BD3A6;border-color:#2F4A3A}',
      '.sp-timer{margin-top:14px;padding:12px 14px;border-radius:14px;background:var(--bg3);border:1px solid var(--bd)}',
      '.sp-timer.ok{background:var(--correct-bg,#dcfce7)}',
      '.sp-timer-row{display:flex;justify-content:space-between;font-size:12.5px;color:var(--tx2)}.sp-timer-row b{color:var(--tx);font-size:14px}',
      '.sp-bar{height:6px;border-radius:999px;background:var(--prog-empty,#e5e7eb);margin:8px 0;overflow:hidden}.sp-bar i{display:block;height:100%;background:var(--ac);border-radius:999px;transition:width .4s}',
      '.sp-nag{font-size:13px;line-height:1.5;color:var(--tx)}',
      '.sp-choose{margin:12px 0 4px;display:grid;gap:8px}.sp-choose-t{font-size:12.5px;color:var(--tx2)}',
      '.sp-choice{display:flex;flex-direction:column;align-items:flex-start;gap:2px;text-align:left;font:inherit;background:var(--bg);border:1.5px solid var(--bd);border-radius:14px;padding:10px 12px;cursor:pointer;color:var(--tx)}.sp-choice b{font-size:14px}.sp-choice small{font-size:12px;color:var(--tx2);line-height:1.4}',
      '.sp-choice.sp-mode-intense{border-color:#F3C6BA}.sp-choice.sp-mode-easy{border-color:#CDE8D6}',
      '.sp-seg{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:6px 0 12px}',
      '.sp-seg button{font:inherit;display:flex;flex-direction:column;gap:3px;align-items:flex-start;text-align:left;background:var(--bg);border:1.5px solid var(--bd);border-radius:12px;padding:10px;cursor:pointer;color:var(--tx)}.sp-seg button b{font-size:13.5px}.sp-seg button small{font-size:11px;color:var(--tx2);line-height:1.35}',
      '.sp-seg button.on{border-color:var(--ac);background:var(--soft,rgba(212,101,74,.08))}',
    ].join('');
    document.head.appendChild(st);
  }

  // ── 今日統計 ──
  function newToday(d) {
    d = d || srsData(); const t = today(); let n = 0;
    Object.values(d).forEach(e => { if (e && e.created && dayOf(e.created) === t) n++; });
    return n;
  }
  function allDue(d) {
    d = d || srsData(); const now = Date.now(), out = [];
    Object.entries(d).forEach(([key, e]) => {
      if (!e) return;
      const due = (typeof e.nextReviewTs === 'number') ? e.nextReviewTs <= now : (e.nextReview <= dayOf(now));
      if (!due) return;
      const ci = key.indexOf(':'); if (ci < 0) return;
      out.push({ level: key.slice(0, ci), word: key.slice(ci + 1), ts: e.nextReviewTs || 0 });
    });
    return out.sort((a, b) => a.ts - b.ts);
  }
  // 新字:依單字集排序、跳過已學與關掉的主題
  function pickNew(count, d) {
    if (count <= 0) return [];
    d = d || srsData(); const s = sets(); const out = [];
    // 自己輸入的字(my-vocab.js)排最前面:使用者親手加的,優先度最高,也不受單字集等級開關影響
    try {
      if (root.MyVocab) {
        for (const v of MyVocab.list()) {
          if (d['my:' + v.w]) continue;
          out.push({ ...v, level: 'my', isNew: true });
          if (out.length >= count) return out;
        }
      }
    } catch (e) {}
    for (const lv of enabledLevels()) {
      const pf = lv + ':';
      for (const v of levelPool(lv, s)) {
        if (d[pf + v.w]) continue;
        out.push({ ...v, level: lv, isNew: true });
        if (out.length >= count) return out;
      }
    }
    return out;
  }
  function plan(extraNew) {
    const cfg = get(); const d = srsData();
    const due = allDue(d);
    const dueItems = [];
    for (const x of due) {
      if (dueItems.length >= cfg.reviewPerDay) break;
      const v = vocab(x.level).find(w => w.w === x.word);
      if (v) dueItems.push({ ...v, level: x.level, isNew: false });
    }
    const left = Math.max(0, cfg.newPerDay - newToday(d)) + (extraNew || 0);
    const newItems = pickNew(left, d);
    const minutes = Math.max(1, Math.round(dueItems.length * 0.15 + newItems.length * 0.3));
    return { due: dueItems, fresh: newItems, dueTotal: due.length, minutes, cfg };
  }
  // 出題順序:交錯(每 2 張複習插 1 張新字,比例不夠就照剩的排)或先複習
  function buildQueue(extraNew, opts) {
    const p = plan(extraNew);
    if (opts && opts.reviewOnly) return p.due.slice();   // 關卡節奏:新字由關卡帶,這裡只清到期複習
    if (p.cfg.order === 'reviewFirst' || !p.due.length || !p.fresh.length) return p.due.concat(p.fresh);
    const q = []; let di = 0, ni = 0;
    const ratio = Math.max(1, Math.round(p.due.length / p.fresh.length));
    while (di < p.due.length || ni < p.fresh.length) {
      for (let k = 0; k < ratio && di < p.due.length; k++) q.push(p.due[di++]);
      if (ni < p.fresh.length) q.push(p.fresh[ni++]);
    }
    return q;
  }
  function sig() { try { const p = plan(), c = get(); return p.due.length + '/' + p.fresh.length + '/' + newToday() + '/' + c.mode + '/' + c.rhythm + '/' + c.modeChosen + '/' + Math.floor(minutesToday()); } catch (e) { return ''; } }

  // ── A3 時段問候 ──
  function greeting() {
    const h = new Date().getHours();
    const slot = h < 5 ? 'night' : h < 11 ? 'morning' : h < 14 ? 'noon' : h < 18 ? 'afternoon' : h < 23 ? 'evening' : 'night';
    const greet = slot === 'morning' ? 'おはよう' : (slot === 'noon' || slot === 'afternoon') ? 'こんにちは' : slot === 'evening' ? 'こんばんは' : 'おやすみ前に';
    const POOL = {
      morning: [['早安！出門前先背 5 個字，一天都順', 'Morning! Five words before you head out.'], ['早上記的字最牢，先來一輪吧', 'Words stick best in the morning — one round?'], ['今天也一起加油！', 'Let\'s go again today!']],
      noon: [['午休 5 分鐘，剛好背幾個字', 'Five minutes at lunch is all it takes.'], ['吃飽了？來翻幾張卡消化一下', 'Full? Flip a few cards to digest.']],
      afternoon: [['下午容易放空，翻幾張卡醒一醒', 'Afternoon slump? A few cards will wake you up.'], ['離下班還有一段，先把今天的份做掉', 'Knock out today\'s share before the day ends.']],
      evening: [['今天辛苦了，複習一下再休息', 'Long day. A quick review, then rest.'], ['晚上複習一輪，白天學的才會留下來', 'Review tonight and today\'s words will stay.'], ['一天一點，記憶就會穩穩堆起來', 'A little every day, and it all adds up.']],
      night: [['睡前複習一下吧 — 睡眠會幫你把記憶存好', 'A quick review before bed — sleep files it away.'], ['很晚了，翻 5 張就好，然後早點睡', 'It\'s late. Five cards, then sleep.']],
    };
    const pool = POOL[slot];
    const dayN = Math.floor(Date.now() / 86400000);
    const pick = pool[dayN % pool.length];
    return { slot, greet, motto: L(pick[0], pick[1]) };
  }

  // ── 面板卡 ──
  function hubCardHtml(g) {
    ensureModeCss();
    const p = plan();
    const n = p.fresh.length, d = p.due.length;
    const doneAll = n === 0 && d === 0;
    // 今日目標濃縮成卡底一條:「今日目標 5 / 30」+ 細進度條(點了看說明)
    const goalLine = g ? '<button type="button" class="sp-goal" onclick="dailyHelp&&dailyHelp()"><span>' + L('今日目標', 'Today’s goal') + '</span><span class="sp-goal-n">' + Math.min(g.done, g.goal) + ' / ' + g.goal + '</span><i class="sp-goal-bar"><b style="width:' + Math.min(100, Math.round(g.done / g.goal * 100)) + '%"></b></i></button>' : '';
    if (get().rhythm === 'path' && root.Path) {
      // 關卡節奏:新單字由關卡帶,這張卡只管到期複習 + 模式/倒數/今日目標
      const gear = '<span class="sp-top-r">' + modeChip() + '<button type="button" class="sp-gear" onclick="StudyPlan.openSettings()" aria-label="settings"><i data-ic=settings></i></button></span>';
      return '<div class="sp-card sp-review">'
        + '<div class="sp-top"><b>' + (d ? L('待複習 ' + d + ' 張', d + ' cards to review') : L('複習都清完了 ✓', 'Reviews all clear ✓')) + '</b>' + gear + '</div>'
        + chooserHtml()
        + '<div class="sp-sub">' + (d ? L('關卡學新的,這裡清舊的;大約 ' + Math.max(1, Math.round(d / 4)) + ' 分鐘', 'Levels teach new words; this clears due reviews (~' + Math.max(1, Math.round(d / 4)) + ' min)') : L('新單字在關卡裡學,背過的字到期會回到這裡', 'New words come from the path; learned words return here when due')) + '</div>'
        + (d ? '<button type="button" class="sp-cta sp-cta-sub" onclick="SRS.start(null,{reviewOnly:true})">' + L('複習 ' + d + ' 張', 'Review ' + d) + ' →</button>' : '')
        + timerHtml()
        + goalLine
        + '</div>';
    }
    if (doneAll) {
      return '<div class="sp-card sp-done">'
        + '<div class="sp-top"><b>' + L('今天的份完成了 🎉', 'Today\'s share is done 🎉') + '</b><span class="sp-top-r">' + modeChip() + '<button type="button" class="sp-gear" onclick="StudyPlan.openSettings()" aria-label="settings"><i data-ic=settings></i></button></span></div>'
        + '<div class="sp-sub">' + L('已學 ' + newToday() + ' 個新字・沒有到期的複習。想多學一點？', newToday() + ' new words learned · nothing due. Want more?') + '</div>'
        + timerHtml()
        + '<button type="button" class="sp-cta sp-cta-sub" onclick="SRS.start(null,{extraNew:10})">' + L('再學 10 個新單字', 'Learn 10 more') + '</button>'
        + goalLine
        + '</div>';
    }
    const parts = [];
    if (n) parts.push('<span class="sp-num">' + n + '</span> ' + L('個新單字', 'new words'));
    if (d) parts.push('<span class="sp-num">' + d + '</span> ' + L('張待複習', 'to review'));
    return '<div class="sp-card">'
      + '<div class="sp-top"><b>' + L('準備好了', 'Ready for you') + '</b><span class="sp-top-r">' + modeChip() + '<button type="button" class="sp-gear" onclick="StudyPlan.openSettings()" aria-label="settings"><i data-ic=settings></i></button></span></div>'
      + chooserHtml()
      + '<div class="sp-main">' + parts.join('<span class="sp-dot">・</span>') + '</div>'
      + '<div class="sp-sub">' + L('大約 ' + p.minutes + ' 分鐘', 'About ' + p.minutes + ' min') + (p.dueTotal > d ? '・' + L('到期共 ' + p.dueTotal + ' 張', p.dueTotal + ' due in total') : '') + '</div>'
      + timerHtml()
      + '<button type="button" class="sp-cta" onclick="SRS.start()">' + L('開始今天的學習', 'Start today\'s session') + ' →</button>'
      + goalLine
      + '</div>';
  }

  // ── 設定面板(用 quiz overlay)──
  function openSettings() {
    ensureCss(); ensureModeCss();
    const box = document.getElementById('quizBox'), bg = document.getElementById('quizBg');
    if (!box || !bg) return;
    const cfg = get(), s = sets();
    const lvRows = s.order.map((lv, i) => {
      const total = vocab(lv).length;
      const themes = {}; vocab(lv).forEach(v => { const th = themeOf(v); if (th) themes[th] = (themes[th] || 0) + 1; });
      const offN = Object.keys(themes).filter(th => s.themeOff[lv + '|' + th]).length;
      const chips = Object.keys(themes).sort((a, b) => themes[b] - themes[a]).map(th =>
        '<button type="button" class="sp-chip' + (s.themeOff[lv + '|' + th] ? ' off' : '') + '" onclick="StudyPlan.toggleTheme(\'' + lv + '\',\'' + esc(th) + '\')">' + esc(th) + ' <small>' + themes[th] + '</small></button>').join('');
      return '<div class="sp-lv' + (s.on[lv] ? '' : ' dim') + '">'
        + '<div class="sp-lv-row">'
        + '<label class="sp-check"><input type="checkbox" ' + (s.on[lv] ? 'checked' : '') + ' onchange="StudyPlan.toggleLevel(\'' + lv + '\',this.checked)"><b>' + lv.toUpperCase() + '</b></label>'
        + '<span class="sp-lv-n">' + (offN ? L('已關 ' + offN + ' 個主題・', offN + ' themes off · ') : L('全開・', 'all · ')) + total + L(' 詞', ' words') + '</span>'
        + '<span class="sp-lv-btns"><button type="button" ' + (i === 0 ? 'disabled' : '') + ' onclick="StudyPlan.moveLevel(\'' + lv + '\',-1)" aria-label="up">↑</button><button type="button" ' + (i === s.order.length - 1 ? 'disabled' : '') + ' onclick="StudyPlan.moveLevel(\'' + lv + '\',1)" aria-label="down">↓</button>'
        + '<button type="button" class="sp-exp" onclick="this.closest(\'.sp-lv\').classList.toggle(\'open\')" aria-label="themes">▾</button></span>'
        + '</div>'
        + '<div class="sp-themes">' + (chips || '<span class="sp-lv-n">' + L('此級別尚無主題標記', 'No theme tags yet') + '</span>') + '</div>'
        + '</div>';
    }).join('');
    box.innerHTML = '<div class="sp-set">'
      + '<div class="qhd"><h3 style="margin:0">' + L('學習計畫', 'Study plan') + '</h3><button class="qclose" style="width:auto;margin:0;padding:2px 10px" onclick="StudyPlan.closeSettings()"><i data-ic=x></i></button></div>'
      + '<div class="sp-sec">' + L('學習模式', 'Study mode') + '</div>'
      + '<div class="sp-seg">' + Object.keys(MODES).map(k => '<button type="button" class="' + (cfg.mode === k ? 'on' : '') + ' sp-mode-' + k + '" onclick="StudyPlan.setMode(\'' + k + '\');StudyPlan.openSettings()"><b>' + L(MODES[k].name[0], MODES[k].name[1]) + '</b><small>' + L(MODES[k].desc[0], MODES[k].desc[1]) + '</small></button>').join('') + '</div>'
      + (cfg.mode === 'intense' ? row(L('每日最低專注時間', 'Daily focus minimum'), L('面板會倒數;只算「頁面在前景且有操作」的時間', 'Counts foreground time with activity; the dashboard counts down'),
        '<select onchange="StudyPlan.setMinTarget(this.value)">' + [10, 20, 30, 45].map(n => '<option value="' + n + '"' + (cfg.minTarget === n ? ' selected' : '') + '>' + n + L(' 分', ' min') + '</option>').join('') + '</select>') : '')
      + row(L('每日節奏', 'Daily rhythm'), L('關卡任務:每天有指定關卡要過,面板列出今天的關;自由節奏:只看今日目標動作數,想做什麼自己排', 'Quests: specific levels to clear each day; Free: just a daily action goal, study whatever you like'),
        '<select onchange="StudyPlan.setRhythm(this.value);StudyPlan.openSettings()"><option value="path"' + (cfg.rhythm === 'path' ? ' selected' : '') + '>' + L('關卡任務（預設）', 'Quests (default)') + '</option><option value="free"' + (cfg.rhythm === 'free' ? ' selected' : '') + '>' + L('自由節奏', 'Free pace') + '</option></select>')
      + '<div class="sp-sec">' + L('學習目標', 'Daily goals') + '</div>'
      + row(L('每日新單字上限', 'New words per day'), L('每天最多抽幾個沒學過的新字（建議 10–30）', 'Max new words drawn each day (10–30 recommended)'),
        '<input type="number" min="0" max="200" inputmode="numeric" value="' + cfg.newPerDay + '" onchange="StudyPlan.set({newPerDay:this.value})">')
      + row(L('每次複習上限', 'Reviews per session'), L('一次最多排幾張到期的舊字（建議 100–300）', 'Max due cards per session (100–300 recommended)'),
        '<input type="number" min="10" max="1000" inputmode="numeric" value="' + cfg.reviewPerDay + '" onchange="StudyPlan.set({reviewPerDay:this.value})">')
      + row(L('複習順序', 'Order'), L('交錯＝待複習與新字穿插；先複習＝清完到期的舊字才學新字', 'Mixed = reviews and new words interleaved; Reviews first = clear due cards before new ones'),
        '<select onchange="StudyPlan.set({order:this.value})"><option value="mix"' + (cfg.order === 'mix' ? ' selected' : '') + '>' + L('交錯（預設）', 'Mixed (default)') + '</option><option value="reviewFirst"' + (cfg.order === 'reviewFirst' ? ' selected' : '') + '>' + L('先複習', 'Reviews first') + '</option></select>')
      + row(L('字卡正面', 'Card front'), L('中文→回想日文：先看意思，練主動說出來；翻面才看單字與讀音', 'Meaning first: recall the Japanese yourself; flip to see the word and reading'),
        '<select onchange="StudyPlan.set({front:this.value})"><option value="jp"' + (cfg.front === 'jp' ? ' selected' : '') + '>' + L('單字（預設）', 'Word (default)') + '</option><option value="zh"' + (cfg.front === 'zh' ? ' selected' : '') + '>' + L('中文意思', 'Meaning') + '</option></select>')
      + row(L('錯題重考', 'Retry misses'), L('這一輪答錯的卡，結尾自動再考一次', 'Cards you miss come back at the end of the session'),
        '<label class="sp-switch"><input type="checkbox" ' + (cfg.again ? 'checked' : '') + ' onchange="StudyPlan.set({again:this.checked})"><span></span></label>')
      + (root.PITCH_VERIFIED ? row(L('單字顯示音高', 'Show pitch accent'), L('翻面後在單字後加 ⓪①②③ 標示東京標準語的音調（目前 N5・N4）', 'Adds ⓪①②③ after the word on the back (N5・N4 for now)'),
        '<label class="sp-switch"><input type="checkbox" ' + (cfg.pitch ? 'checked' : '') + ' onchange="StudyPlan.set({pitch:this.checked})"><span></span></label>') : '')   // 音高資料(LLM 產)NHK 抽查只有 ~80%,資料換成 UniDic 驗證過再開(PITCH_VERIFIED)
      + row(L('語音', 'Voice'), L('單字與例句的聲音（N5・N4 單字＋例句、N3～N1 單字可切換；N3 以上例句與文章為標準聲）', 'Voice for words and sentences (N5・N4 words + sentences, N3–N1 words; N3+ sentences and articles use the standard voice)'),
        '<select onchange="StudyPlan.setVoice(this.value)">' + VOICES.map(v => '<option value="' + v[0] + '"' + (voice() === v[0] ? ' selected' : '') + '>' + L(v[1], v[2]) + '</option>').join('') + '</select>')
      + '<div class="sp-sec">' + L('單字集', 'Word sets') + '</div>'
      + '<div class="sp-hint">' + L('勾選想背的等級、用 ↑↓ 排序：靠前的先抽新字。點 ▾ 可關掉某級裡不想背的主題。', 'Tick the levels to study and order them with ↑↓ — new words come from the top first. Tap ▾ to switch off themes within a level.') + '</div>'
      + lvRows
      + '<button class="qstart" style="margin-top:14px" onclick="StudyPlan.closeSettings()">' + L('完成', 'Done') + '</button>'
      + '</div>';
    try { if (typeof cvtStaticUI === 'function') cvtStaticUI(box); } catch (e) {}
    bg.classList.add('show');
    function row(title, desc, ctrl) {
      return '<div class="sp-row"><div class="sp-row-t"><b>' + title + '</b><small>' + desc + '</small></div><div class="sp-row-c">' + ctrl + '</div></div>';
    }
  }
  function closeSettings() {
    const bg = document.getElementById('quizBg'); if (bg) bg.classList.remove('show');
    try { if (root.hubInvalidate) root.hubInvalidate(); if (typeof doRender === 'function') doRender(); } catch (e) {}
    try { if (root.SRS && SRS.updateReviewCount) SRS.updateReviewCount(); } catch (e) {}
  }
  function toggleLevel(lv, on) { const s = sets(); s.on[lv] = !!on; saveSets(s); openSettings(); }
  function moveLevel(lv, dir) {
    const s = sets(); const i = s.order.indexOf(lv); const j = i + dir;
    if (i < 0 || j < 0 || j >= s.order.length) return;
    s.order.splice(i, 1); s.order.splice(j, 0, lv); saveSets(s); openSettings();
  }
  function toggleTheme(lv, th) {
    const s = sets(); const k = lv + '|' + th;
    if (s.themeOff[k]) delete s.themeOff[k]; else s.themeOff[k] = true;
    saveSets(s);
    // 只更新 chip,不整個重畫(保持展開狀態)
    const box = document.getElementById('quizBox');
    const btn = box && [].find.call(box.querySelectorAll('.sp-chip'), b => b.getAttribute('onclick').includes('\'' + lv + '\',\'' + th.replace(/'/g, "\\'") + '\''));
    if (btn) btn.classList.toggle('off', !!s.themeOff[k]);
  }

  // B8 音高:pitch-accent.js(window.PITCH,"字|讀音"→核位置;0=平板)→ ⓪①②③ 標在單字後(設定開才顯示)
  const CIRC = ['⓪','①','②','③','④','⑤','⑥','⑦','⑧','⑨','⑩','⑪','⑫'];
  function pitchOf(item) { try { const P = root.PITCH; if (!P || !item) return null; const v = P[item.w + '|' + (item.r || '')]; return (typeof v === 'number') ? v : null; } catch (e) { return null; } }
  function pitchMark(item) {
    if (!get().pitch) return '';
    const n = pitchOf(item); if (n == null) return '';
    return '<span class="sp-pitch" title="' + L('音高:アクセント核位置(0=平板型)', 'Pitch accent: nucleus position (0 = flat)') + '">' + (CIRC[n] || n) + '</span>';
  }
  // B9 多人聲:tts_voice(2 めたん預設 / 8 つむぎ / 13 龍星)。2026-09-18 起 N5・N4 單字+例句、N3~N1 單字有替代聲(audio/tts-v),其餘(N3+ 例句/文章)自動退回預設
  const VOICES = [['2', '四国めたん（女・標準）', 'Metan (female, standard)'], ['8', '春日部つむぎ（女・柔）', 'Tsumugi (female, soft)'], ['13', '青山龍星（男）', 'Ryusei (male)']];
  function voice() { try { return localStorage.getItem('tts_voice') || '2'; } catch (e) { return '2'; } }
  function setVoice(v) { try { localStorage.setItem('tts_voice', String(v)); } catch (e) {} cloud(); try { if (root.__ttsCacheClear) root.__ttsCacheClear(); } catch (e) {} try { if (typeof speak === 'function') speak('こんにちは'); } catch (e) {} }

  function ensureCss() {
    if (document.getElementById('spCss')) return;
    const st = document.createElement('style'); st.id = 'spCss';
    st.textContent = [
      '.sp-card{background:var(--bg2);border:1px solid var(--bd);border-radius:20px;padding:20px 20px 16px;margin:0 0 14px;box-shadow:var(--sh2)}',
      '.sp-goal{display:grid;grid-template-columns:auto auto;align-items:center;justify-content:space-between;gap:6px 8px;width:100%;margin-top:16px;padding:12px 0 0;border:0;border-top:1px solid var(--bd);background:none;color:var(--tx2);font-size:12.5px;cursor:pointer;text-align:left}',
      '.sp-goal .sp-goal-n{font-weight:700;color:var(--tx);font-variant-numeric:tabular-nums;text-align:right}.sp-goal-bar{grid-column:1/-1;display:block;height:6px;border-radius:999px;background:var(--bd);overflow:hidden}.sp-goal-bar b{display:block;height:100%;background:var(--ac);border-radius:999px;transition:width .5s ease}',
      '.sp-card.sp-done{background:linear-gradient(160deg,var(--correct-bg,#dcfce7),var(--bg2))}',
      '.sp-top{display:flex;align-items:center;justify-content:space-between}.sp-top b{font-size:13px;color:var(--tx2);font-weight:700;letter-spacing:.02em}',
      '.sp-gear{border:none;background:none;color:var(--tx3);cursor:pointer;padding:2px 4px;font-size:15px;line-height:1}.sp-gear i{width:16px;height:16px}',
      '.sp-main{margin-top:10px;font-size:15px;font-weight:700;color:var(--tx);display:flex;align-items:baseline;flex-wrap:wrap;gap:2px 6px}',
      '.sp-num{font-size:38px;font-weight:900;letter-spacing:-1px;color:var(--tx);line-height:1;margin-right:3px}.sp-dot{color:var(--tx3);font-weight:400;margin:0 8px}',
      '.sp-sub{margin-top:8px;font-size:12.5px;color:var(--tx3)}',
      '.sp-cta{display:block;width:100%;margin-top:16px;background:var(--ac);color:#fff;border:0;border-radius:12px;padding:13px 14px;font-size:15px;font-weight:800;cursor:pointer}.sp-cta:active{transform:scale(.99)}',
      '.sp-cta-sub{background:var(--bg3);color:var(--tx);border:1px solid var(--bd)}',
      '.sp-set{text-align:left}.sp-sec{font-size:12px;font-weight:800;color:var(--tx2);letter-spacing:.06em;margin:16px 0 6px}.sp-hint{font-size:12px;color:var(--tx3);margin-bottom:8px;line-height:1.5}',
      '.sp-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid var(--bd)}.sp-row-t b{display:block;font-size:14px}.sp-row-t small{display:block;font-size:11.5px;color:var(--tx3);margin-top:2px;line-height:1.4}',
      '.sp-row-c input,.sp-row-c select{width:88px;padding:8px 10px;border:1px solid var(--bd);border-radius:10px;background:var(--bg);color:var(--tx);font-size:15px;font-weight:700;text-align:center}.sp-row-c select{width:auto;text-align:left;font-weight:600;font-size:13.5px}',
      '.sp-switch{position:relative;display:inline-block;width:44px;height:26px}.sp-switch input{opacity:0;width:0;height:0}.sp-switch span{position:absolute;inset:0;background:var(--bd);border-radius:999px;transition:.2s}.sp-switch span:before{content:"";position:absolute;width:20px;height:20px;left:3px;top:3px;background:#fff;border-radius:50%;transition:.2s;box-shadow:0 1px 3px rgba(0,0,0,.2)}.sp-switch input:checked+span{background:var(--ac)}.sp-switch input:checked+span:before{transform:translateX(18px)}',
      '.sp-lv{border:1px solid var(--bd);border-radius:12px;padding:8px 10px;margin-top:8px;background:var(--bg2)}.sp-lv.dim{opacity:.55}.sp-lv-row{display:flex;align-items:center;gap:8px}',
      '.sp-check{display:flex;align-items:center;gap:8px;font-size:15px}.sp-check input{width:18px;height:18px;accent-color:var(--ac)}.sp-lv-n{flex:1;font-size:12px;color:var(--tx3)}',
      '.sp-lv-btns{display:flex;gap:4px}.sp-lv-btns button{width:30px;height:30px;border:1px solid var(--bd);background:var(--bg);color:var(--tx);border-radius:8px;cursor:pointer;font-size:13px}.sp-lv-btns button:disabled{opacity:.3}',
      '.sp-themes{display:none;flex-wrap:wrap;gap:6px;margin-top:8px}.sp-lv.open .sp-themes{display:flex}.sp-lv.open .sp-exp{transform:rotate(180deg)}',
      '.sp-pitch{font-size:.55em;color:var(--ac2);vertical-align:super;margin-left:3px;font-weight:600}',
      '.sp-chip{border:1px solid var(--ac);background:var(--bg2);color:var(--ac);border-radius:999px;padding:4px 10px;font-size:12px;cursor:pointer}.sp-chip small{opacity:.7}.sp-chip.off{border-color:var(--bd);color:var(--tx3);text-decoration:line-through}'
    ].join('\n');
    document.head.appendChild(st);
  }
  if (document.head) ensureCss();

  root.StudyPlan = { get, set, mode, modeInfo, MODES, goal, setMode, setMinTarget, rhythm, setRhythm, minutesToday, nagLine, sets, plan, buildQueue, sig, greeting, hubCardHtml, openSettings, closeSettings, toggleLevel, moveLevel, toggleTheme, newToday, enabledLevels, LEVELS, pitchOf, pitchMark, voice, setVoice, VOICES };
})(window);
