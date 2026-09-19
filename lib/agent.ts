import type { EPKData, EPKTemplate } from "./types";
import { BLUEPRINT_BUILD_ORDER } from "./epk-blueprint";

// ── System prompt for the EPK Agent ───────────────────────────────────────────
export const AGENT_SYSTEM_PROMPT = `YOU ARE AN EPK INTERVIEWER AND MUSIC PUBLICIST. YOUR ONE JOB IS TO COLLECT DATA AND BUILD A PRESS KIT.

INTENT CLASSIFICATION — before processing ANY user message, classify it:
- GREETING / INTENT ("build my EPK", "hi", "get started") → Welcome them, ask for artist name. NEVER set any EPK fields from intent statements.
- DATA (a name, a genre word, a city, a link) → Extract the data, call update_epk, confirm, and ask the next question.
- QUESTION ("what templates do you have?") → Answer it, then ask the next interview question.
- If unsure whether text is data or intent, ASK the user to clarify. Never guess.

CRITICAL — YOU MUST END EVERY SINGLE MESSAGE WITH A QUESTION. NO EXCEPTIONS.

Speak in 1-3 plain sentences. No markdown. No formatting. No bullet points. Just conversational English.

INTERVIEW FLOW — ask ONE question at a time, in this order:
1. Artist name
2. Genre (use ONLY these: Hip-Hop / Rap, R&B / Soul, Electronic / EDM, Pop, Alternative / Indie Pop, Rock / Metal, Acoustic / Folk, Country / Americana, Latin / Reggaeton, Afrobeats / World, Jazz / Classical, Ambient / Cinematic)
3. Hometown / current city
4. Artist type (vocalist, producer, DJ, rapper, songwriter, instrumentalist, band, etc.)
5. How long making music seriously
6. Biggest influences
7. Suggest a tagline, confirm before setting
8. Their story → then write a press-ready bio (third person, 2-3 paragraphs, 150-250 words, set via update_epk)
9. Press photos? If none, you'll use professional gradient placeholders
10. Music links (Spotify, YouTube, SoundCloud, Apple Music)
11. Social media handles + follower counts
12. Career milestones and highlights
13. Press, blogs, playlists, podcasts they've been on
14. Collaborators they've worked with
15. Manager + contact info
16. Label + contact info
17. Booking email and phone
18. Suggest template (main/booking/brand/one-sheet/media) + color palette
19. Booking kit only: technical rider (sound, lighting, backline)
20. "Anything else to adjust? Bio, colors, sections?"

SPOTIFY: When user gives a Spotify link, call fetch_spotify_data immediately. Auto-populate releases and stats. Confirm what was found and ask if anything is missing. DO NOT ask them to manually list songs.

SOCIAL MEDIA STATS — CRITICAL ANTI-HALLUCINATION RULES:
- When a user provides ANY social media URL, you MUST call scrape_social_profile immediately — BEFORE you say anything else
- Use ONLY the numbers returned by scrape_social_profile or fetch_spotify_data
- NEVER invent, guess, estimate, or approximate follower counts, subscriber numbers, or view counts
- If the scraper returns no data, tell the user "I wasn't able to pull your stats — what approximate numbers should I use?"
- The stats field in update_epk must ONLY contain scraped or user-reported numbers. Period.

GENRE RULES — CRITICAL:
- The genre field must ONLY be set to one of the 12 genres listed above, or a user-specified sub-genre
- NEVER set genre from an intent statement like "I want to build an EPK" or "I'd like a professional press kit"
- If a user says something like "I make music" or "I'm an artist" without specifying a genre, ASK them which genre fits
- If unsure, list the genre options and ask the user to pick

DATA DUMPS: If user pastes a block of text or links, parse everything, call update_epk for every field you can extract, acknowledge what you found, and ask what's still missing.

RULES:
- Always end with a question. Always.
- One question per message. Never list multiple.
- No markdown, no asterisks, no hashtags, no bullets.
- 1-3 short sentences.
- Call update_epk immediately after getting data.
- Write bios in third person, present tense, 150-250 words.
- NEVER fabricate streaming numbers, stats, or claims the artist hasn't made.`;

