/**
 * Lightweight virtual scroll for large lists — 變動高度版。
 * 只渲染視窗內 + buffer 的項目。項目高度不一(如分類標題 vs 單字卡)時,
 * 用「渲染後量測真實高度 → 累積 offset 定位」,避免固定高度造成的重疊或大空隙。
 *
 * cfg.itemHeight 當「未量測項的估計高度」用(自動被真實量測修正)。
 * 公開 API 不變:init / destroy / isActive / scrollToIndex。
 */
const VirtualList = (() => {
  let container = null;
  let spacer = null;
  let estH = 120;          // 未量測項的估計高度
  let items = [];
  let renderItem = null;
  let buffer = 8;
  let scrollParent = null;
  let rafId = null;
  let heights = [];        // 每項實際高度(未量測 = undefined)
  let offsets = [];        // 累積頂端位置,長度 items.length + 1
  let rendered = new Map(); // index -> DOM 元素(目前掛著的)
  let lastRange = '';

  // 依 heights(未量測用 estH)重算 offsets + spacer 總高
  function rebuildOffsets() {
    const n = items.length;
    if (offsets.length !== n + 1) offsets = new Array(n + 1);
    offsets[0] = 0;
    for (let i = 0; i < n; i++) offsets[i + 1] = offsets[i] + (heights[i] || estH);
    if (spacer) spacer.style.height = offsets[n] + 'px';
  }

  // 二分找第一個「底端 > y」的項目 index
  function indexAt(y) {
    let lo = 0, hi = items.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (offsets[mid + 1] <= y) lo = mid + 1; else hi = mid;
    }
    return Math.min(lo, items.length - 1);
  }

  function init(cfg) {
    container = cfg.container;
    items = cfg.items || [];
    estH = cfg.itemHeight || 120;
    renderItem = cfg.renderItem;
    buffer = cfg.buffer || 8;
    scrollParent = cfg.scrollParent || window;

    container.style.position = 'relative';
    container.innerHTML = '';

    spacer = document.createElement('div');
    spacer.style.position = 'relative';
    container.appendChild(spacer);

    heights = new Array(items.length);
    rendered = new Map();
    lastRange = '';
    rebuildOffsets();

    scrollParent.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    onScroll();

    // 首次渲染可能在字型/furigana 完全排版前量到錯的高度 → 卡片位置錯亂(例句跑到別欄位)。
    // 字型載入完成後重新量測一次;另補一個 rAF 保險(排版穩定後)。
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { if (container) remeasure(); });
    }
    requestAnimationFrame(function () { if (container) remeasure(); });
  }

  function onScroll() {
    if (rafId) return;
    rafId = requestAnimationFrame(() => { rafId = null; render(); });
  }

  // 視窗變寬變窄 → 高度全變,清空重量測
  function onResize() {
    heights = new Array(items.length);
    lastRange = '';
    rebuildOffsets();
    render();
  }

  function render() {
    if (!container || !items.length || !spacer) return;

    const containerRect = container.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const top = Math.max(0, -containerRect.top);
    const bottom = top + viewportH;

    let start = indexAt(top) - buffer;
    let end = indexAt(bottom) + buffer + 1;
    start = Math.max(0, start);
    end = Math.min(items.length, end);

    const rangeKey = start + ':' + end;
    // 範圍沒變也要確保定位正確(高度可能被別處改),但可省掉增刪
    const sameRange = rangeKey === lastRange;
    lastRange = rangeKey;

    // 移除範圍外的
    for (const [i, el] of rendered) {
      if (i < start || i >= end) { el.remove(); rendered.delete(i); }
    }

    // 新增範圍內的 + 量測真實高度
    let changed = false;
    for (let i = start; i < end; i++) {
      if (rendered.has(i)) continue;
      const el = document.createElement('div');
      el.className = 'vl-item';
      el.style.position = 'absolute';
      el.style.left = '0';
      el.style.right = '0';
      el.style.top = offsets[i] + 'px';
      el.innerHTML = renderItem(items[i], i);
      spacer.appendChild(el);
      rendered.set(i, el);
      const h = el.offsetHeight;
      if (h > 0 && Math.abs((heights[i] || estH) - h) > 0.5) { heights[i] = h; changed = true; }
    }

    // 有量測到新高度 → 重算 offset,並把目前掛著的項目重新定位(消除重疊/空隙)
    if (changed) {
      rebuildOffsets();
      for (const [i, el] of rendered) el.style.top = offsets[i] + 'px';
    } else if (!sameRange) {
      for (const [i, el] of rendered) el.style.top = offsets[i] + 'px';
    }
  }

  function destroy() {
    if (scrollParent) {
      scrollParent.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    }
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    if (rendered) rendered.forEach(el => el.remove());
    container = null;
    spacer = null;
    items = [];
    heights = [];
    offsets = [];
    rendered = new Map();
    lastRange = '';
  }

  function isActive() {
    return container !== null;
  }

  // 清掉快取高度重新量測(字級改變等造成卡片高度變化時用)。只重排目前列表,
  // 不重建整個畫面 → 不閃爍、不影響其他區塊(分類展開狀態等)。
  function remeasure() {
    if (!container || !items.length) return;
    // 必須先移除目前渲染的項目 → render() 才會重建並「重新量測」;
    // 否則 render() 見到項目已在 rendered map 就跳過、量不到新高度,offsets 用估計值 → 重疊。
    rendered.forEach(function (el) { el.remove(); });
    rendered = new Map();
    heights = new Array(items.length);
    lastRange = '';
    rebuildOffsets();
    render();
  }

  // 捲到第 i 個項目(側邊欄分類跳轉用)。扣掉固定頁首高度避免被遮。
  function scrollToIndex(i) {
    if (!container || !items.length) return;
    i = Math.max(0, Math.min(items.length - 1, i));
    const cs = getComputedStyle(document.documentElement);
    const off = (parseInt(cs.getPropertyValue('--hh')) || 0) + (parseInt(cs.getPropertyValue('--bar-h')) || 0) + 16;
    const sp = scrollParent === window ? (window.scrollY || window.pageYOffset || 0) : scrollParent.scrollTop;
    const containerDocTop = container.getBoundingClientRect().top + sp;
    const target = Math.max(0, containerDocTop + offsets[i] - off);
    if (scrollParent === window) window.scrollTo({ top: target, behavior: 'smooth' });
    else if (scrollParent.scrollTo) scrollParent.scrollTo({ top: target, behavior: 'smooth' });
    else scrollParent.scrollTop = target;
    onScroll();
  }

  return { init, destroy, isActive, scrollToIndex, remeasure };
})();
