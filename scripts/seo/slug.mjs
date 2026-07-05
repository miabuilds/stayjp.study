import { kanaToRomaji } from './romaji.mjs';

const DECORATION = /[～〜・（）()｛｝【】「」、。･\s　]/g;

// 贪婪最长匹配把标题里的汉字词换成假名读音,再整体转罗马音。
function toKana(title, readings) {
  const keys = Object.keys(readings).sort((a, b) => b.length - a.length); // 长优先
  const s = title.replace(DECORATION, '');
  let i = 0, out = '';
  outer: while (i < s.length) {
    for (const k of keys) {
      if (k && s.startsWith(k, i)) { out += readings[k]; i += k.length; continue outer; }
    }
    out += s[i]; i += 1;
  }
  return out;
}

export function titleToSlug(title, readings) {
  const kana = toKana(title, readings);
  const romaji = kanaToRomaji(kana);
  // 若仍含非 ascii 残留(说明有未覆盖汉字),视为失败
  if (/[^\x00-\x7f]/.test(romaji)) return null;
  const slug = romaji.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (!slug) return null;
  return slug;
}

export function resolveSlugs(entries, readings) {
  const map = new Map();
  const seen = new Map(); // slug → count
  for (const e of entries) {
    const base = titleToSlug(e.t, readings) || e.id;
    const n = (seen.get(base) || 0) + 1;
    seen.set(base, n);
    map.set(e.id, n === 1 ? base : `${base}-${n}`);
  }
  return map;
}
