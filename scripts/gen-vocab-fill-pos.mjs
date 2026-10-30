#!/usr/bin/env node
// 補單字第二步:公開 JLPT 字表名詞太多、動詞/形容詞/副詞不夠 → 請 Claude 依詞性提案該級別常見字,再用 JMdict 驗證真的存在、讀音對得上,
// 輸出成 gen-vocab-fill.mjs 吃的候選格式(word/furigana/meaning)。
// 用法:node scripts/gen-vocab-fill-pos.mjs <jmdict-simplified.json> <out-dir> <need.json:{n2:{動:25,い形:61,…}}> [--exclude-dir <newvocab-dir>]
import fs from 'node:fs';
import path from 'node:path';
try { process.loadEnvFile(new URL('../.env', import.meta.url)); } catch {}
const KEY = process.env.PROJECT_ANTHROPIC_KEY; if (!KEY) { console.error('no key'); process.exit(1); }
const [jmFile, outDir, needFile] = process.argv.slice(2); const args = process.argv.slice(5);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const need = JSON.parse(fs.readFileSync(needFile, 'utf8'));
fs.mkdirSync(outDir, { recursive: true });
// 站內已有 + 第一輪已產的字
const have = new Set();
for (const lv of ['n5', 'n4', 'n3', 'n2', 'n1']) for (const m of fs.readFileSync(`vocab-${lv}.js`, 'utf8').matchAll(/\{w:"([^"]+)",r:"([^"]*)"/g)) { have.add(m[1]); have.add(m[2]); }
if (opt('--exclude-dir', null)) for (const lv of ['n4', 'n3', 'n2']) { try { JSON.parse(fs.readFileSync(path.join(opt('--exclude-dir'), `${lv}.json`), 'utf8')).forEach(e => { have.add(e.w); have.add(e.r); }); } catch (e) {} }
// JMdict:字 → 讀音集合
const jm = JSON.parse(fs.readFileSync(jmFile, 'utf8')); const JM = new Map(); const kanaWords = new Set();
for (const w of jm.words) { const ks = w.kanji.map(k => k.text); const rs = w.kana.map(k => k.text); for (const k of ks) { if (!JM.has(k)) JM.set(k, new Set()); rs.forEach(r => JM.get(k).add(r)); } if (!ks.length) rs.forEach(r => kanaWords.add(r)); }
const kataToHira = s => s.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
const LV = { n4: 'JLPT N4', n3: 'JLPT N3', n2: 'JLPT N2' };
const POS = { '動': '動詞(原形)', 'い形': 'い形容詞', 'な形': 'な形容詞(不要加な)', '副': '副詞', '他': '其他(連體詞、接續詞、感嘆詞、助數詞、連語等)' };
async function propose(lv, c, n, exclude) {
  const body = { model: 'claude-sonnet-5-5', max_tokens: 16000, system: '你是日語教材編輯。只輸出 JSON 陣列,每項 {"w":"字(常用寫法)","r":"讀音平假名","m":"英文意思(簡短)"}。', messages: [{ role: 'user', content: `列出 ${n} 個 ${LV[lv]} 程度、學習者必學的${POS[c]}。條件:常用、現代、非專有名詞;不可以是下面這些已收錄的字(含同義寫法):\n${exclude.join('、')}` }] };
  for (let a = 0; a < 3; a++) { try { const r = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'content-type': 'application/json', 'x-api-key': KEY, 'anthropic-version': '2023-06-01' }, body: JSON.stringify(body) }); const d = await r.json(); const t = d.content.map(c => c.text || '').join(''); return JSON.parse(t.slice(t.indexOf('['), t.lastIndexOf(']') + 1)); } catch (e) { if (a === 2) { console.error('propose fail', lv, c, e.message.slice(0, 100)); return []; } await new Promise(r => setTimeout(r, 3000)); } }
}
const stats = [];
for (const lv of Object.keys(need)) {
  const out = []; const seen = new Set();
  // 排除清單:同詞性的既有字(從 vocab 檔抓 c 相同的)
  const exclByC = {}; for (const l of ['n5', 'n4', 'n3', 'n2', 'n1']) for (const m of fs.readFileSync(`vocab-${l}.js`, 'utf8').matchAll(/\{w:"([^"]+)",r:"([^"]*)",m:"[^"]*",c:"([^"]*)"/g)) (exclByC[m[3]] = exclByC[m[3]] || []).push(m[1]);
  for (const [c, n] of Object.entries(need[lv])) {
    if (!n) continue; let got = 0, rounds = 0, bad = 0;
    while (got < n && rounds < 4) {
      rounds++;
      const excl = (exclByC[c] || []).concat(out.filter(x => x.c === c).map(x => x.word));
      const arr = await propose(lv, c, Math.min(40, Math.ceil((n - got) * 1.6) + 6), excl.slice(-600));
      for (const it of arr) {
        const w = String(it.w || '').trim(), r = kataToHira(String(it.r || '').trim());
        if (!w || !r || have.has(w) || seen.has(w) || (/^[ぁ-んァ-ヶー]+$/.test(w) && have.has(r))) continue;
        const okJM = /^[ぁ-んァ-ヶー]+$/.test(w) ? (kanaWords.has(w) || JM.size && [...JM.values()].some(() => false) || kanaWords.has(kataToHira(w))) : (JM.has(w) && [...JM.get(w)].some(x => kataToHira(x) === r));
        if (!okJM) { bad++; continue; }
        seen.add(w); out.push({ word: w, furigana: r, meaning: String(it.m || ''), level: lv.replace('n', ''), c }); got++;
        if (got >= n) break;
      }
    }
    stats.push(`${lv} ${c}: need ${n} got ${got} (rounds ${rounds}, JMdict 擋掉 ${bad})`);
    console.log(stats[stats.length - 1]);
  }
  fs.writeFileSync(path.join(outDir, `cand-${lv}.json`), JSON.stringify(out));
}
