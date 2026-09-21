// YouTube 跟讀:從本機把影片字幕種進 Firestore 快取(yt_captions_cache)。
//
// 為什麼要本機跑:Cloud Functions 的 GCP 機房 IP 會被 YouTube 擋
// (回「ログインして bot ではないことを確認してください」),住宅 IP 不會。
// 種過一次就全站共用,之後線上函式讀快取即可。
//
// 順便解決「只有中文翻譯」:一次抓 ja 原文 + zh-Hant + en 三軌存進去,前端依語言挑。
//
// 用法:
//   node scripts/yt-seed.mjs probe  <id...>     只檢查(可嵌入/有無日文人工字幕/翻譯軌)
//   node scripts/yt-seed.mjs seed   <id...>     抓字幕並寫進快取
//   node scripts/yt-seed.mjs backfill           把快取裡所有影片補上英文翻譯
import { db } from './lib/fire-admin.mjs';

const KEY = 'AIzaSyA8eiZmM1FaDVjRy-df2KTyQ_vz_yYM39w';   // YouTube 網頁版公開 key(非機密)
const UA_ANDROID = 'com.google.android.youtube/20.10.38 (Linux; U; Android 11) gzip';
const COL = 'yt_captions_cache';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function player(videoId, client = 'ANDROID') {
  // ANDROID 端點拿字幕軌最穩;WEB 端點才有 microformat.playableInEmbed(能不能被嵌入)
  const ctx = client === 'WEB'
    ? { clientName: 'WEB', clientVersion: '2.20240101', hl: 'ja', gl: 'JP' }
    : { clientName: 'ANDROID', clientVersion: '20.10.38', androidSdkVersion: 30, hl: 'ja', gl: 'JP' };
  const r = await fetch(`https://www.youtube.com/youtubei/v1/player?key=${KEY}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'user-agent': client === 'WEB' ? 'Mozilla/5.0' : UA_ANDROID },
    body: JSON.stringify({ context: { client: ctx }, videoId }),
  });
  if (!r.ok) throw new Error('innertube_' + r.status);
  return r.json();
}

const unesc = (s) => String(s).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&quot;/g, '"');

// ⚠️ YouTube 對連續請求會回 429(Sorry...頁面),而且是整個 IP 層級。
// 抓快了會整批拿不到翻譯軌卻「成功」寫入空翻譯 → 一定要退避重試,失敗就別寫。
async function track(baseUrl, tlang, tries = 4) {
  let u = baseUrl + (baseUrl.includes('fmt=') ? '' : '&fmt=json3');
  if (tlang) u += '&tlang=' + tlang;
  let body = '', status = 0;
  for (let i = 0; i < tries; i++) {
    const r = await fetch(u, { headers: { 'user-agent': UA_ANDROID } });
    status = r.status; body = await r.text();
    if (r.ok && !body.startsWith('<html')) break;
    const wait = 20000 * (i + 1);
    console.log(`    (${tlang || 'ja'} HTTP ${status},等 ${wait / 1000}s 重試 ${i + 2}/${tries})`);
    await sleep(wait);
  }
  if (status !== 200 || body.startsWith('<html')) throw new Error('track_' + status);
  const out = [];
  if (body.trim().startsWith('{')) {
    for (const ev of (JSON.parse(body).events || [])) {
      const text = (ev.segs || []).map(s => s.utf8).join('').replace(/\n/g, ' ').trim();
      if (text) out.push({ t: ev.tStartMs || 0, d: ev.dDurationMs || 4000, text });
    }
  } else {
    // 兩種 XML 都要吃:timedtext format=3 是 <p t="毫秒" d="毫秒">,舊版是 <text start="秒" dur="秒">
    let m;
    const reP = /<p\s+t="(\d+)"(?:\s+d="(\d+)")?[^>]*>([\s\S]*?)<\/p>/g;
    while ((m = reP.exec(body))) {
      const text = unesc(m[3].replace(/<[^>]+>/g, '')).replace(/\s*\n\s*/g, ' ').trim();
      if (text) out.push({ t: +m[1], d: +(m[2] || 4000), text });
    }
    if (!out.length) {
      const reT = /<text start="([\d.]+)" dur="([\d.]+)"[^>]*>([\s\S]*?)<\/text>/g;
      while ((m = reT.exec(body))) {
        const text = unesc(m[3].replace(/<[^>]+>/g, '')).replace(/\n/g, ' ').trim();
        if (text) out.push({ t: Math.round(parseFloat(m[1]) * 1000), d: Math.round(parseFloat(m[2]) * 1000), text });
      }
    }
  }
  return out;
}

async function probe(v) {
  const p = await player(v);
  const ps = p.playabilityStatus || {}, vd = p.videoDetails || {};
  const tl = p.captions?.playerCaptionsTracklistRenderer || {};
  const tracks = tl.captionTracks || [];
  const ja = tracks.find(t => t.languageCode === 'ja' && t.kind !== 'asr') || tracks.find(t => (t.languageCode || '').startsWith('ja'));
  // 能不能嵌入:用官方 oembed 判斷(不給嵌入的影片會回 401/403/404),比 innertube 的欄位可靠
  let embeddable = null;
  try {
    const r = await fetch('https://www.youtube.com/oembed?format=json&url=' + encodeURIComponent('https://www.youtube.com/watch?v=' + v),
      { headers: { 'user-agent': 'Mozilla/5.0' } });
    embeddable = r.ok;
  } catch { embeddable = null; }
  return {
    v, status: ps.status, reason: (ps.reason || '').slice(0, 50),
    title: vd.title || '', author: vd.author || '', seconds: +(vd.lengthSeconds || 0),
    embeddable,
    ja: !!ja, manual: !!(ja && ja.kind !== 'asr'), jaTrack: ja || null,
    tlZh: (tl.translationLanguages || []).some(x => x.languageCode === 'zh-Hant'),
    tlEn: (tl.translationLanguages || []).some(x => x.languageCode === 'en'),
  };
}

async function seed(v) {
  const info = await probe(v);
  if (info.status !== 'OK') return { v, skip: 'unplayable:' + info.reason };
  if (info.embeddable === false) return { v, skip: 'not_embeddable' };
  if (!info.ja) return { v, skip: 'no_ja_track' };
  const lines = await track(info.jaTrack.baseUrl);
  if (lines.length < 5) return { v, skip: 'too_few_lines' };
  let zh = [], en = [];
  await sleep(12000);
  try { zh = await track(info.jaTrack.baseUrl, 'zh-Hant'); } catch (e) { console.log('    zh 失敗:', String(e.message || e)); }
  await sleep(12000);
  try { en = await track(info.jaTrack.baseUrl, 'en'); } catch { /* 同上 */ }
  const zhBy = new Map(zh.map(x => [x.t, x.text])), enBy = new Map(en.map(x => [x.t, x.text]));
  const data = {
    title: info.title, author: info.author, seconds: info.seconds,
    track: info.manual ? 'manual' : 'asr', lang: 'ja',
    lines: lines.slice(0, 600).map(l => ({ t: l.t, d: l.d, ja: l.text, zh: zhBy.get(l.t) || '', en: enBy.get(l.t) || '' })),
    seededAt: Date.now(),
  };
  await db.collection(COL).doc(v).set(data);
  return { v, ok: true, title: info.title.slice(0, 40), lines: data.lines.length,
           zh: data.lines.filter(x => x.zh).length, en: data.lines.filter(x => x.en).length, track: data.track };
}

const cmd = process.argv[2], ids = process.argv.slice(3);
if (cmd === 'probe') {
  for (const v of ids) {
    try { const i = await probe(v); console.log(JSON.stringify({ ...i, jaTrack: undefined })); }
    catch (e) { console.log(JSON.stringify({ v, err: String(e.message || e) })); }
    await sleep(300);
  }
} else if (cmd === 'seed') {
  for (const v of ids) {
    try { console.log(JSON.stringify(await seed(v), null, 0)); }
    catch (e) { console.log(JSON.stringify({ v, err: String(e.message || e) })); }
    await sleep(25000);
  }
} else if (cmd === 'backfill') {
  // 指定 id 就只補那幾支,不指定就掃整個快取
  const only = new Set(ids);
  const snap = await db.collection(COL).get();
  console.log('快取裡共', snap.size, '支', only.size ? `(只補指定的 ${only.size} 支)` : '');
  let done = 0, skip = 0;
  for (const d of snap.docs) {
    if (only.size && !only.has(d.id)) continue;
    const c = d.data();
    const L = c.lines || [];
    // 中文或英文任一缺就重抓 —— 限流時常常只拿到一種,只看英文會漏掉缺中文的
    if (L.some(x => x.zh) && L.some(x => x.en)) { skip++; continue; }
    if (c.track === 'user') { skip++; continue; }        // 使用者貼的逐字稿沒有官方翻譯軌
    try {
      const r = await seed(d.id);
      console.log(' ', d.id, JSON.stringify(r));
      if (r.ok) done++;
    } catch (e) { console.log(' ', d.id, 'err', String(e.message || e)); }
    await sleep(25000);
  }
  console.log('補完', done, '支,略過', skip, '支');
} else {
  console.log('用法:node scripts/yt-seed.mjs probe|seed <id...> | backfill');
}
process.exit(0);
