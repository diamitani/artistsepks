// ── Plan Definitions & Limits ─────────────────────────────────────────────────
// Free: generate one EPK, view-only after generation
// Pro $19/mo: unlimited edits, all templates, PDF export, analytics
// Manager $49/mo: 10 artists, custom domains, CRM, analytics
// Enterprise $149/mo: unlimited artists, white-label, API access

export type PlanId = "free" | "pro" | "manager" | "enterprise";

export interface PlanInfo {
  id: PlanId;
  name: string;
  priceMonthly: string;
  priceAnnual: string;
  period: string;
  epkLimit: number;
  canEdit: boolean;
  canStyle: boolean;
  styleTiers: string[];
  features: string[];
  stripeMonthlyPriceId: string;
  stripeAnnualPriceId: string;
}

export const PLANS: Record<PlanId, PlanInfo> = {
  free: {
    id: "free",
    name: "Starter Free",
    priceMonthly: "$0",
    priceAnnual: "$0",
    period: "Forever",
    epkLimit: 1,
    canEdit: false,
    canStyle: false,
    styleTiers: ["free"],
    features: [
      "AI agent builds 1 complete EPK",
      "2 essential style archetypes (Dark Gold, Light Cream)",
      "Hosted shareable link at artistsepks.com/@you",
      "Spotify & Apple Music track preview embeds",
      "View-only public profile",
    ],
    stripeMonthlyPriceId: "",
    stripeAnnualPriceId: "",
  },
  pro: {
    id: "pro",
    name: "Pro Artist",
    priceMonthly: "$19",
    priceAnnual: "$15",
    period: "per month",
    epkLimit: 3,
    canEdit: true,
    canStyle: true,
    styleTiers: ["free", "edit", "style-pro"],
    features: [
      "Everything in Starter Free",
      "Unlimited edits & real-time updates anytime",
      "All 8 premium style archetypes",
      "Vector PDF & Executive One-Sheet export",
      "High-Res 300DPI Press Asset Vault",
      "AI Bio tone switcher (Major Label, Festival, Press)",
      "Spotify, Apple, SoundCloud & YouTube embedding",
    ],
    stripeMonthlyPriceId: "price_pro_monthly", // Replace with real Stripe price ID
    stripeAnnualPriceId: "price_pro_annual",   // Replace with real Stripe price ID
  },
  manager: {
    id: "manager",
    name: "Manager & Label Suite",
    priceMonthly: "$49",
    priceAnnual: "$39",
    period: "per month",
    epkLimit: 10,
    canEdit: true,
    canStyle: true,
    styleTiers: ["free", "edit", "style-pro", "premium"],
    features: [
      "Everything in Pro Artist",
      "Up to 10 active Artist EPK profiles",
      "DocSend-style EPK viewer analytics",
      "Interactive Tech Rider & Stage Plot generator",
      "Custom domain mapping (epk.artistname.com)",
      "Password protection & private streaming links",
      "Priority AI queue & email support",
    ],
    stripeMonthlyPriceId: "price_manager_monthly", // Replace with real Stripe price ID
    stripeAnnualPriceId: "price_manager_annual",   // Replace with real Stripe price ID
  },
  enterprise: {
    id: "enterprise",
    name: "Agency & Enterprise",
    priceMonthly: "$149",
    priceAnnual: "$119",
    period: "per month",
    epkLimit: 999,
    canEdit: true,
    canStyle: true,
    styleTiers: ["free", "edit", "style-pro", "premium"],
    features: [
      "Everything in Manager Suite",
      "Unlimited artist profiles & roster seats",
      "100% white-label exports",
      "Sync Licensing Cue Sheet management",
      "Dedicated account manager",
      "Custom API integration",
      "SSO & team permissions",
    ],
    stripeMonthlyPriceId: "price_enterprise_monthly", // Replace with real Stripe price ID
    stripeAnnualPriceId: "price_enterprise_annual",   // Replace with real Stripe price ID
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
  return currentEPKCount < (PLANS[plan]?.epkLimit ?? 1);
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

