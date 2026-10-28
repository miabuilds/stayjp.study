// gen-l10n.mjs — 全站多語言翻譯產生器(ko / vi / id / th,以及 en 補缺)。
//
// 設計:每個「part」= 一種來源資料 → 翻成目標語言 → 快取成 scripts/out/l10n/<lang>/<part>.json(可中斷續跑)
//      → `build` 把快取組成前端要吃的 .js 檔(lang/<lang>.js、content-<lang>.js …)。
// 翻譯來源一律給「繁中原文 + 英文參考(若有)」,目標語言從日文教學的角度翻,日文一律原樣保留。
//
// 用法:
//   node scripts/gen-l10n.mjs <part> <lang> [limit]     翻某 part(limit=只翻前 N 個單位,抽驗用)
//   node scripts/gen-l10n.mjs all <lang>                依序翻全部 part(不含 gdetail)
//   node scripts/gen-l10n.mjs build <lang>              組出前端檔
//   node scripts/gen-l10n.mjs status                    各語言各 part 進度
// part:i18n ui content rl drill drilltrans articles misc native gdetail
// key:專案根目錄 .env 的 PROJECT_ANTHROPIC_KEY(新創組織),跑前會驗組織 ID。
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUTDIR = path.join(ROOT, 'scripts', 'out', 'l10n');
const APP_ROOT = path.join(ROOT, '..', 'stayjp-app');
const MODEL = process.env.L10N_MODEL || 'claude-sonnet-5-5';
const ORG_OK = '4de38567-a7f1-4b91-9882-c1d62fdb708c';

const LANGS = {
  en: { name: 'English', style: 'Natural, concise English for an adult learner. Sentence case for UI.' },
  ko: { name: 'Korean (한국어)', style: '자연스러운 한국어. UI 문구와 설명은 해요체(예: ~해요, ~하세요)로 통일하고, 번역투 없이 한국 학습 앱처럼 쓰세요. 외래어는 표준 표기(예: 앱, 퀴즈, 프리미엄).' },
  vi: { name: 'Vietnamese (Tiếng Việt)', style: 'Tiếng Việt tự nhiên, xưng "bạn", giọng thân thiện như app học tiếng Nhật ở Việt Nam. Viết có dấu đầy đủ. UI ngắn gọn.' },
  id: { name: 'Indonesian (Bahasa Indonesia)', style: 'Bahasa Indonesia yang alami dan ramah, pakai "kamu" (bukan Anda), seperti aplikasi belajar bahasa Jepang populer di Indonesia. UI singkat.' },
  th: { name: 'Thai (ภาษาไทย)', style: 'ภาษาไทยธรรมชาติ สุภาพ ใช้ "คุณ" หลีกเลี่ยงคำลงท้ายระบุเพศ (ไม่ใส่ ครับ/ค่ะ) เหมือนแอปเรียนภาษาญี่ปุ่นในไทย UI กระชับ' },
};
const MASCOT = { en: 'Tanuki', ko: '타누키', vi: 'Tanuki', id: 'Tanuki', th: 'ทานูกิ' };
// build 時把各批次不一致的吉祥物譯名統一
const MASCOT_FIX = { ko: [/샤오리|너구리|小狸/g, /(?:타누키 )?(?<!카테)고리(?=에게|가 |의 |는 |한테|를 )/g], vi: [/Tiểu Ly|tanuki|小狸/g], id: [/tanuki|小狸/g], th: [/แรคคูน|小狸/g] };
const PARTS = ['i18n', 'ui', 'content', 'rl', 'drill', 'drilltrans', 'articles', 'misc', 'native', 'gdetail'];

// ── key / API ──
function loadKey() {
  const env = fs.readFileSync(path.join(ROOT, '.env'), 'utf8');
  const m = env.match(/^PROJECT_ANTHROPIC_KEY=\s*"?([^"\n]+)"?/m);
  if (!m) throw new Error('.env 沒有 PROJECT_ANTHROPIC_KEY');
  return m[1].trim();
}
let KEY = null;
async function ensureKey() {
  if (KEY) return KEY;
  KEY = loadKey();
  const r = await fetch('https://api.anthropic.com/v1/models', { headers: { 'x-api-key': KEY, 'anthropic-version': '2023-06-01' } });
  const org = r.headers.get('anthropic-organization-id');
  if (org !== ORG_OK) throw new Error('API key 組織不對(' + org + '),停止。請確認 .env 的 PROJECT_ANTHROPIC_KEY 是新創組織的 key');
  return KEY;
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function callClaude(system, user, maxTokens = 16000) {
  await ensureKey();
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-api-key': KEY, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: MODEL, max_tokens: maxTokens, system, messages: [{ role: 'user', content: user }] }),
      });
      if (r.status === 429 || r.status === 529 || r.status >= 500) {
        const wait = Math.min(60000, 3000 * Math.pow(2, attempt)) + Math.random() * 2000;
        process.stderr.write(`  [${r.status}] 等 ${Math.round(wait / 1000)}s 重試\n`);
        await sleep(wait); continue;
      }
      const j = await r.json();
      if (j.error) throw new Error(j.error.message || JSON.stringify(j.error));
      const text = (j.content || []).map(c => c.text || '').join('');
      if (j.stop_reason === 'max_tokens') throw new Error('max_tokens 截斷');
      return text;
    } catch (e) {
      if (attempt >= 5) throw e;
      process.stderr.write(`  [err] ${String(e.message).slice(0, 120)} → 重試\n`);
      await sleep(2000 * (attempt + 1));
    }
  }
}
function parseJSON(text) {
  let s = text.trim();
  s = s.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  const a = s.indexOf('{'), b = s.lastIndexOf('}');
  if (a < 0 || b < 0) throw new Error('回覆沒有 JSON');
  const body = s.slice(a, b + 1);
  try { return JSON.parse(body); } catch (e) { return JSON.parse(repairQuotes(body)); }
}
// 模型偶爾在字串值裡放未跳脫的 "(例如印尼文/泰文詳解裡的引號)→ 逐字掃:字串內的 " 若後面(略過空白)不是 , } ] : 就當成內文引號跳脫
function repairQuotes(src) {
  let out = '', inStr = false;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (!inStr) { if (ch === '"') inStr = true; out += ch; continue; }
    if (ch === '\\') { out += ch + (src[i + 1] || ''); i++; continue; }
    if (ch === '"') {
      let j = i + 1; while (j < src.length && /\s/.test(src[j])) j++;
      const nx = src[j];
      if (nx === ',' || nx === '}' || nx === ']' || nx === ':' || j >= src.length) { inStr = false; out += ch; }
      else out += '\\"';
      continue;
    }
    out += ch;
  }
  return out;
}

