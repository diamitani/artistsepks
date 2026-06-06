---
name: rostr-epk-testing
description: ROSTR-powered end-to-end testing for ArtistEPKs.com. Validates public pages, APIs, auth, builder, export, and integrations.
---

# ROSTR EPK Testing Agent

## Usage

Enable this skill in your Claude Code or Codex project, then:

```bash
# Run the full test suite
bash rostr-hub/tools/scripts/run-all-tests.sh

# Run individual suites
bash rostr-hub/tools/scripts/test-landing-page.sh
bash rostr-hub/tools/scripts/test-epk-pages.sh
bash rostr-hub/tools/scripts/test-api-endpoints.sh
```

## What It Tests

| Suite | Tests | Coverage |
|---|---|---|
| landing | Homepage sections | Hero, Features, Templates, Pricing, FAQ, CTA |
| epk-pages | Public EPK pages | 7 example EPKs, 3 template variants |
| profile-pages | Artist profiles | Known profiles, edge cases, 404s |
| api-endpoints | All HTTP APIs | 14 endpoints, CRUD, validation |
| builder-flow | Builder + agent | Page loads, AI chat streaming |
| auth-flow | Authentication | Login/signup pages, middleware redirects |
| export-features | PDF + HTML export | Render APIs, download by slug |
| social-spotify | Integrations | Spotify, Pexels, social dashboard |
| error-handling | Edge cases | 404s, bad input, 5xx prevention |

## Configuration

Set `SITE_URL` to target a deployment (default: `https://artistsepks.com`).

## Requirements

- curl, jq, bash
- Network access to the target site
- Optional: Spotify, Pexels, Obscura API keys for integration tests

## Reports

Test results are saved to `rostr-hub/state/session.json` in structured JSON format.
