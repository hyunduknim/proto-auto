const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
run(`analyzeChoiceRows=function(x){return (x.choices||[]).map(c=>({pick:c.label,odds:c.odds,calibratedP:c.p}))};
mk=(gm,mlP,mlOdds)=>{const t=new Date(Date.now()+5*3600000+9*3600000).toISOString(),b={gmTs:gm,sourceRound:Number(gm.slice(3)),date:t.slice(0,10),time:t.slice(11,16),sport:"축구",league:"EPL",home:"아스널",away:"첼시"};
const S=createState();S.round=Number(gm.slice(3));S.gmTs=gm;S.markets=[
{...b,no:1,marketFamily:"HANDICAP",line:-1,choices:[{label:"승",odds:2.3},{label:"패",odds:1.45}],marked:true,representativeSelected:true,finalPick:"패",finalOdds:1.45,hitProbability:.70},
{...b,no:2,marketFamily:"MONEYLINE",choices:[{label:"승",odds:mlOdds,p:mlP},{label:"무",odds:4.2,p:.2},{label:"패",odds:6,p:.12}]}];
r554Apply(S);r587Diversify(S);return S};`);
run('A=mk("260125",.67,1.40)');
assert.equal(run('A.markets[0].marked'),false,'플핸 replaced');assert.equal(run('A.markets[1].marked&&A.markets[1].finalPick'),'승');assert.match(run('A.markets[1].displayGrade'),/추천/);
run(`B=mk("260125",.48,1.95)`);assert.equal(run('B.markets[0].marked'),true,'no qualifying alternative → 플핸 stays');assert.equal(run('B.markets[1].marked||false'),false);
run('C=mk("260124",.67,1.40)');assert.equal(run('C.markets[0].marked'),true,'round 124 unchanged');
run('D=mk("260125",.70,1.25)');assert.equal(run('D.markets[0].marked'),true,'odds floor still applies');
console.log('R587 less plus-handicap OK');
