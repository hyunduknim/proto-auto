# 🤖 클로드추천 — daily analysis procedure

The owner (call him 형님, always 존댓말) asked for Claude's own daily analysis to be posted on the site
("이걸 갖다가 매일 사이트에 올려줘 조합대신에 이게 낫겟다 메뉴이름은 클로드추천"). This is independent of the site's
automatic marking. Hit rate comes first. The Worker (R662) reads `picks.json` from the `claude-picks` branch every
5 minutes, shows it on the 🤖 클로드추천 tab, and settles every pick automatically from the official score.

## Rules
- Never ask for or print API keys or tokens. Everything here is read-only except the push to `claude-picks`.
- Don't scrape sites against their terms (rotowire, flashscore, KBL/KOVO official sites, Naver). WebSearch / WebFetch of
  public prediction pages (Forebet etc.) and the ESPN public API through `snap.sh` are fine.
- Do not change `자동마킹.js` or push to `main` from the daily run.
- No Telegram messages for 클로드추천.

## 🧠 GPT추천 posts (R698)
## 🤖 클로드 분석 (purple, ana.json) — 숫자 계산 방식 (R916, owner 11/16)
Owner 11/16: "클로드분석은 클로드자체분석인데 좀 다르게 분석을 해줬으면 하는데 이때까지는 똑같이 분석하는듯한데? 쫌 다른방식으로 분석해보고 추천픽 만들어줘".
🤖 클로드추천 is a judgement read (news, form, matchup, hit-rate first). 🤖 클로드 분석 must be built a DIFFERENT way — from numbers only:
1. Expected score from the season numbers, 70% season + 30% last 5 games, home edge included:
   - soccer: home goals = (home team's goals scored per game at home) × (away team's goals conceded per game away) ÷ league average; away likewise
     (use all games when a side has fewer than 4 home/away games). Turn the two expected goals into a Poisson score grid → 승·무·패, each
     handicap line, each 언오버 line.
   - basketball: expected points = pace × (own offence + opponent defence) ÷ 200 per side (slate `sh`/`form`, or points for/against per game);
     margin spread 12 (NBA) / 11 (KBL·WKBL), total spread 18 / 15 → 일반승, 핸디, 언오버 by the normal curve.
   - volleyball: each side's set-win rate this season (home +4%p) → match result and set handicap by counting 3-0/3-1/3-2 outcomes; point totals
     from average points per set × expected sets.
   - baseball: runs for/against per game → Poisson.
2. Only hard facts move the numbers: a confirmed absence of one of a team's top two players → that side −8% expected score (soccer: −0.15 goals).
   No story-telling about motivation or "분위기".
3. Then the Betman price: implied chance = (1/odds) ÷ (sum of 1/odds of that market). Edge = model chance − implied chance.
4. Best market (`b`) = the highest model chance among markets with edge ≥ +3%p and odds ≥ 1.31. If none has +3%p, take the highest model chance and
   start `why` with "가치 없음 ·".
5. `why` gives the numbers, in plain words, e.g. "숫자 계산: 예상 스코어 1.7 : 0.9 · 오버 2.5 57% (배당 기준 52%, +5%p) · 최근 5경기 30% 반영".
   Each m entry's `p` is the model chance. Balance comes from the numbers; do not tilt 언더 or 오버 by feel.

Posts with `"by":"gemini"` are old Gemini picks (the 💎 menu was removed 11/16, owner "아예빼도록"); ignore them. Do not make new ones.

Posts with `"by":"gpt"` in picks.json are ChatGPT's picks that 형님 pasted in chat; Claude only mapped them to Betman numbers.
When mapping a GPT 저녁 분석 (17:00 run), only enter games that start by 05:00 KST the next morning; later games are left out (owner, 10/30).
They are not 클로드추천: ignore them when checking "already picked", when counting the day's NBA picks and when writing 낙첨 복기.
Pick independently; a game GPT also picked is fine (the site marks agreement with 🤝).

