"""R804 실시간 중계 수집 (owner 11/6 "실시간 스코어 문자중계 · 고퀄리티하고 디테일하게").
One pass: reads the previous live.json, refreshes what is live, writes live.json.
  해외축구·K리그  API-Football Pro  /fixtures?live=all (events included), only fixtures in af_soccer.json   every pass (60 s)
  NBA             ESPN scoreboard + summary plays (scoring plays, period ends)                              every pass
  KBL·WKBL / V리그 / KBO   API-Sports basketball / volleyball / baseball  /games?date=  (free plan, 100 a day each)
                  every 3 min while a Korean game is on, capped at 90 calls a day per sport; the play-by-play text
                  is written from the score changes between passes.
Keys come from the environment only and are never printed."""
import json, os, re, sys, time, urllib.request, datetime as dt

KEY = re.sub(r'[\s"\']', '', os.environ.get('K', ''))
NOW = time.time()
KST = dt.timezone(dt.timedelta(hours=9))
TODAY = dt.datetime.fromtimestamp(NOW, KST).strftime('%Y-%m-%d')
UTCDAY = dt.datetime.utcfromtimestamp(NOW).strftime('%Y-%m-%d')

def get(url, key=False, timeout=25):
    req = urllib.request.Request(url, headers={'accept': 'application/json', 'user-agent': 'proto-live/1.0', **({'x-apisports-key': KEY} if key else {})})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode('utf-8', 'replace'))

def load(p, d):
    try:
        return json.load(open(p, encoding='utf-8'))
    except Exception:
        return d

prev = load('prev/live.json', {})
G = {g['id']: g for g in prev.get('games', []) if isinstance(g, dict) and g.get('id')}
calls = prev.get('calls') if (prev.get('calls') or {}).get('day') == UTCDAY else {'day': UTCDAY}
last = prev.get('last') or {}
log = []

def keep(g):
    """games stay on the board until 3 h after they finish"""
    if g.get('fin') and NOW - g.get('finAt', NOW) > 3 * 3600:
        return False
    return NOW - g.get('t', NOW) / 1000 < 8 * 3600

def feed_add(g, line, kind='info', key=None):
    f = g.setdefault('feed', [])
    k = key or line
    if any(x.get('k') == k for x in f):
        return
    f.append({'at': int(NOW * 1000), 'k': k, 'x': line, 'kind': kind})
    del f[:-60]

# ---------------- 해외축구 · K리그 (API-Football) ----------------
af = load('af/af_soccer.json', {})
fx = {int(x['id']): x for x in af.get('fx', []) if x.get('id')}
win = [x for x in fx.values() if x.get('t') and -5 * 60 <= NOW - x['t'] / 1000 <= 150 * 60]
EVK = {'Goal': 'goal', 'Card': 'card', 'subst': 'sub', 'Var': 'var'}
def ev_line(e, g):
    m = (e.get('time') or {}).get('elapsed'); ex = (e.get('time') or {}).get('extra')
    mm = f"{m}'" + (f"+{ex}" if ex else '')
    p = (e.get('player') or {}).get('name') or ''
    a = (e.get('assist') or {}).get('name') or ''
    tn = (e.get('team') or {}).get('name') or ''
    side = '홈' if (e.get('team') or {}).get('id') == g.get('hid') else '원정'
    t, d = e.get('type'), e.get('detail') or ''
    if t == 'Goal':
        if 'Missed' in d:
            return mm + f' ❌ 페널티 실축 · {p} ({tn})', 'miss'
        tag = ' (페널티)' if 'Penalty' in d else ' (자책골)' if 'Own' in d else ''
        return mm + f' ⚽ 골! {p}{tag}' + (f' · 도움 {a}' if a else '') + f' ({tn})', 'goal'
    if t == 'Card':
        return mm + (' 🟥 퇴장 ' if 'Red' in d else ' 🟨 경고 ') + f'{p} ({tn})', 'red' if 'Red' in d else 'card'
    if t == 'subst':
        return mm + f' 🔁 교체 {a} ↔ {p} ({tn})', 'sub'
    if t == 'Var':
        return mm + f' 📺 VAR · {d} ({tn})', 'var'
    return None, None
