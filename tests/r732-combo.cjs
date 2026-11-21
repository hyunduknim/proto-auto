const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export class R958Cache','class R958Cache').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
run('currentRoundMarket=()=>true;r704Model=()=>null');
// now = 2026-11-02 08:00 KST
const now=Date.parse('2026-11-02T08:00:00+09:00');c.NOW=now;vm.runInContext('Date.now=()=>NOW',c);
const mk=[];let no=1;
for(let i=0;i<7;i++){const g={gmTs:'260130',sport:'농구',league:'NBA',date:'2026-11-02',time:String(12+i)+':00',home:'H'+i,away:'A'+i};
 mk.push({...g,no:no++,marketFamily:'MONEYLINE',choices:[{label:'승',odds:1.45+i*0.02},{label:'패',odds:2.6}],r507Overseas:{probs:{승:.66-i*.01,패:.34+i*.01}}});
 mk.push({...g,no:no++,marketFamily:'HANDICAP',line:-3.5,choices:[{label:'승',odds:1.5},{label:'패',odds:2.3}],r507Overseas:{probs:{승:.62,패:.38}}});
 mk.push({...g,no:no++,marketFamily:'TOTAL',line:160.5,choices:[{label:'언더',odds:1.55},{label:'오버',odds:2.2}],r507Overseas:{probs:{언더:.6,오버:.47}}});}
// one game gets a 1.20 favourite that must never be used
mk.push({gmTs:'260130',sport:'농구',league:'NBA',date:'2026-11-02',time:'15:30',home:'LOW',away:'Y',no:no++,marketFamily:'MONEYLINE',choices:[{label:'승',odds:1.2},{label:'패',odds:4.2}],r507Overseas:{probs:{승:.85,패:.15}}});
// a game after the morning window (19:00) must not be used
mk.push({gmTs:'260130',sport:'농구',league:'NBA',date:'2026-11-02',time:'19:00',home:'LATE',away:'X',no:no++,marketFamily:'MONEYLINE',choices:[{label:'승',odds:1.36},{label:'패',odds:3.2}]});
const T=h=>Date.parse('2026-11-02T'+h+':00+09:00');
const nhl={day:'2026-11-02',games:[0,1,2,3].map(i=>({home:'Boston Bruins'+i,away:'Dallas Stars'+i,t:T('09:00'),C:[{fam:'MONEYLINE',side:'h',pick:'홈승',line:null,odds:1.6,p:.6-i*.01},{fam:'HANDICAP',side:'a',pick:'원정 +1.5',line:1.5,odds:1.45,p:.66-i*.01},{fam:'TOTAL',side:null,pick:'언더',line:6.5,odds:1.7,p:.56},{fam:'MONEYLINE',side:'a',pick:'원정승',line:null,odds:1.15,p:.86}]}))};
c.ST={gmTs:'260130',markets:mk,r961Nhl:nhl};
const box=run('r732Step(ST,NOW)');
// R961: weekday 07:00 slot → NBA 3폴더 · NHL 3폴더 · NBA·NHL 핸디·언오버 (Claude post missing → made after 07:40)
assert.equal(box.list.map(k=>k.type).sort().join(),'nba,nbanhl,nhl');
for(const k of box.list){assert.equal(new Set(k.legs.map(l=>l.seed||l.homeEn)).size,3);assert.ok(k.legs.every(l=>l.home!=='LATE'&&l.home!=='LOW'&&Number(l.odds)>1.31));assert.ok(k.legs.filter(l=>(l.marketFamily||l.fam)==='MONEYLINE').length<=1,'일반승 위주 아님');}
{const L=box.list.find(k=>k.type==='nbanhl').legs;assert.ok(L.every(l=>l.marketFamily!=='MONEYLINE'));assert.ok(L.some(l=>l.src==='nhl')&&L.some(l=>l.src!=='nhl'),'NBA와 NHL 둘 다');}
assert.ok(box.list.find(k=>k.type==='nhl').legs.every(l=>l.src==='nhl'));
// a second tick does not rebuild
const ids=box.list.map(k=>k.id+JSON.stringify(k.legs.map(l=>l.no)));run('r732Step(ST,NOW+600000)');assert.equal(c.ST.r732Combos.list.map(k=>k.id+JSON.stringify(k.legs.map(l=>l.no))).join(),ids.join());
// before 07:30 nothing is made for the day
c.ST2={gmTs:'260130',markets:mk};run('r732Step(ST2,Date.parse("2026-11-02T06:00:00+09:00"))');assert.equal(c.ST2.r732Combos.list.length,0);
// 07:20 with no Claude NBA post yet → still waiting
c.ST3={gmTs:'260130',markets:mk,r961Nhl:nhl};run('r732Step(ST3,Date.parse("2026-11-02T07:20:00+09:00"))');assert.equal(c.ST3.r732Combos.list.length,0);
// Saturday morning → no morning combos (평일만)
c.ST4={gmTs:'260130',markets:mk.map(m=>({...m,date:'2026-11-07'})),r961Nhl:{...nhl,day:'2026-11-07',games:[]}};run('r732Step(ST4,Date.parse("2026-11-07T08:00:00+09:00"))');assert.equal(c.ST4.r732Combos.list.length,0);
console.log('r732 ok',box.list.map(k=>k.legs.map(l=>l.home+':'+l.pick).join(',')+' '+k.odds));
