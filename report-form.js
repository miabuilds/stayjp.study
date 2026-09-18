// 使用者回報表單(2026-09-18):全站原本的「回報錯誤」是 mailto 寄到 Gmail,只有 Mia 看得到、程式碰不到。
// 這支攔截所有 mailto:stayjpplan@gmail.com?subject=[回報·…] 的連結,改開小表單直接寫進 Firestore `reports`
// (規則:只准 create、欄位白名單),讓自動處理流程能讀。Firebase 沒載到/寫入失敗 → 退回原本的 mailto,回報永遠不會掉。
(function () {
  var MAIL_RE = /^mailto:stayjpplan@gmail\.com\?/i;
  function q(s) { var m = /[?&]subject=([^&]*)/.exec(s), b = /[?&]body=([^&]*)/.exec(s); var subj = m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : '', body = b ? decodeURIComponent(b[1].replace(/\+/g, ' ')) : ''; var k = /^\[(?:回報·)?([^\]]+)\]\s*(.*)$/.exec(subj) || []; return { kind: (k[1] || 'other').slice(0, 40), id: (k[2] || '').slice(0, 80), detail: body.split('錯誤描述')[0].trim().slice(0, 2000) }; }
  function en() { try { return (localStorage.getItem('lang') || document.documentElement.lang || '').toLowerCase().indexOf('en') === 0; } catch (e) { return false; } }
  function L(zh, e) { return en() ? e : (window.cvt ? window.cvt(zh) : zh); }
  function css() {
    if (document.getElementById('rpfCss')) return;
    var st = document.createElement('style'); st.id = 'rpfCss';
    st.textContent = '.rpf-mask{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:100000;display:flex;align-items:flex-end;justify-content:center}@media(min-width:600px){.rpf-mask{align-items:center}}'
      + '.rpf{background:var(--bg2,#fff);color:var(--tx,#222);width:100%;max-width:520px;border-radius:18px 18px 0 0;padding:18px 18px calc(18px + env(safe-area-inset-bottom));box-shadow:0 -4px 30px rgba(0,0,0,.2);font-family:inherit}@media(min-width:600px){.rpf{border-radius:18px}}'
      + '.rpf h3{margin:0 0 4px;font-size:17px}.rpf .sub{font-size:12.5px;color:var(--tx2,#777);margin-bottom:10px;white-space:pre-wrap;max-height:90px;overflow:auto;background:var(--bg3,#f5f5f5);border-radius:10px;padding:8px 10px}'
      + '.rpf textarea,.rpf input{width:100%;box-sizing:border-box;font:inherit;font-size:15px;border:1.5px solid var(--bd,#ddd);border-radius:12px;padding:10px 12px;background:var(--bg,#fff);color:inherit;margin-top:8px}.rpf textarea{min-height:110px;resize:vertical}'
      + '.rpf .row{display:flex;gap:8px;margin-top:12px}.rpf button{flex:1;font:inherit;font-size:15px;font-weight:700;border-radius:12px;padding:12px;border:1.5px solid var(--bd,#ddd);background:var(--bg2,#fff);color:inherit;cursor:pointer}.rpf button.pri{background:var(--ac,#D4654A);color:#fff;border-color:var(--ac,#D4654A)}.rpf button[disabled]{opacity:.6}'
      + '.rpf .ok{text-align:center;padding:18px 0 6px;font-size:15px;line-height:1.7}.rpf .alt{display:block;text-align:center;margin-top:10px;font-size:12.5px;color:var(--tx2,#777)}';
    document.head.appendChild(st);
  }
  function open(href) {
    css(); var meta = q(href);
    var mask = document.createElement('div'); mask.className = 'rpf-mask';
    var email = ''; try { var u = window.firebase && firebase.auth && firebase.auth().currentUser; if (u && u.email) email = u.email; } catch (e) {}
    mask.innerHTML = '<div class="rpf" role="dialog" aria-modal="true"><h3>' + L('回報問題', 'Report a problem') + '</h3>'
      + (meta.detail ? '<div class="sub"></div>' : '')
      + '<textarea placeholder="' + L('哪裡怪?例:答案跟解析對不上、音檔沒聲音、按了沒反應…', 'What is wrong? e.g. answer vs explanation mismatch, no audio, button does nothing…') + '"></textarea>'
      + '<input type="email" placeholder="' + L('Email(選填,修好通知你)', 'Email (optional, we will tell you when it is fixed)') + '" value="' + email.replace(/"/g, '') + '">'
      + '<div class="row"><button type="button" class="cancel">' + L('取消', 'Cancel') + '</button><button type="button" class="pri send">' + L('送出', 'Send') + '</button></div>'
      + '<a class="alt" href="' + href.replace(/"/g, '&quot;') + '">' + L('或用 Email 寄給我們', 'or send us an email instead') + '</a></div>';
    if (meta.detail) mask.querySelector('.sub').textContent = meta.detail;
    document.body.appendChild(mask);
    var ta = mask.querySelector('textarea'); setTimeout(function () { try { ta.focus(); } catch (e) {} }, 50);
    function close() { try { mask.remove(); } catch (e) {} }
    mask.addEventListener('click', function (e) { if (e.target === mask) close(); });
    mask.querySelector('.cancel').onclick = close;
    mask.querySelector('.send').onclick = function () {
      var desc = ta.value.trim(); if (desc.length < 2) { ta.focus(); return; }
      var btn = this; btn.disabled = true; btn.textContent = L('送出中…', 'Sending…');
      var doc = { kind: meta.kind, id: meta.id, detail: meta.detail, desc: desc.slice(0, 3000), email: (mask.querySelector('input').value || '').trim().slice(0, 120),
        uid: '', page: String(location.href).slice(0, 500), ua: String(navigator.userAgent).slice(0, 300), lang: (function () { try { return (localStorage.getItem('lang') || 'zh-TW').slice(0, 10); } catch (e) { return ''; } })(),
        platform: (window.STAYJP_NATIVE && STAYJP_NATIVE.isNativeApp) ? ('app-' + (STAYJP_NATIVE.platform || '')) : 'web', status: 'new' };
      try { var u = firebase.auth && firebase.auth().currentUser; if (u) doc.uid = u.uid; } catch (e) {}
      var p;
      try { doc.created_at = firebase.firestore.FieldValue.serverTimestamp(); p = firebase.firestore().collection('reports').add(doc); } catch (e) { p = Promise.reject(e); }
      p.then(function () {
        mask.querySelector('.rpf').innerHTML = '<div class="ok">🦝 ' + L('收到了,謝謝!<br>內容錯誤通常 24 小時內修好' + (doc.email ? ',修好會寄信給你' : '') + '。', 'Got it, thanks!<br>Content errors are usually fixed within 24h' + (doc.email ? '; we will email you.' : '.')) + '</div><div class="row"><button type="button" class="pri">' + L('好', 'OK') + '</button></div>';
        mask.querySelector('button').onclick = close;
        try { if (typeof gtag === 'function') gtag('event', 'report_submit', { kind: meta.kind }); } catch (e) {}
      }).catch(function () { try { location.href = href; } catch (e) {} close(); });   // 寫不進去(規則/離線)→ 退回 mailto,回報不會掉
    };
  }
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href^="mailto:"]') : null;
    if (!a || !MAIL_RE.test(a.getAttribute('href') || '')) return;
    if (!/subject=/.test(a.getAttribute('href'))) return;   // 純客服信箱連結(contact 頁)不攔
    e.preventDefault(); open(a.getAttribute('href'));
  }, true);
  window.stayjpReportOpen = open;
})();
