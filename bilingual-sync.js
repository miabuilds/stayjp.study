// bilingual-sync.js — 讓 data-t 雙語頁(about/howto/jlpt/phrases)跟全站語言同步。
//
// 這幾頁自帶 zh/en 雙寫內容(data-t="zh"/"en")與 zh↔EN 切換鈕,但原本用自己的
// localStorage key(stayjp_about_lang),跟全站 ui_lang(繁/简/EN 選單)不同步,
// 也不支援簡中。此檔在頁面 inline script 之後載入:
//   1. 進頁時依全站 ui_lang 套語言:en → 英文層;zh-TW → 繁中層;
//      zh-CN → 繁中層 + OpenCC 轉簡(跳過日文 .jp/.rm/ruby 與英文層)
//   2. 覆寫頁內 toggleLang:切換時寫回全站 ui_lang(cookie+localStorage,由 i18n.js 處理)
//      並 reload,離開這頁後全站語言一致
//
// 依賴:i18n.js 先載(I18n.getLang/setLang);頁面已定義 setLang(l) 與 data-t 樣式。
(function () {
  'use strict';
  if (typeof setLang !== 'function') return;

  function siteLang() {
    try { if (typeof I18n !== 'undefined' && I18n.getLang) return I18n.getLang(); } catch (e) {}
    try { return localStorage.getItem('ui_lang'); } catch (e) { return null; }
  }

  // 初始 ui_lang 是简中的話,頁內切回中文時保留简中(不降回繁)
  var _zhFlavor = siteLang() === 'zh-CN' ? 'zh-CN' : 'zh-TW';

  function toSimplified() {
    var run = function (conv) {
      if (!conv) return;
      var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: function (n) {
          var p = n.parentElement;
          if (!p) return NodeFilter.FILTER_REJECT;
          var t = p.tagName;
          if (t === 'SCRIPT' || t === 'STYLE' || t === 'RT') return NodeFilter.FILTER_REJECT;
          // 日文內容(.jp 句子 / .rm 羅馬字 / ruby)與英文層不轉,避免把日文漢字改成簡體
          if (p.closest && p.closest('.jp,.rm,ruby,[lang="ja"],[data-nolang],[data-t="en"]')) return NodeFilter.FILTER_REJECT;
          if (!n.nodeValue || !/[一-龥]/.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      var nodes = [], n;
      while ((n = walker.nextNode())) nodes.push(n);
      nodes.forEach(function (nd) { nd.nodeValue = conv(nd.nodeValue); });
      document.documentElement.lang = 'zh-Hans';
    };
    if (window.OpenCC) { run(OpenCC.Converter({ from: 'tw', to: 'cn' })); return; }
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/full.js';
    s.onload = function () { run(OpenCC.Converter({ from: 'tw', to: 'cn' })); };
    document.head.appendChild(s);
  }

  // 覆寫頁內切換鈕:寫回全站語言 → reload(還原簡中轉換過的文字最乾淨)
  window.toggleLang = function () {
    var next = document.body.getAttribute('data-lang') === 'zh' ? 'en' : 'zh';
    try { if (typeof I18n !== 'undefined') I18n.setLang(next === 'en' ? 'en' : _zhFlavor); } catch (e) {}
    location.reload();
  };

  var l = siteLang();
  if (!l) return;                      // 拿不到全站語言 → 維持頁面原本的偵測結果
  setLang(l === 'en' ? 'en' : 'zh');
  if (l === 'zh-CN') toSimplified();
})();
