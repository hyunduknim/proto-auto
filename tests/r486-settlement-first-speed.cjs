"use strict";
const fs=require("node:fs"),assert=require("node:assert/strict"),vm=require("node:vm");
const src=fs.readFileSync("자동마킹.js","utf8");
const start=src.indexOf("async function runTickInternal(env){");
const finish=src.indexOf("function doStub(env)",start);
assert.ok(start>0&&finish>start,"Cannot find the automatic settlement tick");
const tick=src.slice(start,finish);
const before="if(!settlementFirst){\n    await settlementCheck('LIVE_ODDS_OBSERVATIONS'";
const after='if(settlementFirst){\n    await settlementCheck("LIVE_ODDS_OBSERVATIONS"';
const zen=tick.indexOf('await settlementCheck("ZENTOTO"');
const spogod=tick.indexOf('await settlementCheck("SPOGOD"');
const official=tick.indexOf('await settlementCheck("BETMAN_RESULTS"');
const lateQuote=tick.indexOf(after);
assert.ok(tick.includes(before),"Live odds remain enabled when no final result is pending");
assert.ok(zen>=0&&spogod>zen&&official>spogod&&lateQuote>official,
  "Pending full-time checks must precede a potentially slow pregame quote fetch");
assert.ok(tick.indexOf("if(!urgentPregame||settlementFirst)")>lateQuote,
  "Existing odds refresh and pregame analysis remain available");
assert.equal((tick.match(/r485RefreshLiveQuotes\(cur,env\)/g)||[]).length,2,
  "Live odds must run on exactly one of the two settlement-first branches");
assert.match(src,/function r450SettlementCadenceMs\(state\)\{return pendingSettlementMarkets\(state\)\.length\?25000:120000;\}/);
assert.match(src,/if\(hasLivePending\(s\)\)return Math\.max\(1000,Math\.min\(Number\(this\.env\?\.DO_LIVE_ALARM_MS\)\|\|r450SettlementCadenceMs\(s\),r450SettlementCadenceMs\(s\)\)\)/);
const ctx=vm.createContext({URL,Response,Request,TextEncoder,TextDecoder,AbortController,
  console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(src.replace("export class ProtoStateDO","class ProtoStateDO").replace("export default {","const WorkerDefault = {"),ctx);
const evaluate=x=>vm.runInContext(x,ctx);
assert.equal(evaluate("r450SettlementCadenceMs({markets:[]})"),120000);
assert.equal(evaluate("CFG.minRepOdds"),1.31);
assert.equal(evaluate("CFG.gradeBestRate"),0.15);
assert.equal(evaluate("CFG.gradeRecommendRate"),0.25);
assert.equal(evaluate("CFG.marketTarget.TOTAL"),0.60);
console.log("PASS R486: terminal results before live quotes, 25s active polling, original ratios and odds preserved");
