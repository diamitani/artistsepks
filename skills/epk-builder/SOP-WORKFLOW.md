# EPK Agent — Standard Operating Procedure (SOP)

## Overview

The EPK Agent is a conversational AI publicist that interviews artists and builds professional Electronic Press Kits. Every EPK follows the same architecture — only the artist's content changes.

```
Artist → Agent Interview (20 steps) → Data Enrichment → Blueprint Assembly → Published EPK
```

---

## 1. Pre-Flight Checklist

Before starting any EPK build, verify:

### Database
- [ ] `epks` table exists in Supabase (run `supabase migration up` if not)
- [ ] `profiles` table exists
- [ ] RLS policies active: users own their data, public can view published EPKs
- [ ] `increment_epk_views` and `increment_epk_downloads` RPC functions exist

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=          # Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Anon/public key
SUPABASE_SERVICE_ROLE_KEY=         # Service role (admin operations)
DEEPSEEK_API_KEY=                  # or ANTHROPIC/GEMINI
AI_PROVIDER=deepseek               # deepseek | claude | gemini
SPOTIFY_CLIENT_ID=                 # For auto discography pull
SPOTIFY_CLIENT_SECRET=
PEXELS_API_KEY=                    # For stock hero images
OBSCURA_PATH=./bin/obscura         # For social scraping
```

### Quick Apply to Supabase
```sql
-- Run in Supabase SQL Editor or via:
-- supabase migration up
\i supabase/migrations/001_profiles.sql
\i supabase/migrations/002_full_epk_schema.sql
```

---

## 2. EPK Agent Questionnaire Workflow

The agent follows a strict 20-step interview. Each step collects ONE piece of data. The agent always ends every message with a question. Never skip steps, never ask multiple questions at once.

### Phase 1: Identity (Steps 1-6)

| Step | Question | Tool Call | EPK Field |
|------|----------|-----------|-----------|
| 1 | **Name** — "What's your artist or band name?" | `update_epk({ artistName })` | `artistName` |
| 2 | **Genre + Location** — "What genre do you make and where are you from?" | `update_epk({ genre, hometown })` | `genre`, `hometown` |
| 3 | **Artist Type** — "Are you a producer, vocalist, singer-songwriter, session musician, instrumentalist, engineer, DJ, band, or multiple?" | `update_epk({ artistType })` | `artistType` |
| 4 | **Years Active** — "How many years have you been at it seriously?" | `update_epk({ yearsActive })` | `yearsActive` |
| 5 | **Influences** — "Who are your biggest influences and what styles inspire your sound?" | `update_epk({ influences })` | `influences[]` |
| 6 | **Tagline** — Propose a short tagline. Confirm before setting. | `update_epk({ artistTagline })` | `artistTagline` |

### Phase 2: Story + Media (Steps 7-8)

| Step | Question | Tool Call | EPK Field |
|------|----------|-----------|-----------|
| 7 | **Story + Bio** — "Tell me about your journey — how did you start, what's your story?" After response, write a press-ready bio (3rd person, 150-250 words, strong hook). | `update_epk({ bio, shortBio })` | `bio`, `shortBio` |
| 8 | **Photos** — "Got a press photo / profile image? What about a hero/banner image?" If none: "No worries, I'll use professional gradient placeholders." | `update_epk({ profileImageUrl, heroImageUrl })` | `profileImageUrl`, `heroImageUrl` |

### Phase 3: Music + Data (Steps 9-11)

| Step | Question | Tool Call | EPK Field |
|------|----------|-----------|-----------|
| 9 | **Music Links** — "Drop your Spotify, SoundCloud, YouTube, Apple Music, Bandcamp links." If Spotify: call `fetch_spotify_data` immediately. Auto-populate releases, stats, genres. Never ask them to manually list what Spotify returned. | `fetch_spotify_data()` then `update_epk({ spotifyArtistId, releases, stats, genre })` | `spotifyArtistId`, `releases[]`, `stats.spotifyListeners` |
| 10 | **Social Media + Stats** — "What's your Instagram, TikTok, YouTube, Twitter?" Offer to scrape real follower counts. | `scrape_social_profile()` then `update_epk({ stats })` | `socialLinks`, `stats` |
| 11 | **Releases** — If Spotify provided data, confirm completeness. If no Spotify, ask manually for releases. | `update_epk({ releases })` | `releases[]` |

### Phase 4: Career + Press (Steps 12-14)

| Step | Question | Tool Call | EPK Field |
|------|----------|-----------|-----------|
| 12 | **Milestones** — "What are your career highlights — first show, biggest show, awards, memorable moments?" | `update_epk({ timeline })` | `timeline[]` |
| 13 | **Press + Features** — "Any press, blogs, playlists, podcasts features?" If URLs given: call `fetch_page` to read articles. | `fetch_page()`, `update_epk({ pressQuotes })` | `pressQuotes[]` |
| 14 | **Collaborators** — "Other artists, producers, or songwriters you've worked with?" | `update_epk({ collaborators })` | `collaborators[]` |

### Phase 5: Business + Team (Steps 15-17)

| Step | Question | Tool Call | EPK Field |
|------|----------|-----------|-----------|
| 15 | **Manager** — "Who's your manager? What's their contact info?" | `update_epk({ managerName, managerContact })` | `managerName`, `managerContact` |
| 16 | **Label** — "Are you signed? What label and contact?" | `update_epk({ labelName, labelContact })` | `labelName`, `labelContact` |
| 17 | **Contact** — "What's the best booking email and phone number?" | `update_epk({ bookingEmail, bookingPhone })` | `bookingEmail`, `bookingPhone` |

### Phase 6: Template + Polish (Steps 18-20)

| Step | Question | Tool Call | EPK Field |
|------|----------|-----------|-----------|
| 18 | **Template + Color** — "For this EPK, should we do a full artist profile (main), a promoter-focused booking kit, or a brand partnership pitch? And what color scheme?" Offer Gold, Red, Cream, or custom hex. | `update_epk({ template, accentColor })` | `template`, `accentColor` |
| 19 | **Rider (booking only)** — If booking template: "What are your technical requirements — sound, lighting, backline, hospitality?" | `add_rider()` | stored in EPK context |
| 20 | **Final Polish** — "Anything to adjust? Colors, bio wording, sections to add/remove?" Always end with a question. | `update_epk()` (any remaining fields) | Final review |

---

## 3. Data Enrichment Playbook

### Spotify Auto-Populate
When user provides a Spotify URL:
```
1. Extract artist ID from URL: https://open.spotify.com/artist/{ID}
2. Call fetch_spotify_data({ spotifyUrlOrId })
3. On success → auto-populate:
   - spotifyArtistId
   - genre (from artist genres)
   - stats.spotifyListeners (follower count, formatted)
   - releases[] (albums, singles, EPs with titles, years, cover art URLs)
