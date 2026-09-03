// 日語動詞變化推導 — 給點開單字卡 modal 顯示用
// 輸入：word（漢字或假名）、reading（純假名）→ 輸出各種變化形
//
// 使用：
//   const forms = Conjugate.allForms('食べる', 'たべる');
//   forms = { masu: 'たべます', te: 'たべて', ta: 'たべた', ... }
//
// 判型策略：
//   1. 終止形 == する → suru 不規則
//   2. == くる / 来る → kuru 不規則
//   3. 終止形 == ある → aru 半不規則（ない形特殊：ない非あらない）
//   4. 結尾 'る' 且前一假名是 i/e 段 → ichidan (一段)，但有例外清單為 godan
//   5. 其他 → godan (五段)

(function (global) {
  // ── 判型資料 ──
  // 一段/五段最難分的是「-iる / -eる」結尾。判定順序:
  //   ① 漢字尾綴優先(可靠、且天然支援複合動詞:振り返る/裏切る/気に入る…)
  //   ② 假名例外清單只當備援(無漢字時)
  // ⚠️ 同音對(着る一段/切る五段、寝る/練る、居る/要る、変える/帰る、経る/減る、
  //    統べる/滑る、褪せる/焦る、鋳る/煎る)一律靠漢字分,別靠假名。

  // 「長得像一段、其實是五段」的漢字尾綴(endsWith 比對,含複合動詞)
  const GODAN_WORD_SUFFIX = [
    '切る','斬る','入る','帰る','返る','知る','走る','練る','減る','照る','散る',
    '蹴る','滑る','喋る','焦る','限る','握る','参る','混じる','交じる','雑じる',
    '捻る','抓る','捩る','湿る','陥る','罵る','遮る','嘲る','翻る','覆る',
    '蘇る','甦る','弄る','煎る','炒る','軋る','茂る','繁る','契る','漲る',
    '滾る','詰る','齧る','抉る','迸る','誹る','謗る','要る','千切る',
  ];
  // 「跟五段同音、但其實是一段」的漢字尾綴(必須先於假名清單判定)
  const ICHIDAN_WORD_SUFFIX = [
    '着る','寝る','居る','鋳る','統べる','経る','生きる','変える','替える','換える','代える',
    '老ける','更ける','捉える','捕らえる','褪せる','試みる','顧みる','省みる','率いる','用いる',
  ];
  // 假名備援:無漢字可判時,這些讀音預設五段(只收「五段那個同音字明顯更常用」或無爭議者)
  const GODAN_RU_EXCEPTIONS = new Set([
    'はいる','まいる','まじる','かえる','しる','はしる','へる','しゃべる','かぎる',
    'ける','すべる','あせる','ちる','てる','ひねる','よみがえる','ねじる','にぎる','つねる',
    // いる/きる/ねる/ふける 這類「一段那邊更常用」的同音,刻意不收 → 假名輸入時判一段
  ]);

  function endsWith(s, suffix) { return s.endsWith(suffix); }
  function trimRu(s) { return s.slice(0, -1); }

  function detectGroup(word, reading) {
    if (!reading) return 'godan';
    if (endsWith(reading, 'する')) return 'suru';
    if (reading === 'くる' || word === '来る') return 'kuru';
    if (reading === 'ある') return 'aru';
    if (endsWith(reading, 'る')) {
      const stem = reading.slice(0, -1);
      const lastKana = stem.slice(-1);
      // i-row: い き ぎ し じ ち に ひ び ぴ み り
      // e-row: え け げ せ ぜ て で ね へ べ ぺ め れ
      const iRow = 'いきぎしじちにひびぴみり';
      const eRow = 'えけげせぜてでねへべぺめれ';
      const isIE = iRow.includes(lastKana) || eRow.includes(lastKana);
      if (isIE) {
        const w = word || '';
        // ① 漢字尾綴優先(含複合動詞:振り返る/裏切る/気に入る/締め切る…)
        for (const suf of GODAN_WORD_SUFFIX)  { if (w.endsWith(suf)) return 'godan'; }
        for (const suf of ICHIDAN_WORD_SUFFIX){ if (w.endsWith(suf)) return 'ichidan'; }
        // ② 假名備援
        return GODAN_RU_EXCEPTIONS.has(reading) ? 'godan' : 'ichidan';
      }
    }
    return 'godan';
  }

  // godan て/た 形 — 看末音變音規律
  // 例外：行く / 逝く / 往く → って（不是 いて）
  function godanTe(reading) {
    if (reading === 'いく' || reading === 'ゆく') return reading.slice(0, -1) + 'って';
    const stem = reading.slice(0, -1);
    const end = reading.slice(-1);
    switch (end) {
      case 'う': case 'つ': case 'る': return stem + 'って';
      case 'く': return stem + 'いて';
      case 'ぐ': return stem + 'いで';
      case 'す': return stem + 'して';
      case 'ぬ': case 'ぶ': case 'む': return stem + 'んで';
      default: return reading + 'て';
    }
  }
  function godanTa(reading) {
    // 跟 godanTe 同規律，只是結尾 て→た / で→だ
    const te = godanTe(reading);
    return te.replace(/て$/, 'た').replace(/で$/, 'だ');
  }

  // 五段 ない形：う段 → あ段 + ない。う 變 わ（特殊）
  function godanNai(reading) {
    const stem = reading.slice(0, -1);
    const end = reading.slice(-1);
    const map = { 'う':'わ','く':'か','ぐ':'が','す':'さ','つ':'た','ぬ':'な','ぶ':'ば','む':'ま','る':'ら' };
    return stem + (map[end] || end) + 'ない';
  }

  // 五段 ます形：う段 → い段 + ます
  function godanMasu(reading) {
    const stem = reading.slice(0, -1);
    const end = reading.slice(-1);
    const map = { 'う':'い','く':'き','ぐ':'ぎ','す':'し','つ':'ち','ぬ':'に','ぶ':'び','む':'み','る':'り' };
    return stem + (map[end] || end) + 'ます';
  }

  // 五段 可能/受身/使役/命令/意向
  function godanForm(reading, fn) {
    const stem = reading.slice(0, -1);
    const end = reading.slice(-1);
    return fn(stem, end);
  }
  function godanPotential(r) {
    const map = { 'う':'え','く':'け','ぐ':'げ','す':'せ','つ':'て','ぬ':'ね','ぶ':'べ','む':'め','る':'れ' };
    return godanForm(r, (s, e) => s + (map[e] || e) + 'る');
  }
  function godanPassive(r) {
    const map = { 'う':'わ','く':'か','ぐ':'が','す':'さ','つ':'た','ぬ':'な','ぶ':'ば','む':'ま','る':'ら' };
    return godanForm(r, (s, e) => s + (map[e] || e) + 'れる');
  }
  function godanCausative(r) {
    const map = { 'う':'わ','く':'か','ぐ':'が','す':'さ','つ':'た','ぬ':'な','ぶ':'ば','む':'ま','る':'ら' };
    return godanForm(r, (s, e) => s + (map[e] || e) + 'せる');
  }
  function godanImperative(r) {
    const map = { 'う':'え','く':'け','ぐ':'げ','す':'せ','つ':'て','ぬ':'ね','ぶ':'べ','む':'め','る':'れ' };
    return godanForm(r, (s, e) => s + (map[e] || e));
  }
  function godanVolitional(r) {
    const map = { 'う':'お','く':'こ','ぐ':'ご','す':'そ','つ':'と','ぬ':'の','ぶ':'ぼ','む':'も','る':'ろ' };
    return godanForm(r, (s, e) => s + (map[e] || e) + 'う');
  }

  function allForms(word, reading) {
    const group = detectGroup(word, reading);
    const r = reading;

    if (group === 'suru') {
      // X+する → X+します / X+して / X+した / X+しない / X+できる / X+される / X+させる / X+しろ / X+しよう
      const stem = r.slice(0, -2);
      return {
        group: 'suru', label: 'サ変動詞（する）',
        masu: stem + 'します', te: stem + 'して', ta: stem + 'した', nai: stem + 'しない',
        potential: stem + 'できる', passive: stem + 'される', causative: stem + 'させる',
        imperative: stem + 'しろ', volitional: stem + 'しよう',
      };
    }
    if (group === 'kuru') {
      return {
        group: 'kuru', label: 'カ変動詞（くる）',
        masu: 'きます', te: 'きて', ta: 'きた', nai: 'こない',
        potential: 'こられる', passive: 'こられる', causative: 'こさせる',
        imperative: 'こい', volitional: 'こよう',
      };
    }
    if (group === 'aru') {
      return {
        group: 'aru', label: '特殊（ある）',
        masu: 'あります', te: 'あって', ta: 'あった', nai: 'ない',
        potential: 'ありえる', passive: '—', causative: '—',
        imperative: '—', volitional: 'あろう',
      };
    }
    if (group === 'ichidan') {
      const stem = trimRu(r);
      return {
        group: 'ichidan', label: '一段動詞（Group 2）',
        masu: stem + 'ます', te: stem + 'て', ta: stem + 'た', nai: stem + 'ない',
        potential: stem + 'られる', passive: stem + 'られる', causative: stem + 'させる',
        imperative: stem + 'ろ', volitional: stem + 'よう',
      };
    }
    // godan
    return {
      group: 'godan', label: '五段動詞（Group 1）',
      masu: godanMasu(r), te: godanTe(r), ta: godanTa(r), nai: godanNai(r),
      potential: godanPotential(r), passive: godanPassive(r), causative: godanCausative(r),
      imperative: godanImperative(r), volitional: godanVolitional(r),
    };
  }

  global.Conjugate = { detectGroup, allForms };
})(window);