// ── Tool definition for Claude ────────────────────────────────────────────────
export const EPK_UPDATE_TOOL = {
  name: "update_epk",
  description:
    "Update the artist's Electronic Press Kit data. Call this to set or modify any field on the EPK. You can update one field at a time or multiple fields at once. Each call patches the existing EPK data — fields you don't include are left unchanged.",
  input_schema: {
    type: "object" as const,
    properties: {
      template: {
        type: "string",
        enum: ["main", "booking", "brand"],
        description: "EPK template type. main = full artist profile for media/labels. booking = for promoters with packages/rider. brand = for brand partnerships.",
      },
      artistName: {
        type: "string",
        description: "Artist or band name",
      },
      artistTagline: {
        type: "string",
        description: "Short tagline (e.g. 'The voice of a generation')",
      },
      artistType: {
        type: "string",
        description: "Type of artist: producer, vocalist, singer-songwriter, session musician, instrumentalist, engineer, DJ, band, or multiple",
      },
      yearsActive: {
        type: "string",
        description: "How many years they've been making music seriously",
      },
      influences: {
        type: "array",
        description: "List of musical influences and inspirations",
        items: { type: "string" },
      },
      genre: {
        type: "string",
        enum: ["Hip-Hop / Rap", "R&B / Soul", "Electronic / EDM", "Pop", "Alternative / Indie Pop", "Rock / Metal", "Acoustic / Folk", "Country / Americana", "Latin / Reggaeton", "Afrobeats / World", "Jazz / Classical", "Ambient / Cinematic"],
        description: "Music genre — must be one of the allowed values. If user specifies a sub-genre not in the list, pick the closest parent genre.",
      },
      hometown: {
        type: "string",
        description: "Artist's hometown (e.g. 'St. Louis, MO')",
      },
      bio: {
        type: "string",
        description: "Full artist bio (2-3 paragraphs, press-ready)",
      },
      shortBio: {
        type: "string",
        description: "1-2 sentence bio for quick intros",
      },
      heroImageUrl: {
        type: "string",
        description: "URL to hero/banner image (landscape, 16:9)",
      },
      profileImageUrl: {
        type: "string",
        description: "URL to profile/press photo (portrait or square)",
      },
      youtubeVideoId: {
        type: "string",
        description: "YouTube video ID for featured video embed",
      },
      spotifyArtistId: {
        type: "string",
        description: "Spotify artist ID for embed",
      },
      stats: {
        type: "object",
        description: "Audience stats (use human-readable strings like '1.5M+')",
        properties: {
          spotifyListeners: { type: "string" },
          youtubeSubscribers: { type: "string" },
          youtubeViews: { type: "string" },
          tiktokViews: { type: "string" },
          instagramFollowers: { type: "string" },
        },
      },
      releases: {
        type: "array",
        description: "Discography — list of releases",
        items: {
          type: "object",
          properties: {
            title: { type: "string" },
            type: { type: "string", enum: ["Album", "EP", "Single", "Mixtape"] },
            year: { type: "string" },
            tracks: { type: "number" },
            certification: { type: "string" },
            coverUrl: { type: "string" },
            streamingUrl: { type: "string" },
          },
          required: ["title", "type", "year"],
        },
      },
      timeline: {
        type: "array",
        description: "Career timeline milestones",
        items: {
          type: "object",
          properties: {
            year: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
          },
          required: ["year", "title", "description"],
        },
      },
      pressQuotes: {
        type: "array",
        description: "Press quotes/reviews",
        items: {
          type: "object",
          properties: {
            quote: { type: "string" },
            publication: { type: "string" },
            url: { type: "string" },
          },
          required: ["quote", "publication"],
        },
      },
      collaborators: {
        type: "array",
        description: "List of notable collaborators",
        items: { type: "string" },
      },
      brandPartners: {
        type: "array",
        description: "List of brand partners/sponsors",
        items: { type: "string" },
      },
      socialLinks: {
        type: "object",
        description: "Social media profile URLs",
        properties: {
          instagram: { type: "string" },
          twitter: { type: "string" },
          tiktok: { type: "string" },
          youtube: { type: "string" },
          spotify: { type: "string" },
          appleMusic: { type: "string" },
          facebook: { type: "string" },
          website: { type: "string" },
        },
      },
      bookingEmail: {
        type: "string",
        description: "Booking/contact email address",
      },
      bookingPhone: {
        type: "string",
        description: "Booking phone number",
      },
      managerName: {
        type: "string",
        description: "Manager's name",
      },
      managerContact: {
        type: "string",
        description: "Manager's email or phone",
      },
      labelName: {
        type: "string",
        description: "Record label name",
      },
      labelContact: {
        type: "string",
        description: "Label contact email or phone",
      },
      performancePackages: {
        type: "array",
        description: "Performance packages for booking template",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            capacity: { type: "string" },
            setLength: { type: "string" },
            features: { type: "array", items: { type: "string" } },
          },
          required: ["name", "capacity", "setLength", "features"],
        },
      },
      accentColor: {
        type: "string",
        description: "Custom accent color (hex)",
      },
    },
  },
};

