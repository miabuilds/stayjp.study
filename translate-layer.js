// translate-layer.js — 執行期 zh→en UI 翻譯層(僅 lang=en 生效)。
// 這 app 的 UI 中文多為硬編、散在各檔;此層在渲染後把畫面上殘留的「UI 中文」換成英文。
//   - 跳過學習內容容器(日文單字/例句/文法標題等),避免誤翻正在學的日文。
//   - exact map(短)+ 長鍵子字串替換(抓合併節點如 footer「…·服務條款·…」)+ regex patterns(動態數字/日期)。
//   - 資料:ui-map.js → window.__UI_MAP / window.__UI_PATTERNS。
// 切語言涉及 en 時 cycleLang 會 reload,故此層只需單向套用。
(function () {
  const MAP = window.__UI_MAP || {};
  const RAWP = window.__UI_PATTERNS || [];
  const PATTERNS = RAWP.map(p => { try { return { re: new RegExp(p.pattern), en: p.en }; } catch (_) { return null; } }).filter(Boolean);
  // 長鍵(≥4 字)做子字串替換,長度由長到短避免前綴互吃
  const SUBS = Object.keys(MAP).filter(k => k.length >= 4).sort((a, b) => b.length - a.length);
  // 學習內容/日文容器 → 不翻
  const SKIP = '.vw,.vr,.j,ruby,rt,.gt,.pt,.gn,.eg .j,[data-nolang]';
  function active() {
    try { if (typeof I18n !== 'undefined' && I18n.getLang) return I18n.getLang() === 'en'; } catch (_) {}
    try { return localStorage.getItem('ui_lang') === 'en'; } catch (_) {}   // I18n 沒載的頁 → 直接讀 ui_lang
    return false;
  }
  function inSkip(node) {
    const el = node.nodeType === 3 ? node.parentElement : node;
    return el && el.closest && el.closest(SKIP);
  }

  function trStr(text) {
    if (text == null) return text;
    const key = text.trim();
    if (!key) return text;
    if (Object.prototype.hasOwnProperty.call(MAP, key)) return text.replace(key, MAP[key]);
    for (const p of PATTERNS) { p.re.lastIndex = 0; if (p.re.test(key)) { const o = key.replace(p.re, p.en); if (o !== key) return text.replace(key, o); } }
    // 子字串:僅對「短節點」(<40 字)做,避免把長 prose 譯成中英混雜的半殘;長句沒 exact 命中就整段保留。
    if (text.length < 40 && /[一-鿿]/.test(text)) {
      let out = text, hit = false;
      for (const k of SUBS) { if (out.indexOf(k) !== -1) { out = out.split(k).join(MAP[k]); hit = true; } }
      if (hit) return out;
    }
    return text;
  }
  function trTextNode(nd) { if (inSkip(nd)) return; const t = trStr(nd.nodeValue); if (t !== nd.nodeValue) nd.nodeValue = t; }
  function trAttrs(el) {
    if (!el.querySelectorAll) return;
    el.querySelectorAll('[placeholder],[title],[aria-label]').forEach(e => {
      if (e.closest(SKIP)) return;
      ['placeholder', 'title', 'aria-label'].forEach(a => { if (e.hasAttribute(a)) { const v = e.getAttribute(a), t = trStr(v); if (t !== v) e.setAttribute(a, t); } });
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
