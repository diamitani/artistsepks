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
const PRICE_IDS: Record<string, string> = {
  epk_onetime: process.env.STRIPE_PRICE_EPK_ONETIME ?? "",
  pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY ?? "",
  pro_yearly: process.env.STRIPE_PRICE_PRO_YEARLY ?? "",
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
        { error: "Invalid plan. Use: epk_onetime, pro_monthly, pro_yearly" },
        { status: 400 }
      );
    }

    const isSubscription = plan.startsWith("pro_");

    const params: Record<string, unknown> = {
      mode: isSubscription ? "subscription" : "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url:
        successUrl ??
        `${req.nextUrl.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl ?? `${req.nextUrl.origin}/#pricing`,
      allow_promotion_codes: true,
    };

    if (customerEmail) {
      params.customer_email = customerEmail;
    }

    if (isSubscription) {
      params.subscription_data = { metadata: { plan } };
    } else {
      params.payment_intent_data = { metadata: { plan } };
    }

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
