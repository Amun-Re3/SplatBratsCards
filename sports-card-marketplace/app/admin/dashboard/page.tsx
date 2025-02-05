"use client"

import { useState } from "react"
import Header from "../../components/Header"

export default function AdminDashboard() {
  const [cardName, setCardName] = useState("")
  const [cardPrice, setCardPrice] = useState("")
  const [cardImage, setCardImage] = useState<File | null>(null)
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("name", cardName)
    formData.append("price", cardPrice)
    if (cardImage) {
      formData.append("image", cardImage)
    }

    const response = await fetch("/api/admin/upload-card", {
      method: "POST",
      body: formData,
    })

    if (response.ok) {
      setMessage("Card uploaded successfully!")
      setCardName("")
      setCardPrice("")
      setCardImage(null)
    } else {
      setMessage("Error uploading card")
    }
  }

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="mb-4">
            <label htmlFor="cardName" className="block mb-2">
              Card Name
            </label>
            <input
              type="text"
              id="cardName"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="cardPrice" className="block mb-2">
              Card Price
            </label>
            <input
              type="number"
              id="cardPrice"
              value={cardPrice}
              onChange={(e) => setCardPrice(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="cardImage" className="block mb-2">
              Card Image
            </label>
            <input
              type="file"
              id="cardImage"
              onChange={(e) => setCardImage(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border rounded"
              accept="image/*"
              required
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Upload Card
          </button>
        </form>
        {message && <p className="mt-4 text-center">{message}</p>}
      </main>
    </div>
  )
}

