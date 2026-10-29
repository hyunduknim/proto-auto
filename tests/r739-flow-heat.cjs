const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
run('currentRoundMarket=()=>true');
const t=new Date(Date.now()+9*3600e3+5*3600e3).toISOString();
const m={gmTs:'260128',no:1,sport:'야구',league:'KBO',date:t.slice(0,10),time:t.slice(11,16),home:'KIA',away:'삼성',marketFamily:'MONEYLINE',
 choices:[{label:'승',odds:1.59,openingOdds:1.64,betShare:.92},{label:'패',odds:1.92,openingOdds:1.85,betShare:.08}]};
c.ST={gmTs:'260128',markets:[m]};
let S=run('r739Summary(ST)');assert.equal(S.list.length,1);assert.equal(S.list[0].flow.l,'승');assert.equal(S.list[0].heat.l,'승');
run('r739Step(ST)');assert.ok(c.ST.r739.snap['260128:1']);
// game ends: 패 wins
Object.assign(m,{date:'2026-01-01',time:'00:00',resultFinal:true,result:'패'});run('r739Step(ST)');
S=run('r739Summary(ST)');assert.equal(S.flow.n,1);assert.equal(S.flow.hit,0);assert.equal(S.heat.n,1);
console.log('r739 ok');
