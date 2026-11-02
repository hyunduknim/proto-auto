#!/usr/bin/env python3
"""R768: API-Football (owner's paid Pro plan, 7,500 calls/day) -> short per-fixture summary for the Worker.
Every run: fixtures + injuries for today and tomorrow (KST) in the leagues Betman lists, and the starting XI of games
that kick off within the next 75 minutes (once per team, cached). Output: af_soccer.json. The key never leaves the env."""
import json, os, sys, time, urllib.request, urllib.parse, datetime

KEY = os.environ.get('AF_KEY', '').strip().strip('"').strip("'")
BASE = 'https://v3.football.api-sports.io'
CACHE, OUT = sys.argv[1], sys.argv[2]
# leagues Betman usually lists (API-Football ids)
LEAGUES = {39, 40, 41, 140, 141, 135, 136, 78, 79, 61, 62, 88, 94, 144, 179, 203, 197, 218, 207, 113, 103, 119, 106, 235,
           253, 262, 71, 128, 292, 293, 98, 99, 188, 169, 307, 2, 3, 848, 17, 4, 1, 5, 9, 10, 32, 34, 30, 29, 31}
KST = datetime.timezone(datetime.timedelta(hours=9))
calls = 0

def get(path, **q):
    global calls
    url = BASE + path + ('?' + urllib.parse.urlencode(q) if q else '')
    req = urllib.request.Request(url, headers={'x-apisports-key': KEY})
    for i in range(3):
        try:
            with urllib.request.urlopen(req, timeout=40) as r:
                calls += 1
                d = json.load(r)
                if d.get('errors'):
                    print('api errors', path, list(d['errors'])[:3] if isinstance(d['errors'], dict) else d['errors'])
                return d
        except Exception as e:
            print('retry', path, type(e).__name__); time.sleep(2 + i * 3)
    return {'response': []}

def main():
    if not KEY:
        print('no key'); return 1
    try: cache = json.load(open(CACHE))
    except Exception: cache = {}
    lu_cache = cache.get('lu', {})
    now = time.time()
    today = datetime.datetime.now(KST).date()
    dates = [str(today), str(today + datetime.timedelta(days=1))]
    fx = {}
    for d in dates:
        for f in get('/fixtures', date=d, timezone='Asia/Seoul').get('response', []):
            lg = f.get('league', {})
            if lg.get('id') not in LEAGUES: continue
            t = f['fixture'].get('timestamp') or 0
            if t < now - 3 * 3600 or t > now + 40 * 3600: continue
            fx[f['fixture']['id']] = {'id': f['fixture']['id'], 't': t * 1000, 'lg': lg.get('name'), 'lgid': lg.get('id'), 'cc': lg.get('country'),
                                      'h': f['teams']['home']['name'], 'a': f['teams']['away']['name'],
                                      'hid': f['teams']['home']['id'], 'aid': f['teams']['away']['id'],
                                      'st': f['fixture'].get('status', {}).get('short'), 'inj': {'h': [], 'a': []}, 'lu': None}
    # injuries by date (paged)
    for d in dates:
        page = 1
        while page <= 10:
            j = get('/injuries', date=d, timezone='Asia/Seoul', page=page) if page > 1 else get('/injuries', date=d, timezone='Asia/Seoul')
            for x in j.get('response', []):
                fid = (x.get('fixture') or {}).get('id'); g = fx.get(fid)
                if not g: continue
                side = 'h' if x['team']['id'] == g['hid'] else 'a' if x['team']['id'] == g['aid'] else None
                if not side: continue
                p = x.get('player') or {}
                row = [p.get('name'), p.get('type'), p.get('reason')]
                if row not in g['inj'][side]: g['inj'][side].append(row)
            tot = ((j.get('paging') or {}).get('total')) or 1
            if page >= tot: break
            page += 1
    # starting XI for games within 75 minutes (cached once published)
    for fid, g in fx.items():
        k = str(fid)
        if k in lu_cache: g['lu'] = lu_cache[k]; continue
        if not (now - 2 * 3600 < g['t'] / 1000 < now + 75 * 60): continue
        r = get('/fixtures/lineups', fixture=fid).get('response', [])
        if len(r) >= 2:
            lu = {}
            for t in r:
                side = 'h' if t['team']['id'] == g['hid'] else 'a'
                lu[side] = {'f': t.get('formation'), 'xi': [p['player']['name'] for p in t.get('startXI', [])]}
            g['lu'] = lu_cache[k] = lu
    cache['lu'] = {k: v for k, v in lu_cache.items() if int(k) in fx}
    json.dump(cache, open(CACHE, 'w'))
    out = {'at': datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds'), 'calls': calls,
           'fx': sorted(fx.values(), key=lambda g: g['t'])}
    json.dump(out, open(OUT, 'w'), ensure_ascii=False, separators=(',', ':'))
    print('fixtures', len(out['fx']), 'injured', sum(len(g['inj']['h']) + len(g['inj']['a']) for g in out['fx']),
          'lineups', sum(1 for g in out['fx'] if g['lu']), 'calls', calls)
    return 0

if __name__ == '__main__':
    sys.exit(main())
