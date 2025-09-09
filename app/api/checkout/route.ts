import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-07-30.basil" });

export async function POST() {
  try {
    const successUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        // Example, ideally fetch from assignments.json
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json({ error: "Stripe error" }, { status: 500 });
  }
}
