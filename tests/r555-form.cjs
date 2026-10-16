const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
run(`const T=(o)=>({n:o.length,wins:o.filter(x=>x==="승").length,draws:o.filter(x=>x==="무").length,losses:o.filter(x=>x==="패").length,matches:o.map(x=>({outcome:x}))});
TD={home:T(["패","패","승","패","승"]),away:T(["승","승","승","패","승"])};r482TeamData=()=>TD;`);
// Hanshin(home) 2-3 on a 2-game losing run vs Yokohama 4-1 on a 3-game winning run, pick 승 -> against
let f=run('r555Form({},{marketFamily:"MONEYLINE",finalPick:"승",home:"한신",away:"요코하마"})');
assert.equal(f.flag,'against');assert.equal(f.away.st,'3연승');assert.equal(f.home.st,'2연패');
assert.equal(run('r555Form({},{marketFamily:"HANDICAP",finalPick:"패",home:"한신",away:"요코하마"}).flag'),'with');
assert.equal(run('r555Form({},{marketFamily:"TOTAL",finalPick:"오버",home:"a",away:"b"}).flag'),null,'totals carry no side');
// correction stays off until 40 settled picks show a real gap
run('S={r555Track:{flags:{against:{n:30,hits:12,sumP:19.5}},seen:[]}}');
assert.equal(run('r555Adj(S,"against").adj'),0,'below 40 samples: display only');
run('S.r555Track.flags.against={n:120,hits:60,sumP:78}');// 50% vs model 65%
const a=run('r555Adj(S,"against").adj');assert.ok(a<0&&a>=-0.05,'proven weakness lowers probability, capped');
run('S.r555Track.flags.against={n:120,hits:77,sumP:78}');assert.equal(run('r555Adj(S,"against").adj'),0,'no real gap -> no change');
// tracking counts each settled pick once
run(`S2={markets:[{gmTs:"260123",no:1,resultFinal:true,marked:true,representativeSelected:true,hit:false,r555:{flag:"against"},r554:{psBase:.64,ps:.64}}]};r555Track(S2);r555Track(S2);`);
assert.equal(run('S2.r555Track.flags.against.n'),1);
console.log('R555 recent form flags + data-driven correction OK');
