# ROSTR EPK Testing Agent — Codex Config

## Agent Definition

This is a testing agent for ArtistEPKs.com. It validates all surfaces of the site via HTTP.

## Instructions

When invoked, load and follow: `system-instructions.md`

## Knowledge

- `knowledge/site-map.md` — Site URL structure and API endpoints

## Tools

These bash scripts are available for testing:

- `rostr-hub/tools/scripts/run-all-tests.sh` — Full test suite
- `rostr-hub/tools/scripts/test-landing-page.sh` — Landing page
- `rostr-hub/tools/scripts/test-epk-pages.sh` — EPK pages
- `rostr-hub/tools/scripts/test-profile-pages.sh` — Profile pages
- `rostr-hub/tools/scripts/test-api-endpoints.sh` — API endpoints
- `rostr-hub/tools/scripts/test-builder-flow.sh` — Builder flow
- `rostr-hub/tools/scripts/test-auth-flow.sh` — Auth flow
- `rostr-hub/tools/scripts/test-export-features.sh` — Export features
- `rostr-hub/tools/scripts/test-social-spotify.sh` — Social/Spotify
- `rostr-hub/tools/scripts/test-error-handling.sh` — Error handling

## Output

Test reports are written to `rostr-hub/state/session.json`.
