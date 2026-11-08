// 稽核例句漏標讀音:用前端 furiganaHTMLRich 掃全部文法+單字例句,列出沒上 ruby 的漢字段。
// 用法:node scripts/audit-furigana-bare.mjs <報表.json> <bare-runs.json>   → 第二個檔直接餵 gen-ex-furigana.mjs
// NOEXF=1 → 不載 ex-furigana.js(產 gen 的輸入時一定要這樣,否則表裡已有的段不算裸、重產會把它們洗掉:11/8 中過)
// 跑前端 furiganaHTMLRich 掃所有文法例句,找沒上 ruby 的漢字段
import fs from 'node:fs'; import vm from 'node:vm';
const R = new URL('../', import.meta.url).pathname;
const win = { localStorage:{getItem(){return null},setItem(){}}, document:{getElementById(){return null},createElement(){return {style:{}}},addEventListener(){}, body:{appendChild(){}}, head:{appendChild(){}}}, addEventListener(){}, navigator:{} };
win.window = win; win.self = win; win.globalThis = win;
const ctx = vm.createContext(win);
for (const f of ['conjugate.js','vocab-n5.js','vocab-n4.js','vocab-n3.js','vocab-n2.js','vocab-n1.js','grammar-kanji-readings.js',...(process.env.NOEXF?[]:['ex-furigana.js']),'ux-extras.js','grammar-n5.js','grammar-n4.js','grammar-n3.js','grammar-n2.js','grammar-n1.js']) {
  let src = fs.readFileSync(R+f,'utf8');
  if (/^grammar-n\d\.js$/.test(f)) src += `\n;window.__G_${f[9]} = typeof N${f[9]}!=='undefined'?N${f[9]}:null;`;
  try { vm.runInContext(src, ctx, {filename:f}); } catch(e) { console.error('load fail', f, e.message); }
}
const strip = s => s.replace(/<[^>]+>/g,'');
const isK = c => /[一-鿿々]/.test(c);
const rows = []; let total=0, miss=0;
for (const lv of ['5','4','3','2','1']) {
  const G = ctx['__G_'+lv]; if (!G) { console.error('no grammar', lv); continue; }
  for (const g of G) for (const e of (g.eg||[])) {
    total++;
    const html = ctx.furiganaHTMLRich(e.j);
    // 去掉 ruby 區塊後剩下的漢字 = 沒標
    const bare = html.replace(/<ruby>.*?<\/ruby>/g,'').replace(/<[^>]+>/g,'');
    const runs = bare.match(/[一-鿿々]+/g);
    if (runs) { miss++; rows.push({lv, id:g.id, j:strip(e.j), raw:e.j, runs}); }
  }
}
console.log(`文法例句 ${total} 句,有漏標的 ${miss} 句`);
const cnt = {}; rows.forEach(r=>r.runs.forEach(x=>cnt[x]=(cnt[x]||0)+1));
console.log('最常漏:', Object.entries(cnt).sort((a,b)=>b[1]-a[1]).slice(0,40).map(([k,v])=>k+'×'+v).join(' '));
fs.writeFileSync(process.argv[2]||'/dev/null', JSON.stringify(rows,null,0));
console.log(rows.filter(r=>r.id==='n3-2').map(r=>JSON.stringify(r)).join('\n'));
// ── 單字例句也掃(10/30 換了 1,567 字,新例句可能沒進 EX_FURI)
let vt=0, vm2=0; const vrows=[];
for (const lv of ['5','4','3','2','1']) {
  const V = ctx['VOCAB_N'+lv]; if (!V) continue;
  for (const v of V) { const j = v.ex && v.ex.j; if (!j) continue; vt++;
    const html = ctx.furiganaHTMLRich(j);
    const bare = html.replace(/<ruby>.*?<\/ruby>/g,'').replace(/<[^>]+>/g,'');
    const runs = bare.match(/[一-鿿々]+/g);
    if (runs) { vm2++; vrows.push({lv, id:v.w, j, raw:j, runs}); }
  }
}
console.log(`單字例句 ${vt} 句,有漏標的 ${vm2} 句`);
// 產生 gen-ex-furigana.mjs 的輸入格式 [lv, w, 例句(純文字), [裸段…]]
const all = rows.concat(vrows).map(r=>[r.lv, r.id, r.j, r.runs]);
fs.writeFileSync(process.argv[3]||'/dev/null', JSON.stringify(all));
console.log('輸出', all.length, '句');
