// 五十音表 UI:清音/濁音/半濁音/拗音表格、平/片假名切換、點格發音(預錄 TTS)、認讀測驗。
// 筆順/描寫練習為下一階段。純前端、發音走預錄(不用瀏覽器語音)。
window.Kana = (function () {
  'use strict';
  var script = 'h';   // 'h' 平假名 / 'k' 片假名
  var SEC = [['seion', '清音'], ['dakuon', '濁音'], ['handakuon', '半濁音'], ['youon', '拗音']];
  function K() { return window.KANA || {}; }
  function enOr(zh, en) { try { return localStorage.getItem('ui_lang') === 'en' ? en : zh; } catch (e) { return zh; } }
  function play(h) { if (h && window.__TTS && window.__TTS[h] && typeof speak === 'function') speak(h); }

  function ensureCss() {
    if (document.getElementById('kanaCss')) return;
    var st = document.createElement('style'); st.id = 'kanaCss';
    st.textContent = [
      '#kanaMask{position:fixed;inset:0;z-index:9000;background:var(--bg,#faf9f6);overflow-y:auto;-webkit-overflow-scrolling:touch}',
      '.kana-wrap{max-width:560px;margin:0 auto;padding:14px 16px 90px}',
      '.kana-top{position:sticky;top:0;background:var(--bg,#faf9f6);display:flex;align-items:center;gap:10px;padding:8px 0 10px;border-bottom:1px solid var(--bd,#e8e5e0);z-index:2}',
      '.kana-top b{font-size:17px}',
      '.kana-x{margin-left:auto;cursor:pointer;font-size:20px;color:var(--tx2,#888);padding:4px 8px}',
      '.kana-tabs{display:flex;gap:8px;margin:12px 0}',
      '.kana-tab{flex:1;border:1px solid var(--bd,#ddd);background:var(--bg2,#fff);color:var(--tx2,#666);border-radius:10px;padding:9px;font-size:15px;font-weight:700;cursor:pointer}',
      '.kana-tab.on{background:var(--ac2,#e8734a);color:#fff;border-color:var(--ac2,#e8734a)}',
      '.kana-quiz-btn{border:none;background:var(--ac,#d4654a);color:#fff;border-radius:10px;padding:9px 16px;font-size:14px;font-weight:700;cursor:pointer}',
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
          h += '<div class="kana-cell" onclick="Kana.play(\'' + c.h + '\')"><div class="kana-c">' + (script === 'h' ? c.h : c.k) + '</div><div class="kana-r">' + c.r + '</div></div>';
        }
      });
      h += '</div>';
    });
    return h;
  }

  function open() {
    ensureCss(); close();
    var h = '<div id="kanaMask"><div class="kana-wrap">' +
      '<div class="kana-top"><b>あ ' + enOr('五十音', 'Kana') + '</b><span class="kana-x" onclick="Kana.close()">✕</span></div>' +
      '<div class="kana-tabs">' +
      '<button class="kana-tab ' + (script === 'h' ? 'on' : '') + '" onclick="Kana.setScript(\'h\')">ひらがな</button>' +
      '<button class="kana-tab ' + (script === 'k' ? 'on' : '') + '" onclick="Kana.setScript(\'k\')">カタカナ</button>' +
      '<button class="kana-quiz-btn" onclick="Kana.quiz()">📝 ' + enOr('測驗', 'Quiz') + '</button>' +
      '</div>' +
      '<div style="font-size:12px;color:var(--tx3,#aaa);margin-bottom:4px">' + enOr('點任一格聽發音', 'Tap any cell to hear it') + '</div>' +
      '<div id="kanaChart">' + chartHtml() + '</div>' +
      '</div></div>';
    var d = document.createElement('div'); d.innerHTML = h; document.body.appendChild(d.firstChild);
    try { if (typeof track === 'function') track('kana_open', {}); } catch (e) {}
  }
  function setScript(s) {
    script = s;
    document.querySelectorAll('.kana-tab').forEach(function (t, i) { t.classList.toggle('on', (i === 0 && s === 'h') || (i === 1 && s === 'k')); });
    var chart = document.getElementById('kanaChart'); if (chart) chart.innerHTML = chartHtml();
  }

  // ── 認讀測驗:顯示假名 → 選羅馬音 ──
  var qList = [], qIdx = 0, qScore = 0;
  function allCells() { var out = []; SEC.forEach(function (s) { (K()[s[0]] || []).forEach(function (row) { row.forEach(function (c) { if (c) out.push(c); }); }); }); return out; }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor((typeof crypto !== 'undefined' && crypto.getRandomValues ? crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296 : Math.random()) * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function quiz() {
    ensureCss();
    var pool = allCells(); qList = shuffle(pool.slice()).slice(0, 10); qIdx = 0; qScore = 0;
    renderQ();
  }
  function renderQ() {
    var mask = document.getElementById('kanaMask') || (function () { open(); return document.getElementById('kanaMask'); })();
    if (qIdx >= qList.length) {
      mask.querySelector('.kana-wrap').innerHTML = '<div class="kana-top"><b>📝 ' + enOr('測驗結果', 'Result') + '</b><span class="kana-x" onclick="Kana.close()">✕</span></div>' +
        '<div class="kq-box"><div style="font-size:48px;margin:20px 0">' + (qScore >= 8 ? '🎉' : qScore >= 5 ? '👍' : '💪') + '</div>' +
        '<div style="font-size:22px;font-weight:700">' + qScore + ' / ' + qList.length + '</div>' +
        '<div style="margin-top:24px"><button class="kana-quiz-btn" onclick="Kana.quiz()">' + enOr('再測一次', 'Again') + '</button> <button class="kana-tab" style="display:inline-block;width:auto;padding:9px 16px" onclick="Kana.open()">' + enOr('回五十音表', 'Back to chart') + '</button></div></div>';
      return;
    }
    var c = qList[qIdx];
    // 選項:正解 + 3 個干擾(不重複羅馬音)
    var others = shuffle(allCells().filter(function (x) { return x.r !== c.r; }));
    var opts = shuffle([c.r, others[0].r, others[1].r, others[2].r]);
    var showChar = (script === 'k') ? c.k : c.h;
    mask.querySelector('.kana-wrap').innerHTML = '<div class="kana-top"><b>📝 ' + enOr('認讀測驗', 'Quiz') + '</b><span class="kq-prog">' + (qIdx + 1) + ' / ' + qList.length + '</span><span class="kana-x" onclick="Kana.open()">✕</span></div>' +
      '<div class="kq-box"><div class="kq-prompt" onclick="Kana.play(\'' + c.h + '\')">' + showChar + '</div>' +
      '<div class="kq-opts">' + opts.map(function (o) { return '<button class="kq-opt" onclick="Kana.answer(this,\'' + o + '\',\'' + c.r + '\',\'' + c.h + '\')">' + o + '</button>'; }).join('') + '</div>' +
      '<div style="margin-top:16px;font-size:12px;color:var(--tx3,#aaa)">' + enOr('選出正確的羅馬拼音', 'Pick the correct romaji') + '</div></div>';
  }
  function answer(btn, chosen, correct, h) {
    play(h);
    var opts = btn.parentElement.querySelectorAll('.kq-opt');
    opts.forEach(function (o) { o.onclick = null; if (o.textContent === correct) o.classList.add('ok'); });
    if (chosen === correct) { qScore++; } else { btn.classList.add('ng'); }
    setTimeout(function () { qIdx++; renderQ(); }, 750);
  }

  return { open: open, close: close, setScript: setScript, play: play, quiz: quiz, answer: answer };
})();
