// ── EPK Blueprint Architecture ────────────────────────────────────────────────
// Every EPK build follows this exact blueprint — structure is fixed,
// only content varies (artist data, colors, images, logos).

import type { EPKData, EPKTemplate } from "./types";

// ── Section definitions ───────────────────────────────────────────────────────

export type SectionId =
  | "hero"
  | "stats"
  | "bio"
  | "music"
  | "discography"
  | "timeline"
  | "press"
  | "collaborators"
  | "social"
  | "cta"
  | "footer"
  | "packages"
  | "valueProps"
  | "partners";

export interface BlueprintSection {
  id: SectionId;
  label: string;
  required: boolean;
  order: number;
  description: string;
  // Some sections only appear in specific templates
  includedIn: EPKTemplate[];
  // Field paths in EPKData that this section maps to
  dataFields: string[];
  // Minimum content required to consider section "filled"
  minEntries?: number;
  minTextLength?: number;
}

export const BLUEPRINT: Record<string, BlueprintSection[]> = {
  main: [
    { id: "hero", label: "Hero", required: true, order: 1, description: "Artist name, tagline, genre, hometown, hero image", includedIn: ["main", "booking", "brand"], dataFields: ["artistName", "artistTagline", "genre", "hometown", "heroImageUrl"] },
    { id: "stats", label: "Stats Bar", required: true, order: 2, description: "Spotify listeners, YouTube subs, Instagram followers, TikTok views", includedIn: ["main", "booking", "brand"], dataFields: ["stats"], minEntries: 2 },
    { id: "bio", label: "Biography", required: true, order: 3, description: "Full artist bio (AI-enhanced from raw intake)", includedIn: ["main", "booking", "brand"], dataFields: ["bio", "shortBio"], minTextLength: 100 },
    { id: "music", label: "Music Embeds", required: false, order: 4, description: "YouTube video + Spotify player embeds", includedIn: ["main", "booking", "brand"], dataFields: ["youtubeVideoId", "spotifyArtistId"] },
    { id: "discography", label: "Discography", required: true, order: 5, description: "Releases grid with covers, types, certifications", includedIn: ["main", "booking"], dataFields: ["releases"], minEntries: 1 },
    { id: "timeline", label: "Timeline", required: true, order: 6, description: "Career milestones in chronological order", includedIn: ["main", "booking"], dataFields: ["timeline"], minEntries: 2 },
    { id: "press", label: "Press Quotes", required: false, order: 7, description: "Notable press mentions and pull quotes", includedIn: ["main"], dataFields: ["pressQuotes"], minEntries: 1 },
    { id: "collaborators", label: "Collaborators", required: false, order: 8, description: "Past collaborators and featured artists", includedIn: ["main"], dataFields: ["collaborators"] },
    { id: "social", label: "Social Links", required: true, order: 9, description: "Links to all artist social media profiles", includedIn: ["main", "booking", "brand"], dataFields: ["socialLinks"], minEntries: 1 },
    { id: "cta", label: "Call to Action", required: true, order: 10, description: "Booking email/phone + inquiry button", includedIn: ["main", "booking", "brand"], dataFields: ["bookingEmail"], minTextLength: 5 },
  ],
  booking: [
    { id: "hero", label: "Hero", required: true, order: 1, description: "Artist name, genre, hero image with booking overlay", includedIn: ["main", "booking", "brand"], dataFields: ["artistName", "genre", "heroImageUrl"] },
    { id: "stats", label: "Stats Bar", required: true, order: 2, description: "Audience reach numbers for promoters", includedIn: ["main", "booking", "brand"], dataFields: ["stats"], minEntries: 2 },
    { id: "bio", label: "About", required: true, order: 3, description: "Concise bio focused on live performance history", includedIn: ["main", "booking", "brand"], dataFields: ["bio"], minTextLength: 80 },
    { id: "packages", label: "Performance Packages", required: true, order: 4, description: "Tiered booking packages with capacity, set length, features", includedIn: ["booking"], dataFields: ["performancePackages"], minEntries: 1 },
    { id: "discography", label: "Discography", required: false, order: 5, description: "Releases grid", includedIn: ["main", "booking"], dataFields: ["releases"] },
    { id: "timeline", label: "Tour History", required: true, order: 6, description: "Past tours and notable performances", includedIn: ["main", "booking"], dataFields: ["timeline"], minEntries: 1 },
    { id: "social", label: "Social Links", required: true, order: 7, description: "Social proof for promoters", includedIn: ["main", "booking", "brand"], dataFields: ["socialLinks"], minEntries: 1 },
    { id: "cta", label: "Booking CTA", required: true, order: 8, description: "Direct booking email + request button", includedIn: ["main", "booking", "brand"], dataFields: ["bookingEmail", "bookingPhone"], minTextLength: 5 },
  ],
  brand: [
    { id: "hero", label: "Brand Hero", required: true, order: 1, description: "Split layout: profile image + artist name + value prop", includedIn: ["main", "booking", "brand"], dataFields: ["artistName", "profileImageUrl", "shortBio"] },
    { id: "stats", label: "Reach Stats", required: true, order: 2, description: "Audience demographics and reach", includedIn: ["main", "booking", "brand"], dataFields: ["stats"], minEntries: 2 },
    { id: "bio", label: "Brand Story", required: true, order: 3, description: "Bio tailored for brand partnership context", includedIn: ["main", "booking", "brand"], dataFields: ["bio"], minTextLength: 80 },
    { id: "valueProps", label: "Brand Value", required: true, order: 4, description: "Value proposition cards (authentic reach, cultural alignment, proven results)", includedIn: ["brand"], dataFields: ["brandPartners"], minEntries: 1 },
    { id: "partners", label: "Past Partnerships", required: false, order: 5, description: "Previous brand collaborators", includedIn: ["brand"], dataFields: ["brandPartners"] },
    { id: "music", label: "Music", required: false, order: 6, description: "Music embeds for brand fit assessment", includedIn: ["main", "booking", "brand"], dataFields: ["youtubeVideoId", "spotifyArtistId"] },
    { id: "social", label: "Social Proof", required: true, order: 7, description: "Social media links for brand due diligence", includedIn: ["main", "booking", "brand"], dataFields: ["socialLinks"], minEntries: 1 },
    { id: "cta", label: "Collaboration CTA", required: true, order: 8, description: "Partnership inquiry email + button", includedIn: ["main", "booking", "brand"], dataFields: ["bookingEmail"], minTextLength: 5 },
  ],
};

