"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import type React from "react" // Added import for React

export default function ReviewForm({ cardId }: { cardId: string }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const { data: session } = useSession()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      router.push("/login")
      return
    }
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardId, rating, comment }),
    })
    if (response.ok) {
      setRating(5)
      setComment("")
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <h3 className="text-xl font-semibold mb-2">Leave a Review</h3>
      <div className="mb-2">
        <label htmlFor="rating" className="block">
          Rating:
        </label>
        <select
          id="rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full p-2 border rounded"
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <option key={value} value={value}>
              {value} Star{value !== 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-2">
        <label htmlFor="comment" className="block">
          Comment:
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
        ></textarea>
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Submit Review
      </button>
    </form>
  )
}

