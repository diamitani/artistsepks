# Domain Knowledge — ArtistEPKs.com

## Site Overview
ArtistEPKs.com is an AI-powered Electronic Press Kit (EPK) builder for independent musicians. Managed by Artispreneur. Deployed on Vercel.

## URL Patterns

### Public Pages
- `GET /` — Marketing landing page
- `GET /epk/[slug]` — Public EPK page (e.g., `/epk/luh-kel`, `/epk/luh-kel-booking`, `/epk/luh-kel-brand`)
- `GET /[username]` — Public artist profile page (e.g., `/luh-kel`)

### Builder & Dashboard (auth required)
- `GET /builder` — AI-powered EPK builder (split-pane: chat + preview)
- `GET /builder/intake` — Multi-step intake wizard
- `GET /dashboard` — User dashboard (lists EPKs)
- `GET /dashboard/domains` — Custom domain management
- `GET /profile-wizard` — Quick 5-step profile creation

### Auth Pages
- `GET /auth/login` — Login
- `GET /auth/signup` — Signup
- `GET /auth/callback` — OAuth callback (server)

### API Endpoints
- `POST /api/agent` — AI chat (SSE stream). Accepts `{ messages, epkData }`. 3 provider fallback: DeepSeek → Claude → Gemini
- `GET /api/epk` — List user's EPKs
- `POST /api/epk` — Create EPK
- `PATCH /api/epk/[id]` — Update EPK
- `DELETE /api/epk/[id]` — Delete EPK
- `GET /api/profile?id=|username=` — Get profile
- `POST /api/profile` — Create/update profile
- `DELETE /api/profile?id=` — Delete profile
- `POST /api/upload` — Upload image (max 5MB, JPEG/PNG/WebP/GIF)
- `POST /api/generate` — AI bio generation (SSE stream)
- `GET /api/spotify?artist=` — Spotify artist data
- `GET /api/social?url=` — Social scraper (single profile)
- `POST /api/social/dashboard` — Full social dashboard
- `GET /api/pexels?q=&orientation=&type=` — Pexels photo search
- `GET /api/venues?q=|id=` — Venue search/lookup
- `GET /api/domains` — List domains
- `POST /api/domains` — Add domain
- `DELETE /api/domains` — Remove domain
- `POST /api/domains/verify` — Verify DNS CNAME
- `POST /api/pdf/render` — Generate PDF (Puppeteer)
- `GET /api/pdf/[slug]` — Download EPK PDF
- `POST /api/export/html` — Export standalone HTML

## Tech Stack
- Next.js 16 (App Router), React 19, TypeScript (strict)
- Tailwind CSS v4, Framer Motion, Lucide React
- Supabase (Postgres + Auth)
- AI: DeepSeek (primary), Claude Sonnet (fallback), Gemini Flash (fallback 2)
- Puppeteer (PDF), Obscura (social scraping)
- Third-party APIs: Spotify, Pexels
- Deployment: Vercel

## Known Behaviors

### Demo Mode
When Supabase env vars are unset (placeholder values), the site enters demo mode:
- No auth enforcement on `/dashboard/*` or `/builder/*`
- Luh Kel data shown as demo placeholder
- Profiles stored as local JSON files in `.profiles/`
- Auth pages may behave differently

### Cold Starts
Vercel serverless functions may take 3-8s on first request after inactivity. Retry once.

### ISR
EPK pages use `revalidate: 60` for Incremental Static Regeneration. New EPKs may 404 for up to 60s.

### EPK Templates
1. **Main EPK** (gold accent) — Full press kit
2. **Booking Kit** (red accent `#C8102E`) — Performance info
3. **Brand Kit** (light/cream) — Brand partnership pitch

### Example Artists (for testing)
1. Luh Kel — Full EPK at `/epk/luh-kel`, all 3 templates
2. SOLARIS — `/epk/solaris`
3. NOVA — `/epk/nova`
4. The Velvetines — `/epk/the-velvetines`
5. King KAI — `/epk/king-kai`

### Auth Middleware
- `proxy.ts` protects `/dashboard/*` and `/builder/*`
- Unauthenticated → redirect to `/auth/login?redirectTo=...`
- Authenticated on `/auth/*` → redirect to `/dashboard`

### File Upload
- Max 5MB
- Accepted: JPEG, PNG, WebP, GIF
- Returns base64 data URL

## Testing Artifacts Directory
Test output, logs, and failure reports are stored alongside the agent at:
`rostr-epk-testing-agent/rostr-hub/state/`
