const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx=vm.createContext({URL,Request,Response,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const WORKER_DEFAULT = {'),ctx);
const run=s=>vm.runInContext(s,ctx),now=Date.now();ctx.N=now;ctx.ALARM=now-86400000;ctx.WRITES=0;
ctx.STORAGE={getAlarm:async()=>ctx.ALARM,setAlarm:async t=>{ctx.ALARM=t;ctx.WRITES++}};
run('Date.now=()=>N;globalThis.OWNER={env:{},state:{storage:STORAGE},alarmIntervalMs:()=>25000};');
(async()=>{
const scheduled=await run('ProtoStateDO.prototype.scheduleAlarm.call(OWNER,false)');
assert.equal(scheduled,now+25000,'expired alarm must rearm, never retain yesterday scheduling timestamp');
assert.equal(ctx.WRITES,1);
ctx.ALARM=now+10000;
assert.equal(await run('ProtoStateDO.prototype.scheduleAlarm.call(OWNER,false)'),now+10000,'keep earlier valid alarm');assert.equal(ctx.WRITES,1);
ctx.ALARM=now+60000;
assert.equal(await run('ProtoStateDO.prototype.scheduleAlarm.call(OWNER,false)'),now+25000);assert.equal(ctx.WRITES,2);
ctx.ALARM=now;await run('ProtoStateDO.prototype.scheduleAlarm.call(OWNER,false)');assert.equal(ctx.WRITES,3);
run('OWNER.env.DO_ALARM="off"');assert.equal(await run('ProtoStateDO.prototype.scheduleAlarm.call(OWNER,false)'),null);assert.equal(ctx.WRITES,3,'respect explicit disabled configuration');
console.log('PASS R510: expired/current-time alarms rearm; earlier pending alarm and explicit disabled mode preserved');
})().catch(e=>{console.error(e);process.exitCode=1});
