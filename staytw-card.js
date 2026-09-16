// 「推薦 StayTW 給日本朋友」導流卡(2026-09-17)。
// StayTW = 同一個在日台灣工程師做完 StayJP 後反向做的:教日本人台灣華語(繁體・注音・台灣發音)。
// 三個位置:我的頁底部常駐;學習完成畫面(測驗結果/SRS 結束/模考結果/快速背單字結果)每完成 10 次出現一次,
// 按「不用了」30 天內不再出現。不彈窗、不動付費流程。分享訊息固定日文(收的人是日本人)。
(function (root) {
  const SHARE_URL = 'https://staytw.pages.dev/?lang=ja&utm_source=stayjp_share&utm_medium=referral';
  const SHARE_TEXT = '台湾華語（台湾の中国語）を、繁体字・注音・台湾の発音で学べるサイト。台湾人のエンジニアが作りました。ブラウザで無料、iOSアプリもあります。\n' + SHARE_URL;
  const CNT_KEY = 'stw_done_count', SNOOZE_KEY = 'stw_snooze_until', EVERY = 10, SNOOZE_DAYS = 30;
  const L = (zh, en) => { try { return (typeof enOr === 'function') ? enOr(zh, en) : zh; } catch (e) { return zh; } };

  function snoozed() { try { return (parseInt(localStorage.getItem(SNOOZE_KEY) || '0', 10) || 0) > Date.now(); } catch (e) { return false; } }
  function dismiss(where) {
    try { localStorage.setItem(SNOOZE_KEY, String(Date.now() + SNOOZE_DAYS * 86400000)); } catch (e) {}
    document.querySelectorAll('.stw-card').forEach(el => { el.style.display = 'none'; });
    try { if (typeof track === 'function') track('staytw_card_dismiss', { where: where || '' }); } catch (e) {}
  }
  async function share(where) {
    try { if (typeof track === 'function') track('staytw_card_share', { where: where || '' }); } catch (e) {}
    if (navigator.share) {
      try { await navigator.share({ text: SHARE_TEXT }); return; }
      catch (e) { if (e && e.name === 'AbortError') return; /* 不支援或失敗 → 退回複製 */ }
    }
    // 桌機/WebView 退回複製:先用同步的 execCommand(在點擊手勢內最穩,Safari 也吃),再試 clipboard API
    let ok = false;
    try {
      const ta = document.createElement('textarea'); ta.value = SHARE_TEXT; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;left:-9999px;top:0';
      document.body.appendChild(ta); ta.focus(); ta.select(); ta.setSelectionRange(0, SHARE_TEXT.length); ok = document.execCommand('copy'); ta.remove();
    } catch (e) {}
    if (!ok) { try { if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(SHARE_TEXT); ok = true; } } catch (e) {} }
    if (ok) { toast(L('已複製，貼給朋友就好', 'Copied — just paste it to your friend')); return; }
    // 兩種都不行(權限被擋)→ 把文字直接攤在卡片裡讓人長按複製,不彈窗
    document.querySelectorAll('.stw-card[data-where="' + where + '"] .stw-b').forEach(b => {
      if (b.querySelector('.stw-copy')) return;
      const box = document.createElement('textarea'); box.className = 'stw-copy'; box.readOnly = true; box.value = SHARE_TEXT; box.rows = 4;
      box.onclick = function () { try { this.select(); } catch (e) {} };
      b.appendChild(box); try { box.select(); } catch (e) {}
    });
    toast(L('請長按選取複製', 'Long-press to copy'));
  }
  let _t = null, _tm = null;
  function toast(msg) {
    try {
      if (!_t) { _t = document.createElement('div'); _t.className = 'stw-toast'; document.body.appendChild(_t); }
      _t.textContent = msg; _t.classList.add('show');
      if (_tm) clearTimeout(_tm); _tm = setTimeout(() => _t.classList.remove('show'), 2200);
    } catch (e) {}
  }
  function css() {
    if (document.getElementById('stwCss')) return;
    const st = document.createElement('style'); st.id = 'stwCss';
    st.textContent = [
      '.stw-card{display:flex;gap:12px;align-items:flex-start;background:var(--bg2);border:1px solid var(--bd);border-radius:14px;padding:14px 16px;margin:18px 0 0;text-align:left}',
      '.stw-card .stw-ic{flex:none;width:34px;height:34px;border-radius:10px;background:var(--bg3);display:flex;align-items:center;justify-content:center;color:var(--tx2)}.stw-card .stw-ic i{width:18px;height:18px}',
      '.stw-card .stw-b{flex:1;min-width:0}.stw-card .stw-t{font-size:14px;font-weight:700;color:var(--tx);margin:0 0 4px}.stw-card .stw-d{font-size:12.5px;line-height:1.6;color:var(--tx2);margin:0 0 10px}',
      '.stw-card .stw-acts{display:flex;gap:8px;flex-wrap:wrap}.stw-card .stw-acts button{border:1px solid var(--bd);background:var(--bg2);color:var(--tx);border-radius:999px;padding:7px 14px;font-size:13px;font-weight:600;cursor:pointer;width:auto;margin:0}',
      '.stw-card .stw-acts .pri{background:var(--tx);color:var(--bg2);border-color:var(--tx)}',
      '.stw-card .stw-copy{display:block;width:100%;margin-top:10px;padding:8px 10px;border:1px solid var(--bd);border-radius:10px;background:var(--bg3);color:var(--tx);font-size:12.5px;line-height:1.5;resize:none;font-family:inherit}',
      '.stw-toast{position:fixed;left:50%;bottom:calc(var(--btm-h,56px) + 24px + env(safe-area-inset-bottom,0px));transform:translateX(-50%) translateY(8px);background:rgba(30,30,30,.94);color:#fff;padding:10px 16px;border-radius:999px;font-size:13.5px;z-index:10050;opacity:0;pointer-events:none;transition:opacity .2s,transform .2s;max-width:86vw;text-align:center}.stw-toast.show{opacity:1;transform:translateX(-50%)}'
    ].join('\n');
    document.head.appendChild(st);
  }
  function html(where) {
    css();
    return '<div class="stw-card" data-where="' + where + '">'
      + '<div class="stw-ic"><i data-ic=globe></i></div>'
      + '<div class="stw-b">'
      + '<p class="stw-t">' + L('身邊有日本人想學中文嗎？', 'Know a Japanese speaker learning Chinese?') + '</p>'
      + '<p class="stw-d">' + L('我做了一個反過來的版本 StayTW，用繁體字、注音和台灣的發音教日本人台灣華語，網頁免費、也有 iOS App。', 'I built the reverse version, StayTW: Taiwan Mandarin with traditional characters, Zhuyin and Taiwan pronunciation. Free on the web, iOS app too.') + '</p>'
      + '<div class="stw-acts"><button type="button" class="pri" onclick="StayTWCard.share(\'' + where + '\')">' + L('分享給日本朋友', 'Share') + '</button>'
      + '<button type="button" onclick="StayTWCard.dismiss(\'' + where + '\')">' + L('不用了', 'No thanks') + '</button></div>'
      + '</div></div>';
  }
  // 我的頁:常駐(按「不用了」也只是這 30 天藏起來)
  function profileHtml() { return snoozed() ? '' : html('profile'); }
  // 完成畫面:每完成 10 次出現一次
  function completionHtml(where) {
    let n = 0;
    try { n = (parseInt(localStorage.getItem(CNT_KEY) || '0', 10) || 0) + 1; localStorage.setItem(CNT_KEY, String(n)); } catch (e) {}
    if (snoozed() || n % EVERY !== 0) return '';
    try { if (typeof track === 'function') track('staytw_card_show', { where: where || '' }); } catch (e) {}
    return html(where || 'done');
  }
  root.StayTWCard = { profileHtml, completionHtml, share, dismiss, SHARE_URL, SHARE_TEXT, _count: () => parseInt(localStorage.getItem(CNT_KEY) || '0', 10) || 0 };
})(window);
