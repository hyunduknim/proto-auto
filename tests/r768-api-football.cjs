const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
const t=Date.parse('2099-01-01T05:00:00+09:00');
c.ST={r507Overseas:{},r768:{fx:[{id:1,t,lg:'UEFA Champions League',h:'Barcelona',a:'Aston Villa',inj:{h:[['P. One','Missing Fixture','Knee Injury'],['P. Two','Questionable','Illness']],a:[['Q. Red','Missing Fixture','Red Card']]},lu:{h:{f:'4-3-3',xi:Array(11).fill('x')},a:{f:'4-2-3-1',xi:Array(11).fill('y')}}},
 {id:2,t,lg:'UEFA Champions League',h:'Villarreal',a:'Paris Saint Germain',inj:{h:[],a:[]},lu:null}]}};
c.M={sport:'축구',gmTs:'260130',no:1,date:'2099-01-01',time:'05:00',home:'바르셀로나',away:'애스턴 빌라'};
const x=run('r768Info(ST,M)');assert.equal(x.id,1);assert.equal(x.inj.h[0].w,'부상');assert.equal(x.inj.h[1].q,true);assert.equal(x.inj.a[0].w,'퇴장 징계');assert.equal(x.lu.h.f,'4-3-3');
c.M2={...c.M,no:2,home:'비야레알',away:'파리 생제르맹',r507Overseas:{api:'Villarreal vs Paris Saint-Germain'}};assert.equal(run('r768Info(ST,M2)').id,2);
c.M3={...c.M,no:3,home:'포항 스틸러스',away:'감바 오사카'};assert.equal(run('r768Info(ST,M3)'),null,'no wrong match');
c.M4={...c.M,sport:'농구'};assert.equal(run('r768Info(ST,M4)'),null);
assert.ok(vm.runInContext('INDEX',c).includes('결장 (API-Football)'));
console.log('r768 ok');
