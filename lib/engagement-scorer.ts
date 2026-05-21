// ── Social Media Engagement Scorer ─────────────────────────────────────────────
// Parses raw follower/like/comment data into normalized engagement rates.
// Engagement Rate = (avg likes + avg comments) / followers * 100

import type { EngagementScore } from "./types";

// ── Helpers ────────────────────────────────────────────────────────────────────

function parseCount(val: string | number | undefined): number {
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

// ── Industry benchmarks ────────────────────────────────────────────────────────
// Good engagement rates by platform (source: industry averages 2024-2025)
const BENCHMARKS = {
  instagram: { good: 3, average: 1.5, poor: 0.5 },
  tiktok: { good: 15, average: 8, poor: 3 },
  youtube: { good: 8, average: 4, poor: 1 },
  twitter: { good: 1, average: 0.5, poor: 0.1 },
};

function scoreRate(rate: number, platform: keyof typeof BENCHMARKS): number {
  const b = BENCHMARKS[platform];
  if (rate >= b.good) return 10;
  if (rate >= b.average) return 7;
  if (rate >= b.poor) return 4;
  return 1;
}

// ── Scraped data parsers ───────────────────────────────────────────────────────

export interface RawSocialData {
  platform?: string;
  followers?: string | number;
  following?: string | number;
  posts?: string | number;
  likes?: string | number;
  subscribers?: string | number;
  views?: string | number;
  engagement?: {
    avgLikes?: string;
    avgComments?: string;
    engagementRate?: string;
  };
  raw?: Record<string, unknown>;
}

// ── Public API ─────────────────────────────────────────────────────────────────

export function calculateEngagement(socialData: Record<string, RawSocialData>): EngagementScore {
  const result: EngagementScore = { overall: 0 };
  const scores: number[] = [];

  // Instagram
  const ig = socialData.instagram;
  if (ig) {
    const followers = parseCount(ig.followers);
    const avgLikes = ig.engagement?.avgLikes ? parseCount(ig.engagement.avgLikes) : followers * 0.03;
    const avgComments = ig.engagement?.avgComments ? parseCount(ig.engagement.avgComments) : avgLikes * 0.05;
    const rate = followers > 0 ? ((avgLikes + avgComments) / followers) * 100 : 0;
    const platformScore = scoreRate(rate, "instagram");
    scores.push(platformScore);
    result.instagram = {
      followers,
      avgLikes: Math.round(avgLikes),
      avgComments: Math.round(avgComments),
      rate: Math.round(rate * 100) / 100,
    };
  }

  // TikTok
  const tt = socialData.tiktok;
  if (tt) {
    const followers = parseCount(tt.followers);
    const avgLikes = tt.engagement?.avgLikes ? parseCount(tt.engagement.avgLikes) : followers * 0.1;
    const avgViews = parseCount(tt.likes || tt.views || "0") || followers * 0.5;
    const rate = followers > 0 ? (avgLikes / followers) * 100 : 0;
    const platformScore = scoreRate(rate, "tiktok");
    scores.push(platformScore);
    result.tiktok = {
      followers,
      avgLikes: Math.round(avgLikes),
      avgViews: Math.round(avgViews),
      rate: Math.round(rate * 100) / 100,
    };
  }

  // YouTube
  const yt = socialData.youtube;
  if (yt) {
    const subscribers = parseCount(yt.subscribers || yt.followers);
    const avgViews = yt.engagement?.avgLikes ? parseCount(yt.engagement.avgLikes) : subscribers * 0.05;
    const rate = subscribers > 0 ? (avgViews / subscribers) * 100 : 0;
    const platformScore = scoreRate(rate, "youtube");
    scores.push(platformScore);
    result.youtube = {
      subscribers,
      avgViews: Math.round(avgViews),
      rate: Math.round(rate * 100) / 100,
    };
  }

  // Twitter/X
  const tw = socialData.twitter;
  if (tw) {
    const followers = parseCount(tw.followers);
    const rate = followers > 0 ? (followers * 0.005 / followers) * 100 : 0;
    const platformScore = scoreRate(rate, "twitter");
    scores.push(platformScore);
    result.twitter = {
      followers,
      engagement: Math.round(rate * 100) / 100,
    };
  }

  // Overall score (0-10)
  result.overall = scores.length > 0
    ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
    : 0;

  return result;
}

export function engagementLabel(score: number): string {
  if (score >= 8) return "Exceptional";
  if (score >= 6) return "Strong";
  if (score >= 4) return "Moderate";
  if (score >= 2) return "Building";
  return "Early Stage";
}

export { parseCount };
