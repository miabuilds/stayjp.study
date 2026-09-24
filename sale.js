// 檔期特價的呈現層。Mia 2026-09-24。
//
// 只做「怎麼呈現」,不碰價格邏輯 —— 實際折扣仍由 campaign.js 的活動碼 + 後端 PLANS 決定,
// 這支負責把它包裝成看得出急迫感的樣子:原價劃掉、省多少、倒數。
//
// 為什麼值得做:Mia 的營收 48.8% 來自買斷、2.7% 來自月費(2026-09-24 實算),
// 所以特價要打在買斷,不是月費。競品(TOPIK Note)那張付費牆之所以有殺傷力,
// 主要不是折數,是「原價劃掉 + 倒數 + 拿使用者原本會花的錢錨定」。
(function () {
  var C = window.Campaign && window.Campaign.active && window.Campaign.active();
  if (!C) return;                       // 沒有進行中的活動就什麼都不做
  var END = C.end;
  if (Date.now() > END) return;

  // 各方案的原價 / 活動價。與後端 PLANS、campaign 折扣一致,改價要三處一起改。
  var PLANS = {
    yearly:   { was: 1990, now: 1790, id: 'yearlyPrice',   unit: '/ 年' },
    lifetime: { was: 5990, now: 5390, id: 'lifetimePrice', unit: '' }
  };
  var L = function (zh, en) { try { return (typeof enOr === 'function') ? enOr(zh, en) : zh; } catch (e) { return zh; } };
  var nf = function (n) { return n.toLocaleString(); };

  var css = document.createElement('style');
  css.textContent =
    '.sale-was{font-size:15px;color:var(--tx3);text-decoration:line-through;font-weight:600;margin-right:8px}' +
    '.sale-save{display:inline-block;font-size:12px;font-weight:800;color:#fff;background:var(--ac);' +
      'border-radius:999px;padding:2px 9px;vertical-align:middle;margin-left:8px}' +
    '.sale-cd{margin-top:6px;font-size:12.5px;font-weight:700;color:var(--ac)}' +
    '.sale-anchor{margin-top:4px;font-size:12.5px;color:var(--tx2)}';
  (document.head || document.documentElement).appendChild(css);

  function paint() {
    var left = END - Date.now();
    if (left <= 0) return false;
    Object.keys(PLANS).forEach(function (k) {
      var p = PLANS[k], el = document.getElementById(p.id);
      if (!el || el.dataset.sale) return;
      el.dataset.sale = '1';
      el.innerHTML =
        '<span class="sale-was">NT$' + nf(p.was) + '</span>' +
        '<span class="currency">NT$</span>' + nf(p.now) +
        (p.unit ? '<span class="unit">' + p.unit + '</span>' : '') +
        // 年費卡標題本來就有「省 57%」(年費 vs 月費繳一年,合理比法)。
        // 這裡寫「活動再省」才看得出是另外疊上去的,不會跟那個數字打架。
        '<span class="sale-save">' + L('活動再省 ', 'Extra ') + 'NT$' + nf(p.was - p.now) + '</span>';
      var box = el.parentElement;
      if (box && !box.querySelector('.sale-cd')) {
        var cd = document.createElement('div');
        cd.className = 'sale-cd'; cd.dataset.k = k;
        el.insertAdjacentElement('afterend', cd);
        // 拿使用者原本會花的錢錨定,不跟別的 app 比價
        var a = document.createElement('div');
        a.className = 'sale-anchor';
        a.textContent = k === 'lifetime'
          ? L('一堂日文家教課的價格,用到考過為止', 'Less than one tutoring session — yours for good')
          : L('一個月不到 NT$150', 'Under NT$150 a month');
        cd.insertAdjacentElement('afterend', a);
      }
    });
    var s = Math.max(0, Math.floor(left / 1000));
    var d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60), ss = s % 60;
    var pad = function (n) { return String(n).padStart(2, '0'); };
    var txt = L('活動剩 ', 'Ends in ') + (d ? d + L(' 天 ', 'd ') : '') + pad(h) + ':' + pad(m) + ':' + pad(ss);
    var list = document.querySelectorAll('.sale-cd');
    for (var i = 0; i < list.length; i++) list[i].textContent = txt;
    return true;
  }

  function start() {
    if (!paint()) return;
    var t = setInterval(function () { if (!paint()) clearInterval(t); }, 1000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
