// quick-parse.js — 本地即時斷句(2026-09-20 使用者回饋:「不一定每句都要完整拆解,因為都要等一下。
// 有時候只是想知道句子裡的單字意思與文章斷句」)。零 API、零等待:
//   1. 文章句子 → 直接用 article-tokens.js 的離線斷詞結果
//   2. 其他句子(使用者自己貼的)→ 最長匹配:機能語字典(JP_FUNC)+ 單字庫(furiLookup/kanaLookup/dictExtra)
// 產出每個詞的 表層/讀音/意思/詞性,助詞與助動詞標色,讓人一眼看到「斷在哪、助詞在哪」。
// 完整文法解析(為什麼用這個助詞、語氣差別)仍然交給小狸(AI),這裡只做「馬上看得到」的那層。
(function (root) {
  var MAXW = 8;   // 最長匹配的最大詞長
  function clean(s) { return String(s || '').replace(/\s+/g, ''); }
  function isPunct(s) { return /^[、。「」『』（）()？！?!・…,.　]+$/.test(s); }
  function func(w) { try { var F = root.JP_FUNC || {}; return F[w] || null; } catch (e) { return null; } }
  function word(w) {
    try {
      var e = (root.furiLookup && root.furiLookup(w)) || null;
      // ⚠️ kanaLookup 回的是「物件」不是陣列(同音詞可能帶 alts);寫成 k.length 會永遠取不到 →
      //    所有假名寫的詞都查不到意思(2026-09-20 實測:わたし/たべる/ごはん 全 miss)
      if (!e && root.kanaLookup) { var k = root.kanaLookup(w); if (k) e = Array.isArray(k) ? k[0] : k; }
      if (!e && root.dictExtra) e = root.dictExtra(w);
      return e || null;
    } catch (e) { return null; }
  }
  function Lc(zh, en) { try { return (typeof enOr === 'function') ? enOr(zh, en || zh) : zh; } catch (e) { return zh; } }

  // 文章句子:用離線斷詞;其他:最長匹配
  function tokens(sentence) {
    var s = clean(sentence);
    if (!s) return [];
    var T = root.ARTICLE_TOKENS && root.ARTICLE_TOKENS[s];
    if (T && T.length) {
      return T.map(function (t) {
        if (isPunct(t.s)) return { s: t.s, punct: true };
        // 相信斷詞器的判斷:k=1 是內容詞 → 查單字庫;沒有 k 才查機能語字典。
        // ⚠️ 機能語只比對「表層」,不可用原形 b:斷詞器把「おきます」的原形猜成「おく」,
        //    而 JP_FUNC 有「～ておく」→ 會把動詞誤標成助動詞(2026-09-20 實測踩到)。
        if (!t.k) {
          var g = func(t.s);
          if (g) return { s: t.s, r: g.r || t.r || '', m: Lc(g.m, g.e), c: g.c || '', fn: true };
          return { s: t.s, r: t.r || '', m: '', c: '', fn: false, unknown: true };
        }
        var e = word(t.b || t.s) || word(t.s);
        return { s: t.s, r: (e && e.r) || t.r || '', m: e ? Lc(e.m, e.m_en || e.m) : '', c: (e && e.c) || '', fn: false, unknown: !e };
      });
    }
    // 最長匹配(貪婪):先找機能語/單字庫最長的詞,找不到就吃一個字
    var out = [], i = 0;
    while (i < s.length) {
      var ch = s.charAt(i);
      if (isPunct(ch)) { out.push({ s: ch, punct: true }); i++; continue; }
      var hit = null, hl = 0;
      for (var len = Math.min(MAXW, s.length - i); len >= 1; len--) {
        var cand = s.substr(i, len);
        var e = word(cand);
        // 機能語:只認純假名的候選(漢字詞的假名尾巴不該被當助詞)
        // 前一個是查不到的碎片 → 現在多半還在同一個詞中間(友|だ|ち),不要把單假名標成助詞
        var midWord = out.length && out[out.length - 1].unknown && len === 1;
        var g = (!midWord && /^[ぁ-ゖー]+$/.test(cand)) ? func(cand) : null;
        // ⚠️ 1~2 個假名的機能語要贏過同音名詞:「は」會被假名字典查成「歯/葉」、「の」查成別的詞;
        //    跑文裡這種短假名幾乎都是助詞,同音名詞通常寫漢字(2026-09-20 實測踩到)
        if (g && cand.length <= 2) { hit = { s: cand, r: g.r || '', m: Lc(g.m, g.e), c: g.c || '', fn: true }; hl = len; break; }
        if (e) { hit = { s: cand, r: e.r || '', m: Lc(e.m, e.m_en || e.m), c: e.c || '', fn: false }; hl = len; break; }
        if (g) { hit = { s: cand, r: g.r || '', m: Lc(g.m, g.e), c: g.c || '', fn: true }; hl = len; break; }
      }
      if (hit) { out.push(hit); i += hl; } else { out.push({ s: ch, unknown: true }); i++; }
    }
    // 連續查不到的單字合併成一塊,不要一個字一個字碎掉
    var merged = [];
    out.forEach(function (t) {
      var last = merged[merged.length - 1];
      if (t.unknown && last && last.unknown) { last.s += t.s; return; }
      merged.push(t);
    });
    return merged;
  }

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

  // 一行式斷句:詞與詞之間有間隔,助詞標色,點一下看意思
  // 這句的斷句「可信嗎」:查得到意思的字數 / 全部非標點字數。太低代表斷詞在亂猜,不如不顯示。
  function quality(ts) {
    var all = 0, known = 0;
    ts.forEach(function (t) { if (t.punct) return; all += t.s.length; if (t.m) known += t.s.length; });
    return all ? known / all : 0;
  }
  function html(sentence) {
    var ts = tokens(sentence);
    if (!ts.length) return '';
    if (quality(ts) < 0.6) return '';   // 斷不好就不顯示,交給小狸完整拆解
    var chips = ts.map(function (t, i) {
      if (t.punct) return '<span class="qp-p">' + esc(t.s) + '</span>';
      var cls = 'qp-t' + (t.fn ? ' fn' : '') + (t.unknown || !t.m ? ' un' : '');
      var posCls = /動/.test(t.c || '') ? ' pv' : (/形/.test(t.c || '') ? ' pa' : '');
      return '<button type="button" class="' + cls + posCls + '" data-i="' + i + '">'
        + '<span class="qp-s">' + esc(t.s) + '</span>'
        + (t.r && t.r !== t.s ? '<span class="qp-r">' + esc(t.r) + '</span>' : '')
        + '</button>';
    }).join('');
    var rows = ts.filter(function (t) { return !t.punct && t.m; }).map(function (t) {
      return '<div class="qp-row' + (t.fn ? ' fn' : '') + '"><b>' + esc(t.s) + '</b>'
        + (t.r && t.r !== t.s ? '<i>' + esc(t.r) + '</i>' : '')
        + '<span>' + esc(t.m) + '</span>'
        + (t.c ? '<em>' + esc(t.c) + '</em>' : '') + '</div>';
    }).join('');
    var fnN = ts.filter(function (t) { return t.fn; }).length;
    return '<div class="qp">'
      + '<div class="qp-hd">' + Lc('斷句', 'Segments') + '<small>' + Lc('橘色是助詞/語尾 · ' + fnN + ' 個', 'orange = particles/endings · ' + fnN) + '</small></div>'
      + '<div class="qp-line">' + chips + '</div>'
      + (rows ? '<div class="qp-list">' + rows + '</div>' : '')
      + '</div>';
  }

  function ensureCss() {
    if (document.getElementById('qpCss')) return;
    var st = document.createElement('style'); st.id = 'qpCss';
    st.textContent = [
      '.qp{margin:2px 0 6px}',
      '.qp-hd{display:flex;align-items:baseline;gap:8px;font-size:12.5px;font-weight:800;color:var(--tx2,#7A7A7A);margin-bottom:10px}.qp-hd small{font-weight:400;font-size:11px;color:var(--tx3,#ACACAC)}',
      '.qp-line{display:flex;flex-wrap:wrap;gap:6px;align-items:flex-end;margin-bottom:14px}',
      '.qp-t{font:inherit;display:flex;flex-direction:column;align-items:center;gap:1px;background:var(--bg2,#fff);border:1px solid var(--bd,#E8E5E0);border-radius:8px;padding:4px 7px;cursor:pointer;color:var(--tx,#2C2C2C);line-height:1.3}',
      '.qp-t .qp-s{font-size:16px}.qp-t .qp-r{font-size:9.5px;color:var(--tx3,#ACACAC)}',
      '.qp-t.fn{background:var(--soft,rgba(var(--ac-rgb),.1));border-color:rgba(var(--ac-rgb),.35);color:var(--ac,var(--ac))}',
      '.qp-t.pv{border-bottom:2px solid var(--ac)}.qp-t.pa{border-bottom:2px solid #3E9E6B}',
      '.qp-t.un{opacity:.55;cursor:default}',
      '.qp-p{align-self:flex-end;color:var(--tx3,#ACACAC);padding:0 1px;font-size:15px}',
      '.qp-list{display:grid;gap:0;border-top:1px solid var(--bd,#E8E5E0);padding-top:2px}',
      '.qp-row{display:flex;gap:8px;align-items:baseline;font-size:12.5px;line-height:1.6;color:var(--tx,#2C2C2C);padding:7px 0;border-bottom:1px solid var(--bd,#E8E5E0)}.qp-row:last-child{border-bottom:0;padding-bottom:2px}',
      '.qp-row b{min-width:3.2em;font-size:13.5px}.qp-row i{font-style:normal;color:var(--tx3,#ACACAC);font-size:11px;min-width:3em}',
      '.qp-row span{flex:1}.qp-row em{font-style:normal;font-size:10.5px;color:var(--tx3,#ACACAC);white-space:nowrap}',
      '.qp-row.fn b{color:var(--ac,var(--ac))}',
    ].join('');
    document.head.appendChild(st);
  }
  root.QuickParse = { tokens: tokens, quality: quality, html: function (s) { ensureCss(); return html(s); }, ensureCss: ensureCss };
})(window);
