// 文章閱讀 UI — Readle 式沉浸閱讀器:分頁(文章/測驗/單字/文法)、底部連播播放器、字級調整、大按鈕、手機優先。
// 重用 furiganaHTMLRich→自動 furigana + 即點即查;播音只用預錄 mp3(絕不瀏覽器語音)。純前端、零 API 成本。
window.Articles = (function () {
  'use strict';
  var LEVELS = ['n5', 'n4', 'n3', 'n2', 'n1'];
  var LVN = { n5: 'N5', n4: 'N4', n3: 'N3', n2: 'N2', n1: 'N1' };
  // 分級主題色(hero 漸層)
  var LVC = { n5: ['#34d399', '#059669'], n4: ['#22d3ee', '#0891b2'], n3: ['#60a5fa', '#2563eb'], n2: ['#a78bfa', '#7c3aed'], n1: ['#fb7185', '#e11d48'] };
  var furiOn = true, fsIdx = 1, curId = null, curTab = 'read';
  var FS = ['18px', '20px', '23px'];   // 字級三段
  function list() { return window.ARTICLES || []; }
  function enOr(zh, en) { try { return localStorage.getItem('ui_lang') === 'en' ? en : zh; } catch (e) { return zh; } }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function readSet() { try { return JSON.parse(localStorage.getItem('article_read')) || {}; } catch (e) { return {}; } }
  function markRead(id) { var s = readSet(); s[id] = Date.now(); localStorage.setItem('article_read', JSON.stringify(s)); if (typeof saveAllCloud === 'function') try { saveAllCloud(); } catch (e) {} }
  function fr(text) { return window.furiganaHTMLRich ? window.furiganaHTMLRich(text) : esc(text); }
  function imgUrl(id) { return 'images/articles/' + id + '.jpg'; }   // 封面圖(CC0/公共領域);載入失敗自動退回漸層＋emoji
  function hasTts(t) { return !!(window.__TTS && window.__TTS[t]); }
  function ttsPath(t) { return window.ttsUrl ? window.ttsUrl(window.__TTS[t]) : 'audio/tts/' + window.__TTS[t] + '.mp3'; }
  function topicEmoji(t) {
    t = t || '';
    var map = [['電車|交通|通勤', '🚃'], ['京都|旅|観光|旅行', '⛩️'], ['一人|暮|生活|家', '🏠'], ['銭湯|風呂|温泉', '♨️'], ['少子|人口|社会', '👶'], ['飲み|酒|會社|会社|仕事|職場', '🍶'], ['空気|人間関係', '💬'], ['報連相|ビジネス', '📋'], ['AI|学び|勉強|技術', '🤖'], ['観光|公害|環境', '🌏'], ['食|料理|ご飯', '🍚'], ['天気|季節', '🌤️'], ['一日|朝|日課', '⏰']];
    for (var i = 0; i < map.length; i++) if (new RegExp(map[i][0]).test(t)) return map[i][1];
    return '📖';
  }

  function ensureCss() {
    if (document.getElementById('artCss')) return;
    var st = document.createElement('style'); st.id = 'artCss';
    st.textContent = [
      '.art-mask{position:fixed;inset:0;z-index:9000;background:var(--bg,#faf9f6);overflow-y:auto;-webkit-overflow-scrolling:touch}',
      '.art-wrap{max-width:640px;margin:0 auto;padding:0 0 120px}',
      // top bar
      '.art-top{position:sticky;top:0;background:var(--bg,#faf9f6);display:flex;align-items:center;gap:6px;padding:10px 14px;border-bottom:1px solid var(--bd,#e8e5e0);z-index:5}',
      '.art-top .tt{font-size:16px;font-weight:800;margin:0 auto 0 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.art-ic{border:none;background:none;cursor:pointer;font-size:16px;color:var(--tx2,#888);width:40px;height:40px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center}',
      '.art-ic:active{background:var(--bd,#eee)}',
      // list
      '.art-lwrap{padding:14px 16px}',
      '.art-sub{color:var(--tx2,#888);font-size:13.5px;margin:2px 0 6px;line-height:1.6}',
      '.art-trial{background:var(--brand-soft,#f6e3dd);color:var(--ac,#d4654a);font-weight:700;font-size:13px;border-radius:10px;padding:9px 13px;margin:8px 0 4px}',
      '.art-lv{font-size:12px;font-weight:800;color:var(--tx3,#aaa);letter-spacing:.1em;margin:22px 0 10px}',
      '.art-card{display:flex;gap:13px;align-items:center;background:var(--bg2,#fff);border:1px solid var(--bd,#e8e5e0);border-radius:16px;padding:12px;margin-bottom:11px;cursor:pointer;transition:transform .1s,border-color .15s;box-shadow:0 1px 2px rgba(0,0,0,.03)}',
      '.art-card:active{transform:scale(.98)}',
      '.art-card:hover{border-color:var(--ac2,#e8734a)}',
      '.art-thumb{width:64px;height:64px;border-radius:13px;flex-shrink:0;position:relative;overflow:hidden;color:#fff}',
      '.art-th-e{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:30px}',
      '.art-th-i{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}',
      '.art-card-b{min-width:0;flex:1}',
      '.art-card-t{font-size:16.5px;font-weight:700;color:var(--tx,#2c2c2c);font-family:"Hiragino Mincho ProN","Noto Serif JP",serif;line-height:1.35}',
      '.art-card-z{font-size:13px;color:var(--tx2,#888);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.art-badge{display:inline-block;font-size:10.5px;font-weight:800;padding:2px 8px;border-radius:20px;color:#fff;margin-bottom:4px}',
      '.art-done{color:#16a34a;font-size:14px;margin-left:4px}',
      // hero
      '.art-hero{padding:22px 18px 18px;color:#fff;position:relative;overflow:hidden;min-height:150px;display:flex;flex-direction:column;justify-content:flex-end}',
      '.art-hero-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}',
      '.art-hero-ov{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.12) 0%,rgba(0,0,0,.32) 55%,rgba(0,0,0,.62) 100%)}',
      '.art-hero-in{position:relative}',
      '.art-hero .he{font-size:40px;line-height:1}',
      '.art-hero .hb{display:inline-block;font-size:11px;font-weight:800;padding:2px 9px;border-radius:20px;background:rgba(0,0,0,.35);backdrop-filter:blur(2px);margin:0 0 6px}',
      '.art-hero .ht{font-size:25px;font-weight:800;font-family:"Hiragino Mincho ProN","Noto Serif JP",serif;line-height:1.35;margin:2px 0}',
      '.art-hero .ht rt{font-size:.5em;opacity:.85;font-weight:400}',
      '.art-hero .hz{font-size:14px;opacity:.9;margin-top:4px}',
      // toolbar
      '.art-tools{display:flex;gap:8px;align-items:center;padding:10px 14px;border-bottom:1px solid var(--bd,#e8e5e0);flex-wrap:wrap}',
      '.art-tbtn{border:1px solid var(--bd,#ddd);background:var(--bg2,#fff);color:var(--tx2,#666);border-radius:22px;padding:8px 15px;font-size:13.5px;font-weight:600;cursor:pointer;min-height:38px}',
      '.art-tbtn:active{transform:scale(.96)}',
      '.art-tbtn.on{background:var(--ac2,#e8734a);color:#fff;border-color:var(--ac2,#e8734a)}',
      // tabs
      '.art-tabs{position:sticky;top:57px;background:var(--bg,#faf9f6);display:flex;gap:6px;padding:10px 14px;border-bottom:1px solid var(--bd,#e8e5e0);z-index:4;overflow-x:auto}',
      '.art-tab{flex:1;min-width:72px;border:none;background:none;color:var(--tx2,#888);border-radius:11px;padding:9px 6px;font-size:14px;font-weight:700;cursor:pointer;white-space:nowrap}',
      '.art-tab.on{background:var(--ac2,#e8734a);color:#fff}',
      // content
      '.art-cnt{padding:16px 18px}',
      '.art-para{line-height:2.25;color:var(--tx,#2c2c2c);margin:0 0 6px;font-family:"Hiragino Mincho ProN","Noto Serif JP",serif}',
      '.art-para rt{font-size:.5em;color:var(--tx2,#8a8a8a);font-weight:400}',
      '.art-para .jlk{cursor:pointer}',
      '.art-s{border-radius:6px;transition:background .2s;padding:1px 0}',
      '.art-s.on{background:rgba(232,115,74,.16)}',
      '.art-nofuri rt{display:none}',
      '.art-tr{font-size:14px;line-height:1.85;color:var(--tx2,#8a8a8a);margin:2px 0 16px;padding-left:12px;border-left:3px solid var(--bd,#e5e5e5)}',
      // vocab / grammar lists
      '.art-v{display:flex;align-items:center;gap:10px;padding:13px 2px;border-bottom:1px solid var(--bd,#eee)}',
      '.art-v:last-child{border-bottom:none}',
      '.art-v-spk{border:none;background:var(--brand-soft,#f6e3dd);color:var(--ac,#d4654a);width:38px;height:38px;border-radius:50%;font-size:16px;cursor:pointer;flex-shrink:0;display:inline-flex;align-items:center;justify-content:center}',
      '.art-v-spk:active{transform:scale(.9)}',
      '.art-v-w{font-weight:700;font-family:"Hiragino Mincho ProN","Noto Serif JP",serif;color:var(--tx,#2c2c2c);font-size:17px}',
      '.art-v-r{font-size:12.5px;color:var(--ac2,#e8734a);margin-top:1px}',
      '.art-v-m{color:var(--tx2,#777);margin-left:auto;text-align:right;font-size:14px;padding-left:8px}',
      '.art-g{padding:15px 0;border-bottom:1px solid var(--bd,#eee)}',
      '.art-g:last-child{border-bottom:none}',
      '.art-g-t{font-size:17px;font-family:"Hiragino Mincho ProN","Noto Serif JP",serif;font-weight:700}',
      '.art-g-t b{color:var(--ac,#d4654a)}',
      '.art-g-n{font-size:14.5px;color:var(--tx2,#777);line-height:1.8;margin-top:5px}',
      '.art-gd-btn{margin-top:10px;background:none;border:1px solid var(--bd,#ddd);color:var(--ac2,#e8734a);border-radius:10px;padding:9px 15px;font-size:13.5px;font-weight:600;cursor:pointer;min-height:40px}',
      '.art-gd-body.art-hidden{display:none}',
      // quiz
      '.aq{padding:8px 4px}',
      '.aq-q{font-size:15px;color:var(--tx2,#888);margin-bottom:6px}',
      '.aq-w{font-size:30px;font-weight:800;font-family:"Hiragino Mincho ProN","Noto Serif JP",serif;text-align:center;margin:14px 0 6px;color:var(--tx,#2c2c2c)}',
      '.aq-r{text-align:center;font-size:14px;color:var(--ac2,#e8734a);margin-bottom:22px}',
      '.aq-opts{display:grid;gap:11px}',
      '.aq-opt{border:1px solid var(--bd,#ddd);background:var(--bg2,#fff);color:var(--tx,#333);border-radius:14px;padding:16px;font-size:16px;font-weight:600;cursor:pointer;text-align:left;min-height:56px}',
      '.aq-opt:active{transform:scale(.98)}',
      '.aq-opt.ok{background:#16a34a;color:#fff;border-color:#16a34a}',
      '.aq-opt.ng{background:#ef4444;color:#fff;border-color:#ef4444}',
      '.aq-prog{font-size:13px;color:var(--tx3,#aaa);text-align:center;margin-bottom:10px}',
      // bottom player
      '.art-player{position:fixed;left:0;right:0;bottom:0;z-index:20;display:flex;justify-content:center;pointer-events:none;padding:0 12px calc(14px + env(safe-area-inset-bottom)) 12px}',
      '.art-player.hide{display:none}',
      '.art-pbar{pointer-events:auto;display:flex;align-items:center;gap:6px;background:var(--tx,#2c2c2c);color:#fff;border-radius:40px;padding:7px 10px;box-shadow:0 6px 24px rgba(0,0,0,.28);max-width:420px;width:100%}',
      '.art-pb{border:none;background:none;color:#fff;cursor:pointer;width:44px;height:44px;border-radius:50%;font-size:18px;display:inline-flex;align-items:center;justify-content:center}',
      '.art-pb.main{background:var(--ac,#d4654a);width:50px;height:50px;font-size:22px}',
      '.art-pb:active{transform:scale(.92)}',
      '.art-prate{border:none;background:rgba(255,255,255,.16);color:#fff;border-radius:20px;padding:0 12px;height:36px;font-size:13px;font-weight:700;cursor:pointer;min-width:52px}',
      '.art-ptext{font-size:12.5px;opacity:.85;margin:0 6px 0 4px;min-width:66px;font-variant-numeric:tabular-nums}',
      // done
      '.art-done-btn{display:block;width:100%;margin-top:24px;border:none;background:var(--ac,#d4654a);color:#fff;border-radius:14px;padding:15px;font-size:16px;font-weight:700;cursor:pointer;min-height:52px}'
    ].join('');
    document.head.appendChild(st);
  }

  function close() { stopPlay(); var m = document.getElementById('artMask'); if (m) m.remove(); }

  // ─────────── 清單 ───────────
  function open() {
    ensureCss(); close();
    var read = readSet(), byLv = {};
    list().forEach(function (a) { (byLv[a.level] = byLv[a.level] || []).push(a); });
    var gated = window.ToolQuota && window.ToolQuota.shouldGate && window.ToolQuota.shouldGate();
    var h = '<div class="art-mask" id="artMask"><div class="art-wrap">' +
      '<div class="art-top"><span class="tt">📖 ' + enOr('文章閱讀', 'Reading') + '</span><button class="art-ic" onclick="Articles.close()">✕</button></div>' +
      '<div class="art-lwrap">' +
      '<div class="art-sub">' + enOr('讀短文、點單字查意思、聽真人發音,把單字文法放回真正的文章裡記。', 'Read, tap any word to look it up, and listen.') + '</div>';
    if (gated) h += '<div class="art-trial">🔒 ' + enOr('免費版每天可試讀 1 篇,升級後無限暢讀。', 'Free: 1 article/day. Upgrade for unlimited.') + '</div>';
    LEVELS.forEach(function (lv) {
      var arr = byLv[lv] || []; if (!arr.length) return;
      h += '<div class="art-lv">' + LVN[lv] + '　·　' + arr.length + ' ' + enOr('篇', '') + '</div>';
      arr.forEach(function (a) {
        var g = LVC[a.level] || LVC.n5;
        h += '<div class="art-card" onclick="Articles.read(\'' + a.id + '\')">' +
          '<div class="art-thumb" style="background:linear-gradient(135deg,' + g[0] + ',' + g[1] + ')"><span class="art-th-e">' + topicEmoji(a.topic + a.title) + '</span><img class="art-th-i" src="' + imgUrl(a.id) + '" alt="" loading="lazy" onerror="this.remove()"></div>' +
          '<div class="art-card-b">' +
          '<span class="art-badge" style="background:' + g[1] + '">' + LVN[a.level] + '</span>' + (read[a.id] ? '<span class="art-done">✓</span>' : '') +
          '<div class="art-card-t">' + esc(a.title) + '</div>' +
          '<div class="art-card-z">' + esc(a.title_zh) + ' · ' + esc(a.topic) + '</div>' +
          '</div></div>';
      });
    });
    h += '</div></div></div>';
    var d = document.createElement('div'); d.innerHTML = h; document.body.appendChild(d.firstChild);
    try { if (typeof track === 'function') track('article_open', {}); } catch (e) {}
  }

  // ─────────── 閱讀器 ───────────
  function read(id) {
    ensureCss();
    var a = list().find(function (x) { return x.id === id; }); if (!a) return;
    if (!readSet()[id] && window.ToolQuota && window.ToolQuota.shouldGate && window.ToolQuota.shouldGate()) {
      if (!window.ToolQuota.canUse('article')) { window.ToolQuota.showPaywall('article'); return; }
      window.ToolQuota.consume('article');
    }
    markRead(id);   // 進入即標記已讀(✓);之後重看免計額度
    close();        // 先移除清單那層 overlay,避免兩層 artMask 疊著(內文被蓋成空白)
    curId = id; curTab = 'read';
    var g = LVC[a.level] || LVC.n5;
    var h = '<div class="art-mask" id="artMask"><div class="art-wrap">' +
      '<div class="art-top"><button class="art-ic" onclick="Articles.open()">‹</button>' +
      '<span class="tt">' + esc(a.title_zh) + '</span>' +
      '<button class="art-ic" onclick="Articles.close()">✕</button></div>' +
      '<div class="art-hero" style="background:linear-gradient(135deg,' + g[0] + ',' + g[1] + ')">' +
      '<img class="art-hero-bg" src="' + imgUrl(a.id) + '" alt="" onerror="this.remove()">' +
      '<div class="art-hero-ov"></div>' +
      '<div class="art-hero-in">' +
      '<div class="hb">' + LVN[a.level] + '　' + esc(a.topic) + '</div>' +
      '<div class="ht">' + fr(a.title) + '</div>' +
      '<div class="hz">' + esc(a.title_zh) + '</div></div></div>' +
      // toolbar
      '<div class="art-tools">' +
      '<button class="art-tbtn on" id="artFuriBtn" onclick="Articles.toggleFuri()">あ ' + enOr('假名', 'Kana') + '</button>' +
      '<button class="art-tbtn" id="artZhBtn" onclick="Articles.toggleZh()">译 ' + enOr('中譯', 'CN') + '</button>' +
      '<button class="art-tbtn" id="artFsBtn" onclick="Articles.cycleFs()">Aa</button>' +
      '</div>' +
      // tabs
      '<div class="art-tabs">' +
      tabBtn('read', '📖 ' + enOr('文章', 'Text')) +
      tabBtn('quiz', '✍️ ' + enOr('測驗', 'Quiz')) +
      tabBtn('vocab', '📕 ' + enOr('單字', 'Words') + (a.vocab ? ' ' + a.vocab.length : '')) +
      tabBtn('grammar', '📐 ' + enOr('文法', 'Grammar') + (a.grammar ? ' ' + a.grammar.length : '')) +
      '</div>' +
      '<div class="art-cnt" id="artContent"></div>' +
      '</div>' +
      // bottom player
      '<div class="art-player" id="artPlayer"><div class="art-pbar">' +
      '<button class="art-pb" onclick="Articles.playFrom(0)" title="' + enOr('從頭', 'Restart') + '">⏮</button>' +
      '<button class="art-pb main" id="artPlayBtn" onclick="Articles.togglePlay()">▶</button>' +
      '<span class="art-ptext" id="artPText">— / —</span>' +
      '<button class="art-prate" id="artRate" onclick="Articles.cycleRate()">1.0×</button>' +
      '</div></div>' +
      '</div>';
    var d = document.createElement('div'); d.innerHTML = h; document.body.appendChild(d.firstChild);
    document.getElementById('artMask').scrollTop = 0;
    renderTab('read');
    try { if (typeof track === 'function') track('article_read', { id: id, level: a.level }); } catch (e) {}
  }
  function tabBtn(k, label) { return '<button class="art-tab' + (curTab === k ? ' on' : '') + '" data-tab="' + k + '" onclick="Articles.tab(\'' + k + '\')">' + label + '</button>'; }

  function tab(k) {
    if (k !== 'read') stopPlay();
    curTab = k;
    [].forEach.call(document.querySelectorAll('.art-tab'), function (b) { b.classList.toggle('on', b.getAttribute('data-tab') === k); });
    var pl = document.getElementById('artPlayer'); if (pl) pl.classList.toggle('hide', k !== 'read');
    renderTab(k);
    var c = document.getElementById('artContent'); if (c) c.scrollIntoView({ block: 'start' });
    document.getElementById('artMask').scrollTop = 0;
  }

  function curArticle() { return list().find(function (x) { return x.id === curId; }); }

  function renderTab(k) {
    var a = curArticle(), c = document.getElementById('artContent'); if (!a || !c) return;
    if (k === 'read') return renderRead(a, c);
    if (k === 'quiz') return renderQuiz(a, c);
    if (k === 'vocab') return renderVocab(a, c);
    if (k === 'grammar') return renderGrammar(a, c);
  }

  // 文章 tab:逐句 span(可點播、連播高亮)+ 逐段中譯
  var sentSeq = [];   // [{text, i}] 有 TTS 的句子序列
  function renderRead(a, c) {
    var paras = String(a.body).split('\n').filter(function (p) { return p.trim(); });
    var trans = a.trans || [];
    sentSeq = []; var si = 0;
    var body = paras.map(function (p, pi) {
      var sents = p.match(/[^。！？]+[。！？]?/g) || [p];
      var inner = sents.map(function (s) {
        var clean = s.replace(/\s/g, '');
        if (hasTts(clean)) {
          var idx = si++; sentSeq.push({ text: clean, i: idx });
          return '<span class="art-s" id="artS' + idx + '" onclick="Articles.playFrom(' + idx + ')">' + fr(s) + '</span>';
        }
        return '<span class="art-s">' + fr(s) + '</span>';
      }).join('');
      var trHtml = trans[pi] ? '<div class="art-tr" style="display:' + (zhOn ? 'block' : 'none') + '">' + esc(trans[pi]) + '</div>' : '';
      return '<div class="art-para" style="font-size:' + FS[fsIdx] + '">' + inner + '</div>' + trHtml;
    }).join('');
    c.className = 'art-cnt' + (furiOn ? '' : ' art-nofuri');
    c.innerHTML = body;
    setPText();
  }

  function renderVocab(a, c) {
    if (!a.vocab || !a.vocab.length) { c.innerHTML = emptyMsg(enOr('這篇沒有重點單字', 'No key words')); return; }
    c.className = 'art-cnt';
    c.innerHTML = a.vocab.map(function (v) {
      var spk = hasTts(v.r || v.w) ? '<button class="art-v-spk" onclick="Articles.say(\'' + esc(v.r || v.w) + '\')">🔊</button>' : '<span style="width:38px;flex-shrink:0"></span>';
      return '<div class="art-v">' + spk + '<div style="min-width:0"><div class="art-v-w">' + esc(v.w) + '</div><div class="art-v-r">' + esc(v.r) + '</div></div><div class="art-v-m">' + esc(v.m) + '</div></div>';
    }).join('');
  }

  function renderGrammar(a, c) {
    if (!a.grammar || !a.grammar.length) { c.innerHTML = emptyMsg(enOr('這篇沒有文法重點', 'No grammar')); return; }
    c.className = 'art-cnt';
    c.innerHTML = a.grammar.map(function (gm) {
      var deep = (gm.id && window.GRAMMAR_DETAIL && window.GRAMMAR_DETAIL[gm.id]) ?
        '<button class="art-gd-btn" onclick="Articles.gd(this,\'' + gm.id + '\')">📖 ' + enOr('看完整詳解', 'Full explanation') + ' ▾</button><div class="art-gd-body art-hidden"></div>' : '';
      return '<div class="art-g"><div class="art-g-t"><b>' + esc(gm.t) + '</b></div><div class="art-g-n">' + esc(gm.note) + '</div>' + deep + '</div>';
    }).join('');
  }

  // 測驗 tab:單字快測(看詞→選中文意思),干擾項來自本篇其他單字,不足補其他文章
  var quiz = { list: [], idx: 0, score: 0 };
  function renderQuiz(a, c) {
    var vocab = (a.vocab || []).filter(function (v) { return v.w && v.m; });
    if (vocab.length < 4) { c.innerHTML = emptyMsg(enOr('這篇單字太少,無法出測驗', 'Not enough words to quiz')); return; }
    quiz.list = shuffle(vocab.slice()).slice(0, Math.min(8, vocab.length)); quiz.idx = 0; quiz.score = 0;
    renderQuizItem(c, a);
  }
  function pool() { var o = []; list().forEach(function (a) { (a.vocab || []).forEach(function (v) { if (v.m) o.push(v); }); }); return o; }
  function renderQuizItem(c, a) {
    c.className = 'art-cnt';
    if (quiz.idx >= quiz.list.length) {
      c.innerHTML = '<div class="aq" style="text-align:center;padding:30px 0">' +
        '<div style="font-size:52px">' + (quiz.score >= quiz.list.length - 1 ? '🎉' : quiz.score >= quiz.list.length / 2 ? '👍' : '💪') + '</div>' +
        '<div style="font-size:24px;font-weight:800;margin:10px 0">' + quiz.score + ' / ' + quiz.list.length + '</div>' +
        '<button class="art-gd-btn" style="margin:14px auto 0;display:inline-block" onclick="Articles.tab(\'quiz\')">' + enOr('再測一次', 'Again') + '</button></div>';
      return;
    }
    var v = quiz.list[quiz.idx];
    var others = shuffle(pool().filter(function (x) { return x.m !== v.m; }));
    var seen = {}, distinct = []; for (var i = 0; i < others.length && distinct.length < 3; i++) { if (!seen[others[i].m]) { seen[others[i].m] = 1; distinct.push(others[i].m); } }
    var opts = shuffle([v.m].concat(distinct));
    c.innerHTML = '<div class="aq"><div class="aq-prog">' + (quiz.idx + 1) + ' / ' + quiz.list.length + '　·　' + enOr('答對 ', 'Score ') + quiz.score + '</div>' +
      '<div class="aq-q" style="text-align:center">' + enOr('這個字是什麼意思?', 'What does this mean?') + '</div>' +
      '<div class="aq-w" onclick="Articles.say(\'' + esc(v.r || v.w) + '\')">' + esc(v.w) + '</div>' +
      '<div class="aq-r">' + esc(v.r) + (hasTts(v.r || v.w) ? ' 🔊' : '') + '</div>' +
      '<div class="aq-opts">' + opts.map(function (o) { return '<button class="aq-opt" onclick="Articles.answer(this,\'' + esc(o).replace(/'/g, "\\'") + '\',\'' + esc(v.m).replace(/'/g, "\\'") + '\')">' + esc(o) + '</button>'; }).join('') + '</div></div>';
  }
  function answer(btn, chosen, correct) {
    var opts = btn.parentElement.querySelectorAll('.aq-opt');
    [].forEach.call(opts, function (o) { o.onclick = null; if (o.textContent === correct) o.classList.add('ok'); });
    if (chosen === correct) quiz.score++; else btn.classList.add('ng');
    setTimeout(function () { quiz.idx++; renderQuizItem(document.getElementById('artContent'), curArticle()); }, 750);
  }

  function emptyMsg(t) { return '<div style="text-align:center;color:var(--tx3,#aaa);padding:40px 0;font-size:14px">' + t + '</div>'; }
  function shuffle(arr) { for (var i = arr.length - 1; i > 0; i--) { var j = Math.floor((typeof crypto !== 'undefined' && crypto.getRandomValues ? crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296 : Math.random()) * (i + 1)); var t = arr[i]; arr[i] = arr[j]; arr[j] = t; } return arr; }

  // ─────────── 工具列 ───────────
  var zhOn = false;
  function toggleFuri() {
    furiOn = !furiOn;
    var c = document.getElementById('artContent'), btn = document.getElementById('artFuriBtn');
    if (c) c.classList.toggle('art-nofuri', !furiOn);
    if (btn) btn.classList.toggle('on', furiOn);
  }
  function toggleZh() {
    zhOn = !zhOn;
    var btn = document.getElementById('artZhBtn'); if (btn) btn.classList.toggle('on', zhOn);
    [].forEach.call(document.querySelectorAll('#artMask .art-tr'), function (t) { t.style.display = zhOn ? 'block' : 'none'; });
  }
  function cycleFs() {
    fsIdx = (fsIdx + 1) % FS.length;
    [].forEach.call(document.querySelectorAll('#artMask .art-para'), function (p) { p.style.fontSize = FS[fsIdx]; });
    var btn = document.getElementById('artFsBtn'); if (btn) btn.style.fontSize = [13, 15, 17][fsIdx] + 'px';
  }

  // ─────────── 底部連播播放器(自建 Audio 佇列,只播預錄 mp3)───────────
  var pl = { audio: null, idx: -1, playing: false, rate: 1.0, token: 0 };
  var RATES = [0.85, 1.0, 1.25];
  function setPText() { var e = document.getElementById('artPText'); if (e) e.textContent = (pl.idx >= 0 ? (pl.idx + 1) : '—') + ' / ' + (sentSeq.length || '—'); }
  function highlight(i) {
    [].forEach.call(document.querySelectorAll('.art-s.on'), function (s) { s.classList.remove('on'); });
    var el = document.getElementById('artS' + i);
    if (el) { el.classList.add('on'); el.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
  }
  function playFrom(i) {
    if (!sentSeq.length) return;
    stopPlay();
    var myToken = ++pl.token;
    function step(n) {
      if (n >= sentSeq.length) { pl.playing = false; pl.idx = -1; setBtn(); highlight(-1); setPText(); return; }
      pl.idx = n; highlight(n); setPText();
      var au = new Audio(ttsPath(sentSeq[n].text)); au.playbackRate = pl.rate; pl.audio = au;
      au.onended = function () { if (pl.token === myToken) step(n + 1); };
      au.play().catch(function () { if (pl.token === myToken) step(n + 1); });
    }
    pl.playing = true; setBtn(); step(i);
  }
  function togglePlay() {
    if (!sentSeq.length) return;
    if (pl.playing && pl.audio) { pl.audio.pause(); pl.playing = false; setBtn(); return; }
    if (!pl.playing && pl.audio && pl.idx >= 0) { pl.audio.play(); pl.playing = true; setBtn(); return; }
    playFrom(pl.idx >= 0 ? pl.idx : 0);
  }
  function stopPlay() { pl.token++; if (pl.audio) { try { pl.audio.pause(); pl.audio.src = ''; } catch (e) {} pl.audio = null; } pl.playing = false; setBtn(); }
  function setBtn() { var b = document.getElementById('artPlayBtn'); if (b) b.textContent = pl.playing ? '⏸' : '▶'; }
  function cycleRate() {
    var i = (RATES.indexOf(pl.rate) + 1) % RATES.length; pl.rate = RATES[i];
    var b = document.getElementById('artRate'); if (b) b.textContent = pl.rate.toFixed(2).replace(/0$/, '') + '×';
    if (pl.audio) pl.audio.playbackRate = pl.rate;
  }
  // 單字/測驗單點發音(用預錄)
  function say(t) { if (hasTts(t) && typeof speak === 'function') speak(t); }

  function gd(btn, id) {
    var body = btn.nextElementSibling; var hidden = body.classList.toggle('art-hidden');
    if (!hidden && !body.innerHTML && window.GRAMMAR_DETAIL && window.GRAMMAR_DETAIL[id]) {
      var inner = (typeof grammarDetailHTML === 'function') ? grammarDetailHTML(window.GRAMMAR_DETAIL[id]) : window.GRAMMAR_DETAIL[id];
      body.innerHTML = '<div class="gd-body" style="display:block;margin-top:10px">' + inner + '</div>';
    }
    btn.textContent = hidden ? '📖 ' + enOr('看完整詳解', 'Full explanation') + ' ▾' : enOr('收合', 'Hide') + ' ▴';
  }
  function done() { if (curId) markRead(curId); }

  return {
    open: open, close: close, read: read, tab: tab,
    toggleFuri: toggleFuri, toggleZh: toggleZh, cycleFs: cycleFs,
    playFrom: playFrom, togglePlay: togglePlay, cycleRate: cycleRate, say: say,
    answer: answer, gd: gd, done: done
  };
})();
