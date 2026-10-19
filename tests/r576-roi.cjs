const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
run('T={};r576Roi(T,{displayGrade:"추천",finalOdds:1.5,hit:true});r576Roi(T,{displayGrade:"추천",finalOdds:1.4,hit:false});r576Roi(T,{displayGrade:"가장추천",finalOdds:1.3,hit:true});');
assert.equal(run('T.roi["추천"].n'),2);assert.equal(Number(run('T.roi["추천"].ret').toFixed(2)),-0.5);
assert.equal(run('T.roi["추천 이상 합계"].n'),3);assert.equal(Number(run('T.roi["추천 이상 합계"].ret').toFixed(2)),-0.2);
const pub=JSON.parse(run('JSON.stringify(r557Public({r557Calib:{prob:{},grade:{},family:{},roi:T.roi}}).roi)'));
assert.equal(pub.find(x=>x.label==="추천").roiPct,-25);assert.equal(pub.find(x=>x.label==="가장추천").roiPct,30);
console.log('R576 ROI OK');
