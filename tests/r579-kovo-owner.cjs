const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
run(`const b={gmTs:"260124",date:"2026-10-19",sport:"배구",league:"KOVO컵남",marked:true,representativeSelected:true,resultFinal:false};
ST={markets:[
{...b,no:9331,time:"13:00",home:"OK저축은행",away:"현대캐피탈",marketFamily:"MONEYLINE",choices:[{label:"승",odds:2.77},{label:"패",odds:1.29}],finalPick:"패"},
{...b,no:9332,time:"13:00",home:"OK저축은행",away:"현대캐피탈",marketFamily:"HANDICAP",line:1.5,choices:[{label:"승",odds:2.02},{label:"패",odds:1.56}],finalPick:"패"},
{...b,no:9333,time:"13:00",home:"OK저축은행",away:"현대캐피탈",marketFamily:"TOTAL",line:182.5,choices:[{label:"언더",odds:1.87},{label:"오버",odds:1.66}],finalPick:"오버"},
{...b,no:9336,time:"15:30",home:"한국전력",away:"KB손해보험",marketFamily:"HANDICAP",line:-1.5,choices:[{label:"승",odds:2.19},{label:"패",odds:1.47}],finalPick:"승"}]};r570OwnerScores(ST)`);
assert.equal(run('ST.markets[0].settlementStatus'),'적중');
assert.equal(run('ST.markets[1].settlementStatus'),'낙첨','+1.5 home: 3.5:3 → 승');
assert.equal(run('ST.markets[2].resultFinal'),false,'set score never settles a points total');
assert.equal(run('ST.markets[3].settlementStatus'),'적중','-1.5 home: 1.5:1 → 승');
console.log('R579 KOVO owner scores OK');
