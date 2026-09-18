import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");
  }
  return _stripe;
}

// Price IDs — configure in Stripe Dashboard, set in .env
// All are one-time payment products (per-EPK pricing)
const PRICE_IDS: Record<string, string> = {
  epk_edit: process.env.STRIPE_PRICE_EPK_EDIT ?? "",
  epk_style_pro: process.env.STRIPE_PRICE_EPK_STYLE_PRO ?? "",
  epk_premium: process.env.STRIPE_PRICE_EPK_PREMIUM ?? "",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const plan: string = body.plan;
    const successUrl: string | undefined = body.successUrl;
    const cancelUrl: string | undefined = body.cancelUrl;
    const customerEmail: string | undefined = body.email;

    const priceId = PRICE_IDS[plan];
    if (!plan || !priceId) {
      return NextResponse.json(
        { error: "Invalid plan. Use: epk_edit, epk_style_pro, epk_premium" },
        { status: 400 }
      );
    }

    const params: Record<string, unknown> = {
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url:
        successUrl ??
        `${req.nextUrl.origin}/checkout/success?plan=${plan}`,
      cancel_url: cancelUrl ?? `${req.nextUrl.origin}/#pricing`,
      allow_promotion_codes: true,
      payment_intent_data: { metadata: { plan } },
    };

    const session = await getStripe().checkout.sessions.create(
      params as Stripe.Checkout.SessionCreateParams
    );

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    console.error("Stripe checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
