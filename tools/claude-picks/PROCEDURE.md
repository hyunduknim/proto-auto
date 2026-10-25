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

## Steps
1. Repo: `/home/claude/proto-auto` (clone `hyunduknim/proto-auto` if it is missing). Work in a scratch directory.
2. Slate + own record:
   `tools/claude-picks/snap.sh "slate&h=30" > slate.json`
   - `slate[]`: `d,t` (KST date/time), `sp` sport, `lg` league, `h/a` teams.
   - `mk[]`: `[no, family, line, [[label, betmanOdds]...], overseasProbs, overseasLine]`. `overseasProbs` comes from
     Pinnacle and other sharp books when available.
   - `site`: the site's own pick. `rest`: days since the last game (`r649`; under 3.5 = 휴식 부족). `inj`: NBA key players
     Out/doubtful. `rot`: missing regulars (only about 1 h before kick-off).
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
   - basketball: NBA, KBL, WKBL;
   - volleyball: V-리그 남녀 and KOVO컵;
   - baseball: KBO, NPB, MLB.

   Domestic games (KBL/WKBL/KOVO/K리그/KBO) usually have no overseas probability. Use these instead:
   - Betman's implied probability;
   - `form` in the slate: `[w, d, l, n, avgGF, avgGA, homeRecord, awayRecord]` per team;
   - rest days and the site's pick;
   - WebSearch team news (foreign players, injuries). Don't scrape the KBL/KOVO/Naver pages.

   Pick a domestic game only when the form gap is clear (for example 4-1 vs 1-4 with a goal/point gap) and the price is
   fair. One or two good domestic picks are better than none, but never pad.
4. Evidence per candidate game:
   - Compare the overseas probability with the Betman implied probability. The overround is about 1.08–1.12, so EV is
     usually below 1.
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
   - No soccer 언더 ≤2.5.
   - Minimum odds 1.20. Usually 4–8 picks; fewer is fine. Never pad.
   - At most one pick per game. Groups are `안정형` (확률 우선) and `가치형` (일정 피로 · 결장 · 시장 오차).
   - NBA: mix 일반승 / 핸디 / 언오버 (compare all three per game, pick the best). Put the type in the label, e.g. "[핸디] 올랜도 +2.5 승".
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
    "groups":[{"name":"안정형","note":"확률 우선","picks":[{"gmTs":"260127","no":123,"pick":"승","label":"라치오 승","odds":1.31,"why":"해외 68%, Forebet 67%"}]}],
    "combos":[{"name":"안정","gmTs":"260127","nos":[123,456],"odds":1.85}],
    "cautions":["..."],"passes":["..."]}
   ```
   - `pick` is the Betman choice label: 승 / 무 / 패 / 오버 / 언더. For a handicap, 승/패 refers to the home side with
     the market's line. Example: line -2, 패 = the home team does not win by 2+. Check the label against `mk`.
   - `id` sorts newest first. Use the date of the first game plus a suffix.
7. Publish: `tools/claude-picks/publish.sh post.json slate.json`. It validates and stops on errors: fix them and run again.
8. Tell 형님 in one short message (SendUserMessage): the picks table (경기 · 픽 · 배당 · 한 줄 근거), cautions, and the
   record so far. Mention that it is on the 🤖 클로드추천 tab.

## NBA 결장 체크 (two daily runs: about 00:45 KST and 06:45 KST)
The owner asked for a daily NBA absence check posted on 클로드추천 ("매일해줘서 클로드추천에 넣어주면 좋겟는데"), and also
for the early-morning games ("새벽에도 NBA 하는데"). Each run covers a tip-off window given in its prompt:
- night run (about 00:45): games tipping off from 01:00 to 07:30 KST (weekend and holiday afternoon games in the US);
- morning run (about 06:45): games tipping off from 07:30 to 14:00 KST (the usual evening games in the US).
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

   **Read every candidate game's ESPN injuries first.** Never back a side whose key player is Out. (On 10/24 #92
   골든스테이트 승 was picked although Butler, Porzingis and Moody were Out.)
   Put the type in the label: "[일반승] 골든스테이트 승", "[핸디] 올랜도 +2.5 승", "[언오버] 레이커스-클리퍼스 언더 228.5".
   3–4 NBA picks a day in total across the night and morning runs and the daily analysis, one per game; skip games with
   no edge. Groups are 안정형 and 가치형.
4. Write a post with `"kind":"injury"`. The night run uses `"id":"YYYY-MM-DD-y-nba-injury"` and
   `"title":"M/D 새벽 NBA 결장 체크"`. The morning run uses `"id":"YYYY-MM-DD-z-nba-injury"` and
   `"title":"M/D 아침 NBA 결장 체크"`. In both, the date is today's KST date.
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
