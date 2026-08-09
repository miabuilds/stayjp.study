// 五十音 UI:表格(清/濁/半濁/拗音)、平/片假名切換、點格進詳情(發音+筆順動畫+描寫練習)、測驗(認讀+筆畫數)。
// 發音走預錄 VOICEVOX(不用瀏覽器語音)。筆順 SVG 來自 KanjiVG(CC BY-SA 3.0,見 CREDITS.md)。
window.Kana = (function () {
  'use strict';
  var script = 'h';   // 'h' 平假名 / 'k' 片假名
  var chartMode = 'sound';   // 'sound' 點格發音(不跳頁) / 'stroke' 點格看筆順+描寫
  var SEC = [['seion', '清音'], ['dakuon', '濁音'], ['handakuon', '半濁音'], ['youon', '拗音']];
  function K() { return window.KANA || {}; }
  // 三語:en→英文;zh-CN→OpenCC 轉簡(cvt);zh-TW→原樣繁體
  function enOr(zh, en) { try { var l = (typeof I18n !== 'undefined' && I18n.getLang) ? I18n.getLang() : (localStorage.getItem('ui_lang') || 'zh-TW'); if (l === 'en') return en; return (typeof cvt === 'function') ? cvt(zh) : zh; } catch (e) { return zh; } }
  // 播放走自帶 Audio + 版本號(?v=):純預錄 mp3(不用瀏覽器語音),改版 bump 版本號即強制抓新檔,避開 immutable 快取。
  var KANA_AUDIO_VER = '3', _kAudio = null;
  function play(h) {
    if (!h || !window.__TTS || !window.__TTS[h]) return;
    var base = window.ttsUrl ? window.ttsUrl(window.__TTS[h]) : 'audio/tts/' + window.__TTS[h] + '.mp3';
    try { if (_kAudio) _kAudio.pause(); _kAudio = new Audio(base + (base.indexOf('?') < 0 ? '?v=' : '&v=') + KANA_AUDIO_VER); _kAudio.play().catch(function () {}); } catch (e) {}
  }
  function hex(ch) { return ch.codePointAt(0).toString(16).padStart(5, '0'); }
  function single(ch) { return ch && [].concat.apply([], [ch]).join('').length && [...ch].length === 1; }

  function ensureCss() {
    if (document.getElementById('kanaCss')) return;
    var st = document.createElement('style'); st.id = 'kanaCss';
    st.textContent = [
      '#kanaMask{position:fixed;inset:0;z-index:9000;background:var(--bg,#faf9f6);overflow-y:auto;-webkit-overflow-scrolling:touch}',
      '.kana-wrap{max-width:560px;margin:0 auto;padding:14px 16px 90px}',
      '.kana-top{position:sticky;top:0;background:var(--bg,#faf9f6);display:flex;align-items:center;gap:10px;padding:8px 0 10px;border-bottom:1px solid var(--bd,#e8e5e0);z-index:2}',
      '.kana-top b{font-size:17px}',
      '.kana-x{margin-left:auto;cursor:pointer;font-size:20px;color:var(--tx2,#888);padding:4px 8px}',
      '.kana-tabs{display:flex;gap:8px;margin:12px 0;flex-wrap:wrap}',
      '.kana-tab{flex:1;min-width:90px;border:1px solid var(--bd,#ddd);background:var(--bg2,#fff);color:var(--tx2,#666);border-radius:10px;padding:9px;font-size:15px;font-weight:700;cursor:pointer}',
      '.kana-tab.on{background:var(--ac2,#e8734a);color:#fff;border-color:var(--ac2,#e8734a)}',
      '.kana-quiz-btn{border:none;background:var(--ac,#d4654a);color:#fff;border-radius:10px;padding:9px 16px;font-size:14px;font-weight:700;cursor:pointer}',
      '.kana-modes{display:flex;gap:8px;margin:0 0 8px;flex-wrap:wrap}',
      '.kana-mode-btn{border:1px solid var(--bd,#ddd);background:var(--bg2,#fff);color:var(--tx2,#666);border-radius:10px;padding:9px 15px;font-size:14px;font-weight:700;cursor:pointer;min-height:40px}',
      '.kana-mode-btn.on{background:var(--ac2,#e8734a);color:#fff;border-color:var(--ac2,#e8734a)}',
      '.kana-hint{font-size:12px;color:var(--tx3,#aaa);margin-bottom:6px}',
      '.kana-cell-on{background:var(--ac2,#e8734a)!important}',
      '.kana-cell-on .kana-c{color:#fff!important}',
      '.kana-cell-on .kana-r{color:rgba(255,255,255,.9)!important}',
      '.kana-back{border:none;background:none;cursor:pointer;color:var(--ac,#d4654a);font-size:15px;font-weight:700;padding:6px 10px 6px 4px;border-radius:10px;font-family:inherit}',
      '.kana-back:active{background:rgba(212,101,74,.1)}',
      '.kana-sec-h{font-size:14px;font-weight:800;color:var(--ac,#d4654a);margin:20px 0 8px}',
      '.kana-grid{display:grid;gap:6px}',
      '.kana-grid.c5{grid-template-columns:repeat(5,1fr)}',
      '.kana-grid.c3{grid-template-columns:repeat(3,1fr);max-width:340px}',
      '.kana-cell{background:var(--bg2,#fff);border:1px solid var(--bd,#e8e5e0);border-radius:10px;padding:8px 4px;text-align:center;cursor:pointer;transition:transform .08s,border-color .12s}',
      '.kana-cell:active{transform:scale(.92)}',
      '.kana-cell:hover{border-color:var(--ac2,#e8734a)}',
      '.kana-cell.empty{background:none;border:none;cursor:default}',
      '.kana-c{font-size:24px;font-weight:700;font-family:"Hiragino Mincho ProN","Noto Serif JP",serif;color:var(--tx,#2c2c2c);line-height:1.2}',
      '.kana-r{font-size:11px;color:var(--tx3,#aaa);margin-top:2px}',
      // detail
      '.kd-head{display:flex;align-items:center;gap:14px;margin:8px 0 16px}',
      '.kd-big{font-size:40px;font-weight:700;font-family:"Hiragino Mincho ProN","Noto Serif JP",serif}',
      '.kd-rom{font-size:20px;color:var(--tx2,#777);font-weight:600}',
      '.kd-spk{margin-left:auto;border:none;background:var(--ac,#d4654a);color:#fff;border-radius:50%;width:44px;height:44px;font-size:20px;cursor:pointer}',
      '.kd-stage{background:var(--bg2,#fff);border:1px solid var(--bd,#e8e5e0);border-radius:14px;padding:10px;display:flex;justify-content:center;align-items:center;min-height:240px}',
      '.kd-svg{width:240px;height:240px;display:block}',
      '.kd-svg .kvg-grid{stroke:var(--bd,#eee);stroke-width:.5}',
      '.kd-btns{display:flex;gap:8px;margin:14px 0}',
      '.kd-btns button{flex:1;border:1px solid var(--bd,#ddd);background:var(--bg2,#fff);color:var(--tx,#333);border-radius:10px;padding:11px;font-size:14px;font-weight:700;cursor:pointer}',
      '.kd-btns button.on{background:var(--ac2,#e8734a);color:#fff;border-color:var(--ac2,#e8734a)}',
      '.kd-note{font-size:11px;color:var(--tx3,#bbb);text-align:center;margin-top:14px;line-height:1.6}',
      '.kd-note a{color:var(--tx3,#bbb);text-decoration:underline}',
      // quiz
      '.kq-box{text-align:center;padding:20px 0}',
      '.kq-prompt{font-size:72px;font-weight:700;font-family:"Hiragino Mincho ProN","Noto Serif JP",serif;color:var(--tx,#2c2c2c);margin:10px 0 24px}',
      '.kq-opts{display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:360px;margin:0 auto}',
      '.kq-opt{border:1px solid var(--bd,#ddd);background:var(--bg2,#fff);color:var(--tx,#333);border-radius:12px;padding:15px;font-size:18px;font-weight:600;cursor:pointer}',
      '.kq-opt.ok{background:#16a34a;color:#fff;border-color:#16a34a}',
      '.kq-opt.ng{background:#ef4444;color:#fff;border-color:#ef4444}',
      '.kq-prog{color:var(--tx2,#888);font-size:13px}'
    ].join('');
    document.head.appendChild(st);
  }
  function close() { var m = document.getElementById('kanaMask'); if (m) m.remove(); }
  function wrapEl() { var m = document.getElementById('kanaMask'); return m && m.querySelector('.kana-wrap'); }

  function chartHtml() {
    var h = '';
    SEC.forEach(function (s) {
      var rows = K()[s[0]]; if (!rows || !rows.length) return;
      var cols = (s[0] === 'youon') ? 3 : 5;
      h += '<div class="kana-sec-h">' + s[1] + '</div><div class="kana-grid c' + cols + '">';
      rows.forEach(function (row) {
        for (var i = 0; i < cols; i++) {
          var c = row[i];
          if (!c) { h += '<div class="kana-cell empty"></div>'; continue; }
          var oc = (chartMode === 'stroke') ? ('Kana.detail(\'' + c.h + '\')') : ('Kana.tap(this,\'' + c.h + '\')');
          h += '<div class="kana-cell" onclick="' + oc + '"><div class="kana-c">' + (script === 'h' ? c.h : c.k) + '</div><div class="kana-r">' + c.r + '</div></div>';
        }
      });
      h += '</div>';
    });
    return h;
  }

  function open() { chartMode = 'sound'; renderChart(); }        // 進來就是「發音表」(點格出聲、不跳頁)
  function openStroke() { chartMode = 'stroke'; renderChart(); }   // 筆順模式(點格看筆順+描寫)
  function renderChart() {
    ensureCss(); close();
    var soundHint = enOr('點任一格聽發音', 'Tap a kana to hear it');
    var strokeHint = enOr('點任一格看筆順 + 描寫練習', 'Tap a kana for stroke order & tracing');
    var h = '<div id="kanaMask"><div class="kana-wrap">' +
      '<div class="kana-top"><b>あ ' + enOr('五十音', 'Kana') + '</b><span class="kana-x" onclick="Kana.close()">✕</span></div>' +
      '<div class="kana-tabs">' +
      '<button class="kana-tab ' + (script === 'h' ? 'on' : '') + '" onclick="Kana.setScript(\'h\')">ひらがな</button>' +
      '<button class="kana-tab ' + (script === 'k' ? 'on' : '') + '" onclick="Kana.setScript(\'k\')">カタカナ</button>' +
      '</div>' +
      '<div class="kana-modes">' +
      '<button class="kana-mode-btn ' + (chartMode === 'sound' ? 'on' : '') + '" onclick="Kana.setMode(\'sound\')">🔊 ' + enOr('發音', 'Sound') + '</button>' +
      '<button class="kana-mode-btn ' + (chartMode === 'stroke' ? 'on' : '') + '" onclick="Kana.setMode(\'stroke\')">✏️ ' + enOr('筆順練習', 'Strokes') + '</button>' +
      '<button class="kana-quiz-btn" onclick="Kana.quiz(\'read\')">📝 ' + enOr('測驗', 'Quiz') + '</button>' +
      '</div>' +
      '<div id="kanaHint" class="kana-hint">' + (chartMode === 'stroke' ? strokeHint : soundHint) + '</div>' +
      '<div id="kanaChart">' + chartHtml() + '</div>' +
      '</div></div>';
    var d = document.createElement('div'); d.innerHTML = h; document.body.appendChild(d.firstChild);
    try { if (typeof track === 'function') track('kana_open', { mode: chartMode }); } catch (e) {}
  }
  function setMode(m) { chartMode = m; renderChart(); }   // 重繪:切換發音/筆順表(工具列高亮與提示自動正確)
  function tap(el, h) {   // 發音模式:點格出聲 + 短暫高亮(不跳頁)
    play(h);
    if (el) { el.classList.add('kana-cell-on'); setTimeout(function () { el.classList.remove('kana-cell-on'); }, 420); }
  }
  function setScript(s) {
    script = s;
    document.querySelectorAll('.kana-tab').forEach(function (t, i) { t.classList.toggle('on', (i === 0 && s === 'h') || (i === 1 && s === 'k')); });
    var chart = document.getElementById('kanaChart'); if (chart) chart.innerHTML = chartHtml();
  }

  // ── 詳情:發音 + 筆順動畫 + 描寫練習 ──
  function findCell(h) { var r = null; SEC.forEach(function (s) { (K()[s[0]] || []).forEach(function (row) { row.forEach(function (c) { if (c && c.h === h) r = c; }); }); }); return r; }
  function detail(h) {
    ensureCss();
    var c = findCell(h); if (!c) return;
    var w = wrapEl(); if (!w) { open(); w = wrapEl(); }
    var ch = (script === 'k') ? c.k : c.h;
    var hasStroke = [...ch].length === 1; // 拗音(2字)無單一筆順檔
    w.innerHTML =
      '<div class="kana-top"><button class="kana-back" onclick="Kana.openStroke()">‹ ' + enOr('筆順表', 'Back') + '</button><b style="margin:0 auto 0 0">' + enOr('筆順・描寫', 'Strokes') + '</b><span class="kana-x" onclick="Kana.close()">✕</span></div>' +
      '<div class="kd-head"><span class="kd-big">' + ch + '</span><span class="kd-rom">' + c.r + '</span>' +
      '<button class="kd-spk" onclick="Kana.play(\'' + c.h + '\')">🔊</button></div>' +
      (hasStroke
        ? '<div class="kd-stage" id="kdStage"><div style="color:var(--tx3,#bbb);font-size:13px">' + enOr('載入筆順中…', 'Loading…') + '</div></div>' +
          '<div class="kd-btns">' +
          '<button id="kdPlay" class="on" onclick="Kana.strokeMode(\'' + h + '\',\'play\')">✏️ ' + enOr('看筆順', 'Stroke order') + '</button>' +
          '<button id="kdTrace" onclick="Kana.strokeMode(\'' + h + '\',\'trace\')">🖊️ ' + enOr('描寫練習', 'Trace') + '</button>' +
          '</div>' +
          '<div class="kd-note">' + enOr('筆順資料', 'Stroke data') + ':<a href="http://kanjivg.tagaini.net" target="_blank" rel="noopener">KanjiVG</a> (CC BY-SA 3.0)</div>'
        : '<div class="kd-stage"><div style="text-align:center"><div style="font-size:64px;font-family:serif">' + ch + '</div><div style="color:var(--tx3,#bbb);font-size:12px;margin-top:10px">' + enOr('拗音為組合音,請看個別假名的筆順', 'Combined sound — see the base kana for stroke order') + '</div></div></div>');
    play(c.h);
    if (hasStroke) strokeMode(h, 'play');
  }

  // 取得 SVG 文字(快取)
  var svgCache = {};
  function loadSvg(ch) {
    var hx = hex(ch);
    if (svgCache[hx]) return Promise.resolve(svgCache[hx]);
    return fetch('assets/kanjivg/kana/' + hx + '.svg').then(function (r) { return r.ok ? r.text() : null; }).then(function (t) { if (t) svgCache[hx] = t; return t; });
  }
  function paths(svgEl) { return svgEl.querySelectorAll('g[id^="kvg:StrokePaths"] path'); }
  function animate(svgEl) {
    var ps = paths(svgEl), delay = 0;
    ps.forEach(function (p) {
      var len = p.getTotalLength();
      p.style.transition = 'none'; p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
      p.getBoundingClientRect();
      var dur = Math.max(0.35, Math.min(1.2, len / 130));
      p.style.stroke = 'var(--ac2,#e8734a)';
      p.style.transition = 'stroke-dashoffset ' + dur + 's ease ' + delay + 's';
      p.style.strokeDashoffset = 0;
      delay += dur + 0.18;
    });
  }
  function strokeMode(h, mode) {
    var c = findCell(h); if (!c) return;
    var ch = (script === 'k') ? c.k : c.h;
    var stage = document.getElementById('kdStage'); if (!stage) return;
    var bp = document.getElementById('kdPlay'), bt = document.getElementById('kdTrace');
    if (bp) bp.classList.toggle('on', mode === 'play');
    if (bt) bt.classList.toggle('on', mode === 'trace');
    loadSvg(ch).then(function (txt) {
      if (!txt) { stage.innerHTML = '<div style="color:var(--tx3,#bbb)">' + enOr('無筆順資料', 'No stroke data') + '</div>'; return; }
      var doc = new DOMParser().parseFromString(txt, 'image/svg+xml');
      var svg = doc.querySelector('svg'); svg.removeAttribute('width'); svg.removeAttribute('height');
      svg.setAttribute('class', 'kd-svg');
      // 隱藏筆順號碼(描寫時保留當提示;動畫時隱藏較乾淨,兩者都留提示號碼更好教學→保留)
      if (mode === 'play') {
        stage.innerHTML = ''; stage.appendChild(svg);
        // 動畫前先隱藏,下一幀開始畫
        paths(svg).forEach(function (p) { var l = p.getTotalLength(); p.style.strokeDasharray = l; p.style.strokeDashoffset = l; });
        requestAnimationFrame(function () { requestAnimationFrame(function () { animate(svg); }); });
      } else {
        // 描寫:SVG 當淡淡底稿 + canvas 疊上手寫
        paths(svg).forEach(function (p) { p.style.stroke = 'var(--bd,#ddd)'; });
        var box = document.createElement('div'); box.style.position = 'relative'; box.style.width = '240px'; box.style.height = '240px';
        box.appendChild(svg);
        var cv = document.createElement('canvas'); cv.width = 240; cv.height = 240;
        cv.style.cssText = 'position:absolute;inset:0;touch-action:none;cursor:crosshair';
        box.appendChild(cv);
        stage.innerHTML = ''; stage.appendChild(box);
        traceInit(cv);
      }
    });
  }
  function traceInit(cv) {
    var ctx = cv.getContext('2d'); ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#e8734a';
    var drawing = false;
    function pt(e) { var r = cv.getBoundingClientRect(); var t = e.touches ? e.touches[0] : e; return { x: (t.clientX - r.left) * cv.width / r.width, y: (t.clientY - r.top) * cv.height / r.height }; }
    function down(e) { e.preventDefault(); drawing = true; var p = pt(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); }
    function move(e) { if (!drawing) return; e.preventDefault(); var p = pt(e); ctx.lineTo(p.x, p.y); ctx.stroke(); }
    function up() { drawing = false; }
    cv.addEventListener('pointerdown', down); cv.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    cv._clear = function () { ctx.clearRect(0, 0, cv.width, cv.height); };
    // 清除鈕(加到 stage 下方 btns 若尚無)
    var stage = document.getElementById('kdStage');
    if (stage && !document.getElementById('kdClear')) {
      var b = document.createElement('button'); b.id = 'kdClear'; b.textContent = '🧹 ' + enOr('清除', 'Clear');
      b.style.cssText = 'display:block;margin:10px auto 0;border:1px solid var(--bd,#ddd);background:var(--bg2,#fff);border-radius:10px;padding:8px 20px;font-size:13px;font-weight:700;cursor:pointer;color:var(--tx,#333)';
      b.onclick = function () { if (cv._clear) cv._clear(); };
      stage.parentNode.insertBefore(b, stage.nextSibling);
    }
  }

  // ── 測驗:認讀(選羅馬音) / 筆畫數 ──
  var qList = [], qIdx = 0, qScore = 0, qMode = 'read';
  function allCells() { var out = []; SEC.forEach(function (s) { (K()[s[0]] || []).forEach(function (row) { row.forEach(function (c) { if (c) out.push(c); }); }); }); return out; }
  function rnd() { return (typeof crypto !== 'undefined' && crypto.getRandomValues) ? crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296 : Math.random(); }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function quizMenu() {
    ensureCss(); var w = wrapEl(); if (!w) { open(); w = wrapEl(); }
    w.innerHTML = '<div class="kana-top"><b>📝 ' + enOr('選擇測驗', 'Choose quiz') + '</b><span class="kana-x" onclick="Kana.open()">✕</span></div>' +
      '<div class="kq-box"><div style="display:flex;flex-direction:column;gap:12px;max-width:320px;margin:20px auto">' +
      '<button class="kana-tab" style="padding:16px" onclick="Kana.quiz(\'read\')">🔤 ' + enOr('認讀測驗', 'Reading') + '<div style="font-size:12px;font-weight:400;color:var(--tx3,#aaa);margin-top:4px">' + enOr('看假名 → 選羅馬拼音', 'Kana → romaji') + '</div></button>' +
      '</div></div>';
  }
  function quiz(mode) {
    ensureCss(); qMode = mode || 'read';
    var pool = allCells();
    if (qMode === 'stroke') { var S = window.KANA_STROKES || {}; pool = pool.filter(function (c) { var ch = (script === 'k') ? c.k : c.h; return S[ch]; }); }
    qList = shuffle(pool.slice()).slice(0, 10); qIdx = 0; qScore = 0; renderQ();
  }
  function renderQ() {
    var w = wrapEl(); if (!w) { open(); w = wrapEl(); }
    if (qIdx >= qList.length) {
      w.innerHTML = '<div class="kana-top"><b>📝 ' + enOr('測驗結果', 'Result') + '</b><span class="kana-x" onclick="Kana.close()">✕</span></div>' +
        '<div class="kq-box"><div style="font-size:48px;margin:20px 0">' + (qScore >= 8 ? '🎉' : qScore >= 5 ? '👍' : '💪') + '</div>' +
        '<div style="font-size:22px;font-weight:700">' + qScore + ' / ' + qList.length + '</div>' +
        '<div style="margin-top:24px"><button class="kana-quiz-btn" onclick="Kana.quiz(\'' + qMode + '\')">' + enOr('再測一次', 'Again') + '</button> <button class="kana-tab" style="display:inline-block;width:auto;padding:9px 16px" onclick="Kana.open()">' + enOr('回五十音表', 'Back to chart') + '</button></div></div>';
      return;
    }
    var c = qList[qIdx];
    var showChar = (script === 'k') ? c.k : c.h;
    var head = '<div class="kana-top"><b>📝 ' + (qMode === 'stroke' ? enOr('筆畫數測驗', 'Stroke count') : enOr('認讀測驗', 'Reading')) + '</b><span class="kq-prog">' + (qIdx + 1) + ' / ' + qList.length + '</span><span class="kana-x" onclick="Kana.open()">✕</span></div>';
    var opts, correct, hint;
    if (qMode === 'stroke') {
      var S = window.KANA_STROKES || {}; correct = String(S[showChar] || S[c.h]);
      var set = {}; set[correct] = 1; var n = parseInt(correct, 10);
      var cand = [n - 1, n + 1, n + 2, n - 2, 1, 2, 3, 4].map(String);
      for (var i = 0; i < cand.length && Object.keys(set).length < 4; i++) { if (parseInt(cand[i], 10) >= 1 && !set[cand[i]]) set[cand[i]] = 1; }
      opts = shuffle(Object.keys(set));
      hint = enOr('這個假名有幾畫?', 'How many strokes?');
    } else {
      var others = shuffle(allCells().filter(function (x) { return x.r !== c.r; }));
      correct = c.r; opts = shuffle([c.r, others[0].r, others[1].r, others[2].r]);
      hint = enOr('選出正確的羅馬拼音', 'Pick the correct romaji');
    }
    w.innerHTML = head + '<div class="kq-box"><div class="kq-prompt" onclick="Kana.play(\'' + c.h + '\')">' + showChar + '</div>' +
      '<div class="kq-opts">' + opts.map(function (o) { return '<button class="kq-opt" onclick="Kana.answer(this,\'' + o + '\',\'' + correct + '\',\'' + c.h + '\')">' + (qMode === 'stroke' ? o + ' ' + enOr('畫', '') : o) + '</button>'; }).join('') + '</div>' +
      '<div style="margin-top:16px;font-size:12px;color:var(--tx3,#aaa)">' + hint + '</div></div>';
  }
  function answer(btn, chosen, correct, h) {
    play(h);
    var opts = btn.parentElement.querySelectorAll('.kq-opt');
    opts.forEach(function (o) { o.onclick = null; if (o.getAttribute('data-v') === correct || o.textContent.trim().split(' ')[0] === correct) o.classList.add('ok'); });
    if (String(chosen) === String(correct)) { qScore++; } else { btn.classList.add('ng'); }
    setTimeout(function () { qIdx++; renderQ(); }, 800);
  }

  return { open: open, openStroke: openStroke, setMode: setMode, tap: tap, close: close, setScript: setScript, play: play, detail: detail, strokeMode: strokeMode, quizMenu: quizMenu, quiz: quiz, answer: answer };
})();
