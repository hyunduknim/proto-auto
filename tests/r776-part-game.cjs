const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
const g={gmTs:'260131',sport:'축구',league:'UCL',date:'2099-11-05',time:'02:45',home:'페네르바흐체SK',away:'리버풀'};
const k={gmTs:'260131',sport:'야구',league:'KBO',date:'2099-11-04',time:'18:30',home:'KT',away:'삼성'};
c.ST={markets:[{...g,no:2457,marketFamily:'MONEYLINE'},{...g,no:2458,marketFamily:'HANDICAP',line:1},{...g,no:2460,marketFamily:'TOTAL',line:3.5},{...g,no:2463,marketFamily:'HANDICAP',line:1},{...g,no:2464,marketFamily:'TOTAL',line:1.5},
 {...k,no:2225,marketFamily:'MONEYLINE'},{...k,no:2227,marketFamily:'HANDICAP',line:-2.5},{...k,no:2228,marketFamily:'TOTAL',line:9.5},{...k,no:2231,marketFamily:'HANDICAP',line:-1.5},{...k,no:2232,marketFamily:'TOTAL',line:4.5}]};
assert.equal(run('r776DropPartial(ST)'),4);assert.deepEqual(run('ST.markets.map(m=>m.no).join(",")'),'2457,2458,2460,2225,2227,2228');
console.log('r776 ok');
