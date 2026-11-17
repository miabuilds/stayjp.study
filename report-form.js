// 使用者回報表單(2026-09-18):全站原本的「回報錯誤」是 mailto 寄到 Gmail,只有 Mia 看得到、程式碰不到。
// 這支攔截所有 mailto:stayjpplan@gmail.com?subject=[回報·…] 的連結,改開小表單直接寫進 Firestore `reports`
// (規則:只准 create、欄位白名單),讓自動處理流程能讀。Firebase 沒載到/寫入失敗 → 退回原本的 mailto,回報永遠不會掉。
(function () {
  var MAIL_RE = /^mailto:(stayjpplan@gmail\.com|support@stayjp\.study)\?/i;
  function q(s) { var m = /[?&]subject=([^&]*)/.exec(s), b = /[?&]body=([^&]*)/.exec(s); var subj = m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : '', body = b ? decodeURIComponent(b[1].replace(/\+/g, ' ')) : ''; var k = /^\[(?:回報·)?([^\]]+)\]\s*(.*)$/.exec(subj) || []; return { kind: (k[1] || 'other').slice(0, 40), id: (k[2] || '').slice(0, 80), detail: body.split('錯誤描述')[0].trim().slice(0, 2000) }; }
  // 外語(en/ko/vi/id/th)→ I18n.pick(zh,en);中文 → cvt(繁/簡)
  function siteLang() { try { return (window.I18n && I18n.getLang) ? I18n.getLang() : (localStorage.getItem('ui_lang') || localStorage.getItem('lang') || document.documentElement.lang || 'zh-TW'); } catch (e) { return 'zh-TW'; } }
  function fg() { try { return (window.I18n && I18n.isForeign) ? I18n.isForeign() : ['en', 'ko', 'vi', 'id', 'th'].indexOf(String(siteLang()).toLowerCase().slice(0, 2)) >= 0; } catch (e) { return false; } }
  function L(zh, e) { return fg() ? ((window.I18n && I18n.pick) ? I18n.pick(zh, e) : e) : (window.cvt ? window.cvt(zh) : zh); }
  function css() {
    if (document.getElementById('rpfCss')) return;
    var st = document.createElement('style'); st.id = 'rpfCss';
    st.textContent = '.rpf-mask{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:100000;display:flex;align-items:flex-end;justify-content:center}@media(min-width:600px){.rpf-mask{align-items:center}}'
      + '.rpf{background:var(--bg2,#fff);color:var(--tx,#222);width:100%;max-width:520px;border-radius:18px 18px 0 0;padding:18px 18px calc(18px + env(safe-area-inset-bottom));box-shadow:0 -4px 30px rgba(0,0,0,.2);font-family:inherit}@media(min-width:600px){.rpf{border-radius:18px}}'
      + '.rpf h3{margin:0 0 4px;font-size:17px}.rpf .sub{font-size:12.5px;color:var(--tx2,#777);margin-bottom:10px;white-space:pre-wrap;max-height:90px;overflow:auto;background:var(--bg3,#f5f5f5);border-radius:10px;padding:8px 10px}'
      + '.rpf textarea,.rpf input{width:100%;box-sizing:border-box;font:inherit;font-size:15px;border:1.5px solid var(--bd,#ddd);border-radius:12px;padding:10px 12px;background:var(--bg,#fff);color:inherit;margin-top:8px}.rpf textarea{min-height:110px;resize:vertical}'
      + '.rpf .row{display:flex;gap:8px;margin-top:12px}.rpf button{flex:1;font:inherit;font-size:15px;font-weight:700;border-radius:12px;padding:12px;border:1.5px solid var(--bd,#ddd);background:var(--bg2,#fff);color:inherit;cursor:pointer}.rpf button.pri{background:var(--ac,var(--ac));color:#fff;border-color:var(--ac,var(--ac))}.rpf button[disabled]{opacity:.6}'
      + '.rpf .shots{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:10px}.rpf .shots .it{position:relative;width:56px;height:56px;border-radius:10px;overflow:hidden;border:1px solid var(--bd,#ddd)}.rpf .shots .it img{width:100%;height:100%;object-fit:cover;display:block}'
      + '.rpf .shots .it button{position:absolute;top:0;right:0;flex:none;width:20px;height:20px;padding:0;border:0;border-radius:0 0 0 8px;background:rgba(0,0,0,.6);color:#fff;font-size:13px;line-height:20px}'
      + '.rpf .shots .add{flex:none;font-size:13px;font-weight:600;padding:8px 12px;border-radius:10px}.rpf .shots .nt{font-size:12px;color:var(--tx2,#777)}'
      + '.rpf .ok{text-align:center;padding:18px 0 6px;font-size:15px;line-height:1.7}.rpf .alt{display:block;text-align:center;margin-top:10px;font-size:12.5px;color:var(--tx2,#777)}';
    document.head.appendChild(st);
  }
  // 附截圖(2026-11-17 用戶建議:文法卡的回報也想附圖)。沿用意見表單那套:瀏覽器壓成 JPEG dataURL(<900KB)、一張一筆存 feedback_shots,
  // fid = 'r:' + 回報的文件 id;看圖:node scripts/feedback-shots.mjs r:<回報id> <outDir>。規則要求本人登入才能建,所以沒登入就不顯示附圖鈕。
  var SHOT_MAX = 3, SHOT_LIMIT = 900000;
  function shotCompress(file) {
    return new Promise(function (res, rej) {
      var url = URL.createObjectURL(file), im = new Image();
      im.onload = function () {
        try {
          var side = 1600, qv = 0.78, out = '';
          for (var k = 0; k < 6; k++) {
            var r = Math.min(1, side / Math.max(im.naturalWidth, im.naturalHeight));
            var c = document.createElement('canvas');
            c.width = Math.max(1, Math.round(im.naturalWidth * r)); c.height = Math.max(1, Math.round(im.naturalHeight * r));
            var g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.drawImage(im, 0, 0, c.width, c.height);
            out = c.toDataURL('image/jpeg', qv);
            if (out.length <= SHOT_LIMIT) break;
            side = Math.round(side * 0.8); qv = Math.max(0.5, qv - 0.08);
          }
          URL.revokeObjectURL(url);
          out.length <= SHOT_LIMIT ? res(out) : rej(new Error('too big'));
        } catch (e) { URL.revokeObjectURL(url); rej(e); }
      };
      im.onerror = function () { URL.revokeObjectURL(url); rej(new Error('not image')); };
      im.src = url;
    });
  }
  function open(href) {
    css(); var meta = q(href);
    var mask = document.createElement('div'); mask.className = 'rpf-mask';
    var email = ''; try { var u = window.firebase && firebase.auth && firebase.auth().currentUser; if (u && u.email) email = u.email; } catch (e) {}
    var fb = meta.kind === '評分回饋';   // rate-prompt.js「還可以再更好」進來的:是意見不是 bug,標題/提示換一下
    mask.innerHTML = '<div class="rpf" role="dialog" aria-modal="true"><h3>' + (fb ? L('哪裡可以更好?', 'What could be better?') : L('回報問題', 'Report a problem')) + '</h3>'
      + (meta.detail ? '<div class="sub"></div>' : '')
      + '<textarea placeholder="' + (fb ? L('例:想要的功能、用起來卡的地方、看不懂的畫面…', 'e.g. a feature you want, something clunky, a screen that confused you…') : L('哪裡怪?例:答案跟解析對不上、音檔沒聲音、按了沒反應…', 'What is wrong? e.g. answer vs explanation mismatch, no audio, button does nothing…')) + '"></textarea>'
      + '<input type="email" placeholder="' + (fb ? L('Email(選填,想收到回覆的話)', 'Email (optional, if you want a reply)') : L('Email(選填,修好通知你)', 'Email (optional, we will tell you when it is fixed)')) + '" value="' + email.replace(/"/g, '') + '">'
      + (email || (function () { try { return !!(window.firebase && firebase.auth && firebase.auth().currentUser); } catch (e) { return false; } })()
          ? '<div class="shots"><button type="button" class="add">' + L('附截圖', 'Attach screenshot') + '</button><span class="nt">' + L('選填，最多 3 張', 'Optional, up to 3') + '</span><input type="file" accept="image/*" multiple hidden style="display:none"></div>' : '')
      + '<div class="row"><button type="button" class="cancel">' + L('取消', 'Cancel') + '</button><button type="button" class="pri send">' + L('送出', 'Send') + '</button></div>'
      + '<a class="alt" href="' + href.replace(/"/g, '&quot;') + '">' + L('或用 Email 寄給我們', 'or send us an email instead') + '</a></div>';
    if (meta.detail) mask.querySelector('.sub').textContent = meta.detail;
    document.body.appendChild(mask);
    var ta = mask.querySelector('textarea'); setTimeout(function () { try { ta.focus(); } catch (e) {} }, 50);
    function close() { try { mask.remove(); } catch (e) {} }
    mask.addEventListener('click', function (e) { if (e.target === mask) close(); });
    mask.querySelector('.cancel').onclick = close;
    var shots = [], sbox = mask.querySelector('.shots');
    if (sbox) {
      var addBtn = sbox.querySelector('.add'), fin = sbox.querySelector('input[type=file]'), nt = sbox.querySelector('.nt');
      var draw = function () {
        sbox.querySelectorAll('.it').forEach(function (x) { x.remove(); });
        shots.forEach(function (d, i) {
          var it = document.createElement('div'); it.className = 'it';
          var im = document.createElement('img'); im.src = d; im.alt = '';
          var b = document.createElement('button'); b.type = 'button'; b.textContent = '×'; b.setAttribute('aria-label', L('移除', 'Remove'));
          b.onclick = function () { shots.splice(i, 1); draw(); };
          it.appendChild(im); it.appendChild(b); sbox.insertBefore(it, addBtn);
        });
        addBtn.disabled = shots.length >= SHOT_MAX;
        nt.textContent = shots.length ? (shots.length + ' / ' + SHOT_MAX) : L('選填，最多 3 張', 'Optional, up to 3');
      };
      addBtn.onclick = function () { fin.click(); };
      fin.onchange = function () {
        var files = Array.prototype.slice.call(fin.files || []); fin.value = '';
        if (!files.length) return;
        nt.textContent = L('圖片處理中…', 'Processing…');
        var bad = 0;
        files.reduce(function (pr, f) { return pr.then(function () { if (shots.length >= SHOT_MAX) return; return shotCompress(f).then(function (d) { shots.push(d); }).catch(function () { bad++; }); }); }, Promise.resolve())
          .then(function () { draw(); if (bad) nt.textContent = L('有 ' + bad + ' 張不是圖片或太大，沒加進去', bad + ' file(s) could not be added'); });
      };
    }
    mask.querySelector('.send').onclick = function () {
      var desc = ta.value.trim(); if (desc.length < 2) { ta.focus(); return; }
      var btn = this; btn.disabled = true; btn.textContent = L('送出中…', 'Sending…');
      if (shots.length) desc = desc.slice(0, 2980) + '\n[附圖 ' + shots.length + ' 張]';   // reports 規則是欄位白名單,不能加欄位 → 張數記在描述尾巴
      var doc = { kind: meta.kind, id: meta.id, detail: meta.detail, desc: desc.slice(0, 3000), email: (mask.querySelector('input').value || '').trim().slice(0, 120),
        uid: '', page: String(location.href).slice(0, 500), ua: String(navigator.userAgent).slice(0, 300), lang: (function () { try { return String(siteLang() || 'zh-TW').slice(0, 10); } catch (e) { return ''; } })(),
        platform: (window.STAYJP_NATIVE && STAYJP_NATIVE.isNativeApp) ? ('app-' + (STAYJP_NATIVE.platform || '')) : 'web', status: 'new' };
      try { var u = firebase.auth && firebase.auth().currentUser; if (u) doc.uid = u.uid; } catch (e) {}
      var p;
      try { doc.created_at = firebase.firestore.FieldValue.serverTimestamp(); p = firebase.firestore().collection('reports').add(doc); } catch (e) { p = Promise.reject(e); }
      p.then(function (ref) {
        // 截圖:回報本體寫成功才傳;傳失敗不影響回報(文字已經進去了)
        try {
          if (shots.length && doc.uid && ref && ref.id) shots.forEach(function (d, i) {
            firebase.firestore().collection('feedback_shots').add({ fid: 'r:' + ref.id, uid: doc.uid, i: i, data: d, createdAt: firebase.firestore.FieldValue.serverTimestamp() }).catch(function () {});
          });
        } catch (e) {}
        mask.querySelector('.rpf').innerHTML = '<div class="ok">🦝 ' + (fb ? L('收到了,謝謝你願意說!<br>每一則我們都會看。', 'Got it — thank you!<br>We read every note.') : L('收到了,謝謝!<br>內容錯誤通常 24 小時內修好' + (doc.email ? ',修好會寄信給你' : '') + '。', 'Got it, thanks!<br>Content errors are usually fixed within 24h' + (doc.email ? '; we will email you.' : '.'))) + '</div><div class="row"><button type="button" class="pri">' + L('好', 'OK') + '</button></div>';
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
