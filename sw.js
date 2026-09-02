// ⚠️ 白屏修正(2026-08-31,用戶回報 Android/iOS 偶發白屏、重開也一樣、後來自己好)
//
// 舊版根因:程式碼走 network-first,離線 fallback 寫成
//     .catch(() => caches.match(e.request))
//   caches.match() 找不到時回 undefined → e.respondWith(undefined) 依規範等於 NetworkError
//   → WebView 一片白、沒有任何錯誤訊息。
//
//   而且觸發條件很容易湊齊:
//     ① speak.html / speak-chat.html / auth-header.js / native-ui.js 這些常用檔
//        本來不在預快取清單裡(46 個檔沒進來)
//     ② activate 會把「非當前版本」的快取全刪 → 每次 sw 版號一 bump,
//        那些只靠 runtime 快取的檔案就被清空(2026-08-31 一天內 bump 了 4 次)
//     ③ GitHub Pages 部署中或網路瞬斷 → fetch 失敗 → 快取又沒有 → 白屏
//     ④ App 會記住 last_url,冷啟直接回同一頁 → 重開還是白(「重開也一樣」)
//     ⑤ 部署完成/網路恢復 → 正常(「後來自己好了」)
//
// 這版的修法:
//   1. 絕不讓 respondWith 拿到 undefined —— 導航沒快取就回離線頁,子資源回 Response.error()
//   2. runtime 快取獨立、不隨版號刪除 → 版號 bump 不會把救命網清空
//   3. 預快取改逐檔 add + catch —— 單一檔案 404 不再讓整個 SW 裝不起來
//   4. 常用頁面/腳本補進預快取清單

const VERSION = 'v385';
const PRECACHE = 'stayjp-' + VERSION;   // 版本化:更新時重新預快取
const RUNTIME = 'stayjp-runtime';       // 不隨版號刪除:瞬斷/離線時的救命網
const CACHE_NAME = PRECACHE;            // 舊名稱保留,避免別處有引用

const ASSETS = [
  './',
  './index.html',
  './app.html',
  './home.html',
  './verbs.html',
  './conjunctions.html',
  './essentials.html',
  './jlpt-drill.html',
  './jlpt-questions.js',
  './jlpt-q-trans.js',
  './jlpt-questions-gen.js',
  './contact.html',
  // vocab-n*.js / grammar-n*.js / confusables.js 移除：資料已搬 Firestore content/master，
  // 由 content-loader.js 取 + localStorage 快取
  './content-loader.js',
  './progress-codec.js',
  './i18n.js',
  './ui-map.js',
  './translate-layer.js',
  './tool-quota.js',
  './tour.js',
  './grammar-kanji-readings.js',
  './ux-extras.js',
  './font-scale.js',
  './back-to-top.js',
  './article-tokens.js',
  './article-dict.js',
  './article-timings.js',
  './conjugate.js',
  './quiz.js',
  './srs.js',
  './stats.js',
  './grammar-glossary.js',
  './grammar-drill.js',
  './virtual-list.js',
  './calendar.js',
  './mock-exam.js',
  './reading.js',
  './listening.js',
  './flashcard.js',
  './stayjpplan.png',
  './stayjpplan-192.png',
  './manifest.json',
  './pricing.html',
  './terms.html',
  './privacy.html',
  './refund.html',
  './account.html',
  // ── 2026-08-31 補：這些是白屏最常發生的頁面/腳本，之前只靠 runtime 快取 ──
  './speak.html',            // AI 口說練習
  './speak-chat.html',       // AI 情境對話
  './phrases.html',
  './jlpt.html',
  './dashboard.html',
  './about.html',
  './howto.html',
  './onboarding-v2.html',
  './auth-header.js',        // 每頁都載，掛掉整頁等於半殘
  './native-ui.js',          // App 內隱藏網頁專屬入口，掛掉會露出下載鈕
  './articles-ui.js',
  './fav-sents.js',
  './article-dict-tts.js',
  './speak-ruby.js',
  './tts-config.js',
  './counter.js',
  './bilingual-sync.js',
  './kana.js',
  './kana-ui.js',
  './kana-strokes.js',
];

