// stayjp-app/src/lib/content.ts
// 從 Firestore content/master 拉學習內容（vocab/grammar/listening/reading/confusables）
// 跟 stayjp.study web 端共用同一個 doc — 改 Firestore 一處兩邊同步。
//
// 策略：
//   1) cold start: MMKV 有快取就同步 set in-memory state（0 等待）
//   2) 同時背景 fetch version、不同就 refetch + 更新 MMKV（不立刻 reload UI，下次冷啟拿到）
//   3) 完全沒快取 → ContentRepo.ready() Promise 等 Firestore fetch
//
// 用法：
//   import { ContentRepo } from '@/lib/content';
//   await ContentRepo.ready();
//   const n5Words = ContentRepo.getVocab('n5');

import { MMKV } from 'react-native-mmkv';

const PROJECT = 'jpnote-1bdd6';
const DOC_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/content/master`;
const CACHE_KEY = 'stayjp_content_v1';

// ───────── types ─────────

export type Level = 'n5' | 'n4' | 'n3' | 'n2' | 'n1';

export interface VocabItem {
  w: string;   // 漢字 / 表記
  r: string;   // 假名
  m: string;   // 中譯
  c: '名' | '動' | 'い形' | 'な形' | '副' | string;
}

export interface GrammarExample { j: string; z: string; }
export interface GrammarItem {
  id: string;
  cat: string;
  t: string;   // 文法名
  p: string;   // 接續格式
  ex: string;  // 解說
  eg: GrammarExample[];
}

export interface ListeningItem {
  id: string;
  level: Level;
  type: string;
  speed: number;
  script: string;
  q: string;
  options: string[];
  correct: number;
}

export interface ReadingQuestion {
  q: string;
  options: string[];
  correct: number;
  explanation: string;
}
export interface ReadingPassage {
  id: string;
  level: Level;
  type: string;
  title: string;
  passage: string;
  questions: ReadingQuestion[];
}

export interface ConfusableEntry {
  title: string;
  level: string;
  tip?: string;
  words: { w: string; m: string; ex?: string }[];
  eg?: { j: string; z: string }[];
}

export interface ContentBundle {
  vocab: Record<Level, VocabItem[]>;
  grammar: Record<Level, GrammarItem[]>;
  listening_items: ListeningItem[];
  reading_passages: ReadingPassage[];
  confusables: ConfusableEntry[];
}

interface CachedShape {
  version: string;
  data: ContentBundle;
}

// ───────── storage ─────────

const storage = new MMKV({ id: 'stayjp-content' });

function getCached(): CachedShape | null {
  try {
    const raw = storage.getString(CACHE_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as CachedShape;
    if (!o.version || !o.data) return null;
    return o;
  } catch {
    return null;
  }
}

function saveCache(version: string, data: ContentBundle) {
  try {
    storage.set(CACHE_KEY, JSON.stringify({ version, data }));
  } catch {
    // quota? swallow
  }
}

// ───────── fetch ─────────

async function fetchMaster(): Promise<CachedShape> {
  const r = await fetch(DOC_URL);
  if (!r.ok) throw new Error(`content fetch ${r.status}`);
  const j = await r.json();
  const payload = j.fields?.payload?.stringValue;
  const version = j.fields?.version?.stringValue;
  if (!payload) throw new Error('content/master payload 缺欄位');
  return { version, data: JSON.parse(payload) as ContentBundle };
}

async function fetchVersion(): Promise<string | null> {
  try {
    const r = await fetch(`${DOC_URL}?mask.fieldPaths=version`);
    if (!r.ok) return null;
    const j = await r.json();
    return j.fields?.version?.stringValue || null;
  } catch {
    return null;
  }
}

// ───────── module state ─────────

let bundle: ContentBundle | null = null;
let pendingLoad: Promise<void> | null = null;

function backgroundCheck(currentVersion: string) {
  fetchVersion().then((remoteV) => {
    if (remoteV && remoteV !== currentVersion) {
      fetchMaster()
        .then((fresh) => {
          saveCache(fresh.version, fresh.data);
          // 不立刻替換 in-memory bundle — 避免渲染中途資料變動。下次冷啟拿到新版
        })
        .catch(() => {});
    }
  });
}

// 模組載入時嘗試從 MMKV 同步 hydrate
(function bootstrap() {
  const cached = getCached();
  if (cached) {
    bundle = cached.data;
    backgroundCheck(cached.version);
  }
})();

// ───────── public API ─────────

export const ContentRepo = {
  ready(): Promise<void> {
    if (bundle) return Promise.resolve();
    if (!pendingLoad) {
      pendingLoad = fetchMaster().then((fresh) => {
        saveCache(fresh.version, fresh.data);
        bundle = fresh.data;
      });
    }
    return pendingLoad;
  },

  isReady(): boolean {
    return bundle !== null;
  },

  getVocab(level: Level): VocabItem[] {
    return bundle?.vocab?.[level] ?? [];
  },

  getGrammar(level: Level): GrammarItem[] {
    return bundle?.grammar?.[level] ?? [];
  },

  getListening(): ListeningItem[] {
    return bundle?.listening_items ?? [];
  },

  getListeningByLevel(level: Level): ListeningItem[] {
    return (bundle?.listening_items ?? []).filter((i) => i.level === level);
  },

  getReading(): ReadingPassage[] {
    return bundle?.reading_passages ?? [];
  },

  getReadingByLevel(level: Level): ReadingPassage[] {
    return (bundle?.reading_passages ?? []).filter((p) => p.level === level);
  },

  getConfusables(): ConfusableEntry[] {
    return bundle?.confusables ?? [];
  },

  /** 強制重抓，繞過 MMKV 快取（debug 用） */
  async forceRefresh(): Promise<void> {
    const fresh = await fetchMaster();
    saveCache(fresh.version, fresh.data);
    bundle = fresh.data;
  },
};
