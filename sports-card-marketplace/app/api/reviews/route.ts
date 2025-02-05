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

  const { cardId, rating, comment } = await request.json()
  const client = await clientPromise
  const db = client.db("sportsCards")

  try {
    await db.collection("reviews").insertOne({
      cardId: new ObjectId(cardId),
      userId: session.user.id,
      rating,
      comment,
      createdAt: new Date(),
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error adding review:", error)
    return NextResponse.json({ error: "Error adding review" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const cardId = searchParams.get("cardId")

  if (!cardId) {
    return NextResponse.json({ error: "Card ID is required" }, { status: 400 })
  }

  const client = await clientPromise
  const db = client.db("sportsCards")

  try {
    const reviews = await db
      .collection("reviews")
      .find({ cardId: new ObjectId(cardId) })
      .sort({ createdAt: -1 })
      .toArray()
    return NextResponse.json({ reviews })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Error fetching reviews" }, { status: 500 })
  }
}

