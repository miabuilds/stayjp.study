// kana-lookup.js — 純假名詞的即點即查比對器(コンビニ/ありがとう/ちょっと…)。
//   ux-extras.js 的 furiganaHTML 只掃漢字詞;假名詞要另外切。本檔是「純函式」比對器,
//   瀏覽器掛 window.KanaLookup、node 用 require() 測(scripts/test-kana-lookup.cjs)。
//   目前只有 AI 情境對話頁(speak-chat)開啟:furiganaHTMLRich(jp, { kana:true, kanaExtra:words })。
//
// 原則:寧缺勿錯(標錯比沒標更糟)。
//   來源優先序:①這則 AI 回覆附的 WORDS(単語|よみ|意思) ②已載入的 VOCAB_N5~N1 中「詞頭是純假名」的詞
//              ③少量人工精選的生活高頻假名詞(CURATED,只補 vocab 沒收的)
//   片假名:必須等於「整段連續片假名」(允許尾巴差一個ー),長度 ≥2;字典沒有、長度 ≥3 拍(小字ャュョ不算)→ 標成「外來語・字典沒有收錄」
//   平假名:長度 ≥3、最長匹配、文法/功能詞停用表(停用詞會「吃掉」那段字,避免裡面再冒出誤配)、
//           前後要在合理詞界(前:句首/標點/片假名/助詞/上一個詞尾;緊接漢字只放行名詞/副詞/形容詞;
//           後:非平假名/助詞・です類開頭/下一個詞頭;接小字ゃゅょっ或ー一律不算)
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.KanaLookup = api;
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';

  var LEVELS = ['VOCAB_N5', 'VOCAB_N4', 'VOCAB_N3', 'VOCAB_N2', 'VOCAB_N1'];
  var UNKNOWN_M = '外來語・字典沒有收錄';

  function isHira(c) { return c >= 'ぁ' && c <= 'ゖ'; }
  // 片假名(不含 ヵヶ:3ヶ月 的ヶ是量詞記號;不含・:分隔號)
  function isKata(c) { return (c >= 'ァ' && c <= 'ヺ' && c !== 'ヵ' && c !== 'ヶ') || c === 'ー'; }
  function isKanji(c) { return /[一-鿿々〆]/.test(c); }
  var KANA_ONLY = /^[ぁ-ゖァ-ヺー]+$/;
  var HIRA_ONLY = /^[ぁ-ゖ]+$/;
  var KATA_ONLY = /^[ァ-ヺー]+$/;
  function toHira(s) {
    return s.replace(/[ァ-ヶ]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0x60); });
  }

  // 文法/功能詞:不標,而且比對時當成一個 token 吃掉(避免「ください」裡又冒出別的詞)。
  var STOP = ('です ます でした ません ました ましょう でしょう だろう だった でしたら ませんか ましたか ' +
    'ください くださいね くださいませ てください でください なさい ございます でございます いたします おります ' +
    'けど けれど から まで より だけ しか など ほど まま ずつ って という っていう ている ていた ていて てる ' +
    'てもいい てはいけない なければならない なきゃ かもしれない そうです そうだ ようだ ようです ような ように みたい らしい ' +
    'ので のに のです んです じゃない ではない ながら について によって として ために ため ところ ばかり ぐらい くらい ' +
    'しまう しまった ちゃう ちゃった やすい にくい すぎる すぎ られる させる ある いる する なる いい こと もの').split(/\s+/);
  var STOPSET = Object.create(null);
  STOP.forEach(function (w) { if (w) STOPSET[w] = 1; });

  // 平假名詞前一字若是平假名,只有這些(助詞/な形容詞的な)才算詞界
  var PREV_OK = 'はがをにでへともねよかのやな';
  // 平假名詞後一字若是平假名,只有這些開頭(助詞/です/だ/じゃ/し/さん/ます…)才算詞界
  var NEXT_OK = 'はがをにでへともねよかのやなだじしさまけんぞわ';
  var SMALL = 'ぁぃぅぇぉっゃゅょゎー';
  // 緊接在漢字後面的平假名多半是送假名/活用(勉強すると、行きましょう)→ 只放行名詞/副詞/形容詞
  var AFTER_KANJI_OK = /^(名|副|い形|な形)/;

  // 人工精選:vocab 沒收、但對話裡天天出現的假名詞(只在 vocab 沒有時才補)
  var CURATED = [
    { w: 'ありがとう', r: 'ありがとう', m: '謝謝', c: '他' },
    { w: 'ごめん', r: 'ごめん', m: '抱歉(口語)', c: '他' },
    { w: 'わかりました', r: 'わかりました', m: '知道了・明白了', c: '他' },
    { w: 'かしこまりました', r: 'かしこまりました', m: '好的・遵命(服務業敬語)', c: '他' },
    { w: 'いらっしゃいませ', r: 'いらっしゃいませ', m: '歡迎光臨', c: '他' },
    { w: 'おねがいします', r: 'おねがいします', m: '麻煩你了・拜託', c: '他' },
    { w: 'よろしくおねがいします', r: 'よろしくおねがいします', m: '請多指教・麻煩你了', c: '他' },
    { w: 'もちろん', r: 'もちろん', m: '當然', c: '副' },
    { w: 'たぶん', r: 'たぶん', m: '大概', c: '副' },
    { w: 'ぜんぜん', r: 'ぜんぜん', m: '完全(不)・一點也(不)', c: '副' },
    { w: 'いっしょに', r: 'いっしょに', m: '一起', c: '副' },
    { w: 'すごく', r: 'すごく', m: '非常', c: '副' },
    { w: 'おいしい', r: 'おいしい', m: '好吃的', c: 'い形' },
    { w: 'かわいい', r: 'かわいい', m: '可愛的', c: 'い形' },
    { w: 'だいじょうぶ', r: 'だいじょうぶ', m: '沒問題・沒關係', c: 'な形' },
    { w: 'コンビニ', r: 'こんびに', m: '便利商店', c: '名' },
    { w: 'アパート', r: 'あぱーと', m: '公寓(木造・輕鋼構)', c: '名' },
    { w: 'マンション', r: 'まんしょん', m: '公寓大樓(鋼筋混凝土)', c: '名' },
    { w: 'スマホ', r: 'すまほ', m: '智慧型手機', c: '名' },
    { w: 'アプリ', r: 'あぷり', m: 'App・應用程式', c: '名' },
    { w: 'メール', r: 'めーる', m: '電子郵件', c: '名' },
    { w: 'ポイント', r: 'ぽいんと', m: '點數・重點', c: '名' },
    { w: 'ポイントカード', r: 'ぽいんとかーど', m: '集點卡', c: '名' },
    { w: 'クレジットカード', r: 'くれじっとかーど', m: '信用卡', c: '名' },
    { w: 'サイズ', r: 'さいず', m: '尺寸', c: '名' },
    { w: 'セット', r: 'せっと', m: '套餐・一組', c: '名' },
    { w: 'おにぎり', r: 'おにぎり', m: '飯糰', c: '名' }
  ];

  function vocabArrays(src) {
    var g = src || (typeof window !== 'undefined' ? window : {});
    return LEVELS.map(function (k) { return Array.isArray(g[k]) ? g[k] : null; }).filter(Boolean);
  }

  // ── 索引:key(假名表記)→ entry。一次建好,之後每則泡泡只做 Map 查詢 ──
  function buildIndex(arrays, opts) {
    opts = opts || {};
    var map = new Map(), maxLen = 0;
    function put(key, e) {
      if (!key || map.has(key) || STOPSET[key]) return;
      map.set(key, e);
      if (key.length > maxLen) maxLen = key.length;
    }
    (arrays || []).forEach(function (arr) {
      arr.forEach(function (v) {
        if (!v || !v.w || !KANA_ONLY.test(v.w)) return;   // 只收「詞頭純假名」:含漢字的詞走 furiganaHTML
        put(v.w, { w: v.w, r: v.r || v.w, m: v.m || '', c: v.c || '' });
      });
    });
    if (opts.curated !== false) CURATED.forEach(function (e) { put(e.w, e); });
    return { map: map, maxLen: maxLen };
  }

  var _cache = null;
  function getIndex(src) {
    var arrs = vocabArrays(src), n = 0;
    arrs.forEach(function (a) { n += a.length; });
    if (!_cache || _cache.n !== n) { _cache = buildIndex(arrs); _cache.n = n; }
    return _cache;
  }

  // AI 的 WORDS:「単語|よみ|意思;…」或 [{w,r,m}]
  function parseAiWords(words) {
    if (!words) return [];
    if (Array.isArray(words)) return words.filter(function (e) { return e && e.w; });
    return String(words).split(/[;；﹔]/).map(function (it) {
      var p = it.split(/[|｜]/);
      return { w: (p[0] || '').trim(), r: (p[1] || '').trim(), m: (p[2] || '').trim() };
    }).filter(function (e) { return e.w; });
  }

  // 這則泡泡專用的小索引(AI 附的詞,優先於字典)
  function extraIndex(text, list) {
    var map = new Map(), maxLen = 0;
    parseAiWords(list).forEach(function (e) {
      var key = null, ent = null;
      if (KANA_ONLY.test(e.w)) { key = e.w; ent = { w: e.w, r: e.r || e.w, m: e.m, c: '' }; }
      else if (e.r && KANA_ONLY.test(e.r) && text.indexOf(e.w) < 0) { key = e.r; ent = { w: e.w, r: e.r, m: e.m, c: '' }; }   // 漢字詞但泡泡裡寫成假名
      if (!key || !ent.m || STOPSET[key] || map.has(key)) return;
      map.set(key, ent);
      if (key.length > maxLen) maxLen = key.length;
    });
    return { map: map, maxLen: maxLen };
  }

  function isRedup(s) {   // ドキドキ/ワクワク 這種疊字多半是擬聲擬態,不能標「外來語」
    if (s.length % 2) return false;
    var h = s.length / 2;
    return s.slice(0, h) === s.slice(h);
  }

  // ── 主比對:回傳 [{start,end,w,r,m,c,src:'ai'|'dict'|'unknown'}],依位置排序、互不重疊 ──
  function findMatches(text, index, extra) {
    var out = [];
    if (!text) return out;
    text = String(text);
    index = index || getIndex();
    var ex = extraIndex(text, extra);
    function get(key) {
      var e = ex.map.get(key);
      if (e) return { e: e, src: 'ai' };
      e = index.map.get(key);
      return e ? { e: e, src: 'dict' } : null;
    }
    var maxLen = Math.max(index.maxLen, ex.maxLen);
    var n = text.length, i = 0;
    while (i < n) {
      var ch = text[i];
      if (isKata(ch) && ch !== 'ー') {
        var j = i; while (j < n && isKata(text[j])) j++;
        var run = text.slice(i, j);
        matchKata(run, i, j);
        i = j; continue;
      }
      if (isHira(ch)) {
        var k = i; while (k < n && isHira(text[k])) k++;
        matchHiraRun(i, k);
        i = k; continue;
      }
      i++;
    }
    return out;

    function matchKata(run, s, e) {
      if (run.length < 2) return;
      var hit = get(run);
      if (!hit && run.charAt(run.length - 1) === 'ー') hit = get(run.slice(0, -1));
      if (!hit) hit = get(run + 'ー');
      if (!hit) { var h = get(toHira(run)); if (h && HIRA_ONLY.test(h.e.w)) hit = h; }   // ゴミ→ごみ、ドキドキ→どきどき
      if (hit) { out.push(mk(s, e, hit.e, hit.src)); return; }
      if (run.replace(/[ァィゥェォャュョヮ]/g, '').length >= 3 && !isRedup(run) && /[ァ-ヺ]/.test(run) && !/^[ァィゥェォッャュョヮー]/.test(run)) {
        out.push({ start: s, end: e, w: run, r: run, m: UNKNOWN_M, c: '', src: 'unknown' });
      }
    }

    function matchHiraRun(s, e) {
      var lastEnd = -1;   // 上一個 token(詞或停用詞)的結尾:緊接在後面也算詞界
      var p = s;
      while (p < e) {
        var took = false;
        var top = Math.min(maxLen, e - p);
        for (var len = top; len >= 2; len--) {
          var sub = text.substr(p, len);
          if (STOPSET[sub]) { lastEnd = p + len; p += len; took = true; break; }   // 吃掉文法詞
          if (len < 3) continue;
          var hit = get(sub);
          if (!hit) continue;
          if (!prevOk(p, lastEnd, hit.e) || !nextOk(p + len, e)) continue;
          out.push(mk(p, p + len, hit.e, hit.src));
          lastEnd = p + len; p += len; took = true; break;
        }
        if (!took) p++;
      }
    }

    function prevOk(p, lastEnd, entry) {
      if (p === 0 || p === lastEnd) return true;
      var pc = text[p - 1];
      if (isHira(pc)) return PREV_OK.indexOf(pc) >= 0;
      if (isKanji(pc)) return AFTER_KANJI_OK.test(entry.c || '');
      return true;   // 標點/空白/片假名/數字/英文
    }
    function nextOk(q, runEnd) {
      if (q >= text.length) return true;
      var nc = text[q];
      if (SMALL.indexOf(nc) >= 0) return false;   // そうじ|ゃない、ただし|い
      if (q >= runEnd) return true;               // 後面不是平假名(漢字/片假名/標點)
      if (NEXT_OK.indexOf(nc) >= 0) return true;
      return startsToken(q, runEnd);              // どうも|ありがとう:後面緊接另一個詞
    }
    function startsToken(q, runEnd) {
      var top = Math.min(maxLen, runEnd - q);
      for (var len = top; len >= 2; len--) {
        var sub = text.substr(q, len);
        if (STOPSET[sub] || (len >= 3 && get(sub))) return true;
      }
      return false;
    }
    function mk(s, e, ent, src) {
      // 片假名詞的 vocab 讀音是平假名(コーヒー→こーひー),彈窗印出來只是噪音 → 讀音用本身
      var r = KATA_ONLY.test(ent.w) ? ent.w : (ent.r || ent.w);
      return { start: s, end: e, w: ent.w, r: r, m: ent.m || '', c: ent.c || '', src: src };
    }
  }

  return {
    buildIndex: buildIndex,
    getIndex: getIndex,
    findMatches: findMatches,
    parseAiWords: parseAiWords,
    STOP: STOP,
    CURATED: CURATED,
    UNKNOWN_M: UNKNOWN_M
  };
});
