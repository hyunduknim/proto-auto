#!/usr/bin/env python3
"""Compare-teams for a list of fixtures. argv[1]: "comp|Home|Away;comp|Home|Away;..." -> check.json (compact)."""
import json, os, sys, urllib.request, urllib.error, re, difflib
KEY = os.environ.get('STATSHAWK_KEY', '').strip(); BASE = 'https://api.statshawk.ai'
def get(p):
    r = urllib.request.Request(BASE + p, headers={'X-API-Key': KEY, 'Accept': 'application/json'})
    with urllib.request.urlopen(r, timeout=40) as f: return json.load(f)
norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower().replace('fc', '').replace('afc', ''))
teams = {}; out = []
def cut(x, d=0):
    if isinstance(x, dict): return {k: cut(v, d+1) for k, v in list(x.items())[:60]} if d < 6 else '..'
    if isinstance(x, list): return [cut(v, d+1) for v in x[:6]] if d < 6 else '..'
    if isinstance(x, float): return round(x, 3)
    return x
for item in sys.argv[1].split(';'):
    if not item.strip(): continue
    comp, h, a = item.split('|')
    if comp not in teams:
        try: teams[comp] = {t['name']: t['id'] for t in get(f'/v1/competitions/{comp}/editions/2026/teams')['data']['items']}
        except Exception as e: teams[comp] = {}; out.append({'err': f'teams {comp} {e}'})
    names = list(teams[comp])
    def find(n):
        m = difflib.get_close_matches(norm(n), [norm(x) for x in names], 1, 0.5)
        return next((x for x in names if norm(x) == m[0]), None) if m else None
    hn, an = find(h), find(a)
    if not hn or not an: out.append({'q': item, 'err': 'name', 'have': names}); continue
    res = {'q': item, 'h': hn, 'a': an}
    for side, n in (('H', hn), ('A', an)):
        tid = teams[comp][n]
        try:
            st = get(f'/v1/teams/{tid}/stats?competition={comp}&season=2026').get('data')
            res[side + 'stats'] = cut(st)
        except urllib.error.HTTPError as e: res[side + 'stats'] = f'http {e.code}'
        try:
            gl = get(f'/v1/teams/{tid}/game-log?competition={comp}&season=2026')['data']['items']
            fin = [g for g in gl if g.get('status') == 'final'][-8:]
            res[side + 'log'] = [[g['kickoff'][:10], 'H' if g['home'] else 'A', g['team_score'], g['opponent_score']] for g in fin]
        except urllib.error.HTTPError as e: res[side + 'log'] = f'http {e.code}'
    out.append(res)
json.dump({'status': '200', 'results': out}, open('check.json', 'w'), ensure_ascii=False)
