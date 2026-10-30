// 語音檔位置設定(單一真相來源)。
//  TTS_BASE = ''      → 用本站相對路徑 audio/tts/<hash>.mp3(GitHub Pages,現況,零改動)
//  TTS_BASE = 'https://media.example.com/'  → 改走 CDN / Cloudflare R2
//     (尾端要有 /;R2 端沿用相同的 audio/tts/<hash>.mp3 路徑,直接把整個 audio/tts 資料夾同步上去即可)
// 所有播放點(app.html / listening.js / articles-ui.js / verbs.html / phrases.html)都改用 window.ttsUrl()。
window.TTS_BASE = window.TTS_BASE || '';
// Premium 自然語音(2026-10-30):Google Chirp 3 HD 全站預生成(scripts/tts/gen-google.mjs),檔在 repo 外、放 Cloudflare R2
// bucket stayjp-audio → tts-g/<voice>/<hash>.mp3(hash 與主音檔相同)。對話 A/B 兩聲線。
window.TTS_G_BASE = window.TTS_G_BASE || 'https://pub-5d0eefcfb05c46cdadedb702c907cab0.r2.dev/';
window.TTS_G_VOICES = { leda: 1, charon: 1 };
window.TTS_G_FREE_PER_DAY = 20;   // 免費版每天可用 Premium 聲音聽幾個不同音檔(試聽),之後自動退回標準聲
window.ttsVoice = function () { try { return localStorage.getItem('tts_voice') || '2'; } catch (e) { return '2'; } };
window.ttsIsG = function (v) { return !!window.TTS_G_VOICES[v || window.ttsVoice()]; };
window.ttsHasPremium = function () { try { return !!(window.ToolQuota && !window.ToolQuota.shouldGate()); } catch (e) { return false; } };
function __ttsGFreeState() {
  var d = new Date(), key = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  var st = null; try { st = JSON.parse(localStorage.getItem('tts_g_free') || 'null'); } catch (e) {}
  if (!st || st.d !== key) st = { d: key, h: [], n: 0 };
  return st;
}
window.ttsGFreeLeft = function () { if (window.ttsHasPremium()) return Infinity; var st = __ttsGFreeState(); return Math.max(0, window.TTS_G_FREE_PER_DAY - st.h.length); };
// 免費版:今天前 N 個不同音檔放行;額度用完第一次 → 通知 StudyPlan 跳一次提示(一天一次)
window.ttsGAllowed = function (hash) {
  if (window.ttsHasPremium()) return true;
  try {
    var st = __ttsGFreeState();
    if (st.h.indexOf(hash) >= 0) return true;
    if (st.h.length < window.TTS_G_FREE_PER_DAY) { st.h.push(hash); localStorage.setItem('tts_g_free', JSON.stringify(st)); return true; }
    if (!st.n) { st.n = 1; localStorage.setItem('tts_g_free', JSON.stringify(st)); try { if (window.StudyPlan && window.StudyPlan.voiceTrialEnded) window.StudyPlan.voiceTrialEnded(); } catch (e) {} }
  } catch (e) {}
  return false;
};
// 試聽鈕用:不看 Premium、直接拿某聲音的網址
window.ttsGSampleUrl = function (v, hash) { return window.TTS_G_BASE + 'tts-g/' + v + '/' + hash + '.mp3'; };
window.ttsUrl = function (hash) {
  try {
    var v = localStorage.getItem('tts_voice');
    if (v && window.TTS_G_VOICES[v]) {
      if (window.ttsGAllowed(hash)) return window.TTS_G_BASE + 'tts-g/' + v + '/' + hash + '.mp3';
    } else if (v && v !== '2' && window.__TTS_V && window.__TTS_V[v] && window.__TTS_V[v][hash]) {
      // 舊多人聲(2026-09-17 VOICEVOX 8/13,只有 N5/N4):還設著的人照舊,選單已不列
      return (window.TTS_BASE || '') + 'audio/tts-v/' + v + '/' + hash + '.mp3';
    }
  } catch (e) {}
  return (window.TTS_BASE || '') + 'audio/tts/' + hash + '.mp3';
};
// 同音不同重音(2026-10-09):先生③/宣誓⓪ 共用「せんせい」音檔會唸錯 → 這些字用漢字當 key 播自己的音檔
// (audio/tts/homophones.js → __TTS_HW,由 scripts/tts/gen-homophones.mjs 產)。單字播音一律走這支取 key。
window.wordSpeakKey = function (it) {
  if (!it) return '';
  return (window.__TTS_HW && window.__TTS_HW[it.w]) ? it.w : (it.r || it.w || '');
};
