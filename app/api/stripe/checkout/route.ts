import { NextRequest, NextResponse } from "next/server";
import { getStripe, PRICE_IDS, isValidPlan } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const plan: string = body.plan;
    const successUrl: string | undefined = body.successUrl;
    const cancelUrl: string | undefined = body.cancelUrl;
    const customerEmail: string | undefined = body.email;
    const userId: string | undefined = body.userId;

    if (!plan || !isValidPlan(plan)) {
      return NextResponse.json(
        { error: "Invalid plan. Use: epk_edit, epk_style_pro, epk_premium" },
        { status: 400 }
      );
    }

    const priceId = PRICE_IDS[plan as keyof typeof PRICE_IDS];

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: customerEmail || undefined,
      success_url:
        successUrl ??
        `${req.nextUrl.origin}/checkout/success?plan=${plan}`,
      cancel_url: cancelUrl ?? `${req.nextUrl.origin}/#pricing`,
      allow_promotion_codes: true,
      payment_intent_data: {
        metadata: {
          plan,
          ...(userId ? { user_id: userId } : {}),
        },
      },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    console.error("Stripe checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}