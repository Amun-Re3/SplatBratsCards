import Header from "./components/Header"
import Link from "next/link"

export default function Home() {
  // This would typically come from a database
  const featuredCards = [
    { id: 1, name: "LeBron James Rookie Card", price: 10000, image: "/placeholder.svg?height=200&width=150" },
    { id: 2, name: "Tom Brady Autograph Card", price: 5000, image: "/placeholder.svg?height=200&width=150" },
    { id: 3, name: "Mike Trout Limited Edition", price: 7500, image: "/placeholder.svg?height=200&width=150" },
  ]

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Welcome to SplatBrats Sports Cards</h1>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Featured Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCards.map((card) => (
              <div key={card.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img src={card.image || "/placeholder.svg"} alt={card.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{card.name}</h3>
                  <p className="text-gray-600">${card.price.toLocaleString()}</p>
                  <Link
                    href={`/marketplace/${card.id}`}
                    className="mt-2 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Join the Discussion</h2>
          <p className="mb-4">
            Check out our futuristic forum to discuss trending sports cards and connect with other collectors.
          </p>
          <Link href="/forum" className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
            Visit the Forum
          </Link>
        </section>
      </main>
    </div>
  )
}