if win and KEY:
    try:
        j = get('https://v3.football.api-sports.io/fixtures?live=all', key=True)
        calls['fb'] = calls.get('fb', 0) + 1
        live_ids = set()
        for it in j.get('response', []):
            fid = it['fixture']['id']
            if fid not in fx:
                continue
            live_ids.add(fid)
            x = fx[fid]; st = it['fixture']['status']
            gid = f'fb{fid}'
            g = G.get(gid) or {'id': gid, 'sp': '축구', 'src': 'af', 'af': fid, 't': x['t'], 'lg': it['league']['name'], 'h': it['teams']['home']['name'], 'a': it['teams']['away']['name'], 'hid': it['teams']['home']['id'], 'aid': it['teams']['away']['id']}
            hs, as_ = it['goals']['home'] or 0, it['goals']['away'] or 0
            g.update({'hs': hs, 'as': as_, 'st': st.get('short'), 'clock': (f"{st.get('elapsed')}'" + (f"+{st['extra']}" if st.get('extra') else '')) if st.get('elapsed') is not None else '', 'stx': {'1H': '전반', 'HT': '하프타임', '2H': '후반', 'ET': '연장', 'BT': '연장 휴식', 'P': '승부차기', 'LIVE': '진행 중', 'INT': '중단', 'SUSP': '중단'}.get(st.get('short'), st.get('long')), 'live': True, 'fin': False, 'up': int(NOW * 1000)})
            ht = (it.get('score') or {}).get('halftime') or {}
            g['per'] = [[ht.get('home'), ht.get('away')]] if ht.get('home') is not None else []
            for e in it.get('events') or []:
                line, kind = ev_line(e, g)
                if line:
                    feed_add(g, line, kind, key=json.dumps([e.get('time'), e.get('type'), (e.get('player') or {}).get('id'), (e.get('assist') or {}).get('id')]))
            if st.get('short') == 'HT':
                feed_add(g, f'⏸ 전반 종료 {hs}:{as_}', 'period', key='HT')
            G[gid] = g
        # corners / cards / shots every 2 min (owner: "옐로카드 레드카드 · 코너킥 표시")
        for gid, g in G.items():
            if g.get('sp') != '축구' or not g.get('live') or g.get('af') not in live_ids or NOW - g.get('_statAt', 0) < 110:
                continue
            try:
                r = get(f"https://v3.football.api-sports.io/fixtures/statistics?fixture={g['af']}", key=True)
                calls['fb'] = calls.get('fb', 0) + 1; g['_statAt'] = NOW
                T = {}
                for side in r.get('response') or []:
                    k = 'h' if side['team']['id'] == g.get('hid') else 'a'
                    for x in side.get('statistics') or []:
                        T.setdefault(x['type'], {})[k] = x.get('value')
                v = lambda t: [int(T.get(t, {}).get('h') or 0), int(T.get(t, {}).get('a') or 0)]
                old = g.get('stat') or {}
                st2 = {'cor': v('Corner Kicks'), 'yc': v('Yellow Cards'), 'rc': v('Red Cards'), 'sot': v('Shots on Goal'), 'sh': v('Total Shots'), 'pos': [str(T.get('Ball Possession', {}).get('h') or ''), str(T.get('Ball Possession', {}).get('a') or '')]}
                oc = old.get('cor') or [0, 0]
                for i, nm in ((0, g['h']), (1, g['a'])):
                    if st2['cor'][i] > oc[i] and old:
                        feed_add(g, f"{g.get('clock','')} 🚩 코너킥 {nm} (+{st2['cor'][i]-oc[i]}) · 코너 누적 {st2['cor'][0]}:{st2['cor'][1]}", 'corner', key=f"cor{i}-{st2['cor'][i]}")
                g['stat'] = st2
            except Exception as e:
                log.append('fb stat ' + str(e)[:80])
        # tracked games that left the live list → fetch the final once
        for gid, g in list(G.items()):
            if g.get('sp') == '축구' and g.get('live') and g.get('af') not in live_ids:
                try:
                    r = get(f"https://v3.football.api-sports.io/fixtures?id={g['af']}", key=True)
                    calls['fb'] = calls.get('fb', 0) + 1
                    it = (r.get('response') or [None])[0]
                    if it:
                        st = it['fixture']['status']['short']
                        g['hs'], g['as'] = it['goals']['home'] or 0, it['goals']['away'] or 0
                        for e in it.get('events') or []:
                            line, kind = ev_line(e, g)
                            if line:
                                feed_add(g, line, kind, key=json.dumps([e.get('time'), e.get('type'), (e.get('player') or {}).get('id'), (e.get('assist') or {}).get('id')]))
                        if st in ('FT', 'AET', 'PEN'):
                            g.update({'live': False, 'fin': True, 'finAt': NOW, 'st': st, 'stx': '경기 종료', 'clock': ''})
                            feed_add(g, f"🏁 경기 종료 {g['hs']}:{g['as']}", 'end', key='FT')
                except Exception as e:
                    log.append('fb final ' + str(e)[:80])
    except Exception as e:
        log.append('fb ' + str(e)[:120])

