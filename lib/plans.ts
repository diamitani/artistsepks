// ── Plan Definitions & Limits ─────────────────────────────────────────────────

export type PlanId = "free" | "epk_onetime" | "pro_monthly" | "pro_yearly";

export interface PlanInfo {
  id: PlanId;
  name: string;
  price: string;
  period: string;
  epkLimit: number;
  features: string[];
}

export const PLANS: Record<PlanId, PlanInfo> = {
  free: {
    id: "free",
    name: "Free",
    price: "$0",
    period: "Forever",
    epkLimit: 0, // Can't publish full EPK, only profile
    features: [
      "Hosted artist profile page",
      "AI-generated bio (1 generation)",
      "1 profile photo",
      "Social stats display",
      "Contact info",
    ],
  },
  epk_onetime: {
    id: "epk_onetime",
    name: "EPK",
    price: "$99",
    period: "One-time",
    epkLimit: 1,
    features: [
      "Full Main, Booking, or Brand EPK",
      "All sections unlocked",
      "Spotify & YouTube embeds",
      "High-res PDF export",
      "12 months free updates",
    ],
  },
  pro_monthly: {
    id: "pro_monthly",
    name: "Pro",
    price: "$19",
    period: "/mo",
    epkLimit: 999, // unlimited
    features: [
      "Unlimited EPKs (all 3 types)",
      "Unlimited updates forever",
      "AI bio regeneration",
      "Analytics dashboard",
      "Roster management",
      "Priority support",
    ],
  },
  pro_yearly: {
    id: "pro_yearly",
    name: "Pro Annual",
    price: "$190",
    period: "/yr",
    epkLimit: 999, // unlimited
    features: [
      "Unlimited EPKs (all 3 types)",
      "Unlimited updates forever",
      "AI bio regeneration",
      "Analytics dashboard",
      "Roster management",
      "Priority support",
      "Save $38 vs monthly",
    ],
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
  const limit = PLANS[plan]?.epkLimit ?? 0;
  return currentEPKCount < limit;
}

export function canRegenerateBio(plan: PlanId): boolean {
  return plan === "pro_monthly" || plan === "pro_yearly";
}

export function isPlanActive(status: string): boolean {
  return status === "active" || status === "complete" || status === "trialing";
}
