// 回上一頁(2026-09-20 使用者回饋:「進去和出來的路徑不同,關閉時變成首頁,我是誰我在哪」)。
// 問題:子畫面(五十音、小考、字卡…)的 close() 只是把自己收起來,誰開的它不知道,
//       所以從「日語從頭學」點進去、關掉之後就掉回面板,原本的清單不見了。
// 作法:開子畫面前先 push 來源畫面的 key,子畫面 close 時 back() 把它重新打開;
//       堆疊放 sessionStorage,連跳到別的 .html 再回來(必學基礎句、生活會話…)也記得。
// 沒有來源時 back() 什麼都不做 → 從面板直接開的維持原本行為。
(function (root) {
  var KEY = 'nav_back', PKEY = 'nav_back_page', MAX = 5;
  var OPEN = {};   // 畫面 key → 重新打開它的函式

  function read() { try { return JSON.parse(sessionStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function write(a) { try { sessionStorage.setItem(KEY, JSON.stringify(a.slice(-MAX))); } catch (e) {} }

  function register(k, fn) { if (k && typeof fn === 'function') OPEN[k] = fn; }
  // 浮層堆疊:只放「同一頁裡開起來、等一下會被 close 掉」的畫面
  function push(k) {
    if (!k) return;
    var a = read(), last = a[a.length - 1];
    if (last && last === k) return;
    a.push(k); write(a);
  }
  function peek() { var a = read(); return a.length ? a[a.length - 1] : null; }
  function clear() { write([]); try { sessionStorage.removeItem(PKEY); } catch (e) {} }
  function has() { return read().length > 0; }
  function back(fallback) {
    var a = read(), k = a.pop();
    write(a);
    if (k && OPEN[k]) { try { OPEN[k](); return true; } catch (err) {} }
    if (typeof fallback === 'function') { try { fallback(); return true; } catch (err) {} }
    return false;
  }
  // 跨頁(會 location.href 跳到別的 .html)另外存一格,不進浮層堆疊 ——
  // 否則使用者中途跑去別的地方,這筆會留著,下一次關某個浮層就被它劫走,莫名其妙跳回來。
  function pushPage(k, page) {
    if (!k || !page) return;
    try { sessionStorage.setItem(PKEY, JSON.stringify({ k: k, page: page, t: Date.now() })); } catch (e) {}
  }
  function resume() {
    var e = null; try { e = JSON.parse(sessionStorage.getItem(PKEY)); } catch (err) {}
    if (!e || !e.page) return false;
    try { sessionStorage.removeItem(PKEY); } catch (err) {}   // 一次性:用過就丟
    var ref = ''; try { ref = document.referrer || ''; } catch (err) {}
    if (ref.indexOf(e.page) < 0) return false;                 // 不是從那頁回來的就不要亂開
    if (OPEN[e.k]) { try { OPEN[e.k](); return true; } catch (err) {} }
    return false;
  }
  root.NavBack = { register: register, push: push, pushPage: pushPage, back: back, peek: peek, has: has, clear: clear, resume: resume };
})(window);
