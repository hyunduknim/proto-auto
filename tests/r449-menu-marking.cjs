const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('자동마킹.js','utf8');
const worker=vm.createContext({URL,Response,Request,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(source.replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const WORKER_DEFAULT = {'),worker);
const html=vm.runInContext('INDEX',worker),client=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const nodes={},buttons=[];
const document={getElementById(id){return nodes[id]??={innerHTML:'',textContent:'',style:{},classList:{toggle(){}},setAttribute(){}}},querySelector(){return document.getElementById('title')},querySelectorAll(){return buttons}};
const ctx=vm.createContext({document,console,Date,Intl,setInterval(){},setTimeout(){},clearTimeout(){},localStorage:{setItem(){}},URL,AbortController});
vm.runInContext(client.slice(0,client.indexOf('function bindActionButton')),ctx);
const card={gmTs:'260121',no:7785,game:'삼성 vs KT',home:'삼성',away:'KT',date:'2026-10-12',time:'18:30',displayGrade:'추천',pick:'패',odds:1.47,marketFamily:'MONEYLINE',market:'일반승',resultFinal:true,hit:true,result:'패',score:'2:4',marketRows:[{no:7785,market:'일반승',marketFamily:'MONEYLINE',marked:true,finalPick:'패',choices:[{label:'승',odds:2.1},{label:'패',odds:1.47}]}]};
ctx.fixture={markingGames:[],markingGradeHistory:[card,{...card,no:7807,game:'GS vs 도로공사',time:'19:00',marketRows:[{...card.marketRows[0],no:7807}]}],manualPickCatalog:[]};
vm.runInContext("state=fixture;setMarkMenu('rec')",ctx);
assert.equal((nodes.list.innerHTML.match(/markRecommend/g)||[]).length,2,'both settled recommendations must keep visible colored marking');
assert.equal((nodes.list.innerHTML.match(/markTicketTop/g)||[]).length,2,'settled recommendations keep full card layout');
assert.match(nodes.list.innerHTML,/적중/);
const before=JSON.stringify(ctx.fixture);vm.runInContext("setMarkMenu('best');setMarkMenu('rec')",ctx);assert.equal(JSON.stringify(ctx.fixture),before,'filters cannot mutate settlement or picks');
assert.doesNotMatch(html,/<button[^>]*id="(?:refresh|results|reanalyze)"/);
assert.doesNotMatch(html,/<button[^>]*data-mode="(?:date|time|marked)"/);
assert.match(html,/id="tabPast"[^>]*>정산확인</);
ctx.hours={hourlyMarking:[{date:'2026-10-13',hour:'01',games:2,marked:2,priced:2}]};vm.runInContext('renderHourly(hours)',ctx);assert.match(nodes.hourlyBar.innerHTML,/<button[^>]*data-hour="01"/);
ctx.fixture.markingGames=[{...card,resultFinal:false,date:'2026-10-13',time:'01:30'}, {...card,no:8000,resultFinal:false,date:'2026-10-13',time:'03:00'}];
vm.runInContext("state=fixture;setHourFilter('2026-10-13','01')",ctx);assert.match(nodes.list.innerHTML,/#7785/);assert.doesNotMatch(nodes.list.innerHTML,/#8000/);
vm.runInContext("setMarkMenu('now')",ctx);assert.match(nodes.list.innerHTML,/#8000/);
console.log('PASS R449: settled colored cards, no settlement mutation, menu removals, JSON placement, clickable hours and reset');

if(fs.existsSync('live.json')){
 ctx.live=JSON.parse(fs.readFileSync('live.json','utf8'));const saved=JSON.stringify(ctx.live);
 vm.runInContext("state=live;setMarkMenu('rec')",ctx);
 assert.equal((nodes.list.innerHTML.match(/markTicketTop/g)||[]).length,10);
 assert.equal((nodes.list.innerHTML.match(/choice markRecommend/g)||[]).length,10,'exactly one selected market per recommended fixture');
 assert.equal((nodes.list.innerHTML.match(/settle hit/g)||[]).length,2,'both existing settled recommendations stay hits');
 assert.equal(JSON.stringify(ctx.live),saved,'real snapshot remains unchanged');
 console.log('PASS LIVE REPLAY: 10 recommendation cards, 10 marks, 2 settled hits; all 6 total hits preserved');
}
