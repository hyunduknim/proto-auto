const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
const g={gmTs:'260126',sport:'축구',league:'EPL',date:'2000-01-01',time:'01:30',home:'첼시',away:'토트넘 홋스퍼'};
c.ST={gmTs:'260126',markets:[
 {...g,no:390,marketFamily:'MONEYLINE',choices:[{label:'승',odds:1.54},{label:'무',odds:3.95},{label:'패',odds:4.05}],marked:true,representativeSelected:true,resultFinal:true,resultScoreText:'2:1'},
 {...g,no:392,marketFamily:'HANDICAP',line:-2,choices:[{label:'승',odds:4.5},{label:'무',odds:4.5},{label:'패',odds:1.42}]},
 {...g,no:393,marketFamily:'TOTAL',line:3.5,choices:[{label:'언더',odds:1.53},{label:'오버',odds:2.02}]},
 {...g,date:'2099-01-01',home:'라치오',away:'파르마',no:413,marketFamily:'MONEYLINE',choices:[{label:'승',odds:1.31},{label:'무',odds:3.9},{label:'패',odds:7.7}]}]};
c.J={posts:[{id:'2026-10-24',title:'주말 축구','at':'2026-10-23T22:00:00+09:00',intro:'<b>x</b>',groups:[{name:'안정형',picks:[
 {gmTs:'260126',no:392,pick:'패',label:'첼시 핸디 -2 패',odds:1.42,why:'해외 67%'},{gmTs:'260126',no:393,pick:'오버',label:'오버 3.5',odds:2.02},
 {gmTs:'260126',no:413,pick:'승',label:'라치오 승',odds:1.31},{gmTs:'bad',no:1,pick:'승'},{gmTs:'260126',no:5,pick:'XX'}]}],
 combos:[{name:'안정',nos:[392,413],odds:1.86}],cautions:['엘 클라시코'],passes:[]},{id:'',groups:[]}]};
run('ST.r662Posts=r662Clean(J)');assert.equal(run('ST.r662Posts.length'),1,'empty post dropped');assert.equal(run('ST.r662Posts[0].groups[0].picks.length'),3,'bad picks dropped');
run('r662Settle(ST)');assert.equal(run('ST.r662Res["260126:392:패"].st'),'hit','2:1 covers -2 패');assert.equal(run('ST.r662Res["260126:393:오버"].st'),'miss','3 goals = under 3.5');
assert.equal(run('ST.r662Res["260126:413:승"].st'),'pre');
const sm=run('r662Summary(ST)');assert.equal(sm.sum.hit,1);assert.equal(sm.sum.miss,1);assert.equal(sm.posts[0].combos[0].st,'live');assert.equal(sm.posts[0].groups[0].picks[0].home,'첼시');
run('ST.markets[3].date="2000-01-01";ST.markets[3].resultFinal=true;ST.markets[3].resultScoreText="0:0"');run('r662Settle(ST)');
assert.equal(run('ST.r662Res["260126:413:승"].st'),'miss');assert.equal(run('r662Summary(ST)').posts[0].combos[0].st,'miss');
assert.equal(run('ST.r662Res["260126:392:패"].st'),'hit','final results are kept');
const sl=run('ST.markets.forEach(m=>{m.date="2099-01-01"});r662Slate(ST,1e9)');assert.equal(sl.length,2);assert.ok(sl[0].mk.length>=1);
const ix=vm.runInContext('INDEX',c);assert.ok(ix.includes('🤖 클로드추천')&&ix.includes('function r662Html')&&!ix.includes('🎯 조합</button>'));
c.J2={posts:[{id:'2026-10-25-z-nba-injury',kind:'injury',title:'아침 NBA 결장 체크',groups:[],cautions:['보스턴: 테이텀 Out']}]};assert.equal(run('r662Clean(J2).length'),1,'notes-only morning post kept');assert.equal(run('r662Clean(J2)[0].kind'),'injury');
// R670: a 언오버 market's official score is the total ("257:0") and must not settle a 승패 pick
const nb={gmTs:'260126',sport:'농구',league:'NBA',date:'2000-01-02',time:'05:00',home:'밀워키 벅스',away:'시카고 불스'};
c.S2={gmTs:'260126',markets:[{...nb,no:80,marketFamily:'MONEYLINE',choices:[{label:'승',odds:1.73},{label:'패',odds:1.75}]},{...nb,no:82,marketFamily:'TOTAL',line:238.5,choices:[{label:'언더',odds:1.73},{label:'오버',odds:1.75}],marked:true,representativeSelected:true,resultFinal:true,result:'오버',resultScoreText:'257:0'}],
 r662Posts:[{id:'x',groups:[{name:'NBA',picks:[{gmTs:'260126',no:80,pick:'승',odds:1.73},{gmTs:'260126',no:82,pick:'오버',odds:1.75}]}],combos:[],cautions:[],passes:[]}]};
run('r662Settle(S2)');assert.equal(run('S2.r662Res["260126:80:승"].st'),'live','total-only score must not settle 승패');assert.equal(run('S2.r662Res["260126:82:오버"].st'),'hit');
run('S2.r651Ids={[r483FixtureKey(S2.markets[0])]:{home:"15",away:"4"}};S2.r651Games={g:{t:gameTimeMs(S2.markets[0])+600000,h:"15",a:"4",hs:125,as:132}};r662Settle(S2)');assert.equal(run('S2.r662Res["260126:80:승"].st'),'miss','ESPN final 125:132');
run('delete S2.r662Res["260126:80:승"];S2.r662Off={"260126:80:승":{outcome:"패",score:"125:132"}};r662Settle(S2)');assert.equal(run('S2.r662Res["260126:80:승"].st'),'miss');assert.equal(run('S2.r662Res["260126:80:승"].src'),'official');
// R673 reviews
assert.equal(JSON.stringify(JSON.parse(run('JSON.stringify(r662CleanReviews({"260126:80:승":"  기디 출전, 4Q 붕괴 ","bad":"x","260126:1:XX":"y"}))'))),JSON.stringify({"260126:80:승":"기디 출전, 4Q 붕괴"}));
run('S2.r662Reviews={"260126:80:승":"반반 경기를 일반승으로"}');const z2=run('r662Summary(S2)');assert.equal(z2.posts[0].groups[0].picks.find(x=>x.no===80).rv,'반반 경기를 일반승으로');
console.log('R662 claude picks OK',JSON.stringify(sm.sum));
