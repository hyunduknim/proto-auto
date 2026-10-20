const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
run(`const t=new Date(Date.now()+5*3600000+9*3600000).toISOString(),b={gmTs:"260124",sourceRound:124,date:t.slice(0,10),time:t.slice(11,16),sport:"축구",league:"UCL",home:"맨시티",away:"AEK",marketFamily:"MONEYLINE",choices:[{label:"승",odds:1.15},{label:"무",odds:7.9},{label:"패",odds:15}]};
ST=createState();ST.round=124;ST.gmTs="260124";ST.markets=[{...b,no:9483,marked:true,representativeSelected:true,finalPick:"무",finalOdds:7.9,hitProbability:.095},{...b,no:9475,home:"리버풀",away:"비야레알",marked:true,representativeSelected:true,finalPick:"승",finalOdds:1.39,hitProbability:.616}];N=r600NoLongshot(ST);`);
assert.equal(run('N'),1);assert.equal(run('ST.markets[0].marked'),false,'9.5% draw is not a pick');assert.equal(run('ST.markets[1].marked'),true);
console.log('R600 no long-shot pick OK');
