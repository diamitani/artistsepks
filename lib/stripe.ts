/**
 * Shared Stripe singleton — single instantiation for all API routes.
 * Eliminates duplicate `getStripe()` across checkout, webhook, and portal.
 */
import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
      apiVersion: "2025-06-15.gallery",
      typescript: true,
    });
  }
  return _stripe;
}

export const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";

// Price IDs — configure in Stripe Dashboard, set in .env
export const PRICE_IDS: Record<string, string> = {
  epk_edit: process.env.STRIPE_PRICE_EPK_EDIT ?? "",
  epk_style_pro: process.env.STRIPE_PRICE_EPK_STYLE_PRO ?? "",
  epk_premium: process.env.STRIPE_PRICE_EPK_PREMIUM ?? "",
};

export function isValidPlan(plan: string): plan is keyof typeof PRICE_IDS {
  return plan in PRICE_IDS && !!PRICE_IDS[plan as keyof typeof PRICE_IDS];
}