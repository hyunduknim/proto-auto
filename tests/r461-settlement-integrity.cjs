'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const {parseZentoto}=require('../tools/zentoto-settlement.cjs');
const source=fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace(/export default \{[\s\S]*$/,'');
const api=new Function('structuredClone','URL',source+'\nreturn {applyResults,r381ParseZentoto,r365ApplyZentotoResults,r380ApplyZentotoFixtureFinals,r366BackfillZentotoScores};')(structuredClone,URL);
const market=(family='TOTAL',line=2.5,pick='오버')=>({gmTs:'260121',no:9102,date:'2026-10-12',time:'01:00',home:'테스트홈',away:'테스트원정',sport:'축구',marketFamily:family,line,finalPick:pick,finalOdds:1.8,displayGrade:'추천',marked:true,representativeSelected:true,resultFinal:false,choices:family==='TOTAL'?[{label:'언더',odds:1.8},{label:'오버',odds:1.8}]:[{label:'승',odds:1.8},{label:'무',odds:3},{label:'패',odds:2}]});
const state=m=>({gmTs:'260121',round:121,markets:[m],settlementLedger:[],settledCards:{gmTs:'260121',rows:[]}});
const row=(extra={})=>({...market(),no:9101,source:'ZENTOTO_LEGACY_FULLTIME',marketFamily:'MONEYLINE',line:null,score:'1:3',terminal:true,fullTime:true,...extra});
const html=(no,score,tag='',ended=true)=>'<div class="game row col-xs-12"><div class="col-xs-5 date tar">2026-10-12(월) 01:00</div><p class="proto_uid">'+no+'</p><p class="game_state '+(ended?'state_finish':'state_run')+'" round="260121">'+(ended?'경기종료':'후반 90+')+'</p><p class="home">테스트홈'+tag+'</p><p class="vs">'+score+'</p><p class="away">테스트원정</p><p wdl="W">승</p></div>';
let passed=0;const failures=[];
function test(name,fn){try{fn();passed++;console.log('PASS '+name);}catch(e){failures.push(name+': '+e.message);console.error('FAIL '+name+': '+e.message);}}
test('integer adjusted handicap must not settle another market',()=>{
 const s=state(market());assert.equal(api.applyResults(s,[{...row(),family:'HANDICAP',score:'3:0'}]),0);assert.equal(s.markets[0].resultFinal,false);
});
test('same-number different family cannot bypass adjusted-score guard',()=>{
 const s=state(market());assert.equal(api.applyResults(s,[{...row(),no:9102,family:'HANDICAP',score:'3:0'}]),0);
});
test('raw full-time moneyline still settles total',()=>{
 const s=state(market());assert.equal(api.applyResults(s,[{...row(),family:'MONEYLINE'}]),1);assert.equal(s.markets[0].hit,true);
});
for(const [name,parse] of [['worker',api.r381ParseZentoto],['relay',parseZentoto]]){
 test(name+' accepts signed adjusted handicap',()=>{const r=parse(html(9102,'-1 : 0',' <span>(H-1.0)</span>'));assert.equal(r.length,1);assert.equal(r[0].score,'-1:0');});
 test(name+' rejects negative raw score',()=>assert.equal(parse(html(9101,'-1:0')).length,0));
 test(name+' retains conflicting duplicate evidence',()=>{const rows=parse(html(9102,'0',' <span>(U/O2.5)</span>')+html(9102,'4',' <span>(U/O2.5)</span>'));const s=state(market());assert.equal(api.r365ApplyZentotoResults(s,rows,'260121').settled,0);});
 test(name+' never settles live 90+ scores',()=>assert.equal(parse(html(9102,'4',' <span>(U/O2.5)</span>',false)).length,0));
}
test('negative adjusted result settles once and records labeled score',()=>{
 const m=market('HANDICAP',-1,'패'),s=state(m);assert.equal(api.r365ApplyZentotoResults(s,[row({no:9102,marketFamily:'HANDICAP',line:-1,score:'-1:0'})],'260121').settled,1);
 assert.equal(m.hit,true);assert.equal(m.resultScoreText,'핸디적용 -1:0');assert.equal(s.settlementLedger[0].score,m.resultScoreText);assert.equal(s.settledCards.rows[0].score,m.resultScoreText);
 assert.equal(api.r365ApplyZentotoResults(s,[row({no:9102,marketFamily:'HANDICAP',line:-1,score:'-1:0'})],'260121').settled,0);
});
test('contradictory total and raw final stay pending in both paths',()=>{
 const s=state(market()),rows=[row(),row({no:9102,marketFamily:'TOTAL',line:2.5,score:'0'})];
 assert.equal(api.r365ApplyZentotoResults(s,rows,'260121').settled,0);
 assert.equal(api.r380ApplyZentotoFixtureFinals(s,rows,'260121').settled,0);assert.equal(s.markets[0].resultFinal,false);assert.equal(s.settlementLedger.length,0);
});
test('contradictory adjusted and raw final stay pending',()=>{
 const s=state(market('HANDICAP',1,'승')),rows=[row(),row({no:9102,marketFamily:'HANDICAP',line:1,score:'4:0'})];
 assert.equal(api.r365ApplyZentotoResults(s,rows,'260121').settled,0);assert.equal(api.r380ApplyZentotoFixtureFinals(s,rows,'260121').settled,0);
});
test('consistent total/raw final updates ledger and preserves selection',()=>{
 const m=market(),s=state(m),before=[m.finalPick,m.finalOdds,m.displayGrade],rows=[row(),row({no:9102,marketFamily:'TOTAL',line:2.5,score:'4'})];
 assert.equal(api.r365ApplyZentotoResults(s,rows,'260121').settled,1);assert.equal(m.hit,true);assert.equal(m.resultScoreText,'1:3');assert.equal(s.settlementLedger[0].score,'1:3');assert.equal(s.settledCards.rows[0].score,'1:3');assert.deepEqual([m.finalPick,m.finalOdds,m.displayGrade],before);
});
test('contradictory duplicate raw scores cannot drive exact total',()=>{
 const s=state(market()),rows=[row(),row({score:'0:0'}),row({no:9102,marketFamily:'TOTAL',line:2.5,score:'4'})];assert.equal(api.r365ApplyZentotoResults(s,rows,'260121').settled,0);
});
test('volleyball set scores are not compared to match point totals',()=>{
 const m={...market('TOTAL',179.5,'오버'),sport:'배구'},s=state(m),rows=[row({score:'3:1'}),row({no:9102,marketFamily:'TOTAL',line:179.5,score:'184'})];
 assert.equal(api.r365ApplyZentotoResults(s,rows,'260121').settled,1);assert.equal(m.hit,true);assert.equal(m.resultScoreText,'합계 184점');
});
test('score backfill rejects conflicting duplicate source rows',()=>{
 const m={...market(),resultFinal:true,result:'오버',hit:true,settlementStatus:'적중',resultScoreText:'-'},s=state(m);
 assert.equal(api.r366BackfillZentotoScores(s,[row({no:9102,marketFamily:'TOTAL',line:2.5,score:'0'}),row({no:9102,marketFamily:'TOTAL',line:2.5,score:'4'})],'260121'),0);assert.equal(m.resultScoreText,'-');
});
test('malformed zero line cannot match missing source line',()=>{
 const s=state(market('HANDICAP',0,'승'));assert.equal(api.r365ApplyZentotoResults(s,[row({no:9102,marketFamily:'HANDICAP',line:null,score:'2:1'})],'260121').settled,0);
});
if(failures.length){console.error(JSON.stringify({passed,failed:failures.length,failures},null,2));process.exitCode=1;}else console.log('All '+passed+' settlement integrity checks passed');
