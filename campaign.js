// 限時活動的單一事實來源:活動碼與截止時間。Mia 2026-09-23。
//
// 為什麼要獨立一支、而且放在 <head> 同步執行:
//   活動碼會被存進 localStorage(stayjp_ref)並寫進帳號,活動結束後不清掉的話 ——
//   後端會正確拒絕折扣,但前端仍顯示折後價 → 按下訂閱被擋「價格已更新」,體驗很差。
//   所以一進站、在任何頁面腳本讀 stayjp_ref 之前,先把過期的活動碼清掉。
//
// 加新活動:往 LIST 裡加一筆就好,結束時間一到全站自動失效,不必回來拆任何東西。
(function () {
  var LIST = [
    { code: 'TSUKIMI', end: Date.UTC(2026, 8, 25, 15, 59, 59), link: '/tsukimi.html',
      zh: '中秋 9 折', en: 'Mid-Autumn 10% off' }
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
  /** 目前進行中的活動(沒有就 null)*/
  function active() {
    for (var i = 0; i < LIST.length; i++) if (now <= LIST[i].end) return LIST[i];
    return null;
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

  window.Campaign = { list: LIST, active: active, isExpired: isExpired, isCampaignCode: isCampaignCode, claim: claim };
})();
