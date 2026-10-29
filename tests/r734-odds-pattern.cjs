const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
run('currentRoundMarket=()=>true;settlementAllowed=()=>true');
const mk=[];let no=1;
for(let i=0;i<8;i++){const g={gmTs:'260127',sport:'축구',league:'EPL',date:'2026-10-2'+(i%9),time:'20:00',home:'H'+i,away:'A'+i};const sc=i<6?'2:0':'1:1';
 mk.push({...g,no:no++,marketFamily:'MONEYLINE',choices:[{label:'승',odds:1.52+i*0.005},{label:'무',odds:3.9},{label:'패',odds:5.6}],resultFinal:true,result:i<6?'승':'무',resultScoreText:sc,r507Overseas:{firstProbs:{승:.60,무:.25,패:.15},probs:{승:.65,무:.22,패:.13}}});
 mk.push({...g,no:no++,marketFamily:'TOTAL',line:2.5,choices:[{label:'언더',odds:1.7},{label:'오버',odds:1.95}],resultFinal:true,result:'언더',resultScoreText:sc});}
const up={gmTs:'260128',sport:'축구',league:'EPL',date:new Date(Date.now()+9*3600e3+6*3600e3).toISOString().slice(0,10),time:new Date(Date.now()+9*3600e3+6*3600e3).toISOString().slice(11,16),home:'첼시',away:'토트넘',no:500,marketFamily:'MONEYLINE',choices:[{label:'승',odds:1.55},{label:'무',odds:3.95},{label:'패',odds:5.5}]};
c.ST={gmTs:'260128',markets:[...mk,up],settlementLedger:[{gmTs:'260127',odds:1.55,hit:true},{gmTs:'260127',odds:1.6,hit:false}]};
run('r734Step(ST)');assert.equal(Object.keys(c.ST.r734.g).length,8);
const S=run('r734Summary(ST)');
assert.equal(S.pattern.length,1);assert.equal(S.pattern[0].n,8);assert.equal(S.pattern[0].w,75);assert.equal(S.pattern[0].dr,25);
const b=S.bands['일반승'].find(x=>x.b==='1.5~1.69');assert.equal(b.n,8);assert.equal(b.hit,75);
assert.ok(S.move.find(x=>x.b==='크게 몰림').n+S.move.find(x=>x.b==='몰림').n>=8);assert.equal(S.mine.find(x=>x.b==='1.5~1.69').n,2);
console.log('r734 ok',JSON.stringify(S.pattern[0]).slice(0,200));
