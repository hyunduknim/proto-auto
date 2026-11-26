# R1020 (owner 11/27 05:16 "진행"): Korean basketball (KBL, WKBL), FIBA World Cup qualifiers and Korean volleyball (V-League)
# from api-sports (same key as API-Football; the free plan only answers today and the two days before).
# Called by the apifootball loop every 15 min; it calls the API at most every 30 min per sport (≈50 calls a day per sport,
# under the 100 a day free limit), and once an hour from 00:00 to 03:00 KST it also re-reads yesterday for late finishes.
# usage: python3 aps_kr.py <cache.json> <out.json>     env AF_KEY
import json, os, sys, time, urllib.request, datetime

KEY = (os.environ.get('AF_KEY') or '').strip().strip('"').strip("'")
cache_p, out_p = sys.argv[1], sys.argv[2]
try:
    C = json.load(open(cache_p))
except Exception:
    C = {}
C.setdefault('games', {})
C.setdefault('last', {})
now = time.time()
kst = datetime.datetime.utcfromtimestamp(now + 9 * 3600)
today = kst.strftime('%Y-%m-%d')
yday = (kst - datetime.timedelta(days=1)).strftime('%Y-%m-%d')
HOST = {'bb': 'https://v1.basketball.api-sports.io', 'vb': 'https://v1.volleyball.api-sports.io'}


def keep(sp, g):
    lg = g.get('league') or {}
    co = g.get('country') or {}
    name = str(lg.get('name') or '')
    cc = str(co.get('name') or '') + ' ' + str(co.get('code') or '')
    if 'Korea' in cc or ' KR' in cc:
        return True
    if sp == 'bb' and 'World Cup' in name:
        return True
    return False


def call(sp, day):
    req = urllib.request.Request(HOST[sp] + '/games?date=' + day + '&timezone=Asia/Seoul', headers={'x-apisports-key': KEY})
    with urllib.request.urlopen(req, timeout=40) as r:
        d = json.load(r)
    if d.get('errors'):
        print(sp, day, 'errors', d.get('errors'))
        return 0
    n = 0
    for g in d.get('response') or []:
        if not keep(sp, g):
            continue
        sc = g.get('scores') or {}
        h, a = sc.get('home'), sc.get('away')
        if isinstance(h, dict):
            h, a = h.get('total'), (a or {}).get('total')
        per = None
        if sp == 'vb':
            p = g.get('periods') or {}
            try:
                per = [[int(v.get('home')), int(v.get('away'))] for k, v in p.items() if isinstance(v, dict) and v.get('home') is not None]
            except Exception:
                per = None
        st = g.get('status') or {}
        C['games'][sp + ':' + str(g.get('id'))] = {
            'sp': sp, 'id': g.get('id'), 'lg': (g.get('league') or {}).get('name'), 'co': (g.get('country') or {}).get('name'),
            't': g.get('date'), 'h': (g.get('teams') or {}).get('home', {}).get('name'), 'a': (g.get('teams') or {}).get('away', {}).get('name'),
            'st': st.get('short'), 'hs': h, 'as': a, 'per': per, 'u': int(now)}
        n += 1
    return n


if KEY:
    for sp in ('bb', 'vb'):
        last = C['last'].get(sp + ':' + today, 0)
        if now - last >= 29 * 60:
            try:
                print(sp, today, call(sp, today))
            except Exception as e:
                print(sp, 'fail', str(e)[:120])
            C['last'][sp + ':' + today] = now
        if kst.hour < 3:
            last = C['last'].get(sp + ':y:' + yday, 0)
            if now - last >= 59 * 60:
                try:
                    print(sp, yday, call(sp, yday))
                except Exception as e:
                    print(sp, 'fail', str(e)[:120])
                C['last'][sp + ':y:' + yday] = now
# keep four days
cut = now - 4 * 86400
C['games'] = {k: v for k, v in C['games'].items() if v.get('u', 0) >= cut}
C['last'] = {k: v for k, v in C['last'].items() if v >= cut}
json.dump(C, open(cache_p, 'w'))
json.dump({'at': datetime.datetime.utcfromtimestamp(now).isoformat() + 'Z', 'games': sorted(C['games'].values(), key=lambda g: str(g.get('t')))}, open(out_p, 'w'), ensure_ascii=False)
print('aps games', len(C['games']))
