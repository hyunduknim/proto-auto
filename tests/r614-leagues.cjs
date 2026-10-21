const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
run(`const r=(g,no,lg,hit,gr,st)=>({gmTs:g,no,league:lg,sport:"배구",pick:"승",hit,displayGrade:gr||"일반",settlementStatus:st||(hit?"적중":"낙첨")});
ST={gmTs:"260125",markets:[{gmTs:"260125",no:5,league:"KOVO컵 남자",sport:"배구",resultFinal:true,marked:true,representativeSelected:true,hit:true,settlementStatus:"적중",displayGrade:"추천"}],
settlementLedger:[r("260121",1,"EPL",true),r("260122",2,"EPL",false),r("260123",3,"EPL",true,"추천"),r("260124",4,"KOVO컵남",true),r("260124",4,"KOVO컵남",true),r("260124",6,"KBL",null,"일반","적특")]};L=r614Leagues(ST);`);
const L=JSON.parse(run('JSON.stringify(L)'));
const kovo=L.list.find(x=>x.league==='KOVO컵남');assert.equal(kovo.n,2,'KOVO컵 남자 and KOVO컵남 merged, ledger deduped');assert.equal(kovo.recHits,1);
const epl=L.list.find(x=>x.league==='잉글랜드프리미어리그');assert.equal(epl.n,2,'round 121 excluded');assert.equal(epl.hitPct,50);
assert.equal(L.list.some(x=>x.league==='KBL'),false,'void-only league not listed');assert.equal(L.total.n,4);
console.log('R614 league settlement OK');
