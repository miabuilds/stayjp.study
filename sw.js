const CACHE_NAME = 'stayjp-v153';
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

// Fetch: cache-first, fallback to network
self.addEventListener('fetch', e => {
  if (IS_LOCAL) return;                       // dev：放行，不走 SW
  if (e.request.method !== 'GET') return;      // 非 GET（付款 POST 等）不攔

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        // Safari 禁止 SW 回傳「帶 redirected 標記」的導航響應（cleanUrls 301 會觸發），
        // 重建一份乾淨響應再回傳，否則 Safari 報 "Response served by service worker has redirections"
        if (response.redirected) {
          return response.blob().then(body => new Response(body, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
          }));
        }
        // Cache successful GET responses for future use
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      });
    })
  );
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
