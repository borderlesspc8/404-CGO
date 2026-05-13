import { NextRequest, NextResponse } from "next/server"

const PUBLIC_PATHS = ["/"]

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value
  const { pathname } = req.nextUrl
  const isPublic = PUBLIC_PATHS.includes(pathname)

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api|manifest.json|icon|.*\\.png|.*\\.svg|sw.js).*)"],
}
