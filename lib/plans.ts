// ── Plan Definitions & Limits ─────────────────────────────────────────────────
// Free: generate one EPK, view-only after generation
// $9.99 Edit: edit/update EPK, basic style options
// $20 Style Pro: full style customization, all archetypes, advanced sections
// $49 Premium: everything + custom domain, analytics, taste-skill designs

export type PlanId = "free" | "epk_edit" | "epk_style_pro" | "epk_premium";

export interface PlanInfo {
  id: PlanId;
  name: string;
  price: string;
  period: string;
  epkLimit: number;
  canEdit: boolean;
  canStyle: boolean;
  styleTiers: string[]; // which style tiers are unlocked
  features: string[];
  stripePlan: string;
}

export const PLANS: Record<PlanId, PlanInfo> = {
  free: {
    id: "free",
    name: "Free",
    price: "$0",
    period: "One EPK",
    epkLimit: 1,
    canEdit: false,
    canStyle: false,
    styleTiers: ["free"],
    features: [
      "AI agent builds one EPK",
      "2 basic styles (Dark Gold, Light Cream)",
      "Hosted page at artistsepks.com/you",
      "Shareable link",
      "View-only after generation",
    ],
    stripePlan: "",
  },
  epk_edit: {
    id: "epk_edit",
    name: "Edit Access",
    price: "$9.99",
    period: "Per EPK",
    epkLimit: 1,
    canEdit: true,
    canStyle: true,
    styleTiers: ["free", "edit"],
    features: [
      "Everything in Free",
      "Edit & update your EPK anytime",
      "5 style options (Dark, Light, Midnight, Editorial, Silver)",
      "Custom accent colors",
      "Bio rewriting",
      "PDF download",
    ],
    stripePlan: "epk_edit",
  },
  epk_style_pro: {
    id: "epk_style_pro",
    name: "Style Pro",
    price: "$20",
    period: "Per EPK",
    epkLimit: 1,
    canEdit: true,
    canStyle: true,
    styleTiers: ["free", "edit", "style-pro"],
    features: [
      "Everything in Edit Access",
      "8 premium style archetypes",
      "Cinematic layouts (Cascade, Glass Split)",
      "Spring physics animations",
      "Staggered reveal effects",
      "Spotify + YouTube embeds",
      "Performance packages section",
    ],
    stripePlan: "epk_style_pro",
  },
  epk_premium: {
    id: "epk_premium",
    name: "Premium",
    price: "$49",
    period: "Per EPK",
    epkLimit: 1,
    canEdit: true,
    canStyle: true,
    styleTiers: ["free", "edit", "style-pro", "premium"],
    features: [
      "Everything in Style Pro",
      "Full taste-skill designs (Agency Dark/Light)",
      "Double-Bezel card architecture",
      "Button-in-Button CTAs",
      "Custom domain mapping",
      "Analytics dashboard",
      "Priority support",
      "All future style updates",
    ],
    stripePlan: "epk_premium",
  },
};

export type SubscriptionRow = {
  id: string;
  user_id: string;
  plan: PlanId;
  status: string;
  customer_email: string;
  current_period_end?: string;
};

export function canCreateEPK(plan: PlanId, currentEPKCount: number): boolean {
  return currentEPKCount < 1; // Always max 1 per paid tier (per EPK purchase)
}

export function canEditEPK(plan: PlanId): boolean {
  return PLANS[plan]?.canEdit ?? false;
}

export function canStyleEPK(plan: PlanId, styleTier: string): boolean {
  const planInfo = PLANS[plan];
  if (!planInfo) return false;
  return planInfo.styleTiers.includes(styleTier);
}

export function isPlanActive(status: string): boolean {
  return status === "active" || status === "complete" || status === "trialing";
}
