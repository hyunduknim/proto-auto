#!/bin/bash
# usage: ana.sh <ana.json>
# R898: merges Claude's own analysis of games the site passed on (under its 55%/58% bar) into picks.json "ana" on the
# claude-picks branch. ana.json = {"gmTs:no": {"nos":[all market nos of the game], "d":"YYYY-MM-DD",
#   "m":[{"f":"MONEYLINE|HANDICAP|TOTAL","line":-1.5|null,"pick":"승|무|패|오버|언더","lab":"뉴욕 -5.5 승","p":0.61,"o":1.72}, ...],
#   "b": index of the best of m, "why": "2-3 game reasons"}}. Entries older than yesterday are dropped.
set -euo pipefail
P=$(readlink -f "$1"); H=$(cd "$(dirname "$0")" && pwd); W=$(mktemp -d)
ORIGIN=$(cd "$H/../.." && git remote get-url origin)
git clone -q --depth 1 -b claude-picks "$ORIGIN" "$W/b"
node -e '
const fs=require("fs");const [pf,cf]=process.argv.slice(1);const a=JSON.parse(fs.readFileSync(pf,"utf8"));const c=JSON.parse(fs.readFileSync(cf,"utf8"));
const y=new Date(Date.now()+9*3600e3-86400e3).toISOString().slice(0,10);const bad=[];
for(const [k,v] of Object.entries(a)){if(!/^\d{6}:\d+$/.test(k)||!Array.isArray(v.m)||!v.m.length||v.m.some(x=>!["MONEYLINE","HANDICAP","TOTAL"].includes(x.f)||!(x.p>0&&x.p<1)||!["승","무","패","오버","언더"].includes(x.pick)))bad.push(k);v.at=new Date().toISOString();}
if(bad.length){console.error("bad entries: "+bad.join(", "));process.exit(1);}
const o=Object.assign({},c.ana||{},a);for(const k of Object.keys(o))if(o[k].d&&o[k].d<y)delete o[k];c.ana=o;c.updatedAt=new Date().toISOString();
fs.writeFileSync(cf,JSON.stringify(c,null,1)+"\n");console.log("ana entries: "+Object.keys(o).length);' "$P" "$W/b/picks.json"
cd "$W/b"; git add picks.json
git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit -qm "클로드 분석 (패스 경기)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push -q "$ORIGIN" HEAD:claude-picks
echo "published $(git rev-parse --short HEAD)"
