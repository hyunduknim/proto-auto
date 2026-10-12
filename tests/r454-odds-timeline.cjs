const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const src=fs.readFileSync('자동마킹.js','utf8'),worker=vm.createContext({URL,Response,Request,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(src.replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const WORKER_DEFAULT = {'),worker);
const index=vm.runInContext('INDEX',worker),client=index.match(/<script>([\s\S]*?)<\/script>/)[1];const nodes={},ctx=vm.createContext({Date,Number,Math,JSON,Intl,console,document:{getElementById:id=>nodes[id]??={textContent:'',classList:{toggle(){}}}},localStorage:{setItem(){}},setInterval(){}});
vm.runInContext(client.slice(0,client.indexOf('function bindActionButton')),ctx);const fn=n=>vm.runInContext(n,ctx),now=new Date().toISOString();
const row={no:7845,marketFamily:'TOTAL',market:'언더오버',line:2.5,marked:true,finalPick:'오버',finalOdds:1.49,choices:[{label:'언더',odds:2.15},{label:'오버',odds:1.49}],oddsSnapshotStatus:'OPEN',precision:{valid:true,observedAt:now,period:'FULL_TIME',historyCount:2,choices:[{label:'언더',currentOdds:2.15,firstObservedOdds:2.05,sampleSamples:565,sampleHits:259},{label:'오버',currentOdds:1.49,firstObservedOdds:1.6,sampleSamples:565,sampleHits:306}]}};
const game={no:7845,pick:'오버',odds:1.49,sport:'축구',displayGrade:'추천',marketRows:[row]},before=JSON.stringify(game),main=fn('expBody')(game),detail=fn('expDSFull')(game,row);
assert.match(main,/배당으로 본 가능성/);assert.match(main,/59\.1%/);assert.match(main,/40\.9%/);assert.match(main,/width:59\.1%/);assert.match(main,/배당은 오버 쪽/);assert.match(main,/실제 승률/);assert.match(detail,/306회/);assert.match(detail,/54\.2%/);
const forbidden=/손익|\bEV\b|기대값|시장비중|환급|마진|오버라운드|Wilson|%p|정합성|역배당합|표본|원천/;
assert.doesNotMatch(main+detail,forbidden,'all visible explanations including expanded details use plain language');assert.equal(JSON.stringify(game),before);
const opposite={...row,finalPick:'언더'};assert.match(fn('expDS')(game,opposite),/현재 마킹은 언더.*배당은 오버/);
assert.doesNotMatch(fn('expDS')(game,{...row,choices:[{label:'오버',odds:0}]}),/width:|NaN|Infinity/);
const noHistory={...row,precision:{...row.precision,choices:[]}};assert.match(fn('expDSFull')(game,noHistory),/지난 결과가 없습니다/);
const stale={...row,oddsSnapshotStatus:'LAST_KNOWN'};assert.match(fn('expDS')(game,stale),/마감|지난 배당/);

assert.match(fn('expEasyCheck')(game,row),/마킹과 배당 방향/);assert.match(fn('expEasyCheck')(game,row),/같은 쪽/);assert.match(fn('expEasyCheck')(game,{...row,finalPick:'언더'}),/다른 쪽/);
assert.match(fn('expEasyCheck')(game,{...row,choices:[{label:'언더',odds:0}]}),/확인 보류/);
const h={...row,precision:{...row.precision,history:[{at:'2026-10-12T16:00:00Z',prices:[{label:'언더',odds:2.05},{label:'오버',odds:1.6}]},{at:'2026-10-12T16:30:00Z',prices:[{label:'언더',odds:2.10},{label:'오버',odds:1.55}]}]}};
const timeline=fn('expEasyTimeline')(game,h);
assert.match(timeline,/시간별 실제 배당 기록/);assert.match(timeline,/0\.05배 내려감/);assert.match(timeline,/0\.05배 올라감/);assert.match(timeline,/한국시간/);assert.doesNotMatch(timeline,forbidden);
const one=fn('expEasyTimeline')(game,{...row,precision:{observedAt:now}});assert.match(one,/이전 기록 없음/);assert.doesNotMatch(one,/내려감|올라감/);
const none=fn('expEasyTimeline')(game,{...row,precision:{history:[{at:'bad',prices:[]},{at:'2099-01-01',prices:[{label:'오버',odds:1.8}]}]}});assert.match(none,/확인 시각이 있는 배당 기록이 없습니다/);
assert.equal(JSON.stringify(game),before);
console.log('PASS R454: same/opposite/missing marking evidence, actual timestamps, precise per-choice moves, no fabricated history');

const tied={...row,marked:false,choices:[{label:'승',odds:1.8},{label:'패',odds:1.8}]};assert.match(fn('expEasyCheck')(game,tied),/차이가 작음/);assert.doesNotMatch(fn('expEasyCheck')(game,tied),/앞섭니다/);assert.doesNotMatch(fn('expEasyData')(game,tied).reasons.join(' '),/보다 낮게/);
