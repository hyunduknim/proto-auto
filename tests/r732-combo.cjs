const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export class R958Cache','class R958Cache').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
run('currentRoundMarket=()=>true;r704Model=()=>null');
// now = 2026-11-02 08:00 KST
const now=Date.parse('2026-11-02T08:45:00+09:00');c.NOW=now;vm.runInContext('Date.now=()=>NOW',c);
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
// R961/R989: weekday 08:00 slot → NBA 3폴더 · NHL 3폴더 · NBA·NHL 핸디·언오버 (Claude post missing → made after 08:40)
assert.ok(['nba','nbanhl','nhl'].every(t=>box.list.some(k=>k.type===t)));{const t3=box.list.find(k=>k.type==='am3');if(t3)assert.equal(t3.legs.length,3);const hi=box.list.find(k=>k.type==='amHigh');if(hi)assert.ok(hi.legs.every(l=>Number(l.odds)>=1.85));}
for(const k of box.list){assert.equal(new Set(k.legs.map(l=>l.seed||l.homeEn)).size,k.legs.length);assert.ok(k.legs.every(l=>l.home!=='LATE'&&l.home!=='LOW'&&Number(l.odds)>1.31));assert.ok(k.legs.filter(l=>(l.marketFamily||l.fam)==='MONEYLINE').length<=1,'일반승 위주 아님');}
{const L=box.list.find(k=>k.type==='nbanhl').legs;assert.ok(L.every(l=>l.marketFamily!=='MONEYLINE'));assert.ok(L.some(l=>l.src==='nhl')&&L.some(l=>l.src!=='nhl'),'NBA와 NHL 둘 다');}
assert.ok(box.list.find(k=>k.type==='nhl').legs.every(l=>l.src==='nhl'));
// a second tick does not rebuild
const ids=box.list.map(k=>k.id+JSON.stringify(k.legs.map(l=>l.no)));run('r732Step(ST,NOW+600000)');assert.equal(c.ST.r732Combos.list.map(k=>k.id+JSON.stringify(k.legs.map(l=>l.no))).join(),ids.join());
// before 06:00 nothing is made for the day
c.ST2={gmTs:'260130',markets:mk};run('r732Step(ST2,Date.parse("2026-11-02T06:00:00+09:00"))');assert.equal(c.ST2.r732Combos.list.length,0);
// 07:20 with no Claude NBA post yet → still waiting
c.ST3={gmTs:'260130',markets:mk,r961Nhl:nhl};run('r732Step(ST3,Date.parse("2026-11-02T07:20:00+09:00"))');assert.equal(c.ST3.r732Combos.list.length,0);
// Saturday morning → no morning combos (평일만)
c.ST4={gmTs:'260130',markets:mk.map(m=>({...m,date:'2026-11-07'})),r961Nhl:{...nhl,day:'2026-11-07',games:[]}};run('r732Step(ST4,Date.parse("2026-11-07T08:00:00+09:00"))');assert.equal(c.ST4.r732Combos.list.length,0);
console.log('r732 ok',box.list.map(k=>k.legs.map(l=>l.home+':'+l.pick).join(',')+' '+k.odds));
// R962: Saturday 20:00 → one 주말 밤 해외축구 3폴더 (21:00 EPL games), at most one 일반승
{const g=i=>({gmTs:'260130',sport:'축구',league:'EPL',date:'2026-11-07',time:'2'+(1+i%2)+':00',home:'S'+i,away:'T'+i});const M=[];let n=900;
for(let i=0;i<4;i++){M.push({...g(i),no:n++,marketFamily:'MONEYLINE',choices:[{label:'승',odds:1.7},{label:'무',odds:3.6},{label:'패',odds:4.5}],r507Overseas:{probs:{승:.58,무:.24,패:.18}}});M.push({...g(i),no:n++,marketFamily:'HANDICAP',line:1,choices:[{label:'승',odds:1.5},{label:'무',odds:4},{label:'패',odds:5}],r507Overseas:{probs:{승:.64,무:.2,패:.16}}});}
c.ST5={gmTs:'260130',markets:M,r662Posts:[{id:'2026-11-07-n-soccer',groups:[]}]};run('r732Step(ST5,Date.parse("2026-11-07T20:05:00+09:00"))');const L=c.ST5.r732Combos.list.filter(k=>k.slot.endsWith('w20'));
assert.equal(L.map(k=>k.type).join(),'wkSoc');assert.equal(new Set(L[0].legs.map(l=>l.seed)).size,3);assert.ok(L[0].legs.filter(l=>l.marketFamily==='MONEYLINE').length<=1);console.log('r962 ok');}
// R963: the two 새벽 1시 soccer combos never use the same games when there are enough games
{const g=i=>({gmTs:'260130',sport:'축구',league:'EPL',date:'2026-11-08',time:'2'+(i%3)+':00',home:'U'+i,away:'V'+i});const M=[];let n=1900;
for(let i=0;i<7;i++){M.push({...g(i),no:n++,marketFamily:'MONEYLINE',choices:[{label:'승',odds:1.7},{label:'무',odds:3.6},{label:'패',odds:4.5}],r507Overseas:{probs:{승:.58,무:.24,패:.18}}});M.push({...g(i),no:n++,marketFamily:'HANDICAP',line:1,choices:[{label:'승',odds:1.5},{label:'무',odds:4},{label:'패',odds:5}],r507Overseas:{probs:{승:.64,무:.2,패:.16}}});M.push({...g(i),no:n++,marketFamily:'TOTAL',line:2.5,choices:[{label:'언더',odds:1.8},{label:'오버',odds:1.9}],r507Overseas:{probs:{언더:.55,오버:.45}}});}
c.ST6={gmTs:'260130',markets:M,r662Posts:[{id:'2026-11-08-n-soccer',groups:[]}]};run('r732Step(ST6,Date.parse("2026-11-08T01:05:00+09:00"))');const L=c.ST6.r732Combos.list.filter(k=>k.slot.endsWith('n1'));
assert.ok(['socMix','socSafe'].every(t=>L.some(k=>k.type===t)));const a=new Set(L[0].legs.map(l=>l.seed));assert.ok(L[1].legs.every(l=>!a.has(l.seed)),'두 조합 경기가 달라야 함');console.log('r963 ok');}
// R966: from 11/22 every combo has 2 legs; 골고루 = two different kinds
{const g=i=>({gmTs:'260139',sport:'축구',league:'EPL',date:'2026-11-23',time:'2'+(i%3)+':00',home:'W'+i,away:'X'+i});const M=[];let n=2900;
for(let i=0;i<6;i++){M.push({...g(i),no:n++,marketFamily:'MONEYLINE',choices:[{label:'승',odds:1.7},{label:'무',odds:3.6},{label:'패',odds:4.5}],r507Overseas:{probs:{승:.6,무:.24,패:.16}}});M.push({...g(i),no:n++,marketFamily:'HANDICAP',line:1,choices:[{label:'승',odds:1.5},{label:'무',odds:4},{label:'패',odds:5}],r507Overseas:{probs:{승:.64,무:.2,패:.16}}});M.push({...g(i),no:n++,marketFamily:'TOTAL',line:2.5,choices:[{label:'언더',odds:1.8},{label:'오버',odds:1.9}],r507Overseas:{probs:{언더:.55,오버:.45}}});}
c.ST7={gmTs:'260139',markets:M,r662Posts:[{id:'2026-11-23-n-soccer',groups:[]}]};run('r732Step(ST7,Date.parse("2026-11-23T01:05:00+09:00"))');const L=c.ST7.r732Combos.list.filter(k=>k.slot.endsWith('n1'));
for(const k of L.filter(k=>k.type==='socSafe'||k.type==='socMix'))assert.equal(k.legs.length,2);{const t3=L.find(k=>k.type==='soc3');if(t3)assert.equal(t3.legs.length,3);}const mx=L.find(k=>k.type==='socMix');assert.notEqual(mx.legs[0].marketFamily,mx.legs[1].marketFamily);console.log('r966 ok');}
