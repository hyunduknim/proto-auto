"use strict";
const fs=require("node:fs"),assert=require("node:assert/strict");
const worker=fs.readFileSync("자동마킹.js","utf8");
const compiled=worker.replace("export class ProtoStateDO","class ProtoStateDO").replace(/export default \{[\s\S]*$/,"");
const html=new Function("URL","structuredClone",compiled+"\nreturn INDEX;")(undefined,structuredClone);
const js=html.split("<script>")[1].split("</script>")[0];new Function(js);
const extract=js.slice(js.indexOf("function r465OddsWinRateData(r){"),js.indexOf("async function expLoadHistory(panel,change){"));
const esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const {expEasyFlow,r465OddsWinRateData}=new Function("expDQuality","expKst","e","handicapChoiceText",extract+"\nreturn {expEasyFlow,r465OddsWinRateData};")(()=>({valid:true,fresh:true}),x=>x||"",esc,(_,x)=>x);
const two={marked:true,finalPick:"오버",marketFamily:"TOTAL",choices:[{label:"언더",odds:1.8},{label:"오버",odds:2.1}]};
const three={marked:true,finalPick:"무",marketFamily:"MONEYLINE",choices:[{label:"승",odds:1.5},{label:"무",odds:4},{label:"패",odds:5}]};
for(const r of [two,three]){const d=r465OddsWinRateData(r);assert.ok(d.valid);assert.equal(d.selected.label,r.finalPick);assert.ok(Math.abs(d.rows.reduce((a,x)=>a+x.rate,0)-1)<1e-10);assert.match(expEasyFlow({},r),/현재마킹 배당승률/);}
assert.match(expEasyFlow({},two),/46\.2%/);
assert.match(expEasyFlow({},three),/22\.4%/);
const u=expEasyFlow({},({...two,marked:false,finalPick:null}));
assert.doesNotMatch(u,/저장된 자동마킹 없음|현재마킹 배당승률|odwHasPick/);
assert.doesNotMatch(js,/r466TrendChart|r466TrendData|시간별 배당변동 확인/);
assert.match(html,/\.odwPickRate \.odwPickRateValue\{color:#ff4d61!important/);
console.log("R468 PASS: two/three outcomes, current pick, red highlight, unmarked, trend removal, worker + client syntax");
