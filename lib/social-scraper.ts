// ── HTTP-based Social Media Scraper ──────────────────────────────────────────
// No Obscura/Puppeteer needed. Uses fetch + meta tag parsing.
// All platforms: Instagram, TikTok, YouTube, Twitter/X

export type Platform = "instagram" | "tiktok" | "youtube" | "twitter" | "unknown";

export interface SocialProfile {
  platform: Platform;
  handle: string;
  url: string;
  displayName?: string;
  followers?: string;
  following?: string;
  posts?: string;
  subscribers?: string;
  totalViews?: string;
  bio?: string;
  avatarUrl?: string;
  verified: boolean; // was the data actually scraped or is it a fallback?
  rawDescription?: string;
}

function detectPlatform(url: string): Platform {
  if (url.includes("instagram.com")) return "instagram";
  if (url.includes("tiktok.com")) return "tiktok";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("twitter.com") || url.includes("x.com")) return "twitter";
  return "unknown";
}

function extractHandle(url: string, platform: Platform): string {
  try {
    const u = new URL(url.startsWith("http") ? url : "https://" + url);
    const path = u.pathname.replace(/\/$/, "");
    const parts = path.split("/").filter(Boolean);
    // @handle on TikTok/YouTube, bare handle on Instagram/Twitter
    return parts[0]?.replace(/^@/, "") || "";
  } catch {
    return url.replace(/https?:\/\//, "").split("/")[1]?.replace(/^@/, "") || "";
  }
}

// ── HTTP fetch with browser-like headers ─────────────────────────────────────

async function fetchPage(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
    });

    clearTimeout(timer);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return await res.text();
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

// ── Meta tag + JSON-LD extraction ────────────────────────────────────────────

interface ParsedMeta {
  description: string;
  title: string;
  image: string;
  jsonLd: Record<string, unknown> | null;
}

function parseMeta(html: string): ParsedMeta {
  const getMeta = (name: string, prop = false): string => {
    const attr = prop ? "property" : "name";
    const regex = new RegExp(
      `<meta[^>]*${attr}=["']${name}["'][^>]*content=["']([^"']*)["']`,
      "i"
    );
    const match = html.match(regex);
    return match?.[1] || "";
  };

  // Try JSON-LD for structured data
  let jsonLd: Record<string, unknown> | null = null;
  const jsonLdMatch = html.match(
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i
  );
  if (jsonLdMatch) {
    try {
      jsonLd = JSON.parse(jsonLdMatch[1]);
    } catch {
      // ignore parse errors
    }
  }

  return {
    description: getMeta("description") || getMeta("og:description", true),
    title: getMeta("og:title", true) || getMeta("title"),
    image: getMeta("og:image", true),
    jsonLd,
  };
}

// ── Per-platform scrapers ────────────────────────────────────────────────────

async function scrapeInstagram(url: string, handle: string): Promise<SocialProfile> {
  const html = await fetchPage(
    `https://www.instagram.com/${handle}/`
  );
  const meta = parseMeta(html);

  // Instagram's og:description: "123K Followers, 456 Following, 789 Posts - See photos..."
  const desc = meta.description;
  const followerMatch = desc.match(/([\d,.KMNB]+)\s*Followers?/i);
  const followingMatch = desc.match(/([\d,.KMNB]+)\s*Following/i);
  const postsMatch = desc.match(/([\d,.KMNB]+)\s*Posts?/i);

  return {
    platform: "instagram",
    handle,
    url,
    displayName: meta.title?.replace(/\s*\(@[\w.]+\)\s*on.*/i, "").trim() || handle,
    followers: followerMatch?.[1] || undefined,
    following: followingMatch?.[1] || undefined,
    posts: postsMatch?.[1] || undefined,
    bio: meta.description?.split(" - See ")[0] || undefined,
    avatarUrl: meta.image || undefined,
    verified: !!(followerMatch || followingMatch || postsMatch),
    rawDescription: meta.description,
  };
}

