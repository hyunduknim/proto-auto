const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,Request,Response,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
const base='gmTs:"260122",date:"2026-10-14",time:"18:00",sport:"야구",league:"NPB",home:"한신 타이거즈",away:"요코하마 DeNA베이스타스",resultFinal:true';
// handicap-applied + totals only → real score recovered from the handicap line
run(`S={markets:[{${base},no:8101,marketFamily:"HANDICAP",line:-2.5,resultMatchedFamily:"HANDICAP",resultScoreText:"핸디적용 2.5:3"},{${base},no:8102,marketFamily:"TOTAL",line:5.5,resultMatchedFamily:"TOTAL",resultScoreText:"합계 8점"}],settledCards:{rows:[{gmTs:"260122",no:8102,score:"합계 8점"}]}}`);
assert.equal(run('r537UnifyFinalScores(S)')>0,true);
assert.equal(run('S.markets[0].resultScoreText'),'5:3','handicap -2.5 applied 2.5:3 → real 5:3');
assert.equal(run('S.markets[1].resultScoreText'),'5:3','totals card shows the real score too');
assert.equal(run('S.markets[1].resultScoreDetail'),'합계 8점');
assert.equal(run('S.settledCards.rows[0].score'),'5:3','settled card updated');
// contradiction → untouched
run(`S2={markets:[{${base},no:1,marketFamily:"MONEYLINE",resultMatchedFamily:"MONEYLINE",resultScoreText:"5:3"},{${base},no:2,marketFamily:"TOTAL",resultMatchedFamily:"TOTAL",resultScoreText:"합계 7점"}]}`);
run('r537UnifyFinalScores(S2)');assert.equal(run('S2.markets[1].resultScoreText'),'합계 7점','sum disagrees → nothing changed');
// integer handicap line with known family
run(`S3={markets:[{${base},sport:"축구",no:3,marketFamily:"HANDICAP",line:1,resultMatchedFamily:"HANDICAP",resultScoreText:"2:2"},{${base},sport:"축구",no:4,marketFamily:"MONEYLINE",resultMatchedFamily:"MONEYLINE",resultScoreText:"1:2"}]}`);
run('r537UnifyFinalScores(S3)');assert.equal(run('S3.markets[0].resultScoreText'),'1:2','+1 applied 2:2 agrees with raw 1:2');
// old record without family on a handicap market is not reinterpreted
run(`S4={markets:[{${base},no:5,marketFamily:"HANDICAP",line:-1.5,resultScoreText:"3:1"}]}`);
run('r537UnifyFinalScores(S4)');assert.equal(run('S4.markets[0].resultScoreText'),'3:1');
console.log('R537 real final score OK');
