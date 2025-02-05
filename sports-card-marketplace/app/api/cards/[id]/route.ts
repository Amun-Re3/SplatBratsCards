import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("sportsCards")
    const card = await db.collection("cards").findOne({ _id: new ObjectId(params.id) })

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 })
    }

    return NextResponse.json(card)
  } catch (error) {
    console.error("Error fetching card:", error)
    return NextResponse.json({ error: "Error fetching card" }, { status: 500 })
  }
}

