// progress-codec.js — 進度資料壓縮編解碼(web + node test 共用)。
// 背景:進度 blob(srs_data 等)從 users/{uid} 搬到 user_progress/{uid},每 key 各自 gzip 成 bytes,
//       避免撞 Firestore 單 doc 1MiB 上限;訂閱寫入不再受進度 doc 大小影響。見 docs 決策 spec。
//
// 用瀏覽器原生 CompressionStream/DecompressionStream(node 18+ 也有 global),無第三方庫。
// gzip 是標準格式 → 瀏覽器寫的 bytes 與 node/admin 讀的互通。
(function (root) {
  // 會長大的進度 → 壓縮存 user_progress/{uid};小純量(exam_date/base_level/goal_level/daily_progress)留 users/{uid}。
  var PROGRESS_BIG_KEYS = [
    'srs_data', 'quiz_history', 'study_log', 'word_notebook', 'grammar_srs',
    'mock_exam_history', 'reading_done', 'reading_scores', 'listening_scores',
    'listening_done', 'shadow_favs', 'wrong_questions',
  ];

  async function gzipBytes(obj) {
    var input = new TextEncoder().encode(JSON.stringify(obj));
    var cs = new CompressionStream('gzip');
    var ab = await new Response(new Blob([input]).stream().pipeThrough(cs)).arrayBuffer();
    return new Uint8Array(ab);
  }

  async function gunzipJSON(bytes) {
    // bytes: Uint8Array / Buffer(node) / Firestore Bytes 已轉出的 Uint8Array
    var ds = new DecompressionStream('gzip');
    var ab = await new Response(new Blob([bytes]).stream().pipeThrough(ds)).arrayBuffer();
    return JSON.parse(new TextDecoder().decode(new Uint8Array(ab)));
  }

  // 偵測是否支援(舊瀏覽器 fallback 用)
  var SUPPORTED = (typeof CompressionStream !== 'undefined' && typeof DecompressionStream !== 'undefined');

  var api = { PROGRESS_BIG_KEYS: PROGRESS_BIG_KEYS, gzipBytes: gzipBytes, gunzipJSON: gunzipJSON, SUPPORTED: SUPPORTED };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.ProgressCodec = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
