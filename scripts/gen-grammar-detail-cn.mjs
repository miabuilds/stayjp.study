// 文法詳解簡體版:grammar-detail-<級>.js(繁體正本)→ grammar-detail-zh-CN-<級>.js
//   node scripts/gen-grammar-detail-cn.mjs          產五級
//   node scripts/gen-grammar-detail-cn.mjs --report 另外印「保留不轉 / 貼著假名卻轉了」清單供人工檢查
// 為什麼不在瀏覽器直接 OpenCC 整段轉:詳解的中文說明裡夾了很多日文(「友達と映画を見ました」、不是買あない…),
// 整段轉會把日文漢字改成簡體(見→见、買→买、勉強→勉强)。這支只轉中文,日文原樣:
//   1. <span class='gd-jp'>…</span> 整段不碰
//   2. 其他文字裡的漢字段,貼著假名的那一截若在「日文語料」(gd-jp、文法例句、單字與例句)出現過 → 當日文保留
//   3. FC(一定是中文說明的詞)不會被當日文;OV 是少數規則顧不到的個案
// 改了 grammar-detail-<級>.js(build-grammar-detail.mjs)之後要重跑這支。2026-11-25 簡體用戶回報詳解是繁體。
import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const OpenCC = require('opencc-js');
const cv = OpenCC.Converter({ from: 'tw', to: 'cn' });
const ROOT = new URL('../', import.meta.url).pathname;
const LVS = ['n5', 'n4', 'n3', 'n2', 'n1'];
const FC = ["形容詞", "動詞", "名詞", "助詞", "副詞", "辭書形", "結尾", "後面", "前面", "換成", "變成", "因為", "這種", "兩種", "留著", "學過", "複習", "精準", "另一個", "看到", "現在式", "無關", "講話", "長得", "就換", "就選", "就連", "唸", "對人講", "聊天講", "一直講", "東西", "整個", "開頭", "記得", "換回", "怎麼選", "先記", "親眼", "講細節", "別人", "講話時"];
const OV = [['用が問，', '用が问，'], ['講にせよ', '讲にせよ'], ['講にあって', '讲にあって'], ['講に足る', '讲に足る'], ['様态', '様態'], ['际念さい', '際念さい'], ['予想どおり结果', '予想どおり結果']];
const ALWAYS = /^(時間|週間|年間|日間|時)$/;   // 數字後面接這些一定是日文(中文會寫「點/小時」)
const KANA=/[ぁ-ゖァ-ヺー]/, KJ=/[一-鿿々]+/g, DIG=/[0-9０-９]/;
const COUNTER=/^(時間|週間|年間|日間|時|分|日|月|年|円|歳|階|番|回|人|個)/;
function build(g,content,FC){
  const RUNS_R=new Set(),PAIR_L=new Set(),ALL=new Set();
  const add=(s)=>{s=String(s||'').replace(/<[^>]+>/g,'');let m;KJ.lastIndex=0;while((m=KJ.exec(s))){const r=m[0],i=m.index;ALL.add(r);
    if(KANA.test(s[i+r.length]||''))RUNS_R.add(r); if(i>0&&KANA.test(s[i-1]))PAIR_L.add(s[i-1]+r);}};
  for(const id in g){const re=/<span class='gd-jp'>([\s\S]*?)<\/span>/g;let m;while((m=re.exec(g[id])))add(m[1]);}
  for(const lv in content.grammar)for(const d of content.grammar[lv]){add(d.t);add(d.p);(d.eg||[]).forEach(e=>add(e.j));}
  const walk=(o)=>{if(typeof o==='string'){if(KANA.test(o))add(o);}else if(o&&typeof o==='object')for(const k in o)walk(o[k]);};
  walk(content.vocab);
  const fcRe=new RegExp(FC.map(x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).sort((a,b)=>b.length-a.length).join('|'),'g');
  return {RUNS_R,PAIR_L,ALL,fcRe};
}
function convPart(p,J,log){
  const INL=/^<\/?(b|em|strong|i)>$/;
  const skipB=(i)=>{while(i>=0&&p[i]==='>'){const j=p.lastIndexOf('<',i);if(j<0||!INL.test(p.slice(j,i+1)))break;i=j-1;}return i;};
  const skipF=(i)=>{while(i<p.length&&p[i]==='<'){const j=p.indexOf('>',i);if(j<0||!INL.test(p.slice(i,j+1)))break;i=j+1;}return i;};
  const inKanaQuote=(idx,len)=>{const o=p.lastIndexOf('「',idx),c=p.lastIndexOf('」',idx);if(o<0||c>o)return false;const e=p.indexOf('」',idx+len);if(e<0)return false;return KANA.test(p.slice(o,e).replace(/<[^>]+>/g,''));};
  return p.replace(/<[^>]+>|[一-鿿々]+/g,(run,idx)=>{
    if(run[0]==='<')return run;
    const pi=skipB(idx-1), ni=skipF(idx+run.length);
    const prev=pi>=0?p[pi]:'', next=ni<p.length?p[ni]:'';
    const L=KANA.test(prev), Rk=KANA.test(next), D=DIG.test(prev);
    const ctx=()=>p.slice(Math.max(0,idx-12),idx+run.length+12).replace(/<[^>]+>/g,'').replace(/\n/g,' ');
    let fs=run.length,fe=0,m;J.fcRe.lastIndex=0;let any=false;
    while((m=J.fcRe.exec(run))){if(!any)fs=m.index;any=true;fe=m.index+m[0].length;}
    const q=(L||Rk||D||cv(run)!==run)?inKanaQuote(idx,run.length):false;
    if(!L&&!Rk&&!(D&&ALWAYS.test((run.match(COUNTER)||[''])[0]))){ if(q&&!any&&J.ALL.has(run)){ if(cv(run)!==run&&log)log('qkeep',run,run,ctx()); return run; } return cv(run); }
    let a=0,b=run.length;
    if(L){ for(let n=Math.min(run.length,fs);n>0;n--){ if(J.PAIR_L.has(prev+run.slice(0,n))){a=n;break;} }
           if(!a&&q&&!any&&J.ALL.has(run))a=run.length; }
    else if(D){ const c=run.match(COUNTER); if(c&&(Rk||q||ALWAYS.test(c[0]))&&c[0].length<=fs)a=c[0].length; }
    if(Rk){ for(let s=any?fe:0;s<run.length;s++){ if(J.RUNS_R.has(run.slice(s))){b=s;break;} } }
    if(a>=b){ if(log&&cv(run)!==run)log('keep',run,run,ctx()); return run; }
    const head=run.slice(0,a),mid=run.slice(a,b),tail=run.slice(b);
    if(log){ if(head&&cv(head)!==head)log('keep',head,run,ctx()); if(tail&&cv(tail)!==tail)log('keep',tail,run,ctx()); if(cv(mid)!==mid)log('conv',mid,run,ctx()); }
    return head+cv(mid)+tail;
  });
}
function convHTML(html,J,log,OV){
  let out=html.split(/(<span class='gd-jp'>[\s\S]*?<\/span>)/).map((p,i)=>i%2?p:convPart(p,J,log)).join('');
  for(const [a,b] of OV||[])out=out.split(a).join(b);
  return out;
}

