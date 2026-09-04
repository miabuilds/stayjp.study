// 全站共用字級:主頁(app.html)有自己的 data-fs 細調規則;其他獨立頁(動詞變化/口說/刷題/
// 生活會話…)原本完全沒讀 fontSize,調了字沒反應(用戶回報:很多頁沒一起放大)。
// 這支讓每個獨立頁載入即套用:把 <html> 的字級基準放大(large 1.12、xlarge 1.24),
// 頁面用 rem/em 的文字會跟著大;為避免頂欄/導覽/固定控件破版,那些用 data-fs 反向鎖回。
// app.html 已有完整 data-fs 規則,重複載入無妨(同樣讀 fontSize、同樣設 data-fs)。
(function () {
  var LEVELS = ['normal', 'large', 'xlarge'];
  var ROOT_PCT = { normal: '', large: '112.5%', xlarge: '125%' };
  function get() {
    try { var v = localStorage.getItem('fontSize') || 'normal'; return LEVELS.indexOf(v) < 0 ? 'normal' : v; }
    catch (e) { return 'normal'; }
  }
  function apply() {
    var fs = get();
    var el = document.documentElement;
    el.setAttribute('data-fs', fs);
    // 主頁(app.html)自己用 class-level 規則精調,不動根字級,避免跟它的規則打架
    if (el.hasAttribute('data-app-fs')) return;
    el.style.fontSize = ROOT_PCT[fs] || '';
  }
  // 頂欄/導覽/浮動控件不隨字級放大(rem 基準變大時鎖回 16px 基準),避免破版
  function injectGuard() {
    if (document.getElementById('fsGuardCss')) return;
    var st = document.createElement('style'); st.id = 'fsGuardCss';
    st.textContent = 'html[data-fs="large"] .backbtn,html[data-fs="xlarge"] .backbtn,'
      + 'html[data-fs="large"] header,html[data-fs="xlarge"] header,'
      + 'html[data-fs="large"] .qbar,html[data-fs="xlarge"] .qbar,'
      + 'html[data-fs="large"] .chatbar,html[data-fs="xlarge"] .chatbar,'
      + 'html[data-fs="large"] footer,html[data-fs="xlarge"] footer{font-size:14px}'
      // 彈窗寬度隨字級等比放大(用戶回饋:字調大、盒子不變寬 → 每行塞沒幾個字,全部擠在一起)。
      // 全站彈窗卡的固定 px 寬 ×1.125 / ×1.25,min(92vw,…) 護手機不超出螢幕。
      + 'html[data-fs="large"] .aui-card{max-width:min(92vw,450px)}html[data-fs="xlarge"] .aui-card{max-width:min(92vw,500px)}'
      + 'html[data-fs="large"] .hm-card{max-width:min(92vw,473px)}html[data-fs="xlarge"] .hm-card{max-width:min(92vw,525px)}'
      + 'html[data-fs="large"] .onb-card{max-width:min(92vw,428px)}html[data-fs="xlarge"] .onb-card{max-width:min(92vw,475px)}'
      + 'html[data-fs="large"] .modal{max-width:min(92vw,540px)}html[data-fs="xlarge"] .modal{max-width:min(92vw,600px)}'
      + 'html[data-fs="large"] .shadow-box{max-width:min(94vw,675px)}html[data-fs="xlarge"] .shadow-box{max-width:min(94vw,750px)}'
      + 'html[data-fs="large"] .party-card{max-width:min(92vw,383px)}html[data-fs="xlarge"] .party-card{max-width:min(92vw,425px)}'
      + 'html[data-fs="large"] .cs-card{max-width:min(92vw,506px)}html[data-fs="xlarge"] .cs-card{max-width:min(92vw,563px)}';
    (document.head || document.documentElement).appendChild(st);
  }
  try { injectGuard(); } catch (e) {}
  apply();
  window.applyFontScale = apply;               // 設定改動後可呼叫(跨頁靠各自載入時 apply)
  window.addEventListener('storage', function (e) { if (e.key === 'fontSize') apply(); });   // 另一分頁改字級即時同步
})();
