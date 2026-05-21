export type EPKTemplate = "main" | "booking" | "brand";

export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  youtube?: string;
  spotify?: string;
  appleMusic?: string;
  facebook?: string;
  website?: string;
  bandcamp?: string;
  soundcloud?: string;
}

export interface Stats {
  spotifyListeners?: string;
  youtubeSubscribers?: string;
  youtubeViews?: string;
  tiktokViews?: string;
  instagramFollowers?: string;
}

export interface Release {
  title: string;
  type: "Album" | "EP" | "Single" | "Mixtape";
  year: string;
  tracks?: number;
  certification?: string;
  coverUrl?: string;
  streamingUrl?: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface PressQuote {
  quote: string;
  publication: string;
  url?: string;
}

export interface PerformancePackage {
  name: string;
  capacity: string;
  setLength: string;
  features: string[];
}

export interface EPKData {
  id?: string;
  slug?: string;
  template: EPKTemplate;
  // Artist info
  artistName: string;
  artistTagline?: string;
  genre?: string;
  hometown?: string;
  // Content
  bio: string;
  shortBio?: string;
  // Media
  heroImageUrl?: string;
  profileImageUrl?: string;
  youtubeVideoId?: string;
  spotifyArtistId?: string;
  // Stats
  stats: Stats;
  // Releases
  releases: Release[];
  // Timeline
  timeline: TimelineEvent[];
  // Press
  pressQuotes: PressQuote[];
  // Collaborators
  collaborators?: string[];
  // Brand partners
  brandPartners?: string[];
  // Social
  socialLinks: SocialLinks;
  // Booking
  bookingEmail?: string;
  bookingPhone?: string;
  performancePackages?: PerformancePackage[];
  // Theme
  accentColor?: string;
  // Meta
  createdAt?: string;
  updatedAt?: string;
}

export const EMPTY_EPK: EPKData = {
  template: "main",
  artistName: "",
  bio: "",
  stats: {},
  releases: [],
  timeline: [],
  pressQuotes: [],
  socialLinks: {},
};

// ═══════════════════════════════════════════════════════════════════════════════
// ARTIST PROFILE — full intake data model
// ═══════════════════════════════════════════════════════════════════════════════

export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  website: string;
  managerName: string;
  managerContact: string;
  label: string;
  labelContact: string;
}

export interface ArtistBackground {
  artistName: string;
  stageName: string;
  location: string;
  hometown: string;
  yearsInBusiness: number;
  isProfessional: boolean;
  genre: string;
  style: string;
  themes: string[];
  energy: string;
  influences: string[];
  bio: string;
}

export interface ArtistGoals {
  primaryGoal: string;
  performanceFrequency: string;
  streamingTarget: string;
  revenueTarget: string;
  wantsDistribution: boolean;
  wantsSyncLicensing: boolean;
  wantsBrandPartnerships: boolean;
  wantsInfluencerWork: boolean;
  timeline: string;
  smartGoals: string[];
}

export interface ArtistAssets {
  hasPro: boolean;
  proOrganization: string;
  hasCopyrights: boolean;
  copyrightDetails: string;
  dsps: string[];
  hasSplitSheets: boolean;
  hasContracts: boolean;
  businessEntity: string;
  hasEin: boolean;
  hasBankAccount: boolean;
  studioAccess: string;
  needsHelp: string[];
}

export interface ArtistResources {
  investmentBudget: string;
  timeCommitment: string;
  availability: string;
  teamMembers: string[];
}

export interface EngagementScore {
  overall: number;
  instagram?: { followers: number; avgLikes: number; avgComments: number; rate: number };
  tiktok?: { followers: number; avgLikes: number; avgViews: number; rate: number };
  youtube?: { subscribers: number; avgViews: number; rate: number };
  twitter?: { followers: number; engagement: number };
}

export interface ArtistProfile {
  id: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
  intakeComplete: boolean;

  // Intake phases
  contact: ContactInfo;
  background: ArtistBackground;
  goals: ArtistGoals;
  assets: ArtistAssets;
  resources: ArtistResources;

  // Enriched (scraped/imported)
  enriched: {
    spotify?: Record<string, unknown>;
    socialMedia: Record<string, unknown>;
    engagementScore?: EngagementScore;
    discography: Release[];
  };

  // Media
  files: string[];
  collaborations: string[];

  // Linked EPK
  epkSlug?: string;
  epkData?: EPKData;

  // Metadata
  intakePhase: number; // 0-5, tracks progress through wizard
}

export const EMPTY_PROFILE: ArtistProfile = {
  id: "",
  createdAt: "",
  updatedAt: "",
  intakeComplete: false,
  contact: {
    firstName: "", lastName: "", email: "", phone: "", website: "",
    managerName: "", managerContact: "", label: "", labelContact: "",
  },
  background: {
    artistName: "", stageName: "", location: "", hometown: "",
    yearsInBusiness: 0, isProfessional: false, genre: "", style: "",
    themes: [], energy: "", influences: [], bio: "",
  },
  goals: {
    primaryGoal: "", performanceFrequency: "", streamingTarget: "",
    revenueTarget: "", wantsDistribution: false, wantsSyncLicensing: false,
    wantsBrandPartnerships: false, wantsInfluencerWork: false,
    timeline: "", smartGoals: [],
  },
  assets: {
    hasPro: false, proOrganization: "", hasCopyrights: false, copyrightDetails: "",
    dsps: [], hasSplitSheets: false, hasContracts: false, businessEntity: "",
    hasEin: false, hasBankAccount: false, studioAccess: "", needsHelp: [],
  },
  resources: {
    investmentBudget: "", timeCommitment: "", availability: "", teamMembers: [],
  },
  enriched: { socialMedia: {}, discography: [] },
  files: [],
  collaborations: [],
  intakePhase: 0,
};
