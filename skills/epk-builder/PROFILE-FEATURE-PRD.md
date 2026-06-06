# Artist Profile Feature — PRD

## Overview
Shareable profile pages at `artistepks.com/[username]` — a social-style artist directory.
Free tier artists get a clean profile. Paid tier unlocks the full EPK.

## Routes
| Route | Purpose | Auth |
|-------|---------|------|
| `/[username]` | Public artist profile page | None |
| `/profile-wizard` | Free tier intake wizard | Optional |
| `/profile-wizard?edit=` | Resume saved profile | Auth required |

## Data Model (Free Profile)
```
username         — unique slug
displayName      — artist/band name
tagline          — short descriptor
genre            — primary genre
location         — city, state
avatarUrl        — profile photo
coverUrl         — cover image
bio              — short bio (2-3 sentences)
socialLinks      — { instagram, tiktok, youtube, spotify }
stats            — { listeners, followers, etc. }
bookingEmail     — contact email
```

## Layout (Youzify-inspired)
```
┌──────────────────────────────────────┐
│  Cover Image (16:9, gradient overlay) │
│                                       │
│     [Avatar]  Artist Name             │
│                @username · Genre      │
│                                       │
│  ┌──────┬──────┬──────┬──────┐       │
│  │ 1.5M │ 2.3M │ 500K │ 3B   │       │
│  │ Listn│ IG   │ YT   │ Tik  │       │
│  └──────┴──────┴──────┴──────┘       │
│                                       │
│  About                                │
│  ─────                                │
│  Short bio text here...               │
│                                       │
│  Social Links                         │
│  ─────                                 │
│  [IG] [TT] [YT] [SP] [WEB]           │
│                                       │
│  [Book Now / View Full EPK] button   │
└──────────────────────────────────────┘
```

## Flow
```
Landing Page → "Create Free Profile" → Profile Wizard
                                           ↓
                                    Fill in basics
                                     (name, genre, 
                                      location, bio,
                                      social URLs)
                                           ↓
                                    Save to Supabase
                                           ↓
                        artistepks.com/username ← shareable!
                                           ↓
                              "Upgrade to Full EPK"
                                           ↓
                                    EPK Builder
                                  (pre-populated)
```

## Security
- Username sanitization: alphanumeric + hyphens only, 3-30 chars
- Rate limits: 10 profile creates/hr per IP, 100 updates/hr
- Supabase RLS: users can only edit own profile
- Image URLs validated server-side (no SSRF)
- XSS: all user input escaped in templates
- No SQL injection (parameterized queries via Supabase SDK)

## Database (Supabase)
Table `profiles` already exists with RLS. Add index on `profile_data->>username`.
