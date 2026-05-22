#!/usr/bin/env node
// Apply Gemini-reviewed corrections on top of JMdict swap.
// Reverts JMdict mis-swaps + promotes ambiguous verbs to 両.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");

// [w, target_t] — re-set to this regardless of current
const FIXES = [
  // Revert JMdict's wrong "他→自" swaps
  ["忌む", "他"],
  ["超越する", "他"],
  ["弁じる", "他"],
  ["踏み越える", "他"],
  ["乗り越える", "他"],
  ["辞退する", "他"],
  ["参考する", "他"],
  // Revert JMdict's wrong "自→他" swaps
  ["関する", "自"],
  ["話しかける", "自"],
  ["踏み切る", "自"],
  ["支障する", "自"],
  // Promote to 両 (transitive + intransitive both valid)
  ["相談する", "両"],
  ["話し合う", "両"],
  ["呼びかける", "両"],
  ["囁く", "両"],
  ["乗り出す", "両"],
];

const FILES = ["vocab-n5.js", "vocab-n4.js", "vocab-n3.js", "vocab-n2.js", "vocab-n1.js"];

let total = 0;
for (const file of FILES) {
  const fpath = path.join(ROOT, file);
  let src = fs.readFileSync(fpath, "utf8");
  let changes = 0;
  for (const [w, t] of FIXES) {
    // Match {w:"X",r:"...",m:"...",c:"動",t:"自|他|両"} → set t
    const re = new RegExp(
      `(\\{w:"${w.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")}",[^}]*c:"動",t:")(自|他|両)(")`,
      "g",
    );
    src = src.replace(re, (m, pre, cur, post) => {
      if (cur === t) return m;
      changes++;
      return `${pre}${t}${post}`;
    });
  }
  if (changes > 0) {
    fs.writeFileSync(fpath, src);
    console.log(`${file}: ${changes} fix(es)`);
    total += changes;
  }
}
console.log(`Total: ${total}`);
