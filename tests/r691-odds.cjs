const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
const L=(g,no,grade,hit,odds)=>({gmTs:g,no,sport:'축구',league:'EPL',marketFamily:'MONEYLINE',pick:'승',odds,displayGrade:grade,hit,date:'2026-10-20',time:'01:00',home:'a'+no,away:'b'+no});
c.ST={gmTs:'260126',settlementLedger:[L('260125',1,'추천',true,1.3),L('260126',2,'일반',false,1.6),L('260126',3,'가장추천',true,1.4),L('260126',4,'추천',true,1.32)],markets:[]};
const x=JSON.parse(run('JSON.stringify(r691Odds(ST))'));assert.equal(x.round,'126');assert.equal(x.nCur,3);assert.equal(x.n,4);assert.equal(x.all[0].all.n,2);assert.equal(x.cur[0].all.n,1);assert.equal(x.cur[2].all.n,1);assert.equal(x.cur[1].rec.h,1);
assert.ok(vm.runInContext('INDEX',c).includes('function r691Render'));console.log('R691 odds bands OK');
