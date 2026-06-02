# EPK Builder — Complete Workflow Skill

Build professional Electronic Press Kits using a structured, repeatable process.
Every EPK follows the same architecture — only the artist's content changes.

---

## 1. Intake Phase

Collect structured data before generating anything.

### Phase 1: Contact & Team
- First/last name, email, phone, website
- Manager name + contact
- Label name + contact

### Phase 2: Background & Brand
- Artist/band name, stage name
- Location, hometown
- Years in business, professional status
- Genre, style, themes, energy, influences
- Raw bio (AI enhances this later)

### Phase 3: Goals
- Primary goal (career, viral, signing, touring)
- Performance frequency, streaming target, revenue target
- Interests: distribution, sync, brand partnerships, influencer work
- SMART goals with timeline

### Phase 4: Assets
- PRO registration (ASCAP/BMI/SESAC)
- Copyrights, split sheets, contracts
- Business entity (LLC/Corp/none), EIN, bank account
- DSP presence (which platforms)
- Studio access, needs help areas

### Phase 5: Resources
- Investment budget, time commitment
- Availability, team members

---

## 2. Enrichment Phase

Pull data from external sources to populate EPK fields.

### Spotify
- Provide artist ID/URL → auto-pull: genres, followers, top tracks, albums
- Maps to: `genre`, `stats.spotifyListeners`, `releases[]`

### Social Media (via Obscura)
- Provide Instagram/TikTok/YouTube URL → scrape: follower count, engagement
- Maps to: `stats.instagramFollowers`, `stats.tiktokViews`, `stats.youtubeSubscribers`

### Engagement Scoring
- Calculates follower-to-like/comment ratio per platform
- Rates engagement: Exceptional, Strong, Moderate, Building, Early Stage
- Used for brand partnership sections

---

## 3. Build Phase

EPK is constructed in a fixed order — every build follows the same sequence.

### Step 1: Template Selection
| Template | Audience | Key Sections |
|----------|----------|-------------|
| **Main EPK** | Media, labels, venues | Bio, stats, discography, timeline, press quotes, social |
| **Booking Kit** | Promoters, talent buyers | Performance packages, rider, stats, direct CTA |
| **Brand Kit** | Sponsors, partners | Value props, audience data, past collabs, inquiry CTA |

### Step 2: Foundation
```
1. Artist name + tagline + genre + hometown
2. Hero image (Pexels or custom upload)
3. Profile image (Pexels or custom upload)
4. Accent color (brand-aligned)
```

### Step 3: Content — Fixed Section Order
```
5. Stats bar        → must be populated
6. Bio section      → AI-enhance from raw intake
7. Music embeds     → YouTube video + Spotify player
8. Discography      → from intake or Spotify pull
9. Timeline         → from intake
10. Press quotes    → from intake or generated
11. Social links    → from intake
12. Booking CTA     → email/phone from intake
```

### Step 4: Polish
- Verify all sections populated
- Bio length check (150-300 words)
- Stats formatted consistently (e.g. "1.5M+" not "1500000")
- No empty sections in output

---

## 4. Export Phase

### Output Formats
| Format | Endpoint | Use Case |
|--------|----------|----------|
| Hosted page | `/epk/[slug]` | Shareable link |
| HTML download | `POST /api/export/html` | Self-host on any server |
| PDF | `POST /api/pdf/render` | Attach to emails/booking inquiries |
| One-sheeter | `lib/export/one-sheet.ts` | Internal overview document |

### Deploy Options
- **Vercel**: One-click deploy from builder dropdown
- **Netlify**: One-click deploy from builder dropdown
- **Self-host**: Download standalone HTML + upload anywhere

---

## 5. Quality Checklist

Before marking an EPK as complete, verify:

- [ ] Artist name correct (matching Spotify/DSP identity)
- [ ] Bio press-ready (third person, compelling, 150-300 words)
- [ ] Stats match scraped data (or explained if estimated)
- [ ] At least 3 releases in discography (or note "emerging")
- [ ] Social links resolve to real profiles
- [ ] Booking email is deliverable
- [ ] No placeholder text remains
- [ ] Template sections all filled (no empty safety)
- [ ] Accent color contrasts with background (WCAG AA)
- [ ] PDF renders without visual issues

---

## 6. Architecture Principles

Every EPK always produces the same structure — only content varies.

```
Blueprint (fixed)
└── Sections (fixed order, fixed IDs)
    ├── Hero        → content: name, tagline, images, color
    ├── Stats       → content: numbers from scrapers
    ├── Bio         → content: AI-enhanced text
    ├── Music       → content: embed IDs
    ├── Discography → content: releases array
    ├── Timeline    → content: events array
    ├── Press       → content: quotes array
    ├── Social      → content: links object
    ├── CTA         → content: email/phone
    └── Footer      → content: auto-generated
```

The blueprint guarantees every build is structurally identical.
Templates (Main/Booking/Brand) only change **layout and visual styling**,
never the underlying data architecture.