// 離線且該網址沒有任何快取時回這頁 —— 重點是「絕對不要回 undefined」。
// 純內嵌、零外部資源，深淺色自適應。
const OFFLINE_HTML = `<!doctype html><html lang="zh-Hant"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>連線中斷 — 日本再留計劃</title><style>
:root{color-scheme:light dark}
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
 background:#FAF5EC;color:#17202E;font:16px/1.7 -apple-system,BlinkMacSystemFont,"Noto Sans TC",sans-serif;
 padding:24px;text-align:center}
@media (prefers-color-scheme:dark){body{background:#121316;color:#ECECEC}}
.w{max-width:340px}
h1{font-size:20px;margin:0 0 10px}
p{margin:0 0 22px;opacity:.75;font-size:15px}
button{font:600 16px/1 inherit;padding:14px 30px;border:0;border-radius:999px;
 background:#C8452F;color:#fff;cursor:pointer}
button:active{transform:scale(.97)}
small{display:block;margin-top:18px;opacity:.5;font-size:13px}
</style></head><body><div class="w">
<h1>連線中斷了</h1>
<p>這一頁還沒存到離線快取，需要網路才能開。<br>網路回來後按下面重試就好。</p>
<button onclick="location.reload()">重新載入</button>
<small>日本再留計劃</small>
</div></body></html>`;

function offlineResponse() {
  return new Response(OFFLINE_HTML, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

// Install: 逐檔快取。用 add().catch() 而非 addAll() —— addAll 是全有全無,
// 清單裡任何一個檔 404(改名/手誤)就會讓整個 SW 裝不起來、離線能力全失。
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(PRECACHE)
      .then((cache) => Promise.all(
        ASSETS.map((u) => cache.add(u).catch(() => {
          console.warn('[sw] 預快取略過(抓不到):', u);
        })),
      ))
      .then(() => self.skipWaiting()),
  );
});

// 客戶端發 SKIP_WAITING 訊息 → 立刻 activate
self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

// 本地開發（localhost / 127.0.0.1）完全不攔截，交給瀏覽器直連，
// 避免舊 SW 劫持 emulator + cleanUrls 的 301 導致 Safari 白屏
const IS_LOCAL = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';

function rebuildIfRedirected(response) {
  // Safari 禁止 SW 回傳「帶 redirected 標記」的導航響應(cleanUrls 301 會觸發),重建乾淨響應
  if (response && response.redirected) {
    return response.blob().then((body) => new Response(body, {
      status: response.status, statusText: response.statusText, headers: response.headers,
    }));
  }
  return response;
}

function cachePut(request, response) {
  if (response && response.status === 200 && !response.redirected) {
    const clone = response.clone();
    caches.open(RUNTIME).then((cache) => cache.put(request, clone));
  }
}

// 找快取的最後手段。回傳值一定是 Response —— 這是白屏修正的核心。
function fallback(request) {
  return caches.match(request)
    .then((hit) => hit || caches.match(request, { ignoreSearch: true }))
    .then((hit) => {
      if (hit) return hit;
      // 導航請求沒快取 → 給看得懂的離線頁,而不是一片白
      if (request.mode === 'navigate') return offlineResponse();
      // 子資源 → 明確的錯誤響應(不是 undefined),讓頁面自己的 onerror 能處理
      return Response.error();
    })
    .catch(() => (request.mode === 'navigate' ? offlineResponse() : Response.error()));
}

// Fetch:
//  - 程式碼(HTML / JS / CSS)→ network-first:一律拿最新,確保更新即時送達,離線才回快取。
//  - 靜態資源(圖片 / json / 字型等)→ cache-first:很少變,優先用快取求快。
self.addEventListener('fetch', (e) => {
  if (IS_LOCAL) return;                        // dev：放行，不走 SW
  if (e.request.method !== 'GET') return;      // 非 GET（付款 POST 等）不攔

  const url = new URL(e.request.url);
  const isCode = e.request.mode === 'navigate'
    || url.pathname === '/'
    || /\.(?:html|js|css)$/i.test(url.pathname);

  if (isCode) {
    // cache:'reload' → 強制走網路、繞過瀏覽器自身的 HTTP 快取,避免抓到舊的(甚至是頁面還沒上線前的 404)版本。
    // network-first 本來就要最新;離線時 catch 仍回 SW 快取的 fallback,不影響離線能力。
    e.respondWith(
      fetch(e.request, { cache: 'reload' })
        .then((response) => { cachePut(e.request, response); return rebuildIfRedirected(response); })
        .catch(() => fetch(e.request).then((r) => { cachePut(e.request, r); return rebuildIfRedirected(r); }))
        .catch(() => fallback(e.request)),
    );
  } else {
    e.respondWith(
      caches.match(e.request)
        .then((cached) => cached || fetch(e.request)
          .then((response) => { cachePut(e.request, response); return response; })
          .catch(() => fallback(e.request))),
    );
  }
});

// Activate: 清掉舊版本的預快取,但保留 RUNTIME —— 舊版會連 runtime 一起刪,
// 導致每次 sw 版號 bump 都把「只靠 runtime 快取」的頁面清空(白屏的幫兇之一)。
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k !== PRECACHE && k !== RUNTIME).map((k) => caches.delete(k)),
    )).then(() => self.clients.claim()),
  );
});
