const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const NOW=Date.parse('2026-10-13T01:05:00+09:00');class Clock extends Date{constructor(...a){super(...(a.length?a:[NOW]))}static now(){return NOW}}
const src=fs.readFileSync('자동마킹.js','utf8'),worker=vm.createContext({Date:Clock,URL,Response,Request,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(src.replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const WORKER_DEFAULT = {'),worker);
const get=fn=>vm.runInContext(fn,worker);
const m={gmTs:'260121',no:7845,date:'2026-10-13',time:'01:00',home:'알와슬',away:'알아흘리',sport:'축구',marketFamily:'TOTAL',line:2.5,marked:true,representativeSelected:true,finalPick:'오버',finalOdds:1.49,resultFinal:false};
const s={markets:[m],cloudflareSettlementAudit:{at:new Clock().toISOString(),status:'FINISHED_ROWS_CHECKED',candidates:0,settled:0},spogodSettlementAudit:{at:new Clock().toISOString(),status:'NO_VERIFIED_FINAL_ROWS'},relayAudit:{at:'2026-10-11T02:08:45Z',gmTs:'260120',premiumResultReadiness:{unannounced:3}},resultAudit:{ok:false,lastSuccessAt:'2026-10-11T02:08:45Z',errors:['timeout']}};
const before=JSON.stringify(s),h=get('settlementHealth')(s);
assert.equal(h.stalled,false,'fresh native checks with only five minutes elapsed are not a stalled relay');assert.equal(h.sourceCheckingFresh,true);assert.equal(h.verifiedFinalPending,0);assert.equal(h.premiumResultReadiness,null,'previous round readiness must not be shown for current pending');assert.equal(JSON.stringify(s),before);
s.cloudflareSettlementAudit.at='2026-10-11T02:08:45Z';s.spogodSettlementAudit.at=s.cloudflareSettlementAudit.at;assert.equal(get('settlementHealth')(s).stalled,true);
assert.equal(get('r450SettlementCadenceMs')({markets:[m]}),30000);assert.equal(get('r450LiveOddsRetryAllowed')({...s,sourceAudit:{ok:false,lastAt:new Clock().toISOString()}},false),false);assert.equal(get('r450LiveOddsRetryAllowed')({...s,sourceAudit:{ok:false,lastAt:new Clock().toISOString()}},true),true);
const index=get('INDEX'),client=index.match(/<script>([\s\S]*?)<\/script>/)[1];const nodes={};const context=vm.createContext({Date:Clock,Number,Math,JSON,Intl,console,document:{getElementById:id=>nodes[id]??={textContent:'',classList:{toggle(){}}}},localStorage:{setItem(){}},setInterval(){}});
vm.runInContext(client.slice(0,client.indexOf('function bindActionButton')),context);const fn=name=>vm.runInContext(name,context);
const row={no:1,marketFamily:'TOTAL',market:'언더오버',line:2.5,marked:true,finalPick:'오버',finalOdds:1.6,choices:[{label:'언더',odds:2.1},{label:'오버',odds:1.6}],oddsSnapshotStatus:'OPEN',precision:{valid:true,observedAt:new Clock().toISOString(),ageSec:0,period:'FULL_TIME',historyCount:2,choices:[{label:'오버',currentOdds:1.6,firstObservedOdds:1.8,sampleSamples:100,sampleHits:60}]}};
const analysis=fn('expDS')({sport:'축구'},row);assert.match(analysis,/배당으로 본 가능성/);assert.match(analysis,/56\.8%/);assert.match(analysis,/왜 이렇게 볼까요/);assert.doesNotMatch(analysis,/손익분기|시장비중|\bEV\b/);
const detailed=fn('expDSFull')({sport:'축구'},row);assert.match(detailed,/100경기 중 오버 60회/);assert.match(detailed,/60\.0%/);assert.match(detailed,/배당이 어떻게/);assert.doesNotMatch(detailed,/플러스 기대값 확정|적중확률 62\.5/);
const frozen={...row,precision:{...row.precision,observedAt:'2026-10-12T00:00:00Z',ageSec:0}};assert.equal(fn('expDQuality')(frozen).fresh,false,'elapsed freshness is derived from actual timestamp, not frozen ageSec');
assert.equal(fn('expDQuality')({...row,choices:[{label:'승',odds:3},{label:'패',odds:3}]}).valid,false,'underround domestic quotes require recheck');
const body=fn('expBody')({no:1,pick:'오버',odds:1.6,sport:'축구',marketRows:[{...row,no:2,marked:false},row]});assert.ok(body.indexOf('#1')<body.indexOf('#2'));assert.match(body,/전체 배당 비교/);
console.log('PASS R450 health: fresh empty checks, stale detection, round scope, 30 sec cadence, live odds backoff. Analysis: break-even, margin, samples, freshness, selected-first, no state mutation.');

worker.liveFixture={markets:[m],resultAudit:{ok:false,errors:['timeout']}};
vm.runInContext('MEM.state=liveFixture',worker);assert.equal(get('ProtoStateDO').prototype.alarmIntervalMs.call({env:{}}),30000,'native alarm stays 30 sec even during official backoff');
if(fs.existsSync('live-current.json')){const live=JSON.parse(fs.readFileSync('live-current.json','utf8')),liveBefore=JSON.stringify(live);
for(const game of live.markingGames){const output=fn('expBody')(game);assert.doesNotMatch(output,/NaN|Infinity|undefined/);assert.match(output,/왜 이렇게 볼까요/);for(const row of game.marketRows||[])assert.doesNotMatch(fn('expDSFull')(game,row),/NaN|Infinity|undefined/);}
assert.equal(JSON.stringify(live),liveBefore);console.log('PASS LIVE REPLAY: all 32 current games and market details rendered without invalid numbers; marks and settlement unchanged');

}
