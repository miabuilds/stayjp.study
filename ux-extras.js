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
  // 高頻多音字:單獨出現(非整詞匹配)時,讀音太看語境,標了常錯(中=なか/ちゅう、下=した/お/か…)。
  // 這些字「只在被整詞匹配到時才標」,單漢字裸出現一律不標。人工精選 vocab 稽核揪出的高頻錯源。
  var AMBIG_KANJI = {}; '中上下方何時月日人分実悪話足語少年数散関他代通書得生気間目手口心力名前後外内多大小高長重軽近遠明暗開閉入出立行来見聞言思知作使者楽物味試都今逆食干引決降'.split('').forEach(function(c){ AMBIG_KANJI[c]=1; });
  function buildDict() {
    var READ = Object.create(null), ENTRY = Object.create(null), CONJ = Object.create(null);
    var STEM1 = Object.create(null);   // 活用詞(動/形)的「單漢字語干」→ 裸出現不標(分かる的分、悪い的悪、実る的実…)
    ['VOCAB_N5', 'VOCAB_N4', 'VOCAB_N3', 'VOCAB_N2', 'VOCAB_N1'].forEach(function (k) {
      var arr = window[k];
      if (!Array.isArray(arr)) return;
      arr.forEach(function (v) {
        if (!(v && v.w && v.r && v.w !== v.r && isKanji(v.w))) return;
        if (!READ[v.w]) READ[v.w] = v.r;
        if (!ENTRY[v.w]) ENTRY[v.w] = { r: v.r, m: v.m || '', c: v.c || '' };
        if (v.c && /[動形]/.test(v.c)) {   // 動詞/形容詞:記語干、展開活用
          var mm = v.w.match(/[ぁ-ゖ]+$/); var okr = mm ? mm[0] : '';
          var kp = okr ? v.w.slice(0, v.w.length - okr.length) : v.w;
          if (kp.length === 1 && isKanji(kp)) STEM1[kp] = 1;
          if (/動/.test(v.c)) addConj(CONJ, v);
        }
      });
    });
    var g = window.GRAMMAR_KANJI_READINGS;
    if (g) for (var key in g) { if (!READ[key]) READ[key] = g[key]; }
    // 少數「詞級」讀音,在例句幾乎必為此讀,讓它蓋過 vocab 的單字多音(最中=さいちゅう 非さなか;〜得る=うる 非える)。
    var OVERRIDE = { '最中': 'さいちゅう', '得る': 'うる', '休み中': 'やすみちゅう',
      // 楽しむ(動詞)不在單字庫,而 N4 有單字「楽=らく」搶走單漢字 → 楽しみます被標成らく(2026-08-28 用戶報錯)。
      // 詞級蓋過去:活用開頭全列(楽しく/楽しかった 由 楽しく/楽しか 前綴吃到)。
      '楽しみ': 'たのしみ', '楽しん': 'たのしん', '楽しむ': 'たのしむ', '楽しめ': 'たのしめ', '楽しく': 'たのしく', '楽しか': 'たのしか' };
    for (var ok in OVERRIDE) READ[ok] = OVERRIDE[ok];

    // 首字索引:漢字 → 以它開頭且長度>1 的詞條清單(依長度由長到短)。
    // 用途見 furiganaHTML 的「詞被截斷」判斷。
    var BYFIRST = {};
    function idx(map) {
      for (var w in map) {
        if (w.length < 2) continue;
        var c = w[0];
        if (!isKanji(c)) continue;
        (BYFIRST[c] || (BYFIRST[c] = [])).push(w);
      }
    }
    idx(READ); idx(CONJ);
    for (var bc in BYFIRST) BYFIRST[bc].sort(function (a, b) { return b.length - a.length; });

    for (var ak in AMBIG_KANJI) STEM1[ak] = 1;   // 多音字也併進「裸出現不標」集
    return { READ: READ, ENTRY: ENTRY, CONJ: CONJ, BYFIRST: BYFIRST, NOBARE: STEM1 };
  }
  function dict() {
    // 字典快取要跟著單字檔載入進度失效:文法列表常在 vocab-n3~n1 載完前就先渲染,
    // 早建的字典缺整詞(如 楽しむ),單漢字就被標成錯讀(楽しみます→らく;2026-08-28 用戶報錯實錘)。
    // 單字總量變了 → 下次呼叫時重建(惰性,最多重建幾次,成本可接受)。
    var n = 0;
    ['VOCAB_N5','VOCAB_N4','VOCAB_N3','VOCAB_N2','VOCAB_N1'].forEach(function (k) { var v = window[k]; if (v && v.length) n += v.length; });
    if (!_d || _d._srcCount !== n || Object.keys(_d.READ).length === 0) { _d = buildDict(); _d._srcCount = n; }
    return _d;
  }
  // 動態併入額外詞條(如文章的重點單字),讓它們在內文也能 ruby+即點即查。
  // 只對「含漢字的詞」有效(假名詞沒漢字,不會被 furigana 掃到)。
  function addEntries(list) {
    try {
      var d = dict();
      (list || []).forEach(function (e) {
        if (!e || !e.w) return;
        var r = e.r || e.w;
        if (!d.READ[e.w]) d.READ[e.w] = r;
        if (!d.ENTRY[e.w] || !d.ENTRY[e.w].m) d.ENTRY[e.w] = { r: r, m: e.m || '', c: e.c || '' };
      });
    } catch (err) { /* no-op */ }
  }

  // 建 ruby(漢字+送假名的 token 只在漢字部分加 ruby,假名尾維持純文字)
  function rubyOf(sub, rd) {
    var tailM = sub.match(/[ぁ-ゖ]+$/);
    var tail = tailM ? tailM[0] : '';
    if (tail) {
      if (rd.slice(-tail.length) === tail) {
        var kj = sub.slice(0, sub.length - tail.length);
        var kjRd = rd.slice(0, rd.length - tail.length);
        if (!kjRd) return escapeHtml(sub);   // 漢字段讀音為空(壞資料)→ 純文字,不渲染空 ruby
        return '<ruby>' + escapeHtml(kj) + '<rt>' + escapeHtml(kjRd) + '</rt></ruby>' + escapeHtml(tail);
      }
      return escapeHtml(sub);   // 讀音尾對不上送假名(字典 entry 壞)→ 純文字,不上多餘 ruby
    }
    if (!rd) return escapeHtml(sub);   // 讀音空 → 不渲染空 ruby
    return '<ruby>' + escapeHtml(sub) + '<rt>' + escapeHtml(rd) + '</rt></ruby>';
  }
  function tapSpan(inner, data) {
    var c = data.c || '';
    var pos = /動/.test(c) ? ' pos-v' : (/形/.test(c) ? ' pos-a' : (/副/.test(c) ? ' pos-adv' : ''));
    return '<span class="jlk' + pos + '" role="button" tabindex="0"'
      + ' data-w="' + escAttr(data.w) + '" data-r="' + escAttr(data.r) + '"'
      + ' data-m="' + escAttr(data.m) + '" data-c="' + escAttr(data.c || '') + '"'
      + ' data-f="' + escAttr(data.f || '') + '">' + inner + '</span>';
  }

  // 數字 + 計數漢字 → 計數讀音(規則且高頻;避開不規則的 日/分/人)。前一字為阿拉伯或全形數字時套用。
  var COUNTER_READ = { '月': 'がつ', '年': 'ねん', '円': 'えん', '時': 'じ' };
  function furiganaHTML(text) {
    if (text == null) return '';
    var dc = dict();
    var out = '', i = 0;
    while (i < text.length) {
      if (!isKanji(text[i])) { out += escapeHtml(text[i]); i++; continue; }
      if (text[i] === '数' && /[かヶヵ]/.test(text[i + 1] || '')) {   // 数か月/数ヶ国 → すう(非かず)
        out += '<ruby>数<rt>すう</rt></ruby>'; i++; continue;
      }
      if (i > 0) {
        var _pc = text[i - 1];
        if (COUNTER_READ[text[i]] && /[0-9０-９]/.test(_pc)) {   // 數字+計數字:10月→がつ、3年→ねん
          out += '<ruby>' + escapeHtml(text[i]) + '<rt>' + COUNTER_READ[text[i]] + '</rt></ruby>'; i++; continue;
        }
        if (text[i] === '月' && /[かヶヵ]/.test(_pc)) {          // か月/ヶ月 → げつ(いっかげつ)
          out += '<ruby>月<rt>げつ</rt></ruby>'; i++; continue;
        }
        if (text[i] === '半' && /[時分間]/.test(_pc)) {          // 時間半/一時間半/30分半 的 半 → はん(時間語境,非なかば)
          out += '<ruby>半<rt>はん</rt></ruby>'; i++; continue;
        }
      }
      var matched = null;
      for (var len = Math.min(12, text.length - i); len >= 1; len--) {
        var sub = text.substr(i, len);
        if (dc.READ[sub]) { matched = { sub: sub, reading: dc.READ[sub], entry: dc.ENTRY[sub] || null, conj: null }; break; }
        if (dc.CONJ[sub]) { matched = { sub: sub, reading: dc.CONJ[sub].reading, entry: null, conj: dc.CONJ[sub] }; break; }
      }
      // 行った/行って:行く(いく)與 行う(おこなう)的た/て形同字面,活用展開互相覆蓋,標音會亂猜
      // (用戶回饋:〜ついでに例句「取りに行った」被標成おこなった)。語境判讀:
      // 前一字是「を」= 他動詞受詞 → 行う(会議を行った);其他(に/へ/で/句首…)→ 行く。全語料掃過無反例。
      if (matched && matched.sub.charAt(0) === '行' && matched.sub.charAt(1) === 'っ') {
        var pv = i > 0 ? text[i - 1] : '';
        var r0 = matched.reading || '';
        if (pv === 'を') { if (r0.indexOf('い') === 0) matched.reading = 'おこな' + r0.slice(1); }
        else { if (r0.indexOf('おこな') === 0) matched.reading = 'い' + r0.slice(3); }
      }
      // 單漢字「貼著別的漢字」(前或後任一側)→ 這是漢語複合詞的一部分,單字讀音多半是錯的
      //   後接漢字:新○(新提案的新→しん 非あたら)  前接漢字:○者(離職者的者→しゃ 非もの)
      // 複合詞不一定用哪個音(者接漢字可しゃ可もの:離職者/若者),無法靠規則猜 → 一律不標,寧缺勿錯。
      // (活用形有送假名尾、長度>1,走 conj 分支不受此限;真的整詞在字典裡的會先以長詞匹配到,也不受影響。)
      if (matched && matched.sub.length === 1 && !matched.conj &&
          ((i + 1 < text.length && isKanji(text[i + 1])) || (i > 0 && isKanji(text[i - 1]))
           || (dc.NOBARE && dc.NOBARE[matched.sub]))) {   // 多音字/活用語干 裸出現 → 不標(語境不定,標了常錯)
        out += escapeHtml(text[i]); i++; continue;
      }
      // 單漢字 + 剩餘文字是某個長詞條的「前綴」→ 這個詞被截斷了(最常見成因:
      // 例句用 <em> 標記文法點,把詞從中間切開,如「変わっ<em>てきました</em>」)。
      // 此時單漢字比對到的往往是別的讀音(変→へん,實際該是 変わって→かわって)。
      // 依本模組一貫原則「寧可不上 ruby 也不標錯讀音」→ 直接跳過不標。
      if (matched && matched.sub.length === 1 && !matched.conj) {
        var rest = text.substr(i);
        var cands = dc.BYFIRST && dc.BYFIRST[text[i]];
        if (cands) {
          for (var ci = 0; ci < cands.length; ci++) {
            // rest 是 cands[ci] 的真前綴,且不只有那個漢字本身 → 判定為被截斷
            if (rest.length > 1 && cands[ci].length > rest.length && cands[ci].indexOf(rest) === 0) {
              // 升級:能從完整詞條安全反推漢字讀音就標對的,推不出來才不標。
              // 條件:詞條=「這個漢字+純假名尾」且讀音以該假名尾結尾(変わって=かわって → 変=か)
              var cw = cands[ci], crd = dc.READ[cw] || (dc.CONJ[cw] && dc.CONJ[cw].reading) || '';
              var tail = cw.slice(1);
              if (crd && /^[ぁ-ゖー]+$/.test(tail) && crd.length > tail.length && crd.slice(-tail.length) === tail) {
                matched = { sub: text[i], reading: crd.slice(0, crd.length - tail.length), entry: null, conj: null, safe1: true };
              } else {
                matched = null;
              }
              break;
            }
          }
        }
        if (!matched) { out += escapeHtml(text[i]); i++; continue; }
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
    // 標籤白名單:只有內容裡合法會出現的排版標籤放行(文法例句的 <em>、既有 ruby 等);
    // 其他一律轉義——AI 生成的台詞會經過這裡進 innerHTML,模型被誘導輸出 <img onerror=…> 這類
    // 標籤時不轉義就是 stored XSS(對話紀錄回放同路徑,審查實錘)。
    var SAFE_TAG = /^<\/?(em|b|i|u|strong|br|ruby|rt|rp|span)((\s+(class|style)="[^"<>]*")*\s*\/?)>$/i;   // 屬性只准 class/style(雙引號):span onclick=… 這種一律轉義
    return String(html).split(/(<[^>]+>)/).map(function (seg) {
      if (seg.charAt(0) === '<') return SAFE_TAG.test(seg) ? seg : escapeHtml(seg);
      return furiganaHTML(seg);
    }).join('');
  }

  // 全站共用「回報錯誤」連結:任何地方要回報都用它(統一收件匣、統一格式)
  function reportHref(kind, id, detail) {
    var subj = '[回報·' + kind + '] ' + (id || '');
    var body = detail + '\n\n錯誤描述(請補充哪裡怪):\n\n———\n頁面:' + (typeof location !== 'undefined' ? location.href : '');
    return 'mailto:stayjpplan@gmail.com?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(body);
  }
  window.stayjpReportHref = reportHref;

  // ===== 即點即查彈窗 =====
  var _pop = null;
  function ensureCss() {
    if (document.getElementById('jlkCss')) return;
    var st = document.createElement('style');
    st.id = 'jlkCss';
    st.textContent = [
      '.jlk{cursor:pointer;border-radius:3px;transition:background .12s;border-bottom:1.5px dotted rgba(214,101,74,.45)}',
      '.jlk:hover,.jlk:focus{background:rgba(214,101,74,.14);outline:none}',
      '#jlkPop .jacts{display:flex;gap:8px;margin-top:12px}',
      '#jlkPop .jact{flex:1;white-space:nowrap;text-align:center;border:1px solid var(--bd,#e0e0e0);background:var(--bg,#faf9f6);color:var(--tx,#333);border-radius:10px;padding:9px 6px;font-size:13px;font-weight:700;cursor:pointer}',
      '#jlkPop .jact:active{transform:scale(.96)}',
      '#jlkPop .jreport{display:block;text-align:center;margin-top:10px;font-size:12px;color:var(--tx3,#9a9a9a);text-decoration:none}',
      '#jlkPop .jreport:hover{color:var(--ac,#d4654a);text-decoration:underline}',
      '#jlkPop .jact.on{background:var(--ac,#d4654a);color:#fff;border-color:var(--ac,#d4654a)}',
      '#jlkPop{position:fixed;z-index:100000;max-width:min(300px,88vw);background:var(--bg2,#fff);color:var(--tx,#222);border:1px solid var(--bd,#e5e5e5);border-radius:14px;box-shadow:0 12px 38px rgba(0,0,0,.28);padding:14px 16px;font-size:14px;line-height:1.7;-webkit-font-smoothing:antialiased;font-family:-apple-system,"PingFang TC","Noto Sans TC",sans-serif}',
      '#jlkPop .jw{font-size:21px;font-weight:700;font-family:"Hiragino Mincho ProN","Noto Serif JP",serif;color:var(--tx,#1c1c1e)}',
      '#jlkPop .jr{font-size:13px;color:var(--tx2,#8a8a8a);margin-left:7px}',
      '#jlkPop .jtags{margin:7px 0 2px}',
      '#jlkPop .jtag{display:inline-block;font-size:11px;font-weight:700;padding:2px 9px;border-radius:20px;background:rgba(214,101,74,.15);color:var(--ac,#d4654a);margin:0 5px 4px 0}',
      '#jlkPop .jm{color:var(--tx,#222);margin-top:6px}',
      '#jlkPop .jbase{font-size:12px;color:var(--tx2,#8a8a8a);margin-top:8px;padding-top:8px;border-top:1px dashed var(--bd,#e5e5e5)}',
      '#jlkPop .jbase b{color:var(--tx,#222);font-size:15px;font-family:"Hiragino Mincho ProN","Noto Serif JP",serif}',
      '#jlkPop .jx{position:absolute;top:7px;right:11px;cursor:pointer;color:var(--tx3,#b0b0b0);font-size:15px;line-height:1;padding:4px}',
      '#jlkPop .jfreq{margin-top:9px;font-size:12.5px;font-weight:700;color:var(--ac,#d4654a)}',
      '#jlkPop .jfreq-dim{font-weight:600;color:var(--tx2,#8a8a8a)}',
      '#jlkPop .jact-pulse{background:var(--ac,#d4654a);color:#fff;border-color:var(--ac,#d4654a);animation:jpulse 1.1s ease-in-out infinite}',
      '@keyframes jpulse{0%,100%{box-shadow:0 0 0 0 rgba(212,101,74,.45)}50%{box-shadow:0 0 0 5px rgba(212,101,74,0)}}',
    ].join('');
    document.head.appendChild(st);
  }
  // 雲端發音兜底(預錄缺口):ttsSpeak function 以假名合成;記憶體快取,登出/失敗靜默
  var _cloudCache = {};
  var _cloudAu = null;
  function cloudSay(kana) {
    try {
      if (!kana) return;
      if (_cloudCache[kana]) { try { _cloudAu && _cloudAu.pause(); } catch (e2) {} _cloudAu = new Audio('data:audio/mp3;base64,' + _cloudCache[kana]); _cloudAu.play().catch(function(){}); return; }
      var user = (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth().currentUser : null;
      if (!user) return;
      user.getIdToken().then(function (tk) {
        return fetch('https://asia-east1-jpnote-1bdd6.cloudfunctions.net/ttsSpeak', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tk }, body: JSON.stringify({ text: kana, voice: 'f' }) });
      }).then(function (r) { return r.json(); }).then(function (d) {
        if (!d || !d.audio) return;
        _cloudCache[kana] = d.audio;
        try { _cloudAu && _cloudAu.pause(); } catch (e2) {}
        _cloudAu = new Audio('data:audio/mp3;base64,' + d.audio);
        _cloudAu.play().catch(function(){});
      }).catch(function(){});
    } catch (e) {}
  }
  function closePop() { if (_pop) { _pop.remove(); _pop = null; } }
  // 常查單字:自動記錄每次點查的次數,供「常查複習」用(存 localStorage)
  function lookHist() { try { return JSON.parse(localStorage.getItem('lookup_history')) || {}; } catch (e) { return {}; } }
  function recordLook(d) {
    if (!d || !d.w) return 0;
    try {
      var h = lookHist(), e = h[d.w] || {};
      e.n = (e.n || 0) + 1; e.t = Date.now();
      if (d.r) e.r = d.r; if (d.m) e.m = d.m; if (d.c) e.c = d.c;
      h[d.w] = e; localStorage.setItem('lookup_history', JSON.stringify(h));
      return e.n;
    } catch (e) { return 0; }
  }
  // 供未來「常查單字」複習頁取用:回傳依查詢次數排序、且尚未收藏的字
  window.stayjpFreqWords = function (limit) {
    var h = lookHist(), arr = [];
    for (var w in h) { if (window.stayjpHasWord && window.stayjpHasWord(w)) continue; arr.push({ w: w, r: h[w].r || '', m: h[w].m || '', c: h[w].c || '', n: h[w].n || 0, t: h[w].t || 0 }); }
    arr.sort(function (a, b) { return b.n - a.n || b.t - a.t; });
    return limit ? arr.slice(0, limit) : arr;
  };
  function showLookup(data, anchor) {
    ensureCss(); closePop();
    var _ln = recordLook(data);   // 記錄本次點查,取得累計次數
    var _saved = window.stayjpHasWord && window.stayjpHasWord(data.w);
    var _nudge = (_ln >= 3 && !_saved);   // 常查且未收藏 → 提示收藏複習
    var pop = document.createElement('div');
    pop.id = 'jlkPop';
    var tags = '';
    if (data.c) tags += '<span class="jtag">' + escapeHtml(data.c) + '</span>';
    if (data.f) tags += '<span class="jtag">' + escapeHtml(data.f) + '</span>';
    pop.innerHTML = '<span class="jx" role="button" aria-label="關閉"></span>'
      + '<div><span class="jw">' + escapeHtml(data.w) + '</span><span class="jr">' + escapeHtml(data.r) + '</span></div>'
      + (tags ? '<div class="jtags">' + tags + '</div>' : '')
      + '<div class="jm">' + escapeHtml(data.m || '（本站未收錄，可查辭典 ↓）') + '</div>'
      + (data.f ? '<div class="jbase">辭書形（原形）：<b>' + escapeHtml(data.w) + '</b></div>' : '')
      + (_nudge ? '<div class="jfreq"><i data-ic=refresh></i> 你查過這個字 ' + _ln + ' 次，收藏起來複習吧</div>'
        : (_ln >= 2 ? '<div class="jfreq jfreq-dim"><i data-ic=search></i> 查過 ' + _ln + ' 次</div>' : ''))
      + '<div class="jacts"><button class="jact jact-spk" type="button"><i data-ic=volume></i> 發音</button><button class="jact jact-fav' + (_nudge ? ' jact-pulse' : '') + '" type="button">' + (_nudge ? '<i data-ic=star></i> 收藏複習' : '☆ 收藏') + '</button>'
      + (data.m ? '' : '<a class="jact" href="https://cjjc.weblio.jp/content/' + encodeURIComponent(data.w) + '" target="_blank" rel="noopener" onclick="event.stopPropagation()"><i data-ic=book></i> 中文辭典</a><a class="jact" href="https://jisho.org/search/' + encodeURIComponent(data.w) + '" target="_blank" rel="noopener" onclick="event.stopPropagation()">Jisho</a>')
      + '</div>'
      + '<a class="jreport" href="' + reportHref('讀音/內容', data.w, '詞：' + data.w + '\n目前顯示讀音：' + (data.r || '') + '\n意思：' + (data.m || '')) + '" target="_blank" rel="noopener" onclick="event.stopPropagation()"><i data-ic=flag></i> 這個字讀音/意思有誤?回報</a>';
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
    // 🔊 發音:預錄 mp3 依「讀音→詞」順序找鍵(音檔有的以詞為鍵、有的以假名為鍵);
    // 都沒有 → 登入者用雲端 TTS 以假名讀音即時合成(字音必對),絕不無聲、絕不瀏覽器機器音。
    var spk = pop.querySelector('.jact-spk');
    if (spk) spk.addEventListener('click', function (e) {
      e.stopPropagation();
      var T = window.__TTS || {};
      var key = T[data.r] ? data.r : (T[data.w] ? data.w : null);
      if (key) { if (typeof speak === 'function') speak(key); return; }
      cloudSay(data.r || data.w);
    });
    // ☆ 收藏 → 生字本
    var fav = pop.querySelector('.jact-fav');
    if (fav) {
      if (window.stayjpHasWord && window.stayjpHasWord(data.w)) { fav.textContent = '★ 已收藏'; fav.classList.add('on'); }
      fav.addEventListener('click', function (e) {
        e.stopPropagation();
        if (!window.stayjpAddWord) { showToast('收藏功能未載入'); return; }
        var res = window.stayjpAddWord(data.w, data.r, data.m);
        fav.textContent = '★ 已收藏'; fav.classList.add('on');
        showToast(res === 'exists' ? '已在生字本 <i data-ic=book></i>' : '已加入生字本 <i data-ic=book></i>');
      });
    }
    // 整張卡片點擊 = 發音(✕/發音/收藏 已各自 stopPropagation,不會誤觸)
    pop.style.cursor = 'pointer';
    pop.addEventListener('click', function () { if (typeof speak === 'function') speak(data.r || data.w); });
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
  window.furiAddEntries = addEntries;
  // 依詞查 VOCAB 釋義(供文章逐詞可點用):回 {r,m,c} 或 null。ENTRY 以含漢字的詞為 key。
  window.furiganaAddEntries = addEntries;   // 晚載詞庫(對話頁按需載 N3↑)併入字典
  window.furiLookup = function (w) { try { return dict().ENTRY[w] || null; } catch (e) { return null; } };
  // ── 假名查詢:以「讀音/純假名表記」為 key(ENTRY 只收含漢字詞,假名詞查不到 → 初學者讀 N5 假名文全點不了)。
  // 同音詞(かみ=紙/神/髪)列前三個讓學習者自己對上下文。lazy build,vocab 檔載完後第一次查才建索引。
  var __kanaDict = null;
  function kanaDict() {
    if (__kanaDict) return __kanaDict;
    var K = Object.create(null);
    ['VOCAB_N5', 'VOCAB_N4', 'VOCAB_N3', 'VOCAB_N2', 'VOCAB_N1'].forEach(function (lvl) {
      var arr = window[lvl];
      if (!Array.isArray(arr)) return;
      arr.forEach(function (v) {
        if (!(v && v.w && v.r)) return;
        var keys = [v.r];
        if (v.w !== v.r && /^[ぁ-ゖーァ-ヶ]+$/.test(v.w)) keys.push(v.w);   // 純假名/片假名表記也當 key
        keys.forEach(function (key) { (K[key] || (K[key] = [])).push(v); });
      });
    });
    __kanaDict = K;
    return K;
  }
  // 文章補充字典(article-dict.js):vocab 主庫沒收的詞。回 {r,m} 或 null。
  window.dictExtra = function (w) {
    try {
      var d = window.ARTICLE_DICT && window.ARTICLE_DICT[w];
      return d ? { r: d[0] || '', m: d[1] || '', c: '' } : null;
    } catch (e) { return null; }
  };
  window.kanaLookup = function (kana) {
    try {
      var list = kanaDict()[kana];
      if (!list || !list.length) return null;
      var seen = Object.create(null), uniq = [];   // 同詞出現在多級 vocab → 去重
      list.forEach(function (v) { if (!seen[v.w]) { seen[v.w] = 1; uniq.push(v); } });
      if (uniq.length === 1) {
        var v = uniq[0];
        return { w: v.w, r: v.r, m: v.m || '', c: v.c || '' };
      }
      return {   // 同音詞:列出候選讓學習者對上下文
        w: kana, r: '',
        m: uniq.slice(0, 3).map(function (v2) { return v2.w + '：' + (v2.m || ''); }).join('；'),
        c: ''
      };
    } catch (e) { return null; }
  };
  window.showToast = showToast;
})();
