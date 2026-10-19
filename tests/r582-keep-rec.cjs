const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
run(`const t=new Date(Date.now()+3*3600000+9*3600000).toISOString(),b={gmTs:"260124",sourceRound:124,date:t.slice(0,10),time:t.slice(11,16),sport:"배구",league:"KOVO컵 남자",home:"OK저축은행 읏맨",away:"현대캐피탈 스카이워커스",period:"FULL"};
ST=createState();ST.round=124;ST.gmTs="260124";ST.markets=[
{...b,no:9331,marketFamily:"MONEYLINE",market:"일반승",choices:[{label:"승",odds:2.77},{label:"패",odds:1.29}],marked:false,representativeSelected:false,displayGrade:"일반",r577Rec:{at:new Date(Date.now()-3600000).toISOString(),pick:"패",odds:1.34,ps:.76}},
{...b,no:9332,marketFamily:"HANDICAP",market:"플러스 핸디캡",line:1.5,choices:[{label:"승",odds:2.02},{label:"패",odds:1.56}],marked:true,representativeSelected:true,finalPick:"패",finalOdds:1.56,hitProbability:.58,displayGrade:"일반"}];
r554Apply(ST);K=r582KeepRec(ST);r554Apply(ST);`);
assert.equal(run('K'),1);
assert.equal(run('ST.markets[0].marked&&ST.markets[0].representativeSelected'),true,'shown 추천 restored');
assert.equal(run('ST.markets[1].marked'),false,'handicap fallback unmarked');
assert.match(run('ST.markets[0].displayGrade'),/추천/,'still graded 추천 despite 1.29 < 1.31 floor');
// a game whose current rep is already 추천 is left alone
run('ST.markets[0].r577Rec.at=new Date().toISOString();K2=r582KeepRec(ST)');assert.equal(run('K2'),0);
console.log('R582 keep shown recommendation OK');