# ---------------- NBA (ESPN) ----------------
def nba_kr(text):
    t = text
    a = re.search(r'\((.+?) assists\)', t); ast = a.group(1) if a else ''
    t = re.sub(r'\s*\(.+? assists\)', '', t)
    m = re.match(r'(.+?) makes (.*)', t)
    if m:
        who, what = m.group(1), m.group(2).lower()
        if 'free throw' in what:
            k = re.search(r'free throw (\d) of (\d)', what); kind = f'자유투 성공' + (f' ({k.group(1)}/{k.group(2)})' if k else '')
        elif 'three point' in what:
            ft = re.search(r'(\d+)-foot', what); kind = '3점슛 성공' + (f' ({ft.group(1)}ft)' if ft else '')
        elif 'dunk' in what:
            kind = '덩크 성공'
        elif 'layup' in what:
            kind = '레이업 성공'
        elif 'hook' in what:
            kind = '훅슛 성공'
        else:
            kind = '2점슛 성공'
        return f'{who} {kind}' + (f' · 도움 {ast}' if ast else '')
    m = re.match(r'End of the (\d)\w\w Quarter', t)
    if m:
        return f'{m.group(1)}쿼터 종료'
    if t.startswith('End of Game'):
        return '경기 종료'
    return None
try:
    for d in sorted({dt.datetime.utcfromtimestamp(NOW - 6 * 3600).strftime('%Y%m%d'), dt.datetime.utcfromtimestamp(NOW).strftime('%Y%m%d')}):
        sb = get(f'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates={d}')
        for ev in sb.get('events', []):
            c = ev['competitions'][0]; stt = c['status']['type']
            if stt['state'] == 'pre':
                continue
            gid = f"nba{ev['id']}"
            g = G.get(gid)
            if stt['state'] == 'post' and (not g or g.get('fin')):
                continue
            H = next(x for x in c['competitors'] if x['homeAway'] == 'home'); A = next(x for x in c['competitors'] if x['homeAway'] == 'away')
            g = g or {'id': gid, 'sp': '농구', 'src': 'espn', 'lg': 'NBA', 't': int(dt.datetime.fromisoformat(ev['date'].replace('Z', '+00:00')).timestamp() * 1000), 'h': H['team']['displayName'], 'a': A['team']['displayName']}
            g.update({'hs': int(H.get('score') or 0), 'as': int(A.get('score') or 0), 'per': [[int(x.get('value') or 0) for x in (H.get('linescores') or [])], [int(x.get('value') or 0) for x in (A.get('linescores') or [])]],
                      'clock': c['status'].get('displayClock') or '', 'q': c['status'].get('period'), 'stx': stt.get('shortDetail') or '', 'live': stt['state'] == 'in', 'fin': stt['state'] == 'post', 'up': int(NOW * 1000)})
            g['per'] = list(map(list, zip(*g['per']))) if g['per'][0] else []
            if g['fin'] and not g.get('finAt'):
                g['finAt'] = NOW; g['stx'] = '경기 종료'
            try:
                sm = get(f"https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event={ev['id']}")
                for p in (sm.get('plays') or [])[-120:]:
                    if not (p.get('scoringPlay') or re.match(r'End of', p.get('text') or '')):
                        continue
                    kr = nba_kr(p.get('text') or '')
                    if not kr:
                        continue
                    q = (p.get('period') or {}).get('number'); clk = (p.get('clock') or {}).get('displayValue') or ''
                    pre = f'{q}Q {clk} ' if 'End' not in (p.get('text') or '') else '⏸ '
                    feed_add(g, pre + kr + f" · {p.get('homeScore')}:{p.get('awayScore')}", 'three' if '3점' in kr else 'period' if '종료' in kr else 'score', key='p' + str(p.get('id')))
            except Exception as e:
                log.append('nba sum ' + str(e)[:80])
            G[gid] = g
