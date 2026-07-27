// 從 Firestore 拉所有學習內容，設成 window globals。
// 網頁專用(iOS app 用打包 JSON,不讀這裡)。
//
// 內容儲存(2026-07 起分片,避免單 doc 撞 Firestore 1MiB 上限,並為英文/N4–N1 留空間):
//   content/manifest              → { version, shards:[{name,version}] }
//   content/shard_vocab_n5 … n1   → 各級單字
//   content/shard_grammar_n5 … n1 → 各級文法
//   content/shard_confusables / _listening_items / _reading_passages
//   content/master(相容整包)      → 舊路徑;manifest 讀不到時 fallback,可回滾
//
// 策略:
//   1) 模組載入時同步讀 localStorage 快取;有就立刻 set globals(重訪 0 等待)
//   2) 背景比對 version;不同就 refetch + 更新快取(不 reload,下次訪客拿到新版)
//   3) 沒快取 → ContentLoader.ready() 回 Promise,等 fetch
//
//   await ContentLoader.ready();  // 確保 VOCAB_N5..N1 / N5..N1 / CONFUSABLES /
//                                  // LISTENING_ITEMS / READING_PASSAGES 都已 set
window.ContentLoader = (function () {
  const PROJECT = 'jpnote-1bdd6';
  const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/content`;
  const MASTER_URL = `${BASE}/master`;
  const MANIFEST_URL = `${BASE}/manifest`;
  const CACHE_KEY = 'stayjp_content_v1';
  // 靜態內容檔(GitHub Pages / CDN,免費流量)。優先讀這個；讀不到才退回 Firestore(下方)。
  // 內容更新流程：跑 scripts/export-content-static.cjs 重新產生這兩個檔 → 部署。
  const STATIC_VERSION_URL = 'content-version.json';
  const STATIC_DATA_URL = 'content-data.json';

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

  // shard name → 放進 data 的哪裡
  function assignShard(data, name, payload) {
    if (name.indexOf('vocab_') === 0) { (data.vocab = data.vocab || {})[name.slice(6)] = payload; }
    else if (name.indexOf('grammar_') === 0) { (data.grammar = data.grammar || {})[name.slice(8)] = payload; }
    else { data[name] = payload; }
  }

  // 分片路徑:manifest → 並行抓各 shard → 合併成與舊 master 相同的 data 形狀
  async function fetchSharded() {
    const mr = await fetch(MANIFEST_URL);
    if (!mr.ok) throw new Error('manifest ' + mr.status);
    const mj = await mr.json();
    const payload = mj.fields && mj.fields.payload && mj.fields.payload.stringValue;
    if (!payload) throw new Error('manifest 缺 payload');
    const manifest = JSON.parse(payload);
    const version = (mj.fields.version && mj.fields.version.stringValue) || manifest.version;
    if (!manifest.shards || !manifest.shards.length) throw new Error('manifest 無 shards');
    const data = {};
    await Promise.all(manifest.shards.map(async (sh) => {
      const r = await fetch(`${BASE}/shard_${sh.name}`);
      if (!r.ok) throw new Error('shard ' + sh.name + ' ' + r.status);
      const j = await r.json();
      const p = j.fields && j.fields.payload && j.fields.payload.stringValue;
      if (!p) throw new Error('shard ' + sh.name + ' 缺 payload');
      assignShard(data, sh.name, JSON.parse(p));
    }));
    return { version, data };
  }

  // 舊整包路徑(fallback / 回滾)
  async function fetchMaster() {
    const r = await fetch(MASTER_URL);
    if (!r.ok) throw new Error('content fetch failed ' + r.status);
    const j = await r.json();
    const payload = j.fields && j.fields.payload && j.fields.payload.stringValue;
    const version = j.fields && j.fields.version && j.fields.version.stringValue;
    if (!payload) throw new Error('content/master payload 缺欄位');
    return { version, data: JSON.parse(payload) };
  }

  // ── 靜態檔(GitHub Pages / CDN,免費流量) ──
  async function fetchStaticVersion() {
    const r = await fetch(STATIC_VERSION_URL, { cache: 'no-cache' });
    if (!r.ok) throw new Error('static version ' + r.status);
    const j = await r.json();
    if (!j || !j.version) throw new Error('static version 缺 version');
    return j.version;
  }
  async function fetchStatic() {
    const version = await fetchStaticVersion();
    // URL 帶版本號:同版本 → CDN/瀏覽器/SW 快取命中(0 流量);版本一變 → URL 變 → 自動抓新檔
    const r = await fetch(STATIC_DATA_URL + '?v=' + encodeURIComponent(version));
    if (!r.ok) throw new Error('static data ' + r.status);
    const o = await r.json();
    if (!o || !o.data) throw new Error('static data 缺 data');
    return { version: o.version || version, data: o.data };
  }

  // 先試靜態檔(免費 CDN);失敗 → 退回 Firestore 分片 → 再退回整包(確保永不斷站)
  // window.__contentSrc 記錄實際來源(static / firestore-*),方便驗證與監控。
  async function fetchContent() {
    try { const r = await fetchStatic(); try { window.__contentSrc = 'static'; } catch (_) {} return r; }
    catch (e0) {
      try { const r = await fetchSharded(); try { window.__contentSrc = 'firestore-shard'; } catch (_) {} return r; }
      catch (e1) { const r = await fetchMaster(); try { window.__contentSrc = 'firestore-master'; } catch (_) {} return r; }
    }
  }

  async function fetchVersion() {
    // 先看靜態版本;讀不到再看 Firestore(manifest → master)
    try { return await fetchStaticVersion(); } catch (_) { /* 落到 Firestore */ }
    try {
      const r = await fetch(MANIFEST_URL + '?mask.fieldPaths=version');
      if (r.ok) { const j = await r.json(); const v = j.fields && j.fields.version && j.fields.version.stringValue; if (v) return v; }
    } catch (_) { /* 落到 master */ }
    try {
      const r = await fetch(MASTER_URL + '?mask.fieldPaths=version');
      if (!r.ok) return null;
      const j = await r.json();
      return (j.fields && j.fields.version && j.fields.version.stringValue) || null;
    } catch (_) { return null; }
  }
  function backgroundCheck(currentVersion) {
    fetchVersion().then(remoteV => {
      if (remoteV && remoteV !== currentVersion) {
        fetchContent().then(fresh => {
          saveCache(fresh.version, fresh.data);
          // 不立刻 reload,下次訪問拿到新版即可
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
      pendingLoad = fetchContent().then(fresh => {
        saveCache(fresh.version, fresh.data);
        setGlobals(fresh.data);
      });
    }
    return pendingLoad;
  }

  return { ready };
})();
