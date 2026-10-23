// usage: node validate.cjs <new-post.json> <slate.json> [current picks.json]
// Checks a new 클로드추천 post against the live slate: every pick's gmTs/no exists, the pick label is a real choice, odds match Betman,
// the game has not started, and the same game is not already picked in an earlier post. Exit 1 on errors.
const fs=require('fs');const [,,postF,slateF,curF]=process.argv;const post=JSON.parse(fs.readFileSync(postF,'utf8'));const sl=JSON.parse(fs.readFileSync(slateF,'utf8'));
const cur=curF&&fs.existsSync(curF)?JSON.parse(fs.readFileSync(curF,'utf8')):{posts:[]};const mk=new Map();
for(const g of sl.slate||[])for(const [no,fam,line,ch] of g.mk)mk.set(String(sl.gmTs)+':'+no,{g,fam,line,ch});
const err=[],warn=[];if(!post.id||!post.title||!Array.isArray(post.groups)||!post.groups.length)err.push('post needs id, title, groups');
if((cur.posts||[]).some(p=>p.id===post.id))warn.push('post id exists; it will be replaced: '+post.id);
const old=new Set();for(const p of cur.posts||[])if(p.id!==post.id)for(const g of p.groups||[])for(const x of g.picks||[])old.add(x.gmTs+':'+x.no);
const seen=new Set();
for(const g of post.groups||[])for(const x of g.picks||[]){const k=x.gmTs+':'+x.no,m=mk.get(k);if(!m){err.push(k+' not in slate (started, other round, or wrong no)');continue;}
const c=m.ch.find(c=>c[0]===x.pick);if(!c)err.push(k+' pick "'+x.pick+'" not a choice of '+JSON.stringify(m.ch));else if(Math.abs(c[1]-Number(x.odds))>0.011)warn.push(k+' odds '+x.odds+' vs Betman '+c[1]);
const gk=m.g.d+m.g.t+m.g.h;if(seen.has(gk))warn.push(k+' second pick in the same game');seen.add(gk);
if(old.has(k))warn.push(k+' already picked in an earlier post');console.log('ok',k,m.g.d,m.g.t,m.g.h,'vs',m.g.a,m.fam,m.line??'',x.pick,x.odds,'|',x.label);}
for(const c of post.combos||[])for(const no of c.nos||[])if(!(post.groups||[]).some(g=>(g.picks||[]).some(x=>Number(x.no)===Number(no))))err.push('combo leg #'+no+' is not one of the post picks');
warn.forEach(w=>console.log('WARN',w));err.forEach(e=>console.log('ERROR',e));process.exit(err.length?1:0);
