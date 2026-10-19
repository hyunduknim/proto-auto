const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
const mk=rec=>run(`{const b={gmTs:"260124",sourceRound:124,date:"2026-10-19",time:"13:00",sport:"배구",league:"KOVO컵 남자",home:"OK저축은행 읏맨",away:"현대캐피탈 스카이워커스",period:"FULL"};
ST=createState();ST.round=124;ST.gmTs="260124";ST.markets=[
{...b,no:9331,marketFamily:"MONEYLINE",choices:[{label:"승",odds:2.77},{label:"패",odds:1.29}],marked:false,representativeSelected:false,displayGrade:"일반"${rec?',r577Rec:{at:"2026-10-19T03:00:00Z",pick:"패",odds:1.34,ps:.76}':''}},
{...b,no:9332,marketFamily:"HANDICAP",line:1.5,choices:[{label:"승",odds:2.02},{label:"패",odds:1.56}],marked:true,representativeSelected:true,finalPick:"패",finalOdds:1.56,displayGrade:"일반",r554:{ps:.58}}];
r570OwnerScores(ST);r557Track(ST);ST.settledCards={gmTs:"260124",rows:[{gmTs:"260124",no:9332}]};
F=r585Fix9331(ST);r570OwnerScores(ST);r557Track(ST);F2=r585Fix9331(ST);}`);
mk(true);
assert.equal(run('ST.markets[1].marked'),false,'9332 removed');assert.equal(run("ST.settledCards.rows.some(x=>x.no===9332)"),false);
assert.equal(run('ST.markets[0].settlementStatus'),'적중');assert.equal(run('ST.markets[0].displayGrade'),'추천');assert.equal(run('ST.markets[0].finalOdds'),1.34);
assert.equal(run('ST.r557Calib.v124.grade["일반"]'),undefined,'9332 일반 miss taken out of the 124 table');
assert.equal(run('ST.r557Calib.v124.grade["추천"].hits'),1);assert.equal(run('F2'),0,'idempotent');
mk(false);
assert.equal(run('F'),0);assert.equal(run('ST.markets[1].marked'),true,'no record → nothing changes');assert.equal(run('ST.r585.applied'),false);
console.log('R585 restore 9331 OK');
