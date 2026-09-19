export type EPKTemplate = "main" | "booking" | "brand" | "one-sheet" | "media";

export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  youtube?: string;
  spotify?: string;
  appleMusic?: string;
  soundcloud?: string;
  pandora?: string;
  facebook?: string;
  suno?: string;
  bandcamp?: string;
  website?: string;
}

export interface Stats {
  spotifyListeners?: string;
  youtubeSubscribers?: string;
  youtubeViews?: string;
  tiktokViews?: string;
  tiktokFollowers?: string;
  instagramFollowers?: string;
  soundcloudFollowers?: string;
  engagementScore?: number;
  engagementGrade?: string;
  totalStreams?: string;
  monthlyGrowth?: string;
}

export interface Release {
  id?: string;
  title: string;
  type: "Album" | "EP" | "Single" | "Mixtape" | "Remix";
  year: string;
  releaseDate?: string;
  tracks?: number;
  certification?: string;
  coverUrl?: string;
  streamingUrl?: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  soundcloudUrl?: string;
  youtubeUrl?: string;
  bpm?: number;
  key?: string;
  genre?: string;
  isrc?: string;
  upc?: string;
  role?: string;
  streams?: string;
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
  date?: string;
  author?: string;
}

export interface PerformancePackage {
  name: string;
  capacity: string;
  setLength: string;
  features: string[];
  priceRange?: string;
}

export interface RiderItem {
  id: string;
  category: "audio" | "lighting" | "stage" | "hospitality" | "security" | "catering";
  name: string;
  specification: string;
  quantity?: number;
  notes?: string;
}

export interface TechnicalRider {
  channelCount?: number;
  monitorMixes?: number;
  stageDimensions?: string;
  paRequirements?: string;
  microphones?: string[];
  diBoxes?: number;
  backlineProvided?: string[];
  backlineRequired?: string[];
  items?: RiderItem[];
  notes?: string;
}

export interface PerformanceRider {
  greenRoomReqs?: string[];
  hospitalityReqs?: string[];
  cateringNotes?: string;
  hotelReqs?: string;
  groundTransportReqs?: string;
  guestPassAllotment?: number;
  securityReqs?: string[];
  items?: RiderItem[];
  notes?: string;
}

export interface ThemeAnalysis {
  sonicStyle?: string;
  thematicMotifs?: string[];
  atmosphericProfile?: string;
  vocalDelivery?: string;
  instrumentalHighlights?: string[];
  genreFusion?: string;
  brandIdentityNarrative?: string;
}

export interface BrandAsset {
  id: string;
  title: string;
  type: "photo" | "logo" | "cover" | "press-kit" | "vector" | "stem";
  url: string;
  dimensions?: string;
  dpi?: number;
  fileSize?: string;
}

export interface ServiceRate {
  id: string;
  title: string;
  category: "Live Performance" | "Feature / Verse" | "Production" | "Mixing / Mastering" | "Brand Endorsement" | "DJ Set";
  rate: string;
  unit: "per show" | "per track" | "per post" | "per hour" | "flat rate";
  description: string;
  turnaround?: string;
}

export interface EPKData {
  id?: string;
  slug?: string;
  template: EPKTemplate;
  // Artist info
  artistName: string;
  artistTagline?: string;
  genre?: string;
  additionalGenres?: string[];
  artistTypes?: string[];
  dateOfBirth?: string;
  birthCity?: string;
  currentCity?: string;
  hometown?: string;
  yearStarted?: string;
  pro?: string; // ASCAP, BMI, SESAC, etc.
  
  // Narrative & Bios
  bio: string;
  shortBio?: string;
  longBio?: string;
  influences?: string[];
  themeAnalysis?: ThemeAnalysis;
  brandStatement?: string;
  
  // Media & Assets
  heroImageUrl?: string;
  profileImageUrl?: string;
  youtubeVideoId?: string;
  spotifyArtistId?: string;
  pressPhotos?: BrandAsset[];
  mediaFiles?: BrandAsset[];
  
  // Stats & Analysis
  stats: Stats;
  engagementScore?: number;
  engagementGrade?: string;
  
  // Catalog & Shows
  releases: Release[];
  discography?: Release[];
  timeline: TimelineEvent[];
  performances?: TimelineEvent[];
  notableShows?: string[];
  
  // Press & Collaborations
  pressQuotes: PressQuote[];
  pressLinks?: { title: string; url: string; outlet: string; summary?: string }[];
  collaborators?: string[];
  brandPartners?: string[];
  
  // Riders & Booking Logistics
  technicalRider?: TechnicalRider;
  performanceRider?: PerformanceRider;
  performancePackages?: PerformancePackage[];
  services?: ServiceRate[];
  
