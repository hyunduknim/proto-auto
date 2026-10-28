const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
const T=(w,d,l,gf,ga)=>({n:5,wins:w,draws:d,losses:l,avgGF:gf,avgGA:ga,cleanSheets:w>3?3:0,matches:[0,1,2,3,4].map(i=>({date:'2026-10-2'+i,home:i%2===0,opponent:'x'+i,gf:i<w?Math.round(gf+1):i<w+d?1:0,ga:i<w?0:i<w+d?1:Math.round(ga+1)})),ha:{home:{n:5,w:w,d:d,l:l,gf:gf*5,ga:ga*5},away:{n:5,w:w,d:d,l:l,gf:gf*5,ga:ga*5}}});
c.TD={home:T(4,1,0,2.4,0.6),away:T(0,1,4,0.6,2.2)};run('r482TeamData=()=>TD;currentRoundMarket=()=>true');
const g={gmTs:'260126',sport:'축구',league:'EPL',date:'2099-01-01',time:'01:30',home:'첼시',away:'토트넘'};
c.ST={gmTs:'260126',markets:[{...g,no:1,marketFamily:'MONEYLINE',choices:[{label:'승',odds:1.5},{label:'무',odds:4},{label:'패',odds:6}],marked:true,representativeSelected:true,finalPick:'승',finalOdds:1.5,displayGrade:'추천',r554:{ps:.66},r507Overseas:{probs:{승:.68,무:.2,패:.12}}},
 {...g,no:2,marketFamily:'TOTAL',line:2.5,choices:[{label:'언더',odds:1.8},{label:'오버',odds:1.9}]}],
 r662Posts:[{id:'x',groups:[{name:'안정형',picks:[{gmTs:'260126',no:1,pick:'승',label:'첼시 승',odds:1.5}]}]}]};
const G=run('r676Games(ST)');assert.equal(G.length,1);assert.equal(G[0].agree,3);assert.equal(G[0].top,true);assert.equal(G[0].ov.ok,true);assert.equal(G[0].bet.src,'site');
run('ST.r662Posts[0].groups[0].picks[0].pick="패"');assert.equal(run('r676Games(ST).length'),0,'any disagreement drops the game');
run('ST.r662Posts=[]');assert.equal(run('r676Games(ST)[0].agree'),2,'site + 경기력');
run("ST.r662Posts=[{id:'g',by:'gpt',groups:[{name:'추천',picks:[{gmTs:'260126',no:2,pick:'언더',label:'언더'}]}]},{id:'c',groups:[{name:'안정형',picks:[{gmTs:'260126',no:2,pick:'언더',label:'언더'}]}]}]");const U=run('r676Games(ST)');assert.ok(U.length===1,'R718: a total can be best');
run('ST.r662Posts=[]');
run('ST.markets.forEach(m=>{m.date="2000-01-01"});r676Step(ST)');assert.equal(run('ST.r676.log.length'),1);assert.equal(run('ST.r676.log[0].st'),'live');
run('Object.assign(ST.markets[0],{resultFinal:true,result:"승",hit:true,resultScoreText:"2:0"});r676Step(ST)');assert.equal(run('ST.r676.log[0].st'),'hit');
const sm=run('r676Summary(ST)');assert.equal(sm.rec.all.n,1);assert.ok(vm.runInContext('INDEX',c).includes('function r676Render'));
console.log('R676 best OK',JSON.stringify(sm.rec));
