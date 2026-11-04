const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
const g={gmTs:'260131',sport:'축구',league:'UCL',date:'2099-11-05',time:'05:00',home:'RB라이프치히',away:'맨체스터 시티'};
c.ST={gmTs:'260131',markets:[{...g,no:2525,marketFamily:'HANDICAP',line:2,choices:[{label:'승',odds:1.57},{label:'무',odds:4},{label:'패',odds:5}],marked:true,representativeSelected:true,finalPick:'승',finalOdds:1.57,displayGrade:'일반',r619Lock:{grade:'일반',pick:'승'}}],r643:{}};
run('ST.r643[r483FixtureKey(ST.markets[0])]={home:{miss:5},away:{miss:2}}');
assert.equal(run('r780LineupCut(ST)'),1);assert.equal(run('ST.markets[0].marked'),false);assert.ok(run('!ST.markets[0].r619Lock'));
// small gap -> kept
run('Object.assign(ST.markets[0],{marked:true,representativeSelected:true,finalPick:"승",finalOdds:1.57});delete ST.markets[0].r780Cut;ST.r643[r483FixtureKey(ST.markets[0])]={home:{miss:4},away:{miss:3}}');assert.equal(run('r780LineupCut(ST)'),0);
console.log('r780 ok');