// ── helpers:載入前端 JS 資料檔 ──
function evalFile(file, expr) {
  const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const w = {};
  new Function('window', 'document', 'localStorage', 'navigator', src + `\n;window.__v=(${expr});`)(w, { cookie: '' }, { getItem() { return null; }, setItem() {} }, { languages: ['zh-TW'] });
  return w.__v;
}
function readContentData() { return JSON.parse(fs.readFileSync(path.join(ROOT, 'content-data.json'), 'utf8')).data; }
function lit(s) { try { return new Function('return ' + s)(); } catch (_) { return null; } }
const CJK = /[一-鿿]/;
const KANA = /[぀-ヿ]/;

function cachePath(lang, part) { return path.join(OUTDIR, lang, part + '.json'); }
function loadCache(lang, part) { try { return JSON.parse(fs.readFileSync(cachePath(lang, part), 'utf8')); } catch (_) { return {}; } }
function saveCache(lang, part, obj) { fs.mkdirSync(path.dirname(cachePath(lang, part)), { recursive: true }); fs.writeFileSync(cachePath(lang, part), JSON.stringify(obj, null, 0)); }

// ── 共用規則 ──
function baseRules(lang) {
  const L = LANGS[lang];
  return `You are localizing a Japanese-learning app (JLPT N5–N1, made in Taiwan) from Traditional Chinese into ${L.name}.
Style: ${L.style}

Hard rules:
- Keep ALL Japanese text exactly as-is (kana, kanji, 「」 quotes, ～, <em>…</em>). Never translate, romanize or re-spell Japanese.
- Keep HTML tags, placeholders ({n}, {lv}, {date}, $1, %s), numbers, NT$ prices, emoji and leading/trailing spaces exactly as in the source.
- Explain grammar for a ${L.name}-speaking learner: when the Chinese text contrasts Japanese with Chinese, re-anchor the contrast to ${L.name} where natural (or drop the Chinese-specific remark if it makes no sense for the reader). Never leave Chinese characters that are meant as Chinese (not Japanese).
- An English reference is sometimes given; it is only a hint for meaning, not the thing to translate. Translate from the meaning, write natural ${L.name}.
- Glossary (keep consistent): 小狸 = the app's tanuki mascot → ${MASCOT[lang]}; 日本再留計劃 / StayJP = the product name → "StayJP"; 跟讀 = shadowing (repeat after audio); 刷題 = drill practice; 闖關 = stage/level path; 讀解 = reading comprehension; 聽解 = listening; 模擬考 = mock exam; 單字本 = word notebook; 讀書小屋 = study room; 繪本 = picture book.
- Output ONLY one JSON object, no markdown fence, no commentary. Same keys as the input.`;
}

// ── 通用批次翻譯:units = {key: srcObj} → 回 {key: outObj} ──
async function runBatches({ lang, part, units, batchSize, par, system, maxTokens, validate, limit, render, norm }) {
  const done = loadCache(lang, part);
  const keys = Object.keys(units).filter(k => !done[k]);
  const todo = limit ? keys.slice(0, limit) : keys;
  console.log(`[${lang}/${part}] 單位 ${Object.keys(units).length},已翻 ${Object.keys(done).length},這次 ${todo.length}`);
  if (!todo.length) return done;
  const batches = [];
  for (let i = 0; i < todo.length; i += batchSize) batches.push(todo.slice(i, i + batchSize));
  let idx = 0, ok = 0, bad = 0;
  async function worker() {
    while (idx < batches.length) {
      const b = batches[idx++];
      const payload = {}; b.forEach(k => { payload[k] = render ? render(units[k]) : units[k]; });
      try {
        const text = await callClaude(system, 'Translate these (JSON):\n' + JSON.stringify(payload, null, 1), maxTokens);
        const out = parseJSON(text);
        let n = 0;
        for (const k of b) {
          if (out[k] == null) continue;
          if (norm) out[k] = norm(out[k]);
          if (validate && !validate(units[k], out[k])) { try { fs.appendFileSync(path.join(OUTDIR, lang, '_fail-' + part + '.log'), k + '\t' + JSON.stringify(out[k]).slice(0, 4000) + '\n'); } catch (_) {} continue; }
          done[k] = out[k]; n++;
        }
        ok += n; bad += b.length - n;
        saveCache(lang, part, done);
        process.stdout.write(`  ${lang}/${part} ${Object.keys(done).length}/${Object.keys(units).length} (+${n}${n < b.length ? ' 缺' + (b.length - n) : ''})\n`);
      } catch (e) {
        bad += b.length;
        process.stderr.write(`  [${lang}/${part}] 批次失敗: ${String(e.message).slice(0, 160)}\n`);
      }
    }
  }
  await Promise.all(Array.from({ length: par }, worker));
  console.log(`[${lang}/${part}] 完成 ok=${ok} bad=${bad}`);
  return done;
}

// ═══════════════ 來源:各 part ═══════════════

