// R952 (owner 11/20 21:29 "경기분석에는 자동마킹 없는경기엔 클로드자체분석 전부 다 넣어줘")
// usage: node fill_ana.cjs <slate.json> <picks.json>
// Fills picks.json "ana" (🤖 클로드 분석 · 숫자 계산) for EVERY upcoming game the site passes on (no site pick or under its bar)
// that has no Claude pick and no analysis yet, using the numbers-only method in PROCEDURE.md (expected score → Poisson /
// normal curve → edge vs Betman). Entries written by a Claude run are never overwritten. Prints how many it added.
const fs = require('fs');
const [sf, pf] = process.argv.slice(2);
const S = JSON.parse(fs.readFileSync(sf, 'utf8'));
const C = JSON.parse(fs.readFileSync(pf, 'utf8'));
const ana = C.ana || (C.ana = {});
const gm = String(S.gmTs);
const picked = new Set();
for (const p of C.posts || []) if (p.by !== 'gpt' && p.by !== 'gemini') for (const g of p.groups || []) for (const x of g.picks || []) picked.add(String(x.gmTs) + ':' + Number(x.no));
const nowMs = Date.parse(S.now || new Date().toISOString());
const kst = (d, t) => Date.parse(d + 'T' + (t || '00:00') + ':00+09:00');

const fact = [1]; for (let i = 1; i < 15; i++) fact[i] = fact[i - 1] * i;
const pois = (l, k) => Math.exp(-l) * Math.pow(l, k) / fact[k];
const ncdf = z => { const t = 1 / (1 + 0.2316419 * Math.abs(z)); const d = 0.3989423 * Math.exp(-z * z / 2); const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274)))); return z > 0 ? 1 - p : p; };
const r2 = v => Math.round(v * 100) / 100, pc = v => Math.round(v * 100);
const fmtL = l => (l > 0 ? '+' : '') + l;

