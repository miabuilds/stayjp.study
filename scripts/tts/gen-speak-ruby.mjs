#!/usr/bin/env node
// 口說練習例句的逐詞 ruby(speak-ruby.js)。讀音以 kuromoji 為底,整句串接後與 speak.html
// 手寫 kana 正規化比對——不一致的句子不輸出 ruby(前端退回只顯示整句假名行),絕不標錯音。
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { ROOT } from './_lib.mjs';
const require = createRequire(import.meta.url);
const kuromoji = require('kuromoji');
const k2h = s => (s||'').replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0)-0x60));
const hasKanji = s => /[一-鿿々]/.test(s);
const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const src = fs.readFileSync(path.join(ROOT,'speak.html'),'utf8');
const SENTS = [...src.matchAll(/S\('((?:[^'\\]|\\.)*)','((?:[^'\\]|\\.)*)','/g)].map(m=>({jp:m[1],kana:m[2]}));
// 小狸短劇:重點句(skits-data.js 的 p/r)+ 逐句台詞(videos/skit/lines.json 的 ja/kana)也會帶進跟讀頁(?say=),一起產 ruby
{
  const w = {}; new Function('window', fs.readFileSync(path.join(ROOT,'skits-data.js'),'utf8'))(w);
  const have = new Set(SENTS.map(s=>s.jp));
  const push = (jp,kana) => { if(jp && kana && !have.has(jp)){ have.add(jp); SENTS.push({jp,kana}); } };
  (w.SKITS||[]).forEach(x=>push(x.p, x.r));
  const lines = JSON.parse(fs.readFileSync(path.join(ROOT,'videos/skit/lines.json'),'utf8'));
  Object.values(lines).flat().forEach(l=>push(l&&l.ja, l&&l.kana));
}
// 備案對位:句子切成「漢字段 / 非漢字段」,非漢字段當錨點去手寫假名裡找,每個漢字段拿夾在中間的假名。
// lazy 與 greedy 兩種配法結果必須一致(=唯一解)、每段假名長度合理,才輸出;數字/英文這種錨點在假名裡找不到 → 不標。
const ANORM = t => k2h(t).replace(/[、。?？!！,，\s〜~…・ー「」『』]/g,'');
function alignRuby(jp, kana){
  const runs = jp.match(/[一-鿿々]+|[^一-鿿々]+/g) || [];
  if(!runs.some(hasKanji)) return null;
  const reEsc = x => x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const build = q => new RegExp('^' + runs.map(r => hasKanji(r) ? '([ぁ-ゖ]'+q+')' : reEsc(ANORM(r))).join('') + '$');
  const K = ANORM(kana);
  const a = K.match(build('+?')), b = K.match(build('+'));
  if(!a || !b || a.slice(1).join('|') !== b.slice(1).join('|')) return null;
  let gi = 1, html = '';
  for(const r of runs){
    if(!hasKanji(r)){ html += esc(r); continue; }
    const rd = a[gi++];
    if(rd.length < r.length || rd.length > r.length*4) return null;
    html += '<ruby>'+esc(r)+'<rt>'+esc(rd)+'</rt></ruby>';
  }
  return html;
}
let aligned = 0;
const norm = t => k2h(t).replace(/[ぁ-ゖ]/g,c=>c).replace(/[、。?？!,\s]/g,'').replace(/は/g,'わ').replace(/へ/g,'え').replace(/を/g,'お').replace(/づ/g,'ず').replace(/ぢ/g,'じ');
kuromoji.builder({dicPath:path.join(ROOT,'node_modules/kuromoji/dict')}).build((err,tok)=>{
  if(err){console.error(err);process.exit(1);}
  const MAP={}; let ok=0, skip=0;
  for(const s of SENTS){
    const ts = tok.tokenize(s.jp);
    const joined = ts.map(t=>k2h(t.reading||t.surface_form)).join('');
    if(norm(joined)!==norm(s.kana)){   // kuromoji 整句讀音與手寫 kana 不符(何=なん、番号札=ふだ、字典沒有的詞)
      const h = alignRuby(s.jp, s.kana);  // 備案:用手寫假名對位,只有唯一解才收
      if(h){ MAP[s.jp]=h; ok++; aligned++; if(process.env.ALIGN_LOG) console.log("  對位:", h.replace(/<ruby>([^<]*)<rt>([^<]*)<\/rt><\/ruby>/g,"$1($2)")); } else { skip++; if(process.env.ALIGN_LOG) console.log("  跳過:", s.jp, "/", s.kana); }
      continue;
    }
    let html='';
    for(const t of ts){
      const surf=t.surface_form, rd=k2h(t.reading||surf);
      if(!hasKanji(surf)){ html+=esc(surf); continue; }
      const tail=(surf.match(/[ぁ-ゖ]+$/)||[''])[0];
      if(tail && rd.endsWith(tail)){
        html+='<ruby>'+esc(surf.slice(0,surf.length-tail.length))+'<rt>'+esc(rd.slice(0,rd.length-tail.length))+'</rt></ruby>'+esc(tail);
      } else if(!tail){
        html+='<ruby>'+esc(surf)+'<rt>'+esc(rd)+'</rt></ruby>';
      } else { html+=esc(surf); }   // 讀音尾對不上送假名 → 該詞不標
    }
    MAP[s.jp]=html; ok++;
  }
  fs.writeFileSync(path.join(ROOT,'speak-ruby.js'),
    '// 由 scripts/tts/gen-speak-ruby.mjs 產生 — 勿手改。逐詞 ruby;kuromoji 讀音與手寫假名整句核對一致才收錄。\n'
    +'window.SPEAK_RUBY='+JSON.stringify(MAP)+';\n');
  console.log(`speak-ruby.js:${ok} 句有 ruby(其中 ${aligned} 句走手寫假名對位)、${skip} 句退回假名行(讀音比對不一致,安全跳過)`);
});
