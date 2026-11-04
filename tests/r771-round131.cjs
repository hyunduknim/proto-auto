const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
assert.equal(run('r771Grade(.575)'),null);assert.equal(run('r771Grade(.58)'),'일반');assert.equal(run('r771Grade(.634)'),'일반');assert.equal(run('r771Grade(.64)'),'추천');assert.equal(run('r771Grade(.705)'),'가장추천'===run('r771Grade(.705)')?'가장추천':'추천');assert.equal(run('r771Grade(.71)'),'가장추천');
// learning: a weak kind lowers, a strong kind raises (capped)
c.ST={settlementLedger:[...Array(10)].map((_,i)=>({gmTs:'260130',league:'KBL',marketFamily:'HANDICAP',pick:'승',line:3.5,odds:1.7,hit:i<3})).concat([...Array(10)].map((_,i)=>({gmTs:'260130',league:'NBA',marketFamily:'MONEYLINE',pick:'승',odds:1.4,hit:i<8})))};
run('L=r771Learn(ST)');assert.ok(run('r771Adj(L,"KBL","HANDICAP","플핸").adj')<0);assert.equal(run('r771Adj(L,"NBA","MONEYLINE","정배").adj'),.03);
// odds change log
const g={gmTs:'260131',sport:'축구',league:'EPL',date:'2099-01-01',time:'05:00',home:'H',away:'A'};
c.S2={gmTs:'260131',markets:[{...g,no:1,marketFamily:'MONEYLINE',choices:[{label:'승',odds:1.8},{label:'무',odds:3.4},{label:'패',odds:4}]}]};
run('r772Track(S2)');assert.equal(run('S2.r772.log.length'),0);run('S2.markets[0].choices[0].odds=1.72;r772Track(S2)');assert.equal(run('S2.r772.log.length'),1);assert.equal(run('S2.r772.log[0].to[0][1]'),1.72);
const ix=vm.runInContext('INDEX',c);assert.ok(ix.includes('📉 배당변경')&&ix.includes('function r771DrawHtml')&&!ix.includes('아직 발표 전 (보통'));
console.log('r771 ok');
