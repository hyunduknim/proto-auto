const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
// 2026-11-02 01:05 KST
const now=Date.parse('2026-11-02T01:05:00+09:00');c.NOW=now;
const g={gmTs:'260129',sport:'축구',league:'MLS',date:'2026-11-02',time:'10:30',home:'LAFC',away:'미네소타'};
const b={gmTs:'260129',sport:'농구',league:'NBA',date:'2026-11-02',time:'11:00',home:'LA 레이커스',away:'토론토 랩터스'};
c.ST={gmTs:'260129',markets:[
 {...g,no:2025,marketFamily:'MONEYLINE',choices:[{label:'승',odds:1.58},{label:'무',odds:3.75},{label:'패',odds:4}]},
 {...g,no:2026,marketFamily:'HANDICAP',line:-1,choices:[{label:'승',odds:2.6},{label:'무',odds:3.6},{label:'패',odds:2.05}]},
 {...g,no:2028,marketFamily:'HANDICAP',line:-2,choices:[{label:'승',odds:4.8},{label:'무',odds:4.6},{label:'패',odds:1.38}]},
 {...g,no:2029,marketFamily:'TOTAL',line:3.5,choices:[{label:'언더',odds:1.59},{label:'오버',odds:1.92}]},
 {...b,no:2035,marketFamily:'MONEYLINE',choices:[{label:'승',odds:1.4},{label:'패',odds:2.3}]},
 {...b,no:2036,marketFamily:'HANDICAP',line:-4.5,choices:[{label:'승',odds:1.78},{label:'패',odds:1.7}]},
 {...b,no:2037,marketFamily:'TOTAL',line:228.5,choices:[{label:'언더',odds:1.75},{label:'오버',odds:1.73}]}],r507Overseas:{books:{}}};
run('ST.r507Overseas.books[gameSeed(ST.markets[0])]={ml:[["pinnacle",1.75,4.33,4.4]],tot:[["pinnacle",3.25,1.81,2.04]]};ST.r507Overseas.books[gameSeed(ST.markets[4])]={ml:[["pinnacle",1.55,0,2.58]],tot:[["pinnacle",227.5,1.97,1.9]]}');
const C=run('r760Cands(ST,NOW)');const f=(no,pk)=>C.find(x=>x.no===no&&x.pick===pk);
assert.ok(Math.abs(f(2028,'패').p-.65)<.04,'LAFC -2 패 ~65% got '+f(2028,'패').p);
assert.ok(Math.abs(f(2025,'승').p-.556)<.02,'ML matches pinnacle');
assert.ok(f(2028,'패').why.includes('2골 차 이상으로는 못 이기면'),f(2028,'패').why);
assert.ok(f(2026,'패').why.includes('못 이기면 적중 (비기거나 지면)'));
assert.ok(f(2035,'승').p>.6&&f(2035,'승').p<.65);assert.ok(f(2036,'승').p>.4&&f(2036,'승').p<.6);
const post=run('r760Build(ST,NOW)');const n=post.groups.reduce((a,g)=>a+g.picks.length,0);assert.ok(n>=2,'picks '+n);assert.equal(post.by,'pin');
// timing: 00:30 does nothing, 01:05 posts once
assert.equal(run('r760Update(ST,NOW-35*60e3).status'),'IDLE');assert.equal(run('r760Update(ST,NOW).status'),'POSTED');assert.equal(run('r760Update(ST,NOW+600e3).status'),'IDLE');
// settles through the 클로드추천 settler
const p0=run('ST.r760Posts[0].groups[0].picks[0]');run(`ST.markets.forEach(m=>{if(m.no===${p0.no}){m.resultFinal=true;m.result=${JSON.stringify(p0.pick)};m.resultScoreText="2:1"}});r662Settle(ST)`);
const sm=run('r760Summary(ST)');assert.equal(sm.sum.hit,1);assert.equal(sm.posts[0].groups[0].picks[0].st,'hit');
const ix=vm.runInContext('INDEX',c);assert.ok(ix.includes('📌 피나클추천')&&ix.includes('function r760Html'));
console.log('r760 ok',n,post.groups.map(g=>g.name+':'+g.picks.map(x=>x.label+' '+x.odds+' '+x.p).join('|')).join(' / '));
// R763: posts are wiped once on/after 11/3 KST, then the 01:00 post is made
run('ST.r760Posts=[{id:"pin-2026-11-02",groups:[]}];delete ST.r763Reset');assert.equal(run('r760Update(ST,Date.parse("2026-11-02T23:00:00+09:00")).status'),'IDLE');assert.equal(run('ST.r760Posts.length'),1);
run('r760Update(ST,Date.parse("2026-11-03T00:05:00+09:00"))');assert.equal(run('ST.r760Posts.length'),0);
run('ST.r760Posts.push({id:"x",groups:[]});r760Update(ST,Date.parse("2026-11-03T00:20:00+09:00"))');assert.equal(run('ST.r760Posts.length'),1,'reset only once');
console.log('r763 ok');
