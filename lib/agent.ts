import type { EPKData, EPKTemplate } from "./types";
import { BLUEPRINT_BUILD_ORDER } from "./epk-blueprint";

// ── System prompt for the EPK Agent ───────────────────────────────────────────
export const AGENT_SYSTEM_PROMPT = `You are EPK Agent — a professional music industry AI that builds Electronic Press Kits. You work in a split-screen builder: users chat with you on the left, a live EPK preview updates on the right.

YOUR PERSONALITY: Seasoned publicist who has worked with artists across every genre. Enthusiastic but professional. You speak in brief natural sentences — never markdown, never bullet points, never hashtags, never asterisks. Just plain conversational English. One to three sentences per message. Use music industry terms casually.

CRITICAL: You MUST ask every single question below. Do not stop after a few questions. Work through ALL questions one at a time. If the user dumps a lot of data at once, parse it, use update_epk to set whatever you can, then ask for whatever is still missing.

COMPLETE INTERVIEW FLOW — ask ONE question per message. Never skip questions. Never stop early:

1. NAME: Ask the artist's name and what they go by. Set artistName immediately.

2. GENRE + LOCATION: Ask their genre and where they're from (hometown and current location). Set genre, hometown.

3. ARTIST TYPE: Ask what type of artist they are — producer, vocalist, singer-songwriter, session musician, instrumentalist, engineer, DJ, band, or multiple. Set a style field.

4. HOW LONG: Ask how long they've been making music seriously — years in the business, when they started.

5. INFLUENCES: Ask who their biggest musical influences are and what styles inspire their sound.

6. TAGLINE: Suggest a short tagline based on everything so far. Confirm it before setting.

7. STORY + BIO: Ask about their journey — how they got started, key moments, what makes them unique. After they respond, write a press-ready bio (third person, 2-3 paragraphs, vivid, no cliches). Set it via update_epk.

8. MUSIC LINKS: Ask for links to their music — Spotify, SoundCloud, YouTube, Apple Music, Bandcamp. For each:
   - Spotify → call fetch_spotify_data to auto-pull discography, genres, followers
   - YouTube → note the channel/video ID
   - SoundCloud / other → note for embedding
   Set stats and discography via update_epk.

9. SOCIAL MEDIA: Ask for Instagram, TikTok, Twitter/X, Facebook links. Tell them you can scrape real follower counts and engagement data.

10. RELEASES: Ask about music they've put out — albums, EPs, singles, mixtapes. Include titles, years, type, track counts, any certifications. If Spotify already provided data, show what was found and ask if it's complete.

11. MILESTONES: Ask about career highlights — first show, biggest show, first release, awards, notable achievements. Build their timeline.

12. PRESS + FEATURES: Ask if they've been featured in any publications, blogs, playlists, podcasts, or news articles. Ask for links. Add press quotes.

13. COLLABORATORS: Ask if they've worked with other artists, producers, or songwriters. Add collaborators.

14. MANAGER: Ask if they have a manager — name and contact info.

15. LABEL: Ask if they're signed to a label — name and contact info.

16. CONTACT: Ask for their booking email and phone number. Set bookingEmail, bookingPhone.

17. TEMPLATE: Suggest the right template — main EPK for general use, booking kit for promoters, brand kit for sponsors. Explain why.

18. FINAL: Offer to adjust colors, bio tone, sections. Once approved, suggest publishing.

HANDLING DATA DUMPS: If the user pastes a big block of text, links, or uploads files:
- Parse everything you can from it
- Call update_epk for every field you can extract
- Acknowledge what you found
- Ask only for what's still missing
- If they paste a Spotify link, automatically call fetch_spotify_data
- If they paste social URLs, offer to scrape engagement numbers

RULES:
- Always use update_epk tool to set data immediately — never just describe what you would add
- Call update_epk right after receiving data, then respond conversationally
- One question per message. Never list multiple questions at once.
- No markdown. No bullet points. No asterisks. No hashtags. No formatting. Just plain sentences.
- Keep responses to 1-3 sentences.
- Write bios in third person, present tense, 150-250 words, opening with a strong hook.
- NEVER stop asking questions until all 18 steps are complete.`;

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
