// ux-extras.js — 共用小工具
//   1) window.furiganaHTML(text)：對例句漢字自動上 furigana（ruby）。字典最長匹配，保守策略：
//      單字漢字後接漢字（複合詞多音字風險）就跳過，寧可不上 ruby 也不要標錯讀音。
//      字典來源：各級 VOCAB 的「整詞→讀音」(較可靠) 優先，再用 GRAMMAR_KANJI_READINGS 補漏。
//   2) window.showToast(msg)：非阻斷式輕提示（取代會打斷流程的 alert）。
(function () {
  'use strict';

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  var _dict = null;
  function buildDict() {
    var d = Object.create(null);
    // 整詞讀音（每個 vocab 詞的 w→r，最可靠）先放，避免被文法字典的單字誤蓋
    ['VOCAB_N5', 'VOCAB_N4', 'VOCAB_N3', 'VOCAB_N2', 'VOCAB_N1'].forEach(function (k) {
      var arr = window[k];
      if (!Array.isArray(arr)) return;
      arr.forEach(function (v) {
        if (v && v.w && v.r && v.w !== v.r && /[一-鿿]/.test(v.w) && !d[v.w]) d[v.w] = v.r;
      });
    });
    var g = window.GRAMMAR_KANJI_READINGS;
    if (g) for (var key in g) { if (!d[key]) d[key] = g[key]; }
    return d;
  }
  function dict() {
    // 延遲建字典：第一次呼叫時 vocab 資料已載入；若當時仍空則下次重建
    if (!_dict || (Object.keys(_dict).length === 0)) _dict = buildDict();
    return _dict;
  }

  function furiganaHTML(text) {
    if (text == null) return '';
    var dc = dict();
    var isKanji = function (c) { return /[一-鿿]/.test(c); };
    var out = '', i = 0;
    while (i < text.length) {
      if (!isKanji(text[i])) { out += escapeHtml(text[i]); i++; continue; }
      var matched = null;
      for (var len = Math.min(8, text.length - i); len >= 1; len--) {
        var sub = text.substring(i, i + len);
        if (dc[sub]) { matched = { sub: sub, reading: dc[sub] }; break; }
      }
      // 單字漢字 + 後接漢字 → 多音字風險高，不上 ruby
      if (matched && matched.sub.length === 1 && i + 1 < text.length && isKanji(text[i + 1])) {
        out += escapeHtml(text[i]); i++; continue;
      }
      if (matched) {
        var tok = matched.sub, rd = matched.reading;
        // 漢字+送假名的 token（如「進めます」讀「すすめます」）只在漢字部分加 ruby，
        // hiragana 尾巴維持純文字，避免 ruby 視覺蓋到假名
        var tailM = tok.match(/[ぁ-ゖ]+$/);
        var tail = tailM ? tailM[0] : '';
        if (tail && rd.slice(-tail.length) === tail) {
          var kj = tok.slice(0, tok.length - tail.length);
          var kjRd = rd.slice(0, rd.length - tail.length);
          out += '<ruby>' + escapeHtml(kj) + '<rt>' + escapeHtml(kjRd) + '</rt></ruby>' + escapeHtml(tail);
        } else {
          out += '<ruby>' + escapeHtml(tok) + '<rt>' + escapeHtml(rd) + '</rt></ruby>';
        }
        i += tok.length;
      } else {
        out += escapeHtml(text[i]); i++;
      }
    }
    return out;
  }

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
      // reflow → 進場
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

  // 保留既有簡單標籤(如例句裡標文法點的 <em>)的版本:只對「標籤外的純文字」上 ruby,
  // 標籤原樣穿過。用於文法卡 / 易混淆詞 / 文法練習等 e.j 含 <em> 的例句。
  function furiganaHTMLRich(html) {
    if (html == null) return '';
    return String(html).split(/(<[^>]+>)/).map(function (seg) {
      return seg.charAt(0) === '<' ? seg : furiganaHTML(seg);
    }).join('');
  }

  window.furiganaHTML = furiganaHTML;
  window.furiganaHTMLRich = furiganaHTMLRich;
  window.showToast = showToast;
})();
