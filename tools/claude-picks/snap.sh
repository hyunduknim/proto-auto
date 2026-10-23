#!/bin/bash
# usage: snap.sh "<check query>" [espn paths "p1|p2|..."] [outdir]
# Runs the read-only diag workflow: stores /check?<query> (and optional ESPN public API probes) on the diag branch, then prints check.json.
# ESPN probes are saved as <outdir>/espn_<i>.json (may be gzip; use zcat -f).
set -euo pipefail
R=hyunduknim/proto-auto; Q="$1"; E="${2:-}"; O="${3:-.}"
before=$(gh api "repos/$R/actions/workflows/diag-snapshot.yml/runs?per_page=1" --jq '.workflow_runs[0].id' 2>/dev/null || echo 0)
gh workflow run diag-snapshot.yml -R $R --ref main -f query="$Q" -f espn="$E" >/dev/null
for i in $(seq 1 40); do id=$(gh api "repos/$R/actions/workflows/diag-snapshot.yml/runs?per_page=1" --jq '.workflow_runs[0].id' 2>/dev/null || true); [ -n "$id" ] && [ "$id" != "$before" ] && break; sleep 3; done
for i in $(seq 1 60); do s=$(gh api "repos/$R/actions/runs/$id" --jq '.status' 2>/dev/null || true); [ "$s" = completed ] && break; sleep 4; done
if [ -n "$E" ]; then n=$(echo "$E" | tr '|' '\n' | wc -l); for i in $(seq 0 $((n-1))); do gh api -H "Accept: application/vnd.github.raw" "repos/$R/contents/espn_${i}.json?ref=diag" > "$O/espn_${i}.json" 2>/dev/null || true; done; fi
gh api -H "Accept: application/vnd.github.raw" "repos/$R/contents/check.json?ref=diag"
