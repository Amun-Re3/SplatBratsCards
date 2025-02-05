import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"

export async function POST(request: Request) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
  }

  try {
    const client = await clientPromise
    const db = client.db("sportsCards")
    const usersCollection = db.collection("users")

    const user = await usersCollection.findOne({ email })
    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 })
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1d" })

    const response = NextResponse.json({ success: true, message: "Login successful" })
    response.cookies.set("auth_token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" })

    return response
  } catch (error) {
    console.error("Error logging in:", error)
    return NextResponse.json({ success: false, message: "Error logging in" }, { status: 500 })
  }
}

