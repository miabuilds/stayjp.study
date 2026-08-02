// ux-extras.js — 共用小工具
//   1) window.furiganaHTML(text) / furiganaHTMLRich(html)：例句漢字自動 furigana(ruby)。
//      字典最長匹配,保守策略:單漢字後接漢字(多音字風險)就跳過,寧可不上 ruby 也不標錯讀音。
//      字典來源:各級 VOCAB 的整詞→讀音(可靠)優先,再用 GRAMMAR_KANJI_READINGS 補漏。
//   2) 即點即查:例句裡「字典查得到的詞」變成可點,點了跳小彈窗顯示 辭書形+讀音+意思+詞性(+活用形)。
//      動詞會用 Conjugate 正向展開活用形重建漢字面來比對(通っています→通う·て形),消歧義、不亂猜。
//      純本機、零 API:資料全來自已載入的 VOCAB。查不到的(助詞/罕字)不跳窗。
//   3) window.showToast(msg)：非阻斷式輕提示。
(function () {
  'use strict';

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function escAttr(s) { return escapeHtml(s).replace(/'/g, '&#39;'); }
  function isKanji(c) { return /[一-鿿]/.test(c); }

  // ── 字典(延遲建) ──
  //  READ  : word → reading            (furigana 用;含 vocab 整詞 + 文法漢字補漏)
  //  ENTRY : word → { r, m, c }         (可點查詢用;只有 vocab 有意思)
  //  CONJ  : 活用漢字面 → { base, r, m, c, label, reading }  (動詞活用形反查辭書形)
  var _d = null;
  var FORM_LABEL = {
    masu: 'ます形（禮貌）', te: 'て形', ta: 'た形（過去）', nai: 'ない形（否定）',
    potential: '可能形', passive: '受身形（被動）', causative: '使役形', imperative: '命令形', volitional: '意向形',
  };
  function addConj(CONJ, v) {
    if (!window.Conjugate || !window.Conjugate.allForms) return;
    var mm = v.w.match(/[ぁ-ゖ]+$/);            // 送假名(詞尾的平假名)
    var oku = mm ? mm[0] : '';
    var kanjiPart = oku ? v.w.slice(0, v.w.length - oku.length) : v.w;
    if (!kanjiPart || !isKanji(kanjiPart[0])) return;      // 需以漢字開頭才重建得出漢字面
    if (oku && !v.r.endsWith(oku)) return;                 // 讀音尾須與送假名一致(保守,不硬湊)
    var readStem = oku ? v.r.slice(0, v.r.length - oku.length) : v.r;
    var forms;
    try { forms = window.Conjugate.allForms(v.w, v.r); } catch (e) { return; }
    Object.keys(FORM_LABEL).forEach(function (fk) {
      var fr = forms[fk];
      if (!fr || fr === '—' || typeof fr !== 'string') return;
      if (fr.slice(0, readStem.length) !== readStem) return;   // 形須以讀音幹開頭,才能拼回漢字面
      var surface = kanjiPart + fr.slice(readStem.length);
      if (!isKanji(surface[0]) || surface === v.w) return;
      if (!CONJ[surface]) CONJ[surface] = { base: v.w, r: v.r, m: v.m || '', c: v.c || '', label: FORM_LABEL[fk], reading: fr };
    });
  }
  function buildDict() {
    var READ = Object.create(null), ENTRY = Object.create(null), CONJ = Object.create(null);
    ['VOCAB_N5', 'VOCAB_N4', 'VOCAB_N3', 'VOCAB_N2', 'VOCAB_N1'].forEach(function (k) {
      var arr = window[k];
      if (!Array.isArray(arr)) return;
      arr.forEach(function (v) {
        if (!(v && v.w && v.r && v.w !== v.r && isKanji(v.w))) return;
        if (!READ[v.w]) READ[v.w] = v.r;
        if (!ENTRY[v.w]) ENTRY[v.w] = { r: v.r, m: v.m || '', c: v.c || '' };
        if (v.c && /動/.test(v.c)) addConj(CONJ, v);       // 動詞 → 展開活用形供反查
      });
    });
    var g = window.GRAMMAR_KANJI_READINGS;
    if (g) for (var key in g) { if (!READ[key]) READ[key] = g[key]; }
    return { READ: READ, ENTRY: ENTRY, CONJ: CONJ };
  }
  function dict() {
    if (!_d || Object.keys(_d.READ).length === 0) _d = buildDict();
    return _d;
  }

  // 建 ruby(漢字+送假名的 token 只在漢字部分加 ruby,假名尾維持純文字)
  function rubyOf(sub, rd) {
    var tailM = sub.match(/[ぁ-ゖ]+$/);
    var tail = tailM ? tailM[0] : '';
    if (tail && rd.slice(-tail.length) === tail) {
      var kj = sub.slice(0, sub.length - tail.length);
      var kjRd = rd.slice(0, rd.length - tail.length);
      return '<ruby>' + escapeHtml(kj) + '<rt>' + escapeHtml(kjRd) + '</rt></ruby>' + escapeHtml(tail);
    }
    return '<ruby>' + escapeHtml(sub) + '<rt>' + escapeHtml(rd) + '</rt></ruby>';
  }
  function tapSpan(inner, data) {
    return '<span class="jlk" role="button" tabindex="0"'
      + ' data-w="' + escAttr(data.w) + '" data-r="' + escAttr(data.r) + '"'
      + ' data-m="' + escAttr(data.m) + '" data-c="' + escAttr(data.c || '') + '"'
      + ' data-f="' + escAttr(data.f || '') + '">' + inner + '</span>';
  }

  function furiganaHTML(text) {
    if (text == null) return '';
    var dc = dict();
    var out = '', i = 0;
    while (i < text.length) {
      if (!isKanji(text[i])) { out += escapeHtml(text[i]); i++; continue; }
      var matched = null;
      for (var len = Math.min(12, text.length - i); len >= 1; len--) {
        var sub = text.substr(i, len);
        if (dc.READ[sub]) { matched = { sub: sub, reading: dc.READ[sub], entry: dc.ENTRY[sub] || null, conj: null }; break; }
        if (dc.CONJ[sub]) { matched = { sub: sub, reading: dc.CONJ[sub].reading, entry: null, conj: dc.CONJ[sub] }; break; }
      }
      // 單漢字 + 後接漢字 → 多音字風險高,不上 ruby(活用形有送假名尾、長度>1,不受此限)
      if (matched && matched.sub.length === 1 && !matched.conj && i + 1 < text.length && isKanji(text[i + 1])) {
        out += escapeHtml(text[i]); i++; continue;
      }
      if (matched) {
        var inner = rubyOf(matched.sub, matched.reading);
        var data = null;
        if (matched.conj) data = { w: matched.conj.base, r: matched.conj.r, m: matched.conj.m, c: matched.conj.c, f: matched.conj.label };
        else if (matched.entry && matched.entry.m) data = { w: matched.sub, r: matched.entry.r, m: matched.entry.m, c: matched.entry.c, f: '' };
        out += data ? tapSpan(inner, data) : inner;
        i += matched.sub.length;
      } else { out += escapeHtml(text[i]); i++; }
    }
    return out;
  }
  // 保留既有簡單標籤(如例句標文法點的 <em>):只對標籤外文字上 furigana/可點,標籤原樣穿過
  function furiganaHTMLRich(html) {
    if (html == null) return '';
    return String(html).split(/(<[^>]+>)/).map(function (seg) {
      return seg.charAt(0) === '<' ? seg : furiganaHTML(seg);
    }).join('');
  }

  // ===== 即點即查彈窗 =====
  var _pop = null;
  function ensureCss() {
    if (document.getElementById('jlkCss')) return;
    var st = document.createElement('style');
    st.id = 'jlkCss';
    st.textContent = [
      '.jlk{cursor:pointer;border-radius:3px;transition:background .12s}',
      '.jlk:hover,.jlk:focus{background:rgba(214,101,74,.14);outline:none}',
      '#jlkPop{position:fixed;z-index:100000;max-width:min(300px,88vw);background:var(--bg2,#fff);color:var(--tx,#222);border:1px solid var(--bd,#e5e5e5);border-radius:14px;box-shadow:0 12px 38px rgba(0,0,0,.28);padding:14px 16px;font-size:14px;line-height:1.7;-webkit-font-smoothing:antialiased;font-family:-apple-system,"PingFang TC","Noto Sans TC",sans-serif}',
      '#jlkPop .jw{font-size:21px;font-weight:700;font-family:"Hiragino Mincho ProN","Noto Serif JP",serif;color:var(--tx,#1c1c1e)}',
      '#jlkPop .jr{font-size:13px;color:var(--tx2,#8a8a8a);margin-left:7px}',
      '#jlkPop .jtags{margin:7px 0 2px}',
      '#jlkPop .jtag{display:inline-block;font-size:11px;font-weight:700;padding:2px 9px;border-radius:20px;background:rgba(214,101,74,.15);color:var(--ac,#d4654a);margin:0 5px 4px 0}',
      '#jlkPop .jm{color:var(--tx,#222);margin-top:6px}',
      '#jlkPop .jbase{font-size:12px;color:var(--tx2,#8a8a8a);margin-top:8px;padding-top:8px;border-top:1px dashed var(--bd,#e5e5e5)}',
      '#jlkPop .jbase b{color:var(--tx,#222);font-size:15px;font-family:"Hiragino Mincho ProN","Noto Serif JP",serif}',
      '#jlkPop .jx{position:absolute;top:7px;right:11px;cursor:pointer;color:var(--tx3,#b0b0b0);font-size:15px;line-height:1;padding:4px}',
    ].join('');
    document.head.appendChild(st);
  }
  function closePop() { if (_pop) { _pop.remove(); _pop = null; } }
  function showLookup(data, anchor) {
    ensureCss(); closePop();
    var pop = document.createElement('div');
    pop.id = 'jlkPop';
    var tags = '';
    if (data.c) tags += '<span class="jtag">' + escapeHtml(data.c) + '</span>';
    if (data.f) tags += '<span class="jtag">' + escapeHtml(data.f) + '</span>';
    pop.innerHTML = '<span class="jx" role="button" aria-label="關閉">✕</span>'
      + '<div><span class="jw">' + escapeHtml(data.w) + '</span><span class="jr">' + escapeHtml(data.r) + '</span></div>'
      + (tags ? '<div class="jtags">' + tags + '</div>' : '')
      + '<div class="jm">' + escapeHtml(data.m || '（暫無解釋）') + '</div>'
      + (data.f ? '<div class="jbase">辭書形（原形）：<b>' + escapeHtml(data.w) + '</b></div>' : '');
    document.body.appendChild(pop);
    // 定位在被點詞附近,夾在視窗內
    var r = anchor.getBoundingClientRect();
    var pw = pop.offsetWidth, ph = pop.offsetHeight;
    var left = Math.min(Math.max(8, r.left), window.innerWidth - pw - 8);
    var top = r.bottom + 8;
    if (top + ph > window.innerHeight - 8) top = Math.max(8, r.top - ph - 8);
    pop.style.left = left + 'px';
    pop.style.top = top + 'px';
    pop.querySelector('.jx').addEventListener('click', function (e) { e.stopPropagation(); closePop(); });
    _pop = pop;
  }
  // 捕獲階段:點到 .jlk → 查詢並阻止事件(不觸發例句框的播音/卡片收合)
  document.addEventListener('click', function (e) {
    var sp = e.target.closest && e.target.closest('.jlk');
    if (sp) {
      e.stopPropagation();
      showLookup({ w: sp.dataset.w, r: sp.dataset.r, m: sp.dataset.m, c: sp.dataset.c, f: sp.dataset.f }, sp);
    }
  }, true);
  // 冒泡階段:點彈窗以外的地方 → 關閉
  document.addEventListener('click', function (e) {
    if (!_pop) return;
    if (e.target.closest && (e.target.closest('#jlkPop') || e.target.closest('.jlk'))) return;
    closePop();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closePop(); });

  // ===== Toast =====
  var _toastEl = null, _toastTimer = null;
  function showToast(msg) {
    try {
      if (!_toastEl) {
        _toastEl = document.createElement('div');
        _toastEl.id = 'uxToast';
        _toastEl.setAttribute('role', 'status');
        _toastEl.style.cssText = [
          'position:fixed', 'left:50%', 'bottom:88px', 'transform:translateX(-50%) translateY(10px)',
          'background:rgba(30,30,30,.94)', 'color:#fff', 'padding:10px 18px', 'border-radius:22px',
          'font-size:14px', 'font-weight:600', 'z-index:9999', 'pointer-events:none',
          'opacity:0', 'transition:opacity .2s ease, transform .3s cubic-bezier(.34,1.56,.64,1)',
          'max-width:80vw', 'text-align:center', 'box-shadow:0 6px 24px rgba(0,0,0,.28)'
        ].join(';');
        document.body.appendChild(_toastEl);
      }
      _toastEl.textContent = msg;
      void _toastEl.offsetWidth;
      _toastEl.style.opacity = '1';
      _toastEl.style.transform = 'translateX(-50%) translateY(0)';
      if (_toastTimer) clearTimeout(_toastTimer);
      _toastTimer = setTimeout(function () {
        _toastEl.style.opacity = '0';
        _toastEl.style.transform = 'translateX(-50%) translateY(10px)';
      }, 1600);
    } catch (e) { /* no-op */ }
  }

  window.furiganaHTML = furiganaHTML;
  window.furiganaHTMLRich = furiganaHTMLRich;
  window.showToast = showToast;
})();
