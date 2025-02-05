"use client"

import { useState, useEffect } from "react"
import Header from "../components/Header"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Card {
  _id: string
  name: string
  price: number
  imageUrl: string
  sport: string
  year: number
}

export default function Marketplace() {
  const [cards, setCards] = useState<Card[]>([])
  const [filteredCards, setFilteredCards] = useState<Card[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sportFilter, setSportFilter] = useState("")
  const [yearFilter, setYearFilter] = useState("")
  const router = useRouter()

  useEffect(() => {
    async function fetchCards() {
      const response = await fetch("/api/cards")
      const data = await response.json()
      setCards(data)
      setFilteredCards(data)
    }
    fetchCards()
  }, [])

  useEffect(() => {
    const results = cards.filter(
      (card) =>
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (sportFilter === "" || card.sport === sportFilter) &&
        (yearFilter === "" || card.year.toString() === yearFilter),
    )
    setFilteredCards(results)
  }, [searchTerm, sportFilter, yearFilter, cards])

  const sports = Array.from(new Set(cards.map((card) => card.sport)))
  const years = Array.from(new Set(cards.map((card) => card.year))).sort((a, b) => b - a)

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Sports Card Marketplace</h1>
        <div className="mb-8 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search cards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded"
          />
          <select value={sportFilter} onChange={(e) => setSportFilter(e.target.value)} className="p-2 border rounded">
            <option value="">All Sports</option>
            {sports.map((sport) => (
              <option key={sport} value={sport}>
                {sport}
              </option>
            ))}
          </select>
          <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="p-2 border rounded">
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredCards.map((card) => (
            <div key={card._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={card.imageUrl || "/placeholder.svg"} alt={card.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{card.name}</h3>
                <p className="text-gray-600">${card.price.toLocaleString()}</p>
                <Link
                  href={`/marketplace/${card._id}`}
                  className="mt-2 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

