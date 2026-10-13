const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const NOW=Date.parse('2026-10-14T09:00:00+09:00');class Clock extends Date{constructor(...a){super(...(a.length?a:[NOW]));}static now(){return NOW;}}
const ctx=vm.createContext({Date:Clock,URL,Response,Request,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const WORKER_DEFAULT = {'),ctx);const f=x=>vm.runInContext(x,ctx);
const body=(round='260122',no=9001,blockRound=round)=>`<title>프로토 ${round}회차</title>${' '.repeat(11000)}<div class="game row col-xs-12"><span class="s-name">KBO</span><p class="proto_uid">${no}</p><p class="game_state state_ready">경기전</p>2026-10-14(수) 18:30<p class="home">테스트홈 (U/O7.5)</p><p class="away">테스트원정</p><p round="${blockRound}">배당율 1.82 - 1.70 배당승률</p><div class="sameodds pull-right" onclick="fs.modal('/proto/game/solist','proto_round=${round}&proto_uid=${no}&change_no=0')"><table><tr><td><span class="fts10">47%</span><span class="fts9">(43)</span></td><td><span class="fts10">53%</span><span class="fts9">(48)</span></td></tr></table></div>`;
const previous={gmTs:'260121',no:9001,date:'2026-10-13',time:'18:30',sport:'야구',league:'KBO',home:'테스트홈',away:'테스트원정',marketFamily:'TOTAL',market:'언더오버',line:7.5,choices:[{label:'언더',odds:1.82},{label:'오버',odds:1.7}],marked:true,representativeSelected:true,finalPick:'언더',finalOdds:1.82,displayGrade:'추천',resultFinal:true,hit:true};
const state={round:121,gmTs:'260121',markets:[structuredClone(previous)],settlementLedger:[{gmTs:'260121',no:9001,hit:true}]},frozen=JSON.stringify(state.markets[0]),ledger=JSON.stringify(state.settlementLedger);
const audit=f('r410ZenApplyHtml')(state,body(),NOW);
assert.equal(state.gmTs,'260122','confirmed new page advances active round');assert.equal(state.round,122);
const next=state.markets.find(m=>m.gmTs==='260122');assert.ok(next?.marked&&next.representativeSelected,'new round quote immediately enters Data automatic marking');assert.equal(next.selectionMode,'R480_DATA_RELATIVE');assert.equal(next.sameOddsEvidence.gmTs,'260122');assert.equal(next.sameOddsEvidence.sampleSize,91);
const precision=f('r419OddsReport')(next,NOW);assert.equal(precision.valid,true);assert.equal(precision.choices[0].sampleSamples,91);assert.equal(precision.choices[0].currentOdds,1.82);assert.equal(precision.choices[1].currentOdds,1.7);assert.equal(precision.line,7.5);assert.ok(precision.margin>0);assert.equal(precision.choices[0].modelEV,null);assert.ok(precision.history.length>=1,'precise odds history begins with a real received quote');
assert.equal(JSON.stringify(state.markets.find(m=>m.gmTs==='260121')),frozen);assert.equal(JSON.stringify(state.settlementLedger),ledger);assert.equal(audit.roundVerified,true);
const snap=JSON.stringify(state.markets);f('r410ZenApplyHtml')(state,body('260121'),NOW);assert.equal(state.gmTs,'260122');assert.equal(JSON.stringify(state.markets),snap,'stale page cannot roll back or replace round data');
const wrong={round:121,gmTs:'260121',markets:[]};f('r410ZenApplyHtml')(wrong,body('260122',9002,'260121'),NOW);assert.equal(wrong.gmTs,'260121');assert.equal(wrong.markets.length,0,'title/block mismatch cannot advance round');
const empty={round:121,gmTs:'260121',markets:[]};f('r410ZenApplyHtml')(empty,body().replace('경기전','경기종료'),NOW);assert.equal(empty.gmTs,'260121');assert.equal(empty.markets.length,0,'no valid pregame quote cannot advance round');
f('r410ZenApplyHtml')(state,body('260123',9011),NOW);assert.equal(state.gmTs,'260123');assert.equal(state.round,123,'continuity is not limited to a one-time 122 patch');
const src=fs.readFileSync('자동마킹.js','utf8');assert.ok(!src.includes("const pageIs121=/260121"));assert.ok(!src.includes("!settlementFirst&&Number(cur.gmTs)===260121"),'ongoing polling must run on future rounds');
console.log('PASS R481 122/123 automatic transition, immediate Data marking, correct sample round, reused protocol numbers, no rollback/title mismatch/final seeding, historical selections and ledger preserved');
// Real atomic-commit implementation against a transactional in-memory storage
// boundary. Verify the immutable backup itself, not a mocked commit call.
(async()=>{
 ctx.fetch=async()=>new Response(body(),{headers:{'content-type':'text/html'}});
 vm.runInContext('saveState=async s=>{MEM.state=s;return s}',ctx);
 const fresh=()=>Object.assign(f('createState')(),{round:121,gmTs:'260121',r398Protocol:{enforce:true},markets:[structuredClone(previous)],settlementLedger:[{gmTs:'260121',no:9001,hit:true}]});
 const blocked=fresh();ctx.testState=blocked;vm.runInContext('MEM.state=testState;MEM.doStorage=null',ctx);
 await f('r410RefreshZenPregame')(blocked,{});assert.equal(blocked.gmTs,'260121');assert.equal(blocked.r410PregameAudit.reason,'ROUND_TRANSITION_BACKUP_REQUIRED');
 let db=new Map();const ds={get:async k=>db.get(k),put:async rows=>{for(const [k,v] of Object.entries(rows))db.set(k,structuredClone(v));},transaction:async fn=>{const next=new Map(db);const tx={get:async k=>next.get(k),put:async rows=>{for(const [k,v] of Object.entries(rows))next.set(k,structuredClone(v));}};await fn(tx);db=next;}};
 const current=fresh();ctx.testState=current;ctx.testStorage=ds;vm.runInContext('MEM.state=testState;MEM.doStorage=testStorage',ctx);
 await f('r410RefreshZenPregame')(current,{});const committed=f('MEM.state');assert.equal(committed.gmTs,'260122');
 const meta=[...db.values()].find(x=>x?.reason==='BEFORE_R481_VERIFIED_ROUND_TRANSITION');assert.ok(meta,'immutable backup must exist before switching active round');
 const backup=await f('r398GetBackup')(ds,meta.id);assert.equal(backup.state.gmTs,'260121');assert.equal(JSON.stringify(backup.state.markets[0]),frozen);assert.equal(JSON.stringify(backup.state.settlementLedger),ledger);
 assert.ok([...db.values()].some(x=>x?.type==='R481_VERIFIED_NEW_ROUND'&&x.from==='260121'&&x.to==='260122'));
 const held={...structuredClone(previous),gmTs:'260122',no:9010,date:'2026-10-14',marked:false,representativeSelected:false,finalPick:null,finalOdds:null,resultFinal:false,hit:null};
 committed.markets.push(held);const originalRecords=JSON.stringify(committed.markets),originalLedger=JSON.stringify(committed.settlementLedger);
 const info={compSchedules:{datas:[{matchSeq:9100,gameDate:Date.parse('2026-10-15T18:30:00+09:00'),betNm:'언더오버',betTypNm:'언더오버',itemCode:'BS',leagueShortName:'KBO',homeName:'다음홈',awayName:'다음원정',winHandi:7.5,winTxt:'언더',loseTxt:'오버',winAllot:1.82,loseAllot:1.7}]}};
 ctx.testRound={active:true,gmTs:'260123',round:123,listed:['260123']};ctx.testInfo=info;
 // Mock only network discovery/gameinfo; execute real parse, rollover, marking,
 // state validation, backup and atomic commit paths.
 vm.runInContext('fetchActiveRound=async()=>testRound;fetchGameInfo=async()=>testInfo;MEM.sourceRunning=false;MEM.lastSourceAttempt=0',ctx);
 const ok=await f('refreshBetmanSource')(committed,{},true);assert.equal(ok,true);const official=f('MEM.state');assert.equal(official.gmTs,'260123');
 assert.equal(JSON.stringify(official.markets.filter(m=>m.gmTs!=='260123')),originalRecords,'official rollover preserves even held/unmarked previous-round markets');
 assert.equal(JSON.stringify(official.settlementLedger),originalLedger);assert.ok(official.markets.find(m=>m.gmTs==='260123')?.marked);assert.equal(official.markets.find(m=>m.gmTs==='260123').selectionMode,'R480_DATA_RELATIVE');
 assert.ok([...db.values()].some(x=>x?.reason==='BEFORE_R481_OFFICIAL_ROUND_TRANSITION'));
 const officialBlocked=fresh();officialBlocked.markets.push(structuredClone(held));const frozenBlocked=JSON.stringify(officialBlocked.markets),blockedLedger=JSON.stringify(officialBlocked.settlementLedger);
 ctx.testState=officialBlocked;vm.runInContext('MEM.state=testState;MEM.doStorage=null;MEM.sourceRunning=false',ctx);
 assert.equal(await f('refreshBetmanSource')(officialBlocked,{},true),false);
 const refused=f('MEM.state');assert.equal(refused.gmTs,'260121');assert.equal(JSON.stringify(refused.markets),frozenBlocked,'refused official transition cannot rewrite historical odds/status fields');assert.equal(JSON.stringify(refused.settlementLedger),blockedLedger);
 console.log('PASS R481 runtime missing-storage hold and genuine atomic transition with verified immutable original-round backup');
})().catch(e=>{console.error(e);process.exitCode=1});
