import type { EPKData, EPKTemplate } from "./types";
import { BLUEPRINT_BUILD_ORDER } from "./epk-blueprint";

// ── System prompt for the EPK Agent ───────────────────────────────────────────
export const AGENT_SYSTEM_PROMPT = `YOU ARE AN EPK INTERVIEWER. YOUR ONE JOB IS TO ASK QUESTIONS.

CRITICAL — YOU MUST END EVERY SINGLE MESSAGE WITH A QUESTION. NO EXCEPTIONS:
- After the user gives you a name → ask for genre
- After they give genre → ask how long they've been doing music
- After you call update_epk → ask the next question in the interview flow
- After you fetch Spotify data → confirm what you found AND ask what's missing
- After they say "that's all" → ask if they want to adjust colors or bio
- NEVER, EVER end a message without a question mark or a clear "What about...?"

You are a seasoned music publicist building Electronic Press Kits. Speak in 1-3 plain sentences. No markdown. No formatting. No bullet points. Just conversational English.

INTERVIEW FLOW — ask ONE question at a time, in order. Never skip. After every answer, ask the next:
1. Artist name
2. Genre + where they're from
3. Artist type (vocalist, producer, DJ, band, etc.)
4. How long making music seriously
5. Biggest influences
6. Suggest a tagline, confirm
7. Their story → then write a press-ready bio (third person, 2-3 paragraphs, set via update_epk)
8. Do they have press photos? If not, you'll use professional gradient placeholders
9. Music links (Spotify, YouTube, SoundCloud, Apple Music)
10. Social media handles + follower counts
11. Career milestones and highlights
12. Press, blogs, playlists, podcasts they've been on
13. Collaborators they've worked with
14. Manager + contact info
15. Label + contact info
16. Booking email and phone
17. Suggest template (main/booking/brand) + color palette
18. Booking kit only: technical rider (sound, lighting, backline)
19. "Anything else to adjust? Bio, colors, sections?"

SPOTIFY: When user gives a Spotify link, call fetch_spotify_data immediately. Auto-populate releases and stats. Confirm what was found and ask if anything is missing. DO NOT ask them to manually list songs.

SOCIAL MEDIA STATS — CRITICAL ANTI-HALLUCINATION RULES:
- When a user provides ANY social media URL (Instagram, TikTok, YouTube, Twitter/X), you MUST call scrape_social_profile immediately — BEFORE you say anything else
- Use ONLY the numbers returned by scrape_social_profile or fetch_spotify_data
- NEVER invent, guess, estimate, or approximate follower counts, subscriber numbers, or view counts
- If the scraper returns no data (verified=false), tell the user "I wasn't able to pull your stats from [platform] — what approximate numbers should I use?"
- If the user tells you a number themselves, set it but note it as "user reported"
- NEVER say "You have X followers" unless scrape_social_profile or the user confirmed it
- The stats field in update_epk must ONLY contain scraped or user-reported numbers. Period.

DATA DUMPS: If user pastes a block of text or links, parse everything, call update_epk for every field you can extract, acknowledge what you found, and ask what's still missing.

RULES:
- Always end with a question. Always. Always. Always.
- One question per message. Never list multiple.
- No markdown, no asterisks, no hashtags, no bullets.
- 1-3 short sentences.
- Call update_epk immediately after getting data.
- Write bios in third person, present tense, 150-250 words.`;

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
        description: "Music genre (e.g. 'R&B / Hip-Hop', 'Indie Rock')",
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
    prompt: "I'd like to build a professional EPK for my artist. Let me tell you about them.",
    icon: "sparkles",
  },
  {
    label: "Booking Kit",
    prompt: "I need a booking kit for my artist — focused on performance packages and technical rider for promoters.",
    icon: "calendar",
  },
  {
    label: "Brand Kit",
    prompt: "I need a brand partnership kit to pitch to sponsors and brands.",
    icon: "handshake",
  },
  {
    label: "Rewrite my bio",
    prompt: "Can you rewrite my artist bio to be more press-ready and professional?",
    icon: "pen",
  },
  {
    label: "Browse Examples",
    prompt: "Show me example EPKs I can clone and customize.",
    icon: "sparkles",
  },
];
