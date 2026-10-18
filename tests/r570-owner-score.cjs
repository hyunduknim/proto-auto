const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
run(`ST={markets:[
{gmTs:"260123",no:9196,date:"2026-10-18",time:"20:00",home:"베이징 궈안",away:"칭다오 시하이안",marketFamily:"MONEYLINE",choices:[{label:"승",odds:1.34},{label:"무",odds:4.4},{label:"패",odds:5.7}],marked:true,representativeSelected:true,finalPick:"승",resultFinal:true,hit:false,settlementStatus:"낙첨",result:"패"},
{gmTs:"260123",no:9197,date:"2026-10-18",time:"20:00",home:"베이징 궈안",away:"칭다오 시하이안",marketFamily:"HANDICAP",line:-1,choices:[{label:"승",odds:2.01},{label:"무",odds:3.55},{label:"패",odds:2.7}],marked:false},
{gmTs:"260123",no:9198,date:"2026-10-18",time:"20:00",home:"베이징 궈안",away:"칭다오 시하이안",marketFamily:"TOTAL",line:3.5,choices:[{label:"언더",odds:1.63},{label:"오버",odds:1.91}],marked:false}]};r570OwnerScores(ST)`);
assert.equal(run('ST.markets[0].settlementStatus'),'적중');assert.equal(run('ST.markets[0].hit'),true);assert.equal(run('ST.markets[0].resultScoreText'),'1:0');
assert.equal(run('ST.r556LegResults["260123:9197"].outcome'),'무');assert.equal(run('ST.r556LegResults["260123:9198"].outcome'),'언더');
run('ST.markets[0].settlementStatus="낙첨";ST.markets[0].hit=false;r570OwnerScores(ST)');assert.equal(run('ST.markets[0].settlementStatus'),'적중','re-applied if flipped back');
console.log('R570 owner score OK');
