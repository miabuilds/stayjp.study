// StayJP 靜態站的 Worker。
// 一般檔案（HTML/JS/圖片）由 Cloudflare 直接回，不經過這裡、不計費。這支只處理兩件事：
//  1. 影音檔的「分段讀取」(Range → 206)：Cloudflare 靜態資產本身不支援，iPhone 播音檔/影片需要。
//  2. 找不到檔案時補位，讓行為跟原本 GitHub Pages 一致：/ 與 /dir/ 回 index.html、/foo 回 foo.html、其餘 404。
const MEDIA = /\.(mp3|mp4|m4a|webm|wav|ogg|mov)$/i;

async function serveMedia(request, env) {
  const range = request.headers.get("Range");
  const res = await env.ASSETS.fetch(new Request(request.url, { method: request.method === "HEAD" ? "HEAD" : "GET", headers: stripRange(request.headers) }));
  if (res.status !== 200) return res;
  const headers = new Headers(res.headers);
  headers.set("Accept-Ranges", "bytes");
  if (!range || request.method === "HEAD") return new Response(res.body, { status: 200, headers });
  const m = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
  if (!m || (m[1] === "" && m[2] === "")) return new Response(res.body, { status: 200, headers });
  const buf = await res.arrayBuffer();
  const size = buf.byteLength;
  let start, end;
  if (m[1] === "") { start = Math.max(0, size - Number(m[2])); end = size - 1; }
  else { start = Number(m[1]); end = m[2] === "" ? size - 1 : Math.min(Number(m[2]), size - 1); }
  if (start >= size || start > end) {
    return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}`, "Accept-Ranges": "bytes" } });
  }
  headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
  headers.set("Content-Length", String(end - start + 1));
  return new Response(buf.slice(start, end + 1), { status: 206, headers });
}
function stripRange(h) { const o = new Headers(h); o.delete("Range"); o.delete("If-Range"); return o; }

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method !== "GET" && request.method !== "HEAD") return new Response("Method Not Allowed", { status: 405 });
    const p = url.pathname;
    if (MEDIA.test(p)) return serveMedia(request, env);
    const tryAsset = async (path) => {
      const u = new URL(url); u.pathname = path;
      const r = await env.ASSETS.fetch(new Request(u, request));
      return r.status === 404 ? null : r;
    };
    let r = null;
    if (p.endsWith("/")) r = await tryAsset(p + "index.html");
    else if (!/\.[A-Za-z0-9]+$/.test(p)) {
      r = await tryAsset(p + ".html");
      if (!r && (await tryAsset(p + "/index.html"))) return Response.redirect(url.origin + p + "/" + url.search, 301);
    } else r = await tryAsset(p);
    return r || new Response("404 Not Found", { status: 404, headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });
  },
};
