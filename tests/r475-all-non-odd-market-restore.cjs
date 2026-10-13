"use strict";
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict");
const source=fs.readFileSync("자동마킹.js","utf8");
const w=vm.createContext({URL,Response,Request,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(source.replace("export class ProtoStateDO","class ProtoStateDO").replace("export default {","const WORKER_DEFAULT = {"),w);
const html=vm.runInContext("INDEX",w),script=html.split("<script>")[1].split("</script>")[0];new vm.Script(script);
const nodes={};const ui=vm.createContext({Date,Number,Math,JSON,Intl,console,document:{getElementById:id=>nodes[id]??={textContent:"",classList:{toggle(){}}}},localStorage:{setItem(){}},setInterval(){}});
vm.runInContext(script.slice(0,script.indexOf("function bindActionButton")),ui);
const fn=n=>vm.runInContext(n,ui);
const row=(no,market,family,choices,line=null,opts={})=>({no,market,marketFamily:family,line,choices,marketId:family+"|"+no,...opts});
const prices=(a,b)=>[{label:"승",odds:a},{label:"패",odds:b}];
const sourceRows=[
 row(7835,"일반승","MONEYLINE",prices(1.38,2.43)),
 row(7836,"승1패","WIN_ONE_LOSE",[{label:"승",odds:1.89},{label:"1점차",odds:3.3},{label:"패",odds:3.15}]),
 row(7837,"핸디캡","HANDICAP",prices(2.53,1.35),-2.5),
 row(7838,"언더오버","TOTAL",[{label:"언더",odds:1.81},{label:"오버",odds:1.71}],6.5,{oddsSnapshotStatus:"LAST_KNOWN",oddsFetchedAt:"2026-10-13T00:57:00Z"}),
 row(7839,"SUM 홀짝","OTHER",prices(1.58,2.09)),
 row(7840,"전반 핸디캡","OTHER",prices(1.92,1.75)),
 row(7841,"홀/짝","SPECIAL",prices(1.8,1.9)),
 row(7842,"스페셜 득점","OTHER",prices(2.2,1.6))
];
const game={gmTs:"260121",no:7837,market:"핸디캡",marketFamily:"HANDICAP",line:-2.5,marketId:"HANDICAP|7837",date:"2026-10-13",time:"09:00",sport:"야구",league:"MLB",game:"탬파베이 레이스 vs 클리블랜드 가디언스",pick:"패",odds:1.35,displayGrade:"가장추천",selectionStatus:"대표픽",gameStarted:true,resultFinal:false,marketRows:sourceRows};
const before=JSON.stringify(game),view=fn("gameCardHtml")(game);
for(const no of [7835,7836,7837,7838,7840,7842])assert.match(view,new RegExp("#"+no+"\\b"),"all stored non-odd markets must be visible: "+no);
assert.doesNotMatch(view,/#7839\b|#7841\b/,"odd/even markets should be absent");
assert.ok(view.indexOf("#7837 ·")<view.indexOf("#7835 ·"),"selected market is first without hiding others");
assert.match(view,/전체 배당 6개/);
assert.doesNotMatch(view,/선택 시장만 표시/);
assert.match(view,/마지막 정상배당|이전 정상배당/,"stale market is labeled individually");
assert.match(view,/1\.38배|1\.38<\//);
assert.match(view,/3\.30배|3\.30<\//);
assert.equal(JSON.stringify(game),before,"display-only recovery must not rewrite saved picks");
assert.match(fn("gameCardHtml")({...game,marketRows:sourceRows.slice(0,3)}),/#7836\b/);
const noMarkets=fn("gameCardHtml")({...game,marketRows:[sourceRows[4],sourceRows[6]]});
assert.doesNotMatch(noMarkets,/홀짝|홀\/짝/);
console.log("PASS R475: all 6 non-odd rows visible, original prices/selected grade preserved, last known dated, no mutation");
