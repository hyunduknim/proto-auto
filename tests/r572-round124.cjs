const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
// power shift for a favourite is positive and close to the backtest (65.4 -> 71.1 domestic only)
const d=run('r572PowerDelta({marketFamily:"HANDICAP",line:2,finalPick:"승",choices:[{label:"승",odds:1.33},{label:"무",odds:4.95},{label:"패",odds:5.10}]})');
assert.ok(d>0.05&&d<0.06,'domestic power shift '+d);
assert.equal(run('r572On({gmTs:"260123"})'),false);assert.equal(run('r572On({gmTs:"260124"})'),true);
assert.equal(run('r572Move({finalPick:"승",r507Overseas:{firstProbs:{승:.70},probs:{승:.64}}})').toFixed(2),'-0.06');
assert.equal(run('r572LeagueBad({r557Calib:{league:{X:{n:16,hits:4,sumP:9.6}}}},{league:"X"})'),true,'25% vs 60% expected over 16 picks');
assert.equal(run('r572LeagueBad({r557Calib:{league:{X:{n:10,hits:1,sumP:6}}}},{league:"X"})'),false,'too few picks');
console.log('R572 round 124 rules OK');
