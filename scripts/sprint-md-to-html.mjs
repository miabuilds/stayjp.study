#!/usr/bin/env node
// sprint-md-to-html.mjs — 把 SPRINT-*.md 轉成列印用 HTML(供 agent-browser pdf 輸出 PDF)。
// 用:node scripts/sprint-md-to-html.mjs   → 產出 SPRINT-*.print.html(gitignore)
// 再:for f in SPRINT-N*.print.html; do agent-browser open "file://$PWD/$f"; agent-browser pdf "${f%.print.html}.pdf"; done

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`(.+?)`/g, '<code>$1</code>');

const CSS = `@page{margin:16mm 14mm}*{box-sizing:border-box}
body{font-family:-apple-system,"PingFang TC","Noto Sans TC",sans-serif;color:#1c1c1e;line-height:1.7;font-size:12px;max-width:720px;margin:0 auto}
h1{font-size:24px;color:#B8362A;border-bottom:3px solid #B8362A;padding-bottom:8px;margin:0 0 12px}
h2{font-size:16px;color:#B8362A;margin:22px 0 8px;border-left:4px solid #B8362A;padding-left:8px}
h3{font-size:13px;background:#F2EEE5;padding:6px 10px;border-radius:6px;margin:16px 0 6px;page-break-inside:avoid}
blockquote{background:#FAF8F3;border-left:3px solid #DDD5C0;margin:8px 0;padding:6px 12px;color:#6a6a6a;font-size:11px}
ul{margin:6px 0 6px 4px;padding-left:18px}li{margin:2px 0}
table{border-collapse:collapse;width:100%;margin:8px 0;font-size:11px;page-break-inside:avoid}
th{background:#B8362A;color:#fff;text-align:left;padding:6px 8px}td{border:1px solid #E5DECF;padding:6px 8px;vertical-align:top}
tr:nth-child(even) td{background:#FAF8F3}
code{background:#F2EEE5;padding:1px 4px;border-radius:3px;font-size:11px}
hr{border:0;border-top:1px solid #E5DECF;margin:16px 0}
.foot{color:#a9a9a9;font-size:10px;font-style:italic}
.gp{margin:8px 0 2px;font-size:12px;page-break-inside:avoid}
.gp b{color:#B8362A}
.gsub{margin:0 0 0 16px;font-size:11px;color:#3a3a3a;line-height:1.6}
.gsub.eg{color:#6a6a6a}`;

function mdToHtml(md) {
  const lines = md.split('\n');
  let html = '', inUl = false, inTbl = false;
  const closeUl = () => { if (inUl) { html += '</ul>'; inUl = false; } };
  const closeTbl = () => { if (inTbl) { html += '</tbody></table>'; inTbl = false; } };
  for (const raw of lines) {
    const l = raw.replace(/\r/, '');
    if (/^\|/.test(l)) {
      if (/^[-\s|:]+$/.test(l.replace(/\|/g, ''))) continue;
      const cells = l.split('|').slice(1, -1).map(c => c.trim());
      if (!inTbl) { closeUl(); html += '<table><thead><tr>' + cells.map(c => `<th>${inline(c)}</th>`).join('') + '</tr></thead><tbody>'; inTbl = true; continue; }
      html += '<tr>' + cells.map(c => `<td>${inline(c)}</td>`).join('') + '</tr>'; continue;
    } else closeTbl();
    // 編號文法點:「1. **標題**」
    const om = l.match(/^\d+\. (.+)/);
    if (om) { closeUl(); html += `<div class=gp>${inline(om[1])}</div>`; continue; }
    // 縮排子項:「   - 接續:… / 例:…」
    const sm = l.match(/^\s+- (.+)/);
    if (sm) { closeUl(); const cls = /^例/.test(sm[1]) ? 'gsub eg' : 'gsub'; html += `<div class="${cls}">${inline(sm[1])}</div>`; continue; }
    if (/^### /.test(l)) { closeUl(); html += `<h3>${inline(l.slice(4))}</h3>`; continue; }
    if (/^## /.test(l)) { closeUl(); html += `<h2>${inline(l.slice(3))}</h2>`; continue; }
    if (/^# /.test(l)) { closeUl(); html += `<h1>${inline(l.slice(2))}</h1>`; continue; }
    if (/^> /.test(l)) { closeUl(); html += `<blockquote>${inline(l.slice(2))}</blockquote>`; continue; }
    if (/^- /.test(l)) { if (!inUl) { html += '<ul>'; inUl = true; } html += `<li>${inline(l.slice(2))}</li>`; continue; }
    if (/^---/.test(l)) { closeUl(); html += '<hr>'; continue; }
    if (/^\*.+\*$/.test(l.trim())) { closeUl(); html += `<p class=foot>${inline(l.trim().replace(/^\*|\*$/g, ''))}</p>`; continue; }
    if (l.trim() === '') { closeUl(); continue; }
    closeUl(); html += `<p>${inline(l)}</p>`;
  }
  closeUl(); closeTbl();
  return `<!DOCTYPE html><html lang=zh-Hant><head><meta charset=utf-8><style>${CSS}</style></head><body>${html}</body></html>`;
}

for (const lv of LEVELS) {
  const md = readFileSync(join(ROOT, `SPRINT-${lv}.md`), 'utf8');
  writeFileSync(join(ROOT, `SPRINT-${lv}.print.html`), mdToHtml(md));
  console.log(`✓ SPRINT-${lv}.print.html`);
}
