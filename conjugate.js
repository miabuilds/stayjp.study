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
  // Godan exceptions：「結尾 -iる/-eる 卻其實是 godan」的常見動詞
  // 用 reading 比對最可靠
  const GODAN_RU_EXCEPTIONS = new Set([
    'いる','はいる','まいる','まじる','かえる','とおる','しる','きる','はしる',
    'ねる','へる','しゃべる','かぎる','ける','すべる','あせる','ふける','まじる',
    'いきる','ちる','てる','ねる','ひねる','よみがえる','けずる','ねじる',
    'おしる','こだわる','たまる','よみがえる','ふけ','とらえる',
    // よくある覚えづらい例外
    'にぎる','すべる','つねる','せまる','とどまる','ひねる','たまる','まじる',
    'のぼる','まいる','よる','まじる','ねじる','ねたむ','ねる',
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
      if (isIE && !GODAN_RU_EXCEPTIONS.has(reading)) return 'ichidan';
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