except Exception as e:
    log.append('nba ' + str(e)[:120])

# ---------------- 국내 (API-Sports free: basketball / volleyball / baseball) ----------------
KR = {
 'basketball': [('JungKwanJang', '정관장'), ('Knights', 'SK'), ('Thunders', '삼성'), ('KCC', 'KCC'), ('Sakers', 'LG'), ('Sono', '소노'), ('Sonicboom', 'KT'), ('Promy', 'DB'), ('Mobis', '현대모비스'), ('Pegasus', '가스공사'), ('KOGAS', '가스공사'),
                ('Hana', '하나은행'), ('KB Stars', 'KB'), ('Woori', '우리은행'), ('Samsung Life', '삼성생명'), ('Shinhan', '신한은행'), ('BNK', 'BNK')],
 'volleyball': [('KAL', '대한항공'), ('Kepco', '한국전력'), ('Hyundai Capital', '현대캐피탈'), ('Samsung Fire', '삼성화재'), ('OK', 'OK'), ('Woori Card', '우리카드'), ('KB Insurance', 'KB손해보험'),
                ('IBK', 'IBK'), ('GS Caltex', 'GS칼텍스'), ('Hyundai E', '현대건설'), ('Heungkuk', '흥국생명'), ('Expressway', '도로공사'), ('Red Sparks', '정관장'), ('Pepper', '페퍼')],
 'baseball': [('Samsung', '삼성'), ('KT Wiz', 'KT'), ('LG', 'LG'), ('Doosan', '두산'), ('SSG', 'SSG'), ('Kiwoom', '키움'), ('Hanwha', '한화'), ('Lotte', '롯데'), ('NC', 'NC'), ('Kia', 'KIA')]}
def kr(sport, name):
    for k, v in KR[sport]:
        if k.lower() in name.lower():
            return v
    return name
HOST = {'basketball': 'v1.basketball.api-sports.io', 'volleyball': 'v1.volleyball.api-sports.io', 'baseball': 'v1.baseball.api-sports.io'}
SPK = {'basketball': '농구', 'volleyball': '배구', 'baseball': '야구'}
def dom_due(sport):
    sch = (prev.get('sched') or {}).get(sport) or {}
    if sch.get('day') != TODAY:
        return True  # first look of the day
    ts = sch.get('t') or []
    on = any(t / 1000 - 10 * 60 <= NOW <= t / 1000 + 4 * 3600 for t in ts) and any(not G.get(i, {}).get('fin') for i in sch.get('ids', [])) if ts else False
    left = 92 - calls.get(sport, 0)
    if not on or left <= 0:
        return False
    span = (max(ts) / 1000 + (3.6 if sport == 'baseball' else 2.4) * 3600) - NOW  # until the last game should end
    gap = min(300, max(60, span / left))
    return NOW - last.get(sport, 0) >= gap - 5
