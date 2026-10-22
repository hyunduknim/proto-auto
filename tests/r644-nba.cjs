const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const T=Date.parse('2026-10-23T23:00:00Z');
const sb={events:[{id:'77',date:'2026-10-23T23:00Z',competitions:[{competitors:[{homeAway:'home',team:{id:'2',displayName:'Boston Celtics'}},{homeAway:'away',team:{id:'18',displayName:'New York Knicks'}}]}]}]};
const L=(tid,arr)=>({team:{id:tid},leaders:arr.map(([cat,id,n])=>({name:cat,leaders:[{athlete:{id,displayName:n}}]}))});
const sum={header:{competitions:[{competitors:[{homeAway:'home',team:{id:'2'}},{homeAway:'away',team:{id:'18'}}]}]},
leaders:[L('2',[['pointsPerGame','10','Jayson Tatum'],['assistsPerGame','11','Derrick White']]),L('18',[['pointsPerGame','20','Jalen Brunson']])],
injuries:[{team:{id:'2'},injuries:[{status:'Out',athlete:{id:'10',displayName:'Jayson Tatum'}},{status:'Out',athlete:{id:'99',displayName:'Bench Guy'}}]},{team:{id:'18'},injuries:[{status:'Day-To-Day',athlete:{id:'20',displayName:'Jalen Brunson'}}]}]};
const fetchMock=async u=>{const s=String(u);return new Response(JSON.stringify(s.includes('scoreboard')?sb:s.includes('summary')?sum:{}),{status:200});};
const c=vm.createContext({Date,URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto,fetch:fetchMock});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
const b={gmTs:'260125',sport:'농구',league:'NBA',date:'2026-10-24',time:'08:00',home:'보스턴 셀틱스',away:'뉴욕 닉스'};
c.ST={gmTs:'260125',markets:[{...b,no:1,marketFamily:'MONEYLINE',finalPick:'승',finalOdds:1.4,displayGrade:'추천',marked:true,representativeSelected:true,r554:{ps:.7,selected:true},r577Rec:{pick:'승'}}]};
(async()=>{
const a=await run('r644RefreshNba(ST,null,{nowMs:'+(T-2*3600000)+',force:true})');assert.equal(a.found,1,JSON.stringify(a));
const f=run('Object.values(ST.r644)[0]');assert.equal(JSON.stringify(f.home.keyOut),'["Jayson Tatum"]');assert.equal(JSON.stringify(f.away.keyQ),'["Jalen Brunson"]');
run('Date.now=()=>'+(T-3600000));run('r644Apply(ST)');const m=run('ST.markets[0]');
assert.equal(m.displayGrade,'일반');assert.match(m.r554.why,/핵심 선수 결장 · 보스턴 셀틱스 Jayson Tatum/);
const html=vm.runInContext('INDEX',c);assert.ok(html.includes('function r644Html'));
console.log('R644 NBA OK');})().catch(e=>{console.error(e);process.exit(1);});
