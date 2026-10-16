const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
// R554I: the owner brought manual marking back, so round 123+ is no longer blocked.
assert.throws(()=>run('r422ApplyManualPick({markets:[]},{gmTs:"260123",no:1,pick:"승"})'),/MARKET_NOT_UNIQUE/,'round 123 manual pick reaches market lookup');
assert.throws(()=>run('r422ApplyManualPick({markets:[]},{gmTs:"260121",no:1,pick:"승"})'),/MARKET_NOT_UNIQUE/,'older rounds untouched');
assert.equal(run('typeof r533AutoOnly==="function"'),false,'client helpers live in the page, not the worker');
console.log('R554I manual marking allowed again OK');
