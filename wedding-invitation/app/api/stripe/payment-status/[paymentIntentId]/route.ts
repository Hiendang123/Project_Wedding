import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.SECRET_KEY_STRIPE!, {
  apiVersion: "2025-05-28.basil",
});

export async function GET(
  request: NextRequest,
  { params }: { params: { paymentIntentId: string } }
) {
  try {
    const { paymentIntentId } = params;

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "Payment Intent ID is required" },
        { status: 400 }
      );
    }

    // 🏴‍☠️ Get payment status - GenG style!
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return NextResponse.json({
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      metadata: paymentIntent.metadata,
      created: paymentIntent.created,
      last_payment_error: paymentIntent.last_payment_error,
    });
  } catch (error: any) {
    console.error("❌ Stripe payment status check failed:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get payment status" },
      { status: 500 }
    );
  }
}
