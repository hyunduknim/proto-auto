const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
assert.equal(run('JSON.stringify(r680Parse("22승 245패 250승 118오버 7u"))'),JSON.stringify([{no:22,pick:'승'},{no:245,pick:'패'},{no:250,pick:'승'},{no:118,pick:'오버'},{no:7,pick:'언더'}]));
const g=(no,h,a,extra)=>({gmTs:'260126',no,date:'2099-01-01',time:'16:30',sport:'농구',league:'KBL',home:h,away:a,...extra});
c.ST={gmTs:'260126',markets:[g(245,'현대모비스','삼성',{marketFamily:'MONEYLINE',choices:[{label:'승',odds:2.52},{label:'패',odds:1.33}]}),g(250,'소노','KCC',{marketFamily:'MONEYLINE',choices:[{label:'승',odds:1.32},{label:'패',odds:2.55}]}),
 {...g(22,'요코하마','소프트뱅크'),sport:'야구',league:'NPB',time:'18:30',marketFamily:'HANDICAP',line:2.5,choices:[{label:'승',odds:1.33},{label:'패',odds:2.52}]}]};
run('MEM.state=ST;adminAuthorized=()=>true');
const call=async(path,body)=>{const req=new Request('http://x'+path,{method:body?'POST':'GET',headers:{'content-type':'application/json'},body:body?JSON.stringify(body):undefined});c.REQ=req;c.U=new URL(req.url);const r=await run('r680Handle(REQ,{},U)');return [r.status,await r.json()];};
(async()=>{let [s,j]=await call('/api/mybets/add',{text:'22승 245패 250승',stake:20000});assert.equal(s,200,JSON.stringify(j));assert.equal(j.bet.odds,2.33);assert.equal(j.bet.pot,46600);
[s,j]=await call('/api/mybets/add',{text:'22승 22패',stake:10000});assert.equal(s,400);
[s,j]=await call('/api/mybets/add',{text:'999승',stake:10000});assert.equal(s,400);
run('ST.markets.forEach(m=>{m.date="2000-01-01"});Object.assign(ST.markets[0],{resultFinal:true,result:"패",resultScoreText:"80:88",marked:true,representativeSelected:true});ST.r680Off={"260126:250:승":{outcome:"승",score:"90:80"},"260126:22:승":{outcome:"승",score:"3:4"}}');
[s,j]=await call('/api/mybets');assert.equal(j.bets[0].st,'hit');assert.equal(j.bets[0].ret,46600);assert.equal(j.sum.all.profit,26600);
console.log('R680 my bets OK',JSON.stringify(j.sum.all));
const ix=vm.runInContext('INDEX',c);assert.ok(ix.includes('function r680Render')&&ix.includes('💰 내 베팅'));})().catch(e=>{console.error(e);process.exit(1)});
