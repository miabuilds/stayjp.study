// ========== 新手功能導覽(spotlight) ==========
// 使用者回饋:內容多、常找不到功能;舊引導是文字牆看完就忘 → 改成「實地帶看」:
// 遮罩挖洞高亮真實元素+一句話說明,一步步走。錨點只用穩定元素(頂部列/主推卡/底部 nav)。
// 觸發:新手選完程度後;重看:更多選單「🧭 功能導覽」、? 快速上手裡的按鈕。
(function () {
  if (window.Tour) return;
  function _en(zh, en) { try { var l = (typeof I18n !== 'undefined' && I18n.getLang) ? I18n.getLang() : (localStorage.getItem('ui_lang') || 'zh-TW'); if (l === 'en') return en; return (typeof cvt === 'function') ? cvt(zh) : zh; } catch (e) { return zh; } }
  var DONE_KEY = 'tour_done_v1';
  var steps = [
    { sel: '#hdBar',      t: _en('切級別・切內容','Level & content'), d: _en('這裡選 N5–N1 程度,切換「文法 / 單字」。點 ★ 只看收藏。','Pick your N5–N1 level and switch between Grammar / Vocabulary. Tap ★ to see favorites only.'), pos: 'below' },
    { sel: '.flag-row',   t: _en('主打功能','Flagship features'), d: _en('JLPT 刷題特區、AI 跟讀、AI 聊聊都在這,點卡片直接進。','JLPT Drills, AI Shadowing and AI Chat all live here — tap a card to jump in.'), pos: 'below' },
    { sel: '.art-entry',  t: _en('每天讀一篇','Daily reading'), d: _en('精選日文短文:點字查意思、逐句真人朗讀、讀完有測驗。','Curated short articles: tap any word for its meaning, listen sentence by sentence, then take a quiz.'), pos: 'below' },
    { sel: '#ftb .ftb-btn:nth-child(2)', t: _en('測驗','Quiz'), d: _en('單字測驗在這;寫錯會有詳解卡,答完自動唸給你聽。','Vocabulary quizzes live here; wrong answers get an explanation card and are read aloud.'), pos: 'above' },
    { sel: '#ftb .ftb-btn:nth-child(3)', t: _en('複習(最重要!)','Review (the key!)'), d: _en('每天回來清「複習」:系統照記憶曲線排程,背起來全靠這個。','Come back daily to clear your reviews — spaced repetition is how words actually stick.'), pos: 'above' },
    { sel: '#ftb .ftb-btn:last-child',   t: _en('更多工具','More tools'), d: _en('模擬考、五十音、動詞變化、生活會話、聽力讀解…全收在「更多」。','Mock exams, kana, verb conjugation, daily phrases, listening & reading — all under "More".'), pos: 'above' },
    { sel: '#ftb .ftb-btn:nth-child(4)', t: _en('設定都在「我的」','Settings live in "Me"'), d: _en('字體大小、朗讀語速、深色模式、程度目標、每日提醒——全在「我的 → 設定」一次調好。','Text size, playback speed, dark mode, your level & goal, daily reminders — all in "Me → Settings".'), pos: 'above' },
  ];
  var idx = 0, box = null, tip = null;

  function ensure() {
    if (box) return;
    var st = document.createElement('style');
    st.textContent =
      '#tourHole{position:fixed;z-index:99990;border-radius:14px;pointer-events:none;' +
        'box-shadow:0 0 0 9999px rgba(0,0,0,.62);transition:all .28s ease}' +
      '#tourTip{position:fixed;z-index:99991;max-width:320px;width:calc(100vw - 40px);background:var(--bg2,#fff);color:var(--tx,#222);' +
        'border-radius:16px;padding:16px 18px;box-shadow:0 16px 48px rgba(0,0,0,.35);transition:all .28s ease}' +
      '#tourTip .tt{font-weight:800;font-size:16px;margin-bottom:4px}' +
      '#tourTip .td{font-size:13.5px;color:var(--tx2,#666);line-height:1.7}' +
      '#tourTip .tr{display:flex;align-items:center;gap:10px;margin-top:12px}' +
      '#tourTip .tn{flex:1;color:var(--tx3,#999);font-size:12px}' +
      '#tourTip button{font:inherit;cursor:pointer}' +
      '#tourTip .tskip{background:none;border:none;color:var(--tx3,#999);font-size:13px;padding:6px}' +
      '#tourTip .tnext{background:var(--ac,#d4654a);color:#fff;border:none;border-radius:10px;padding:9px 20px;font-weight:700;font-size:14px}';
    document.head.appendChild(st);
    box = document.createElement('div'); box.id = 'tourHole';
    tip = document.createElement('div'); tip.id = 'tourTip';
    document.body.appendChild(box); document.body.appendChild(tip);
  }
  function visible(el) { if (!el) return false; var r = el.getBoundingClientRect(); return r.width > 4 && r.height > 4; }
  function place() {
    var s = steps[idx], el = s && document.querySelector(s.sel);
    if (!el || !visible(el)) { next(); return; }   // 元素不在(例:登入後才有)→ 跳過這步
    el.scrollIntoView({ block: s.pos === 'above' ? 'end' : 'start', behavior: 'auto' });
    // 等 scroll 定位後再量
    setTimeout(function () {
      var r = el.getBoundingClientRect(), pad = 6;
      box.style.left = (r.left - pad) + 'px'; box.style.top = (r.top - pad) + 'px';
      box.style.width = (r.width + pad * 2) + 'px'; box.style.height = (r.height + pad * 2) + 'px';
      tip.innerHTML = '<div class="tt">' + s.t + '</div><div class="td">' + s.d + '</div>' +
        '<div class="tr"><span class="tn">' + (idx + 1) + ' / ' + steps.length + '</span>' +
        '<button class="tskip" onclick="Tour.stop()">' + _en('跳過','Skip') + '</button>' +
        '<button class="tnext" onclick="Tour.next()">' + (idx === steps.length - 1 ? _en('完成 <i data-ic=check></i>','Done <i data-ic=check></i>') : _en('下一步 →','Next →')) + '</button></div>';
      var th = tip.offsetHeight || 150;
      var top = s.pos === 'above' ? (r.top - th - 14) : (r.bottom + 14);
      top = Math.max(12, Math.min(top, window.innerHeight - th - 12));
      tip.style.top = top + 'px';
      tip.style.left = Math.max(20, Math.min(r.left, window.innerWidth - (tip.offsetWidth || 320) - 20)) + 'px';
    }, 80);
  }
  function next() {
    idx++;
    if (idx >= steps.length) { stop(); return; }
    place();
  }
  function stop() {
    try { localStorage.setItem(DONE_KEY, '1'); } catch (e) {}
    if (box) { box.remove(); box = null; }
    if (tip) { tip.remove(); tip = null; }
  }
  function start(force) {
    try { if (!force && localStorage.getItem(DONE_KEY)) return; } catch (e) {}
    ensure(); idx = 0; place();
  }
  window.addEventListener('resize', function () { if (box) place(); });
  window.Tour = { start: start, next: next, stop: stop };
})();
