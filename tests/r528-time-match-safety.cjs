const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);

// R528 budget: The Odds API resets on the 1st of every month, so credits are spread until the next 1st (UTC).
c.NOW=Date.parse('2026-10-15T13:41:00Z');
const b=run('r507Budget({budget:{day:"2026-10-15",spent:8,remaining:257,periodStart:NOW}},NOW,{dailyCredits:null})');
assert.equal(b.daily,14,'257 credits - 15 reserve over 17 days until Nov 1');
assert.equal(b.canSpend(2),true,'two-credit fetch allowed after the old 8/day cap');
assert.equal(run('(()=>{const s={budget:{remaining:257}};r507Budget(s,NOW,{dailyCredits:null});return s.budget.periodEnds})()'),'2026-11-01T00:00:00.000Z');
assert.equal(run('(()=>{const s={budget:{remaining:300}};r507Budget(s,Date.parse("2026-12-20T00:00:00Z"),{dailyCredits:null});return s.budget.periodEnds})()'),'2027-01-01T00:00:00.000Z','year rollover');

// R528 matching: a lone same-time candidate is not trusted while other leagues' events are still missing.
const kick=Date.parse('2026-10-15T19:00:00Z');
c.KICK=kick;
run(`G={key:"g1",sport:"축구",league:"UEL",home:"페렌츠바로시TC",away:"빅토리아 플젠",kick:KICK,markets:[]};
KEYS=[{key:"soccer_england_league1",group:"Soccer"},{key:"soccer_uefa_europa_league",group:"Soccer"}];
PARTIAL={events:{soccer_england_league1:{at:1,list:[{id:"mansfield",t:KICK,h:"Mansfield Town",a:"Oxford United"}]}}};`);
let rows=run('r507MatchGames({aliases:{}},[G],PARTIAL,KEYS)');
assert.equal(rows[0].match,null,'time-only match must wait until every league list is loaded');
run(`FULL={events:{soccer_england_league1:PARTIAL.events.soccer_england_league1,soccer_uefa_europa_league:{at:1,list:[{id:"ferenc",t:KICK,h:"Ferencvaros",a:"Viktoria Plzen"}]}}};`);
rows=run('r507MatchGames({aliases:{}},[G],FULL,KEYS)');
assert.equal(rows[0].match?.id,'ferenc','with all lists loaded the real fixture wins');

// Stale numbers saved under the wrong event are removed when the game is matched again.
run(`M={gmTs:"260122",no:1,marketFamily:"MONEYLINE",choices:[{label:"승",odds:2},{label:"무",odds:3.2},{label:"패",odds:3.4}]};G.markets=[M];`);
const purge=run(`(()=>{const store={markets:{"260122:1":{eventId:"mansfield",kick:KICK}}};
const matches=r507MatchGames({aliases:{}},[G],FULL,KEYS);
for(const x of matches){const id=x.match?.id||null;if(!id&&!x.complete)continue;for(const m of x.game.markets){const k=m.gmTs+":"+m.no,e=store.markets[k];if(e&&e.eventId!==id)delete store.markets[k];}}
return Object.keys(store.markets).length})()`);
assert.equal(purge,0,'wrongly matched overseas probabilities are dropped');
console.log('R528 monthly credit budget + safe time match OK');

// R529 precision boost: spend only today's spare credits, never the ones later first looks need.
c.BNOW=Date.parse('2026-10-15T14:00:00Z'); // 23:00 KST
run(`BG={key:"b1",sport:"축구",home:"A",away:"B",kick:BNOW+2*3600000,markets:[{gmTs:"260122",no:9,marketFamily:"HANDICAP",line:1,choices:[{label:"승",odds:1.9},{label:"패",odds:1.9}]}]};
BM=[{game:BG,match:{id:"e1",sportKey:"soccer_uefa_europa_league"}}];OPT={windowMs:6*3600000};`);
const spare=run('r528PrecisionBoost({markets:{},oddsAt:{}},BM,BNOW,OPT,r507Budget({budget:{day:"2026-10-15",spent:4,remaining:257}},BNOW,{dailyCredits:14}))');
assert.equal(spare?.boost,true,'spare credits refresh the nearest league');assert.equal(spare.handicap,true,'handicap books requested for precision view');
assert.equal(run('r528PrecisionBoost({markets:{},oddsAt:{}},BM,BNOW,OPT,r507Budget({budget:{day:"2026-10-15",spent:7,remaining:257}},BNOW,{dailyCredits:14}))'),null,'reserve for later first looks is kept');
assert.equal(run('r528PrecisionBoost({markets:{},oddsAt:{soccer_uefa_europa_league:BNOW-10*60000}},BM,BNOW,OPT,r507Budget({budget:{day:"2026-10-15",spent:0,remaining:257}},BNOW,{dailyCredits:14}))'),null,'same league is not refreshed again within 30 minutes');
console.log('R529 precision boost OK');
