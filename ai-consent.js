// ai-consent.js — 第一次用 AI 功能前的「資料傳送同意」(Apple 5.1.1(i)/5.1.2(i) 退件要求:說清楚送什麼、送給誰、先取得同意)。
// 用法:await AIConsent.ensure() → true 才呼叫 AI;拒絕回 false。同意存 localStorage ai_consent_v1(登入時也寫進 users/{uid}.ai_consent_at 供跨裝置)。
(function (root) {
  var KEY = 'ai_consent_v1';
  function lang() { try { return (root.I18n && I18n.getLang) ? I18n.getLang() : (localStorage.getItem('ui_lang') || 'zh-TW'); } catch (e) { return 'zh-TW'; } }
  function T(zh, en) { var l = lang(); if (l === 'en') return en; return (typeof cvt === 'function') ? cvt(zh) : zh; }
  function has() { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
  function remember() {
    try { localStorage.setItem(KEY, '1'); } catch (e) {}
    try { var u = root.firebase && firebase.auth && firebase.auth().currentUser; if (u && firebase.firestore) firebase.firestore().doc('users/' + u.uid).set({ ai_consent_at: Date.now() }, { merge: true }).catch(function () {}); } catch (e) {}
  }
  var pending = null;
  function ensure() {
    if (has()) return Promise.resolve(true);
    if (pending) return pending;
    pending = new Promise(function (resolve) {
      var bg = document.createElement('div');
      bg.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;padding:20px';
      var box = document.createElement('div');
      box.style.cssText = 'background:var(--bg,#fff);color:var(--tx,#222);border-radius:16px;max-width:420px;width:100%;padding:20px 20px 16px;box-shadow:0 20px 60px rgba(0,0,0,.3);font-size:14.5px;line-height:1.7';
      box.innerHTML =
        '<div style="font-size:17px;font-weight:800;margin-bottom:8px">' + T('AI 功能會把你的練習內容送出去', 'AI features send your practice text to a third party') + '</div>' +
        '<div>' + T('使用「AI 跟讀」「AI 聊聊」時,StayJP 會把<b>你念的句子(已轉成文字)或你輸入的對話文字</b>,透過 StayJP 伺服器送到 <b>Anthropic(Claude 語言模型)</b> 產生評分與回覆。',
                    'When you use “AI Shadowing” or “AI Chat”, StayJP sends <b>the sentence you read (converted to text) or the chat text you type</b> through StayJP’s server to <b>Anthropic (Claude)</b> to generate feedback and replies.') + '</div>' +
        '<ul style="margin:10px 0 0 18px;padding:0;color:var(--tx2,#666);font-size:13.5px">' +
          '<li>' + T('不會送出錄音檔、姓名、Email 或任何帳號識別資料。', 'No audio recordings, name, email, or account identifiers are sent.') + '</li>' +
          '<li>' + T('依 Anthropic API 條款,送出的內容不用於訓練模型。', 'Under Anthropic’s API terms, the content is not used to train models.') + '</li>' +
          '<li>' + T('詳見<a href="privacy.html#third-party" target="_blank" rel="noopener" style="color:var(--ac,#e0563f)">隱私政策・第三方服務</a>。', 'See the <a href="privacy.html#third-party" target="_blank" rel="noopener" style="color:var(--ac,#e0563f)">Privacy Policy · third-party services</a>.') + '</li>' +
        '</ul>' +
        '<div style="display:flex;gap:10px;margin-top:16px">' +
          '<button id="aicNo" style="flex:1;padding:12px;border-radius:12px;border:1px solid var(--bd,#ddd);background:none;color:var(--tx2,#666);font-size:15px;cursor:pointer">' + T('暫不使用', 'Not now') + '</button>' +
          '<button id="aicYes" style="flex:1.4;padding:12px;border-radius:12px;border:0;background:var(--ac,#e0563f);color:#fff;font-weight:800;font-size:15px;cursor:pointer">' + T('我同意,開始使用', 'I agree — continue') + '</button>' +
        '</div>';
      bg.appendChild(box); document.body.appendChild(bg);
      function close(ok) { try { bg.remove(); } catch (e) {} pending = null; if (ok) remember(); resolve(!!ok); }
      box.querySelector('#aicYes').onclick = function () { close(true); };
      box.querySelector('#aicNo').onclick = function () { close(false); };
    });
    return pending;
  }
  root.AIConsent = { ensure: ensure, has: has, reset: function () { try { localStorage.removeItem(KEY); } catch (e) {} } };
})(window);
