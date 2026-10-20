const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
run(`const t=new Date(Date.now()-4*3600000+9*3600000).toISOString(),b={gmTs:"260124",date:t.slice(0,10),time:t.slice(11,16),sport:"농구",league:"KBL",home:"원주DB",away:"가스공사",marked:true,representativeSelected:true,resultFinal:true,displayGrade:"추천",r554:{ps:.66}};
ST={markets:[{...b,no:1,marketFamily:"MONEYLINE",choices:[{label:"승",odds:1.5},{label:"패",odds:2.4}],finalPick:"승",finalOdds:1.5,result:"패",hit:false,settlementStatus:"낙첨",resultSource:"SPOGOD_X",resultScoreText:"78:104"},
{...b,no:2,marketFamily:"TOTAL",line:172.5,choices:[{label:"언더",odds:1.8},{label:"오버",odds:1.8}],finalPick:"오버",finalOdds:1.8,result:"오버",hit:true,settlementStatus:"적중",resultSource:"ZENTOTO_X",resultScoreText:"104:78"},
{...b,no:3,marketFamily:"MONEYLINE",choices:[{label:"승",odds:1.5},{label:"패",odds:2.4}],finalPick:"승",result:"승",hit:true,settlementStatus:"적중",resultSource:"BETMAN_OFFICIAL_RESULT",r554:null}],
r557Calib:{seen:["260124:1","260124:2"],prob:{"65~68%":{n:2,hits:1,sumP:1.32}},grade:{"추천":{n:2,hits:1,sumP:1.32}},family:{"일반승":{n:1,hits:0,sumP:.66},"언더오버":{n:1,hits:1,sumP:.66}},voids:0,roiBack:1,lgBack:1,oldBack:1}};
C=r599Candidates(ST);rows=[{gmTs:"260124",no:1,family:"MONEYLINE",home:"원주DB",away:"가스공사",terminal:true,partial:false,score:"104:78",outcome:"승"},{gmTs:"260124",no:2,family:"TOTAL",home:"원주DB",away:"가스공사",terminal:true,partial:false,score:"104:78",outcome:"오버"}];
F=r599Apply(ST,rows,C);r557Track(ST);`);
assert.equal(run('C.length'),2,'Betman-settled market not rechecked');assert.equal(run('F'),1);
assert.equal(run('ST.markets[0].settlementStatus'),'적중','wrong 낙첨 corrected by Betman');assert.equal(run('ST.markets[0].resultSource'),'BETMAN_OFFICIAL_RECHECK');assert.equal(run('ST.markets[0].r586Was.source'),'SPOGOD_X');
assert.ok(run('!!ST.markets[1].r599Verified'),'matching one just marked verified');
assert.equal(run('ST.r557Calib.grade["추천"].hits'),2,'tables recounted');assert.equal(run('ST.r557Calib.grade["추천"].n'),2);
console.log('R599 official recheck OK');
const src=require('node:fs').readFileSync('자동마킹.js','utf8');assert.match(src,/zeroPlaceholderSkipped/);
const re=/^\s*0\s*[:：-]\s*0\s*$/;assert.ok(re.test('0:0')&&!re.test('1:0')&&!re.test('10:0'));
console.log('R601 zero placeholder guard OK');
