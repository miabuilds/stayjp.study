// 站內統一彈窗 AppUI.alert / AppUI.confirm —— 取代原生 alert()(原生視窗醜、樣式鎖死、
// 字級不跟站內縮放)。設計原則:
//  - 內容一律 textContent(訊息可能含使用者資料/錯誤字串,不吃 HTML → 不會有 <i data-ic> 字面問題,也不會 XSS)
//  - 字級用 em/rem 跟著頁面字級縮放;卡片 max-height 82vh + 捲動,字放大不破版
//  - CSS 變數 fallback 鏈:各頁變數命名不一(--panel/--bg2、--ink/--tx…),取得到誰用誰
//  - 狸貓配圖:info=讀書狸 / warn=趴牆狸(把「錯誤」講得不嚇人)
//  - AppUI.alert 非阻塞(回 Promise,呼叫端 fire-and-forget 即可);confirm 回 Promise<boolean>
(function () {
  const CSS = `
  .aui-mask{position:fixed;inset:0;z-index:2000;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;padding:22px;animation:auiFade .18s ease}
  @keyframes auiFade{from{opacity:0}to{opacity:1}}
  .aui-card{background:var(--panel,var(--bg2,#fff));color:var(--ink,var(--tx,#222));border:1px solid var(--line,var(--bd,#e5e0d8));
    border-radius:18px;padding:22px 20px 16px;width:100%;max-width:400px;max-height:82vh;overflow:auto;text-align:center;
    box-shadow:0 12px 40px rgba(0,0,0,.18);animation:auiPop .28s cubic-bezier(.34,1.4,.64,1)}
  @keyframes auiPop{from{transform:scale(.9);opacity:0}to{transform:scale(1);opacity:1}}
  .aui-card img{width:76px;height:auto;margin-bottom:6px}
  .aui-title{font-size:1.06em;font-weight:800;margin-bottom:6px}
  .aui-msg{font-size:.95em;line-height:1.75;color:var(--ink2,var(--tx2,#666));white-space:pre-wrap;word-break:break-word;text-align:left}
  .aui-msg.center{text-align:center}
  .aui-btns{display:flex;gap:10px;margin-top:16px}
  .aui-btn{flex:1;font:inherit;font-size:.95em;font-weight:700;padding:.7em 1em;border-radius:12px;cursor:pointer;
    border:1px solid var(--line,var(--bd,#e5e0d8));background:none;color:var(--ink,var(--tx,#222))}
  .aui-btn.pri{background:var(--accent,var(--ac,#C6553B));border-color:var(--accent,var(--ac,#C6553B));color:#fff}
  /* 字級放大 → 彈窗寬度等比放大(固定 px 寬會讓大字擠成一團);涵蓋全站各彈窗卡 */
  html[data-fs="large"] .aui-card{max-width:min(92vw,450px)}html[data-fs="xlarge"] .aui-card{max-width:min(92vw,500px)}
  html[data-fs="large"] .hm-card{max-width:min(92vw,473px)}html[data-fs="xlarge"] .hm-card{max-width:min(92vw,525px)}
  html[data-fs="large"] .onb-card{max-width:min(92vw,428px)}html[data-fs="xlarge"] .onb-card{max-width:min(92vw,475px)}
  html[data-fs="large"] .modal{max-width:min(92vw,540px)}html[data-fs="xlarge"] .modal{max-width:min(92vw,600px)}
  html[data-fs="large"] .shadow-box{max-width:min(94vw,675px)}html[data-fs="xlarge"] .shadow-box{max-width:min(94vw,750px)}
  html[data-fs="large"] .party-card{max-width:min(92vw,383px)}html[data-fs="xlarge"] .party-card{max-width:min(92vw,425px)}
  html[data-fs="large"] .cs-card{max-width:min(92vw,506px)}html[data-fs="xlarge"] .cs-card{max-width:min(92vw,563px)}
  @media(prefers-color-scheme:dark){
    .aui-card{--aui-fb-bg:#211F1D}
    .aui-card{background:var(--panel,var(--bg2,#211F1D));border-color:var(--line,var(--bd,#3a352f))}
  }`;

  function ensureStyle() {
    if (document.getElementById('auiStyle')) return;
    const st = document.createElement('style');
    st.id = 'auiStyle'; st.textContent = CSS;
    document.head.appendChild(st);
  }
  function isEn() {
    try { return (window.I18n && I18n.getLang && I18n.getLang() === 'en'); } catch (e) { return false; }
  }
  const MASCOT = { info: 'images/mascot/tanuki-p07.png', warn: 'images/mascot/tanuki-p12.png', cheer: 'images/mascot/tanuki-p06.png' };

  // opts: { title, tone: 'info'|'warn'|'cheer', okText, cancelText, mascot:boolean }
  function open(msg, opts, withCancel) {
    opts = opts || {};
    return new Promise((resolve) => {
      if (!document.body) { // 極端 fallback:DOM 沒好就退原生
        if (withCancel) resolve(window.confirm(msg)); else { window.alert(msg); resolve(true); }
        return;
      }
      ensureStyle();
      const prev = document.getElementById('auiMask'); if (prev) prev.remove();
      const mask = document.createElement('div');
      mask.className = 'aui-mask'; mask.id = 'auiMask';
      const card = document.createElement('div');
      card.className = 'aui-card'; card.setAttribute('role', 'dialog'); card.setAttribute('aria-modal', 'true');
      const tone = opts.tone || (withCancel ? 'warn' : 'info');
      if (opts.mascot !== false && MASCOT[tone]) {
        const img = document.createElement('img'); img.src = MASCOT[tone]; img.alt = '';
        card.appendChild(img);
      }
      if (opts.title) {
        const tt = document.createElement('div'); tt.className = 'aui-title'; tt.textContent = opts.title;
        card.appendChild(tt);
      }
      const body = document.createElement('div');
      body.className = 'aui-msg' + ((String(msg).length <= 22 && String(msg).indexOf('\n') === -1) ? ' center' : '');
      body.textContent = String(msg == null ? '' : msg);   // 一律純文字
      card.appendChild(body);
      const btns = document.createElement('div'); btns.className = 'aui-btns';
      const done = (v) => { try { document.removeEventListener('keydown', onKey); } catch (e) {} mask.remove(); resolve(v); };
      if (withCancel) {
        const c = document.createElement('button'); c.className = 'aui-btn';
        c.textContent = opts.cancelText || (isEn() ? 'Cancel' : '取消');
        c.onclick = () => done(false);
        btns.appendChild(c);
      }
      const ok = document.createElement('button'); ok.className = 'aui-btn pri';
      ok.textContent = opts.okText || (withCancel ? (isEn() ? 'OK' : '確定') : (isEn() ? 'OK' : '知道了'));
      ok.onclick = () => done(true);
      btns.appendChild(ok);
      card.appendChild(btns);
      mask.appendChild(card);
      mask.onclick = (e) => { if (e.target === mask && !withCancel) done(true); };   // confirm 不給點背景關(避免誤觸當取消/確定不明)
      function onKey(e) {
        if (e.key === 'Escape') done(withCancel ? false : true);
        if (e.key === 'Enter' && !withCancel) done(true);
      }
      document.addEventListener('keydown', onKey);
      document.body.appendChild(mask);
      try { if (window.cvtStaticUI && window.I18n && I18n.getLang() === 'zh-CN') cvtStaticUI(card); } catch (e) {}
      try { ok.focus(); } catch (e) {}
    });
  }

  window.AppUI = {
    alert: (msg, opts) => open(msg, opts, false),
    confirm: (msg, opts) => open(msg, opts, true),
  };
  try { ensureStyle(); } catch (e) {}   // 立即注入:寬度縮放規則也涵蓋站上其他彈窗卡
})();