// ── Web fetch tool ────────────────────────────────────────────────────────────
export const FETCH_PAGE_TOOL = {
  name: "fetch_page",
  description:
    "Fetch and read the text content of a web page. Use this to read press articles, news, blogs, Wikipedia, music reviews, or any URL the user provides. Returns the page's readable text content.",
  input_schema: {
    type: "object" as const,
    properties: {
      url: {
        type: "string",
        description: "The full URL to fetch (e.g. https://pitchfork.com/reviews/albums/... or https://en.wikipedia.org/wiki/...)",
      },
    },
    required: ["url"],
  },
};

// ── Add rider tool ────────────────────────────────────────────────────────────
export const ADD_RIDER_TOOL = {
  name: "add_rider",
  description:
    "Add a technical rider to the EPK's performance packages. Use this for booking kits when the artist needs to specify sound, lighting, backline, or hospitality requirements. Shows the selected rider items in the EPK.",
  input_schema: {
    type: "object" as const,
    properties: {
      riderType: {
        type: "string",
        enum: ["backline", "sound", "lighting", "hospitality"],
        description: "Type of technical rider",
      },
      level: {
        type: "string",
        enum: ["basic", "full"],
        description: "Basic (club) or full (festival/theater) rider",
      },
      notes: {
        type: "string",
        description: "Additional rider notes or special requirements",
      },
    },
    required: ["riderType", "level"],
  },
};

// ── Social scraper tool ───────────────────────────────────────────────────────
export const SOCIAL_SCRAPE_TOOL = {
  name: "scrape_social_profile",
  description:
    "Scrape engagement data from a social media profile URL. Supports Instagram, TikTok, YouTube, and Twitter/X. Returns follower count, following, engagement metrics, and profile info. Call this when the user provides a social media URL to get accurate stats for their EPK.",
  input_schema: {
    type: "object" as const,
    properties: {
      url: {
        type: "string",
        description: "Full social media profile URL (e.g. https://instagram.com/username, https://tiktok.com/@username, https://youtube.com/@channel)",
      },
    },
    required: ["url"],
  },
};

// ── Spotify fetch tool ─────────────────────────────────────────────────────────
export const SPOTIFY_FETCH_TOOL = {
  name: "fetch_spotify_data",
  description:
    "Fetch artist data from Spotify including discography (albums, singles), top tracks, genres, and follower count. Call this when the user provides a Spotify artist ID or URL. The data will be used to populate EPK fields automatically.",
  input_schema: {
    type: "object" as const,
    properties: {
      spotifyUrlOrId: {
        type: "string",
        description:
          "Spotify artist URL (e.g. https://open.spotify.com/artist/24CgJHK6T7C5OmUbiLLMjJ) or bare artist ID",
      },
    },
    required: ["spotifyUrlOrId"],
  },
};

// ── Message types ─────────────────────────────────────────────────────────────
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  epkPatches?: Partial<EPKData>[]; // patches applied during this message
}

// ── SSE event types ───────────────────────────────────────────────────────────
export type SSEEvent =
  | { type: "text"; content: string }
  | { type: "epk_update"; patch: Partial<EPKData> }
  | { type: "status"; status: "thinking" | "building" | "polishing" | "done" }
  | { type: "spotify_data"; data: Record<string, unknown> }
  | { type: "done" };

// ── Quick actions for the chat UI ─────────────────────────────────────────────
export const QUICK_ACTIONS = [
  {
    label: "Build my EPK",
    prompt: "Hi, I'd like to get started building my EPK.",
    icon: "sparkles",
    intent: "start",
  },
  {
    label: "Booking Kit",
    prompt: "I want to build a booking kit template. Let's start with my artist name.",
    icon: "calendar",
    intent: "booking",
  },
  {
    label: "Brand Kit",
    prompt: "I want to build a brand partnership kit. Let's start with my artist name.",
    icon: "handshake",
    intent: "brand",
  },
  {
    label: "Rewrite my bio",
    prompt: "Can you rewrite my artist bio to be more press-ready and professional?",
    icon: "pen",
    intent: "edit",
  },
  {
    label: "Browse Examples",
    prompt: "Show me example EPKs I can reference.",
    icon: "sparkles",
    intent: "examples",
  },
];
