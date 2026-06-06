# Test Cases — ROSTR EPK Testing Agent

## Manual Test Cases

### Landing Page
| # | Test | Expected |
|---|---|---|
| 1 | GET / returns 200 | 200 OK |
| 2 | Page contains "ArtistEPKs" | Present in body |
| 3 | Page contains "Features" section | Present in body |
| 4 | Page contains "Templates" section | Present in body |
| 5 | Page contains "Pricing" section | Present in body |
| 6 | Page contains "FAQ" section | Present in body |
| 7 | Page contains CTA / "Build" button | Present in body |

### Public EPK Pages
| # | Test | Expected |
|---|---|---|
| 8 | GET /epk/luh-kel (Main EPK) | 200, "Luh Kel" |
| 9 | GET /epk/luh-kel-booking (Booking Kit) | 200, "Luh Kel" |
| 10 | GET /epk/luh-kel-brand (Brand Kit) | 200, "Luh Kel" |
| 11 | GET /epk/solaris | 200 |
| 12 | GET /epk/nova | 200 |
| 13 | GET /epk/the-velvetines | 200 |
| 14 | GET /epk/king-kai | 200 |
| 15 | GET /epk/nonexistent-slug | 404 (not 500) |

### Public Profiles
| # | Test | Expected |
|---|---|---|
| 16 | GET /luh-kel | 200, "Luh Kel" |
| 17 | GET /ab (too short) | 404 |
| 18 | GET /a-b (too short) | 404 |
| 19 | GET /!@# (special chars) | 404 |
| 20 | GET /nonexistent-user | 404 (not 500) |

### API Endpoints
| # | Test | Expected |
|---|---|---|
| 21 | GET /api/epk | 200 or 401 |
| 22 | GET /api/profile?username=luh-kel | 200 |
| 23 | GET /api/venues?q=studio | 200 |
| 24 | GET /api/venues?id=1 | 200 |
| 25 | GET /api/domains | 200 or 401 |
| 26 | POST /api/epk (create) | 200 |
| 27 | POST /api/profile (update) | 200 |
| 28 | POST /api/upload | 200 |
| 29 | POST /api/generate | 200 |
| 30 | POST /api/export/html | 200 |
| 31 | POST /api/pdf/render | 200 |
| 32 | GET /api/pdf/luh-kel | 200 |
| 33 | POST /api/social/dashboard | 200 |
| 34 | POST /api/domains/verify | 200 |

### Builder
| # | Test | Expected |
|---|---|---|
| 35 | GET /builder (follow redirects) | 200 |
| 36 | GET /builder/intake | 200 |
| 37 | GET /dashboard | 200 |
| 38 | GET /profile-wizard | 200 |
| 39 | POST /api/agent (chat) | SSE stream or JSON |

### Auth
| # | Test | Expected |
|---|---|---|
| 40 | GET /auth/login | 200, contains "Login" |
| 41 | GET /auth/signup | 200, contains "Sign Up" |
| 42 | GET /dashboard (unauthenticated) | 307 redirect or 200 demo |
| 43 | GET /builder (unauthenticated) | 307 redirect or 200 demo |

### Exports
| # | Test | Expected |
|---|---|---|
| 44 | POST /api/export/html (HTML) | 200, HTML content |
| 45 | POST /api/pdf/render (PDF gen) | 200 |
| 46 | GET /api/pdf/luh-kel (PDF dl) | 200 |

### Integrations
| # | Test | Expected |
|---|---|---|
| 47 | GET /api/spotify?artist=Luh Kel | 200 or 5xx (key needed) |
| 48 | GET /api/pexels?q=concert | 200 or 5xx (key needed) |
| 49 | POST /api/social/dashboard | 200 |

### Error Handling
| # | Test | Expected |
|---|---|---|
| 50 | POST /api/epk with empty body | 4xx (not 5xx) |
| 51 | POST /api/epk with invalid JSON | 4xx (not 5xx) |
| 52 | GET /builder/nonexistent | 404 |
| 53 | GET /auth/nonexistent | 404 |
| 54 | GET /epk/ (empty slug) | 404 |

## Total: 54 test cases
