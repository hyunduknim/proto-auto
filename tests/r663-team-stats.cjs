const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
c.SB=JSON.parse(fs.readFileSync('tests/fixtures/r663-soccer-box.json','utf8'));c.NB=JSON.parse(fs.readFileSync('tests/fixtures/r663-nba-box.json','utf8'));
const s=JSON.parse(run('JSON.stringify(r663SoccerEv(SB))'));assert.deepEqual(s['367'],[16,5,65.4,4,15]);assert.deepEqual(s['388'],[12,1,34.6,4,14]);
const n=JSON.parse(run('JSON.stringify(r663NbaEv(NB))'));assert.deepEqual(n['5'],[87,28,10,21]);assert.deepEqual(n['20'],[92,30,9,17]);
const g={gmTs:'260126',sport:'축구',league:'EPL',date:'2099-01-01',time:'01:30',home:'첼시',away:'토트넘'};
const nb={gmTs:'260126',sport:'농구',league:'NBA',date:'2099-01-01',time:'08:00',home:'밀워키',away:'시카고'};
c.ST={gmTs:'260126',markets:[{...g,no:1,marketFamily:'MONEYLINE',choices:[]},{...nb,no:2,marketFamily:'MONEYLINE',choices:[]}],
 r663Ev:{e1:{A:[15,6,60,7,10],X:[8,2,40,3,12]},e2:{A:[11,4,56,5,9],Y:[10,3,44,4,11]},e3:{B:[9,3,45,4,13],Z:[13,5,55,6,10]},e4:{B:[7,2,42,2,14],W:[14,6,58,8,9]}},
 r651Games:{g1:{t:1,h:'M',a:'Q',hs:120,as:110,hq:[30,30,30,30]},g2:{t:2,h:'R',a:'M',hs:100,as:110,hq:[25,25,25,25]},g3:{t:1,h:'C',a:'Q',hs:105,as:115,hq:[25,25,25,30]},g4:{t:2,h:'C',a:'R',hs:99,as:101,hq:[25,25,25,24,10]}},
 r663Nb:{g1:{M:[88,25,10,13],Q:[90,20,11,15]},g2:{R:[85,22,9,14],M:[86,24,10,12]},g3:{C:[89,21,12,16],Q:[87,26,10,13]},g4:{C:[95,20,12,14],R:[94,22,11,13]}}};
run('ST.r663Need={[r483FixtureKey(ST.markets[0])]:{t:Date.now()+1e6,ids:{home:"A",away:"B"},ev:{home:["e1","e2"],away:["e3","e4"]}}};ST.r651Ids={[r483FixtureKey(ST.markets[1])]:{home:"M",away:"C"}}');
run('r663Apply(ST)');const fs1=run('ST.markets[0].r663');assert.equal(fs1.home.sh,13);assert.equal(fs1.home.sha,9);assert.equal(fs1.away.pos,43.5);assert.equal(fs1.home.n,2);
const fn=run('ST.markets[1].r663');assert.ok(fn.home.pace>90&&fn.home.pace<105,'pace '+fn.home.pace);assert.ok(fn.away.ortg<fn.home.ortg);assert.ok(fn.proj&&fn.proj.tot>190&&fn.proj.tot<240,'tot '+(fn.proj&&fn.proj.tot));
const ix=vm.runInContext('INDEX',c);assert.ok(ix.includes('function r663Html')&&ix.includes('r663Chip(m)'));
console.log('R663 team stats OK',JSON.stringify(fs1.home),JSON.stringify(fn));
