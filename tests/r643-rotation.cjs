const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const T=Date.parse('2026-10-22T16:45:00Z');
const xi=(tid,ids)=>({team:{id:tid},roster:ids.map(i=>({starter:true,athlete:{id:i,displayName:'P'+i}})).concat([{starter:false,athlete:{id:999,displayName:'Sub'}}])});
const reg=[1,2,3,4,5,6,7,8,9,10,11],rot=[1,2,3,4,20,21,22,23,24,25,26],homeXi=[101,102,103,104,105,106,107,108,109,110,111];
const sb={events:[{id:'900',date:'2026-10-22T16:45Z',competitions:[{competitors:[{homeAway:'home',team:{id:'50',displayName:'Jablonec'}},{homeAway:'away',team:{id:'331',displayName:'Brighton & Hove Albion'}}]}]}]};
const pre={header:{competitions:[{competitors:[{homeAway:'home',team:{id:'50'}},{homeAway:'away',team:{id:'331'}}]}]},rosters:[xi('50',homeXi),xi('331',rot)],
lastFiveGames:[{team:{id:'331'},events:[{id:'31',gameDate:'2026-10-18T14:00Z'},{id:'32',gameDate:'2026-10-11T14:00Z'},{id:'33',gameDate:'2026-10-04T14:00Z'}]},{team:{id:'50'},events:[{id:'51',gameDate:'2026-10-18T14:00Z'},{id:'52',gameDate:'2026-10-11T14:00Z'}]}]};
const past=(tid,ids)=>({rosters:[xi(tid,ids)]});
const map={'scoreboard':sb,'event=900':pre,'event=31':past('331',reg),'event=32':past('331',reg),'event=33':past('331',[1,2,3,4,5,6,7,8,9,10,12]),'event=51':past('50',homeXi),'event=52':past('50',homeXi)};
const fetchMock=async u=>{const k=Object.keys(map).find(k=>String(u).includes(k));return new Response(JSON.stringify(k?map[k]:{}),{status:k?200:404});};
const c=vm.createContext({Date,URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto,fetch:fetchMock});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
const b={gmTs:'260125',sport:'축구',league:'UEFA 컨퍼런스리그',date:'2026-10-23',time:'01:45',home:'야블로네츠',away:'브라이턴&호브 앨비언'};
c.ST={gmTs:'260125',markets:[{...b,no:9836,marketFamily:'HANDICAP',line:1,finalPick:'패',finalOdds:1.53,displayGrade:'추천',marked:true,representativeSelected:true,r554:{ps:.66,selected:true},r577Rec:{pick:'패'},r619Lock:{at:'x',pick:'패',odds:1.53,grade:'추천'}},{...b,no:9835,marketFamily:'MONEYLINE',choices:[]}]};
(async()=>{
const a=await run('r643RefreshLineups(ST,null,{nowMs:'+(T-50*60000)+',force:true})');
assert.equal(a.found,1,JSON.stringify(a));
const f=run('Object.values(ST.r643)[0]');assert.equal(f.away.miss,7,'7 Brighton regulars missing');assert.equal(f.home.miss,0);assert.equal(f.done,true);
c.Date=Date;run('Date.now=()=>'+(T-40*60000));
run('r643Apply(ST)');const m=run('ST.markets[0]');
assert.equal(m.displayGrade,'일반');assert.match(m.r554.why,/주전 대거 휴식/);assert.equal(m.r619Lock.grade,'일반');assert.ok(m.r577Rec.off);
run('r619Lock(ST)');assert.equal(run('ST.markets[0].displayGrade'),'일반','lock keeps the rotation demotion');
const html=vm.runInContext('INDEX',c);assert.ok(html.includes('function r643Html')&&html.includes('function r643Team'));
console.log('R643 rotation OK');})().catch(e=>{console.error(e);process.exit(1);});
