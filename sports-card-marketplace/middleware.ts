import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const adminToken = request.cookies.get("admin_token")?.value

  if (request.nextUrl.pathname.startsWith("/admin") && request.nextUrl.pathname !== "/admin/login") {
    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/admin/:path*",
}

