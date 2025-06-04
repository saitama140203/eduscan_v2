import { NextResponse } from "next/server"
import { headers } from "next/headers"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  const headersList = headers()
  const region = process.env.VERCEL_REGION || "unknown"

  // Check API connectivity
  let apiStatus = "unknown"
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (apiUrl) {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2000)

      const response = await fetch(`${apiUrl}/health`, {
        method: "HEAD",
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      apiStatus = response.ok ? "healthy" : "degraded"
    }
  } catch (error) {
    apiStatus = "unhealthy"
  }

  // Get memory usage
  const memoryUsage = process.memoryUsage()

  // Get uptime
  const uptime = process.uptime()

  // Build health response
  const health = {
    status: apiStatus === "healthy" ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
    region,
    uptime: `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`,
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
    },
    dependencies: {
      api: apiStatus,
    },
    request: {
      userAgent: headersList.get("user-agent"),
      ip: headersList.get("x-forwarded-for") || headersList.get("x-real-ip"),
      host: headersList.get("host"),
    },
  }

  // Return health check response
  return NextResponse.json(health, {
    status: health.status === "healthy" ? 200 : 503,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  })
}
