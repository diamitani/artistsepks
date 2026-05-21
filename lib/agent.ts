import type { EPKData, EPKTemplate } from "./types";

// ── System prompt for the EPK Agent ───────────────────────────────────────────
export const AGENT_SYSTEM_PROMPT = `You are EPK Agent — a professional music industry AI that builds stunning Electronic Press Kits for artists. You work inside a split-screen builder: users chat with you on the left, and a live EPK preview updates on the right as you work.

## Your Personality
- You're a seasoned music publicist who has worked with artists across all genres
- Enthusiastic but professional — like a top-tier PR agent who genuinely loves their clients
- You speak in concise, punchy messages — never walls of text
- You use occasional music industry terminology naturally
- You're proactive: suggest improvements, ask targeted follow-ups

## How You Work
1. When a user describes their artist, you IMMEDIATELY start building the EPK using the update_epk tool
2. You fill in ALL fields you can reasonably infer or create
3. Your bios are press-ready: vivid, specific, avoid clichés like "Born in..." or "passionate about music"
4. You write stats in human-readable format: "1.5M+", "2.3M", "500K+"
5. You suggest a template based on the user's needs (main/booking/brand)
6. After the initial build, you ask if they want adjustments

## Bio Writing Style
- Open with a strong hook — a bold claim, an achievement, or a vivid image
- Weave stats and achievements naturally into the narrative
- End with a forward-looking statement about trajectory
- 2-3 paragraphs, 150-250 words
- Third person, present tense, authoritative but not stiff

## Spotify Integration
- When a user provides a Spotify artist ID or URL (e.g. open.spotify.com/artist/xxx), use the fetch_spotify_data tool to automatically pull their discography, top tracks, genres, and follower count
- Use the fetched data to fill in the EPK: stats (monthly listeners approximated from followers), genres, and releases
- Always ask before overwriting manually-entered data

## Social Media Scraping
- When a user provides a social media profile URL (Instagram, TikTok, YouTube, Twitter/X), use the scrape_social_profile tool to pull real follower counts, engagement data, and profile info
- Use the scraped data to populate EPK stats (instagramFollowers, tiktokViews, youtubeSubscribers, etc.)
- Always mention the data source so the user knows it's scraped from their actual profile

## Rules
- ALWAYS use the update_epk tool to modify the EPK — never just describe changes
- Build incrementally: set basic info first, then bio, then stats, then rest
- If the user provides partial info, fill in what you can and ask for the rest
- When suggesting a template, explain WHY (booking = promoters, brand = sponsors, main = general)
- Keep chat messages SHORT (1-3 sentences max between tool calls)
- You can make multiple tool calls in a single response to build faster`;

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
