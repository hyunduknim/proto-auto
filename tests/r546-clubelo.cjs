const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
const clubs=[['Man City','ENG',1980],['Arsenal','ENG',1990],['Liverpool','ENG',1960],['Chelsea','ENG',1850],['Real Madrid','ESP',1950],['Barcelona','ESP',1940],['Bayern','GER',1990],['Leverkusen','GER',1880],
['Inter','ITA',1920],['Milan','ITA',1820],['Juventus','ITA',1830],['Napoli','ITA',1840],['Paris SG','FRA',1940],['Lyon','FRA',1700],['Crystal Palace','ENG',1720],['Celta','ESP',1650],['Benfica','POR',1800],['Celtic','SCO',1700],['Salzburg','AUT',1680],['Ferencvaros','HUN',1600],['Plzen','CZE',1620]];
let csv='Rank,Club,Country,Level,Elo,From,To\n';clubs.forEach((x,i)=>csv+=`${i+1},${x[0]},${x[1]},1,${x[2]},2026-10-10,2026-10-20\n`);for(let i=0;i<120;i++)csv+=`None,Filler FC ${i},XXX,2,${1300+i},2026-10-10,2026-10-20\n`;
c.CSV=csv;
assert.equal(run('r546ParseCsv(CSV).length'),141);
run(`fetch=async u=>({ok:true,status:200,text:async()=>CSV});MEM.doStorage=null;`);
(async()=>{
 const r=await run('r546RefreshElo({},Date.now(),true)');assert.equal(r.status,'UPDATED');
 assert.equal(run('r546Find("맨체스터 시티","Manchester City")?.club'),'Man City','English hint from overseas match');
 assert.equal(run('r546Find("올랭피크 리옹","Lyon")?.club'),'Lyon');
 assert.equal(run('r546Find("SL벤피카","Benfica")?.club'),'Benfica');
 assert.equal(run('r546Find("RC셀타데비고","Celta Vigo")?.club'),'Celta');
 assert.equal(run('r546Find("울산HD",null)'),null,'non-European team is not forced');
 // annotate + tally
 run(`ST={gmTs:"260123",markets:[{gmTs:"260123",no:1,sport:"축구",league:"UEFA 유로파리그",date:"2099-01-01",time:"04:00",home:"SL벤피카",away:"셀틱",marketFamily:"MONEYLINE",marked:true,representativeSelected:true,finalPick:"승",choices:[{label:"승",odds:1.5},{label:"무",odds:4},{label:"패",odds:6}]}],r507Overseas:{matches:{}}};
 ST.r507Overseas.matches[gameSeed(ST.markets[0])]={api:"Benfica vs Celtic"};currentRoundMarket=()=>true;`);
 assert.equal(run('r546Annotate(ST)'),1);
 assert.ok(run('ST.markets[0].r546Elo.expHome')>.6,'Benfica home favourite by Elo');
 assert.equal(run('r546Annotate(ST)'),0,'no churn when nothing changed');
 run('Object.assign(ST.markets[0],{resultFinal:true,hit:true,settlementStatus:"적중"})');
 assert.equal(run('r546Tally(ST)'),1);assert.equal(run('r546Tally(ST)'),0,'counted once');
 assert.equal(run('JSON.stringify(r546Status(ST).record.agreeWithElo)'),JSON.stringify({n:1,hit:1,hitPct:100}));
 console.log('R546 ClubElo verification OK');
})().catch(e=>{console.error(e);process.exit(1)});
