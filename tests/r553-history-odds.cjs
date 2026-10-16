const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
const blk=(no,lg,home,away,score,odds,state='경기종료')=>`<div class="game row col-xs-12"><span>${lg}</span><p class="proto_uid">${no}</p><p class="game_state state_finish">${state}</p><div class="col-xs-5 date tar">2026-10-10(토) 19:00</div><p class="home">${home}</p><p class="vs">${score}</p><p class="away">${away}</p><div>배당율 ${odds.join(' ')} 배당승률 40 30 30</div></div>`;
const page=r=>`<html><head><title>프로토 승부식 ${r}회차</title></head><body>${'x'.repeat(6000)}`+
 blk(8101,'KBO','LG','두산','5:3',['1.45','-','2.40'])+blk(8102,'KBO','LG<span>(H-1.5)</span>','두산','3.5:3',['1.95','-','1.65'])+
 blk(8103,'KBO','LG<span>(U/O 8.5)</span>','두산','8',['1.80','-','1.80'])+blk(8104,'EPL','첼시','아스널','1:1',['2.6','3.1','2.5'])+
 blk(8105,'KBO','KT','NC','-',['1.5','-','2.3'],'경기전')+'</body></html>';
c.PAGE=page;
const out=run('r553ParseRound(PAGE(260100),260100)');
assert.equal(out.title,'260100');assert.equal(out.rows.length,4,'finished rows only');
assert.equal(out.rows[0].win,'승');assert.equal(out.rows[1].win,'승','handicap-applied 3.5:3');assert.equal(out.rows[2].win,'언더');assert.equal(out.rows[3].win,'무');assert.equal(out.rows[3].sport,'축구');
assert.equal(run('r553ParseRound(PAGE(260121),260100).rows.length'),0,'other round page rejected');
run(`ST0={done:{},buckets:{},pattern:null,games:0,rounds:0,fails:{}};STORE=new Map();MEM.doStorage={get:async k=>STORE.get(k),put:async(k,v)=>STORE.set(k,v)};
fetch=async u=>{const m=String(u).match(/proto_round=(\\d{6})/);return m?{ok:true,text:async()=>PAGE(Number(m[1]))}:{ok:true,text:async()=>PAGE(260123)};};`);
(async()=>{
 const a=await run('r553Step({gmTs:"260123"},Date.parse("2026-10-16T03:00:00Z"))');assert.equal(a.status,'ADDED');assert.equal(a.round,260122);
 assert.equal(run('MEM.r553.pattern'),0,'found the proto_round URL pattern');
 assert.equal((await run('r553Step({gmTs:"260123"},Date.parse("2026-10-16T03:01:00Z"))')).status,'WAIT','one page every 3 min');
 const b=await run('r553Step({gmTs:"260123"},Date.parse("2026-10-16T03:04:00Z"))');assert.equal(b.round,260121);
 assert.equal(run('MEM.r553.buckets["야구|MONEYLINE|승|<1.5"].n'),2);
 console.log('R553 history odds collector OK');
})().catch(e=>{console.error(e);process.exit(1)});
