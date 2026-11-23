// R992 (owner 11/24 00:34-00:35 "깃허브 오픈소스에 분석해 쓸만한거 없나" → "클로드가 알아서 최적화로 만들어줘"):
// NBA Elo with the published FiveThirtyEight method (K=20, home +100, margin-of-victory multiplier, 25% pull to 1505
// between seasons), built only from ESPN's public NBA scoreboard (no scraping of restricted sites).
// usage: node nba_elo.cjs <picks.json>   → writes picks.json "nbaElo" {at, games, teams:{ESPN displayName: elo}}
// Recomputed at most every 12 hours.
const fs = require('fs');
const pf = process.argv[2];
const C = JSON.parse(fs.readFileSync(pf, 'utf8'));
const old = C.nbaElo;
if (old && Date.now() - Date.parse(old.at || 0) < 12 * 3600e3 && !process.env.FORCE) { console.log('nbaElo fresh', old.at); process.exit(0); }
const K = 20, HCA = 100, MEAN = 1505, CARRY = 0.75;
const seasons = [['20241022', '20250620'], ['20251021', '20260620'], ['20261020', '20270620']];
const ymd = d => d.toISOString().slice(0, 10).replace(/-/g, '');
async function getDay(a) {
  const u = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=' + a;
  for (let i = 0; i < 3; i++) {
    try { const r = await fetch(u, { headers: { accept: 'application/json' } }); if (r.ok) return (await r.json()).events || []; } catch (_) {}
    await new Promise(r => setTimeout(r, 1500));
  }
  return [];
}
(async () => {
  const today = new Date();
  const elo = {}; let games = 0, prevSeason = -1;
  for (let si = 0; si < seasons.length; si++) {
    const [s0, s1] = seasons[si];
    if (s0 > ymd(today)) break;
    if (prevSeason >= 0) for (const k of Object.keys(elo)) elo[k] = CARRY * elo[k] + (1 - CARRY) * MEAN;
    prevSeason = si;
    // ESPN no longer answers date ranges → one call per day, 8 at a time
    const days = []; let d = new Date(Date.UTC(+s0.slice(0, 4), +s0.slice(4, 6) - 1, +s0.slice(6, 8)));
    const end = new Date(Math.min(Date.UTC(+s1.slice(0, 4), +s1.slice(4, 6) - 1, +s1.slice(6, 8)), today.getTime() - 86400e3));
    for (; d <= end; d = new Date(d.getTime() + 86400e3)) days.push(ymd(d));
    const all = [];
    for (let i = 0; i < days.length; i += 8) { const got = await Promise.all(days.slice(i, i + 8).map(x => getDay(x))); for (const g of got) all.push(...g); }
    const evs = [...new Map(all.filter(ev => ev?.status?.type?.completed && ev?.season?.type !== 1).map(ev => [ev.id, ev])).values()].sort((x, y) => Date.parse(x.date) - Date.parse(y.date));
    for (const ev of evs) {
      const cs = ev.competitions?.[0]?.competitors || [], H = cs.find(c => c.homeAway === 'home'), A = cs.find(c => c.homeAway === 'away');
      if (!H || !A) continue; const hn = H.team?.displayName, an = A.team?.displayName, hs = +H.score, as = +A.score;
      if (!hn || !an || !Number.isFinite(hs) || !Number.isFinite(as) || hs === as) continue;
      const eh = elo[hn] ?? MEAN, ea = elo[an] ?? MEAN, hca = ev.competitions?.[0]?.neutralSite ? 0 : HCA;
      const pH = 1 / (1 + Math.pow(10, -(eh + hca - ea) / 400));
      const homeWon = hs > as, mov = Math.abs(hs - as), diffW = homeWon ? (eh + hca - ea) : (ea - eh - hca);
      const mult = Math.pow(mov + 3, 0.8) / (7.5 + 0.006 * diffW);
      const shift = K * mult * ((homeWon ? 1 : 0) - pH);
      elo[hn] = eh + shift; elo[an] = ea - shift; games++;
    }
  }
  if (games < 200) { console.log('too few games', games); process.exit(0); }
  const teams = {}; for (const [k, v] of Object.entries(elo)) teams[k] = Math.round(v);
  C.nbaElo = { at: new Date().toISOString(), games, hca: HCA, teams };
  fs.writeFileSync(pf, JSON.stringify(C, null, 1) + '\n');
  console.log('nbaElo', games, 'games', Object.entries(teams).sort((a, b) => b[1] - a[1]).slice(0, 5).map(x => x.join(' ')).join(', '));
})();