const g = {};
for (const lv of LVS) Object.assign(g, new Function('window', fs.readFileSync(ROOT + `grammar-detail-${lv}.js`, 'utf8') + ';return window.GRAMMAR_DETAIL')({}));
const content = JSON.parse(fs.readFileSync(ROOT + 'content-data.json', 'utf8')).data;
const J = build(g, content, FC);
const REPORT = process.argv.includes('--report');
const B = { keep: {}, conv: {}, qkeep: {} };
const log = (id) => (ty, seg, run, c) => { const k = seg + (seg !== run ? ' ⊂' + run : ''); (B[ty][k] = B[ty][k] || []).push(id + ':' + c); };
const jpOf = (s) => (s.match(/<span class='gd-jp'>[\s\S]*?<\/span>/g) || []).join('|');
let changed = 0;
for (const lv of LVS) {
  const out = {};
  for (const id in g) {
    if (!id.startsWith(lv + '-')) continue;
    const c = convHTML(g[id], J, log(id), OV);
    if (jpOf(c) !== jpOf(g[id])) throw new Error('gd-jp 被動到: ' + id);   // 保險:日文區塊必須一字不差
    if (c !== g[id]) changed++;
    out[id] = c;
  }
  fs.writeFileSync(ROOT + `grammar-detail-zh-CN-${lv}.js`, `// 文法詳解 ${lv.toUpperCase()} 簡體版(scripts/gen-grammar-detail-cn.mjs 由繁體正本轉出,別手改)\nwindow.GRAMMAR_DETAIL_L10N=window.GRAMMAR_DETAIL_L10N||{};window.GRAMMAR_DETAIL_L10N["zh-CN"]=Object.assign(window.GRAMMAR_DETAIL_L10N["zh-CN"]||{},${JSON.stringify(out)});\n`);
  console.log(lv, Object.keys(out).length, '條');
}
console.log('有轉換的條目', changed, '/', Object.keys(g).length);
if (REPORT) for (const ty of ['keep', 'qkeep', 'conv']) {
  const e = Object.entries(B[ty]).sort((a, b) => b[1].length - a[1].length);
  console.log(`\n== ${ty}(${ty === 'conv' ? '貼著假名但判定為中文、已轉' : '判定為日文、保留'})${e.length} 種`);
  e.forEach(([k, v]) => console.log(v.length, k, '|', v[0]));
}
