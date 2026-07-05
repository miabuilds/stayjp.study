import fs from 'node:fs';
import path from 'node:path';
import { loadData, LEVELS } from './seo/data.mjs';
import { resolveSlugs } from './seo/slug.mjs';
import { renderGrammarPage, renderHub, renderVocabPage } from './seo/templates.mjs';
import { buildSitemap } from './seo/sitemap.mjs';
import { posSlug } from './seo/pos.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const DRY = process.argv.includes('--dry') || process.env.DRY_RUN;
const ORIGIN = 'https://stayjp.study';
const stats = { pages: 0, fallback: 0, collisions: 0, unmappedPos: 0 };

function write(rel, html) {
  stats.pages++;
  if (DRY) return;
  const abs = path.join(ROOT, rel, 'index.html');
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, html);
}

// EN 例句只有英文;配对 ZH 的日文句 → {j:日文, z:英译},让 EN 页也有日文例句
function enExamples(zhEntry, enEntry) {
  const zeg = zhEntry?.eg || [], eeg = enEntry?.eg || [];
  if (zeg.length && zeg.length === eeg.length) {
    return zeg.map((z, i) => ({ j: z.j, z: eeg[i] }));
  }
  return eeg; // 数量不齐 → 退回英文字符串
}

const { grammar, vocab, readings } = loadData();
const urls = [];
const STATIC = [['/','1.0'],['/home.html','0.9'],['/pricing.html','0.8'],['/verbs.html','0.7'],
  ['/contact.html','0.3'],['/terms.html','0.2'],['/privacy.html','0.2'],['/refund.html','0.2']];
for (const [loc, priority] of STATIC) urls.push({ loc: ORIGIN + loc, priority });

for (const lv of LEVELS) {
  const zh = Object.values(grammar[lv].zh);
  const en = grammar[lv].en;
  const slugs = resolveSlugs(zh, readings); // id→slug,zh/en 共用
  for (const [id, slug] of slugs) if (slug === id) stats.fallback++;
  const seen = new Set(slugs.values()); stats.collisions += zh.length - seen.size;

  const byCat = {};
  for (const e of zh) (byCat[e.cat] ||= []).push(e);

  for (const entry of zh) {
    const slug = slugs.get(entry.id);
    const zhUrl = `${ORIGIN}/g/${lv}/${slug}/`;
    const enUrl = `${ORIGIN}/en/g/${lv}/${slug}/`;
    const alts = [{ lang:'zh-Hant', href:zhUrl }, { lang:'en', href:enUrl }];
    const related = (byCat[entry.cat] || []).filter(x => x.id !== entry.id).slice(0, 6)
      .map(x => ({ id:x.id, t:x.t, href:`/g/${lv}/${slugs.get(x.id)}/` }));
    write(`g/${lv}/${slug}`, renderGrammarPage({
      entry, level: lv, lang:'zh-Hant', canonical: zhUrl, alternates: alts, related, appUrl: `${ORIGIN}/#${lv}` }));
    urls.push({ loc: zhUrl, priority: '0.7' });

    const enEntry = en[entry.id];
    if (enEntry) {
      const enPaired = { ...enEntry, eg: enExamples(entry, enEntry) };
      const relEn = related.map(r => ({ t: en[r.id]?.t || r.t, href:`/en${r.href}` }));
      write(`en/g/${lv}/${slug}`, renderGrammarPage({
        entry: enPaired, level: lv, lang:'en', canonical: enUrl,
        alternates:[{lang:'zh-Hant',href:zhUrl},{lang:'en',href:enUrl}], related: relEn, appUrl: `${ORIGIN}/en/#${lv}` }));
      urls.push({ loc: enUrl, priority: '0.6' });
    }
  }
  // hub(zh + en)
  const hubZh = zh.map(e => ({ t:e.t, href:`/g/${lv}/${slugs.get(e.id)}/` }));
  write(`g/${lv}`, renderHub({ level:lv, lang:'zh-Hant', items:hubZh, canonical:`${ORIGIN}/g/${lv}/`, kind:'grammar' }));
  urls.push({ loc:`${ORIGIN}/g/${lv}/`, priority:'0.6' });
  const hubEn = zh.filter(e => en[e.id]).map(e => ({ t:en[e.id].t, href:`/en/g/${lv}/${slugs.get(e.id)}/` }));
  if (hubEn.length) {
    write(`en/g/${lv}`, renderHub({ level:lv, lang:'en', items:hubEn, canonical:`${ORIGIN}/en/g/${lv}/`, kind:'grammar' }));
    urls.push({ loc:`${ORIGIN}/en/g/${lv}/`, priority:'0.5' });
  }
}

