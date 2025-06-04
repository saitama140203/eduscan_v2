"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth"
import { AlertCircle, WifiOff } from "lucide-react"

export interface LoginFormProps {
  initialApiStatus?: boolean
}

export function LoginForm({ initialApiStatus = false }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isNetworkError, setIsNetworkError] = useState(initialApiStatus)
  const { login } = useAuth()

  useEffect(() => {
    setIsNetworkError(initialApiStatus)
  }, [initialApiStatus])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    setIsNetworkError(false)
    try {
      const result = await login(email, password)
      if (!result.success) {
        setError(result.message || "Login failed")
        setIsNetworkError(result.isNetworkError || false)
      }
    } catch (err) {
      setError("An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(error || isNetworkError) && (
        <div className={`border px-4 py-3 rounded flex items-start ${isNetworkError ? "bg-yellow-50 border-yellow-200 text-yellow-700" : "bg-red-50 border-red-200 text-red-700"}`}>
          {isNetworkError ? (
            <WifiOff className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          )}
          <div>
            <p className="font-medium">{isNetworkError ? "Connection Error" : "Authentication Error"}</p>
            <p className="text-sm">{error || "API server appears to be offline or unreachable"}</p>
          </div>
        </div>
      )}
      <Input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        disabled={isLoading}
      />
      <Input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        disabled={isLoading}
      />
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
      </Button>
    </form>
  )
}
