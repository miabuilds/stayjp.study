// 我的單字本(2026-09-20,社群回饋:「希望能自己輸入片語,然後跟 AI 練習那個片語」)。
// 三件事:
//   1. 自己輸入單字/片語 → 小狸查讀音/意思/例句(1 次 AI 額度),或完全手動填(不花額度、不用登入)
//   2. 存下來的字直接進既有 SRS(level 'my') → 明天就排進每日複習,跟站上的單字同一套
//   3. 「跟小狸練」:小狸出情境 → 你造句 → 批改。重點是先在本地比對「有沒有真的用到那個詞」,
//      AI 判斷跟本地比對不一致時以本地為準 —— 社群抱怨的正是「AI 會改寫或認錯,練了存不起來」。
// 資料:localStorage my_vocab(進 SYNC_KEYS 跨裝置;刪除用 del 墓碑,合併才不會復活)。
// 額度:查詞 1 次、出題 1 次、批改 1 次(一輪最多 5 個字共 2 次),後端 kind 'ask'。
(function (root) {
  var KEY = 'my_vocab';
  var FN = 'https://asia-east1-jpnote-1bdd6.cloudfunctions.net/askTutor';
  var MAX_PRACTICE = 5;

  function lang() { try { return (typeof I18n !== 'undefined' && I18n.getLang) ? I18n.getLang() : 'zh-TW'; } catch (e) { return 'zh-TW'; } }
  function L(zh, en) { try { return (typeof enOr === 'function') ? enOr(zh, en) : zh; } catch (e) { return zh; } }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function attr(s) { return esc(s).replace(/'/g, '&#39;'); }
  function $(id) { return document.getElementById(id); }
  function fr(t) { try { return root.furiganaHTML ? root.furiganaHTML(t) : esc(t); } catch (e) { return esc(t); } }
  function now() { return Date.now(); }
  function cloud() { try { if (typeof saveAllCloud === 'function') saveAllCloud(); } catch (e) {} }
  function toast(msg) { try { (root.AppUI ? AppUI.alert : alert)(msg); } catch (e) {} }

  // ── 發音 ────────────────────────────────────────────────
  // 全站的 speak() 只播預先生成的 VOICEVOX 音檔,查不到就靜音(刻意的:不要瀏覽器機器音)。
  // 自己加的字當然沒預錄 → 站上有就用站上的(免費、音色一致),沒有才走雲端合成(ttsSpeak,Google TTS)。
  // 合成結果存 mv_tts(純本機快取,不進 SYNC_KEYS),同一個字之後再按就不花額度也不用等。
  var FN_TTS = 'https://asia-east1-jpnote-1bdd6.cloudfunctions.net/ttsSpeak';
  var TTS_KEY = 'mv_tts', TTS_KEEP = 24;
  var _mem = {}, _au = null, _seq = 0, _lastTap = 0;
  // 分辨「使用者剛按了喇叭」vs「字卡自動播」:前者該照常問同意/給提示,後者才真的安靜。
  // (不能用 navigator.userActivation,舊 Safari/WebView 沒有)
  try { ['pointerdown', 'click', 'keydown'].forEach(function (t) { document.addEventListener(t, function () { _lastTap = Date.now(); }, true); }); } catch (e) {}

  function ttsCache() { try { return JSON.parse(localStorage.getItem(TTS_KEY)) || {}; } catch (e) { return {}; } }
  function ttsCacheGet(k) { if (_mem[k]) return _mem[k]; var c = ttsCache(); return c[k] && c[k].b || null; }
  function ttsCachePut(k, b64) {
    _mem[k] = b64;
    try {
      var c = ttsCache();
      c[k] = { b: b64, t: now() };
      var keys = Object.keys(c).sort(function (a, b) { return (c[b].t || 0) - (c[a].t || 0); });
      if (keys.length > TTS_KEEP) keys.slice(TTS_KEEP).forEach(function (x) { delete c[x]; });
      localStorage.setItem(TTS_KEY, JSON.stringify(c));
    } catch (e) {
      // 空間滿了:丟掉整包重來,記憶體那份還在,本次播放不受影響
      try { localStorage.removeItem(TTS_KEY); } catch (e2) {}
    }
  }
  // 聲音跟「用聽的背」設定一致:13=男 → m、8=柔女 → f2、其他 → f
  function voiceCode() {
    try { var v = localStorage.getItem('tts_voice') || '2'; return v === '13' ? 'm' : (v === '8' ? 'f2' : 'f'); } catch (e) { return 'f'; }
  }
  function playB64(b64, seq) {
    if (seq !== _seq) return;
    // App 內(WKWebView)交給原生播,跟 AI 聊聊同一條橋
    try { if (root.STAYJP_NATIVE && root.STAYJP_NATIVE.canPlayB64 && root.ReactNativeWebView) { root.ReactNativeWebView.postMessage(JSON.stringify({ type: 'PLAY_B64', b64: b64 })); return; } } catch (e) {}
    try { if (_au) _au.pause(); } catch (e) {}
    _au = new Audio('data:audio/mp3;base64,' + b64);
    _au.playbackRate = (typeof getTtsSpeed === 'function') ? getTtsSpeed() : 1;
    _au.play().catch(function () {});
  }
  async function say(txt, ev, quiet) {
    var t = String(txt || '').trim(); if (!t) return;
    var silent = !!quiet && (Date.now() - _lastTap > 3000);   // 真的是自動播才安靜
    function warn(m) { if (!silent) toast(m); }
    var el = null; try { el = ev && (ev.currentTarget || ev.target); } catch (e) {}
    var seq = ++_seq;
    // 1) 站上已經有這個字的預錄音檔 → 走原本的 speak()
    try {
      if (!root.__TTS_READY && root.ensureTTS) await root.ensureTTS();
      if (root.__TTS && root.__TTS[t]) { if (typeof speak === 'function') speak(t); return; }
    } catch (e) {}
    // 2) 快取裡有合成過的
    var hit = ttsCacheGet(t);
    if (hit) { playB64(hit, seq); return; }
    // 3) 雲端合成
    var user = currentUser();
    if (!user) { warn(L('自己加的字要登入才能發音（站上原本的單字不用登入）。', 'Sign in to hear your own words read aloud (built-in words work without signing in).')); return; }
    if (silent && root.AIConsent && root.AIConsent.has && !root.AIConsent.has()) return;   // 字卡自動播:不要跳同意視窗打斷複習
    try { if (root.AIConsent && !(await root.AIConsent.ensure())) return; } catch (e) {}
    if (el) { try { el.style.opacity = '.45'; } catch (e) {} }
    try {
      var tok = await user.getIdToken();
      var r = await fetch(FN_TTS, {
        method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + tok },
        body: JSON.stringify({ text: t.slice(0, 200), voice: voiceCode() }),
      });
      var d = null; try { d = await r.json(); } catch (e) {}
      if (!r.ok || !d || !d.audio) {
        warn((d && d.message) || L('這個字的發音暫時合成不出來，等一下再試。', 'Couldn’t generate audio just now — try again shortly.'));
        return;
      }
      ttsCachePut(t, d.audio);
      playB64(d.audio, seq);
    } catch (e) {
      warn(L('網路不穩，發音失敗。', 'Network error — no audio.'));
    } finally {
      if (el) { try { el.style.opacity = ''; } catch (e) {} }
    }
  }

  // ── 資料 ────────────────────────────────────────────────
  function raw() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function writeAll(arr) {
    try { localStorage.setItem(KEY, JSON.stringify(arr)); } catch (e) {}
    cloud();
  }
  function list() {
    return raw().filter(function (x) { return x && x.w && !x.del; })
      .sort(function (a, b) { return (b.added || 0) - (a.added || 0); });
  }
  function count() { return list().length; }
  function find(w) { var r = raw(); for (var i = 0; i < r.length; i++) if (r[i] && r[i].w === w) return r[i]; return null; }
  function has(w) { var e = find(w); return !!(e && !e.del); }

  function add(item) {
    if (!item || !item.w) return null;
    var arr = raw(), i, hit = -1;
    for (i = 0; i < arr.length; i++) if (arr[i] && arr[i].w === item.w) { hit = i; break; }
    var e = {
      w: String(item.w).trim(), r: String(item.r || '').trim(), m: String(item.m || '').trim(),
      c: String(item.c || '').trim() || L('自訂', 'custom'), lv: item.lv || '',
      note: String(item.note || '').trim(),
      ex: item.ex && item.ex.j ? { j: item.ex.j, z: item.ex.z || '' } : null,
      ex2: item.ex2 && item.ex2.j ? { j: item.ex2.j, z: item.ex2.z || '' } : null,
      src: item.src || 'manual',
      added: (hit >= 0 && arr[hit].added) ? arr[hit].added : now(),
      upd: now(),
      pr: (hit >= 0 && arr[hit].pr) ? arr[hit].pr : { n: 0, ok: 0, last: 0 },
    };
    if (hit >= 0) arr[hit] = e; else arr.push(e);
    writeAll(arr);
    return e;
  }
  // 刪除留墓碑:雲端合併是「聯集」,沒有墓碑的話另一台裝置會把刪掉的字又推回來
  function remove(w) {
    var arr = raw(), i;
    for (i = 0; i < arr.length; i++) if (arr[i] && arr[i].w === w) { arr[i] = { w: w, del: 1, upd: now() }; }
    writeAll(arr);
    try { var d = JSON.parse(localStorage.getItem('srs_data') || '{}'); delete d['my:' + w]; localStorage.setItem('srs_data', JSON.stringify(d)); } catch (e) {}
  }
  function markPractice(w, ok) {
    var arr = raw(), i;
    for (i = 0; i < arr.length; i++) if (arr[i] && arr[i].w === w && !arr[i].del) {
      var p = arr[i].pr || { n: 0, ok: 0, last: 0 };
      p.n = (p.n || 0) + 1; if (ok) p.ok = (p.ok || 0) + 1; p.last = now();
      arr[i].pr = p; arr[i].upd = now();
    }
    writeAll(arr);
  }

  // ── 有沒有真的用到目標詞:本地比對(不靠 AI)────────────────
  // 全形→半形、片假名→平假名、去空白標點;再用「語幹」比對,吸收活用變化
  // (例:気が置けない → 気が置けません / 食べる → 食べました)。
  function norm(x) {
    return String(x || '').normalize('NFKC').replace(/[\s、。,.!?！？「」『』()（）・]/g, '')
      .replace(/[ァ-ヶ]/g, function (ch) { return String.fromCharCode(ch.charCodeAt(0) - 0x60); });
  }
  function stems(item) {
    var out = [], w = norm(item.w), r = norm(item.r);
    [w, r].forEach(function (s) {
      if (!s) return;
      out.push(s);
      var cut = s.replace(/(します|しました|ます|ました|ません|です|でした)$/, '');
      if (cut !== s && cut.length >= 2) out.push(cut);
      // 動詞/形容詞活用:砍掉最後 1~2 個假名當語幹(長度夠才砍,避免兩字詞被砍成一個字誤判)
      if (s.length >= 4) out.push(s.slice(0, s.length - 1));
      if (s.length >= 6) out.push(s.slice(0, s.length - 2));
    });
    return out.filter(function (s, i, a) { return s.length >= 2 && a.indexOf(s) === i; });
  }
  function usedLocally(item, sentence) {
    var s = norm(sentence); if (!s) return false;
    var st = stems(item);
    for (var i = 0; i < st.length; i++) if (s.indexOf(st[i]) >= 0) return true;
    return false;
  }

  // 這段文字是不是自訂單字(或它的例句)→ 全站 speak() 撞不到預錄音檔時用這個決定要不要幫忙合成
  function owns(txt) {
    var t = String(txt || '').trim(); if (!t) return false;
    return list().some(function (x) {
      return x.w === t || x.r === t || (x.ex && x.ex.j === t) || (x.ex2 && x.ex2.j === t);
    });
  }

  // ── 後端 ────────────────────────────────────────────────
  function currentUser() { try { return (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth().currentUser : null; } catch (e) { return null; } }
  async function callAI(payload) {
    var user = currentUser();
    if (!user) return { err: 'login' };
    try { if (root.AIConsent && !(await root.AIConsent.ensure())) return { err: 'cancel' }; } catch (e) {}
    var lv = ''; try { lv = root.currentLevel || localStorage.getItem('lastLevel') || ''; } catch (e) {}
    try {
      var tok = await user.getIdToken();
      var r = await fetch(FN, {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: 'Bearer ' + tok },
        body: JSON.stringify(Object.assign({ lang: lang(), ctx: { level: lv } }, payload)),
      });
      var d = null; try { d = await r.json(); } catch (e) {}
      if (!r.ok) return { err: (r.status === 429 || r.status === 402) ? 'quota' : 'fail', msg: (d && d.message) || '' };
      return { data: d && d.data, remain: d && d.remain };
    } catch (e) { return { err: 'net' }; }
  }
  function aiErrHtml(err, msg) {
    if (err === 'login') {
      return '<div class="mv-err">' + L('登入後小狸才能幫你查字、出題（免費每天 2 次，Premium 30 次）。', 'Sign in to let the tutor look words up and quiz you (free: 2/day, Premium: 30).')
        + ' ' + (typeof root.loginWith === 'function'
          ? '<button type="button" onclick="loginWith(\'google\')">' + L('用 Google 登入', 'Sign in with Google') + '</button>'
          : '<a href="account.html">' + L('前往登入', 'Sign in') + '</a>')
        + '<div class="mv-err-sub">' + L('不想登入也可以按「自己填」，手動輸入意思一樣能存、能複習。', 'Or tap “Fill it in myself” — manual entries save and review just the same.') + '</div></div>';
    }
    if (err === 'quota') return '<div class="mv-err">' + esc(msg || L('今天的 AI 額度用完了。', 'Out of AI credits today.')) + ' <a href="pricing.html">' + L('看 Premium', 'See Premium') + '</a>'
      + '<div class="mv-err-sub">' + L('額度用完還是可以手動加字、自己複習。', 'You can still add words manually and review them.') + '</div></div>';
    if (err === 'cancel') return '';
    return '<div class="mv-err">' + L('小狸暫時連不上，等一下再試。', 'The tutor is unavailable, try again shortly.') + '</div>';
  }

  // ── 樣式 ────────────────────────────────────────────────
  function css() {
    if ($('mvCss')) return;
    var s = document.createElement('style'); s.id = 'mvCss';
    s.textContent = [
      '.mv-mask{position:fixed;inset:0;z-index:9200;background:var(--bg,#FAF9F6);display:flex;flex-direction:column}',
      'body.mv-open{overflow:hidden}body.mv-open #tutorFab,body.mv-open #tutorHint,body.mv-open .bt,body.mv-open #quotaBadge{display:none!important}',
      '.mv-hdr{flex:none;position:sticky;top:0;background:var(--bg,#FAF9F6);border-bottom:1px solid var(--bd);padding:calc(8px + env(safe-area-inset-top)) 12px 9px;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:10px}',
      '.mv-hdr-x{font:inherit;background:none;border:0;color:var(--tx2);font-size:20px;line-height:1;cursor:pointer;padding:6px 8px;border-radius:10px}',
      '.mv-hdr-t{text-align:center;min-width:0}.mv-hdr-t b{display:block;font-size:15px}.mv-hdr-t small{display:block;font-size:11.5px;color:var(--tx2);margin-top:2px}',
      '.mv-hdr-sp{width:34px}',
      '.mv-body{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:16px 16px calc(120px + env(safe-area-inset-bottom))}',
      '.mv-lead{font-size:13px;color:var(--tx2);line-height:1.65;margin:0 0 16px}',
      // 新增列
      '.mv-addbox{background:var(--bg2);border:1px solid var(--bd);border-radius:16px;padding:14px;margin-bottom:18px}',
      '.mv-addbox input,.mv-addbox textarea{width:100%;box-sizing:border-box;font:inherit;font-size:15px;color:var(--tx);background:var(--bg);border:1.5px solid var(--bd);border-radius:12px;padding:11px 13px;outline:none}',
      '.mv-addbox input:focus,.mv-addbox textarea:focus{border-color:var(--ac)}',
      '.mv-addbox textarea{resize:vertical;min-height:62px;line-height:1.6}',
      '.mv-addrow{display:flex;gap:10px;align-items:center}.mv-addrow input{flex:1;min-width:0}',
      '.mv-btn{flex:none;font:inherit;font-size:14px;font-weight:800;border:0;border-radius:12px;padding:11px 16px;cursor:pointer;background:var(--ac);color:#fff}',
      '.mv-btn:disabled{opacity:.45;cursor:default}',
      '.mv-btn2{background:var(--bg3);color:var(--tx);border:1px solid var(--bd)}',
      '.mv-hintline{font-size:12px;color:var(--tx3);margin-top:10px;line-height:1.6}',
      '.mv-manual{display:flex;flex-direction:column;gap:12px;margin-top:14px;padding-top:14px;border-top:1px solid var(--bd)}',
      '.mv-manual label{font-size:12.5px;color:var(--tx2);display:block;margin-bottom:6px;font-weight:700}',
      '.mv-manual-btns{display:flex;gap:10px}',
      '.mv-err{background:var(--bg3);border-radius:12px;padding:13px;font-size:13px;line-height:1.65;color:var(--tx);margin-top:12px}',
      '.mv-err a,.mv-err button{color:var(--ac);font-weight:800;background:none;border:0;padding:0;cursor:pointer;font:inherit;font-size:13px;text-decoration:underline}',
      '.mv-err-sub{font-size:12px;color:var(--tx2);margin-top:8px;line-height:1.6}',
      // 查到的字:預覽卡
      '.mv-prev{margin-top:14px;padding-top:14px;border-top:1px solid var(--bd)}',
      '.mv-prev-top{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}',
      '.mv-prev-w{font-size:22px;font-weight:900;line-height:1.3}.mv-prev-r{font-size:13px;color:var(--tx2)}',
      '.mv-tag{font-size:11.5px;font-weight:800;color:var(--tx2);background:var(--bg3);border-radius:999px;padding:4px 10px}',
      '.mv-prev-m{font-size:15px;margin-top:10px;line-height:1.6}',
      '.mv-note{font-size:12.5px;color:var(--tx2);line-height:1.65;margin-top:10px;background:var(--bg3);border-radius:10px;padding:10px 12px}',
      '.mv-ex{margin-top:12px;padding:11px 13px;border-left:3px solid var(--ac2,#4A7FD4);background:var(--bg3);border-radius:8px}',
      '.mv-ex + .mv-ex{margin-top:10px}',
      '.mv-ex .j{font-size:15px;line-height:2}.mv-ex rt{font-size:.55em;color:var(--tx2)}.mv-ex .z{font-size:12.5px;color:var(--tx2);margin-top:4px}',
      '.mv-ex .spk{border:0;background:none;cursor:pointer;color:var(--ac2,#4A7FD4);padding:0 4px;vertical-align:middle}',
      // 清單
      '.mv-sec{font-size:12px;font-weight:800;color:var(--tx2);letter-spacing:.04em;margin:0 0 12px}',
      '.mv-item{background:var(--bg2);border:1px solid var(--bd);border-radius:14px;padding:14px;margin-bottom:12px}',
      '.mv-item-top{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}',
      '.mv-item-w{font-size:17px;font-weight:800}.mv-item-r{font-size:12.5px;color:var(--tx2)}',
      '.mv-item-m{font-size:14px;margin-top:8px;line-height:1.6}',
      '.mv-item-ex{font-size:13px;color:var(--tx2);margin-top:9px;line-height:1.8}',
      '.mv-item-btm{display:flex;align-items:center;gap:14px;margin-top:12px;padding-top:11px;border-top:1px solid var(--bd)}',
      '.mv-ibtn{font:inherit;font-size:12.5px;background:none;border:0;color:var(--tx2);cursor:pointer;padding:4px 0;display:inline-flex;align-items:center;gap:5px}',
      '.mv-ibtn.del{color:var(--tx3);margin-left:auto}',
      '.mv-pr{font-size:11.5px;color:var(--tx3);margin-left:auto}.mv-pr + .del{margin-left:14px}',
      '.mv-empty{text-align:center;padding:30px 16px;color:var(--tx2);font-size:13.5px;line-height:1.8}',
      '.mv-empty img{width:96px;height:auto;margin-bottom:14px;opacity:.9}',
      // 底部固定操作列
      '.mv-foot{position:absolute;left:0;right:0;bottom:0;background:var(--bg,#FAF9F6);border-top:1px solid var(--bd);padding:12px 16px calc(12px + env(safe-area-inset-bottom));display:flex;gap:10px}',
      '.mv-foot .mv-btn{flex:1}',
      // 練習
      '.mv-pick{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:18px}',
      '.mv-chip{font:inherit;font-size:13.5px;font-weight:700;border:1.5px solid var(--bd);background:var(--bg2);color:var(--tx);border-radius:999px;padding:8px 14px;cursor:pointer}',
      '.mv-chip.on{border-color:var(--ac);color:var(--ac);background:var(--soft,rgba(212,101,74,.08))}',
      '.mv-q{background:var(--bg2);border:1px solid var(--bd);border-radius:16px;padding:15px;margin-bottom:14px}',
      '.mv-q-w{font-size:17px;font-weight:800}.mv-q-r{font-size:12.5px;color:var(--tx2);margin-left:8px;font-weight:400}',
      '.mv-q-scene{font-size:14px;line-height:1.7;margin-top:10px}',
      '.mv-q-hint{font-size:12px;color:var(--tx3);margin-top:8px;line-height:1.6}',
      '.mv-q textarea{width:100%;box-sizing:border-box;margin-top:12px;font:inherit;font-size:15px;line-height:1.7;color:var(--tx);background:var(--bg);border:1.5px solid var(--bd);border-radius:12px;padding:11px 13px;min-height:62px;resize:vertical;outline:none}',
      '.mv-q textarea:focus{border-color:var(--ac)}',
      '.mv-res{margin-top:12px;padding-top:12px;border-top:1px solid var(--bd)}',
      '.mv-res-hd{display:flex;align-items:center;gap:8px;font-size:13.5px;font-weight:800}',
      '.mv-res-hd.ok{color:#16a34a}.mv-res-hd.no{color:var(--ac)}',
      '.mv-res-fix{font-size:15px;line-height:2;margin-top:9px}.mv-res-fix rt{font-size:.55em;color:var(--tx2)}',
      '.mv-res-why{font-size:12.5px;color:var(--tx2);line-height:1.7;margin-top:8px}',
      '.mv-res-mine{font-size:12.5px;color:var(--tx3);line-height:1.7;margin-top:8px;padding-top:8px;border-top:1px dashed var(--bd)}',
      '.mv-load{display:flex;align-items:center;gap:10px;font-size:13.5px;color:var(--tx2);padding:18px 2px}',
      '.mv-load i{width:7px;height:7px;border-radius:50%;background:var(--tx3);animation:mvB 1s infinite}.mv-load i:nth-child(2){animation-delay:.15s}.mv-load i:nth-child(3){animation-delay:.3s}',
      '@keyframes mvB{0%,80%,100%{opacity:.3}40%{opacity:1}}',
      '.mv-score{background:var(--bg3);border-radius:14px;padding:15px;margin-bottom:16px;font-size:14px;line-height:1.7}',
      '.mv-score b{font-size:16px}',
      '@media(min-width:900px){.mv-body{max-width:720px;margin:0 auto;width:100%}.mv-foot{max-width:720px;left:50%;transform:translateX(-50%)}}',
    ].join('\n');
    document.head.appendChild(s);
  }

  // ── 外框 ────────────────────────────────────────────────
  var state = { view: 'list', busy: false, preview: null, manual: false, picked: [], quiz: null, results: null };

  function mask() { return $('mvMask'); }
  function open() {
    css();
    var m = mask();
    if (!m) { m = document.createElement('div'); m.id = 'mvMask'; m.className = 'mv-mask'; document.body.appendChild(m); }
    document.body.classList.add('mv-open');
    state.view = 'list'; state.preview = null; state.manual = false; state.results = null; state.quiz = null;
    render();
    try { if (typeof track === 'function') track('myvocab_open', { n: count() }); } catch (e) {}
  }
  function close(keepStack) {
    var m = mask(); if (m) m.remove();
    document.body.classList.remove('mv-open');
    try { if (root.hubInvalidate) root.hubInvalidate(); if (typeof doRender === 'function') doRender(); } catch (e) {}
    if (!keepStack) { try { if (root.NavBack) NavBack.back(); } catch (e) {} }   // 有來源畫面就回去,沒有就維持原本行為
  }
  function hydrate() { try { if (root.Icons && Icons.hydrate) Icons.hydrate(); } catch (e) {} }

  function header() {
    var n = count();
    var sub = state.view === 'practice'
      ? L('小狸出情境，你用自己的字造句', 'The tutor sets the scene, you write the sentence')
      : (n ? L('已收 ' + n + ' 個字 · 都會排進每日複習', n + ' saved · all in your daily review') : L('自己輸入想背的單字或片語', 'Add the words you actually want'));
    return '<div class="mv-hdr">'
      + (state.view === 'list'
        ? '<button type="button" class="mv-hdr-x" onclick="MyVocab.close()" aria-label="' + L('關閉', 'Close') + '"><i data-ic=x></i></button>'
        : '<button type="button" class="mv-hdr-x" onclick="MyVocab.back()" aria-label="' + L('返回', 'Back') + '">←</button>')
      + '<div class="mv-hdr-t"><b>' + (state.view === 'practice' ? L('跟小狸練習', 'Practice with the tutor') : L('我的單字本', 'My words')) + '</b><small>' + sub + '</small></div>'
      + '<span class="mv-hdr-sp"></span>'
      + '</div>';
  }
  function render() {
    var m = mask(); if (!m) return;
    m.innerHTML = header() + '<div class="mv-body" id="mvBody"></div>' + foot();
    paint();
  }
  function foot() {
    if (state.view === 'practice') return '';
    var n = count();
    if (!n) return '';
    return '<div class="mv-foot">'
      + '<button type="button" class="mv-btn mv-btn2" onclick="MyVocab.reviewNow()"><i data-ic=refresh></i> ' + L('馬上背一輪', 'Review now') + '</button>'
      + '<button type="button" class="mv-btn" onclick="MyVocab.practice()"><i data-ic=speak></i> ' + L('跟小狸練', 'Practice') + '</button>'
      + '</div>';
  }
  function paint() {
    var b = $('mvBody'); if (!b) return;
    b.innerHTML = state.view === 'practice' ? practiceHtml() : listHtml();
    hydrate();
  }
  function back() {
    if (state.view === 'practice') { state.view = 'list'; state.quiz = null; state.results = null; render(); return; }
    close();
  }

  // ── 清單 + 新增 ─────────────────────────────────────────
  function listHtml() {
    var items = list();
    var h = '<p class="mv-lead">' + L('看到想記的字、課本上的片語、同事講的說法，打進來就好。小狸會幫你查讀音、意思跟例句，存下來的字會自動排進每日複習，也可以叫小狸出情境陪你練。',
      'Type in any word or phrase you want to remember. The tutor fills in the reading, meaning and examples; saved words join your daily review and you can drill them with the tutor.') + '</p>';

    h += '<div class="mv-addbox">'
      + '<div class="mv-addrow">'
        + '<input id="mvIn" type="text" placeholder="' + attr(L('日文單字或片語，例：気が置けない', 'A Japanese word or phrase')) + '" autocomplete="off" autocapitalize="none" onkeydown="if(event.key===\'Enter\'){event.preventDefault();MyVocab.lookup()}">'
        + '<button type="button" class="mv-btn" id="mvGo" onclick="MyVocab.lookup()">' + L('查', 'Look up') + '</button>'
      + '</div>'
      + '<div class="mv-hintline">' + L('也可以打中文，例如「不用客氣」，小狸會給你日文說法。', 'You can also type your own language, e.g. “no need to be formal”.') + '</div>'
      + '<div id="mvAddOut"></div>'
      + (state.manual ? manualHtml() : '<div class="mv-hintline"><button type="button" class="mv-ibtn" onclick="MyVocab.toggleManual()"><i data-ic=edit></i> ' + L('不用小狸，我自己填意思', 'Skip the tutor — I’ll fill it in myself') + '</button></div>')
      + '</div>';

    if (!items.length) {
      h += '<div class="mv-empty"><img src="images/mascot/tanuki-p08.png" alt="">'
        + L('還沒有自己的字。<br>先加一個試試看，明天它就會出現在複習裡。', 'No words yet.<br>Add one and it shows up in tomorrow’s review.') + '</div>';
      return h;
    }
    h += '<div class="mv-sec">' + L('我的字（' + items.length + '）', 'My words (' + items.length + ')') + '</div>';
    items.forEach(function (it) {
      var pr = it.pr || {};
      h += '<div class="mv-item">'
        + '<div class="mv-item-top"><span class="mv-item-w">' + esc(it.w) + '</span>'
        + (it.r && it.r !== it.w ? '<span class="mv-item-r">' + esc(it.r) + '</span>' : '')
        + (it.c ? '<span class="mv-tag">' + esc(it.c) + '</span>' : '')
        + (it.lv ? '<span class="mv-tag">' + esc(String(it.lv).toUpperCase()) + '</span>' : '')
        + '</div>'
        + '<div class="mv-item-m">' + esc(it.m || L('（還沒填意思）', '(no meaning yet)')) + '</div>'
        + (it.ex && it.ex.j ? '<div class="mv-item-ex">' + fr(it.ex.j) + (it.ex.z ? '<br>' + esc(it.ex.z) : '') + '</div>' : '')
        + '<div class="mv-item-btm">'
          + '<button type="button" class="mv-ibtn" onclick="MyVocab.say(\'' + attr(it.r || it.w) + '\', event)"><i data-ic=volume></i> ' + L('發音', 'Play') + '</button>'
          + (it.ex && it.ex.j ? '<button type="button" class="mv-ibtn" onclick="MyVocab.say(\'' + attr(it.ex.j) + '\', event)"><i data-ic=speak></i> ' + L('唸例句', 'Example') + '</button>' : '')
          + (pr.n ? '<span class="mv-pr">' + L('練過 ' + pr.n + ' 次 · 對 ' + (pr.ok || 0), 'practiced ' + pr.n + ' · ' + (pr.ok || 0) + ' right') + '</span>' : '')
          + '<button type="button" class="mv-ibtn del" onclick="MyVocab.del(\'' + attr(it.w) + '\')"><i data-ic=trash></i> ' + L('移除', 'Remove') + '</button>'
        + '</div>'
      + '</div>';
    });
    return h;
  }

  function manualHtml() {
    var p = state.preview || {};
    return '<div class="mv-manual">'
      + '<div><label>' + L('單字／片語（必填）', 'Word or phrase (required)') + '</label><input id="mvMw" type="text" value="' + attr(p.w || '') + '" placeholder="' + attr(L('例：気が置けない', 'e.g. 気が置けない')) + '"></div>'
      + '<div><label>' + L('讀音（選填）', 'Reading (optional)') + '</label><input id="mvMr" type="text" value="' + attr(p.r || '') + '" placeholder="' + attr(L('平假名，例：きがおけない', 'kana')) + '"></div>'
      + '<div><label>' + L('意思（必填）', 'Meaning (required)') + '</label><input id="mvMm" type="text" value="' + attr(p.m || '') + '" placeholder="' + attr(L('用你自己的話寫就好', 'In your own words')) + '"></div>'
      + '<div><label>' + L('例句（選填）', 'Example (optional)') + '</label><textarea id="mvMe" placeholder="' + attr(L('日文例句', 'Japanese example')) + '">' + esc(p.ex && p.ex.j ? p.ex.j : '') + '</textarea></div>'
      + '<div class="mv-manual-btns">'
        + '<button type="button" class="mv-btn" onclick="MyVocab.saveManual()">' + L('存起來', 'Save') + '</button>'
        + '<button type="button" class="mv-btn mv-btn2" onclick="MyVocab.toggleManual()">' + L('取消', 'Cancel') + '</button>'
      + '</div></div>';
  }

  function toggleManual() {
    state.manual = !state.manual;
    if (state.manual) { var v = $('mvIn'); state.preview = state.preview || (v && v.value.trim() ? { w: v.value.trim() } : null); }
    paint();
    if (state.manual) { var el = $('mvMw'); if (el) { el.focus(); } }
  }
  function saveManual() {
    var w = ($('mvMw') || {}).value, m = ($('mvMm') || {}).value;
    w = String(w || '').trim(); m = String(m || '').trim();
    if (!w) { toast(L('先填單字或片語', 'Enter a word or phrase first')); return; }
    if (!m) { toast(L('填一下意思，複習時才看得懂', 'Add a meaning so reviews make sense')); return; }
    var ex = String((($('mvMe') || {}).value) || '').trim();
    add({ w: w, r: String((($('mvMr') || {}).value) || '').trim(), m: m, c: L('自訂', 'custom'), ex: ex ? { j: ex, z: '' } : null, src: 'manual' });
    state.manual = false; state.preview = null;
    try { if (typeof track === 'function') track('myvocab_add', { src: 'manual' }); } catch (e) {}
    render();
  }

  async function lookup() {
    if (state.busy) return;
    var el = $('mvIn'); var q = el ? String(el.value || '').trim() : '';
    if (!q) { if (el) el.focus(); return; }
    if (has(q)) { toast(L('「' + q + '」已經在你的單字本裡了', '“' + q + '” is already in your list')); return; }
    state.busy = true;
    var go = $('mvGo'); if (go) { go.disabled = true; }
    var out = $('mvAddOut');
    if (out) out.innerHTML = '<div class="mv-load"><i></i><i></i><i></i><span>' + L('小狸查字中…', 'Looking it up…') + '</span></div>';
    var r = await callAI({ mode: 'word', q: q });
    state.busy = false; if (go) go.disabled = false;
    out = $('mvAddOut'); if (!out) return;
    if (r.err) { out.innerHTML = aiErrHtml(r.err, r.msg); hydrate(); return; }
    var d = r.data || {};
    if (!d.ok) {
      out.innerHTML = '<div class="mv-err">' + esc(d.msg || L('查不到這個字，換個寫法試試？', 'Couldn’t find that — try another spelling?'))
        + '<div class="mv-err-sub">' + L('確定要背的話，按「自己填」手動存也可以。', 'You can still save it manually.') + '</div></div>';
      hydrate(); return;
    }
    state.preview = {
      w: d.w || q, r: d.r || '', m: d.m || '', c: d.c || '', lv: d.lv || '', note: d.note || '',
      ex: (d.ex && d.ex[0]) ? { j: d.ex[0].j, z: d.ex[0].z } : null,
      ex2: (d.ex && d.ex[1]) ? { j: d.ex[1].j, z: d.ex[1].z } : null,
      src: 'ai',
    };
    out.innerHTML = previewHtml(state.preview, r.remain);
    hydrate();
  }
  function previewHtml(p, remain) {
    var h = '<div class="mv-prev">'
      + '<div class="mv-prev-top"><span class="mv-prev-w">' + esc(p.w) + '</span>'
      + (p.r && p.r !== p.w ? '<span class="mv-prev-r">' + esc(p.r) + '</span>' : '')
      + (p.c ? '<span class="mv-tag">' + esc(p.c) + '</span>' : '')
      + (p.lv ? '<span class="mv-tag">' + esc(String(p.lv).toUpperCase()) + '</span>' : '')
      + '<button type="button" class="mv-ibtn" style="margin-left:auto" onclick="MyVocab.say(\'' + attr(p.r || p.w) + '\', event)"><i data-ic=volume></i> ' + L('發音', 'Play') + '</button>'
      + '</div>'
      + '<div class="mv-prev-m">' + esc(p.m) + '</div>'
      + (p.note ? '<div class="mv-note">' + esc(p.note) + '</div>' : '');
    [p.ex, p.ex2].forEach(function (e) {
      if (!e || !e.j) return;
      h += '<div class="mv-ex"><span class="j">' + fr(e.j) + '</span>'
        + '<button type="button" class="spk" onclick="MyVocab.say(\'' + attr(e.j) + '\', event)" aria-label="' + L('播放', 'Play') + '"><i data-ic=volume></i></button>'
        + (e.z ? '<div class="z">' + esc(e.z) + '</div>' : '') + '</div>';
    });
    h += '<div class="mv-manual-btns" style="margin-top:14px">'
      + '<button type="button" class="mv-btn" onclick="MyVocab.savePreview()"><i data-ic=check></i> ' + L('加進我的單字', 'Add to my words') + '</button>'
      + '<button type="button" class="mv-btn mv-btn2" onclick="MyVocab.toggleManual()">' + L('自己改', 'Edit') + '</button>'
      + '</div>';
    if (typeof remain === 'number' && remain < 999) h += '<div class="mv-hintline">' + L('今天還可以問小狸 ' + remain + ' 次', remain + ' tutor credits left today') + '</div>';
    return h + '</div>';
  }
  function savePreview() {
    if (!state.preview) return;
    add(state.preview);
    try { if (typeof track === 'function') track('myvocab_add', { src: 'ai' }); } catch (e) {}
    state.preview = null; state.manual = false;
    var el = $('mvIn'); if (el) el.value = '';
    render();
    var b = $('mvBody'); if (b) b.scrollTop = 0;
  }
  function del(w) {
    remove(w);
    render();
  }

  // 馬上背一輪:走站上既有的字卡(SRS level 'my'),不另做一套
  function reviewNow() {
    var items = list();
    if (!items.length) return;
    if (typeof SRS === 'undefined' || !SRS.start) { toast(L('複習功能還沒載入好，重新整理再試', 'Review isn’t ready yet — reload and try again')); return; }
    close(true);
    try { if (root.NavBack) NavBack.push('myvocab'); } catch (e) {}   // 背完/關掉字卡 → 回單字本,不要掉回面板
    SRS.start('my', { words: items.slice(0, 20) });
  }

  // ── 練習 ────────────────────────────────────────────────
  function practice() {
    var items = list();
    if (!items.length) return;
    // 預設挑練最少、最久沒練的前 3 個
    var sorted = items.slice().sort(function (a, b) {
      var pa = a.pr || {}, pb = b.pr || {};
      return (pa.n || 0) - (pb.n || 0) || (pa.last || 0) - (pb.last || 0);
    });
    state.picked = sorted.slice(0, Math.min(3, sorted.length)).map(function (x) { return x.w; });
    state.view = 'practice'; state.quiz = null; state.results = null;
    render();
  }
  function toggle(w) {
    var i = state.picked.indexOf(w);
    if (i >= 0) state.picked.splice(i, 1);
    else { if (state.picked.length >= MAX_PRACTICE) { toast(L('一輪最多練 ' + MAX_PRACTICE + ' 個字', 'Up to ' + MAX_PRACTICE + ' words per round')); return; } state.picked.push(w); }
    paint();
  }
  function practiceHtml() {
    if (state.results) return resultsHtml();
    if (state.quiz) return quizHtml();
    var items = list();
    var h = '<p class="mv-lead">' + L('選幾個字，小狸會給你情境，你用那個字寫一句日文。寫完一起批改：小狸會先確認你<b>真的有用到那個字</b>，再看文法對不對。',
      'Pick a few words. The tutor gives you a situation, you write one Japanese sentence each. It checks you actually <b>used the word</b>, then the grammar.') + '</p>';
    h += '<div class="mv-sec">' + L('這輪要練（最多 ' + MAX_PRACTICE + ' 個）', 'This round (up to ' + MAX_PRACTICE + ')') + '</div>';
    h += '<div class="mv-pick">';
    items.forEach(function (it) {
      h += '<button type="button" class="mv-chip' + (state.picked.indexOf(it.w) >= 0 ? ' on' : '') + '" onclick="MyVocab.toggle(\'' + attr(it.w) + '\')">' + esc(it.w) + '</button>';
    });
    h += '</div>';
    h += '<button type="button" class="mv-btn" style="width:100%" onclick="MyVocab.startQuiz()"' + (state.picked.length ? '' : ' disabled') + '>'
      + L('開始練（用 1 次額度出題）', 'Start (uses 1 credit)') + '</button>';
    h += '<div class="mv-hintline">' + L('出題 1 次、批改 1 次，一輪共 2 次 AI 額度。', 'One credit to generate, one to grade — 2 per round.') + '</div>';
    h += '<div id="mvPrOut"></div>';
    return h;
  }
  async function startQuiz() {
    if (state.busy || !state.picked.length) return;
    state.busy = true;
    var out = $('mvPrOut');
    if (out) out.innerHTML = '<div class="mv-load"><i></i><i></i><i></i><span>' + L('小狸出題中…', 'Writing your prompts…') + '</span></div>';
    var items = state.picked.map(function (w) { var it = find(w) || { w: w }; return { w: it.w }; });
    var r = await callAI({ mode: 'quiz', items: items });
    state.busy = false;
    if (r.err) { out = $('mvPrOut'); if (out) { out.innerHTML = aiErrHtml(r.err, r.msg); hydrate(); } return; }
    var got = (r.data && r.data.items) || [];
    // 對回自己的詞(模型可能改寫/少給):以我方清單為準,配不到就給自由造句
    state.quiz = state.picked.map(function (w, i) {
      var g = got.find(function (x) { return x && x.w && norm(x.w) === norm(w); }) || got[i] || {};
      return { w: w, scene: g.scene || L('用這個字寫一句你自己的話', 'Write a sentence of your own with this word'), hint: g.hint || '', answer: '' };
    });
    state.remain = r.remain;
    paint();
  }
  function quizHtml() {
    var h = '<p class="mv-lead">' + L('每題寫一句日文，寫完按底下一起批改。想不到就先跳過，空白也會給你參考答案。',
      'One Japanese sentence each, then grade them together. Leave one blank and you’ll still get a model answer.') + '</p>';
    state.quiz.forEach(function (q, i) {
      var it = find(q.w) || {};
      h += '<div class="mv-q">'
        + '<div><span class="mv-q-w">' + esc(q.w) + '</span>' + (it.r && it.r !== q.w ? '<span class="mv-q-r">' + esc(it.r) + '</span>' : '') + '</div>'
        + (it.m ? '<div class="mv-q-hint">' + esc(it.m) + '</div>' : '')
        + '<div class="mv-q-scene">' + esc(q.scene) + '</div>'
        + (q.hint ? '<div class="mv-q-hint"><i data-ic=bulb></i> ' + esc(q.hint) + '</div>' : '')
        + '<textarea id="mvA' + i + '" placeholder="' + attr(L('用日文寫一句', 'Write one Japanese sentence')) + '" oninput="MyVocab.keep(' + i + ',this.value)">' + esc(q.answer) + '</textarea>'
        + '</div>';
    });
    h += '<button type="button" class="mv-btn" style="width:100%" onclick="MyVocab.submit()">' + L('交給小狸批改（1 次額度）', 'Grade my answers (1 credit)') + '</button>';
    h += '<div id="mvPrOut"></div>';
    return h;
  }
  function keep(i, v) { if (state.quiz && state.quiz[i]) state.quiz[i].answer = v; }

  async function submit() {
    if (state.busy || !state.quiz) return;
    // 交出去前先把畫面上的答案收回來(oninput 沒觸發的情況:自動填字、貼上)
    state.quiz.forEach(function (q, i) { var el = $('mvA' + i); if (el) q.answer = String(el.value || ''); });
    state.busy = true;
    var out = $('mvPrOut');
    if (out) out.innerHTML = '<div class="mv-load"><i></i><i></i><i></i><span>' + L('小狸批改中…', 'Grading…') + '</span></div>';
    var r = await callAI({ mode: 'grade', items: state.quiz.map(function (q) { return { w: q.w, scene: q.scene, answer: q.answer }; }) });
    state.busy = false;
    if (r.err) { out = $('mvPrOut'); if (out) { out.innerHTML = aiErrHtml(r.err, r.msg); hydrate(); } return; }
    var got = (r.data && r.data.items) || [];
    state.results = state.quiz.map(function (q, i) {
      var g = got.find(function (x) { return x && x.w && norm(x.w) === norm(q.w); }) || got[i] || {};
      var it = find(q.w) || { w: q.w };
      var localUsed = usedLocally(it, q.answer);
      // 這裡是重點:本地比對看得到那個詞,就不讓 AI 說「你沒用到」
      // (社群抱怨的就是 AI 改寫/認錯,害練到的字存不起來)
      var used = localUsed || g.used === true;
      var correct = used && g.correct === true;
      return {
        w: q.w, scene: q.scene, answer: q.answer, used: used, correct: correct,
        fix: g.fix || '', why: g.why || '', blank: !String(q.answer || '').trim(),
      };
    });
    state.remain = r.remain;
    // 寫回 SRS:用對了算答對,沒用到或寫錯算答錯 → 直接影響下次複習間隔
    state.results.forEach(function (x) {
      if (x.blank) return;
      markPractice(x.w, x.correct);
      try { if (typeof SRS !== 'undefined' && SRS.record) SRS.record('my', x.w, x.correct); } catch (e) {}
    });
    try { if (root.StayDaily && root.StayDaily.log) root.StayDaily.log('tutor'); } catch (e) {}
    try { if (typeof track === 'function') track('myvocab_practice', { n: state.results.length, ok: state.results.filter(function (x) { return x.correct; }).length }); } catch (e) {}
    paint();
    var b = $('mvBody'); if (b) b.scrollTop = 0;
  }
  function resultsHtml() {
    var ok = state.results.filter(function (x) { return x.correct; }).length;
    var tot = state.results.length;
    var h = '<div class="mv-score"><b>' + L(ok + ' / ' + tot + ' 句過關', ok + ' / ' + tot + ' nailed it') + '</b><br>'
      + (ok === tot ? L('全對，這幾個字你已經會用了。', 'All correct — you can actually use these now.')
        : L('答對的下次會隔久一點再出現，沒過的很快會再遇到。', 'Correct ones come back later; the rest show up again soon.')) + '</div>';
    state.results.forEach(function (x) {
      var cls = x.correct ? 'ok' : 'no';
      var label = x.blank ? L('沒寫', 'Skipped') : (!x.used ? L('沒用到「' + x.w + '」', 'Didn’t use “' + x.w + '”') : (x.correct ? L('用對了', 'Correct') : L('再修一下', 'Almost')));
      h += '<div class="mv-q">'
        + '<div><span class="mv-q-w">' + esc(x.w) + '</span></div>'
        + '<div class="mv-q-scene">' + esc(x.scene) + '</div>'
        + '<div class="mv-res">'
          + '<div class="mv-res-hd ' + cls + '"><i data-ic=' + (x.correct ? 'check' : 'x') + '></i> ' + esc(label) + '</div>'
          + (x.fix ? '<div class="mv-res-fix">' + fr(x.fix) + '<button type="button" class="spk mv-ibtn" onclick="MyVocab.say(\'' + attr(x.fix) + '\', event)"><i data-ic=volume></i></button></div>' : '')
          + (x.why ? '<div class="mv-res-why">' + esc(x.why) + '</div>' : '')
          + (x.answer ? '<div class="mv-res-mine">' + L('你寫的：', 'You wrote: ') + esc(x.answer) + '</div>' : '')
        + '</div>'
      + '</div>';
    });
    h += '<div class="mv-manual-btns" style="margin-top:4px">'
      + '<button type="button" class="mv-btn" onclick="MyVocab.practice()">' + L('再練一輪', 'Another round') + '</button>'
      + '<button type="button" class="mv-btn mv-btn2" onclick="MyVocab.back()">' + L('回單字本', 'Back to my words') + '</button>'
      + '</div>';
    if (typeof state.remain === 'number' && state.remain < 999) h += '<div class="mv-hintline">' + L('今天還可以問小狸 ' + state.remain + ' 次', state.remain + ' tutor credits left today') + '</div>';
    return h;
  }

  root.MyVocab = {
    open: open, close: close, back: back, list: list, count: count, has: has,
    add: add, remove: remove, del: del,
    lookup: lookup, savePreview: savePreview, toggleManual: toggleManual, saveManual: saveManual,
    practice: practice, toggle: toggle, startQuiz: startQuiz, submit: submit, keep: keep,
    reviewNow: reviewNow, say: say, owns: owns,
  };
  try { if (root.NavBack) NavBack.register('myvocab', function () { open(); }); } catch (e) {}
})(window);
