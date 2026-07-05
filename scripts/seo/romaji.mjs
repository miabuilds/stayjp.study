// Hepburn 罗马音。仅覆盖静态内容出现的假名;非假名原样返回供上层降级判断。
const BASE = {
  あ:'a',い:'i',う:'u',え:'e',お:'o',
  か:'ka',き:'ki',く:'ku',け:'ke',こ:'ko',が:'ga',ぎ:'gi',ぐ:'gu',げ:'ge',ご:'go',
  さ:'sa',し:'shi',す:'su',せ:'se',そ:'so',ざ:'za',じ:'ji',ず:'zu',ぜ:'ze',ぞ:'zo',
  た:'ta',ち:'chi',つ:'tsu',て:'te',と:'to',だ:'da',ぢ:'ji',づ:'zu',で:'de',ど:'do',
  な:'na',に:'ni',ぬ:'nu',ね:'ne',の:'no',
  は:'ha',ひ:'hi',ふ:'fu',へ:'he',ほ:'ho',ば:'ba',び:'bi',ぶ:'bu',べ:'be',ぼ:'bo',ぱ:'pa',ぴ:'pi',ぷ:'pu',ぺ:'pe',ぽ:'po',
  ま:'ma',み:'mi',む:'mu',め:'me',も:'mo',
  や:'ya',ゆ:'yu',よ:'yo',
  ら:'ra',り:'ri',る:'ru',れ:'re',ろ:'ro',
  わ:'wa',を:'o',ん:'n',
};
const YOUON = {
  きゃ:'kya',きゅ:'kyu',きょ:'kyo',ぎゃ:'gya',ぎゅ:'gyu',ぎょ:'gyo',
  しゃ:'sha',しゅ:'shu',しょ:'sho',じゃ:'ja',じゅ:'ju',じょ:'jo',
  ちゃ:'cha',ちゅ:'chu',ちょ:'cho',にゃ:'nya',にゅ:'nyu',にょ:'nyo',
  ひゃ:'hya',ひゅ:'hyu',ひょ:'hyo',びゃ:'bya',びゅ:'byu',びょ:'byo',ぴゃ:'pya',ぴゅ:'pyu',ぴょ:'pyo',
  みゃ:'mya',みゅ:'myu',みょ:'myo',りゃ:'rya',りゅ:'ryu',りょ:'ryo',
};
// 片假名→平假名(统一处理);範囲 ァ..ヶ
function kataToHira(s) {
  return s.replace(/[ァ-ヶ]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60));
}
export function kanaToRomaji(input) {
  const s = kataToHira(input);
  let out = '';
  let i = 0;
  while (i < s.length) {
    const two = s.slice(i, i + 2);
    if (YOUON[two]) { out += YOUON[two]; i += 2; continue; }
    const ch = s[i];
    if (ch === 'っ') { // 促音:重复下个罗马音首字母
      const nextTwo = s.slice(i + 1, i + 3);
      const nextRomaji = YOUON[nextTwo] || BASE[s[i + 1]] || '';
      if (nextRomaji) out += nextRomaji[0];
      i += 1; continue;
    }
    if (ch === 'ー') { // 长音:重复前一个元音
      const last = out[out.length - 1];
      if ('aiueo'.includes(last)) out += last;
      i += 1; continue;
    }
    if (BASE[ch]) { out += BASE[ch]; i += 1; continue; }
    out += ch; // 非假名(汉字/符号)原样保留
    i += 1;
  }
  return out;
}