  // Contacts & Rep
  socialLinks: SocialLinks;
  bookingEmail?: string;
  bookingPhone?: string;
  website?: string;
  managerName?: string;
  managerContact?: string;
  labelName?: string;
  labelContact?: string;
  
  // Design system tokens
  accentColor?: string;
  designTokens?: Record<string, unknown>;
  
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
  dateOfBirth?: string;
  birthCity?: string;
  currentCity?: string;
  location: string;
  hometown: string;
  yearsInBusiness: number;
  yearStarted?: string;
  isProfessional: boolean;
  genre: string;
  genreAdditional?: string[];
  artistTypes?: string[]; // Vocalist/Singer, Producer, Engineer, Emcee/Rapper, Songwriter, Instrumentalist, Comedian, etc.
  style: string;
  themes: string[];
  musicThemeStyle?: string;
  energy: string;
  influences: string[];
  artistIdentityBrand?: string;
  bio: string;
  shortBio?: string;
  longBio?: string;
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
  proOrganization: string; // ASCAP, BMI, SESAC, SOCAN, PRS
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
  technicalRiderNotes?: string;
  performanceRiderNotes?: string;
  pressLinks?: string[];
  collaborationNotes?: string;
  performanceNotes?: string;
}

export interface ArtistResources {
  investmentBudget: string;
  timeCommitment: string;
  availability: string;
  teamMembers: string[];
}

export interface EngagementScore {
  overall: number;
  grade?: string;
  instagram?: { followers: number; avgLikes: number; avgComments: number; rate: number };
  tiktok?: { followers: number; avgLikes: number; avgViews: number; rate: number };
  youtube?: { subscribers: number; avgViews: number; rate: number };
  spotify?: { monthlyListeners: number; popularity: number };
  soundcloud?: { followers: number; tracks: number };
  twitter?: { followers: number; engagement: number };
}

export interface ArtistProfile {
  id: string;
  userId?: string;
  username?: string;
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
    themeAnalysis?: ThemeAnalysis;
    pressSummaries?: { title: string; publication: string; quote: string; url?: string }[];
  };

  // Media & Vault
  files: string[];
  brandAssets?: BrandAsset[];
  collaborations: string[];
  performances?: TimelineEvent[];
  services?: ServiceRate[];

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
    artistName: "", stageName: "", dateOfBirth: "", birthCity: "", currentCity: "", location: "", hometown: "",
    yearsInBusiness: 0, yearStarted: "", isProfessional: false, genre: "", genreAdditional: [],
    artistTypes: [], style: "", themes: [], musicThemeStyle: "", energy: "", influences: [],
    artistIdentityBrand: "", bio: "", shortBio: "", longBio: "",
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
    technicalRiderNotes: "", performanceRiderNotes: "", pressLinks: [], collaborationNotes: "", performanceNotes: "",
  },
  resources: {
    investmentBudget: "", timeCommitment: "", availability: "", teamMembers: [],
  },
  enriched: { socialMedia: {}, discography: [] },
  files: [],
  brandAssets: [],
  collaborations: [],
  performances: [],
  services: [],
  intakePhase: 0,
};

// ═══════════════════════════════════════════════════════════════════════════════
// PLATFORM ECOSYSTEM TYPES (Directory, CRM, Inbox, Knowledge)
// ═══════════════════════════════════════════════════════════════════════════════

export interface DirectoryListing {
  id: string;
  category: "venues" | "brands" | "radio" | "blogs" | "playlists" | "artists";
  name: string;
  subtitle: string;
  location: string;
  genreFocus: string[];
  contactEmail?: string;
  website?: string;
  capacityOrReach?: string;
  verified: boolean;
  avatarUrl?: string;
  description: string;
  submissionGuidelines?: string;
  acceptingSubmissions: boolean;
}

export interface CampaignSubmission {
  id: string;
  title: string;
  targetName: string;
  targetCategory: "Venue" | "Brand" | "Label" | "Blog" | "Radio" | "Playlist";
  contactEmail: string;
  status: "Draft" | "Sent" | "Opened" | "In Review" | "Booked" | "Declined";
  epkSlug: string;
  sentAt?: string;
  updatedAt: string;
  notes?: string;
  pitchSubject: string;
  pitchBody: string;
}

export interface InboxMessage {
  id: string;
  senderName: string;
  senderRole: string;
  senderAvatar?: string;
  subject: string;
  preview: string;
  content: string;
  date: string;
  unread: boolean;
  category: "booking" | "brand" | "collab" | "press" | "general";
  replyCount?: number;
}

export interface KnowledgeFile {
  id: string;
  name: string;
  type: "lyrics" | "press-release" | "liner-notes" | "interview" | "bio-draft" | "tech-spec" | "other";
  size: string;
  uploadedAt: string;
  content?: string;
  summary?: string;
}
