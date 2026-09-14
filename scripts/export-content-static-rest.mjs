// 用 Firestore REST(FIRE_TOKEN)讀 content/manifest + 各 shard,組成 content-data.json / content-version.json(與 export-content-static.cjs 同形)
// 用法:FIRE_TOKEN=<firebase CLI access token> node scripts/export-content-static-rest.mjs
// (export-content-static.cjs 需要 firebase-admin,本機沒裝;這版只用 REST,與 publish-content-sharded.mjs 的 FIRE_TOKEN 同一顆 token)
import fs from 'node:fs';
import path from 'node:path'; const ROOT=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..'), P='jpnote-1bdd6', TOK=process.env.FIRE_TOKEN;
const B=`https://firestore.googleapis.com/v1/projects/${P}/databases/(default)/documents/content`;
const get=async n=>{const r=await fetch(`${B}/${n}`,{headers:{Authorization:'Bearer '+TOK}});if(!r.ok)throw new Error(n+' '+r.status);const d=await r.json();const f=d.fields||{};return {payload:f.payload?.stringValue,version:f.version?.stringValue};};
const m=await get('manifest');const man=JSON.parse(m.payload);const version=m.version||man.version;
const data={};for(const sh of man.shards){const d=await get('shard_'+sh.name);const p=JSON.parse(d.payload);
  if(sh.name.startsWith('vocab_'))(data.vocab=data.vocab||{})[sh.name.slice(6)]=p;else if(sh.name.startsWith('grammar_'))(data.grammar=data.grammar||{})[sh.name.slice(8)]=p;else data[sh.name]=p;}
fs.writeFileSync(`${ROOT}/content-data.json`,JSON.stringify({version,data}));fs.writeFileSync(`${ROOT}/content-version.json`,JSON.stringify({version}));
console.log('exported version',version,'listening',data.listening_items?.length,'reading',data.reading_passages?.length,'vocab n5',data.vocab?.n5?.length);