## Steps
1. Repo: `/home/claude/proto-auto` (clone `hyunduknim/proto-auto` if it is missing). Work in a scratch directory.
2. Slate + own record:
   `tools/claude-picks/snap.sh "slate&h=30" > slate.json`
   - `slate[]`: `d,t` (KST date/time), `sp` sport, `lg` league, `h/a` teams.
   - `mk[]`: `[no, family, line, [[label, betmanOdds]...], overseasProbs, overseasLine]`. `overseasProbs` comes from
     Pinnacle and other sharp books when available.
   - `site`: the site's own pick. `rest`: days since the last game (`r649`; under 3.5 = 휴식 부족). `inj`: NBA key players
     Out/doubtful. `rot`: missing regulars (only about 1 h before kick-off).
   - `af` also carries (R778, owner's paid plan — USE THEM, they are the reason it was bought):
     `keyOut.h/.a` = REGULARS (60%+ starts) out, or missing from the published XI when `keyOut.xi` is true;
     `pred` = API-Football's own 1X2 chances {h,d,a} (null when it is only a template like 10/45/45 — then ignore it); `xg` = goals expected from home/away averages {h,a}; `form` = last 5 (W/D/L);
     `lineupMiss` = regulars missing in the ESPN lineup check (~80 min before). Never back a side that misses clearly more regulars
     than the other (the owner was angry when a 플핸 went to the weakened team). For 언오버 compare `xg.h+xg.a` with the line.
     For 일반승/핸디 compare `pred` with Pinnacle and Betman. Say in `why` which of these you used.
   - `af` (soccer, R768, from the owner's paid API-Football plan): `h`/`a` = players out, each "name(이유)" — 이유 is 부상 / 경고 누적 / 퇴장 징계 / 징계 / 명단 제외 …, a trailing `?` = doubtful; `xi` = starting XI already published. Use it as the main soccer 결장 source: never back a side missing key starters, and say who is out in `why`.
   - `rec`: the 클로드추천 record so far (`sum`) and recent settled picks. Read it: learn from the misses.
2b. **낙첨 복기 first** (owner: "클로드추천을 낙첨복기로 참고하고 분발해야될듯").
   - `rec.needReview` lists the 클로드추천 misses that have no review yet; `rec.recent` holds
     `[post, group, label, odds, status, score, key, why, review]`.
   - For each new miss, write one honest line that says what was missed and the lesson: the real cause (absence,
     draw, a stale overseas probability, a blow-out, pure variance) and what to do differently.
   - Put the lines in `post.json` as `"reviews": {"<key>": "…"}`. publish.sh merges them, and they show on the pick and
     in the 🔁 복기 tab (🤖 클로드추천).
   - With no new post, publish a file holding only `{"reviews": {...}}`.
   - Read all reviews before picking, and don't repeat a pattern that keeps missing.
3. Window: games starting between now+1 h and now+26 h that are not already picked in an earlier post (validate.cjs warns).
   Cover **every sport Betman lists**, not only soccer and NBA (owner: "축구 농구뿐만 아니라 좋아보이는 경기까지 국내것도 해줘"):
   - soccer: EPL, 분데스, 라리가, 세리에A, 리그1, UCL/UEL/UECL, K리그1·2, J리그, A리그, MLS and others;
   - basketball: KBL, WKBL (NBA is handled only by the 07:00 NBA run below);
   - volleyball: V-리그 남녀 and KOVO컵;
   - baseball: KBO, NPB, MLB.

   Domestic games (KBL/WKBL/KOVO/K리그/KBO) usually have no overseas probability. Use these instead:
   - `form` in the slate: `[w, d, l, n, avgGF, avgGA, homeRecord, awayRecord]` per team;
   - rest days and the site's pick;
   - WebSearch team news (foreign players, injuries). Don't scrape the KBL/KOVO/Naver pages.

   Pick a domestic game only when the form gap is clear (for example 4-1 vs 1-4 with a goal/point gap) and the price is
   fair. One or two good domestic picks are better than none, but never pad.
4. OWN ANALYSIS FIRST (owner 11/12 and again 11/13: "클로드추천은 적중률 배당 말고 클로드자체분석으로 픽을 주는걸로 해줘").
   🤖 클로드추천 is Claude's own read of the game, not a copy of the odds or of the site's 적중률:
   - First judge each game WITHOUT any odds, odds-implied probability, Pinnacle number or the site's 적중률/marking:
     season record and standing, recent form, home/away, scoring and conceding, pace, head-to-head, rest and travel,
     injuries and lineups, motivation, matchup. Write down your own chance (%) per market and 2–3 game reasons.
   - Only then open the Betman odds, for three things only: the 1.31 minimum, which line is on offer, and a sanity
     check (15+ points away from the odds → re-check for something missed, then explain the disagreement or pass).
   - Never pick a side because it is the short-priced favorite, because Pinnacle/overseas odds lean that way, or because
     the site marked it. `why` must give game reasons ("최근 5경기 4승, 상대 주전 센터 결장"), never "해외 68%" or
     "피나클 …" or "사이트 적중률 …". The 확률 in each pick is Claude's own number.
   Evidence sources (game facts, not prices):
   - Forebet league pages via WebFetch.
   - NBA: the ESPN summary `predictor` (BPI) and injuries. Find the event id with
     `snap.sh "no=1" "site/v2/sports/basketball/nba/scoreboard?dates=YYYYMMDD" . >/dev/null` (writes `espn_0.json`; read it with `zcat -f`), then
     `snap.sh "no=1" "site/v2/sports/basketball/nba/summary?event=ID|..." . >/dev/null` (up to 20 paths, `espn_<i>.json`).
   - Fixture congestion: midweek European games followed by the weekend. Use WebSearch for team news, rotation and
     injuries.
5. Pick discipline (from the site's record):
   - Soccer 일반승 favorites lose mostly to draws. Prefer 핸디 -1/-2 패 (favorite by ≤1), 플핸 +1/+2, or a draw-proof
     market when a draw is likely.
   - No 유럽대항전 일반승 favorites (46% historically).
   - No soccer 언더 1.5 or lower. 언더 2.5 is allowed again (owner: "2.5언더 살려야되겟다 다 빼는게 아니엿네") when both teams' recent games are low-scoring and no attacking absences point the other way.
   - Minimum odds 1.31 (owner rule from round 131: no 클로드·GPT·피나클 pick below 1.31; publish.sh rejects it). Usually 4–8 picks; fewer is fine. Never pad.
   - At most one pick per game. Groups are `안정형` (확률 우선) and `가치형` (일정 피로 · 결장 · 시장 오차).
   - NBA: mix 일반승 / 핸디 / 언오버 (compare all three per game, pick the best). Put the type in the label, e.g. "[핸디] 올랜도 +2.5 플러스 핸디캡".
   - **R1007 (owner 11/25 15:04–15:09 "농구는 맨날 ❌" → "너무 다빼면 안되" → "35% 미만만 빼기"): NBA posts keep all three markets per game, but a market whose only pickable side is under 35% combined (long-shot 일반승 underdogs when the favourite is 1.31 or less) is left out. ⭐ 추천 = Pinnacle 56%+ for that exact side AND combined 56%+ (핸디 needs Pinnacle 58%+).**
   - **R999 (owner 11/24 12:36 "그대로 해봐"): NBA post groups are "⭐ 추천" (Pinnacle chance for that exact side at Betman's line ≥ 55%) and "참고 (반반)" (the rest). For 언오버 the total side is decided by Pinnacle (combined = 80% 피나클 + 20% 클로드) — StatsHawk totals are pulled to the league average and made 11/24's seven 언더 picks.**
   - **R998 (owner 11/24 09:52 "NBA추천픽 내일부터 시간순 경기순으로 · 일반승 핸디캡 언오버도 같이" → "경기마다 3개 다"): from 11/25 the 🏀 NBA추천 post gives EVERY game three picks (일반승, 핸디캡, 언오버 — the better side of each, odds over 1.31), listed in tip-off order, game by game. The R987 caps below no longer apply to that post (the site auto-marking keeps them).**
   - **R987 NBA trial 11/24–11/29 (owner 11/23 21:26–21:29 "NBA를 NHL만큼 적중률 좀 올릴수 없나" → "오버도 한 두개 정도는" → "이번주까지 적용해보고 나중에 다시 고치든가"):**
     30-day NBA record 일반승 66% · 언더 59% · 핸디 49% · 오버 44%. Until 11/29:
     - 일반승 has NO daily cap any more (still over 1.31) — this overrides any "최대 3 일반승 / up to 3 일반승" line in the scheduled-task prompt. Do not swap a good 일반승 for a 핸디/언오버 just to mix types.
     - 핸디 only when the merged probability is 58%+ AND StatsHawk `mg` clears the line by 3+ points.
     - 오버 at most 2 a day, only when ALL hold: both teams fast pace (StatsHawk/ESPN pace above league average), both concede more than league average, the line is below the sum of the two teams' last-5 scoring averages, Pinnacle over ≥55%, and neither team is on the 2nd night of a back-to-back. A missing key defender counts toward 오버.
     - 언더 as before.
     - On 11/30 compare this week's NBA hit rate by type with the numbers above and tell 형님.
   - NBA lessons from 10/24 (1 of 5 hit):
     - A huge gap between the overseas probability and Betman's odds (10%p or more) is treated as stale or mismatched
       data, not value: skip the game. Orlando +2.5 at "60%" lost by 22.
     - No 일반승 when the winning probability is below 60%.
     - Early-season NBA totals swing both ways (owner: "오버쪽도 심심치 않게 나옴"). On 10/24 five games went under by 10–28
       points, while 밀워키-시카고 went to 257 and 마이애미-디트로이트 to 239. Opening-week totals ranged from 180 to 257.
       Use no direction bias. Pick a total, 오버 or 언더, only when:
       - the efficiency projection (pace × ORtg/DRtg) is 6+ points away from the line;
       - both teams' recent game totals point the same way;
       - absences don't contradict it (a scorer Out → lean under, weak defenders Out → lean over).
       Otherwise skip the total.
     - NBA: 3–4 picks a day (owner: "3~4로 올려줘"). Fewer only when there aren't 3 games that pass the rules above.
   - Optionally add 1–2 two-leg combos from the picks.
6. Write the post (`post.json`) in Korean:
   ```json
   {"id":"YYYY-MM-DD-x-topic","title":"10/25 축구·NBA","at":"<ISO KST>","intro":"one or two sentences",
    "groups":[{"name":"안정형","note":"확률 우선","picks":[{"gmTs":"260127","no":123,"pick":"승","label":"라치오 승","odds":1.31,"why":"최근 5경기 4승 1패, 상대 주전 공격수 2명 결장"}]}],
    "combos":[{"name":"안정","gmTs":"260127","nos":[123,456],"odds":1.85}],
    "cautions":["..."],"passes":["..."]}
   ```
   - `pick` is the Betman choice label: 승 / 무 / 패 / 오버 / 언더. For a handicap, 승/패 refers to the home side with
     the market's line. Example: line -2, 패 = the home team does not win by 2+. Check the label against `mk`.
   - `id` sorts newest first. Use the date of the first game plus a suffix.
7. Publish: `tools/claude-picks/publish.sh post.json slate.json`. It validates and stops on errors: fix them and run again.
8. Tell 형님 in one short message (SendUserMessage): the picks table (경기 · 픽 · 배당 · 한 줄 근거), cautions, and the
   record so far. Mention that it is on the 🤖 클로드추천 tab.

## NBA 결장 체크 (one run a day, about 06:52 KST)
The owner asked for a daily NBA absence check posted on 클로드추천 ("매일해줘서 클로드추천에 넣어주면 좋겟는데"). After a week
he saw no early-morning NBA games and moved the run to 07:00 ("NBA 새벽시간은 없는듯하다 8시에 시작되니 매일 오전7시로 변경").
- The run (about 06:52, post up around 07:00) covers every NBA game tipping off from 07:15 to 14:00 KST and is the only NBA
  pick run. Most statuses are decided by then; mark a still-doubtful key player "(경기 전 확인)".
1. `tools/claude-picks/snap.sh "slate&h=9" > slate.json`. Keep the NBA games (`sp` 농구, `lg` NBA) whose KST tip-off
   time is inside this run's window. If there are none, stop: publish nothing and send nothing. `inj` shows what the site itself has detected (key players Out = `h`/`a`, doubtful = `hq`/`aq`). `site` shows
   the site's pick and grade; a 추천 backing a team with a key player Out is dropped to 일반 automatically.
2. Current posts: `gh api -H "Accept: application/vnd.github.raw" "repos/hyunduknim/proto-auto/contents/picks.json?ref=claude-picks"`.
   Find the earlier 클로드추천 picks on today's NBA games.
3. ESPN, for each game: get the event ids from the scoreboard for the US date(s), then read the summaries with `snap.sh`
   (see step 4 above). From each summary read `injuries` (Out / Doubtful / Questionable / Day-To-Day) and `leaders` (the
   team's key players), plus `predictor` (BPI). WebSearch the latest injury news only when it is unclear.
   **Keep it short (owner: "핵심만 간단히", "세줄까지 괜찮음"):** `intro` is one short sentence. `cautions` has at most
   3 lines in total, and only the absences that matter: key players Out or doubtful, and affected 클로드추천 picks.
   Example: "보스턴: 테이텀 결장 → 기존 #57 주의". Games with nothing notable go into one `passes` line, or are left out.
   The site shows these posts in large text.
3b. **NBA 추천 mix (owner: "NBA 일반승 핸디캡 언오버를 섞어서 추천"):** in the same post, add picks for this window's NBA
   games that have no 클로드추천 pick yet. For each game, compare all three markets (일반승, 핸디, 언오버) and take the one
   with the best overseas probability and value. Mix the types across the day instead of all 일반승. Inputs:
   - overseas probabilities in `mk`;
   - the ESPN predictor;
   - absences;
   - for totals, the site's efficiency projection (pace × ORtg/DRtg, shown as "효율 기준 예상" on the card).
   - **StatsHawk team numbers, every game (owner 11/6: "써서 다시 재분석해줘 안썼다는게 놀랍네"):** the slate `sh` field gives the
     expected score from StatsHawk 공격·수비 효율 and 경기 속도 (`ph`:`pa`, total `t`, margin `mg` = home − away, `n` = games
     played, `ko` = key players out). Compare `t` with the 언오버 line and `mg` with the 핸디 line for every game, and quote it in
     the 근거 (e.g. "스탯호크 예상 113:110, 합 223 → 언더 231.5 쪽"). With `sh` null (team not matched), say "팀 기록 없음".
     The site's own marking blends the same projection in at 20%.

   **Read every candidate game's ESPN injuries first.** Never back a side whose key player is Out. (On 10/24 #92
   골든스테이트 승 was picked although Butler, Porzingis and Moody were Out.)
   Put the type in the label: "[일반승] 골든스테이트 승", "[핸디] 올랜도 +2.5 플러스 핸디캡", "[언오버] 레이커스-클리퍼스 언더 228.5".
   3–4 NBA picks a day, all in the 07:00 run, one per game; skip games with
   no edge. Groups are 안정형 and 가치형.
4. Write a post with `"kind":"injury"`. It uses `"id":"YYYY-MM-DD-y-nba-injury"` and
   `"title":"M/D NBA 결장 체크·추천"`, with today's KST date.
   - `cautions`: one line per game that has notable absences. Example: "보스턴-뉴욕: 보스턴 테이텀(Out), 뉴욕 없음 →
     보스턴 공격 약화". Mark the game with "⚠ 기존 클로드추천 #no 영향" when an earlier pick is affected, saying whether the
     pick still holds. Earlier picks stay on the record; never delete them.
   - `passes`: games with no notable absences, in one or two lines.
   - `groups`: 0–3 new NBA picks only, for games not picked yet, where an absence makes a side clearly better or worse
     than its Betman odds. Picks follow the same rules as above. No picks at all is fine.
   - `intro`: how many games were checked, and whether the site's own check flagged anything.
5. Publish with `publish.sh post.json slate.json`. A notes-only post (no picks) is allowed.
6. Send 형님 a short SendUserMessage: the key absences, any affected 클로드추천 picks, new picks, and a pointer to the
   🤖 클로드추천 tab.

## 🎲 역배후보 (R951, owner 11/20 21:19 "역배후보 만들어봐 · 모든종목 다 포함")
Every Claude run (새벽 해외축구, 아침 NBA, 평일·주말 국내경기) ends with this step, for the games in that run's own window (the 아침 NBA run also looks at NHL games in its window).
- Underdog = the side Betman prices at 2.20 or more on 일반승 (or a 플핸 at 2.00+ that only needs the underdog not to lose by much). Owner 11/22 09:19 "왜 역배후보는 아직까지 없음? 만들어줘": aim for ONE pick every run — the single best underdog in the window that clears the bar below. Post nothing only when no underdog has any concrete reason.
- R984 (owner 11/23 11:47 "역배후보 하루에 1~3개까지 만들어줘"): 1 to 3 underdog picks per KST day across all runs. Before posting, count today's posts whose id contains "-upset-" in picks.json: 3 already → post nothing. Each run posts at most 1. The day's LAST run (평일 국내 17:38, 주말 국내 12:38) must make sure the day has at least 1: if none was posted yet today, post the best underdog in its window even when the edge is only ≥ 1.5%p, as long as there is a concrete game reason; say "(오늘 최소 1개 · 기준 완화)" at the end of why.
- Own chance first: from the game reasons only (결장 on the favourite, back-to-back or fixture congestion, motivation gap, the underdog's recent form and home record, matchup), write your own chance for the underdog WITHOUT looking at odds.
- Then compare with the odds: implied = 1 / Betman odds. Pick when own chance − implied (Betman, margin removed) ≥ 3%p AND there is at least one concrete game reason (a named absent player, rest-day gap, etc.). "Odds look high" is never a reason.
- The underdog pick may be in a game already picked in the main post (validate.cjs only warns).
- Post: id "YYYY-MM-DD-upset-<slot>" with slot n (해외축구), a (NBA/NHL), k (평일 국내), b (주말 국내); title "M/D 🎲 역배후보"; one group "역배"; 확률 = own chance; why = "클로드 NN% vs 배당 NN% (+N%p) · " + the concrete reasons. Publish with tools/claude-picks/publish.sh like any post. It shows on the site's 🎲 역배후보 tab with its own record (kept out of the main Claude record) and gets Telegram alerts.

## 핸디캡 이름 쓰는 법 (R957, owner 11/21 02:05 "핸디캡에 마이너스 패는 상대팀 플핸으로 고쳐 헷깔리게 하지말고")
**R1014 (owner 11/26 06:36 "핸디캡을 제대로 적어줘 -1 마이너스 핸디캡 +1 플러스 핸디캡"):** write handicap labels as "[핸디] <team> -1 마이너스 핸디캡" / "[핸디] <team> +3.5 플러스 핸디캡" (never end a handicap label with 승/패; a 3-way 무 is "[핸디] <home> -1 무승부"). The site rewrites old "[핸디] X +N 승" labels the same way.
Write every handicap label from the side that WINS the bet: "<home> -3 패" is written "<away> +3 승", "<home> +1 패" is written "<away> -1 승". Keep "pick" and "line" exactly as Betman has them (pick "패", the home line) — only the label text changes. The site also rewrites old labels this way.


## ⚽ R991 해외축구 trial 11/24–11/29 (owner 11/24 00:25 "축구도 신경 좀 써줘 NBA처럼")

**R1008 (owner 11/25 20:29 "해외축구도 하키처럼 피나클로 하나?" → "1,2번 섞어서 최적으로 맞춰줘 대신 경기를 너무 줄이지는 말고"):** Claude's own soccer numbers ran high (핸디 said 63% → hit 50%; 일반승 said 54% → hit 38%). From 11/26 the hourly soccer post uses combined = 60% Pinnacle + 40% Claude; pick at combined 57%+ AND Pinnacle 54%+ for the same side (핸디 Pinnacle 56%+; UCL/에레디비시 combined 60%+); opposite sides → pass; no Pinnacle number → own view 62%+. Why starts "피나클 NN% · 클로드 NN% → NN% · ".
**R1013 (owner 11/26 06:24 "확률 위주로 가자 하키처럼 적중률 70이상 가보자"):** soccer picks need the Pinnacle chance for that exact side at Betman's line: 일반승 62%+ · 오버 63%+ · 언더 67%+ · 핸디(3-way) 66%+ (UCL/에레디비시 +2), plus Claude's own 55%+ for the same side; no Pinnacle → no pick. NBA ⭐ needs Pinnacle 63%+ (핸디 65%+) and Claude 55%+. Check on 11/26's slate: 9 of 40 foreign soccer games qualified.
**R1012 (owner 11/26 06:20–06:21 "바꿔줘" → "제한은 없애자 모든제한해제"):** no daily count limits for soccer 언더/오버/플핸 picks (the old 3-언더, 2-오버, 2-플핸 caps are gone); probability bars stay. Pinnacle 58%+ 오버 2.5 hit 68% vs 언더 2.5 61% on 7,300 European games, so when Pinnacle is 58%+ an 오버 only needs no main striker/creator out.
**R1008b (owner 11/25 20:31 "너무 언더위주로도 가지말고"):** at most 3 soccer 언더 picks a day; 언더 2.5 needs combined 60%+; within 3 points prefer the other market.
30-day foreign soccer record (site auto picks): 일반승 65% · 언더 61% · 핸디 56% · 오버 53%; worst leagues UCL 36%, 에레디비시 42%.
- Picks go up about one hour before each kickoff (hourly runs), so use the announced starting lineups when they are out (ESPN match page / team news). A key player missing from the lineup → re-check the pick or pass.
- 일반승 is fine when the favourite is clear and the draw risk is low; do not swap a good 일반승 for a 핸디/언오버 just to mix types.
- 핸디 only at 58%+ own chance. 오버 at most 2 a day, only at 56%+ with both teams scoring and conceding freely in their last 5 and no attacking absences.
- UCL and 에레디비시: pick only at 60%+; otherwise pass.
- Each hourly run posts with the SAME daily id "YYYY-MM-DD-n-soccer" and `"merge": true` in post.json, so publish.sh adds the new picks to the day's post instead of replacing it.
- On 11/30 compare this week's soccer hit rate by type with the numbers above.


## 📊 R1000 확률 보정 (owner 11/24 12:57-12:58 "더 좋은 방법이 없나?" → "메뉴에 보이게 만들어줘")
Every Claude run, before picking: `tools/claude-picks/snap.sh pub > pub.json` and group the graded picks in `pub.r662.posts` (st hit/miss)
by sport (농구/배구/축구) and type (일반승 · 핸디 · 언더 · 오버). For any group with 5+ graded picks whose actual hit rate is more than
5%p BELOW the average 확률 Claude claimed, require 5%p more own/combined chance for that type in this run (and say so in one line of the
post's cautions, e.g. "농구 언더는 최근 25% 적중이라 기준 +5%p"). The site shows the same table under 🔥 배당 급변 · 경기 전 점검.
Also look at `pub.r1000.steam` (🔥 Pinnacle moved, Betman did not): such a side is a strong candidate — mention "🔥 피나클 급변" in its why.
