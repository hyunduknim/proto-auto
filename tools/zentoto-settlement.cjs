"use strict";
// Parse only the public, full-time, terminal Proto settlement rows.
// This module never submits a bet or modifies saved selections.
const strip = x => String(x||"").replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,"")
  .replace(/<[^>]+>/g," ").replace(/&nbsp;|&#160;/gi," ")
  .replace(/&amp;/gi,"&").replace(/&lt;/gi,"<").replace(/&gt;/gi,">")
  .replace(/\s+/g," ").trim();
function parseZentoto(html){
  if(typeof html!=="string"||html.length<100)return [];
  const blocks=html.split(/<div class="game row col-xs-12">/);
  const results=[],seen=new Set();
  for(const block of blocks.slice(1)){
    const noMatch=block.match(/<p class="proto_uid">\s*(\d{3,6})\s*<\/p>/);
    if(!noMatch)continue;
    const no=Number(noMatch[1]);
    if(seen.has(no))continue;
    const status=block.match(/<p class="game_state([^"]*)"[^>]*>\s*([^<]*)<\/p>/);
    if(!status||!/\bstate_finish\b/.test(status[1])||strip(status[2])!=="경기종료")continue;
    const round=block.match(/(?:game_round|round)=["']?(\d{6})/i)||
      block.match(/game_round=(\d{6})&proto_uid=/)||
      block.match(/\/(\d{6})\/\d{3,6}/);
    if(!round)continue;
    const datetime=block.match(/<div class="col-xs-5 date tar">\s*(20\d{2}-\d{2}-\d{2})\([^)]*\)\s*(\d{2}:\d{2})\s*<\/div>/);
    if(!datetime)continue;
    const homeTag=block.match(/<p class="home">([\s\S]*?)<\/p>/),awayTag=block.match(/<p class="away">([\s\S]*?)<\/p>/),
      scoreTag=block.match(/<p class="vs">([\s\S]*?)<\/p>/);
    if(!homeTag||!awayTag||!scoreTag)continue;
    const home=strip(homeTag[1].replace(/<span\b[^>]*>[\s\S]*?<\/span>/g,"")),away=strip(awayTag[1]),
      score=strip(scoreTag[1]);
    if(!home||!away)continue;
    const type=strip(homeTag[1].match(/\((?:U\/O|H[+-]?)\d+(?:\.\d+)?\)/i)?.[0]||"").replace(/^\(|\)$/g,"");
    const total=type.match(/^U\/O(\d+(?:\.\d+)?)$/i),handicap=type.match(/^H([+-]?\d+(?:\.\d+)?)$/i);
    const family=total?"TOTAL":handicap?"HANDICAP":"MONEYLINE",line=total?Number(total[1]):handicap?Number(handicap[1]):null;
    // Explicit market identity, FULLTIME outcome, no totals guessed from handicap-adjusted scores.
    if(family==="TOTAL"&&!/^\d{1,3}$/.test(score))continue;
    if(family!=="TOTAL"&&!/^\d{1,3}(?:\.\d)?\s*:\s*\d{1,3}(?:\.\d)?$/.test(score))continue;
    if(family==="MONEYLINE"&&!/\bwdl=["']W["']/.test(block)&&!/\bwdl=["']D["']/.test(block))continue;
    seen.add(no);
    results.push({source:"ZENTOTO_LEGACY_FULLTIME",gmTs:round[1],no,
      date:datetime[1],time:datetime[2],home,away,marketFamily:family,line,
      score:score.replace(/\s+/g,""),terminal:true,fullTime:true});
  }
  return results;
}
module.exports={parseZentoto};
