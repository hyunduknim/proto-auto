const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
const b={gmTs:'260126',sport:'축구',league:'K리그1',date:'2099-01-01',time:'19:00',home:'A',away:'B'};
c.ST={gmTs:'260126',markets:[{...b,no:1,marketFamily:'MONEYLINE',choices:[{label:'승',odds:1.55},{label:'무',odds:3.9},{label:'패',odds:5.2}]},
{...b,no:2,marketFamily:'TOTAL',line:2.5,choices:[{label:'오버',odds:1.95},{label:'언더',odds:1.75}]},
{...b,no:3,marketFamily:'HANDICAP',line:-1,choices:[{label:'승',odds:2.9},{label:'무',odds:3.5},{label:'패',odds:2.0}],marked:true,representativeSelected:true,finalPick:'승',finalOdds:2.9,displayGrade:'추천',r554:{ps:.62,selected:true},r577Rec:{pick:'승'}}]};
run('r648Apply(ST)');const m=n=>run('ST.markets.find(x=>x.no==='+n+')');
const f=m(3).r648;assert.ok(f&&f.승>0&&f.승<.45,'home by 2+ is well under 45%: '+JSON.stringify(f));assert.ok(Math.abs(f.승+f.무+f.패-1)<.01);
assert.ok(m(3).displayGrade!=='추천'||!m(3).marked,'handicap 추천 far above the model is not kept');assert.equal(m(1).marked,true,'moved to the same game 일반승');
const html=vm.runInContext('INDEX',c);assert.ok(html.includes('function r648Chip'));
const fn=new Function('const e=x=>String(x);'+html.slice(html.indexOf('function r648Chip('),html.indexOf('function r644Html('))+';return r648Chip')();
assert.match(fn({marketFamily:'HANDICAP',pick:'승',line:-1,r648:{승:.3},r554:{ps:.6}}),/홈 2골차 이상 승/);
assert.match(fn({marketFamily:'HANDICAP',pick:'승',line:1,r648:{승:.7},r554:{ps:.7}}),/홈 무승부 이상/);
assert.match(fn({marketFamily:'HANDICAP',pick:'패',line:-2,r648:{패:.7},r554:{ps:.7}}),/원정 1골차 패배까지/);
console.log('R648 model OK',JSON.stringify(f),m(3).displayGrade,JSON.stringify(m(3).r554.why||null));
