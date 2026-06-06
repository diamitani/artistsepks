# User Context — Deployment Configuration

## Site URL
```
SITE_URL="http://localhost:3000"
```

For production/staging deployments (when live):
```bash
export SITE_URL="https://artistsepks.vercel.app"
# or a Vercel preview:
export SITE_URL="https://frontend-<branch>-<hash>.vercel.app"
```

## Test Configuration
```
TEST_TIMEOUT=30000          # Max wait per request (ms)
MAX_COLD_START_RETRIES=2    # Retries for Vercel cold starts
STABILITY_THRESHOLD_MS=2000 # Alert if page load exceeds this
REPORT_DIR=./rostr-hub/state
```

## Environment Variables (Required for Full Coverage)
- `SITE_URL` — Target deployment URL
- `TEST_TIMEOUT` — Request timeout in ms

## Environment Variables (Optional — for Integration Tests)
- `SPOTIFY_CLIENT_ID` + `SPOTIFY_CLIENT_SECRET` — Spotify API tests
- `PEXELS_API_KEY` — Pexels photo search tests
- `OBSCURA_PATH` — Social scraper binary path
- `TEST_EMAIL` + `TEST_PASSWORD` — Auth flow tests (requires pre-created test account)

## Demo Mode
If no Supabase credentials are configured:
- Auth-required routes enter degraded demo mode
- Demo mode is a site feature, not a test failure
- Mark demo-mode results with `"demo_mode": true` in test output

## Execution
```bash
# Full test suite
bash rostr-hub/tools/scripts/run-all-tests.sh

# Single suite
bash rostr-hub/tools/scripts/test-landing-page.sh
```

## Environment File
Copy `.env.example` and fill in:
```bash
cp .env.example .env
# Edit .env with your values
```
