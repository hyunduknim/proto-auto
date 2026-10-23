const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
const b={sport:'축구',date:'2099-01-01',time:'04:00',marked:true,representativeSelected:true,r554:{ps:.7,selected:true},r577Rec:{pick:'x'}};
c.ST={gmTs:'260126',markets:[{...b,gmTs:'260126',no:1,league:'UEFA 유로파리그',home:'A',away:'B',marketFamily:'MONEYLINE',finalPick:'승',finalOdds:1.4,displayGrade:'추천'},
{...b,gmTs:'260126',no:3,league:'J1리그',home:'E',away:'F',marketFamily:'TOTAL',line:2.5,finalPick:'언더',finalOdds:1.7,displayGrade:'추천'}]};
run('r642Apply(ST)');run('r642Apply(ST)');
assert.equal(run('ST.r652Shadow.list.length'),2,'one note per pick, not per tick');
run('ST.markets[0].resultFinal=true;ST.markets[0].result="무";ST.markets[0].hit=false;ST.markets[0].settlementStatus="낙첨";ST.markets[0].resultScoreText="1:1"');
run('ST.markets[1].resultFinal=true;ST.markets[1].result="언더";ST.markets[1].hit=true;ST.markets[1].settlementStatus="적중";ST.markets[1].resultScoreText="1:0"');
run('r652Step(ST)');const sm=run('r652Summary(ST)');
const by=Object.fromEntries(sm.rules.map(r=>[r.rule,r]));assert.equal(by['유럽대항전 일반승'].miss,1);assert.equal(by['언더 2.5 이하'].hit,1);
assert.ok(vm.runInContext('INDEX',c).includes('function r652Render'));
console.log('R652 shadow OK',JSON.stringify(sm.rules));
