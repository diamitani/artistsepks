// ── Composite Profile Builder ──────────────────────────────────────────────────
// Combines intake data + scraped social/Spotify data + engagement scoring
// into a complete artist profile that feeds the EPK builder.

import type { ArtistProfile, Release, EngagementScore } from "./types";
import type { RawSocialData } from "./engagement-scorer";
import { calculateEngagement, parseCount } from "./engagement-scorer";

// ── Build enriched profile ─────────────────────────────────────────────────────

export interface CompositeProfile {
  profile: ArtistProfile;
  engagementScore: EngagementScore;
  discography: Release[];
  stats: {
    spotifyListeners?: string;
    youtubeSubscribers?: string;
    youtubeViews?: string;
    tiktokFollowers?: string;
    tiktokViews?: string;
    instagramFollowers?: string;
  };
  oneSheet: {
    artistOverview: string;
    brandIdentity: string;
    careerStage: string;
    topAchievements: string[];
    engagementGrade: string;
    recommendedNext: string[];
  };
}

export function buildCompositeProfile(profile: ArtistProfile): CompositeProfile {
  // 1. Engagement scoring
  const engagementScore = calculateEngagement(profile.enriched.socialMedia as Record<string, RawSocialData>);

  // 2. Stats aggregation from scraped data
  const stats: CompositeProfile["stats"] = {};
  const ig = profile.enriched.socialMedia.instagram as any;
  const tt = profile.enriched.socialMedia.tiktok as any;
  const yt = profile.enriched.socialMedia.youtube as any;
  const tw = profile.enriched.socialMedia.twitter as any;
  const sp = profile.enriched.spotify as any;

  if (sp?.artist?.followers) stats.spotifyListeners = `${Math.round(sp.artist.followers / 1000)}K+`;
  if (sp?.artist?.followers && sp.artist.followers > 1_000_000) stats.spotifyListeners = `${(sp.artist.followers / 1_000_000).toFixed(1)}M+`;
  if (yt?.subscribers) stats.youtubeSubscribers = String(yt.subscribers);
  if (yt?.views || yt?.engagement?.avgLikes) stats.youtubeViews = String(yt.views || yt.engagement?.avgLikes);
  if (tt?.followers) stats.tiktokFollowers = String(tt.followers);
  if (tt?.likes) stats.tiktokViews = String(tt.likes);
  if (ig?.followers) stats.instagramFollowers = String(ig.followers);

  // 3. One-sheeter content
  const stageLabels = [
    { max: 1, label: "Emerging" },
    { max: 3, label: "Developing" },
    { max: 7, label: "Established" },
    { max: 15, label: "Veteran" },
  ];
  const careerStage = stageLabels.find((s) => profile.background.yearsInBusiness <= s.max)?.label || "Industry Leader";

  const formatCount = (v?: string | number): string => {
    const n = parseCount(v);
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return String(Math.round(n));
  };

  const topAchievements: string[] = [];
  if (stats.spotifyListeners) topAchievements.push(`${stats.spotifyListeners} Spotify listeners`);
  if (stats.instagramFollowers) topAchievements.push(`${stats.instagramFollowers} Instagram followers`);
  if (stats.youtubeSubscribers) topAchievements.push(`${stats.youtubeSubscribers} YouTube subscribers`);
  if (profile.enriched.discography.length > 0) topAchievements.push(`${profile.enriched.discography.length} releases`);
  if (profile.goals.primaryGoal) topAchievements.push(`Goal: ${profile.goals.primaryGoal}`);

  // Recommended next steps based on gaps
  const recommendedNext: string[] = [];
  if (!profile.assets.hasPro) recommendedNext.push("Register with a PRO (ASCAP/BMI/SESAC)");
  if (!profile.assets.hasCopyrights) recommendedNext.push("Copyright your original works");
  if (!profile.assets.hasSplitSheets) recommendedNext.push("Create split sheets for all collaborations");
  if (!profile.assets.hasEin) recommendedNext.push("Get an EIN for your music business");
  if (!profile.assets.businessEntity || profile.assets.businessEntity === "none") recommendedNext.push("Form an LLC or Corp for liability protection");
  if (!profile.resources.teamMembers.length) recommendedNext.push("Build your team: manager, publicist, producer");
  if (!stats.instagramFollowers && !stats.spotifyListeners) recommendedNext.push("Set up and claim your DSP profiles");
  if (engagementScore.overall < 4) recommendedNext.push("Focus on building social engagement before major outreach");

  return {
    profile,
    engagementScore,
    discography: profile.enriched.discography,
    stats,
    oneSheet: {
      artistOverview: `${profile.background.artistName} is ${profile.background.isProfessional ? "a professional" : "an aspiring"} ${profile.background.genre} artist from ${profile.background.location}. ${profile.background.style ? `Style: ${profile.background.style}.` : ""} ${profile.background.themes.length ? `Themes: ${profile.background.themes.join(", ")}.` : ""}`,
      brandIdentity: profile.background.influences.length
        ? `${profile.background.artistName} draws from ${profile.background.influences.join(", ")}. ${profile.background.energy ? `Energy: ${profile.background.energy}.` : ""}`
        : "Brand identity in development.",
      careerStage,
      topAchievements,
      engagementGrade: engagementScore.overall >= 6 ? "Strong" : engagementScore.overall >= 3 ? "Building" : "Early",
      recommendedNext,
    },
  };
}
