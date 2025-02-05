"use client"

import { useState, type React } from "react"
import { useRouter } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { PaymentElement, Elements, useStripe, useElements } from "@stripe/react-stripe-js"

// Make sure to replace with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutForm({ clientSecret, amount }: { clientSecret: string; amount: number }) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setProcessing(true)

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    })

    if (submitError) {
      setError(submitError.message ?? "An unexpected error occurred.")
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || processing}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {processing ? "Processing..." : `Pay $${amount.toFixed(2)}`}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </form>
  )
}

export default function Checkout({ clientSecret, amount }: { clientSecret: string; amount: number }) {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm clientSecret={clientSecret} amount={amount} />
    </Elements>
  )
}

