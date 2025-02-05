import { NextResponse } from "next/server"
import stripe from "@/lib/stripe"

export async function POST(request: Request) {
  const { amount, currency = "usd" } = await request.json()

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency,
      payment_method_types: ["card", "apple_pay", "paypal"],
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error("Error creating PaymentIntent:", error)
    return NextResponse.json({ error: "Error creating PaymentIntent" }, { status: 500 })
  }
}

