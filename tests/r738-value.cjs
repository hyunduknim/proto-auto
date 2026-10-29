const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
run('currentRoundMarket=()=>true');
const t=new Date(Date.now()+9*3600e3+5*3600e3).toISOString(),date=t.slice(0,10),time=t.slice(11,16),now=Date.now();
const g={gmTs:'260128',sport:'축구',league:'EPL',date,time,home:'첼시',away:'토트넘'};
c.ST={gmTs:'260128',markets:[
 {...g,no:1,marketFamily:'MONEYLINE',choices:[{label:'승',odds:1.9},{label:'무',odds:3.4},{label:'패',odds:4}],r507Overseas:{at:now,probs:{승:.56,무:.26,패:.18}}},  // 승: .56*1.9-1 = +6.4%
 {...g,no:2,marketFamily:'TOTAL',line:2.5,choices:[{label:'언더',odds:1.8},{label:'오버',odds:1.9}],r507Overseas:{at:now,probs:{언더:.6,오버:.4}}}, // 언더 +8% (model >=6)
 {...g,no:3,marketFamily:'HANDICAP',line:-1,choices:[{label:'승',odds:2.5},{label:'무',odds:3.4},{label:'패',odds:2.4}],r507Overseas:{at:now,probs:{승:.41,무:.24,패:.35}}} // 승 +2.5% < 6
]};
const L=run('r738Value(ST)').list.filter(x=>x.val);
assert.equal(L.length,2);assert.equal(L.map(x=>x.no+x.pick).sort().join(),'1승,2언더');assert.equal(L.find(x=>x.no===1).ev,6.4);
console.log('r738 ok');
