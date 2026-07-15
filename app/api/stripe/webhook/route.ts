import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");
  }
  return _stripe;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _supabaseAdmin: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSupabaseAdmin(): any {
  if (!_supabaseAdmin) {
    _supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
    );
  }
  return _supabaseAdmin;
}

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const customerEmail =
    session.customer_email ?? session.customer_details?.email;
  const customerId = session.customer as string;
  const plan = session.metadata?.plan || "epk_onetime";
  const isSubscription = plan.startsWith("pro_");

  if (!customerEmail) {
    console.warn("No email in checkout session", session.id);
    return;
  }

  const admin = getSupabaseAdmin();

  const { data: existing } = await admin
    .from("subscriptions")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  if (existing) {
    await admin
      .from("subscriptions")
      .update({
        plan,
        status: isSubscription ? "active" : "complete",
        stripe_customer_id: customerId,
        customer_email: customerEmail,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id);
  } else {
    await admin.from("subscriptions").insert({
      plan,
      status: isSubscription ? "active" : "complete",
      stripe_customer_id: customerId,
      customer_email: customerEmail,
      metadata: { session_id: session.id },
    });
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const status = subscription.status;
  const plan = subscription.metadata?.plan || "pro_monthly";

  await getSupabaseAdmin()
    .from("subscriptions")
    .update({
      status,
      plan,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_customer_id", customerId);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  await getSupabaseAdmin()
    .from("subscriptions")
    .update({
      status: "canceled",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_customer_id", customerId);
}
