// 文章閱讀 UI — Readle 式沉浸閱讀器:分頁(文章/測驗/單字/文法)、底部連播播放器、字級調整、大按鈕、手機優先。
// 重用 furiganaHTMLRich→自動 furigana + 即點即查;播音只用預錄 mp3(絕不瀏覽器語音)。純前端、零 API 成本。
window.Articles = (function () {
  'use strict';
  var LEVELS = ['n5', 'n4', 'n3', 'n2', 'n1'];
  var LVN = { n5: 'N5', n4: 'N4', n3: 'N3', n2: 'N2', n1: 'N1' };
  // 分級主題色(hero 漸層)
  var LVC = { n5: ['#34d399', '#059669'], n4: ['#22d3ee', '#0891b2'], n3: ['#60a5fa', '#2563eb'], n2: ['#a78bfa', '#7c3aed'], n1: ['#fb7185', '#e11d48'] };
  var furiOn = true, fsIdx = 1, curId = null, curTab = 'read';
  function posOn(){ try{ return localStorage.getItem('art_pos_off')!=='1'; }catch(e){ return true; } }
  function togglePos(){
    try{ localStorage.setItem('art_pos_off', posOn()?'1':'0'); }catch(e){}
    var mk=document.querySelector('.art-mask'); if(mk) mk.classList.toggle('pos-off', !posOn());
    var b=Array.from(document.querySelectorAll('.art-tbtn')).find(x=>x.textContent.indexOf('詞性')>=0||x.textContent.indexOf('POS')>=0);
    if(b) b.classList.toggle('on', posOn());
  }
  var FS = ['18px', '20px', '23px'];   // 字級三段
  function list() { return window.ARTICLES || []; }
  // 三語:en→英文;zh-CN→OpenCC 轉簡(cvt);zh-TW→原樣繁體
  function enOr(zh, en) { try { var l = (typeof I18n !== 'undefined' && I18n.getLang) ? I18n.getLang() : (localStorage.getItem('ui_lang') || 'zh-TW'); if (l === 'en') return en; return (typeof cvt === 'function') ? cvt(zh) : zh; } catch (e) { return zh; } }
  function zc(s) { try { return (typeof cvt === 'function') ? cvt(s) : s; } catch (e) { return s; } }   // 中文內容(中譯/意思):簡中轉簡,其餘原樣
  function isEn() { try { return ((typeof I18n !== 'undefined' && I18n.getLang) ? I18n.getLang() : localStorage.getItem('ui_lang')) === 'en'; } catch (e) { return false; } }
  function Lc(zh, en) { return isEn() ? (en || zh) : zc(zh); }   // 內容三語:en→英文;繁→原樣;簡→cvt
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function readSet() { try { return JSON.parse(localStorage.getItem('article_read')) || {}; } catch (e) { return {}; } }
  function markRead(id) { var s = readSet(); s[id] = Date.now(); localStorage.setItem('article_read', JSON.stringify(s)); if (typeof saveAllCloud === 'function') try { saveAllCloud(); } catch (e) {} }
  function fr(text) { return window.furiganaHTMLRich ? window.furiganaHTMLRich(text) : esc(text); }
  // ── 逐詞渲染(離線 kuromoji 斷詞)：任何內容詞都可點查，furigana 更準 ──
  function isKj(ch) { return /[一-鿿々]/.test(ch); }
  // 把「表層+讀音」對齊成 ruby：只在漢字段上假名，前後假名維持原樣；對不上就整詞上 ruby
  function rubyToken(surf, rd) {
    if (!rd || !/[一-鿿々]/.test(surf)) return esc(surf);
    var segs = surf.match(/[一-鿿々]+|[^一-鿿々]+/g) || [surf];
    var whole = '<ruby>' + esc(surf) + '<rt>' + esc(rd) + '</rt></ruby>';
    var out = '', ri = 0;
    for (var i = 0; i < segs.length; i++) {
      var seg = segs[i];
      if (!isKj(seg[0])) {                         // 假名段：需與讀音對應位置吻合
        if (rd.substr(ri, seg.length) === seg) { out += esc(seg); ri += seg.length; }
        else return whole;
      } else {
        var nx = segs[i + 1];
        if (nx && !isKj(nx[0])) {                   // 漢字段：讀到下一個假名段出現處
          var pos = rd.indexOf(nx, ri);
          if (pos < 0) return whole;
          out += '<ruby>' + esc(seg) + '<rt>' + esc(rd.slice(ri, pos)) + '</rt></ruby>'; ri = pos;
        } else {                                    // 結尾漢字段：吃掉剩餘讀音
          out += '<ruby>' + esc(seg) + '<rt>' + esc(rd.slice(ri)) + '</rt></ruby>'; ri = rd.length;
        }
      }
    }
    return out;
  }
  function frTok(s) {
    var clean = s.replace(/\s/g, '');
    var toks = window.ARTICLE_TOKENS && window.ARTICLE_TOKENS[clean];
    if (!toks) return fr(s);                        // 無斷詞資料 → 退回既有引擎
    var look = window.furiLookup || function () { return null; };
    var NUMK = /^[一二三四五六七八九十百千万]+$/;   // 純數字漢字 token
    return toks.map(function (t, ti) {
      var surf = t.s, base = t.b || surf;
      var eSurf = look(surf);
      var isNum = NUMK.test(surf);
      // 數字漢字:單字表的「單獨讀法」(十=とお)會蓋掉語境讀音(十時=じゅう)→ 數字一律用斷詞讀音;
      // 連續數字串(二+十+四)逐字讀必錯(にとおよん)→ 整串不標注,寧可不標也不標錯
      var prevNum = ti > 0 && NUMK.test(toks[ti - 1].s), nextNum = ti + 1 < toks.length && NUMK.test(toks[ti + 1].s);
      var frd = isNum
        ? ((prevNum || nextNum) ? '' : (t.r || ''))
        : ((eSurf && eSurf.r) || t.r || '');        // furigana:VOCAB 人工讀音優先,否則 kuromoji 表層讀音
      var inner = rubyToken(surf, frd);
      if (!t.k) {
        // 非內容詞(助詞/助動詞/語尾)：查機能語字典,有解釋就可點(回饋:初學者最想知道は、を、ます是什麼)
        var gd = window.JP_FUNC || {};
        var g = gd[surf] || (t.b && gd[t.b]);
        if (g) {
          return '<span class="aw jlk" role="button" tabindex="0" data-w="' + esc(surf) + '" data-r="' + esc(g.r || frd)
            + '" data-m="' + esc(Lc(g.m, g.e)) + '" data-c="' + esc(g.c || '') + '">' + inner + '</span>';
        }
        return '<span class="aw">' + inner + '</span>';
      }
      var e = look(base) || eSurf;                  // 釋義：先查原形，再查表層
      if (!e && window.kanaLookup) e = window.kanaLookup(base) || window.kanaLookup(surf);   // 假名詞 fallback
      if (!e && window.dictExtra) e = window.dictExtra(base) || window.dictExtra(surf);      // 文章補充字典(未收錄詞根治)
      var w = base, r = (e && e.r) || t.r || frd || '', m = e ? Lc(e.m, e.m_en) : '', c = (e && e.c) || '';
      var f = t.b ? enOr('活用形', 'conj.') : '';
      var posCls = /動/.test(c) ? ' pos-v' : (/形/.test(c) ? ' pos-a' : (/副/.test(c) ? ' pos-adv' : ''));
      return '<span class="aw jlk' + posCls + '" role="button" tabindex="0" data-w="' + esc(w) + '" data-r="' + esc(r)
        + '" data-m="' + esc(m) + '" data-c="' + esc(c) + '"' + (f ? ' data-f="' + esc(f) + '"' : '') + '>' + inner + '</span>';
    }).join('');
  }
  // N5:用課文原有的空格切詞塊(人工分詞)當高亮單位,塊內沿用既有引擎(furigana+可點),保留可讀空格
  // ── 每字可查:詞塊內若一個可點詞都沒有(N5 假名文最常見),整塊嘗試解析讓初學者點什麼都有答案 ──
  var GODAN_MASU = { 'き': 'く', 'ぎ': 'ぐ', 'し': 'す', 'ち': 'つ', 'に': 'ぬ', 'び': 'ぶ', 'み': 'む', 'り': 'る', 'い': 'う' };
  // て形/た形/たり形 → 辞書形候選（あらって→あらう、でて→でる、さんぽしたり→さんぽ(する)）
  var CONJ_TAIL = [
    ['ったり', ['う', 'つ', 'る']], ['んだり', ['ぬ', 'ぶ', 'む']], ['いたり', ['く']], ['したり', ['す', 'する', '']], ['たり', ['る']],
    ['って', ['う', 'つ', 'る']], ['んで', ['ぬ', 'ぶ', 'む']], ['いて', ['く']], ['いで', ['ぐ']], ['して', ['す', 'する', '']],
    ['った', ['う', 'つ', 'る']], ['んだ', ['ぬ', 'ぶ', 'む']], ['いた', ['く']], ['いだ', ['ぐ']], ['した', ['す', 'する', '']],
    ['て', ['る']], ['た', ['る']]
  ];
  function unitData(u) {
    var gd = window.JP_FUNC || {};
    var kl = window.kanaLookup || function () { return null; };
    var fl = window.furiLookup || function () { return null; };
    function hit(word, extra) {
      if (!word) return null;
      var g = gd[word];
      if (g) return { w: word, r: g.r || '', m: Lc(g.m, g.e), c: g.c || '', f: extra || '' };
      var e = fl(word);                              // 漢字詞(ENTRY)
      if (e && e.m) return { w: word, r: e.r || '', m: zc(e.m), c: e.c || '', f: extra || '' };
      var ke = kl(word);                             // 假名詞/讀音
      if (ke) return { w: ke.w, r: ke.r || word, m: zc(ke.m), c: ke.c || '', f: extra || '' };
      var xe = window.dictExtra && window.dictExtra(word);   // 文章補充字典
      if (xe) return { w: word, r: xe.r || '', m: zc(xe.m), c: xe.c || '', f: extra || '' };
      if ((word[0] === 'お' || word[0] === 'ご') && word.length > 2) {   // 美化語接頭:おひる→ひる
        var p = hit(word.slice(1), extra);
        if (p) { p.f = (p.f ? p.f + ' ' : '') + '＋' + word[0]; return p; }
      }
      // 時間/數量詞（六時、七時半、十一時、三十分…）：字典沒有,規則給意思
      var tm = word.match(/^[0-9０-９〇一二三四五六七八九十百]+(時半|時|分|月|年|円|歳|回|人|日)$/);
      if (tm) {
        var TIME = { '時': '～點(時間)', '時半': '～點半', '分': '～分(鐘)', '月': '～月', '年': '～年', '円': '～日圓', '歳': '～歲', '回': '～次', '人': '～(個)人', '日': '～日(日期/天數)' };
        return { w: word, r: '', m: zc(TIME[tm[1]]), c: enOr('時間・數量', 'time/counter'), f: extra || '' };
      }
      return null;
    }
    function stems(word, extraBase) {
      var d0 = hit(word, extraBase);
      if (d0) return d0;
      // ます形還原：たべます→たべる(一段)、いきます→いく(五段)
      var mm = word.match(/^(.+?)(ます|ました|ません|ましょう)$/);
      if (mm) {
        var stem = mm[1], last = stem.slice(-1);
        var cands = [stem + 'る'];
        if (GODAN_MASU[last]) cands.push(stem.slice(0, -1) + GODAN_MASU[last]);
        var fla = enOr('ます形', 'polite form');
        for (var i = 0; i < cands.length; i++) { var h = hit(cands[i], fla); if (h) return h; }
      }
      // て/た/たり形還原
      for (var t = 0; t < CONJ_TAIL.length; t++) {
        var tail = CONJ_TAIL[t][0];
        if (word.length > tail.length && word.slice(-tail.length) === tail) {
          var st = word.slice(0, -tail.length), reps = CONJ_TAIL[t][1];
          var flb = enOr('活用形', 'conjugated');
          for (var r2 = 0; r2 < reps.length; r2++) {
            var cand = reps[r2] === '' ? st : st + reps[r2];
            var h2 = hit(cand, flb);
            if (h2) return h2;
          }
        }
      }
      // 去 copula 尾:毎日ですが→毎日、うれしいです→うれしい(長尾優先,含が/ね/よ組合)
      var CP = ['でしたが', 'でしょうか', 'ですが', 'でしょう', 'でしたね', 'ですね', 'ですよ', 'でした', 'です'];
      for (var cp = 0; cp < CP.length; cp++) {
        var ct = CP[cp];
        if (word.length > ct.length && word.slice(-ct.length) === ct) {
          var hcp = hit(word.slice(0, -ct.length), '＋' + ct);
          if (hcp) return hcp;
        }
      }
      // 去尾助詞：1 字優先(しごとは→しごと)、避免 2 字的「とは」誤切；最多兩層(へも)
      var P1 = ['は', 'が', 'を', 'に', 'で', 'へ', 'と', 'も', 'の', 'や', 'か', 'ね', 'よ'];
      var P2 = ['から', 'まで', 'では', 'には', 'へは', 'でも', 'にも', 'とは'];
      var l1 = word.slice(-1), l2 = word.slice(-2);
      if (word.length > 1 && P1.indexOf(l1) >= 0) {
        var w1 = word.slice(0, -1);
        var ha = hit(w1, '＋' + l1); if (ha) return ha;
        var l1b = w1.slice(-1);
        if (w1.length > 1 && P1.indexOf(l1b) >= 0) { var hb = hit(w1.slice(0, -1), '＋' + l1b + l1); if (hb) return hb; }
      }
      if (word.length > 2 && P2.indexOf(l2) >= 0) { var hc = hit(word.slice(0, -2), '＋' + l2); if (hc) return hc; }
      return null;
    }
    var core = u.replace(/[、。！？!?，,\s]/g, '');
    if (!core) return null;
    // 先剝敬體/斷定語尾（おいしいです→おいしい、九時からです→九時から）
    var COP = ['ですか', 'でした', 'です', 'だった'];
    for (var c2 = 0; c2 < COP.length; c2++) {
      var cop = COP[c2];
      if (core.length > cop.length && core.slice(-cop.length) === cop) {
        var dc = stems(core.slice(0, -cop.length), '＋' + cop);
        if (dc) return dc;
      }
    }
    return stems(core, '');
  }
  function frUnit(s) {
    var units = s.split(/\s+/).filter(Boolean);
    if (!units.length) return fr(s);
    return units.map(function (u) {
      var h = fr(u);
      if (h.indexOf('jlk') >= 0) return '<span class="aw">' + h + '</span>';
      // 整塊沒有可點詞 → 以標點細分,每個子塊各自解析（「あらって、あさごはんを」→ あらって / あさごはんを）
      var chunks = u.match(/[^、。！？!?，,]+|[、。！？!?，,]+/g) || [u];
      return chunks.map(function (ck) {
        if (/^[、。！？!?，,]+$/.test(ck)) return esc(ck);
        var d = unitData(ck);
        var ch = fr(ck);
        if (d) {
          var pc = /動/.test(d.c||'') ? ' pos-v' : (/形/.test(d.c||'') ? ' pos-a' : (/副/.test(d.c||'') ? ' pos-adv' : ''));
          return '<span class="aw jlk' + pc + '" role="button" tabindex="0" data-w="' + esc(d.w) + '" data-r="' + esc(d.r)
            + '" data-m="' + esc(d.m) + '" data-c="' + esc(d.c) + '"' + (d.f ? ' data-f="' + esc(d.f) + '"' : '') + '>' + ch + '</span>';
        }
        return '<span class="aw">' + ch + '</span>';
      }).join('');
    }).join(' ');
  }
  // 「看過清單」記錄:用來算「有幾篇新文章」(開過清單就清紅標,非侵入式提醒)
  function seenSet() { try { return JSON.parse(localStorage.getItem('article_seen')) || {}; } catch (e) { return {}; } }
  function markSeen() { var s = {}; list().forEach(function (a) { s[a.id] = 1; }); localStorage.setItem('article_seen', JSON.stringify(s)); }
  function ensureEntryCss() {
    if (document.getElementById('artEntryCss')) return;
    var st = document.createElement('style'); st.id = 'artEntryCss';
    st.textContent = [
      '.art-entry{display:flex;align-items:center;gap:13px;background:var(--bg2,#fff);border:1px solid rgba(0,0,0,.05);border-radius:16px;padding:12px;margin:0 0 14px;cursor:pointer;box-shadow:0 1px 2px rgba(30,25,20,.04),0 6px 16px rgba(30,25,20,.05);transition:transform .12s}',
      '.art-entry:active{transform:scale(.99)}',
      '.art-entry-thumb{width:60px;height:60px;border-radius:13px;overflow:hidden;position:relative;flex-shrink:0;background:linear-gradient(135deg,#fb7185,#e11d48);display:flex;align-items:center;justify-content:center}',
      '.art-entry-thumb img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.82) brightness(1.05) contrast(.9) sepia(.12)}',
      '.art-entry-emoji{font-size:26px}',
      '.art-entry-b{flex:1;min-width:0}',
      '.art-entry-t{font-size:16px;font-weight:800;color:var(--tx,#2c2c2c);display:flex;align-items:center;gap:8px}',
      '.art-entry-new{font-size:11px;font-weight:800;color:#fff;background:#ef4444;border-radius:20px;padding:1px 8px;line-height:1.6}',
      '.art-entry-d{font-size:12.5px;color:var(--tx2,#888);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.art-entry-p{font-size:12px;color:var(--ac,#d4654a);font-weight:700;margin-top:3px}',
      '.art-entry-go{color:var(--tx3,#bbb);font-size:24px;flex-shrink:0;padding-right:2px}'
    ].join('');
    document.head.appendChild(st);
  }
  // 首頁的文章入口卡(明顯、手機友善);顯示已讀進度 + 新文章紅標
  function entryCardHtml() {
    var arts = list(); if (!arts.length) return '';
    ensureEntryCss();
    var read = readSet(), seen = seenSet();
    var readN = arts.filter(function (a) { return read[a.id]; }).length;
    var newN = arts.filter(function (a) { return !seen[a.id]; }).length;
    var badge = newN > 0 ? '<span class="art-entry-new">' + newN + ' ' + enOr('新', 'new') + '</span>' : '';
    return '<div class="art-entry" onclick="Articles.open()">' +
      '<div class="art-entry-thumb"><span class="art-entry-emoji">📖</span><img src="' + imgUrl('a-n4-1') + '" alt="" onerror="this.remove()"></div>' +
      '<div class="art-entry-b"><div class="art-entry-t">' + enOr('文章閱讀', 'Reading') + badge + '</div>' +
      '<div class="art-entry-d">' + enOr('每天一篇 · 點字查詢 · 真人發音', 'Daily reading · tap to look up · audio') + '</div>' +
      '<div class="art-entry-p">' + enOr('已讀', 'Read') + ' ' + readN + ' / ' + arts.length + ' ' + enOr('篇', '') + '</div></div>' +
      '<div class="art-entry-go">›</div></div>';
  }
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
      '.art-top{position:sticky;top:0;background:var(--bg,#faf9f6);display:flex;align-items:center;gap:8px;padding:8px 12px;border-bottom:1px solid var(--bd,#e8e5e0);z-index:5;min-height:54px}',
      '.art-top .tt{font-size:16px;font-weight:800;margin:0 auto 0 2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.art-ic{border:none;background:none;cursor:pointer;font-size:19px;color:var(--tx2,#888);width:42px;height:42px;border-radius:12px;display:inline-flex;align-items:center;justify-content:center}',
      '.art-ic:active{background:var(--bd,#eee)}',
      // 返回鍵:大箭頭+文字,清楚好按
      '.art-back{display:inline-flex;align-items:center;gap:3px;border:none;background:none;cursor:pointer;color:var(--ac,#d4654a);font-size:15px;font-weight:700;padding:8px 12px 8px 6px;min-height:44px;border-radius:12px;font-family:inherit}',
      '.art-back:active{background:rgba(212,101,74,.1)}',
      '.art-back svg{width:22px;height:22px;stroke:currentColor;stroke-width:2.4;fill:none;stroke-linecap:round;stroke-linejoin:round}',
      // list
      '.art-lwrap{padding:14px 16px}',
      '.art-sub{color:var(--tx2,#888);font-size:13.5px;margin:2px 0 6px;line-height:1.6}',
      '.art-trial{background:var(--brand-soft,#f6e3dd);color:var(--ac,#d4654a);font-weight:700;font-size:13px;border-radius:10px;padding:9px 13px;margin:8px 0 4px}',
      '.art-lv{font-size:12px;font-weight:800;color:var(--tx3,#aaa);letter-spacing:.1em;margin:22px 0 10px}',
      '.art-card{display:flex;gap:15px;align-items:center;background:var(--bg2,#fff);border:1px solid rgba(0,0,0,.04);border-radius:18px;padding:14px;margin-bottom:12px;cursor:pointer;transition:transform .12s ease,box-shadow .15s ease;box-shadow:0 1px 2px rgba(30,25,20,.04),0 6px 16px rgba(30,25,20,.05)}',
      '.art-card:active{transform:scale(.985)}',
      '.art-card:hover{transform:translateY(-2px);box-shadow:0 2px 4px rgba(30,25,20,.06),0 12px 26px rgba(30,25,20,.1)}',
      '.art-thumb{width:92px;height:92px;border-radius:16px;flex-shrink:0;position:relative;overflow:hidden;color:#fff;box-shadow:inset 0 0 0 1px rgba(0,0,0,.04)}',
      '.art-th-e{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:40px}',
      // 日系濾鏡:降飽和+微暖+提亮+柔對比,清新不豔;縮圖與 hero 共用
      '.art-th-i{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.82) brightness(1.06) contrast(.9) sepia(.12)}',
      '.art-th-badge{position:absolute;top:5px;left:5px;font-size:10px;font-weight:800;padding:2px 7px;border-radius:20px;color:#fff;background:rgba(0,0,0,.55);backdrop-filter:blur(3px);letter-spacing:.02em}',
      '.art-card-b{min-width:0;flex:1}',
      '.art-card-t{font-size:17px;font-weight:700;color:var(--tx,#2c2c2c);font-family:"Hiragino Mincho ProN","Noto Serif JP",serif;line-height:1.35;display:flex;align-items:center;gap:6px}',
      '.art-done{color:#16a34a;font-size:15px;flex-shrink:0}',
      '.art-card-z{font-size:13px;color:var(--tx2,#888);margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.art-lwrap{padding:16px 16px 4px}',
      '.art-lv{font-size:12px;font-weight:800;color:var(--tx3,#aaa);letter-spacing:.12em;margin:22px 2px 12px}',
      // hero
      '.art-hero{padding:22px 18px 18px;color:#fff;position:relative;overflow:hidden;min-height:150px;display:flex;flex-direction:column;justify-content:flex-end}',
      '.art-hero-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.82) brightness(1.04) contrast(.9) sepia(.12)}',
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
      '.art-para .jlk{cursor:pointer;color:#e8734a;border-bottom:1px dashed rgba(232,115,74,.35)}',
      '.art-para .jlk rt{color:var(--tx2,#8a8a8a)}',
      // 每句一個區塊(句子+羅馬拼音+中譯一組),句首有明確的 ▶ 播放鈕——
      // 使用者回饋:單字都可點查字典,想「播這一句」反而沒地方點
      '.art-s{display:block;position:relative;border-radius:10px;padding:3px 6px 3px 38px;margin:0 0 14px;min-height:30px;line-height:2.05;letter-spacing:.012em}',
      '.art-para{margin-bottom:20px}',
      '.art-sub{line-height:1.75}',
      '.art-sp{position:absolute;left:0;top:.45em;width:26px;height:26px;border-radius:50%;border:1.5px solid rgba(232,115,74,.45);background:none;color:#e8734a;font-size:11px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;padding:0 0 0 2px}',
      '.art-sp:hover{background:rgba(232,115,74,.12)}',
      '.art-s.on .art-sp,.art-s.flat .art-sp{background:#e8734a;border-color:#e8734a;color:#fff}',
      // 詞性淡底(可關):動詞=暖橘、形容詞=淡綠、副詞=淡紫;名詞不上色,保持乾淨
      '.art-mask .pos-v{background:rgba(232,115,74,.16);border-radius:4px}',
      '.art-mask .pos-a{background:rgba(64,160,90,.17);border-radius:4px}',
      '.art-mask .pos-adv{background:rgba(140,110,220,.18);border-radius:4px}',
      // 深色模式:底色加亮一階+底線提示,字色不動(維持主題亮字,對比不打折)
      '[data-theme="dark"] .art-mask .pos-v{background:rgba(232,115,74,.26);box-shadow:inset 0 -2px 0 rgba(232,115,74,.55)}',
      '[data-theme="dark"] .art-mask .pos-a{background:rgba(74,222,128,.20);box-shadow:inset 0 -2px 0 rgba(74,222,128,.5)}',
      '[data-theme="dark"] .art-mask .pos-adv{background:rgba(167,139,250,.22);box-shadow:inset 0 -2px 0 rgba(167,139,250,.5)}',
      '.art-mask.pos-off .pos-v,.art-mask.pos-off .pos-a,.art-mask.pos-off .pos-adv{background:none}',
      '.art-romaji{display:block;font-size:.72em;color:var(--tx3,#9a9a9a);letter-spacing:.01em;margin:-4px 0 10px 36px;line-height:1.5}',
      '.art-tr-s{margin-left:36px}',
      // 逐詞高亮:依 VOICEVOX 每拍時長,橘框只框「正在唸的那個詞」(對齊實際發音)
      '.aw{border-radius:5px;padding:0 1px;transition:background .1s linear}',
      '.art-s.on .aw.cur{background:rgba(232,115,74,.85);color:#fff;box-shadow:0 0 0 2px rgba(232,115,74,.5)}',
      '.art-s.on .aw.cur rt{color:rgba(255,255,255,.85)}',
      // 無逐詞時間軸的句子(N5/少數對不齊):退回整句淡底
      '.art-s.on.flat{background:rgba(232,115,74,.16)}',
      '.art-nofuri rt{display:none}',
      '.art-tr{font-size:14px;line-height:1.85;color:var(--tx2,#8a8a8a);margin:2px 0 16px;padding-left:12px;border-left:3px solid var(--bd,#e5e5e5)}',
      '.art-tr-s{display:block;font-size:13px;margin:2px 0 12px;padding-left:12px;border-left:3px solid var(--bd,#e5e5e5)}',
      // vocab / grammar lists
      '.art-v{display:flex;align-items:center;gap:10px;padding:13px 8px;border-bottom:1px solid var(--bd,#eee);border-radius:10px}',
      '.art-v:last-child{border-bottom:none}',
      '.art-v-click{cursor:pointer}',
      '.art-v-click:active{background:rgba(232,115,74,.1)}',
      '.art-v-click:hover{background:rgba(232,115,74,.05)}',
      '.art-v-spk{border:none;background:rgba(232,115,74,.14);color:#e8734a;width:38px;height:38px;border-radius:50%;font-size:16px;cursor:pointer;flex-shrink:0;display:inline-flex;align-items:center;justify-content:center}',
      '.art-v-spk:active{transform:scale(.9)}',
      '.art-v-w{font-weight:700;font-family:"Hiragino Mincho ProN","Noto Serif JP",serif;color:var(--tx,#2c2c2c);font-size:17px}',
      '.art-v-r{font-size:12.5px;color:#e8734a;margin-top:1px}',
      '.art-v-m{color:var(--tx2,#777);margin-left:auto;text-align:right;font-size:14px;padding-left:8px}',
      '.art-g{padding:13px 14px;margin-bottom:10px;border-radius:12px;background:rgba(37,99,235,.05);border:1px solid rgba(37,99,235,.16);border-left:4px solid #2563eb}',
      '.art-g-t{font-size:17px;font-family:"Hiragino Mincho ProN","Noto Serif JP",serif;font-weight:700}',
      '.art-g-t b{color:#2563eb}',
      '.art-g-n{font-size:14.5px;color:var(--tx,#3a3a3a);line-height:1.85;margin-top:5px}',
      // 文章 tab 底部內嵌文法區
      '.art-inline-v{margin-top:26px;padding-top:16px;border-top:2px solid rgba(232,115,74,.4)}',
      '.art-iv-h{font-size:15px;font-weight:800;color:#e8734a;margin-bottom:2px}',
      '.art-inline-g{margin-top:24px;padding-top:16px;border-top:2px solid rgba(37,99,235,.4)}',
      '.art-ig-h{font-size:15px;font-weight:800;color:#2563eb;margin-bottom:12px}',
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
      '.art-pbar{pointer-events:auto;display:flex;align-items:center;gap:4px;background:#2c2c2e;color:#fff;border:1px solid transparent;border-radius:40px;padding:6px 10px;box-shadow:0 6px 24px rgba(0,0,0,.28);max-width:440px;width:100%}',
      '[data-theme="dark"] .art-pbar{background:#2e2d33;border-color:rgba(255,255,255,.12);box-shadow:0 6px 24px rgba(0,0,0,.55)}',
      // flex-shrink:0 防壓扁(bar 元件多時主播放鈕被壓成橢圓、「單句」被壓成直排)
      '.art-pb{flex-shrink:0;white-space:nowrap;border:none;background:none;color:#fff;cursor:pointer;width:40px;height:40px;border-radius:50%;font-size:17px;display:inline-flex;align-items:center;justify-content:center}',
      '.art-pb.main{width:46px;height:46px;background:#e8734a;font-size:19px}',
      '.art-pb.art-mode{width:auto;min-width:40px;padding:0 9px;font-size:13px;border-radius:20px;opacity:.65}',
      '.art-pb.art-mode.on{opacity:1;background:rgba(255,255,255,.25);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.7)}',
      '.art-ptext{flex-shrink:0}',
      '.art-pb.main{background:var(--ac,#d4654a);width:50px;height:50px;font-size:22px}',
      '.art-pb:active{transform:scale(.92)}',
      '.art-prate{background:rgba(255,255,255,.16);color:#fff;border-radius:20px;padding:0 10px;height:34px;font-size:13px;font-weight:700;min-width:50px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;font-variant-numeric:tabular-nums}',
      // 窄螢幕(手機直立):全元件 flex-shrink:0 會讓總寬爆出去、「單句」被切——整條壓縮一號
      '@media (max-width:430px){' +
        '.art-pbar{gap:2px;padding:6px 8px}' +
        '.art-pb{width:36px;height:36px;font-size:15px}' +
        '.art-pb.main{width:44px;height:44px;font-size:18px}' +
        '.art-prate{min-width:40px;padding:0 6px;height:30px;font-size:12px}' +
        '.art-ptext{font-size:12px}' +
        '.art-pb.art-mode{min-width:32px;padding:0 7px;font-size:12px}' +
      '}',
      '.art-rstep{width:38px;height:38px;font-size:22px;font-weight:700;flex-shrink:0}',
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
          '<div class="art-thumb" style="background:linear-gradient(135deg,' + g[0] + ',' + g[1] + ')"><span class="art-th-e">' + topicEmoji(a.topic + a.title) + '</span><img class="art-th-i" src="' + imgUrl(a.id) + '" alt="" loading="lazy" onerror="this.remove()"><span class="art-th-badge">' + LVN[a.level] + '</span></div>' +
          '<div class="art-card-b">' +
          '<div class="art-card-t">' + esc(a.title) + (read[a.id] ? '<span class="art-done">✓</span>' : '') + '</div>' +
          '<div class="art-card-z">' + esc(Lc(a.title_zh,a.title_en)) + ' · ' + esc(Lc(a.topic,a.topic_en)) + '</div>' +
          '</div></div>';
      });
    });
    h += '</div></div></div>';
    var d = document.createElement('div'); d.innerHTML = h; document.body.appendChild(d.firstChild);
    markSeen();   // 開過清單 → 清掉首頁「N 新」紅標
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
    if (window.furiAddEntries) window.furiAddEntries(a.vocab);   // 讓本篇重點單字(含漢字者)在內文也可點查
    close();        // 先移除清單那層 overlay,避免兩層 artMask 疊著(內文被蓋成空白)
    curId = id; curTab = 'read';
    var g = LVC[a.level] || LVC.n5;
    var h = '<div class="art-mask" id="artMask"><div class="art-wrap">' +
      '<div class="art-top"><button class="art-back" onclick="Articles.open()"><svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>返回</button>' +
      '<span class="tt">' + esc(Lc(a.title_zh,a.title_en)) + '</span>' +
      '<button class="art-ic" onclick="Articles.close()">✕</button></div>' +
      '<div class="art-hero" style="background:linear-gradient(135deg,' + g[0] + ',' + g[1] + ')">' +
      '<img class="art-hero-bg" src="' + imgUrl(a.id) + '" alt="" onerror="this.remove()">' +
      '<div class="art-hero-ov"></div>' +
      '<div class="art-hero-in">' +
      '<div class="hb">' + LVN[a.level] + '　' + esc(Lc(a.topic,a.topic_en)) + '</div>' +
      '<div class="ht">' + fr(a.title) + '</div>' +
      '<div class="hz">' + esc(Lc(a.title_zh,a.title_en)) + '</div></div></div>' +
      // toolbar
      '<div class="art-tools">' +
      '<button class="art-tbtn on" id="artFuriBtn" onclick="Articles.toggleFuri()">あ ' + enOr('假名', 'Kana') + '</button>' +
      '<button class="art-tbtn" id="artZhBtn" onclick="Articles.toggleZh()">译 ' + enOr('中譯', 'CN') + '</button>' +
      '<button class="art-tbtn' + (romaOn ? ' on' : '') + '" id="artRomaBtn" onclick="Articles.toggleRomaji()">Aa ' + enOr('羅馬拼音', 'Romaji') + '</button>' +
      '<button class="art-tbtn' + (posOn() ? ' on' : '') + '" onclick="Articles.togglePos()" title="' + enOr('動詞橘・形容詞綠・副詞紫', 'Verb orange · Adj green · Adv purple') + '">🎨 ' + enOr('詞性色', 'POS colors') + '</button>' +
      '<button class="art-tbtn" id="artFsBtn" onclick="Articles.cycleFs()">Aa</button>' +
      '</div>' +
      // tabs
      '<div class="art-tabs">' +
      tabBtn('read', '📖 ' + enOr('文章·單字·文法', 'Text')) +
      tabBtn('quiz', '✍️ ' + enOr('測驗', 'Quiz')) +
      '</div>' +
      '<div class="art-cnt" id="artContent"></div>' +
      '</div>' +
      // bottom player
      '<div class="art-player" id="artPlayer"><div class="art-pbar">' +
      '<button class="art-pb" onclick="Articles.playFrom(0)" title="' + enOr('從頭', 'Restart') + '">⏮</button>' +
      '<button class="art-pb main" id="artPlayBtn" onclick="Articles.togglePlay()">▶</button>' +
      '<span class="art-ptext" id="artPText">— / —</span>' +
      '<button class="art-pb art-rstep" onclick="Articles.stepRate(-1)" title="' + enOr('慢一點', 'Slower') + '" aria-label="' + enOr('慢一點', 'Slower') + '">−</button>' +
      '<span class="art-prate" id="artRate">' + (pl.rate.toFixed(2).replace(/0$/, '')) + '×</span>' +
      '<button class="art-pb art-rstep" onclick="Articles.stepRate(1)" title="' + enOr('快一點', 'Faster') + '" aria-label="' + enOr('快一點', 'Faster') + '">＋</button>' +
      '<button class="art-pb art-mode" id="artRepBtn" onclick="Articles.toggleRepeat()" title="' + enOr('重複播放這一句', 'Repeat sentence') + '">🔁</button>' +
      '<button class="art-pb art-mode" id="artSingleBtn" onclick="Articles.toggleSingle()" title="' + enOr('只播這一句就停', 'Play one sentence') + '">' + enOr('單句', '1 sent.') + '</button>' +
      '</div></div>' +
      '</div>';
    var d = document.createElement('div'); d.innerHTML = h; document.body.appendChild(d.firstChild);
    document.getElementById('artMask').scrollTop = 0;
    renderTab('read');
    try { if (typeof track === 'function') track('article_read', { id: id, level: a.level }); } catch (e) {}
    preloadSent(0); preloadSent(1);   // 開文章先載前兩句,按播放零等待
    var _mk=document.querySelector('.art-mask'); if(_mk) _mk.classList.toggle('pos-off', !posOn());
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
  // 文章閱讀也算進「今日目標」:每篇每天只計一次(重複開同一篇不重複加)
  function logArticleReadActivity(id) {
    try {
      var today = new Date().toISOString().split('T')[0];
      var d; try { d = JSON.parse(localStorage.getItem('article_activity_day')) || {}; } catch (e) { d = {}; }
      if (d.date !== today) d = { date: today, ids: [] };
      if (d.ids.indexOf(id) < 0) {
        d.ids.push(id); localStorage.setItem('article_activity_day', JSON.stringify(d));
        if (typeof Calendar !== 'undefined' && Calendar.logActivity) Calendar.logActivity('vocab');
      }
    } catch (e) {}
  }
  function renderRead(a, c) {
    logArticleReadActivity(a.id);
    var paras = String(a.body).split('\n').filter(function (p) { return p.trim(); });
    var trans = a.trans || [];
    sentSeq = []; var si = 0;
    // N4↑ 用離線斷詞逐詞可點；N5 用課文空格切的詞塊(人工分詞,保留空格)
    var frFn = (a.level === 'n5') ? frUnit : frTok;
    var body = paras.map(function (p, pi) {
      var sents = p.match(/[^。！？]+[。！？]?/g) || [p];
      // 逐句對照:翻譯句數能跟日文句數對上 → 每句日文下面直接放自己的翻譯
      // (回饋:初學者開翻譯後不知道哪句對哪句);對不上就退回原本的整段翻譯
      var trWhole = trans[pi] ? String(Lc(trans[pi], (a.trans_en || [])[pi])) : '';
      var trParts = null;
      if (trWhole && sents.length > 1) {
        var parts = trWhole.match(/[^。．.!！?？]+[。．.!！?？]?/g) || [];
        if (parts.length === sents.length) trParts = parts;
      }
      var inner = sents.map(function (s, sj) {
        var clean = s.replace(/\s/g, '');
        var sp;
        if (hasTts(clean)) {
          var idx = si++; sentSeq.push({ text: clean, i: idx });
          // 句首 ▶:明確的「播這一句」目標(單字都被字典點擊佔用,句子本身難點到)
          sp = '<span class="art-s" id="artS' + idx + '" onclick="Articles.playFrom(' + idx + ')">' +
            '<button class="art-sp" title="' + enOr('播放/暫停這句', 'Play / pause sentence') + '" onclick="event.stopPropagation();Articles.spTap(' + idx + ')">▶</button>' +
            frFn(s) + '</span>';
        } else {
          sp = '<span class="art-s" style="padding-left:6px">' + frFn(s) + '</span>';
        }
        var rj = romajiForSentence(clean);
        var rjS = rj ? '<span class="art-romaji" style="display:' + (romaOn ? 'block' : 'none') + '">' + esc(rj) + '</span>' : '';
        var trS = trParts ? '<span class="art-tr art-tr-s" style="display:' + (zhOn ? 'block' : 'none') + '">' + esc(trParts[sj].trim()) + '</span>' : '';
        return sp + rjS + trS;
      }).join('');
      var trHtml = (!trParts && trWhole) ? '<div class="art-tr" style="display:' + (zhOn ? 'block' : 'none') + '">' + esc(trWhole) + '</div>' : '';
      return '<div class="art-para" style="font-size:' + FS[fsIdx] + '">' + inner + '</div>' + trHtml;
    }).join('');
    // 讀完往下:重點單字(橘) + 本篇文法(藍),同一頁對照,不用切分頁
    if (a.vocab && a.vocab.length) {
      body += '<div class="art-inline-v"><div class="art-iv-h">📕 ' + enOr('重點單字', 'Key words') + '</div>' + vocabCardsHtml(a) + '</div>';
    }
    if (a.grammar && a.grammar.length) {
      body += '<div class="art-inline-g"><div class="art-ig-h">📐 ' + enOr('本篇文法', 'Grammar') + '</div>' + grammarCardsHtml(a) + '</div>';
    }
    c.className = 'art-cnt' + (furiOn ? '' : ' art-nofuri');
    c.innerHTML = body;
    setPText();
  }

  function vocabCardsHtml(a) {
    return (a.vocab || []).map(function (v) {
      var key = v.r || v.w, playable = hasTts(key);
      var spk = playable ? '<span class="art-v-spk">🔊</span>' : '<span style="width:38px;flex-shrink:0"></span>';
      // 整行可點播放(不只喇叭);沒預錄音檔的行不綁 onclick、不上手指游標
      var clk = playable ? ' art-v-click" onclick="Articles.say(\'' + esc(key) + '\')' : '';
      return '<div class="art-v' + clk + '">' + spk + '<div style="min-width:0"><div class="art-v-w">' + esc(v.w) + '</div><div class="art-v-r">' + esc(v.r) + '</div></div><div class="art-v-m">' + esc(Lc(v.m,v.m_en)) + '</div></div>';
    }).join('');
  }
  function renderVocab(a, c) {
    if (!a.vocab || !a.vocab.length) { c.innerHTML = emptyMsg(enOr('這篇沒有重點單字', 'No key words')); return; }
    c.className = 'art-cnt';
    c.innerHTML = vocabCardsHtml(a);
  }

  function grammarCardsHtml(a) {
    return (a.grammar || []).map(function (gm) {
      var deep = (gm.id && window.GRAMMAR_DETAIL && window.GRAMMAR_DETAIL[gm.id]) ?
        '<button class="art-gd-btn" onclick="Articles.gd(this,\'' + gm.id + '\')">📖 ' + enOr('看完整詳解', 'Full explanation') + ' ▾</button><div class="art-gd-body art-hidden"></div>' : '';
      return '<div class="art-g"><div class="art-g-t"><b>' + esc(Lc(gm.t,gm.t_en)) + '</b></div><div class="art-g-n">' + esc(Lc(gm.note,gm.note_en)) + '</div>' + deep + '</div>';
    }).join('');
  }
  function renderGrammar(a, c) {
    if (!a.grammar || !a.grammar.length) { c.innerHTML = emptyMsg(enOr('這篇沒有文法重點', 'No grammar')); return; }
    c.className = 'art-cnt';
    c.innerHTML = grammarCardsHtml(a);
  }

  // 測驗 tab:單字快測(看詞→選中文意思),干擾項來自本篇其他單字,不足補其他文章
  var quiz = { list: [], idx: 0, score: 0, wrongs: [] };
  function renderQuiz(a, c) {
    var vocab = (a.vocab || []).filter(function (v) { return v.w && v.m; });
    if (vocab.length < 4) { c.innerHTML = emptyMsg(enOr('這篇單字太少,無法出測驗', 'Not enough words to quiz')); return; }
    quiz.list = shuffle(vocab.slice()).slice(0, Math.min(8, vocab.length)); quiz.idx = 0; quiz.score = 0; quiz.wrongs = [];
    renderQuizItem(c, a);
  }
  function pool() { var o = []; list().forEach(function (a) { (a.vocab || []).forEach(function (v) { if (v.m) o.push(v); }); }); return o; }
  function vm(x) { return Lc(x.m, x.m_en); }   // 測驗選項的意思(依語言)
  function renderQuizItem(c, a) {
    c.className = 'art-cnt';
    if (quiz.idx >= quiz.list.length) {
      // 結束畫面:附「錯題複習」——列出答錯的字(讀音+意思+🔊),看完知道該補哪裡
      var wrongHtml = '';
      if (quiz.wrongs.length) {
        wrongHtml = '<div style="text-align:left;max-width:420px;margin:18px auto 0;border-top:1px solid var(--bd,#e5e5e5);padding-top:14px">' +
          '<div style="font-weight:800;font-size:14px;margin-bottom:8px">📕 ' + enOr('這幾個字再看一眼', 'Review these') + '</div>' +
          quiz.wrongs.map(function (v) {
            var spk = hasTts(v.r || v.w) ? ' <button style="border:none;background:none;cursor:pointer;font-size:14px" onclick="Articles.say(\'' + esc(v.r || v.w) + '\')">🔊</button>' : '';
            return '<div style="padding:7px 0;border-bottom:1px dashed var(--bd,#eee);font-size:14.5px"><b>' + esc(v.w) + '</b> <span style="color:var(--ac,#d4654a)">' + esc(v.r || '') + '</span>' + spk + '<br><span style="color:var(--tx2,#888);font-size:13px">' + esc(vm(v)) + '</span></div>';
          }).join('') + '</div>';
      }
      c.innerHTML = '<div class="aq" style="text-align:center;padding:30px 0">' +
        '<div style="font-size:52px">' + (quiz.score >= quiz.list.length - 1 ? '🎉' : quiz.score >= quiz.list.length / 2 ? '👍' : '💪') + '</div>' +
        '<div style="font-size:24px;font-weight:800;margin:10px 0">' + quiz.score + ' / ' + quiz.list.length + '</div>' +
        wrongHtml +
        '<button class="art-gd-btn" style="margin:18px auto 0;display:inline-block" onclick="Articles.tab(\'quiz\')">' + enOr('再測一次', 'Again') + '</button></div>';
      return;
    }
    var v = quiz.list[quiz.idx];
    var correct = vm(v);   // 選項用當前語言的意思(en→英文;簡中→簡體)
    var others = shuffle(pool().filter(function (x) { return vm(x) !== correct; }));
    var seen = {}, distinct = []; for (var i = 0; i < others.length && distinct.length < 3; i++) { var m = vm(others[i]); if (!seen[m]) { seen[m] = 1; distinct.push(m); } }
    var opts = shuffle([correct].concat(distinct));
    c.innerHTML = '<div class="aq"><div class="aq-prog">' + (quiz.idx + 1) + ' / ' + quiz.list.length + '　·　' + enOr('答對 ', 'Score ') + quiz.score + '</div>' +
      '<div class="aq-q" style="text-align:center">' + enOr('這個字是什麼意思?', 'What does this mean?') + '</div>' +
      '<div class="aq-w" onclick="Articles.say(\'' + esc(v.r || v.w) + '\')">' + esc(v.w) + '</div>' +
      '<div class="aq-r">' + esc(v.r) + (hasTts(v.r || v.w) ? ' 🔊' : '') + '</div>' +
      '<div class="aq-opts">' + opts.map(function (o) { return '<button class="aq-opt" onclick="Articles.answer(this,\'' + esc(o).replace(/'/g, "\\'") + '\',\'' + esc(correct).replace(/'/g, "\\'") + '\')">' + esc(o) + '</button>'; }).join('') + '</div></div>';
  }
  function answer(btn, chosen, correct) {
    var opts = btn.parentElement.querySelectorAll('.aq-opt');
    [].forEach.call(opts, function (o) { o.onclick = null; if (o.textContent === correct) o.classList.add('ok'); });
    var v = quiz.list[quiz.idx];
    var ok = chosen === correct;
    if (ok) quiz.score++; else { btn.classList.add('ng'); quiz.wrongs.push(v); }
    say(v.r || v.w);   // 對錯都自動唸這個字:字+聲再加深一次(回饋:早上只加到單字測驗,文章測驗漏了)
    if (typeof Calendar !== 'undefined' && Calendar.logActivity) Calendar.logActivity('quiz');   // 文章測驗答題算進今日目標
    if (ok) {
      setTimeout(function () { quiz.idx++; renderQuizItem(document.getElementById('artContent'), curArticle()); }, 750);
    } else {
      // 答錯不自動跳:讓使用者看清正解(可再按 🔊 複習),自己按下一題才走
      var aq = btn.closest('.aq');
      if (aq) aq.insertAdjacentHTML('beforeend',
        '<div style="text-align:center;margin-top:14px">' +
        '<button style="border:none;background:none;cursor:pointer;font-size:14px;color:var(--ac,#d4654a);margin-right:14px" onclick="Articles.say(\'' + esc(v.r || v.w) + '\')">🔊 ' + enOr('再聽一次', 'Replay') + '</button>' +
        '<button class="art-gd-btn" style="display:inline-block" onclick="Articles.quizNext()">' + enOr('下一題 →', 'Next →') + '</button></div>');
    }
  }
  function quizNext() { quiz.idx++; renderQuizItem(document.getElementById('artContent'), curArticle()); }

  function emptyMsg(t) { return '<div style="text-align:center;color:var(--tx3,#aaa);padding:40px 0;font-size:14px">' + t + '</div>'; }
  function shuffle(arr) { for (var i = arr.length - 1; i > 0; i--) { var j = Math.floor((typeof crypto !== 'undefined' && crypto.getRandomValues ? crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296 : Math.random()) * (i + 1)); var t = arr[i]; arr[i] = arr[j]; arr[j] = t; } return arr; }

  // ─────────── 羅馬拼音(Readle 對齊:初學者還不熟假名時的輔助)───────────
  // 假名→黑本式羅馬字。長音直接展開母音(ou/aa),ん 在母音/や行前加 ',促音疊子音。
  var ROMA = { 'きゃ':'kya','きゅ':'kyu','きょ':'kyo','しゃ':'sha','しゅ':'shu','しょ':'sho','ちゃ':'cha','ちゅ':'chu','ちょ':'cho','にゃ':'nya','にゅ':'nyu','にょ':'nyo','ひゃ':'hya','ひゅ':'hyu','ひょ':'hyo','みゃ':'mya','みゅ':'myu','みょ':'myo','りゃ':'rya','りゅ':'ryu','りょ':'ryo','ぎゃ':'gya','ぎゅ':'gyu','ぎょ':'gyo','じゃ':'ja','じゅ':'ju','じょ':'jo','びゃ':'bya','びゅ':'byu','びょ':'byo','ぴゃ':'pya','ぴゅ':'pyu','ぴょ':'pyo','ふぁ':'fa','ふぃ':'fi','ふぇ':'fe','ふぉ':'fo','うぃ':'wi','うぇ':'we','てぃ':'ti','でぃ':'di','ヴ':'vu',
    'あ':'a','い':'i','う':'u','え':'e','お':'o','か':'ka','き':'ki','く':'ku','け':'ke','こ':'ko','さ':'sa','し':'shi','す':'su','せ':'se','そ':'so','た':'ta','ち':'chi','つ':'tsu','て':'te','と':'to','な':'na','に':'ni','ぬ':'nu','ね':'ne','の':'no','は':'ha','ひ':'hi','ふ':'fu','へ':'he','ほ':'ho','ま':'ma','み':'mi','む':'mu','め':'me','も':'mo','や':'ya','ゆ':'yu','よ':'yo','ら':'ra','り':'ri','る':'ru','れ':'re','ろ':'ro','わ':'wa','を':'o','ん':'n','が':'ga','ぎ':'gi','ぐ':'gu','げ':'ge','ご':'go','ざ':'za','じ':'ji','ず':'zu','ぜ':'ze','ぞ':'zo','だ':'da','ぢ':'ji','づ':'zu','で':'de','ど':'do','ば':'ba','び':'bi','ぶ':'bu','べ':'be','ぼ':'bo','ぱ':'pa','ぴ':'pi','ぷ':'pu','ぺ':'pe','ぽ':'po','ぁ':'a','ぃ':'i','ぅ':'u','ぇ':'e','ぉ':'o','ゎ':'wa' };
  function kanaToRomaji(kana) {
    var s = String(kana).replace(/[ァ-ヶ]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0x60); });
    var out = '', i = 0;
    while (i < s.length) {
      var c = s[i];
      if (c === 'っ') {   // 促音:疊下一個子音
        var nx = ROMA[s.slice(i + 1, i + 3)] || ROMA[s[i + 1]] || '';
        out += nx ? (nx[0] === 'c' ? 't' : nx[0]) : '';
        i++; continue;
      }
      if (c === 'ー') {   // 長音記號:重複前一個母音
        var last = out.match(/[aiueo](?=[^aiueo]*$)/); out += last ? last[0] : ''; i++; continue;
      }
      var two = ROMA[s.slice(i, i + 2)];
      if (two) { out += (out.slice(-1) === 'n' && /^[aiueoy]/.test(two) ? "'" : '') + two; i += 2; continue; }
      var one = ROMA[c];
      if (one) { out += (out.slice(-1) === 'n' && /^[aiueoy]/.test(one) ? "'" : '') + one; i++; continue; }
      if (/[、。,!?！?]/.test(c)) out += (c === '、' ? ', ' : c === '。' ? '. ' : c + ' ');
      else out += c;   // 漢字等(理論上不會出現:輸入是讀音)
      i++;
    }
    return out;
  }
  // 句子→羅馬拼音:沿用 frTok 的讀音優先序(vocab 人工讀音 > kuromoji)。
  // 分寫規則(貼近教科書):內容詞・助詞之間空格;助動詞/語尾(ます/た/ない…)接前詞連寫;
  // 助詞變音:は→wa、へ→e、を→o。
  var PARTICLES = { 'は':'wa','へ':'e','を':'o','が':1,'に':1,'で':1,'と':1,'も':1,'や':1,'か':1,'ね':1,'よ':1,'な':1,'の':1,'から':1,'まで':1,'より':1,'だけ':1,'しか':1,'ばかり':1,'ほど':1,'くらい':1,'ぐらい':1,'など':1,'ずつ':1,'こそ':1,'さえ':1,'でも':1,'って':1,'ながら':1,'たり':1,'し':1,'ば':1,'ても':1,'のに':1,'ので':1 };
  function romajiForSentence(clean) {
    var toks = window.ARTICLE_TOKENS && window.ARTICLE_TOKENS[clean];
    if (!toks) return null;
    var look = window.furiLookup || function () { return null; };
    // 先按「詞組」聚合假名,整組一次轉羅馬字 → 促音/長音跨 token 不會斷(あらっ+て=aratte)
    var groups = [];   // {kana, fixed(助詞變音), p(助詞), punct(標點)}
    for (var gi = 0; gi < toks.length; gi++) {
      var t = toks[gi];
      if (/^[、。!?！?,.]+$/.test(t.s)) { groups.push({ punct: t.s }); continue; }
      if (!t.k && PARTICLES[t.s]) {
        groups.push(typeof PARTICLES[t.s] === 'string' ? { fixed: PARTICLES[t.s], p: true } : { kana: (t.r || t.s), p: true });
        continue;
      }
      var e = look(t.s);
      // 數字漢字同 frTok:不用單字表的單獨讀法(十=とお),用斷詞的語境讀音(じゅう)
      var rd = /^[一二三四五六七八九十百千万]+$/.test(t.s) ? (t.r || t.s) : ((e && e.r) || t.r || t.s);
      var prev = groups[groups.length - 1];
      if (!t.k && prev && !prev.p && !prev.punct) { prev.kana += rd; continue; }   // 語尾(ます/た/て…)接前一個內容詞組
      groups.push({ kana: rd });
    }
    var out = '';
    groups.forEach(function (g) {
      var piece = g.fixed || (g.punct ? kanaToRomaji(g.punct).trim() : kanaToRomaji(g.kana || ''));
      if (!piece) return;
      if (g.punct) { out = out.replace(/\s+$/, '') + piece + ' '; return; }
      out += piece + ' ';
    });
    out = out.replace(/\s{2,}/g, ' ').trim();
    if (/[ぁ-ゖァ-ヶ㐀-鿿]/.test(out)) return null;   // 斷詞資料爛的句子:不硬顯示殘缺 romaji
    return out;
  }

  // ─────────── 工具列 ───────────
  var zhOn = false;
  var romaOn = (function () { try { return localStorage.getItem('art_romaji') === '1'; } catch (e) { return false; } })();
  function toggleRomaji() {
    romaOn = !romaOn;
    try { localStorage.setItem('art_romaji', romaOn ? '1' : '0'); } catch (e) {}
    var btn = document.getElementById('artRomaBtn'); if (btn) btn.classList.toggle('on', romaOn);
    [].forEach.call(document.querySelectorAll('#artMask .art-romaji'), function (t) { t.style.display = romaOn ? 'block' : 'none'; });
  }
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
  // 朗讀速度:預設 0.85(使用者回饋 1.0 偏快、跟不上);記住上次選的。
  var _savedRate = parseFloat(typeof localStorage !== 'undefined' && localStorage.getItem('art_rate'));
  var pl = { audio: null, idx: -1, playing: false, rate: (_savedRate > 0 ? _savedRate : 0.85), token: 0, pre: {} };
  // 預載句子 mp3:按播放才 new Audio 會先等下載(使用者回饋「按了好幾秒才播」)。
  // 開文章先載前兩句;播放中滾動預載 n+1/n+2 → 按下即播、句間無縫。
  function preloadSent(n) {
    var it = sentSeq[n]; if (!it) return;
    var k = it.text; if (pl.pre[k]) return;
    try { var a = new Audio(ttsPath(k)); a.preload = 'auto'; pl.pre[k] = a; } catch (e) {}
  }
  var RATES = [0.6, 0.75, 0.85, 1.0, 1.25, 1.5];
  function setPText() { var e = document.getElementById('artPText'); if (e) e.textContent = (pl.idx >= 0 ? (pl.idx + 1) : '—') + ' / ' + (sentSeq.length || '—'); }
  function highlight(i) {
    [].forEach.call(document.querySelectorAll('.art-s.on'), function (s) { s.classList.remove('on', 'flat'); });
    [].forEach.call(document.querySelectorAll('.aw.cur'), function (w) { w.classList.remove('cur'); });
    var el = document.getElementById('artS' + i);
    if (el) { el.classList.add('on'); el.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
  }
  function playFrom(i) {
    if (!sentSeq.length) return;
    stopPlay();
    var myToken = ++pl.token;
    function step(n) {
      if (n >= sentSeq.length) { pl.playing = false; pl.idx = -1; setBtn(); highlight(-1); setPText(); return; }
      pl.idx = n; highlight(n); setPText(); setBtn();
      var _key = sentSeq[n].text;
      var au = pl.pre[_key] || new Audio(ttsPath(_key));
      delete pl.pre[_key];
      try { au.currentTime = 0; } catch (e) {}
      au.playbackRate = pl.rate; pl.audio = au;
      preloadSent(n + 1); preloadSent(n + 2);
      // 逐詞高亮:依 VOICEVOX 時間軸,把 .cur 框移到目前唸到的詞(對齊實際發音);無時間軸則整句淡底即可
      var el = document.getElementById('artS' + n);
      var tm = window.ARTICLE_TIMINGS && window.ARTICLE_TIMINGS[sentSeq[n].text];
      var aws = el ? el.querySelectorAll('.aw') : [];
      var useWord = tm && aws.length === tm.length;
      if (!useWord && el) el.classList.add('flat');   // 無逐詞時間軸 → 整句淡底(有指示、不會誤導)
      var wi = 0, lastWi = -1;
      au.ontimeupdate = function () {
        if (pl.token !== myToken || !useWord) return;
        var ct = au.currentTime;
        while (wi < tm.length - 1 && ct >= tm[wi]) wi++;
        if (wi !== lastWi) {
          [].forEach.call(el.querySelectorAll('.aw.cur'), function (w) { w.classList.remove('cur'); });
          if (aws[wi]) aws[wi].classList.add('cur');
          lastWi = wi;
        }
      };
      au.onended = function () {
        if (pl.token !== myToken) return;
        if (aws[lastWi]) aws[lastWi].classList.remove('cur');
        // 播放模式(測試者回饋:像 Readle 的單句/重複):🔁=同句循環;單句=播完當句就停(再按▶重播當句)
        if (pl.repeat) { step(n); return; }
        if (pl.single) { pl.playing = false; pl.audio = null; setBtn(); return; }
        step(n + 1);
      };
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
  function setBtn() {
    var b = document.getElementById('artPlayBtn'); if (b) b.textContent = pl.playing ? '⏸' : '▶';
    // 單句 icon 跟主播放鈕同步:正在播的那句顯示 ⏸,其他都是 ▶(使用者回饋:只有下排會切換)
    var sps = document.querySelectorAll('.art-sp');
    for (var i = 0; i < sps.length; i++) sps[i].textContent = (pl.playing && i === pl.idx) ? '⏸' : '▶';
  }
  // 點句子旁的播放鈕:同句=暫停/續播;異句=從那句開始播
  function spTap(i) {
    if (pl.idx === i && pl.audio) { togglePlay(); return; }
    playFrom(i);
  }
  // 速度 −/＋ 步進(取代原本「點一下循環」,不用點一整圈才回到最慢)。記住選擇。
  function stepRate(dir) {
    var i = RATES.indexOf(pl.rate);
    if (i < 0) { i = 0; for (var k = 1; k < RATES.length; k++) if (Math.abs(RATES[k] - pl.rate) < Math.abs(RATES[i] - pl.rate)) i = k; }
    i = Math.max(0, Math.min(RATES.length - 1, i + dir));
    pl.rate = RATES[i];
    var b = document.getElementById('artRate'); if (b) b.textContent = pl.rate.toFixed(2).replace(/0$/, '') + '×';
    try { localStorage.setItem('art_rate', pl.rate); } catch (e) {}
    if (pl.audio) pl.audio.playbackRate = pl.rate;
  }
  // 播放模式切換:🔁 重複當句 / 單句播完即停(互斥:開一個關另一個)
  function toggleRepeat() {
    pl.repeat = !pl.repeat; if (pl.repeat) pl.single = false;
    setModeBtns();
  }
  function toggleSingle() {
    pl.single = !pl.single; if (pl.single) pl.repeat = false;
    setModeBtns();
  }
  function setModeBtns() {
    var r = document.getElementById('artRepBtn'), s = document.getElementById('artSingleBtn');
    if (r) r.classList.toggle('on', !!pl.repeat);
    if (s) s.classList.toggle('on', !!pl.single);
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
    open: open, close: close, read: read, tab: tab, entryCardHtml: entryCardHtml,
    toggleFuri: toggleFuri, toggleZh: toggleZh, toggleRomaji: toggleRomaji, cycleFs: cycleFs,
    playFrom: playFrom, togglePlay: togglePlay, stepRate: stepRate, say: say, spTap: spTap, togglePos: togglePos,
    toggleRepeat: toggleRepeat, toggleSingle: toggleSingle,
    answer: answer, quizNext: quizNext, gd: gd, done: done
  };
})();
