const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
assert.equal(run('R761.pen'),.08);assert.equal(run('R761.soft'),2);
// 3 plus-handicap 추천 on one day, no other market in those games -> nothing is taken out
const mk=i=>({gmTs:'260130',round:130,sport:'축구',league:'EPL',date:'2099-01-01',time:'2'+i+':00',home:'H'+i,away:'A'+i,no:100+i,marketFamily:'HANDICAP',line:1,choices:[{label:'승',odds:1.4},{label:'무',odds:4},{label:'패',odds:5}],marked:true,representativeSelected:true,finalPick:'승',finalOdds:1.4,displayGrade:'추천',r554:{ps:.6+i/100}});
c.ST={gmTs:'260130',round:130,markets:[mk(0),mk(1),mk(2)]};
run('r761Soft(ST)');assert.equal(run('ST.markets.filter(m=>m.displayGrade==="추천").length'),3,'no 추천 removed');
assert.ok(run('!!ST.markets[0].r761No'),'weakest tried first');
console.log('r761 ok');
