// 只讀:確認某些影片的字幕有沒有種進 yt_captions_cache,以及三語各幾句。
import { db } from './lib/fire-admin.mjs';
for (const v of process.argv.slice(2)) {
  const d = await db.collection('yt_captions_cache').doc(v).get();
  if (!d.exists) { console.log(`❌ ${v} 沒有快取`); continue; }
  const x = d.data(); const lines = x.lines || [];
  const zh = lines.filter(l => l.zh).length, en = lines.filter(l => l.en).length;
  console.log(`✅ ${v} 日文${String(lines.length).padStart(4)}句 中譯${String(zh).padStart(4)} 英譯${String(en).padStart(4)} | ${(x.title || '').slice(0, 28)}`);
}
process.exit(0);
