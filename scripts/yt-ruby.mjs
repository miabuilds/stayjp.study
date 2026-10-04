// YouTube 跟讀:幫快取裡每句字幕補「逐詞讀音」(tk),前端用它畫注音＋點字查詢。
//
// 為什麼要這個:前端 furiganaHTML 只認站上字庫(N5~N1 單字+文法例句),字幕裡的 扉/災い/骸骨
// 這類字沒收就一片空白(用戶回饋:「漢字能不能加平假名?不然不知道怎麼唸」)。
// 這裡用 kuromoji 斷詞給讀音,跟 scripts/tts/gen-speak-ruby.mjs 同一套引擎。
//
// 寫入格式:lines[i].tk = ['表層\t平假名讀音\t原形', ...];沒漢字的詞只存 '表層' 省空間。
// (Firestore 不收巢狀陣列,所以用 tab 分隔字串,前端 split('\t'))
// 讀音是機器判讀,偶爾會錯(多音字/人名),前端標「自動注音」並留回報入口。
//
// 2026-10-04 加 tp(詞性):lines[i].tp 跟 tk 一一對應,'代碼' 或 '代碼\t原形'(原形=表層時省略)。
//   代碼:N 名詞 n 非自立名詞(こと/の/ん) V 動詞 A 形容詞 x 非自立動形/接尾/接頭(ている的いる、お/ご)
//         D 副詞 R 連体詞 C 接続詞 I 感動詞 F 填充詞 P 助詞 X 助動詞 S 記號/數字 O 其他
//   前端(yt-word.js)靠它決定:助詞/助動詞不畫虛線、假名動詞(して/いって)用原形查。
//   純假名句以前不存 tk,現在也存(全是純表層字串,舊前端畫出來跟原本一模一樣 → 向下相容)。
//
// 用法:node scripts/yt-ruby.mjs            快取裡所有影片,缺 tk/tp 的補上
//       node scripts/yt-ruby.mjs --force    全部重算(改了修正表之後跑)
//       node scripts/yt-ruby.mjs <id...>    只處理指定影片
//       node scripts/yt-ruby.mjs --json in.json out.json   離線:處理一個 ytCaptions 回應檔(不碰 Firestore,測試/抽樣用)
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const kuromoji = require('kuromoji');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const COL = 'yt_captions_cache';
const k2h = s => (s || '').replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
const hasKanji = s => /[一-鿿々〆ヶ]/.test(s);

// kuromoji 常錯的固定組合:「何+量詞」會切成 何[なに]+曜日,實際讀 なん
const NAN_NEXT = /^(曜日|時|日|人|回|分|年|月|個|本|枚|匹|杯|歳|才|冊|階|台|度|番|名|週間|か月|ヶ月|時間)/;
const FIX_WORD = { '一日中': 'いちにちじゅう', '今日': 'きょう', '明日': 'あした', '昨日': 'きのう', '今年': 'ことし', '大人': 'おとな', '一人': 'ひとり', '二人': 'ふたり', '上手': 'じょうず', '下手': 'へた', '時計': 'とけい', '眼鏡': 'めがね', '風邪': 'かぜ', '一日': 'いちにち' };

// kuromoji(IPADIC)詞性 → 一字代碼(說明見檔頭)
function posCode(t) {
  const p = t.pos, d = t.pos_detail_1;
  if (p === '記号') return 'S';
  if (p === '助詞') return 'P';
  if (p === '助動詞') return 'X';
  if (p === '接頭詞') return 'x';
  if (p === '動詞' || p === '形容詞') return (d === '非自立' || d === '接尾') ? 'x' : (p === '動詞' ? 'V' : 'A');
  if (p === '名詞') {
    if (d === '数') return 'S';
    if (d === '非自立' || d === '接尾' || d === '特殊') return 'n';
    return 'N';
  }
  if (p === '副詞') return 'D';
  if (p === '連体詞') return 'R';
  if (p === '接続詞') return 'C';
  if (p === '感動詞') return 'I';
  if (p === 'フィラー') return 'F';
  return 'O';
}
function posOf(tok, text) {
  return tok.tokenize(text).map(t => {
    const c = posCode(t);
    const base = t.basic_form && t.basic_form !== '*' && t.basic_form !== t.surface_form ? t.basic_form : '';
    return base ? c + '\t' + base : c;
  });
}

