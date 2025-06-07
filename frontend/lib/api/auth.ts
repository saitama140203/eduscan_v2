import { apiRequest, ApiError } from "./base"

export const authApi = {
  login: async (email: string, password: string) => {
    const formData = new URLSearchParams()
    formData.append("username", email)
    formData.append("password", password)

    try {
      await apiRequest("/auth/login", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
      return true
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  },
  getUser: async () => {
    try {
      const userData = await apiRequest("/auth/me")
      return {
        id: userData.maNguoiDung?.toString(),
        email: userData.email,
        name: userData.hoTen,
        role: userData.vaiTro.toLowerCase(),
        organizationId: userData.maToChuc ? userData.maToChuc.toString() : undefined,
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        // Lỗi xác thực, trả về null
        return null
      }
      // Các lỗi khác, throw để xử lý ở cấp cao hơn
      throw error
    }
  },
  getCurrentUser: async () => {
    return authApi.getUser()
  },
  logout: async () => {
    try {
      await apiRequest("/auth/logout", { method: "POST" })
      return true
    } catch (error) {
      console.error("Logout error:", error)
      // Vẫn trả về true ngay cả khi có lỗi để cho phép logout client
      return true
    }
  },
}