// ---- 单字聚合表(按级×词性) ----
for (const lv of LEVELS) {
  const zh = vocab[lv].zh, en = vocab[lv].en;
  const groups = {}; // slug → { pos, zh:[{w,r,m}], en:[{w,r,m}] }
  zh.forEach((w, i) => {
    const p = posSlug(w.c);
    if (!p) { stats.unmappedPos++; return; }
    (groups[p.slug] ||= { pos: p, zh: [], en: [] });
    groups[p.slug].zh.push({ w: w.w, r: w.r, m: w.m });
    const e = en[i];
    if (e) groups[p.slug].en.push({ w: e.w, r: w.r, m: e.m }); // EN 无读音→借 ZH 同序读音
  });
  const hubZh = [], hubEn = [];
  for (const [slug, g] of Object.entries(groups)) {
    const zhUrl = `${ORIGIN}/v/${lv}/${slug}/`, enUrl = `${ORIGIN}/en/v/${lv}/${slug}/`;
    const alts = [{ lang:'zh-Hant', href:zhUrl }, { lang:'en', href:enUrl }];
    write(`v/${lv}/${slug}`, renderVocabPage({
      level:lv, lang:'zh-Hant', posZh:g.pos.zh, posEn:g.pos.en, words:g.zh, canonical:zhUrl, alternates:alts, appUrl:`${ORIGIN}/#${lv}` }));
    urls.push({ loc: zhUrl, priority:'0.6' });
    hubZh.push({ t:`${g.pos.zh}（${g.zh.length}）`, href:`/v/${lv}/${slug}/` });
    if (g.en.length) {
      write(`en/v/${lv}/${slug}`, renderVocabPage({
        level:lv, lang:'en', posZh:g.pos.zh, posEn:g.pos.en, words:g.en, canonical:enUrl,
        alternates:[{lang:'zh-Hant',href:zhUrl},{lang:'en',href:enUrl}], appUrl:`${ORIGIN}/en/#${lv}` }));
      urls.push({ loc: enUrl, priority:'0.5' });
      hubEn.push({ t:`${g.pos.en} (${g.en.length})`, href:`/en/v/${lv}/${slug}/` });
    }
  }
  write(`v/${lv}`, renderHub({ level:lv, lang:'zh-Hant', items:hubZh, canonical:`${ORIGIN}/v/${lv}/`, kind:'vocab' }));
  urls.push({ loc:`${ORIGIN}/v/${lv}/`, priority:'0.6' });
  if (hubEn.length) {
    write(`en/v/${lv}`, renderHub({ level:lv, lang:'en', items:hubEn, canonical:`${ORIGIN}/en/v/${lv}/`, kind:'vocab' }));
    urls.push({ loc:`${ORIGIN}/en/v/${lv}/`, priority:'0.5' });
  }
}

if (!DRY) fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), buildSitemap(urls));
console.log(`[build-seo] pages=${stats.pages} fallback(id-slug)=${stats.fallback} collisions=${stats.collisions} unmappedPos=${stats.unmappedPos} sitemap-urls=${urls.length}${DRY ? ' (DRY)' : ''}`);