// i18n.js 的 zh-TW / en 字典
function loadI18nDicts() {
  const src = fs.readFileSync(path.join(ROOT, 'i18n.js'), 'utf8');
  const a = src.indexOf('const dict = ');
  const b = src.indexOf('// OpenCC 繁→簡 converter');
  let obj = src.slice(a + 'const dict = '.length, b).trim();
  obj = obj.replace(/;\s*$/, '');
  return new Function('return ' + obj)();
}
function unitsI18n() {
  const d = loadI18nDicts();
  const units = {};
  for (const [k, v] of Object.entries(d['zh-TW'])) units[k] = { zh: v, en: d.en[k] };
  return units;
}

// UI 對照表:ui-map 鍵 + enOr(zh,en) 字串 + 頁面靜態文字 + 分類/主題名
function extractPairs() {
  const files = fs.readdirSync(ROOT).filter(f => /\.(js|html)$/.test(f) && !/^(ui-map|content-|jlpt-questions-|reading-listening-|jlpt-q-trans-|articles-|misc-|grammar-detail-)/.test(f) && !/^(sw|i18n)\.js$/.test(f));
  const re = /\b(?:enOr|L|eo|Lc|E|pick|_en|tr|_T)\(\s*('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`[^`$]*`)\s*,\s*('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`[^`$]*`)(?:\s*,\s*('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`[^`$]*`))?\s*\)/g;   // 第三參數 = Campaign.tr / _T 的簡中,忽略
  // 含 ${…} 的樣板字串:把每個 ${…} 換成 #(執行期 I18n.pick 會把數字正規化成 # 再查,見 i18n.js)
  const reT = /\b(?:enOr|L|eo|Lc|E|pick|_en|tr|_T)\(\s*(`(?:[^`\\]|\\.)*`)\s*,\s*(`(?:[^`\\]|\\.)*`)\s*\)/g;
  const tpl = s => s.slice(1, -1).replace(/\$\{[^}]*\}/g, '#').replace(/\\`/g, '`');
  const pairs = {};
  // 字串串接(L('連續 ' + n + ' 天', n + '-day streak')):手動掃括號,頂層逗號切兩個參數,每段以頂層 + 切開,非字面值的段落換成 #
  function concatPairs(s, out) {
    const call = /\b(?:enOr|L|eo|Lc|E|pick|_en|tr|_T)\(/g; let m;
    while ((m = call.exec(s))) {
      let i = m.index + m[0].length, depth = 1, q = null, args = [], cur = '';
      for (; i < s.length && depth > 0; i++) {
        const ch = s[i];
        if (q) { cur += ch; if (ch === '\\') { cur += s[++i]; continue; } if (ch === q) q = null; continue; }
        if (ch === '\'' || ch === '"' || ch === '`') { q = ch; cur += ch; continue; }
        if (ch === '(') depth++; else if (ch === ')') { depth--; if (depth === 0) break; }
        if (ch === ',' && depth === 1) { args.push(cur); cur = ''; continue; }
        cur += ch;
      }
      args.push(cur);
      if (args.length === 3 && /(?:tr|_T)\($/.test(m[0])) args.length = 2;   // Campaign.tr / _T(zh, en, cn)
      if (args.length !== 2) continue;
      if (!args.some(a => a.includes('+'))) continue;   // 單一字面值的上面 regex 已處理
      const piece = a => {
        // 以頂層 + 切段(字串內的 + 不算)
        const parts = []; let d = 0, qq = null, c = '';
        for (let j = 0; j < a.length; j++) { const ch = a[j]; if (qq) { c += ch; if (ch === '\\') { c += a[++j]; continue; } if (ch === qq) qq = null; continue; } if (ch === '\'' || ch === '"' || ch === '`') { qq = ch; c += ch; continue; } if (ch === '(') d++; if (ch === ')') d--; if (ch === '+' && d === 0) { parts.push(c); c = ''; continue; } c += ch; }
        parts.push(c);
        return parts.map(x => { x = x.trim(); if (/^(['"`])[\s\S]*\1$/.test(x)) { const v = x[0] === '`' ? tpl(x) : lit(x); return v == null ? null : v; } return '#'; });
      };
      const zhP = piece(args[0]), enP = piece(args[1]);
      if (zhP.includes(null) || enP.includes(null)) continue;
      const zh = zhP.join('').trim(), en = enP.join('').trim();
      if (!CJK.test(zh) || /[`$]/.test(zh) || zh.includes('##')) continue;
      if (!out[zh]) out[zh] = en;
    }
  }
  for (const f of files) {
    const s = fs.readFileSync(path.join(ROOT, f), 'utf8');
    let m; while ((m = re.exec(s))) { const zh = lit(m[1]), en = lit(m[2]); if (zh && en && CJK.test(zh)) pairs[zh.trim()] = en.trim(); }
    while ((m = reT.exec(s))) { if (!m[1].includes('${')) continue; const zh = tpl(m[1]), en = tpl(m[2]); if (CJK.test(zh) && !/[`$]/.test(zh)) pairs[zh.trim()] = en.trim(); }
    concatPairs(s, pairs);
  }
  // 人工補的缺口(瀏覽器掃出來還是中文的字串):scripts/out/l10n/ui-extra.json = ["繁中", …]
  try { for (const zh of JSON.parse(fs.readFileSync(path.join(OUTDIR, 'ui-extra.json'), 'utf8'))) if (CJK.test(zh) && !pairs[zh]) pairs[zh] = undefined; } catch (_) {}
  return pairs;
}
const STATIC_PAGES = ['speak.html', 'speak-chat.html', 'yt-shadow.html', 'wordguess.html', 'jlpt-drill.html', 'skits.html', 'essentials.html', 'conjunctions.html', 'phrases.html', 'about.html', 'howto.html', 'changelog.html', 'jlpt.html', 'buddy.html', 'group.html', 'onboarding-v2.html', 'jlpt-self-study-plan.html', 'jlpt-app-guide.html', 'delete-account.html', 'tsukimi.html', 'index.html', 'pricing.html', 'account.html', 'contact.html', 'partner.html', 'refund.html', 'privacy.html', 'terms.html', 'verbs.html', 'app.html', 'ai-japanese-speaking-app.html', 'group-beta.html'];
function extractStaticText() {
  const set = new Set();
  for (const f of STATIC_PAGES) {
    let s; try { s = fs.readFileSync(path.join(ROOT, f), 'utf8'); } catch (_) { continue; }
    s = s.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<!--[\s\S]*?-->/g, ' ');
    // 屬性
    for (const m of s.matchAll(/\b(?:placeholder|title|aria-label|alt|content)="([^"]*)"/g)) { const t = m[1].trim(); if (CJK.test(t) && !KANA.test(t) && t.length <= 400) set.add(t); }
    // 文字節點
    for (const m of s.matchAll(/>([^<>]+)</g)) {
      const t = m[1].replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
      if (!t || t.length > 400 || !CJK.test(t) || KANA.test(t)) continue;
      set.add(t);
    }
  }
  return [...set];
}
function unitsUi(lang) {
  const uimap = evalFile('ui-map.js', 'window.__UI_MAP');
  const pairs = extractPairs();
  const units = {};
  for (const [zh, en] of Object.entries(uimap)) units[zh] = { zh, en };
  for (const [zh, en] of Object.entries(pairs)) if (!units[zh]) units[zh] = en ? { zh, en } : { zh };
  // 分類 / 主題 / 題型名(app.html、listening.js 內的小對照表)
  const app = fs.readFileSync(path.join(ROOT, 'app.html'), 'utf8');
  for (const name of ['CAT_EN', '_THEME_EN']) {
    const m = app.match(new RegExp('const ' + name + ' = (\\{[\\s\\S]*?\\});'));
    if (m) { const o = lit(m[1]) || {}; for (const [zh, en] of Object.entries(o)) if (!units[zh]) units[zh] = { zh, en }; }
  }
  const ls = fs.readFileSync(path.join(ROOT, 'listening.js'), 'utf8').match(/_TYPE_EN = (\{[^}]*\})/);
  if (ls) { const o = lit(ls[1]) || {}; for (const [zh, en] of Object.entries(o)) if (!units[zh]) units[zh] = { zh, en }; }
  for (const zh of extractStaticText()) if (!units[zh]) units[zh] = { zh };
  if (lang === 'en') { for (const k of Object.keys(units)) if (units[k].en) delete units[k]; }   // en 只補缺
  return units;
}
function unitsUiPatterns() {
  const pats = evalFile('ui-map.js', 'window.__UI_PATTERNS') || [];
  const units = {};
  pats.forEach((p, i) => { units['p' + i] = { pattern: p.pattern, en: p.en }; });
  return units;
}

// 內容:文法 / 單字 / 易混淆
function unitsContent(lang) {
  const d = readContentData();
  const EN = evalFile('content-en.js', 'window.STAYJP_EN');
  const units = {};
  for (const lv of ['n5', 'n4', 'n3', 'n2', 'n1']) {
    const enMap = EN[lv.toUpperCase() + '_EN'] || {};
    if (lang !== 'en') for (const g of d.grammar[lv]) {
      const e = enMap[g.id] || {};
      units['g:' + g.id] = { kind: 'grammar', t: g.t, p: g.p, ex: g.ex, n: g.n, eg: (g.eg || []).map(x => x.z), eg_ja: (g.eg || []).map(x => x.j), en: { t: e.t, p: e.p, ex: e.ex, n: e.n, eg: e.eg } };
    }
    const envoc = EN['VOCAB_' + lv.toUpperCase() + '_EN'] || [];
    if (lang !== 'en') d.vocab[lv].forEach((v, i) => {
      units['v:' + lv + ':' + i] = { kind: 'vocab', w: v.w, r: v.r, m: v.m, ja: v.ex && v.ex.j, z: v.ex && v.ex.z, en: { m: envoc[i] && envoc[i].m, z: v.ex && v.ex.e } };
    });
  }
  for (const c of d.confusables) {
    units['c:' + c.id] = { kind: 'confusable', title: c.title, words: c.words.map(w => ({ w: w.w, m: w.m, note: w.note })), tip: c.tip, eg: (c.eg || []).map(x => x.z), eg_ja: (c.eg || []).map(x => x.j) };
  }
  return units;
}
function renderContent(u) {
  const o = { kind: u.kind };
  if (u.kind === 'grammar') { o.t = u.t; o.p = u.p; o.ex = u.ex; if (u.n) o.n = u.n; o.eg = u.eg; o.eg_ja = u.eg_ja; if (u.en && u.en.ex) o.en_ref = u.en; }
  else if (u.kind === 'vocab') { o.w = u.w; o.r = u.r; o.m = u.m; o.ja = u.ja; o.z = u.z; if (u.en) o.en_ref = u.en; }
  else { o.title = u.title; o.words = u.words; o.tip = u.tip; o.eg = u.eg; o.eg_ja = u.eg_ja; }
  return o;
}
function validateContent(u, out) {
  if (u.kind === 'grammar') return out && typeof out.ex === 'string' && Array.isArray(out.eg) && out.eg.length === u.eg.length;
  if (u.kind === 'vocab') return out && typeof out.m === 'string' && out.m.length > 0;
  return out && Array.isArray(out.words) && out.words.length === u.words.length && Array.isArray(out.eg) && out.eg.length === u.eg.length;
}
const CONTENT_SYS = lang => baseRules(lang) + `

Input objects:
- kind "grammar": {t: title (Japanese pattern + Chinese annotation in （）), p: structure, ex: explanation, n?: note, eg: [Chinese translations of example sentences], eg_ja: [the Japanese sentences, for reference only]}. Output {t, p, ex, n?, eg}. In t and p translate only the Chinese parts (e.g. （名詞）→ (noun)), keep the Japanese pattern. eg must translate each sentence in order, same length.
- kind "vocab": {w, r, m: Chinese meaning, ja: example, z: Chinese translation of example}. Output {m: concise meaning in the target language (like a dictionary gloss; keep "(男)"-style qualifiers translated), z: translation of the example sentence}.
- kind "confusable": {title, words:[{w, m, note}], tip, eg:[Chinese translations], eg_ja}. Output {words:[{m, note}], tip, eg}. Keep the Japanese word w out of the output.`;

// 讀解 / 聽解
function unitsRl(lang) {
  const d = readContentData();
  const units = {};
  const EN = evalFile('reading-listening-en.js', 'window.RL_EN') || { reading: {}, listening: {} };
  for (const p of d.reading_passages) {
    units['r:' + p.id] = { kind: 'reading', title: p.title, qs: (p.questions || []).map(q => ({ q: q.q, options: q.options, explanation: q.explanation })), en: EN.reading[p.id] };
  }
  for (const x of d.listening_items) {
    units['l:' + x.id] = { kind: 'listening', script: x.script, q: x.q, options: x.options, en: EN.listening[x.id] };
  }
  return units;
}
const RL_SYS = lang => baseRules(lang) + `

Input: kind "reading" {title, qs:[{q, options:[4], explanation}], en?: reference} → output {qs:[{q, options, explanation}]} (same counts, same order).
Input: kind "listening" {script (Japanese audio script, reference only), q, options:[...]} → output {q, options} (same count/order).
Questions and options are comprehension questions about the Japanese text; translate them so the answer stays unambiguous.`;
function validateRl(u, out) {
  if (u.kind === 'reading') return out && Array.isArray(out.qs) && out.qs.length === u.qs.length && out.qs.every((q, i) => q && typeof q.q === 'string' && Array.isArray(q.options) && q.options.length === u.qs[i].options.length);
  return out && typeof out.q === 'string' && Array.isArray(out.options) && out.options.length === u.options.length;
}

// 刷題詳解 / 整句翻譯
function loadQ() { return evalFile('jlpt-questions.js', '(typeof JLPT_Q!=="undefined")?JLPT_Q:window.JLPT_Q') || []; }
function unitsDrill() {
  const EN = evalFile('jlpt-questions-en.js', 'window.JLPT_Q_EN') || {};
  const units = {};
  for (const q of loadQ()) if (q.x) units[q.id] = { q: q.q, o: q.o, a: q.a, x: q.x, en: EN[q.id] };
  return units;
}
const DRILL_SYS = lang => baseRules(lang) + `

Each input: {q: question (【】 marks the target word, (　) a blank), o: options, a: index of correct option, x: Chinese explanation (HTML with <b>, <br>), en?: English reference}.
Output: {id: translated explanation string} — same HTML structure and line breaks as x, explain why the answer is right and why the others are wrong.`;
function unitsDrillTrans() {
  const EN = evalFile('jlpt-q-trans-en.js', 'window.JLPT_Q_TRANS_EN') || {};
  const ZH = evalFile('jlpt-q-trans.js', '(typeof JLPT_Q_TRANS!=="undefined")?JLPT_Q_TRANS:window.JLPT_Q_TRANS') || {};
  const units = {};
  for (const q of loadQ()) if (ZH[q.id] || EN[q.id]) units[q.id] = { q: q.q, o: q.o, a: q.a, zh: ZH[q.id], en: EN[q.id] };
  return units;
}
const DRILLTRANS_SYS = lang => baseRules(lang) + `

Each input: {q: a Japanese sentence (【】 marks the tested word, (　) a blank to be filled by option o[a]), o, a, zh: Chinese translation, en?: English translation}.
Output: {id: translation of the full sentence in the target language}. Mark the translated tested word with 【】 the same way; if the sentence has a blank, translate it as completed with the correct option.`;

// 文章
function unitsArticles(lang) {
  const arts = evalFile('articles.js', 'window.ARTICLES') || [];
  const units = {};
  for (const a of arts) {
    units[a.id] = {
      title: a.title, title_zh: a.title_zh, topic: a.topic, body: a.body, trans: a.trans,
      vocab: (a.vocab || []).map(v => ({ w: v.w, m: v.m })), grammar: (a.grammar || []).map(g => ({ t: g.t, note: g.note })),
      en: { title: a.title_en, topic: a.topic_en, trans: a.trans_en, vocab: (a.vocab || []).map(v => v.m_en), grammar: (a.grammar || []).map(g => ({ t: g.t_en, note: g.note_en })) },
    };
  }
  return units;
}
const ARTICLES_SYS = lang => baseRules(lang) + `

Each input is a graded-reading article: {title (Japanese), title_zh, topic, body (Japanese paragraphs, reference only), trans: [Chinese translation per paragraph], vocab:[{w, m}], grammar:[{t, note}], en?: reference}.
Output per id: {title: translated title, topic, trans: [one translation per paragraph, same count/order], vocab: [meaning per word, same order], grammar: [{t, note}, same order]}. In grammar.t translate only the Chinese annotation, keep the Japanese pattern.`;
function validateArticles(u, out) {
  return out && typeof out.title === 'string' && Array.isArray(out.trans) && out.trans.length === u.trans.length && Array.isArray(out.vocab) && out.vocab.length === u.vocab.length && Array.isArray(out.grammar) && out.grammar.length === u.grammar.length;
}

// 雜項:短劇 / おみくじ / 敬語
function unitsMisc() {
  const units = {};
  const skits = evalFile('skits-data.js', 'window.SKITS') || [];
  for (const s of skits) units['sk:' + s.n] = { kind: 'skit', t: s.t, m: s.m, hook: s.hook, p: s.p, en: { t: s.en, m: s.men, hook: s.hookEn } };
  const om = evalFile('omikuji-data.js', 'window.OMIKUJI') || [];
  om.forEach((o, i) => { units['om:' + i] = { kind: 'omikuji', jp: o.jp, zh: o.zh, w: (o.w || []).map(x => x[2]), w_ja: (o.w || []).map(x => x[0]), tip: o.tip, en: { zh: o.zhE, w: (o.w || []).map(x => x[3]), tip: o.tipE } }; });
  const src = fs.readFileSync(path.join(ROOT, 'keigo-quiz.js'), 'utf8');
  for (const m of src.matchAll(/\{ p: "([^"]+)", pr: "[^"]+", z: "([^"]+)", e: "([^"]+)"/g)) units['kg:' + m[1]] = { kind: 'keigo', p: m[1], z: m[2], en: m[3] };
  return units;
}
const MISC_SYS = lang => baseRules(lang) + `

kind "skit": {t: episode title, m: meaning of the taught phrase p, hook: one-line teaser} → {t, m, hook}.
kind "omikuji": {jp: fortune lines (Japanese), zh: Chinese rendering of the fortune, w: [word meanings], tip: advice} → {zh: rendering of the fortune in the target language, w: [meanings, same order], tip}.
kind "keigo": {p: plain verb, z: Chinese meaning} → {z: meaning in target language}.`;

// 原生 App 字典(stayjp-app/src/lib/i18n-en.ts)
function unitsNative() {
  const src = fs.readFileSync(path.join(APP_ROOT, 'src', 'lib', 'i18n-en.ts'), 'utf8');
  const units = {};
  for (const m of src.matchAll(/"((?:[^"\\]|\\.)*)"\s*:\s*"((?:[^"\\]|\\.)*)"/g)) { const zh = lit('"' + m[1] + '"'), en = lit('"' + m[2] + '"'); if (zh && CJK.test(zh)) units[zh] = { zh, en }; }
  return units;
}

// 文法詳解(老師口吻 HTML)
function unitsGdetail() {
  const w = {};
  for (const lv of ['n5', 'n4', 'n3', 'n2', 'n1']) new Function('window', fs.readFileSync(path.join(ROOT, `grammar-detail-${lv}.js`), 'utf8'))(w);
  const units = {};
  for (const [id, html] of Object.entries(w.GRAMMAR_DETAIL || {})) units[id] = { html };
  return units;
}
const GDETAIL_SYS = lang => baseRules(lang) + `

Each input: {html: a teacher-voice grammar lesson in Traditional Chinese, HTML with <div class='gd-h'> section headings, <div class='gd-sec'>, <b>, <span class='gd-jp'>Japanese</span>, <br>, lists}.
Output: {id: the same HTML with every Chinese sentence rewritten in the target language}. Keep every tag, class name and every <span class='gd-jp'>…</span> byte-for-byte. Where the lesson compares Japanese with Chinese ("中文會說…"), rewrite the comparison for a ${LANGS[lang].name} speaker (compare with ${LANGS[lang].name} instead, or drop the remark if it does not apply). Teacher tone: warm, direct, like a tutor talking to one student.`;

// 模型偶爾把單一字串包成 {html:"…"} / {x:"…"} → 拆回字串
function unwrapStr(o) { if (o && typeof o === 'object' && !Array.isArray(o)) { const vals = Object.values(o); if (vals.length === 1 && typeof vals[0] === 'string') return vals[0]; } return o; }

// ═══════════════ 跑 part ═══════════════
async function runPart(part, lang, limit) {
  if (!LANGS[lang]) throw new Error('未知語言 ' + lang);
  const SIMPLE = lang => baseRules(lang) + `\n\nEach value is {zh: source text, en?: English reference}. Output {key: translated string}. Arrays stay arrays of the same length (month/weekday names). Keep leading/trailing spaces and symbols.`;
  switch (part) {
    case 'i18n': return runBatches({ lang, part, units: unitsI18n(), batchSize: 50, par: 4, norm: unwrapStr, system: SIMPLE(lang), limit, validate: (u, o) => Array.isArray(u.zh) ? (Array.isArray(o) && o.length === u.zh.length) : typeof o === 'string' });
    case 'ui': {
      await runBatches({ lang, part, units: unitsUi(lang), batchSize: 45, par: 5, norm: unwrapStr, system: SIMPLE(lang) + '\nThese are UI strings (buttons, labels, hints, marketing copy). Match the register of the English reference when present. A "#" is a placeholder for a number or value inserted at runtime: keep every "#" (same count) in the natural position.', limit, validate: (u, o) => typeof o === 'string' && o.length > 0 && (u.zh.match(/#/g) || []).length === (o.match(/#/g) || []).length });
      if (lang !== 'en') await runBatches({ lang, part: 'ui-patterns', units: unitsUiPatterns(), batchSize: 25, par: 2, norm: unwrapStr, system: baseRules(lang) + `\n\nEach value is {pattern: a JS regex source matched against Chinese UI text, en: the English replacement string using $1,$2… groups}. Output {key: the replacement string in the target language, keeping the $n groups in a natural position}.`, limit, validate: (u, o) => typeof o === 'string' && (u.en.match(/\$\d/g) || []).every(g => o.includes(g)) });
      return;
    }
    case 'content': return runBatches({ lang, part, units: unitsContent(lang), batchSize: 24, par: 5, system: CONTENT_SYS(lang), limit, validate: validateContent, render: renderContent, maxTokens: 20000 });
    case 'rl': return runBatches({ lang, part, units: unitsRl(lang), batchSize: 10, par: 4, system: RL_SYS(lang), limit, validate: validateRl, render: u => { const o = { ...u }; return o; } });
    case 'drill': return runBatches({ lang, part, units: unitsDrill(), batchSize: 8, par: 5, system: DRILL_SYS(lang), limit, norm: unwrapStr, validate: (u, o) => typeof o === 'string' && o.length > 10 && !/[一-鿿]{6,}/.test(o.replace(/<[^>]+>/g, '')) || typeof o === 'string' && o.length > 10 });
    case 'drilltrans': return runBatches({ lang, part, units: unitsDrillTrans(), batchSize: 20, par: 4, system: DRILLTRANS_SYS(lang), limit, norm: unwrapStr, validate: (u, o) => typeof o === 'string' && o.length > 0 });
    case 'articles': return runBatches({ lang, part, units: unitsArticles(lang), batchSize: 2, par: 5, system: ARTICLES_SYS(lang), limit, validate: validateArticles, maxTokens: 20000 });
    case 'misc': return runBatches({ lang, part, units: unitsMisc(), batchSize: 15, par: 3, system: MISC_SYS(lang), limit, validate: (u, o) => !!o });
    case 'native': return runBatches({ lang, part, units: unitsNative(), batchSize: 40, par: 3, norm: unwrapStr, system: SIMPLE(lang) + '\nThese are native mobile UI strings (paywall, login prompts, notification lines).', limit, validate: (u, o) => typeof o === 'string' && o.length > 0 });
    case 'gdetail': return runBatches({ lang, part, units: unitsGdetail(), batchSize: 2, par: 5, system: GDETAIL_SYS(lang), limit, norm: unwrapStr, validate: (u, o) => typeof o === 'string' && o.includes('gd-sec') && (o.match(/gd-jp/g) || []).length === (u.html.match(/gd-jp/g) || []).length, maxTokens: 24000 });
    default: throw new Error('未知 part ' + part);
  }
}

// ═══════════════ build:組前端檔 ═══════════════
// 只動「值」不動 key(key 是繁中原文,用來查表;改了就查不到 —— 「小狸短劇」曾因此變成「타누키短劇」而失效)
// 韓文數字+量詞要黏著寫(「1 일」→「1일」);N5 這類代號後面的數字不動,量詞後面只接空白/標點/助詞,避開 일본・번역・명사 這種詞
const KO_NUM_SPACE = /(^|[^A-Za-z0-9])(#|\$\d|\d[\d,]*) (일|개|단계|분|회|번|명|주|초|점|문항|문제|시간|개월|년|살|원|배|장|편|줄|글자)(?=$|[\s.,·…)\]/:!?」』~]|은|는|이|가|을|를|의|에|째|씩|만|도|로|까지|부터|동안|짜리|예요|이에요)/g;
function fixNames(lang, obj) {
  const fixes = MASCOT_FIX[lang] || [];
  const fx = v => {
    if (typeof v === 'string') { for (const re of fixes) v = v.replace(re, MASCOT[lang]); if (lang === 'ko') v = v.replace(KO_NUM_SPACE, '$1$2$3').replace(/한일 자막|중일 자막/g, '일본어 자막·번역');   // 外語用戶的 YT 字幕是日文+英文軌,不是韓文 return v; }
    if (Array.isArray(v)) return v.map(fx);
    if (v && typeof v === 'object') { const o = {}; for (const k of Object.keys(v)) o[k] = fx(v[k]); return o; }
    return v;
  };
  return fx(obj);
}
const HEAD = (lang, part) => `// Generated by scripts/gen-l10n.mjs (${part}, ${lang}) — 不要手改;改翻譯請改 scripts/out/l10n/${lang}/ 再重 build。\n`;
function build(lang) {
  const w = (file, body) => { fs.writeFileSync(path.join(ROOT, file), body); console.log('  寫出', file, Math.round(body.length / 1024) + 'KB'); };
  const d = readContentData();
  if (lang !== 'en') {
    // lang/<lang>.js:i18n 字典 + UI 對照 + patterns
    const dict = { ...fixNames(lang, loadCache(lang, 'i18n')) };
    // 品牌名:外語一律 StayJP(「日本再留計劃」是中文圈的名字,音譯出去沒人認得)
    dict.site_name = 'StayJP'; dict.brand_tag = 'StayJP';
    for (const k of ['page_title', 'verbs_page_title', 'copyright']) if (typeof dict[k] === 'string') dict[k] = dict[k].replace(/日本再留計劃|日本再留计划|Japan Stay Plan|Stay in Japan Project/g, 'StayJP');
    const ui = fixNames(lang, loadCache(lang, 'ui'));
    for (const k of Object.keys(ui)) if (/^(日本再留計劃|日本再留计划)$/.test(k)) ui[k] = 'StayJP';   // 品牌名不翻
    const patsSrc = unitsUiPatterns();
    const patsOut = loadCache(lang, 'ui-patterns');
    const patterns = Object.keys(patsSrc).filter(k => patsOut[k]).map(k => ({ pattern: patsSrc[k].pattern, to: patsOut[k] }));
    fs.mkdirSync(path.join(ROOT, 'lang'), { recursive: true });
    w(`lang/${lang}.js`, HEAD(lang, 'i18n+ui') + `window.__L10N=window.__L10N||{};window.__L10N[${JSON.stringify(lang)}]=${JSON.stringify({ dict, ui, patterns })};\n`);
    // content-<lang>.js
    const c = fixNames(lang, loadCache(lang, 'content'));
    const grammar = {}, vocab = {}, confusables = {};
    for (const lv of ['n5', 'n4', 'n3', 'n2', 'n1']) {
      for (const g of d.grammar[lv]) { const o = c['g:' + g.id]; if (o) grammar[g.id] = { t: o.t, p: o.p, ex: o.ex, n: o.n, eg: o.eg }; }
      vocab[lv] = d.vocab[lv].map((v, i) => { const o = c['v:' + lv + ':' + i]; return o ? { m: o.m, z: o.z } : null; });
    }
    for (const cf of d.confusables) { const o = c['c:' + cf.id]; if (o) confusables[cf.id] = o; }
    w(`content-${lang}.js`, HEAD(lang, 'content') + `window.STAYJP_L10N=window.STAYJP_L10N||{};window.STAYJP_L10N[${JSON.stringify(lang)}]=${JSON.stringify({ grammar, vocab, confusables })};\n`);
    // reading-listening
    const rl = fixNames(lang, loadCache(lang, 'rl')); const reading = {}, listening = {};
    for (const [k, v] of Object.entries(rl)) { if (k.startsWith('r:')) reading[k.slice(2)] = v.qs; else listening[k.slice(2)] = { q: v.q, options: v.options }; }
    w(`reading-listening-${lang}.js`, HEAD(lang, 'rl') + `window.RL_L10N=window.RL_L10N||{};window.RL_L10N[${JSON.stringify(lang)}]=${JSON.stringify({ reading, listening })};\n`);
    w(`jlpt-questions-${lang}.js`, HEAD(lang, 'drill') + `window.JLPT_Q_L10N=window.JLPT_Q_L10N||{};window.JLPT_Q_L10N[${JSON.stringify(lang)}]=${JSON.stringify(fixNames(lang, loadCache(lang, 'drill')))};\n`);
    w(`jlpt-q-trans-${lang}.js`, HEAD(lang, 'drilltrans') + `window.JLPT_Q_TRANS_L10N=window.JLPT_Q_TRANS_L10N||{};window.JLPT_Q_TRANS_L10N[${JSON.stringify(lang)}]=${JSON.stringify(fixNames(lang, loadCache(lang, 'drilltrans')))};\n`);
    w(`articles-${lang}.js`, HEAD(lang, 'articles') + `window.ARTICLES_L10N=window.ARTICLES_L10N||{};window.ARTICLES_L10N[${JSON.stringify(lang)}]=${JSON.stringify(fixNames(lang, loadCache(lang, 'articles')))};\n`);
    const mc = fixNames(lang, loadCache(lang, 'misc')); const misc = { skits: {}, omikuji: {}, keigo: {} };
    for (const [k, v] of Object.entries(mc)) { if (k.startsWith('sk:')) misc.skits[k.slice(3)] = v; else if (k.startsWith('om:')) misc.omikuji[k.slice(3)] = v; else if (k.startsWith('kg:')) misc.keigo[k.slice(3)] = v.z || v; }
    w(`misc-${lang}.js`, HEAD(lang, 'misc') + `window.MISC_L10N=window.MISC_L10N||{};window.MISC_L10N[${JSON.stringify(lang)}]=${JSON.stringify(misc)};\n`);
    // 原生 App 字典
    const nat = fixNames(lang, loadCache(lang, 'native'));
    if (Object.keys(nat).length) {
      const body = `// Generated by stay-jp-notes/scripts/gen-l10n.mjs (native, ${lang}) — key = 繁中原文。\nexport const ${lang.toUpperCase()}: Record<string, string> = ${JSON.stringify(nat, null, 2)};\n`;
      const p = path.join(APP_ROOT, 'src', 'lib', `i18n-${lang}.ts`); fs.writeFileSync(p, body); console.log('  寫出', p);
    }
  } else {
    // en 補缺:ui 新 key 併進 ui-map.js;confusables 併進 content-en.js
    const ui = loadCache('en', 'ui');
    if (Object.keys(ui).length) {
      const map = evalFile('ui-map.js', 'window.__UI_MAP'); const pats = evalFile('ui-map.js', 'window.__UI_PATTERNS');
      let added = 0; for (const [k, v] of Object.entries(ui)) if (!map[k]) { map[k] = v; added++; }
      w('ui-map.js', `window.__UI_MAP=${JSON.stringify(map)};\nwindow.__UI_PATTERNS=${JSON.stringify(pats)};\n`);
      console.log('  ui-map.js 新增', added);
    }
    const c = loadCache('en', 'content'); const confusables = {};
    for (const cf of d.confusables) { const o = c['c:' + cf.id]; if (o) confusables[cf.id] = o; }
    let src = fs.readFileSync(path.join(ROOT, 'content-en.js'), 'utf8');
    src = src.replace(/\nconst CONFUSABLES_EN = [\s\S]*?;\n(?=window\.STAYJP_EN=)/, '\n');
    src = src.replace(/window\.STAYJP_EN=\{([^}]*)\};?/, (m, inner) => { const parts = inner.split(',').map(s => s.trim()).filter(s => s && s !== 'CONFUSABLES_EN'); return `window.STAYJP_EN={${parts.join(',')},CONFUSABLES_EN};`; });
    src = src.replace(/window\.STAYJP_EN=/, `const CONFUSABLES_EN = ${JSON.stringify(confusables)};\nwindow.STAYJP_EN=`);
    w('content-en.js', src);
  }
  // 文法詳解(所有語言含 en)
  // 文法詳解翻譯:跟中文版一樣每級一檔(grammar-detail-<lang>-n5.js …),只載正在看的級別
  const gd = lang === 'en' ? loadCache(lang, 'gdetail') : fixNames(lang, loadCache(lang, 'gdetail'));
  for (const lv of ['n5', 'n4', 'n3', 'n2', 'n1']) {
    const part = {}; for (const [id, html] of Object.entries(gd)) if (id.startsWith(lv + '-')) part[id] = html;
    if (!Object.keys(part).length) continue;
    w(`grammar-detail-${lang}-${lv}.js`, HEAD(lang, 'gdetail ' + lv) + `window.GRAMMAR_DETAIL_L10N=window.GRAMMAR_DETAIL_L10N||{};window.GRAMMAR_DETAIL_L10N[${JSON.stringify(lang)}]=Object.assign(window.GRAMMAR_DETAIL_L10N[${JSON.stringify(lang)}]||{},${JSON.stringify(part)});\n`);
  }
  try { fs.unlinkSync(path.join(ROOT, `grammar-detail-${lang}.js`)); } catch (_) {}
}

function status() {
  for (const lang of Object.keys(LANGS)) {
    const row = [];
    for (const part of [...PARTS, 'ui-patterns']) { const n = Object.keys(loadCache(lang, part)).length; if (n) row.push(`${part}=${n}`); }
    console.log(lang.padEnd(3), row.join('  ') || '(無)');
  }
}

// ═══════════════ main ═══════════════
const [cmd, lang, limitArg] = process.argv.slice(2);
const limit = Number(limitArg || 0);
if (!cmd || cmd === 'status') status();
else if (cmd === 'build') build(lang);
else if (cmd === 'all') { for (const p of PARTS.filter(p => p !== 'gdetail' && p !== 'native')) await runPart(p, lang, 0); }
else await runPart(cmd, lang, limit);
