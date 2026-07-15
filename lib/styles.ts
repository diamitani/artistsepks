// ── EPK Style System ──────────────────────────────────────────────────────────
// Taste-driven design archetypes applied to EPK templates.
// Based on high-end-visual-design + taste-frontend-redesign skill directives.

export type VibeArchetype = "ethereal-glass" | "editorial-luxury" | "soft-structuralism";
export type LayoutArchetype = "asymmetrical-bento" | "z-axis-cascade" | "editorial-split";

export interface EPKStyle {
  id: string;
  name: string;
  vibe: VibeArchetype;
  layout: LayoutArchetype;
  description: string;
  accent: string;
  background: string;
  cardBg: string;
  textPrimary: string;
  textMuted: string;
  fontHeading: string;
  fontBody: string;
  tier: "free" | "edit" | "style-pro" | "premium";
}

// ── Vibe definitions (mapped from taste-skill Section 3.A) ───────────────────

const VIBES: Record<VibeArchetype, Omit<EPKStyle, "id" | "name" | "layout" | "description" | "tier">> = {
  "ethereal-glass": {
    vibe: "ethereal-glass",
    accent: "#C9A227",       // Gold
    background: "#050505",    // Deepest OLED black
    cardBg: "rgba(255,255,255,0.03)",
    textPrimary: "#EDE9E0",
    textMuted: "#A0A0A0",
    fontHeading: "Bebas Neue",
    fontBody: "DM Sans",
  },
  "editorial-luxury": {
    vibe: "editorial-luxury",
    accent: "#C9A227",       // Gold on cream
    background: "#FDFBF7",    // Warm cream
    cardBg: "rgba(0,0,0,0.03)",
    textPrimary: "#1A1A1A",
    textMuted: "#666666",
    fontHeading: "Playfair Display",
    fontBody: "DM Sans",
  },
  "soft-structuralism": {
    vibe: "soft-structuralism",
    accent: "#C9A227",       // Gold
    background: "#F5F5F7",    // Silver-grey
    cardBg: "rgba(255,255,255,0.8)",
    textPrimary: "#1D1D1F",
    textMuted: "#86868B",
    fontHeading: "Bebas Neue",
    fontBody: "DM Sans",
  },
};

// ── Full style catalog ────────────────────────────────────────────────────────

