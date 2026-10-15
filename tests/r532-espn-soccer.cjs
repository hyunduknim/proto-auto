const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
const ev=(id,h,a,hs,as,date,name='STATUS_FULL_TIME',done=true)=>({id,date,status:{type:{name,completed:done}},competitions:[{competitors:[{homeAway:'home',score:String(hs),team:{displayName:h}},{homeAway:'away',score:String(as),team:{displayName:a}}]}]});
c.EVENTS=[ev('1','BG Pathum United','Adelaide United',1,2,'2026-10-15T12:15Z'),ev('2','BG Tampines Rovers FC','Machida Zelvia',0,1,'2026-10-15T12:15Z'),
ev('3','Kuching City','Kitchee',1,1,'2026-10-15T12:15Z'),ev('4','Preah Khan Reach Svay Rieng FC','Shanghai Shenhua',0,0,'2026-10-15T12:15Z'),ev('5','Gangwon FC','Phnom Penh Crown',1,2,'2026-10-15T10:00Z')];
const mk=(home,away,time='21:15')=>`({sport:"축구",league:"AFC 챔피언스리그2",date:"2026-10-15",time:"${time}",home:"${home}",away:"${away}"})`;
const res=(h,a,t)=>run(`r532Resolve({},${mk(h,a,t)},EVENTS)`);
assert.equal(run(`r532Slug(${mk('a','b')})`),'afc.cup');
assert.equal(res('BG빠툼 유나이티드','애들레이드 유나이티드').score,'1:2');
assert.equal(res('탬피니스 로버스','FC마치다 젤비아').score,'0:1');
assert.equal(res('쿠칭시티','킷치SC').score,'1:1');
assert.equal(res('강원FC','프놈펜 크라운','19:00').score,'1:2');
assert.ok(res('쿠칭시티','킷치SC','19:00').reject,'wrong kickoff never matches');
assert.ok(res('울산HD','상하이 하이강').reject,'unknown teams are not settled');
c.EVENTS.push(ev('6','Kuching City','Kitchee',1,1,'2026-10-15T12:15Z','STATUS_FINAL_AET',true));
c.EVENTS[2]=ev('3','Kuching City','Kitchee',1,1,'2026-10-15T12:15Z','STATUS_SECOND_HALF',false);
assert.ok(res('쿠칭시티','킷치SC').reject,'live or duplicate fixtures are not settled');
console.log('R532 ESPN soccer settlement matching OK');

// end-to-end: a pending over 2.5 on Pathum vs Adelaide (1:2) settles as a hit through applyResults
c.EVENTS[2]=ev('3','Kuching City','Kitchee',1,1,'2026-10-15T12:15Z');c.EVENTS.pop();
run(`fetch=async u=>({ok:true,status:200,text:async()=>JSON.stringify({events:String(u).includes('afc.cup')?EVENTS:[]})});saveState=async()=>{};markState=()=>{};
ST={markets:[{gmTs:"260122",no:8393,sport:"축구",league:"AFC 챔피언스리그2",date:"2026-10-15",time:"21:15",home:"BG빠툼 유나이티드",away:"애들레이드 유나이티드",
marketFamily:"TOTAL",line:2.5,marked:true,representativeSelected:true,finalPick:"오버",finalOdds:1.85,gameStarted:true,
choices:[{label:"오버",odds:1.85},{label:"언더",odds:1.85}]},
{gmTs:"260122",no:8401,sport:"축구",league:"AFC 챔피언스리그2",date:"2026-10-15",time:"21:15",home:"쿠칭시티",away:"킷치SC",
marketFamily:"TOTAL",line:2.5,marked:true,representativeSelected:true,finalPick:"오버",finalOdds:1.85,gameStarted:true,
choices:[{label:"오버",odds:1.85},{label:"언더",odds:1.85}]}]};`);
(async()=>{
 run("Date.now=()=>Date.parse('2026-10-15T14:40:00Z')");
 const a=await run('r532RefreshEspnSoccer(ST,{},true)');
 const m=run('ST.markets');
 assert.equal(a.settled,2);assert.equal(m[0].hit,true,'1:2 is over 2.5');assert.equal(m[1].hit,false,'1:1 is under 2.5');assert.ok(m.every(x=>x.resultSource==='ESPN_DIRECT_VERIFIED_SOCCER_FULLTIME'));console.log('R532 end-to-end settlement OK');
})().catch(e=>{console.error(e);process.exit(1)});
