const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const WORKER_DEFAULT = {'),c);
const run=s=>vm.runInContext(s,c),now=Date.now(),kick=now+2*3600000;
const kt=new Date(kick+9*3600000).toISOString();
c.G={gmTs:'260122',no:8174,date:kt.slice(0,10),time:kt.slice(11,16),sport:'야구',league:'MLB',home:'LA 다저스',away:'밀워키 브루어스',marketFamily:'MONEYLINE',period:'FULL',source:'betman_official',choices:[{label:'승',odds:1.8},{label:'패',odds:1.9}],domesticOddsFetchedAt:new Date(now).toISOString()};
c.E={id:'fixture',sport_key:'baseball_mlb',commence_time:new Date(kick).toISOString(),home_team:'Los Angeles Dodgers',away_team:'Milwaukee Brewers',bookmakers:[{key:'pinnacle',title:'Pinnacle',markets:[{key:'h2h',last_update:new Date(now-60000).toISOString(),outcomes:[{name:'Los Angeles Dodgers',price:1.92},{name:'Milwaukee Brewers',price:2.04}]}]}]};
const data=new Map();c.STORAGE={get:async k=>data.get(k),put:async(k,v)=>data.set(k,structuredClone(v))};
(async()=>{
 assert.equal(run('typeof r508Precision'),'function','current R507 has no overseas precision endpoint');
 run('MEM.doStorage=STORAGE;MEM.inDurableObject=true;MEM.state={markets:[G],r507Overseas:{matches:{},markets:{},budget:{remaining:300}}};globalThis.NETWORK=0;globalThis.fetch=async()=>{NETWORK++;throw Error("NO_UI_NETWORK")};loadState=async()=>{throw Error("warm read must not run full state repair")};');
 const req='new Request("https://proto.test/api/overseas-odds?gmTs=260122&no=8174")';
 let r=await run('r508Precision('+req+',{THE_ODDS_API_KEY:"private"},STORAGE)');let x=await r.json();
 assert.equal(x.fetchStatus,'AWAITING_COLLECTOR');assert.equal(c.NETWORK,0);
 run('MEM.state.r507Overseas.matches[gameSeed(G)]={eventId:E.id,sportKey:E.sport_key}');
 await run('r508RememberOdds("/v4/sports/baseball_mlb/odds",[E])');
 const original=JSON.stringify(run('MEM.state'));
 r=await run('r508Precision('+req+',{THE_ODDS_API_KEY:"private"},STORAGE)');x=await r.json();
 assert.equal(x.status,'MATCHED');assert.equal(x.markets[0].choices[0].overseas,1.92);assert.equal(x.markets[0].bookCount,1);
 assert.equal(c.NETWORK,0);assert.equal(JSON.stringify(run('MEM.state')),original,'precision never changes engine, picks, budget or settlement');assert.ok(!JSON.stringify(x).includes('private'));
 run('globalThis.ENV={THE_ODDS_API_KEY:"private",ADMIN_TOKEN:"private-admin"}');
 r=await run('handleApp(new Request("https://proto.test/api/overseas-status"),ENV,{})');
 x=await r.json();assert.equal(x.configured,true);assert.equal(x.adminConfigured,true);assert.ok(!JSON.stringify(x).includes('private'));
 run('MEM.state.r507Overseas.matches.legacy={kick:String(Date.now()+3600000)}');
 r=await run('handleApp(new Request("https://proto.test/api/overseas-status"),ENV,{})');x=await r.json();assert.ok(x.matches.some(m=>m.kick),'legacy numeric timestamp strings must not crash diagnostics');
 r=await run('r508Precision(new Request("https://proto.test/api/overseas-odds?gmTs=260122&no=99999"),ENV,STORAGE)');assert.equal(r.status,404);
 run('MEM.state.markets[0].period="1Q";MEM.state.markets[0].domesticOddsSnapshot={period:"FULLTIME"}');
 r=await run('r508Precision('+req+',ENV,STORAGE)');x=await r.json();assert.equal(x.markets[0].status,'PERIOD_MISMATCH');
 const html=run('INDEX'),script=html.match(/<script>([\s\S]*?)<\/script>/)[1];new vm.Script(script);
 assert.ok(html.includes('r506OverseasHtml'));assert.ok(html.includes('업체별 배당'));assert.ok(html.includes('r518ScheduleOverseas')); // Source-level no-paid-request invariant is asserted above.
 console.log('PASS R508: real cached bookmaker UI, exact identity/scope, zero paid UI requests, warm status, no secrets or state mutation');
})().catch(e=>{console.error(e);process.exitCode=1});

