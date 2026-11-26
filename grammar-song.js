// 文法歌(2026-11-26):一分鐘的歌把變化規則唱一遍,影片在 videos/song/<key>.mp4(720×1280 直式,社群發的同一支)。
// 入口兩處,都不佔面板格子:
//   1. 文法卡(app.html):卡片展開後、說明下面一顆「聽歌記」→ GrammarSong.btn(文法 id)
//   2. 動詞變化頁(verbs.html):靜態 <button class="gsong-btn" data-gsong="tekei"> 由這支自動補文字
// 加新歌:影片放 videos/song/,下面 SONGS 加一筆、ids 填對應的文法 id。
// 檔尾一定要掛 window.GrammarSong(const 不會自己上 window)。
(function () {
  var SONGS = {
    tekei: { t: 'て形の歌', ids: ['n5-42'] },
    nai:   { t: 'ない形の歌', ids: ['n5-43'] },
    kanou: { t: '可能形の歌', ids: ['n4-52'] },
    jita:  { t: '自他動詞の歌', ids: ['n5-62'] },
    keigo: { t: '敬語の歌', ids: ['n4-62', 'n4-63', 'n4-65'] }
  };
  var BY_ID = {};
  Object.keys(SONGS).forEach(function (k) { SONGS[k].ids.forEach(function (id) { BY_ID[id] = k; }); });

  // 介面字串:七語都在這裡(2026-11-26 Mia:新內容也翻)。歌名是日文原名,各語言都不翻。
  var UI = {
    en: ['Learn by song', 'Close'], ko: ['노래로 외우기', '닫기'], vi: ['Học qua bài hát', 'Đóng'],
    id: ['Belajar lewat lagu', 'Tutup'], th: ['จำด้วยเพลง', 'ปิด']
  };
  function ui(i) {
    var zhs = ['聽歌記', '關閉'][i];
    try {
      if (typeof I18n !== 'undefined' && I18n.isForeign && I18n.isForeign()) return (UI[I18n.getLang()] || UI.en)[i];
      return typeof cvt === 'function' ? cvt(zhs) : zhs;      // 簡中介面轉字
    } catch (e) { return zhs; }
  }
  function label(k) { return ui(0) + '｜' + SONGS[k].t; }

  var CSS = '' +
    '.gsong-btn{display:inline-flex;align-items:center;gap:6px;margin:12px 0 4px;padding:8px 14px;border-radius:999px;cursor:pointer;' +
      'font:inherit;font-size:14px;font-weight:700;line-height:1.3;border:1px solid var(--ac,#D4654A);background:none;color:var(--ac,#D4654A)}' +
    '.gsong-btn:hover{background:var(--bg3,rgba(0,0,0,.05))}' +
    '.gsong-btn svg{width:1.05em;height:1.05em;flex-shrink:0}' +
    '.gsong-mask{position:fixed;inset:0;z-index:2100;background:rgba(0,0,0,.72);display:flex;align-items:center;justify-content:center;padding:16px}' +
    '.gsong-card{position:relative;display:flex;flex-direction:column;align-items:center;gap:12px;max-width:100%}' +
    '.gsong-card video{display:block;height:min(78vh,720px);max-width:calc(100vw - 32px);aspect-ratio:9/16;border-radius:16px;background:#000}' +
    '.gsong-close{font:inherit;font-size:15px;font-weight:700;padding:10px 28px;border-radius:999px;border:none;cursor:pointer;background:#fff;color:#222}';
  function css() {
    if (document.getElementById('gsong-css')) return;
    var s = document.createElement('style'); s.id = 'gsong-css'; s.textContent = CSS; document.head.appendChild(s);
  }

  var mask = null;
  function close() {
    if (!mask) return;
    var v = mask.querySelector('video'); try { v.pause(); v.removeAttribute('src'); v.load(); } catch (e) {}
    mask.remove(); mask = null;
    document.removeEventListener('keydown', onKey);
  }
  function onKey(e) { if (e.key === 'Escape') close(); }
  function open(k) {
    if (!SONGS[k]) return;
    css(); close();
    mask = document.createElement('div'); mask.className = 'gsong-mask';
    var card = document.createElement('div'); card.className = 'gsong-card';
    var v = document.createElement('video');
    v.src = 'videos/song/' + k + '.mp4'; v.controls = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.preload = 'auto';
    var b = document.createElement('button'); b.type = 'button'; b.className = 'gsong-close'; b.textContent = ui(1);
    b.onclick = close;
    card.appendChild(v); card.appendChild(b); mask.appendChild(card);
    mask.addEventListener('click', function (e) { if (e.target === mask) close(); });
    document.body.appendChild(mask);
    document.addEventListener('keydown', onKey);
    var p = v.play(); if (p && p.catch) p.catch(function () {});     // 點擊當下播;被擋就留著控制列讓使用者自己按
    try { if (typeof gtag === 'function') gtag('event', 'gsong_open', { song: k, page: location.pathname.split('/').pop() || 'index' }); } catch (e) {}
  }

  function btnHTML(k) {
    return '<button type="button" class="gsong-btn" onclick="event.stopPropagation();GrammarSong.open(\'' + k + '\')"><i data-ic=play></i><span>' + label(k) + '</span></button>';
  }
  // 文法卡用:這個文法 id 有歌就回按鈕 HTML,沒有回空字串
  function btn(id) { var k = BY_ID[id]; if (!k) return ''; css(); return '<div class="gsong-row">' + btnHTML(k) + '</div>'; }

  // 靜態頁(verbs.html):<button class="gsong-btn" data-gsong="tekei"></button> → 補圖示、文字、點擊
  function hydrate() {
    var list = document.querySelectorAll('button[data-gsong]'); if (!list.length) return;
    css();
    list.forEach(function (el) {
      var k = el.getAttribute('data-gsong'); if (!SONGS[k]) { el.remove(); return; }
      el.type = 'button'; el.classList.add('gsong-btn');
      el.innerHTML = '<i data-ic=play></i><span></span>'; el.querySelector('span').textContent = label(k);
      el.onclick = function (e) { e.stopPropagation(); open(k); };
      if (window.hydrateIcons) window.hydrateIcons(el);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hydrate); else hydrate();

  window.GrammarSong = { open: open, close: close, btn: btn, has: function (id) { return !!BY_ID[id]; }, hydrate: hydrate };
})();
