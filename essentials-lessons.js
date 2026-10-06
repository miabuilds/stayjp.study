// essentials-lessons.js — 「必學基礎詞」多鄰國式小課:學一小張表 → 5–8 題小測驗 → 解鎖下一課,
// 每課可選「跟讀」(單字級,走 shadow-core.js 的辨識+計分),最後一關綜合測驗通過 = Journey 打勾。
// 題目一律從 essentials-data.js(window.ESS)自動產生,不另外手打。
// 純邏輯(課表、出題、計分)可在 node 跑:scripts/test-essentials-lessons.cjs。
// 進度:localStorage ess_progress(在 app.html SYNC_KEYS,登入會雲端同步);
// 綜合測驗通過 → 寫 jr_essentials='1'(Journey 的打勾證據,舊版隨堂測驗做過的人已經是 '1',維持打勾)。
(function (root) {
  'use strict';
  const ESS = root.ESS || (typeof require === 'function' ? require('./essentials-data.js') : null);
  const PASS_RATIO = 0.6;      // 答對 ≥60% 過關、解鎖下一課
  const LESSON_Q = 8;          // 每課題數上限(題庫不足 5 就用多題型補到 5)
  const FINAL_Q = 15;          // 綜合測驗題數
  const KEY = 'ess_progress';

  // ══════════ 純邏輯 ══════════
  const prim = y => String(y).split('/')[0].trim();
  const alts = y => String(y).split('/').map(s => s.trim()).filter(Boolean);
  const kana = s => String(s || '').replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60)).replace(/\s/g, '');
  const hasKana = s => /[ぁ-ゖァ-ヺー]/.test(String(s || ''));

  // 種子亂數(mulberry32):同一個 seed → 同一份考卷(測試可重現)
  function rng(seed) {
    let a = (seed >>> 0) || 1;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffle(arr, r) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  // 一列表格 → 一個學習項目
  function rowItem(lid, r, ctx) {
    return { id: lid + ':' + r[0], lesson: lid, form: r[0], yomi: prim(r[1]), alts: alts(r[1]), irr: !!r[2], mean: r[3] || null, say: prim(r[1]), ctx: ctx || '', kind: 'word' };
  }
  const counter = head => ESS.COUNTERS.find(c => c.t.indexOf(head) === 0);
  function counterTable(head) { const c = counter(head); return { t: c.t, d: c.d, rows: c.rows, ctx: c.t.replace(/\(.*\)$/, '') }; }

  // 課表(順序 = 解鎖順序)。tip 用總表頁同一句(EN_T 有英文);新句子在 TIP_EN 補英文。
  const TIP_EN = {
    '1・6・8・10 會變促音(いっ・ろっ・はっ・じゅっ),3 常變濁音(さんぼん)。三個量詞同一套規律,一起記最快。': 'Same pattern for all three: 1, 6, 8, 10 double the consonant (ip-, rop-, hap-, jup-) and 3 often voices (sanbon). Learn them together.',
    '〜枚 完全規則;〜歳 注意 1・8・10 的促音和 <b>20歳はたち</b>。': '〜枚 is fully regular; for 〜歳 watch the doubled 1, 8, 10 and <b>20 = hatachi</b>.',
    '先記「是什麼」再記怎麼念:疑問詞幾乎都是 ど〜 開頭。': 'Learn the meaning first: most question words start with ど〜.',
    '0 有兩種念法;100・1000 有自己的字,一萬要說「いちまん」。': '0 has two readings; 100 and 1000 have their own words, and 10,000 is “ichiman”.',
    '星期是「〜曜日」;月份 4・7・9 月的念法和「時」不一樣。': 'Weekdays end in 〜曜日; months 4, 7, 9 are read differently from the hours.',
  };
  const DEFS = [
    { id: 'num', zh: '數字 1–10', en: 'Numbers 1–10', tip: '<b>4・7・9</b> 各有兩種念法(4時よじ、4月しがつ、4個よんこ)。', tables: () => [{ t: '基本數字', rows: ESS.NUM.slice(0, 10) }] },
    { id: 'big', zh: '大數字・百千變音', en: 'Big numbers & sound changes', tip: '0 有兩種念法;100・1000 有自己的字,一萬要說「いちまん」。', tables: () => [{ t: '0〜億', rows: ESS.NUM.slice(10) }, { t: '百・千 的變音', d: '要特別記', rows: ESS.NUM_CH }] },
    { id: 'tsu', zh: '〜つ(數東西)', en: '〜つ (counting things)', tables: () => [counterTable('〜つ')] },
    { id: 'ko', zh: '〜個', en: '〜個 (small items)', tables: () => [counterTable('〜個')] },
    { id: 'nin', zh: '〜人', en: '〜人 (people)', tables: () => [counterTable('〜人')] },
    { id: 'hon', zh: '〜本・〜匹・〜杯', en: '〜本 · 〜匹 · 〜杯', tip: '1・6・8・10 會變促音(いっ・ろっ・はっ・じゅっ),3 常變濁音(さんぼん)。三個量詞同一套規律,一起記最快。', tables: () => [counterTable('〜本'), counterTable('〜匹'), counterTable('〜杯')] },
    { id: 'mai', zh: '〜枚・〜歳・其他量詞', en: '〜枚 · 〜歳 · other counters', tip: '〜枚 完全規則;〜歳 注意 1・8・10 的促音和 <b>20歳はたち</b>。', tables: () => [counterTable('〜枚'), counterTable('〜歳'), counterTable('其他常用')] },
    { id: 'time', zh: '幾點幾分', en: 'Telling time', tip: '注意 <b>4時よじ・7時しちじ・9時くじ</b>。', tables: () => [{ t: '〜時', d: '幾點', rows: ESS.JI, ctx: '〜時' }, { t: '〜分', d: '幾分', rows: ESS.FUN, ctx: '〜分' }] },
    { id: 'month', zh: '星期・月份', en: 'Weekdays & months', tip: '星期是「〜曜日」;月份 4・7・9 月的念法和「時」不一樣。', tables: () => [{ t: '曜日', d: '星期', rows: ESS.YOUBI }, { t: '〜月', d: '月份', rows: ESS.GATSU, ctx: '〜月' }] },
    { id: 'day', zh: '日期', en: 'Days of the month', tip: '1〜10 日、14/20/24 日 全是<b>不規則</b>和語念法,直接背。', tables: () => [{ t: '〜日', d: '日期', rows: ESS.NICHI, ctx: '〜日' }] },
    { id: 'fam', zh: '家族稱謂', en: 'Family terms', tip: '左=<b>講自己家人</b>(謙稱)、右=<b>稱呼別人家人</b>(敬稱)。點任一邊聽發音。', kind: 'fam' },
    { id: 'q', zh: '疑問詞', en: 'Question words', tip: '先記「是什麼」再記怎麼念:疑問詞幾乎都是 ど〜 開頭。', tables: () => [{ t: '疑問詞', d: '問句必備', rows: ESS.GIMON }] },
    { id: 'pt', zh: '基本助詞', en: 'Basic particles', tip: '<b>は</b>讀「わ」、<b>へ</b>讀「え」、<b>を</b>讀「お」——寫法和讀音不同,先記住。', kind: 'pt' },
  ];

  function buildLesson(def) {
    const L = { id: def.id, zh: def.zh, en: def.en, tip: def.tip || '', kind: def.kind || 'table', tables: [], items: [] };
    if (def.kind === 'fam') {
      ESS.KAZOKU.forEach(k => {
        L.items.push({ id: def.id + ':' + k[0], lesson: def.id, form: k[0], yomi: prim(k[1]), alts: alts(k[1]), mean: k[4], tag: 'own', say: prim(k[1]), kind: 'fam' });
        L.items.push({ id: def.id + ':' + k[2], lesson: def.id, form: k[2], yomi: prim(k[3]), alts: alts(k[3]), mean: k[4], tag: 'other', say: prim(k[3]), kind: 'fam' });
      });
    } else if (def.kind === 'pt') {
      ESS.JOSHI.forEach(j => {
        L.items.push({ id: def.id + ':' + j[0], lesson: def.id, form: j[0], yomi: j[1], alts: [j[1]], mean: j[2], ex: j[3], exKana: j[4], exZh: j[5], say: j[4], kind: 'pt' });
      });
    } else {
      def.tables().forEach(tb => {
        const t = { t: tb.t, d: tb.d || '', items: tb.rows.map(r => rowItem(def.id, r, tb.ctx || '')) };
        L.tables.push(t);
        L.items.push(...t.items);
      });
    }
    return L;
  }
  const LESSONS = ESS ? DEFS.map(buildLesson) : [];
  const ALL_ITEMS = [].concat(...LESSONS.map(l => l.items));
  const lessonById = id => LESSONS.find(l => l.id === id) || null;

  // ── 題型 ──
  // r2m:看讀音 → 選意思(數字/量詞/時間沒有中文意思時,「意思」= 寫法 1本)
  // m2r:看意思 → 選讀音(助詞選助詞本身)
  // aud:聽音 → 選意思
  // f2r:看漢字 → 選讀音(家族/疑問詞/は・へ・を 這種寫法≠讀音的才出)
  // clz:助詞填空(例句挖空 + 中文翻譯提示)
  function senseKey(it) { return it.mean ? 'm:' + it.mean + '|' + (it.tag || '') : 'f:' + it.form; }
  function promptWord(it) { return it.kind === 'pt' ? it.form : it.yomi; }
  function readingAns(it) { return it.kind === 'pt' ? it.form : it.yomi; }
  function senseDiffers(it) { return it.mean ? true : kana(it.form) !== kana(it.yomi); }
  function typesFor(it) {
    const ts = [];
    if (senseDiffers(it)) { ts.push('r2m', 'm2r'); if (it.say && it.kind !== 'pt') ts.push('aud'); }
    if (it.mean && it.kind !== 'pt' && kana(it.form) !== kana(it.yomi)) ts.push('f2r');
    if (it.kind === 'pt') { if (kana(it.form) !== kana(it.yomi)) ts.push('f2r'); if (it.ex) ts.push('clz'); }
    return ts;
  }
  // 選項值(用來去重)與「出題時要排除的撞答案項目」
  function optionOf(type, it) {
    if (type === 'r2m' || type === 'aud') return { key: senseKey(it), of: it };
    if (type === 'm2r') return { key: 'r:' + kana(readingAns(it)), of: it };
    if (type === 'f2r') return { key: 'r:' + kana(it.yomi), of: it };
    if (type === 'clz') return { key: 'p:' + it.form, of: it };
    return null;
  }
  // 這個干擾項會不會「也是對的」(同讀音不同字、同字不同讀…)
  function ambiguous(type, q, d) {
    if (d.id === q.id) return true;
    if (!!d.mean !== !!q.mean) return true;                     // 意思題不混「1本」和「爸爸」
    if ((d.kind === 'pt') !== (q.kind === 'pt')) return true;
    const qa = q.alts.map(kana), da = d.alts.map(kana);
    if (type === 'r2m' || type === 'aud') return da.some(x => qa.includes(x)) || kana(promptWord(d)) === kana(promptWord(q));
    if (type === 'm2r') return senseKey(d) === senseKey(q) || qa.includes(kana(readingAns(d)));
    if (type === 'f2r') return d.form === q.form || qa.includes(kana(d.yomi));
    return false;
  }
  function makeQuestion(it, type, r, pools) {
    const ans = optionOf(type, it);
    const opts = [ans];
    const seen = new Set([ans.key]);
    for (const pool of pools) {
      for (const d of shuffle(pool, r)) {
        if (opts.length >= 4) break;
        if (ambiguous(type, it, d) || !typesFor(d).length && type !== 'clz') continue;
        if (type === 'clz' && d.kind !== 'pt') continue;
        const o = optionOf(type, d);
        if (!o || seen.has(o.key)) continue;
        seen.add(o.key); opts.push(o);
      }
      if (opts.length >= 4) break;
    }
    const order = shuffle(opts, r);
    return { id: it.id + '|' + type, type, item: it, options: order, answer: order.indexOf(ans) };
  }
  // 依題型數量平衡挑題型(同課不要 8 題都同一型)
  function pickType(it, counts, r) {
    const ts = typesFor(it); if (!ts.length) return null;
    const min = Math.min(...ts.map(t => counts[t] || 0));
    const cands = ts.filter(t => (counts[t] || 0) === min);
    const t = cands[Math.floor(r() * cands.length)];
    counts[t] = (counts[t] || 0) + 1;
    return t;
  }
  // genQuiz(lessonId | 'final' | 'all', {seed, n})
  function genQuiz(which, opts) {
    opts = opts || {};
    const r = rng(opts.seed == null ? 1 : opts.seed);
    const counts = {};
    const out = [];
    const usedQ = new Set();
    const push = (it, pools) => {
      for (let tries = 0; tries < 4; tries++) {
        const t = pickType(it, counts, r); if (!t) return false;
        const qid = it.id + '|' + t;
        if (usedQ.has(qid)) continue;
        const q = makeQuestion(it, t, r, pools);
        if (q.options.length < 2) continue;
        usedQ.add(qid); out.push(q); return true;
      }
      return false;
    };
    if (which === 'final' || which === 'all') {
      const n = opts.n || (which === 'final' ? FINAL_Q : 10);
      // 每課至少一題,剩下的從全部隨機補
      const lessons = shuffle(LESSONS, r);
      for (const L of lessons) {
        if (out.length >= n) break;
        for (const it of shuffle(L.items.filter(x => typesFor(x).length), r)) { if (push(it, [L.items, ALL_ITEMS])) break; }
      }
      let guard = 0;
      while (out.length < n && guard++ < 200) {
        const it = ALL_ITEMS[Math.floor(r() * ALL_ITEMS.length)];
        if (!typesFor(it).length || out.some(q => q.item.id === it.id)) continue;
        push(it, [lessonById(it.lesson).items, ALL_ITEMS]);
      }
      return shuffle(out, r);
    }
    const L = lessonById(which); if (!L) return [];
    const usable = L.items.filter(x => typesFor(x).length);
    const n = Math.min(opts.n || LESSON_Q, Math.max(5, usable.length));
    // 紅字(不規則/變音)優先入選,其他隨機
    const ordered = shuffle(usable.filter(x => x.irr), r).concat(shuffle(usable.filter(x => !x.irr), r));
    const firstPass = shuffle(ordered.slice(0, n), r);
    firstPass.forEach(it => push(it, [L.items, ALL_ITEMS]));
    let guard = 0;
    while (out.length < n && guard++ < 50) push(usable[Math.floor(r() * usable.length)], [L.items, ALL_ITEMS]);   // 小課題庫不夠時換題型補
    return out;
  }
  function passed(score, total) { return total > 0 && score / total >= PASS_RATIO; }

  const pure = { LESSONS, ALL_ITEMS, genQuiz, typesFor, rng, shuffle, passed, PASS_RATIO, senseKey, kana };
  if (typeof document === 'undefined') {
    if (typeof module !== 'undefined' && module.exports) module.exports = pure;
    return;
  }

  // ══════════ 瀏覽器 UI ══════════
  const lang = () => { try { return (root.I18n && I18n.getLang && I18n.getLang()) || localStorage.getItem('ui_lang') || 'zh-TW'; } catch (e) { return 'zh-TW'; } };
  const isEn = () => lang() === 'en';
  const cv = s => (typeof root.cvt === 'function' ? root.cvt(s) : s);
  // 介面字串:英文用 en、簡中 cvt(這些字串不含日文)
  const L = (zh, en) => isEn() ? en : cv(zh);
  // 內容字串(中文意思/提示,可能夾日文):英文查 EN_T;簡中只轉「不含假名」的字串,避免日文漢字被誤轉(聞→闻)
  const T = zh => { if (zh == null) return ''; if (isEn()) return (ESS.EN_T[zh] || TIP_EN[zh] || zh); return hasKana(zh) ? zh : cv(zh); };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fr = t => { try { return root.furiganaHTMLRich ? root.furiganaHTMLRich(t) : t; } catch (e) { return t; } };
  const say = t => { try { if (t && typeof root.speak === 'function') root.speak(t); } catch (e) {} };
  function meanLabel(it) {
    if (!it.mean) return it.form;
    let m = T(it.mean);
    if (it.tag === 'own') m += L('(自己家)', ' (my own)');
    else if (it.tag === 'other') m += L('(別人家)', " (someone else's)");
    return m;
  }
  function optLabel(type, o) {
    const it = o.of;
    if (type === 'r2m' || type === 'aud') return esc(meanLabel(it));
    if (type === 'clz') return esc(it.form);
    if (type === 'f2r') return esc(it.yomi);
    return esc(readingAns(it));
  }
  function optPlain(type, o) { const d = document.createElement('div'); d.innerHTML = optLabel(type, o); return d.textContent; }
  function itemLine(it) {   // 「1本 ・ いっぽん ・ 意思」
    const parts = [it.form];
    if (kana(it.form) !== kana(it.yomi)) parts.push(it.alts.join(' / '));
    if (it.mean) parts.push(meanLabel(it));
    return parts.map(esc).join(' ・ ');
  }

  // ── 進度 ──
  function prog() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function saveProg(p) { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {} try { if (typeof root.saveAllCloud === 'function') root.saveAllCloud(); } catch (e) {} }
  function legacy() { try { return !!localStorage.getItem('jr_essentials'); } catch (e) { return false; } }
  function lessonPassed(id, p) { const e = (p || prog())[id]; return !!(e && passed(e.b || 0, e.t || 0)); }
  function lessonState(i, p) {
    p = p || prog();
    const id = i === LESSONS.length ? 'final' : LESSONS[i].id;
    if (lessonPassed(id, p)) return 'done';
    if (legacy()) return 'open';                       // 舊版隨堂測驗做過的人:全部開放
    if (i === 0) return 'open';
    if (i === LESSONS.length) return LESSONS.every(l => lessonPassed(l.id, p)) ? 'open' : 'lock';
    for (let k = i - 1; k < LESSONS.length; k++) if (lessonPassed(LESSONS[k].id, p)) return 'open';   // 前一課過了(或後面有過的)
    return 'lock';
  }
  function stats() { const p = prog(); const done = LESSONS.filter(l => lessonPassed(l.id, p)).length; return { done, tot: LESSONS.length, final: lessonPassed('final', p) }; }
  function nextIndex() { const p = prog(); for (let i = 0; i <= LESSONS.length; i++) { if (lessonState(i, p) === 'open') return i; } return LESSONS.length; }
  function recordResult(id, score, total) {
    const p = prog(); const e = p[id] || {};
    const better = !e.t || score / total > (e.b || 0) / e.t;
    p[id] = Object.assign({}, e, better ? { b: score, t: total } : {}, { n: (e.n || 0) + 1, ts: Date.now() });
    saveProg(p);
    if (id === 'final' && passed(score, total)) { try { localStorage.setItem('jr_essentials', '1'); } catch (er) {} try { if (typeof root.saveAllCloud === 'function') root.saveAllCloud(); } catch (er) {} }
  }
  function markField(id, field, val) { const p = prog(); const e = p[id] || {}; if ((e[field] || 0) >= val) return; e[field] = val; p[id] = e; saveProg(p); }
  // 錯題本:有 Stats(app.html)走 Stats;獨立頁(essentials.html)直接寫同一個 key,回 App 登入後同步
  function addWrong(q, pick) {
    const entry = { mode: 'basics', id: q.id, level: 'n5', w: q.item.say, q: promptPlain(q), options: q.options.map(o => optPlain(q.type, o)), correctIdx: q.answer, userIdx: pick };
    try {
      if (root.Stats && root.Stats.addWrongQuestion) { root.Stats.addWrongQuestion(entry); return; }
      const arr = JSON.parse(localStorage.getItem('wrong_questions') || '[]');
      const i = arr.findIndex(x => x.mode === entry.mode && x.id === entry.id);
      const rec = Object.assign({ ts: Date.now() }, entry);
      if (i > -1) arr[i] = Object.assign({}, arr[i], rec); else arr.push(rec);
      localStorage.setItem('wrong_questions', JSON.stringify(arr));
    } catch (e) {}
  }

  // ── 樣式(主題 token,深淺色自動) ──
  function css() {
    if (document.getElementById('essCss')) return;
    const s = document.createElement('style'); s.id = 'essCss';
    s.textContent = `
.ess-root{--e-ok:var(--correct-bd,var(--ok,#16a34a));--e-okbg:var(--correct-bg,color-mix(in srgb,var(--ok,#16a34a) 14%,transparent));--e-oktx:var(--correct-tx,var(--ok,#15803d));--e-ng:var(--wrong-bd,var(--bad,#dc2626));--e-ngbg:var(--wrong-bg,color-mix(in srgb,var(--bad,#dc2626) 12%,transparent));--e-ngtx:var(--wrong-tx,var(--bad,#b91c1c));--e-soft:rgba(var(--ac-rgb,198,85,59),.1)}
.ess-mask{position:fixed;inset:0;z-index:840;background:var(--bg);overflow:auto;-webkit-overflow-scrolling:touch;color:var(--tx)}
.ess-wrap{max-width:560px;margin:0 auto;padding:0 16px calc(env(safe-area-inset-bottom,0px) + 40px)}
.ess-top{position:sticky;top:0;z-index:3;background:var(--bg);padding:calc(env(safe-area-inset-top,0px) + 10px) 0 12px;border-bottom:1px solid var(--bd);margin-bottom:16px}
.ess-top-row{display:flex;align-items:center;gap:12px}
.ess-x{font:inherit;font-size:14px;border:1px solid var(--bd);background:var(--bg2);color:var(--tx2);border-radius:10px;padding:7px 12px;cursor:pointer;display:inline-flex;align-items:center;gap:4px;flex-shrink:0}
.ess-ttl{flex:1;min-width:0;font-weight:800;font-size:15.5px;line-height:1.35}
.ess-ttl small{display:block;font-size:11.5px;font-weight:600;color:var(--tx3)}
.ess-steps{display:flex;gap:8px;margin-top:12px}
.ess-chip{flex:1;font:inherit;font-size:12.5px;font-weight:700;border:1.5px solid var(--bd);background:var(--bg2);color:var(--tx2);border-radius:999px;padding:7px 6px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;white-space:nowrap}
.ess-chip.on{border-color:var(--ac);color:var(--ac);background:var(--e-soft)}
.ess-chip .ck{color:var(--e-ok)}
.ess-chip .nb{width:18px;height:18px;border-radius:50%;border:1.5px solid currentColor;display:inline-flex;align-items:center;justify-content:center;font-size:10.5px;line-height:1}
body.ess-open #tutorFab,body.ess-open #tutorHint,body.ess-open #quotaBadge,body.ess-open .bt{display:none!important}
.ess-tip{background:var(--e-soft);border-radius:12px;padding:12px 14px;font-size:13.5px;line-height:1.75;margin-bottom:16px}
.ess-tip b{color:var(--ac)}
.ess-sub{font-weight:800;font-size:14.5px;color:var(--ac);border-left:3px solid var(--ac);padding-left:9px;margin:18px 0 10px;line-height:1.35}
.ess-sub small{font-weight:500;color:var(--tx3);font-size:12px;margin-left:6px}
.ess-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
.ess-cell{font:inherit;text-align:left;background:var(--bg2);border:1px solid var(--bd);border-radius:12px;padding:11px 13px;cursor:pointer;color:var(--tx);display:flex;flex-direction:column;gap:2px;min-width:0}
.ess-cell:active{transform:scale(.98)}
.ess-cell .f{font-weight:800;font-size:17px;display:flex;align-items:center;gap:6px}
.ess-cell .f i{margin-left:auto;color:var(--tx3);font-size:13px}
.ess-cell .y{color:var(--ac);font-weight:700;font-size:13.5px}
.ess-cell .y.irr{color:var(--e-ng)}
.ess-cell .m{color:var(--tx2);font-size:12.5px}
.ess-fam{display:flex;flex-direction:column;background:var(--bg2);border:1px solid var(--bd);border-radius:14px;overflow:hidden}
.ess-fam-row{display:flex;align-items:center;gap:10px;padding:11px 13px;border-bottom:1px solid var(--bd)}
.ess-fam-row:last-child{border-bottom:0}
.ess-fam-row button{font:inherit;flex:1;min-width:0;text-align:left;background:none;border:0;color:var(--tx);cursor:pointer;padding:2px 0}
.ess-fam-row b{font-size:16px;margin-right:6px}
.ess-fam-row span.y{display:block;color:var(--ac);font-size:12.5px;font-weight:700;line-height:1.4}
.ess-fam-row .z{color:var(--tx2);font-size:12.5px;min-width:64px;text-align:right;flex-shrink:0}
.ess-fam-row .ar{color:var(--tx3);flex-shrink:0}
.ess-pt{font:inherit;display:block;width:100%;text-align:left;background:var(--bg2);border:1px solid var(--bd);border-radius:12px;padding:12px 14px;margin-bottom:10px;cursor:pointer;color:var(--tx)}
.ess-pt .ph{display:flex;align-items:baseline;gap:9px}
.ess-pt .p{font-weight:800;font-size:19px;color:var(--ac)}
.ess-pt .pu{font-weight:700;font-size:13.5px}
.ess-pt .pd{color:var(--tx2);font-size:13px;margin-top:3px}
.ess-pt .pe{font-size:14px;margin-top:8px;background:var(--bg3);border-radius:9px;padding:8px 11px}
.ess-pt .pe rt{font-size:10px}
.ess-pt .pe .z{color:var(--tx2);font-size:12.5px;margin-top:2px}
.ess-pri{font:inherit;width:100%;background:var(--ac);color:#fff;border:0;border-radius:14px;padding:14px;font-size:15.5px;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px}
.ess-pri:disabled{opacity:.45;cursor:default}
.ess-sec{font:inherit;width:100%;background:var(--bg2);color:var(--tx);border:1px solid var(--bd);border-radius:14px;padding:13px;font-size:14.5px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px}
.ess-btns{display:flex;flex-direction:column;gap:12px;margin-top:22px}
.ess-link{font:inherit;background:none;border:0;color:var(--tx2);font-size:13px;cursor:pointer;text-decoration:underline;padding:6px;align-self:center}
.ess-qhead{display:flex;justify-content:space-between;align-items:center;font-size:13px;color:var(--tx2);font-weight:700;margin-bottom:8px}
.ess-bar{height:6px;background:var(--bg3);border-radius:99px;overflow:hidden;margin-bottom:18px}
.ess-bar i{display:block;height:100%;background:var(--ac);border-radius:99px;transition:width .3s}
.ess-qcard{background:var(--bg2);border:1px solid var(--bd);border-radius:16px;padding:18px 16px;text-align:center;margin-bottom:16px}
.ess-ctx{display:inline-block;font-size:11.5px;font-weight:700;color:var(--ac);background:var(--e-soft);border-radius:999px;padding:2px 10px;margin-bottom:8px}
.ess-qlbl{font-size:13px;color:var(--tx2);margin-bottom:8px}
.ess-qbig{font-weight:800;font-size:30px;line-height:1.35;word-break:break-word}
.ess-qcloze{font-size:20px;font-weight:700;line-height:1.7}
.ess-qcloze .bl{display:inline-block;min-width:2.2em;border-bottom:2px solid var(--ac);margin:0 3px}
.ess-qzh{font-size:13px;color:var(--tx2);margin-top:6px}
.ess-play{width:68px;height:68px;border-radius:50%;border:0;background:var(--ac);color:#fff;font-size:28px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center}
.ess-mini{font:inherit;font-size:12.5px;border:1px solid var(--bd);background:var(--bg);color:var(--tx2);border-radius:999px;padding:4px 12px;cursor:pointer;margin-top:10px;display:inline-flex;align-items:center;gap:4px}
.ess-opts{display:flex;flex-direction:column;gap:10px}
.ess-opt{font:inherit;font-size:17px;font-weight:700;text-align:left;background:var(--bg2);border:1.5px solid var(--bd);border-radius:12px;padding:13px 15px;cursor:pointer;color:var(--tx);display:flex;align-items:center;gap:10px}
.ess-opt .k{width:24px;height:24px;border-radius:50%;border:1.5px solid var(--bd);display:inline-flex;align-items:center;justify-content:center;font-size:12px;color:var(--tx3);flex-shrink:0}
.ess-opt.sel{border-color:var(--ac);background:var(--e-soft)}
.ess-opt.sel .k{border-color:var(--ac);color:var(--ac)}
.ess-opt.ok{border-color:var(--e-ok);background:var(--e-okbg);color:var(--e-oktx)}
.ess-opt.ng{border-color:var(--e-ng);background:var(--e-ngbg);color:var(--e-ngtx)}
.ess-opt:disabled{cursor:default}
.ess-exp{border-radius:14px;padding:13px 15px;margin-top:16px;font-size:14px;line-height:1.75;border:1px solid var(--bd);background:var(--bg2)}
.ess-exp.ok{border-color:var(--e-ok)}
.ess-exp.ng{border-color:var(--e-ng)}
.ess-exp .h{font-weight:800;font-size:15px;margin-bottom:4px;display:flex;align-items:center;gap:6px}
.ess-exp.ok .h{color:var(--e-oktx)}
.ess-exp.ng .h{color:var(--e-ngtx)}
.ess-exp .ln{padding:6px 0;border-top:1px solid var(--bd)}
.ess-exp .ln:first-of-type{border-top:0}
.ess-exp .irr{color:var(--e-ng);font-weight:700}
.ess-res{text-align:center;padding:6px 0 4px}
.ess-score{font-size:46px;font-weight:800;color:var(--ac);line-height:1.2}
.ess-res p{color:var(--tx2);font-size:14px;margin-top:6px;line-height:1.6}
.ess-wlist{margin-top:18px;background:var(--bg2);border:1px solid var(--bd);border-radius:14px;overflow:hidden;text-align:left}
.ess-wlist .wh{font-weight:800;font-size:13.5px;padding:11px 14px;border-bottom:1px solid var(--bd)}
.ess-wrow{padding:10px 14px;border-bottom:1px solid var(--bd);font-size:13.5px;line-height:1.6}
.ess-wrow:last-child{border-bottom:0}
.ess-wrow .a{font-weight:700}
.ess-wrow .c{color:var(--tx2);font-size:12.5px}
.ess-sh{background:var(--bg2);border:1px solid var(--bd);border-radius:18px;padding:22px 16px;text-align:center}
.ess-sh .w{font-size:34px;font-weight:800;line-height:1.3}
.ess-sh .y{color:var(--ac);font-weight:700;font-size:16px;margin-top:2px}
.ess-sh .m{color:var(--tx2);font-size:13.5px;margin-top:2px}
.ess-sh-ctl{display:flex;justify-content:center;align-items:center;gap:22px;margin:20px 0 6px}
.ess-sh-ctl button{border:1px solid var(--bd);background:var(--bg);color:var(--tx);width:52px;height:52px;border-radius:50%;font-size:21px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center}
.ess-sh-ctl .mic{width:74px;height:74px;background:var(--ac);color:#fff;border:0;font-size:30px}
.ess-sh-ctl .mic.on{animation:essPulse 1.4s ease-out infinite}
.ess-sh-ctl .mic:disabled{opacity:.4}
@keyframes essPulse{0%{box-shadow:0 0 0 0 rgba(var(--ac-rgb,198,85,59),.45)}100%{box-shadow:0 0 0 18px rgba(var(--ac-rgb,198,85,59),0)}}
.ess-sh-hint{font-size:13px;color:var(--tx2);min-height:21px;margin-top:8px}
.ess-sh-said{font-size:15px;font-weight:700;min-height:24px;margin-top:6px;word-break:break-all}
.ess-sh-meter{height:8px;border-radius:99px;background:var(--bg3);overflow:hidden;margin:12px auto 4px;max-width:260px}
.ess-sh-meter i{display:block;height:100%;width:0;background:var(--ac);border-radius:99px;transition:width .3s}
.ess-sh-meter.ok i{background:var(--e-ok)}
.ess-sh-score{font-size:13px;font-weight:800;color:var(--tx2);min-height:20px}
.ess-sh-score.ok{color:var(--e-oktx)}
.ess-dots{display:flex;gap:6px;justify-content:center;margin-bottom:14px;flex-wrap:wrap}
.ess-dots i{width:22px;height:6px;border-radius:99px;background:var(--bd);display:block}
.ess-dots i.cur{background:var(--ac)}
.ess-dots i.ok{background:var(--e-ok)}
.ess-tk{width:96px;height:auto;display:block;margin:0 auto 6px}
/* Journey 內嵌課程路徑 */
.ess-jpath{margin:4px 0 14px 13px;background:var(--bg2);border:1px solid var(--bd);border-radius:14px;overflow:hidden}
.ess-jp-h{display:flex;align-items:center;gap:8px;padding:11px 13px;flex-wrap:wrap}
.ess-jp-h b{font-size:13.5px;flex:1;min-width:120px}
.ess-jp-h b small{display:block;font-size:11px;font-weight:600;color:var(--tx3)}
.ess-jp-btn{font:inherit;font-size:12px;font-weight:700;border:1px solid var(--bd);background:var(--bg);color:var(--tx2);border-radius:999px;padding:5px 11px;cursor:pointer;display:inline-flex;align-items:center;gap:4px;white-space:nowrap}
.ess-jp-bar{height:5px;background:var(--bg3);margin:0 13px 11px;border-radius:99px;overflow:hidden}
.ess-jp-bar i{display:block;height:100%;background:var(--e-ok);border-radius:99px}
.ess-jp-list{border-top:1px solid var(--bd)}
.ess-jp-row{font:inherit;display:flex;align-items:center;gap:11px;width:100%;text-align:left;background:none;border:0;border-bottom:1px solid var(--bd);padding:10px 13px;cursor:pointer;color:var(--tx)}
.ess-jp-row:last-child{border-bottom:0}
.ess-jp-row:disabled{cursor:default}
.ess-jp-dot{width:26px;height:26px;border-radius:50%;border:2px solid var(--bd);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:var(--tx3);flex-shrink:0}
.ess-jp-row.done .ess-jp-dot{background:var(--e-ok);border-color:var(--e-ok);color:#fff}
.ess-jp-row.cur .ess-jp-dot{border-color:var(--ac);color:var(--ac)}
.ess-jp-row.lock{color:var(--tx3)}
.ess-jp-tx{flex:1;min-width:0}
.ess-jp-tx b{display:block;font-size:13.5px;font-weight:700;line-height:1.4}
.ess-jp-tx small{display:block;font-size:11.5px;color:var(--tx2);line-height:1.4}
.ess-jp-row.lock .ess-jp-tx small{color:var(--tx3)}
.ess-jp-act{font-size:12px;font-weight:800;white-space:nowrap;border-radius:999px;padding:5px 11px;flex-shrink:0}
.ess-jp-row.cur .ess-jp-act{background:var(--ac);color:#fff}
.ess-jp-row.done .ess-jp-act{background:var(--bg3);color:var(--tx2)}
.ess-jp-row.final .ess-jp-tx b{color:var(--ac)}
`;
    document.head.appendChild(s);
  }

  // ── 畫面狀態 ──
  let S = null;   // { lid, view, quiz:{qs,i,pick,submitted,score,wrong:[],picks}, sh:{...}, practice }
  let stopMic = null;
  function mask() {
    css();
    let m = document.getElementById('essMask');
    if (!m) { m = document.createElement('div'); m.id = 'essMask'; m.className = 'ess-mask ess-root'; document.body.appendChild(m); }
    m.style.display = 'block';
    document.body.classList.add('ess-open');
    return m;
  }
  function lessonIdx(id) { return id === 'final' ? LESSONS.length : LESSONS.findIndex(l => l.id === id); }
  function lessonTitle(id) {
    if (id === 'final') return L('綜合測驗', 'Final review quiz');
    if (id === 'all') return L('隨堂測驗', 'Mini quiz');
    const l = lessonById(id); return isEn() ? l.en : cv(l.zh);
  }
  function lessonNo(id) { const i = lessonIdx(id); return id === 'final' || id === 'all' ? '' : L('第 ' + (i + 1) + ' 課', 'Lesson ' + (i + 1)); }
  function topHtml() {
    const id = S.lid, p = prog(), e = p[id] || {};
    const isLesson = id !== 'final' && id !== 'all';
    let steps = '';
    if (isLesson) {
      const chip = (v, n, zh, en, done) => '<button class="ess-chip' + (S.view === v || (v === 'quiz' && S.view === 'result') ? ' on' : '') + '" data-go="' + v + '">' + (done ? '<i data-ic=check class=ck></i>' : '<span class=nb>' + n + '</span>') + ' ' + L(zh, en) + '</button>';
      steps = '<div class="ess-steps">'
        + chip('learn', '1', '看', 'Learn', !!e.l)
        + chip('quiz', '2', '測', 'Quiz', lessonPassed(id, p))
        + chip('shadow', '3', '跟讀(選用)', 'Speak (optional)', (e.sh || 0) > 0)
        + '</div>';
    }
    return '<div class="ess-top"><div class="ess-top-row"><button class="ess-x" data-act="close"><i data-ic=x></i> ' + L('關閉', 'Close') + '</button>'
      + '<div class="ess-ttl">' + (lessonNo(id) ? '<small>' + lessonNo(id) + '</small>' : '') + esc(lessonTitle(id)) + '</div></div>' + steps + '</div>';
  }
  function paint(body) {
    const m = mask();
    m.innerHTML = '<div class="ess-wrap">' + topHtml() + '<div id="essBody">' + body + '</div></div>';
    m.scrollTop = 0;
    m.onclick = onClick;
    try { if (root.hydrateIcons) root.hydrateIcons(document.getElementById("essMask")); } catch (e) {}
  }
  function onClick(e) {
    const b = e.target.closest('[data-act],[data-go],[data-say],[data-opt]');
    if (!b || b.disabled) return;
    if (b.dataset.say != null) { say(b.dataset.say); return; }
    if (b.dataset.go) { go(b.dataset.go); return; }
    if (b.dataset.opt != null) { selectOpt(+b.dataset.opt); return; }
    const a = b.dataset.act;
    if (a === 'close') close();
    else if (a === 'quiz') startQuiz();
    else if (a === 'submit') submit();
    else if (a === 'next') nextQ();
    else if (a === 'retryWrong') retryWrong();
    else if (a === 'again') startQuiz();
    else if (a === 'shadow') go('shadow');
    else if (a === 'nextLesson') { const i = lessonIdx(S.lid) + 1; open(i >= LESSONS.length ? 'final' : LESSONS[i].id); }
    else if (a === 'replay') { const q = S.quiz.qs[S.quiz.i]; say(q.item.say); }
    else if (a === 'mic') toggleMic();
    else if (a === 'shNext') shNext();
    else if (a === 'table') openTable();
  }
  function go(view) {
    stopListening();
    if (view === 'learn') renderLearn();
    else if (view === 'quiz') startQuiz();
    else if (view === 'shadow') startShadow();
  }

  // ── ① 看 ──
  function cellHtml(it) {
    const y = kana(it.form) !== kana(it.yomi) ? '<span class="y' + (it.irr ? ' irr' : '') + '">' + esc(it.alts.join(' / ')) + '</span>' : '';
    return '<button class="ess-cell" data-say="' + esc(it.say) + '"><span class="f">' + esc(it.form) + '<i data-ic=volume></i></span>' + y + (it.mean ? '<span class="m">' + esc(T(it.mean)) + '</span>' : '') + '</button>';
  }
  function renderLearn() {
    S.view = 'learn';
    const l = lessonById(S.lid);
    let h = l.tip ? '<div class="ess-tip">' + T(l.tip) + '</div>' : '';
    if (l.kind === 'fam') {
      h += '<div class="ess-fam">' + ESS.KAZOKU.map(k => '<div class="ess-fam-row">'
        + '<button data-say="' + esc(prim(k[1])) + '"><b>' + esc(k[0]) + '</b><span class="y">' + esc(k[1]) + '</span></button><span class="ar">→</span>'
        + '<button data-say="' + esc(prim(k[3])) + '"><b>' + esc(k[2]) + '</b><span class="y">' + (k[2] !== k[3] ? esc(k[3]) : '') + '</span></button>'
        + '<span class="z">' + esc(T(k[4])) + '</span></div>').join('') + '</div>';
    } else if (l.kind === 'pt') {
      h += l.items.map(it => '<button class="ess-pt" data-say="' + esc(it.exKana) + '"><div class="ph"><span class="p">' + esc(it.form) + '</span><span class="pu">' + L('讀', 'read') + ' ' + esc(it.yomi) + '</span></div>'
        + '<div class="pd">' + esc(T(it.mean)) + '</div><div class="pe">' + fr(it.ex) + '<div class="z">' + esc(T(it.exZh)) + '</div></div></button>').join('');
    } else {
      l.tables.forEach(tb => {
        h += '<div class="ess-sub">' + esc(T(tb.t)) + (tb.d ? '<small>' + esc(T(tb.d)) + '</small>' : '') + '</div>';
        h += '<div class="ess-grid">' + tb.items.map(cellHtml).join('') + '</div>';
      });
    }
    const n = genQuiz(S.lid, { seed: 1 }).length;
    h += '<div class="ess-btns"><button class="ess-pri" data-act="quiz">' + L('看完了,開始測驗 · ' + n + ' 題', 'Done — start the quiz · ' + n + ' Qs') + '</button>'
      + '<button class="ess-link" data-act="table">' + L('看總表(全部基礎詞)', 'See the full table') + '</button></div>';
    paint(h);
  }

  // ── ② 測(選 → 送出 → 詳解 → 自己按下一題) ──
  function startQuiz(qs) {
    stopListening();
    if (S.lid !== 'final' && S.lid !== 'all') markField(S.lid, 'l', 1);
    const seed = (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0;
    S.quiz = { qs: qs || genQuiz(S.lid, { seed }), i: 0, pick: null, submitted: false, score: 0, wrong: [], retry: !!qs };
    renderQ();
  }
  function promptPlain(q) {
    const it = q.item;
    const ctx = it.ctx ? '[' + it.ctx + '] ' : '';
    if (q.type === 'r2m') return ctx + promptWord(it) + ' → ' + (it.mean ? L('意思?', 'meaning?') : L('哪一個?', 'which one?'));
    if (q.type === 'm2r') return ctx + meanLabel(it) + ' → ' + L('怎麼說?', 'how to say it?');
    if (q.type === 'f2r') return ctx + it.form + ' → ' + L('怎麼念?', 'reading?');
    if (q.type === 'aud') return L('聽音:', 'Audio: ') + it.say;
    if (q.type === 'clz') return String(it.ex).replace(/<b>.*?<\/b>/, '(  )').replace(/<[^>]+>/g, '');
    return '';
  }
  function promptHtml(q) {
    const it = q.item;
    const ctx = it.ctx ? '<div class="ess-ctx">' + esc(it.ctx) + '</div>' : '';
    if (q.type === 'r2m') return ctx + '<div class="ess-qlbl">' + (it.mean ? L('這是什麼意思?', 'What does this mean?') : L('這是哪一個?', 'Which one is this?')) + '</div><div class="ess-qbig">' + esc(promptWord(it)) + '</div><button class="ess-mini" data-say="' + esc(it.say) + '"><i data-ic=volume></i> ' + L('聽', 'Play') + '</button>';
    if (q.type === 'm2r') return ctx + '<div class="ess-qlbl">' + (it.kind === 'pt' ? L('哪個助詞是這個意思?', 'Which particle means this?') : L('日文怎麼說?', 'How do you say it?')) + '</div><div class="ess-qbig" style="font-size:' + (it.mean ? '22px' : '30px') + '">' + esc(meanLabel(it)) + '</div>';
    if (q.type === 'f2r') return ctx + '<div class="ess-qlbl">' + L('這個怎麼念?', 'How is this read?') + '</div><div class="ess-qbig">' + esc(it.form) + '</div>';
    if (q.type === 'aud') return '<div class="ess-qlbl">' + L('聽音,選出正確的', 'Listen and pick the match') + '</div><button class="ess-play" data-act="replay" aria-label="play"><i data-ic=volume></i></button>';
    if (q.type === 'clz') {
      const parts = String(it.ex).split(/<b>.*?<\/b>/);
      return '<div class="ess-qlbl">' + L('填入正確的助詞', 'Fill in the particle') + '</div><div class="ess-qcloze">' + esc(parts[0]) + '<span class="bl">&nbsp;</span>' + esc(parts.slice(1).join('')) + '</div><div class="ess-qzh">' + esc(T(it.exZh)) + '</div>';
    }
    return '';
  }
  function renderQ() {
    S.view = 'quiz';
    const Q = S.quiz, q = Q.qs[Q.i];
    Q.pick = null; Q.submitted = false;
    const h = '<div class="ess-qhead"><span>' + L('第 ' + (Q.i + 1) + ' / ' + Q.qs.length + ' 題', 'Q ' + (Q.i + 1) + ' / ' + Q.qs.length) + '</span><span>' + L('答對 ' + Q.score, 'Correct ' + Q.score) + '</span></div>'
      + '<div class="ess-bar"><i style="width:' + Math.round(Q.i / Q.qs.length * 100) + '%"></i></div>'
      + '<div class="ess-qcard">' + promptHtml(q) + '</div>'
      + '<div class="ess-opts">' + q.options.map((o, i) => '<button class="ess-opt" data-opt="' + i + '"><span class="k">' + 'ABCD'[i] + '</span><span>' + optLabel(q.type, o) + '</span></button>').join('') + '</div>'
      + '<div id="essExp"></div>'
      + '<div class="ess-btns"><button class="ess-pri" id="essSubmit" data-act="submit" disabled>' + L('送出', 'Submit') + '</button></div>';
    paint(h);
    if (q.type === 'aud') setTimeout(() => say(q.item.say), 250);
  }
  function selectOpt(i) {
    const Q = S.quiz; if (!Q || Q.submitted) return;
    Q.pick = i;
    document.querySelectorAll('.ess-opt').forEach((b, k) => b.classList.toggle('sel', k === i));
    const sb = document.getElementById('essSubmit'); if (sb) sb.disabled = false;
  }
  function submit() {
    const Q = S.quiz; if (!Q || Q.submitted || Q.pick == null) return;
    Q.submitted = true;
    const q = Q.qs[Q.i], ok = Q.pick === q.answer;
    if (ok) Q.score++; else { Q.wrong.push(q); addWrong(q, Q.pick); }
    try { if (root.StayDaily && StayDaily.log) StayDaily.log('quiz'); } catch (e) {}
    document.querySelectorAll('.ess-opt').forEach((b, k) => { b.disabled = true; b.classList.remove('sel'); if (k === q.answer) b.classList.add('ok'); else if (k === Q.pick) b.classList.add('ng'); });
    const it = q.item;
    let exp = '<div class="ess-exp ' + (ok ? 'ok' : 'ng') + '"><div class="h"><i data-ic=' + (ok ? 'check' : 'x') + '></i> ' + (ok ? L('答對了', 'Correct') : L('答錯了', 'Not quite')) + '</div>';
    exp += '<div class="ln">' + L('正解', 'Answer') + ':<b>' + itemLine(it) + '</b>' + (it.irr ? ' <span class="irr">' + L('(不規則/變音,要特別記)', '(irregular — memorize)') + '</span>' : '') + '</div>';
    if (it.kind === 'pt') exp += '<div class="ln">' + fr(it.ex) + '<br><span style="color:var(--tx2)">' + esc(T(it.exZh)) + '</span></div>';
    if (!ok) { const o = q.options[Q.pick]; exp += '<div class="ln">' + L('你選的「', 'You picked “') + optLabel(q.type, o) + L('」其實是:', '”, which is: ') + itemLine(o.of) + '</div>'; }
    exp += '<button class="ess-mini" data-say="' + esc(it.say) + '"><i data-ic=volume></i> ' + L('再聽一次', 'Play again') + '</button></div>';
    document.getElementById('essExp').innerHTML = exp;
    const last = Q.i >= Q.qs.length - 1;
    const sb = document.getElementById('essSubmit');
    sb.dataset.act = 'next'; sb.disabled = false;
    sb.innerHTML = last ? L('看結果', 'See results') + ' →' : L('下一題', 'Next') + ' →';
    try { if (root.hydrateIcons) root.hydrateIcons(document.getElementById("essMask")); } catch (e) {}
    say(it.say);
  }
  function nextQ() { const Q = S.quiz; Q.i++; if (Q.i >= Q.qs.length) return result(); renderQ(); }
  function result() {
    S.view = 'result';
    const Q = S.quiz, tot = Q.qs.length, ok = passed(Q.score, tot);
    const isLesson = S.lid !== 'final' && S.lid !== 'all';
    if (S.lid !== 'all' && !Q.retry) recordResult(S.lid, Q.score, tot);
    try { if (window.RatePrompt && !Q.retry && tot && Q.score / tot >= 0.8) RatePrompt.moment('result_80'); } catch (e) {}   // 開心時刻 → 評分提醒(rate-prompt.js 自己延遲+判資格)
    const idx = lessonIdx(S.lid);
    const need = Math.ceil(tot * PASS_RATIO);
    let msg;
    if (S.lid === 'all') msg = ok ? L('不錯!錯的再看一下就更穩。', 'Nice! Review the misses and you are solid.') : L('多練幾次,紅字的地方特別記。', 'Keep drilling — the red readings need extra reps.');
    else if (Q.retry) msg = L('錯題重做完成。想更新成績,再做一次整份測驗。', 'Retry done. Take the full quiz again to update your score.');
    else if (S.lid === 'final') msg = ok ? L('綜合測驗通過!「必學基礎詞」完成打勾。', 'Final quiz passed — Essential basics is checked off!') : L('答對 ' + need + ' 題就過關,把錯的看一下再挑戰。', 'Get ' + need + ' right to pass. Review the misses and try again.');
    else msg = ok ? (idx < LESSONS.length - 1 ? L('過關!下一課已解鎖。', 'Passed! The next lesson is unlocked.') : L('過關!綜合測驗等你挑戰。', 'Passed! The final quiz is ready.')) : L('答對 ' + need + ' 題就過關,再試一次。', 'Get ' + need + ' right to pass — try again.');
    let h = '<div class="ess-res"><img class="ess-tk" src="images/mascot/' + (ok ? 'tanuki-p06' : 'tanuki-p07') + '.png" alt=""><div class="ess-score">' + Q.score + ' / ' + tot + '</div><p>' + msg + '</p></div>';
    if (Q.wrong.length) {
      h += '<div class="ess-wlist"><div class="wh">' + L('錯的題目(已收進「我的 › 錯題回顧」)', 'Missed (saved to your mistake list)') + '</div>'
        + Q.wrong.map(q => '<div class="ess-wrow"><div class="a">' + itemLine(q.item) + '</div><div class="c">' + esc(promptPlain(q)) + '</div></div>').join('') + '</div>';
    }
    h += '<div class="ess-btns">';
    const nextBtn = isLesson && lessonPassed(S.lid) ? '<button class="ess-pri" data-act="nextLesson">' + (idx < LESSONS.length - 1 ? L('下一課', 'Next lesson') + ':' + esc(lessonTitle(LESSONS[idx + 1].id)) : L('挑戰綜合測驗', 'Take the final quiz')) + ' →</button>' : '';
    if (ok && nextBtn) h += nextBtn;
    if (Q.wrong.length) h += '<button class="' + (ok ? 'ess-sec' : 'ess-pri') + '" data-act="retryWrong"><i data-ic=refresh></i> ' + L('重做錯題(' + Q.wrong.length + ')', 'Retry missed (' + Q.wrong.length + ')') + '</button>';
    h += '<button class="ess-sec" data-act="again">' + L('再做一次', 'Take it again') + '</button>';
    if (isLesson) h += '<button class="ess-sec" data-act="shadow"><i data-ic=mic></i> ' + L('跟讀這課的詞(選用)', 'Speak these words (optional)') + '</button>';
    if (!ok && nextBtn) h += nextBtn;
    h += '<button class="ess-link" data-act="close">' + (S.practice ? L('關閉', 'Close') : L('回課程', 'Back to lessons')) + '</button></div>';
    paint(h);
  }
  function retryWrong() { const w = S.quiz.wrong.slice(); startQuiz(w); }

  // ── ③ 跟讀(單字級):聽 → 按麥克風念 → shadow-core 計分(與第 4 章跟讀同一套正規化/門檻) ──
  function shadowItems(l) {
    const its = l.items.filter(x => x.say);
    const pick = its.filter(x => x.irr).concat(its.filter(x => !x.irr));
    const max = l.kind === 'pt' ? 6 : 8;
    const chosen = new Set(pick.slice(0, max));
    return its.filter(x => chosen.has(x));   // 維持表格順序
  }
  function startShadow() {
    const l = lessonById(S.lid); if (!l) return;
    S.sh = { list: shadowItems(l), i: 0, ok: [], best: 0 };
    renderShadow();
  }
  function renderShadow() {
    S.view = 'shadow';
    const SH = S.sh, it = SH.list[SH.i];
    SH.best = 0;
    const sup = root.ShadowCore && ShadowCore.supported();
    const isPt = it.kind === 'pt';
    const w = isPt ? fr(it.ex) : esc(it.form);
    const dots = SH.list.map((_, k) => '<i class="' + (SH.ok[k] ? 'ok' : k === SH.i ? 'cur' : '') + '"></i>').join('');
    const h = '<div class="ess-dots">' + dots + '</div>'
      + '<div class="ess-sh"><div class="w" style="' + (isPt ? 'font-size:22px' : '') + '">' + w + '</div>'
      + (!isPt && kana(it.form) !== kana(it.yomi) ? '<div class="y">' + esc(it.yomi) + '</div>' : '')
      + '<div class="m">' + esc(isPt ? T(it.exZh) : (it.mean ? meanLabel(it) : '')) + '</div>'
      + '<div class="ess-sh-ctl"><button data-say="' + esc(it.say) + '" aria-label="play"><i data-ic=volume></i></button>'
      + '<button class="mic" id="essMic" data-act="mic" aria-label="mic"' + (sup ? '' : ' disabled') + '><i data-ic=mic></i></button></div>'
      + '<div class="ess-sh-hint" id="essShHint">' + (sup ? L('先聽一次,再按麥克風跟著念', 'Listen first, then tap the mic and repeat') : L('這個瀏覽器不支援語音辨識:先聽、自己跟著念出來,再按下一個。', 'Speech recognition is not supported here — listen, say it out loud, then go next.')) + '</div>'
      + '<div class="ess-sh-said" id="essShSaid"></div>'
      + '<div class="ess-sh-meter" id="essShMeter"><i></i></div><div class="ess-sh-score" id="essShScore"></div></div>'
      + '<div class="ess-btns"><button class="' + (sup ? 'ess-sec' : 'ess-pri') + '" id="essShNext" data-act="shNext">' + (SH.i >= SH.list.length - 1 ? L('完成', 'Finish') : (sup ? L('跳過,下一個', 'Skip to next') : L('下一個', 'Next'))) + ' →</button></div>';
    paint(h);
    setTimeout(() => say(it.say), 250);
  }
  function setShScore(score, fin) {
    const SH = S.sh; if (score > SH.best) SH.best = score;
    const m = document.getElementById('essShMeter'), sc = document.getElementById('essShScore');
    const ok = ShadowCore.passed(SH.best, fin);
    if (m) { m.querySelector('i').style.width = SH.best + '%'; m.classList.toggle('ok', ok); }
    if (sc) { sc.textContent = L('發音吻合度 ', 'Match ') + SH.best + '%' + (ok ? ' · ' + L('很好!', 'Nice!') : ''); sc.classList.toggle('ok', ok); }
    if (ok && !SH.ok[SH.i]) {
      SH.ok[SH.i] = true;
      stopListening();
      const h = document.getElementById('essShHint'); if (h) h.textContent = L('過關!可以再念一次,或按下一個', 'Passed! Say it again or go next');
      const nb = document.getElementById('essShNext');
      if (nb) { nb.className = 'ess-pri'; nb.innerHTML = (SH.i >= SH.list.length - 1 ? L('完成', 'Finish') : L('下一個', 'Next')) + ' →'; }
      const d = document.querySelectorAll('.ess-dots i')[SH.i]; if (d) d.className = 'ok';
    }
  }
  function toggleMic() {
    if (stopMic) { stopListening(); return; }
    const SH = S.sh, it = SH.list[SH.i];
    const mic = document.getElementById('essMic'), hint = document.getElementById('essShHint'), said = document.getElementById('essShSaid');
    try { if (root._ttsNow) root._ttsNow.pause(); } catch (e) {}
    if (mic) mic.classList.add('on');
    if (hint) hint.textContent = L('請說…', 'Now say it…');
    const targets = { yomi: it.kind === 'pt' ? [it.exKana] : it.alts, forms: it.kind === 'pt' ? [String(it.ex).replace(/<[^>]+>/g, '')] : [it.form] };
    let heard = '';
    stopMic = ShadowCore.listen({
      onResult(t, fin) { heard = t; if (said) said.textContent = t; setShScore(ShadowCore.scoreWord(t, targets), fin); },
      onEnd(err) {
        stopMic = null;
        const m2 = document.getElementById('essMic'); if (m2) m2.classList.remove('on');
        if (S && S.sh && SH === S.sh && !SH.ok[SH.i]) {
          const h2 = document.getElementById('essShHint'); if (!h2) return;
          if (err === 'not-allowed') h2.textContent = L('麥克風權限被關了,請到設定允許麥克風。', 'Microphone access is off — allow it in Settings.');
          else if (err && err !== 'aborted' && err !== 'no-speech') h2.textContent = L('辨識出錯(' + err + '),再按一次麥克風試試。', 'Recognition error (' + err + ') — tap the mic to try again.');
          else if (!heard) h2.textContent = L('沒聽到聲音,再按一次麥克風。', "Didn't catch that — tap the mic again.");
          else { setShScore(ShadowCore.scoreWord(heard, targets), true); if (!SH.ok[SH.i]) h2.textContent = L('再聽一次,跟著念念看', 'Listen again and repeat'); }
        }
      }
    });
  }
  function stopListening() { if (stopMic) { const f = stopMic; stopMic = null; try { f(); } catch (e) {} } const m = document.getElementById('essMic'); if (m) m.classList.remove('on'); }
  function shNext() {
    stopListening();
    const SH = S.sh;
    SH.i++;
    if (SH.i < SH.list.length) return renderShadow();
    const n = SH.ok.filter(Boolean).length;
    markField(S.lid, 'sh', Math.max(n, 1));   // 走完一輪就算做過跟讀(勾 ③)
    const idx = lessonIdx(S.lid);
    let h = '<div class="ess-res"><img class="ess-tk" src="images/mascot/tanuki-p06.png" alt=""><div class="ess-score" style="font-size:34px">' + n + ' / ' + SH.list.length + '</div><p>' + L('個詞跟讀過關', 'words passed') + '</p></div><div class="ess-btns">';
    if (lessonPassed(S.lid)) h += '<button class="ess-pri" data-act="nextLesson">' + (idx < LESSONS.length - 1 ? L('下一課', 'Next lesson') + ':' + esc(lessonTitle(LESSONS[idx + 1].id)) : L('挑戰綜合測驗', 'Take the final quiz')) + ' →</button>';
    else h += '<button class="ess-pri" data-act="quiz">' + L('去做測驗', 'Take the quiz') + ' →</button>';
    h += '<button class="ess-sec" data-act="shadow"><i data-ic=refresh></i> ' + L('再跟讀一輪', 'Another round') + '</button>'
      + '<button class="ess-link" data-act="close">' + L('回課程', 'Back to lessons') + '</button></div>';
    S.view = 'shdone';
    paint(h);
  }

  // ── 進出 ──
  function open(id, view) {
    stopListening();
    if (id !== 'final' && id !== 'all' && !lessonById(id)) return;
    const i = lessonIdx(id);
    if (id !== 'all' && lessonState(i) === 'lock') { const ni = nextIndex(); id = ni >= LESSONS.length ? 'final' : LESSONS[ni].id; }
    S = { lid: id, view: '', practice: id === 'all' };
    if (id === 'final' || id === 'all') startQuiz();
    else if (view === 'quiz') startQuiz();
    else renderLearn();
  }
  function openNext() { const i = nextIndex(); open(i >= LESSONS.length ? 'final' : LESSONS[i].id); }
  function practiceAll() { open('all'); }
  function close() {
    stopListening();
    const m = document.getElementById('essMask'); if (m) { m.style.display = 'none'; m.innerHTML = ''; }
    document.body.classList.remove('ess-open');
    S = null;
    try { if (typeof api.onChange === 'function') api.onChange(); } catch (e) {}
  }
  function openTable() {
    const inApp = !!document.getElementById('jrMask') || typeof root.Journey !== 'undefined';
    if (!inApp) { close(); return; }   // 已經在總表頁
    try { if (root.NavBack) NavBack.pushPage('journey', 'essentials.html'); } catch (e) {}
    location.href = 'essentials.html';
  }
  // Journey 內嵌的課程路徑
  function isPathOpen() { try { const v = localStorage.getItem('ess_path_open'); return v == null ? !lessonPassed('final') : v === '1'; } catch (e) { return true; } }
  function togglePath() { try { localStorage.setItem('ess_path_open', isPathOpen() ? '0' : '1'); } catch (e) {} try { if (typeof api.onChange === 'function') api.onChange(); } catch (e) {} }
  function journeyHtml() {
    css();
    const p = prog(), st = stats(), openP = isPathOpen();
    const ni = nextIndex();
    let h = '<div class="ess-jpath ess-root"><div class="ess-jp-h"><b>' + L('小課進度 ' + st.done + ' / ' + st.tot, 'Lessons ' + st.done + ' / ' + st.tot)
      + '<small>' + (st.final ? L('綜合測驗已通過', 'Final quiz passed') : L('每課:看一張小表 → 小測驗 → 跟讀', 'Each lesson: small table → quiz → speak')) + '</small></b>'
      + '<button class="ess-jp-btn" onclick="EssLessons.openTable()"><i data-ic=grid></i> ' + L('看總表', 'Full table') + '</button>'
      + '<button class="ess-jp-btn" onclick="EssLessons.togglePath()">' + (openP ? L('收合', 'Hide') : L('展開', 'Show')) + '</button></div>'
      + '<div class="ess-jp-bar"><i style="width:' + Math.round(st.done / st.tot * 100) + '%"></i></div>';
    if (openP) {
      h += '<div class="ess-jp-list">';
      for (let i = 0; i <= LESSONS.length; i++) {
        const id = i === LESSONS.length ? 'final' : LESSONS[i].id;
        const s = lessonState(i, p), e = p[id] || {};
        const cls = s === 'done' ? 'done' : s === 'lock' ? 'lock' : (i === ni ? 'cur' : 'open');
        const title = id === 'final' ? L('綜合測驗 · ' + FINAL_Q + ' 題', 'Final quiz · ' + FINAL_Q + ' Qs') : (L('第 ' + (i + 1) + ' 課', 'L' + (i + 1)) + ' · ' + esc(lessonTitle(id)));
        let sub;
        if (s === 'lock') sub = id === 'final' ? L('過完全部小課解鎖', 'Unlocks after all lessons') : L('過完上一課解鎖', 'Unlocks after the previous lesson');
        else if (e.t) sub = L('最佳 ' + e.b + ' / ' + e.t, 'Best ' + e.b + ' / ' + e.t) + (e.sh ? ' · ' + L('跟讀過', 'spoken') : '') + (s !== 'done' ? ' · ' + L('答對 60% 過關', 'pass at 60%') : '');
        else sub = id === 'final' ? L('通過 = 這一步打勾', 'Pass to check off this step') : L('看 → 測 → 跟讀', 'Learn → quiz → speak');
        const dot = s === 'done' ? '<i data-ic=check></i>' : s === 'lock' ? '<i data-ic=lock></i>' : (id === 'final' ? '<i data-ic=star></i>' : String(i + 1));
        const act = s === 'done' ? L('再做一次', 'Again') : s === 'lock' ? '' : L('開始', 'Start');
        h += '<button class="ess-jp-row ' + cls + (id === 'final' ? ' final' : '') + '"' + (s === 'lock' ? ' disabled' : ' onclick="EssLessons.open(\'' + id + '\')"') + '>'
          + '<span class="ess-jp-dot">' + dot + '</span><span class="ess-jp-tx"><b>' + title + '</b><small>' + sub + '</small></span>'
          + (act ? '<span class="ess-jp-act">' + act + '</span>' : '') + '</button>';
      }
      h += '</div>';
    }
    return h + '</div>';
  }

  const api = Object.assign({}, pure, { open, openNext, practiceAll, close, openTable, journeyHtml, togglePath, stats, lessonState, onChange: null, _state: () => S, _selectOpt: selectOpt, _setShScore: setShScore });
  root.EssLessons = api;
})(typeof window !== 'undefined' ? window : globalThis);
