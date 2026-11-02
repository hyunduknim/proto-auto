const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
const now=Date.parse('2099-01-01T05:00:00+09:00');c.NOW=now;run('Date.now=()=>NOW');
const b={gmTs:'260130',sport:'농구',league:'NBA',date:'2099-01-01',time:'11:00',home:'레이커스',away:'토론토'};
c.ST={gmTs:'260130',markets:[
 {...b,no:1,marketFamily:'MONEYLINE',choices:[{label:'승',odds:1.4},{label:'패',odds:2.3}],marked:true,representativeSelected:true,finalPick:'승',finalOdds:1.4,displayGrade:'일반',r554:{ps:.6,why:'확률 부족'}},
 {...b,no:2,marketFamily:'HANDICAP',line:-4.5,choices:[{label:'승',odds:1.78},{label:'패',odds:1.7}]},
 {...b,no:3,marketFamily:'TOTAL',line:228.5,choices:[{label:'언더',odds:1.75},{label:'오버',odds:1.73}]}],r507Overseas:{books:{}}};
run('ST.r507Overseas.books[gameSeed(ST.markets[0])]={ml:[["pinnacle",1.55,0,2.58]],tot:[["pinnacle",224.5,1.93,1.93]]}');
assert.equal(run('r766Nba(ST,NOW)'),1);
const x=run('ST.markets.find(m=>m.marked&&m.representativeSelected)');assert.equal(x.no,3);assert.equal(x.finalPick,'언더');assert.equal(x.displayGrade,'추천');
assert.equal(run('ST.markets[0].marked'),false,'old rep released');
// a game already 추천 by the site is left alone
run('ST.markets.forEach(m=>{m.marked=false;m.representativeSelected=false;delete m.r766});Object.assign(ST.markets[0],{marked:true,representativeSelected:true,displayGrade:"추천"})');assert.equal(run('r766Nba(ST,NOW)'),0);
// no edge -> nothing
run('ST.markets[0].displayGrade="일반";ST.r507Overseas.books[gameSeed(ST.markets[0])].tot=[["pinnacle",228.5,1.93,1.93]];ST.r507Overseas.books[gameSeed(ST.markets[0])].ml=[["pinnacle",1.55,0,2.82]]');assert.equal(run('r766Nba(ST,NOW)'),0);
console.log('r766 ok');
