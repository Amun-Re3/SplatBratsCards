import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { cardId } = await request.json()
  const client = await clientPromise
  const db = client.db("sportsCards")

  try {
    await db
      .collection("wishlists")
      .updateOne({ userId: session.user.id }, { $addToSet: { cards: new ObjectId(cardId) } }, { upsert: true })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    return NextResponse.json({ error: "Error adding to wishlist" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const client = await clientPromise
  const db = client.db("sportsCards")

  try {
    const wishlist = await db.collection("wishlists").findOne({ userId: session.user.id })
    if (!wishlist) {
      return NextResponse.json({ cards: [] })
    }

    const cards = await db
      .collection("cards")
      .find({ _id: { $in: wishlist.cards } })
      .toArray()
    return NextResponse.json({ cards })
  } catch (error) {
    console.error("Error fetching wishlist:", error)
    return NextResponse.json({ error: "Error fetching wishlist" }, { status: 500 })
  }
}

