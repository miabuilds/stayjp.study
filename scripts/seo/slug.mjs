import { kanaToRomaji } from './romaji.mjs';

const DECORATION = /[～〜・｛｝【】「」『』、。･\s　]/g;
const PAREN = /[（(][^）)]*[）)]/g;      // （名詞）(主題) 等注解
const QUOTED = /[「『]([^」』]+)[」』]/g; // 「は」『まで』等引号内的文法本体

// 标题→用于生成 slug 的核心文字:优先取引号内(真正的助词/词),否则剥掉注解后取剩余。
function coreText(title) {
  const quoted = [...title.matchAll(QUOTED)].map(m => m[1]);
  if (quoted.length) return quoted.join('');
  return title.replace(PAREN, '');
}

// 贪婪最长匹配把标题里的汉字词换成假名读音,再整体转罗马音。
function toKana(title, readings) {
  const keys = Object.keys(readings).sort((a, b) => b.length - a.length); // 长优先
  const s = coreText(title).replace(DECORATION, '');
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
