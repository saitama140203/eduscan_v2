import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
// import { jwtVerify } from "jose" - sẽ không sử dụng

// JWT_SECRET không cần thiết cho giải pháp tạm thời
// const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

// Protected routes configuration
const protectedRoutes = ["/dashboard"]
const authRoutes = ["/auth/login", "/auth/register"]
const roleBasedRoutes = {
  admin: ["/dashboard/admin"],
  manager: ["/dashboard/manager"],
  teacher: ["/dashboard/teacher"],
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("access_token")?.value

  // Add security headers
  const response = NextResponse.next()
  response.headers.set("X-DNS-Prefetch-Control", "on")
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "origin-when-cross-origin")

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && token) {
    // Giải pháp tạm thời: Bỏ qua xác minh token, chỉ kiểm tra xem token có tồn tại hay không
    // Chuyển hướng đến dashboard admin mặc định
    return NextResponse.redirect(new URL("/dashboard/admin", request.url))
  }

  // Handle protected routes
  if (isProtectedRoute) {
    if (!token) {
      const loginUrl = new URL("/auth/login", request.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Giải pháp tạm thời: Không xác minh token, chỉ kiểm tra xem token có tồn tại hay không
    // Nếu token tồn tại, cho phép truy cập tất cả các route được bảo vệ
    // Bỏ qua kiểm tra vai trò
    
    return response
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
