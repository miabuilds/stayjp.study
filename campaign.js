// 限時活動的單一事實來源:活動碼與截止時間。Mia 2026-09-23。
//
// 為什麼要獨立一支、而且放在 <head> 同步執行:
//   活動碼會被存進 localStorage(stayjp_ref)並寫進帳號,活動結束後不清掉的話 ——
//   後端會正確拒絕折扣,但前端仍顯示折後價 → 按下訂閱被擋「價格已更新」,體驗很差。
//   所以一進站、在任何頁面腳本讀 stayjp_ref 之前,先把過期的活動碼清掉。
//
// 加新活動:往 LIST 裡加一筆就好,結束時間一到全站自動失效,不必回來拆任何東西。
(function () {
  // ⚠️ banner 是否顯示看 `banner: true`。
  //    2026-09-23 Mia 決定先關掉中秋倒數條:雖然已經擋住「活動碼蓋掉 KOL 碼」,
  //    但要不要在站上主動推活動、會不會稀釋 KOL 的推廣效果,是行銷決策不是技術問題,
  //    想清楚機制再開。把 banner 設回 true 就會恢復,其餘邏輯(過期清碼、claim 保護)照常運作。
  var LIST = [
    { code: 'TSUKIMI', end: Date.UTC(2026, 8, 25, 15, 59, 59), link: '/tsukimi.html',
      zh: '中秋 9 折', en: 'Mid-Autumn 10% off', banner: false }
  ];
  var now = Date.now();

  function isCampaignCode(c) {
    c = String(c || '').toUpperCase();
    for (var i = 0; i < LIST.length; i++) if (LIST[i].code === c) return LIST[i];
    return null;
  }
  /** 這個碼是不是「已經過期的活動碼」→ 前端一律當它不存在 */
  function isExpired(c) {
    var m = isCampaignCode(c);
    return !!(m && now > m.end);
  }
  /** 目前進行中的活動(沒有就 null)。碼的效期判斷用這個。 */
  function active() {
    for (var i = 0; i < LIST.length; i++) if (now <= LIST[i].end) return LIST[i];
    return null;
  }
  /** 目前「要顯示倒數條」的活動(沒有就 null)。banner:false 的活動碼照樣有效,只是站上不主動推。 */
  function banner() {
    var a = active();
    return (a && a.banner) ? a : null;
  }

  // 一進站就清掉過期的活動碼,免得後面每一頁都帶著它跑
  try {
    var saved = localStorage.getItem('stayjp_ref');
    if (saved && isExpired(saved)) localStorage.removeItem('stayjp_ref');
  } catch (e) {}

  /**
   * 收下一個碼(寫進 localStorage)。回傳有沒有真的寫進去。
   *
   * ⚠️ 活動碼「絕不」蓋掉已經存在的碼 —— 這是保護 KOL 的分潤:
   *    有人從探長的貼文點進來(存了他的碼),又看到站上的中秋活動去點一下,
   *    如果讓 TSUKIMI 覆蓋過去,使用者折扣一模一樣(都是年費現折 200),
   *    但探長的 10% 分潤就這樣沒了,而且沒有任何人會發現。
   *    活動碼只填「空位」;KOL 碼與個人碼照舊可以互相覆蓋(使用者自己選最後點的那個)。
   */
  function claim(code) {
    code = String(code || '').toUpperCase();
    if (!code || isExpired(code)) return false;
    try {
      var cur = localStorage.getItem('stayjp_ref');
      // 想寫入的是活動碼,而位子上已經有別的碼(且不是過期活動碼)→ 讓位
      if (isCampaignCode(code) && cur && cur !== code && !isExpired(cur)) return false;
      localStorage.setItem('stayjp_ref', code);
      return true;
    } catch (e) { return false; }
  }

  // ───── 雙十檔期(2026-10,Mia 定案)──────────────────────────────────────
  // 不用輸碼、官網人人有;有效推薦碼再疊折。時間到全站自動恢復原價,不必回來拆。
  // ⚠️ 數字與時間必須和後端 functions/src/utils/constants.ts 的 SALE + resolveWebPrice 一字不差:
  //    pricing.html 把這裡算出的金額當 expected_twd 送去 createPayment,兩邊不同就 409 擋單。
  //    scripts/test-sale-price.cjs 會把兩邊逐時間點對答案,改了就跑一次。
  var LIST_PRICE = { monthly: 390, yearly: 1990, yearly_early_bird: 990, lifetime: 5990 };
  var REF_OFF = { yearly: 200, lifetime: 600 };            // = 後端 WEB_CODE_DISCOUNT_TWD(檔期外)
  var SALE = {
    id: 'double10_2026',
    start: Date.UTC(2026, 9, 7, 16, 0, 0),                 // 2026-10-08 00:00 台灣
    kolEarlyStart: Date.UTC(2026, 9, 7, 12, 0, 0),         // 2026-10-07 20:00 台灣(KOL/個人碼搶先)
    end: Date.UTC(2026, 9, 11, 15, 59, 59),                // 2026-10-11 23:59:59 台灣
    prices: { yearly: 1490, lifetime: 3990 },
    refDiscount: { yearly: 150, lifetime: 400 },
    link: '/pricing.html',
    zh: '雙十限定', cn: '双十限定', en: 'Double Ten Sale'
  };

  /**
   * 「現在幾點」—— 只給畫面用。本機預覽可用 ?sale_now=<ms> 或 localStorage.stayjp_sale_now 假裝時間,
   * 只在 localhost 生效:正式站帶這個參數也沒用(就算有人亂帶,後端照真實時間算,頂多 409 擋單,不會少收錢)。
   */
  var LOADED_AT = Date.now();
  function saleNow() {
    try {
      var h = location.hostname;
      if (h === 'localhost' || h === '127.0.0.1' || location.protocol === 'file:') {
        var m = (location.search || '').match(/[?&]sale_now=(\d{10,})/);
        var v = m ? m[1] : localStorage.getItem('stayjp_sale_now');
        if (v && /^\d{10,}$/.test(v)) return Number(v) + (Date.now() - LOADED_AT);   // 假時間照樣往前走,倒數才看得出在跑
      }
    } catch (e) {}
    return Date.now();
  }
  /** 檔期階段:before / early(KOL 搶先 4 小時)/ on / after */
  function salePhase(at) {
    var t = at == null ? saleNow() : at;
    if (t > SALE.end) return 'after';
    if (t >= SALE.start) return 'on';
    if (t >= SALE.kolEarlyStart) return 'early';
    return 'before';
  }
  /**
   * 官網建單金額。與後端 resolveWebPrice 同一套算法(純函式)。
   * @param hasRef      帳上有有效推薦碼(pricing.html 的 __refActive)
   * @param isCampaign  那個碼是活動碼(官方/限期)→ 沒有 KOL 搶先資格
   * @returns { twd, list, onSale, refOff, saleTwd }
   */
  function price(plan, hasRef, isCampaign, at) {
    var t = at == null ? saleNow() : at;
    var list = LIST_PRICE[plan] || 0;
    var sp = SALE.prices[plan];
    var inWin = t >= SALE.start && t <= SALE.end;
    var early = t >= SALE.kolEarlyStart && t < SALE.start && !!hasRef && !isCampaign;
    var off;
    if (sp != null && (inWin || early)) {
      off = hasRef ? (SALE.refDiscount[plan] || 0) : 0;
      return { twd: sp - off, list: list, onSale: true, refOff: off, saleTwd: sp };
    }
    off = hasRef ? (REF_OFF[plan] || 0) : 0;
    return { twd: list - off, list: list, onSale: false, refOff: off, saleTwd: list };
  }
  /** 這個人「現在」看不看得到檔期價(決定要不要顯示倒數、劃線) */
  function saleOpenFor(hasRef, isCampaign, at) { return price('yearly', hasRef, isCampaign, at).onSale; }
  /** 倒數字串:「2 天 03:04:05」/ en「2d 03:04:05」 */
  function fmtLeft(ms) {
    var s = Math.max(0, Math.floor(ms / 1000));
    var d = Math.floor(s / 86400); s %= 86400;
    var h = Math.floor(s / 3600); s %= 3600;
    var m = Math.floor(s / 60); s %= 60;
    var p = function (n) { return (n < 10 ? '0' : '') + n; };
    return (d > 0 ? d + tr(' 天 ', 'd ', ' 天 ') : '') + p(h) + ':' + p(m) + ':' + p(s);
  }
  /** 檔期文案用的三語挑字:en 介面 → en;簡中 → cn(沒給就用 cvt 轉);其餘 → 繁中 */
  function tr(zh, en, cn) {
    try {
      var l = (typeof I18n !== 'undefined' && I18n.getLang) ? I18n.getLang() : (localStorage.getItem('ui_lang') || 'zh-TW');
      if (l === 'en') return en;
      if (l === 'zh-CN') return cn || (typeof cvt === 'function' ? cvt(zh) : zh);
    } catch (e) {}
    return zh;
  }

  window.Campaign = { list: LIST, active: active, isExpired: isExpired, isCampaignCode: isCampaignCode, claim: claim, banner: banner,
    SALE: SALE, LIST_PRICE: LIST_PRICE, REF_OFF: REF_OFF, now: saleNow, salePhase: salePhase, price: price, saleOpenFor: saleOpenFor, tr: tr, fmtLeft: fmtLeft };
})();
