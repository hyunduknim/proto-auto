"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs");
const source=fs.readFileSync("자동마킹.js","utf8").replace("export class ProtoStateDO","class ProtoStateDO").replace(/export default \{[\s\S]*$/,"");
const INDEX=new Function("URL","structuredClone",source+"\nreturn INDEX;")(URL,structuredClone);
const script=INDEX.split("<script>")[1].split("</script>")[0];new Function(script);
const core=new Function("e","expKst",script.slice(script.indexOf("const expHistoryCache"),script.indexOf("function expEasyBars"))+"\nreturn {expHistoryReport,hView,hWilson};")(
s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])),s=>String(s));
assert.match(INDEX,/hhMobile/);assert.match(INDEX,/hhDesktop/);assert.match(INDEX,/data-history-search/);assert.match(INDEX,/data-history-stage/);assert.match(INDEX,/data-history-page/);
const m={gmTs:"260121",no:7800,changeNo:0,latestChange:1,prices:[{label:"언더",odds:1.80},{label:"오버",odds:1.95}],counts:{언더:1,오버:2,미확인:0},rows:[{year:"2024",league:"A",home:"X&Y",away:"<Z>",score:"2:1",result:"오버",prices:[{label:"언더",odds:1.8},{label:"오버",odds:1.95}]},{year:"2025",league:"B",home:"A",away:"B",score:"0:0",result:"언더",prices:[{label:"언더",odds:1.8},{label:"오버",odds:1.95}]},{year:"2023",league:"A",home:"C",away:"D",score:"4:1",result:"오버",prices:[{label:"언더",odds:1.8},{label:"오버",odds:1.95}]}]};
let z=core.expHistoryReport(m,"test");assert.match(z,/X&amp;Y/);assert.match(z,/&lt;Z&gt;/);assert.match(z,/66.7%/);
core.hView("test").result="언더";z=core.expHistoryReport(m,"test");assert.match(z,/검색 1건/);
core.hView("test").result="all";core.hView("test").search="B";z=core.expHistoryReport(m,"test");assert.match(z,/검색 1건/);
const mm={...m,rows:Array.from({length:55},(_,i)=>({...m.rows[0],home:"Team"+i})),counts:{언더:0,오버:55}};z=core.expHistoryReport(mm,"many");assert.match(z,/1 \/ 5페이지/);core.hView("many").page=4;z=core.expHistoryReport(mm,"many");assert.match(z,/5 \/ 5페이지/);assert.match(z,/Team48/);assert.doesNotMatch(z,/Team47/);
assert.deepEqual(core.hWilson(0,0),null);const ci=core.hWilson(50,100);assert.ok(Number(ci[0])>39&&Number(ci[1])<61);
console.log("PASS R463 source-backed odds history, PC/mobile layout, filters, escape, pagination, Wilson");
