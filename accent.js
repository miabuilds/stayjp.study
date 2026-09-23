// 主題色(使用者自選)— 全站共用。Mia 2026-09-23。
//
// 為什麼需要這支:每個 .html 各自在 :root 寫死 --ac(而且有 5 種不同的橘),
// 只改 app.html 的話換色只換一頁。這支注入一段 :root[data-accent=…] 規則,
// 屬性選擇器比純 :root 更具體 → 不管頁面自己怎麼定義都蓋得過去。
//
// 只碰 --ac / --ac-rgb 兩個變數:深淺模式、對錯色、其他配色全部不受影響。
// 放在 <head> 且同步執行 → 首次繪製前就套好,不會先閃橘色再變色。
(function () {
  var A = [
    { k: 'orange', zh: '磚橘', en: 'Clay',      l: '#D4654A', lr: '212,101,74', d: '#E8734A', dr: '232,115,74' },
    { k: 'blue',   zh: '靛藍', en: 'Indigo',    l: '#3B6FB6', lr: '59,111,182', d: '#5A8FD6', dr: '90,143,214' },
    { k: 'green',  zh: '松綠', en: 'Pine',      l: '#2F8A5B', lr: '47,138,91',  d: '#43A56F', dr: '67,165,111' },
    { k: 'purple', zh: '紫藤', en: 'Wisteria',  l: '#7A5AA8', lr: '122,90,168', d: '#9B7BC8', dr: '155,123,200' },
    { k: 'rose',   zh: '桃粉', en: 'Rose',      l: '#C4557E', lr: '196,85,126', d: '#DE6E96', dr: '222,110,150' },
    { k: 'ink',    zh: '墨灰', en: 'Ink',       l: '#4A5568', lr: '74,85,104',  d: '#7C8CA6', dr: '124,140,166' }
  ];
  var css = '';
  for (var i = 0; i < A.length; i++) {
    var a = A[i];
    // 淺色要夠深(白底上看得清)、深色要夠亮(深底上看得清)→ 每個色兩版
    css += ':root[data-accent="' + a.k + '"]{--ac:' + a.l + ';--ac-rgb:' + a.lr + '}';
    css += '[data-theme="dark"][data-accent="' + a.k + '"]{--ac:' + a.d + ';--ac-rgb:' + a.dr + '}';
  }
  // 選色面板
  css += '.ac-pick{padding:10px 14px 14px;border-top:1px solid var(--bd);margin-top:6px}'
       + '.ac-pick-t{font-size:12px;color:var(--tx2);margin-bottom:8px;font-weight:600}'
       + '.ac-dots{display:flex;gap:10px;flex-wrap:wrap}'
       + '.ac-dot{width:26px;height:26px;border-radius:50%;border:2px solid transparent;cursor:pointer;padding:0;'
       + 'box-shadow:0 0 0 1px var(--bd) inset;transition:transform .12s}'
       + '.ac-dot:hover{transform:scale(1.12)}'
       + '.ac-dot.on{border-color:var(--tx);box-shadow:0 0 0 2px var(--bg) inset}';
  try {
    var st = document.createElement('style');
    st.id = 'accentCss';
    st.textContent = css;
    (document.head || document.documentElement).appendChild(st);
  } catch (e) {}

  function cur() { try { return localStorage.getItem('accent') || 'orange'; } catch (e) { return 'orange'; } }
  function apply(k) {
    // orange = 各頁面原本的配色 → 不設屬性,完全維持原樣(有些頁的橘本來就不同)
    if (!k || k === 'orange') document.documentElement.removeAttribute('data-accent');
    else document.documentElement.setAttribute('data-accent', k);
  }
  apply(cur());

  window.Accent = {
    list: A,
    get: cur,
    set: function (k) {
      try { localStorage.setItem('accent', k); } catch (e) {}
      apply(k);
      var dots = document.querySelectorAll('.ac-dot');
      for (var i = 0; i < dots.length; i++) dots[i].classList.toggle('on', dots[i].dataset.k === k);
    },
    /** 把選色面板接到某個容器(側欄畫完後呼叫;已經有就不重複加)*/
    mount: function (el) {
      if (!el || el.querySelector('.ac-pick')) return;
      var k = cur();
      var eo = function (zh, en) { return (typeof enOr === 'function' ? enOr(zh, en) : zh); };
      var h = '<div class="ac-pick-t">' + eo('主題色', 'Accent colour') + '</div><div class="ac-dots">';
      for (var i = 0; i < A.length; i++) {
        var a = A[i];
        h += '<button type="button" class="ac-dot' + (a.k === k ? ' on' : '') + '" data-k="' + a.k
           + '" style="background:' + a.l + '" title="' + eo(a.zh, a.en) + '" aria-label="' + eo(a.zh, a.en)
           + '" onclick="Accent.set(\'' + a.k + '\')"></button>';
      }
      var w = document.createElement('div');
      w.className = 'ac-pick';
      w.innerHTML = h + '</div>';
      el.appendChild(w);
    }
  };
})();
