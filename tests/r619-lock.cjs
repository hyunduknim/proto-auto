const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
run(`const t=new Date(Date.now()+40*60000+9*3600000).toISOString(),b={gmTs:"260125",sourceRound:125,date:t.slice(0,10),time:t.slice(11,16),sport:"농구",league:"NBA",home:"WAS",away:"MIL"};
ST=createState();ST.round=125;ST.gmTs="260125";ST.markets=[{...b,no:1,marketFamily:"MONEYLINE",choices:[{label:"승",odds:1.4},{label:"패",odds:2.9}],marked:true,representativeSelected:true,finalPick:"승",finalOdds:1.4,displayGrade:"추천",r554:{ps:.65,selected:true}},
{...b,no:2,marketFamily:"HANDICAP",line:-3.5,choices:[{label:"승",odds:1.8},{label:"패",odds:1.9}]}];r619Lock(ST);
ST.markets[0].marked=false;ST.markets[0].representativeSelected=false;ST.markets[0].displayGrade="일반";ST.markets[0].r554={ps:.62,selected:false,why:"확률 부족"};ST.markets[1].marked=true;ST.markets[1].representativeSelected=true;ST.markets[1].finalPick="승";r619Lock(ST);`);
assert.ok(run('!!ST.markets[0].r619Lock'),'locked inside the hour');
assert.equal(run('ST.markets[0].marked&&ST.markets[0].displayGrade'),'추천','pick and grade kept after lock');assert.equal(run('ST.markets[1].marked'),false,'switch to another market undone');
run('ST.markets[0].r554={ps:.6,selected:false,why:"해외배당이 반대로 움직임"};r619Lock(ST)');assert.equal(run('ST.markets[0].displayGrade'),'일반','overseas move against still withdraws');
console.log('R619 lock at confirm OK');
