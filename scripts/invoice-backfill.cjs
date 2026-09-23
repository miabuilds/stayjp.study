// 補開歷史發票:發票功能上線(2026-09-22)之前的綠界收款,國稅局說補開就好。
//
// 用法(預設只列不開):
//   node scripts/invoice-backfill.cjs                 # dry-run:列出要補的、算字軌夠不夠
//   CONFIRM=yes node scripts/invoice-backfill.cjs     # 真的開(每次最多 LIMIT 張,預設 20)
//   CONFIRM=yes LIMIT=61 node scripts/invoice-backfill.cjs
//
// 規則:
//   · 只碰 go-live 之前、payment_method=ecpay、status=success、type=subscribe/renew 的交易
//   · 鍵:transaction 的 external_id 若在這批裡唯一就用它,否則用 T+文件id(舊續扣共用單號會撞)
//   · 已有 invoices/{key} 且 status=issued/invalid/allowance → 跳過(冪等,重跑安全)
//   · 發票日期只能是今天(綠界不給回填日期),原交易日寫進備註
//   · 開之前先查字軌剩幾張,不夠就停,不會開到一半沒號碼
// 認證:同 scripts/pricing-metrics.mjs(firebase login 的 refresh token);金鑰走環境變數。
const fs=require('fs'),os=require('os'),path=require('path');
const admin=require('../functions/node_modules/firebase-admin');
const { issueInvoice } = require('../functions/lib/utils/ecpay-invoice.js');
const { aesEncrypt, aesDecrypt } = require('../functions/lib/utils/ecpay-aes.js');

const GO_LIVE = new Date('2026-09-22T13:00:00Z').getTime();   // 9/22 21:00 台北 部署發票功能
const CONFIRM = process.env.CONFIRM === 'yes';
const LIMIT = Number(process.env.LIMIT || 20);
const RESERVE = 10;   // 字軌至少保留這麼多張給接下來的正常收款

const cfg=JSON.parse(fs.readFileSync(os.homedir()+'/.config/configstore/firebase-tools.json','utf8'));
const tmp=path.join(os.tmpdir(),`adc-${process.pid}.json`);
fs.writeFileSync(tmp,JSON.stringify({type:'authorized_user',client_id:'563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com',client_secret:'j9iVZfS8kkCEFUPaAeJV0sAi',refresh_token:cfg.tokens.refresh_token}),{mode:0o600});
process.env.GOOGLE_APPLICATION_CREDENTIALS=tmp; process.on('exit',()=>{try{fs.unlinkSync(tmp)}catch{}});
admin.initializeApp({credential:admin.credential.applicationDefault(),projectId:'jpnote-1bdd6'});
const db=admin.firestore();
const PLAN_NAME={monthly:'月費訂閱',yearly:'年費訂閱',yearly_early_bird:'年費訂閱(早鳥)',lifetime:'買斷'};
const tw=(ms)=>new Date(ms+8*3600e3).toISOString().slice(0,10);

async function remainingWords(){
  const M=process.env.ECPAY_INV_MERCHANT_ID,K=process.env.ECPAY_INV_HASH_KEY,V=process.env.ECPAY_INV_HASH_IV;
  const y=String(new Date().getFullYear()-1911), term=Math.ceil((new Date().getMonth()+1)/2);
  const res=await fetch('https://einvoice.ecpay.com.tw/B2CInvoice/GetInvoiceWordSetting',{method:'POST',headers:{'content-type':'application/json'},
    body:JSON.stringify({MerchantID:M,RqHeader:{Timestamp:Math.floor(Date.now()/1000),Revision:'3.0.0'},Data:aesEncrypt({MerchantID:M,InvoiceYear:y,InvoiceTerm:0,UseStatus:0,InvoiceCategory:1},K,V)})});
  const o=await res.json(); if(Number(o.TransCode)!==1) throw new Error('查字軌 TransCode='+o.TransCode);
  const inner=(o.Data&&typeof o.Data==='object')?o.Data:aesDecrypt(String(o.Data||''),K,V);
  let remain=0; for(const r of (inner.InvoiceInfo||[])){ if(Number(r.InvoiceTerm)!==term||Number(r.UseStatus)!==2) continue;
    const s=Number(r.InvoiceStart),e=Number(r.InvoiceEnd),used=r.InvoiceNo?Number(r.InvoiceNo)-s+1:0; remain+=e-s+1-Math.max(0,used); }
  return remain;
}

