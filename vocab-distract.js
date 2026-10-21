// 單字選擇題共用:挑「有鑑別力」的干擾項 + 判斷「中文意思跟日文漢字同字」的字(2026-10-21)
// 用戶回饋(年費、N1 闖關):「單字意思或讀音的選擇題,答案太明顯,沒有測驗的效果」。三個原因:
//  1) 干擾項純隨機:跨等級、不同詞性,刪去法就能選對
//  2) N3 以上七成的字中文意思跟漢字過半同字(命題=命題、論拠=論據),考「意思」或「中→日」等於對字 → 這類字只考讀音才有效
//  3) path.js 用 root.Quiz 拿讀音混淆項,但 quiz.js 是 const Quiz、沒上 window → 一直退回隨機讀音(長度差很多)
// 用法:VocabDistract.meanings(word, pool, 3, rand) / words(...) / transparency(word) / preferOpaque(list, n)
(function (root) {
  // 新字体→繁體(只用來判斷同字,不求完整)
  var SJ = '拠據圧壓帰歸気氣発發広廣価價済濟渋澀単單弁辯図圖対對学學実實戦戰経經続續読讀売賣変變総總様樣楽樂会會辺邊応應歴歷労勞険險検檢験驗断斷庁廳県縣駅驛鉄鐵転轉伝傳囲圍円圓塩鹽横橫仮假挙舉区區権權参參処處証證将將条條状狀乗乘浄淨縄繩譲讓触觸静靜摂攝専專践踐銭錢浅淺繊纖双雙争爭荘莊捜搜巣巢装裝蔵藏臓臟属屬体體滞滯台臺択擇沢澤担擔胆膽団團弾彈遅遲昼晝聴聽鎮鎭点點灯燈当當闘鬥独獨届屆悩惱脳腦廃廢拝拜麦麥髪髮抜拔晩晚蛮蠻秘祕浜濱払拂仏佛宝寶豊豐毎每満滿黙默訳譯薬藥予豫余餘与與誉譽揺搖謡謠頼賴乱亂覧覽竜龍両兩猟獵緑綠涙淚励勵礼禮霊靈齢齡恋戀炉爐湾灣児兒鶏雞軽輕径徑茎莖剣劍芸藝欠缺圏圈巻卷勧勸歓歡観觀関關陥陷犠犧戯戲旧舊峡峽狭狹郷鄉暁曉駆驅勲勳薫薰恵惠掲揭渓溪継繼撃擊倹儉顕顯厳嚴効效恒恆黄黃鉱鑛号號国國砕碎斎齋剤劑雑雜桟棧蚕蠶惨慘賛贊残殘糸絲歯齒辞辭湿濕写寫釈釋寿壽収收従從獣獸縦縱粛肅叙敍奨獎焼燒称稱渉涉畳疊嬢孃剰剩醸釀寝寢慎愼尽盡粋粹酔醉随隨枢樞数數瀬瀨声聲斉齊窃竊絶絕潜潛禅禪壮壯挿插聡聰騒騷増增即卽堕墮帯帶滝瀧脱脫痴癡虫蟲鋳鑄勅敕逓遞党黨盗盜稲稻徳德弐貳覇霸瓶甁併倂並竝餅餠歩步褒襃翻飜万萬麺麵弥彌来來塁壘戻戾暦曆錬鍊楼樓録錄';
  var TR = {}; for (var i = 0; i < SJ.length; i += 2) TR[SJ[i]] = SJ[i + 1];
  function isK(c) { return /[一-鿿々]/.test(c); }
  function kanjiOf(w) { return String(w || '').split('').filter(isK); }
  // 0~1:日文漢字有幾成出現在中文意思裡(1 = 每個漢字都看得到 → 考意思等於對字)
  function transparency(v) {
    var ks = kanjiOf(v && v.w); if (!ks.length) return 0;
    var m = String((v && v.m) || '');
    var hit = ks.filter(function (c) { return m.indexOf(c) >= 0 || (TR[c] && m.indexOf(TR[c]) >= 0); }).length;
    return hit / ks.length;
  }
  function isTransparent(v) { return transparency(v) >= 0.5; }
  // 題目來源偏好「字面看不出意思」的字;不夠 n 個才混回同字的(不讓題目變少)
  function preferOpaque(list, n) {
    var op = [], tr = [];
    (list || []).forEach(function (v) { (isTransparent(v) ? tr : op).push(v); });
    return op.length >= n ? op : op.concat(tr);
  }
  function norm(s) { return String(s || '').replace(/[（(][^）)]*[）)]/g, '').replace(/[\s,，、;；/／・.。…~〜]/g, ''); }
  function charOverlap(a, b) {
    a = norm(a); b = norm(b); if (!a || !b) return 0;
    var sa = {}, n = 0, i; for (i = 0; i < a.length; i++) sa[a[i]] = 1;
    var sb = {}; for (i = 0; i < b.length; i++) if (!sb[b[i]]) { sb[b[i]] = 1; if (sa[b[i]]) n++; }
    return n / Math.min(Object.keys(sa).length, Object.keys(sb).length);
  }
  // 意思太像 → 可能兩個都算對(房子/房屋、看/看見),不能當干擾項
  // strict:「看字選意思」用(景色/景觀 這種近義也排掉);寬鬆:「看中文選日文」用(電車/電話 要留著當形近干擾項)
  function tooClose(m1, m2, strict) {
    var a = norm(m1), b = norm(m2);
    if (!a || !b || a === b) return true;
    if (a.indexOf(b) >= 0 || b.indexOf(a) >= 0) return true;
    return charOverlap(a, b) >= (strict ? 0.5 : 0.67);   // 電車/電話(0.5)可以當干擾項;三字以上大半重疊才算太像
  }
  // 字種:選項全是平假名卻混一個片假名(おじさん/ネクタイ)一眼就刪,所以干擾項要同字種
  function script(w) { w = String(w || ''); if (/^[ァ-ヺー・]+$/.test(w)) return 'kata'; if (/^[ぁ-ゖー]+$/.test(w)) return 'hira'; return /[一-鿿々]/.test(w) ? 'kanji' : 'mix'; }
  function sharesKanji(a, b) { var ka = kanjiOf(a); return kanjiOf(b).some(function (c) { return ka.indexOf(c) >= 0; }); }
  function pick(scored, n, rand, keyOf, strict) {
    rand = rand || Math.random;
    scored.forEach(function (x) { x.k = x.s + rand() * 2.5; });   // 加一點亂數:每次不同,但仍偏向高分(同詞性/形近)
    scored.sort(function (x, y) { return y.k - x.k; });
    var out = [], seen = {};
    for (var i = 0; i < scored.length && out.length < n; i++) {
      var key = keyOf(scored[i].d); if (seen[key]) continue;
      if (out.some(function (o) { return tooClose(o.m, scored[i].d.m, strict); })) continue;   // 干擾項彼此也別太像
      seen[key] = 1; out.push(scored[i].d);
    }
    return out;
  }
  // 「看字選意思」的干擾項(回傳單字物件)
  function meanings(word, pool, n, rand) {
    var ml = norm(word.m).length;
    var cands = (pool || []).filter(function (d) { return d && d.m && d.w !== word.w && !tooClose(d.m, word.m, true); }).map(function (d) {
      var s = 0;
      if (word.c && d.c === word.c) s += 3;                       // 同詞性:不能靠語感刪
      if (Math.abs(norm(d.m).length - ml) <= 1) s += 1.5;          // 長度相近:不能靠長短猜
      if (sharesKanji(word.w, d.w)) s += 1;                        // 形近字的意思
      if (isTransparent(word) === isTransparent(d)) s += 1;       // 同字的配同字的,選項看起來同一類
      return { d: d, s: s };
    });
    return pick(cands, n || 3, rand, function (d) { return norm(d.m); }, true);
  }
  // 「看中文選日文」的干擾項(回傳單字物件)
  function words(word, pool, n, rand) {
    var wl = String(word.w).length;
    var cands = (pool || []).filter(function (d) { return d && d.w && d.w !== word.w && d.r !== word.r && !tooClose(d.m, word.m); }).map(function (d) {
      var s = 0;
      if (word.c && d.c === word.c) s += 3;
      if (sharesKanji(word.w, d.w)) s += 3;                        // 共用漢字:電車→電話/電気
      if (String(d.w).length === wl) s += 1;
      if (script(d.w) === script(word.w)) s += 4;                 // 同字種最優先
      if (Math.abs(String(d.r || '').length - String(word.r || '').length) <= 1) s += 0.5;
      return { d: d, s: s };
    });
    return pick(cands, n || 3, rand, function (d) { return d.w; });
  }
  root.VocabDistract = { sharesKanji: sharesKanji, transparency: transparency, isTransparent: isTransparent, preferOpaque: preferOpaque, meanings: meanings, words: words, tooClose: tooClose };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.VocabDistract;
})(typeof window !== 'undefined' ? window : this);
