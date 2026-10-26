const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
const mkt=(gmTs,no,fam,line,res,score)=>({gmTs,no,sport:'농구',league:'NBA',home:'새크라멘토 킹스',away:'멤피스 그리즐리스',date:'2026-10-26',time:'10:00',marketFamily:fam,line,choices:[{label:'언더',odds:1.76},{label:'오버',odds:1.9}],resultFinal:!!res,result:res,resultScoreText:score});
c.ST={r662V:2,r662Res:{},r662Posts:[{id:'a',by:'',groups:[{name:'x',picks:[{gmTs:'260126',no:800,pick:'언더',label:'[언오버] 새크라멘토-멤피스 언더 236.5'},{gmTs:'260126',no:771,pick:'승',label:'[일반승] 뉴욕 승'}]}]}],
markets:[mkt('260127',800,'TOTAL',236.5,'언더','235:0')]};
run('r662Settle(ST)');const r=run('ST.r662Res');
assert.equal(r['260126:800:언더'].st,'hit','carried-over game settles');assert.equal(r['260126:771:승'].st,'miss','owner confirmed miss');
c.ST2={r662V:2,r662Res:{},r662Posts:[{id:'a',by:'',groups:[{name:'x',picks:[{gmTs:'260126',no:800,pick:'언더',label:'[언오버] 보스턴-뉴욕 언더 220.5'}]}]}],markets:[mkt('260127',800,'TOTAL',236.5,'언더','235:0')]};
run('r662Settle(ST2)');assert.equal(run("ST2.r662Res['260126:800:언더'].st"),'pre','different game under the same number is not used');
console.log('R699 carry OK');