4. Confirm: "Found you on Spotify — {follower count} followers, {X} releases. I've added those to your EPK. Anything missing?"
5. NEVER ask them to manually list what Spotify already returned
```

### Social Scraping
When user provides social URLs:
```
1. Call scrape_social_profile({ url }) per platform
2. Update stats:
   - instagramFollowers ← Instagram scrape
   - tiktokViews ← TikTok scrape  
   - youtubeSubscribers ← YouTube scrape
3. Update socialLinks with the URLs
4. Confirm: "Pulled your numbers — {X} Instagram followers, {Y} TikTok views."
```

### Web Research
When user mentions press, blog, or news:
```
1. Call fetch_page({ url }) to read the article
2. Extract key quotes, stats, or facts
3. If press quote: add to pressQuotes[] with publication name and URL
4. Confirm: "Great press from {publication}. I've added that to your press section."
```

---

## 4. EPK Build Sequence

After collecting all data, the agent builds in this fixed order:

```
Step  1: set template (main / booking / brand)
Step  2: set artist name, tagline, artist type, genre, hometown
Step  3: set years active and influences
Step  4: set hero and profile images
Step  5: set accent color
Step  6: populate stats bar (from Spotify/social scrapes)
Step  7: write bio and shortBio
Step  8: add music embeds (YouTube, Spotify)
Step  9: build discography from releases
Step 10: build timeline from milestones
Step 11: add press quotes and press links
Step 12: add collaborators
Step 13: add social links
Step 14: set manager and label info
Step 15: set booking email and phone
Step 16: add performance packages (booking template only)
Step 17: add brand partners (brand template only)
```

Each step calls `update_epk` with the relevant fields. Never skip steps.

### Blueprint Validation
After build, validate against the blueprint:
```typescript
const { valid, missing } = validateBlueprint(epk, template);
// If missing sections exist, agent must address them before declaring "done"
```

### Template Sections Summary

| Section | Main | Booking | Brand | Required | Min Content |
|---------|------|---------|-------|----------|-------------|
| Hero | ✓ | ✓ | ✓ | Yes | name, tagline/image |
| Stats Bar | ✓ | ✓ | ✓ | Yes | ≥2 stats |
| Biography | ✓ | ✓ | ✓ | Yes | ≥100 chars |
| Music Embeds | ✓ | ✓ | ✓ | No | — |
| Discography | ✓ | ✓ | — | Yes* | ≥1 release |
| Timeline | ✓ | ✓ | — | Yes* | ≥2 events |
| Press Quotes | ✓ | — | — | No | — |
| Collaborators | ✓ | — | — | No | — |
| Performance Packages | — | ✓ | — | Yes | ≥1 package |
| Brand Value Props | — | — | ✓ | Yes | ≥1 card |
| Past Partners | — | — | ✓ | No | — |
| Social Links | ✓ | ✓ | ✓ | Yes | ≥1 link |
| Booking CTA | ✓ | ✓ | ✓ | Yes | email |

*Required for main/booking, not for brand

### Style Tokens Per Template

| Token | Main | Booking | Brand |
|-------|------|---------|-------|
| Accent Color | `#C9A227` (Gold) | `#C8102E` (Red) | `#C9A227` (Gold) |
| Heading Font | Bebas Neue | Bebas Neue | Bebas Neue |
| Body Font | DM Sans | DM Sans | DM Sans |
| Border Radius | 12px | 10px | 10px |
| CTA Style | solid | solid | outline |

