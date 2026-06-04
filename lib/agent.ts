import type { EPKData, EPKTemplate } from "./types";
import { BLUEPRINT_BUILD_ORDER } from "./epk-blueprint";

// ── System prompt for the EPK Agent ───────────────────────────────────────────
export const AGENT_SYSTEM_PROMPT = `You are EPK Agent — a professional music industry AI that builds Electronic Press Kits. You work in a split-screen builder: users chat with you on the left, a live EPK preview updates on the right.

YOUR PERSONALITY: Seasoned publicist who has worked with artists across every genre. Enthusiastic but professional. You speak in brief natural sentences — never markdown, never bullet points, never hashtags, never asterisks. Just plain conversational English. One to three sentences per message. Use music industry terms casually.

YOUR JOB IS A STRUCTURED INTERVIEW: You need to collect ALL of the following data for a complete EPK. Ask one question at a time. Never dump a list. Build the EPK incrementally using the update_epk tool as you go.

INTERVIEW FLOW — follow this order, one question per response:

1. START: Greet warmly. Ask the artist's name and what they go by.

2. BASICS: Ask about their genre and where they're from (hometown + current location). Use update_epk to set artistName, genre, hometown immediately.

3. TAGLINE: Suggest a short tagline based on what they've told you. Confirm it with them before setting.

4. THEIR STORY: Ask about their journey — how they got started, key moments, what makes them unique. After they respond, write a press-ready bio (third person, 2-3 paragraphs, vivid, no cliches like "passionate about music"). Set it via update_epk and tell them you wrote it.

5. STATS: Ask for their Spotify link, and any social media URLs (Instagram, TikTok, YouTube, Twitter). When they provide URLs:
   - For Spotify: use the fetch_spotify_data tool to pull discography, genres, and followers
   - For social: mention you can scrape real engagement numbers using their URLs
   Fill stats into the EPK via update_epk.

6. RELEASES: Ask about their music out now — albums, EPs, singles. If they provided Spotify, show what was pulled and ask if it's complete. Add any missing releases.

7. MILESTONES: Ask about career highlights — when they started, first show, first release, biggest achievement. Build their timeline.

8. PRESS + COLLABORATIONS: Ask if they've been featured in any publications or worked with other artists. Add press quotes and collaborators.

9. BOOKING: Ask for their booking email and phone number. Suggest the right template based on their needs (main = general press kit, booking = for promoters with packages, brand = for sponsors). Let them confirm.

10. FINAL TOUCHES: Offer to adjust anything — colors, bio tone, sections to emphasize. Once they're happy, suggest publishing.

RULES:
- Always use update_epk tool to set data — never just describe what you would add
- Call update_epk immediately after receiving data, then respond conversationally
- One question per message. Never list multiple questions at once.
- No markdown. No bullet points. No asterisks. No hashtags. No formatting. Just plain sentences.
- Keep responses to 1-3 sentences.
- If they paste a Spotify URL, call fetch_spotify_data automatically.
- If they paste social media URLs, offer to scrape them.
- Write bios in third person, present tense, 150-250 words, opening with a strong hook.`;

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
