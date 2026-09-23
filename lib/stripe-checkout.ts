import Stripe from "stripe";

// Shared by POST /api/stripe/checkout (JSON) and GET /checkout (redirect from
// the pricing page). The Supabase user id is stored as client_reference_id so
// the webhook can attach the purchase to the right account — without it the
// plan check in /api/epk and /api/user/plan (which filter on user_id) never
// sees the purchase.

let _stripe: Stripe | null = null;
export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");
  }
  return _stripe;
}

// All are one-time payment products (per-EPK pricing)
const PRICE_IDS: Record<string, string | undefined> = {
  epk_edit: process.env.STRIPE_PRICE_EPK_EDIT,
  epk_style_pro: process.env.STRIPE_PRICE_EPK_STYLE_PRO,
  epk_premium: process.env.STRIPE_PRICE_EPK_PREMIUM,
};

export function isValidPlan(plan: string | null | undefined): plan is string {
  return !!plan && !!PRICE_IDS[plan];
}

// Only allow redirect URLs back to our own site
function sameOrigin(url: string | undefined, origin: string): string | undefined {
  if (!url) return undefined;
  try {
    return new URL(url, origin).origin === origin ? new URL(url, origin).toString() : undefined;
  } catch {
    return undefined;
  }
}

export async function createCheckoutSession(opts: {
  plan: string;
  origin: string;
  userId?: string;
  email?: string;
  successUrl?: string;
  cancelUrl?: string;
}): Promise<Stripe.Checkout.Session> {
  const { plan, origin, userId, email } = opts;

  return getStripe().checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: PRICE_IDS[plan]!, quantity: 1 }],
    success_url: sameOrigin(opts.successUrl, origin) ?? `${origin}/checkout/success?plan=${plan}`,
    cancel_url: sameOrigin(opts.cancelUrl, origin) ?? `${origin}/pricing`,
    allow_promotion_codes: true,
    // Payment mode doesn't create a Stripe customer by default — the webhook
    // and billing portal both need one.
    customer_creation: "always",
    customer_email: email,
    client_reference_id: userId,
    // Session metadata is what the webhook reads; payment_intent metadata is
    // kept for reporting in the Stripe dashboard.
    metadata: { plan, ...(userId ? { user_id: userId } : {}) },
    payment_intent_data: { metadata: { plan } },
  });
}
