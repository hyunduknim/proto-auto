'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const NOW=Date.parse('2026-10-14T08:08:00+09:00');
class Clock extends Date{constructor(...args){super(...(args.length?args:[NOW]));}static now(){return NOW;}}
const context=vm.createContext({Date:Clock,URL,Response,Request,TextEncoder,TextDecoder,
  AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
const source=fs.readFileSync('자동마킹.js','utf8');
vm.runInContext(source.replace('export class ProtoStateDO','class ProtoStateDO')
  .replace('export default {','const TEST_WORKER_DEFAULT = {'),context);
const f=(s)=>vm.runInContext(s,context);
const previous={gmTs:'260121',no:7883,date:'2026-10-13',time:'18:30',home:'이전홈',
  away:'이전원정',sport:'야구',marketFamily:'TOTAL',line:2.5,
  choices:[{label:'언더',odds:1.67},{label:'오버',odds:1.86}],
  marked:true,representativeSelected:true,finalPick:'오버',finalOdds:1.86,
  displayGrade:'추천',resultFinal:false};
const state={version:f('APP_VERSION'),round:121,gmTs:'260121',markets:[previous],
  settlementLedger:[{gmTs:'260121',no:7722,hit:true}]};
assert.equal(f('r487SaleRolloverDue')(state,NOW),true);
assert.equal(f('r487SaleRolloverDue')({...state,round:122,gmTs:'260122',
  markets:[{gmTs:'260122',date:'2026-10-14',time:'16:45'}]},NOW),false);
assert.equal(f('r487SaleRolloverDue')(state,Date.parse('2026-10-14T07:59:00+09:00')),false);
assert.equal(f('r487SaleRolloverDue')(state,Date.parse('2026-10-15T08:08:00+09:00')),false);
const mk=(no,home,away,priced=false)=>({
  matchSeq:no,gameDate:Date.parse('2026-10-14T18:00:00+09:00'),
  betNm:'언더오버',betTypNm:'언더오버',itemCode:'BS',leagueShortName:'NPB',
  homeName:home,awayName:away,winHandi:7.5,winTxt:'언더',loseTxt:'오버',
  winAllot:priced?1.82:null,loseAllot:priced?1.70:null
});
const rows=[mk(8102,'한신','요코하마'),mk(8107,'소프트뱅크','닛폰햄'),
  mk(8135,'비셀고베','전북현대')];
(async()=>{
  context.officialRaw={compSchedules:{datas:rows}};
  vm.runInContext('fetchGameInfo=async round=>{if(round!==\'260122\')throw Error(\'WRONG_ROUND\');return officialRaw}',context);
  let r=await f('r487VerifyNextOfficialRound')(state,NOW);
  assert.equal(r.round.gmTs,'260122');
  assert.equal(r.audit.status,'VERIFIED_SCHEDULE_WAITING_ODDS');
  assert.equal(r.audit.priced,0,'no fabricated domestic odds');
  assert.equal(r.audit.fixtures,3);
  assert.equal(JSON.stringify(state.markets[0]),JSON.stringify(previous),'old pick unchanged');
  assert.equal(state.settlementLedger[0].hit,true);
  context.officialRaw={compSchedules:{datas:rows.slice(0,2)}};
  r=await f('r487VerifyNextOfficialRound')(state,NOW);
  assert.equal(r.round,null,'two price-free fixtures are insufficient');
  context.officialRaw={compSchedules:{datas:rows.slice(0,2).map((x,i)=>mk(x.matchSeq,x.homeName,x.awayName,true))}};
  r=await f('r487VerifyNextOfficialRound')(state,NOW);
  assert.equal(r.audit.status,'VERIFIED_PRICED');
  assert.equal(r.round.gmTs,'260122');
  context.officialRaw={compSchedules:{datas:rows.map(x=>({...x,homeName:'같은팀',awayName:'같은원정'}))}};
  r=await f('r487VerifyNextOfficialRound')(state,NOW);
  assert.equal(r.round,null,'multiple markets for one fixture do not establish a new round');
  context.testState=structuredClone(state);
  context.testCalls=[];
  vm.runInContext(`MEM.state=testState;loadState=async()=>testState;
    saveState=async s=>{MEM.state=s;return s;};r394FiveMinuteDue=()=>false;
    r410RefreshZenPregame=async()=>{testCalls.push('PUBLIC_ROLLOVER');return {markedNow:0}};
    refreshBetmanSource=async()=>{testCalls.push('OFFICIAL_ROLLOVER');return true};
    r381RefreshCloudflareZentoto=async()=>{testCalls.push('RESULTS_ZEN');return {settled:0}};
    r384RefreshSpogodResults=async()=>({settled:0});
    r424RefreshNpbFinals=async()=>({settled:0});
    r385RefreshMlsFinals=async()=>({settled:0});
    r383RefreshWisetotoResults=async()=>({settled:0});
    refreshBetmanResults=async()=>({settled:0});
    r485RefreshLiveQuotes=async()=>({});
    r483RefreshTeamForms=async()=>({});
    r450LiveOddsRetryAllowed=()=>false;`,context);
  await f('runTickInternal')({});
  assert.deepEqual(context.testCalls.slice(0,3),
    ['PUBLIC_ROLLOVER','OFFICIAL_ROLLOVER','RESULTS_ZEN'],
    'new round must be detected ahead of slow result source cascade');
  assert.equal(JSON.stringify(context.testState.markets[0]),JSON.stringify(previous));
  assert.equal(JSON.stringify(context.testState.settlementLedger),JSON.stringify(state.settlementLedger));
  assert.equal(f('CFG.minRepOdds'),1.31);
  assert.equal(f('CFG.gradeBestRate'),.15);
  assert.equal(f('CFG.gradeRecommendRate'),.25);
  console.log('PASS R487: verified 122 official discovery without guessed prices; 121 ledger untouched; priority source probe before slow settlement; subsequent rounds preserved');
})().catch(e=>{console.error(e);process.exitCode=1});
