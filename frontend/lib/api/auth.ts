import { apiRequest } from "./base"

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
    } catch {
      return null
    }
  },
  getCurrentUser: async () => {
    return authApi.getUser()
  },
  logout: async () => {
    await apiRequest("/auth/logout", { method: "POST" })
  },
  refresh: async () => {
    const data = await apiRequest(
      "/auth/refresh",
      { method: "POST" },
      { skipAuth: true }
    )
    return data
  },
}