sched = prev.get('sched') or {}
for sport in ('basketball', 'volleyball', 'baseball'):
    if not KEY or not dom_due(sport):
        continue
    try:
        j = get(f'https://{HOST[sport]}/games?date={TODAY}&timezone=Asia/Seoul', key=True)
        calls[sport] = calls.get(sport, 0) + 1; last[sport] = NOW
        ts, ids = [], []
        for it in j.get('response', []):
            if 'Korea' not in json.dumps(it.get('country') or {}):
                continue
            gid = f"{sport[:2]}{it['id']}"; t = int(it['timestamp']) * 1000
            ts.append(t); ids.append(gid)
            st = it['status']; short = st.get('short') or ''
            g = G.get(gid) or {'id': gid, 'sp': SPK[sport], 'src': 'as', 'lg': it['league']['name'], 't': t, 'h': kr(sport, it['teams']['home']['name']), 'a': kr(sport, it['teams']['away']['name'])}
            ph, pa = g.get('hs'), g.get('as')
            fin = short in ('FT', 'AOT', 'AP', 'FIN', 'POST') or 'Finished' in (st.get('long') or '')
            notstarted = short in ('NS', 'TBD', 'CANC', 'PST', 'POST') and not fin
            if sport == 'basketball':
                S = it['scores']; hs, as_ = S['home']['total'], S['away']['total']
                qs = [[S['home'].get(k), S['away'].get(k)] for k in ('quarter_1', 'quarter_2', 'quarter_3', 'quarter_4', 'over_time')]
                per = [q for q in qs if q[0] is not None]
                g.update({'per': per, 'clock': (f"{st.get('timer')}분" if st.get('timer') and short not in ('HT', 'BT') else ''), 'stx': {'Q1': '1쿼터', 'Q2': '2쿼터', 'Q3': '3쿼터', 'Q4': '4쿼터', 'OT': '연장', 'BT': '쿼터 휴식', 'HT': '하프타임'}.get(short, st.get('long'))})
            elif sport == 'volleyball':
                S = it['scores']; hs, as_ = S['home'], S['away']; P = it.get('periods') or {}
                per = [[P[k]['home'], P[k]['away']] for k in ('first', 'second', 'third', 'fourth', 'fifth') if P.get(k) and P[k].get('home') is not None]
                g.update({'per': per, 'clock': '', 'stx': {'S1': '1세트', 'S2': '2세트', 'S3': '3세트', 'S4': '4세트', 'S5': '5세트'}.get(short, st.get('long'))})
            else:
                S = it['scores']; hs, as_ = S['home']['total'], S['away']['total']
                inn = [[S['home']['innings'].get(str(i)), S['away']['innings'].get(str(i))] for i in range(1, 10)]
                per = [q for q in inn if q[0] is not None or q[1] is not None]
                g.update({'per': per, 'hits': [S['home'].get('hits'), S['away'].get('hits')], 'clock': '', 'stx': re.sub(r'Inning (\d+)', r'\1회', st.get('long') or '')})
            if notstarted or hs is None:
                g.update({'live': False, 'fin': False, 'hs': None, 'as': None}); G[gid] = g; continue
            g.update({'hs': hs, 'as': as_, 'live': not fin, 'fin': fin, 'up': int(NOW * 1000)})
            H, A = g['h'], g['a']
            # ---- 중계 문장 (점수 변화로 작성) ----
            if sport == 'basketball':
                prevper = g.get('_per') or []
                brk = short in ('HT', 'BT')
                # a quarter that has not started yet (0:0 at a break) is not "finished"
                if per and (per[-1][0] or 0) + (per[-1][1] or 0) == 0 and not fin:
                    per = per[:-1]; brk = True
                g['feed'] = [x for x in g.get('feed', []) if not (str(x.get('k', '')).startswith('q') and '이 쿼터' in x.get('x', '') and ' 0:0 ' in x.get('x', ''))]
                for i, q in enumerate(per):
                    done = i < len(per) - 1 or fin or brk
                    if done and (i >= len(prevper) or not prevper[i][2:] or (prevper[i][0] or 0) + (prevper[i][1] or 0) == 0):
                        nm = f'{i+1}쿼터' if i < 4 else '연장'
                        cum = [sum(x[0] or 0 for x in per[:i+1]), sum(x[1] or 0 for x in per[:i+1])]
                        lead = H if cum[0] > cum[1] else A if cum[1] > cum[0] else None
                        feed_add(g, f'⏸ {nm} 종료 · 이 쿼터 {H} {q[0]}:{q[1]} {A} · 누적 {cum[0]}:{cum[1]}' + (f' ({lead} {abs(cum[0]-cum[1])}점 리드)' if lead else ' (동점)'), 'period', key=f'q{i}')
                g['_per'] = [q + ['d'] if (i < len(per) - 1 or fin or brk) else q for i, q in enumerate(per)]
                if ph is not None and (hs, as_) != (ph, pa) and not fin:
                    dh, da = hs - ph, as_ - pa
                    run = H if dh - da >= 7 else A if da - dh >= 7 else None
                    flip = (ph - pa) * (hs - as_) < 0
                    tag = '🔥 ' + run + f' {max(dh,da)}:{min(dh,da)} 몰아치기! ' if run else ''
                    tag += '🔄 역전! ' if flip else '🤝 동점! ' if hs == as_ else ''
                    feed_add(g, f"🏀 {g.get('stx','')} {g.get('clock','')} · {tag}{H} {hs}:{as_} {A} (득점 {H} +{dh} · {A} +{da})".replace('  ', ' '), 'run' if run or flip else 'score', key=f's{hs}-{as_}')
            elif sport == 'volleyball':
                prevn = g.get('_sets', 0)
                done = len(per) if fin else max(0, len(per) - 1)
                for i in range(prevn, done):
                    q = per[i]; w = H if q[0] > q[1] else A
                    sh = sum(1 for x in per[:i+1] if x[0] > x[1]); sa = sum(1 for x in per[:i+1] if x[1] > x[0])
                    feed_add(g, f'🏐 {i+1}세트 {w} 승리 {q[0]}:{q[1]} · 세트 스코어 {H} {sh}:{sa} {A}', 'period', key=f'set{i}')
                g['_sets'] = done
                if per and not fin:
                    cur = per[-1]; pc = g.get('_cur') or [0, 0]
                    dh, da = (cur[0] or 0) - pc[0], (cur[1] or 0) - pc[1]
                    if cur != pc and len(per) == g.get('_curn', 0) and dh >= 0 and da >= 0:
                        run = H if dh - da >= 4 else A if da - dh >= 4 else None
                        sh = sum(1 for x in per[:-1] if x[0] > x[1]); sa = sum(1 for x in per[:-1] if x[1] > x[0])
                        feed_add(g, f'🏐 {len(per)}세트 {H} {cur[0]}:{cur[1]} {A} (이번에 {dh}:{da} 득점 · 세트 {sh}:{sa})' + (f' · 🔥 {run} {max(dh,da)}:{min(dh,da)} 연속 득점' if run else '') + (' · 세트포인트!' if max(cur) >= 24 and abs(cur[0]-cur[1]) >= 1 and len(per) < 5 or max(cur) >= 14 and len(per) == 5 else ''), 'run' if run else 'score', key=f'c{len(per)}-{cur[0]}-{cur[1]}')
                    g['_cur'] = [cur[0] or 0, cur[1] or 0]; g['_curn'] = len(per)
            else:
                prevr = g.get('_inn') or []
                for i, q in enumerate(per):
                    for side, idx, nm in ((A, 1, '초'), (H, 0, '말')):
                        r = q[idx]
                        pr = prevr[i][idx] if i < len(prevr) and prevr[i][idx] is not None else 0
                        if r is not None and r > pr:
                            add = r - pr
                            feed_add(g, f'⚾ {i+1}회{nm} {side} 득점! +{add}점' + (f' (이번 회 {r}점)' if pr else '') + (f' · {H} {hs}:{as_} {A}' if prevr else ''), 'score', key=f'i{i}{idx}{r}')
                g['_inn'] = per
            if fin:
                if not g.get('finAt'):
                    g['finAt'] = NOW
                g['stx'] = '경기 종료'; g['clock'] = ''
                feed_add(g, f'🏁 경기 종료 · {H} {hs}:{as_} {A}', 'end', key='end')
            G[gid] = g
        sched[sport] = {'day': TODAY, 't': ts, 'ids': ids}
    except Exception as e:
        log.append(sport + ' ' + str(e)[:120])

LGK = {'Volleyball League': 'V리그 남자', 'Volleyball League Women': 'V리그 여자', 'WKBL W': 'WKBL', 'KBL': 'KBL', 'KBO': 'KBO'}
for g in G.values():
    g['lg'] = LGK.get(g.get('lg'), g.get('lg'))
games = [g for g in G.values() if keep(g)]
games.sort(key=lambda g: (not g.get('live'), g.get('fin', False), g.get('t', 0)))
out = {'at': dt.datetime.utcfromtimestamp(NOW).isoformat() + 'Z', 'games': games, 'calls': calls, 'last': last, 'sched': sched, 'log': log[-10:]}
os.makedirs('out', exist_ok=True)
json.dump(out, open('out/live.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print('games', len(games), 'live', sum(1 for g in games if g.get('live')), 'calls', calls, 'log', log[-3:])
