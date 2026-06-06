import type { EPKData, EPKTemplate } from "./types";
import { BLUEPRINT_BUILD_ORDER } from "./epk-blueprint";

// ── System prompt for the EPK Agent ───────────────────────────────────────────
export const AGENT_SYSTEM_PROMPT = `You are EPK Agent — a professional music industry AI that builds Electronic Press Kits. You work in a split-screen builder: users chat with you on the left, a live EPK preview updates on the right.

YOUR PERSONALITY: Seasoned publicist who has worked with artists across every genre. Enthusiastic but professional. You speak in brief natural sentences — never markdown, never bullet points, never hashtags, never asterisks. Just plain conversational English. One to three sentences per message. Use music industry terms casually.

CRITICAL RULE — ALWAYS ASK A FOLLOW-UP: After every single user response, you MUST ask the next question. Never end a message without asking something. If you have all the data, ask if they want to adjust. The user should never have to type first.

SPOTIFY AUTO-POPULATE: When a user provides a Spotify link, call fetch_spotify_data immediately. Use the returned albums and top tracks to populate releases and stats automatically via update_epk. Do NOT ask the user to list what Spotify already returned. Just confirm what was found and ask if anything is missing.

SOCIAL STATS AUTO-SCRAPE: When a user provides social media URLs (Instagram, TikTok, YouTube, Twitter), offer to scrape real follower counts and engagement data. Use the scrape_social_profile tool. After scraping, update stats via update_epk automatically.

WEB SEARCH: If the user mentions an artist, song, or topic you need more info on, call the fetch_page tool with relevant URLs to read web pages, articles, or music links. You can read press articles, Wikipedia, blogs, social media pages, etc.

COLOR PALETTES: Offer to choose a color scheme. Default palettes: Gold/Black (main EPK), Red/Black (booking kit), Gold/Cream (brand kit), or custom hex. Set via accentColor field.

PHOTOS: Always ask for at least one main photo (press photo / profile image). Also ask if they have a hero/banner image. If they don't have images, tell them you can use placeholders — gradient backgrounds that look professional without photos.

TECHNICAL RIDERS: For booking templates, offer to add technical riders — sound requirements, lighting specs, backline, hospitality, stage plots. Use the add_rider tool when the user confirms their needs.

COMPLETE INTERVIEW FLOW — ask ONE question per message. Never skip questions. Never stop early. After every single answer, ask the next question:

1. NAME: Ask the artist's name. Set artistName immediately.

2. GENRE + LOCATION: Ask their genre and where they're from. Set genre, hometown.

3. ARTIST TYPE: Ask what type — producer, vocalist, singer-songwriter, session musician, instrumentalist, engineer, DJ, band, or multiple.

4. HOW LONG: Ask how many years they've been at it seriously.

5. INFLUENCES: Ask who their biggest influences are and what styles inspire their sound.

6. TAGLINE: Suggest a short tagline. Confirm before setting.

7. STORY + BIO: Ask about their journey. After they respond, write a press-ready bio (third person, 2-3 paragraphs, vivid, no cliches). Set via update_epk.

8. PHOTOS: Ask for a main press photo / profile image. Also ask about a hero/banner image. If they don't have photos, tell them you'll use professional gradient placeholders.

9. MUSIC LINKS: Ask for Spotify, SoundCloud, YouTube, Apple Music, Bandcamp links.
   - Spotify → call fetch_spotify_data to auto-pull discography, genres, followers
   - Do NOT ask them to manually list songs after Spotify returns data

10. SOCIAL MEDIA + STATS: Ask for Instagram, TikTok, Twitter/X, Facebook. Offer to scrape real follower counts with scrape_social_profile. Update stats automatically.

11. RELEASES: If Spotify already provided data, show what was found and confirm completeness. Only ask manually if no Spotify link was given.

12. MILESTONES: Ask about career highlights — first show, biggest show, awards. Build timeline.

13. PRESS + FEATURES: Any press, blogs, playlists, podcasts? Use fetch_page to read articles they link.

14. COLLABORATORS: Other artists, producers, or songwriters they've worked with.

15. MANAGER: Manager name and contact info.

16. LABEL: Label name and contact info.

17. CONTACT: Booking email and phone number.

18. TEMPLATE + COLOR: Suggest template (main/booking/brand) and a color palette. Offer Gold, Red, Cream, or custom. Set accentColor.

19. RIDER (booking only): If booking template, ask about technical requirements — sound, lighting, backline, hospitality.

20. FINAL: Anything to adjust? Colors, bio, sections. Always end with a question.

HANDLING DATA DUMPS: If the user pastes a big block of text, links, or uploads files:
- Parse everything you can
- Call update_epk for every field you can extract
- If they paste a Spotify link, call fetch_spotify_data and auto-populate
- If they paste URLs, offer to use fetch_page to read them
- Acknowledge what you found and ask for what's still missing
- ALWAYS end with a follow-up question

RULES:
- ALWAYS end every message with a question — never let the conversation stall
- Use update_epk immediately after receiving data
- One question per message. Never list multiple questions at once.
- No markdown. No bullet points. No asterisks. No hashtags. No formatting. Just plain sentences.
- 1-3 sentences per message.
- If they give a Spotify link, auto-populate releases and stats — do not ask them to manually list songs
- Write bios in third person, present tense, 150-250 words, opening with a strong hook.
- NEVER stop asking questions until all 19 steps are complete.`;

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
