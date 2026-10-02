// 檔期特價的「時鐘」。Mia 2026-09-24 建,2026-10 雙十改寫。
//
// 價錢怎麼算、畫面怎麼畫都不在這裡:
//   - 金額:campaign.js 的 Campaign.price(與後端 resolveWebPrice 同一套,scripts/test-sale-price.cjs 對答案)
//   - 畫面:各頁自己的 window.renderSalePrices()(pricing.html = renderRefPricing)
// 這支只做兩件事:
//   1. 每秒更新頁面上所有 [data-sale-cd] 的倒數
//   2. 檔期階段一變(KOL 搶先開始 / 檔期開始 / 檔期結束)就叫 renderSalePrices() 重畫
//      → 頁面開著跨過 10/11 23:59:59,價錢當場變回原價,不會讓人用舊畫面送出錯的 expected_twd
//
// ⚠️ 不可以無條件顯示特價:顯示價 ≠ 扣款價會踩消保法「下單前明示金額」。
//    所以畫面一律由 Campaign.price 決定,它跟後端是同一個算式。
(function () {
  var C = window.Campaign;
  if (!C || !C.SALE || !C.salePhase) return;
  // 檔期結束超過一天就什麼都不做(還是會載入,但零成本)
  if (C.now() > C.SALE.end + 864e5) return;

  var lastPhase = C.salePhase();
  function tick() {
    var phase = C.salePhase();
    if (phase !== lastPhase) {
      lastPhase = phase;
      try { if (typeof window.renderSalePrices === 'function') window.renderSalePrices(); } catch (e) {}
    }
    var left = C.SALE.end - C.now();
    var txt = C.fmtLeft(left);
    var list = document.querySelectorAll('[data-sale-cd]');
    for (var i = 0; i < list.length; i++) if (list[i].textContent !== txt) list[i].textContent = txt;
  }
  function start() { tick(); setInterval(tick, 1000); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
