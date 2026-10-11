"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const source=fs.readFileSync(path.join(__dirname,"..","자동마킹.js"),"utf8")
  .replace(/\bexport\s+class\s+ProtoStateDO\b/,"class ProtoStateDO")
  .replace(/\bexport\s+default\s*\{[\s\S]*$/,"");
const reference=Date;
const fakeDateAt=when=>class extends reference{static now(){return reference.parse(when);}};
const makeApi=at=>new Function("Date","URL",source+
  "\nreturn {r374IsApprovedDrawMarket,R374_GPT_CURATED_DRAW_MARKETS};")(fakeDateAt(at),URL);
const api=makeApi("2026-10-11T00:30:00Z");
const fixture=(no,date,time,family,home,away)=>({
  gmTs:"260120",no,date,time,marketFamily:family,home,away,
  sport:"축구",resultFinal:false
});
const a=fixture(7543,"2026-10-11","14:00","HANDICAP","수원 삼성블루윙즈","안산 그리너스");
const b=fixture(7637,"2026-10-11","20:00","MONEYLINE","사우샘프턴","포츠머스");
assert.equal(api.r374IsApprovedDrawMarket(a),true,"Exact Suwon handicap draw must qualify before kickoff");
assert.equal(api.r374IsApprovedDrawMarket(b),true,"Exact Southampton moneyline draw must qualify before kickoff");
const negatives=[
  {...a,no:7542},{...a,marketFamily:"MONEYLINE"},
  {...a,home:"수원 FC"},{...a,away:"전남 드래곤즈"},
  {...a,gmTs:"260121"},{...a,date:"2026-10-12"},
  {...a,time:"15:00"},{...a,resultFinal:true},
  {...b,no:7638},{...b,away:"플리머스"},
  {...b,marketFamily:"HANDICAP"}
];
for(const x of negatives)
  assert.equal(api.r374IsApprovedDrawMarket(x),false,
    "Unapproved fixture, market, result, or round slipped through: "+JSON.stringify(x));
const startedApi=makeApi("2026-10-11T11:01:00Z");
assert.equal(startedApi.r374IsApprovedDrawMarket(a),false,"Started Suwon fixture cannot be rewritten");
assert.equal(startedApi.r374IsApprovedDrawMarket(b),false,"Started Southampton fixture cannot be rewritten");
assert.deepEqual(api.R374_GPT_CURATED_DRAW_MARKETS.map(x=>x.no).sort(),[7543,7637]);
console.log("R374_CURATED_DRAW_ONLY_PASS="+JSON.stringify({
  approved:[7543,7637],rejected:negatives.length,startedLocked:2,
  schedule:"2026-10-11 KST",unchangedNonApproved:true
}));
