// YouTube 跟讀:種字幕——優先抓「頻道自帶」的中文/英文人工字幕軌(zh-TW/zh-Hant/zh/en),
// 不走 tlang 自動翻譯(2026-10-02 實測:tlang 翻譯軌連續 429 數十分鐘,原軌照樣 200)。
// 翻譯句子跟日文句子用「開始時間最近、差 ≤2s」配對。寫入前跟現有快取合併(保留 tk / 舊翻譯)。
// 用法:node scripts/yt-seed-own.mjs <id...>
import { db } from './lib/fire-admin.mjs';
const KEY = 'AIzaSyA8eiZmM1FaDVjRy-df2KTyQ_vz_yYM39w';
const UA = 'com.google.android.youtube/20.10.38 (Linux; U; Android 11) gzip';
const COL = 'yt_captions_cache';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const unesc = s => String(s).replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#39;/g,"'").replace(/&quot;/g,'"');
async function player(videoId) {
  const r = await fetch(`https://www.youtube.com/youtubei/v1/player?key=${KEY}`, { method:'POST', headers:{'content-type':'application/json','user-agent':UA},
    body: JSON.stringify({ context:{ client:{ clientName:'ANDROID', clientVersion:'20.10.38', androidSdkVersion:30, hl:'ja', gl:'JP' } }, videoId }) });
  if (!r.ok) throw new Error('innertube_' + r.status); return r.json();
}
async function track(baseUrl) {
  const u = baseUrl + (baseUrl.includes('fmt=') ? '' : '&fmt=json3');
  const r = await fetch(u, { headers:{'user-agent':UA}, signal: AbortSignal.timeout(20000) });
  const body = await r.text();
  if (!r.ok || body.startsWith('<html')) throw new Error('track_' + r.status);
  const out = [];
  if (body.trim().startsWith('{')) {
    for (const ev of (JSON.parse(body).events || [])) { const text=(ev.segs||[]).map(s=>s.utf8).join('').replace(/\n/g,' ').trim(); if (text) out.push({ t: ev.tStartMs||0, d: ev.dDurationMs||4000, text }); }
  } else {
    let m; const reP=/<p\s+t="(\d+)"(?:\s+d="(\d+)")?[^>]*>([\s\S]*?)<\/p>/g;
    while ((m=reP.exec(body))) { const text=unesc(m[3].replace(/<[^>]+>/g,'')).replace(/\s*\n\s*/g,' ').trim(); if (text) out.push({ t:+m[1], d:+(m[2]||4000), text }); }
  }
  return out;
}
function nearest(list) { // 回傳 fn(t) → 最近 ±2s 的句子
  const sorted = [...list].sort((a,b)=>a.t-b.t);
  return t => { let best=null, bd=2001; for (const x of sorted) { const d=Math.abs(x.t-t); if (d<bd) { bd=d; best=x; } if (x.t>t+2000) break; } return best ? best.text : ''; };
}
for (const v of process.argv.slice(2)) {
  try {
    const p = await player(v); const vd = p.videoDetails||{}; const tl = p.captions?.playerCaptionsTracklistRenderer||{}; const tracks = tl.captionTracks||[];
    const ja = tracks.find(t=>t.languageCode==='ja'&&t.kind!=='asr'); if (!ja) { console.log(JSON.stringify({ v, skip:'no_manual_ja' })); continue; }
    const zhT = tracks.find(t=>/^zh(-TW|-Hant)?$/.test(t.languageCode)&&t.kind!=='asr') || tracks.find(t=>/^zh/.test(t.languageCode)&&t.kind!=='asr');
    const enT = tracks.find(t=>t.languageCode==='en'&&t.kind!=='asr');
    const lines = await track(ja.baseUrl); await sleep(6000);
    let zh=[], en=[];
    if (zhT) { try { zh = await track(zhT.baseUrl); } catch(e) { console.log('   zh', e.message); } await sleep(6000); }
    if (enT) { try { en = await track(enT.baseUrl); } catch(e) { console.log('   en', e.message); } await sleep(6000); }
    const nz = nearest(zh), ne = nearest(en);
    const prev = (await db.collection(COL).doc(v).get()).data() || {};
    const prevBy = new Map((prev.lines||[]).map(l=>[l.t,l]));
    const merged = lines.slice(0,600).map(l => { const old=prevBy.get(l.t)||{}; const row={ t:l.t, d:l.d, ja:l.text, zh: nz(l.t)||old.zh||'', en: ne(l.t)||old.en||'' }; if (old.tk && old.ja===l.text) row.tk=old.tk; return row; });
    const data = { title: vd.title||'', author: vd.author||'', seconds:+(vd.lengthSeconds||0), track:'manual', lang:'ja', lines: merged, seededAt: Date.now(), zhSrc: zhT ? zhT.languageCode : '', enSrc: enT ? 'en' : '' };
    await db.collection(COL).doc(v).set(data);
    console.log(JSON.stringify({ v, ok:true, title:(vd.title||'').slice(0,40), lines: merged.length, zh: merged.filter(x=>x.zh).length, en: merged.filter(x=>x.en).length, zhSrc: data.zhSrc }));
  } catch (e) { console.log(JSON.stringify({ v, error: String(e.message||e) })); }
  await sleep(8000);
}
process.exit(0);
