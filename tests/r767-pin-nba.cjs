const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const c=vm.createContext({URL,URLSearchParams,Request,Response,Headers,TextEncoder,TextDecoder,AbortController,console,setTimeout,clearTimeout,structuredClone,crypto:globalThis.crypto});
vm.runInContext(fs.readFileSync('자동마킹.js','utf8').replace('export class ProtoStateDO','class ProtoStateDO').replace('export default {','const W={'),c);const run=x=>vm.runInContext(x,c);
const now=Date.parse('2099-01-02T07:03:00+09:00');c.NOW=now;run('Date.now=()=>NOW');
const mk=[];const books=[];let no=1;
for(let i=0;i<5;i++){const b={gmTs:'260130',sport:'농구',league:'NBA',date:'2099-01-02',time:String(8+i).padStart(2,'0')+':30',home:'H'+i,away:'A'+i};
 mk.push({...b,no:no++,marketFamily:'MONEYLINE',choices:[{label:'승',odds:1.4},{label:'패',odds:2.3}]},{...b,no:no++,marketFamily:'HANDICAP',line:-4.5,choices:[{label:'승',odds:1.78},{label:'패',odds:1.7}]},{...b,no:no++,marketFamily:'TOTAL',line:228.5,choices:[{label:'언더',odds:1.75},{label:'오버',odds:1.73}]});
 books.push([mk.length-1,i]);}
c.ST={gmTs:'260130',markets:mk,r507Overseas:{books:{}},r760Posts:[{id:'pin-2099-01-02',groups:[]}],r770Day:'2099-01-02'};
const ml=[[1.55,2.58],[1.3,3.6],[1.75,2.1],[1.5,2.7],[1.45,2.9]],tl=[224.5,232,228.5,226,230];
for(const [idx,i] of books)run(`ST.r507Overseas.books[gameSeed(ST.markets[${idx}])]={ml:[["pinnacle",${ml[i][0]},0,${ml[i][1]}]],tot:[["pinnacle",${tl[i]},1.92,1.92]]}`);
assert.equal(run('r760Update(ST,Date.parse("2099-01-02T06:50:00+09:00")).status'),'IDLE','not before 07:00');
const r=run('r760Update(ST,NOW)');assert.equal(r.status,'POSTED_NBA');
const p=run('ST.r760Posts[0]');assert.equal(p.id,'pin-nba-2099-01-02');const picks=p.groups.flatMap(g=>g.picks);
assert.ok(picks.length>=3&&picks.length<=4,'3~4 picks: '+picks.length);assert.ok(new Set(picks.map(x=>x.fam)).size>=2,'mixed types');
assert.equal(new Set(picks.map(x=>x.home)).size,picks.length,'one per game');
assert.equal(run('r760Update(ST,NOW+600e3).status'),'IDLE','once a day');
// fewer than 5 games -> no post
run('ST.markets=ST.markets.filter(m=>m.home!=="H4");ST.r760Posts=[{id:"pin-2099-01-02",groups:[]}]');assert.ok(!run('r760Update(ST,NOW).id'));assert.equal(run('ST.r760Posts.length'),1);
console.log('r767 ok',picks.map(x=>x.label+' '+x.odds+' '+x.p).join(' | '));
