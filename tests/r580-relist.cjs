const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
run(`const b={gmTs:"260124",date:"2099-10-19",time:"15:30",home:"한국전력",away:"KB손해보험",marketFamily:"HANDICAP",choices:[{label:"승",odds:2.19},{label:"패",odds:1.47}]};
R1=mergeLastKnownOfficialMarkets([{...b,no:9336,line:1.5,marked:true,representativeSelected:true,finalPick:"승"},{...b,no:9340,line:2.5}],[{...b,no:9336,line:-1.5}]);
R2=mergeLastKnownOfficialMarkets([{...b,no:9336,line:1.5,marked:true,representativeSelected:true,finalPick:"승",resultFinal:true,hit:true}],[{...b,no:9336,line:-1.5}]);`);
assert.deepEqual(JSON.parse(run('JSON.stringify(R1.markets.map(m=>m.no+"/"+m.line))')),['9336/-1.5','9340/2.5'],'stale 9336 +1.5 dropped; unrelated missing listing kept');
assert.equal(run('R2.markets.length'),2,'already-settled old listing is never thrown away');
console.log('R580 stale relist OK');
