"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Chỉ thực hiện logic điều hướng khi isLoading là false (trạng thái xác thực đã được xác định)
    if (!isLoading) {
      if (!user) {
        // Nếu không có user (chưa đăng nhập), chuyển hướng đến trang login
        // Lưu lại trang hiện tại để sau khi login có thể quay lại
        if (pathname !== '/auth/login' && pathname !== '/auth/register') {
          localStorage.setItem('returnUrl', pathname)
        }
        router.push("/auth/login")
      } else {
        // Nếu đã có user (đã đăng nhập), kiểm tra xem người dùng có đang ở trang login/register không
        if (pathname === '/auth/login' || pathname === '/auth/register') {
          // Chuyển hướng đến dashboard phù hợp với vai trò của user
          const dashboardUrl = user.role === "admin" ? "/dashboard/admin" :
                               user.role === "manager" ? "/dashboard/manager" :
                               "/dashboard/teacher" // Mặc định là teacher nếu vai trò không xác định
          router.replace(dashboardUrl)
        }
      }
    }
  }, [user, isLoading, router, pathname])

  // Render một trạng thái loading nhất quán trên cả server và client
  // khi trạng thái xác thực đang được xác định.
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-t-primary animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">Đang tải...</p>
        </div>
      </div>
    )
  }

  // Nếu isLoading là false và không có user, tức là người dùng chưa đăng nhập
  // và đã được điều hướng hoặc đang chờ điều hướng. Trả về null để không render gì.
  if (!user) {
    return null
  }

  // Nếu isLoading là false và user tồn tại, hiển thị nội dung con
  return <>{children}</>
}
