// 從 Firestore content/master 拉所有學習內容，設成 window globals。
// 同個 doc 既給網頁、也給 App（新做的）共用 — 改一個地方兩邊都吃到。
//
// 策略：
//   1) 模組載入時同步讀 localStorage 快取；有就立刻 set globals（重訪 0 等待）
//   2) 同時背景檢查 version；不同就 refetch + 更新快取（不 reload 頁面，下次訪客看到新版）
//   3) 沒快取 → ContentLoader.ready() 回 Promise，等 Firestore fetch
//
// 用法：
//   await ContentLoader.ready();  // 確保 VOCAB_N5..N1 / N5..N1 / CONFUSABLES /
//                                  // LISTENING_ITEMS / READING_PASSAGES 都已 set
window.ContentLoader = (function () {
  const PROJECT = 'jpnote-1bdd6';
  const DOC_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/content/master`;
  const CACHE_KEY = 'stayjp_content_v1';

  function setGlobals(data) {
    if (!data) return;
    if (data.vocab) {
      window.VOCAB_N5 = data.vocab.n5 || [];
      window.VOCAB_N4 = data.vocab.n4 || [];
      window.VOCAB_N3 = data.vocab.n3 || [];
      window.VOCAB_N2 = data.vocab.n2 || [];
      window.VOCAB_N1 = data.vocab.n1 || [];
    }
    if (data.grammar) {
      window.N5 = data.grammar.n5 || [];
      window.N4 = data.grammar.n4 || [];
      window.N3 = data.grammar.n3 || [];
      window.N2 = data.grammar.n2 || [];
      window.N1 = data.grammar.n1 || [];
    }
    if (data.confusables) window.CONFUSABLES = data.confusables;
    if (data.listening_items) window.LISTENING_ITEMS = data.listening_items;
    if (data.reading_passages) window.READING_PASSAGES = data.reading_passages;
  }
  function getCached() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const o = JSON.parse(raw);
      if (!o.version || !o.data) return null;
      return o;
    } catch (e) { return null; }
  }
  function saveCache(version, data) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ version, data })); } catch (e) {}
  }
  async function fetchMaster() {
    const r = await fetch(DOC_URL);
    if (!r.ok) throw new Error('content fetch failed ' + r.status);
    const j = await r.json();
    const payload = j.fields?.payload?.stringValue;
    const version = j.fields?.version?.stringValue;
    if (!payload) throw new Error('content/master payload 缺欄位');
    return { version, data: JSON.parse(payload) };
  }
  async function fetchVersion() {
    const r = await fetch(DOC_URL + '?mask.fieldPaths=version');
    if (!r.ok) return null;
    const j = await r.json();
    return j.fields?.version?.stringValue || null;
  }
  function backgroundCheck(currentVersion) {
    fetchVersion().then(remoteV => {
      if (remoteV && remoteV !== currentVersion) {
        fetchMaster().then(fresh => {
          saveCache(fresh.version, fresh.data);
          // 不立刻 reload，下次訪問拿到新版即可
        }).catch(() => {});
      }
    }).catch(() => {});
  }

  // 模組載入時同步嘗試快取
  const cached = getCached();
  if (cached) {
    setGlobals(cached.data);
    backgroundCheck(cached.version);
  }

  let pendingLoad = null;
  function ready() {
    if (typeof window.VOCAB_N5 !== 'undefined') return Promise.resolve();
    if (!pendingLoad) {
      pendingLoad = fetchMaster().then(fresh => {
        saveCache(fresh.version, fresh.data);
        setGlobals(fresh.data);
      });
    }
    return pendingLoad;
  }

  return { ready };
})();
