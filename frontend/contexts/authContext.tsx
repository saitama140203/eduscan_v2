// contexts/authContext.tsx
"use client"

import { createContext, useState, useEffect } from "react"
import { debugLog } from "@/lib/utils/debug"
import { authApi } from "@/lib/api/auth"
import { usePathname, useRouter } from "next/navigation"

export type User = {
  id: string
  name?: string
  email: string
  role: "admin" | "manager" | "teacher"
  organizationId?: string | null
  avatarUrl?: string | null
  phone?: string | null
}

type AuthContextType = {
  user: User | null
  isLoading: boolean // Đổi tên lại thành isLoading
  login: (email: string, password: string) => Promise<any>
  logout: () => Promise<void>
}

// Đổi tên AuthContextSimple thành AuthContext
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => ({}),
  logout: async () => {},
})

// Hàm map dữ liệu từ API về dạng chuẩn FE
function mapUserFromApi(apiData: any): User | null {
  if (!apiData) return null
  let rawRole = (apiData.vaiTro || apiData.role || "").toLowerCase()
  let role: User["role"] = "teacher"
  if (rawRole === "admin" || rawRole === "administrator" || rawRole === "quản trị viên") {
    role = "admin"
  } else if (rawRole === "manager" || rawRole === "quản lý") {
    role = "manager"
  }
  return {
    id: apiData.maNguoiDung != null ? String(apiData.maNguoiDung) : (apiData.id ?? ""),
    name: apiData.hoTen ?? apiData.name ?? "",
    email: apiData.email ?? "",
    role,
    organizationId: apiData.maToChuc != null ? String(apiData.maToChuc) : (apiData.organizationId ?? null),
    avatarUrl: apiData.urlAnhDaiDien ?? apiData.avatarUrl ?? null,
    phone: apiData.soDienThoai ?? apiData.phone ?? null,
  }
}

// Hàm lưu trữ user vào localStorage
const saveUserToCache = (user: User | null) => {
  if (typeof window === 'undefined') return
  if (user) {
    localStorage.setItem('cached_user', JSON.stringify(user))
    localStorage.setItem('user_cache_time', String(Date.now()))
  } else {
    localStorage.removeItem('cached_user')
    localStorage.removeItem('user_cache_time')
  }
}

// Hàm lấy user từ cache
const getUserFromCache = (): { user: User | null, isCacheValid: boolean } => {
  if (typeof window === 'undefined') return { user: null, isCacheValid: false }

  try {
    const cachedUser = localStorage.getItem('cached_user')
    const cacheTime = localStorage.getItem('user_cache_time')

    if (!cachedUser || !cacheTime) return { user: null, isCacheValid: false }

    // Kiểm tra cache còn hạn không (15 phút)
    const isValid = Date.now() - Number(cacheTime) < 15 * 60 * 1000
    return {
      user: JSON.parse(cachedUser),
      isCacheValid: isValid
    }
  } catch (e) {
    return { user: null, isCacheValid: false }
  }
}

