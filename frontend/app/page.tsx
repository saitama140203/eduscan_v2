"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import Link from "next/link"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  // Nếu đã đăng nhập, chuyển về dashboard đúng vai trò
  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === "admin") router.replace("/dashboard/admin")
      else if (user.role === "manager") router.replace("/dashboard/manager")
      else if (user.role === "teacher") router.replace("/dashboard/teacher")
      else router.replace("/auth/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen text-xl">Đang kiểm tra đăng nhập...</div>
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6 items-center">
        <img src="/eduscan-logo.png" alt="EduScan logo" className="h-20 mb-2" />
        <h1 className="text-3xl font-extrabold text-indigo-700 text-center">EduScan – Ứng dụng chấm điểm trắc nghiệm AI realtime</h1>
        <p className="text-gray-600 text-center">
          Nền tảng hỗ trợ tạo đề thi, upload ảnh phiếu trả lời, chấm điểm tự động, thống kê kết quả. <br />
          <b>Tiết kiệm thời gian cho giáo viên và quản lý dễ dàng.</b>
        </p>
        <div className="flex gap-4 mt-3">
          <Link href="/auth/login" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-3 font-semibold shadow-lg transition">
            Đăng nhập
          </Link>
          <a href="https://your-docs-link.com" target="_blank" rel="noopener noreferrer"
            className="border border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-700 rounded-xl px-6 py-3 font-semibold transition">
            Xem hướng dẫn
          </a>
        </div>
      </div>
      <footer className="mt-10 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} EduScan. Powered by AI.
      </footer>
    </main>
  )
}
