import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.SECRET_KEY_STRIPE!, {
  apiVersion: "2025-05-28.basil",
});

export async function POST(request: NextRequest) {
  try {
    const { paymentIntentId } = await request.json();

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "Payment Intent ID is required" },
        { status: 400 }
      );
    }

    // 🏴‍☠️ Retrieve payment intent to check status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      // 🚀 Payment successful - you can add logic here to:
      // - Update database
      // - Send confirmation email
      // - Unlock template access

      return NextResponse.json({
        success: true,
        status: paymentIntent.status,
        metadata: paymentIntent.metadata,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
      });
    }

    return NextResponse.json({
      success: false,
      status: paymentIntent.status,
      error: "Payment not completed",
    });
  } catch (error: any) {
    console.error("❌ Stripe payment confirmation failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to confirm payment" },
      { status: 500 }
    );
  }
}
