const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
run(`const b={gmTs:"260124",date:"2026-10-20",time:"04:00",sport:"축구",league:"라리가",home:"헤타페",away:"라요 바예카노",marked:true,representativeSelected:true};
ST={markets:[{...b,no:1,marketFamily:"MONEYLINE",choices:[{label:"승",odds:2.3},{label:"무",odds:2.9},{label:"패",odds:3.3}],finalPick:"무",resultFinal:true,hit:true,settlementStatus:"적중",result:"무",resultScoreText:"0:0",resultSource:"X"},
{...b,no:2,marketFamily:"TOTAL",line:1.5,choices:[{label:"언더",odds:1.6},{label:"오버",odds:2.2}],finalPick:"언더",resultFinal:true,hit:true,settlementStatus:"적중",result:"언더",resultScoreText:"0:0",resultSource:"X"}]};r570OwnerScores(ST);`);
assert.equal(run('ST.markets[0].settlementStatus'),'적중','draw still a draw');assert.equal(run('ST.markets[0].resultScoreText'),'1:1');
assert.equal(run('ST.markets[1].settlementStatus'),'낙첨','under 1.5 flips to miss at 1:1');assert.equal(run('ST.markets[1].r586Was.score'),'0:0','original kept for diagnosis');
console.log('R590 Getafe 1:1 OK');
