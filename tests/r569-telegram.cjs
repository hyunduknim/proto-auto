const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const store=new Map(),calls=[];let updates=[];
const fetchMock=async(u,o)=>{const url=String(u),m=url.split('/').pop(),body=JSON.parse(o?.body||'{}');calls.push({m,body});
const ok=r=>new Response(JSON.stringify({ok:true,result:r}),{headers:{'content-type':'application/json'}});
if(url.includes('/botBAD'))return new Response(JSON.stringify({ok:false,error_code:401,description:'Unauthorized'}),{status:401});
if(m==='getMe')return ok({id:1,username:'proto_bot'});if(m==='getWebhookInfo')return ok({url:''});
if(m==='getUpdates')return ok(updates);if(m==='sendMessage')return ok({message_id:1});return ok(true);};
const c=vm.createContext({URL,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto,fetch:fetchMock});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
c.STORE={get:async k=>store.get(k),put:async(k,v)=>{store.set(k,v);}};run('MEM.doStorage=STORE');
const TOK='123456789:'+'A'.repeat(35);
const post=async(fn,b)=>{c.REQ=new Request('https://x/api',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)});return (await run(fn+'(REQ)')).json();};
(async()=>{
let r=await post('r569Register',{token:'nope'});assert.equal(r.ok,false);
r=await post('r569Register',{token:TOK});assert.equal(r.ok,true,r.message);assert.match(r.message,/proto_bot/);
assert.equal(JSON.stringify(r).includes(TOK),false,'token never echoed');
r=await (await run('r569LinkReq()')).json();assert.equal(r.ok,false,'no message yet');
updates=[{update_id:7,message:{date:Math.floor(Date.now()/1000),chat:{id:555,type:'private',first_name:'형님'},text:'안녕'}}];
r=await (await run('r569LinkReq()')).json();assert.equal(r.ok,true,r.message);assert.equal(store.get('r569:tg').chatId,555);
r=await post('r569Register',{token:'987654321:'+'B'.repeat(35)});assert.equal(r.ok,false,'cannot replace linked bot without current token');
// alerts
const now=Date.now(),t=new Date(now+20*60000+9*3600000);const date=t.toISOString().slice(0,10),time=t.toISOString().slice(11,16);
const p=new Date(now-3*3600000+9*3600000),p2=new Date(now-10*60000+9*3600000);
c.MS=[{gmTs:'260124',no:1,marked:true,representativeSelected:true,displayGrade:'가장추천',home:'아스널',away:'첼시',finalPick:'승',marketFamily:'MONEYLINE',finalOdds:1.45,r554:{ps:.74},date,time},
{gmTs:'260124',no:2,marked:true,representativeSelected:true,displayGrade:'일반',home:'A',away:'B',pick:'승',date,time},
{gmTs:'260124',no:3,marked:true,representativeSelected:true,displayGrade:'추천',home:'C',away:'D',pick:'패',marketFamily:'MONEYLINE',finalOdds:1.5,date:p.toISOString().slice(0,10),time:p.toISOString().slice(11,16),resultFinal:true,hit:true,score:'0:2'},
{gmTs:'260124',no:4,marked:true,representativeSelected:true,displayGrade:'일반',home:'E',away:'F',pick:'언더',marketFamily:'TOTAL',line:2.5,finalPick:'언더',date:p2.toISOString().slice(0,10),time:p2.toISOString().slice(11,16),resultFinal:true,hit:false,score:'2:1'}];
run('MEM.state={gmTs:"260124",markets:MS};store=null');
const cfg=store.get('r569:tg');cfg.setAt=now-5*3600000;run('MEM.r569Cfg=null;MEM.r569Cfg=undefined');store.set('r569:tg',cfg);
calls.length=0;r=await run('MEM.r569At=0;r569Tick({})');assert.equal(r.status,'OK',JSON.stringify(r));
const texts=calls.filter(x=>x.m==='sendMessage').map(x=>x.body.text).join('\n---\n');
assert.match(texts,/새 가장추천 1경기/);assert.match(texts,/30분 안에 시작/);assert.match(texts,/⭕ 적중 C vs D/);assert.match(texts,/124회 추천 누적: ⭕ 1적중 · ❌ 0낙첨 \(100%\)/);assert.match(texts,/❌ 낙첨 E vs F \(2:1\).*\(일반\)/);assert.match(texts,/일반 누적: ⭕ 0적중 · ❌ 1낙첨 \(0%\)/);assert.equal(/A vs B/.test(texts),false,'일반 never alerted');
calls.length=0;r=await run('MEM.r569At=0;r569Tick({})');assert.equal(calls.filter(x=>x.m==='sendMessage').length,0,'no duplicates');
console.log('R569 telegram OK');})().catch(e=>{console.error(e);process.exit(1);});