function tokenize(tok, text) {
  const ts = tok.tokenize(text);
  const out = [];
  for (let i = 0; i < ts.length; i++) {
    const t = ts[i];
    const surf = t.surface_form;
    if (!hasKanji(surf)) { out.push(surf); continue; }
    let rd = k2h(t.reading || '');
    if (!rd || /[一-鿿]/.test(rd)) { out.push(surf); continue; }   // 未知詞:kuromoji 沒讀音 → 不標(寧缺勿錯)
    if (surf === '何' && ts[i + 1] && NAN_NEXT.test(ts[i + 1].surface_form)) rd = 'なん';
    if (FIX_WORD[surf]) rd = FIX_WORD[surf];
    const base = t.basic_form && t.basic_form !== '*' && t.basic_form !== surf ? t.basic_form : '';
    out.push(base ? surf + '\t' + rd + '\t' + base : surf + '\t' + rd);
  }
  // 「何」+ 量詞被切成兩個詞時,kuromoji 給「何曜日」整體偶爾也會黏成一個 token(讀 なにようび)→ 修
  return out.map(o => {
    const p = o.split('\t'); if (p.length < 2) return o;
    if (p[0].startsWith('何') && p[1].startsWith('なに') && NAN_NEXT.test(p[0].slice(1))) p[1] = 'なん' + p[1].slice(2);
    return p.join('\t');
  });
}

const tok = await new Promise((res, rej) => kuromoji.builder({ dicPath: path.join(ROOT, 'node_modules/kuromoji/dict') }).build((e, t) => e ? rej(e) : res(t)));
const args = process.argv.slice(2);
const force = args.includes('--force');
// 每句:tk(表層/讀音/原形)+ tp(詞性/原形),兩者同一次斷詞 → 長度一定相同
function annotate(l) {
  const ja = l.ja || '';
  if (!ja.trim()) { delete l.tk; delete l.tp; return; }
  l.tk = tokenize(tok, ja);
  l.tp = posOf(tok, ja);
  if (l.tk.length !== l.tp.length) { delete l.tp; console.warn('tk/tp 長度不符,略過 tp:', ja); }
}
const ji = args.indexOf('--json');
if (ji >= 0) {
  const [inF, outF] = [args[ji + 1], args[ji + 2]];
  const x = JSON.parse(fs.readFileSync(inF, 'utf8'));
  (x.lines || []).forEach(annotate);
  fs.writeFileSync(outF || inF, JSON.stringify(x));
  console.log(`離線完成:${(x.lines || []).length} 句 → ${outF || inF}`);
  process.exit(0);
}
const { db } = await import('./lib/fire-admin.mjs');
const ids = args.filter(a => /^[A-Za-z0-9_-]{11}$/.test(a));
const docs = ids.length ? await Promise.all(ids.map(v => db.collection(COL).doc(v).get())) : (await db.collection(COL).get()).docs;
let n = 0;
for (const d of docs) {
  if (!d.exists) { console.log('沒快取:', d.id); continue; }
  const x = d.data(); const lines = x.lines || [];
  if (!force && lines.every(l => (l.tk && l.tp) || !(l.ja || '').trim())) continue;
  lines.forEach(annotate);
  await d.ref.update({ lines, rubyAt: Date.now() });
  n++;
  console.log(`✅ ${d.id} ${String(lines.length).padStart(3)}句 | ${(x.title || '').slice(0, 30)}`);
}
console.log(`完成:更新 ${n} 支`);
process.exit(0);
