// YouTube 字幕抓取(YouTube 跟讀功能用):
// - 前端只嵌入官方 IFrame 播放器(影片不重製不下載,合法);字幕軌用 InnerTube player API 取得
//   caption tracks,再抓 json3 格式逐句時間軸。中文翻譯用 YouTube 內建的 &tlang= 翻譯軌(免費)。
// - 無官方第三方字幕 API,此端點屬「非官方但業界通用」(Language Reactor 等同路線),YouTube 改版可能會斷,
//   斷了前端會 fallback「無字幕模式」;修這支即可,不影響站上其他功能。
// - 免登入(此功能依 YouTube 條款必須留在免費區),用 videoId 白名單格式 + 迷你記憶體快取擋濫用。
import * as functions from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

if (admin.apps.length === 0) admin.initializeApp();

const INNERTUBE_KEY = "AIzaSyA8eiZmM1FaDVjRy-df2KTyQ_vz_yYM39w";   // YouTube 網頁版公開 key(非機密,寫死在 youtube.com 前端)
const CACHE = new Map<string, { at: number; data: unknown }>();     // instance 內快取,15 分鐘
const CACHE_MS = 15 * 60 * 1000;

type CapTrack = { baseUrl: string; languageCode: string; kind?: string; name?: { runs?: { text: string }[] } };

async function innertubePlayer(videoId: string): Promise<any> {
  const r = await fetch(`https://www.youtube.com/youtubei/v1/player?key=${INNERTUBE_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "User-Agent": "com.google.android.youtube/20.10.38 (Linux; U; Android 11) gzip" },
    body: JSON.stringify({
      context: { client: { clientName: "ANDROID", clientVersion: "20.10.38", androidSdkVersion: 30, hl: "ja", gl: "JP" } },
      videoId,
    }),
  });
  if (!r.ok) throw new Error("innertube_" + r.status);
  return r.json();
}

// 字幕軌回應解析:ANDROID 端點就算帶 fmt=json3 也常回 XML(timedtext format=3),兩種都解。
type Line = { t: number; d: number; text: string };
const _unesc = (s: string) => s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;/g, "'").replace(/&quot;/g, '"');
function parseTrack(body: string): Line[] {
  const out: Line[] = [];
  const push = (t: number, d: number, text: string) => {
    text = text.replace(/\n/g, " ").trim();
    if (text && !/^[\[（(♪♫「」\]）)\s]*$/.test(text)) out.push({ t, d, text });
  };
  if (body.trim().startsWith("{")) {
    const j = JSON.parse(body);
    for (const ev of j?.events || []) {
      if (!ev.segs) continue;
      push(ev.tStartMs || 0, ev.dDurationMs || 0, ev.segs.map((s: any) => s.utf8 || "").join(""));
    }
  } else {
    const re = /<p\b([^>]*)>([\s\S]*?)<\/p>/g; let m: RegExpExecArray | null;
    while ((m = re.exec(body))) {
      const at = m[1];
      const t = +((at.match(/\bt="(\d+)"/) || [])[1] || 0);
      const d = +((at.match(/\bd="(\d+)"/) || [])[1] || 0);
      push(t, d, _unesc(m[2].replace(/<[^>]+>/g, "")));
    }
  }
  return out;
}

async function fetchTrack(baseUrl: string, tlang?: string): Promise<Line[]> {
  let u = baseUrl + (baseUrl.includes("fmt=") ? "" : "&fmt=json3");   // tlang 需要 fmt 參數在場才生效(實測)
  if (tlang) u += "&tlang=" + tlang;
  const r = await fetch(u, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!r.ok) throw new Error("track_" + r.status);
  return parseTrack(await r.text());
}

export const ytCaptions = functions.onRequest(
  { cors: true, region: "asia-east1", memory: "256MiB", timeoutSeconds: 30 },
  async (req, res) => {
    try {
      if (req.method !== "POST") { res.status(405).json({ error: "method_not_allowed" }); return; }
      const v = String((req.body || {}).v || "");
      if (!/^[A-Za-z0-9_-]{11}$/.test(v)) { res.status(400).json({ error: "bad_video_id" }); return; }

      const hit = CACHE.get(v);
      if (hit && Date.now() - hit.at < CACHE_MS) { res.json(hit.data); return; }

      // Firestore 快取:GCP 機房 IP 常被 YouTube 擋,任何一次成功抓取(或本機種入)都全站共用
      try {
        const doc = await admin.firestore().collection("yt_captions_cache").doc(v).get();
        if (doc.exists) {
          const c = doc.data() as any;
          if (c && Array.isArray(c.lines) && c.lines.length) {
            CACHE.set(v, { at: Date.now(), data: c });
            res.json(c); return;
          }
        }
      } catch (e) { /* 快取失敗照走即時抓 */ }

      const p = await innertubePlayer(v);
      const status = p?.playabilityStatus?.status;
      if (status && status !== "OK") { res.json({ error: "unplayable", reason: p?.playabilityStatus?.reason || status }); return; }

      const vd = p?.videoDetails || {};
      const tracks: CapTrack[] = p?.captions?.playerCaptionsTracklistRenderer?.captionTracks || [];
      if (!tracks.length) { res.json({ error: "no_captions", title: vd.title || "", author: vd.author || "" }); return; }

      // 選字幕軌:日文人工 > 日文自動(asr) > 第一軌
      const ja = tracks.find(t => t.languageCode === "ja" && t.kind !== "asr")
        || tracks.find(t => t.languageCode === "ja")
        || tracks[0];
      const lines = await fetchTrack(ja.baseUrl);
      if (!lines.length) { res.json({ error: "no_captions", title: vd.title || "", author: vd.author || "" }); return; }

      // 中文翻譯軌(YouTube 自動翻譯;偶爾不可用就略過,前端照常運作)
      let zh: { t: number; text: string }[] = [];
      try { zh = (await fetchTrack(ja.baseUrl, "zh-Hant")).map(x => ({ t: x.t, text: x.text })); } catch (e) { /* 無翻譯軌:不影響主功能 */ }
      const zhByT = new Map(zh.map(x => [x.t, x.text]));

      const data = {
        title: vd.title || "",
        author: vd.author || "",
        seconds: parseInt(vd.lengthSeconds || "0", 10) || 0,
        track: ja.kind === "asr" ? "asr" : "manual",
        lang: ja.languageCode,
        lines: lines.slice(0, 600).map(l => ({ t: l.t, d: l.d, ja: l.text, zh: zhByT.get(l.t) || "" })),
      };
      CACHE.set(v, { at: Date.now(), data });
      try { await admin.firestore().collection("yt_captions_cache").doc(v).set(data); } catch (e) { /* 寫不進快取不影響回應 */ }
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: "fetch_failed", message: String(e?.message || e) });
    }
  }
);
