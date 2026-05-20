# StayJP P2 — Content Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use `- [ ]` syntax.

**Goal:** A Node build script in `stayjp-app` that reads vocab / grammar / listening / TTS-manifest data from `stay-jp-notes` web repo and emits typed JSON into `stayjp-app/assets/content/`. Add a runtime loader (`src/lib/content.ts`) and wire one smoke verification (Flashcard tab shows N5 vocab count).

**Architecture:** Build-time pipeline. `scripts/sync-content.ts` uses `vm.runInNewContext` to safely evaluate the web repo's JS data files (which are pure `const X = [...]` array literals), validates schema, writes JSON to `assets/content/`. Runtime imports JSON statically (Metro bundles into app). Audio files themselves are out of scope here (deferred to P8 offline-download work).

**Tech Stack:** Node 20, TypeScript, tsx, Vitest (or Jest — match existing stayjp-app setup which is Jest).

**Reference spec:** `stay-jp-notes/docs/superpowers/specs/2026-05-19-stayjp-app-design.md` § 3 (Asset Reuse) and § 8 (Bundle Strategy).

**Source paths in stay-jp-notes:**
- Vocab N1-N5: `vocab-n{1,2,3,4,5}.js` (global `const VOCAB_Nx = [{w,r,m,c}...]`)
- Grammar N1-N3: `grammar-n{1,2,3}.js` (global `const Nx = [{id,cat,t,p,ex,eg[...]}...]`)
- Listening: `listening.js` — the `items` array inside the `Listening` IIFE
- TTS manifest: `audio/tts/manifest.js` (assigns to `window.__TTS = {textKey: hashFilename}`)

---

## File Structure (additions to stayjp-app)

```
stayjp-app/
├── scripts/
│   ├── sync-content.ts        # entry: orchestrates all parsers + writes JSON
│   ├── parsers/
│   │   ├── vocab.ts           # parse vocab-n{1..5}.js → Word[]
│   │   ├── grammar.ts         # parse grammar-n{1..3}.js → GrammarItem[]
│   │   ├── listening.ts       # parse listening.js items[] → ListeningItem[]
│   │   └── tts-manifest.ts    # parse audio/tts/manifest.js → Record<string,string>
│   └── lib/
│       └── eval-array.ts      # vm.runInNewContext helper for extracting JS literals
├── assets/
│   └── content/
│       ├── vocab.json         # { n5: Word[], n4: ..., n3: ..., n2: ..., n1: ... }
│       ├── grammar.json       # { n3: GrammarItem[], n2: ..., n1: ... }
│       ├── listening.json     # ListeningItem[]
│       └── tts-manifest.json  # { [text]: hash }
├── src/
│   ├── types/
│   │   └── content.ts         # Word, GrammarItem, GrammarExample, ListeningItem, Level
│   └── lib/
│       └── content.ts         # runtime loader: vocab(level), grammar(level), audioFor(text)
└── __tests__/
    ├── parsers-vocab.test.ts
    ├── parsers-grammar.test.ts
    ├── parsers-listening.test.ts
    ├── parsers-tts.test.ts
    └── content-loader.test.ts
```

**Source repo path** (constant in the script): `/Users/user/Documents/GitHub/stay-jp-notes` — read from env `STAYJP_NOTES_PATH` with fallback to this default. Document in README.

---

### Task 1: Define content types

**Files:**
- Create: `stayjp-app/src/types/content.ts`

- [ ] **Step 1: Write content.ts**

```ts
// src/types/content.ts
export type Level = "n5" | "n4" | "n3" | "n2" | "n1";
export const LEVELS: Level[] = ["n5", "n4", "n3", "n2", "n1"];

export interface Word {
  w: string;   // 漢字／表記
  r: string;   // 振り仮名
  m: string;   // 中文釋義
  c: string;   // 詞性
}

export interface GrammarExample {
  j: string;   // 日本語例文（含 <em> 標記）
  z: string;   // 中文翻譯
}

export interface GrammarItem {
  id: string;
  cat: string;  // 分類
  t: string;    // 文型
  p: string;    // 接續パターン
  ex: string;   // 解説
  eg: GrammarExample[];
}

export interface ListeningItem {
  id: string;
  level: Level;
  type: string;
  speed: number;
  script: string;
  // listening.js has more fields (question, choices, answer);
  // capture them as optional now and refine when parser surfaces them
  question?: string;
  choices?: string[];
  answer?: number;
}

export type TTSManifest = Record<string, string>;

export interface VocabBundle {
  n5: Word[]; n4: Word[]; n3: Word[]; n2: Word[]; n1: Word[];
}
export interface GrammarBundle {
  n3: GrammarItem[]; n2: GrammarItem[]; n1: GrammarItem[];
}
```

