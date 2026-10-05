// path-merge.js — 闖關進度 path_progress 的雲端/本機合併(web + node test 共用,純函式)。
// 為什麼要特別處理:app.html loadCloudData 對一般物件是「雲端整個 key 蓋過去、本機只補缺的 key」。
//   path_progress 的第一層 key 是 level / n5 / n4 …,所以另一台裝置較舊的 n5 會把這台剛過的關、
//   今天的關數整包蓋掉(用戶會看到已過的關不見、今日關卡歸零)。
// 規則(每個等級內):
//   done  每關取星等較高者(兩邊都有紀錄就不會倒退;0 = 自動定位標成已學過也算有紀錄)
//   skip  聯集
//   days  每個日期取較大(同一天兩台各過的關數不能被蓋成較小那邊)
//   placed 只有一邊有就拿那邊;兩邊都有以本機為主,dismissed 取 OR(按過「知道了」就不要再跳)
//   其他欄位:數字取大、布林取 OR、其餘本機優先
//   level 本機有合法值就用本機(使用者目前選的等級),沒有才用雲端
(function (root) {
  var LEVELS = ['n5', 'n4', 'n3', 'n2', 'n1'];
  function isObj(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
  function maxMap(a, b) {
    var out = {}; a = isObj(a) ? a : {}; b = isObj(b) ? b : {};
    Object.keys(a).forEach(function (k) { out[k] = Number(a[k]) || 0; });
    Object.keys(b).forEach(function (k) { var v = Number(b[k]) || 0; out[k] = (k in out) ? Math.max(out[k], v) : v; });
    return out;
  }
  function unionMap(a, b) {
    var out = {}; a = isObj(a) ? a : {}; b = isObj(b) ? b : {};
    Object.keys(a).forEach(function (k) { if (a[k]) out[k] = 1; });
    Object.keys(b).forEach(function (k) { if (b[k]) out[k] = 1; });
    return out;
  }
  function mergePlaced(l, c) {
    if (!isObj(l)) return isObj(c) ? Object.assign({}, c) : undefined;
    if (!isObj(c)) return Object.assign({}, l);
    var out = Object.assign({}, c, l);
    out.dismissed = !!(l.dismissed || c.dismissed);
    return out;
  }
  function mergeLevel(l, c) {
    l = isObj(l) ? l : {}; c = isObj(c) ? c : {};
    var out = {};
    var keys = {}; Object.keys(l).concat(Object.keys(c)).forEach(function (k) { keys[k] = 1; });
    Object.keys(keys).forEach(function (k) {
      if (k === 'done' || k === 'days') { out[k] = maxMap(l[k], c[k]); return; }
      if (k === 'skip') { out[k] = unionMap(l[k], c[k]); return; }
      if (k === 'placed') { var p = mergePlaced(l[k], c[k]); if (p !== undefined) out[k] = p; return; }
      var lv = l[k], cv = c[k];
      if (lv === undefined) { out[k] = cv; return; }
      if (cv === undefined) { out[k] = lv; return; }
      if (typeof lv === 'number' && typeof cv === 'number') out[k] = Math.max(lv, cv);
      else if (typeof lv === 'boolean' && typeof cv === 'boolean') out[k] = lv || cv;
      else out[k] = lv;
    });
    // 保證三個主欄位都在(path.js lvProg 會讀 done/days)
    if (!out.done) out.done = {}; if (!out.days) out.days = {};
    return out;
  }
  /** @param local 本機 path_progress  @param cloud 雲端 path_progress  @returns 合併後的新物件(不改動輸入) */
  function merge(local, cloud) {
    local = isObj(local) ? local : {}; cloud = isObj(cloud) ? cloud : {};
    var out = {};
    var keys = {}; Object.keys(local).concat(Object.keys(cloud)).forEach(function (k) { keys[k] = 1; });
    Object.keys(keys).forEach(function (k) {
      if (k === 'level') {
        out.level = LEVELS.indexOf(local.level) >= 0 ? local.level : (LEVELS.indexOf(cloud.level) >= 0 ? cloud.level : (local.level !== undefined ? local.level : cloud.level));
        return;
      }
      if (isObj(local[k]) || isObj(cloud[k])) { out[k] = mergeLevel(local[k], cloud[k]); return; }
      out[k] = local[k] !== undefined ? local[k] : cloud[k];
    });
    return out;
  }
  var api = { merge: merge, LEVELS: LEVELS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.PathMerge = api;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
