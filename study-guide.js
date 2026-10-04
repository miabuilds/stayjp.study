// study-guide.js — 單字/文法「每日一批」上方的三步學習引導(Speak/TalkMe 式):① 看 → ② 練 → ③ 測。
// 不重做工具,只把現成的串起來:
//   單字:① 清單本身(點卡聽音)② FlashCard.beginToday()(快速背本批)③ Quiz(範圍=今日學習)
//   文法:① 清單本身(展開看接續/例句)② GrammarDrill 翻卡(今日學習)③ GrammarDrill 選擇題(今日學習)
// 工具一律經由全域物件呼叫 → tool-quota.js 包好的免費/Premium 額度照舊生效,這裡不碰額度。
// 進度:localStorage guide_steps {"v:n5:20":{l:1,p:1,q:1}}(app.html SYNC_KEYS,雲端同步);收合狀態 guide_collapsed(本機偏好)。
(function (root) {
  'use strict';
  const KEY = 'guide_steps', CKEY = 'guide_collapsed';
  const L = (zh, en) => (typeof enOr === 'function' ? enOr((typeof cvt === 'function' ? cvt(zh) : zh), en) : zh);
  const lv = () => (typeof currentLevel !== 'undefined' ? currentLevel : 'n5');
  function offset(kind) {
    try { return kind === 'g' ? (getGrammarDailyProgress(lv()).totalOffset || 0) : (getDailyProgress(lv()).totalOffset || 0); } catch (e) { return 0; }
  }
  function batchKey(kind) { return kind + ':' + lv() + ':' + offset(kind); }
  function all() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function get(kind) { return all()[batchKey(kind)] || {}; }
  function mark(kind, f) {
    const a = all(), k = batchKey(kind), e = a[k] || {};
    if (e[f]) return;
    e[f] = 1; a[k] = e;
    // 只留最近 60 批,免得無限長大
    const ks = Object.keys(a); if (ks.length > 60) ks.slice(0, ks.length - 60).forEach(x => delete a[x]);
    try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (er) {}
    try { if (typeof saveAllCloud === 'function') saveAllCloud(); } catch (er) {}
  }
  function collapsed() { try { return localStorage.getItem(CKEY) === '1'; } catch (e) { return false; } }
  const locked = tool => { try { return !!(root.ToolQuota && ToolQuota.isLocked && ToolQuota.isLocked(tool)); } catch (e) { return false; } };

  function steps(kind) {
    const n = kind === 'g' ? (typeof GRAMMAR_DAILY_NEW !== 'undefined' ? GRAMMAR_DAILY_NEW : 10) : (typeof DAILY_NEW !== 'undefined' ? DAILY_NEW : 20);
    if (kind === 'g') return [
      { f: 'l', n: '1', t: L('看', 'Learn'), d: L('展開這 ' + n + ' 條文法,看接續和例句,點例句聽發音', 'Open these ' + n + ' grammar points and read the patterns and examples'), next: L('看完了,下一步:翻卡練習', 'Done — next: flashcard practice') },
      { f: 'p', n: '2', t: L('練', 'Practice'), d: L('用翻卡把本批文法過一遍,記不住的會排進複習', 'Flip through this batch; ones you miss go into review'), next: L('下一步:翻卡練習', 'Next: flashcard practice'), tool: 'grammar' },
      { f: 'q', n: '3', t: L('測', 'Quiz'), d: L('做本批的選擇題,答錯有詳解', 'Take a multiple-choice quiz on this batch, with explanations'), next: L('下一步:本批小測驗', 'Next: batch quiz'), tool: 'grammar' },
    ];
    return [
      { f: 'l', n: '1', t: L('看', 'Learn'), d: L('瀏覽這 ' + n + ' 個字,點卡片聽發音、看例句', 'Browse these ' + n + ' words — tap a card to hear it and see the example'), next: L('看完了,下一步:快速背', 'Done — next: flashcards') },
      { f: 'p', n: '2', t: L('練', 'Practice'), d: L('用字卡快速背本批,不熟的會再出現', 'Drill this batch with flashcards; shaky ones come back'), next: L('下一步:快速背本批', 'Next: flashcards for this batch'), tool: 'flashcard' },
      { f: 'q', n: '3', t: L('測', 'Quiz'), d: L('考本批的單字,答錯有例句詳解', 'Quiz yourself on this batch, with example-sentence feedback'), next: L('下一步:本批小測驗', 'Next: batch quiz'), tool: 'quiz' },
    ];
  }
  function html(kind) {
    const st = steps(kind), g = get(kind);
    const done = st.filter(s => g[s.f]).length;
    const cur = st.find(s => !g[s.f]);
    const col = collapsed();
    let h = '<div class="sg" data-sg="' + kind + '">'
      + '<button class="sg-h" onclick="StudyGuide.toggle()" aria-expanded="' + (!col) + '"><b>' + L('本批學習引導', 'Study guide for this batch') + '</b>'
      + '<span class="sg-cnt">' + (done >= 3 ? '<i data-ic=check></i> ' + L('完成', 'Done') : done + ' / 3') + '</span>'
      + '<span class="sg-tg">' + (col ? L('展開', 'Show') : L('收合', 'Hide')) + '</span></button>';
    if (!col) {
      h += '<div class="sg-steps">' + st.map((s, i) => {
        const cls = g[s.f] ? 'done' : (cur === s ? 'cur' : '');
        return (i ? '<span class="sg-line' + (g[st[i - 1].f] ? ' done' : '') + '"></span>' : '')
          + '<button class="sg-st ' + cls + '" onclick="StudyGuide.go(\'' + kind + '\',\'' + s.f + '\')"><span class="sg-n">' + (g[s.f] ? '<i data-ic=check></i>' : s.n) + '</span><span class="sg-t">' + s.t + (s.tool && locked(s.tool) ? ' <i data-ic=lock></i>' : '') + '</span></button>';
      }).join('') + '</div>';
      if (cur) {
        h += '<div class="sg-desc"><b>' + L('現在', 'Now') + ':' + L('第 ' + cur.n + ' 步', 'Step ' + cur.n) + ' ' + cur.t + '</b> — ' + cur.d + '</div>'
          + '<button class="sg-next" onclick="StudyGuide.go(\'' + kind + '\',\'' + cur.f + '\')">' + cur.next + ' →</button>';
      } else {
        h += '<div class="sg-desc"><b>' + L('本批三步都完成了', 'All three steps done for this batch') + '</b> — ' + L('換下一批,或明天回來清複習。', 'Move on to the next batch, or come back tomorrow for reviews.') + '</div>'
          + '<button class="sg-next" onclick="StudyGuide.nextBatch(\'' + kind + '\')">' + L('下一批', 'Next batch') + ' →</button>';
      }
    }
    return h + '</div>';
  }
  function refresh() {
    document.querySelectorAll('.sg[data-sg]').forEach(el => { const t = document.createElement('div'); t.innerHTML = html(el.dataset.sg); el.replaceWith(t.firstChild); });
  }
  function toggle() { try { localStorage.setItem(CKEY, collapsed() ? '' : '1'); } catch (e) {} refresh(); }
  // 打開設定框後,把「等級 / 範圍=今日學習 / 模式」選好再直接開始(不改工具本身)
  function pick(groupId, v) { const b = document.querySelector('#' + groupId + ' [data-v="' + v + '"]'); if (b) b.click(); }
  function go(kind, f) {
    // 被額度鎖住時不打勾(按下去照樣交給工具,由 tool-quota 跳付費牆)
    const tool = f === 'p' ? (kind === 'v' ? 'flashcard' : 'grammar') : (kind === 'v' ? 'quiz' : 'grammar');
    const markIfOpen = () => { if (!locked(tool)) { mark(kind, f); refresh(); } };
    if (f === 'l') {
      mark(kind, 'l');
      refresh();
      // 「看」的工具就是下面的清單;按下一步 = 看完了 → 直接進 ② 練
      return go(kind, 'p');
    }
    if (kind === 'v') {
      if (f === 'p') { markIfOpen(); if (typeof FlashCard !== 'undefined') FlashCard.beginToday(); return; }
      if (f === 'q') {
        markIfOpen();
        if (typeof Quiz === 'undefined') return;
        Quiz.start(); pick('qLevel', lv()); pick('qRange', 'today'); pick('qCount', '10');
        Quiz.begin();
        return;
      }
    } else {
      if (typeof GrammarDrill === 'undefined') return;
      markIfOpen();
      GrammarDrill.start(); pick('gdMode', f === 'p' ? 'flash' : 'quiz'); pick('gdLevel', lv()); pick('gdRange', 'today');
      GrammarDrill.begin();
    }
  }
  function nextBatch(kind) {
    try { if (kind === 'g') { if (typeof nextGrammarBatch === 'function') nextGrammarBatch(); } else if (typeof nextDailyBatch === 'function') nextDailyBatch(); } catch (e) {}
  }
  root.StudyGuide = { html, go, toggle, nextBatch, refresh, _get: get };
})(window);