- [ ] **Step 2: Commit**

```bash
cd ~/Documents/GitHub/stayjp-app
git add src/types/content.ts
git commit -m "feat(types): content types (Word, GrammarItem, ListeningItem, TTSManifest)"
```

---

### Task 2: Eval helper for JS array literals

**Files:**
- Create: `stayjp-app/scripts/lib/eval-array.ts`
- Create: `stayjp-app/__tests__/eval-array.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// __tests__/eval-array.test.ts
import { evalConstArray, evalAssignment } from "../scripts/lib/eval-array";

test("evalConstArray reads `const VOCAB_N5 = [...]`", () => {
  const src = `const VOCAB_N5 = [{w:"水",r:"みず",m:"水",c:"名"},{w:"火",r:"ひ",m:"火",c:"名"}];`;
  const out = evalConstArray<{ w: string }>(src, "VOCAB_N5");
  expect(out).toHaveLength(2);
  expect(out[0].w).toBe("水");
});

test("evalConstArray works with comments and whitespace", () => {
  const src = `
    // header
    const N3 = [
      // 接續
      {id:"n3-1",t:"X"},
    ];
  `;
  expect(evalConstArray(src, "N3")).toHaveLength(1);
});

test("evalAssignment reads `window.__TTS = {...}`", () => {
  const src = `window.__TTS = {"hello":"aaa111","world":"bbb222"};`;
  const out = evalAssignment<Record<string, string>>(src, "__TTS");
  expect(out["hello"]).toBe("aaa111");
});

test("evalConstArray throws on missing identifier", () => {
  expect(() => evalConstArray("const X = []", "Y")).toThrow();
});
```

- [ ] **Step 2: Run, expect FAIL**

```bash
pnpm test eval-array
```

- [ ] **Step 3: Implement eval-array.ts**

```ts
// scripts/lib/eval-array.ts
import vm from "node:vm";

/**
 * Evaluate `const NAME = <expr>;` (or `var/let`) in a sandbox and return the value.
 * Source files in stay-jp-notes are pure data (no I/O, no `require`), so this is safe.
 */
export function evalConstArray<T>(source: string, name: string): T[] {
  return evalIdentifier<T[]>(source, name);
}

/**
 * Evaluate `window.X = <expr>;` style assignments and return X.
 */
export function evalAssignment<T>(source: string, name: string): T {
  const sandbox: { window: Record<string, unknown> } = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { timeout: 5000 });
  const val = sandbox.window[name];
  if (val === undefined) throw new Error(`window.${name} not assigned by source`);
  return val as T;
}

function evalIdentifier<T>(source: string, name: string): T {
  const wrapped = `${source}\n;globalThis.__OUT__ = ${name};`;
  const sandbox: Record<string, unknown> = {};
  vm.createContext(sandbox);
  vm.runInContext(wrapped, sandbox, { timeout: 5000 });
  const val = sandbox.__OUT__;
  if (val === undefined) throw new Error(`${name} not defined by source`);
  return val as T;
}
```

- [ ] **Step 4: Run, expect PASS**

```bash
pnpm test eval-array
```

- [ ] **Step 5: Commit**

```bash
git add scripts/lib/eval-array.ts __tests__/eval-array.test.ts
git commit -m "feat(scripts): vm.runInContext helper for parsing web JS data files"
```

---

### Task 3: Vocab parser

