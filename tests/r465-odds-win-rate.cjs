"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs");
const s=fs.readFileSync("자동마킹.js","utf8");
const server=s.replace("export class ProtoStateDO","class ProtoStateDO").replace(/export default \{[\s\S]*$/,"");
const index=new Function("URL","structuredClone",server+"\nreturn INDEX;")(URL,structuredClone);
const client=index.split("<script>")[1].split("</script>")[0];new Function(client);
const js=client.slice(client.indexOf("function r465OddsWinRateData(r){"),client.indexOf("async function expLoadHistory(panel,change){"));
const tool=new Function("expDQuality","expKst","e","handicapChoiceText",js+"\nreturn {r465OddsWinRateData,expEasyFlow};")(
 ()=>({valid:true,fresh:true}),x=>String(x),x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])),(r,x)=>String(x));
const cases=[
 {choices:[{label:"언더",odds:1.8},{label:"오버",odds:2.1}],marked:true,finalPick:"오버",marketFamily:"TOTAL"},
 {choices:[{label:"승",odds:1.5},{label:"무",odds:4},{label:"패",odds:5}],marked:true,finalPick:"무",marketFamily:"MONEYLINE"}
];
for(const m of cases){const d=tool.r465OddsWinRateData(m);assert.ok(d.valid);assert.ok(Math.abs(d.rows.reduce((p,c)=>p+c.rate,0)-1)<1e-10);assert.equal(d.selected.label,m.finalPick);const html=tool.expEasyFlow({},m);assert.match(html,/배당승률 차트/);assert.doesNotMatch(html,/손익분기/);assert.match(html,/role="meter"/);}
assert.equal(tool.r465OddsWinRateData({choices:[{label:"승",odds:1.5}]}).valid,false);
assert.equal(tool.r465OddsWinRateData({choices:[{label:"승",odds:1.5},{label:"패",odds:null}]}).valid,false);
assert.match(index,/odwOutcomes/);assert.match(index,/@media\(max-width:720px\)/);
assert.ok(!client.slice(client.indexOf("function expDS(m,r){"),client.indexOf("function expBody(m){")).includes("expHistoryReport"));
console.log("R465 odds-winrate tests PASS: 2/3-way, sum 100%, selected, invalids, UI, syntax, responsive");
