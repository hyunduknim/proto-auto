const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto,FormData,Blob,atob});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
run(`const k=d=>{const t=new Date(Date.now()+d*3600000+9*3600000).toISOString();return {date:t.slice(0,10),time:t.slice(11,16)}};const b={gmTs:"260124",sourceRound:124,marked:true,representativeSelected:true,league:"KOVO컵 남자"};
ST=createState();ST.round=124;ST.gmTs="260124";ST.markets=[
{...b,...k(5),no:9363,home:"대한항공 점보스",away:"삼성화재 블루팡스",marketFamily:"MONEYLINE",finalPick:"승",finalOdds:1.45,displayGrade:"가장추천",r554:{ps:.71}},
{...b,...k(3),no:9336,home:"한국전력 빅스톰",away:"KB손해보험 스타즈",marketFamily:"HANDICAP",line:-1.5,finalPick:"승",finalOdds:2.19,displayGrade:"추천",r554:{ps:.66}},
{...b,...k(2),no:1,home:"A",away:"B",marketFamily:"MONEYLINE",finalPick:"승",finalOdds:1.8,displayGrade:"일반",r554:{ps:.55}},
{...b,...k(40),no:2,home:"C",away:"D",marketFamily:"TOTAL",line:182.5,finalPick:"오버",finalOdds:1.8,displayGrade:"추천",r554:{ps:.66}}];B=r583Text(ST);`);
const B=JSON.parse(run('JSON.stringify(B)'));
assert.equal(B.n,2,'only 추천 이상 within 30h');assert.deepEqual(B.games,[9336,9363],'time order');
assert.match(B.text,/한국전력 빅스톰 마이너스 1\.5 핸디캡/);assert.match(B.text,/대한항공 점보스 승리/);assert.match(B.text,/가장추천이 1경기/);assert.equal(/A 대 B/.test(B.text),false);
run('ST.markets=[];B2=r583Text(ST)');assert.match(run('B2.text'),/아직 없습니다/);
(async()=>{c.ENV={AI:{run:async(m,i)=>{if(i.lang!=='kr')throw new Error('bad');return {audio:Buffer.from('ID3fake').toString('base64')};}}};
const u=await run('r583Audio(ENV,"테스트")');assert.equal(Buffer.from(u).toString(),'ID3fake');
await assert.rejects(run('r583Audio({},"x")'),/AI_BINDING_MISSING/);
console.log('R583 briefing OK');})().catch(e=>{console.error(e);process.exit(1);});
