const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
const L=(g,no,grade,hit,odds)=>({gmTs:g,no,sport:'축구',league:'EPL',marketFamily:'MONEYLINE',pick:'승',odds,displayGrade:grade,hit,date:'2026-10-20',time:'01:00',home:'a'+no,away:'b'+no,resultFinal:true,marked:true,representativeSelected:true});
c.ST={settlementLedger:[L('260125',1,'추천',true,1.5),L('260125',2,'일반',false,1.6),L('260126',3,'가장추천',true,1.4),L('260126',4,'추천',false,1.5),L('260126',5,'일반',true,1.8)],markets:[]};
const tr=JSON.parse(run('JSON.stringify(r655Data(ST).trend)'));assert.equal(tr.length,2);assert.equal(tr[0].r,'125');assert.equal(tr[0].all.n,2);assert.equal(tr[0].rec.n,1);assert.equal(tr[1].rec.h,1);assert.equal(tr[1].all.h,2);
const ix=vm.runInContext('INDEX',c);assert.ok(ix.includes('function r667Render')&&ix.includes('id="r667Box"'));
console.log('R667 trend OK',JSON.stringify(tr));
