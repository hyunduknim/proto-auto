const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const NOW=Date.parse('2026-10-13T03:25:00+09:00');class Clock extends Date{constructor(...a){super(...(a.length?a:[NOW]))}static now(){return NOW}}
const src=fs.readFileSync('자동마킹.js','utf8'),worker=vm.createContext({Date:Clock,URL,Response,Request,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(src.replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const WORKER_DEFAULT = {'),worker);
const get=fn=>vm.runInContext(fn,worker);
const m={gmTs:'260121',no:7845,date:'2026-10-13',time:'01:00',home:'알와슬',away:'알아흘리',sport:'축구',marketFamily:'TOTAL',line:2.5,marked:true,representativeSelected:true,finalPick:'오버',finalOdds:1.49,resultFinal:false};
const s={markets:[m],cloudflareSettlementAudit:{at:new Clock().toISOString(),status:'FINISHED_ROWS_CHECKED',candidates:0,settled:0},spogodSettlementAudit:{at:new Clock().toISOString(),status:'NO_VERIFIED_FINAL_ROWS'},relayAudit:{at:'2026-10-11T02:08:45Z',gmTs:'260120',premiumResultReadiness:{unannounced:3}},resultAudit:{ok:false,lastSuccessAt:'2026-10-11T02:08:45Z',errors:['timeout']}};
const before=JSON.stringify(s),h=get('settlementHealth')(s);
assert.equal(h.stalled,false,'fresh native checks with only five minutes elapsed are not a stalled relay');assert.equal(h.sourceCheckingFresh,true);assert.equal(h.verifiedFinalPending,0);assert.equal(h.premiumResultReadiness,null,'previous round readiness must not be shown for current pending');assert.equal(JSON.stringify(s),before);
s.cloudflareSettlementAudit.at='2026-10-11T02:08:45Z';s.spogodSettlementAudit.at=s.cloudflareSettlementAudit.at;assert.equal(get('settlementHealth')(s).stalled,true);
assert.equal(get('r450SettlementCadenceMs')({markets:[m]}),30000);assert.equal(get('r450LiveOddsRetryAllowed')({...s,sourceAudit:{ok:false,lastAt:new Clock().toISOString()}},false),false);assert.equal(get('r450LiveOddsRetryAllowed')({...s,sourceAudit:{ok:false,lastAt:new Clock().toISOString()}},true),false);
assert.equal(get('r450LiveOddsRetryAllowed')({...s,sourceAudit:{ok:false,lastAt:new Clock(NOW-180000).toISOString()}},true),true,'failed odds retry after three minutes');
assert.equal(get('r450LiveOddsRetryAllowed')({markets:[],sourceAudit:{ok:false,lastAt:new Clock().toISOString()}},true),true,'pregame refresh remains allowed without live results');
assert.equal(get('r450LiveOddsRetryAllowed')({...s,sourceAudit:{ok:true,lastAt:new Clock().toISOString()}},true),true,'working odds source remains allowed');

const row={gmTs:'260121',no:7851,date:'2026-10-13',time:'01:30',home:'아탈란타BC',away:'베네치아',sport:'축구',marketFamily:'MONEYLINE',marked:true,representativeSelected:true,finalPick:'승',finalOdds:1.43,resultFinal:true,result:'무',resultScoreText:'0:0',hit:false,settlementStatus:'낙첨',choices:[{label:'승',odds:1.43},{label:'무',odds:4},{label:'패',odds:5}]};
const st={markets:[structuredClone(row)],settlementLedger:[],settledCards:{rows:[]}};
const out=get('r457RepairAtalanta')(st);assert.equal(out.changed,true);assert.equal(st.markets[0].resultScoreText,'3:1');assert.equal(st.markets[0].result,'승');assert.equal(st.markets[0].hit,true);assert.equal(st.markets[0].finalPick,'승');assert.equal(st.markets[0].finalOdds,1.43);assert.equal(get('r457RepairAtalanta')(st).changed,false);
const other={markets:[{...row,no:7852}]};assert.equal(get('r457RepairAtalanta')(other).changed,false);
const renamed={markets:[{...row,away:'다른팀'}]};assert.equal(get('r457RepairAtalanta')(renamed).changed,false);
console.log('PASS R457: exact verified 3:1 repair, original pick/odds preserved, repeat-safe, wrong market/fixture excluded');
