// 文章閱讀 UI（清單 + 沉浸式閱讀器）。重用 furiganaHTMLRich→自動 furigana + 即點即查;
// 播音走 speak()（有預錄就用預錄,沒有退瀏覽器語音）。純前端、零 API 成本。
window.Articles = (function () {
  'use strict';
  var LEVELS = ['n5', 'n4', 'n3', 'n2', 'n1'];
  var LVN = { n5: 'N5', n4: 'N4', n3: 'N3', n2: 'N2', n1: 'N1' };
  var furiOn = true, curId = null;
  function list() { return window.ARTICLES || []; }
  function enOr(zh, en) { try { return localStorage.getItem('ui_lang') === 'en' ? en : zh; } catch (e) { return zh; } }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function readSet() { try { return JSON.parse(localStorage.getItem('article_read')) || {}; } catch (e) { return {}; } }
  function markRead(id) { var s = readSet(); s[id] = Date.now(); localStorage.setItem('article_read', JSON.stringify(s)); if (typeof saveAllCloud === 'function') try { saveAllCloud(); } catch (e) {} }
  function fr(text) { return window.furiganaHTMLRich ? window.furiganaHTMLRich(text) : esc(text); }

  function ensureCss() {
    if (document.getElementById('artCss')) return;
    var st = document.createElement('style'); st.id = 'artCss';
    st.textContent = [
      '.art-mask{position:fixed;inset:0;z-index:9000;background:var(--bg,#faf9f6);overflow-y:auto;-webkit-overflow-scrolling:touch}',
      '.art-wrap{max-width:680px;margin:0 auto;padding:14px 18px 90px}',
      '.art-top{position:sticky;top:0;background:var(--bg,#faf9f6);display:flex;align-items:center;gap:10px;padding:8px 0 10px;border-bottom:1px solid var(--bd,#e8e5e0);z-index:2}',
      '.art-top b{font-size:17px}',
      '.art-x{margin-left:auto;cursor:pointer;font-size:20px;color:var(--tx2,#888);padding:4px 8px}',
      '.art-sub{color:var(--tx2,#888);font-size:13px;margin:10px 0 4px}',
      '.art-lv{font-size:12px;font-weight:700;color:var(--ac,#d4654a);letter-spacing:.08em;margin:16px 0 6px}',
      '.art-card{background:var(--bg2,#fff);border:1px solid var(--bd,#e8e5e0);border-radius:12px;padding:13px 15px;margin-bottom:9px;cursor:pointer;transition:border-color .15s}',
      '.art-card:hover{border-color:var(--ac2,#e8734a)}',
      '.art-card-t{font-size:16px;font-weight:700;color:var(--tx,#2c2c2c);font-family:"Hiragino Mincho ProN","Noto Serif JP",serif}',
      '.art-card-z{font-size:13px;color:var(--tx2,#888);margin-top:3px}',
      '.art-done{color:#16a34a;font-size:13px}',
      // reader
      '.art-r-title{font-size:23px;font-weight:800;font-family:"Hiragino Mincho ProN","Noto Serif JP",serif;color:var(--tx,#2c2c2c);margin:16px 0 2px;line-height:1.4}',
      '.art-r-title rt{font-size:.5em;color:var(--tx2,#888);font-weight:400}',
      '.art-r-zh{font-size:14px;color:var(--tx2,#888);margin-bottom:8px}',
      '.art-r-badge{display:inline-block;font-size:11px;font-weight:700;padding:2px 9px;border-radius:20px;background:var(--ac2,#e8734a);color:#fff;margin-right:6px}',
      '.art-tools{display:flex;gap:8px;align-items:center;margin:12px 0 6px;flex-wrap:wrap}',
      '.art-btn{border:1px solid var(--bd,#ddd);background:var(--bg2,#fff);color:var(--tx2,#666);border-radius:20px;padding:6px 13px;font-size:13px;cursor:pointer}',
      '.art-btn.on{background:var(--ac2,#e8734a);color:#fff;border-color:var(--ac2,#e8734a)}',
      '.art-para{font-size:19px;line-height:2.3;color:var(--tx,#2c2c2c);margin:14px 0;position:relative;font-family:"Hiragino Mincho ProN","Noto Serif JP",serif}',
      '.art-para rt{font-size:.55em;color:var(--tx2,#8a8a8a);font-weight:400}',
      '.art-para .jlk{cursor:pointer}',
      '.art-nofuri rt{display:none}',
      '.art-spk{display:inline-flex;vertical-align:middle;width:17px;height:17px;margin-left:6px;color:var(--ac,#d4654a);cursor:pointer;opacity:.7}',
      '.art-spk:hover{opacity:1}',
      '.art-done-btn{display:block;width:100%;margin-top:22px;border:none;background:var(--ac,#d4654a);color:#fff;border-radius:12px;padding:13px;font-size:15px;font-weight:600;cursor:pointer}'
    ].join('');
    document.head.appendChild(st);
  }

  function close() { var m = document.getElementById('artMask'); if (m) m.remove(); }

  function open() {
    ensureCss(); close();
    var read = readSet(), byLv = {};
    list().forEach(function (a) { (byLv[a.level] = byLv[a.level] || []).push(a); });
    var h = '<div class="art-mask" id="artMask"><div class="art-wrap">' +
      '<div class="art-top"><b>📖 ' + enOr('文章閱讀', 'Reading') + '</b><span class="art-x" onclick="Articles.close()">✕</span></div>' +
      '<div class="art-sub">' + enOr('讀短文、點單字查意思、聽發音,自然記住單字。', 'Read, tap words to look them up, and build vocabulary.') + '</div>';
    LEVELS.forEach(function (lv) {
      var arr = byLv[lv] || []; if (!arr.length) return;
      h += '<div class="art-lv">' + LVN[lv] + '</div>';
      arr.forEach(function (a) {
        h += '<div class="art-card" onclick="Articles.read(\'' + a.id + '\')">' +
          '<div class="art-card-t">' + esc(a.title) + (read[a.id] ? ' <span class="art-done">✓</span>' : '') + '</div>' +
          '<div class="art-card-z">' + esc(a.title_zh) + ' · ' + esc(a.topic) + '</div></div>';
      });
    });
    h += '</div></div>';
    var d = document.createElement('div'); d.innerHTML = h; document.body.appendChild(d.firstChild);
    try { if (typeof track === 'function') track('article_open', {}); } catch (e) {}
  }

  function speakPara(btn) {
    var t = btn.getAttribute('data-t') || '';
    if (t && typeof speak === 'function') speak(t);
  }

  function read(id) {
    ensureCss();
    var a = list().find(function (x) { return x.id === id; }); if (!a) return;
    curId = id;
    var paras = String(a.body).split('\n').filter(function (p) { return p.trim(); });
    var spk = '<svg class="art-spk" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14"/></svg>';
    var h = '<div class="art-mask" id="artMask"><div class="art-wrap">' +
      '<div class="art-top"><span class="art-x" style="margin-left:0" onclick="Articles.open()">‹ ' + enOr('返回', 'Back') + '</span><span class="art-x" onclick="Articles.close()">✕</span></div>' +
      '<div class="art-r-title">' + fr(a.title) + '</div>' +
      '<div class="art-r-zh"><span class="art-r-badge">' + LVN[a.level] + '</span>' + esc(a.title_zh) + '</div>' +
      '<div class="art-tools">' +
      '<button class="art-btn on" id="artFuriBtn" onclick="Articles.toggleFuri()">' + enOr('假名', 'Furigana') + '</button>' +
      '<button class="art-btn" id="artZhBtn" onclick="Articles.toggleZh()">' + enOr('中譯', 'Meaning') + '</button>' +
      '</div>' +
      '<div id="artBody" class="' + (furiOn ? '' : 'art-nofuri') + '">';
    paras.forEach(function (p) {
      h += '<div class="art-para">' + fr(p) +
        '<svg class="art-spk" data-t="' + esc(p.replace(/\s/g, '')) + '" onclick="Articles.speak(this)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left:6px"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14"/></svg></div>';
    });
    h += '</div>' +
      '<div id="artZh" style="display:none;color:var(--tx2,#888);font-size:14px;line-height:1.9;background:var(--bg3,#f0ede8);border-radius:12px;padding:12px 15px;margin-top:8px">' + esc(a.summary_zh) + '</div>' +
      '<button class="art-done-btn" onclick="Articles.done()">' + enOr('✓ 讀完了', '✓ Mark as read') + '</button>' +
      '</div></div>';
    var d = document.createElement('div'); d.innerHTML = h; document.body.appendChild(d.firstChild);
    document.getElementById('artMask').scrollTop = 0;
    try { if (typeof track === 'function') track('article_read', { id: id, level: a.level }); } catch (e) {}
  }

  function toggleFuri() {
    furiOn = !furiOn;
    var b = document.getElementById('artBody'), btn = document.getElementById('artFuriBtn');
    if (b) b.classList.toggle('art-nofuri', !furiOn);
    if (btn) btn.classList.toggle('on', furiOn);
  }
  function toggleZh() {
    var z = document.getElementById('artZh'), btn = document.getElementById('artZhBtn');
    if (!z) return; var show = z.style.display === 'none';
    z.style.display = show ? 'block' : 'none'; if (btn) btn.classList.toggle('on', show);
  }
  function done() {
    if (curId) markRead(curId);
    var btn = document.querySelector('.art-done-btn');
    if (btn) { btn.textContent = enOr('✓ 已完成', '✓ Done'); btn.style.background = '#16a34a'; }
    setTimeout(open, 600);
  }

  return { open: open, close: close, read: read, toggleFuri: toggleFuri, toggleZh: toggleZh, speak: speakPara, done: done };
})();
