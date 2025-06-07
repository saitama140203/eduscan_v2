"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/useAuth"
import { ErrorMessage, determineErrorType } from "@/components/ui/error-message"
import Link from "next/link"

export interface LoginFormProps {
  initialApiStatus?: boolean
}

export function LoginForm({ initialApiStatus = false }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isNetworkError, setIsNetworkError] = useState(initialApiStatus)
  const [errorType, setErrorType] = useState<"network" | "server" | "validation" | "auth" | "cors" | "unknown">("unknown")
  const { login } = useAuth()

  useEffect(() => {
    if (initialApiStatus) {
      setIsNetworkError(true)
      setErrorType("network")
    }
  }, [initialApiStatus])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    setIsNetworkError(false)
    setErrorType("unknown")
    
    try {
      const result = await login(email, password)
      if (!result.success) {
        setError(result.message || "Đăng nhập không thành công")
        setIsNetworkError(result.isNetworkError || false)
        
        // Xác định loại lỗi cụ thể
        if (result.message?.includes("CORS")) {
          setErrorType("cors")
        } else {
          setErrorType(result.isNetworkError ? "network" : "auth")
        }
      }
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "Đã xảy ra lỗi trong quá trình đăng nhập")
      setErrorType(determineErrorType(err))
      if (err instanceof TypeError && err.message.includes("fetch")) {
        setIsNetworkError(true)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <ErrorMessage 
          message={error} 
          errorType={errorType}
          className="mb-4"
        />
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
      <div className="flex flex-col space-y-4">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
        
        {errorType === "cors" && (
          <Link href="/docs/cors-fix.md" target="_blank" className="text-center text-xs text-blue-600 hover:underline">
            Xem hướng dẫn sửa lỗi CORS
          </Link>
        )}
      </div>
    </form>
  )
}
