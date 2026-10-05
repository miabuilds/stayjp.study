// day-key.js — 全站共用的「今天是哪一天」(web + node test 共用)。
// 為什麼要有這支:之前 calendar.js / daily-log.js / path.js / study-plan.js 各自寫
//   new Date().toISOString().split('T')[0] → 那是 UTC 日期。台灣 08:00、日本 09:00 以前
//   做的動作全算到「昨天」(用戶實錘:日本 08:50 過完第 2 關,09:30 開電腦變成「今天 0 / 3 關」)。
// 這裡一律用裝置的「本地日曆日」YYYY-MM-DD。舊資料裡已存的 key 不動(不遷移),只有新寫入改走本地。
// ⚠️ 後端比對用的日期(ai_usage 的 JST 日 key 等)不要用這支,那些要跟伺服器同一套。
(function (root) {
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  /** 任何 Date / 毫秒 ts / 可解析字串 → 本地 YYYY-MM-DD;無效回 '' */
  function of(d) {
    var x = (d instanceof Date) ? d : new Date(d == null ? Date.now() : d);
    if (isNaN(x.getTime())) return '';
    return x.getFullYear() + '-' + pad(x.getMonth() + 1) + '-' + pad(x.getDate());
  }
  function today() { return of(new Date()); }
  /** 'YYYY-MM-DD' → 本地 00:00 的 Date(不能用 new Date('2026-10-04'),那會被當 UTC 午夜);壞 key 回 null */
  function parse(key) {
    var m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(String(key || ''));
    if (!m) return null;
    var d = new Date(+m[1], +m[2] - 1, +m[3]);
    return isNaN(d.getTime()) ? null : d;
  }
  /** key 往前/後 n 天(跨月、跨年、跨 DST 都走本地日曆);壞 key 原樣回傳 */
  function addDays(key, n) {
    var d = parse(key); if (!d) return key;
    d.setDate(d.getDate() + (n | 0));
    return of(d);
  }
  var api = { today: today, of: of, parse: parse, addDays: addDays };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.DayKey = api;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
