// ── Social Dashboard ──────────────────────────────────────────────────────────
// Aggregates data from Spotify, social scrapers, and engagement scorer.

import { fetchSpotifyData } from "./spotify";
import { scrapeSocialProfile } from "./social-scraper";
import { calculateEngagement, engagementLabel } from "./engagement-scorer";

export interface SocialDashboard {
  spotify?: {
    followers: number;
    monthlyListeners: string;
    genres: string[];
    topTracks: Array<{ title: string; popularity: number }>;
    albums: Array<{ title: string; year: string; type: string }>;
    lastFetched: string;
  };
  instagram?: {
    followers: number;
    following: number;
    posts: number;
    avgLikes: number;
    avgComments: number;
    engagementRate: number;
    lastFetched: string;
  };
  tiktok?: {
    followers: number;
    likes: number;
    avgViews: number;
    engagementRate: number;
    lastFetched: string;
  };
  youtube?: {
    subscribers: number;
    views: number;
    avgViewsPerVideo: number;
    engagementRate: number;
    lastFetched: string;
  };
  engagementScore: {
    overall: number;
    label: string;
    perPlatform: Record<string, number>;
  };
  updatedAt: string;
}

export async function buildSocialDashboard(urls: {
  spotify?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
  twitter?: string;
}): Promise<SocialDashboard> {
  const result: SocialDashboard = {
    engagementScore: { overall: 0, label: "Not enough data", perPlatform: {} },
    updatedAt: new Date().toISOString(),
  };

  const promises: Promise<void>[] = [];

  // Spotify
  if (urls.spotify) {
    promises.push(
      fetchSpotifyData(urls.spotify)
        .then((data) => {
          if (data) {
            result.spotify = {
              followers: data.artist.followers,
              monthlyListeners: formatCount(data.artist.followers),
              genres: data.artist.genres,
              topTracks: data.topTracks.slice(0, 5).map((t) => ({ title: t.title, popularity: t.popularity })),
              albums: data.albums.map((a) => ({ title: a.title, year: a.releaseDate.slice(0, 4), type: a.type })),
              lastFetched: new Date().toISOString(),
            };
          }
        })
        .catch(() => {})
    );
  }

  // Social profiles via Obscura
  const socialUrls: Record<string, string> = {};
  if (urls.instagram) socialUrls.instagram = urls.instagram;
  if (urls.tiktok) socialUrls.tiktok = urls.tiktok;
  if (urls.youtube) socialUrls.youtube = urls.youtube;
  if (urls.twitter) socialUrls.twitter = urls.twitter;

  for (const [platform, url] of Object.entries(socialUrls)) {
    promises.push(
      scrapeSocialProfile(url)
        .then((data) => {
          const followers = data.followers ? parseNumber(data.followers) : 0;
          const likes = data.engagement?.avgLikes ? parseNumber(data.engagement.avgLikes) : 0;
          const comments = data.engagement?.avgComments ? parseNumber(data.engagement.avgComments) : 0;
          const rate = followers > 0 ? ((likes + comments) / followers) * 100 : 0;

          if (platform === "instagram") {
            result.instagram = {
              followers,
              following: data.following ? parseNumber(data.following) : 0,
              posts: data.posts ? parseNumber(data.posts) : 0,
              avgLikes: Math.round(likes),
              avgComments: Math.round(comments),
              engagementRate: Math.round(rate * 100) / 100,
              lastFetched: new Date().toISOString(),
            };
          } else if (platform === "tiktok") {
            result.tiktok = {
              followers,
              likes: parseNumber(data.engagement?.avgLikes || "0"),
              avgViews: parseNumber(data.raw?.metaDescription as string || "0"),
              engagementRate: Math.round(rate * 100) / 100,
              lastFetched: new Date().toISOString(),
            };
          } else if (platform === "youtube") {
            result.youtube = {
              subscribers: followers,
              views: parseNumber(data.engagement?.avgLikes || "0"),
              avgViewsPerVideo: Math.round(likes),
              engagementRate: Math.round(rate * 100) / 100,
              lastFetched: new Date().toISOString(),
            };
          }
        })
        .catch(() => {})
    );
  }

  await Promise.allSettled(promises);

  // Calculate overall engagement
  const socialData: Record<string, unknown> = {};
  if (result.instagram) {
    socialData.instagram = {
      followers: result.instagram.followers,
      engagement: { avgLikes: result.instagram.avgLikes, avgComments: result.instagram.avgComments },
    };
  }
  if (result.tiktok) {
    socialData.tiktok = {
      followers: result.tiktok.followers,
      engagement: { avgLikes: result.tiktok.likes },
    };
  }
  if (result.youtube) {
    socialData.youtube = {
      followers: result.youtube.subscribers,
      engagement: { avgLikes: result.youtube.avgViewsPerVideo },
    };
  }

  if (Object.keys(socialData).length > 0) {
    const scores = calculateEngagement(socialData as any);
    result.engagementScore = {
      overall: scores.overall,
      label: engagementLabel(scores.overall),
      perPlatform: {
        ...(scores.instagram ? { instagram: scores.instagram.rate } : {}),
        ...(scores.tiktok ? { tiktok: scores.tiktok.rate } : {}),
        ...(scores.youtube ? { youtube: scores.youtube.rate } : {}),
      },
    };
  }

  return result;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function parseNumber(val: string | number | undefined): number {
  if (typeof val === "number") return val;
  if (!val) return 0;
  const str = val.replace(/[^0-9.\-KMNB]/g, "").trim();
  const num = parseFloat(str);
  if (isNaN(num)) return 0;
  if (str.toUpperCase().includes("B")) return num * 1_000_000_000;
  if (str.toUpperCase().includes("M")) return num * 1_000_000;
  if (str.toUpperCase().includes("K")) return num * 1_000;
  return num;
}
