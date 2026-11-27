// path-skit.js — 闖關課前短劇(2026-11-27 試作第 1 集,Mia:參考 StayKR,有一點背景音樂、偏可愛)。
// 一關開頭先演一段 30 秒內的小劇場:台詞只用「這一關要背的字 + 這一關的文法」,看完再背字,字和文法就接在一起了。
// 不是影片檔:場景、角色都是圖層,動作用 CSS 演(走進場、呼吸、講話彈跳、情緒符號)。
// 資料 PATH_SKITS:key = 等級:第幾個一般關(同 path-eg.js);角色 t=小狸、k=狐狸コン。
//   劇本正本在 scripts/pathskit/<等級>.json,不要直接改 path-skit-<等級>.js。
//   lines[].j 只放 <em>(標這關文法);au = audio/pathskit/ 的預錄音檔(VOICEVOX,不走即時 TTS,發音固定);
//   pose = 這句說話時 [小狸, コン] 的姿勢(images/mascot/<名>.png);emo = 頭上冒的符號。
// 用法:PathSkit.has(lv, i) / PathSkit.play(box, lv, i, { no, words, onDone })
// 配音:VOICEVOX:ずんだもん(小狸)、VOICEVOX:猫使アル(コン)—— 規約要標註,結尾卡有列。
(function (root) {
  const IMG = 'images/mascot/', AU = 'audio/pathskit/', BG = 'images/scenes/bg/';
  const L = (zh, en) => { try { return (typeof enOr === 'function') ? enOr((typeof cvt === 'function' ? cvt(zh) : zh), en) : zh; } catch (e) { return zh; } };
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  // 劇本資料按等級、每 25 關分一檔(path-skit-n5-0.js…,scripts/pathskit/build.py 產),進那一關才載入那一檔。
  // 有做的等級和版本號寫在 LEVELS;改了資料檔要把版本 +1。
  const LEVELS = { n5: 3, n4: 2, n3: 3, n2: 3, n1: 2 };
  const CHUNK = 25;
  const SKITS = root.PATH_SKITS = root.PATH_SKITS || {};
  const loading = {};
  function ensure(lv, i) {
    if (!LEVELS[lv]) return Promise.resolve(false);
    const c = Math.floor((i || 0) / CHUNK), key = lv + '-' + c;
    if (!loading[key]) loading[key] = new Promise(function (res) {
      const sc = document.createElement('script'); sc.src = 'path-skit-' + key + '.js?v=' + LEVELS[lv];
      sc.onload = function () { res(true); }; sc.onerror = function () { loading[key] = null; res(false); };
      document.head.appendChild(sc);
    });
    return loading[key];
  }
  // 內容的語言:[繁中, 英文, 韓文]。韓文介面看韓文、中文介面看中文(簡體走 cvt)、其他外語看英文。
  function tr(a) {
    if (!a) return '';
    let lg = 'zh-TW'; try { if (typeof I18n !== 'undefined' && I18n.getLang) lg = I18n.getLang() || lg; } catch (e) {}   // I18n 是頂層 const,不在 window 上,不能用 root.I18n 判斷
    if (lg === 'ko' && a[2]) return a[2];
    if (lg.indexOf('zh') === 0) { try { return (typeof cvt === 'function') ? cvt(a[0]) : a[0]; } catch (e) { return a[0]; } }
    return a[1] || a[0];
  }
  const FLIP = ['fox-point'];   // 原圖朝右的姿勢:コン站右邊,要左右翻面才會對著狸太郎

  const bgmOn = () => { try { return localStorage.getItem('pathskit_bgm') !== '0'; } catch (e) { return true; } };
  let S = null;   // 目前這一場

  function has(lv, i) { return !!SKITS[lv + ':' + i]; }
  function ruby(j) {
    let h = j;
    try { if (root.furiganaHTMLRich) h = root.furiganaHTMLRich(j); } catch (e) {}
    return h.replace(/<em>/g, '<b>').replace(/<\/em>/g, '</b>');
  }
  function later(ms, fn) { const tk = S; const id = setTimeout(() => { if (S === tk && tk && !tk.dead) fn(); }, ms); if (S) S.timers.push(id); }
  function setPose(p) {
    if (!S || !p) return;
    ['t', 'k'].forEach((w, n) => { const im = S.el[w].querySelector('img'); const src = IMG + p[n] + '.png'; if (im.getAttribute('src') !== src) im.setAttribute('src', src); S.el[w].querySelector('.ps-fl').classList.toggle('on', FLIP.indexOf(p[n]) >= 0); });
  }
  function emote(emo) {
    ['t', 'k'].forEach(w => {
      const e = S.el[w].querySelector('.ps-emo'); const v = emo && emo[w];
      e.textContent = v || ''; e.classList.remove('on'); if (v) { void e.offsetWidth; e.classList.add('on'); }
    });
  }
  function bgmVol(mode) {
    if (!S || !S.bgm) return;
    const v = !bgmOn() ? 0 : mode === 'duck' ? 0.4 : mode === 'off' ? 0 : 0.8;   // bgm.mp3 v2 檔案本身已壓到約 -37 LUFS(台詞約 -24);iOS 會無視 volume,所以靠檔案本身夠小
    S.bgm.volume = v;
  }

  function play(box, lv, i, opt) {
    stop();
    const sk = SKITS[lv + ':' + i]; if (!sk) { opt.onDone(); return; }
    ensureCss();
    S = { sk, opt, i: -1, state: 'title', paused: false, timers: [], dead: false };
    box.innerHTML = '<div class="ps">'
      + '<div class="qhd"><span>' + L('第 ' + (opt.no || sk.no) + ' 關 · 小劇場', 'Level ' + (opt.no || sk.no) + ' · Skit') + '</span>'
      + '<button class="qclose" style="width:auto;margin:0;padding:2px 10px" onclick="PathSkit.quit()"><i data-ic=x></i></button></div>'
      + '<div class="ps-stage" id="psStage">'
      + '<img class="ps-bg" src="' + BG + sk.bg + '" alt="" draggable="false">'
      + '<div class="ps-ch ps-t off" data-w="t"><span class="ps-emo"></span><span class="ps-fl"><img src="' + IMG + sk.start[0] + '.png" alt="" draggable="false"></span></div>'
      + '<div class="ps-ch ps-k" data-w="k"><span class="ps-emo"></span><span class="ps-fl"><img src="' + IMG + sk.start[1] + '.png" alt="" draggable="false"></span></div>'
      + '<span class="ps-ep">' + L('第 ' + sk.no + ' 集', 'Ep. ' + sk.no) + '</span>'
      + '<button type="button" class="ps-bgm' + (bgmOn() ? '' : ' off') + '" id="psBgm" onclick="PathSkit.toggleBgm(event)" aria-label="' + L('背景音樂', 'Music') + '"><i data-ic=headphones></i></button>'
      + '<div class="ps-pause" id="psPause"><i data-ic=play></i></div>'
      + '</div>'
      + '<div class="ps-dots" id="psDots">' + sk.lines.map(() => '<i></i>').join('') + '</div>'
      + '<div class="ps-sub" id="psSub"><div class="ps-title">' + esc(tr(sk.title)) + '</div><div class="ps-intro">' + esc(tr(sk.intro)) + '</div></div>'
      + '<div class="ps-act" id="psAct"><button type="button" class="pt-cta" onclick="PathSkit.start()"><i data-ic=play></i> ' + L('看這一集', 'Watch') + '</button>'
      + '<button type="button" class="ps-skip" onclick="PathSkit.skip()">' + L('跳過,直接背單字', 'Skip to the words') + '</button></div>'
      + '</div>';
    const st = document.getElementById('psStage');
    S.el = { t: st.querySelector('.ps-t'), k: st.querySelector('.ps-k') };
    st.addEventListener('click', e => { if (e.target.closest('.ps-bgm')) return; if (S && S.state === 'playing') togglePause(); });
    // 先把姿勢圖抓好,換姿勢才不會閃白
    const seen = {}; sk.lines.forEach(l => l.pose.forEach(p => { seen[p] = 1; })); sk.end.forEach(p => { seen[p] = 1; });
    Object.keys(seen).forEach(p => { const im = new Image(); im.src = IMG + p + '.png'; });
    // 停在標題畫面時就先抓背景音樂和前兩句,按「看這一集」才不會等下載(2026-11-27 Mia:剛點開會卡一下)
    try { S.bgm = new Audio(); S.bgm.preload = 'auto'; S.bgm.loop = true; S.bgm.src = AU + 'bgm.mp3?v=2'; S.bgm.load(); } catch (e) {}
    S.warm = []; warm(0); warm(1);
    try { if (root.Icons && Icons.hydrate) Icons.hydrate(); } catch (e) {}
    try { if (typeof track === 'function') track('pathskit_open', { ep: sk.no }); } catch (e) {}
  }

  // 先把第 n 句音檔抓進快取(另開一個 Audio 只載不播)
  function warm(n) {
    try { const ln = S && S.sk.lines[n]; if (!ln) return; const a = new Audio(); a.preload = 'auto'; a.src = AU + ln.au + '.mp3?v=1'; a.load(); S.warm.push(a); if (S.warm.length > 3) S.warm.shift(); } catch (e) {}
  }

  function start() {
    if (!S || S.state === 'playing') return;
    S.state = 'playing'; S.i = -1; S.paused = false;
    const tk = S;
    // 聲音要在這次點擊裡開:背景音樂直接播;台詞用同一個 <audio>,先靜音播一下把它解鎖(iOS)
    try {
      if (!S.bgm) { S.bgm = new Audio(AU + 'bgm.mp3?v=2'); S.bgm.loop = true; }
      S.bgm.currentTime = 0; bgmVol('full'); const p = S.bgm.play(); if (p && p.catch) p.catch(() => {});
    } catch (e) {}
    try {
      if (!S.voice) S.voice = new Audio();
      S.voice.muted = true; S.voice.src = AU + S.sk.lines[0].au + '.mp3?v=1'; const p = S.voice.play();
      // 解鎖用的靜音試播:網路慢時它會比第一句晚結束 → 只有第一句還沒開始才收掉,不然會把正在講的台詞按暫停(之前卡住 9 秒的原因)
      const v = S.voice;
      if (p && p.then) p.then(() => { if (S === tk && S.i < 0) { v.pause(); v.currentTime = 0; v.muted = false; } }).catch(() => { if (S === tk && S.i < 0) v.muted = false; }); else v.muted = false;   // 第一句已開始就不碰它(由 next 負責)
    } catch (e) {}
    try { document.querySelector('.ps').classList.add('playing'); } catch (e) {}   // 播放中下方按鈕區只剩一行提示 → 空間讓給字幕框
    document.getElementById('psAct').innerHTML = '<div class="ps-hint">' + L('點畫面可以暫停', 'Tap the scene to pause') + '</div>';
    document.getElementById('psSub').innerHTML = '';
    setPose(S.sk.start); emote(null);
    S.el.t.classList.remove('off');   // 小狸走進來
    later(1300, next);
  }

  function next() {
    if (!S || S.state !== 'playing') return;
    if (S.paused) { S.pending = next; return; }
    S.i++;
    const sk = S.sk;
    if (S.i >= sk.lines.length) { finish(); return; }
    const ln = sk.lines[S.i];
    setPose(ln.pose); emote(ln.emo);
    ['t', 'k'].forEach(w => S.el[w].classList.toggle('talk', w === ln.who));
    document.querySelectorAll('#psDots i').forEach((d, n) => d.classList.toggle('on', n <= S.i));
    document.getElementById('psSub').innerHTML = '<div class="ps-who ' + (ln.who === 't' ? 'wt' : 'wk') + '">' + (ln.who === 't' ? L('狸太郎', 'Tanuki') : L('コン', 'Kon')) + '</div>'
      + '<div class="ps-j">' + ruby(ln.j) + '</div><div class="ps-z">' + esc(tr(ln.z)) + '</div>';
    fitSub();
    bgmVol('duck');
    warm(S.i + 1);   // 講這句時先抓下一句
    let done = false;
    const after = () => { if (done) return; done = true; if (!S || S.state !== 'playing') return; ['t', 'k'].forEach(w => S.el[w].classList.remove('talk')); bgmVol('full'); later(650, next); };
    try {
      // 順序很重要:先停、同一個檔就倒回開頭(不重新載入),最後才取消靜音。
      // 之前先取消靜音再換 src → 解鎖用的靜音試播被聽見幾個字,接著重新載入卡一秒、再從頭念(Mia 11/27 回報)
      const a = S.voice; a.onended = after; a.onerror = after;
      try { a.pause(); } catch (e) {}
      if ((a.src || '').indexOf('/' + ln.au + '.mp3') < 0) a.src = AU + ln.au + '.mp3?v=1'; else { try { a.currentTime = 0; } catch (e) {} }
      a.muted = false;
      const p = a.play(); if (p && p.catch) p.catch(() => later(2200, after));
      later(9000, after);   // 保險:音檔事件沒來也會往下走,不會卡住
    } catch (e) { later(2200, after); }
  }

  // 字幕框固定高(換句時畫面才不會跳);長台詞+振假名放不下時,逐步縮小字級,不讓講話者標籤或翻譯被切掉
  function fitSub() {
    const sub = document.getElementById('psSub'); if (!sub) return;
    const j = sub.querySelector('.ps-j'), z = sub.querySelector('.ps-z'); if (!j) return;
    sub.style.justifyContent = 'flex-start';   // 置中時上方溢出量不到,量的時候先靠上
    for (let fs = 18; fs >= 15 && sub.scrollHeight > sub.clientHeight + 1; fs--) {
      j.style.fontSize = fs + 'px'; j.style.lineHeight = fs >= 16 ? '1.9' : '1.75';
      if (z && fs <= 15) z.style.fontSize = '12.5px';
    }
    sub.style.justifyContent = '';
  }

  function togglePause() {
    if (!S || S.state !== 'playing') return;
    S.paused = !S.paused;
    document.getElementById('psPause').classList.toggle('on', S.paused);
    try {
      if (S.paused) { S.voice.pause(); S.bgm.pause(); }
      else {
        const pb = S.bgm.play(); if (pb && pb.catch) pb.catch(() => {});
        if (S.pending) { const f = S.pending; S.pending = null; f(); }
        else if (S.voice.src && !S.voice.ended && S.voice.currentTime > 0) { const pv = S.voice.play(); if (pv && pv.catch) pv.catch(() => {}); }
      }
    } catch (e) {}
  }

  function finish() {
    if (!S) return;
    S.state = 'end';
    try { document.querySelector('.ps').classList.remove('playing'); } catch (e) {}
    const sk = S.sk;
    setPose(sk.end); emote({ t: '♪', k: '♪' });
    ['t', 'k'].forEach(w => { S.el[w].classList.remove('talk'); S.el[w].classList.add('hop'); });
    try { S.bgm.volume = bgmOn() ? 0.6 : 0; } catch (e) {}
    const byW = {}; (S.opt.words || []).forEach(w => { byW[w.w] = w; });
    const chips = (sk.used || []).map(x => { const w = byW[x]; return '<span class="pt-eg-chip">' + esc(x) + (w && w.r && w.r !== x ? ' <small>' + esc(w.r) + '</small>' : '') + '</span>'; }).join('');
    document.getElementById('psSub').innerHTML = '<div class="ps-title">' + L('剛剛聽到的這些字,現在來背', 'Now learn the words you just heard') + '</div>'
      + (chips ? '<div class="ps-used">' + chips + '</div>' : '')
      + '<div class="ps-credit">VOICEVOX:ずんだもん / VOICEVOX:猫使アル</div>';
    document.getElementById('psAct').innerHTML = '<button type="button" class="pt-cta" onclick="PathSkit.done()">' + L('開始背單字 →', 'Start the words →') + '</button>'
      + '<button type="button" class="ps-skip" onclick="PathSkit.replay()">' + L('再看一次', 'Watch again') + '</button>';
    try { if (typeof track === 'function') track('pathskit_done', { ep: sk.no }); } catch (e) {}
  }
  function replay() { if (!S) return; ['t', 'k'].forEach(w => S.el[w].classList.remove('hop')); S.el.t.classList.add('off'); S.state = 'title'; void S.el.t.offsetWidth; start(); }
  function stop() {
    if (!S) return;
    S.dead = true; S.timers.forEach(clearTimeout);
    try { if (S.voice) { S.voice.onended = null; S.voice.onerror = null; S.voice.pause(); } } catch (e) {}
    try { if (S.bgm) S.bgm.pause(); } catch (e) {}
    S = null;
  }
  function done() { const o = S && S.opt; stop(); if (o && o.onDone) o.onDone(); }
  function skip() { try { if (typeof track === 'function') track('pathskit_skip', { ep: S && S.sk.no }); } catch (e) {} done(); }
  function quit() { const o = S && S.opt; stop(); if (o && o.onQuit) o.onQuit(); }
  function toggleBgm(e) {
    if (e) e.stopPropagation();
    try { localStorage.setItem('pathskit_bgm', bgmOn() ? '0' : '1'); } catch (x) {}
    const b = document.getElementById('psBgm'); if (b) b.classList.toggle('off', !bgmOn());
    if (S && S.bgm) bgmVol(S.state === 'end' ? 'duck' : 'full');
  }

  function ensureCss() {
    if (document.getElementById('psCss')) return;
    const st = document.createElement('style'); st.id = 'psCss';
    st.textContent = [
      '.ps-stage{position:relative;margin-top:14px;border-radius:20px;overflow:hidden;flex:1 1 auto;min-height:170px;max-height:62vh;background:var(--bg3);border:1px solid var(--line);cursor:pointer;user-select:none;-webkit-user-select:none}',
      '.ps-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 70%;filter:saturate(.95)}',
      '.ps-stage::after{content:"";position:absolute;left:0;right:0;bottom:0;height:34%;background:linear-gradient(to top,rgba(0,0,0,.22),transparent);pointer-events:none}',
      '.ps-ch{position:absolute;bottom:5%;width:40%;height:58%;z-index:2;transition:left .9s cubic-bezier(.3,1.3,.5,1),right .9s cubic-bezier(.3,1.3,.5,1);transform-origin:50% 100%}',
      '.ps-fl{display:block;width:100%;height:100%}.ps-ch img{display:block;width:100%;height:100%;object-fit:contain;object-position:50% 100%;filter:drop-shadow(0 6px 6px rgba(0,0,0,.28));animation:psBreath 2.6s ease-in-out infinite;transform-origin:50% 100%}',
      '.ps-fl.on{transform:scaleX(-1)}',
      '.ps-t{left:6%}.ps-t.off{left:-48%}.ps-k{right:6%}.ps-k img{animation-delay:-1.1s}',
      '.ps-ch.talk img{animation:psTalk .42s ease-in-out infinite}',
      '.ps-ch.hop img{animation:psHop .7s ease-in-out infinite}.ps-k.hop img{animation-delay:-.35s}',
      '.ps-emo{position:absolute;top:-6%;left:50%;transform:translateX(-50%);font-size:26px;font-weight:900;color:#fff;text-shadow:0 2px 0 rgba(0,0,0,.35),0 0 10px rgba(0,0,0,.25);opacity:0;z-index:3;pointer-events:none}',
      '.ps-emo.on{animation:psEmo 1.5s ease-out forwards}',
      '.ps-ep{position:absolute;top:12px;left:12px;z-index:4;font-size:12px;font-weight:800;color:#fff;background:rgba(0,0,0,.42);border-radius:999px;padding:4px 12px}',
      '.ps-bgm{position:absolute;top:10px;right:10px;z-index:4;width:34px;height:34px;border-radius:50%;border:0;background:rgba(0,0,0,.42);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0}',
      '.ps-bgm.off{opacity:.45}.ps-bgm.off::after{content:"";position:absolute;width:22px;height:2px;background:#fff;transform:rotate(-45deg)}',
      '.ps-pause{position:absolute;inset:0;z-index:5;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.35);color:#fff;font-size:34px}.ps-pause.on{display:flex}',
      '.ps-dots{flex:0 0 auto;display:flex;gap:6px;justify-content:center;margin:14px 0 14px}.ps-dots i{width:22px;height:5px;border-radius:3px;background:var(--line);transition:background .3s}.ps-dots i.on{background:var(--ac)}',
      '.ps-sub{flex:0 0 auto;height:150px;overflow:hidden;display:flex;flex-direction:column;justify-content:center;background:var(--bg3);border-radius:14px;padding:14px 16px;margin-bottom:14px}',
      '.ps-who{display:inline-block;align-self:flex-start;font-size:12px;font-weight:800;border-radius:999px;padding:2px 10px;margin-bottom:8px;color:#fff}.ps-who.wt{background:#B9793A}.ps-who.wk{background:#4A7FB5}',
      '.ps-j{font-size:18px;line-height:1.9;font-weight:700}.ps-j b{color:var(--ac)}.ps-z{font-size:13.5px;color:var(--tx2);margin-top:4px}',
      '.ps-title{font-size:16px;font-weight:900;margin-bottom:6px}.ps-intro{font-size:13.5px;color:var(--tx2);line-height:1.6}',
      '.ps-used{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}.ps-credit{font-size:10.5px;color:var(--tx3);margin-top:12px}',
      '.ps.playing .ps-sub{height:190px}.ps.playing .ps-act{min-height:36px}.ps-act{flex:0 0 auto;display:flex;flex-direction:column;gap:12px;min-height:104px;justify-content:flex-end}.ps-act .pt-cta{display:flex;align-items:center;justify-content:center;gap:6px}',
      '.ps-skip{background:none;border:0;color:var(--tx2);font:inherit;font-size:13.5px;padding:8px;cursor:pointer;text-decoration:underline;text-underline-offset:3px}',
      '.ps-hint{text-align:center;font-size:12.5px;color:var(--tx3);padding:8px 0}',
      '@keyframes psBreath{0%,100%{transform:scale(1,1)}50%{transform:scale(1.015,.985)}}',
      '@keyframes psTalk{0%,100%{transform:translateY(0) scale(1,1)}50%{transform:translateY(-5%) scale(.98,1.03)}}',
      '@keyframes psHop{0%,100%{transform:translateY(0)}50%{transform:translateY(-9%)}}',
      '@keyframes psEmo{0%{opacity:0;transform:translate(-50%,10px) scale(.5)}18%{opacity:1;transform:translate(-50%,-6px) scale(1.25)}30%{transform:translate(-50%,0) scale(1)}80%{opacity:1}100%{opacity:0;transform:translate(-50%,-10px) scale(1)}}',
      '@media (prefers-reduced-motion:reduce){.ps-ch img,.ps-ch.talk img,.ps-ch.hop img{animation:none}}'
    ].join('');
    document.head.appendChild(st);
  }

  root.PathSkit = { ensure, tr, has, play, start, skip, done, quit, replay, toggleBgm, stop };
})(window);
