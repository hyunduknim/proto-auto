"use strict";
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict");
const source=fs.readFileSync("자동마킹.js","utf8");
const worker=vm.createContext({URL,Response,Request,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(source.replace("export class ProtoStateDO","class ProtoStateDO").replace("export default {","const WORKER_DEFAULT = {"),worker);
const html=vm.runInContext("INDEX",worker),client=html.split("<script>")[1].split("</script>")[0];
new vm.Script(client);
const nodes={};
const ctx=vm.createContext({Date,Number,Math,JSON,Intl,console,document:{getElementById:id=>nodes[id]??={textContent:"",classList:{toggle(){}}}},localStorage:{setItem(){}},setInterval(){}});
vm.runInContext(client.slice(0,client.indexOf("function bindActionButton")),ctx);
const fn=name=>vm.runInContext(name,ctx);
const row={no:7845,marketFamily:"TOTAL",market:"언더오버",line:2.5,marked:true,finalPick:"오버",finalOdds:1.49,
choices:[{label:"언더",odds:2.15},{label:"오버",odds:1.49}],oddsSnapshotStatus:"OPEN",
precision:{valid:true,observedAt:new Date().toISOString(),period:"FULL_TIME",historyCount:2,choices:[
{label:"언더",currentOdds:2.15,firstObservedOdds:2.05,sampleSamples:565,sampleHits:259},
{label:"오버",currentOdds:1.49,firstObservedOdds:1.6,sampleSamples:565,sampleHits:306}]}};
const game={no:7845,pick:"오버",odds:1.49,sport:"축구",selectionMode:"R400_EVIDENCE_FIRST",
calibratedProbability:.63,conservativeProbability:.57,gradeEvidenceQualified:true,marketRows:[row]};
const before=JSON.stringify(game),main=fn("expBody")(game),detail=fn("expDSFull")(game,row);
assert.match(main,/선택지별 배당 비교/);
assert.match(main,/배당으로 본 가능성/);
assert.match(main,/59\.1%/);
assert.match(main,/40\.9%/);
assert.match(main,/경기 자료 예상치 63\.0%/);
assert.match(main,/보수 참고값 57\.0%/);
assert.match(main,/배당은 오버 쪽/);
assert.match(main,/현재 마킹/);
assert.match(detail,/95% 참고 범위/);
assert.match(detail,/54\.2%/);
assert.match(detail,/565경기/);
assert.doesNotMatch(main+detail,/NaN|Infinity|undefined|시간별 실제 배당 기록/);
assert.equal(JSON.stringify(game),before);
const missingModel={...game,selectionMode:"MANUAL",calibratedProbability:.99,manualOverride:true};
const manual=fn("expBody")(missingModel);
assert.match(manual,/경기 분석 자료 부족/);
assert.doesNotMatch(manual,/경기 자료 예상치 99\.0%/);
const bad={...row,choices:[{label:"오버",odds:0}]};
assert.doesNotMatch(fn("expDS")(game,bad),/width:|NaN|Infinity/);
const stale={...row,oddsSnapshotStatus:"LAST_KNOWN"};
assert.match(fn("expDS")(game,stale),/마감|지난 배당/);
const underround={...row,choices:[{label:"언더",odds:2.1},{label:"오버",odds:2.1}]};
const suspicious={...game,odds:2.1,marketRows:[underround]};
assert.equal(fn("r470ChanceData")(suspicious).status,"BAD_ODDS","underround domestic quotes must not be treated as reliable probabilities");
console.log("R472 premium probability UI PASS: source-aware estimates, all prices, past uncertainty, invalid and stale evidence, frozen marking");