function soccerModel(x) {
  const fh = x.form && x.form.h, fa = x.form && x.form.a; if (!fh || !fa) return null;
  let lh = (fh[4] + fa[5]) / 2 + 0.15, la = (fa[4] + fh[5]) / 2 - 0.1;
  const xg = x.af && x.af.xg; if (xg && xg.h != null && xg.a != null) { lh = 0.5 * lh + 0.5 * xg.h; la = 0.5 * la + 0.5 * xg.a; }
  const ko = x.af && x.af.keyOut; if (ko) { lh -= 0.15 * Math.min(2, (ko.h || []).length); la -= 0.15 * Math.min(2, (ko.a || []).length); }
  lh = Math.max(0.25, Math.min(4, lh)); la = Math.max(0.2, Math.min(3.5, la));
  // R992: Dixon-Coles low-score correction (rho fitted on 7,253 European games with Pinnacle closing odds,
  // tools/claude-picks/soccer_backtest.cjs → -0.075; draw chance 23.2% → 24.8%, Pinnacle 24.8%, actual 25.7%)
  const RHO = -0.075, tau = (i, j) => i === 0 && j === 0 ? 1 - lh * la * RHO : i === 0 && j === 1 ? 1 + lh * RHO : i === 1 && j === 0 ? 1 + la * RHO : i === 1 && j === 1 ? 1 - RHO : 1;
  const grid = []; for (let i = 0; i < 11; i++) for (let j = 0; j < 11; j++) grid.push([i, j, pois(lh, i) * pois(la, j) * tau(i, j)]);
  const tot = grid.reduce((s, g) => s + g[2], 0);
  const P = f => grid.reduce((s, g) => s + (f(g[0], g[1]) ? g[2] : 0), 0) / tot;
  return {
    txt: '예상 스코어 ' + lh.toFixed(1) + ' : ' + la.toFixed(1),
    ml: { 승: P((i, j) => i > j), 무: P((i, j) => i === j), 패: P((i, j) => i < j) },
    hc: l => Number.isInteger(l) ? { 승: P((i, j) => i - j + l > 0), 무: P((i, j) => i - j + l === 0), 패: P((i, j) => i - j + l < 0) } : { 승: P((i, j) => i - j + l > 0), 패: P((i, j) => i - j + l < 0) },
    tt: l => ({ 오버: P((i, j) => i + j > l), 언더: P((i, j) => i + j < l) })
  };
}
function bballModel(x) {
  let ph, pa;
  const pj = x.stats && x.stats.proj, sh = x.sh;
  if (pj && pj.h) { ph = pj.h; pa = pj.a; if (sh && sh.ph) { ph = (ph + sh.ph) / 2; pa = (pa + sh.pa) / 2; } }
  else if (sh && sh.ph) { ph = sh.ph; pa = sh.pa; }
  else { const fh = x.form && x.form.h, fa = x.form && x.form.a; if (!fh || !fa) return null; ph = (fh[4] + fa[5]) / 2 + 1.5; pa = (fa[4] + fh[5]) / 2 - 1.5; }
  const nba = /NBA/.test(x.lg), sdM = nba ? 12 : 11, sdT = nba ? 18 : 15, mar = ph - pa, T = ph + pa;
  const pW = ncdf(mar / sdM);
  return {
    txt: '예상 점수 ' + ph.toFixed(0) + ' : ' + pa.toFixed(0),
    ml: { 승: pW, 패: 1 - pW },
    hc: l => { const p = ncdf((mar + l) / sdM); return { 승: p, 패: 1 - p }; },
    tt: l => { const p = 1 - ncdf((l - T) / sdT); return { 오버: p, 언더: 1 - p }; }
  };
}
function vbModel(x) {
  const fh = x.form && x.form.h, fa = x.form && x.form.a; if (!fh || !fa || !fh[3] || !fa[3]) return null;
  const wr = f => (f[0] + 1) / (f[3] + 2);
  let pm = Math.max(0.1, Math.min(0.9, 0.5 + (wr(fh) - wr(fa)) / 2 + 0.04));
  // per-set chance q that gives match chance pm
  const match = q => q ** 3 * (1 + 3 * (1 - q) + 6 * (1 - q) ** 2);
  let lo = 0.05, hi = 0.95; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (match(m) < pm) lo = m; else hi = m; }
  const q = (lo + hi) / 2, r = 1 - q;
  const out = { '3-0': q ** 3, '3-1': 3 * q ** 3 * r, '3-2': 6 * q ** 3 * r * r, '0-3': r ** 3, '1-3': 3 * r ** 3 * q, '2-3': 6 * r ** 3 * q * q };
  const sets = Object.entries(out).reduce((s, [k, v]) => s + v * k.split('-').reduce((a, b) => a + Number(b), 0), 0);
  const T = sets * 45;
  return {
    txt: '세트 이길 확률 ' + pc(q) + '% · 예상 ' + sets.toFixed(1) + '세트',
    ml: { 승: pm, 패: 1 - pm },
    hc: l => { let p = 0; for (const [k, v] of Object.entries(out)) { const [a, b] = k.split('-').map(Number); if (a - b + l > 0) p += v; } return { 승: p, 패: 1 - p }; },
    tt: l => { const p = 1 - ncdf((l - T) / 14); return { 오버: p, 언더: 1 - p }; }
  };
}
const nm = s => String(s || '').replace(/\s+(FC|SC|CF)$/i, '');
let added = 0, fixed = 0; const skipped = [];
const norm955=v=>{if(!v||!Array.isArray(v.m))return false;const bx=Number.isInteger(v.b)?v.m[v.b]:null;const ok=v.m.filter(x=>Number(x.o)>1.31);if(!bx||!(Number(bx.o)>1.31))return false;const seen={},m=[];for(const x of ok.slice().sort((a,b)=>((b===bx)-(a===bx))||(b.p-a.p))){if(seen[x.f])continue;seen[x.f]=1;m.push(x);}const ord=["MONEYLINE","HANDICAP","TOTAL"];m.sort((a,b)=>ord.indexOf(a.f)-ord.indexOf(b.f));v.m=m;v.b=m.indexOf(bx);return true;};
for (const x of S.slate || []) {
  if (!x.mk || !x.mk.length) continue;
  if (kst(x.d, x.t) <= nowMs + 5 * 60000) continue;
  const site = x.site; const bar = /NBA/.test(x.lg) ? 0.55 : 0.58;
  // R984 (owner 11/23 "경기분석 전 종목 다 클로드자체분석"): games with a site pick get Claude's own analysis too
  const nos = x.mk.map(m => Number(m[0]));
  if (nos.some(n => picked.has(gm + ':' + n))) continue; // Claude already picked this game
  const ml = x.mk.find(m => m[1] === 'MONEYLINE') || x.mk[0];
  const key = gm + ':' + ml[0];
  // R955: an entry with a 1.31-or-less option or several sides of one market is broken → redo it
  for (const n of nos) { const v = ana[gm + ':' + n]; if (!v) continue; const before = JSON.stringify(v.m); if (!norm955(v)) delete ana[gm + ':' + n]; else if (JSON.stringify(v.m) !== before) fixed++; }
  // R994: auto entries made with the old raw-chance ranking are redone once (Claude-run entries are never touched)
  for (const n of nos) { const v = ana[gm + ':' + n]; if (v && v.auto === 1 && v.v !== 994) { delete ana[gm + ':' + n]; fixed++; } }
  if (nos.some(n => ana[gm + ':' + n])) continue; // already analysed (Claude run or earlier fill)
  if (!x.mk.some(m => m[3] && m[3].length)) { skipped.push(x.h + ' (배당 없음)'); continue; }
  const M = x.sp === '축구' ? soccerModel(x) : x.sp === '농구' ? bballModel(x) : x.sp === '배구' ? vbModel(x) : null;
  if (!M) { skipped.push(x.h + ' (기록 없음)'); continue; }
  const fams = { MONEYLINE: [], HANDICAP: [], TOTAL: [] };
  for (const m of x.mk) {
    const [no, f, line, ch, ov] = m; if (!ch || !ch.length || !fams[f]) continue;
    const mp = f === 'MONEYLINE' ? M.ml : f === 'HANDICAP' ? (line == null ? null : M.hc(Number(line))) : (line == null ? null : M.tt(Number(line)));
    if (!mp) continue;
    // R994: power de-vig (Betman loads more margin on long shots, so the plain proportional split under-rates the short side and
    // made every short-priced 플핸/언더 look like +3%p "value"). Solve k with Σ(1/o)^k = 1.
    let lo = 1, hi = 3; for (let it = 0; it < 40; it++) { const k = (lo + hi) / 2, sm = ch.reduce((s, c) => s + Math.pow(1 / c[1], k), 0); if (sm > 1) lo = k; else hi = k; }
    const kPow = (lo + hi) / 2;
    for (const [pick, o] of ch) {
      const pm = mp[pick]; if (pm == null || !(o >= 1.31)) continue;
      const imp = Math.pow(1 / o, kPow);
      // 60% overseas price (Betman's own when none) + 40% the numbers model: last-5 samples are small, so the model alone overshoots
      const ovq0 = !!(ov && ov[pick] != null), base = ovq0 ? Number(ov[pick]) : imp;
      // R994: the last-5 projection shrinks every margin toward 0 (밀워키 +11.5 "71%"), so with an overseas price it gets only 15%
      const p = ovq0 ? 0.85 * base + 0.15 * pm : 0.6 * base + 0.4 * pm, pinEdge = ovq0 ? base - imp : 0;
      const lab = f === 'MONEYLINE' ? (pick === '승' ? nm(x.h) + ' 승' : pick === '패' ? nm(x.a) + ' 승' : '무승부')
        : f === 'HANDICAP' ? (pick === '패' ? nm(x.a) + ' ' + fmtL(-Number(line)) + ' 승' : pick === '무' ? '핸디 무 (' + nm(x.h) + ' ' + fmtL(Number(line)) + ')' : nm(x.h) + ' ' + fmtL(Number(line)) + ' 승') : pick + ' ' + line;
      fams[f].push({ f, line: line == null ? null : Number(line), pick, lab, p: Math.min(0.97, Math.max(0.03, r2(p))), o, edge: p - imp, imp, pm, ovq: ovq0 && pinEdge >= 0.02 });
    }
  }
  const m = [];
  for (const f of ['MONEYLINE', 'HANDICAP', 'TOTAL']) {
    const L = fams[f]; if (!L.length) continue;
    L.sort((a, b) => ((b.edge >= 0.03 && b.ovq) - (a.edge >= 0.03 && a.ovq)) || (b.p - a.p));
    m.push(L[0]);
  }
  if (!m.length) { skipped.push(x.h + ' (1.31 이상 없음)'); continue; }
  // R994 (owner 11/24 02:32 "클로드숫자분석은 언더 플핸쪽이 많고 나머지5곳은 정배쪽 … 이게 맞음?"): picking the highest raw chance
  // always landed on the safest-looking line (플핸·언더 sit at 60-70% but pay 1.3-1.6), and the small-sample model leans to the
  // underdog. Now: a "value" pick needs +3%p over Betman AND the overseas (Pinnacle) price behind it; otherwise the card shows
  // who is more likely to win (일반승), the same question the other five sources answer.
  let b = -1; m.forEach((v, i) => { if (v.edge >= 0.03 && v.ovq && (b < 0 || v.p > m[b].p)) b = i; });
  const value = b >= 0; if (!value) { const mi = m.findIndex(v => v.f === 'MONEYLINE'); if (mi >= 0) b = mi; else m.forEach((v, i) => { if (b < 0 || v.p > m[b].p) b = i; }); }
  const B = m[b];
  const why = (value ? '' : '가치 없음 · ') + '숫자 계산: ' + M.txt + ' · ' + B.lab + ' 계산 ' + pc(B.pm) + '% · ' + (B.ovq ? '해외 배당' : '베트맨 배당') + '과 합쳐 ' + pc(B.p) + '% (베트맨 기준 ' + pc(B.imp) + '%, ' + (B.edge >= 0 ? '+' : '') + pc(B.edge) + '%p) · 최근 5경기' + (x.af && x.af.xg ? '·xG' : '') + ' 기준';
  ana[key] = { nos, d: x.d, m: m.map(({ f, line, pick, lab, p, o }) => ({ f, line, pick, lab, p, o })), b, why, auto: 1, v: 994, at: new Date().toISOString() };
  added++;
}
const y = new Date(Date.now() + 9 * 3600e3 - 86400e3).toISOString().slice(0, 10);
for (const k of Object.keys(ana)) if (ana[k].d && ana[k].d < y) delete ana[k];
if (added || fixed) { C.updatedAt = new Date().toISOString(); fs.writeFileSync(pf, JSON.stringify(C, null, 1) + '\n'); }
console.log('added ' + added + ' · fixed ' + fixed + (skipped.length ? ' · skipped ' + skipped.length + ': ' + skipped.slice(0, 20).join(', ') : ''));
