// 小狸助教:右下角浮動 AI 助教(文法 Q&A + 整句拆解)。
// 後端 askTutor(Claude);額度 ai_usage.askDay(免費每日 2、Premium 30);首次用前跑 AIConsent.ensure()。
// context:翻開文法/單字卡 → Tutor.ctxFromCard(卡片 DOM);文章句子 → Tutor.askSentence(句子, 文章標題)。
// 三語:UI 文字用 L(zh,en)(簡中走 cvt);問答語言由後端依 lang 決定。
(function (root) {
  var FN = 'https://asia-east1-jpnote-1bdd6.cloudfunctions.net/askTutor';
  var IMG = 'images/mascot/tanuki-think.png';
  var ctx = null, hist = [], busy = false, isOpen = false, remain = null, built = false;

  function lang() { try { return (typeof I18n !== 'undefined' && I18n.getLang) ? I18n.getLang() : (localStorage.getItem('ui_lang') || 'zh-TW'); } catch (e) { return 'zh-TW'; } }
  function L(zh, en) { var l = lang(); if (l === 'en') return en; try { return (l === 'zh-CN' && typeof cvt === 'function') ? cvt(zh) : zh; } catch (e) { return zh; } }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function $(id) { return document.getElementById(id); }
  function cleanText(el) {
    // 卡片文字(去掉 ruby 的假名,只留原文),當 context 送後端
    try { var c = el.cloneNode(true); c.querySelectorAll('rt,rp,button,.tt-hide,.art-sp,.art-sq').forEach(function (x) { x.remove(); }); return (c.innerText || c.textContent || '').replace(/\s+\n/g, '\n').replace(/[ \t]+/g, ' ').trim(); } catch (e) { return ''; }
  }

  function css() {
    if ($('tutorCss')) return;
    var s = document.createElement('style'); s.id = 'tutorCss';
    s.textContent = [
      '#tutorFab{position:fixed;right:14px;bottom:calc(var(--btm-h,56px) + 16px + env(safe-area-inset-bottom,0px));z-index:9500;width:58px;height:58px;border-radius:50%;border:none;padding:0;background:var(--bg2,#fff);box-shadow:0 6px 20px rgba(0,0,0,.16);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .15s}',
      '#tutorFab:active{transform:scale(.94)}#tutorFab img{width:46px;height:46px;object-fit:contain;pointer-events:none}',
      '#tutorFab .tt-dot{position:absolute;top:-2px;right:-2px;background:var(--ac,#D4654A);color:#fff;font-size:10px;line-height:1;padding:3px 6px;border-radius:10px;font-weight:700}',
      '#tutorHint{position:fixed;right:80px;bottom:calc(var(--btm-h,56px) + 26px + env(safe-area-inset-bottom,0px));z-index:9500;background:var(--tx,#2C2C2C);color:#fff;font-size:13px;padding:8px 12px;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,.18);max-width:220px;line-height:1.4;animation:ttPop .3s ease}',
      '#tutorHint:after{content:"";position:absolute;right:-6px;top:50%;margin-top:-6px;border:6px solid transparent;border-left-color:var(--tx,#2C2C2C);border-right:0}',
      '@keyframes ttPop{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}',
      '@media (min-width:900px){#tutorFab{right:24px;bottom:24px}#tutorHint{right:92px;bottom:36px}}',
      '#tutorPanel{position:fixed;z-index:9600;right:0;bottom:0;left:0;max-height:86vh;background:var(--bg2,#fff);border-radius:18px 18px 0 0;box-shadow:0 -8px 30px rgba(0,0,0,.18);display:flex;flex-direction:column;overflow:hidden;animation:ttUp .22s ease}',
      '@keyframes ttUp{from{transform:translateY(30px);opacity:0}to{transform:none;opacity:1}}',
      '@media (min-width:900px){#tutorPanel{left:auto;right:24px;bottom:24px;width:400px;max-height:min(680px,88vh);border-radius:18px}}',
      '#tutorPanel .tt-top{display:flex;align-items:center;gap:10px;padding:10px 12px 8px;border-bottom:1px solid var(--bd,#E8E5E0)}',
      '#tutorPanel .tt-top img{width:36px;height:36px;object-fit:contain}',
      '#tutorPanel .tt-name{font-weight:700;font-size:15px;color:var(--tx,#2C2C2C)}#tutorPanel .tt-sub{font-size:11.5px;color:var(--tx2,#7A7A7A);margin-top:1px}',
      '#tutorPanel .tt-big-b{margin-left:auto;background:none;border:none;font-size:17px;line-height:1;color:var(--tx2,#7A7A7A);cursor:pointer;padding:4px 6px}',
      '#tutorPanel .tt-x{background:none;border:none;font-size:22px;line-height:1;color:var(--tx2,#7A7A7A);cursor:pointer;padding:4px 6px}',
      // 放大:手機吃滿整個畫面、桌機加寬加高(回饋:拆解後版面太小太長型)
      '#tutorPanel.tt-big{left:0;right:0;bottom:0;top:0;width:auto;max-height:none;border-radius:0}',
      '@media(min-width:900px){#tutorPanel.tt-big{left:auto;right:24px;bottom:24px;top:24px;width:min(760px,92vw);max-height:none;border-radius:18px}}',
      '#tutorPanel .tt-full{display:block;width:100%;margin-top:8px;background:var(--ac,#D4654A);color:#fff;border:0;border-radius:10px;padding:9px 12px;font:inherit;font-size:13px;font-weight:800;cursor:pointer}',
      '#tutorPanel .tt-ctx{display:flex;align-items:center;gap:6px;margin:10px 12px;padding:8px 10px;border-radius:10px;background:var(--bg3,#F3F1ED);font-size:12.5px;color:var(--tx,#2C2C2C)}',
      '#tutorPanel .tt-ctx b{color:var(--ac,#D4654A);font-weight:700;flex:none}#tutorPanel .tt-ctx span{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '#tutorPanel .tt-ctx button{border:none;background:none;color:var(--tx2,#7A7A7A);cursor:pointer;font-size:15px;padding:0 2px}',
      // 捲動時訊息會貼到上面的釘選列 → 加一條分隔線 + 上緣留白(Mia 多次回饋「div 不要黏在一起」)
      '#tutorPanel .tt-msgs{flex:1;overflow-y:auto;padding:14px 12px 16px;display:flex;flex-direction:column;gap:14px;-webkit-overflow-scrolling:touch;border-top:1px solid var(--bd,#E8E5E0)}',
      '#tutorPanel .tt-m{max-width:92%;padding:13px 14px;border-radius:14px;font-size:14px;line-height:1.7;color:var(--tx,#2C2C2C);word-break:break-word}',
      '#tutorPanel .tt-m.me{align-self:flex-end;background:var(--ac,#D4654A);color:#fff;border-bottom-right-radius:4px;white-space:pre-wrap}',
      '#tutorPanel .tt-m.ai{align-self:flex-start;background:var(--bg3,#F3F1ED);border-bottom-left-radius:4px}',
      '#tutorPanel .tt-m.ai .tt-h{font-weight:700;color:var(--ac,#D4654A);margin:8px 0 3px;font-size:13.5px}#tutorPanel .tt-m.ai .tt-h:first-child{margin-top:0}',
      '#tutorPanel .tt-m.ai p{margin:0 0 6px}#tutorPanel .tt-m.ai p:last-child{margin-bottom:0}',
      '#tutorPanel .tt-m.ai ul{margin:0 0 6px;padding-left:18px}#tutorPanel .tt-m.ai li{margin:2px 0}',
      '#tutorPanel .tt-m.ai .tt-eg{margin:4px 0 6px;padding:6px 8px 6px 10px;border-left:3px solid var(--ac2,#4A7FD4);background:var(--bg2,#fff);border-radius:6px}',
      '#tutorPanel .tt-m.ai .tt-eg .jp{font-size:15.5px;line-height:2}#tutorPanel .tt-m.ai .tt-eg rt{font-size:.55em;color:var(--tx2,#7A7A7A)}',
      '#tutorPanel .tt-m.ai .tt-eg .zh{font-size:12.5px;color:var(--tx2,#7A7A7A);margin-top:2px}',
      '#tutorPanel .tt-m.ai .tt-spk{border:none;background:none;cursor:pointer;color:var(--ac2,#4A7FD4);font-size:14px;padding:0 4px;vertical-align:middle}',
      '#tutorPanel .tt-m.ai table{border-collapse:collapse;width:100%;font-size:13px;margin:4px 0 8px;background:var(--bg2,#fff);border-radius:8px;overflow:hidden}',
      '#tutorPanel .tt-m.ai td{padding:5px 6px;border-bottom:1px solid var(--bd,#E8E5E0);vertical-align:top}#tutorPanel .tt-m.ai tr:last-child td{border-bottom:none}',
      '#tutorPanel .tt-m.ai td:first-child{font-weight:700;white-space:nowrap}#tutorPanel .tt-m.ai td:nth-child(2){color:var(--tx2,#7A7A7A);white-space:nowrap}#tutorPanel .tt-m.ai td:nth-child(3){color:var(--ac2,#4A7FD4);white-space:nowrap;font-size:12px}',
      '#tutorPanel .tt-m.ai.err{background:#FEF2F2;color:#991B1B}#tutorPanel .tt-m.ai.err a,#tutorPanel .tt-m.ai.err button{color:var(--ac,#D4654A);font-weight:700;background:none;border:none;cursor:pointer;font-size:14px;padding:0;text-decoration:underline}',
      '#tutorPanel .tt-think{display:flex;gap:4px;align-items:center}#tutorPanel .tt-think i{width:6px;height:6px;border-radius:50%;background:var(--tx2,#7A7A7A);animation:ttB 1s infinite}#tutorPanel .tt-think i:nth-child(2){animation-delay:.15s}#tutorPanel .tt-think i:nth-child(3){animation-delay:.3s}',
      '@keyframes ttB{0%,80%,100%{opacity:.3}40%{opacity:1}}',
      '#tutorPanel .tt-chips{display:flex;gap:6px;flex-wrap:wrap;padding:0 12px 6px}',
      '#tutorPanel .tt-chip{border:1px solid var(--bd,#E8E5E0);background:var(--bg2,#fff);color:var(--tx,#2C2C2C);border-radius:999px;padding:5px 11px;font-size:12.5px;cursor:pointer}',
      '#tutorPanel .tt-chip:active{background:var(--bg3,#F3F1ED)}',
      '#tutorPanel .tt-in{display:flex;gap:8px;align-items:flex-end;padding:8px 12px calc(10px + env(safe-area-inset-bottom,0px));border-top:1px solid var(--bd,#E8E5E0)}',
      '#tutorPanel textarea{flex:1;resize:none;border:1px solid var(--bd,#E8E5E0);background:var(--bg,#FAF9F6);color:var(--tx,#2C2C2C);border-radius:12px;padding:9px 11px;font-size:14px;line-height:1.4;max-height:110px;min-height:40px;font-family:inherit;outline:none}',
      '#tutorPanel textarea:focus{border-color:var(--ac,#D4654A)}',
      '#tutorPanel .tt-send{flex:none;width:40px;height:40px;border-radius:50%;border:none;background:var(--ac,#D4654A);color:#fff;font-size:17px;cursor:pointer;display:flex;align-items:center;justify-content:center}',
      '#tutorPanel .tt-send:disabled{opacity:.45}',
      '#tutorPanel .tt-parse{flex:none;height:40px;border-radius:12px;border:1px solid var(--ac2,#4A7FD4);background:none;color:var(--ac2,#4A7FD4);font-size:12.5px;padding:0 9px;cursor:pointer;white-space:nowrap}',
      '#tutorPanel .tt-parse:disabled{opacity:.45}',
      '#tutorPanel .tt-welcome{font-size:13.5px;color:var(--tx2,#7A7A7A);line-height:1.6;padding:6px 4px}',
      '.art-sq{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;margin-left:4px;border-radius:50%;border:1.5px solid rgba(74,127,212,.4);background:none;cursor:pointer;vertical-align:middle;padding:0;font-size:12px;line-height:1;color:#4A7FD4}',
      '.art-sq img{width:16px;height:16px;object-fit:contain;pointer-events:none}',
      // app.html 有「↑ 回頂部」鈕(.bt,bottom:72px right:16px)→ 小狸往上疊,不要壓到它(Mia 2026-09-16 回饋)
      // 測驗/字卡/設定 overlay(#quizBg.show)開著時收起小狸鈕,不壓到卡片(Mia 2026-09-17 截圖)
      'body:has(#quizBg.show) #tutorFab,body:has(#quizBg.show) #tutorHint{display:none!important}',
      'body.tutor-has-bt #tutorFab{bottom:calc(72px + 50px + env(safe-area-inset-bottom,0px));right:16px}',
      'body.tutor-has-bt #tutorHint{bottom:calc(72px + 62px + env(safe-area-inset-bottom,0px));right:82px}',
      'body.tutor-open #tutorFab,body.tutor-open #tutorHint,body.tutor-open #quotaBadge{display:none!important}'   // 面板開著時左下角免費額度小牌也收起,手機上會壓到對話
    ].join('\n');
    document.head.appendChild(s);
  }

  function build() {
    if (built) return; built = true; css();
    try { if (document.getElementById('bt')) document.body.classList.add('tutor-has-bt'); } catch (e) {}
    var fab = document.createElement('button'); fab.id = 'tutorFab'; fab.type = 'button';
    fab.setAttribute('aria-label', L('問小狸助教', 'Ask Tanuki tutor'));
    fab.innerHTML = '<img src="' + IMG + '" alt=""><span class="tt-dot">AI</span>';
    fab.onclick = function () { open(); };
    document.body.appendChild(fab);
    var p = document.createElement('div'); p.id = 'tutorPanel'; p.style.display = 'none';
    p.innerHTML =
      '<div class="tt-top"><img src="' + IMG + '" alt=""><div><div class="tt-name">' + L('小狸助教', 'Tanuki Tutor') + '</div><div class="tt-sub" id="tutorSub">' + L('文法、單字、句子都可以問', 'Ask about grammar, words or sentences') + '</div></div>' +
      '<button class="tt-big-b" id="tutorBig" type="button" onclick="Tutor.toggleBig()" title="' + L('放大 / 還原', 'Expand / restore') + '" aria-label="expand">⤢</button>' +
      '<button class="tt-x" type="button" onclick="Tutor.close()" aria-label="close">×</button></div>' +
      '<div class="tt-ctx" id="tutorCtx" style="display:none"><b>📌</b><span id="tutorCtxT"></span><button type="button" onclick="Tutor.clearCtx()" title="' + L('不帶這個內容', 'Drop context') + '">×</button></div>' +
      '<div class="tt-msgs" id="tutorMsgs"></div>' +
      '<div class="tt-chips" id="tutorChips"></div>' +
      '<div class="tt-in"><textarea id="tutorIn" rows="1" placeholder="' + L('問小狸…或貼一句日文', 'Ask… or paste a Japanese sentence') + '"></textarea>' +
      '<button class="tt-parse" id="tutorParse" type="button" onclick="Tutor.sendParse()" title="' + L('把輸入的日文句子逐詞拆解', 'Break down the sentence word by word') + '">' + L('拆解', 'Parse') + '</button>' +
      '<button class="tt-send" id="tutorSend" type="button" onclick="Tutor.send()" aria-label="send">➤</button></div>';
    document.body.appendChild(p);
    var ta = $('tutorIn');
    ta.addEventListener('input', function () { ta.style.height = 'auto'; ta.style.height = Math.min(110, ta.scrollHeight) + 'px'; });
    ta.addEventListener('keydown', function (e) {
      // 桌機 Enter 送出、Shift+Enter 換行;手機鍵盤 Enter 保留換行(用按鈕送)
      if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && window.matchMedia('(min-width:900px)').matches) { e.preventDefault(); send(); }
    });
    // 首次提示氣泡(只出現一次)
    try {
      if (!localStorage.getItem('tutor_hint_seen')) {
        var h = document.createElement('div'); h.id = 'tutorHint'; h.textContent = L('文法看不懂?點我問小狸 🦝', 'Stuck on grammar? Ask the tanuki 🦝');
        h.onclick = function () { open(); };
        document.body.appendChild(h);
        setTimeout(function () { if (h.parentNode) h.remove(); }, 7000);
        localStorage.setItem('tutor_hint_seen', '1');
      }
    } catch (e) {}
  }

  function renderCtx() {
    var box = $('tutorCtx'); if (!box) return;
    if (!ctx || !(ctx.title || ctx.body)) { box.style.display = 'none'; renderChips(); return; }
    box.style.display = 'flex';
    var tag = ctx.type === 'grammar' ? L('文法', 'Grammar') : ctx.type === 'vocab' ? L('單字', 'Word') : ctx.type === 'article' ? L('文章', 'Article') : ctx.type === 'sentence' ? L('句子', 'Sentence') : '';
    $('tutorCtxT').textContent = (tag ? tag + '・' : '') + (ctx.title || ctx.body || '').slice(0, 60);
    renderChips();
  }
  function renderChips() {
    var c = $('tutorChips'); if (!c) return;
    if (hist.length) { c.innerHTML = ''; return; }
    var chips;
    if (ctx && ctx.type === 'grammar') chips = [[L('用白話解釋這個文法', 'Explain this simply'), L('用白話解釋這個文法,並給我 2 個生活例句', 'Explain this grammar point simply, with 2 everyday example sentences')], [L('跟相似文法差在哪?', 'Similar grammar?'), L('這個文法跟意思相近的其他說法差在哪?什麼時候該用哪個?', 'How does this differ from similar expressions, and when should I use which?')], [L('常見錯誤', 'Common mistakes'), L('台灣人學這個文法最常犯什麼錯?', 'What mistakes do Chinese-speaking learners often make with this?')], [L('JLPT 怎麼考', 'On the JLPT'), L('JLPT 考這個文法常怎麼出題?給我一題練習', 'How does the JLPT test this? Give me one practice question')]];
    else if (ctx && ctx.type === 'vocab') chips = [[L('這個字怎麼用', 'How to use it'), L('這個單字怎麼用?給我 3 個不同場合的例句', 'How is this word used? Give 3 example sentences in different situations')], [L('相似字差別', 'Similar words'), L('跟這個單字意思相近的字有哪些?差別是什麼?', 'What words are similar to this, and how do they differ?')], [L('搭配詞', 'Collocations'), L('這個單字常跟什麼動詞/助詞搭配?', 'What verbs or particles does this word usually go with?')]];
    else if (ctx && (ctx.type === 'article' || ctx.type === 'sentence')) chips = [[L('這句在講什麼', 'Meaning?'), L('這句話的意思和文法重點是什麼?', 'What does this sentence mean, and what grammar is key here?')], [L('拆解這句', 'Parse'), '__parse__'], [L('換個說法', 'Rephrase'), L('這句可以怎麼換成更口語/更禮貌的說法?', 'How could I say this more casually or more politely?')]];
    else chips = [[L('は跟が差在哪', 'は vs が'), L('「は」跟「が」到底差在哪?用最簡單的方式解釋', 'What is the real difference between は and が? Explain simply')], [L('自動詞他動詞', 'Transitive pairs'), L('自動詞跟他動詞怎麼分?有沒有好記的方法?', 'How do I tell transitive and intransitive verbs apart? Any memory tricks?')], [L('貼一句幫我拆解', 'Paste a sentence'), '__hint__']];
    c.innerHTML = chips.map(function (x, i) { return '<button type="button" class="tt-chip" data-i="' + i + '">' + esc(x[0]) + '</button>'; }).join('');
    c.querySelectorAll('.tt-chip').forEach(function (b) {
      b.onclick = function () {
        var x = chips[+b.getAttribute('data-i')];
        if (x[1] === '__parse__') { if (ctx && ctx.body) ask(ctx.body, 'parse'); return; }
        if (x[1] === '__hint__') { var ta = $('tutorIn'); ta.placeholder = L('把日文句子貼這裡,然後按「拆解」', 'Paste a Japanese sentence here, then tap Parse'); ta.focus(); return; }
        ask(x[1], 'ask');
      };
    });
  }
  function setSub() {
    var s = $('tutorSub'); if (!s) return;
    if (remain == null) s.textContent = L('文法、單字、句子都可以問', 'Ask about grammar, words or sentences');
    else if (remain >= 999) s.textContent = 'admin';
    else s.textContent = L('今天還可以問 ' + remain + ' 次', remain + ' questions left today');
  }

  // ── 回覆渲染:【小標】/ 例:句 → 翻譯 / 詞｜讀音｜詞性｜說明 / - 條列 / **粗體** ──
  function inline(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'); }
  function fr(t) { try { return root.furiganaHTMLRich ? root.furiganaHTMLRich(t) : esc(t); } catch (e) { return esc(t); } }
  function render(text) {
    var lines = String(text || '').replace(/\r/g, '').split('\n');
    var out = [], ul = [], tb = [];
    function flush() {
      if (ul.length) { out.push('<ul>' + ul.map(function (x) { return '<li>' + inline(x) + '</li>'; }).join('') + '</ul>'); ul = []; }
      if (tb.length) { out.push('<table>' + tb.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + inline(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>'); tb = []; }
    }
    lines.forEach(function (ln) {
      var t = ln.trim(); if (!t) { flush(); return; }
      var m;
      if (/^【.+】$/.test(t)) { flush(); out.push('<div class="tt-h">' + esc(t.slice(1, -1)) + '</div>'); return; }
      if ((t.match(/｜/g) || []).length >= 2) { if (ul.length) flush(); var cells = t.split('｜').map(function (x) { return x.trim(); }); if (/^(詞|単語|單字|word)$/i.test(cells[0])) return; tb.push(cells); return; }
      if ((m = t.match(/^(?:例|Ex|Example)\s*[:：]\s*(.+)$/i))) {
        flush(); var body = m[1], jp = body, zh = '';
        var k = body.indexOf('→'); if (k > 0) { jp = body.slice(0, k).trim(); zh = body.slice(k + 1).trim(); }
        jp = jp.replace(/^[「『]|[」』]$/g, '');
        out.push('<div class="tt-eg"><span class="jp">' + fr(jp) + '</span>' + (root.speak ? '<button type="button" class="tt-spk" data-jp="' + esc(jp) + '" aria-label="play">🔊</button>' : '') + (zh ? '<div class="zh">' + inline(zh) + '</div>' : '') + '</div>');
        return;
      }
      if (/^[→⇒]\s*/.test(t) && out.length && /tt-eg/.test(out[out.length - 1]) && !/class="zh"/.test(out[out.length - 1])) {
        // 模型把翻譯換行寫在「→」下一行 → 併回上一個例句卡
        out[out.length - 1] = out[out.length - 1].replace(/<\/div>$/, '<div class="zh">' + inline(t.replace(/^[→⇒]\s*/, '')) + '</div></div>'); return;
      }
      if (/^[-•・]\s*/.test(t)) { if (tb.length) flush(); ul.push(t.replace(/^[-•・]\s*/, '')); return; }
      if (/^\d+[.、)]\s*/.test(t)) { if (tb.length) flush(); ul.push(t.replace(/^\d+[.、)]\s*/, '')); return; }
      flush(); out.push('<p>' + inline(t) + '</p>');
    });
    flush();
    return out.join('');
  }
  function addMsg(role, html, cls) {
    var box = $('tutorMsgs'); var d = document.createElement('div'); d.className = 'tt-m ' + role + (cls ? ' ' + cls : ''); d.innerHTML = html; box.appendChild(d);
    d.querySelectorAll('.tt-spk').forEach(function (b) { b.onclick = function () { try { root.speak(b.getAttribute('data-jp')); } catch (e) {} }; });
    box.scrollTop = box.scrollHeight; return d;
  }

  function currentUser() { try { return (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth().currentUser : null; } catch (e) { return null; } }
  function needLogin() {
    var html = L('登入後就能問小狸(免費每天 2 次,Premium 每天 30 次)。', 'Sign in to ask the tutor (free: 2/day, Premium: 30/day).') + ' ';
    html += (typeof root.loginWith === 'function') ? '<button type="button" onclick="loginWith(\'google\')">' + L('用 Google 登入', 'Sign in with Google') + '</button>' : '<a href="account.html">' + L('前往登入', 'Sign in') + '</a>';
    addMsg('ai', html, 'err');
  }

  async function ask(text, mode) {
    text = String(text || '').trim(); if (!text || busy) return;
    var user = currentUser(); if (!user) { needLogin(); return; }
    try { if (root.AIConsent && !(await root.AIConsent.ensure())) return; } catch (e) {}
    busy = true; $('tutorSend').disabled = true; $('tutorParse').disabled = true;
    var ta = $('tutorIn'); ta.value = ''; ta.style.height = 'auto';
    addMsg('me', esc(mode === 'parse' ? L('拆解:', 'Parse: ') + text : text));
    hist.push({ role: 'me', text: mode === 'parse' ? '請拆解這句:' + text : text });
    renderChips();
    var th = addMsg('ai', '<div class="tt-think"><i></i><i></i><i></i></div>');
    try {
      var tok = await user.getIdToken();
      var lv = ''; try { lv = (ctx && ctx.level) || root.currentLevel || ''; } catch (e) {}
      var r = await fetch(FN, { method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + tok },
        body: JSON.stringify({ q: text, mode: mode || 'ask', lang: lang(), ctx: ctx ? { type: ctx.type, title: ctx.title, body: ctx.body, level: lv } : { level: lv }, history: hist.slice(0, -1).slice(-6) }) });
      var d = null; try { d = await r.json(); } catch (e) {}
      if (!r.ok) {
        var msg = (d && d.message) || (r.status === 401 ? L('請重新登入', 'Please sign in again') : L('小狸暫時連不上,等一下再試', 'The tutor is unavailable, try again shortly'));
        var extra = (r.status === 429) ? ' <a href="pricing.html">' + L('看 Premium', 'See Premium') + '</a>' : '';
        th.className = 'tt-m ai err'; th.innerHTML = esc(msg) + extra; hist.pop(); busy = false; $('tutorSend').disabled = false; $('tutorParse').disabled = false; return;
      }
      th.innerHTML = render(d.text) || esc(d.text || '');
      th.querySelectorAll('.tt-spk').forEach(function (b) { b.onclick = function () { try { root.speak(b.getAttribute('data-jp')); } catch (e) {} }; });
      hist.push({ role: 'ai', text: d.text || '' }); if (hist.length > 8) hist = hist.slice(-8);
      if (typeof d.remain === 'number') { remain = d.remain; setSub(); }
      try { if (typeof track === 'function') track('tutor_ask', { mode: mode || 'ask', ctx: ctx ? ctx.type : 'none' }); } catch (e) {}
      try { if (root.StayDaily && root.StayDaily.log) root.StayDaily.log('tutor'); } catch (e) {}
    } catch (e) {
      th.className = 'tt-m ai err'; th.textContent = L('網路不穩,再試一次', 'Network error, please retry'); hist.pop();
    }
    busy = false; $('tutorSend').disabled = false; $('tutorParse').disabled = false;
    $('tutorMsgs').scrollTop = $('tutorMsgs').scrollHeight;
  }
  function send() { ask($('tutorIn').value, 'ask'); }
  function sendParse() {
    var v = $('tutorIn').value.trim();
    if (!v && ctx && ctx.body && (ctx.type === 'sentence')) v = ctx.body;
    if (!v) { $('tutorIn').placeholder = L('先貼一句日文再按拆解', 'Paste a Japanese sentence first'); $('tutorIn').focus(); return; }
    ask(v, 'parse');
  }

  // 放大/還原(使用者回饋:拆解後版面太小太長型)
  function toggleBig() {
    var p = $('tutorPanel'); if (!p) return;
    var on = !p.classList.contains('tt-big'); p.classList.toggle('tt-big', on);
    try { localStorage.setItem('tutor_big', on ? '1' : ''); } catch (e) {}
    var b = $('tutorBig'); if (b) b.textContent = on ? '⤡' : '⤢';
    var t = $('tutorMsgs'); if (t) t.scrollTop = t.scrollHeight;
  }
  function open(c, opts) {
    build();
    try { if (localStorage.getItem('tutor_big') === '1') { var pp = $('tutorPanel'); if (pp && !pp.classList.contains('tt-big')) { pp.classList.add('tt-big'); var bb = $('tutorBig'); if (bb) bb.textContent = '⤡'; } } } catch (e) {}
    if (c) setCtx(c);
    var p = $('tutorPanel'); p.style.display = 'flex'; isOpen = true; document.body.classList.add('tutor-open');
    var box = $('tutorMsgs');
    if (!box.children.length) {
      box.innerHTML = '<div class="tt-welcome">' + L('嗨,我是小狸 🦝 文法看不懂、單字怎麼用、或是自己寫的句子對不對,都可以問我。貼一句日文按「拆解」,我幫你逐詞拆給你看。', 'Hi, I\'m the tanuki tutor 🦝 Ask me about grammar, word usage, or whether your own sentence is right. Paste a Japanese sentence and tap Parse for a word-by-word breakdown.') + '</div>';
    }
    renderCtx(); setSub();
    if (opts && opts.parse && c && c.body) {
      // 先給「馬上看得到」的:本地斷句+助詞標示(零等待、不花額度);要完整文法解析再按鈕叫小狸
      // (使用者回饋:「不一定每句都要完整拆解,因為都要等一下」)
      quickFirst(c.body);
      return;
    }
    if (window.matchMedia('(min-width:900px)').matches) { try { $('tutorIn').focus(); } catch (e) {} }
  }
  // 本地即時斷句 → 一則訊息;底下給「完整拆解」按鈕(才會用 AI 額度)
  function quickFirst(sentence) {
    var q = '';
    try { if (root.QuickParse) q = root.QuickParse.html(sentence); } catch (e) {}
    var jp = esc(String(sentence || '').slice(0, 200));
    var head = '<div class="tt-h">' + L('這句的斷句', 'Sentence segments') + '</div>';
    var btn = '<button type="button" class="tt-full" onclick="Tutor.fullParse()">'
      + L('讓小狸完整拆解(文法、語氣)', 'Full breakdown with the tutor') + '</button>';
    addMsg('ai', head + (q || '<p>' + jp + '</p>') + btn);
    lastSentence = sentence;
  }
  var lastSentence = '';
  function fullParse() { var s = lastSentence; if (!s) return; ask(s, 'parse'); }
  function close() { var p = $('tutorPanel'); if (p) p.style.display = 'none'; isOpen = false; document.body.classList.remove('tutor-open'); }
  function setCtx(c) { ctx = c || null; if (ctx && hist.length) { /* 換 context 保留對話,只換 chip */ } renderCtx(); }
  function clearCtx() { ctx = null; renderCtx(); }
  // 從文法/單字卡片 DOM 抓 context(toggleCard 翻開時呼叫)
  function ctxFromCard(card) {
    try {
      if (!card) return;
      var t = card.querySelector('.gt'), pt = card.querySelector('.pt'), ep = card.querySelector('.ep'), eg = card.querySelector('.eg');
      var title = t ? cleanText(t) : ''; if (!title) return;
      var mode = (root.currentMode === 'vocab') ? 'vocab' : 'grammar';
      var body = [pt ? cleanText(pt) : '', ep ? cleanText(ep) : '', eg ? cleanText(eg).slice(0, 700) : ''].filter(Boolean).join('\n');
      setCtx({ type: mode, id: card.id || '', title: title, body: body, level: root.currentLevel || '' });
    } catch (e) {}
  }
  // 文章句子鈕:帶句子開面板並直接拆解
  function askSentence(sentence, title, level) {
    open({ type: 'sentence', title: title || '', body: String(sentence || '').trim(), level: level || '' }, { parse: true });
  }
  function init() { if (document.body) build(); else document.addEventListener('DOMContentLoaded', build); }

  root.Tutor = { open: open, fullParse: fullParse, toggleBig: toggleBig, close: close, send: send, sendParse: sendParse, ask: ask, setCtx: setCtx, clearCtx: clearCtx, ctxFromCard: ctxFromCard, askSentence: askSentence, init: init, isOpen: function () { return isOpen; } };
  init();
})(window);
