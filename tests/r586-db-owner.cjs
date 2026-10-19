const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
run(`const b={gmTs:"260124",sourceRound:124,date:"2026-10-19",time:"19:00",sport:"농구",league:"KBL",home:"원주DB 프로미",away:"대구한국가스공사 페가수스"};
ST=createState();ST.round=124;ST.gmTs="260124";ST.markets=[
{...b,no:9357,marketFamily:"MONEYLINE",choices:[{label:"승",odds:1.51},{label:"패",odds:2.11}],marked:true,representativeSelected:true,finalPick:"승",finalOdds:1.51,displayGrade:"일반",r554:{ps:.62},resultFinal:true,hit:false,result:"패",settlementStatus:"낙첨"},
{...b,no:9359,marketFamily:"HANDICAP",line:-3.5,choices:[{label:"승",odds:1.77},{label:"패",odds:1.75}],marked:false},
{...b,no:9360,marketFamily:"TOTAL",line:172.5,choices:[{label:"언더",odds:1.8},{label:"오버",odds:1.72}],marked:false}];
ST.r557Calib={seen:[],prob:{},grade:{},family:{},voids:0};r557Track(ST);r570OwnerScores(ST);r557Track(ST);`);
assert.equal(run('ST.markets[0].settlementStatus'),'적중','wrongly settled 낙첨 flipped to 적중');
assert.equal(run('ST.r556LegResults["260124:9359"].outcome'),'승');assert.equal(run('ST.r556LegResults["260124:9360"].outcome'),'오버');
assert.equal(run('ST.r557Calib.v124.grade["일반"].n'),1,'counted once');assert.equal(run('ST.r557Calib.v124.grade["일반"].hits'),1,'as a hit');
console.log('R586 DB owner score OK');
