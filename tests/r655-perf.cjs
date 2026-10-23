const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
c.ST={gmTs:'260126',markets:[],settlementLedger:[
{gmTs:'260125',no:1,sport:'축구',league:'J1리그',marketFamily:'MONEYLINE',pick:'승',odds:1.4,displayGrade:'추천',hit:true},
{gmTs:'260125',no:2,sport:'축구',league:'J1리그',marketFamily:'TOTAL',pick:'언더',line:2.5,odds:1.6,displayGrade:'일반',hit:false},
{gmTs:'260125',no:3,sport:'축구',league:'J1리그',marketFamily:'HANDICAP',pick:'승',line:1,handicapEffectiveLine:1,odds:1.35,displayGrade:'추천',hit:true}]};
const d=run('r655Data(ST)');assert.equal(d.n,3);const fam=Object.fromEntries(d.fam.all.map(r=>[r.k,r]));assert.equal(fam['일반승'].roi,40);assert.equal(fam['플핸'].h,1);assert.equal(fam['언더'].h,0);
const html=vm.runInContext('INDEX',c);assert.ok(html.includes('function r655Render')&&html.includes('id="tabPerf"'));
console.log('R655 data OK',JSON.stringify(d.fam.all));
