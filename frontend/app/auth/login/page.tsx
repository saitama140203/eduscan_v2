"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { LoginForm } from "@/components/auth/LoginForm"
import Link from "next/link"
import { checkApiConnectivity } from "@/lib/utils"
import { WifiOff, Loader2, CheckCircle } from "lucide-react"

export default function LoginPage() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const router = useRouter()

  // State để theo dõi xem component đã mount trên client chưa
  const [mounted, setMounted] = useState(false);

  // Kiểm tra API - state này chỉ dùng để hiển thị thông báo TRÊN form
  // Kiểm tra API - state này chỉ dùng để hiển thị thông báo, không chặn render form chính
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null)
  const [isCheckingApi, setIsCheckingApi] = useState(true)
  const [showApiSuccess, setShowApiSuccess] = useState(false) // State mới để hiển thị thông báo thành công
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

  useEffect(() => {
    setMounted(true); // Đánh dấu là đã mount trên client
    console.log("Starting API connectivity check...")
    const checkApi = async () => {
      setIsCheckingApi(true)
      setApiAvailable(null) // Reset trạng thái trước khi kiểm tra mới
      setShowApiSuccess(false) // Reset thông báo thành công
      try {
        const isAvailable = await checkApiConnectivity(apiUrl)
        setApiAvailable(isAvailable)
        console.log("API available status:", isAvailable)
        if (isAvailable) {
           // Nếu kiểm tra thành công, hiển thị thông báo thành công trong vài giây
           setShowApiSuccess(true)
           setTimeout(() => {
             setShowApiSuccess(false)
           }, 2000) // Hiển thị trong 2 giây
        }
      } catch (error) {
        setApiAvailable(false)
        console.error("API connectivity check failed:", error)
      } finally {
        setIsCheckingApi(false)
        console.log("API connectivity check finished. isCheckingApi:", false, "apiAvailable:", apiAvailable)
      }
    }
    // Chạy kiểm tra API sau một khoảng trễ nhỏ để UI không bị giật và dễ quan sát
    const timeoutId = setTimeout(checkApi, 800) // Trễ 800ms
    return () => clearTimeout(timeoutId)
  }, [apiUrl])

  // console log để theo dõi state apiAvailable và isCheckingApi
  useEffect(() => {
    console.log(`API check state updated: isCheckingApi=${isCheckingApi}, apiAvailable=${apiAvailable}, showApiSuccess=${showApiSuccess}`)
  }, [isCheckingApi, apiAvailable, showApiSuccess])


  // Redirect nếu đã đăng nhập và AuthProvider đã finish loading
  useEffect(() => {
    // Chỉ redirect khi AuthProvider không còn loading và có user
    // isAuthPage logic đã được handle trong AuthProvider useEffect
    if (mounted && !isAuthLoading && user) { // Chỉ redirect sau khi mount và auth check xong
      console.log("User detected, redirecting:", user)
      
      if (user.role === "admin") router.replace("/dashboard/admin")
      else if (user.role === "manager") router.replace("/dashboard/manager")
      else if (user.role === "teacher") router.replace("/dashboard/teacher")
      else router.replace("/dashboard")
    }
  }, [user, isAuthLoading, router, mounted])

  // Hiển thị loading/chuyển hướng toàn trang nếu đang Auth loading HOẶC đã có user SAU KHI MOUNT
  // Render loading ban đầu trên server và client cho đến khi AuthProvider kết thúc check
  if (!mounted || isAuthLoading) {
     return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-4">Đang kiểm tra trạng thái đăng nhập...</p>
      </div>
    )
  }

  // Nếu đã mount, không Auth loading và không có user, kiểm tra user để quyết định render form hay loading chuyển hướng
  if (user) {
     return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-4">Đã đăng nhập, đang chuyển hướng...</p>
      </div>
    )
  }

  // Render form và các thông báo kiểm tra API khi đã mount, không Auth loading và không có user
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          {/* Logo và tiêu đề */}
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link href="#" className="font-medium text-primary hover:text-primary/90">
              contact your administrator for access
            </Link>
          </p>
        </div>

        {/* Hiển thị trạng thái kiểm tra API (đang kiểm tra, thành công hoặc lỗi kết nối) */}
        {isCheckingApi ? (
           <div className="mt-4 flex items-center justify-center text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin mr-2" /> Đang kiểm tra kết nối API...
           </div>
        ) : showApiSuccess ? (
           <div className="mt-4 flex items-center justify-center text-sm text-green-600">
              <CheckCircle className="h-4 w-4 mr-2" /> Kết nối API thành công!
           </div>
        ) : apiAvailable === false && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded flex items-start">
            <WifiOff className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">API Server Unreachable</p>
              <p className="text-sm">Unable to connect to the API server at {apiUrl}</p>
              <div className="mt-2 text-sm">
                <p>Possible solutions:</p>
                <ul className="list-disc pl-5 mt-1">
                  <li>Check if the API server is running</li>
                  <li>Verify the API URL in your environment variables</li>
                  <li>Check for any network connectivity issues</li>
                  <li>Ensure CORS is properly configured on the server</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8">
          {/* Form đăng nhập - bị disable khi API không khả dụng */}
          <LoginForm initialApiStatus={apiAvailable === false} />
        </div>
      </div>
    </div>
  )
}
