const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
c.ST={markets:[{gmTs:'260127',no:833,home:'S알나스르',away:'알와슬',date:'2026-10-27',time:'03:15',league:'ACLE',sport:'축구',marketFamily:'MONEYLINE'}],
settlementLedger:[{gmTs:'260126',no:5,date:'2026-10-25',time:'19:00',home:'A',away:'B',marketFamily:'MONEYLINE',pick:'승',odds:1.5,settlementStatus:'적특',displayGrade:'추천'},{gmTs:'260126',no:6,pick:'승',settlementStatus:'적중'}]};
const b=run('r701Box(ST)');assert.equal(b.owner[0].home,'S알나스르');assert.equal(b.owner[0].why,'AFC 공식 연기');assert.equal(b.settled.length,1);assert.equal(b.settled[0].no,5);
assert.equal(run("r701Why({gmTs:'260127',no:833})"),'AFC 공식 연기');assert.equal(run("r701Why({gmTs:'260127',no:829,marketRows:[{no:829}]})"),null);
assert.equal(run("r701Why({gmTs:'260126',no:833})"),null,'other round untouched');
const w=run("r504PublicWireView({markingGames:[{gmTs:'260127',no:833,marketRows:[{no:833}]}]})");assert.equal(w.markingGames[0].r701Void,'AFC 공식 연기');
const ix=run('INDEX');assert.ok(ix.includes('id="tabVoid"')&&ix.includes('function r701Render'));
console.log('R701 void OK');
