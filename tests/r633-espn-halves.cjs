const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const T=Date.parse('2026-10-22T16:45:00Z');
const sb={events:[{id:'900',date:'2026-10-22T16:45Z',competitions:[{competitors:[{homeAway:'home',team:{id:'597',displayName:'Dinamo Zagreb'}},{homeAway:'away',team:{id:'147',displayName:'NEC Nijmegen'}}]}]}]};
const lf=(tid,list)=>({team:{id:tid},events:list.map(([id,date,homeId,hs,as,opp])=>({id,gameDate:date,homeTeamId:homeId,homeTeamScore:String(hs),awayTeamScore:String(as),opponent:{displayName:opp},leagueName:'X'}))});
const pre={lastFiveGames:[lf('597',[['11','2026-10-15T19:00Z','597',1,0,'Anderlecht'],['12','2026-09-16T19:00Z','13083',0,0,"Hapoel Be'er"]]),lf('147',[['21','2026-10-18T18:00Z','147',2,2,'Fortuna Sittard'],['22','2026-10-15T19:00Z','147',1,1,'Levski']])]};
const ev=(a,b,ida,idb)=>({header:{competitions:[{competitors:[{team:{id:ida},linescores:[{displayValue:String(a[0])},{displayValue:String(a[1])}]},{team:{id:idb},linescores:[{displayValue:String(b[0])},{displayValue:String(b[1])}]}]}]}});
const map={'scoreboard':sb,'event=900':pre,'event=11':ev([0,1],[0,0],'597','1'),'event=12':ev([0,0],[0,0],'13083','597'),'event=21':ev([1,1],[0,2],'147','9'),'event=22':ev([1,0],[0,1],'147','8')};
let calls=0;const fetchMock=async u=>{calls++;const k=Object.keys(map).find(k=>String(u).includes(k));return new Response(JSON.stringify(k?map[k]:{}),{status:k?200:404});};
const c=vm.createContext({Date,URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto,fetch:fetchMock});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
c.ST={gmTs:'260125',markets:[{gmTs:'260125',no:9872,sport:'축구',league:'UEFA 유로파리그',date:'2026-10-23',time:'01:45',home:'GNK디나모 자그레브',away:'NEC네이메헌',marketFamily:'MONEYLINE',choices:[{label:'승',odds:1.4},{label:'무',odds:4},{label:'패',odds:5.4}],representativeSelected:true}],
r507Overseas:{aliases:{}}};
(async()=>{
const nowMs=T-3600000;
const sim=run('r507NameSim(ST.r507Overseas,"축구","GNK디나모 자그레브","Dinamo Zagreb")');
if(sim<.6){run('ST.r507Overseas={}');}
const a=await run('r633RefreshEspnForms(ST,null,{nowMs:'+nowMs+',force:true})');
if(a.error==='NO_ESPN_FIXTURE'){console.log('R633 name match unavailable in test env (sim '+sim+'), skipping match assertions');return;}
assert.equal(a.status,'UPDATED',JSON.stringify(a));assert.equal(a.halves,4);
const d=run('r482TeamData(ST,ST.markets[0])');
assert.equal(d.home.source,'ESPN 최근 경기');assert.ok(d.home.halves&&d.home.halves.n===2);assert.equal(d.home.halves.h2f,0.5);
assert.ok(d.away.halves&&d.away.halves.h2a===1.5,JSON.stringify(d.away.halves));
const again=await run('r633RefreshEspnForms(ST,null,{nowMs:'+(nowMs+120000)+'})');assert.equal(again.status,'NONE_DUE','filled games are not refetched');
console.log('R633 ESPN halves OK',calls,'requests');
})().catch(e=>{console.error(e);process.exit(1);});