// ── Style tokens (applied per build, can be overridden) ───────────────────────

export interface StyleTokens {
  accentColor: string;
  fontHeading: string;
  fontBody: string;
  borderRadius: string;
  sectionSpacing: string;
  maxWidth: string;
  heroMinHeight: string;
  ctaStyle: "solid" | "outline";
  statStyle: "filled" | "bordered";
}

export const DEFAULT_STYLES: Record<EPKTemplate, StyleTokens> = {
  main: {
    accentColor: "#C9A227",
    fontHeading: "Bebas Neue",
    fontBody: "DM Sans",
    borderRadius: "12px",
    sectionSpacing: "80px",
    maxWidth: "1100px",
    heroMinHeight: "560px",
    ctaStyle: "solid",
    statStyle: "filled",
  },
  booking: {
    accentColor: "#C8102E",
    fontHeading: "Bebas Neue",
    fontBody: "DM Sans",
    borderRadius: "10px",
    sectionSpacing: "60px",
    maxWidth: "1100px",
    heroMinHeight: "440px",
    ctaStyle: "solid",
    statStyle: "bordered",
  },
  brand: {
    accentColor: "#C9A227",
    fontHeading: "Bebas Neue",
    fontBody: "DM Sans",
    borderRadius: "10px",
    sectionSpacing: "80px",
    maxWidth: "1100px",
    heroMinHeight: "500px",
    ctaStyle: "outline",
    statStyle: "filled",
  },
};

// ── Blueprint utilities ───────────────────────────────────────────────────────

export function getBlueprint(template: EPKTemplate): BlueprintSection[] {
  return BLUEPRINT[template] || BLUEPRINT.main;
}

export function getStyleTokens(template: EPKTemplate, overrides?: Partial<StyleTokens>): StyleTokens {
  return { ...DEFAULT_STYLES[template] || DEFAULT_STYLES.main, ...overrides };
}

export function getRequiredFields(template: EPKTemplate): string[] {
  return getBlueprint(template)
    .filter((s) => s.required)
    .flatMap((s) => s.dataFields);
}

export function validateBlueprint(epk: EPKData, template: EPKTemplate): { valid: boolean; missing: string[] } {
  const blueprint = getBlueprint(template);
  const missing: string[] = [];

  for (const section of blueprint) {
    if (!section.required) continue;

    const populated = section.dataFields.some((field) => {
      const value = getNestedValue(epk, field);
      if (value === undefined || value === null || value === "") return false;
      if (Array.isArray(value) && value.length === 0) return false;
      if (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0) return false;
      return true;
    });

    if (!populated) {
      missing.push(section.label);
    }
  }

  return { valid: missing.length === 0, missing };
}

function getNestedValue(obj: unknown, path: string): unknown {
  return path.split(".").reduce((acc: unknown, key: string) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[key];
    return undefined;
  }, obj as Record<string, unknown>);
}

// ── Build instructions for AI agent ───────────────────────────────────────────

export const BLUEPRINT_BUILD_ORDER = `
## EPK Build Order (follow this exactly)

1. Set template type (main / booking / brand)
2. Set artist name + tagline + genre + hometown
3. Set hero image + profile image (use Pexels if none provided)
4. Set accent color (match brand or use template default)
5. Populate stats bar (scrape from Spotify/social if URLs provided)
6. Write bio + shortBio (AI-enhance from raw intake)
7. Add music embeds (YouTube + Spotify from provided IDs)
8. Build discography from releases data
9. Build timeline from career milestones
10. Add press quotes if available
11. Add social links
12. Set booking email + phone
13. Add performance packages (booking template only)
14. Add brand partners + value props (brand template only)

Each step MUST call update_epk tool. Do not skip steps.
`;
