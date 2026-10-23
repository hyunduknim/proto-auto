#!/bin/bash
# usage: publish.sh <new-post.json> <slate.json>
# Validates the post, puts it at the top of picks.json on the claude-picks branch (replacing a post with the same id, keeping 40),
# and pushes. The Worker picks it up within ~5-10 minutes (🤖 클로드추천 tab).
set -euo pipefail
P=$(readlink -f "$1"); SL=$(readlink -f "$2"); H=$(cd "$(dirname "$0")" && pwd); W=$(mktemp -d)
ORIGIN=$(cd "$H/../.." && git remote get-url origin)
git clone -q --depth 1 -b claude-picks "$ORIGIN" "$W/b"
node "$H/validate.cjs" "$P" "$SL" "$W/b/picks.json"
node -e '
const fs=require("fs");const [pf,cf]=process.argv.slice(1);const p=JSON.parse(fs.readFileSync(pf,"utf8"));const c=JSON.parse(fs.readFileSync(cf,"utf8"));
c.posts=[p,...(c.posts||[]).filter(x=>x.id!==p.id)].sort((a,b)=>String(b.id).localeCompare(String(a.id))).slice(0,40);c.updatedAt=new Date().toISOString();
fs.writeFileSync(cf,JSON.stringify(c,null,1)+"\n");' "$P" "$W/b/picks.json"
cd "$W/b"; git add picks.json
git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit -qm "클로드추천: $(node -e 'console.log(require(process.argv[1]).title)' "$P")

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push -q "$ORIGIN" HEAD:claude-picks
echo "published $(git rev-parse --short HEAD)"
