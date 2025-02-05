import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  const { username, email, password } = await request.json()

  if (!username || !email || !password) {
    return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
  }

  try {
    const client = await clientPromise
    const db = client.db("sportsCards")
    const usersCollection = db.collection("users")

    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ success: false, message: "User already exists" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await usersCollection.insertOne({
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    })

    return NextResponse.json({ success: true, message: "User registered successfully" })
  } catch (error) {
    console.error("Error registering user:", error)
    return NextResponse.json({ success: false, message: "Error registering user" }, { status: 500 })
  }
}

