const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto,Date});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
const kst=ms=>new Date(ms+9*3600e3).toISOString();const t=Date.now()+30*60e3,d=kst(t);
const base={gmTs:'260132',date:d.slice(0,10),time:d.slice(11,16),sport:'배구',league:'KOVO여',home:'IBK',away:'GS'};
c.S={gmTs:'260132',round:132,markets:[
 {...base,no:1,marketFamily:'MONEYLINE',choices:[{label:'승',odds:2.5},{label:'패',odds:1.44}]},
 {...base,no:2,marketFamily:'HANDICAP',line:1.5,choices:[{label:'승',odds:1.55},{label:'패',odds:2.2}],marked:true,representativeSelected:true,finalPick:'승',finalOdds:1.55,displayGrade:'일반',r771:{p:.6}}]};
run('r806Freeze(S)');assert.equal(run('Object.keys(S.r806).length'),1);
// kick-off: the old rules mark the 일반승 instead
const st=Date.now()-5*60e3,d2=kst(st);run(`for(const m of S.markets){m.date=${JSON.stringify(d2.slice(0,10))};m.time=${JSON.stringify(d2.slice(11,16))};}`);
run("S.markets[0].marked=true;S.markets[0].representativeSelected=true;S.markets[0].finalPick='패';S.markets[0].displayGrade='추천';S.markets[1].marked=false;S.markets[1].representativeSelected=false;S.markets[1].finalPick='승';delete S.markets[1].r771");
// the saved key must still match after the time change → identity uses no/time; re-key test by seed
const fixed=run('r806Freeze(S)');
assert.equal(run('S.markets[0].marked'),false,'old-rule mark removed');assert.equal(run('S.markets[1].marked'),true,'kick-off pick restored');assert.equal(run('S.markets[1].finalPick'),'승');assert.equal(run('S.markets[1].r771.p'),.6);
console.log('r806 ok',fixed);