---

## 5. Quality Assurance Gates

### Gate 1: Data Completeness
Before publishing, verify:
- [ ] Artist name is set
- [ ] Bio is ≥100 characters, 3rd person, press-ready
- [ ] At least one image URL exists (or gradient placeholder configured)
- [ ] Stats have ≥2 entries
- [ ] Booking email is present and valid format
- [ ] Social links have ≥1 entry

### Gate 2: Blueprint Validation
- [ ] All required sections populated per template
- [ ] No placeholder text remaining
- [ ] Release entries have title, type, year
- [ ] Timeline events have year, title, description

### Gate 3: Visual Quality
- [ ] Accent color contrasts with background
- [ ] Stat numbers formatted consistently (e.g. "1.5M+" not "1500000")
- [ ] Bio opening has a strong hook
- [ ] No empty sections rendered

### Gate 4: Technical
- [ ] EPK saves successfully to Supabase
- [ ] Slug is unique and URL-friendly
- [ ] Public EPK page renders at `/epk/[slug]`
- [ ] PDF export generates without errors
- [ ] RLS policies allow public read

---

## 6. Publishing & Export Workflow

### Save Flow
```
Agent calls update_epk()
  → POST /api/epk/[id] (if existing)
  → POST /api/epk (if new, generates slug from artist name)
  → Stores JSONB in epks.data column
  → Returns updated EPK with id and slug
```

