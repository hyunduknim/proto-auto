"use strict";
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict");
const source=fs.readFileSync("자동마킹.js","utf8");
const ctx=vm.createContext({URL,Request,Response,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(source.replace("export class ProtoStateDO","class ProtoStateDO").replace("export default {","const WORKER_DEFAULT = {"),ctx);
const fn=n=>vm.runInContext(n,ctx),reconcile=fn("r478Reconcile7883Over"),stats=fn("r398CurrentSummary");
const proto=change=>({
 gmTs:"260121",no:7883,date:"2026-10-13",time:"04:00",
 sport:"축구",league:"스페인 라리가",home:"레반테",away:"세비야",
 market:"언더오버",marketFamily:"TOTAL",line:2.5,
 marked:true,representativeSelected:true,finalPick:"오버",finalOdds:1.86,
 choices:[{label:"언더",odds:1.67},{label:"오버",odds:1.86}],...change
});
const build=change=>({round:121,gmTs:"260121",markets:[proto(change)],settlementLedger:[],settledCards:{gmTs:"260121",rows:[]}});
const s=build(),betBefore={pick:s.markets[0].finalPick,odds:s.markets[0].finalOdds},a=reconcile(s);
assert.equal(a.changed,true);assert.equal(s.markets[0].resultFinal,true);
assert.equal(s.markets[0].hit,true);assert.equal(s.markets[0].settlementStatus,"적중");
assert.equal(s.markets[0].result,"오버");assert.equal(s.markets[0].resultScoreText,"3:3");
assert.deepEqual({pick:s.markets[0].finalPick,odds:s.markets[0].finalOdds},betBefore);
assert.equal(s.settlementLedger.length,1);assert.equal(s.settlementLedger[0].hit,true);
assert.equal(s.settledCards.rows.length,1);assert.equal(s.settledCards.rows[0].hit,true);
assert.equal(stats(s).hits,1);assert.equal(stats(s).misses,0);
assert.equal(reconcile(s).reason,"ALREADY_CORRECT");
assert.equal(fn("r446VerifiedRank")({resultSource:s.markets[0].resultSource}),9);
const preWrong=build({resultFinal:true,result:"언더",hit:false,settlementStatus:"낙첨",resultScoreText:"3:2"});
assert.equal(reconcile(preWrong).changed,true);
assert.equal(preWrong.markets[0].hit,true);assert.equal(preWrong.markets[0].resultScoreText,"3:3");
for(const [patch,why] of [
 [{finalPick:"언더"},"NOT_ORIGINAL_OVER_SELECTION"],
 [{marked:false},"NOT_MARKED_REPRESENTATIVE_OVER"],
 [{line:3.5},"MARKET_OR_FIXTURE_MISMATCH"],
 [{date:"2026-10-14"},"MARKET_OR_FIXTURE_MISMATCH"],
 [{time:"03:00"},"MARKET_OR_FIXTURE_MISMATCH"],
 [{away:"바르셀로나"},"MARKET_OR_FIXTURE_MISMATCH"],
 [{marketFamily:"MONEYLINE"},"MARKET_OR_FIXTURE_MISMATCH"],
 [{market:"전반 언더오버"},"MARKET_OR_FIXTURE_MISMATCH"],
 [{settlementStatus:"적특",resultSpecialStatus:"취소"},"OFFICIAL_VOID_CONFLICT"]
]){
 const t=build(patch),before=JSON.stringify(t);
 assert.equal(reconcile(t).reason,why,JSON.stringify(patch));
 assert.equal(JSON.stringify(t),before,"blocked cases never mutate state");
}
const duplicate=build();duplicate.markets.push(proto({}));
assert.equal(reconcile(duplicate).reason,"DUPLICATE_PROTO_NUMBER");
const rival=build();rival.markets.push({...proto({}),no:7880,marketFamily:"MONEYLINE",market:"일반",line:null,finalPick:"무",finalOdds:2.9});
assert.equal(reconcile(rival).reason,"COMPETING_REPRESENTATIVE");
const archived=build(),initial=reconcile(archived);
assert.equal(initial.changed,true);archived.markets=[];
archived.settlementLedger[0].hit=false;archived.settlementLedger[0].settlementStatus="낙첨";
archived.settledCards.rows[0].hit=false;archived.settledCards.rows[0].settlementStatus="낙첨";
assert.equal(reconcile(archived).changed,true);
assert.equal(archived.settlementLedger[0].hit,true);assert.equal(archived.settledCards.rows[0].hit,true);
const mixed=build();mixed.markets.push({...proto({}),gmTs:"260121",no:7999,home:"다른팀",away:"다른팀",date:"2026-10-14",line:3.5,finalPick:"언더",finalOdds:1.8});
const unaffected=JSON.stringify(mixed.markets[1]);reconcile(mixed);assert.equal(JSON.stringify(mixed.markets[1]),unaffected);
assert.match(source,/BEFORE_R478_WARM_LEVANTE_7883_OVER/);
assert.match(source,/BEFORE_R478_LEVANTE_7883_OVER_RECONCILE/);
assert.match(source,/r4787883Audit:state\.r4787883Audit/);
console.log("R478 PASS: official 3:3 Over2.5 #7883 settled; ledger+UI synced; frozen selection, stale, archive, under, duplicate and identity guards");
