// ⭐ 收藏句子 — 共用模組(口說練習 speak.html + AI 情境對話 speak-chat.html)
// 使用者把遇到的句子存起來,之後在「收藏句」面板複習:假名標注+發音+中譯。
// 儲存:users/{uid}.fav_sents(跟帳號走、跨裝置;現有 rules 本人可寫任意欄位,不需改規則)。
// 每筆 {jp, kana, zh, src('speak'|'chat'), v(聲別), ts};以 jp 去重;上限 300(舊的擠掉)。
// 發音:預錄 mp3(__TTS manifest,口說例句都有)優先;沒有的(對話句)走雲端 ttsSpeak。
window.FavSents = (function () {
  var FIELD = 'fav_sents', CAP = 300;
  var cache = null, _aud = null, _b64Cache = {};
  var FN_TTS = 'https://asia-east1-jpnote-1bdd6.cloudfunctions.net/ttsSpeak';
  var T = function (zh, en) { return (window.enOr ? enOr(zh, en) : zh); };
  var CV = function (x) { return (window.cvt ? cvt(x) : x); };
  function db() { return firebase.firestore(); }
  function user() { return firebase.auth().currentUser; }
  function esc(x) { return String(x == null ? '' : x).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  async function load(force) {
    var u = user(); if (!u) return [];
    if (cache && !force) return cache;
    try { var d = await db().doc('users/' + u.uid).get(); cache = ((d.data() || {})[FIELD] || []); }
    catch (e) { cache = cache || []; }
    return cache;
  }
  async function save(list) {
    var u = user(); if (!u) return;
    cache = list;
    await db().doc('users/' + u.uid).set((function () { var o = {}; o[FIELD] = list; return o; })(), { merge: true });
  }
  function isFav(jp) { return !!(cache && cache.some(function (s) { return s.jp === jp; })); }
  async function toggle(sent) {
    var u = user();
    if (!u) { alert(T('登入後才能收藏句子(收藏會跟著帳號走)。', 'Sign in to save sentences — they sync with your account.')); return null; }
    var list = (await load()).slice();
    var i = list.findIndex(function (s) { return s.jp === sent.jp; });
    if (i > -1) { list.splice(i, 1); await save(list); return false; }
    list.unshift({ jp: sent.jp, kana: sent.kana || '', zh: sent.zh || '', src: sent.src || '', v: sent.v || 'f', ts: Date.now() });
    if (list.length > CAP) list.length = CAP;
    await save(list); return true;
  }
  async function removeJp(jp) {
    var list = (await load()).slice().filter(function (s) { return s.jp !== jp; });
    await save(list);
  }

  // 發音:manifest 預錄優先,退雲端 TTS(有每日額度,由後端把關)
  async function play(jp, voice) {
    try { if (_aud) { _aud.pause(); _aud = null; } } catch (e) {}
    if (window.STAYJP_NATIVE && window.STAYJP_NATIVE.canPlayB64 && window._nPost) { try { _nPost({ type: 'STOP_PLAY' }); } catch (e) {}
    }
    var clean = jp.replace(/\s/g, '');
    var h = (window.__TTS || {})[clean] || (window.__TTS || {})[jp];
    if (h) {
      var url = (window.ttsUrl ? ttsUrl(h) : 'audio/tts/' + h + '.mp3');
      if (window.STAYJP_NATIVE && window.STAYJP_NATIVE.canPlayB64 && window._nPost) { try { _nPost({ type: 'PLAY_URL', url: new URL(url, location.href).href }); return; } catch (e) {} }
      _aud = new Audio(url); _aud.play().catch(function () {}); return;
    }
    var u = user(); if (!u) return;
    try {
      var key = (voice || 'f') + '|' + jp;
      var b64 = _b64Cache[key];
      if (!b64) {
        var t = await u.getIdToken();
        var r = await fetch(FN_TTS, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + t }, body: JSON.stringify({ text: jp, voice: voice || 'f' }) });
        var d = await r.json();
        if (!r.ok || !d.audio) return;
        b64 = d.audio; _b64Cache[key] = b64;
      }
      if (window.STAYJP_NATIVE && window.STAYJP_NATIVE.canPlayB64 && window._nPost) { try { _nPost({ type: 'PLAY_B64', b64: b64 }); return; } catch (e) {} }
      _aud = new Audio('data:audio/mp3;base64,' + b64); _aud.play().catch(function () {});
    } catch (e) {}
  }

  // 收藏面板(modal;兩頁共用)。句子顯示:逐詞 ruby(SPEAK_RUBY 有收錄的)> 假名行,發音鈕、中譯、移除。
  function ensureCss() {
    if (document.getElementById('favCss')) return;
    var st = document.createElement('style'); st.id = 'favCss';
    st.textContent = [
      '#favPanel{position:fixed;inset:0;z-index:950;display:flex;align-items:flex-end;justify-content:center}',
      '#favPanel .fmask{position:absolute;inset:0;background:rgba(0,0,0,.45)}',
      '#favPanel .fbox{position:relative;width:100%;max-width:680px;max-height:82vh;overflow:auto;background:var(--bg,#fff);border-radius:16px 16px 0 0;padding:16px 16px 28px;-webkit-overflow-scrolling:touch}',
      '#favPanel .fhd{display:flex;align-items:center;gap:8px;font-weight:800;font-size:16px;margin-bottom:10px}',
      '#favPanel .frow{padding:10px 2px;border-bottom:1px solid var(--line,var(--bd,#e5e5e5))}',
      '#favPanel .fjp{font-size:16.5px;font-weight:600;line-height:1.8}',
      '#favPanel .fjp ruby rt{font-size:9.5px;font-weight:500;color:var(--accent2,var(--accent,#d6654a))}',
      '#favPanel .fkana{font-size:12.5px;color:var(--accent2,var(--accent,#d6654a));margin-top:2px}',
      '#favPanel .fzh{font-size:13px;color:var(--ink2,var(--tx2,#777));margin-top:3px}',
      '#favPanel .fops{display:flex;gap:12px;margin-top:6px}',
      '#favPanel .fop{background:none;border:none;cursor:pointer;font-size:13px;color:var(--ink2,var(--tx2,#777));padding:2px 4px}',
      '#favPanel .fclose{margin-left:auto;background:none;border:none;font-size:20px;cursor:pointer;color:var(--ink2,var(--tx2,#777))}',
    ].join('\n');
    document.head.appendChild(st);
  }
  async function open() {
    ensureCss();
    var old = document.getElementById('favPanel'); if (old) old.remove();
    var el = document.createElement('div'); el.id = 'favPanel';
    el.innerHTML = '<div class="fmask" onclick="document.getElementById(\'favPanel\').remove()"></div>'
      + '<div class="fbox"><div class="fhd"><i data-ic="star"></i> ' + T('收藏句', 'Saved sentences') + '<button class="fclose" onclick="document.getElementById(\'favPanel\').remove()"><i data-ic="x"></i></button></div>'
      + '<div id="favList" class="muted">' + T('載入中…', 'Loading…') + '</div></div>';
    document.body.appendChild(el);
    var u = user();
    var box = el.querySelector('#favList');
    if (!u) { box.textContent = T('登入後才能收藏與複習句子。', 'Sign in to save and review sentences.'); return; }
    var list = await load(true);
    renderList(box, list);
  }
  function renderList(box, list) {
    if (!list.length) { box.innerHTML = '<div class="muted" style="padding:10px 0">' + T('還沒有收藏。在句子旁點 ☆ 就會存到這裡。', 'Nothing saved yet — tap ☆ next to any sentence.') + '</div>'; return; }
    box.innerHTML = list.map(function (s, i) {
      var ruby = (window.SPEAK_RUBY || {})[s.jp];
      return '<div class="frow">'
        + '<div class="fjp">' + (ruby || esc(s.jp)) + '</div>'
        + (!ruby && s.kana && s.kana !== s.jp ? '<div class="fkana">' + esc(s.kana) + '</div>' : '')
        + (s.zh ? '<div class="fzh">' + esc(CV(s.zh)) + '</div>' : '')
        + '<div class="fops">'
        + '<button class="fop" onclick="FavSents._play(' + i + ')"><i data-ic="volume"></i> ' + T('發音', 'Play') + '</button>'
        + '<button class="fop" onclick="FavSents._del(' + i + ')"><i data-ic="trash"></i> ' + T('移除', 'Remove') + '</button>'
        + '</div></div>';
    }).join('');
  }
  async function _play(i) { var s = (cache || [])[i]; if (s) play(s.jp, s.v); }
  async function _del(i) {
    var s = (cache || [])[i]; if (!s) return;
    await removeJp(s.jp);
    var box = document.getElementById('favList'); if (box) renderList(box, cache);
    if (window.FavSents._onChange) try { window.FavSents._onChange(); } catch (e) {}
  }
  return { load: load, isFav: isFav, toggle: toggle, open: open, play: play, _play: _play, _del: _del };
})();