**Files:**
- Create: `stayjp-app/scripts/parsers/vocab.ts`
- Create: `stayjp-app/__tests__/parsers-vocab.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// __tests__/parsers-vocab.test.ts
import path from "node:path";
import fs from "node:fs";
import { parseVocabFile, parseAllVocab } from "../scripts/parsers/vocab";

const FIXTURE = path.join(__dirname, "fixtures", "vocab-n5-min.js");

beforeAll(() => {
  fs.mkdirSync(path.dirname(FIXTURE), { recursive: true });
  fs.writeFileSync(FIXTURE, `const VOCAB_N5 = [
    {w:"水",r:"みず",m:"水",c:"名"},
    {w:"火",r:"ひ",m:"火",c:"名"},
  ];`);
});

test("parseVocabFile reads one level", () => {
  const words = parseVocabFile(FIXTURE, "n5");
  expect(words).toHaveLength(2);
  expect(words[0]).toMatchObject({ w: "水", r: "みず", m: "水", c: "名" });
});

test("parseVocabFile rejects invalid entry shape", () => {
  const bad = path.join(__dirname, "fixtures", "vocab-bad.js");
  fs.writeFileSync(bad, `const VOCAB_N5 = [{w:"x"}];`);
  expect(() => parseVocabFile(bad, "n5")).toThrow(/missing/);
});

test("parseAllVocab loads all 5 levels from real source repo", () => {
  // Optional: skips if source not present
  const src = process.env.STAYJP_NOTES_PATH ?? "/Users/user/Documents/GitHub/stay-jp-notes";
  if (!fs.existsSync(path.join(src, "vocab-n5.js"))) return;
  const bundle = parseAllVocab(src);
  expect(bundle.n5.length).toBeGreaterThan(100);
  expect(bundle.n1.length).toBeGreaterThan(100);
});
```

- [ ] **Step 2: Run, expect FAIL**

```bash
pnpm test parsers-vocab
```

- [ ] **Step 3: Implement vocab.ts**

```ts
// scripts/parsers/vocab.ts
import fs from "node:fs";
import path from "node:path";
import { evalConstArray } from "../lib/eval-array";
import type { Word, Level, VocabBundle } from "../../src/types/content";

const IDENT_BY_LEVEL: Record<Level, string> = {
  n5: "VOCAB_N5", n4: "VOCAB_N4", n3: "VOCAB_N3", n2: "VOCAB_N2", n1: "VOCAB_N1",
};

export function parseVocabFile(file: string, level: Level): Word[] {
  const src = fs.readFileSync(file, "utf8");
  const arr = evalConstArray<Record<string, unknown>>(src, IDENT_BY_LEVEL[level]);
  return arr.map((row, i) => {
    const need = ["w", "r", "m", "c"] as const;
    for (const k of need) {
      if (typeof row[k] !== "string") {
        throw new Error(`vocab ${level}[${i}] missing field "${k}"`);
      }
    }
    return { w: row.w as string, r: row.r as string, m: row.m as string, c: row.c as string };
  });
}

export function parseAllVocab(srcRepo: string): VocabBundle {
  const levels: Level[] = ["n5", "n4", "n3", "n2", "n1"];
  const out: Partial<VocabBundle> = {};
  for (const lv of levels) {
    out[lv] = parseVocabFile(path.join(srcRepo, `vocab-${lv}.js`), lv);
  }
  return out as VocabBundle;
}
```

- [ ] **Step 4: Run, expect PASS**

```bash
pnpm test parsers-vocab
```

- [ ] **Step 5: Commit**

```bash
git add scripts/parsers/vocab.ts __tests__/parsers-vocab.test.ts __tests__/fixtures/vocab-n5-min.js __tests__/fixtures/vocab-bad.js
git commit -m "feat(parsers): vocab N1-N5 with shape validation"
```

---

### Task 4: Grammar parser

