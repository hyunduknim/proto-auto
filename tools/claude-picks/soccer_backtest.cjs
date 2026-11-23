// R992 (owner 11/24 "클로드가 알아서 최적화로 만들어줘"): checks our soccer rules on free historical data
// (football-data.co.uk results + Pinnacle closing odds, published for free download) and fits the Dixon-Coles
// low-score correction (rho) used by fill_ana.cjs. Prints a JSON report; writes nothing.
// usage: node soccer_backtest.cjs
const LEAGUES = ['E0', 'E1', 'SP1', 'I1', 'D1', 'F1', 'N1', 'P1'];
const SEASONS = ['2324', '2425', '2526'];
const fact = [1]; for (let i = 1; i < 15; i++) fact[i] = fact[i - 1] * i;
const pois = (l, k) => Math.exp(-l) * Math.pow(l, k) / fact[k];
function csv(t) { const L = t.replace(/\r/g, '').split('\n').filter(Boolean); const h = L[0].split(','); return L.slice(1).map(r => { const c = r.split(','); const o = {}; h.forEach((k, i) => o[k] = c[i]); return o; }); }
const nv = (...o) => { const inv = o.map(x => 1 / x), s = inv.reduce((a, b) => a + b, 0); return inv.map(x => x / s); };
function grid(lh, la, rho) {
  const g = []; let s = 0;
  for (let i = 0; i < 10; i++) for (let j = 0; j < 10; j++) {
    let p = pois(lh, i) * pois(la, j);
    if (i === 0 && j === 0) p *= 1 - lh * la * rho; else if (i === 0 && j === 1) p *= 1 + lh * rho; else if (i === 1 && j === 0) p *= 1 + la * rho; else if (i === 1 && j === 1) p *= 1 - rho;
    g.push([i, j, p]); s += p;
  }
  return g.map(x => [x[0], x[1], x[2] / s]);
}
function fitLam(pH, pO) { // find (lh, la) whose plain-Poisson grid matches Pinnacle's home-win and over-2.5 chances
  let best = null;
  for (let T = 1.2; T <= 4.6; T += 0.05) for (let sh = 0.15; sh <= 0.85; sh += 0.01) {
    const lh = T * sh, la = T - lh; let h = 0, o = 0;
    for (let i = 0; i < 10; i++) for (let j = 0; j < 10; j++) { const p = pois(lh, i) * pois(la, j); if (i > j) h += p; if (i + j > 2.5) o += p; }
    const e = (h - pH) ** 2 + (o - pO) ** 2; if (!best || e < best.e) best = { e, lh, la };
  }
  return best;
}
(async () => {
  const rows = [];
  for (const s of SEASONS) for (const l of LEAGUES) {
    try { const r = await fetch('https://www.football-data.co.uk/mmz4281/' + s + '/' + l + '.csv'); if (!r.ok) continue; for (const x of csv(await r.text())) if (x.FTHG !== '' && x.FTHG != null) rows.push({ ...x, _l: l, _s: s }); } catch (_) {}
  }
  const M = [];
  for (const x of rows) {
    const H = +x.PSCH || +x.PSH, D = +x.PSCD || +x.PSD, A = +x.PSCA || +x.PSA, O = +x['PC>2.5'] || +x['P>2.5'], U = +x['PC<2.5'] || +x['P<2.5'];
    if (!(H > 1 && D > 1 && A > 1 && O > 1 && U > 1)) continue;
    const [ph, pd, pa] = nv(H, D, A), [po] = nv(O, U);
    const ahl = x.AHCh !== '' ? +x.AHCh : NaN, ahH = +x.PCAHH, ahA = +x.PCAHA;
    M.push({ l: x._l, hg: +x.FTHG, ag: +x.FTAG, ph, pd, pa, po, ahl, pah: ahH > 1 && ahA > 1 ? nv(ahH, ahA)[0] : null });
  }
  // 1) Dixon-Coles rho
  const fits = M.slice(0, 2500).map(m => ({ m, f: fitLam(m.ph, m.po) }));
  let bestRho = 0, bestLL = -Infinity; const llTab = {};
  for (let rho = -0.25; rho <= 0.101; rho += 0.025) {
    let ll = 0; for (const { m, f } of fits) { const g = grid(f.lh, f.la, rho); const c = g.find(z => z[0] === Math.min(m.hg, 9) && z[1] === Math.min(m.ag, 9)); ll += Math.log(Math.max(1e-9, c ? c[2] : 1e-9)); }
    llTab[rho.toFixed(3)] = Math.round(ll); if (ll > bestLL) { bestLL = ll; bestRho = Math.round(rho * 1000) / 1000; }
  }
  // draw calibration: plain Poisson vs DC vs Pinnacle vs actual
  let dP = 0, dDC = 0, dPin = 0, dAct = 0;
  for (const { m, f } of fits) { const g0 = grid(f.lh, f.la, 0), g1 = grid(f.lh, f.la, bestRho); dP += g0.filter(z => z[0] === z[1]).reduce((s, z) => s + z[2], 0); dDC += g1.filter(z => z[0] === z[1]).reduce((s, z) => s + z[2], 0); dPin += m.pd; dAct += m.hg === m.ag ? 1 : 0; }
  const n = fits.length;
  // 2) hit rate by Pinnacle closing chance bucket and market type
  const buckets = [.50, .55, .58, .60, .65, .70];
  const tab = {}; const add = (k, p, hit) => { for (const b of buckets) if (p >= b) { const t = tab[k + '≥' + b] || (tab[k + '≥' + b] = [0, 0]); t[0] += hit ? 1 : 0; t[1]++; } };
  for (const m of M) {
    const fav = m.ph >= m.pa ? 'h' : 'a', pf = Math.max(m.ph, m.pa); add('일반승(정배)', pf, fav === 'h' ? m.hg > m.ag : m.ag > m.hg);
    add('오버2.5', m.po, m.hg + m.ag > 2.5); add('언더2.5', 1 - m.po, m.hg + m.ag < 2.5);
    if (m.pah != null && Number.isFinite(m.ahl) && Math.abs(m.ahl * 2 - Math.round(m.ahl * 2)) < 1e-9 && Math.abs(m.ahl % 1) === 0.5) {
      const d = m.hg - m.ag + m.ahl; const hh = d > 0; const side = m.pah >= 0.5; add('핸디(반점)', side ? m.pah : 1 - m.pah, side ? hh : !hh);
    }
  }
  const out = { matches: M.length, rho: bestRho, llTab, draw: { poisson: +(dP / n).toFixed(3), dixonColes: +(dDC / n).toFixed(3), pinnacle: +(dPin / n).toFixed(3), actual: +(dAct / n).toFixed(3) }, hit: {} };
  for (const [k, v] of Object.entries(tab)) out.hit[k] = { n: v[1], rate: +(v[0] / v[1] * 100).toFixed(1) };
  console.log('REPORT ' + JSON.stringify(out));
})();
