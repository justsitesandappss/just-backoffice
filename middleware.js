import { NextResponse } from "next/server"

export function middleware(request) {
  const { pathname } = request.nextUrl

  const isAdminRoute = pathname.startsWith("/admin")
  const isLoginPage = pathname === "/admin/login"
  const session = request.cookies.get("just_admin_session")?.value
  const validSession = session === process.env.ADMIN_SESSION_TOKEN

  if (isAdminRoute && !isLoginPage && !validSession) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  if (isLoginPage && validSession) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}