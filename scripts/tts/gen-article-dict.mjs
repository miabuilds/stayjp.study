// 文章字典詞 TTS:用字典自帶的「假名讀音」合成(字音必對),輸出獨立 manifest(article-dict-tts.js)
// 在 manifest.js 之後載入、Object.assign 進 window.__TTS——不會被 tts:generate 重寫掉。
import fs from 'node:fs';
import path from 'node:path';
const lib = await import(new URL('./_lib.mjs', import.meta.url));
const { audioQuery, synthesis, wavToMp3, hashText, ROOT } = lib;
global.window = {};
eval(fs.readFileSync(path.join(ROOT, 'article-dict.js'), 'utf8'));
const dict = window.ARTICLE_DICT || {};
const map = {};
let made = 0, skip = 0;
for (const [w, v] of Object.entries(dict)) {
  const reading = Array.isArray(v) ? v[0] : (v && v.r);
  if (!reading) continue;
  const hash = hashText(w);
  map[w] = hash;
  const out = path.join(ROOT, 'audio/tts', hash + '.mp3');
  if (fs.existsSync(out)) { skip++; continue; }
  const q = await audioQuery(reading);   // 用假名讀音合成,不讓 VOICEVOX 猜漢字
  const wav = await synthesis(q);
  await wavToMp3(wav, out);
  if (++made % 60 === 0) console.log('...', made);
}
fs.writeFileSync(path.join(ROOT, 'article-dict-tts.js'),
  '// 文章字典詞發音(gen-article-dict 產生;讀音來自字典假名,載入於 manifest.js 之後)\n'
  + 'if(window.__TTS) Object.assign(window.__TTS,' + JSON.stringify(map) + ');\n');
console.log('done. 新生成:', made, '既有:', skip, '總詞:', Object.keys(map).length);
