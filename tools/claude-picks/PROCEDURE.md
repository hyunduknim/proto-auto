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
3. Window: games starting between now+1 h and now+26 h that are not already picked in an earlier post (validate.cjs warns).
   Focus on EPL, 분데스, 라리가, 세리에A, 리그1, UCL/UEL/UECL, K리그, J리그, NBA, plus MLB/KBO postseason when listed.
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
