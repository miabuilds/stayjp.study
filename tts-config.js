// 語音檔位置設定(單一真相來源)。
//  TTS_BASE = ''      → 用本站相對路徑 audio/tts/<hash>.mp3(GitHub Pages,現況,零改動)
//  TTS_BASE = 'https://media.example.com/'  → 改走 CDN / Cloudflare R2
//     (尾端要有 /;R2 端沿用相同的 audio/tts/<hash>.mp3 路徑,直接把整個 audio/tts 資料夾同步上去即可)
// 所有播放點(app.html / listening.js / articles-ui.js / verbs.html / phrases.html)都改用 window.ttsUrl()。
window.TTS_BASE = window.TTS_BASE || '';
window.ttsUrl = function (hash) {
  // 多人聲(2026-09-17):tts_voice 非預設且該聲音有這個 hash(audio/tts-v/manifest.js → __TTS_V)才換路徑,否則退回主音檔
  try {
    var v = localStorage.getItem('tts_voice');
    if (v && v !== '2' && window.__TTS_V && window.__TTS_V[v] && window.__TTS_V[v][hash]) return (window.TTS_BASE || '') + 'audio/tts-v/' + v + '/' + hash + '.mp3';
  } catch (e) {}
  return (window.TTS_BASE || '') + 'audio/tts/' + hash + '.mp3';
};
