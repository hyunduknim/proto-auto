const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
run(`T=Date.parse('2026-10-16T00:00:00Z');Date.now=()=>T;N=0;MODE="ok";
fetch=async(u,o)=>{N++;if(MODE==="timeout"){await new Promise((_,rej)=>{o.signal.addEventListener('abort',()=>rej(new Error('aborted')));});}
return {ok:true,status:200,text:async()=>JSON.stringify({n:N})};};`);
(async()=>{
 const a=await run('postBetman(BETMAN.gameApi,{gmTs:"260123"},"r",50)');assert.equal(a.n,1);
 const b=await run('postBetman(BETMAN.gameApi,{gmTs:"260123"},"r",50)');assert.equal(b.n,1,'same request within 5 min reuses the answer');assert.equal(run('N'),1);
 const r=await run('postBetman(BETMAN.resultApi,{gmTs:"260122"},"r",50)');assert.equal(run('N'),2,'different endpoint is its own request');
 run('T+=5*60000+1');await run('postBetman(BETMAN.gameApi,{gmTs:"260123"},"r",50)');assert.equal(run('N'),3,'after 5 min a fresh request goes out');
 run('T+=5*60000+1;MODE="timeout"');
 await assert.rejects(run('postBetman(BETMAN.gameApi,{gmTs:"260124"},"r",30)'),/BETMAN_TIMEOUT/);
 assert.ok(run('MEM.r550Gate.until')>run('T'),'timeout pauses Betman');
 const n0=run('N');await assert.rejects(run('postBetman(BETMAN.gameApi,{gmTs:"260125"},"r",30)'),/BETMAN_PAUSED/);assert.equal(run('N'),n0,'no request while paused');
 const cached=await run('postBetman(BETMAN.gameApi,{gmTs:"260123"},"r",30)');assert.equal(cached.n,3,'paused: recent good answer reused');
 run('T+=10*60000+1;MODE="ok"');const ok=await run('postBetman(BETMAN.gameApi,{gmTs:"260125"},"r",50)');assert.ok(ok.n>0);assert.equal(run('MEM.r550Gate.pause'),0,'success resets the pause');
 console.log('R550 gentle Betman OK');
})().catch(e=>{console.error(e);process.exit(1)});
