"use strict";
const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'..','자동마킹.js'),'utf8');
const from=source.indexOf('function r392FilterSettlementRows('),to=source.indexOf('function renderPastSettlementPanel()',from);
assert.ok(from>0&&to>from,'Filter function in UI');
const fn=new Function('liveGameStartMs',source.slice(from,to)+'\nreturn r392FilterSettlementRows;')
(m=>Date.parse(m.date+'T'+m.time+':00+09:00'));
const rows=[{date:'2026-10-11',time:'08:30',resultFinal:false},
{date:'2026-10-11',time:'09:30',resultFinal:false},
{resultFinal:true,settlementStatus:'적중',hit:true},
{resultFinal:true,settlementStatus:'낙첨',hit:false},
{resultFinal:true,settlementStatus:'적특',hit:null}];
const at=Date.parse('2026-10-11T13:00:00+09:00');
for(const [key,n] of [['all',5],['pending',2],['overdue',2],['hit',1],['miss',1],['void',1]])
assert.equal(fn(rows,key,at).length,n,key);
assert.equal(rows.length,5,'Filtering never mutates the source list');
assert.ok(source.indexOf('r381RefreshCloudflareZentoto(cur,env,fiveMinuteDue);')<
 source.indexOf('r384RefreshSpogodResults(cur,env,fiveMinuteDue);'),'Zentoto first, Spogod second');
assert.ok(source.includes('olderRoundPending:q.filter('),'Previous round queue kept');
assert.ok(source.includes('pastPendingGames:p')||source.includes('pastPendingGames,'),'Pending displayed');
console.log('R392_FILTER_DISPLAY_ONLY_PASS');
