const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
run(`const b={gmTs:"260125",date:"2026-10-21",time:"19:00",sport:"축구",league:"J2리그",marked:true,representativeSelected:true,resultFinal:true,hit:true,settlementStatus:"적중",resultSource:"X"};
ST={markets:[{...b,no:9612,home:"반포레 고후",away:"요코하마FC",marketFamily:"TOTAL",line:2.5,choices:[{label:"언더",odds:2.1},{label:"오버",odds:1.64}],finalPick:"오버",result:"오버",resultScoreText:"0:0"},
{...b,no:9615,home:"알비렉스 니가타",away:"사간 도스",marketFamily:"HANDICAP",line:1,choices:[{label:"승",odds:1.65},{label:"무",odds:3.5},{label:"패",odds:3.9}],finalPick:"승",result:"승",resultScoreText:"0:0"},
{...b,no:9624,home:"도쿠시마 보르티스",away:"반라우레 하치노헤FC",marketFamily:"TOTAL",line:2.5,choices:[{label:"언더",odds:1.61},{label:"오버",odds:2.1}],finalPick:"언더",result:"언더",resultScoreText:"0:0"},
{...b,no:9607,home:"쇼난 벨마레",away:"이와키FC",marketFamily:"HANDICAP",line:-1,choices:[{label:"승",odds:3.2},{label:"무",odds:3.5},{label:"패",odds:1.7}],finalPick:"패",result:"패",resultScoreText:"3:1"}]};r570OwnerScores(ST);`);
for(const [i,sc] of [[0,'0:3'],[1,'2:1'],[2,'0:1'],[3,'1:1']]){assert.equal(run(`ST.markets[${i}].resultScoreText`),sc);assert.equal(run(`ST.markets[${i}].settlementStatus`),'적중','still a hit '+i);}
console.log('R627 J2 owner scores OK');
