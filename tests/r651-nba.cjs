const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const D0=Date.parse('2026-10-24T00:00:00Z');
const ev=(id,date,h,a,hs,as,hq,aq)=>({id,date,status:{type:{completed:true}},competitions:[{competitors:[{homeAway:'home',team:{id:h[0],displayName:h[1]},score:String(hs),linescores:hq.map(v=>({value:v}))},{homeAway:'away',team:{id:a[0],displayName:a[1]},score:String(as),linescores:aq.map(v=>({value:v}))}]}]});
const BOS=['2','Boston Celtics'],NYK=['18','New York Knicks'],X=['9','Other'];
const sbs={'20261022':{events:[ev('1','2026-10-22T23:00Z',BOS,X,120,100,[30,30,30,30],[25,25,25,25]),ev('2','2026-10-22T23:00Z',NYK,X,99,101,[20,25,30,24],[25,25,25,26])]},
'20261020':{events:[ev('3','2026-10-20T23:00Z',X,BOS,110,104,[28,27,28,27],[26,26,26,26]),ev('4','2026-10-20T23:00Z',X,NYK,95,108,[24,24,24,23],[27,27,27,27])]},
'20261023':{events:[{id:'9',date:'2026-10-23T23:00Z',status:{type:{completed:false}},competitions:[{competitors:[{homeAway:'home',team:{id:'2',displayName:'Boston Celtics'}},{homeAway:'away',team:{id:'18',displayName:'New York Knicks'}}]}]}]}};
const fetchMock=async u=>{const d=(String(u).match(/dates=(\d+)/)||[])[1];return new Response(JSON.stringify(sbs[d]||{events:[]}),{status:200});};
const c=vm.createContext({Date,URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto,fetch:fetchMock});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
const b={gmTs:'260126',sport:'농구',league:'NBA',date:'2026-10-24',time:'08:00',home:'보스턴 셀틱스',away:'뉴욕 닉스'};
c.ST={gmTs:'260126',markets:[{...b,no:56,marketFamily:'MONEYLINE',choices:[{label:'승',odds:1.45},{label:'패',odds:2.7}]},
{...b,no:57,marketFamily:'HANDICAP',line:-6.5,choices:[{label:'승',odds:1.9},{label:'패',odds:1.8}],marked:true,representativeSelected:true,finalPick:'승',finalOdds:1.9,displayGrade:'추천',r554:{ps:.66,selected:true},r577Rec:{pick:'승'}},
{...b,no:58,marketFamily:'TOTAL',line:220.5,choices:[{label:'오버',odds:1.85},{label:'언더',odds:1.85}]}]};
(async()=>{for(let i=0;i<12;i++)await run('r651RefreshNba(ST,null,{nowMs:'+(D0+3600000)+',force:true})');
assert.ok(run('Object.keys(ST.r651Games).length')>=4,'games collected');assert.ok(run('ST.r651Ids[r483FixtureKey(ST.markets[0])]'),'ids found');
run('r651Apply(ST)');const m=run('ST.markets[1]');const f=m.r651;
assert.ok(f.home&&f.home.n===2&&f.home.q[0].f===28,'BOS quarter avg '+JSON.stringify(f.home&&f.home.q));
assert.equal(JSON.stringify(f.cover),JSON.stringify({k:1,n:2,line:-6.5}),'BOS covered -6.5 once in 2');
assert.ok(f.mp>0.3&&f.mp<0.6,'model ~ '+f.mp);
assert.notEqual(m.displayGrade+'|'+m.marked,'추천|true','handicap 추천 well above the NBA model is moved or dropped');
const html=vm.runInContext('INDEX',c);assert.ok(html.includes('function r651Chip')&&html.includes('function r651TeamHtml'));
console.log('R651 NBA OK',f.mp,JSON.stringify(f.mod));})().catch(e=>{console.error(e);process.exit(1);});