### Publishing
```
EPK saved with template + all data
  → Accessible at /epk/[slug]
  → Public read allowed via RLS
  → Views counter increments on load
```

### Export Formats
| Format | Endpoint | When to Use |
|--------|----------|-------------|
| Hosted Link | `/epk/[slug]` | Share with labels, press, promoters |
| HTML Download | `POST /api/export/html` | Self-host on artist's own site |
| PDF | `POST /api/pdf/render` | Email attachment for booking inquiries |
| One-Sheeter | internal utility | Internal review before publishing |

---

## 7. Database Schema Reference

### Table: `epks`
| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid PK` | Auto-generated unique ID |
| `slug` | `text UNIQUE` | URL-safe slug (e.g. "luh-kel") |
| `user_id` | `uuid FK → auth.users` | Owner of this EPK |
| `template` | `text` | `main` / `booking` / `brand` |
| `data` | `jsonb` | Full EPKData object (see TypeScript types) |
| `views` | `integer` | Page view counter |
| `downloads` | `integer` | PDF download counter |
| `created_at` | `timestamptz` | Creation timestamp |
| `updated_at` | `timestamptz` | Last update timestamp |

### Table: `profiles`
| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid PK` | Auto-generated unique ID |
| `user_id` | `uuid FK → auth.users` | Owner |
| `profile_data` | `jsonb` | Full ArtistProfile object |
| `created_at` | `timestamptz` | Creation timestamp |
| `updated_at` | `timestamptz` | Last update timestamp |

### Table: `domains`
| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid PK` | Auto-generated |
| `user_id` | `uuid FK → auth.users` | Owner |
| `domain` | `text UNIQUE` | Custom domain |
| `epk_slug` | `text` | EPK slug to map domain to |
| `verified` | `boolean` | DNS verification status |
| `verified_at` | `timestamptz` | When verified |
| `created_at` | `timestamptz` | Creation timestamp |
| `updated_at` | `timestamptz` | Last update timestamp |

### RLS Policies
- Users CRUD own EPKs only
- Anyone can SELECT published EPKs (by slug)
- View/download counters via security definer RPC functions

---

## 8. Handling Edge Cases

| Scenario | Response |
|----------|----------|
| User pastes a data dump | Parse everything, call `update_epk` for every extractable field, ask what's missing |
| User provides Spotify link | Auto-populate discography + stats. Do NOT ask them to list songs. |
| User has no photos | Use gradient placeholders. Confirm: "I'll use professional gradients — we can swap in real photos anytime." |
| User wants to skip a question | Note the skip, move to next question. Do not pressure. |
| User gives vague answers | Ask a more specific follow-up. "Can you tell me more about that?" |
| Multiple questions at once | Agent must never do this. If user does it, answer all of them but only ask ONE follow-up. |
| User says "I'm done" | Run blueprint validation. If missing sections exist, list them and ask to fill. If complete, confirm and offer publish. |
| Spotify API fails | "Couldn't pull from Spotify right now. Can you tell me your top genres and a couple of releases?" |
| Social scrape fails | "Couldn't scrape that profile. Want to tell me your follower count and I'll add it manually?" |

---

## 9. Error Recovery

| Error | Likely Cause | Fix |
|-------|-------------|-----|
| `Could not find the table 'public.epks'` | Migration not applied | Run `supabase migration up` or execute `002_full_epk_schema.sql` in Supabase SQL Editor |
| `relation "profiles" does not exist` | Migration 001 not applied | Run `001_profiles.sql` first |
| `new row violates row-level security` | User not authenticated | Ensure user is logged in before EPK operations |
| `Spotify API returned 401` | Missing/invalid SPOTIFY_CLIENT_ID/SECRET | Check `.env` has valid Spotify API credentials |
| `DeepSeek API error` | Missing or expired API key | Check `DEEPSEEK_API_KEY` in `.env` |
| EPK not rendering at `/epk/[slug]` | Slug mismatch or data not saved | Check `epks` table for the slug, verify `data` column is populated |
