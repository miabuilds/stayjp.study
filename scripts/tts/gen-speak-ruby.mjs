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
const norm = t => k2h(t).replace(/[ぁ-ゖ]/g,c=>c).replace(/[、。?？!,\s]/g,'').replace(/は/g,'わ').replace(/へ/g,'え').replace(/を/g,'お').replace(/づ/g,'ず').replace(/ぢ/g,'じ');
kuromoji.builder({dicPath:path.join(ROOT,'node_modules/kuromoji/dict')}).build((err,tok)=>{
  if(err){console.error(err);process.exit(1);}
  const MAP={}; let ok=0, skip=0;
  for(const s of SENTS){
    const ts = tok.tokenize(s.jp);
    const joined = ts.map(t=>k2h(t.reading||t.surface_form)).join('');
    if(norm(joined)!==norm(s.kana)){ skip++; continue; }   // kuromoji 整句讀音與手寫 kana 不符 → 不標
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
  console.log(`speak-ruby.js:${ok} 句有 ruby、${skip} 句退回假名行(讀音比對不一致,安全跳過)`);
});
