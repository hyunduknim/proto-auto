#!/usr/bin/env python3
"""R755: NBA team efficiency from StatsHawk box scores (regular season only).
Per-game team totals are cached privately (actions/cache, games.json); only the derived per-team
summary (nba_team.json) is published. Key comes from env STATSHAWK_KEY and is never printed."""
import json, os, sys, time, urllib.request, urllib.error, datetime as dt
KEY = os.environ.get('STATSHAWK_KEY', '').strip()
BASE = 'https://api.statshawk.ai'
START = dt.date(2026, 10, 21)
CACHE = sys.argv[1]; OUT = sys.argv[2]
calls = 0
def get(path):
    global calls
    calls += 1
    req = urllib.request.Request(BASE + path, headers={'X-API-Key': KEY, 'Accept': 'application/json'})
    with urllib.request.urlopen(req, timeout=40) as r:
        return json.load(r)
try: cache = json.load(open(CACHE))
except Exception: cache = {'games': {}, 'dates': {}}
today = dt.datetime.utcnow().date()
d = START
while d <= today:
    ds = d.isoformat()
    if ds not in cache['dates'] or (today - d).days <= 2:
        try:
            items = get(f'/v1/competitions/nba/editions/2026/contests?date={ds}')['data']['items']
            cache['dates'][ds] = [x['id'] for x in items if x.get('stage') == 'regular' and x.get('status') == 'final']
        except urllib.error.HTTPError as e:
            print('dates', ds, e.code); 
    d += dt.timedelta(days=1)
for ds, ids in cache['dates'].items():
    for cid in ids:
        if cid in cache['games'] or calls > 150: continue
        try:
            b = get(f'/v1/contests/{cid}/boxscore')['data']
        except urllib.error.HTTPError as e:
            print('box', cid, e.code); continue
        if not b.get('finalized'): continue
        c = b['contest']; tot = {}
        for ln in b.get('lines', []):
            for ph in ln.get('phases', []):
                if ph.get('phase') != 'basketball_player_game': continue
                t = tot.setdefault(ln['team'], {})
                for k in ('pts','fga','fgm','tpa','tpm','fta','ftm','oreb','dreb','tov','ast','stl','blk','min'):
                    t[k] = t.get(k, 0) + (ph['measures'].get(k) or 0)
        cache['games'][cid] = {'t': c['kickoff'], 'h': c['home_team_name'], 'a': c['away_team_name'], 'hid': c['home_team'], 'aid': c['away_team'],
                               'hs': c['score']['home'], 'as': c['score']['away'], 'tot': tot}
json.dump(cache, open(CACHE, 'w'))
def poss(t, o):
    return t['fga'] + 0.44 * t['fta'] - t['oreb'] + t['tov']
teams = {}
for g in sorted(cache['games'].values(), key=lambda x: x['t']):
    if len(g['tot']) != 2: continue
    for side, oside in (('h', 'a'), ('a', 'h')):
        tid, oid = g[side + 'id'], g[oside + 'id']
        t, o = g['tot'].get(tid), g['tot'].get(oid)
        if not t or not o: continue
        teams.setdefault(g[side], []).append((g['t'], t, o, g[side + 's'], g[oside + 's'], side == 'h'))
def agg(rows):
    S = lambda i, k: sum(r[i][k] for r in rows)
    T = {k: S(1, k) for k in rows[0][1]}; O = {k: S(2, k) for k in rows[0][2]}
    pt, po = poss(T, O), poss(O, T); p = (pt + po) / 2
    mins = sum(max(240, r[1].get('min', 240)) for r in rows) / 5 / len(rows)
    r = lambda x: round(x, 1)
    return {'n': len(rows), 'pts': r(sum(x[3] for x in rows) / len(rows)), 'opp': r(sum(x[4] for x in rows) / len(rows)),
            'ortg': r(100 * sum(x[3] for x in rows) / p), 'drtg': r(100 * sum(x[4] for x in rows) / p),
            'pace': r(p / len(rows) * 48 / max(48, mins)),
            'efg': r(100 * (T['fgm'] + 0.5 * T['tpm']) / T['fga']), 'oefg': r(100 * (O['fgm'] + 0.5 * O['tpm']) / O['fga']),
            'tov': r(100 * T['tov'] / (T['fga'] + 0.44 * T['fta'] + T['tov'])), 'otov': r(100 * O['tov'] / (O['fga'] + 0.44 * O['fta'] + O['tov'])),
            'oreb': r(100 * T['oreb'] / (T['oreb'] + O['dreb'])), 'dreb': r(100 * T['dreb'] / (T['dreb'] + O['oreb'])),
            'ftr': r(100 * T['fta'] / T['fga']), 'tp': r(100 * T['tpm'] / max(1, T['tpa'])), 'otp': r(100 * O['tpm'] / max(1, O['tpa']))}
out = {}
for name, rows in teams.items():
    out[name] = {'all': agg(rows), 'last5': agg(rows[-5:]), 'last': rows[-1][0]}
json.dump({'at': dt.datetime.utcnow().isoformat(timespec='seconds') + 'Z', 'source': 'StatsHawk box scores (regular season)', 'calls': calls, 'teams': out},
          open(OUT, 'w'), ensure_ascii=False, indent=1)
print('teams', len(out), 'games', len(cache['games']), 'calls', calls)
