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
                                      'st': f['fixture'].get('status', {}).get('short'), 'inj': {'h': [], 'a': []}, 'lu': None,
                                      'season': lg.get('season')}
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
                row = [p.get('name'), p.get('type'), p.get('reason'), p.get('id')]
                if row not in g['inj'][side]: g['inj'][side].append(row)
            tot = ((j.get('paging') or {}).get('total')) or 1
            if page >= tot: break
            page += 1
    # R832 (owner 11/7: "주전결장있는데 왜 없다고 나오는지? 유료 API 결장자 소식 안나오나?"): API-Football fills a fixture's
    # injury list only close to kick-off, so until then a team with an empty list takes the absentees of its latest
    # listed game this season (injuries/illness/suspensions; not a one-off coach's decision), marked as carried over.
    tinj = cache.get('tinj', {})
    for g in fx.values():
        if not (now - 3 * 3600 < g['t'] / 1000 < now + 30 * 3600) or not g.get('season'): continue
        for side, tid in (('h', g['hid']), ('a', g['aid'])):
            if g['inj'][side]: continue
            k = f"{tid}:{g['season']}"
            e = tinj.get(k)
            if not (e and now - e.get('at', 0) < 8 * 3600):
                rows = get('/injuries', team=tid, season=g['season']).get('response', [])
                last = {}
                for x in rows:
                    fxi = x.get('fixture') or {}; ts = fxi.get('timestamp') or 0
                    if ts >= g['t'] / 1000 - 3600: continue
                    last.setdefault(ts, []).append(x)
                lt = max(last) if last else 0
                keep = []
                for x in last.get(lt, []):
                    pl = x.get('player') or {}
                    if (pl.get('reason') or '') in ("Coach's decision", 'Rest', 'Red Card'): continue
                    if any(r[3] == pl.get('id') for r in keep): continue
                    keep.append([pl.get('name'), 'Carried', pl.get('reason'), pl.get('id')])
                e = tinj[k] = {'at': now, 'lt': lt, 'rows': keep}
            if e['rows'] and now - e['lt'] < 21 * 86400:
                seen = set(); g['inj'][side] = [list(r) for r in e['rows'] if not (r[3] in seen or seen.add(r[3]))]; g.setdefault('injFrom', {})[side] = 'last'
    cache['tinj'] = {k: v for k, v in tinj.items() if now - v.get('at', 0) < 48 * 3600}
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
                lu[side] = {'f': t.get('formation'), 'xi': [p['player']['name'] for p in t.get('startXI', [])], 'ids': [p['player'].get('id') for p in t.get('startXI', [])]}
            g['lu'] = lu_cache[k] = lu
    cache['lu'] = {k: v for k, v in lu_cache.items() if int(k) in fx}
    # R778 (owner paid for Pro: make it count) — per team: who the regulars are (season starts/minutes/goals), home/away goal averages
    # and form (cached 20 h); per fixture: API-Football's own 1X2 prediction (cached 6 h). Only fixtures in the next 30 h.
    ros, tst, prd = cache.get('ros', {}), cache.get('tst', {}), cache.get('prd', {})
    fresh = lambda e, h: e and now - e.get('at', 0) < h * 3600
    for g in fx.values():
        if not (now - 3 * 3600 < g['t'] / 1000 < now + 30 * 3600) or not g.get('season'): continue
        for side, tid in (('h', g['hid']), ('a', g['aid'])):
            k = f"{tid}:{g['lgid']}:{g['season']}"
            if not fresh(ros.get(k), 20):
                pl, page = {}, 1
                while page <= 4:
                    j = get('/players', team=tid, season=g['season'], page=page)
                    for x in j.get('response', []):
                        pid = (x.get('player') or {}).get('id'); st = [z for z in x.get('statistics', []) if (z.get('team') or {}).get('id') == tid]
                        if not pid or not st: continue
                        lu_ = sum((z.get('games') or {}).get('lineups') or 0 for z in st); mn = sum((z.get('games') or {}).get('minutes') or 0 for z in st)
                        gl = sum((z.get('goals') or {}).get('total') or 0 for z in st); asst = sum((z.get('goals') or {}).get('assists') or 0 for z in st)
                        pos = (st[0].get('games') or {}).get('position')
                        if lu_ or mn: pl[str(pid)] = [x['player'].get('name'), lu_, mn, gl, asst, pos]
                    if page >= ((j.get('paging') or {}).get('total') or 1): break
                    page += 1
                mx = max([v[1] for v in pl.values()] or [0])
                ros[k] = {'at': now, 'n': mx, 'key': {pid: v for pid, v in pl.items() if mx and v[1] >= 0.6 * mx}}
            r = ros[k]; g.setdefault('key', {})[side] = {'n': r['n'], 'ids': list(r['key'].keys())[:16]}
            for row in g['inj'][side]:
                v = r['key'].get(str(row[3])) if len(row) > 3 else None
                if v: row.append({'key': 1, 'st': v[1], 'g': v[3], 'a': v[4], 'pos': v[5]})
            if g.get('lu') and g['lu'].get(side):
                xi = set(str(i) for i in g['lu'][side].get('ids') or [])
                g['lu'][side]['miss'] = [r['key'][pid][0] for pid in r['key'] if xi and pid not in xi][:8]
            k2 = f"{tid}:{g['lgid']}:{g['season']}"
            if not fresh(tst.get(k2), 20):
                j = get('/teams/statistics', league=g['lgid'], season=g['season'], team=tid).get('response') or {}
                gg = j.get('goals') or {}
                av = lambda a, b: float((((gg.get(a) or {}).get('average') or {}).get(b)) or 0)
                tst[k2] = {'at': now, 'form': (j.get('form') or '')[-5:], 'gf': [av('for', 'home'), av('for', 'away')], 'ga': [av('against', 'home'), av('against', 'away')],
                           'pl': [((j.get('fixtures') or {}).get('played') or {}).get('home') or 0, ((j.get('fixtures') or {}).get('played') or {}).get('away') or 0]}
            g.setdefault('ts', {})[side] = {kk: vv for kk, vv in tst[k2].items() if kk != 'at'}
        kp = str(g['id'])
        if not fresh(prd.get(kp), 6):
            r0 = (get('/predictions', fixture=g['id']).get('response') or [{}])[0]
            pc = ((r0.get('predictions') or {}).get('percent')) or {}
            num = lambda v: float(str(v or '0').rstrip('%') or 0) / 100
            prd[kp] = {'at': now, 'h': num(pc.get('home')), 'd': num(pc.get('draw')), 'a': num(pc.get('away')), 'uo': (r0.get('predictions') or {}).get('under_over')}
        g['pred'] = {kk: vv for kk, vv in prd[kp].items() if kk != 'at'}
    cache['ros'] = {k: v for k, v in ros.items() if now - v.get('at', 0) < 48 * 3600}
    cache['tst'] = {k: v for k, v in tst.items() if now - v.get('at', 0) < 48 * 3600}
    cache['prd'] = {k: v for k, v in prd.items() if now - v.get('at', 0) < 24 * 3600}
    json.dump(cache, open(CACHE, 'w'))
    out = {'at': datetime.datetime.now(datetime.timezone.utc).isoformat(timespec='seconds'), 'calls': calls,
           'fx': sorted(fx.values(), key=lambda g: g['t'])}
    json.dump(out, open(OUT, 'w'), ensure_ascii=False, separators=(',', ':'))
    print('fixtures', len(out['fx']), 'injured', sum(len(g['inj']['h']) + len(g['inj']['a']) for g in out['fx']),
          'lineups', sum(1 for g in out['fx'] if g['lu']), 'calls', calls)
    return 0

if __name__ == '__main__':
    sys.exit(main())
