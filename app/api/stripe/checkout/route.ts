import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createCheckoutSession, isValidPlan } from "@/lib/stripe-checkout";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const plan: string = body.plan;

    if (!isValidPlan(plan)) {
      return NextResponse.json(
        { error: "Invalid plan. Use: epk_edit, epk_style_pro, epk_premium" },
        { status: 400 }
      );
    }

    // Link the purchase to the signed-in user so their plan unlocks
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Please sign in before purchasing." }, { status: 401 });
    }

    const session = await createCheckoutSession({
      plan,
      origin: req.nextUrl.origin,
      userId: user.id,
      email: user.email ?? body.email,
      successUrl: body.successUrl,
      cancelUrl: body.cancelUrl,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    console.error("Stripe checkout error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