async function scrapeYouTube(url: string, handle: string): Promise<SocialProfile> {
  const fetchUrl = handle.startsWith("UC")
    ? `https://www.youtube.com/channel/${handle}/about`
    : `https://www.youtube.com/@${handle}/about`;

  const html = await fetchPage(fetchUrl);
  const meta = parseMeta(html);

  // YouTube og:description: "123K subscribers, 456 videos, 789K views..."
  const desc = meta.description;
  const subMatch = desc.match(/([\d,.KMNB]+)\s*subscriber/i);
  const viewMatch = desc.match(/([\d,.KMNB]+)\s*view/i);
  const videoMatch = desc.match(/([\d,.KMNB]+)\s*video/i);

  // Also try JSON-LD for channel data
  let fromJsonLd: Partial<SocialProfile> = {};
  if (meta.jsonLd) {
    const ld = meta.jsonLd;
    const interaction = (ld as any)?.interactionStatistic;
    if (Array.isArray(interaction)) {
      for (const stat of interaction) {
        if (stat.interactionType?.includes("Subscribe")) {
          fromJsonLd.subscribers = formatCount(stat.userInteractionCount);
        }
      }
    }
  }

  return {
    platform: "youtube",
    handle,
    url,
    displayName: meta.title?.replace(/\s*- YouTube\s*$/i, "").trim() || handle,
    subscribers: subMatch?.[1] || fromJsonLd.subscribers || undefined,
    totalViews: viewMatch?.[1] || undefined,
    posts: videoMatch?.[1] || undefined,
    avatarUrl: meta.image || undefined,
    verified: !!(subMatch || fromJsonLd.subscribers),
    rawDescription: meta.description,
  };
}

async function scrapeTikTok(url: string, handle: string): Promise<SocialProfile> {
  const html = await fetchPage(`https://www.tiktok.com/@${handle}`);
  const meta = parseMeta(html);

  // TikTok og:description: "123M Followers, 456M Likes - Watch videos..."
  const desc = meta.description;
  const followerMatch = desc.match(/([\d,.KMNB]+)\s*Followers?/i);
  const likesMatch = desc.match(/([\d,.KMNB]+)\s*Likes?/i);

  return {
    platform: "tiktok",
    handle,
    url,
    displayName: meta.title?.replace(/\s*\(@[\w.]+\).*/i, "").trim() || handle,
    followers: followerMatch?.[1] || undefined,
    posts: likesMatch?.[1] || undefined,
    avatarUrl: meta.image || undefined,
    verified: !!(followerMatch),
    rawDescription: meta.description,
  };
}

async function scrapeTwitter(url: string, handle: string): Promise<SocialProfile> {
  const html = await fetchPage(`https://x.com/${handle}`);
  const meta = parseMeta(html);

  const desc = meta.description;
  const followerMatch = desc.match(/([\d,.KMNB]+)\s*Followers?/i);

  return {
    platform: "twitter",
    handle,
    url,
    displayName: meta.title?.replace(/\s*on X.*/i, "").trim() || handle,
    followers: followerMatch?.[1] || undefined,
    avatarUrl: meta.image || undefined,
    verified: !!(followerMatch),
    rawDescription: meta.description,
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatCount(n: number | undefined): string | undefined {
  if (!n) return undefined;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

// ── Public API ───────────────────────────────────────────────────────────────

export async function scrapeSocialProfile(url: string): Promise<SocialProfile> {
  const platform = detectPlatform(url);
  if (platform === "unknown") {
    throw new Error(
      `Unsupported platform: ${url}. Supported: Instagram, TikTok, YouTube, Twitter/X`
    );
  }

  const handle = extractHandle(url, platform);
  if (!handle) {
    throw new Error(`Could not extract handle from URL: ${url}`);
  }

  try {
    switch (platform) {
      case "instagram":
        return await scrapeInstagram(url, handle);
      case "youtube":
        return await scrapeYouTube(url, handle);
      case "tiktok":
        return await scrapeTikTok(url, handle);
      case "twitter":
        return await scrapeTwitter(url, handle);
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    // Return a profile indicating scrape failure — caller can check .verified
    return {
      platform,
      handle,
      url,
      verified: false,
      rawDescription: `Scrape failed: ${message}`,
    };
  }
}

export { detectPlatform, extractHandle };
