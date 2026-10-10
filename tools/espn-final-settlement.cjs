"use strict";
// R367: Read only *finished* public football results. No score/odds prediction,
// and no unverified cross-language/team match. Exact fixture whitelist for the
// still-pending 120th-round matches, expandable by reviewed aliases later.
const compact=v=>String(v||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").normalize("NFC")
  .toLowerCase().replace(/[^a-z0-9가-힣]/g,"");
const fixtureSpecs=[
 ["라요 바예카노","아틀레틱 빌바오","esp.1","Rayo Vallecano","Athletic Club"],
 ["우니온 베를린","엘버스베르크","ger.1","1. FC Union Berlin","SV Elversberg"],
 ["릴OSC","르아브르AC","fra.1","Lille","Le Havre AC"],
 ["인테르나치오날레 밀라노","파르마","ita.1","Internazionale","Parma"],
 ["맨체스터 유나이티드","토트넘 홋스퍼","eng.1","Manchester United","Tottenham Hotspur"],
 ["바르셀로나","헤타페","esp.1","Barcelona","Getafe"],
 ["RB라이프치히","프랑크푸르트","ger.1","RB Leipzig","Eintracht Frankfurt"],
 ["페예노르트","AZ알크마르","ned.1","Feyenoord Rotterdam","AZ Alkmaar"],
 ["토론토FC","CF몽레알","usa.1","Toronto FC","CF Montréal"],
 ["포르튀나 시타르트","트벤테","ned.1","Fortuna Sittard","FC Twente"],
 ["시카고 파이어FC","뉴욕 시티FC","usa.1","Chicago Fire FC","New York City FC"],
 ["SSC나폴리","프로시노네","ita.1","Napoli","Frosinone"],
 ["스타드 브레스투아29","앙제SCO","fra.1","Brest","Angers"],
 ["로리앙","파리FC","fra.1","Lorient","Paris FC"],
 ["AS모나코","툴루즈","fra.1","AS Monaco","Toulouse"],
 ["파리 생제르맹","르망FC","fra.1","Paris Saint-Germain","Le Mans"],
 ["레알 마드리드","비야레알","esp.1","Real Madrid","Villarreal"],
 ["AFC아약스","NEC네이메헌","ned.1","Ajax Amsterdam","NEC Nijmegen"]
];
const known=new Map(fixtureSpecs.map(([h,a,league,eh,ea])=>[compact(h)+"|"+compact(a),{league,home:eh,away:ea}]));
function fixture(x){return known.get(compact(x?.home)+"|"+compact(x?.away))||null;}
function matchFinished(pending,leagues,now=Date.now()){
  if(!Array.isArray(pending)||!leagues||typeof leagues!=="object")return [];
  const out=[],seen=new Set();
  for(const m of pending){
    if(!m||m.sport!=="축구"||!m.pick||m.resultFinal||!/^\d{6}$/.test(String(m.gmTs||""))||!Number.isInteger(Number(m.no)))continue;
    const spec=fixture(m);if(!spec)continue;
    const start=Date.parse(String(m.date||"")+"T"+String(m.time||"").slice(0,5)+":00+09:00");
    if(!Number.isFinite(start)||start>now)continue;
    const scores=leagues[spec.league]||[];
    const exact=scores.filter(e=>{
      const gameStart=Date.parse(String(e?.date||""));
      if(!Number.isFinite(gameStart)||Math.abs(start-gameStart)>120000)return false;
      if(e?.status?.type?.completed!==true||e?.status?.type?.name!=="STATUS_FULL_TIME")return false;
      if(!Array.isArray(e?.competitions)||e.competitions.length!==1)return false;
      const parts=e.competitions[0]?.competitors||[];
      if(parts.length!==2)return false;
      const h=parts.find(c=>c.homeAway==="home"),a=parts.find(c=>c.homeAway==="away");
      if(!h||!a||compact(h.team?.displayName)!==compact(spec.home)||compact(a.team?.displayName)!==compact(spec.away))return false;
      if(!/^\d{1,3}$/.test(String(h.score??""))||!/^\d{1,3}$/.test(String(a.score??"")))return false;
      return true;
    });
    if(exact.length!==1)continue;
    const event=exact[0],parts=event.competitions[0].competitors,
      h=parts.find(c=>c.homeAway==="home"),a=parts.find(c=>c.homeAway==="away"),key=m.gmTs+":"+m.no;
    if(seen.has(key))continue;seen.add(key);
    out.push({source:"ESPN_PUBLIC_FULLTIME",gmTs:String(m.gmTs),no:Number(m.no),
      date:String(m.date),time:String(m.time).slice(0,5),home:String(m.home),away:String(m.away),
      marketFamily:String(m.marketFamily),line:m.line??null,score:h.score+":"+a.score,
      sport:"축구",leagueId:spec.league,espnHome:spec.home,espnAway:spec.away,
      eventId:String(event.id||""),eventStart:String(event.date),status:"STATUS_FULL_TIME",
      terminal:true,fullTime:true});
  }
  return out.slice(0,120);
}
async function fetchFinishedLeagueScores(pending,fetcher=fetch){
  const leagues=[...new Set((pending||[]).map(x=>fixture(x)?.league).filter(Boolean))];
  const days=[...new Set((pending||[]).filter(x=>fixture(x)).flatMap(m=>{
    const x=Date.parse(String(m.date||"")+"T"+String(m.time||"").slice(0,5)+":00+09:00");
    if(!Number.isFinite(x))return [];
    const d=new Date(x).toISOString().slice(0,10).replace(/-/g,"");
    return [d];
  }))];
  const pairs=leagues.flatMap(l=>days.map(d=>({league:l,date:d})));
  const responses=await Promise.allSettled(pairs.map(async x=>{
    const u="https://site.api.espn.com/apis/site/v2/sports/soccer/"+x.league+"/scoreboard?dates="+x.date+"&limit=300";
    const r=await fetcher(u,{headers:{"accept":"application/json"},signal:AbortSignal.timeout(14000)});
    if(!r.ok)throw Error(x.league+"_"+x.date+" HTTP_"+r.status);
    const j=await r.json();if(!Array.isArray(j?.events))throw Error("BAD_EVENT_ARRAY");
    return {league:x.league,events:j.events};
  }));
  const byLeague={};
  for(const r of responses)if(r.status==="fulfilled")
    (byLeague[r.value.league] ||= []).push(...r.value.events);
  return {rows:matchFinished(pending,byLeague),checks:pairs.length,
    succeeded:responses.filter(x=>x.status==="fulfilled").length,
    errors:responses.filter(x=>x.status==="rejected").map(x=>String(x.reason?.message||x.reason).slice(0,100))};
}
module.exports={compact,fixture,matchFinished,fetchFinishedLeagueScores};
