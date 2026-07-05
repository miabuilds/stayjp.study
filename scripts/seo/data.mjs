import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
export const LEVELS = ['n5', 'n4', 'n3', 'n2', 'n1'];

function evalJs(src, name) {
  const fn = new Function(src + `; return typeof ${name} !== 'undefined' ? ${name} : null;`);
  return fn();
}
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

// 文法对象→带 id 的数组;id 用键顺序(1-based),与页面/ sitemap 一致
function indexGrammar(obj, level) {
  const out = {};
  Object.keys(obj).forEach((k, i) => {
    const v = obj[k];
    const id = `${level}-${i + 1}`;
    out[id] = { id, t: v.t, cat: v.cat, ex: v.ex, eg: v.eg || [], p: v.p };
  });
  return out;
}

export function loadData() {
  const grammar = {}, vocab = {};
  for (const lv of LEVELS) {
    const U = lv.toUpperCase();
    const gzh = evalJs(read(`grammar-${lv}.js`), U);
    let gen = null;
    try { gen = evalJs(read(`grammar-${lv}-en.js`), `${U}_EN`); } catch { gen = null; }
    if (!gzh) throw new Error(`grammar-${lv} zh 抽取失败`);
    grammar[lv] = { zh: indexGrammar(gzh, lv), en: gen ? indexGrammar(gen, lv) : {} };
    const vzh = evalJs(read(`vocab-${lv}.js`), `VOCAB_${U}`);
    let ven = null;
    try { ven = evalJs(read(`vocab-${lv}-en.js`), `VOCAB_${U}_EN`); } catch { ven = null; }
    if (!vzh) throw new Error(`vocab-${lv} zh 抽取失败`);
    vocab[lv] = { zh: vzh, en: ven || [] };
  }
  // 读音表挂在 window.*;剥离 window. 前缀后 eval
  const rsrc = read('grammar-kanji-readings.js').replace(/window\.\w+\s*=/, 'var __R =');
  const readings = new Function(rsrc + '; return typeof __R !== "undefined" ? __R : {};')();
  return { grammar, vocab, readings, LEVELS };
}
