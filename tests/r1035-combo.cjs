// R1035 (owner 11/28 14:48): combos back — no hockey, no 고배당, legs 62%+ (농구 핸디·오버 64%+)
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export class R958Cache','class R958Cache').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
run('currentRoundMarket=()=>true;r704Model=()=>null');
const now=Date.parse('2026-11-30T08:45:00+09:00');c.NOW=now;run('Date.now=()=>NOW');
const mk=[];let no=1;
for(let i=0;i<6;i++){const g={gmTs:'260141',sport:'농구',league:'NBA',date:'2026-11-30',time:String(10+i)+':00',home:'H'+i,away:'A'+i};
 mk.push({...g,no:no++,marketFamily:'MONEYLINE',choices:[{label:'승',odds:1.45},{label:'패',odds:2.6}],r507Overseas:{probs:{승:.70-i*.02,패:.30+i*.02}}});
 mk.push({...g,no:no++,marketFamily:'HANDICAP',line:-3.5,choices:[{label:'승',odds:1.6},{label:'패',odds:2.2}],r507Overseas:{probs:{승:.63,패:.37}}});
 mk.push({...g,no:no++,marketFamily:'TOTAL',line:220.5,choices:[{label:'언더',odds:1.6},{label:'오버',odds:2.2}],r507Overseas:{probs:{언더:.66,오버:.34}}});}
const posts=[{id:'2026-11-30-a-morning',groups:[{picks:mk.map(m=>({gmTs:m.gmTs,no:m.no,pick:m.marketFamily==='TOTAL'?'언더':'승',p:.64}))}]}];
const B0=()=>({list:[],tally:{hit:0,miss:0,void:0},slots:{},r995:1,r995b:1,r995Slots:[],r746:true});c.ST={r732Combos:B0(),gmTs:'260141',markets:mk,r662Posts:posts,r961Nhl:{day:'2026-11-30',games:[{home:'B',away:'D',t:Date.parse('2026-11-30T09:30:00+09:00'),C:[{fam:'HANDICAP',side:'a',pick:'원정 +1.5',line:1.5,odds:1.5,p:.8}]}]}};
const box=run('r732Step(ST,NOW)');
const types=box.list.map(k=>k.type);console.log('r1035',types,box.list.map(k=>k.legs.map(l=>l.home+':'+l.marketFamily+':'+l.pick).join(',')));
assert.ok(types.includes('nba'),'NBA 2폴더');assert.ok(!types.some(t=>/nhl|High/.test(t)),'하키·고배당 없음');
for(const k of box.list){assert.ok(k.legs.every(l=>l.src!=='nhl'));assert.equal(new Set(k.legs.map(l=>l.seed)).size,k.legs.length);
 // 핸디 -3.5 is 63% Pinnacle + 64% Claude → 63.4%, under the 64% 농구 핸디 bar
 assert.ok(k.legs.every(l=>l.marketFamily!=='HANDICAP'),'농구 핸디 64% 미만 제외');assert.ok(k.legs.filter(l=>l.pick==='언더').length<=1,'언더 1개까지');}
// Saturday 06:30 → nothing (weekend board resets at 07:00); Saturday 08:45 → made
c.ST2={r732Combos:B0(),gmTs:'260141',markets:mk.map(m=>({...m,date:'2026-11-28'})),r662Posts:[{...posts[0],id:'2026-11-28-a-morning'}]};c.NOW=Date.parse("2026-11-28T06:30:00+09:00");run("r732Step(ST2,NOW)");assert.equal(c.ST2.r732Combos.list.length,0);
c.NOW=Date.parse("2026-11-28T08:45:00+09:00");run("r732Step(ST2,NOW)");assert.ok(c.ST2.r732Combos.list.length>0,'주말 아침도');
console.log('r1035 ok');
