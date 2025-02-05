"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/app/components/Header"
import Checkout from "@/app/components/Checkout"
import CryptoCheckout from "@/app/components/CryptoCheckout"
import { useSession } from "next-auth/react"
import ReviewForm from "@/app/components/ReviewForm"
import ConfirmPurchase from "@/app/components/ConfirmPurchase"

export default function CardDetail({ params }: { params: { id: string } }) {
  const [card, setCard] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "crypto">("stripe")
  const router = useRouter()
  const { data: session } = useSession()
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [reviews, setReviews] = useState([])
  const [showConfirmPurchase, setShowConfirmPurchase] = useState(false)

  useEffect(() => {
    async function fetchCard() {
      try {
        const response = await fetch(`/api/cards/${params.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch card")
        }
        const data = await response.json()
        setCard(data)
        setLoading(false)
      } catch (err) {
        setError("Error fetching card details")
        setLoading(false)
      }
    }

    async function checkWishlist() {
      if (session) {
        const response = await fetch("/api/wishlist")
        const data = await response.json()
        setIsInWishlist(data.cards.some((card: any) => card._id === params.id))
      }
    }
    async function fetchReviews() {
      const response = await fetch(`/api/reviews?cardId=${params.id}`)
      const data = await response.json()
      setReviews(data.reviews)
    }
    fetchCard()
    checkWishlist()
    fetchReviews()
  }, [params.id, session])

  const handleBuy = async () => {
    setShowConfirmPurchase(true)
  }

  const handleConfirmPurchase = async () => {
    if (paymentMethod === "stripe") {
      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: card.price }),
        })
        const data = await response.json()
        setClientSecret(data.clientSecret)
      } catch (err) {
        setError("Error initializing payment")
      }
    }
    setShowConfirmPurchase(false)
  }

  const handleCancelPurchase = () => {
    setShowConfirmPurchase(false)
  }

  const handleAddToWishlist = async () => {
    if (!session) {
      router.push("/login")
      return
    }
    const response = await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardId: params.id }),
    })
    if (response.ok) {
      setIsInWishlist(true)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!card) return <div>Card not found</div>

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">{card.name}</h1>
        <img src={card.imageUrl || "/placeholder.svg"} alt={card.name} className="w-full max-w-md mb-4" />
        <p className="text-xl mb-4">Price: ${card.price.toFixed(2)}</p>
        <div className="mb-4">
          <label className="mr-4">
            <input
              type="radio"
              value="stripe"
              checked={paymentMethod === "stripe"}
              onChange={() => setPaymentMethod("stripe")}
            />
            Credit Card / Apple Pay / PayPal
          </label>
          <label>
            <input
              type="radio"
              value="crypto"
              checked={paymentMethod === "crypto"}
              onChange={() => setPaymentMethod("crypto")}
            />
            Cryptocurrency
          </label>
        </div>
        {session && !isInWishlist && (
          <button
            onClick={handleAddToWishlist}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mr-4"
          >
            Add to Wishlist
          </button>
        )}
        {isInWishlist && <p className="text-green-600 mr-4">In your wishlist</p>}
        {paymentMethod === "stripe" && !clientSecret && (
          <button onClick={handleBuy} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Buy Now
          </button>
        )}
        {showConfirmPurchase && (
          <ConfirmPurchase
            cardName={card.name}
            price={card.price}
            onConfirm={handleConfirmPurchase}
            onCancel={handleCancelPurchase}
          />
        )}
        {paymentMethod === "stripe" && clientSecret && <Checkout clientSecret={clientSecret} amount={card.price} />}
        {paymentMethod === "crypto" && <CryptoCheckout amount={card.price} />}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
          {reviews.map((review: any) => (
            <div key={review._id} className="mb-4 p-4 border rounded">
              <p className="font-semibold">Rating: {review.rating} / 5</p>
              <p>{review.comment}</p>
            </div>
          ))}
          <ReviewForm cardId={params.id} />
        </div>
      </main>
    </div>
  )
}

