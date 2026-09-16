// 用聽的背單字(B6,2026-09-17):整個單字集連續播放「單字 →(停頓)→ 例句」,螢幕關著也能聽(mediaSession 鎖屏控制)。
// 範圖:學習計畫開著的等級(或單一等級)。篩選:全部 / 只聽沒熟的 / 只聽沒學過的 / 只聽到期的。順序:照順序 / 隨機。
// 音檔全部用 VOICEVOX 預錄(window.__TTS 對照表),沒音檔的字跳過、絕不用瀏覽器機器音(全站政策)。
// 免費版:只能隨機、一次最多 30 個、不能用篩選;Premium 全開(ToolQuota.isPremium)。
(function (root) {
  const L = (zh, en) => { try { return (typeof enOr === 'function') ? enOr(zh, en) : zh; } catch (e) { return zh; } };
  const C = s => { try { return (typeof cvt === 'function') ? cvt(s) : s; } catch (e) { return s; } };
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const KEY = 'vl_opts';
  const DEF = { scope: 'plan', filter: 'all', order: 'seq', ex: true, gap: 1.5, twice: false, loop: false, showMeaning: true };
  const FREE_MAX = 30;

  let opts = load(), list = [], idx = 0, playing = false, timer = null, au = null, phase = 'word', played = 0, wake = null;

  function load() { try { return { ...DEF, ...(JSON.parse(localStorage.getItem(KEY)) || {}) }; } catch (e) { return { ...DEF }; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(opts)); } catch (e) {} }
  function premium() { try { return !(root.ToolQuota && ToolQuota.shouldGate && ToolQuota.shouldGate()) || (root.ToolQuota && ToolQuota.isPremium && ToolQuota.isPremium()); } catch (e) { return true; } }
  function tts(text) { const T = root.__TTS || {}; return text && T[text] ? T[text] : null; }
  function url(hash) { return root.ttsUrl ? root.ttsUrl(hash) : 'audio/tts/' + hash + '.mp3'; }
  function speed() { try { return (typeof getTtsSpeed === 'function') ? getTtsSpeed() : 1; } catch (e) { return 1; } }
  function srsData() { try { return JSON.parse(localStorage.getItem('srs_data')) || {}; } catch (e) { return {}; } }
  function levels() {
    if (opts.scope === 'plan' && root.StudyPlan) return StudyPlan.enabledLevels();
    if (/^n[1-5]$/.test(opts.scope)) return [opts.scope];
    return [(typeof currentLevel !== 'undefined' ? currentLevel : 'n5')];
  }
  function vocab(lv) { try { return (typeof getVocabData === 'function') ? (getVocabData(lv) || []) : []; } catch (e) { return []; } }

  // 建播放清單:依範圍+篩選,只留有音檔的字
  function build() {
    const d = srsData(), now = Date.now(), out = [];
    const sets = root.StudyPlan ? StudyPlan.sets() : null;
    levels().forEach(lv => {
      vocab(lv).forEach(v => {
        if (sets && opts.scope === 'plan') { const th = root.VOCAB_THEMES && VOCAB_THEMES[v.w + '|' + (v.r || '')]; if (th && sets.themeOff[lv + '|' + th]) return; }
        const key = v.r && tts(v.r) ? v.r : (tts(v.w) ? v.w : null);
        if (!key) return;
        const e = d[lv + ':' + v.w];
        if (opts.filter === 'new' && e) return;
        if (opts.filter === 'weak' && e && (e.interval || 0) >= 21) return;
        if (opts.filter === 'due' && !(e && ((typeof e.nextReviewTs === 'number') ? e.nextReviewTs <= now : true))) return;
        out.push({ ...v, level: lv, key });
      });
    });
    if (opts.order === 'rand' || !premium()) { for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; } }
    return premium() ? out : out.slice(0, FREE_MAX);
  }

  // ── UI ──
  function css() {
    if (document.getElementById('vlCss')) return;
    const st = document.createElement('style'); st.id = 'vlCss';
    st.textContent = [
      '.vl-mask{position:fixed;inset:0;z-index:9100;background:var(--bg);overflow-y:auto;-webkit-overflow-scrolling:touch}',
      '.vl-wrap{max-width:560px;margin:0 auto;padding:14px 16px calc(24px + env(safe-area-inset-bottom,0px))}',
      '.vl-top{display:flex;align-items:center;gap:10px;margin-bottom:10px}.vl-top .tt{font-weight:800;font-size:17px;flex:1}.vl-x{border:none;background:none;font-size:22px;color:var(--tx2);cursor:pointer;padding:4px 8px}',
      '.vl-sec{font-size:12px;font-weight:800;color:var(--tx2);letter-spacing:.06em;margin:14px 0 6px}',
      '.vl-seg{display:flex;flex-wrap:wrap;gap:6px}.vl-seg button{border:1px solid var(--bd);background:var(--bg2);color:var(--tx);border-radius:999px;padding:7px 13px;font-size:13px;cursor:pointer}.vl-seg button.on{background:var(--ac);border-color:var(--ac);color:#fff}.vl-seg button.lock{opacity:.5}',
      '.vl-row{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--bd);font-size:14px}.vl-row small{display:block;color:var(--tx3);font-size:11.5px;margin-top:2px}',
      '.vl-sw{position:relative;display:inline-block;width:44px;height:26px;flex:none}.vl-sw input{opacity:0;width:0;height:0}.vl-sw span{position:absolute;inset:0;background:var(--bd);border-radius:999px;transition:.2s}.vl-sw span:before{content:"";position:absolute;width:20px;height:20px;left:3px;top:3px;background:#fff;border-radius:50%;transition:.2s;box-shadow:0 1px 3px rgba(0,0,0,.2)}.vl-sw input:checked+span{background:var(--ac)}.vl-sw input:checked+span:before{transform:translateX(18px)}',
      '.vl-start{display:block;width:100%;margin-top:18px;background:var(--ac);color:#fff;border:0;border-radius:14px;padding:15px;font-size:16px;font-weight:800;cursor:pointer}.vl-start:disabled{opacity:.5}',
      '.vl-up{margin-top:10px;font-size:12.5px;color:var(--tx2);text-align:center;line-height:1.6}.vl-up a{color:var(--ac);font-weight:700}',
      '.vl-card{background:var(--bg2);border:1px solid var(--bd);border-radius:20px;padding:28px 20px 22px;text-align:center;margin-top:8px;min-height:250px;display:flex;flex-direction:column;justify-content:center}',
      '.vl-lv{font-size:12px;color:var(--tx3);font-weight:700;letter-spacing:.06em}.vl-w{font-size:40px;font-weight:900;letter-spacing:-.5px;margin-top:6px;line-height:1.2}.vl-r{font-size:17px;color:var(--tx2);margin-top:4px}.vl-m{font-size:18px;color:var(--ac);font-weight:700;margin-top:10px}.vl-m.hid{filter:blur(6px)}',
      '.vl-ex{margin-top:14px;padding-top:12px;border-top:1px dashed var(--bd);font-size:15px;line-height:1.7}.vl-ex .z{font-size:12.5px;color:var(--tx2)}.vl-ex.on{color:var(--ac2)}',
      '.vl-prog{display:flex;justify-content:space-between;font-size:12.5px;color:var(--tx2);margin:14px 2px 6px;font-variant-numeric:tabular-nums}.vl-bar{height:6px;border-radius:999px;background:var(--bd);overflow:hidden}.vl-bar i{display:block;height:100%;background:var(--ac);transition:width .3s}',
      '.vl-ctl{display:flex;align-items:center;justify-content:center;gap:18px;margin-top:18px}.vl-ctl button{border:1px solid var(--bd);background:var(--bg2);color:var(--tx);width:52px;height:52px;border-radius:50%;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center}.vl-ctl .main{width:72px;height:72px;background:var(--ac);border-color:var(--ac);color:#fff;font-size:28px}',
      '.vl-mini{display:flex;justify-content:center;gap:8px;margin-top:14px;flex-wrap:wrap}.vl-mini button{border:1px solid var(--bd);background:var(--bg2);color:var(--tx2);border-radius:999px;padding:6px 12px;font-size:12.5px;cursor:pointer}.vl-mini button.on{color:var(--ac);border-color:var(--ac)}',
      '.vl-done{text-align:center;padding:40px 10px}.vl-done img{width:110px}.vl-done h3{margin:10px 0 4px}'
    ].join('\n');
    document.head.appendChild(st);
  }
  function seg(name, items, cur, lockAll) {
    return '<div class="vl-seg">' + items.map(([v, lbl, locked]) => '<button type="button" class="' + (cur === v ? 'on' : '') + ((locked && !premium()) ? ' lock' : '') + '" onclick="VocabListen.opt(\'' + name + '\',\'' + v + '\'' + ((locked && !premium()) ? ',true' : '') + ')">' + lbl + ((locked && !premium()) ? ' 🔒' : '') + '</button>').join('') + '</div>';
  }
  function setupHtml() {
    const n = build().length;
    const lvOpts = [['plan', L('學習計畫的等級', 'Plan levels')]].concat(['n5', 'n4', 'n3', 'n2', 'n1'].map(l => [l, l.toUpperCase()]));
    return '<div class="vl-wrap">'
      + '<div class="vl-top"><span class="tt">🎧 ' + L('用聽的背單字', 'Listen & learn') + '</span><button class="vl-x" onclick="VocabListen.close()">×</button></div>'
      + '<div style="font-size:13px;color:var(--tx2);line-height:1.6">' + L('單字→停頓→例句連續播,通勤、走路、洗碗都在背。螢幕關掉也能聽,鎖屏可切上下一個。', 'Word → pause → example sentence, on repeat. Study while commuting or doing dishes; works with the screen off, with lock-screen controls.') + '</div>'
      + '<div class="vl-sec">' + L('範圍', 'Scope') + '</div>' + seg('scope', lvOpts, opts.scope)
      + '<div class="vl-sec">' + L('播哪些', 'Which words') + '</div>' + seg('filter', [['all', L('全部', 'All')], ['weak', L('只聽沒熟的', 'Not yet mastered'), true], ['new', L('只聽沒學過的', 'Not yet learned'), true], ['due', L('只聽到期的', 'Due for review'), true]], opts.filter)
      + '<div class="vl-sec">' + L('順序', 'Order') + '</div>' + seg('order', [['seq', L('照順序', 'In order'), true], ['rand', L('隨機', 'Shuffle')]], opts.order)
      + '<div class="vl-sec">' + L('播法', 'Playback') + '</div>'
      + row(L('接著播例句', 'Play the example sentence'), L('單字念完停一下,再念例句', 'After the word, a pause, then the sentence'), sw('ex', opts.ex))
      + row(L('單字念兩次', 'Say the word twice'), '', sw('twice', opts.twice))
      + row(L('看得到中文', 'Show the meaning'), L('關掉就只聽日文,自己想意思', 'Off = Japanese only, recall the meaning yourself'), sw('showMeaning', opts.showMeaning))
      + row(L('全部播完後重頭循環', 'Loop when finished'), '', sw('loop', opts.loop))
      + '<div class="vl-row"><div>' + L('停頓', 'Pause') + '<small>' + L('單字與例句之間留幾秒想意思', 'Seconds to recall the meaning') + '</small></div>' + seg('gap', [['0.8', '0.8s'], ['1.5', '1.5s'], ['3', '3s']], String(opts.gap)) + '</div>'
      + '<button class="vl-start" onclick="VocabListen.start()" ' + (n ? '' : 'disabled') + '>▶ ' + L('開始播放', 'Start') + '（' + n + L(' 個', ' words') + '）</button>'
      + (!premium() ? '<div class="vl-up">' + L('免費版:隨機播放、一次 ' + FREE_MAX + ' 個。', 'Free: shuffle only, ' + FREE_MAX + ' words per session.') + ' <a href="#" onclick="event.preventDefault();ToolQuota.showPaywall(\'listen\')">' + L('升級 Premium 解鎖整個單字集、篩選與照順序播', 'Upgrade for whole sets, filters and in-order playback') + '</a></div>' : '')
      + '</div>';
    function row(t, d, ctl) { return '<div class="vl-row"><div>' + t + (d ? '<small>' + d + '</small>' : '') + '</div>' + ctl + '</div>'; }
    function sw(k, on) { return '<label class="vl-sw"><input type="checkbox" ' + (on ? 'checked' : '') + ' onchange="VocabListen.opt(\'' + k + '\',this.checked)"><span></span></label>'; }
  }
  function opt(k, v, locked) {
    if (locked) { try { ToolQuota.showPaywall('listen'); } catch (e) {} return; }
    if (k === 'gap') v = parseFloat(v);
    opts[k] = v; save(); render();
  }
  function mask() { return document.getElementById('vlMask'); }
  function render() {
    const m = mask(); if (!m) return;
    m.innerHTML = setupHtml();
    try { if (typeof cvtStaticUI === 'function') cvtStaticUI(m); } catch (e) {}
  }
  function open() {
    css(); opts = load();
    if (!mask()) { const d = document.createElement('div'); d.className = 'vl-mask'; d.id = 'vlMask'; document.body.appendChild(d); }
    render();
    try { if (typeof track === 'function') track('listen_open'); } catch (e) {}
  }
  function close() { stop(); const m = mask(); if (m) m.remove(); releaseWake(); }

  // ── 播放 ──
  function start() {
    list = build(); if (!list.length) return;
    idx = 0; played = 0;
    if (root.ToolQuota && ToolQuota.consume) { try { ToolQuota.consume('listen'); } catch (e) {} }
    renderPlayer(); play();
    try { if (typeof track === 'function') track('listen_start', { n: list.length, filter: opts.filter, order: opts.order }); } catch (e) {}
  }
  function cur() { return list[idx]; }
  function renderPlayer() {
    const m = mask(); if (!m) return;
    const v = cur(); if (!v) return done();
    const ex = (opts.ex && v.ex && v.ex.j && tts(v.ex.j)) ? v.ex : null;
    m.innerHTML = '<div class="vl-wrap">'
      + '<div class="vl-top"><button class="vl-x" onclick="VocabListen.back()" aria-label="back">‹</button><span class="tt">🎧 ' + L('用聽的背單字', 'Listen & learn') + '</span><button class="vl-x" onclick="VocabListen.close()">×</button></div>'
      + '<div class="vl-card" onclick="VocabListen.toggleMeaning()">'
      + '<div class="vl-lv">' + v.level.toUpperCase() + (v.c ? '・' + esc(v.c) : '') + '</div>'
      + '<div class="vl-w">' + esc(v.w) + '</div>' + (v.r && v.r !== v.w ? '<div class="vl-r">' + esc(v.r) + '</div>' : '')
      + '<div class="vl-m' + (opts.showMeaning ? '' : ' hid') + '" id="vlM">' + esc(C(v.m || '')) + '</div>'
      + (ex ? '<div class="vl-ex" id="vlEx"><div>' + esc(ex.j) + '</div><div class="z' + (opts.showMeaning ? '' : ' hid') + '">' + esc(C(ex.z || '')) + '</div></div>' : '')
      + '</div>'
      + '<div class="vl-prog"><span>' + (idx + 1) + ' / ' + list.length + '</span><span>' + speed().toFixed(2).replace(/0$/, '') + '×</span></div><div class="vl-bar"><i style="width:' + Math.round((idx + 1) / list.length * 100) + '%"></i></div>'
      + '<div class="vl-ctl"><button onclick="VocabListen.prev()" aria-label="prev">⏮</button><button class="main" id="vlPP" onclick="VocabListen.toggle()" aria-label="play/pause">' + (playing ? '⏸' : '▶') + '</button><button onclick="VocabListen.next()" aria-label="next">⏭</button></div>'
      + '<div class="vl-mini">'
      + '<button type="button" class="' + (opts.showMeaning ? 'on' : '') + '" onclick="VocabListen.opt2(\'showMeaning\')">' + L('中文', 'Meaning') + '</button>'
      + '<button type="button" class="' + (opts.ex ? 'on' : '') + '" onclick="VocabListen.opt2(\'ex\')">' + L('例句', 'Example') + '</button>'
      + '<button type="button" class="' + (opts.loop ? 'on' : '') + '" onclick="VocabListen.opt2(\'loop\')">' + L('循環', 'Loop') + '</button>'
      + '<button type="button" onclick="VocabListen.mark()">★ ' + L('收藏', 'Save') + '</button>'
      + '</div>'
      + '</div>';
    msMeta(v);
  }
  function opt2(k) { opts[k] = !opts[k]; save(); renderPlayer(); }
  function toggleMeaning() { const m = document.getElementById('vlM'); if (m) m.classList.toggle('hid'); const z = document.querySelector('#vlEx .z'); if (z) z.classList.toggle('hid'); }
  function mark() { const v = cur(); if (!v) return; try { if (root.stayjpAddWord) { root.stayjpAddWord(v.w, v.r, v.m, v.level); toast(L('已加入生字本', 'Saved to notebook')); } } catch (e) {} }
  function toast(msg) { try { if (root.AppUI && AppUI.toast) AppUI.toast(msg); } catch (e) {} }

  function audio() {
    if (!au) {
      au = new Audio(); au.preload = 'auto';
      au.addEventListener('ended', onEnded);
      au.addEventListener('error', () => { schedule(0.3, advancePhase); });
    }
    return au;
  }
  function playText(text) {
    const h = tts(text); if (!h) { advancePhase(); return; }
    const a = audio(); a.src = url(h); a.playbackRate = speed();
    a.play().then(() => { msState('playing'); }).catch(() => { schedule(0.5, advancePhase); });
  }
  function clearTimer() { if (timer) { clearTimeout(timer); timer = null; } }
  function schedule(sec, fn) { clearTimer(); timer = setTimeout(() => { timer = null; if (playing) fn(); }, Math.max(0, sec) * 1000); }
  // 每個字的節奏:word →(twice? word)→ gap → example → gap → next
  function play() {
    const v = cur(); if (!v) return done();
    playing = true; phase = 'word'; renderPP(); requestWake();
    playText(v.key);
  }
  function onEnded() { if (!playing) return; advancePhase(); }
  function advancePhase() {
    const v = cur(); if (!v || !playing) return;
    if (phase === 'word' && opts.twice) { phase = 'word2'; schedule(0.4, () => playText(v.key)); return; }
    if ((phase === 'word' || phase === 'word2') && opts.ex && v.ex && v.ex.j && tts(v.ex.j)) {
      phase = 'ex'; const el = document.getElementById('vlEx'); if (el) el.classList.add('on');
      schedule(opts.gap, () => playText(v.ex.j)); return;
    }
    phase = 'end'; schedule(opts.gap, next);
  }
  function next() {
    played++; if (played % 5 === 0) { try { if (typeof Calendar !== 'undefined') Calendar.logActivity('vocab'); } catch (e) {} }
    idx++;
    if (idx >= list.length) { if (opts.loop) idx = 0; else return done(); }
    renderPlayer(); if (playing) play(); else renderPP();
  }
  function prev() { idx = Math.max(0, idx - 1); renderPlayer(); if (playing) play(); }
  function toggle() {
    if (playing) { playing = false; clearTimer(); try { audio().pause(); } catch (e) {} msState('paused'); renderPP(); }
    else { if (phase === 'end' || !au || !au.src) play(); else { playing = true; audio().play().catch(() => play()); renderPP(); msState('playing'); } }
  }
  function stop() { playing = false; clearTimer(); try { if (au) { au.pause(); au.src = ''; } } catch (e) {} msState('none'); }
  function back() { stop(); render(); }
  function renderPP() { const b = document.getElementById('vlPP'); if (b) b.textContent = playing ? '⏸' : '▶'; }
  function done() {
    stop(); releaseWake();
    const m = mask(); if (!m) return;
    m.innerHTML = '<div class="vl-wrap"><div class="vl-top"><span class="tt">🎧 ' + L('用聽的背單字', 'Listen & learn') + '</span><button class="vl-x" onclick="VocabListen.close()">×</button></div>'
      + '<div class="vl-done"><img src="images/mascot/tanuki-p06.png" alt=""><h3>' + L('聽完了 🎉', 'All done 🎉') + '</h3><div style="color:var(--tx2)">' + L('這一輪 ' + list.length + ' 個單字', list.length + ' words this round') + '</div>'
      + '<button class="vl-start" onclick="VocabListen.start()">▶ ' + L('再聽一輪', 'Play again') + '</button><button class="vl-start" style="background:var(--bg3);color:var(--tx);border:1px solid var(--bd)" onclick="VocabListen.back()">' + L('調整設定', 'Change settings') + '</button></div></div>';
    try { if (typeof track === 'function') track('listen_done', { n: list.length }); } catch (e) {}
  }

  // ── 鎖屏控制 / 螢幕常亮 ──
  function msMeta(v) {
    try {
      if (!('mediaSession' in navigator) || typeof MediaMetadata === 'undefined') return;
      navigator.mediaSession.metadata = new MediaMetadata({ title: v.w + (v.r && v.r !== v.w ? '（' + v.r + '）' : ''), artist: C(v.m || ''), album: 'StayJP · ' + (idx + 1) + ' / ' + list.length });
      const H = (k, f) => { try { navigator.mediaSession.setActionHandler(k, f); } catch (e) {} };
      H('play', () => { if (!playing) toggle(); }); H('pause', () => { if (playing) toggle(); });
      H('previoustrack', prev); H('nexttrack', () => { clearTimer(); next(); });
    } catch (e) {}
  }
  function msState(st) { try { if ('mediaSession' in navigator) navigator.mediaSession.playbackState = st; } catch (e) {} }
  function requestWake() { try { if (!wake && navigator.wakeLock) navigator.wakeLock.request('screen').then(w => { wake = w; w.addEventListener('release', () => { wake = null; }); }).catch(() => {}); } catch (e) {} }
  function releaseWake() { try { if (wake) { wake.release(); wake = null; } } catch (e) {} }
  document.addEventListener('visibilitychange', () => { if (!document.hidden && playing) requestWake(); });

  root.VocabListen = { open, close, start, back, next, prev, toggle, opt, opt2, toggleMeaning, mark, isPlaying: () => playing };
})(window);