(async()=>{
  if(CONFIRM && process.env.ECPAY_PRODUCTION!=='true') { console.error('CONFIRM=yes 但 ECPAY_PRODUCTION 不是 true,拒絕(會打到測試主機)'); process.exit(1); }
  const snap=await db.collection('transactions').where('payment_method','==','ecpay').where('status','==','success').get();
  const all=snap.docs.map(d=>({id:d.id,...d.data(),at:d.data().occurred_at?.toMillis?.()||0}))
    .filter(t=>(t.type==='subscribe'||t.type==='renew')&&t.at<GO_LIVE&&Number(t.amount_twd)>0).sort((a,b)=>a.at-b.at);
  const extCount=new Map(); for(const t of all) extCount.set(t.external_id,(extCount.get(t.external_id)||0)+1);
  const keyOf=(t)=>{ const e=String(t.external_id||''); return (e&&extCount.get(e)===1)?e.replace(/[^A-Za-z0-9]/g,''):('T'+t.id).replace(/[^A-Za-z0-9]/g,''); };

  const todo=[]; let already=0;
  for(const t of all){ const key=keyOf(t); const inv=(await db.doc('invoices/'+key).get()).data();
    if(inv&&['issued','invalid','allowance'].includes(inv.status)){already++;continue;} todo.push({...t,key}); }
  const sum=todo.reduce((s,t)=>s+Number(t.amount_twd),0);
  console.log(`上線前綠界收款 ${all.length} 筆;已有發票 ${already} 筆;待補開 ${todo.length} 筆,合計 NT$${sum.toLocaleString()}`);
  const remain = process.env.ECPAY_INV_MERCHANT_ID ? await remainingWords() : null;
  if(remain!=null) console.log(`本期字軌剩 ${remain} 張;保留 ${RESERVE} 張給正常收款 → 這次最多能補 ${Math.max(0,remain-RESERVE)} 張`);
  if(!CONFIRM){
    console.log('\n(dry-run,沒有開任何發票。列前 15 筆:)');
    todo.slice(0,15).forEach(t=>console.log(`  ${tw(t.at)} ${t.type.padEnd(9)} NT$${String(t.amount_twd).padStart(5)} ${String(t.plan).padEnd(17)} key=${t.key}`));
    if(todo.length>15) console.log(`  … 還有 ${todo.length-15} 筆`);
    process.exit(0);
  }
  const cap=Math.min(LIMIT, remain==null?LIMIT:Math.max(0,remain-RESERVE), todo.length);
  console.log(`\n開始補開,這次 ${cap} 張…`);
  let ok=0,bad=0;
  for(const t of todo.slice(0,cap)){
    const ref=db.doc('invoices/'+t.key);
    let email=''; try{ email=(await admin.auth().getUser(t.uid)).email||''; }catch{} if(!email){ email=String(((await db.doc('users/'+t.uid).get()).data()||{}).email||''); }
    if(!email){ console.log(`  ✗ ${t.key} 找不到 email,跳過`); bad++; continue; }
    await ref.set({uid:t.uid,trade_no:t.external_id||null,txn_id:t.id,amount_twd:Number(t.amount_twd),email,status:'issuing',created_at:Date.now(),backfill:true,paid_at:t.at},{merge:true});
    const r=await issueInvoice({relateNumber:t.key,email,amountTwd:Number(t.amount_twd),itemName:`StayJP ${PLAN_NAME[t.plan]||t.plan}`,remark:`補開:原交易日 ${tw(t.at)}`});
    if(r.ok&&r.data?.InvoiceNo){ await ref.set({status:'issued',invoice_no:r.data.InvoiceNo,invoice_date:String(r.data.InvoiceDate||'').slice(0,10),issued_at:Date.now()},{merge:true}); ok++; console.log(`  ✓ ${tw(t.at)} NT$${t.amount_twd} → ${r.data.InvoiceNo}`); }
    else { await ref.set({status:'failed',fail_code:r.rtnCode??null,fail_msg:r.rtnMsg||r.error||null},{merge:true}); bad++; console.log(`  ✗ ${tw(t.at)} NT$${t.amount_twd} 失敗:${r.rtnCode} ${r.rtnMsg||r.error}`); }
  }
  console.log(`\n完成:成功 ${ok} / 失敗 ${bad} / 這批之後還剩 ${todo.length-cap} 筆沒補`);
  process.exit(0);
})().catch(e=>{console.error('失敗:',e.message);process.exit(1);});
