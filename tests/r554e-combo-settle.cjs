const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto,Date});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
// four recommended games; real clock is mocked through game times relative to now
run(`const T=(h)=>{const d=new Date(Date.now()+h*3600000+9*3600000);return {date:d.toISOString().slice(0,10),time:d.toISOString().slice(11,16)}};
MK=(no,h,odds,ps,pick)=>({gmTs:"260123",no,...T(h),home:"H"+no,away:"A"+no,marketFamily:"MONEYLINE",marked:true,representativeSelected:true,displayGrade:"추천",finalPick:pick||"승",finalOdds:odds,r554:{ps}});
S={gmTs:"260123",markets:[MK(1,1,1.58,.68),MK(2,2,1.44,.69),MK(3,3,1.52,.65),MK(4,4,1.75,.63)]};`);
let box=run('r554ComboStep(S)');
assert.equal(box.list.length,2,'two open combos');
assert.ok(box.list.every(x=>x.odds>=3&&x.legs.length>=2),'every combo reaches 3x');
assert.equal(box.list[0].legs.map(l=>l.no).join(),'1,2,3','best-probability combo first');
// first game kicks off: combo is fixed
run(`for(const m of S.markets.filter(m=>m.no===1)){Object.assign(m,T(-0.1));}`);
box=run('r554ComboStep(S)');
const fixed=box.list.filter(x=>x.locked);
assert.equal(fixed.length,2,'both combos containing game 1 lock at its kickoff');
assert.ok(fixed.every(x=>x.status==='live'));
// game 1 hits, game 2 misses -> combo with 2 misses; pick change after lock does not alter combo
run(`S.markets[0].resultFinal=true;S.markets[0].result="승";S.markets[0].settlementStatus="적중";
Object.assign(S.markets[1],T(-0.1));S.markets[1].resultFinal=true;S.markets[1].result="패";S.markets[1].settlementStatus="낙첨";S.markets[2].finalPick="패";`);
box=run('r554ComboStep(S)');
const a=box.list.find(x=>x.id.includes('260123:2'));assert.equal(a.status,'miss','any losing leg settles the combo as 낙첨');
assert.equal(a.legs.find(l=>l.no===3).pick,'승','locked leg keeps the pick it was combined with');
// all legs hit -> 적중 with product odds; void leg counts as 1.0
run(`S2={gmTs:"260123",markets:[MK(1,1,1.8,.7),MK(2,2,1.9,.7)]};`);run('r554ComboStep(S2)');
run(`for(const m of S2.markets){Object.assign(m,T(-0.2));m.resultFinal=true;m.result="승";m.settlementStatus="적중";}`);
box=run('r554ComboStep(S2)');assert.equal(box.list[0].status,'hit');assert.equal(box.list[0].finalOdds,3.42);
run(`S2.markets[1].settlementType="VOID";S2.markets[1].settlementStatus="적특";`);box=run('(r554ComboSettle(S2),S2.r554Combos)');
assert.equal(box.list[0].status,'hit');assert.equal(box.list[0].finalOdds,1.8,'void leg pays 1.0');
console.log('R554E combo fixed at kickoff + live settlement OK');
