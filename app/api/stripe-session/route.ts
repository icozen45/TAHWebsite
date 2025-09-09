// app/api/stripe-session/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil", // or latest stable
});

export async function POST(req: Request) {
  try {
    const { lineItems } = await req.json();

    if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
      return NextResponse.json({ error: "No line items provided" }, { status: 400 });
    }

    const successUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe session error:", err);
    return NextResponse.json({ error: "Stripe error" }, { status: 500 });
  }
}
