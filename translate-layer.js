// translate-layer.js — 執行期「繁中 → 外語」UI 翻譯層(lang 為 en/ko/vi/id/th 時生效)。
// 這 app 的 UI 中文多為硬編、散在各檔;此層在渲染後把畫面上殘留的「UI 中文」換成目標語言。
//   - 跳過學習內容容器(日文單字/例句/文法標題等),避免誤翻正在學的日文。
//   - exact map(短)+ 長鍵子字串替換(抓合併節點如 footer「…·服務條款·…」)+ regex patterns(動態數字/日期)。
//   - 資料:en → ui-map.js(window.__UI_MAP / __UI_PATTERNS);ko/vi/id/th → lang/<code>.js(window.__L10N[code].ui / .patterns,
//     由 i18n.js 同步載入)。兩者都經 I18n.uiMap()/uiPatterns() 取,這裡不分語言。
//   - 頁面只載了本檔、沒載 ui-map.js 時(speak/jlpt-drill 等獨立頁),lang=en 會在這裡補載 ui-map.js。
// 切語言涉及外語時會 reload,故此層只需單向套用。
(function () {
  function curLang() {
    try { if (typeof I18n !== 'undefined' && I18n.getLang) return I18n.getLang(); } catch (_) {}
    try { return localStorage.getItem('ui_lang') || 'zh-TW'; } catch (_) {}   // I18n 沒載的頁 → 直接讀 ui_lang
    return 'zh-TW';
  }
  const LANG = curLang();
  const FOREIGN = LANG === 'en' || LANG === 'ko' || LANG === 'vi' || LANG === 'id' || LANG === 'th';
  // en 且頁面沒載 ui-map.js → 以本檔 src 為基準同步補載(document.write 在同步 script 裡合法)
  if (LANG === 'en' && !window.__UI_MAP) {
    try {
      var me = document.currentScript && document.currentScript.src;
      var base = me ? me.replace(/[^/]*(\?.*)?$/, '') : '';
      var ver = me && /[?&]v=([^&]+)/.test(me) ? '?v=' + RegExp.$1 : '';
      document.write('<script src="' + base + 'ui-map.js' + ver + '"><\/script>');
    } catch (_) {}
  }
  // 泰文有上下疊的聲調/母音符號,原本為中文設計的緊湊行高(標題 1.1~1.2)會上下互疊 → 全站標題行高放寬
  if (LANG === 'th') { try { const st = document.createElement('style'); st.textContent = 'html[lang="th"] h1,html[lang="th"] h2,html[lang="th"] h3,html[lang="th"] .hs-hello h2,html[lang="th"] .hero h1{line-height:1.45 !important}html[lang="th"] body{line-height:1.7}'; (document.head || document.documentElement).appendChild(st); } catch (_) {} }
  // 對照表延後到真正要翻時才讀(上面補載的 ui-map.js 要等本檔跑完才會執行)
  let MAP = null, PATTERNS = null, SUBS = null;
  function ensureMap() {
    if (MAP) return;
    if (typeof I18n !== 'undefined' && I18n.uiMap) { MAP = I18n.uiMap(); PATTERNS = I18n.uiPatterns(); }
    else if (LANG === 'en') { MAP = window.__UI_MAP || {}; PATTERNS = (window.__UI_PATTERNS || []).map(p => ({ pattern: p.pattern, to: p.en })); }
    else { const p = window.__L10N && window.__L10N[LANG]; MAP = (p && p.ui) || {}; PATTERNS = (p && p.patterns) || []; }
    PATTERNS = PATTERNS.map(p => { try { return { re: new RegExp(p.pattern), to: p.to != null ? p.to : p.en }; } catch (_) { return null; } }).filter(Boolean);
    // 長鍵(≥4 字)做子字串替換,長度由長到短避免前綴互吃
    SUBS = Object.keys(MAP).filter(k => k.length >= 4).sort((a, b) => b.length - a.length);
  }
  // 學習內容/日文容器 → 不翻
  const SKIP = '.vw,.vr,.j,ruby,rt,.gt,.pt,.gn,.eg .j,[data-nolang]';
  function active() { return FOREIGN; }
  function inSkip(node) {
    const el = node.nodeType === 3 ? node.parentElement : node;
    return el && el.closest && el.closest(SKIP);
  }

  function trStr(text) {
    if (text == null) return text;
    const key = text.trim();
    if (!key) return text;
    ensureMap();
    if (Object.prototype.hasOwnProperty.call(MAP, key)) return text.replace(key, MAP[key]);
    for (const p of PATTERNS) { p.re.lastIndex = 0; if (p.re.test(key)) { const o = key.replace(p.re, p.to); if (o !== key) return text.replace(key, o); } }
    // 子字串:僅對「短節點」(<40 字)做,避免把長 prose 譯成中英混雜的半殘;長句沒 exact 命中就整段保留。
    if (text.length < 40 && /[一-鿿]/.test(text)) {
      let out = text, hit = false;
      for (const k of SUBS) { if (out.indexOf(k) !== -1) { out = out.split(k).join(MAP[k]); hit = true; } }
      if (hit) return out;
    }
    return text;
  }
  // 已翻過的節點記住「我們寫進去的值」:值沒被程式改動就不再翻。
  // 不記的話 translateAll 會跑好幾輪(0/1200/3500ms + MutationObserver),譯文裡若含原文片段(例:「사업자 등록 번호(統一編號)」)
  // 會被子字串規則一層層套進去,變成「번호(번호(번호(統一編號)))」。英文譯文不含中文所以以前沒事,韓/越/印/泰會。
  const DONE = new WeakMap();
  function trTextNode(nd) {
    if (inSkip(nd)) return;
    if (DONE.get(nd) === nd.nodeValue) return;
    const t = trStr(nd.nodeValue);
    if (t !== nd.nodeValue) nd.nodeValue = t;
    DONE.set(nd, nd.nodeValue);
  }
  function trAttrs(el) {
    if (!el.querySelectorAll) return;
    el.querySelectorAll('[placeholder],[title],[aria-label]').forEach(e => {
      if (e.closest(SKIP)) return;
      let rec = DONE.get(e); if (!rec) { rec = {}; DONE.set(e, rec); }
      ['placeholder', 'title', 'aria-label'].forEach(a => {
        if (!e.hasAttribute(a)) return;
        const v = e.getAttribute(a); if (rec[a] === v) return;
        const t = trStr(v); if (t !== v) e.setAttribute(a, t); rec[a] = e.getAttribute(a);
      });
    });
  }
  function walk(root) {
    if (!active() || !root) return;
    if (root.nodeType === 3) { trTextNode(root); return; }
    if (root.nodeType !== 1) return;
    if (root.closest && root.closest(SKIP)) { trAttrs(root); return; }
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = []; let n; while (n = w.nextNode()) nodes.push(n);
    nodes.forEach(trTextNode);
    trAttrs(root);
  }
  function translateAll() { if (active()) walk(document.body); }
  window.UITranslate = { translateAll, walk, active, trStr };

  // 攔截原生對話框(alert/confirm/prompt):英文模式下先過字典翻譯再顯示。
  // 這些是瀏覽器原生 UI、非 DOM 文字節點,walk/MutationObserver 抓不到,只能在呼叫點攔。
  ['alert', 'confirm', 'prompt'].forEach(function (fn) {
    var orig = window[fn];
    if (typeof orig !== 'function') return;
    window[fn] = function (msg) {
      var args = [].slice.call(arguments);
      try { if (active() && msg != null) args[0] = trStr(String(msg)); } catch (_) {}
      return orig.apply(window, args);
    };
  });

  function start() {
    if (!document.body) return void setTimeout(start, 40);
    translateAll();
    const obs = new MutationObserver(muts => {
      if (!active()) return;
      for (const m of muts) {
        if (m.addedNodes) m.addedNodes.forEach(node => { if (node.nodeType === 1) walk(node); else if (node.nodeType === 3) trTextNode(node); });
        if (m.type === 'characterData' && m.target && m.target.nodeType === 3) trTextNode(m.target);
      }
    });
    obs.observe(document.body, { childList: true, subtree: true, characterData: true });
    setTimeout(translateAll, 1200);
    setTimeout(translateAll, 3500);
  }
  start();
})();
