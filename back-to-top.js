// 全站通用「回到頂部」浮動鈕:捲動超過一段距離才浮現,點擊平滑回到頁首。
// 各頁引入即可(同 font-scale.js)。自動偵測底部 tab bar(.ftb)並抬高避免遮擋。
// 主題感知(用 --bg2/--bd/--ac,任何頁都有),尊重 prefers-reduced-motion。
(function () {
  if (document.getElementById('backToTop')) return;
  function init() {
    if (document.getElementById('backToTop')) return;
    var css = document.createElement('style');
    css.id = 'backToTopCss';
    css.textContent =
      '#backToTop{position:fixed;right:16px;bottom:calc(20px + env(safe-area-inset-bottom,0px));z-index:400;'
      + 'width:46px;height:46px;border-radius:50%;border:1px solid var(--bd,#e2e2e2);background:var(--bg2,#fff);'
      + 'color:var(--ac,#c6553b);box-shadow:0 4px 16px rgba(0,0,0,.18);cursor:pointer;'
      + 'display:flex;align-items:center;justify-content:center;padding:0;'
      + 'opacity:0;transform:translateY(10px) scale(.9);pointer-events:none;transition:opacity .2s,transform .2s}'
      + '#backToTop.b2t-bar{bottom:calc(72px + env(safe-area-inset-bottom,0px))}'   // 有底部 tab 時抬高
      + '#backToTop.show{opacity:1;transform:none;pointer-events:auto}'
      + '#backToTop:active{transform:scale(.92)}'
      // 只在寬螢幕(桌機)顯示:此時內容置中、兩側留白,鈕落在右側留白區不會蓋到內容。
      // 手機內容滿版會被遮 → 先不顯示(用戶指定手機版之後再考慮)。
      + '@media (max-width:900px){#backToTop{display:none!important}}'
      + '@media (prefers-reduced-motion:reduce){#backToTop{transition:none}}';
    (document.head || document.documentElement).appendChild(css);

    var btn = document.createElement('button');
    btn.id = 'backToTop';
    btn.type = 'button';
    btn.setAttribute('aria-label', '回到頂部');
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" '
      + 'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V6M6 12l6-6 6 6"/></svg>';
    // 有底部 tab bar(app.html 的 .ftb)→ 抬高
    if (document.querySelector('.ftb')) btn.classList.add('b2t-bar');
    btn.addEventListener('click', function () {
      var rm = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
      try { window.scrollTo({ top: 0, behavior: rm ? 'auto' : 'smooth' }); }
      catch (e) { window.scrollTo(0, 0); }
    });
    document.body.appendChild(btn);

    var ticking = false;
    function update() {
      ticking = false;
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      btn.classList.toggle('show', y > 400);
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }
  if (document.body) init();
  else document.addEventListener('DOMContentLoaded', init);
})();
