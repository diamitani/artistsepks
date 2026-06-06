# HEARTBEAT

## Tick Interval
Every 24 hours (daily smoke test)

## Actions
1. Run `bash rostr-hub/tools/scripts/run-all-tests.sh`
2. Inspect results for regressions
3. If blocking issues found, alert immediately
4. Log findings to `rostr-hub/state/learnings.jsonl`
5. Update `rostr-hub/state/session.json` with latest results

## Health Indicators
- All 9 test suites pass → Healthy
- Only third-party API tests fail (Spotify/Pexels) → Degraded (API key issue)
- Public page tests fail → Critical (site may be down)
- Any 500 error on user-facing route → Critical
