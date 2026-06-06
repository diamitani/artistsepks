# Setup Guide — ROSTR EPK Testing Agent

## Quick Start

```bash
# 1. Set the target URL
export SITE_URL="https://artistsepks.vercel.app"

# 2. Run the full test suite
bash rostr-hub/tools/scripts/run-all-tests.sh
```

## Environment

Copy and edit:
```bash
cp .env.example .env
```

Required:
- `SITE_URL` — The ArtistEPKs deployment to test

Optional:
- `TEST_TIMEOUT` — Request timeout in ms (default: 30000)
- `TEST_EMAIL` / `TEST_PASSWORD` — For auth flow tests
- `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` — Spotify API tests
- `PEXELS_API_KEY` — Pexels photo search tests

## Running Test Suites

```bash
# All tests
bash rostr-hub/tools/scripts/run-all-tests.sh

# Individual suites
bash rostr-hub/tools/scripts/test-landing-page.sh
bash rostr-hub/tools/scripts/test-epk-pages.sh
bash rostr-hub/tools/scripts/test-profile-pages.sh
bash rostr-hub/tools/scripts/test-api-endpoints.sh
bash rostr-hub/tools/scripts/test-builder-flow.sh
bash rostr-hub/tools/scripts/test-auth-flow.sh
bash rostr-hub/tools/scripts/test-export-features.sh
bash rostr-hub/tools/scripts/test-social-spotify.sh
bash rostr-hub/tools/scripts/test-error-handling.sh
```

## Test Results

Results are written to `rostr-hub/state/session.json` in this format:
```json
{
  "run_id": "2026-06-06T12:00:00Z",
  "site_url": "https://artistsepks.vercel.app",
  "suites": { "...": { "status": "pass", "tests": { "passed": N, "failed": N, "total": N } } },
  "summary": { "passed": N, "failed": N, "total": N },
  "blocking": true|false
}
```

## Scheduling Daily Smoke Tests

```bash
# Run tests daily at 6 AM
echo "0 6 * * * cd /path/to/rostr-epk-testing-agent && SITE_URL=https://artistsepks.vercel.app bash rostr-hub/tools/scripts/run-all-tests.sh >> rostr-hub/state/daily.log 2>&1" | crontab -
```

## Running Against Preview Deployments

```bash
export SITE_URL="https://frontend-<branch>-<hash>.vercel.app"
bash rostr-hub/tools/scripts/run-all-tests.sh
```

## Requirements

- bash 4+
- curl
- jq (for JSON parsing in test reports)
- Network access to the target site

## File Tree

```
rostr-epk-testing-agent/
├── rostr-agent.yaml              # Universal agent manifest
├── system-instructions.md        # Full JTBD system prompt
├── setup-guide.md                # This file
├── test-agent.md                 # Manual test cases
├── .env.example                  # Env template
├── rostr-hub/
│   ├── agent.yaml                # Hub agent config
│   ├── context/{identity,domain-knowledge,user-context}.md
│   ├── state/{session,memory,decisions,learnings}.*
│   ├── knowledge-base/{ragdal,sources/site-structure}.{yaml,md}
│   └── tools/
│       ├── tool-manifest.yaml
│       └── scripts/{10 test scripts}.sh
├── skill/SKILL.md                # Claude Code/Codex skill
├── codex/{AGENTS.md,knowledge/site-map.md}  # Codex config
├── openclaw/{SOUL,IDENTITY,RULES,HEARTBEAT}.md  # OpenClaw config
└── standalone/agent.yaml         # Standalone runner
```
