const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
const g=(no,home,away,h,d,a,extra={})=>({gmTs:'260126',no,sport:'축구',league:'K리그1',date:'2099-01-01',time:'19:00',home,away,marketFamily:'MONEYLINE',choices:[{label:'승',odds:h},{label:'무',odds:d},{label:'패',odds:a}],...extra});
c.ST={gmTs:'260126',markets:[
g(1,'A','B',1.33,4.6,7.5,{marked:true,representativeSelected:true,finalPick:'승',finalOdds:1.33,displayGrade:'추천',r554:{ps:.7,selected:true},r577Rec:{pick:'승'}}),
g(2,'C','D',2.4,2.9,2.9,{marked:true,representativeSelected:true,finalPick:'승',finalOdds:2.4,displayGrade:'추천',r554:{ps:.6,selected:true},r577Rec:{pick:'승'}}),
g(3,'E','F',2.6,2.8,2.7),g(4,'G','H',2.2,3.0,3.2),g(5,'I','J',1.9,3.2,3.9),g(6,'K','L',3.0,2.75,2.5)]};
run('r645Apply(ST)');const m=n=>run('ST.markets.find(x=>x.no==='+n+')');
assert.ok(m(1).r645.p<.27,'heavy favourite low draw p '+m(1).r645.p);assert.equal(m(1).displayGrade,'추천');
assert.ok(m(2).r645.p>=.27,'tight game high draw p '+m(2).r645.p);assert.equal(m(2).displayGrade,'일반');assert.match(m(2).r554.why,/무승부 위험/);assert.ok(m(2).r577Rec.off);
run('r645Step(ST)');const box=run('ST.r645Draws');assert.equal(box.list.length,3,'3 per day');
assert.ok(box.list.every(x=>x.leg.pick==='무'&&x.status==='pre'));
const html=vm.runInContext('INDEX',c);assert.ok(html.includes('function r645Panel')&&html.includes('function r645Chip'));
console.log('R645 draws OK',JSON.stringify(box.list.map(x=>[x.leg.home,x.p])));
