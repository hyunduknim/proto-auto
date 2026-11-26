// R1017 (owner 11/27 00:27 "달마다 5달러드만 갑자기 왜 20달러인지?"): this month's Workers / Durable Objects / KV usage per worker,
// read from Cloudflare's GraphQL analytics with the deploy token. Prints totals only (never the token).
const T = process.env.CLOUDFLARE_API_TOKEN, A = process.env.CLOUDFLARE_ACCOUNT_ID;
const now = new Date(), from = process.env.FROM || new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1)).toISOString().slice(0, 10), to = now.toISOString().slice(0, 10);
async function q(query, variables) {
  const r = await fetch('https://api.cloudflare.com/client/v4/graphql', { method: 'POST', headers: { authorization: 'Bearer ' + T, 'content-type': 'application/json' }, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) return { err: j.errors.map(e => e.message).join('; ').slice(0, 300) }; return j.data;
}
(async () => {
  const out = { from, to };
  const months = []; for (let d = new Date(from + 'T00:00:00Z'); d <= now; d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1))) months.push([d.toISOString().slice(0, 10), new Date(Math.min(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1) - 1, now.getTime())).toISOString().slice(0, 10)]);
  for (const [a, b] of months) {
    const M = out[a.slice(0, 7)] = {};
    const w = await q(`query($acc:String!,$a:Date!,$b:Date!){viewer{accounts(filter:{accountTag:$acc}){workersInvocationsAdaptive(limit:100,filter:{date_geq:$a,date_leq:$b}){sum{requests subrequests errors} quantiles{cpuTimeP50} dimensions{scriptName}}}}}`, { acc: A, a, b });
    if (w.err) M.workersErr = w.err; else { const agg = {}; for (const r of w.viewer.accounts[0].workersInvocationsAdaptive) { const k = r.dimensions.scriptName; const o = agg[k] || (agg[k] = { req: 0, sub: 0 }); o.req += r.sum.requests; o.sub += r.sum.subrequests; } M.workers = agg; }
    const c = await q(`query($acc:String!,$a:Time!,$b:Time!){viewer{accounts(filter:{accountTag:$acc}){workersInvocationsAdaptive(limit:100,filter:{datetime_geq:$a,datetime_leq:$b}){sum{cpuTimeUs:cpuTime} dimensions{scriptName}}}}}`, { acc: A, a: a + 'T00:00:00Z', b: b + 'T23:59:59Z' });
    if (!c.err) { M.cpuMs = {}; for (const r of c.viewer.accounts[0].workersInvocationsAdaptive) M.cpuMs[r.dimensions.scriptName] = (M.cpuMs[r.dimensions.scriptName] || 0) + Math.round(r.sum.cpuTimeUs / 1000); } else M.cpuErr = c.err;
    const d = await q(`query($acc:String!,$a:Date!,$b:Date!){viewer{accounts(filter:{accountTag:$acc}){durableObjectsInvocationsAdaptiveGroups(limit:100,filter:{date_geq:$a,date_leq:$b}){sum{requests} dimensions{scriptName}} durableObjectsPeriodicGroups(limit:100,filter:{date_geq:$a,date_leq:$b}){sum{activeTime cpuTime storageReadUnits storageWriteUnits storageDeletes} dimensions{namespaceId}} durableObjectsStorageGroups(limit:5,filter:{date_geq:$a,date_leq:$b}){max{storedBytes}}}}}`, { acc: A, a, b });
    if (d.err) M.doErr = d.err; else { const x = d.viewer.accounts[0]; M.doReq = {}; for (const r of x.durableObjectsInvocationsAdaptiveGroups) M.doReq[r.dimensions.scriptName] = (M.doReq[r.dimensions.scriptName] || 0) + r.sum.requests; const p = { activeSec: 0, cpuMs: 0, readUnits: 0, writeUnits: 0, deletes: 0 }; for (const r of x.durableObjectsPeriodicGroups) { p.activeSec += r.sum.activeTime / 1e6; p.cpuMs += r.sum.cpuTime / 1e3; p.readUnits += r.sum.storageReadUnits; p.writeUnits += r.sum.storageWriteUnits; p.deletes += r.sum.storageDeletes; } for (const k in p) p[k] = Math.round(p[k]); p.gbSec_128MB = Math.round(p.activeSec * 0.125); M.doPeriodic = p; M.doStoredMB = Math.round(Math.max(0, ...x.durableObjectsStorageGroups.map(z => z.max.storedBytes)) / 1e6); }
    const k = await q(`query($acc:String!,$a:Date!,$b:Date!){viewer{accounts(filter:{accountTag:$acc}){kvOperationsAdaptiveGroups(limit:100,filter:{date_geq:$a,date_leq:$b}){sum{requests} dimensions{actionType}}}}}`, { acc: A, a, b });
    if (k.err) M.kvErr = k.err; else { M.kv = {}; for (const r of k.viewer.accounts[0].kvOperationsAdaptiveGroups) M.kv[r.dimensions.actionType] = (M.kv[r.dimensions.actionType] || 0) + r.sum.requests; }
  }
  console.log('CFUSAGE ' + JSON.stringify(out));
})();