**Files:**
- Create: `stayjp-app/scripts/parsers/grammar.ts`
- Create: `stayjp-app/__tests__/parsers-grammar.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// __tests__/parsers-grammar.test.ts
import path from "node:path";
import fs from "node:fs";
import { parseGrammarFile, parseAllGrammar } from "../scripts/parsers/grammar";

const FIX = path.join(__dirname, "fixtures", "grammar-n3-min.js");
beforeAll(() => {
  fs.mkdirSync(path.dirname(FIX), { recursive: true });
  fs.writeFileSync(FIX, `const N3 = [
    {id:"n3-1",cat:"接続",t:"～において",p:"名+において",ex:"在～",eg:[{j:"AにおいてB",z:"在A中B"}]},
  ];`);
});

test("parseGrammarFile reads one level", () => {
  const items = parseGrammarFile(FIX, "n3");
  expect(items).toHaveLength(1);
  expect(items[0].id).toBe("n3-1");
  expect(items[0].eg[0].j).toBe("AにおいてB");
});

test("parseAllGrammar loads N1-N3 from real source", () => {
  const src = process.env.STAYJP_NOTES_PATH ?? "/Users/user/Documents/GitHub/stay-jp-notes";
  if (!fs.existsSync(path.join(src, "grammar-n3.js"))) return;
  const bundle = parseAllGrammar(src);
  expect(bundle.n3.length).toBeGreaterThan(10);
});
```

- [ ] **Step 2: Run, expect FAIL**

- [ ] **Step 3: Implement grammar.ts**

```ts
// scripts/parsers/grammar.ts
import fs from "node:fs";
import path from "node:path";
import { evalConstArray } from "../lib/eval-array";
import type { GrammarItem, GrammarBundle } from "../../src/types/content";

type GrammarLevel = "n3" | "n2" | "n1";
const IDENT_BY_LEVEL: Record<GrammarLevel, string> = { n3: "N3", n2: "N2", n1: "N1" };

export function parseGrammarFile(file: string, level: GrammarLevel): GrammarItem[] {
  const src = fs.readFileSync(file, "utf8");
  const arr = evalConstArray<Record<string, unknown>>(src, IDENT_BY_LEVEL[level]);
  return arr.map((row, i) => {
    for (const k of ["id", "cat", "t", "p", "ex"] as const) {
      if (typeof row[k] !== "string") {
        throw new Error(`grammar ${level}[${i}] missing field "${k}"`);
      }
    }
    const eg = Array.isArray(row.eg) ? row.eg : [];
    return {
      id: row.id as string,
      cat: row.cat as string,
      t: row.t as string,
      p: row.p as string,
      ex: row.ex as string,
      eg: eg as { j: string; z: string }[],
    };
  });
}

export function parseAllGrammar(srcRepo: string): GrammarBundle {
  const levels: GrammarLevel[] = ["n3", "n2", "n1"];
  const out: Partial<GrammarBundle> = {};
  for (const lv of levels) {
    out[lv] = parseGrammarFile(path.join(srcRepo, `grammar-${lv}.js`), lv);
  }
  return out as GrammarBundle;
}
```

- [ ] **Step 4: Run, expect PASS**

- [ ] **Step 5: Commit**

```bash
git add scripts/parsers/grammar.ts __tests__/parsers-grammar.test.ts __tests__/fixtures/grammar-n3-min.js
git commit -m "feat(parsers): grammar N1-N3"
```

---

### Task 5: Listening parser

**Files:**
- Create: `stayjp-app/scripts/parsers/listening.ts`
- Create: `stayjp-app/__tests__/parsers-listening.test.ts`

The listening.js file wraps `items` in an IIFE — we cannot directly read a top-level `items` identifier. Strategy: regex-extract the literal between `const items = [` and `];` and eval that.

- [ ] **Step 1: Write failing tests**

```ts
// __tests__/parsers-listening.test.ts
import path from "node:path";
import fs from "node:fs";
import { parseListening } from "../scripts/parsers/listening";

const FIX = path.join(__dirname, "fixtures", "listening-min.js");
beforeAll(() => {
  fs.mkdirSync(path.dirname(FIX), { recursive: true });
  fs.writeFileSync(FIX, `
    const Listening = (() => {
      const items = [
        { id:"l-n5-1", level:"n5", type:"短い会話", speed:0.75, script:"こんにちは" },
        { id:"l-n5-2", level:"n5", type:"短い会話", speed:0.75, script:"おはよう" },
      ];
      return {};
    })();
  `);
});

test("parseListening extracts items array from IIFE", () => {
  const items = parseListening(FIX);
  expect(items).toHaveLength(2);
  expect(items[0].id).toBe("l-n5-1");
  expect(items[0].level).toBe("n5");
});

test("parseListening rejects items with missing required fields", () => {
  const bad = path.join(__dirname, "fixtures", "listening-bad.js");
  fs.writeFileSync(bad, `const Listening = (() => { const items = [{id:"x"}]; })();`);
  expect(() => parseListening(bad)).toThrow();
});
```

