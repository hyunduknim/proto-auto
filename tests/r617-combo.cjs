const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
run(`const mk=(no,fam,ps,h)=>({gmTs:"260125",sourceRound:125,no,date:"2099-01-02",time:String(10+h).padStart(2,"0")+":00",sport:"축구",league:"L",home:"H"+no,away:"A"+no,marketFamily:fam,line:fam==="MONEYLINE"?null:1.5,marked:true,representativeSelected:true,finalPick:fam==="TOTAL"?"언더":"승",finalOdds:1.5,displayGrade:"일반",r554:{ps}});
ST=createState();ST.round=125;ST.gmTs="260125";ST.markets=[mk(1,"HANDICAP",.72,1),mk(2,"HANDICAP",.71,2),mk(3,"MONEYLINE",.66,3),mk(4,"TOTAL",.65,4),mk(5,"MONEYLINE",.61,5),mk(6,"HANDICAP",.55,6)];
B=r617Step(ST);`);
const B=JSON.parse(run('JSON.stringify(B)'));
assert.equal(B.list.length,2,'two combos for the day');
for(const cmb of B.list){const f=cmb.legs.map(l=>l.marketFamily);assert.notEqual(f[0],f[1],'mixed families '+f);}
const all=B.list.flatMap(x=>x.legs.map(l=>l.no)).sort();assert.equal(new Set(all).size,4,'no game reused');assert.ok(!all.includes(6),'below 60% never used');
assert.deepEqual(B.list.map(x=>x.legs.map(l=>l.no).sort((a,b)=>a-b).join('+')).sort(),['1+3','2+4'].sort(),'best joint probability first: '+JSON.stringify(B.list.map(x=>x.legs.map(l=>l.no))));
// settle: leg 1 hit, leg 3 hit → combo hit and counted once
run(`for(const m of ST.markets){if(m.no===1||m.no===3){m.resultFinal=true;m.hit=true;m.result="승";m.settlementStatus="적중";m.date="2000-01-01";}}for(const cb of ST.r617Combos.list)for(const l of cb.legs)if(l.no===1||l.no===3)l.date="2000-01-01";B2=r617Step(ST);B3=r617Step(ST);`);
assert.equal(run('B3.tally.hit'),1,'counted once');assert.equal(run('B3.list.find(x=>x.legs.some(l=>l.no===1)).status'),'hit');
console.log('R617 combo menu OK');
