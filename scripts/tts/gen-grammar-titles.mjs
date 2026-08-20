// 文法句型名 TTS:清洗標題 → VOICEVOX 合成 → audio/tts/<hash>.mp3 + grammar-tts-manifest.js
// 同時輸出全量假名讀音清單(人工核對用,字音絕對不能錯)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const lib = await import(new URL('./_lib.mjs', import.meta.url));
const { audioQuery, synthesis, wavToMp3, hashText } = lib;

// 混中文的標題(唸出來是垃圾音)→ 不給音檔
const EXCLUDE = new Set(['丁寧体與普通体','其他助詞整理','普通形總整理','數量詞、時間表現','接續詞、感應詞、擬聲語','形容詞的副詞用法','動詞變化順序']);
// 朗讀文本修正(VOICEVOX 誤讀:形=かたち→けい、如何=いか→いかん、気味→ぎみ、堪えない→たえない、は(係助詞)→わ…)
const SPEAK_FIX = {
  '動詞ます形':'動詞、ますけい','て形':'てけい','辞書形、ない形':'辞書けい、ないけい','た形、なかった形':'たけい、なかったけい',
  '意向形':'いこうけい','可能形':'かのうけい','命令形、禁止形':'めいれいけい、きんしけい','条件形':'じょうけんけい',
  '受身形':'うけみけい','使役形':'しえきけい','使役受身形':'しえきうけみけい','尊敬形':'そんけいけい',
  '終助詞「ね」「よ」':'しゅうじょし、ね、よ','縮約表現':'しゅくやくひょうげん',
  '如何':'いかん','気味':'ぎみ','に堪えない':'にたえない','はおろか':'わおろか',
};
function sanitize(t) {
  let s = String(t);
  s = s.replace(/[（(][^）)]*[）)]/g, '');           // 去中文括注(含全半形混用)
  s = s.replace(/[～〜]/g, '');                      // 去波浪
  s = s.replace(/「|」/g, '、');                     // 引號 → 停頓
  s = s.replace(/[・/／]/g, '、');                   // 變體分隔 → 頓號(自然停頓)
  s = s.replace(/、+/g, '、').replace(/^、|、$/g, '').trim();
  if (EXCLUDE.has(s) || EXCLUDE.has(String(t))) return '';
  return SPEAK_FIX[s] || SPEAK_FIX[String(t)] || s;
}

const items = [];
for (const lv of ['n5','n4','n3','n2','n1']) {
  const src = fs.readFileSync(path.join(ROOT, `grammar-${lv}.js`), 'utf8');
  const re = /\{id:"([^"]+)"[^\n]*?,t:"([^"]+)"/g;
  let m; while ((m = re.exec(src))) items.push({ id: m[1], title: m[2], speak: sanitize(m[2]) });
}
console.log('文法點:', items.length);
const uniq = new Map();
for (const it of items) { if (it.speak && !uniq.has(it.speak)) uniq.set(it.speak, hashText(it.speak)); }
console.log('唯一語音文本:', uniq.size);

const kanaLog = [];
let made = 0, skipped = 0;
for (const [text, hash] of uniq) {
  const out = path.join(ROOT, 'audio/tts', hash + '.mp3');
  const q = await audioQuery(text);
  kanaLog.push(text + '\t' + (q.kana || ''));
  if (fs.existsSync(out)) { skipped++; continue; }
  const wav = await synthesis(q);
  await wavToMp3(wav, out);
  made++;
  if (made % 50 === 0) console.log('...', made);
}
console.log('新生成:', made, '既有跳過:', skipped);

// manifest:id → hash
const map = {};
for (const it of items) { if (it.speak) map[it.id] = uniq.get(it.speak); }
fs.writeFileSync(path.join(ROOT, 'grammar-tts-manifest.js'),
  '// 文法句型名 TTS 對照(gen-grammar-tts 產生,VOICEVOX 預錄)\nwindow.__TTS_G=' + JSON.stringify(map) + ';\n');
fs.writeFileSync('scripts/tts/grammar-kana-audit.tsv', kanaLog.join('\n'));
console.log('manifest + 讀音清單完成');
