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
