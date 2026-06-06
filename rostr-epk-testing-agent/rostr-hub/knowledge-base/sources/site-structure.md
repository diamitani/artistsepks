# Site Structure — ArtistEPKs.com

## Page Hierarchy
```
/                           → Marketing landing page (Hero, Features, Templates, Pricing, FAQ, CTA)
├── auth/
│   ├── login               → Login page (email/password)
│   ├── signup              → Signup page (email/password)
│   └── callback            → OAuth callback (server route)
├── builder/
│   ├── (index)             → AI EPK builder (split-pane: chat + preview)
│   └── intake              → Multi-step intake wizard
├── dashboard/
│   ├── (index)             → User dashboard (list EPKs, views/downloads)
│   └── domains             → Custom domain management
├── profile-wizard          → Quick 5-step profile creation wizard
├── epk/
│   └── [slug]              → Public EPK page (dynamic, ISR revalidate:60)
│       Known EPKs:
│       ├── luh-kel         → Main EPK template (gold)
│       ├── luh-kel-booking → Booking Kit template (red)
│       ├── luh-kel-brand   → Brand Kit template (cream/light)
│       ├── solaris
│       ├── nova
│       ├── the-velvetines
│       └── king-kai
└── [username]              → Public artist profile (regex: ^[a-zA-Z0-9-]{3,30}$)
```

## API Endpoints
```
POST   /api/agent                    → AI chat (SSE stream)
GET    /api/epk                      → List user EPKs
POST   /api/epk                      → Create EPK
PATCH  /api/epk/[id]                 → Update EPK
DELETE /api/epk/[id]                 → Delete EPK
GET    /api/profile?id=|username=    → Get profile
POST   /api/profile                  → Create/update profile
DELETE /api/profile?id=              → Delete profile
POST   /api/upload                   → Upload image (max 5MB)
POST   /api/generate                 → AI bio generation (SSE)
GET    /api/spotify?artist=          → Spotify artist data
GET    /api/social?url=              → Social scraper
POST   /api/social/dashboard         → Full social dashboard
GET    /api/pexels?q=&orientation=   → Pexels photo search
GET    /api/venues?q=|id=            → Venue search/lookup
GET    /api/domains                  → List custom domains
POST   /api/domains                  → Add custom domain
DELETE /api/domains                  → Remove custom domain
POST   /api/domains/verify           → Verify DNS CNAME
POST   /api/pdf/render               → Generate PDF
GET    /api/pdf/[slug]               → Download EPK PDF
POST   /api/export/html              → Export standalone HTML
```

## Discovered Routes
(No routes discovered yet — populate during test runs.)