export const EPK_STYLES: EPKStyle[] = [
  // FREE tier — basic styles
  {
    id: "dark-gold",
    name: "Dark Gold",
    ...VIBES["ethereal-glass"],
    layout: "editorial-split",
    description: "Bold, dramatic. Deep black with gold accents. Hero section with big typography.",
    tier: "free",
  },
  {
    id: "light-cream",
    name: "Light Cream",
    ...VIBES["editorial-luxury"],
    layout: "editorial-split",
    description: "Warm, editorial. Cream background with film grain texture. Magazine-quality layouts.",
    tier: "free",
  },

  // EDIT tier ($9.99) — more style options
  {
    id: "midnight-gold",
    name: "Midnight Gold",
    ...VIBES["ethereal-glass"],
    layout: "asymmetrical-bento",
    description: "Asymmetric bento grid. Gold accent slices through dark cards. Modern gallery feel.",
    tier: "edit",
  },
  {
    id: "editorial-cream",
    name: "Editorial Cream",
    ...VIBES["editorial-luxury"],
    layout: "asymmetrical-bento",
    description: "Masonry press layout. Variable serif headings. Museum-quality whitespace.",
    tier: "edit",
  },
  {
    id: "silver-bento",
    name: "Silver Bento",
    ...VIBES["soft-structuralism"],
    layout: "asymmetrical-bento",
    description: "Airy silver bento grid. Floating cards with ambient shadows. Clean tech aesthetic.",
    tier: "edit",
  },

  // STYLE PRO tier ($20) — cinematic layouts + motion
  {
    id: "cinematic-gold",
    name: "Cinematic Gold",
    ...VIBES["ethereal-glass"],
    layout: "z-axis-cascade",
    description: "Overlapping depth cards. Subtle rotations. Radial gold gradients. High-end agency feel.",
    tier: "style-pro",
  },
  {
    id: "luxury-cascade",
    name: "Luxury Cascade",
    ...VIBES["editorial-luxury"],
    layout: "z-axis-cascade",
    description: "Stacked editorial cards. Serif headings with gold rule lines. Physical paper aesthetic.",
    tier: "style-pro",
  },
  {
    id: "glass-split",
    name: "Glass Split",
    ...VIBES["ethereal-glass"],
    layout: "editorial-split",
    description: "Split-screen with backdrop-blur glass panels. Wide Grotesk typography. SaaS-luxury hybrid.",
    tier: "style-pro",
  },

  // PREMIUM tier ($49) — everything unlocked
  {
    id: "agency-dark",
    name: "Agency Dark",
    ...VIBES["ethereal-glass"],
    layout: "z-axis-cascade",
    description: "Full taste-skill implementation. Double-bezel cards, spring physics motion, staggered reveals, button-in-button CTAs.",
    tier: "premium",
  },
  {
    id: "agency-light",
    name: "Agency Light",
    ...VIBES["editorial-luxury"],
    layout: "asymmetrical-bento",
    description: "Full editorial luxury. Noise texture overlay. Variable serif display. Museum spatial rhythm.",
    tier: "premium",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getStyle(id: string): EPKStyle | undefined {
  return EPK_STYLES.find((s) => s.id === id);
}

export function getStylesByTier(tier: EPKStyle["tier"]): EPKStyle[] {
  return EPK_STYLES.filter((s) => s.tier === tier);
}

export function isStyleAvailable(styleId: string, userPlan: string): boolean {
  const style = getStyle(styleId);
  if (!style) return false;

  const tierRank: Record<string, number> = {
    free: 0,
    edit: 1,
    "style-pro": 2,
    premium: 3,
  };

  const userRank: Record<string, number> = {
    free: 0,
    epk_edit: 1,
    epk_style_pro: 2,
    epk_premium: 3,
  };

  return (userRank[userPlan] ?? 0) >= (tierRank[style.tier] ?? 0);
}

// ── Taste-skill CSS injection ─────────────────────────────────────────────────
// Applied to EPK templates based on selected style.

export function generateStyleCSS(style: EPKStyle): string {
  const isDark = style.background === "#050505";

  return `
:root {
  --epk-accent: ${style.accent};
  --epk-bg: ${style.background};
  --epk-card: ${style.cardBg};
  --epk-text: ${style.textPrimary};
  --epk-muted: ${style.textMuted};
  --epk-radius: ${style.tier === "premium" ? "2rem" : "1rem"};
  --epk-section-spacing: ${style.tier === "premium" ? "120px" : "80px"};
}

${style.tier === "premium" ? `
/* Double-Bezel card architecture */
.epk-card-outer {
  padding: 0.375rem;
  border-radius: 2rem;
  border: 1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"};
  background: ${isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)"};
}
.epk-card-inner {
  border-radius: calc(2rem - 0.375rem);
  background: ${style.cardBg};
  box-shadow: inset 0 1px 1px ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)"};
  padding: 2rem;
}

/* Button-in-Button CTAs */
.epk-cta-pill {
  border-radius: 9999px;
  padding: 0.75rem 1.5rem;
  background: ${style.accent};
  color: ${isDark ? "#050505" : "#FFFFFF"};
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.7s cubic-bezier(0.32,0.72,0,1);
}
.epk-cta-pill:hover {
  transform: scale(0.98);
}
.epk-cta-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background: ${isDark ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.2)"};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.7s cubic-bezier(0.32,0.72,0,1);
}
.epk-cta-pill:hover .epk-cta-icon {
  transform: translateX(4px) translateY(-1px) scale(1.05);
}

/* Staggered reveal animations */
.epk-reveal {
  opacity: 0;
  transform: translateY(16px);
  filter: blur(4px);
  animation: epkReveal 0.8s cubic-bezier(0.32,0.72,0,1) forwards;
}
@keyframes epkReveal {
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}
` : ""}

${style.layout === "asymmetrical-bento" ? `
.epk-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 1.5rem; }
.epk-grid > :nth-child(3n+1) { grid-column: span 8; }
.epk-grid > :nth-child(3n+2) { grid-column: span 4; }
.epk-grid > :nth-child(3n+3) { grid-column: span 4; }
@media (max-width: 768px) { .epk-grid > * { grid-column: span 12 !important; } }
` : ""}

${style.layout === "z-axis-cascade" ? `
.epk-cascade { position: relative; }
.epk-cascade > * { position: relative; margin-bottom: -2rem; transition: transform 0.7s cubic-bezier(0.32,0.72,0,1); }
.epk-cascade > *:nth-child(odd) { transform: rotate(-0.5deg); }
.epk-cascade > *:nth-child(even) { transform: rotate(0.5deg); }
.epk-cascade > *:hover { transform: rotate(0deg) translateY(-4px); z-index: 10; }
@media (max-width: 768px) { .epk-cascade > * { margin-bottom: 1.5rem; transform: none !important; } }
` : ""}

${style.layout === "editorial-split" ? `
.epk-split { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
@media (max-width: 768px) { .epk-split { grid-template-columns: 1fr; gap: 2rem; } }
` : ""}
`.trim();
}
