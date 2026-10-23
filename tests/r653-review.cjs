const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
const b={gmTs:'260125',sport:'축구',league:'UEL',date:'2026-10-23',time:'01:45',home:'유벤투스',away:'스타드 렌'};
c.ST={gmTs:'260126',settlementLedger:[],markets:[
{...b,no:9857,marketFamily:'MONEYLINE',choices:[{label:'승',odds:1.33},{label:'무',odds:4.35},{label:'패',odds:6}],marked:true,representativeSelected:true,finalPick:'승',finalOdds:1.33,displayGrade:'추천',resultFinal:true,hit:false,result:'무',settlementStatus:'낙첨',resultScoreText:'2:2',r554:{ps:.67},r645:{p:.24}},
{...b,no:9858,marketFamily:'HANDICAP',line:-1,choices:[{label:'승',odds:1.99},{label:'무',odds:3.3},{label:'패',odds:2.9}]},
{...b,no:9859,marketFamily:'TOTAL',line:2.5,choices:[{label:'언더',odds:2.22},{label:'오버',odds:1.43}]}]};
const r=run('r653Review(ST)');assert.equal(r.n,1);const x=r.list[0];
assert.ok(x.causes.includes('무승부')&&x.causes.includes('유럽대항전'));
assert.equal(JSON.stringify(x.alts.map(a=>a.fam+':'+a.pick)),JSON.stringify(['HANDICAP:패','TOTAL:오버']));
assert.match(x.lesson.join(' '),/무승부/);
const html=vm.runInContext('INDEX',c);assert.ok(html.includes('function r653Render')&&html.includes('id="tabReview"'));
console.log('R653 review OK',JSON.stringify(x.alts),x.lesson);
fs.writeFileSync(process.env.OUT||'/dev/null',JSON.stringify({r653Review:r}));
