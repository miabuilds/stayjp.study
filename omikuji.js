// 今日運勢 = 神社おみくじ(2026-09-21)。
// Mia:「抽籤的 UIUX 可以弄得很抽籤嗎,有 fu 一點,不要只是改字跟底色還有 emoji 那樣很無聊」
// → 照真實流程做三段:①搖六角籤筒 ②籤棒掉出來看「第○番」③紙籤直式展開(縦書き+朱印)。
// 細節是關鍵:縦書き(writing-mode)、和紙底色與紋理、朱印、木紋籤筒、搖動時的震動回饋。
// 籤文資料在 omikuji-data.js(由 stayjp-autopost/omikuji.py 產生,兩邊共用同一批)。
// 一天一支:當天結果存 localStorage,重開看到的是同一支(跟真的抽籤一樣,不能一直重抽)。
(function (root) {
  var KEY = 'omikuji_day';
  var L = function (zh, en) { try { return (typeof enOr === 'function') ? enOr(zh, en) : zh; } catch (e) { return zh; } };
  var esc = function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  function fr(t) { try { return root.furiganaHTMLRich ? root.furiganaHTMLRich(t) : esc(t); } catch (e) { return esc(t); } }
  function today() { return new Date().toISOString().slice(0, 10); }
  function pool() { return root.OMIKUJI || []; }

  // 今天抽到哪一支:同一天同一人固定(換裝置也一樣,純日期決定),步長 7 與 30 互質
  function indexFor(d) {
    var base = Math.floor(new Date(d + 'T00:00:00Z').getTime() / 86400000);
    var n = pool().length || 1;
    return ((base * 7) % n + n) % n;
  }
  function saved() { try { var v = JSON.parse(localStorage.getItem(KEY)); return (v && v.d === today()) ? v : null; } catch (e) { return null; } }
  function drawnToday() { return !!saved(); }
  function mark(i) { try { localStorage.setItem(KEY, JSON.stringify({ d: today(), i: i })); } catch (e) {} }

  function css() {
    if (document.getElementById('omkCss')) return;
    var s = document.createElement('style'); s.id = 'omkCss';
    s.textContent = [
      '.omk-mask{position:fixed;inset:0;z-index:9500;background:radial-gradient(120% 90% at 50% 0%,#2b2119 0%,#1a1411 60%,#120e0c 100%);display:flex;flex-direction:column;align-items:center;overflow-y:auto;-webkit-overflow-scrolling:touch}',
      'body.omk-open{overflow:hidden}body.omk-open #tutorFab,body.omk-open #tutorHint,body.omk-open .bt,body.omk-open #quotaBadge,body.omk-open #backToTop{display:none!important}',
      '.omk-x{position:absolute;top:calc(10px + env(safe-area-inset-top));right:12px;z-index:3;background:rgba(255,255,255,.1);border:0;color:#F3EADF;font-size:18px;line-height:1;padding:9px 12px;border-radius:12px;cursor:pointer}',
      '.omk-wrap{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;padding:calc(56px + env(safe-area-inset-top)) 20px calc(40px + env(safe-area-inset-bottom));width:100%;max-width:520px}',
      '.omk-ttl{color:#E9D9BE;font-size:13px;letter-spacing:.42em;text-indent:.42em;opacity:.85}',
      '.omk-hint{color:#C9B693;font-size:13.5px;line-height:1.8;text-align:center;min-height:44px}',
      // ── 籤筒(六角木筒:木紋漸層 + 稜線 + 頂蓋出籤孔)──
      '.omk-box{position:relative;width:112px;height:252px;cursor:pointer;-webkit-tap-highlight-color:transparent;touch-action:manipulation;transform-origin:50% 88%}',
      '.omk-box .bd{position:absolute;inset:0;border-radius:12px 12px 10px 10px;background:linear-gradient(90deg,#4a2f1c 0%,#8a5a34 16%,#a6703f 30%,#7d4f2c 46%,#9c6939 62%,#6d4426 82%,#3f2716 100%);box-shadow:0 18px 40px rgba(0,0,0,.55),inset 0 0 0 1px rgba(0,0,0,.35)}',
      '.omk-box .bd:after{content:"";position:absolute;inset:0;border-radius:inherit;background:repeating-linear-gradient(90deg,rgba(0,0,0,.14) 0 1px,transparent 1px 7px);opacity:.5}',
      '.omk-box .hole{position:absolute;top:-1px;left:50%;width:15px;height:8px;margin-left:-7.5px;border-radius:0 0 8px 8px;background:#120c08;box-shadow:inset 0 3px 5px rgba(0,0,0,.9);z-index:2}',
      '.omk-box .kanji{position:absolute;inset:40px 0 22px;display:flex;align-items:center;justify-content:center;writing-mode:vertical-rl;font-size:30px;letter-spacing:.18em;color:#F6E7C8;font-family:"Hiragino Mincho ProN","Noto Serif JP",serif;text-shadow:0 2px 3px rgba(0,0,0,.65)}',
      '.omk-box .band{position:absolute;left:0;right:0;height:9px;background:linear-gradient(180deg,#B3402A,#8d2f1f);box-shadow:0 1px 2px rgba(0,0,0,.4)}',
      '.omk-box .band.b1{top:52px}.omk-box .band.b2{bottom:40px}',
      '@keyframes omkShake{0%,100%{transform:rotate(-7deg) translateY(0)}25%{transform:rotate(6deg) translateY(-5px)}50%{transform:rotate(-5deg) translateY(2px)}75%{transform:rotate(7deg) translateY(-3px)}}',
      '.omk-box.shaking{animation:omkShake .28s linear infinite}',
      '.omk-box:active{transform:scale(.97)}',
      // ── 籤棒 ──
      '@keyframes omkOut{0%{transform:translate(-50%,40px) rotate(0deg);opacity:0}55%{opacity:1}100%{transform:translate(-50%,-224px) rotate(9deg);opacity:1}}',
      '.omk-stick{position:absolute;left:50%;bottom:22px;width:17px;height:170px;border-radius:4px;background:linear-gradient(90deg,#c8a878,#f0ddb8 38%,#e2c99c 62%,#b8946a);box-shadow:0 8px 20px rgba(0,0,0,.5);animation:omkOut .95s cubic-bezier(.2,.75,.3,1) forwards;z-index:1}',
      '.omk-stick:before{content:"";position:absolute;left:0;right:0;top:0;height:20px;border-radius:4px 4px 0 0;background:#B3402A}',
      '.omk-stick span{position:absolute;inset:26px 0 6px;writing-mode:vertical-rl;display:flex;align-items:center;justify-content:center;font-size:13px;letter-spacing:.1em;color:#4a3320;font-family:"Hiragino Mincho ProN","Noto Serif JP",serif}',
      // ── 紙籤(和紙 + 縦書き + 朱印)──
      '@keyframes omkUnroll{from{clip-path:inset(0 0 100% 0);transform:translateY(-6px)}to{clip-path:inset(0 0 0 0);transform:none}}',
      '.omk-slip{position:relative;width:100%;max-width:340px;background:#FBF6EA;border-radius:4px;padding:22px 20px 20px;box-shadow:0 22px 50px rgba(0,0,0,.55);animation:omkUnroll .75s ease forwards;color:#2a2018}',
      '.omk-slip:before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(120,90,50,.055) 0 1px,transparent 1px 4px),repeating-linear-gradient(90deg,rgba(120,90,50,.045) 0 1px,transparent 1px 5px)}',
      '.omk-slip:after{content:"";position:absolute;left:0;right:0;top:0;height:5px;background:linear-gradient(90deg,#B3402A,#d9694f,#B3402A);border-radius:4px 4px 0 0}',
      '.omk-slip .no{font-size:12px;color:#8a7358;letter-spacing:.14em;font-family:"Hiragino Mincho ProN","Noto Serif JP",serif}',
      // 抬頭:左邊番号、右邊大大的籤等(真的籤就是這樣,運勢最大最顯眼)
      '.omk-head{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;border-bottom:1px solid rgba(120,90,50,.28);padding-bottom:10px}',
      '.omk-rank{text-align:right;line-height:1;font-family:"Hiragino Mincho ProN","Noto Serif JP",serif}',
      '.omk-rank b{display:block;font-size:46px;font-weight:700;letter-spacing:.08em;color:#B3402A}',
      '.omk-rank small{display:block;font-size:11.5px;color:#8a7358;letter-spacing:.14em;margin-top:5px}',
      // 詩:直排、由右往左,整塊靠右
      '.omk-vert{display:flex;justify-content:flex-end;margin:16px 0 4px;min-height:150px}',
      '.omk-poem{writing-mode:vertical-rl;font-size:18px;line-height:2.2;letter-spacing:.08em;max-height:210px;font-family:"Hiragino Mincho ProN","Noto Serif JP",serif}',
      '.omk-poem rt{font-size:.5em;color:#8a7358}',
      // 頁尾:社名 + 朱印(不要壓到內容)
      '.omk-foot{display:flex;align-items:center;justify-content:flex-end;gap:12px;margin-top:16px;padding-top:12px;border-top:1px solid rgba(120,90,50,.28)}',
      '.omk-foot span{font-size:12px;color:#8a7358;letter-spacing:.2em;font-family:"Hiragino Mincho ProN","Noto Serif JP",serif}',
      '.omk-seal{width:52px;height:52px;flex:none;border-radius:50%;border:2.5px solid rgba(179,64,42,.7);color:rgba(179,64,42,.78);display:flex;align-items:center;justify-content:center;writing-mode:vertical-rl;font-size:12.5px;letter-spacing:.16em;font-family:"Hiragino Mincho ProN","Noto Serif JP",serif;transform:rotate(-7deg)}',
      '.omk-zh{border-top:1px dashed rgba(120,90,50,.4);margin-top:12px;padding-top:12px;font-size:13.5px;line-height:1.85;color:#5a4a38}',
      '.omk-words{margin-top:14px;padding-top:12px;border-top:1px dashed rgba(120,90,50,.4);display:flex;flex-direction:column;gap:9px}',
      '.omk-w{display:flex;align-items:baseline;gap:9px;font-size:14px}',
      '.omk-w b{font-size:16px;color:#2a2018;font-weight:700}.omk-w i{font-style:normal;font-size:12px;color:#8a7358}.omk-w span{margin-left:auto;font-size:13px;color:#5a4a38}',
      '.omk-w button{flex:none;background:none;border:0;color:#B3402A;cursor:pointer;padding:0 2px;font-size:13px}',
      '.omk-tip{margin-top:14px;padding:12px 13px;border-radius:10px;background:rgba(179,64,42,.08);font-size:13px;line-height:1.8;color:#4a3a2a}',
      '.omk-tip b{color:#B3402A}',
      '.omk-acts{display:flex;gap:10px;width:100%;max-width:340px}',
      '.omk-acts button{flex:1;font:inherit;font-size:14px;font-weight:800;border-radius:12px;padding:12px;cursor:pointer;border:1px solid rgba(233,217,190,.35);background:rgba(255,255,255,.07);color:#EFE3CE}',
      '.omk-acts .go{background:#B3402A;border-color:#B3402A;color:#fff}',
      '@media(min-width:620px){.omk-slip{max-width:380px}.omk-acts{max-width:380px}}',
    ].join('\n');
    document.head.appendChild(s);
  }

  function mask() { return document.getElementById('omkMask'); }
  function close() {
    var m = mask(); if (m) m.remove();
    document.body.classList.remove('omk-open');
    try { if (root.hubInvalidate) root.hubInvalidate(); if (typeof doRender === 'function') doRender(); } catch (e) {}
  }
  function hydrate() { try { if (root.Icons && Icons.hydrate) Icons.hydrate(); } catch (e) {} }
  function buzz(ms) { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {} }

  var shaking = false, holdT = null;

  function open() {
    css();
    var m = mask();
    if (!m) { m = document.createElement('div'); m.id = 'omkMask'; m.className = 'omk-mask'; document.body.appendChild(m); }
    document.body.classList.add('omk-open');
    var s = saved();
    if (s) { renderSlip(s.i, true); return; }
    renderBox();
    try { if (typeof track === 'function') track('omikuji_open', {}); } catch (e) {}
  }

  function renderBox() {
    var m = mask(); if (!m) return;
    m.innerHTML = '<button type="button" class="omk-x" onclick="Omikuji.close()" aria-label="' + L('關閉', 'Close') + '">✕</button>'
      + '<div class="omk-wrap">'
        + '<div class="omk-ttl">' + L('今日のおみくじ', 'OMIKUJI') + '</div>'
        + '<div class="omk-box" id="omkBox"><div class="bd"></div><div class="band b1"></div><div class="band b2"></div>'
          + '<div class="kanji">御籤</div><div class="hole"></div></div>'
        + '<div class="omk-hint" id="omkHint">' + L('長按籤筒，搖到籤棒掉出來', 'Press and hold to shake the box') + '</div>'
      + '</div>';
    var box = document.getElementById('omkBox');
    var start = function (ev) {
      if (shaking) return; ev.preventDefault();
      shaking = true; box.classList.add('shaking'); buzz([18, 60, 18, 60, 18]);
      document.getElementById('omkHint').textContent = L('繼續搖…', 'Keep shaking…');
      holdT = setTimeout(popStick, 1250);
    };
    var cancel = function () {
      if (!shaking) return;
      clearTimeout(holdT); shaking = false; box.classList.remove('shaking');
      var h = document.getElementById('omkHint'); if (h) h.textContent = L('再搖久一點，籤棒才會出來', 'Hold a little longer');
    };
    box.addEventListener('pointerdown', start);
    box.addEventListener('pointerup', cancel);
    box.addEventListener('pointercancel', cancel);
    box.addEventListener('pointerleave', cancel);
  }

  function popStick() {
    shaking = false;
    var box = document.getElementById('omkBox'); if (!box) return;
    box.classList.remove('shaking');
    var i = indexFor(today());
    var st = document.createElement('div'); st.className = 'omk-stick';
    st.innerHTML = '<span>' + numJa(i + 1) + '番</span>';
    box.appendChild(st); buzz(35);
    var h = document.getElementById('omkHint');
    if (h) h.innerHTML = L('出來了 —— <b style="color:#E9D9BE">' + numJa(i + 1) + '番</b>，點一下看籤', 'Number ' + (i + 1) + ' — tap to open');
    setTimeout(function () {
      var w = document.querySelector('.omk-wrap'); if (!w) return;
      w.style.cursor = 'pointer';
      w.onclick = function () { mark(i); renderSlip(i, false); };
      setTimeout(function () { if (mask() && document.querySelector('.omk-stick')) { mark(i); renderSlip(i, false); } }, 2600);   // 沒點也會自己展開
    }, 950);
  }

  // 漢數字(第○番)
  function numJa(n) {
    var K = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    if (n < 10) return '第' + K[n];
    if (n < 20) return '第十' + (n % 10 ? K[n % 10] : '');
    return '第' + K[Math.floor(n / 10)] + '十' + (n % 10 ? K[n % 10] : '');
  }

  function renderSlip(i, again) {
    var m = mask(); if (!m) return;
    var e = pool()[i]; if (!e) { close(); return; }
    var poem = e.jp.map(function (x) { return fr(x); }).join('<br>');
    var words = e.w.map(function (w) {
      return '<div class="omk-w"><b>' + esc(w[0]) + '</b><i>' + esc(w[1]) + '</i>'
        + '<button type="button" onclick="Omikuji.say(\'' + esc(w[1]).replace(/'/g, '&#39;') + '\')" aria-label="' + L('發音', 'Play') + '"><i data-ic=volume></i></button>'
        + '<span>' + esc(w[2]) + '</span></div>';
    }).join('');
    m.innerHTML = '<button type="button" class="omk-x" onclick="Omikuji.close()" aria-label="' + L('關閉', 'Close') + '">✕</button>'
      + '<div class="omk-wrap">'
        + '<div class="omk-slip">'
          + '<div class="omk-head"><div class="no">' + numJa(i + 1) + '番</div>'
            + '<div class="omk-rank"><b>' + esc(e.r) + '</b><small>' + esc(e.k) + '</small></div></div>'
          + '<div class="omk-vert"><div class="omk-poem">' + poem + '</div></div>'
          + '<div class="omk-zh">' + esc(e.zh) + '</div>'
          + '<div class="omk-words">' + words + '</div>'
          + (e.tip ? '<div class="omk-tip"><b>学問</b>　' + esc(e.tip) + '</div>' : '')
          + '<div class="omk-foot"><span>日本再留計劃</span><div class="omk-seal">御籤</div></div>'
        + '</div>'
        + '<div class="omk-acts">'
          + '<button type="button" onclick="Omikuji.close()">' + L('收起來', 'Close') + '</button>'
          + '<button type="button" class="go" onclick="Omikuji.study()">' + L('去做今天的關', 'Start today') + '</button>'
        + '</div>'
        + '<div class="omk-hint">' + (again ? L('今天已經抽過了，明天再來', 'Already drawn today — come back tomorrow') : L('一天一支，明天再抽', 'One a day — see you tomorrow')) + '</div>'
      + '</div>';
    hydrate();
    try { if (typeof track === 'function') track('omikuji_draw', { rank: e.r, again: !!again }); } catch (e2) {}
    try { if (root.StayDaily && root.StayDaily.log) root.StayDaily.log('omikuji'); } catch (e3) {}
  }

  function say(t) { try { if (root.MyVocab && MyVocab.say) MyVocab.say(t); else if (typeof speak === 'function') speak(t); } catch (e) {} }
  function study() {
    close();
    try { if (root.Path && Path.openMap) { Path.openMap(); return; } } catch (e) {}
    try { if (typeof SRS !== 'undefined' && SRS.start) SRS.start(); } catch (e) {}
  }

  root.Omikuji = { open: open, close: close, say: say, study: study, drawnToday: drawnToday };
  try { if (root.NavBack) NavBack.register('omikuji', function () { open(); }); } catch (e) {}
})(window);
