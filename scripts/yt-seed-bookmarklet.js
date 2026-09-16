// YouTube 字幕種進 StayJP 快取(給 Mia 在「自己平常登入的 Chrome」用;自動化瀏覽器/雲端 function 都被 YouTube 的 bot 牆擋,
// 只有真人瀏覽器抓 timedtext 會有內容)。
// 用法:
//   1. 在 Chrome 開任何一支「有日文字幕(非自動)」的 YouTube 影片頁 https://www.youtube.com/watch?v=XXXX
//   2. 開 DevTools Console(⌥⌘J),把下面整段貼上、Enter
//   3. 看到「seeded ✓」後,Console 會印一行 { v:'…', cat:'…', t:'…', tag:'…' } → 貼到 yt-shadow.html 的 SAMPLES 陣列,push 即上線
// 也可以存成書籤(bookmarklet):把整段前面加 javascript: 存成書籤網址,在影片頁點一下就跑。
(async () => {
  const pr = window.ytInitialPlayerResponse;
  const v = new URLSearchParams(location.search).get('v');
  const tracks = pr?.captions?.playerCaptionsTracklistRenderer?.captionTracks || [];
  const ja = tracks.find(t => t.languageCode === 'ja' && !t.kind) || tracks.find(t => t.languageCode === 'ja');
  if (!ja) { alert('這支影片沒有日文字幕軌'); return; }
  const r = await fetch(ja.baseUrl + '&fmt=json3');
  const txt = await r.text();
  if (!txt) { alert('字幕抓回來是空的(YouTube 擋了)。試試重新整理頁面、先把 CC 打開再跑一次。'); return; }
  const j = JSON.parse(txt);
  const lines = (j.events || []).filter(e => e.segs && e.tStartMs != null)
    .map(e => ({ t: e.tStartMs, d: e.dDurationMs || 4000, ja: e.segs.map(s => s.utf8).join('').replace(/\n/g, ' ').trim() }))
    .filter(l => l.ja && !/^\[.*\]$/.test(l.ja));
  // 合併太短的碎句(<1.2 秒且 <6 字)到前一句,練習卡才不會一句兩個字
  const merged = [];
  for (const l of lines) {
    const p = merged[merged.length - 1];
    if (p && (l.ja.length < 6 || l.d < 1200) && l.t - (p.t + p.d) < 400) { p.ja += l.ja; p.d = (l.t + l.d) - p.t; } else merged.push({ ...l });
  }
  const title = pr?.videoDetails?.title || document.title;
  const res = await fetch('https://asia-east1-jpnote-1bdd6.cloudfunctions.net/ytCaptionsSeed', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ v, title, lines: merged.slice(0, 600) }) });
  const out = await res.json();
  console.log('seeded', out, merged.length, 'lines');
  console.log(`    { v:'${v}', cat:'會話', t:'${title.replace(/'/g, '’').slice(0, 40)}', tag:'中日字幕' },`);
  alert('seeded ✓ ' + merged.length + ' 句(Console 有一行可貼到 SAMPLES)');
})();
