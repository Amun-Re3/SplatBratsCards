import { NextResponse } from "next/server"

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "default_admin_password"

export async function POST(request: Request) {
  const { password } = await request.json()

  if (password === ADMIN_PASSWORD) {
    const response = NextResponse.json({ success: true })
    response.cookies.set("admin_token", "true", { httpOnly: true, secure: process.env.NODE_ENV === "production" })
    return response
  } else {
    return NextResponse.json({ success: false }, { status: 401 })
  }
}

