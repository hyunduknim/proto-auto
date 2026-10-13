'use strict';
// R477: evidence-only Data analytics without any network request.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'..','자동마킹.js'),'utf8');
assert.match(source,/R477-DATA-ODDS/);
assert.match(source,/r477SignatureCard\(m,chosen\)/);
assert.match(source,/\/api\/data-odds-analytics/);
assert.match(source,/readOnly:true/);
const htmlStart=source.indexOf('const INDEX='),tick=String.fromCharCode(96);
const begin=source.indexOf(tick,htmlStart),end=source.indexOf(tick+';',begin);
assert.ok(begin>0&&end>begin,'application HTML template found');
const html=source.slice(begin+1,end),startScript=html.indexOf('<script>'),endScript=html.indexOf('</script>',startScript);
assert.ok(startScript>0&&endScript>startScript,'embedded browser script');
new vm.Script(html.slice(startScript+8,endScript),{filename:'index-embedded.js'});
const piece=source.slice(source.indexOf('function r477DataPayload(s){'),source.indexOf('async function handleApp(req,env,ctx){'));
assert.ok(piece.startsWith('function r477DataPayload(s){'));
const payload=new Function('publicState','APP_VERSION',piece+';return r477DataPayload')(x=>x.view,'R477-TEST');
const fixture={view:{round:'121',markingGames:[{gmTs:'260121',date:'2026-10-13',time:'17:00',game:'A vs B',no:1001,sport:'축구',league:'test',pick:'언더',odds:1.84,marketRows:[{
 no:1001,marketFamily:'TOTAL',line:2.5,choices:[{label:'언더',odds:1.84},{label:'오버',odds:1.94}],
 precision:{valid:true,source:'VERIFIED_DOMESTIC',observedAt:'2026-10-13T01:00:00Z',
 choices:[{label:'언더',currentOdds:1.84,sampleSamples:80,sampleHits:45},{label:'오버',currentOdds:2.10,sampleSamples:80,sampleHits:43}],
 history:[{at:'2026-10-13T01:00:00Z',source:'ZENTOTO_PUBLIC',prices:[{label:'언더',odds:1.9},{label:'오버',odds:1.9}]},{at:'2099-01-01T00:00:00Z',prices:[{label:'언더',odds:1.84},{label:'오버',odds:1.94}]}]}
 }]}]}};
const before=JSON.stringify(fixture),out=payload(fixture);
assert.equal(out.readOnly,true);
assert.equal(out.generatedPrediction,false);
assert.equal(out.connectedPickschoolFeed,false);
assert.equal(out.rows.length,1);
assert.equal(out.rows[0].priceSource,'VERIFIED_DOMESTIC');
assert.ok(Math.abs(out.rows[0].choices.reduce((n,c)=>n+c.marketShare,0)-1)<1e-8);
assert.equal(out.rows[0].choices[0].historicalSameOdds.hits,45);
assert.equal(out.rows[0].choices[1].historicalSameOdds,null);
assert.equal(out.rows[0].history.length,1);
assert.equal(before,JSON.stringify(fixture));
console.log('R477 data, odds card parsing, and immutable selection checks passed');
