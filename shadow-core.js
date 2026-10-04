// shadow-core.js — 跟讀共用核心:辨識文字正規化 + 計分 + 語音辨識(App 原生橋 / 瀏覽器 Web Speech)。
// 來源:speak.html 跟讀課程(第 4 章)的 Lesson 引擎,把「比對前正規化」抽出來共用;
// speak.html 的句子跟讀、essentials-lessons.js 的單字跟讀都走這裡,兩邊判分口徑一致。
(function (root) {
  'use strict';
  const PUNCT_RE = /[、。,.!?！？…・「」\s]/g;
  // 過關門檻(與 speak.html Lesson 相同):即時 ≥85% 過;一段講完(final)≥72% 寬容過
  const PASS = 0.85, PASS_LENIENT = 0.72;

  function kata2hira(t) { return String(t || '').replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60)); }
  // 辨識引擎會把數詞轉阿拉伯數字(ふたつ→「2つ」),但目標是假名 → 對不上(用戶實錘)。
  // 比對前把「數字+量詞」還原成假名讀音;蓋不到的量詞退回數字的音讀。
  const NUM_TSU = ['', 'ひとつ', 'ふたつ', 'みっつ', 'よっつ', 'いつつ', 'むっつ', 'ななつ', 'やっつ', 'ここのつ', 'とお'];
  const NUM_NIN = ['', 'ひとり', 'ふたり', 'さんにん', 'よにん', 'ごにん', 'ろくにん', 'ななにん', 'はちにん', 'きゅうにん', 'じゅうにん'];
  const NUM_JI = ['', 'いちじ', 'にじ', 'さんじ', 'よじ', 'ごじ', 'ろくじ', 'しちじ', 'はちじ', 'くじ', 'じゅうじ', 'じゅういちじ', 'じゅうにじ'];
  const NUM_ON = ['ゼロ', 'いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう', 'じゅう'];
  function numNorm(t) {
    return String(t || '')
      .replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0))
      .replace(/(10|[0-9])つ/g, (m, n) => NUM_TSU[+n] || m)
      .replace(/(10|[0-9])人/g, (m, n) => NUM_NIN[+n] || m)
      .replace(/(1[0-2]|[0-9])時/g, (m, n) => NUM_JI[+n] || m)
      .replace(/(10|[0-9])/g, (m, n) => NUM_ON[+n] || '');
  }
  function lnorm(t) { return kata2hira(numNorm(t)).replace(PUNCT_RE, ''); }

  // ── 單字跟讀用:辨識結果可能是「1本」「一本」「いっぽん」「イッポン」任何一種 ──
  // 漢數字 → 阿拉伯數字(一本→1本、三百→300、一億→100000000),讓「寫法」比對也能命中
  const KD = { '〇': 0, '零': 0, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9 };
  const KU = { '十': 10, '百': 100, '千': 1000 };
  function kanjiNum(s) {
    return String(s || '').replace(/[〇零一二三四五六七八九十百千万億]+/g, seg => {
      let total = 0, sect = 0, cur = 0, ok = false;
      for (const ch of seg) {
        if (ch in KD) { cur = KD[ch]; ok = true; }
        else if (ch in KU) { sect += (cur || 1) * KU[ch]; cur = 0; ok = true; }
        else if (ch === '万' || ch === '億') { total += (sect + cur || 1) * (ch === '万' ? 1e4 : 1e8); sect = 0; cur = 0; ok = true; }
      }
      return ok ? String(total + sect + cur) : seg;
    });
  }
  // 「1億」「1万」這種寫法展開成純數字,和 kanjiNum 的輸出對齊
  function digitUnits(s) { return String(s || '').replace(/(\d+)(億|万)/g, (m, n, u) => String(+n * (u === '億' ? 1e8 : 1e4))); }
  function rawNorm(t) {
    return kata2hira(kanjiNum(digitUnits(String(t || '').normalize('NFKC')))).replace(PUNCT_RE, '').replace(/[〜~]/g, '');
  }
  // 最長共同子序列(字元級)→ 相似度
  function lcs(a, b) {
    if (!a.length || !b.length) return 0;
    const dp = new Array(b.length + 1).fill(0);
    for (let i = 1; i <= a.length; i++) {
      let prev = 0;
      for (let j = 1; j <= b.length; j++) {
        const tmp = dp[j];
        dp[j] = a[i - 1] === b[j - 1] ? prev + 1 : Math.max(dp[j], dp[j - 1]);
        prev = tmp;
      }
    }
    return dp[b.length];
  }
  // 單字/短句計分:targets = { yomi:['いっぽん'], forms:['1本'] }
  // 回傳 0–100。辨識字串含完整目標(讀音或寫法)= 100;否則用讀音的字元相似度。
  function scoreWord(said, targets) {
    const yomi = (targets && targets.yomi || []).filter(Boolean);
    const forms = (targets && targets.forms || []).filter(Boolean);
    const sL = lnorm(said), sR = rawNorm(said);
    if (!sL && !sR) return 0;
    for (const y of yomi) { const n = lnorm(y); if (n && sL.indexOf(n) >= 0) return 100; }
    for (const f of forms) {
      const nL = lnorm(f), nR = rawNorm(f);
      if (nL && sL.indexOf(nL) >= 0) return 100;
      if (nR && sR.indexOf(nR) >= 0) return 100;
    }
    let best = 0;
    yomi.forEach(y => {
      const n = lnorm(y); if (!n) return;
      // 念太多(把整串重複念、多念別的字)不該扣到過不了:分母取目標長度,但多出的字超過一倍才開始扣
      const hit = lcs(n, sL);
      const extra = Math.max(0, sL.length - n.length * 2);
      const r = Math.max(0, hit - extra * 0.5) / n.length;
      if (r > best) best = r;
    });
    return Math.round(Math.min(1, best) * 100);
  }
  function passed(score, isFinal) { return score >= PASS * 100 || (isFinal && score >= PASS_LENIENT * 100); }

  // ── 語音辨識:App 內走原生 SFSpeechRecognizer/Android 橋(STAYJP_NATIVE.canSpeech),瀏覽器才用 Web Speech ──
  // 與 speak.html 同一條路:原生 postMessage SPEECH_START/STOP,結果回呼 window.stayjpSpeechResult / stayjpSpeechEnd。
  function nativeOK() { return !!(root.STAYJP_NATIVE && root.STAYJP_NATIVE.canSpeech && root.ReactNativeWebView); }
  function srClass() { return root.SpeechRecognition || root.webkitSpeechRecognition || null; }
  function supported() { return nativeOK() || !!srClass(); }
  function nPost(o) { try { root.ReactNativeWebView.postMessage(JSON.stringify(o)); } catch (e) {} }
  // listen({onResult(text,isFinal), onEnd(err)}) → 回傳 stop();單次收音(講完一段自動結束)
  function listen(cb) {
    cb = cb || {};
    let stopped = false;
    if (nativeOK()) {
      const saved = { r: root.stayjpSpeechResult, e: root.stayjpSpeechEnd };
      const restore = () => { root.stayjpSpeechResult = saved.r; root.stayjpSpeechEnd = saved.e; };
      if (root.STAYJP_NATIVE.canPlayB64) nPost({ type: 'STOP_PLAY' });   // 開麥前停掉原生播放
      root.stayjpSpeechResult = function (t, fin) { if (t == null || stopped) return; try { cb.onResult && cb.onResult(String(t), !!fin); } catch (e) {} };
      root.stayjpSpeechEnd = function (err) { if (stopped) return; stopped = true; restore(); try { cb.onEnd && cb.onEnd(err || null); } catch (e) {} };
      nPost({ type: 'SPEECH_START', lang: 'ja-JP' });
      return function stop() { if (stopped) return; stopped = true; restore(); nPost({ type: 'SPEECH_STOP' }); try { cb.onEnd && cb.onEnd(null); } catch (e) {} };
    }
    const SR = srClass();
    if (!SR) { setTimeout(() => { try { cb.onEnd && cb.onEnd('unsupported'); } catch (e) {} }, 0); return function () {}; }
    const rec = new SR(); rec.lang = 'ja-JP'; rec.interimResults = true; rec.continuous = false;
    rec.onresult = e => { let t = ''; for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript; try { cb.onResult && cb.onResult(t, !!e.results[e.results.length - 1].isFinal); } catch (er) {} };
    rec.onerror = e => { if (stopped) return; stopped = true; try { cb.onEnd && cb.onEnd(e.error || 'error'); } catch (er) {} };
    rec.onend = () => { if (stopped) return; stopped = true; try { cb.onEnd && cb.onEnd(null); } catch (er) {} };
    try { rec.start(); } catch (e) { setTimeout(() => { if (!stopped) { stopped = true; try { cb.onEnd && cb.onEnd('start-failed'); } catch (er) {} } }, 0); }
    return function stop() { if (stopped) return; try { rec.stop(); } catch (e) {} };
  }

  const ShadowCore = { kata2hira, numNorm, lnorm, rawNorm, kanjiNum, scoreWord, passed, listen, supported, PASS, PASS_LENIENT };
  root.ShadowCore = ShadowCore;
  if (typeof module !== 'undefined' && module.exports) module.exports = ShadowCore;
})(typeof window !== 'undefined' ? window : globalThis);
