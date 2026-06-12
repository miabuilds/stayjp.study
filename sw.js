const CACHE_NAME = 'stayjp-v163';
const ASSETS = [
  './',
  './index.html',
  './home.html',
  './verbs.html',
  './contact.html',
  // vocab-n*.js / grammar-n*.js / confusables.js 移除：資料已搬 Firestore content/master，
  // 由 content-loader.js 取 + localStorage 快取
  './content-loader.js',
  './i18n.js',
  './tool-quota.js',
  './grammar-kanji-readings.js',
  './conjugate.js',
  './quiz.js',
  './srs.js',
  './stats.js',
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
  './account.html'
];

// Install: cache all assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// 客戶端發 SKIP_WAITING 訊息 → 立刻 activate
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

// 本地開發（localhost / 127.0.0.1）完全不攔截，交給瀏覽器直連，
// 避免舊 SW 劫持 emulator + cleanUrls 的 301 導致 Safari 白屏
const IS_LOCAL = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';

// Fetch:
//  - 程式碼(HTML / JS / CSS)→ network-first:一律拿最新,確保更新即時送達(不被舊快取卡住),
//    離線才回快取。修掉「改了 code 但回訪用戶還在跑舊快取」的問題。
//  - 靜態資源(圖片 / json / 字型等)→ cache-first:很少變,優先用快取求快。
function rebuildIfRedirected(response) {
  // Safari 禁止 SW 回傳「帶 redirected 標記」的導航響應(cleanUrls 301 會觸發),重建乾淨響應
  if (response && response.redirected) {
    return response.blob().then(body => new Response(body, {
      status: response.status, statusText: response.statusText, headers: response.headers
    }));
  }
  return response;
}
function cachePut(request, response) {
  if (response && response.status === 200 && !response.redirected) {
    const clone = response.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
  }
}
self.addEventListener('fetch', e => {
  if (IS_LOCAL) return;                       // dev：放行，不走 SW
  if (e.request.method !== 'GET') return;      // 非 GET（付款 POST 等）不攔

  const url = new URL(e.request.url);
  const isCode = e.request.mode === 'navigate'
    || url.pathname === '/'
    || /\.(?:html|js|css)$/i.test(url.pathname);

  if (isCode) {
    e.respondWith(
      fetch(e.request)
        .then(response => { cachePut(e.request, response); return rebuildIfRedirected(response); })
        .catch(() => caches.match(e.request))   // 離線 fallback
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request).then(response => {
        cachePut(e.request, response);
        return response;
      }))
    );
  }
});

// Activate: clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});
