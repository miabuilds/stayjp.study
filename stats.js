// ========== LEARNING STATS ==========
const Stats = (() => {
  // 通用 toast(全站原本沒有實作 → showToast 呼叫全落空)。中央下方浮現、1.6 秒淡出。
  if (!window.showToast) window.showToast = function (msg) {
    try {
      var el = document.getElementById('_gToast');
      if (!el) { el = document.createElement('div'); el.id = '_gToast';
        el.style.cssText = 'position:fixed;left:50%;bottom:88px;transform:translateX(-50%) translateY(8px);z-index:100002;background:rgba(0,0,0,.82);color:#fff;padding:10px 18px;border-radius:22px;font-size:14px;font-weight:600;font-family:-apple-system,"PingFang TC",sans-serif;box-shadow:0 6px 20px rgba(0,0,0,.28);opacity:0;transition:opacity .2s,transform .2s;pointer-events:none;max-width:80vw;text-align:center';
        document.body.appendChild(el); }
      el.textContent = msg;
      clearTimeout(el._t);
      requestAnimationFrame(function () { el.style.opacity = '1'; el.style.transform = 'translateX(-50%) translateY(0)'; });
      el._t = setTimeout(function () { el.style.opacity = '0'; el.style.transform = 'translateX(-50%) translateY(8px)'; }, 1600);
    } catch (e) {}
  };
  function getHistory() {
    try { return JSON.parse(localStorage.getItem('quiz_history')) || []; } catch(e) { return []; }
  }
  function getSRS() {
    try { return JSON.parse(localStorage.getItem('srs_data')) || {}; } catch(e) { return {}; }
  }

  function open() {
    const box = document.getElementById('quizBox');
    box.innerHTML = buildHTML(true);
    document.getElementById('quizBg').classList.add('show');
  }

  // 內嵌頁面版（用於底部「我的」tab） — 直接灌進 #mn 主內容區、無 modal
  function openProfile() {
    const mn = document.getElementById('mn');
    if (!mn) return;
    document.body.classList.add('profile-view');   // 隱藏左側單字/文法清單(在「我的」無作用)
    document.querySelectorAll('.ftb-btn').forEach(b => b.classList.remove('on'));
    const btns = document.querySelectorAll('.ftb-btn');
    if (btns[3]) btns[3].classList.add('on'); // 「我的」 is index 3
    mn.innerHTML = '<div style="padding:16px;max-width:880px;margin:0 auto">' + buildHTML(false) + '</div>';
    document.getElementById('quizBg').classList.remove('show');
    // 回頂部:從捲到下面的「學習」頁切過來時,舊 scrollY 會被夾到這頁的底 → 看起來像「跳到頁尾」
    try { window.scrollTo(0, 0); } catch (e) {}
  }

  function close() {
    document.getElementById('quizBg').classList.remove('show');
  }

  function buildProfileHero() {
    const _e = (zh, en) => (typeof enOr === 'function' ? enOr((typeof cvt==='function'?cvt(zh):zh), en) : zh);
    // 身分:登入顯示名/頭像;未登入給狸貓+登入引導
    let name = _e('日語學習者', 'Japanese learner'), photo = '', loggedIn = false, email = '';
    try {
      const u = (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth().currentUser : null;
      if (u) { loggedIn = true; name = u.displayName || (u.email || '').split('@')[0] || name; photo = u.photoURL || ''; email = u.email || ''; }
    } catch (e) {}
    // 統計:連續天數(取 streak/日曆較大者)、學習天數、今日動作
    let days = 0, daysLearned = 0, todayN = 0;
    try { if (typeof Streak !== 'undefined' && Streak.effectiveDays) days = Streak.effectiveDays(); } catch (e) {}
    try {
      if (typeof Calendar !== 'undefined' && Calendar.getLog) {
        const log = Calendar.getLog();
        Object.keys(log).forEach(k => { const d = log[k]; if ((d.vocab||0)+(d.grammar||0)+(d.quiz||0) > 0) daysLearned++; });
      }
      if (typeof Calendar !== 'undefined' && Calendar.getTodaySummary) todayN = Calendar.getTodaySummary().total || 0;
    } catch (e) {}
    // 等級與 Premium
    let lv = ''; try { lv = (localStorage.getItem('goal_level') || localStorage.getItem('lastLevel') || '').toUpperCase(); } catch (e) {}
    let prem = false;
    try { prem = !!((window.ToolQuota && ToolQuota.isPremium && ToolQuota.isPremium()) || (window.STAYJP_NATIVE && STAYJP_NATIVE.isPremium)); } catch (e) {}
    const avatar = photo
      ? `<img class="pf-ava" src="${photo}" alt="" referrerpolicy="no-referrer" onerror="this.outerHTML='<img class=\'pf-ava\' src=\'images/mascot/tanuki-p07.png\' alt=\'\'>'">`
      : `<img class="pf-ava pf-ava-tk" src="images/mascot/tanuki-p07.png" alt="">`;
    const badges =
      (lv ? `<span class="pf-badge">${lv}</span>` : '') +
      (prem ? `<span class="pf-badge pf-prem">Premium</span>` : '') +
      (!loggedIn ? `<button class="pf-login" onclick="handleAuth&&handleAuth()">${_e('登入同步進度', 'Sign in to sync')}</button>` : '');
    return `<style>
    .pf-hero{display:flex;align-items:center;gap:14px;background:linear-gradient(135deg,var(--bg2),var(--bg3,var(--bg2)));border:1px solid var(--bd);border-radius:18px;padding:16px;margin-bottom:14px}
    .pf-ava{width:64px;height:64px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid var(--bd);background:var(--soft,rgba(198,85,59,.08))}
    .pf-ava-tk{object-fit:contain;padding:6px}
    .pf-name{font-size:17px;font-weight:800;line-height:1.3;display:flex;align-items:center;gap:8px;flex-wrap:wrap;min-width:0}
    .pf-badge{font-size:10.5px;font-weight:800;color:var(--ac);border:1px solid var(--ac);border-radius:999px;padding:1px 8px}
    .pf-prem{color:#B8860B;border-color:#D4A537;background:rgba(212,165,55,.1)}
    .pf-login{font:inherit;font-size:12px;font-weight:700;color:#fff;background:var(--ac);border:0;border-radius:999px;padding:4px 12px;cursor:pointer}
    .pf-sub{font-size:11.5px;color:var(--tx3);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .pf-stats{display:flex;gap:0;margin-top:10px}
    .pf-stats>div{flex:1;text-align:center;cursor:pointer}
    .pf-stats>div+div{border-left:1px solid var(--bd)}
    .pf-stats b{display:block;font-size:20px;font-weight:800;color:var(--ac)}
    .pf-stats span{font-size:10.5px;color:var(--tx2)}
    </style>
    <div class="pf-hero" onclick="if(window.Streak&&Streak.showInfo)Streak.showInfo()" title="${_e('點擊看學習熱力圖','Tap for study heatmap')}">
      ${avatar}
      <div style="flex:1;min-width:0">
        <div class="pf-name"><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${(name||'').replace(/</g,'&lt;')}</span>${badges}</div>
        ${email ? `<div class="pf-sub">${email.replace(/</g,'&lt;')}</div>` : `<div class="pf-sub">${_e('和狸貓一起,今天也前進一點','One step forward with the tanuki today')}</div>`}
        <div class="pf-stats">
          <div><b><i data-ic=fire></i> ${days}</b><span>${_e('連續天數','Streak')}</span></div>
          <div><b>${daysLearned}</b><span>${_e('學習天數','Days studied')}</span></div>
          <div><b>${todayN}</b><span>${_e('今日動作','Today')}</span></div>
        </div>
      </div>
    </div>`;
  }

  function buildHTML(showCloseBtn) {
    const closeBtn = showCloseBtn ? `<button class="qclose" style="width:auto;margin:0;padding:2px 10px" onclick="Stats.close()"><i data-ic=x></i></button>` : '';
    // 「我的」整頁版不放標題(hero 卡已代表頁面,多一行「我的」很多餘——用戶回饋);彈窗版保留標題+關閉鈕
    let h = showCloseBtn ? `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><h3 style="margin:0">${t('stats_title')}</h3>${closeBtn}</div>` : '';
    // ── 個人 hero 卡(只在「我的」整頁版):狸貓頭像+名字+等級+Premium 標+三格統計 ──
    if (!showCloseBtn) h += buildProfileHero();
    // 3 個 sub-tab：學習統計（總覽+考試紀錄）/ 我的詞庫（生詞本+不熟+錯題）/ 設定
    const wqCnt = getWrongQuestions().length;
    const nbCnt = getNotebook().length;
    // 滿版分段分頁:原本是無樣式預設按鈕放橫向捲動列(連選中態都看不出、字放大更亂)。
    // 改成 flex:1 三等分填滿整列 + 選中態(對齊 JLPT 刷題 .lvtab 樣式);字級放大時
    // white-space:normal 讓文字自動換行不破版,不再擠成一團或出現橫向捲軸。
    h += `<style>
    .stat-tabs{display:flex;gap:6px;margin-bottom:14px}
    .stat-tab{flex:1;min-width:0;text-align:center;font-size:14px;font-weight:700;line-height:1.2;
      border:1px solid var(--bd);background:var(--bg2);color:var(--tx2);
      border-radius:10px;padding:9px 4px;cursor:pointer;white-space:normal}
    .stat-tab.on{background:var(--ac);color:#fff;border-color:var(--ac)}
    </style>`;
    h += '<div class="stat-tabs">';
    h += `<button class="stat-tab on" data-tab="stats" onclick="Stats.switchTab('stats')"><i data-ic=chart></i> 學習統計</button>`;
    h += `<button class="stat-tab" data-tab="collection" onclick="Stats.switchTab('collection')"><i data-ic=book></i> 我的詞庫${nbCnt+wqCnt?` (${nbCnt+wqCnt})`:''}</button>`;
    h += `<button class="stat-tab" data-tab="settings" onclick="Stats.switchTab('settings')"><i data-ic=settings></i> 設定</button>`;
    h += '</div>';
    h += '<div id="statContent">';
    h += buildStatsCombined();
    h += '</div>';
    return h;
  }

  function switchTab(tab) {
    document.querySelectorAll('.stat-tab').forEach(b => {
      b.classList.toggle('on', b.dataset.tab === tab);
    });
    const c = document.getElementById('statContent');
    if (!c) return;
    if (tab === 'stats') c.innerHTML = buildStatsCombined();
    else if (tab === 'collection') c.innerHTML = buildCollectionCombined();
    else if (tab === 'settings') c.innerHTML = buildSettings();
    try { window.scrollTo(0, 0); } catch (e) {}   // 換子分頁也回頂部,不停在上一個分頁的捲動位置
  }

  // 場次錯題回顧:點紀錄列展開(單字測驗;有跡可循,不只看分數)
  function _toggleQh(i) {
    const box = document.getElementById('qhDetail' + i);
    if (!box) return;
    if (box.style.display !== 'none') { box.style.display = 'none'; return; }
    const r = getHistory().slice(-50).reverse()[i];
    if (!r || !r.wrong || !r.wrong.length) return;
    box.innerHTML = r.wrong.map(x =>
      '<div style="display:flex;align-items:center;gap:10px;background:var(--bg2);border:1px solid var(--bd);border-radius:10px;padding:9px 12px;margin:5px 0;font-size:13px">'
      + '<button onclick="event.stopPropagation();if(typeof speak===\'function\')speak(\'' + String(x.w).replace(/'/g,'') + '\')" style="border:0;background:none;cursor:pointer;font-size:15px"><i data-ic=volume></i></button>'
      + '<span><b style="font-size:15px">' + x.w + '</b>' + (x.r && x.r !== x.w ? '<span style="color:var(--ac2);margin-left:6px">' + x.r + '</span>' : '') + '<span style="color:var(--tx2);margin-left:8px">' + (typeof cvt === 'function' ? cvt(x.m || '') : (x.m || '')) + '</span></span>'
      + (x.ch ? '<span style="margin-left:auto;color:var(--wrong,#dc2626);font-size:12px">' + _en2('你答:', 'You: ') + x.ch + '</span>' : '')
      + '</div>').join('');
    box.style.display = 'block';
  }

  // 學習統計 = 總覽（成績圖 + 學習進度） + 新功能紀錄（刷題/AI 跟讀·聊聊） + 考試紀錄
  function buildStatsCombined() {
    return buildScoreChart() + buildProgress() + buildNewFeatures() + buildHistory();
  }

  // ── 新功能紀錄:JLPT 刷題 + AI 跟讀·聊聊(之前「我的」完全看不到這些,像沒在用) ──
  function _en2(zh, en) { try { return (typeof enOr === 'function') ? enOr(zh, en) : zh; } catch (e) { return zh; } }
  function buildNewFeatures() {
    let h = '';
    // JLPT 刷題/模擬考(localStorage jd_hist,同網域共享)
    try {
      const jh = JSON.parse(localStorage.getItem('jd_hist')) || [];
      if (!jh.length) {
        h += `<div class="st-section"><div class="st-title"><i data-ic=target></i> ${_en2('JLPT 刷題', 'JLPT Drills')}</div>
          <div class="st-empty">${_en2('還沒刷過題——1,668 題等你來', 'No drills yet — 1,668 questions are waiting')} <a href="jlpt-drill.html" style="color:var(--ac);font-weight:700">${_en2('去刷題 →', 'Start →')}</a></div></div>`;
      } else {
        const done = jh.reduce((a, x) => a + (x.tot || 0), 0);
        const right = jh.reduce((a, x) => a + (x.s || 0), 0);
        const acc = done ? Math.round(right / done * 100) : 0;
        const rows = jh.slice(0, 5).map(x =>
          `<div style="display:flex;justify-content:space-between;font-size:13px;padding:4px 0;border-bottom:1px solid var(--bd)">
            <span>${x.d}・${String(x.lv).toUpperCase()}・${x.t || ''}</span><span style="font-weight:700">${x.s}/${x.tot}</span></div>`).join('');
        h += `<div class="st-section"><div class="st-title"><i data-ic=target></i> ${_en2('JLPT 刷題', 'JLPT Drills')}
            <a href="jlpt-drill.html" style="float:right;font-size:12.5px;color:var(--ac);font-weight:700">${_en2('繼續刷 →', 'Continue →')}</a></div>
          <div style="font-size:13.5px;margin-bottom:6px">${_en2('累計 ' + done + ' 題・正答率 ' + acc + '%', done + ' questions · ' + acc + '% correct')}</div>
          ${rows}</div>`;
      }
    } catch (e) {}
    // AI 跟讀·聊聊(ai_usage 讀自己的;登入才有)
    h += `<div class="st-section"><div class="st-title"><i data-ic=mic></i> ${_en2('AI 跟讀 / 聊聊', 'AI Shadowing / Chat')}</div>
      <div id="stAiUsage" class="st-empty">${_en2('載入中…', 'Loading…')}</div></div>`;
    setTimeout(fillAiUsage, 50);
    return h;
  }
  function fillAiUsage() {
    const el = document.getElementById('stAiUsage');
    if (!el) return;
    try {
      const u0 = (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth().currentUser : null;
      if (!u0) { el.innerHTML = _en2('登入後可看 AI 對話/評分使用紀錄。', 'Sign in to see your AI chat & scoring records.') + ' <a href="speak-chat.html" style="color:var(--ac);font-weight:700">' + _en2('去試 AI 對話 →', 'Try AI chat →') + '</a>'; return; }
      firebase.firestore().doc('ai_usage/' + u0.uid).get().then(snap => {
        const u = snap.data() || {};
        const d = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
        const chatToday = (u.chatDay && u.chatDay.d === d) ? u.chatDay.n : 0;
        const evalToday = (u.evalDay && u.evalDay.d === d) ? u.evalDay.n : 0;
        // 累計以 Life 欄位為準(2026-08-21 起後端每次使用都 +1;admin 也記)。舊資料退回 Total 估。
        const chatAll = u.chatLife != null ? u.chatLife : ((u.chatTotal || 0) + chatToday);
        const evalAll = u.evalLife != null ? u.evalLife : ((u.evalTotal || 0) + evalToday);
        if (!chatAll && !evalAll) {
          el.innerHTML = _en2('還沒用過——AI 陪你練跟讀和對話,每句都給回饋。', 'Not yet — practice speaking with instant AI feedback.') + ' <a href="speak-chat.html" style="color:var(--ac);font-weight:700">' + _en2('去試 AI 對話 →', 'Try AI chat →') + '</a>';
          return;
        }
        el.classList.remove('st-empty');
        el.innerHTML = '<div style="font-size:13.5px;line-height:2">'
          + '<i data-ic=speak></i> ' + _en2('對話:累計 ' + chatAll + ' 場・今天 ' + chatToday, 'Chat: ' + chatAll + ' total · ' + chatToday + ' today') + '<br><i data-ic=mic></i> ' + _en2('評分:累計 ' + evalAll + ' 次・今天 ' + evalToday, 'Scoring: ' + evalAll + ' total · ' + evalToday + ' today')
          + ' <a href="speak-chat.html" style="color:var(--ac);font-weight:700;margin-left:6px">' + _en2('繼續練 →', 'Keep going →') + '</a></div>';
      }).catch(() => { el.textContent = _en2('紀錄載入失敗', 'Could not load records'); });
    } catch (e) {}
  }
  // 我的詞庫 = 生詞本 + 不熟單字 + 錯題回顧
  function buildCollectionCombined() {
    return buildNotebook() + buildWeakWords() + buildWrongQuestions();
  }

  function buildOverview() {
    return buildScoreChart() + buildProgress();
  }

  // ── 考試紀錄 ──
  function buildHistory() {
    const hist = getHistory();
    if (!hist.length) return `<div class="st-section"><div class="st-title">${t('tab_history')}</div><div class="st-empty">${t('history_empty')}</div></div>`;
    let h = `<div class="st-section"><div class="st-title">${t('history_title')}</div>`;
    h += '<div style="max-height:400px;overflow-y:auto">';
    const recent = hist.slice(-50).reverse();
    recent.forEach((r, i) => {
      const pct = Math.round(r.score / r.total * 100);
      const color = pct >= 80 ? 'var(--correct,#16a34a)' : pct >= 60 ? 'var(--ok-tx,#ca8a04)' : 'var(--wrong,#dc2626)';
      const date = new Date(r.date).toLocaleDateString('zh-TW', {month:'numeric',day:'numeric',hour:'numeric',minute:'numeric'});
      const typeMap = {word2meaning: t('type_ja_zh'), meaning2word: t('type_zh_ja'), reading: t('type_reading')};
      const hasW = r.wrong && r.wrong.length;
      h += '<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--bd);font-size:13px'+(hasW?';cursor:pointer':'')+'"'+(hasW?' onclick="Stats._toggleQh('+i+')"':'')+'>';
      h += '<span style="min-width:35px;font-weight:700;color:'+color+'">'+pct+'%</span>';
      h += '<span style="min-width:28px;font-size:11px;color:var(--ac2);font-weight:600">'+r.level.toUpperCase()+'</span>';
      h += '<span style="flex:1;color:var(--tx2);font-size:12px">'+(typeMap[r.type]||r.type)+'</span>';
      h += '<span style="font-size:11px;color:var(--tx3)">'+r.score+'/'+r.total+'</span>';
      h += '<span style="font-size:10px;color:var(--tx3)">'+date+'</span>';
      if (hasW) h += '<span style="font-size:11px;color:var(--ac)">▾'+_en2('看錯題','review')+'</span>';
      h += '</div>';
      if (hasW) h += '<div id="qhDetail'+i+'" style="display:none;padding:4px 0 10px"></div>';
    });
    h += '</div></div>';
    // 錯題重考按鈕
    h += `<button class="qstart" style="margin-top:12px" onclick="Stats.retryWrong()">${t('retry_wrong')}</button>`;
    return h;
  }

  // 錯題重考 — 從 SRS 中找答錯最多的
  function retryWrong() {
    const srs = getSRS();
    const wrong = [];
    Object.entries(srs).forEach(([key, val]) => {
      if (val.reviews > 0 && val.correct < val.reviews) {
        const parts = key.split(':');
        const lv = parts[0];
        const word = parts.slice(1).join(':');
        const vocab = getVocabData(lv).find(v => v.w === word);
        if (vocab) wrong.push({ vocab, lv, wrongCount: val.reviews - val.correct });
      }
    });
    if (!wrong.length) { alert(t('no_wrong')); return; }
    wrong.sort((a, b) => b.wrongCount - a.wrongCount);
    const picked = wrong.slice(0, 20);
    const allVocab = [...getVocabData('n5'), ...getVocabData('n4'), ...getVocabData('n3'), ...getVocabData('n2'), ...getVocabData('n1')];
    const qs = picked.map(({ vocab, lv }) => {
      const pool = allVocab.filter(d => d.m !== vocab.m).sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [vocab, ...pool].sort(() => Math.random() - 0.5);
      return { word: vocab, options, correctIdx: options.indexOf(vocab), level: lv };
    });
    Stats._wqState = { questions: qs, cur: 0, score: 0, results: [] };
    _renderWQ();
  }

  // ── 生詞本 ──
  function getNotebook() {
    try { return JSON.parse(localStorage.getItem('word_notebook')) || []; } catch(e) { return []; }
  }
  function saveNotebook(nb) { localStorage.setItem('word_notebook', JSON.stringify(nb)); if (typeof saveAllCloud === 'function') saveAllCloud(); }

  function addToNotebook(w, r, m, lv, silent) {
    const nb = getNotebook();
    if (nb.find(x => x.w === w && x.lv === lv)) return false; // already exists
    nb.push({ w, r, m, lv, added: new Date().toISOString() });
    saveNotebook(nb);
    if (!silent) alert(t('added_to_notebook', { w }));   // silent=true → 由呼叫端自行用 toast 提示
    return true;
  }

  function removeFromNotebook(w, lv) {
    let nb = getNotebook();
    nb = nb.filter(x => !(x.w === w && x.lv === lv));
    saveNotebook(nb);
    switchTab('collection');
  }

  function buildNotebook() {
    const nb = getNotebook();
    let h = `<div class="st-section"><div class="st-title">${t('notebook_title')} <span style="font-weight:400;font-size:12px;color:var(--tx2)">${t('notebook_count', { n: nb.length })}</span></div>`;
    if (!nb.length) {
      h += `<div class="st-empty">${t('notebook_empty').replace(/\n/g, '<br>')}</div>`;
    } else {
      h += '<div style="max-height:350px;overflow-y:auto">';
      nb.forEach(w => {
        h += '<div class="st-weak-item">';
        h += '<span class="st-weak-word">' + w.w + '</span>';
        h += '<span class="st-weak-reading">' + (w.w !== w.r ? w.r : '') + '</span>';
        h += '<span class="st-weak-meaning">' + (typeof cvt==='function'?cvt(w.m):w.m) + '</span>';
        h += '<span class="st-weak-lv">' + w.lv.toUpperCase() + '</span>';
        h += '<button style="background:none;border:none;color:var(--wrong,#dc2626);cursor:pointer;font-size:12px;padding:2px 4px" onclick="Stats.removeFromNotebook(\'' + w.w.replace(/'/g, "\\'") + '\',\'' + w.lv + '\')"><i data-ic=x></i></button>';
        h += '</div>';
      });
      h += '</div>';
      h += '<div style="display:flex;gap:8px;margin-top:12px">';
      h += `<button class="qstart" style="flex:1" onclick="Stats.quizNotebook()">${t('notebook_quiz')}</button>`;
      h += `<button class="qclose" style="flex:1" onclick="Stats.reviewNotebook()">${t('notebook_review')}</button>`;
      h += '</div>';
    }
    h += '</div>';
    return h;
  }

  function quizNotebook() {
    const nb = getNotebook();
    if (nb.length < 4) { alert(t('notebook_min')); return; }
    const allVocab = [...getVocabData('n5'), ...getVocabData('n4'), ...getVocabData('n3'), ...getVocabData('n2'), ...getVocabData('n1')];
    const picked = [...nb].sort(() => Math.random() - 0.5).slice(0, 20);
    const qs = picked.map(item => {
      const vocab = { w: item.w, r: item.r, m: item.m, c: '' };
      const pool = allVocab.filter(d => d.m !== vocab.m).sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [vocab, ...pool].sort(() => Math.random() - 0.5);
      return { word: vocab, options, correctIdx: options.indexOf(vocab), level: item.lv };
    });
    Stats._wqState = { questions: qs, cur: 0, score: 0, results: [] };
    _renderWQ();
  }

  function reviewNotebook() {
    const nb = getNotebook();
    if (!nb.length) { alert(t('notebook_empty_alert')); return; }
    document.getElementById('quizBg').classList.add('show');   // 我的頁 inline → 須開 overlay 才看得到逐一複習卡
    let cur = 0;
    function renderCard() {
      const item = nb[cur];
      document.getElementById('quizBox').innerHTML = `
        <div class="qhd"><span>${t('nb_progress', { cur: cur+1, total: nb.length })}</span><button class="qclose" style="width:auto;margin:0;padding:2px 10px" onclick="Stats.close()"><i data-ic=x></i></button></div>
        <div class="srs-card" onclick="this.querySelector('#nbBack').style.display='';this.querySelector('#nbFront').style.display='none'">
          <div id="nbFront"><div class="qmain">${item.w}</div>${item.w!==item.r?'<div class="qsub">'+item.r+'</div>':''}<div class="srs-hint">${t('flip_hint')}</div></div>
          <div id="nbBack" style="display:none"><div class="qmain">${item.w}</div>${item.w!==item.r?'<div class="qsub">'+item.r+'</div>':''}<div class="srs-meaning">${typeof cvt==='function'?cvt(item.m):item.m}</div>
            <div class="srs-btns">
              <button class="srs-btn srs-hard" onclick="event.stopPropagation();Stats._nbNext()">${t('nb_next')}</button>
              <button class="srs-btn srs-ok" onclick="event.stopPropagation();Stats.removeFromNotebook('${item.w.replace(/'/g,"\\'")}','${item.lv}');Stats._nbNext()">${t('nb_remove')}</button>
            </div>
          </div>
        </div>`;
    }
    Stats._nbNext = function() { cur++; if (cur >= nb.length) { open(); } else { renderCard(); } };
    renderCard();
  }

  // ── 測驗成績走勢 ──
  function buildScoreChart() {
    const hist = getHistory();
    if (!hist.length) return `<div class="st-section"><div class="st-title">${t('score_title')}</div><div class="st-empty">${t('score_empty')}</div></div>`;

    const last20 = hist.slice(-20);
    const pcts = last20.map(h => Math.round(h.score / h.total * 100));
    const avg = Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length);
    const max = Math.max(...pcts);
    const recent = pcts[pcts.length - 1];

    // SVG 折線圖 — 用 HTML 包 SVG，避免 viewBox 拉伸時字體變超大
    const minPct = Math.min(...pcts);
    const maxPct = Math.max(...pcts);
    const baseline = Math.max(0, minPct - 5);
    const top = Math.min(100, maxPct + 2);
    const range = Math.max(top - baseline, 1);
    const lastP = pcts[pcts.length - 1];
    const lineColor = lastP >= 80 ? '#16a34a' : lastP >= 60 ? '#ca8a04' : '#dc2626';
    // SVG line in non-uniform stretch space
    const W = 100, H = 100;
    const n = pcts.length;
    const xStep = n > 1 ? W / (n - 1) : 0;
    const pts = pcts.map((p, i) => {
      const x = i * xStep;
      const y = H - ((p - baseline) / range) * H;
      return { x, y, p, item: last20[i] };
    });
    const pointsStr = pts.map(o => `${o.x.toFixed(2)},${o.y.toFixed(2)}`).join(' ');
    // 面積填色路徑：折線 + 底部閉合
    const areaPath = `M0,${H} L${pointsStr.split(' ').join(' L')} L${W},${H} Z`;
    // SVG 只畫線跟面積。圓點改用 HTML div 絕對定位、避免 SVG 拉伸變橢圓
    const dotsHtml = pts.map(o => {
      const color = o.p >= 80 ? '#16a34a' : o.p >= 60 ? '#ca8a04' : '#dc2626';
      const date = new Date(o.item.date).toLocaleDateString('zh-TW', {month:'numeric',day:'numeric'});
      return `<div style="position:absolute;left:${o.x}%;top:${o.y}%;width:8px;height:8px;margin:-4px 0 0 -4px;border-radius:50%;background:#fff;border:1.5px solid ${color};box-sizing:border-box" title="${date} ${o.item.level.toUpperCase()} ${o.p}%"></div>`;
    }).join('');
    const bars = `
      <div style="position:relative;height:130px;margin:8px 0 4px;padding-right:36px">
        <div style="position:absolute;left:0;right:36px;top:0;bottom:0">
          <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" style="width:100%;height:100%;display:block">
            <defs><linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="${lineColor}" stop-opacity="0.18"/>
              <stop offset="100%" stop-color="${lineColor}" stop-opacity="0"/>
            </linearGradient></defs>
            <line x1="0" y1="0" x2="${W}" y2="0" stroke="var(--bd)" stroke-width="0.4" vector-effect="non-scaling-stroke"/>
            <line x1="0" y1="${H/2}" x2="${W}" y2="${H/2}" stroke="var(--bd)" stroke-width="0.4" vector-effect="non-scaling-stroke"/>
            <line x1="0" y1="${H}" x2="${W}" y2="${H}" stroke="var(--bd)" stroke-width="0.4" vector-effect="non-scaling-stroke"/>
            <path d="${areaPath}" fill="url(#scoreGrad)"/>
            <polyline points="${pointsStr}" fill="none" stroke="${lineColor}" stroke-width="1.4" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
          </svg>
          ${dotsHtml}
        </div>
        <div style="position:absolute;right:0;top:-6px;font-size:11px;color:var(--tx3);line-height:1">${top}%</div>
        <div style="position:absolute;right:0;top:calc(50% - 6px);font-size:11px;color:var(--tx3);line-height:1">${Math.round((top+baseline)/2)}%</div>
        <div style="position:absolute;right:0;bottom:-6px;font-size:11px;color:var(--tx3);line-height:1">${baseline}%</div>
      </div>`;

    return `<div class="st-section"><div class="st-title">${t('score_title')}</div>${bars}` +
      `<div class="st-row"><span>${t('score_recent', { n: recent })}</span><span>${t('score_avg', { n: avg })}</span><span>${t('score_high', { n: max })}</span><span>${t('score_total', { n: hist.length })}</span></div></div>`;
  }

  // ── 學習進度 ──
  function buildProgress() {
    const srs = getSRS();
    const levels = ['n5', 'n4', 'n3', 'n2', 'n1'];
    let h = `<div class="st-section"><div class="st-title">${t('progress_title')}</div>`;

    levels.forEach(lv => {
      const total = getVocabData(lv).length;
      if (!total) return;
      const entries = Object.entries(srs).filter(([k]) => k.startsWith(lv + ':'));
      const learned = entries.length;
      const mastered = entries.filter(([, v]) => v.interval >= 21).length;
      const learning = entries.filter(([, v]) => v.interval > 0 && v.interval < 21).length;
      const pct = total ? Math.round(learned / total * 100) : 0;
      const masteredPct = total ? Math.round(mastered / total * 100) : 0;

      h += '<div class="st-prog">' +
        '<div class="st-prog-hd"><span class="st-prog-lv">' + lv.toUpperCase() + '</span>' +
        '<span class="st-prog-num">' + learned + ' / ' + total + '</span></div>' +
        '<div class="st-prog-bar"><div class="st-prog-fill st-prog-mastered" style="width:' + masteredPct + '%"></div>' +
        '<div class="st-prog-fill st-prog-learning" style="width:' + (pct - masteredPct) + '%"></div></div>' +
        '<div class="st-prog-legend">' +
        `<span class="st-leg"><span class="st-dot st-dot-mastered"></span>${t('mastered', { n: mastered })}</span>` +
        `<span class="st-leg"><span class="st-dot st-dot-learning"></span>${t('learning', { n: learning })}</span>` +
        `<span class="st-leg"><span class="st-dot st-dot-new"></span>${t('unlearned', { n: total - learned })}</span>` +
        '</div></div>';
    });

    h += '</div>';
    return h;
  }

  // ── 弱點單字 ──
  function buildWeakWords() {
    const srs = getSRS();
    const weak = [];

    Object.entries(srs).forEach(([key, val]) => {
      if (val.reviews >= 2) {
        const rate = Math.round(val.correct / val.reviews * 100);
        if (rate < 70) {
          const parts = key.split(':');
          const lv = parts[0];
          const word = parts.slice(1).join(':');
          const vocab = getVocabData(lv).find(v => v.w === word);
          if (vocab) weak.push({ ...vocab, level: lv, rate, reviews: val.reviews });
        }
      }
    });

    weak.sort((a, b) => a.rate - b.rate);
    const top20 = weak.slice(0, 20);

    if (!top20.length) {
      return `<div class="st-section"><div class="st-title">${t('weak_title')}</div>` +
        `<div class="st-empty">${t('weak_empty')}</div></div>`;
    }

    let h = `<div class="st-section"><div class="st-title">${t('weak_title')} <span style="font-weight:400;font-size:12px;color:#64748B">${t('weak_subtitle')}</span></div>`;
    h += '<div class="st-weak-list">';
    top20.forEach(w => {
      const rateColor = w.rate < 40 ? '#dc2626' : '#ca8a04';
      h += '<div class="st-weak-item">' +
        '<span class="st-weak-word">' + w.w + '</span>' +
        '<span class="st-weak-reading">' + (w.w !== w.r ? w.r : '') + '</span>' +
        '<span class="st-weak-meaning">' + (typeof cvt==='function'?cvt(w.m):w.m) + '</span>' +
        '<span class="st-weak-rate" style="color:' + rateColor + '">' + w.rate + '%</span>' +
        '<span class="st-weak-lv">' + w.level.toUpperCase() + '</span></div>';
    });
    h += '</div>';

    if (weak.length > 0) {
      h += `<button class="qstart" style="margin-top:12px" onclick="Stats.quizWeak()">${t('weak_quiz', { n: Math.min(weak.length, 20) })}</button>`;
    }
    h += '</div>';
    return h;
  }

  // 弱點測驗
  function quizWeak() {
    const srs = getSRS();
    const weak = [];
    Object.entries(srs).forEach(([key, val]) => {
      if (val.reviews >= 1) {
        const rate = val.reviews > 0 ? val.correct / val.reviews : 0;
        if (rate < 0.7) {
          const parts = key.split(':');
          const lv = parts[0];
          const word = parts.slice(1).join(':');
          const vocab = getVocabData(lv).find(v => v.w === word);
          if (vocab) weak.push({ vocab, lv });
        }
      }
    });
    if (!weak.length) { alert(t('weak_none')); return; }

    close();
    const count = Math.min(weak.length, 20);
    const picked = weak.sort(() => Math.random() - 0.5).slice(0, count);
    const allVocab = [...getVocabData('n5'), ...getVocabData('n4'), ...getVocabData('n3'), ...getVocabData('n2'), ...getVocabData('n1')];
    const qs = picked.map(({ vocab, lv }) => {
      const pool = allVocab.filter(d => d.m !== vocab.m).sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [vocab, ...pool].sort(() => Math.random() - 0.5);
      return { word: vocab, options, correctIdx: options.indexOf(vocab), level: lv };
    });

    Stats._wqState = { questions: qs, cur: 0, score: 0, results: [] };
    document.getElementById('quizBg').classList.add('show');
    _renderWQ();
  }

  function _renderWQ() {
    // 我的頁是 inline 渲染(會隱藏 quizBg),這裡務必把測驗 overlay 打開,否則寫進 quizBox 卻看不到 = 沒反應
    document.getElementById('quizBg').classList.add('show');
    const s = Stats._wqState;
    const q = s.questions[s.cur];
    document.getElementById('quizBox').innerHTML = `
      <div class="qhd"><span>${t('weak_progress', { cur: s.cur+1, total: s.questions.length })}</span><span>${t('quiz_score', { n: s.score })}</span><button class="qclose" style="width:auto;margin:0;padding:2px 10px" onclick="document.getElementById('quizBg').classList.remove('show')"><i data-ic=x></i></button></div>
      <div class="qprompt"><div class="qmain">${q.word.r || q.word.w}</div></div>
      <div class="qopts">${q.options.map((o, i) => '<button class="qopt" onclick="Stats._answerWeak(' + i + ')">' + (typeof cvt==='function'?cvt(o.m):o.m) + '</button>').join('')}</div>`;
  }

  function _answerWeak(idx) {
    const s = Stats._wqState;
    const q = s.questions[s.cur];
    try { if (q.word && typeof speak === 'function') speak(q.word.w); } catch (e) {}   // 答題即唸,字+聲同時加深
    const correct = idx === q.correctIdx;
    if (correct) s.score++;
    s.results.push({ word: q.word, correct, chosenIdx: idx, correctIdx: q.correctIdx, options: q.options });
    if (typeof SRS !== 'undefined' && SRS.record) SRS.record(q.level, q.word.w, correct);

    const opts = document.querySelectorAll('.qopt');
    opts.forEach((b, i) => { b.disabled = true; if (i === q.correctIdx) b.classList.add('qcorrect'); if (i === idx && !correct) b.classList.add('qwrong'); });

    setTimeout(() => {
      s.cur++;
      if (s.cur >= s.questions.length) {
        const pct = Math.round(s.score / s.questions.length * 100);
        document.getElementById('quizBox').innerHTML = `
          <h3>${t('weak_result')}</h3>
          <div class="qscore ${pct>=80?'good':pct>=60?'ok':'bad'}">${s.score} / ${s.questions.length}（${pct}%）</div>
          <div class="qresults">${s.results.map(r => r.correct
            ? '<div class="qr ok"><span class="qrc"><i data-ic=check></i></span> '+r.word.w+' — '+r.word.m+'</div>'
            : `<div class="qr ng"><span class="qrc"><i data-ic=x></i></span> ${r.word.w} — ${t('quiz_you_chose', { chose: r.options[r.chosenIdx].m, correct: r.word.m })}</div>`
          ).join('')}</div>
          <div class="qactions"><button class="qstart" onclick="Stats.quizWeak()">${t('try_again')}</button><button class="qclose" onclick="Stats.open()">${t('back_to_stats')}</button></div>`;
      } else {
        _renderWQ();
      }
    }, correct ? 500 : 1000);
  }

  // ── 設定 tab（統一設定中心：字級/主題/語速/程度目標/提醒 全集中此處，原位置也保留）──
  function _lsGet(k, d){ try { return localStorage.getItem(k) || d; } catch(e){ return d; } }
  function buildSettings() {
    const curSpeed = (typeof getTtsSpeed === 'function' ? getTtsSpeed() : 1).toFixed(2).replace(/\.?0+$/, '');
    const speedVal = typeof getTtsSpeed === 'function' ? getTtsSpeed() : 1;
    const fs = _lsGet('fontSize','normal');
    const isDark = (typeof document!=='undefined') && document.documentElement.getAttribute('data-theme')==='dark';
    const base = _lsGet('base_level','none'), goal = _lsGet('goal_level','');
    const isApp = !!(window.STAYJP_NATIVE && window.STAYJP_NATIVE.isNativeApp);
    const rmOn = _lsGet('reminder_time_pref','');
    const box = 'background:var(--bg2);border-radius:12px;padding:16px;margin-bottom:12px';
    const seg = 'display:flex;gap:6px;flex-wrap:wrap';
    const chip = (on)=>'flex:1;min-width:72px;text-align:center;padding:9px 6px;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;border:1px solid '+(on?'var(--ac)':'var(--bd)')+';background:'+(on?'var(--ac)':'transparent')+';color:'+(on?'#fff':'var(--tx)');
    const LVN=['none','n5','n4','n3','n2'], LVL={none:'零基礎',n5:'N5',n4:'N4',n3:'N3',n2:'N2'};
    const GLN=['n5','n4','n3','n2','n1'];
    return `
      <div style="${box}">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px"><span style="font-size:16px"><i data-ic=book></i></span><span style="font-weight:600;color:var(--tx)">文字大小</span></div>
        <div style="${seg}">
          ${FS_OPTS.map(o=>`<button style="${chip(fs===o.k)}" onclick="Stats._setFont('${o.k}',this)">${o.n}</button>`).join('')}
        </div>
      </div>
      <div style="${box}">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px"><span style="font-size:16px"><i data-ic=moon></i></span><span style="font-weight:600;color:var(--tx)">主題</span></div>
        <div style="${seg}">
          <button style="${chip(!isDark)}" onclick="Stats._setTheme('light',this)"><i data-ic=sun></i> 淺色</button>
          <button style="${chip(isDark)}" onclick="Stats._setTheme('dark',this)"><i data-ic=moon></i> 深色</button>
        </div>
      </div>
      <div style="${box}">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
          <span style="font-size:16px"><i data-ic=volume></i></span><span style="font-weight:600;color:var(--tx)">語速</span>
          <span style="margin-left:auto;font-variant-numeric:tabular-nums;color:var(--ac);font-weight:600" id="ttsSpeedLabel">${curSpeed}x</span>
        </div>
        <input type="range" id="ttsSpeedSlider" min="0.5" max="1.5" step="0.05" value="${speedVal}" style="width:100%;display:block" oninput="setTtsSpeed(this.value)">
        <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--tx3);margin-top:4px"><span>0.5x 慢</span><span>1.0x 標準</span><span>1.5x 快</span></div>
      </div>
      <div style="${box}">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px"><span style="font-size:16px"><i data-ic=target></i></span><span style="font-weight:600;color:var(--tx)">我的程度</span></div>
        <div style="font-size:12px;color:var(--tx2);margin-bottom:10px">背單字會跳過你已學完的級數</div>
        <div style="${seg}">${LVN.map(k=>`<button style="${chip(base===k)}" onclick="Stats._setLevel('base','${k}',this)">${LVL[k]}</button>`).join('')}</div>
        <div style="display:flex;align-items:center;gap:8px;margin:14px 0 10px"><span style="font-size:16px">🏁</span><span style="font-weight:600;color:var(--tx)">目標考級</span></div>
        <div style="${seg}">${GLN.map(k=>`<button style="${chip(goal===k)}" onclick="Stats._setLevel('goal','${k}',this)">${k.toUpperCase()}</button>`).join('')}</div>
      </div>
      ${isApp ? `<div style="${box}">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px"><span style="font-size:16px"><i data-ic=clock></i></span><span style="font-weight:600;color:var(--tx)">每日提醒</span>${rmOn?`<span style="margin-left:auto;font-size:12px;color:var(--ac);font-weight:600">已開 ${rmOn}</span>`:''}</div>
        <div style="display:flex;align-items:center;gap:10px">
          <input type="time" id="setRmTime" value="${rmOn||'20:00'}" style="font-size:17px;padding:7px 10px;border:1px solid var(--bd);border-radius:10px;background:var(--bg);color:var(--tx)">
          <button style="flex:1;padding:9px;border-radius:10px;border:none;background:var(--ac);color:#fff;font-weight:700;cursor:pointer" onclick="Stats._setReminder()">${rmOn?'更新提醒':'開啟提醒'}</button>
          ${rmOn?`<button style="padding:9px 12px;border-radius:10px;border:1px solid var(--bd);background:transparent;color:var(--tx2);cursor:pointer" onclick="Stats._clearReminder()">關閉</button>`:''}
        </div>
      </div>` : ''}
      <a href="account.html" style="display:flex;align-items:center;gap:12px;padding:14px 16px;background:var(--bg2);border-radius:12px;color:var(--tx);text-decoration:none;margin-bottom:12px">
        <span style="font-size:20px"><i data-ic=user></i></span><div style="flex:1"><div style="font-weight:600">我的帳號</div><div style="font-size:12px;color:var(--tx2);margin-top:2px">訂閱・登入・推薦碼</div></div><span style="color:var(--tx3)">›</span>
      </a>
      ${_OLD_SETTINGS_TAIL}`;
  }
  const FS_OPTS = [{k:'normal',n:'標準 A'},{k:'large',n:'大 A+'},{k:'xlarge',n:'特大 A++'}];
  const _OLD_SETTINGS_TAIL = `
      <a href="contact.html" style="display:flex;align-items:center;gap:12px;padding:14px 16px;background:var(--bg2);border-radius:12px;color:var(--tx);text-decoration:none">
        <span style="font-size:20px"><i data-ic=chat></i></span>
        <div style="flex:1"><div style="font-weight:600">意見回饋 / 回報錯誤</div><div style="font-size:12px;color:var(--tx2);margin-top:2px">內容有誤或想提建議都歡迎</div></div><span style="color:var(--tx3)">›</span>
      </a>`
  // 設定中心的 setter：呼叫既有全域函數(維持與 header/原位置同一套狀態),改完就地重畫設定 tab
  // 就地把選取樣式套到這顆、同組其他顆還原(不整頁重畫→不跳走、不丟捲動位置,可連續設定多項)
  function _markChip(el){ if(!el||!el.parentNode)return; [...el.parentNode.children].forEach(b=>{ b.style.border='1px solid var(--bd)'; b.style.background='transparent'; b.style.color='var(--tx)'; }); el.style.border='1px solid var(--ac)'; el.style.background='var(--ac)'; el.style.color='#fff'; }
  function _setFont(k,el){ try{ localStorage.setItem('fontSize',k); }catch(e){} if(typeof applyFontSize==='function')applyFontSize(); _markChip(el); if(typeof showToast==='function')showToast('文字大小已更新'); }
  function _setTheme(mode,el){ const isDark=document.documentElement.getAttribute('data-theme')==='dark'; if((mode==='dark')!==isDark && typeof toggleTheme==='function') toggleTheme(); _markChip(el); if(typeof showToast==='function')showToast('主題已切換'); }
  function _setLevel(kind,v,el){ try{ localStorage.setItem(kind==='base'?'base_level':'goal_level', v); }catch(e){} if(typeof saveAllCloud==='function')saveAllCloud(); _markChip(el); if(typeof showToast==='function')showToast(kind==='base'?'程度已更新':'目標考級已更新'); }
  function _setReminder(){ const t=document.getElementById('setRmTime'); if(!t)return; if(typeof enableDailyReminder==='function')enableDailyReminder(t.value); else { try{ localStorage.setItem('reminder_time_pref',t.value); }catch(e){} } if(typeof showToast==='function')showToast('提醒已設 '+t.value); }
  function _clearReminder(){ try{ localStorage.removeItem('reminder_time_pref'); }catch(e){}
    try{ if(window.STAYJP_NATIVE && window.STAYJP_NATIVE.isNativeApp && window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify({type:'SET_REMINDER',payload:{time:'',cancel:true}})); }catch(e){}
    switchTab('settings'); if(typeof showToast==='function')showToast('提醒已關閉'); }

  // ── 錯題回顧（聽力 / 閱讀 / 模考） ──
  function getWrongQuestions() {
    try { return JSON.parse(localStorage.getItem('wrong_questions')) || []; } catch(e) { return []; }
  }
  function saveWrongQuestions(arr) {
    localStorage.setItem('wrong_questions', JSON.stringify(arr));
    if (typeof saveAllCloud === 'function') saveAllCloud();
  }
  function addWrongQuestion(entry) {
    if (!entry || !entry.mode || !entry.id) return;
    const arr = getWrongQuestions();
    const i = arr.findIndex(x => x.mode === entry.mode && x.id === entry.id);
    const rec = { ts: Date.now(), ...entry };
    if (i > -1) arr[i] = { ...arr[i], ...rec }; else arr.push(rec);
    saveWrongQuestions(arr);
  }
  function removeWrongQuestion(mode, id) {
    const arr = getWrongQuestions().filter(x => !(x.mode === mode && x.id === id));
    saveWrongQuestions(arr);
    switchTab('collection');
  }

  function buildWrongQuestions() {
    const arr = getWrongQuestions().slice().sort((a,b) => (b.ts||0) - (a.ts||0));
    let h = `<div class="st-section"><div class="st-title">錯題回顧 <span style="font-weight:400;font-size:12px;color:var(--tx2)">（${arr.length} 題）</span></div>`;
    if (!arr.length) {
      h += `<div class="st-empty">還沒有錯題。<br>聽力、閱讀、模考答錯時會自動收進這裡。</div>`;
    } else {
      const modeLbl = { listening: '<i data-ic=headphones></i> 聽力', reading: '<i data-ic=book></i> 閱讀', mock: '<i data-ic=edit></i> 模考' };
      const modeColor = { listening: '#2563EB', reading: '#16a34a', mock: '#9333EA' };
      h += '<div style="max-height:400px;overflow-y:auto;display:flex;flex-direction:column;gap:8px">';
      arr.forEach(w => {
        const lbl = modeLbl[w.mode] || w.mode;
        const col = modeColor[w.mode] || 'var(--ac)';
        const lv = (w.level||'').toUpperCase();
        const opts = (w.options || []).map((o, i) => {
          const isCorrect = i === w.correctIdx;
          const isUser = i === w.userIdx;
          let style = 'padding:4px 8px;border-radius:6px;font-size:12px;margin:2px 0;';
          if (isCorrect) style += 'background:rgba(22,163,74,.15);color:var(--correct,#16a34a);font-weight:600;';
          else if (isUser) style += 'background:rgba(220,38,38,.12);color:var(--wrong,#dc2626);text-decoration:line-through;';
          else style += 'color:var(--tx2);';
          const mark = isCorrect ? '<i data-ic=check></i> ' : (isUser ? '<i data-ic=x></i> ' : '　');
          return `<div style="${style}">${mark}${o}</div>`;
        }).join('');
        h += `<div style="border:1px solid var(--bd);border-radius:8px;padding:10px;background:var(--bg2)">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <span style="font-size:11px;font-weight:700;color:${col}">${lbl}</span>
            ${lv?`<span style="font-size:11px;font-weight:600;color:var(--ac2)">${lv}</span>`:''}
            <span style="flex:1"></span>
            <button style="background:none;border:none;color:var(--wrong,#dc2626);cursor:pointer;font-size:12px;padding:2px 4px" onclick="Stats.removeWrongQuestion('${w.mode}','${(w.id+'').replace(/'/g,"\\'")}')"><i data-ic=x></i></button>
          </div>
          ${w.text ? `<div style="font-size:13px;color:var(--tx2);line-height:1.6;margin-bottom:6px;white-space:pre-wrap;max-height:120px;overflow:auto">${w.text}</div>` : ''}
          <div style="font-size:13px;font-weight:600;color:var(--tx);margin-bottom:4px">${w.q || ''}</div>
          ${opts}
        </div>`;
      });
      h += '</div>';
      h += `<div style="display:flex;gap:8px;margin-top:12px">
        <button class="qstart" style="flex:1" onclick="Stats.quizWrongQuestions()"><i data-ic=refresh></i> 重考全部 (${arr.length})</button>
      </div>`;
      h += `<div style="margin-top:10px;font-size:11px;color:var(--tx3)">提示：聽力/閱讀/模考非單字題答錯會自動加入這裡。單字答錯仍會進「生詞本」。</div>`;
    }
    h += '</div>';
    return h;
  }

  // ── 錯題重考 ──
  let _wq = null;  // {arr, cur, correct}
  function quizWrongQuestions() {
    const arr = getWrongQuestions().slice().sort(() => Math.random() - 0.5);
    if (!arr.length) { alert('沒有錯題可考'); return; }
    _wq = { arr, cur: 0, correct: 0 };
    document.getElementById('quizBg').classList.add('show');
    _renderWrongQ();
  }
  function _renderWrongQ() {
    const w = _wq.arr[_wq.cur];
    const modeLbl = { listening: '<i data-ic=headphones></i> 聽力', reading: '<i data-ic=book></i> 閱讀', mock: '<i data-ic=edit></i> 模考' };
    document.getElementById('quizBox').innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <span style="font-size:12px;color:var(--tx2)">${modeLbl[w.mode]||w.mode} · ${(w.level||'').toUpperCase()} · ${_wq.cur+1}/${_wq.arr.length}</span>
        <button class="qclose" style="width:auto;margin:0;padding:2px 10px" onclick="Stats.open()"><i data-ic=x></i></button>
      </div>
      ${w.text?`<div style="font-size:13px;color:var(--tx2);line-height:1.6;margin-bottom:10px;white-space:pre-wrap;max-height:180px;overflow:auto;background:var(--bg2);padding:10px;border-radius:8px">${w.text}</div>`:''}
      <div style="font-size:15px;font-weight:600;margin:10px 0">${w.q||''}</div>
      <div class="qopts" id="wqOpts">${(w.options||[]).map((o,i)=>`<button class="qopt" onclick="Stats._wqAnswer(${i})">${o}</button>`).join('')}</div>
      <div id="wqNav" style="margin-top:12px"></div>`;
  }
  function _wqAnswer(i) {
    const w = _wq.arr[_wq.cur];
    try { if (typeof speak === 'function') speak(w.w || w.word); } catch (e) {}   // 答題即唸
    const ok = i === w.correctIdx;
    if (ok) _wq.correct++;
    document.querySelectorAll('#wqOpts .qopt').forEach((b, idx) => {
      b.disabled = true;
      if (idx === w.correctIdx) b.classList.add('qcorrect');
      if (idx === i && !ok) b.classList.add('qwrong');
    });
    const last = _wq.cur >= _wq.arr.length - 1;
    const rmBtn = ok
      ? `<button class="qclose" style="margin-right:8px" onclick="Stats._wqRemoveAndNext()"><i data-ic=check></i> 移出錯題本</button>`
      : '';
    document.getElementById('wqNav').innerHTML = rmBtn +
      `<button class="qstart" onclick="Stats._wqNext()">${last?'看結果':'下一題'}</button>`;
  }
  function _wqRemoveAndNext() {
    const w = _wq.arr[_wq.cur];
    const cur = getWrongQuestions().filter(x => !(x.mode === w.mode && x.id === w.id));
    saveWrongQuestions(cur);
    _wqNext();
  }
  function _wqNext() {
    if (_wq.cur >= _wq.arr.length - 1) {
      const pct = Math.round(_wq.correct / _wq.arr.length * 100);
      const col = pct >= 80 ? '#16a34a' : pct >= 60 ? '#ca8a04' : '#dc2626';
      document.getElementById('quizBox').innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><span style="font-size:14px;font-weight:600">錯題重考結果</span><button class="qclose" style="width:auto;margin:0;padding:2px 10px" onclick="Stats.open()">✕</button></div>
        <div style="text-align:center;padding:24px 0"><div style="font-size:48px;font-weight:700;color:${col}">${pct}%</div><div style="color:var(--tx2);margin-top:4px">${_wq.correct} / ${_wq.arr.length}</div></div>
        <div style="display:flex;gap:8px">
          <button class="qstart" style="flex:1" onclick="Stats.quizWrongQuestions()"><i data-ic=refresh></i> 再考一次</button>
          <button class="qclose" style="flex:1" onclick="Stats.open();Stats.switchTab('collection')">回錯題回顧</button>
        </div>`;
      return;
    }
    _wq.cur++;
    _renderWrongQ();
  }

  // ── 收藏聽力測驗（shadow_favs 句 + word_notebook 單字） ──
  let _fl = null;  // {items, pool, cur, correct}
  function quizFavListening() {
    const pool = [];
    try {
      const d = JSON.parse(localStorage.getItem('shadow_favs')) || {};
      Object.values(d).forEach(f => { if (f && f.j) pool.push({ j: f.j, z: f.z || f.j }); });
    } catch(e) {}
    try {
      const nb = JSON.parse(localStorage.getItem('word_notebook')) || [];
      nb.forEach(x => {
        if (!x || !x.w) return;
        const j = x.r || x.w;
        let z = '';
        if (x.w !== j && x.m) z = x.w + ' · ' + x.m;
        else if (x.w !== j) z = x.w;
        else if (x.m) z = x.m;
        else z = j;
        pool.push({ j, z });
      });
    } catch(e) {}
    if (pool.length < 4) { alert('收藏少於 4 個，沒法出聽力題。先去單字或跟讀加幾個再來。'); return; }
    const items = pool.slice().sort(() => Math.random() - 0.5).slice(0, 20);
    _fl = { items, pool, cur: 0, correct: 0 };
    document.getElementById('quizBg').classList.add('show');
    _renderFL();
  }
  function _renderFL() {
    const item = _fl.items[_fl.cur];
    const others = _fl.pool.filter(p => p.j !== item.j && p.z && p.z !== item.z);
    const distractors = others.slice().sort(() => Math.random() - 0.5).slice(0, 3);
    const opts = [item, ...distractors].sort(() => Math.random() - 0.5);
    const correctIdx = opts.indexOf(item);
    _fl._opts = opts; _fl._correctIdx = correctIdx;
    document.getElementById('quizBox').innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <span style="font-size:12px;color:var(--tx2)"><i data-ic=headphones></i> 收藏聽力 ${_fl.cur+1}/${_fl.items.length}</span>
        <button class="qclose" style="width:auto;margin:0;padding:2px 10px" onclick="Stats.close()"><i data-ic=x></i></button>
      </div>
      <div style="text-align:center;margin:24px 0">
        <button class="qstart" style="border-radius:50%;width:88px;height:88px;font-size:32px;padding:0;cursor:pointer" onclick="Stats._flReplay()"><i data-ic=volume></i></button>
        <div style="font-size:11px;color:var(--tx3);margin-top:8px">點擊重播</div>
      </div>
      <div class="qopts" id="flOpts">${opts.map((o,i)=>`<button class="qopt" onclick="Stats._flAnswer(${i})">${o.z}</button>`).join('')}</div>
      <div id="flNav" style="margin-top:12px"></div>`;
    setTimeout(() => { if (typeof speak === 'function') speak(item.j); }, 250);
  }
  function _flReplay() {
    const item = _fl.items[_fl.cur];
    if (typeof speak === 'function') speak(item.j);
  }
  function _flAnswer(i) {
    const ok = i === _fl._correctIdx;
    if (ok) _fl.correct++;
    document.querySelectorAll('#flOpts .qopt').forEach((b, idx) => {
      b.disabled = true;
      if (idx === _fl._correctIdx) b.classList.add('qcorrect');
      if (idx === i && !ok) b.classList.add('qwrong');
    });
    const item = _fl.items[_fl.cur];
    const last = _fl.cur >= _fl.items.length - 1;
    document.getElementById('flNav').innerHTML = `
      <div style="color:var(--tx2);font-size:13px;margin-bottom:8px;padding:8px;background:var(--bg2);border-radius:6px">原文：<b style="color:var(--tx)">${item.j}</b>　・　${item.z}</div>
      <button class="qstart" style="width:100%" onclick="Stats._flNext()">${last?'看結果':'下一題'}</button>`;
  }
  function _flNext() {
    if (_fl.cur >= _fl.items.length - 1) {
      const pct = Math.round(_fl.correct / _fl.items.length * 100);
      const col = pct >= 80 ? '#16a34a' : pct >= 60 ? '#ca8a04' : '#dc2626';
      document.getElementById('quizBox').innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><span style="font-size:14px;font-weight:600">收藏聽力測驗結果</span><button class="qclose" style="width:auto;margin:0;padding:2px 10px" onclick="Stats.close()">✕</button></div>
        <div style="text-align:center;padding:24px 0"><div style="font-size:48px;font-weight:700;color:${col}">${pct}%</div><div style="color:var(--tx2);margin-top:4px">${_fl.correct} / ${_fl.items.length}</div></div>
        <div style="display:flex;gap:8px">
          <button class="qstart" style="flex:1" onclick="Stats.quizFavListening()"><i data-ic=refresh></i> 再考一次</button>
          <button class="qclose" style="flex:1" onclick="Stats.close()">關閉</button>
        </div>`;
      return;
    }
    _fl.cur++;
    _renderFL();
  }

  return { open, openProfile, close, switchTab, _setFont, _setTheme, _setLevel, _setReminder, _clearReminder, _toggleQh, quizWeak, retryWrong, _answerWeak, addToNotebook, removeFromNotebook, quizNotebook, reviewNotebook, addWrongQuestion, getWrongQuestions, removeWrongQuestion, quizWrongQuestions, _wqAnswer, _wqNext, _wqRemoveAndNext, quizFavListening, _flReplay, _flAnswer, _flNext };
})();
try { window.Stats = Stats; } catch (e) {}