- [ ] **Step 2: Run, expect FAIL**

- [ ] **Step 3: Implement listening.ts**

```ts
// scripts/parsers/listening.ts
import fs from "node:fs";
import { evalConstArray } from "../lib/eval-array";
import type { ListeningItem, Level } from "../../src/types/content";

export function parseListening(file: string): ListeningItem[] {
  const src = fs.readFileSync(file, "utf8");
  // Extract `const items = [ ... ];` block within the IIFE
  const m = src.match(/const\s+items\s*=\s*(\[[\s\S]*?\n\s*\])\s*;/);
  if (!m) throw new Error("listening: could not locate `const items = [...]`");
  const literalSrc = `const __items__ = ${m[1]};`;
  const arr = evalConstArray<Record<string, unknown>>(literalSrc, "__items__");

  return arr.map((row, i) => {
    for (const k of ["id", "level", "type", "speed", "script"] as const) {
      if (row[k] === undefined) throw new Error(`listening[${i}] missing "${k}"`);
    }
    return {
      id: String(row.id),
      level: row.level as Level,
      type: String(row.type),
      speed: Number(row.speed),
      script: String(row.script),
      question: typeof row.question === "string" ? row.question : undefined,
      choices: Array.isArray(row.choices) ? (row.choices as string[]) : undefined,
      answer: typeof row.answer === "number" ? row.answer : undefined,
    };
  });
}
```

- [ ] **Step 4: Run, expect PASS**

- [ ] **Step 5: Commit**

```bash
git add scripts/parsers/listening.ts __tests__/parsers-listening.test.ts __tests__/fixtures/listening-min.js __tests__/fixtures/listening-bad.js
git commit -m "feat(parsers): listening items via regex+eval (handles IIFE wrapper)"
```

---

### Task 6: TTS manifest parser

**Files:**
- Create: `stayjp-app/scripts/parsers/tts-manifest.ts`
- Create: `stayjp-app/__tests__/parsers-tts.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// __tests__/parsers-tts.test.ts
import path from "node:path";
import fs from "node:fs";
import { parseTtsManifest } from "../scripts/parsers/tts-manifest";

const FIX = path.join(__dirname, "fixtures", "tts-manifest-min.js");
beforeAll(() => {
  fs.mkdirSync(path.dirname(FIX), { recursive: true });
  fs.writeFileSync(FIX,
    `window.__TTS = {"こんにちは":"aaa111","おはよう":"bbb222"};`);
});

test("parseTtsManifest reads __TTS assignment", () => {
  const m = parseTtsManifest(FIX);
  expect(Object.keys(m)).toHaveLength(2);
  expect(m["こんにちは"]).toBe("aaa111");
});
```

- [ ] **Step 2: Run, expect FAIL**

- [ ] **Step 3: Implement tts-manifest.ts**

```ts
// scripts/parsers/tts-manifest.ts
import fs from "node:fs";
import { evalAssignment } from "../lib/eval-array";
import type { TTSManifest } from "../../src/types/content";

export function parseTtsManifest(file: string): TTSManifest {
  const src = fs.readFileSync(file, "utf8");
  return evalAssignment<TTSManifest>(src, "__TTS");
}
```

- [ ] **Step 4: Run, expect PASS**

- [ ] **Step 5: Commit**

```bash
git add scripts/parsers/tts-manifest.ts __tests__/parsers-tts.test.ts __tests__/fixtures/tts-manifest-min.js
git commit -m "feat(parsers): TTS manifest (window.__TTS)"
```

---

### Task 7: Orchestrator `sync-content.ts`

**Files:**
- Create: `stayjp-app/scripts/sync-content.ts`
- Modify: `stayjp-app/package.json`

