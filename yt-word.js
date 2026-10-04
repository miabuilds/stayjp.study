// yt-word.js — YouTube 跟讀字幕「每個詞都能點」的斷詞→查詢對應(純函式)。
//   瀏覽器掛 window.YtWord、node 用 require() 測(scripts/test-yt-word.cjs)。只有 yt-shadow.html 用。
//
// 資料:快取每句 l.tk = ['表層' | '表層\t讀音' | '表層\t讀音\t原形'](scripts/yt-ruby.mjs,kuromoji)
//       新種/重跑過的影片還有 l.tp = ['詞性代碼' | '詞性代碼\t原形'],跟 tk 一一對應(代碼見 yt-ruby.mjs 檔頭)。
// 規則(KOL 要求「字幕每個字都能查」,但助詞/助動詞畫虛線只是噪音):
//   - 含漢字的詞:照舊一律可點(有收錄給意思,沒收錄給辭典連結)
//   - 助詞/助動詞/非自立(ている的いる、こと/の/ん)/記號/數字/英文:不畫虛線
//   - 假名動詞/形容詞(して/いって/おいしかった):有 tp 原形就用原形查
//   - 片假名詞:查得到給意思,查不到也可點(外來語・字典沒有收錄 + 發音 + 辭典連結)
//   - 平假名詞:查得到就可點;有 tp 時內容詞(名/副/感嘆…)查不到也可點(本站未收錄 + 辭典連結);
//     沒 tp 的舊快取無法分辨「活用碎片」(いっ/なっ),查不到就不標(寧缺勿錯)
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.YtWord = api;
})(typeof window !== 'undefined' ? window : null, function () {
  'use strict';

  var LEVELS = ['VOCAB_N5', 'VOCAB_N4', 'VOCAB_N3', 'VOCAB_N2', 'VOCAB_N1'];
  var HAS_KANJI = /[一-鿿々〆ヶ]/;
  var JP = /[ぁ-ゖァ-ヺ一-鿿々〆]/;
  var HIRA_ONLY = /^[ぁ-ゖー]+$/;
  var KATA_ONLY = /^[ァ-ヺー]+$/;

  // 沒 tp 的舊快取用:常見助詞/助動詞/活用尾的「表層」(kuromoji 切出來的樣子)
  var FUNC = ('は が を に で と も の へ や か ね よ な わ ぞ ぜ さ し ば て ても ては から まで より けど けれど けれども ' +
    'のに ので って とか だけ しか など ほど くらい ぐらい ばかり ながら たり だり つつ ずつ こそ さえ でも なら ねえ よね かな かしら っけ ' +
    'じゃ ちゃ ちゃう じゃう です でし でしょ ます まし ませ ましょ た だ だっ だろ ない なかっ なく なきゃ なけれ ぬ ん う よう ' +
    'れる られる れ られ せる させる せ させ たい たかっ たく らしい そう みたい ような ように いる い いま いた ある あり ' +
    'こと もの ところ とき の ん する し さ しま しまう ちゃっ てる でる とく').split(/\s+/);
  var FUNCSET = Object.create(null);
  FUNC.forEach(function (w) { if (w) FUNCSET[w] = 1; });
  var PLAIN_POS = { S: 1, P: 1, X: 1, x: 1, n: 1 };
  // kuromoji 已知誤判:「いいです」的いい被當成 言う 的連用形
  var FIX_BASE = { 'いい': { from: '言う', to: 'いい' } };

  function parseTk(s) {
    var p = String(s).split('\t');
    return { surf: p[0] || '', rd: p.length >= 2 ? p[1] : '', base: p[2] || '' };
  }
  function parseTp(s) {
    if (s == null) return null;
    var p = String(s).split('\t');
    return { pos: p[0] || '', base: p[1] || '' };
  }

  // ── 查詢函式:VOCAB(已載入的級數)→ 文章補充字典 → 假名精選字 → 片假名長音變體 → 平假名讀音唯一對應 ──
  function makeLookup(g) {
    g = g || (typeof window !== 'undefined' ? window : {});
    var cache = null;
    function build() {
      var W = Object.create(null), R = Object.create(null), n = 0;
      LEVELS.forEach(function (k) {
        var arr = g[k];
        if (!Array.isArray(arr)) return;
        n += arr.length;
        arr.forEach(function (v) {
          if (!v || !v.w) return;
          if (!W[v.w]) W[v.w] = { w: v.w, r: v.r || v.w, m: v.m || '', c: v.c || '' };
          if (v.r && v.r !== v.w && !/[ァ-ヺ]/.test(v.w)) (R[v.r] || (R[v.r] = [])).push(v.w);   // 片假名詞不進讀音索引(くらし≠クラス)
        });
      });
      var cur = (g.KanaLookup && g.KanaLookup.CURATED) || [];
      cur.forEach(function (e) { if (e && e.w && !W[e.w]) W[e.w] = { w: e.w, r: e.r || e.w, m: e.m || '', c: e.c || '' }; });
      return { W: W, R: R, n: n, cn: cur.length };
    }
    function idx() {
      var n = 0;
      LEVELS.forEach(function (k) { if (Array.isArray(g[k])) n += g[k].length; });
      if (!cache || cache.n !== n) cache = build();
      return cache;
    }
    function direct(d, w) {
      if (!w) return null;
      if (d.W[w]) return d.W[w];
      var a = g.ARTICLE_DICT && g.ARTICLE_DICT[w];
      if (a && a[1]) return { w: w, r: a[0] || w, m: a[1], c: '' };
      return null;
    }
    // 回傳 {w,r,m,c} 或 null;guess=true 表示「依讀音推測」(假名寫的詞對到字庫裡唯一的漢字詞,例:きれい→綺麗)。
    //   推測可能錯(字庫只收了同音的另一個詞:たいじ=退治 卻對到 胎児)→ 彈窗會掛「依讀音推測」標籤,不假裝確定。
    return function lookup(w) {
      var d = idx();
      var e = direct(d, w);
      if (e) return e;
      if (KATA_ONLY.test(w)) {
        e = (w.slice(-1) === 'ー' ? direct(d, w.slice(0, -1)) : null) || direct(d, w + 'ー');
        if (e) return e;
      }
      if (HIRA_ONLY.test(w) && w.length >= 2) {   // 讀音唯一對應才用(かみ=紙/神/髪 不猜)
        var list = d.R[w];
        if (list) {
          var uniq = list.filter(function (x, i) { return list.indexOf(x) === i; });
          if (uniq.length === 1) { var x = d.W[uniq[0]]; return { w: x.w, r: x.r, m: x.m, c: x.c, guess: true }; }
        }
      }
      return null;
    };
  }

  // ── 主函式:一句 → 片段陣列 ──
  //  回傳 null = 這句沒有 tk(呼叫端退回 furiganaHTML)
  //  片段:{ t 表層, rd 讀音(含漢字才有,畫 ruby 用), tap, w 查詢詞頭, r, m, c, f 活用標籤, u 外來語未收錄 }
  function segments(line, lookup) {
    if (!line || !Array.isArray(line.tk) || !line.tk.length) return null;
    var tp = Array.isArray(line.tp) && line.tp.length === line.tk.length ? line.tp : null;
    lookup = lookup || function () { return null; };
    var out = [];
    var prevPos = '';
    for (var i = 0; i < line.tk.length; i++) {
      var k = parseTk(line.tk[i]);
      var p = tp ? parseTp(tp[i]) : null;
      var seg = classify(k, p, prevPos, lookup);
      out.push(seg);
      prevPos = p ? p.pos : '';
    }
    return out;
  }

  function plain(surf, rd) { return { t: surf, rd: rd || '', tap: false }; }

  function classify(k, p, prevPos, lookup) {
    var surf = k.surf;
    if (!surf || !JP.test(surf)) return plain(surf);          // 記號/空白/數字/英文
    var pos = p ? p.pos : '';
    var base = (p && p.base) || k.base || '';

    // 含漢字:照舊一律可點(純數字 一/二/百 例外)
    if (HAS_KANJI.test(surf)) {
      if (pos === 'S' && /^[0-9０-９一二三四五六七八九十百千万億兆〇零]+$/.test(surf)) return plain(surf, k.rd);   // 純數字;何(度)也被標成數詞,照樣可點
      var e = lookup(base || surf) || (base ? lookup(surf) : null);
      var w = base || surf;
      return {
        t: surf, rd: k.rd, tap: true,
        w: e ? e.w : w,
        r: e ? (e.r || '') : (w === surf ? k.rd : ''),
        m: e ? (e.m || '') : '', c: e ? (e.c || '') : '',
        f: base && base !== surf && (!e || e.w === base) ? '活用形' : '', u: false
      };
    }

    // 以下:純假名詞
    // 單一假名(き/み/に/で…)kuromoji 常誤判成動詞(に→似る、ほ→彫る);小字開頭(ゃいけない…)是斷詞碎片 → 一律不標
    if (surf.length < 2 || /^[ぁぃぅぇぉっゃゅょゎゕゖァィゥェォッャュョヮーヽゝ〜]/.test(surf)) return plain(surf);
    if (p && FIX_BASE[surf] && p.base === FIX_BASE[surf].from) base = FIX_BASE[surf].to;
    if (p) {
      if (PLAIN_POS[pos]) return plain(surf);
      if (pos === 'V' && base === 'する' && prevPos === 'N') return plain(surf);   // 勉強|し:サ變動詞的「し」不另標
      var key = base || surf;
      var hit = lookup(key) || (key !== surf ? lookup(surf) : null);
      if (hit) return tapOf(surf, key, hit);
      if (pos === 'F') return plain(surf);
      if (KATA_ONLY.test(surf)) return unknownKata(surf);
      return { t: surf, rd: '', tap: true, w: key, r: HIRA_ONLY.test(key) ? key : '', m: '', c: '', f: key !== surf ? '活用形' : '', u: false };
    }

    // 沒 tp(舊快取):靠表層判斷
    if (FUNCSET[surf]) return plain(surf);
    var h = lookup(surf);
    if (h) return tapOf(surf, surf, h);
    if (KATA_ONLY.test(surf) && /[ァ-ヺ]/.test(surf) && surf.length >= 2) return unknownKata(surf);
    return plain(surf);
  }

  function tapOf(surf, key, e) {
    var isKata = KATA_ONLY.test(e.w);
    return {
      t: surf, rd: '', tap: true, w: e.w,
      r: isKata ? e.w : (e.r || e.w),      // 片假名詞的 vocab 讀音是平假名(コーヒー→こーひー),印出來只是噪音
      m: e.m || '', c: e.c || '',
      f: e.guess ? '依讀音推測' : (key !== surf ? '活用形' : ''), u: false
    };
  }
  function unknownKata(surf) {
    return { t: surf, rd: '', tap: true, w: surf, r: surf, m: '', c: '', f: '', u: true };
  }

  // 統計用:這個片段算不算「內容詞」(有日文、不是助詞/助動詞/記號)
  function isContent(line, i) {
    var k = parseTk(line.tk[i]);
    if (!k.surf || !JP.test(k.surf)) return false;
    var tp = Array.isArray(line.tp) && line.tp.length === line.tk.length ? parseTp(line.tp[i]) : null;
    if (tp) return !PLAIN_POS[tp.pos] && tp.pos !== 'F';
    return !FUNCSET[k.surf];
  }

  return { segments: segments, makeLookup: makeLookup, isContent: isContent, FUNC: FUNC };
});
