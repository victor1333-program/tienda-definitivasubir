import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  // Aplicar middleware solo a rutas /admin (no /admin-simple)
  if (request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.startsWith("/admin-simple")) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", request.url))
    }

    if (token.role !== "ADMIN" && token.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    // '/admin-simple/:path*', // DESHABILITADO TEMPORALMENTE
  ]
}