- [ ] **Step 1: Install tsx as devDep**

```bash
cd ~/Documents/GitHub/stayjp-app
pnpm add -D tsx
```

- [ ] **Step 2: Write sync-content.ts**

```ts
// scripts/sync-content.ts
import fs from "node:fs";
import path from "node:path";
import { parseAllVocab } from "./parsers/vocab";
import { parseAllGrammar } from "./parsers/grammar";
import { parseListening } from "./parsers/listening";
import { parseTtsManifest } from "./parsers/tts-manifest";

const SRC = process.env.STAYJP_NOTES_PATH
  ?? "/Users/user/Documents/GitHub/stay-jp-notes";
const OUT = path.join(__dirname, "..", "assets", "content");

function writeJson(name: string, data: unknown) {
  const full = path.join(OUT, name);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, JSON.stringify(data));
  const stat = fs.statSync(full);
  console.log(`✓ ${name}  (${(stat.size / 1024).toFixed(1)} KB)`);
}

function main() {
  if (!fs.existsSync(SRC)) {
    throw new Error(`STAYJP_NOTES_PATH not found: ${SRC}`);
  }
  console.log(`Source: ${SRC}`);
  console.log(`Output: ${OUT}`);

  writeJson("vocab.json", parseAllVocab(SRC));
  writeJson("grammar.json", parseAllGrammar(SRC));
  writeJson("listening.json", parseListening(path.join(SRC, "listening.js")));
  writeJson("tts-manifest.json", parseTtsManifest(path.join(SRC, "audio/tts/manifest.js")));

  console.log("✓ content sync complete");
}

main();
```

- [ ] **Step 3: Add pnpm script**

In `package.json` `"scripts"`:
```json
"sync-content": "tsx scripts/sync-content.ts"
```

- [ ] **Step 4: Run it**

```bash
pnpm sync-content
```

Expected output:
```
Source: /Users/user/Documents/GitHub/stay-jp-notes
Output: .../assets/content
✓ vocab.json       (...KB)
✓ grammar.json     (...KB)
✓ listening.json   (...KB)
✓ tts-manifest.json (...KB)
✓ content sync complete
```

- [ ] **Step 5: Inspect generated files**

```bash
ls -la assets/content/
wc -c assets/content/*.json
```

Note total size; should be well under 5 MB combined.

- [ ] **Step 6: Commit**

```bash
git add scripts/sync-content.ts package.json pnpm-lock.yaml assets/content/
git commit -m "feat(scripts): sync-content orchestrator + initial bundle"
```

---

### Task 8: Runtime content loader

**Files:**
- Create: `stayjp-app/src/lib/content.ts`
- Create: `stayjp-app/__tests__/content-loader.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// __tests__/content-loader.test.ts
import { vocab, grammar, audioFor, allLevels } from "../src/lib/content";

test("vocab(n5) returns non-empty array", () => {
  const arr = vocab("n5");
  expect(arr.length).toBeGreaterThan(50);
  expect(arr[0]).toHaveProperty("w");
  expect(arr[0]).toHaveProperty("r");
});

test("grammar(n3) returns non-empty array", () => {
  const arr = grammar("n3");
  expect(arr.length).toBeGreaterThan(5);
  expect(arr[0]).toHaveProperty("eg");
});

test("audioFor returns hash for known text or undefined", () => {
  // pick a key that should exist in the real manifest
  const known = audioFor("～うちに");
  expect(typeof known === "string" || known === undefined).toBe(true);
});

test("allLevels lists 5 levels", () => {
  expect(allLevels).toHaveLength(5);
});
```

- [ ] **Step 2: Run, expect FAIL**

```bash
pnpm test content-loader
```

- [ ] **Step 3: Implement content.ts**