// Đổi tên AuthProviderSimple thành AuthProvider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true) // Sử dụng isLoading ở đây
  const pathname = usePathname()
  const router = useRouter()
  const isAuthPage = pathname === "/auth/login" || pathname === "/auth/register"

  useEffect(() => {
    debugLog(`[AuthProvider] Effect running. isAuthPage: ${isAuthPage}`);
    // Trên trang xác thực, set isLoading false ngay lập tức và kiểm tra cache
    if (isAuthPage) {
      debugLog("[AuthProvider] On auth page, setting isLoading to false.");
      setIsLoading(false)
      const { user: cachedUser } = getUserFromCache()
      if(cachedUser) {
        debugLog("[AuthProvider] Found cached user on auth page.");
        setUser(cachedUser);
      } else {
         debugLog("[AuthProvider] No cached user found on auth page.");
         setUser(null); // Đảm bảo user là null nếu không có cache
      }
      return // Dừng effect trên trang auth sau khi xử lý cache
    }

    // Trên các trang khác, kiểm tra user (có thể blocking nếu không có cache)
    debugLog("[AuthProvider] On non-auth page, checking auth status.");
    const { user: cachedUser, isCacheValid } = getUserFromCache()

    if (cachedUser && isCacheValid) {
      debugLog("[AuthProvider] Found valid cache on non-auth page, using cache and refreshing.");
      // Sử dụng cache và refresh ngầm
      setUser(cachedUser)
      setIsLoading(false) // Set false vì đã có user từ cache

      authApi.getUser() // Refresh ngầm
        .then(userData => {
          debugLog("[AuthProvider] Background getUser success.");
          const mappedUser = mapUserFromApi(userData)
          if (mappedUser) {
            setUser(mappedUser)
            saveUserToCache(mappedUser)
          }
        })
        .catch((error) => {
          console.error("[AuthProvider] Background getUser failed:", error);
          // Nếu API trả về lỗi nhưng vẫn có cache, giữ user từ cache
          // và sẽ xử lý ở lần gọi API tiếp theo hoặc khi cache hết hạn
        })
    } else {
      debugLog("[AuthProvider] No valid cache on non-auth page, fetching user.");
      // Cache không tồn tại hoặc hết hạn, phải gọi API blocking
      const checkAuth = async () => {
        try {
          const userData = await authApi.getUser() // Blocking call
          debugLog("[AuthProvider] Blocking getUser success.");
          const mappedUser = mapUserFromApi(userData)
          setUser(mappedUser)
          saveUserToCache(mappedUser)
        } catch (error) {
          console.error("[AuthProvider] Blocking getUser failed:", error);
          setUser(null)
          saveUserToCache(null)
        } finally {
          debugLog("[AuthProvider] Blocking getUser finished, setting isLoading to false.");
          setIsLoading(false) // Set false sau khi fetch blocking xong
        }
      }
      checkAuth()
    }
     debugLog(`[AuthProvider] Effect finished. Current user: ${user?.id}, isLoading: ${isLoading}`);

  }, [isAuthPage]) // Chỉ chạy khi chuyển giữa trang auth và trang khác

  const login = async (email: string, password: string) => {
    try {
      debugLog("[AuthProvider] Attempting login...");
      await authApi.login(email, password) // Đăng nhập, nhận cookie
      debugLog("[AuthProvider] Login successful, fetching user...");
      // Sau khi login thành công, gọi getUser để cập nhật state user
      const userData = await authApi.getUser()
      debugLog("[AuthProvider] getUser after login success.");
      const mappedUser = mapUserFromApi(userData)
      setUser(mappedUser)
      saveUserToCache(mappedUser)
      debugLog("[AuthProvider] User state updated after login.");
      return { success: true, role: mappedUser?.role }
    } catch (error: any) { // Catch error with explicit any type
      console.error("[AuthProvider] Login failed:", error);
      setUser(null); // Đảm bảo user là null khi login fail
      saveUserToCache(null);
      if (error instanceof TypeError && error.message.includes("fetch")) {
        return {
          success: false,
          message: "Network error: Unable to connect to the API server. Please check your connection and try again.",
          isNetworkError: true,
        }
      }
      // Log chi tiết error response nếu có
      console.error("[AuthProvider] Detailed error:", error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.detail || error.message || "Invalid credentials",
        isNetworkError: false,
      }
    }
  }

  const logout = async () => {
    try {
      debugLog("[AuthProvider] Attempting logout...")
      await authApi.logout()
      debugLog("[AuthProvider] Logout successful.")
      setUser(null)
      saveUserToCache(null)
    } catch (error) {
      console.error("[AuthProvider] Logout failed:", error)
      setUser(null) // Vẫn xóa user ở FE ngay cả khi logout API lỗi
      saveUserToCache(null)
    } finally {
       if (typeof window !== "undefined") {
        // Chuyển hướng sau khi logout thành công hoặc lỗi API
        router.replace("/auth/login"); // Sử dụng router.replace thay vì window.location.href
      }
    }
  }

  // Log thay đổi state khi development
  useEffect(() => {
      debugLog(`[AuthProvider] Context state updated: user: ${user?.id ? user.id : 'null'}, isLoading: ${isLoading}`);
  }, [user, isLoading]);


  return (
    // Sử dụng AuthContext đã đổi tên
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}