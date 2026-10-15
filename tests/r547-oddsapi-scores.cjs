const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
run(`Date.now=()=>Date.parse('2026-10-15T21:15:00Z');CALLS=[];
SCORES=[{id:"ev1",sport_key:"soccer_uefa_europa_conference_league",commence_time:"2026-10-15T16:45:00Z",completed:true,home_team:"KAA Gent",away_team:"AGF",scores:[{name:"KAA Gent",score:"2"},{name:"AGF",score:"1"}]},
{id:"ev2",sport_key:"soccer_uefa_europa_conference_league",commence_time:"2026-10-15T16:45:00Z",completed:false,home_team:"FC Lugano",away_team:"Red Star Belgrade",scores:null}];
fetch=async u=>{CALLS.push(String(u));return {ok:true,status:200,headers:{get:k=>({"x-requests-remaining":"200","x-requests-used":"300","x-requests-last":"2"})[k]||null},text:async()=>JSON.stringify(SCORES)};};
saveState=async()=>{};markState=()=>{};
const mk=(no,home,away,fam,pick,line)=>({gmTs:"260122",no,sport:"축구",league:"UEFA 컨퍼런스리그",date:"2026-10-16",time:"01:45",home,away,marketFamily:fam,line,marked:true,representativeSelected:true,finalPick:pick,finalOdds:1.8,gameStarted:true,
choices:fam==="TOTAL"?[{label:"오버",odds:1.8},{label:"언더",odds:1.9}]:[{label:"승",odds:1.8},{label:"무",odds:3.4},{label:"패",odds:4.2}]});
ST={gmTs:"260122",markets:[mk(8426,"KAA헨트","AGF오르후스","MONEYLINE","승"),mk(8438,"루가노","FK츠르베나 즈베즈다","TOTAL","오버",2.5)],r507Overseas:{matches:{},budget:{remaining:200}}};
ST.r507Overseas.markets={"260122:8426":{eventId:"ev1",sportKey:"soccer_uefa_europa_conference_league",kick:Date.parse("2026-10-15T16:45:00Z")}};
ST.markets.push(Object.assign(mk(8437,"루가노","FK츠르베나 즈베즈다","MONEYLINE","승"),{marked:false,representativeSelected:false}));ST.r507Overseas.markets["260122:8437"]={eventId:"ev2",sportKey:"soccer_uefa_europa_conference_league",kick:Date.parse("2026-10-15T16:45:00Z")};`);
(async()=>{
 assert.equal(run('r547Pending(ST).length'),2);
 const a=await run('r547RefreshScores(ST,{THE_ODDS_API_KEY:"k"})');
 assert.equal(a.calls,1,'one call per league');assert.equal(a.settled,1);assert.equal(a.reasons.NOT_COMPLETED,1);
 assert.ok(run('CALLS[0]').includes('/scores')&&run('CALLS[0]').includes('daysFrom=2'));
 assert.equal(run('ST.markets[0].hit'),true,'Gent 2:1 → 승 적중');assert.equal(run('ST.markets[0].resultSource'),'ODDSAPI_VERIFIED_FINAL_SCORE');
 assert.equal(run('ST.markets[1].resultFinal'),undefined,'unfinished game stays pending');
 const b=await run('r547RefreshScores(ST,{THE_ODDS_API_KEY:"k"})');assert.equal(b.status,'THROTTLED','same league not re-polled within 45 min');
 console.log('R547 Odds API scores settlement OK');
})().catch(e=>{console.error(e);process.exit(1)});