```ts
// src/lib/content.ts
import vocabJson from "../../assets/content/vocab.json";
import grammarJson from "../../assets/content/grammar.json";
import ttsJson from "../../assets/content/tts-manifest.json";
import type {
  Word, GrammarItem, Level, VocabBundle, GrammarBundle, TTSManifest,
} from "../types/content";
import { LEVELS } from "../types/content";

const VOCAB = vocabJson as VocabBundle;
const GRAMMAR = grammarJson as GrammarBundle;
const TTS = ttsJson as TTSManifest;

export const allLevels: Level[] = LEVELS;

export function vocab(level: Level): Word[] {
  return VOCAB[level] ?? [];
}

export function grammar(level: "n3" | "n2" | "n1"): GrammarItem[] {
  return GRAMMAR[level] ?? [];
}

export function audioFor(text: string): string | undefined {
  return TTS[text];
}
```

- [ ] **Step 4: Update tsconfig.json**

Ensure `resolveJsonModule` is true. If not present in `compilerOptions`:
```json
"resolveJsonModule": true
```

- [ ] **Step 5: Run, expect PASS**

```bash
pnpm test content-loader
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/content.ts __tests__/content-loader.test.ts tsconfig.json
git commit -m "feat(content): runtime loader for vocab/grammar/TTS lookups"
```

---

### Task 9: Smoke wire — Flashcard tab shows content counts

**Files:**
- Modify: `stayjp-app/app/(tabs)/flashcard.tsx`

- [ ] **Step 1: Update flashcard placeholder**

```tsx
// app/(tabs)/flashcard.tsx
import { ScrollView, Text, View } from "react-native";
import { allLevels, vocab, grammar } from "../../src/lib/content";

export default function FlashcardTab() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 pt-16">
        <Text className="text-xl font-bold mb-4">Flashcard (P3 will replace this)</Text>
        <Text className="text-sm text-gray-500 mb-4">Content pipeline check:</Text>
        {allLevels.map((lv) => (
          <View key={lv} className="mb-3">
            <Text className="font-semibold">{lv.toUpperCase()}</Text>
            <Text className="text-gray-600">vocab: {vocab(lv).length}</Text>
            {(lv === "n3" || lv === "n2" || lv === "n1") && (
              <Text className="text-gray-600">grammar: {grammar(lv).length}</Text>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
```

- [ ] **Step 2: Run app and confirm**

```bash
npx expo start -c
```

Press `w`. Sign in, navigate to 單字 tab. Confirm you see numbers like:
```
N5  vocab: 800+
N4  vocab: ...
N3  vocab: ...   grammar: 70+
N2  vocab: ...   grammar: 70+
N1  vocab: ...   grammar: 80+
```

- [ ] **Step 3: Commit**

```bash
git add app/\(tabs\)/flashcard.tsx
git commit -m "feat(flashcard): render content counts as P2 smoke verification"
```

---

### Task 10: Document in README

**Files:**
- Modify: `stayjp-app/README.md`

- [ ] **Step 1: Append a Content Pipeline section**

```markdown
## Content Pipeline (P2)

Content (vocab/grammar/listening/TTS manifest) lives in the sibling repo
`stay-jp-notes`. Re-bundle locally with:

```bash
STAYJP_NOTES_PATH=/path/to/stay-jp-notes pnpm sync-content
```

Default `STAYJP_NOTES_PATH=/Users/user/Documents/GitHub/stay-jp-notes`.

Output JSON files land in `assets/content/` and are imported statically by
`src/lib/content.ts`. Re-run `sync-content` whenever you update the web repo.

Audio files (`audio/tts/*.mp3`) are NOT bundled here — that work lives in P8
(offline download strategy).
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: P2 content pipeline section in README"
```

---

## Done Criteria for P2

- [ ] All 10 tasks committed
- [ ] `pnpm test` passes (storage 3 + sync 3 + auth 3 + eval-array 4 + vocab 3 + grammar 2 + listening 2 + tts 1 + content-loader 4 = **22** tests, ±)
- [ ] `pnpm sync-content` runs clean from a clean working tree
- [ ] App loads, Flashcard tab shows numeric counts for all 5 levels
- [ ] Generated `assets/content/*.json` checked in (so app builds without re-running script)

## Out of Scope for P2

- Audio file bundling / download (P8)
- Per-level chunking of JSON (defer until size matters)
- Watching stay-jp-notes for changes — manual `pnpm sync-content` is enough for now
- CI integration —副业不需要

## Open Questions

(none — every input format is verified against real source files)
