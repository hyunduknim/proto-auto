const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
assert.throws(()=>run('r422ApplyManualPick({markets:[]},{gmTs:"260123",no:1,pick:"승"})'),/MANUAL_REMARKING_REMOVED_AUTO_ONLY/,'round 123 rejects manual re-marking');
assert.throws(()=>run('r422ApplyManualPick({markets:[]},{gmTs:"260122",no:1,pick:"승"})'),/MANUAL_REMARKING_REMOVED_AUTO_ONLY/,'hidden and blocked from the current round 122 too');
assert.throws(()=>run('r422ApplyManualPick({markets:[]},{gmTs:"260121",no:1,pick:"승"})'),/MARKET_NOT_UNIQUE/,'older rounds untouched');
const html=fs.readFileSync('자동마킹.js','utf8');assert.ok(html.includes("r533HideManual();"),'screen hides the manual button from round 123');
console.log('R533B auto-only from round 122 OK');
