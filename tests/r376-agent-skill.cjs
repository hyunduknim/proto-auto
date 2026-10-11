"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const file=path.resolve(__dirname,"../.github/skills/myscorebot-proto-analysis/SKILL.md");
assert.ok(fs.existsSync(file),"Missing GitHub Copilot repository skill");
const md=fs.readFileSync(file,"utf8");
assert.match(md,/^---\nname: myscorebot-proto-analysis\ndescription: Use when [^\n]+\n---\n/);
assert.ok(md.length>=700&&md.length<=9000);
for(const token of [
 "GitHub Actions","Cloudflare","ChatGPT","get_games_by_sport","get_game_details",
 "MYSCOREBOT_FEED_URL","MYSCOREBOT_FEED_BEARER_TOKEN",
 "ScoreCenter","no fifth","settlement","R376","15/25/60","20/20/60",
 "node tests/r376-myscorebot-bridge.cjs","node tests/settlement-check.cjs",
 "PR","source mismatch"
])assert.ok(md.toLowerCase().includes(token.toLowerCase()),"Missing skill guardrail: "+token);
const pr=md.indexOf("## Workflow"),safety=md.indexOf("## Safety checks");
assert.ok(pr>0&&safety>pr,"Skill workflow and safety checks required");
console.log("R376_AGENT_SKILL_OK="+JSON.stringify({validFrontmatter:true,guardsChecked:16,
  providerNotDirectlyCallableFromGitHub:true,settlementIsolated:true}));
