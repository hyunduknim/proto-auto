const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
// R554I: the owner brought manual marking back, so round 123+ is no longer blocked.
assert.throws(()=>run('r422ApplyManualPick({markets:[]},{gmTs:"260123",no:1,pick:"승"})'),/MARKET_NOT_UNIQUE/,'round 123 manual pick reaches market lookup');
assert.throws(()=>run('r422ApplyManualPick({markets:[]},{gmTs:"260121",no:1,pick:"승"})'),/MARKET_NOT_UNIQUE/,'older rounds untouched');
assert.equal(run('typeof r533AutoOnly==="function"'),false,'client helpers live in the page, not the worker');
console.log('R554I manual marking allowed again OK');
// R554J: from round 123 manual changes are only accepted before kickoff.
run(`PM={gmTs:"260123",no:1,date:"2026-10-01",time:"18:00",sport:"축구",home:"A",away:"B",marketFamily:"MONEYLINE",choices:[{label:"승",odds:1.5},{label:"무",odds:3},{label:"패",odds:4}]};`);
assert.throws(()=>run('r422ApplyManualPick({gmTs:"260123",markets:[PM]},{gmTs:"260123",no:1,pick:"승",expectedOdds:1.5,expectedMarketId:marketIdentity(PM)})'),/STARTED_OR_SETTLED_LOCK/,'started game refuses manual change');
console.log('R554J manual only before kickoff OK');
