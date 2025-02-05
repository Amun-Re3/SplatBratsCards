import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const client = await clientPromise
  const db = client.db("sportsCards")

  try {
    const notifications = await db
      .collection("notifications")
      .find({ userId: session.user.id, read: false })
      .sort({ createdAt: -1 })
      .toArray()
    return NextResponse.json({ notifications })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ error: "Error fetching notifications" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { message, userId } = await request.json()
  const client = await clientPromise
  const db = client.db("sportsCards")

  try {
    await db.collection("notifications").insertOne({
      userId,
      message,
      read: false,
      createdAt: new Date(),
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating notification:", error)
    return NextResponse.json({ error: "Error creating notification" }, { status: 500 })
  }
}

