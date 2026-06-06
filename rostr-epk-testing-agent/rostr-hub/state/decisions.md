# Architecture Decisions

## Testing Approach
- **Pure HTTP testing** — All tests use curl/jq. No browser automation dependency.
- **Content heuristics** — Check for expected text patterns in responses, not just HTTP status.
- **Cold start tolerance** — First request to each serverless function may 504. Retry once with 5s delay.
- **Demo mode awareness** — Auth-required routes checked for expected demo behavior, not strict 200.

## Test Granularity
- One script per domain (landing, EPK, API, auth, builder, export, integrations, errors)
- Orchestrator (`run-all-tests.sh`) aggregates results in JSON
- Each script outputs JSON report line to stdout (parsed by orchestrator)

## Failure Classification
- **CRITICAL** — Blocks deploy: 500 errors, broken auth, broken builder, broken EPK pages
- **WARNING** — Should fix: slow pages, missing content sections, demo mode gaps
- **INFO** — Monitor: cold starts, third-party API failures

## Record Keeping
- `session.json` — Current/last run state
- `memory.jsonl` — Cross-session event log (append-only)
- `decisions.md` — Architectural decisions and bug triage notes (append)
- `learnings.jsonl` — Per-failure debug info (append-only)

## Test Discovery
- If a test encounters a 200 response on an unknown path, register it as a discovery
- If a known path returns unexpected status, log as a potential regression
- Track all discovered routes in knowledge-base/sources/site-structure.md
